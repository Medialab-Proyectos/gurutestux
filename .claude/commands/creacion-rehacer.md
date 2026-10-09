---
description: Rehace el contenido de una caja del motor de creación (0 a 11, con 3.1 y 4.1) en un ciclo nuevo; las cajas posteriores quedan bloqueadas hasta volver a completarla
argument-hint: <id> <número de caja o 1.1> [motivo]
---

Motor: `_creacion_productos/`. Lee su `README.md` y la guía de la caja (`_creacion_productos/escenarios/<n>-*.md`).

Datos: $ARGUMENTS

**Orden al reevaluar (todas las cajas con prototipo):**
1. Aplica primero los ajustes que pidió el cliente (encargo, respuestas, archivos) y anótalos en `cambios.json`.
2. Guarda la versión que vas a evaluar: `producto.py evaluar <id> <n>`, o `producto.py protopersonas <id>` en la caja 2. Queda en `prototipo-evaluado.html`.
3. Evalúa **ese** prototipo: heurísticas o estudio sintético. Nunca el del ciclo anterior.
4. Después de la evaluación aplica solo lo de certeza alta que salga de ella; se vuelve a medir en el ciclo siguiente.
Al cerrar un ciclo 2 o posterior, el motor comprueba que la versión evaluada ya traiga los ajustes; si es la del ciclo anterior, no cierra.

**Requisito al rehacer la caja 2: las mismas protopersonas.** `producto.py rehacer <id> 2` copia al ciclo nuevo `protopersonas.json` y sus rostros, los mapas, los journeys, el sistema de diseño y la auditoría; cambia solo lo pedido. El estudio nuevo usa esas mismas personas (la plataforma de agentes reutiliza su cohorte), así se compara con el anterior. El cierre rechaza protopersonas distintas, salvo que el cliente lo haya pedido en la pregunta «personas».

**Cajas 3.1, 4 y 4.1:** se rehacen como cualquier caja (`/creacion-rehacer <id> 3.1`). La 3.1 trae **tres gamas nuevas** nacidas del pedido y de las referencias del cliente; la 4 (maquetación), **tres direcciones nuevas**: primero el encargo y una parada; las páginas se diseñan cuando el usuario dice «continuar», con recursos de librerías libres, y se evalúan completas con los agentes; la 4.1 (imagen), el material de la propuesta elegida y, si el cliente pide recursos propios, el brief al diseñador gráfico. **Orden (desde el 2026-10-08):** 3.1 → 4 → 4.1 → 5 → 6. **Caja 5 al empezar:** el paso 0 es maquetar en el prototipo la propuesta que eligió el cliente en la 4 (con los recursos de la 4.1; `maqueta-alta.json`) y atender lo que recomendó su evaluación (`recomendaciones-maquetacion.json`); `entrada.md` lo trae escrito y el cierre lo exige. **Nada se hace dos veces.**

**No romper lo aprobado en otra caja:** REGLAS.md §4 (se marca `rompe`, pasa a pregunta y va en `cambios.json` → `consultar`).

**Rehacer complementa, no reemplaza.** El cliente ya vio y aprobó cosas:
- **Lo confirmado se conserva.** El motor pasa al ciclo nuevo las respuestas que no pedían cambios y las marca «Lo confirmaste en el ciclo N». Solo se vacían las que pedían cambios, que son lo que se rehace.
- **Se rehace solo lo pedido:** el encargo, el comentario y los archivos nuevos. El resto queda igual.
- **Cada cambio se marca** en `cambios.json`, en la carpeta de la caja (la vuelta nueva, o `puerto-2/` para la 1.1). El informe lo muestra en «Qué cambió en este ciclo»:
  `{"ciclo": N, "pedido": "…", "cambios": [{"tipo": "nuevo|cambio|igual|quitado", "que": "…", "antes": "…", "ahora": "…", "motivo": "…", "balance": {"usuario": "sube|igual|baja", "negocio": "…", "sistema": "…"}}], "consultar": ["…"]}`
  Un cambio técnico que no le interesa al cliente (peso, escala de tamaños de letra, colores del sistema, carga diferida) lleva `"interno": true`: no sale en su informe y queda en la bitácora del equipo (`/<id>/bitacora`).
  El `balance` (Three-Body Balance, cajas 2 a 8) declara la perturbación de cada cambio sobre los tres cuerpos; al cerrar, el motor la mide y, si un cuerpo baja más que su tolerancia o B baja, lo lleva al cliente como pregunta.
