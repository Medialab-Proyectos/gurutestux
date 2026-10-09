---
description: Trae de la plataforma lo que respondió el cliente de un proyecto completo y dice qué darle al motor de creación
argument-hint: <id del proyecto en la plataforma>
---

1. Ejecuta `python work/synthetica-plataforma/operador.py respuestas $ARGUMENTS` desde la raíz del repositorio. Deja un archivo por vuelta en la carpeta del proyecto de la plataforma (`respuestas/escenario-N-vuelta-K.md`), con lo que respondió el cliente: si le gusta, si cumple, las preguntas del escenario y sus dudas.
2. Resume lo que dijo, en especial las dudas: se responden al cerrar la vuelta siguiente con `--respuesta`.
3. Sigue con lo que indique el comando, siempre en el motor de creación, que es independiente:
   - **Otra vuelta:** `/creacion-escenario <id del motor> <n> <archivo de respuestas>`.
   - **Aprobado:** `python _creacion_productos/producto.py aprobado <id del motor> <n>` y luego `/creacion-escenario <id del motor> <n+1>`.
   - **Todavía revisando:** no hay nada que hacer.
