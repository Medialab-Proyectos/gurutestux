---
description: Muestra lo que llegó o cambió en la plataforma Synthetica (proyectos nuevos, ejecuciones pedidas, respuestas)
argument-hint: [--todos]
---

Ejecuta `python work/synthetica-plataforma/operador.py nuevos $ARGUMENTS` desde la raíz del repositorio.

- Si dice que no hay sesión, pide al usuario que corra `python work/synthetica-plataforma/operador.py ingresar` en su terminal. La contraseña no se escribe en el chat.
- Resume para cada proyecto: nombre, tipo, quién lo pidió, en qué etapa está y qué hay que hacer.
- Termina con el comando exacto que sigue, normalmente `/synthetica-bajar <id>`.
