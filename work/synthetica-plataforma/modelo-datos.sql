-- ============================================================================
-- Synthetica · plataforma en línea · modelo de datos (PostgreSQL 15+)
--
-- Una sola base conecta todo: quién está en cada proyecto, qué hizo el motor
-- en cada etapa, qué validó cada persona y cómo se usa el producto publicado.
-- La maqueta (index.html) usa exactamente estas entidades en memoria.
-- ============================================================================

-- ---------------------------------------------------------------- Personas
create table organizacion (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  creada_en     timestamptz not null default now()
);

create table persona (
  id               uuid primary key default gen_random_uuid(),
  organizacion_id  uuid references organizacion(id),
  nombre           text not null,
  correo           text not null unique,
  cargo            text,
  es_synthetica    boolean not null default false,  -- equipo interno: ve la vista interna
  invitacion       text not null default 'aceptada' check (invitacion in ('pendiente','aceptada')),
  creada_en        timestamptz not null default now()
);

-- ---------------------------------------------------------------- Contrato
-- Se contrata por mes, después de una reunión agendada con mercadeo.
create table solicitud_mercadeo (
  id               uuid primary key default gen_random_uuid(),
  organizacion_id  uuid not null references organizacion(id),
  persona_id       uuid not null references persona(id),
  texto            text,
  estado           text not null default 'nueva' check (estado in ('nueva','agendada','contratada','descartada')),
  reunion_en       timestamptz,
  creada_en        timestamptz not null default now()
);

create table contrato (
  id               uuid primary key default gen_random_uuid(),
  organizacion_id  uuid not null references organizacion(id),
  solicitud_id     uuid references solicitud_mercadeo(id),
  plan             text not null default 'mensual',
  desde            date not null,
  hasta            date not null,        -- se renueva por mes
  check (hasta > desde)
);

-- ---------------------------------------------------------------- Producto y proyecto
-- Un producto puede tener varios proyectos en el tiempo:
-- estudio sintético -> proyecto completo -> seguimiento.
create table producto (
  id               uuid primary key default gen_random_uuid(),
  organizacion_id  uuid not null references organizacion(id),
  nombre           text not null,
  url              text
);

create type tipo_proyecto as enum ('sintetico','completo','seguimiento');

create table proyecto (
  id             uuid primary key default gen_random_uuid(),
  producto_id    uuid not null references producto(id),
  contrato_id    uuid not null references contrato(id),   -- vigente al crear el proyecto
  deriva_de      uuid references proyecto(id),        -- de qué proyecto viene
  tipo           tipo_proyecto not null,
  nombre         text not null,
  descripcion    text,                                  -- opcional: una frase o 50–100 palabras
  entradas       jsonb not null default '{}',           -- objetivo, intención, flujo actual, código, enlaces, competencia
  url            text,                                  -- obligatoria en sintético y seguimiento
  estado         text not null default 'activo' check (estado in ('activo','pausado','terminado','cancelado')),
  creado_por     uuid not null references persona(id),
  creado_en      timestamptz not null default now(),
  check (tipo = 'completo' or url is not null)
);

create type rol_proyecto as enum ('responsable','evaluacion','miembro','observador','synthetica');

-- Las personas se definen al crear el proyecto; el rol dice qué pueden hacer.
create table miembro (
  proyecto_id   uuid not null references proyecto(id) on delete cascade,
  persona_id    uuid not null references persona(id),
  rol           rol_proyecto not null,
  agregado_por  uuid references persona(id),
  agregado_en   timestamptz not null default now(),
  primary key (proyecto_id, persona_id)
);
-- Regla (en la aplicación y con un trigger): todo proyecto activo tiene al menos un responsable.

