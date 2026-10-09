# Synthetica en Vercel · arquitectura para producción

Cómo pasar de la maqueta local a una plataforma que cualquier persona use desde cualquier
parte del mundo, y que aguante crecer sin rehacerla. Acompaña a `PLATAFORMA.md` (qué hace
el producto) y a `modelo-datos.sql` (el esquema).

---

## 1. La idea en una página

**Vercel sirve la aplicación y orquesta, pero no ejecuta los estudios.**

Un estudio sintético abre navegadores con Playwright, simula agentes durante minutos u horas
y genera informes, capturas y videos. Eso no cabe en las funciones de Vercel:

- están hechas para responder en segundos, no para trabajos de horas;
- aceptan cuerpos de petición de 4,5 MB como máximo;
- no tienen disco persistente ni permiten instalar navegadores completos.

Por eso la plataforma se parte en dos:

| Parte | Dónde vive | Qué hace |
|---|---|---|
| **Web y API** | Vercel (Next.js) | Pantallas, sesión, proyectos, auditorías, reportes, correos y colas de trabajo. Rápida y global. |
| **Trabajadores del motor** | Contenedores (el equipo del analista al principio; la nube después) | Toman un trabajo de la cola, corren `_agentes_sinteticos` y suben los resultados. |

Entre las dos partes solo hay tres cosas compartidas: **la base de datos, el almacenamiento
de archivos y la cola de trabajos**. Así cada parte escala por su cuenta:
- **la web**, con más visitas;
- **los trabajadores**, con más estudios en paralelo.

---

## 1 bis. Dónde queda la base de datos

- **En producción:** en **PostgreSQL** (Neon, gestionada desde Vercel). Ahí vive todo lo de
  cada cuenta:
  - sus proyectos, con las etapas y cada corrida del motor;
  - los hallazgos, con **sus auditorías**;
  - las notas, los correos enviados, las cancelaciones y los proyectos rehechos.

  Cada persona entra con su cuenta y ve solo sus proyectos. La base guarda **todas las
  corridas**, no solo la última, así que se puede volver a un reporte anterior cuando se
  quiera. Las auditorías pasan de una corrida a la siguiente cuando el hallazgo se repite.
- **Los archivos** (fuentes, reportes PDF, recorridos) no van en la base, sino en el
  almacenamiento privado. La base guarda la referencia.
- **En la maqueta local:** con `abrir-plataforma.cmd`, la base es
  `work/synthetica-plataforma/datos/base.json`, que tiene la misma forma que tendrá en
  PostgreSQL. Los archivos van en `proyectos/`. Las dos carpetas quedan fuera de git.
- **Rehacer un proyecto** crea uno nuevo ligado al anterior (`proyecto.deriva_de`). El
  anterior no cambia: conserva sus corridas, sus reportes y sus auditorías.

## 1 ter. Qué ve el cliente en la web y qué no

Para que la plataforma sea liviana en Vercel, al cliente solo se le publica lo que usa:

| Se publica al cliente | Se queda para el equipo (vista interna o almacenamiento) |
|---|---|
| Los hallazgos para **auditar**, con su auditoría guardada | Los informes completos del motor (UX, UI, auditoría experta, mirada, GOMS…) |
| El **reporte en PDF** con la marca Synthetica | Las **grabaciones** de los agentes (videos) |
| El **recorrido interactivo** de la **última** corrida, con el estilo de la plataforma, en un popup grande o en otra pestaña: por dónde pasó cada agente, qué decidió, dónde se varó y, en cada punto, la captura con sus clics y su mirada | Las capturas originales y los volcados crudos |
| Los **mapas de calor** por vista y dispositivo: **clics** (verde si respondió, rojo si no) y **mirada simulada** (predicción del modelo, no eye tracking real) | |

El conector prepara estas piezas del estudio vigente:
- **Recorrido:** lo rearma reproduciendo `eventos.jsonl` con el propio monitor del motor, en
  memoria. Así no depende de un `workflow-live.html` que se haya regenerado sin datos.
- **Capturas:** las comprime a JPEG de 720 px. Pesan 5 MB en Corvus y 62 MB en eDoc; en
  producción van al almacenamiento y cada una se carga solo al abrir su punto.
- **Mapas de calor:** los pinta con Pillow, en unos 2 a 4 MB por estudio.

## 2. Diagrama

