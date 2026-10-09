---
description: Inicia un proyecto del motor de creación de productos a partir de una carpeta de contexto
argument-hint: [id] [carpeta de contexto] [url del producto actual, si existe]
---

Motor: `_creacion_productos/` (independiente de la plataforma). Lee su `README.md`.

Datos que da el usuario: $ARGUMENTS

1. Confirma el identificador (corto, sin espacios), la carpeta de contexto y, si existe, la URL del producto actual. Pregunta solo lo que falte.
2. Crea el proyecto: `python _creacion_productos/producto.py nuevo <id> <carpeta> --nombre "…" [--url …]`. Copia el contexto a `proyectos/<id>/contexto/`.
3. Sigue con `/creacion-validar <id>` (escenario 0): valida si el contexto alcanza para empezar. El escenario 1 no se abre hasta que el contexto esté validado como suficiente.
