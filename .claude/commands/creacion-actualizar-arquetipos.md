---
description: Amplía o actualiza la base de arquetipos del estado del arte (estructuras, patrones de lectura, flujos probados y evidencia científica) con una búsqueda a fondo
argument-hint: [clave de un arquetipo, tipo de producto nuevo, «flujos», «ciencia» o «todo»]
---

Base: `_creacion_productos/bases/arquetipos.json`. La comparten todos los proyectos del motor de creación. Mírala primero con `python _creacion_productos/producto.py arquetipos [descripción]`.

Qué actualizar: $ARGUMENTS. Si no dice nada, empieza por los tipos marcados ✗ en `python _creacion_productos/producto.py tipos` (taxonomía `bases/taxonomia.json`) que pidan los proyectos abiertos; luego, lo marcado como `pendiente` y lo revisado hace más de un año. Al crear un arquetipo, actualiza su tipo en la taxonomía (`arquetipo` y `estado`).

Qué hay en la base:
- `arquetipos`: tipo de producto → estructura de información, sitemap tipo, patrón de lectura por tipo de página, flujos críticos, anti-patrones, `experto`, `usuarios`, `referentes` y `casos` (estos dos los suma el motor al aprobarse la caja 0 de cada proyecto).
- `patrones_lectura` (F, capas, salteado, compromiso, Z, Gutenberg, marcado, omisión, cortacésped, pinball, pliegue, izquierda, según tarea) y `ergonomia_movil`.
- `patrones_transaccionales` y `flujos_probados` (registro, inicio de sesión, recuperación, verificación, primer uso, búsqueda, cancelación).
- `evidencia_cientifica`: estudios revisados por pares con DOI, enlazados por `aplica_a`.
- `bases_estado_del_arte` y `evidencia_cientifica_bases`: dónde buscar.

Haz esto:

1. **Expertos y guías.** Busca en las fuentes de `bases_estado_del_arte`: GOV.UK, NHS, NN/g, Baymard (solo lo gratuito), Passkey Central, W3C, NIST, Material, HIG, SLDS y reguladores. Cada recomendación lleva `fuente`, `url`, `consultado` (hoy) y `evidencia` si no es investigación con usuarios.
2. **Voz de usuarios.** Busca en reseñas (G2, Capterra, tiendas de apps), comunidades (Reddit) y encuestas publicadas (Reuters Institute, J.D. Power, Baymard). Cada entrada lleva `dice`, `implica`, `fuente`, `url` y `consultado`. Nada de citas inventadas ni parafraseadas como si fueran textuales.
3. **Ciencia.** Busca y verifica en OpenAlex (`https://api.openalex.org/works?search=…`, gratis, sin clave): título, año, DOI, revista o congreso y autores (`/works/doi:<doi>`). Agrega a `evidencia_cientifica` solo lo verificado por DOI, con `tipo` (estudio empírico, revisión, preprint sin revisión por pares), `hallazgo` y `aplica_a`. Si no puedes confirmar qué encontró el estudio, no lo agregues.
4. **Arquetipo nuevo** (un tipo de producto que no está): crea la entrada completa con `palabras`, `plataformas`, `estructura_ia`, `patron_lectura` (claves de `patrones_lectura`), `sitemap` con `obligatoria`, `flujos_criticos`, `anti_patrones`, `experto`, `usuarios` y `pendiente` para lo que no encontraste. Marca `transaccional: true` si se paga, se envía o se confirma algo.
5. **Vigencia.** Lo que ya no se sostiene no se borra: `vigencia.estado` pasa a `declive` o `retirado` con su `motivo` y fuente. Actualiza `vigencia.revisado`.
6. Nada con costo sin preguntar: Baymard completo, Mobbin y Page Flows son de pago.
7. Valida el JSON (`python _creacion_productos/producto.py arquetipos`) y resume qué entró, qué quedó pendiente y con qué fuentes. Si cambió algo que usa un proyecto abierto, dilo: su caja 0 puede reevaluarse con `/creacion-reevaluar <id>`.