```
 Personas en cualquier país
          │  HTTPS
          ▼
 ┌─────────────────────────────── Vercel ───────────────────────────────┐
 │  CDN global + WAF                                                    │
 │  Next.js (páginas) ── Route Handlers (API) ── Cron (vigilancia)      │
 └──────┬───────────────────┬──────────────────────┬────────────────────┘
        │ SQL               │ URL firmada          │ API
        ▼                   ▼                      ▼
 ┌─────────────┐   ┌──────────────────┐   ┌──────────────────┐
 │ PostgreSQL  │   │ Almacenamiento   │   │ Resend (correo)  │──► hello@medialab.design
 │ (Neon)      │   │ privado (Blob)   │   └──────────────────┘    y la persona
 │ + cola      │   │ fuentes, informes│
 │ de trabajos │   │ PDF, capturas    │
 └──────▲──────┘   └────────▲─────────┘
        │ reclama trabajo,  │ baja fuentes,
        │ latidos, estado   │ sube resultados
 ┌──────┴───────────────────┴─────────────────────────────────────┐
 │ Trabajadores del motor (Docker: Python + Playwright + motor)   │
 │ Fase 1: equipo del analista · Fase 2: Cloud Run / Fly (0 → N)  │
 └────────────────────────────────────────────────────────────────┘
```

---

## 3. Componentes y por qué cada uno

La recomendación va primero; entre paréntesis, la alternativa si hay una razón para cambiar.

**Aplicación web y API: Next.js en Vercel Pro.**
- La maqueta actual (`index.html`) se porta a componentes: las vistas, el asistente, el
  canvas, la auditoría y el seguimiento.
- La API vive en Route Handlers, sin estado, así que Vercel la replica sola según la demanda.
- El plan Hobby de Vercel no admite uso comercial: hace falta **Pro**.

**Sesión: Clerk (o Auth.js).**
- En el primer MVP hay una persona por proyecto, con correo y contraseña o Google.
- En el segundo MVP, Clerk ya trae organizaciones e invitaciones, que es lo que pedirán los
  roles.

**Base de datos: PostgreSQL en Neon, desde el Marketplace de Vercel (o Supabase).**
- Parte de `modelo-datos.sql`, con migraciones versionadas (Drizzle).
- **Aislamiento por cliente**: cada tabla lleva `organizacion_id` y hay políticas de
  seguridad por fila (RLS), para que un cliente nunca vea datos de otro aunque falle una
  consulta.
- Neon escala solo y tiene un controlador pensado para funciones serverless, sin agotar
  conexiones.

**Archivos: Vercel Blob, privado (o Cloudflare R2 si los videos crecen mucho).**
- **Subida directa del navegador al almacenamiento** con una URL firmada que emite la API.
  El archivo no pasa por la función, así que el límite de 4,5 MB no aplica.
- El **límite de 10 MB por envío** va escrito en esa URL firmada (tamaño máximo y tipos
  permitidos) y se vuelve a comprobar en el trabajador.
- Nada es público: fuentes, informes, PDF y videos se descargan con enlaces firmados que
  caducan en minutos.

**Cola de trabajos: una tabla `trabajo` en la misma PostgreSQL.**
- Cada acción que necesita al motor (lanzar, volver a ejecutar, detener, reanudar,
  cancelar) crea o cambia una fila.
- Los trabajadores reclaman trabajo con `SELECT … FOR UPDATE SKIP LOCKED`: dos trabajadores
  nunca toman el mismo.
- Sin otro proveedor que pagar ni vigilar. Si más adelante hace falta, Inngest o
  Trigger.dev se enchufan encima.
- **Vercel Cron** revisa cada pocos minutos los trabajos sin latido y los reintenta, o los
  marca como fallidos y avisa.

**Trabajadores del motor: imagen Docker con Python, Playwright y `_agentes_sinteticos`.**
- **El motor no se modifica.** Un envoltorio (`synthetica-worker`) hace de puente:
  1. baja las fuentes;
  2. arma `proyectos/<id>.json` con `nuevo_proyecto`;
  3. corre el estudio con sus comandos de siempre;
  4. publica los resultados. Ese paso es lo que hoy hace `conector_motor.py`.
- **Fase 1:** el trabajador corre en el equipo del analista, que es lo que ya pasa hoy. La
  diferencia es que toma los trabajos solo de la cola, en vez de leer un correo, y el
  analista sigue viendo cada estudio en local.
- **Fase 2:** los mismos contenedores en Google Cloud Run Jobs (o Fly Machines). Arrancan
  cuando hay trabajo, se apagan en cero y corren en paralelo hasta el tope que se fije.

**Correo: SendGrid, con el dominio `medialab.design` verificado** (Resend o SMTP sirven igual).
- Al equipo (`hello@medialab.design`): cada proyecto nuevo, ejecución, detención y
  cancelación, con toda la ficha. Es lo mismo que la maqueta ya arma.
- A la persona: «tu proyecto está en camino», «tu informe está listo para auditar», etc.

