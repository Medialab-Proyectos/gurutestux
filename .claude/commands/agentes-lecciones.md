---
description: Revisa la base global de lecciones aprendidas de las auditorías y decide qué comportamientos nuevos aprende la plataforma
argument-hint: [proyecto de la plataforma opcional, para traer su auditoría primero]
---

Base: `_agentes_sinteticos/bases_comportamiento/lecciones-auditoria.json` (módulo `agentes_sinteticos/lecciones_auditoria.py`).

Datos que da el usuario: $ARGUMENTS

1. Si nombra un proyecto de la plataforma, trae primero lo que auditó el cliente:
   `python work/synthetica-plataforma/operador.py auditorias <proyecto>` (pasa → confirmado, no pasa y no era un
   problema → descartado, ya está solucionado → corregido). Lo de los paneles «Validar con personas» de los informes ya
   está en `proyectos/<id>/validaciones/`.
2. Rehace la base y muéstrala: `python -m agentes_sinteticos.lecciones_auditoria actualizar` (desde `_agentes_sinteticos`).
   Explica en palabras qué tipos de hallazgo son falsos positivos frecuentes y cuáles confirmaron personas.
3. Lista los comportamientos candidatos: `python -m agentes_sinteticos.lecciones_auditoria candidatos`. Para cada uno
   propón qué sería: una conducta nueva del agente (rango en el núcleo, con respaldo citado), una regla del experto, un
   ajuste del umbral de un tipo de hallazgo o nada (un caso aislado). No inventes respaldo: lo que no tenga evidencia
   queda como «supuesto a calibrar».
4. Aplica solo lo que el usuario apruebe, respaldando antes el motor en `_respaldos/`, y marca el candidato con
   `"revision": {"decision": …, "fecha": …}` en la base para no volver a proponerlo.
5. Corre las pruebas del motor. Nada con costo; no relances estudios.
