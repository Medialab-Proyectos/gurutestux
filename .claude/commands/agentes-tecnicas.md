---
description: Analiza un estudio (completo o ligero) con técnicas de investigación UX (tree testing, primer clic, cinco segundos, modelo mental, olor de información…) usando lo que vivieron los agentes
argument-hint: [estudio o «último» de un proyecto] [técnicas opcionales, separadas por comas]
---

Módulo: `_agentes_sinteticos/agentes_sinteticos/tecnicas_ux.py`. No vuelve a correr agentes: lee la evidencia del estudio.

Datos que da el usuario: $ARGUMENTS

1. Ubica el estudio en `_agentes_sinteticos/salidas/` (si dice «último» o un proyecto, el más reciente de ese proyecto).
2. Si pide técnicas concretas, tradúcelas a sus ids (`python -m agentes_sinteticos.tecnicas_ux --estudio <x> --listar`):
   modelo_mental, card_sorting, tree_testing, primer_clic, expectativa_navegacion, etiquetas, encontrabilidad,
   busqueda_vs_navegacion, migas, olor_informacion, concepto, preferencia, deseabilidad, cinco_segundos, comprension,
   propuesta_valor, expectativa, contenido, consistencia, retrocesos, seq. Sin pedido, todas.
3. Cada estudio ya las genera solo (`tecnicas-ux.html`). Sus problemas entran a Recomendaciones UX o UI con la
   píldora «Técnica de investigación UX»: si el backlog ya tenía ese problema, la técnica lo confirma en su tarjeta
   («Lo confirma»); si no, es una recomendación nueva. Para rehacerlas o pedir solo algunas, ejecuta desde `_agentes_sinteticos`: `python -m agentes_sinteticos.tecnicas_ux --estudio salidas/<carpeta> [--tecnicas a,b]`.
   Deja `tecnicas-ux.html` y `.json` en el estudio; la portada lo enlaza.
4. Lee el JSON y explica en lenguaje simple, técnica por técnica, qué dice y qué hacer. Agrupa por familia
   (modelo mental, arquitectura de información, concepto y propuesta, contenido, consistencia y esfuerzo).
5. Sé honesto con el nivel de cada técnica:
   - **medida**: lo observa la sesión;
   - **aproximación**: hay que validarla con personas;
   - **requiere personas** (card sorting, preferencia): solo prepara la prueba real.
   Para esas, propón cómo hacer la prueba con personas: tarjetas, tareas y número de participantes.
6. Cruza con lo que ya dice el estudio («Qué nos dicen los indicadores» y el backlog UX/UI). No repitas recomendaciones:
   di qué técnica las confirma o las matiza. Nada con costo; no relances estudios.