**Credenciales de las plataformas de los clientes: cifrado de sobre con KMS (AWS o Google
Cloud).**
- La base guarda solo el texto cifrado y solo el trabajador lo descifra, en memoria.
- Nunca aparece en correos, registros ni en la interfaz.
- Cada lectura queda anotada y la credencial se borra al cerrar el proyecto. Es la tabla
  `credencial` que ya está en el esquema.

**Progreso en vivo: latidos del trabajador.**
- Cada pocos segundos el trabajador informa etapa, porcentaje y último paso.
- La pantalla consulta cada 10 a 20 segundos, sin conexiones abiertas, lo que escala sin
  esfuerzo.
- Si hace falta tiempo real de verdad, se agrega Ably o Pusher sin tocar lo demás.

**Reporte en PDF: el trabajador lo genera al terminar y lo sube al almacenamiento.**
- Lo imprime con el mismo Chromium que ya tiene.
- El PDF con la auditoría del cliente se regenera bajo pedido, en una función corta o en
  el trabajador.

**Seguimiento (etiqueta en el sitio del cliente), en la fase 3.**
- Recibe los eventos en una función Edge de Vercel y los guarda en un almacén analítico
  (Tinybird o ClickHouse), no en PostgreSQL: son millones de filas.

**Observabilidad: Sentry y Vercel Observability para la web; registros del trabajador en
Axiom o Better Stack.**
- Alertas cuando un estudio falla, se atasca o tarda el doble de lo habitual.

---

## 4. Cómo funciona cada flujo

**Crear un proyecto y subir documentos**
1. La persona completa el asistente. Al elegir archivos, el navegador pide una URL firmada
   a `/api/subidas`.
2. La API comprueba la sesión, el tipo de archivo y que el envío no pase de 10 MB, y firma.
3. El navegador sube directo al almacenamiento, con una barra de progreso.
4. Al enviar, la API crea `proyecto`, `fuente` y `trabajo(estado = 'pendiente')` en una
   sola transacción. Luego manda los correos a hello@medialab.design y a la persona.

**Ejecutar el estudio**
1. Un trabajador reclama el trabajo y descarga las fuentes.
2. Abre el zip de forma segura:
   - hasta 500 entradas y 100 MB descomprimidos;
   - sin rutas con `..`;
   - solo documentos de texto.
3. Arma el proyecto del motor y corre el estudio. Cada paso envía un latido; al terminar
   cada etapa, actualiza `etapa`.
4. Sube el backlog, los informes, el PDF y las capturas. La API crea los `ajuste` para
   auditar y avisa a la persona: «Es tu momento de auditar».

**Detener, reanudar y cancelar**
- **Detener** marca el trabajo como `detener_pedido`. El trabajador lo revisa entre pasos,
  guarda lo hecho y se detiene limpio.
- **Reanudar** vuelve a encolar el trabajo con lo ya hecho. El motor ya sabe completar
  solo lo pendiente (`completar_estudio`), sin empezar de cero.
- **Cancelar** es igual que detener, pero además guarda el motivo en `cancelacion` y avisa
  al equipo.

**Volver a ejecutar**
- Crea un trabajo nuevo con el número de agentes, las fuentes nuevas (otro envío de hasta
  10 MB) y si empieza desde el inicio o solo repite la ejecución.

---

## 5. Por qué escala

- **La web no guarda estado.** Vercel replica las funciones según las visitas, y el CDN
  sirve lo estático desde el punto más cercano a cada persona.
- **Los estudios escalan aparte.** Más estudios significa más contenedores: la cola los
  reparte y el tope de paralelo se fija por plan. Un pico de estudios no hace más lenta la
  web.
- **Todo trabajo se puede repetir sin duplicar nada.** Cada trabajo tiene un id; si un
  trabajador muere a mitad, otro retoma sin crear resultados dobles.
- **Límites por cliente:** tamaño de envío (10 MB), proyectos y ejecuciones por mes,
  agentes por ejecución (hasta 20) y peticiones por minuto (rate limiting). Protegen el
  costo y evitan abusos.
- **Una región para los datos**, elegida según los clientes: `us-east` para empezar, o
  São Paulo si la mayoría está en Latinoamérica. Los trabajadores van en la misma región
  para que la base y el almacenamiento queden cerca.

---

## 6. Seguridad y datos personales

- HTTPS en todo, con el WAF y la protección contra bots de Vercel.
- Aislamiento por organización en la base (RLS) y almacenamiento privado con enlaces que
  caducan.
- **Los estudios solo apuntan a URL que el cliente declara y autoriza**: una casilla de
  autorización y términos al crear el proyecto. El trabajador no navega a otros dominios.
- **Zip:** límite de 10 MB, sin rutas peligrosas, sin bombas de descompresión y solo
  documentos de texto. Opcionalmente, antivirus (ClamAV) en el trabajador.
