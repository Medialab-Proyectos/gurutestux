---
description: Baja un proyecto de la plataforma Synthetica (ficha y documentos) y lo deja listo para su motor
argument-hint: <id del proyecto>
---

La plataforma **observa** a los motores: dibuja las cajas que cada uno declara en su foto (`plataforma.json`, contrato `synthetica.estado/v1`), publica sus páginas (el espejo) y les lleva lo que el cliente hace en ellas (el relé). El detalle está en `work/synthetica-plataforma/INTEGRACION.md`.

1. Ejecuta `python work/synthetica-plataforma/operador.py bajar $ARGUMENTS` desde la raíz del repositorio. La carpeta queda en `work/synthetica-plataforma/proyectos/`, fuera de git. Nunca subas su contenido a GitHub.
2. Sigue con el comando que imprime, según el tipo. El proyecto ya queda vinculado a su motor:
   - **Sintético:** `python -m agentes_sinteticos.cajas_estudio nuevo …` y `agregar …`, desde `_agentes_sinteticos/`. El estudio va por cajas, y el cliente completa la caja 1 desde la plataforma.
   - **Completo:** `/creacion-iniciar-proyecto <id> <carpeta>`.
   - **QA visual:** `/qa-iniciar-proyecto <id> <carpeta>`.
3. Deja corriendo en segundo plano `python work/synthetica-plataforma/operador.py vigilar`. En cada pasada, por proyecto:
   - pide la foto al motor y la valida;
   - publica la foto y las páginas vigentes;
   - aplica lo que el cliente hizo en la plataforma (el buzón).

   Entre pasadas revisa el buzón cada 10 s, o cada 3 s con una ayuda abierta o actividad reciente.
4. `python work/synthetica-plataforma/operador.py foto <id>` muestra cada caja con su estado, quién tiene la pelota y su riesgo. Lo que el cliente aprueba llega solo al motor. La caja siguiente la lanzas tú, con el comando del motor, cuando el usuario lo pida.
5. Si un proyecto ya existía en un motor, vincúlalo con `operador.py vincular <id> <id en el motor> --motor qa|creacion|agentes`.
