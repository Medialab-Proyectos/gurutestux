---
description: Lleva un estudio sintético por cajas (1 datos y contexto, 2 previo con aprobación, 3 informe, 4 resumen y futuro)
argument-hint: [id del proyecto] [acción opcional: nuevo | previo | ejecutar | estado | resumen | mercado | abrir]
---

Módulo: `_agentes_sinteticos/agentes_sinteticos/cajas_estudio.py` (servicio local: `servicio_cajas.py`, http://127.0.0.1:8796).
Todo queda en `proyectos/<id>/cajas/`. Ejecuta desde `_agentes_sinteticos` con `PYTHONPATH=.`.

Datos que da el usuario: $ARGUMENTS

1. **Estado:** `python -m agentes_sinteticos.cajas_estudio estado <id>` y dilo en palabras: qué caja está en curso y qué falta.
2. **Caja 1 · datos y contexto:** el cliente sube uno o más **zip (10 MB entre todos)** o escribe el contexto; al
   **cerrar la caja** pide el análisis (`cerrar <id>`): se asignan la experta UX, el experto UI y el de growth si lo pidió o
   el producto lo amerita, y los datos de ese ciclo quedan de solo lectura (carpeta `contexto/ciclo-N/`).
   Detalle:
   - Proyecto nuevo: `nuevo <id> --nombre … --url … --objetivo …`; uno existente: `desde-proyecto <id>`.
   - El cliente completa el resto y sube archivos en `abrir <id>`, o tú con `agregar <id> <archivos>`. El contexto se acumula y nunca se borra.
   - En un ciclo nuevo, el cliente puede dejar fuera archivos de ciclos anteriores («Usar en este ciclo»): no se borran.
     **Para el análisis lee solo `caja-1/ciclo-N/contexto-vigente.json` → `leer`** (lo de `no_leer` no se tiene en cuenta).
   - Grabaciones o datos de personas reales: si los hay (en los archivos o en un enlace), pásalos a `datos_humanos/` y
     calibra con `calibracion_humana`; si no, los tiempos quedan como modelados.
   - Personas: de 1 a 5 con el selector (3 recomendado; 4 sube el costo; 5 es el máximo).
   - La contraseña va a `proyectos/<id>/acceso.json`. Nunca la imprimas.
3. **Caja 2 · previo:**
   - Si el proyecto no tiene recorridos ni personas, prepáralos con `/agentes-iniciar-proyecto` usando el contexto.
   - Respeta los segmentos de la caja 1 (de A a B) y arma el previo: `previo <id> [--motivo "…"]`.
   - Si el cliente pide ajustes, la caja 1 se reabre en un ciclo nuevo (`ajustes <id> --motivo …`); al cerrarla otra vez,
     lee el motivo y el contexto nuevo, decide si las personas cambian o se mantienen (el previo lo dice) y rehaz el previo.
   - Cada caja guarda una versión por ciclo: `/<id>/ciclo-N/caja-1`, `caja-2`, `estudio/` y `caja-4` (solo lectura).
4. **Caja 3 · informe:** un «sí» en el previo lanza el estudio solo (desde el servicio). Desde la consola, solo con un sí registrado: `responder <id> --si` y `ejecutar <id>`. El informe es el `index.html` del estudio, sin cambios.
5. **Caja 4 · resumen y futuro:** se arma sola cuando termina el estudio (`estado` o `resumen <id>`). **No repite errores
   del producto actual** (están en Recomendaciones UX y UI): propone lo que productos similares ofrecen y este no considera
   (`futuro.py`): flujos que aumentan el engagement, **lo que el mercado ya hace**, UI sobre tendencias y growth a futuro.
   - **Lo que el mercado ya hace** = buenas prácticas de empresas similares **con el mismo tipo de producto**, no integraciones.
     Con la acción `mercado` (`python -m agentes_sinteticos.cajas_estudio mercado <id>` crea `proyectos/<id>/mercado.json`):
     1. Competidores: primero los que nombra el cliente o el contexto; si no hay, búscalos (mismo producto, público y
        mercado) y registra las `consultas`. De 3 a 5 empresas, cada una con su `origen` y `por_que_similar`.
     2. Visita sus sitios y anota cada práctica con `lo_hacen` (empresa, `donde` y `evidencia` de lo que se ve), una
        `referencia` que la respalde y `senales` para saber si este producto ya la tiene. Nada inventado: solo lo visto.
     3. `resumen <id>`: las prácticas que hacen más empresas van primero, con «Lo hacen: …». Sin `mercado.json`, la sección
        muestra prácticas comunes del tipo de producto y dice que todavía no se comparó con competidores.
6. Nunca ejecutes el estudio sin un «sí» en la caja 2. Nada con costo; no relances un estudio entero.