- **Si atender el pedido tocaría algo que el cliente ya aprobó**, no lo cambies: ponlo en `consultar` y pregúntaselo.

0. **Encargo.** Al rehacer, el motor deja `encargo-rehacer.md` (en la vuelta anterior, o en `puerto-2/` para la 1.1). Viene de las respuestas guardadas del cliente y de las reglas de sus preguntas (`reglas_preguntas.py`), e incluye:
   - cada opción que pidió cambios, con su detalle;
   - los archivos que nombró, ya ubicados en la carpeta (por ejemplo, en «Archivos adicionales», que toda caja pregunta);
   - lo que quedó incompleto.
   Es tu lista de trabajo: atiende cada punto y, al terminar, **vuelve a revisarlos uno por uno** (columna «Verificado») antes de regenerar la caja. En el cierre, di cómo se resolvió cada uno.
   Si el cliente pulsó «Pedir reevaluación» en el informe, el pedido está en `estado.json` (`reevaluacion`, con su motivo) y en el índice de cajas. Si no das `--motivo`, se usa ese, y el pedido queda atendido.
1. Abre el ciclo nuevo: `python _creacion_productos/producto.py rehacer <id> <n> --motivo "…"`. El motor:
   - exige que todas las cajas anteriores estén completas;
   - abre la vuelta siguiente, y el número de ciclo sube (1, 2, 3…);
   - registra el motivo;
   - deja la caja en curso, así que las posteriores quedan bloqueadas hasta completarla de nuevo.
   - **Caja 1.1 (población objetivo):** `producto.py rehacer <id> 1.1`. Vuelve a pendiente y la caja 2 queda bloqueada hasta que el cliente la apruebe de nuevo. Rehazla **a partir de las respuestas guardadas** del cliente (`proyectos/<id>/puerto-2/respuestas-cliente.json`, con sus observaciones):
     - lee `puerto-2/encargo-rehacer.md`: lo que pidió afinar (con su detalle), los archivos que dejó en `contexto/poblacion/` y si pidió investigar;
     - si pidió investigar en comunidades, haz tú mismo la investigación en comunidades siguiendo `.claude/commands/creacion-investigar-comunidades.md` (que deja el PDF en la carpeta del proyecto), enfocada en lo que pidió;
     - si describió su población o dejó un documento, úsalo como fuente;
     - aplica los cambios en la población (`producto.py poblacion <id> poblacion.md`) y regenera la página (`producto.py puerto <id>`).
     El cliente no tiene que correr otro comando: este es el único para rehacer la 1.1.
2. Toma como base el ciclo anterior y todo lo nuevo:
   - las respuestas del cliente (`respuestas-cliente.json`, incluido «algo más»), sus observaciones y el motivo;
   - en la caja 0, copia `validacion.json` y `sitemap.json` de la vuelta anterior a la nueva y actualízalos;
   - en las demás, parte de la `entrega.md` anterior y rehaz solo lo que cambia.
3. Termina la caja como indica su guía y ciérrala:
   - caja 0: `python _creacion_productos/producto.py validar <id>`;
   - cajas 1 a 11: `python _creacion_productos/producto.py cerrar <id> <n>` (en la 11, antes `producto.py entrega <id>`; una entrega firmada no se rehace: se abre otra vuelta).
4. Termina diciendo:
   - el ciclo en que quedó la caja y qué cambió frente al anterior;
   - que la caja **cumple el mínimo pero falta la aprobación del cliente** (en la página o con `producto.py aprobado <id> <n>`);
   - qué cajas posteriores quedaron bloqueadas y por qué.

**Reglas comunes** (lecciones aprendidas, jerarquía de normas, regla de progreso con máximo 3 pasadas, no romper lo aprobado, Three-Body Balance, pendientes): `_creacion_productos/REGLAS.md`. Léelas antes de empezar.
