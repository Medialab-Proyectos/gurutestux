---
description: Ejecuta un escenario (1 a 11, con 3.1 y 4.1) de un proyecto con el motor de creación de productos
argument-hint: <id> <número de escenario> [archivo con las respuestas del cliente]
---

Motor: `_creacion_productos/` (independiente de la plataforma). Lee `_creacion_productos/REGLAS.md` (reglas comunes de todas las cajas) y la guía de la caja, `_creacion_productos/escenarios/<n>-*.md`. Lo que una caja valida y muestra está en su entrada de `ganchos.py`.

Datos: $ARGUMENTS

1. **Abre la vuelta:** `python _creacion_productos/producto.py iniciar <id> <n>` (con `--respuestas <archivo>` si te dieron las respuestas del cliente). No abre si una caja anterior no está completa (cumple el mínimo **y** la aprobó el cliente) o si faltan sus entradas: la 1 exige el sitemap y la plataforma; la 2, la población objetivo (`/creacion-poblacion <id>`). Si la caja ya se hizo, usa `/creacion-rehacer <id> <n>`.
2. **Lee `entrada.md`** (contexto, cajas anteriores, lo que respondió el cliente, lecciones, normas establecidas y el cuerpo que empuja la caja) y sigue la guía.
3. **Deja en la vuelta** lo que pide REGLAS.md §1 y la guía. En las cajas con agentes, las tres versiones del prototipo (REGLAS.md §3).
4. **Cierra:** `python _creacion_productos/producto.py cerrar <id> <n>`. Si el cliente dejó dudas, respóndelas con `--respuesta "…"`.
5. **Termina diciendo** qué quedó, qué supuestos se tomaron y qué conviene que valide el cliente. La caja cumple el mínimo al cerrarse; queda completa cuando el cliente la aprueba.

Orden: 0, 1 (puerto 1.1), 2, 3, 3.1 color, 4 maquetación, 4.1 imagen, 5 gráfica y psicológica, 6, 7, 8, 9 punto de control, 10 futuro (opcional), 11 aceptación.

| Caja | Lo particular (el detalle, en su guía) |
|---|---|
| 2 | Protopersonas, empatía, journeys, sistema de diseño, auditoría competitiva (búsqueda profunda si el cliente no da competidores), mejoras y estudio ligero. `producto.py protopersonas <id>` pone los rostros y prepara el estudio. |
| 3 | Parte de la última versión del producto con las protopersonas globales; `normas.json` por criterio vigente de `bases/normas.json`; estudio ligero. |
| 3.1 | Solo el color: marco de color, tres gamas (más tres de respaldo en el primer ciclo), muestra por gama, `producto.py grafico <id> 3.1`. Sin agentes. |
| 4 | `/creacion-vision <id>`: el encargo y **parada** hasta que el usuario diga «continuar»; luego 2 o 3 propuestas con recursos de librerías libres, evaluadas completas con los agentes. |
| 4.1 | Se arma sola al aprobar la 4 (`/crear-imagenes <id>` solo si el cliente pide recursos propios). Sin agentes. |
| 5 | Paso 0: maquetar la propuesta elegida; lo que recomendó la evaluación de la 4; normas gráficas; un estudio con `-Entregas ambas`. |
| 6 a 8 | Normas de su base con fuentes y evidencias; estudio y usabilidad ganada. La 8 (gamificación) es experimental: «tecnicas» y «experimento». |
| 9 | Punto de control (`producto.py control <id>`); el motor agrega la pregunta «futuro». |
| 10 | Opcional, futurista y sin agentes (`futuro.json`, auditorías Zero UI y ética). |
| 11 | `producto.py entrega <id>`: el cliente descarga y firma el acta. |
