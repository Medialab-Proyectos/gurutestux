---
description: Mantiene la base global de preacondicionamiento: voz de usuarios y cliente, aval de los preconceptos y las 10 bases
argument-hint: [id del proyecto] [voz | aval | base | estudio <carpeta>]
---

La base global (`_agentes_sinteticos/bases_comportamiento/preacondicionamiento.sqlite`) crece con cada proyecto. Cada
componente se guarda una vez en el catálogo (componente × interacción × plataforma) con lo que dicen las 10 bases y la
conducta esperada al verlo: si un proyecto nuevo trae un componente igual, se reutiliza; solo lo nuevo o distinto se
busca en las bases descargadas. Lo que depende de la ubicación en la pantalla y del agente se calcula en cada estudio.

Datos que da el usuario: $ARGUMENTS

Según lo pedido (desde `_agentes_sinteticos`):

- **Cargar la voz de las personas y del cliente.** Las notas o transcripciones de entrevistas, pruebas y validaciones con
  personas usuarias van en `proyectos/<id>/voz/`; las de reuniones de producto o de negocio con el cliente, en
  `proyectos/<id>/voz/cliente/`. Luego `python -m agentes_sinteticos.preacondicionamiento voz --proyecto <id>` y resume
  cuántas frases entraron, de quién y con qué concepto. (Cada estudio lo hace solo al empezar.)
- **Ver el aval.** `python -m agentes_sinteticos.preacondicionamiento aval [--nivel general]`. Un preconcepto nace en su
  proyecto y solo pesa ahí; en 2 proyectos es *recurrente*; en 3 o más, *general*, y lo usan todos los proyectos.
- **Actualizar las bases descargadas.** `python -m agentes_sinteticos.preacondicionamiento actualizar-base` (gratis; los
  crudos viven en `F:` con un junction en `bases_comportamiento/crudo`). Si entraron fuentes nuevas, el catálogo marca
  «actualizado» lo que haya que rehacer. Los mapas de mirada de UEyes se rehacen con
  `python -m agentes_sinteticos.preacondicionamiento.mapas_mirada`.
- **Rehacer el preacondicionamiento de un estudio ya corrido.** `python -m agentes_sinteticos.preacondicionamiento estudio
  --estudio salidas/<carpeta>` (reutiliza el catálogo; no vuelve a navegar).
- **Qué hay en la base.** `python -m agentes_sinteticos.preacondicionamiento resumen`.

Nunca guardes datos que identifiquen a las personas: solo la frase y el concepto. Nada con costo.
