---
description: Lee el material que entregó el cliente (preguntas «¿Incluimos …?» y barra de pendientes) con todo el esfuerzo posible y le vuelve a pedir solo lo que no se pudo leer, con el motivo
argument-hint: <id del proyecto>
---

Motor: `_creacion_productos/` (módulo `material.py`). Sirve para cualquier proyecto.

Datos: $ARGUMENTS

1. **Primera pasada, automática:** `python _creacion_productos/producto.py material <id>`.
   - Busca cada archivo que entregó el cliente: en las preguntas «¿Incluimos …?» de las cajas y en la barra «Lo que nos falta de ti».
   - Intenta leerlo: descomprime los ZIP, saca el texto de PDF, Word, Excel y PowerPoint, abre imágenes y SVG y prueba varias codificaciones de texto.
   - Deja cada archivo en `material-recibido.json` del proyecto, con un estado: `leido`, `revisar` o `no_legible`.
2. **Segunda pasada, la tuya, con todo el esfuerzo:** cada archivo en `revisar`, y cada `no_legible` que pueda tener arreglo, se intenta a mano:
   - **Imágenes:** ábrelas con Read y míralas. ¿Son el logo, la foto o el material que se pidió? ¿Tienen la calidad suficiente?
   - **PDF sin texto:** mira sus páginas con Read (`pages`). Si es un escaneo, transcribe lo que hace falta.
   - **Formatos viejos o raros** (.doc, .xls, .heic, .ai, .psd, .eps): conviértelos con las herramientas instaladas, si las hay. Si no, ábrelos como se pueda.
   - **Si dejó un enlace de descarga**: no descargues nada con costo ni que pida iniciar sesión. Si el enlace es público, descárgalo en una carpeta nueva dentro de `contexto/` y trátalo como un archivo más.
   - **Lo que se pidió:** compara cada archivo con lo que pedía su elemento (`material-ejemplos.json` de la caja). Por ejemplo, un testimonio sin nombre ni permiso no sirve tal cual.
   - **Tu veredicto:** `producto.py material <id> --marcar <archivo> --estado leido|no_legible --contiene «qué trae» --motivo «por qué no» --intento «qué probaste»`.
     El motivo es lo que verá el cliente: escríbelo en sus palabras y con lo que puede hacer. Por ejemplo: «el PDF tiene contraseña: envíalo sin ella».
3. **Llevarlo a la barra del cliente:** `producto.py material <id> --aplicar`.
   - Lo que no se pudo leer se le vuelve a pedir en «Lo que nos falta de ti», con el motivo y lo que se intentó. Cuando abre la caja, ve solo eso.
   - Lo que respondió «No, no lo quiero» sale de la barra; «Aún no lo tengo» se queda como pendiente.
4. **Termina diciendo:** qué se leyó y qué trae cada archivo, qué se le volvió a pedir y por qué. Di también que lo leído entra en la versión 1 de la caja siguiente, donde se incorpora al producto y se mide con los agentes. Eso no se hace aquí.

Nada del cliente se descarta en silencio. Nada se usa en el producto sin haberlo podido leer.
