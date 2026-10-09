---
description: Investigación a fondo de la población objetivo de un proyecto del motor de creación, cuando el cliente no la definió (entrada obligatoria de la caja 2)
argument-hint: <id>
---

Motor: `_creacion_productos/`. La población objetivo es entrada de la caja 2: sin ella no hay protopersonas ni journey maps.

Datos: $ARGUMENTS

1. Mira qué se sabe: el criterio «población» de la última vuelta del paso 0 (`escenario-0/vuelta-K/validacion.json`), las respuestas del cliente (`respuestas-cliente.json`) y todo el contexto (`proyectos/<id>/contexto/`).
2. Si el cliente ya la dio, no investigues: muéstrasela tal cual y pregúntale «Esta es la población objetivo determinada: ¿tienes alguna sugerencia o quieres una segunda ronda de revisión?».
3. Si no está o es parcial, investiga a fondo. Nada con costo sin preguntar.
   - Productos parecidos (los referentes del cliente y los de `bases/arquetipos.json`): a quién le hablan y quién los usa según sus reseñas.
   - Estudios y encuestas del sector: demografía solo si es pertinente; rol, contexto y necesidad pesan más que la edad.
   - Comunidades y reseñas: lo que dicen quienes usan productos así.
   - Estudios revisados por pares, verificados por DOI en OpenAlex, cuando existan.
4. Escribe `poblacion.md` con:
   - 2 a 5 segmentos: quién es, su situación, su tarea principal (job to be done), su contexto de uso, qué le preocupa y cómo lo mide;
   - la fuente de cada rasgo y su nivel de evidencia;
   - qué es supuesto y cómo se validaría con personas.
5. Regístrala como propuesta: `python _creacion_productos/producto.py poblacion <id> <poblacion.md>`. Queda en `contexto/poblacion/` y cuenta las rondas. No reevalúes el paso 0: reabriría las cajas ya completas.
6. Muéstrale al cliente la población propuesta y pregúntale: «Esta es la población objetivo determinada: ¿tienes alguna sugerencia o quieres que se haga una segunda ronda de revisión?».
   - Si pide otra ronda o cambia algo: ajusta `poblacion.md` y vuelve al paso 5.
   - Si la acepta: `python _creacion_productos/producto.py poblacion <id> <poblacion.md> --aprobada`. La entrada de la caja 2 queda en verde.

**Reglas comunes** (lecciones aprendidas, jerarquía de normas, regla de progreso con máximo 3 pasadas, no romper lo aprobado, Three-Body Balance, pendientes): `_creacion_productos/REGLAS.md`. Léelas antes de empezar.