- **Datos personales:** el motor ya redacta la información personal de las fuentes. Hay que
  definir retención y borrado según la Ley 1581 de Colombia, la LGPD de Brasil y el RGPD si
  hay clientes europeos. Se agrega un botón para borrar el proyecto con todos sus archivos.
- Los secretos (claves de API, KMS, Resend) viven en las variables de entorno de Vercel y
  del trabajador, nunca en el repositorio.
- **Los documentos de los clientes nunca van a GitHub**, ni en desarrollo ni en producción.
  El trabajador los descarga a una carpeta temporal fuera del repositorio y la borra al
  terminar cada trabajo; solo quedan en el almacenamiento privado. En este repositorio,
  `.gitignore` excluye `work/synthetica-plataforma/proyectos/`, `descargas/`,
  `datos-motor.js` y las exportaciones; el código de la plataforma sí puede subirse.

---

## 7. Entornos y despliegue

- **Repositorio privado en GitHub.** El repositorio actual (`Guru`) es público y no puede
  alojar la plataforma ni sus datos.
- **Vista previa por cada cambio:** Vercel crea una URL por pull request, con base y
  almacenamiento de prueba.
- **Staging y producción** separados, con migraciones automáticas al desplegar.
- **La imagen del trabajador** se construye en GitHub Actions y se publica en un registro
  de contenedores. El analista la actualiza con un solo comando.

---

## 8. Plan por fases

| Fase | Qué queda funcionando | Duración estimada |
|---|---|---|
| **0 · Base** | Next.js en Vercel con sesión, base de datos, subida directa de 10 MB, asistente, proyectos, correo a hello@medialab.design y reporte PDF. **Trabajador en el equipo del analista**, que toma los trabajos de la cola y publica resultados. | 3 a 4 semanas |
| **1 · Estudio completo en línea** | Auditoría, volver a ejecutar, detener, reanudar y cancelar de punta a punta; progreso en vivo; vigilancia con Cron; observabilidad. | 2 a 3 semanas |
| **2 · Trabajadores en la nube** | Contenedores en Cloud Run (o Fly) que arrancan y se apagan solos, estudios en paralelo, límites por plan y KMS para las credenciales. | 2 a 3 semanas |
| **3 · Crecer** | Organizaciones y roles (segundo MVP), proyecto completo con escenarios, seguimiento con etiqueta y analítica, facturación. | Según prioridad |

Las duraciones suponen una persona de desarrollo a tiempo completo con el motor ya estable.
Se ajustan cuando se cierre el alcance de cada fase.

---

## 9. Lo que necesito de ti

**Cuentas y accesos**
1. Un **equipo en Vercel con plan Pro** y acceso para desplegar.
2. El **dominio** de la plataforma (por ejemplo `app.synthetica…`) y acceso a su DNS.
3. **Acceso al DNS de `medialab.design`**, para verificar el dominio en SendGrid. Sin eso,
   los correos a hello@medialab.design y a los clientes caen en spam.
4. Un **repositorio privado** en GitHub, en la organización que prefieras.
5. Una cuenta en **Google Cloud** (Cloud Run y KMS) o en Fly.io, para la fase 2. En la
   fase 0 basta el equipo del analista.

**Decisiones**
6. **Región de los datos:** Estados Unidos o São Paulo.
7. **Retención:** cuánto se guardan fuentes, informes y videos, y cuándo se borran.
8. **Límites por plan:** proyectos y ejecuciones por mes, y agentes por ejecución. Hoy la
   maqueta permite hasta 20.
9. **Quién es el analista** que corre el trabajador en la fase 0, y en qué equipo.
10. **Texto de autorización y términos** que acepta el cliente antes de que los agentes
    naveguen su producto.

**Presupuesto**
11. Los costos fijos iniciales son bajos: Vercel Pro por miembro, más base de datos,
    almacenamiento y correo con sus planes de entrada.
12. El costo que crece es el **cómputo de los trabajadores**, que depende de cuántos
    estudios y agentes se corran. Conviene fijar un tope mensual desde el principio.

Los precios de cada proveedor se confirman al crear las cuentas.

---

## 10. Qué ya está resuelto en la maqueta

La maqueta local ya se comporta como la versión en línea en estos puntos:
- **Límite de 10 MB por envío:** zip y documentos, validado en la página y en `servidor.py`.
- **Archivos en carpetas por proyecto**, como en el almacenamiento real.
- **Correo con la ficha** para hello@medialab.design.
- **Detener, reanudar y cancelar** con motivo.
- **Lectura del motor sin modificarlo** (`conector_motor.py`). Es la base del trabajador.

Portarla a Next.js reutiliza los textos, los flujos y el modelo de datos. Lo que cambia es
dónde viven los datos: de `localStorage` y `servidor.py` a PostgreSQL y el almacenamiento.
