---
description: Inicia un proyecto de agentes sintéticos para evaluar un producto nuevo
argument-hint: [id] [url] [carpeta de documentos]
---

Sigue la guía `_agentes_sinteticos/guias/1-INICIAR-PROYECTO.md`.

Datos que da el usuario: $ARGUMENTS

Haz esto en orden y pregunta solo lo que falte:

1. Lee la guía y confirma qué datos tienes: identificador, nombre, URL, público, carpeta de documentos y entorno.
2. Crea el esqueleto con `python -m agentes_sinteticos.nuevo_proyecto`.
3. Rellena `fuentes` con la carpeta de documentos, ingiérelos y propón el bloque `supuestos` con lo que diga el usuario y lo que veas en el producto.
4. Rastrea la URL para reconocer las vistas y propón un borrador de recorridos con metas humanas, no clics.
5. Lee los documentos ingeridos y propón la cohorte, citando en `fuente` de dónde sale cada rasgo.
6. **Pregunta qué producto es y qué busca** (no lo infieras) y fíjalo en el proyecto:
   - `tipo_producto`: corporativo, landing, ecommerce, marketplace, saas, transaccional, app-movil, herramienta-interna,
     educacion, finanzas, salud, gobierno, agentico o general (otro o híbrido). Los ids anteriores (portal-b2b…) siguen valiendo.
   - `objetivo_dominante`: informar, vender, convertir, operar, gestionar, consultar, aprender, colaborar, decidir o automatizar.
   Decide qué etapas de growth aplican si un estudio pide `-Growth` (`agentes_sinteticos/tipologia.py`). Después actualiza sus tendencias con la búsqueda de `/agentes-actualizar-tendencias`: el esqueleto trae `tendencias.json` con el catálogo base.
7. Ejecuta `--simular` y la prevalidación; no des el proyecto por iniciado hasta que ambas pasen.
8. Cierra repasando la lista de comprobación de la guía y di qué queda pendiente de decidir por una persona.
