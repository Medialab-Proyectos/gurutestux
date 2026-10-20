# Integración de los motores con la plataforma

Decisiones del 2026-10-20:
- el cliente actúa **solo en la plataforma**;
- **cada motor escribe su propia foto** del estado;
- todo se sube junto a `main` cuando pasen las pruebas.

## Principio

**Los motores mandan; la plataforma observa y hace de relé.**

| Pieza | Qué es | Dónde vive |
|---|---|---|
| Motor | La lógica, las cajas, sus páginas y su servicio local (`_creacion_productos` :8795, `_agentes_sinteticos` :8796, `_qa_visual` :8797) | En el equipo del analista, fuera de git |
| Contrato | `proyectos/<id>/plataforma.json`: la foto del proyecto en un esquema común (`synthetica.estado/v1`) | Lo escribe cada motor (`plataforma.py`) |
| Vigilante | `operador.py vigilar`: pide la foto, publica el espejo y aplica el buzón | En el equipo del analista |
| Plataforma | Lista, lienzo de cajas, semáforo de riesgo, archivo y las páginas del motor en grande | Vercel (`gurutestux`), Neon y Blob |

Por qué así:
- La plataforma no conoce las cajas de ningún motor: dibuja las que declara la foto. Un motor puede sumar, quitar o renumerar cajas sin tocar la plataforma.
- Las páginas del cliente, con sus formularios y preguntas, existen una sola vez: en el motor. La plataforma no las reescribe.

## El contrato `synthetica.estado/v1`

```jsonc
{
  "contrato": "synthetica.estado/v1",
  "motor": "creacion | agentes | qa",
  "tipo": "completo | sintetico | qa",            // el tipo de proyecto en la plataforma
  "proyecto": { "id": "<id en el motor>", "nombre": "…" },
  "generado": "2026-10-20T10:00:00",
  "servicio": "http://127.0.0.1:8797",            // de dónde se toma el espejo
  "entrada": "/<id>/",                            // la página principal del proyecto en el motor
  "estado": "en_curso | espera_cliente | espera_equipo | detenido | terminado",
  "progreso": { "completas": 3, "total": 5 },
  "siguiente": { "caja": "2", "quien": "cliente | equipo | null", "texto": "…" },
  "ayuda": [ { "id": "…", "para": "cliente | equipo", "titulo": "…", "texto": "…", "vence": "…" } ],
  "cajas": [ {
    "id": "3.1", "orden": 4, "nombre": "Color", "opcional": false,
    "estado": "pendiente | bloqueada | en_curso | espera_cliente | espera_equipo | aprobada | omitida | detenida",
    "texto_estado": "lo que dice el motor, en palabras del cliente",
    "espera": "cliente | equipo | null",
    "ciclo": 1, "inicio": "…", "fin": "…", "eta_min": 120,
    "logros": ["…"],
    "pagina": "/<id>/escenario-3.1/vuelta-1/informe.html",   // la página que el cliente abre (o null)
    "enlaces": [ { "titulo": "Ver prototipo", "ruta": "/<id>/…" } ],
    "riesgo": { "nivel": "ok | atencion | alto", "motivos": ["…"] },
    "pendientes_cliente": ["…"]
  } ],
  "espejo": {
    "semillas": ["/<id>/"],                         // desde dónde se recorre
    "extra": ["/<id>/ayuda.json"],                  // lo que se pide por fetch y no es un enlace
    "excluir": ["^/<id>/investigador"],             // páginas solo del equipo
    "rapido": ["/<id>/ayuda.json"]                  // se refresca en cada pasada corta
  },
  "rutas_cliente": ["^/<id>/caja-[1-4]/vuelta-\\d+/(aprobar|cambios|respuestas)$"],   // POST que el relé acepta
  "secretos": ["privado/credenciales.json"]         // sus valores nunca pueden aparecer en lo publicado
}
```

