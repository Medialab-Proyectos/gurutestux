---
description: Rehace el userflow y los recorridos cognitivos de un proyecto después de un feedback
argument-hint: [proyecto] [motivo o reunión del feedback]
---

Sigue la guía `_agentes_sinteticos/guias/5-REHACER-FLUJOS.md`.

Datos que da el usuario: $ARGUMENTS

Haz esto:

1. Si hay una reunión o archivo de feedback, léelo y resume qué cambia en los flujos.
2. Corre `python -m agentes_sinteticos.rehacer_flujos` con `--motivo`, `--fuente` y `--movil`.
3. Lee `historial/revision-<fecha>.md` y explica qué recorridos se rompieron, qué vistas nuevas no tienen recorrido y cuáles desaparecieron.
4. Propón los cambios a `recorridos.json` apoyándote en el feedback y en los borradores. Lo que la persona intenta lograr en una vista nueva sale del feedback, no del rastreo: si no está claro, pregúntalo.
5. Tras editar, vuelve a correr el comando con el mismo motivo hasta que los flujos queden al día, y resume qué cambió entre versiones.
6. Avisa que los estudios anteriores no se comparan de forma directa con los nuevos.
