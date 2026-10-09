---
description: Corre la caja 4 (maquetación) de un proyecto del motor de creación. Primero el encargo y una parada; con «continuar», Claude diseña las 2 o 3 propuestas como páginas reales con recursos de librerías libres, las revisa y las evalúa completas con los agentes; con «disenador», el encargo queda para un diseñador; con «listas», recibe lo del diseñador
argument-hint: <id> [continuar|disenador|listas]
---

Motor: `_creacion_productos/`. Guía: `_creacion_productos/escenarios/4-maquetacion.md`.

Datos: $ARGUMENTS.

## Sin modo: el encargo, y parada
1. Si la caja no está abierta: `producto.py iniciar <id> 4` (exige la caja 3.1 aprobada).
2. `estado-del-arte.json` con la fecha de hoy: 5 o más referentes de 2025-2026, los competidores de la caja 2 y el estado del arte del color que midió la 3.1.
3. `kleon.json`, medido con `producto.py ideas <id>`.
4. `propuestas.json`:
   - `"disenado_por": "Claude"` (o vacío si lo hará un diseñador);
   - la voz;
   - `libertad_creativa`;
   - las vistas;
   - 2 o 3 propuestas con `reto`, `hipotesis`, `hilo`, `estructura`, `hereda`, `referentes` (4 o más), `busquedas` (2 o más), `principios` (al menos uno de N1 a N5) y `excepciones` si tocan algo aprobado.
5. `producto.py propuestas <id>`: arma el tablero, `usabilidad.json`, `encargo-propuestas.html`, `encargo-propuestas.md` y `prompts.md`.
6. **PARA AQUÍ.** No diseñes ninguna página en HTML. Di que el encargo está listo, con el enlace al tablero y al encargo, y que las propuestas se diseñan cuando el usuario diga «continuar» (`/creacion-vision <id> continuar`).

## Modo «continuar» (el usuario lo pidió)
1. Lee el encargo entero (`encargo-propuestas.html`): es tu insumo.
2. Diseña cada propuesta como página en `diseno/propuesta-<id>/index.html`, con lo común en `diseno/comun/`.
   - **Solo recursos de librerías libres:** fotos de Openverse, Unsplash o Pexels (`producto.py fotos <id> "<búsqueda>"`), e iconos e ilustraciones de licencia abierta. Cada uno como `recursos/propio-<n>`, con su autor, licencia y origen en `recursos/FUENTES.md`.
   - Los recursos propios de un diseñador gráfico son de la caja 4.1: no se encargan aquí.
   - **Sin datos ni testimonios inventados.**
   - **Mantén en cada página:**
     - el encabezado fijo, con `scroll-margin-top` en cada sección;
     - en el celular, el llamado fijo abajo;
     - «Saltar al contenido», foco visible y zonas de 48 px;
     - «Volver arriba» y `prefers-reduced-motion`;
     - y un largo de página parecido al de la caja anterior (L47).
3. `producto.py propuestas <id> --capturar`: corrige y vuelve a capturar hasta que todo esté en orden (textos aprobados, usabilidad ganada, pliegue, axe, lecciones).
4. Revisa cada vista mirándola, sección por sección, en computador y celular.
5. `producto.py propuestas <id> --estudiar`: **la evaluación completa** de cada propuesta con los agentes. Tarda unos minutos por propuesta; corre en segundo plano.
6. `producto.py propuestas <id> --listas`: agrega la pregunta «propuesta».
7. Escribe `entrega.md` (quién diseñó, cómo, qué se heredó, qué se comprobó y los supuestos), `logros.txt` y `lecciones-caja.json`.
8. Cierra con `producto.py cerrar <id> 4` y revisa el informe del cliente.

## Modo «disenador»
1. Los pasos 1 a 5 de «sin modo».
2. Entrega el enlace del encargo (`encargo-propuestas.html`) y del tablero.
3. El diseñador entrega páginas (`diseno/propuesta-<id>/index.html`) con recursos libres. Después, modo «listas».

## Modo «listas» (llegó lo del diseñador)
Pasos 3 a 8 de «continuar».

## Al aprobar
- La propuesta elegida entra sola en la base de referencias que gustan (`producto.py gusto` para sumar otras).
- Sigue la caja 4.1 (`/crear-imagenes <id>`): el cliente ve el material gráfico de la propuesta elegida y decide si lo acepta o pide recursos propios.

**Lecciones aprendidas, jerarquía de normas y regla de progreso:** como en toda caja (ver `/creacion-escenario`).
