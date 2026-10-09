---
description: Pule y publica las mejoras sobre lo que ya funciona (caja 4) de un estudio sintético, en el lenguaje del cliente
argument-hint: <id del proyecto>
---

Proyecto: $ARGUMENTS

La caja 4 son las **«Oportunidades sobre lo que ya funciona»** del motor (UX y UI): no son fallas, son formas de mejorar lo que el producto ya hace bien. Van por **Prioriza ahora** (aplicabilidad alta), **Más adelante** (media) y **A futuro** (baja). Los indicadores de «Qué gana tu producto» van en la caja 3 (Hallazgos) y no se tocan aquí.

1. Ejecuta `python work/synthetica-plataforma/operador.py propuestas $ARGUMENTS` desde la raíz del repositorio. Si no hay borrador lo crea con el último estudio; si el estudio cambió, usa `--regenerar`.
2. Abre el borrador (`work/synthetica-plataforma/proyectos/<carpeta>/propuestas.json`) y lee la ficha del proyecto (`proyecto.json`, `ficha.txt`, `fuentes/`) para conocer su negocio, su público y su vocabulario.
3. Pule cada oportunidad sin inventar:
   - `titulo` y `conviene`: en palabras del cliente y de su negocio; sin siglas técnicas sin explicar.
   - `horizonte`: muévela solo si el negocio lo justifica (por ejemplo, toca la conversión principal) y dilo al cerrar.
   - Quita las que no apliquen a este producto (por ejemplo, un chat que el sitio no tiene) y une las repetidas.
   - No cambies `fuente` ni `capa`.
4. Publica con `python work/synthetica-plataforma/operador.py propuestas $ARGUMENTS --publicar`.
5. Cierra con lo que cambiaste, las oportunidades de «Prioriza ahora» y lo que convendría validar con el cliente.
