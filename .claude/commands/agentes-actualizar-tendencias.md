---
description: Valida y, si hace falta, actualiza con una búsqueda en internet las tendencias UX/UI (web, móvil o ambas) de un proyecto y de la base general
argument-hint: [id del proyecto] [plataformas opcional: web, movil o "movil y web"]
---

Las tendencias viven en dos lugares y el estudio las lee combinadas: catálogo base del motor ← base general `_agentes_sinteticos/bases_comportamiento/tendencias-generales.json` (compartida por todos los proyectos) ← `_agentes_sinteticos/proyectos/<id>/tendencias.json` (lo propio del producto). El estudio nunca sale a internet: al cerrar deja `tendencias-vigencia.json` con si hace falta actualizar, por qué y para qué plataformas.

Datos que da el usuario: $ARGUMENTS

Haz esto:

1. **Validar primero.** Lee el `tendencias-vigencia.json` del último estudio del proyecto (o calcula la vigencia con `agentes_sinteticos.tendencias.tendencias_del_estudio`). Si `hace_falta_actualizar` es falso, dilo y no busques nada. Si es verdadero, busca solo lo que falta según `motivos`: la plataforma sin búsqueda, la que tiene más de 120 días o todo, si nunca se buscó.
2. Lee `proyectos/<id>.json` (público, mercado, `tipo_producto`) y el `tendencias.json` del proyecto. Si falta el tipo de producto, dedúcelo y dilo.
3. Busca en internet prácticas y tendencias actuales de UX/UI para esa plataforma, tipo de producto y público. Fuentes: guías oficiales de sistemas de diseño (Material, Apple HIG, Carbon, Polaris, GOV.UK), Nielsen Norman Group, Baymard, W3C/WCAG, Google Search Central y normativa vigente. Prefiere fuentes de los últimos dos años y descarta modas sin evidencia.
4. Cada alternativa lleva `alternativa`, `cuando_conviene`, `riesgo`, `referencia` y `plataforma` («web», «movil» o «ambas»).
5. Guarda en la **base general** lo genérico (sirve a cualquier producto): `por_hallazgo` y `por_capacidad`. Guarda en el **proyecto** solo lo propio del producto: `del_producto` y lo que contradiga lo general. Si una entrada ya existe y lo nuevo la mejora, actualízala; si no, consérvala.
6. En los dos archivos que toques: `actualizado` con la fecha de hoy, `origen` «búsqueda en internet», `fuentes` con las URL y su fecha, y `plataformas_cubiertas` con la fecha de hoy para cada plataforma buscada.
7. **Lo que pierde vigencia.** Con `python -m agentes_sinteticos.tendencias_base revisar` ve qué tiene más de un año o
   está en declive. Si la búsqueda muestra que una práctica pierde uso o evidencia (p. ej. un patrón que las personas ya
   no ven o no reconocen), márcala con `tendencias_base declive --clave … --alternativa "…" --motivo "… (fuente)"`; si ya
   no aplica, `tendencias_base retirar` (no se borra: queda con su motivo). Lo nuevo se agrega con
   `tendencias_base agregar … --fecha <hoy>` y `--plano UX|UI`. Todo con `--proyecto <id>` si es propio del producto.
8. No toques la recomendación fundamentada ni los patrones probados (`patrones_recomendados.py`): las tendencias son alternativas que se validan antes de adoptarlas.
9. Regenera los informes del último estudio (`python -m agentes_sinteticos.regenerar_informes --estudio <carpeta>`) y confirma que la vigencia quedó al día. Resume qué cambió. No lances un estudio nuevo.
