---
name: ux-klm-goms
description: Usa KLM y GOMS para diseño y auditoría UX. Ideal para analizar eficiencia de tareas, comparar flujos, detectar fricción operativa y proponer mejoras accionables.
---

# UX Skill — KLM + GOMS

## Propósito

Este skill ayuda a Claude Code a analizar interfaces, journeys y tareas usando:

- **GOMS**: descompone la tarea en Goal, Operators, Methods y Selection rules.
- **KLM**: estima tiempo de ejecución para usuarios expertos mediante operadores de bajo nivel.

Úsalo para:

- auditorías UX;
- comparación entre flujo actual vs. flujo propuesto;
- rediseño de tareas frecuentes;
- análisis de fricción en desktop, web apps y herramientas internas;
- argumentar mejoras con base en eficiencia operativa.

## Cuándo activarlo

Activa este skill cuando el usuario pida alguno de estos resultados:

- “audita este flujo”
- “compara estas dos versiones”
- “reduce pasos / clics / tiempo”
- “estima fricción”
- “detecta complejidad operativa”
- “justifica por qué una versión es mejor”
- “haz una auditoría UX basada en eficiencia”

## Cuándo NO activarlo

No lo uses como método principal si el problema depende más de:

- emoción y branding;
- onboarding de principiantes;
- comprensión semántica del contenido;
- accesibilidad profunda;
- insights conductuales sin tareas operativas claras.

En esos casos, complétalo con heurísticas, accesibilidad, JTBD, investigación o pruebas de usabilidad.

## Supuestos del análisis

Antes de analizar, asume explícitamente:

1. El modelo KLM aplica mejor a usuarios con experiencia.
2. La tarea debe tener inicio y fin claros.
3. La interfaz debe ser suficientemente concreta para descomponer acciones.
4. Si faltan datos, trabaja con supuestos explícitos y no inventes precisión falsa.

## Método de trabajo

### Paso 1. Definir la tarea

Describe:

- objetivo del usuario;
- contexto;
- punto de inicio;
- criterio de éxito;
- dispositivo;
- frecuencia de uso;
- criticidad.

### Paso 2. Construir GOMS

Descompón así:

- **Goal**: qué quiere lograr el usuario.
- **Operators**: acciones observables del usuario.
- **Methods**: camino para completar la tarea.
- **Selection rules**: cómo elige entre varios caminos.

### Paso 3. Construir KLM

Descompón la tarea en operadores simples. Usa esta convención práctica:

- **K** = teclear / pulsar tecla / tap corto
- **P** = apuntar o mover el cursor a un objetivo
- **B** = clic o presión sobre botón
- **H** = cambio mano-teclado-mouse o cambio de modo
- **M** = preparación mental / decisión simple
- **R** = tiempo de respuesta del sistema

Si el entorno es móvil, adapta:

- tap como K/B según convenga;
- scroll corto como operador explícito;
- cambio de foco o contexto como H o M según el caso.

### Paso 4. Evaluar fricción

Detecta:

- pasos redundantes;
- clics evitables;
- cambios de contexto;
- decisiones innecesarias;
- dependencia de memoria;
- validaciones tardías;
- saltos visuales;
- esperas del sistema;
- ambigüedad entre caminos.

### Paso 5. Proponer mejora

Cada mejora debe responder:

- qué fricción elimina;
- qué operador reduce;
- cómo cambia el método;
- impacto esperado en tiempo, carga cognitiva y claridad.

### Paso 6. Entregar conclusión

Termina con:

- flujo más eficiente;
- por qué;
- riesgos;
- qué validar con usuarios;
- prioridad sugerida.

## Formato de salida obligatorio

Usa siempre esta estructura:

### 1. Objetivo de la tarea

### 2. Supuestos

### 3. GOMS del flujo actual

### 4. KLM del flujo actual

### 5. Hallazgos de fricción

### 6. Propuesta de mejora

### 7. GOMS del flujo propuesto

### 8. KLM del flujo propuesto

### 9. Comparativo actual vs propuesto

### 10. Recomendación UX priorizada

## Reglas de calidad

- No inventes tiempos exactos si no hay suficiente detalle.
- Expón los supuestos.
- No confundas eficiencia con experiencia total.
- Si hay dos opciones, compara ambas con el mismo criterio.
- Si la UI no está completa, entrega análisis parcial pero útil.
- Prioriza tareas de alto valor, alta frecuencia o alto riesgo.
- Señala cuando la mejora aparente puede afectar descubribilidad o confianza.

## Plantilla breve de auditoría

Usa esta plantilla cuando el usuario pida rapidez:

- Tarea:
- Usuario:
- Dispositivo:
- Goal:
- Método actual:
- Operadores KLM:
- Fricciones:
- Tiempo relativo estimado:
- Oportunidad principal:
- Recomendación:
- Prioridad:

## Plantilla breve de diseño

Usa esta plantilla cuando el usuario pida rediseñar:

- Objetivo del rediseño:
- Tarea principal:
- Decisiones a reducir:
- Pasos a eliminar:
- Elementos a fusionar:
- Validaciones a anticipar:
- Feedback inmediato necesario:
- Resultado esperado:
- Riesgos del cambio:

## Comandos de activación sugeridos

Ejemplos de prompts donde este skill aplica:

- “Audita este flujo de checkout usando KLM y GOMS.”
- “Compara la versión A y B del formulario según eficiencia operativa.”
- “Rediseña este journey para reducir carga cognitiva y pasos.”
- “Analiza esta pantalla y detecta fricción de tarea.”
- “Haz una auditoría UX de esta funcionalidad basada en KLM-GOMS.”
