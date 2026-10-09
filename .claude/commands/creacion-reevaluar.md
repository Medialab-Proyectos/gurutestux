---
description: Vuelve a validar el contexto de un proyecto (escenario 0) con documentos nuevos y las respuestas del cliente, y actualiza el informe
argument-hint: <id> [carpeta o archivo con documentos nuevos] [respuestas .json o .md | descargas]
---

Motor: `_creacion_productos/` (independiente de la plataforma). Lee su `README.md` y la guía `_creacion_productos/escenarios/0-validacion-del-contexto.md`.

Datos: $ARGUMENTS

**Rehacer complementa, no reemplaza.** El cliente ya vio y aprobó cosas:
- **Lo confirmado se conserva.** El motor pasa al ciclo nuevo las respuestas que no pedían cambios y las marca «Lo confirmaste en el ciclo N». Solo se vacían las que pedían cambios, que son lo que se rehace.
- **Se rehace solo lo pedido:** el encargo, el comentario y los archivos nuevos. El resto queda igual.
- **Cada cambio se marca** en `cambios.json`, en la carpeta de la caja (la vuelta nueva, o `puerto-2/` para la 1.1). El informe lo muestra en «Qué cambió en este ciclo»:
  `{"ciclo": N, "pedido": "…", "cambios": [{"tipo": "nuevo|cambio|igual|quitado", "que": "…", "antes": "…", "ahora": "…", "motivo": "…"}], "consultar": ["…"]}`
- **Si atender el pedido tocaría algo que el cliente ya aprobó**, no lo cambies: ponlo en `consultar` y pregúntaselo.

1. **Documentos nuevos.** Si te dieron una carpeta o archivo, súmalo al contexto: `python _creacion_productos/producto.py agregar <id> <carpeta o archivo>`. Queda en `contexto/agregado-<fecha>/`; lo anterior no se borra.
2. **Respuestas del cliente.** Si respondió en el informe o en la estructura abiertos desde el servicio, sus respuestas se grabaron solas en `respuestas-cliente.json` dentro de la vuelta anterior y el motor las toma solo: no hace falta pasarlas. Si llegaron por otro lado (el `.json` descargado o un `.md`), pasa la ruta, o `descargas` para tomar el más reciente de la carpeta Descargas. Si no hay respuestas, sigue sin ellas y dilo.
3. Abre la vuelta nueva: `python _creacion_productos/producto.py validar <id> [--respuestas <archivo | descargas>]`. La salida dice de dónde tomó las respuestas.
4. Lee `entrada.md` de la vuelta: la lista de **todos** los documentos (los de antes y los nuevos), la validación anterior y lo que respondió el cliente. Lee completos los documentos nuevos y vuelve a mirar los anteriores donde las respuestas lo pidan.
   - **Encargo:** si el cliente pulsó «Pedir reevaluación», la vuelta anterior tiene `encargo-rehacer.md`, con cada pedido, su detalle y los archivos nuevos que nombró (pregunta «Archivos adicionales»), ya ubicados en `contexto/`. Atiéndelo entero.
5. Parte del `validacion.json` y del `sitemap.json` de la vuelta anterior (cópialos a la vuelta nueva) y actualízalos:
   - una respuesta del cliente cuenta como fuente (`"Respuestas del cliente · vuelta K"`): un dato parcial que confirma pasa a claro, y uno que corrige cambia su «qué dice»;
   - la observación temporal es una nota: se considera, pero sola no sube el nivel;
   - «algo más a tener en cuenta» (`_adicional`) y la respuesta y observación sobre la estructura (`estructura`) se leen siempre: pueden cambiar criterios, el sitemap, las hipótesis o el backlog;
   - una pregunta respondida no se repite; si la respuesta abrió otra duda, se formula una nueva, de sí o no u opciones cuando se pueda;
   - agrega los documentos nuevos a `documentos` y actualiza `hallazgos`.
6. Corre otra vez `python _creacion_productos/producto.py validar <id>`. Recalcula el grado y los planos de Garrett y escribe el informe nuevo (`validacion.html`) en la vuelta nueva. Para que el cliente responda la vuelta nueva, déjalo abierto en segundo plano con `python _creacion_productos/producto.py abrir <id>`.
   - **Flujos:** vuelve a recorrer las historias de usuario y los flujos con las respuestas. Por cada hueco (`flujos.huecos`), decide si quedó definido, si el cliente aceptó la consecuencia (sigues con `por_defecto` y lo anotas) o si su respuesta escrita no define nada. En ese caso, reformula el hueco con la consecuencia concreta. Si una respuesta abre un hueco nuevo o afecta otro flujo, agrégalo con su impacto.
7. Verifica el encargo punto por punto (columna «Verificado»): cada pedido y cada archivo nuevo quedó atendido o explica por qué no.
8. Termina con una comparación contra la vuelta anterior: el grado antes y ahora, la letra de cada plano antes y ahora, qué criterios cambiaron y por qué, y qué preguntas quedan. Si el escenario 1 ya estaba en curso y el contexto cambió de fondo (por ejemplo, el alcance), dilo: conviene una vuelta nueva del escenario 1 con esa información.
