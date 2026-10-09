---
description: Caja 4.1 del motor de creación (imagen). Muestra al cliente el material gráfico de la propuesta elegida y lo que haría un diseñador (brief con el nombre exacto de cada archivo); el cliente lo acepta o pide recursos propios. Con «listas» recibe los archivos del diseñador para maquetarlos. Sin agentes
argument-hint: <id> [listas]
---

Motor: `_creacion_productos/`. Guía: `_creacion_productos/escenarios/4.1-imagen.md`.

Datos: $ARGUMENTS

La caja 4.1 **siempre se hace** después de la 4 y **se arma sola al aprobar la 4** (`imagen.automatica`): copia la propuesta elegida, toma de la caja 4 lo que haría un diseñador (`recursos.json`, con su previa), arma el brief y deja el informe listo. Este comando se usa cuando el cliente pide recursos propios (ciclo siguiente) o si la caja hay que rehacerla. En su informe el cliente ve el material gráfico que tiene la propuesta que eligió y decide: lo acepta como está, o pide recursos propios hechos por un diseñador gráfico. Los recursos propios **los crea un diseñador**, no un motor de imágenes. No se evalúa con agentes.

**Si los datos dicen «listas»** (el diseñador terminó, en el ciclo en que el cliente los pidió):
1. `python _creacion_productos/producto.py imagenes <id> --listas`: comprueba cada recurso por su **nombre exacto**. Si falta alguno, di qué archivo y en qué carpeta va.
2. Maquétalos en la página de la propuesta elegida (`diseno/propuesta-<id>/index.html`), sin perder la usabilidad ganada ni el contraste, y anótalo en `maqueta-recursos.json`: `{"recursos": [{"id", "donde", "como"}]}`.
3. Escribe `entrega.md`, `logros.txt`, `preguntas.md` y `preguntas.json`, `cambios.json` y `lecciones-caja.json`.
4. Cierra con `producto.py cerrar <id> 4.1`. El informe muestra lo que entregó el diseñador y cómo quedó maquetado, con la pregunta para aprobarlo.

**Si no** (primer ciclo):
1. Si la caja no está abierta: `producto.py iniciar <id> 4.1`. Copia la propuesta elegida, su material, la gama y la letra.
2. Revisa el material que ya tiene la propuesta (`recursos/FUENTES.md`): que cada pieza diga su origen y licencia.
3. Escribe `recursos.json`: lo que haría un diseñador gráfico para esta propuesta, cada recurso con dónde va, para qué, su especificación, los principios que debe respetar y su prompt. Si no hace falta ninguno, `"no_hace_falta": "por qué"`.
4. Si hay recursos, con el servicio encendido (`http://127.0.0.1:8795`): `python _creacion_productos/producto.py imagenes <id>`. Arma `brief-disenador.html`, `encargo-imagenes.md` y `prompts.md`.
5. Escribe `entrega.md`, `logros.txt`, `preguntas.md` y `preguntas.json` (la pregunta «El material gráfico» la agrega el motor) y `lecciones-caja.json`, y cierra con `producto.py cerrar <id> 4.1`.
6. Dile al usuario que en el informe el cliente acepta el material o pide recursos propios. Si los pide, sigue `/creacion-rehacer <id> 4.1`: el brief pasa al diseñador.
