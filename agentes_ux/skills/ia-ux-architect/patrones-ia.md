# Patrones de Arquitectura de Información

## 1. Hub-and-spoke

Útil cuando hay una pantalla central con tareas separadas.
Riesgo: obliga a volver al hub demasiadas veces.

## 2. Jerarquía profunda

Útil en sistemas complejos.
Riesgo: demasiados niveles, pérdida de orientación.

## 3. Jerarquía plana

Útil para acceso rápido.
Riesgo: sobrecarga por exceso de opciones.

## 4. Navegación por objetos

Útil cuando el usuario piensa en entidades: clientes, vehículos, facturas, proyectos.
Riesgo: tareas transversales quedan ocultas.

## 5. Navegación por tareas

Útil cuando importa más la acción que el objeto.
Riesgo: un mismo objeto queda fragmentado.

## 6. Navegación híbrida

Combina objetos + tareas + contexto.
Útil en SaaS y backoffices complejos.

## 7. Tabs hermanas

Útil cuando el usuario sigue dentro del mismo objeto.
No usar si cada tab cambia radicalmente el contexto.

## 8. Step-by-step

Útil en onboarding, formularios y procesos largos.
Riesgo: poca flexibilidad si el usuario necesita saltar.

## 9. Progressive disclosure

Útil para reducir complejidad inicial.
Riesgo: esconder demasiado y dañar encontrabilidad.

## 10. Quick actions

Útil para tareas frecuentes.
Riesgo: competir con navegación principal.