Reglas del contrato:
- **Estados comunes.** Cada motor traduce los suyos a estos 8. El texto original va en `texto_estado`.
- **Riesgo.** El motor pone los motivos de su dominio: falta material, la sesión venció, la caja está detenida o se pidió ayuda. La plataforma suma los de tiempo:
  - una caja en curso pasó su `eta_min` → atención; si la pasó al doble → alto;
  - el cliente lleva más de 24 h sin responder → atención; más de 72 h → alto;
  - una ayuda pendiente → alto.
- **Rutas.** Todas son absolutas dentro del servicio del motor (`/<id>/…`). El vigilante las traduce al publicar.
- `prueba_contrato.py` valida la foto de los tres motores. Una foto inválida no se publica.

## Espejo: las páginas del motor en la plataforma

1. El vigilante recorre el servicio local con GET. **Solo publica lo vigente:**
   - las semillas;
   - las páginas y los enlaces que declara cada caja;
   - todo lo que está dentro de la carpeta de su vuelta actual;
   - los recursos (imágenes, CSS, JS) que esas páginas usan, dentro del proyecto.

   Los ciclos anteriores se quedan en el motor. Deja fuera `excluir` y lo que en el HTML parece ruta pero es código.

   Medido el 2026-10-20 con los proyectos reales:

   | Proyecto | Todo | Vigente |
   |---|---|---|
   | Creación «sintetica» | 150 MB | 47 MB |
   | QA «edoc» | más de 1.200 archivos | 437 archivos, 18 MB |
   | Agentes «arcus» | — | 0,2 MB |
2. Sube a Blob en `u/<cuenta>/publicado/<pid>/m/<ruta>`. Lo que no cambió no se sube (huella SHA-256 en `.operador/espejo-<pid>.json`).
3. Inyecta al inicio de cada HTML un ajuste de 1 KB. Traduce `fetch('/<id>/…')`, los enlaces y los formularios absolutos a `…/publicado/<pid>/m/<id>/…`. Las rutas relativas ya funcionan, porque se publica con la misma forma.
4. **Seguridad:** antes de subir busca en cada archivo los valores de los `secretos` del motor. Si aparece uno, no sube nada de esa pasada y avisa.

## Relé: lo que hace el cliente vuelve al motor

1. La página publicada hace su POST de siempre, por ejemplo a `aprobar`. Vercel lo lleva a `api/publicado` (POST), que:
   - exige la sesión del dueño y la cabecera propia contra CSRF;
   - comprueba la ruta contra `rutas_cliente`, guardadas con la foto;
   - limita el tamaño a 1 MB; los archivos van por la subida directa a Blob;
   - lo guarda en la tabla `buzon` (pendiente) y responde `202 {ok, en_cola, id}`.
2. El vigilante toma lo pendiente (`api/equipo?accion=buzon`) y lo reenvía al servicio local del motor, con el mismo método, ruta y cuerpo. Guarda la respuesta del motor (`accion=buzon_hecho`).
3. Enseguida vuelve a pedir la foto y el espejo, para que el cliente vea el cambio.
4. El ajuste del espejo espera la respuesta real del motor: consulta `api/publicado?buzon=<id>` y le devuelve a la página el JSON del motor. La página no nota la diferencia.
5. **Latencia:**
   - la pasada normal es cada 60 s;
   - cuando hay buzón pendiente o una ayuda abierta (código del segundo factor), cada 3 s;
   - el objetivo es menos de 10 s de punta a punta.

**Límites:**
- 4 MB por archivo, lo que admite una función de Vercel; lo más grande no se publica y queda como aviso. Ejemplo: el PDF de 11,8 MB del informe de QA de eDoc.
- 800 archivos y 150 MB por pasada.
- En el relé, el cliente puede subir hasta 4 MB por envío.

**Aviso al equipo:** cada acción del cliente que importa (aprobar, pedir cambios, responder, enviar, firmar) manda un correo a hello@medialab.design. Va con el mismo proveedor y límite que `api/correo`, y dice solo la acción, nunca su contenido.

