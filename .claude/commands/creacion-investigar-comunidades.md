---
description: Caja 1.1 del motor de creación. Investiga en comunidades (Reddit, Quora, Facebook, Instagram, X, Google Trends, LinkedIn, Clutch, Discord, 4chan, Tumblr y foros) los problemas, frustraciones y necesidades no resueltas de la población, y deja un informe en PDF en el proyecto
argument-hint: <id> [tema o segmento a profundizar]
---

Motor: `_creacion_productos/`. Es la vía «Investíguenla ustedes» de la caja 1.1 (entrada a la caja 2). También sirve para completar una población que ya existe.

Datos: $ARGUMENTS

## El encargo
Investiga en plataformas como Reddit, Quora, Facebook, Instagram, X, Google Trends, LinkedIn, Clutch, comunidades de Discord, 4chan, Tumblr y foros especializados para identificar de forma concreta los problemas, frustraciones o necesidades no resueltas que expresan los usuarios en relación al objetivo del proyecto. Analiza conversaciones auténticas, preguntas frecuentes, quejas recurrentes y discusiones detalladas para detectar patrones y puntos críticos que revelen las verdaderas preocupaciones de la comunidad.

## Pasos
1. **Antes de buscar:** lee el objetivo, el alcance, la población que ya exista y los referentes (caja 0: `escenario-0/vuelta-K/validacion.json`, `sitemap.json` y `respuestas-cliente.json`), y lo que el cliente respondió en la caja 1.1 (`puerto-2/respuestas-cliente.json`). Arma la lista de búsquedas: el problema que resuelve el producto y las palabras con que lo diría la gente, en el idioma del mercado y en inglés.
2. **Busca plataforma por plataforma**, con búsquedas acotadas al sitio (por ejemplo, `site:reddit.com`, `site:quora.com`, `site:x.com`, `site:linkedin.com/posts`, `site:clutch.co`, `site:tumblr.com`, foros del sector). Lee los hilos completos, no solo el título. Google Trends: tendencia del interés por los términos clave, si se puede consultar.
3. **Honestidad sobre el acceso:** Facebook, Instagram, Discord y 4chan casi no se indexan ni se leen sin una cuenta. Por cada plataforma anota si se pudo consultar, qué se buscó y cuántos hilos útiles hubo. Si no hubo acceso o resultados, dilo («sin datos accesibles»). Nunca inventes conversaciones, citas ni cifras.
4. **Analiza:**
   - problemas, frustraciones y necesidades no resueltas;
   - preguntas frecuentes y quejas recurrentes;
   - patrones que se repiten entre plataformas y puntos críticos (lo que más duele o más bloquea).
   Cada hallazgo lleva citas textuales breves, sin nombres de usuario ni datos personales, con enlace y fecha, y la cantidad aproximada de hilos donde aparece.
5. **Escribe `investigacion.md`** con estas secciones:
   - Resumen ejecutivo: los 3 a 5 hallazgos que más deciden.
   - Objetivo del proyecto y preguntas de la investigación.
   - Método: plataformas, búsquedas, fechas, hilos revisados y limitaciones (qué no se pudo consultar y por qué).
   - Hallazgos por patrón: problema, qué dice la gente (citas con enlace), frecuencia aproximada, plataformas y puntos críticos.
   - Implicaciones para la población objetivo: 2 a 5 segmentos con su situación, su tarea principal, qué les preocupa y la evidencia de cada rasgo.
   - Qué validar con personas reales.
   - Anexo: todas las fuentes con enlace y fecha de consulta.
6. **PDF en la carpeta del proyecto:** `python _creacion_productos/producto.py investigacion-pdf <id> investigacion.md`. Quedan el `.md`, el `.html` y el `.pdf` en `proyectos/<id>/contexto/investigacion/`.
7. **Población propuesta:**
   - escribe `poblacion.md` con los segmentos y regístralo: `python _creacion_productos/producto.py poblacion <id> poblacion.md`;
   - regenera la caja 1.1: `python _creacion_productos/producto.py puerto <id>`. Ahí el cliente ve el resumen y responde las mejoras, que son opcionales;
   - cuando el cliente la acepte: `producto.py poblacion <id> poblacion.md --aprobada`. La entrada de la caja 2 queda en verde.
8. Nada con costo sin preguntar: herramientas de escucha social o paneles de pago.
9. Termina con los hallazgos principales, qué plataformas no se pudieron consultar y la ruta del PDF.
