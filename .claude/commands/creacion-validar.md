---
description: Escenario 0 del motor de creación: valida si el contexto del proyecto alcanza para empezar y dice qué falta
argument-hint: <id> [archivo con las respuestas del cliente]
---

Motor: `_creacion_productos/` (independiente de la plataforma). Lee su `README.md` y la guía `_creacion_productos/escenarios/0-validacion-del-contexto.md`.

Datos: $ARGUMENTS

1. Si ya hay una validación anterior y llegaron documentos o respuestas, usa `/creacion-reevaluar <id>` en su lugar. Abre la vuelta: `python _creacion_productos/producto.py validar <id>`. Si te dieron un archivo con las respuestas del cliente, agrégalo con `--respuestas <archivo>`. Si el cliente mandó documentos nuevos, antes corre `python _creacion_productos/producto.py agregar <id> <carpeta o archivo>`.
2. Lee `entrada.md` y **todos** los documentos que lista, completos. No te bases solo en la ficha.
3. Califica los diez criterios de la guía, repartidos en los cinco planos de Garrett, con nivel 0, 1 o 2 según lo que está escrito y no según lo que se pueda deducir. Los obligatorios son objetivo, población, nombre, alcance, requerimientos y plataforma; los opcionales, flujo, restricciones, referentes y marca. Escribe `validacion.json` en la vuelta con la forma que indica la guía: fuente en los niveles 1 y 2, supuesto en el nivel 1, y pregunta para el cliente en los niveles 0 y 1. Formula cada pregunta como `si_no` u `opciones` siempre que se pueda, para que el cliente responda con una casilla.
3b. Escribe `sitemap.json`, lo que entrega la caja 0: la estructura propuesta de la visión del usuario a la del negocio, desde la base del estado del arte (`python _creacion_productos/producto.py arquetipos <descripción>`). Sigue el paso «Estructura» de la guía: además del árbol, esquema de organización y navegación (Rosenfeld, Morville y Arango), hipótesis (Lean UX), cómo se validará la estructura (tree testing) y Objetivo de Producto con backlog (PSU de Scrum.org). Si ningún arquetipo encaja, primero `/creacion-actualizar-arquetipos`.
4. Corre otra vez `python _creacion_productos/producto.py validar <id>`. El motor calcula el grado, escribe `validacion.md`, `preguntas.md` y el informe `validacion.html` (misma estructura gráfica que los informes de estudio) y deja el paso 0 como aprobado (si pasa el umbral recomendado) o insuficiente. Si reclama algo de `validacion.json`, corrígelo y vuelve a correrlo. No escribas el grado a mano.
5. Termina con:
   - el grado y si alcanza, la letra de cada plano de Garrett y una tabla corta de los diez criterios;
   - la estructura propuesta: arquetipo, origen (del cliente, construida o mixta), páginas principales, hipótesis y avisos del sitemap, con el enlace a `estructura.html`;
   - dónde responde el cliente: `python _creacion_productos/producto.py abrir <id>` arranca el servicio si no corre y abre el índice de cajas (`http://127.0.0.1:8795/<id>/`). En el informe del paso 0, cada respuesta se graba sola y, si pasa el umbral recomendado, el paso queda aprobado;
   - **Paso aprobado:** los supuestos que pasan al escenario 1 y el comando `/creacion-escenario <id> 1`;
   - **Falta información:** las preguntas para el cliente, tal como quedaron en `preguntas.md`, listas para enviar.

**Reglas comunes** (lecciones aprendidas, jerarquía de normas, regla de progreso con máximo 3 pasadas, no romper lo aprobado, Three-Body Balance, pendientes): `_creacion_productos/REGLAS.md`. Léelas antes de empezar.
