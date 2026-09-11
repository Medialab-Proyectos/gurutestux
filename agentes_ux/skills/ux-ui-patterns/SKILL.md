---
name: ux-ui-patterns
description: Usa patrones UX/UI para diseñar, evaluar y auditar interfaces digitales. Selecciona patrones adecuados, detecta anti-patrones y propone mejoras justificadas por usabilidad, accesibilidad, claridad cognitiva y consistencia.
---

# UX/UI Patterns Skill

## Propósito

Esta skill ayuda a diseñar y auditar productos digitales usando patrones de UX y UI reconocidos, con foco en:

- navegación
- descubrimiento y búsqueda
- entrada de datos
- feedback del sistema
- presentación de información
- onboarding
- conversión
- confianza
- accesibilidad
- prevención de errores
- comportamiento y carga cognitiva

## Cuándo usar esta skill

Usa esta skill cuando la tarea implique:

- diseñar una nueva pantalla, flujo o módulo
- escoger entre varias soluciones de UI
- justificar por qué un patrón es mejor que otro
- auditar una interfaz existente
- detectar fricción, inconsistencias o anti-patrones
- mejorar conversión, comprensión o completitud de tareas
- revisar formularios, dashboards, tablas, modales, navegación o estados vacíos
- evaluar si una solución se ajusta a buenas prácticas de usabilidad y accesibilidad

## Cuándo NO usar esta skill

No la uses como marco principal cuando la tarea sea:

- puramente visual o de branding sin implicaciones de interacción
- copywriting aislado sin estructura de experiencia
- implementación técnica sin decisiones de UX/UI
- análisis legal, financiero o de negocio sin interfaz

## Resultado esperado

Al usar esta skill, entrega siempre:

1. diagnóstico del problema
2. patrón o familia de patrones recomendada
3. razón de uso
4. riesgos o trade-offs
5. propuesta concreta de UI o mejora
6. validaciones de usabilidad y accesibilidad
7. anti-patrones evitados
8. siguiente paso sugerido

## Método de trabajo

Sigue este proceso:

### Paso 1: Identificar el contexto

Define:

- tipo de producto
- tipo de usuario
- objetivo principal de la pantalla
- frecuencia de uso
- criticidad de la tarea
- dispositivo principal
- restricciones visibles del sistema

### Paso 2: Clasificar el problema

Ubica el caso en una o más familias:

- navegación
- búsqueda y descubrimiento
- formularios y captura de datos
- feedback y estados
- visualización de información
- toma de decisión
- onboarding y aprendizaje
- confianza y seguridad
- conversión
- accesibilidad
- prevención o recuperación de errores

### Paso 3: Seleccionar patrones candidatos

Para cada problema, propone de 1 a 3 patrones adecuados.
No propongas patrones solo por moda. Prioriza:

- claridad
- reducción de carga cognitiva
- reconocimiento sobre recuerdo
- consistencia
- prevención de errores
- accesibilidad
- escalabilidad
- eficiencia de uso

### Paso 4: Justificar

Explica:

- por qué el patrón encaja con la tarea
- qué problema resuelve
- qué costo cognitivo reduce
- cómo mejora comprensión, rapidez o confianza
- cuándo podría no funcionar

### Paso 5: Revisar riesgos

Evalúa:

- sobrecarga visual
- exceso de pasos
- interacción escondida
- dependencia de memoria
- mala jerarquía visual
- ambigüedad
- problemas de accesibilidad
- incompatibilidad con móvil
- inconsistencia con el sistema existente

### Paso 6: Entregar recomendación accionable

Da una salida concreta en uno de estos formatos:

- recomendación breve
- estructura de pantalla
- lista de componentes
- criterios de auditoría
- wireframe textual
- tabla comparativa entre patrones
- backlog de mejoras priorizadas

## Reglas de calidad

- No recomiendes modales si una acción necesita contexto prolongado o comparación constante.
- No uses acordeones si la información debe compararse entre secciones.
- No uses carruseles para contenido crítico.
- No escondas acciones frecuentes detrás de menús secundarios si deben ser visibles.
- Evita tabs si el usuario necesita comparar contenidos de pestañas distintas al mismo tiempo.
- Prefiere validación inline en formularios.
- Prefiere estados vacíos orientativos, no vacíos pasivos.
- Usa tablas solo cuando el usuario necesita escaneo comparativo real.
- Usa cards cuando el contenido sea exploratorio o modular.
- Evita infinite scroll cuando la tarea exija footer, ubicación, comparación o retorno preciso.
- Toda propuesta debe considerar teclado, foco, contraste, labels y mensajes de error comprensibles.

## Modo diseño

Si el usuario pide diseñar:

- entiende la tarea principal
- propone patrón principal
- define estructura
- sugiere componentes
- incluye estados: vacío, carga, éxito, error, deshabilitado
- considera responsive
- entrega rationale breve

## Modo auditoría

Si el usuario pide auditar:

- revisa objetivo de la tarea
- detecta patrones existentes
- detecta anti-patrones
- clasifica severidad: crítica, alta, media, baja
- explica impacto
- propone mejora priorizada
- entrega hallazgos accionables

## Formato de salida preferido

Usa esta estructura:

### Resumen

### Problema principal

### Patrón recomendado

### Justificación

### Riesgos / trade-offs

### Recomendación concreta

### Accesibilidad y usabilidad

### Anti-patrones a evitar

## Archivos de apoyo

Lee estos archivos cuando haga falta más detalle:

- `references/pattern-library.md`
- `references/audit-checklist.md`
- `references/anti-patterns.md`
- `templates/ux-audit-template.md`
- `templates/ui-pattern-selection-template.md`
