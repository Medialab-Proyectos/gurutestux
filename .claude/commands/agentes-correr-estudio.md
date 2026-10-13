---
description: Ejecuta un estudio de agentes sintéticos (completo o ligero, de todo el producto o de algunos flujos) y resume sus resultados
argument-hint: [proyecto] [personas] [completo|ligero] [ux|ui|ambas] [con|sin experto] [alcance opcional: ids, links o descripción del flujo] [visible|headless]
---

Sigue la guía `_agentes_sinteticos/guias/3-CORRER-ESTUDIO.md`.

Datos que da el usuario: $ARGUMENTS

Haz esto:

1. **Qué pide el estudio** (tres decisiones que se combinan):
   - **Tipo:** `completo` (por defecto) o `ligero`, que no ejecuta KLM ni GOMS y navega rápido, sin esperas humanas ni
     video (`-Tipo ligero`). Si el usuario habla de un prototipo o de una etapa temprana, propón `ligero`.
   - **Entregas:** UX, UI o ambas (`-Entregas ux|ui`; por defecto, ambas).
   - **Experto:** con o sin agente experto (`-SinExperto`). Sin experto se entrega solo lo que vivieron los agentes: sin
     mediciones del experto sobre la interfaz, SEO/GEO/AEO, UX Green, anatomía de componentes ni propuestas estéticas.
   - **Protopersonas (solo ligero):** si el estudio llega con un archivo de quiénes son las personas, déjalo en
     `proyectos/<id>/protopersonas.md|json` o pásalo con `-Protopersonas`. Muestra cómo quedaron con
     `python -m agentes_sinteticos.protopersonas --proyecto proyectos/<id>.json` antes de lanzar. Una persona por
     protopersona, sin variantes; se repiten idénticas mientras el archivo no cambie.
   - **Growth (opcional, se pide desde el inicio):** `-Growth` agrega la pestaña «Evaluación de growth» (adquisición,
     activación, retención, referido e ingresos según el tipo de producto). Si el proyecto no declara `tipo_producto` y
     `objetivo_dominante`, pídelos antes de lanzar.
   - **Plan (solo ligero, automático):** antes de lanzar muestra el plan con
     `python -m agentes_sinteticos.planificador_ligero --proyecto proyectos/<id>.json [--presupuesto-min N]`
     (personas, segmentos, escenario, descubrimiento esperado y Good-Turing). El lanzador lo aplica solo; `-PresupuestoMin`
     también elige flujos y `-SinPlan` lo desactiva.
2. **Alcance.** Si el usuario quiere solo parte del producto, tradúcelo a `-Recorridos` (ids), `-Urls` (links o rangos
   como `"casos/*"`) o `-Alcance "descripción del flujo"`, que se pueden combinar. Antes de lanzar, muestra qué recorridos
   quedan dentro con `python -m agentes_sinteticos.cli --listar recorridos --proyecto proyectos/<id>.json` y confírmalo.
3. Ejecuta la prevalidación en web y móvil. Si falla, arregla primero los recorridos y dilo claro: el producto cambió.
4. Lanza siempre con `ejecutar-estudio-completo.ps1` (desde Bash: `powershell.exe -NoProfile -ExecutionPolicy Bypass -File
   ejecutar-estudio-completo.ps1 -Proyecto proyectos/<id>.json -PersonasBase N [-Tipo ligero] [-Entregas ux|ui] [-SinExperto] [-Growth] [-PresupuestoMin N] [-SinPlan] [-Protopersonas …] [-Recorridos …] [-Urls …]
   [-Alcance "…"] -NoAbrir`, con la salida redirigida). `-Visible` muestra las ventanas; `-SinVideo` desactiva el video.
5. Mientras corre, no adelantes resultados.
6. Al terminar, empieza por «Qué nos dicen los indicadores» (titular, contradicciones y qué hacer primero) y resume: tipo, entregas, experto y alcance, cobertura de pasos y de vistas, obstáculos y cómo reaccionaron los agentes,
   recorridos a priorizar y qué quedó sin recorrer y por qué.
7. Distingue siempre un hallazgo del producto de un límite de medición del evaluador.
8. El lanzador completa solo los recorridos que quedaron sin evaluar y los incorpora al mismo estudio. Nunca relances un
   estudio entero sin que el usuario lo pida. Nada con costo.
