---
description: Ejecuta una caja (1 fuentes, 2 ejecución o 3 informe) de un proyecto del motor de QA visual
argument-hint: <id> <1|2|3>
---

Motor: `_qa_visual/` (independiente de la plataforma). Lee su `README.md`.

Datos: $ARGUMENTS

No ejecutes una caja que el usuario no pidió.

**Caja 1 · Fuentes**
1. Corre `python _qa_visual/qa.py caja <id> 1`. Lee el diseño, abre el producto real con sus credenciales y deja un borrador de `plan.json`.
2. Revisa `plan.json` a mano:
   - cada vista del diseño debe tener su par correcto en el producto real;
   - la **meta** decide qué entra: lo que no la ocupa va con `"incluida": false` y su `"motivo"`;
   - si una vista del producto no se abre con su dirección, escribe los `pasos` para llegar (`ir`, `clic`, `llenar` con `valor_de`, `esperar`);
   - los `avisos` de `fuentes.json`: Figma sin acceso, una página que no abrió o un ingreso que no se encontró.

   Mira las miniaturas para confirmar los pares.
3. Corre `python _qa_visual/qa.py cerrar <id> 1`: arma «Lo que vamos a comparar» y la plataforma se lo muestra al cliente para que lo apruebe.

**Caja 2 · Ejecución** (cuando el cliente aprobó el plan)
1. Corre `python _qa_visual/qa.py aprobado <id> 1` y luego `python _qa_visual/qa.py caja <id> 2`.
2. Revisa `hallazgos.json` mirando los recortes:
   - lo que es contenido que cambia solo (fechas, nombres de la cuenta, anuncios) o un falso positivo va con `"descartado": "<motivo>"`;
   - afina `titulo` y `sugerencia` para que digan, en palabras del cliente, qué se ve y qué hacer.
3. Corre `python _qa_visual/qa.py cerrar <id> 2`. La caja 3 sigue sola.

**Caja 3 · Informe**
1. Corre `python _qa_visual/qa.py caja <id> 3`: arma `informe/index.html` y `informe.pdf`.
2. Abre el informe y revísalo como el cliente. Si cambias `hallazgos.json`, rehazlo con `python _qa_visual/qa.py informe <id>`.
3. Corre `python _qa_visual/qa.py cerrar <id> 3`.

Al final de cada caja, di qué se hizo y qué sigue. Si el proyecto viene de la plataforma, el vigilante (`python work/synthetica-plataforma/operador.py vigilar`) se lo publica al cliente.