## La plataforma

- **Lista de proyectos:** el estado de la foto, un semáforo de riesgo (el peor de sus cajas), quién tiene la pelota y el progreso. Los archivados van aparte.
- **Proyecto:** el lienzo con las cajas de la foto, en su orden, con un color por estado y su riesgo. Al elegir una caja se ven su estado, quién espera, sus logros, los motivos del riesgo y sus enlaces, y su página del motor en grande, donde el cliente actúa.
- **Ayuda en vivo:** si la foto trae una `ayuda` para el cliente, aviso arriba en todas las vistas.
- **Archivar:** un proyecto archivado sale de la lista, el vigilante deja de mirarlo y se puede restaurar. Borrar de verdad es solo del equipo (`operador.py borrar`).
- **Proyectos sin foto**, de antes: se ven como hasta ahora, con `TIPOS`, hasta que su motor publique una.

## Seguridad y datos

- Las credenciales siguen cifradas (AES-256-GCM, `api/credenciales`). El espejo nunca publica secretos: lo comprueban el motor y el vigilante.
- El relé solo acepta rutas declaradas por el motor y solo hacia `127.0.0.1`. El vigilante ignora una ruta que el motor no declare, aunque venga de la base.
- El buzón se purga a los 30 días. Los códigos del segundo factor se borran apenas se usan.

## Modos de falla

| Falla | Qué pasa |
|---|---|
| El motor o su servicio no corren | El vigilante lo dice; la plataforma muestra la última foto con su hora y avisa si tiene más de 15 min |
| El buzón no se aplica (409 del motor, por ejemplo) | Se guarda la respuesta del motor y la página se la muestra al cliente, como haría el motor |
| Foto inválida | No se publica; el vigilante muestra la validación que falló |
| Conflicto de versión del documento | `cambiarDocumento` reintenta con concurrencia optimista (como hoy) |

## Pruebas

- `prueba_contrato.py`: la foto de cada motor, sobre una copia de un proyecto real (`QA_PROYECTOS` y equivalentes).
- `t-integracion`: con la plataforma local (PGlite y blob falso), un proyecto por motor:
  1. bajar;
  2. la foto;
  3. el espejo, revisando que no haya secretos;
  4. un POST del cliente por el relé;
  5. el motor lo aplica;
  6. el cliente ve el cambio.

## Estado (2026-10-20)

| Fase | Estado | Prueba |
|---|---|---|
| 1 · Contrato y foto en los tres motores; vigilante genérico | Hecha | `prueba_contrato.py`: qa/edoc, creacion/sintetica y agentes/arcus cumplen |
| 2 · Lienzo desde la foto, semáforo de riesgo y archivo | Hecha | `t50`, punta a punta sobre una copia |
| 3 · Buzón y relé | Hecho | `t50`: el POST del cliente llega al motor y su respuesta real vuelve a la página; las rutas no declaradas se rechazan con 403 |
| 4 · Informes publicados | Hecha en parte | Las páginas del motor se publican tal cual, con su estructura gráfica. Falta unificar el diseño de los tres informes |

## Deuda técnica conocida

- Los archivos de más de 4 MB, como los PDF grandes, necesitan la subida directa a Blob desde el vigilante.
- Los enlaces a ciclos anteriores dan 404 en el espejo, porque solo se publica lo vigente. Se puede publicar el historial bajo pedido.
- Lo publicado que ya no se enlaza no se borra de Blob. Hace falta una limpieza periódica.
- Las páginas que piden datos con consultas (`estado?caja=`) no se reflejan: en el espejo esa consulta da 404 y la página sigue sin ella.

- La plataforma sigue siendo un solo `index.html` de unas 3.300 líneas. Partirla en módulos es el siguiente paso, fuera del alcance de esta integración.
- El vigilante corre en el equipo del analista. Pasarlo a un trabajador siempre encendido es parte del MVP 2.
