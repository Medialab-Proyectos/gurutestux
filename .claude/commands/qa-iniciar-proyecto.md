---
description: Inicia un proyecto del motor de QA visual (pixel perfect) a partir de una carpeta de contexto
argument-hint: <id> <carpeta>
---

Motor: `_qa_visual/` (independiente de la plataforma). Lee su `README.md`.

Datos: $ARGUMENTS

1. Corre `python _qa_visual/qa.py nuevo <id> <carpeta>` desde la raíz del repositorio. La carpeta trae `qa.json` o el `proyecto.json` de la plataforma (lo deja `/synthetica-bajar`) y, si hace falta, `credenciales.json`.
2. Resume al usuario:
   - la meta;
   - cuántos enlaces del diseño hay (Figma o web) y cuántas direcciones del producto real;
   - los grupos de credenciales, **solo sus nombres**, nunca los valores.
3. Si hay enlaces de Figma, comprueba que haya token: `figma_token` del cliente o `FIGMA_TOKEN` en `_qa_visual/.env`. Si no hay ninguno, dile al usuario que hace falta el token del equipo (de solo lectura, gratis, en figma.com → Settings → Security → Personal access tokens) en `_qa_visual/.env`. Que no lo pegue en el chat.
4. Sigue con `/qa-caja <id> 1`.