-- ---------------------------------------------------------------- Fuentes
-- Lo que el usuario sube, pega o enlaza. El original se guarda tal cual en el
-- almacenamiento de objetos; aquí va el índice.
create table fuente (
  id            uuid primary key default gen_random_uuid(),
  proyecto_id   uuid not null references proyecto(id) on delete cascade,
  clase         text not null check (clase in ('archivo','zip','texto','enlace')),
  nombre        text,
  objeto        text,              -- ruta en el almacenamiento (s3://…)
  sha256        text,
  bytes         bigint,
  subida_por    uuid not null references persona(id),
  subida_en     timestamptz not null default now()
);

-- Acceso a la plataforma actual del cliente. La contraseña nunca va en el zip ni en
-- `fuente`: se guarda cifrada (KMS o pgcrypto con clave fuera de la base) y solo la
-- descifra el analista que ejecuta el proyecto. Cada lectura queda registrada.
create table credencial (
  id               uuid primary key default gen_random_uuid(),
  proyecto_id      uuid not null references proyecto(id) on delete cascade,
  url              text not null,
  usuario          text,
  secreto_cifrado  bytea not null,
  creada_por       uuid not null references persona(id),
  creada_en        timestamptz not null default now(),
  borrar_en        timestamptz            -- se elimina al cerrar el proyecto
);
create table credencial_lectura (
  credencial_id    uuid not null references credencial(id) on delete cascade,
  persona_id       uuid not null references persona(id),   -- solo personas es_synthetica
  motivo           text not null,
  leida_en         timestamptz not null default now()
);

-- Resultado de clasificar cada documento (lo que sale de un zip también llega aquí).
create table documento (
  id            uuid primary key default gen_random_uuid(),
  fuente_id     uuid not null references fuente(id) on delete cascade,
  ruta          text not null,     -- ruta dentro del zip, si viene de uno
  carpeta       text not null check (carpeta in ('contexto','negocio','producto','objetivo','poblacion','investigacion','metricas','marca','competencia','otro')),
  ignorado      boolean not null default false,   -- no es texto (imagen, video…): no se lee
  pii_redactada boolean not null default false,
  sha256        text not null
);

-- ---------------------------------------------------------------- Etapas
-- Catálogo: qué etapas tiene cada tipo y cuánto tardan en promedio.
create table etapa_catalogo (
  tipo          tipo_proyecto not null,
  n             numeric(4,1) not null,   -- las cajas del motor: 1, 2, 3, 3.1, 4, 4.1, 5 … 11 (numeración del 2026-10-08)
  nombre        text not null,
  modo          text not null check (modo in ('auto','diseno','humana','vivo')),
  minutos_base  integer,           -- valor inicial; null = depende de personas
  primary key (tipo, n)
);

-- 'analista': el proyecto llegó y espera que un analista lance la caja 1 desde la consola.
-- 'detenida': la persona la pausó; al reanudar sigue con el tiempo que le faltaba.
create type estado_etapa as enum ('cola','analista','pensando','detenida','revision','humana','hecha','vivo','fallida');

create table etapa (
  id            uuid primary key default gen_random_uuid(),
  proyecto_id   uuid not null references proyecto(id) on delete cascade,
  n             numeric(4,1) not null,   -- igual que en el catálogo
  estado        estado_etapa not null default 'cola',
  inicio        timestamptz,
  fin_estimado  timestamptz,        -- inicio + promedio vigente al empezar
  fin           timestamptz,        -- cuando el motor la dejó lista para revisar
  aprobada_por  uuid references persona(id),
  aprobada_en   timestamptz,
  logros        jsonb not null default '[]',   -- «Qué logramos», en lenguaje del cliente
  unique (proyecto_id, n)
);

-- Tiempo promedio real por etapa: sustituye a minutos_base cuando hay datos.
create view etapa_duracion as
  select p.tipo, e.n,
         count(*)                                                   as muestras,
         percentile_cont(0.5) within group (order by extract(epoch from e.fin - e.inicio) / 60) as mediana_min
  from etapa e join proyecto p on p.id = e.proyecto_id
  where e.fin is not null and e.inicio is not null
  group by p.tipo, e.n;

-- Vueltas de una caja: la persona opina, pide otra vuelta y la caja se rehace, cada vez
-- más corta (la mitad de la anterior), hasta que el responsable marca «No tengo más dudas».
create table ronda (
  id                  uuid primary key default gen_random_uuid(),
  etapa_id            uuid not null references etapa(id) on delete cascade,
  n                   smallint not null,
  inicio              timestamptz not null,
  fin                 timestamptz,
  minutos_estimados   integer not null,
  lanzada_por         uuid references persona(id),   -- el analista, cuando se lanza a mano
  respuesta_equipo    text,                          -- respuesta a las dudas de la vuelta
  sin_dudas_por       uuid references persona(id),
  sin_dudas_en        timestamptz,
  unique (etapa_id, n)
);

-- Opinión de cada persona en cada vuelta: ¿te gusta?, ¿cumple?, las preguntas de la caja
-- (menú, contenido, colores, lo que falta…) y sus dudas.
create table opinion (
  ronda_id      uuid not null references ronda(id) on delete cascade,
  persona_id    uuid not null references persona(id),
  gusta         boolean,
  cumple        text check (cumple in ('si','parcial','no')),
  respuestas    jsonb not null default '{}',   -- { pregunta: { v: si|parcial|no, c: comentario } }
  dudas         text,
  guardada_en   timestamptz not null default now(),
  primary key (ronda_id, persona_id)
);

-- Pausas de una etapa (detener / reanudar). Cada una avisa al equipo.
create table pausa (
  id              uuid primary key default gen_random_uuid(),
  etapa_id        uuid not null references etapa(id) on delete cascade,
  estado_previo   estado_etapa not null,
  avance          numeric(5,2) not null,        -- % al detenerse
  minutos_restantes integer not null,
  detenida_por    uuid not null references persona(id),
  detenida_en     timestamptz not null default now(),
  reanudada_en    timestamptz
);

-- Cancelaciones con su porqué. Un proyecto cancelado conserva lo hecho y se puede reabrir.
create table cancelacion (
  id            uuid primary key default gen_random_uuid(),
  proyecto_id   uuid not null references proyecto(id) on delete cascade,
  motivo        text not null check (motivo in ('no_necesito','datos','cambio','tiempo','costo','otro')),
  detalle       text,                          -- obligatorio si motivo = 'otro'
  cancelado_por uuid not null references persona(id),
  cancelado_en  timestamptz not null default now(),
  reabierto_en  timestamptz,
  check (motivo <> 'otro' or coalesce(length(trim(detalle)), 0) > 0)
);

-- Una corrida del motor ligada a una etapa (agentes, informe completo o ligero).
create table corrida (
  id            uuid primary key default gen_random_uuid(),
  etapa_id      uuid not null references etapa(id) on delete cascade,
  motor         text not null check (motor in ('ligero','completo')), -- ligero: 3–5 agentes, sin KLM ni grabación
  agentes       smallint,
  semilla       bigint,
  carpeta       text,              -- salida del motor (_agentes_sinteticos/salidas/…)
  resumen       text,              -- lo que ve el cliente
  tareas_ok     smallint,
  tareas_total  smallint,
  empezo        timestamptz,
  termino       timestamptz
);

create table prototipo (
  id            uuid primary key default gen_random_uuid(),
  etapa_id      uuid not null references etapa(id) on delete cascade,
  version       text not null,     -- prototipo-v0.6.html
  objeto        text not null,     -- dónde se sirve para «Prueba la interfaz»
  creado_en     timestamptz not null default now()
);

-- ---------------------------------------------------------------- Ajustes y validación humana
create type estado_ajuste as enum ('pendiente','aceptado','rechazado','backlog');

create table ajuste (
  id            uuid primary key default gen_random_uuid(),
  etapa_id      uuid not null references etapa(id) on delete cascade,
  grupo         text not null check (grupo in ('usabilidad','accesibilidad','ergonomia','contenido','arquitectura','flujo','diseno','conducta')),
  control       text not null,     -- nombre en pantalla: «Botón “Enviar solicitud”»
  vimos         text not null,     -- qué se esperaba y qué respondió la interfaz
  propuesta     text not null,
  validador_id  uuid references persona(id),   -- a quién le toca (asignado al crear)
  estado        estado_ajuste not null default 'pendiente',
  -- Solo vista interna: nunca se envían al cliente.
  severidad     smallint check (severidad between 1 and 4),
  arreglabilidad text check (arreglabilidad in ('alta','media','baja')),
  frecuencia    text,              -- «3/3 agentes»
  corrida_id    uuid references corrida(id),
  hallazgo_ref  text               -- id del hallazgo en backlog-ux.json del motor
);

-- Cada decisión queda con nombre, fecha y comentario. Se guarda el historial,
-- no solo el último estado: deshacer también es una fila.
create table decision (
  id            uuid primary key default gen_random_uuid(),
  ajuste_id     uuid not null references ajuste(id) on delete cascade,
  persona_id    uuid not null references persona(id),
  estado        estado_ajuste not null,
  comentario    text,
  decidida_en   timestamptz not null default now()
);

-- ---------------------------------------------------------------- Diseño (caja 4)
create table variante (
  id            uuid primary key default gen_random_uuid(),
  etapa_id      uuid not null references etapa(id) on delete cascade,
  letra         char(1) not null,
  nombre        text not null,
  imagenes      jsonb not null default '[]',  -- objetos en alta definición por vista
  votos_agentes smallint not null default 0,
  razon         text,
  unique (etapa_id, letra)
);

create table eleccion (
  etapa_id      uuid not null references etapa(id) on delete cascade,
  persona_id    uuid not null references persona(id),
  variante_id   uuid not null references variante(id),
  final         boolean not null default false,  -- solo el responsable fija la final
  comentario    text,
  elegida_en    timestamptz not null default now(),
  primary key (etapa_id, persona_id)
);

-- ---------------------------------------------------------------- Notas
create table nota (
  id                  uuid primary key default gen_random_uuid(),
  etapa_id            uuid not null references etapa(id) on delete cascade,
  autor_id            uuid not null references persona(id),
  texto               text not null,
  requiere_humana     boolean not null default false,  -- «esto hay que evaluarlo con personas»
  atendida_en_etapa   smallint,                         -- dónde se resolvió, si se resolvió
  creada_en           timestamptz not null default now()
);

-- ---------------------------------------------------------------- Seguimiento
create table etiqueta (
  id            text primary key,  -- SYN-7F3K
  proyecto_id   uuid not null references proyecto(id) on delete cascade,
  dominio       text not null,
  instalada_en  timestamptz,       -- primera visita recibida
  activa        boolean not null default true
);

-- Evento crudo de la etiqueta. Sin PII: sesión anónima rotativa, sin texto escrito.
create table evento (
  id            bigint generated always as identity primary key,
  etiqueta_id   text not null references etiqueta(id),
  sesion        text not null,
  tipo          text not null check (tipo in ('vista','clic','salida','tarea_ok','tarea_fallida','encuesta')),
  ruta          text not null,
  destino       text,              -- en clics: a dónde lleva el enlace
  texto_enlace  text,              -- texto visible del enlace, no lo que la persona escribe
  ocurrio_en    timestamptz not null default now()
) partition by range (ocurrio_en);

create table encuesta (
  id            uuid primary key default gen_random_uuid(),
  proyecto_id   uuid not null references proyecto(id) on delete cascade,
  instrumento   text not null check (instrumento in ('CSAT','SUS','NASA-TLX','NPS')),
  activa        boolean not null default false,
  disparador    text not null,     -- «al terminar el pago», «tras un pago fallido»
  muestra       numeric(4,3) not null default 0.1,  -- fracción de visitas que la ven
  activada_por  uuid references persona(id),
  activada_en   timestamptz
);

create table respuesta (
  id            bigint generated always as identity primary key,
  encuesta_id   uuid not null references encuesta(id) on delete cascade,
  sesion        text not null,
  valores       jsonb not null,    -- ítems crudos; el puntaje se calcula en la vista
  version_id    uuid,
  respondida_en timestamptz not null default now()
);

-- Qué versión del producto estaba publicada: permite comparar antes y después
-- y ligar cada cambio con los ajustes aceptados que lo produjeron.
create table version_publicada (
  id            uuid primary key default gen_random_uuid(),
  proyecto_id   uuid not null references proyecto(id) on delete cascade,
  nombre        text not null,
  desde         timestamptz not null,
  ajustes       uuid[] not null default '{}'   -- ajustes aceptados que entraron
);

-- ---------------------------------------------------------------- Cola de trabajos
-- Lo que necesita al motor (lanzar, volver a ejecutar, reanudar) es una fila aquí.
-- Los trabajadores la reclaman con SELECT … FOR UPDATE SKIP LOCKED y envían latidos;
-- Vercel Cron reintenta o da por fallidos los que se quedan sin latido.
create table trabajo (
  id              uuid primary key default gen_random_uuid(),
  proyecto_id     uuid not null references proyecto(id) on delete cascade,
  etapa_id        uuid references etapa(id),
  clase           text not null check (clase in ('estudio','reejecucion','completar','reporte_pdf')),
  parametros      jsonb not null default '{}',   -- agentes, desde_inicio, fuentes nuevas…
  estado          text not null default 'pendiente'
                  check (estado in ('pendiente','tomado','corriendo','detener_pedido','detenido','hecho','fallido','cancelado')),
  trabajador      text,                           -- quién lo tomó (equipo del analista o contenedor)
  intentos        smallint not null default 0,
  ultimo_latido   timestamptz,
  avance          numeric(5,2),
  mensaje         text,                           -- último paso, para el progreso en vivo
  creado_en       timestamptz not null default now(),
  empezo_en       timestamptz,
  termino_en      timestamptz
);
create index on trabajo (estado, creado_en) where estado in ('pendiente','detener_pedido');

-- ---------------------------------------------------------------- Actividad y avisos
-- Todo cambio escribe aquí; de aquí salen el panel «Actividad», las
-- notificaciones y el reporte de rondas para gerencia.
create table actividad (
  id            bigint generated always as identity primary key,
  proyecto_id   uuid not null references proyecto(id) on delete cascade,
  persona_id    uuid references persona(id),   -- null = el motor
  accion        text not null,     -- etapa_empezo, etapa_lista, ajuste_decidido, nota, eleccion, etapa_aprobada…
  objeto_id     uuid,
  detalle       jsonb,
  ocurrio_en    timestamptz not null default now()
);

create table aviso (
  id            bigint generated always as identity primary key,
  persona_id    uuid not null references persona(id),
  actividad_id  bigint not null references actividad(id),
  canal         text not null check (canal in ('app','correo')),
  leido_en      timestamptz
);

-- Las etapas no se saltan: una etapa solo sale de 'cola' si la anterior está 'hecha'
-- (trigger en etapa antes de actualizar estado).

create index on etapa (proyecto_id, estado);
create index on ajuste (validador_id, estado);
create index on actividad (proyecto_id, ocurrio_en desc);
create index on evento (etiqueta_id, ocurrio_en);
