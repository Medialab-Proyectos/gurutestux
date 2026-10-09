---
description: Baja un proyecto de la plataforma Synthetica (ficha y documentos) y lo deja listo para su motor
argument-hint: <id del proyecto>
---

1. Ejecuta `python work/synthetica-plataforma/operador.py bajar $ARGUMENTS` desde la raíz del repositorio.
2. La carpeta queda en `work/synthetica-plataforma/proyectos/`, fuera de git. Nunca subas su contenido a GitHub.
3. Según el tipo:
   - **Sintético:** sigue con `/agentes-iniciar-proyecto` usando el `arranque.json` que dejó el comando. No modifiques `_agentes_sinteticos` fuera de lo que indica su guía.
   - **Completo:** sigue con `/creacion-iniciar-proyecto <id> <carpeta>`, con el id y la carpeta que dejó el comando. El motor de creación (`_creacion_productos/`) es independiente: solo recibe esa carpeta de contexto.
4. **Sintético:** deja corriendo en segundo plano `python work/synthetica-plataforma/operador.py vigilar`. Cada minuto lee lo que el motor deja en disco, sin tocarlo: proyecto, cohorte, recorridos, agentes que terminan e informe. Reporta cada paso a la plataforma y publica los hallazgos para auditar. Si el id en el motor no es el del `arranque.json`, liga el proyecto con `operador.py vincular <id> <id en el motor>`.
5. **Completo:** deja corriendo el vigilante (`python work/synthetica-plataforma/operador.py vigilar`). Publica al cliente cada escenario que el motor abre o cierra. Las opiniones del cliente se traen con `/synthetica-respuestas <id>`.
