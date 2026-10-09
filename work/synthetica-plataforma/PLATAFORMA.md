# Synthetica · plataforma en línea

Especificación de producto para construir la versión en línea de Synthetica. Acompaña a la
maqueta navegable (`index.html`) y al modelo de datos (`modelo-datos.sql`).

> **Despliegue:** la arquitectura para producción en Vercel (web global, trabajadores del
> motor aparte, subida directa de hasta 10 MB, cola de trabajos, correo, seguridad y fases)
> está en `ARQUITECTURA.md`.

> **Actualización del 2026-10-08:** el proyecto completo tiene las mismas cajas que el motor de creación: 1, 2, 3, **3.1** color, **4** maquetación (el cliente elige la propuesta), **4.1** imagen (el cliente decide si acepta el material o pide recursos propios), **5** gráfica y psicológica, 6 estructura y confianza, 7 comportamental, 8 gamificación (opcional), 9 punto de control, 10 futuro (opcional) y **11** aceptación de la entrega. Lo que este documento dice de las «nueve cajas» es el modelo anterior: la caja 4 de antes es la 5, y de la 5 a la 9 pasaron a la 6 a la 10. Los proyectos completos ya creados se migran solos (`migrarCajas` en `index.html` y en `api/synthetica/equipo.js`).

## 0. Cómo lo imagina Cristian (23-09-2026, en construcción)

> Visión dictada por Cristian. Manda sobre el resto del documento donde lo contradiga.
> Confirmado el 23-09-2026: **todas las cajas siguen la misma lógica que la caja 1** y la
> contraseña va aparte y cifrada. Ya está en la maqueta.

**Entrada guiada.** La persona entra y lo único visible es crear su nuevo proyecto,
experiencia o producto. La plataforma la acompaña paso a paso, con un tono de teoría del
comportamiento: «Vamos a iniciar con tu producto, te acompaño en cada paso».

1. **Tipo de proyecto.** Elige entre los tipos disponibles.
2. **Nombre y descripción corta.** La descripción es **opcional**, porque a mucha gente no le
   gusta escribir. Puede ser una frase o un párrafo de entre 50 y 100 palabras.
3. **Entradas del proyecto.** Se pide todo lo que la persona tenga a mano:
   - objetivo, intención del producto y flujo actual;
   - el enlace al código (GitHub), documentación y archivos TXT;
   - dónde está el contexto (o un zip que lo deje claro), la investigación y las reuniones
     de negocio;
   - los enlaces importantes a la plataforma actual y cómo se entra (acceso), si ya existe;
   - ejemplos, el proyecto actual y el manual de marca, si lo hay;
   - un archivo de enlaces con título: la competencia directa y lo que le gustaría tener.

   Si el proyecto es nuevo, basta con la información básica.
   - **Solo se procesan documentos textuales:** DOC, PDF, Excel, CSV, TXT y similares.
     Hay que decirlo con claridad antes de subir.
   - **Logo:** la plataforma no diseña logos, pero crea uno temporal para el proyecto.

**Caja 1 · Usabilidad básica (Nielsen).**
- Todo lo que llega va a la primera tarjeta, que queda **en proceso**.
- Al subir se muestra algo como «tarda unos 5 o 10 minutos en recibirse; te avisamos cuando
  esté listo».
- La construcción tarda **como máximo entre 3 y 5 horas**. El tiempo real aparece cuando se
  corre el producto.
- Llega un correo al equipo: «un proyecto nuevo acaba de iniciar». Un **analista de la
  empresa** abre el proyecto y lo ejecuta **a mano, desde la consola**.
- La persona recibe «tu primera fase ha sido completada».
- La IA entrega una aplicación que cubre lo que la persona describió (técnico o no, con sus
  menús). Tiene que **convencer**: con contexto, imágenes, los elementos gráficos que haya y
  los colores de la marca. La persona puede decir «esos colores no me gustan».

**Feedback de la caja 1.** Preguntas concretas para la persona:
- ¿El menú es válido? ¿Es entendible? ¿Recomiendas algo más sobre el menú?
- ¿Las opciones del contenido son cómodas?
- ¿Falta información que no se esté considerando?
- ¿Tienes dudas sobre el funcionamiento?
- ¿Te gusta o no? ¿Cumple o no cumple?

**Ciclo de dudas.**
- La IA modifica la aplicación según el feedback y responde las dudas.
- Se repite hasta que la persona marca **«No tengo más dudas»**.
- Cada vuelta es más corta que la anterior: si la primera fue de 5 h, la segunda ronda de
  2,5 h (analiza, piensa, crea, prototipa).

**Caja 2.** Ya no es usabilidad. Con la información de la caja 1 se crean las
**protopersonas** y el **escenario** que usarán los agentes sintéticos para probar la
aplicación. 

**Todas las cajas, igual.** Cada caja se entrega, se prueba y recibe opinión con sus
preguntas propias. Por ejemplo, en la caja 2: ¿las protopersonas se parecen a tus usuarios?
En la caja 4: ¿el estilo representa tu marca? y los colores. En la 6: ¿algún mensaje te
empuja de más? Luego vienen las vueltas, cada una más corta, hasta «No tengo más dudas».
La caja 8 es la excepción, porque la hace el equipo del cliente con usuarios reales.

**Contraseñas.** Se piden en un campo aparte y nunca viajan en el zip. Se guardan cifradas
(tabla `credencial`) y solo las descifra el analista; cada lectura queda registrada
(`credencial_lectura`) y se borran al cerrar el proyecto. La maqueta no las guarda.

**Cómo está en la maqueta**
- **Portada:** «Vamos a iniciar con tu producto», con un solo botón, «Crear mi nuevo
  proyecto», y los tres pasos.
- **Asistente de cinco pasos:**
  1. Qué quieres hacer: crear, evaluar o seguir.
  2. Nombre y descripción opcional, con un contador de palabras que no obliga.
  3. Lo que tienes: objetivo, intención, flujo, archivos (solo texto; lo demás se marca como
     no leído), manual de marca, código, enlaces, competencia y plataforma actual con la
     contraseña aparte.
  4. Personas.
  5. Qué pasa al enviarlo.
- **Sin etapa 0 en el proyecto completo.** Al enviarlo, la caja 1 queda «Esperando al
  analista» y sale un correo al equipo. El analista la lanza (en la maqueta, con un botón
  solo para el equipo Synthetica, también en «Por validar»).
- **Caja 1:** tarda entre 3 y 5 h. Al terminar, la persona recibe «Tu primera fase ha sido
  completada».
- **En cada caja:**
  - «Lo que nos diste» (en la caja 1);
  - «Tu opinión sobre esta versión»;
  - «Pedir otra vuelta con este feedback», que tarda la mitad que la anterior;
  - «Vueltas anteriores», con las opiniones, las dudas y sus respuestas;
  - la casilla **«No tengo más dudas»**, sin la cual no se puede aprobar.
- **En el canvas**, cada caja muestra en qué vuelta va, y los correos enviados aparecen en la
  actividad.

## 0 bis. Primer MVP (decisiones del 23-09-2026)

- **Una sola persona por proyecto.** La persona que se registra y crea el proyecto lo sigue
  entero. No hay personas invitadas, roles, asignaciones ni registro de actividad; eso queda
  para un segundo MVP. Las secciones 3 y 9 describen ese segundo MVP.
- **Sin cliente ni contrato en la interfaz.** El contrato mensual (sección 13) se gestiona
  en la plataforma cuando se negocia y el cliente no lo ve. «Nuevo proyecto» va directo al
  asistente de 4 pasos: qué quieres hacer, tu proyecto, lo que tienes, revisar y enviar.
- **URL obligatoria** en el estudio sintético y el seguimiento. Se acepta con o sin
  `https://`, y el mensaje de error dice exactamente qué falta.
- **Estudio sintético:**
  - Fuentes, cohorte y ejecución **pasan solas**; solo el informe espera a la persona, con
    el estado **«Es tu momento de auditar»**.
  - La etapa 0 lista **las fuentes que se tuvieron en cuenta**, con una descripción sacada
    de cada archivo.
  - Cada etapa del carril tiene un **ícono de estado**, y al final está **Volver a
    ejecutar**: se elige 1, 2 o 3 agentes y la pide un analista.
- **Auditoría de hallazgos**, en lugar de aceptar o rechazar:
  - No hay asignaciones. Quien mira audita: marca «Pasa», «No pasa», «No era un problema» o
    «Ya está solucionado», deja un comentario opcional y guarda.
  - Hay **filtros** por categoría (ergonomía visual, usabilidad, contenido…), por estado
    (auditados o sin auditar) y por tipo.
  - «Pide tu auditoría» señala lo que depende de cómo entienden las personas reales;
    «Verificación automática» es lo que el motor vuelve a medir, y auditarlo es opcional.
- **Descargar el reporte en PDF:** el resumen del estudio (`index.html`, con las secciones
  desplegadas) y, detrás, las recomendaciones UX priorizadas, en un solo PDF. Lo imprime
  `conector_motor.py` con Chromium en `descargas/`, solo cuando el reporte cambia.
- **Vista interna (analista de Synthetica):**
  - ve el **informe completo del motor**, con los enlaces a cada informe y a cada hallazgo;
  - lanza las corridas.
- **La severidad y la arreglabilidad no se muestran en la plataforma**, ni siquiera en la
  vista interna: viven en los documentos del motor.
- **Notas:** solo una nota libre por etapa, sin marca de «evaluación humana».

## 0 ter. Ajustes del 23-09-2026 (vista del cliente)

- **Palabras:** en el proyecto completo se habla de **escenarios**, no de cajas. El
  framework interno sigue siendo el de las nueve cajas.
- **Portada:** solo tus proyectos y tus borradores; los pendientes viven en su propia sección.
- **Asistente:**
  - Cada tipo dice lo que tarda y lo que entrega: «Primera evaluación en unos 1,4 días»,
    «Cada escenario, entre 3 y 5 h» y «7 días de línea base».
  - No se piden cosas que el estudio produce, como KLM o grabaciones.
  - Evaluar un producto pide la URL y, si hace falta, el acceso (usuario y contraseña
    cifrada). Luego pregunta, todo opcional: qué quieres analizar, qué esperas obtener, y
    documentos o enlaces de apoyo.
  - Se quitó «Lo que vemos hasta ahora».
  - Los pasos ya hechos se pueden volver a abrir con un clic.
  - Al salir, o al pulsar «Nuevo proyecto» con uno a medias, se pregunta si guardarlo como
    **borrador**; los borradores se retoman desde la portada.
  - El resumen del estudio sintético lista las etapas y dice «Primera evaluación: unos
    1,4 días; puede ser antes según el tamaño y la complejidad del producto».
- **Volver a ejecutar:** con 1, 2, 3, 5 o cualquier número de agentes (hasta 20), con
  **fuentes nuevas** y la opción de **empezar el estudio desde el inicio** (fuentes, cohorte
  y recorridos). Sin esa opción se repite solo la ejecución y el informe queda comparable.
- **Reporte en PDF para el cliente:** lo genera la plataforma con la marca Synthetica (logo
  a la izquierda, producto, fecha y hora a la derecha). Incluye el resumen del estudio y los
  hallazgos por categoría con el resultado de la auditoría. El reporte completo del motor en
  PDF queda solo en la vista interna.
- **Correo al equipo:** cada proyecto nuevo y cada ejecución pedida envía toda la
  información a **hello@medialab.design**, para lanzarla y revisarla en local. La contraseña
  nunca va en el correo. En la maqueta, la vista interna muestra la bandeja con «Abrir en tu
  correo».
- **Adjuntos:** los archivos que se suben (al crear el proyecto, en un borrador o al volver
  a ejecutar) se descargan desde el proyecto, en «Lo que nos diste» o «Documentos que
  subiste». Con `python servidor.py` (o `abrir-plataforma.cmd`) quedan en disco, en
  `work/synthetica-plataforma/proyectos/<proyecto>-<id>/fuentes/`, junto con `proyecto.json`
  (la ficha) y `correo.txt` (lo enviado a hello@medialab.design). Los borradores van a
  `proyectos/borradores/` y se mueven al enviarlos. Abierta con doble clic, la maqueta no
  puede escribir en disco y los guarda en el navegador. El servidor escucha solo en
  127.0.0.1 y del motor sirve únicamente `salidas/`, en solo lectura. En la plataforma real
  van al almacenamiento de objetos (tabla `fuente`).
- **Detener y cancelar:** todo proyecto en curso muestra **Detener**; la etapa queda
  «Detenida» con su avance y, al **Reanudar**, sigue con el tiempo que le faltaba.
  **Cancelar** pide el porqué (ya no lo necesito, me equivoqué en los datos, el producto
  cambió, tarda demasiado, presupuesto o contrato, u otro, que obliga a escribirlo). Lo
  hecho se conserva, lo que corría queda detenido y el proyecto se puede **reabrir**.
  Detener, reanudar, cancelar y reabrir avisan por correo a hello@medialab.design, para
  parar o retomar la ejecución local.
- **Traspaso de la versión sin servidor:** abierta con doble clic, la portada ofrece
  «Exportar mis proyectos y archivos» (un JSON con los datos y los archivos). En la versión
  con servidor, «Importar exportación» deja cada archivo en la carpeta de su proyecto.
- **Evidencia de los hallazgos:** «Qué vimos» usa los ejemplos y mediciones del hallazgo,
  nunca el resultado del paso. Los selectores técnicos se quitan del texto.

## 1. Qué es

Hoy Synthetica corre en local. Una persona da las carpetas y el motor de
`_agentes_sinteticos` hace el resto. La plataforma en línea lleva ese mismo proceso a un
panel web:

1. El cliente entra y crea un proyecto. Sube un zip, pega su contexto o da enlaces y una URL.
2. Dice qué **personas** participan y con qué rol.
3. Synthetica pone el proyecto en marcha. El cliente ve **en qué etapa va, cuánto falta**
   y que la plataforma está **pensando**.
4. Al terminar cada etapa, el cliente ve **lo que se logró**, **prueba la interfaz** y
   **valida los ajustes**. Si no los aprueba, no se pasa a la siguiente etapa.
5. Todo queda en una sola base: quién decidió qué, cuándo y por qué. También el uso real del
   producto una vez publicado.

**Todo está conectado.** Una validación no es un clic suelto: queda ligada a la persona,
a la etapa, al hallazgo del motor que la originó y, si se publica, a la versión del producto
que se mide en el seguimiento.

## 2. Tres tipos de proyecto

| | Estudio sintético | Proyecto completo | Seguimiento |
|---|---|---|---|
| Parte de | La URL de un producto que ya existe | El contexto (no hace falta un producto) | Un producto publicado |
| Motor | **Completo**: KLM, grabaciones, mirada simulada, auditoría experta | **Ligero**: 3–5 agentes, sin KLM ni grabaciones | Etiqueta de medición y encuestas |
| Informe que ve el cliente | Informe completo del motor | Versión reducida: solo cómo les fue a los agentes y qué ajustes se proponen | Panel en vivo |
| Etapas | 0 Fuentes · 1 Cohorte y recorridos · 2 Ejecución · 3 Informe y ajustes | cajas 1–11 (con 3.1 y 4.1; la 4.1, la 8 y la 10, opcionales) | 0 Etiqueta · 1 Línea base · 2 En vivo |
| Duración de referencia | Unos 2 días | Entre 1 y 2 días de proceso, más el tiempo de las validaciones | 7 días de línea base y después, sin fin |

Un mismo **producto** puede pasar por los tres tipos. Por ejemplo, empieza con un estudio
sintético, luego se reconstruye en un proyecto completo y, al publicarse, pasa a seguimiento.
Cada proyecto guarda `deriva_de`, así que el seguimiento sabe qué ajustes aceptados
entraron en cada versión.

## 2 bis. Conexión con el motor de agentes (solo lectura)

El estudio sintético de la plataforma **muestra los resultados que produce el motor** de
`_agentes_sinteticos`. La plataforma no modifica el motor: solo lo lee.

- `conector_motor.py` lee `proyectos/*.json` (solo nombre, mercado, público y URL; nunca
  `acceso`, `autenticacion` ni `acceso.json`), la cohorte y los recorridos de cada proyecto, y
  de cada `salidas/estudio-completo-*` el `backlog-ux.json`, `consumo.json`, las coberturas,
  la satisfacción sintética, los informes HTML y los videos. Escribe `datos-motor.js` junto a
  la plataforma. Se corre después de cada estudio.
- Un proyecto sintético guarda `motor: { proyecto_id, estudio }`. Sin `estudio`, usa el último.
  Quien tiene el rol responsable puede fijar otro estudio de la lista. La lista dice si ese
  estudio es comparable con el vigente, es decir, si tiene los mismos recorridos
  (`version_recorridos`).
- Qué muestra cada etapa:
  - **Cohorte:** los perfiles y recorridos reales.
  - **Ejecución:** agentes, recorridos, pasos, duración, cobertura, costo y las grabaciones.
  - **Informe:** enlaces a cada informe original del motor, la satisfacción sintética (CSAT,
    NPS y NASA-TLX), lo que no se pudo medir y el historial de estudios.
- **Cada hallazgo del backlog es un ajuste** que se valida con nombre y fecha:
  - Muestra dónde pasó, qué vimos (con cuántos agentes y en qué dispositivos), qué proponemos,
    cómo sabremos que quedó bien y un enlace al hallazgo exacto en `recomendaciones-ux.html`.
  - «Validar con personas» (`validacion: personas`) se asigna a la persona de evaluación del
    proyecto; si no hay, al responsable; si no hay ninguno, queda **sin asignar** y la
    plataforma pide sumar a las personas del cliente.
  - «Verificación automática» se asigna al equipo Synthetica.
- Las decisiones se guardan por id de hallazgo (`ajuste.hallazgo_ref`). Si un estudio nuevo
  repite el hallazgo, la decisión se conserva; si ya no aparece, el ajuste sale de la lista.
- No se inventa historia. Las etapas que se configuraron directamente en el motor, antes de
  ligar el proyecto, se muestran así, sin aprobación ni fechas.
- En la versión real, el conector corre en el trabajador que ejecuta el motor y escribe en la
  base (`corrida`, `ajuste`) en lugar de un archivo.

## 3. Personas y roles

Las personas se definen **al crear el proyecto** y se pueden cambiar después. Todo proyecto
activo necesita al menos una persona responsable.

| Rol | Aprueba etapas | Valida ajustes | Elige el diseño | Notas | Vista interna |
|---|---|---|---|---|---|
| Responsable | ✓ | ✓ | ✓ (decisión final) | ✓ | |
| Evaluación | | ✓ | Vota | ✓ | |
| Miembro | | | | ✓ | |
| Observador | | | | | |
| Equipo Synthetica | ✓ | ✓ | ✓ | ✓ | ✓ |

- Cada ajuste nace **asignado a una persona** («Le toca a Laura Méndez»). Otra persona con
  permiso puede decidirlo, y queda registrado quién lo hizo.
- «Validar con personas» deja de ser una frase: siempre dice **quién** validó, **cuándo** y
  **con qué comentario**.
- La plataforma recomienda al menos una persona de evaluación además del responsable, para
  que ningún ajuste dependa de una sola mirada.
- Se puede invitar a alguien que todavía no tiene cuenta. Queda con la invitación pendiente
  y ya aparece asignada.

## 4. Crear un proyecto

Solo se puede crear un proyecto con un **contrato mensual vigente** (ver la sección 13). El
asistente tiene cuatro pasos: **tipo → fuentes → personas → revisar y enviar**.

**Fuentes.** Se aceptan zip, documentos sueltos, texto pegado y enlaces. No hace falta
tenerlo todo ni en orden. Funciona como con Corvus: basta con decir dónde están la tabla, el
contexto, el negocio y el producto, y Synthetica lo organiza.

1. El original se guarda tal cual en el almacenamiento de objetos, con su hash.
2. Los zip se descomprimen y cada documento se clasifica en contexto, negocio, producto,
   objetivo, población, investigación, métricas u otro.
3. Los datos personales se redactan **antes** de indexar.
4. En la etapa 0 el cliente ve **lo que entendimos y lo que falta**. Lo que falta se trabaja
   con supuestos marcados como tales. El cliente puede subir más archivos en cualquier momento.

Al enviar, el proyecto queda **en camino**. La primera etapa empieza de inmediato y el
cliente puede cerrar la página: recibirá un aviso cuando haya algo que revisar.

**Enlace con el motor.** A partir de las fuentes, la plataforma genera
`proyectos/<id>.json` y `proyectos/<id>/` (cohorte y recorridos), igual que
`agentes_sinteticos.nuevo_proyecto`. El motor no se modifica: sigue sin nombrar ningún
producto.

## 5. Ciclo de una etapa

```
cola ──(se aprueba la anterior; nunca se salta)──▶ pensando ──(el motor termina)──▶ revisión ──(responsable aprueba)──▶ hecha
                                       │                                 │
                                       └── fallida (reintento interno)    └── notas, validaciones, elección de diseño
modo humano:  cola ──▶ humana ──(el equipo del cliente la marca como terminada)──▶ hecha
seguimiento:  … ──▶ vivo (sin fin)
```

**Pensando.** Muestra una barra con el avance y un texto como «esta etapa tarda en promedio
5 h y debería estar lista hacia las 17:00». También muestra qué está aplicando el motor
(«ISO 9241 ✓, WCAG 2.2…»). Durante el proceso se pueden dejar notas y el motor las lee
antes de cerrar la etapa.

**Tiempos.** El catálogo (`etapa_catalogo.minutos_base`) trae valores iniciales: fuentes
45 min, cajas de 2 a 6 h y la ejecución sintética 1 día. Cuando haya historia, la vista
`etapa_duracion` los reemplaza por la mediana real de cada tipo y etapa. El tiempo total
siempre se muestra como «proceso + el tiempo de tus validaciones», porque este segundo no
depende de Synthetica.

**Revisión.** En este orden, el cliente ve:

1. **Qué logramos**, en lenguaje del cliente.
2. **Prueba la interfaz**: el prototipo HTML de esa etapa, navegable.
3. **Cómo les fue a los agentes**. En el proyecto completo es la versión ligera: número de
   agentes, tareas completadas y un resumen de dos líneas.
4. **Ajustes que nos gustaría que validaras**. Cada ajuste dice qué control, qué se esperaba
   y qué respondió la interfaz, y trae los botones *Aceptar* y *Rechazar* con un comentario.
5. **Notas de la etapa**, que se pueden marcar como *Requiere evaluación humana*.
6. **Aprobar y continuar**, que solo aparece para quien tiene el rol responsable.

Si se aprueba la etapa con ajustes sin decidir, esos ajustes **pasan al backlog**: no se
aplican hasta que alguien los acepte. La interfaz lo avisa antes de continuar.

## 5 bis. Canvas del proyecto completo

El proyecto completo se sigue en el **canvas de trabajo**, el mismo de
`work/synthetica-canvas.html`, que ahora se dibuja con los datos de la plataforma:

- La etapa 0 (lectura de fuentes) y las nueve cajas van en un lienzo horizontal, con las
  bandas de fase: construcción y diseño funcional (1–5), diseño para masas (6–7), y diseño
  humano y consciente (8–9). Al final aparece la salida a Figma y al sistema de diseño.
- Cada caja muestra:
  - su estado: aprobada, te toca revisar, pensando con porcentaje, en espera, o tu equipo;
  - el prototipo que recibe de la caja anterior;
  - los principios que aplica y el prototipo que creó;
  - la evaluación (control automático, agentes sin KLM ni video, evaluación humana o
    recomendaciones), el bucle «si no cumple, refina»;
  - sus ciclos, su gate y sus ajustes por validar.
- Entre caja y caja, el conector dice «gate aprobado por <persona>» o «esperando tu
  aprobación».
- Desde cada caja se entra con **Ver caja y decisiones** (o **Revisar y validar** si le
  toca a la persona) al detalle: qué logramos, prototipo, ajustes, notas y aprobar. **Ver en
  vivo** abre el prototipo de esa caja.
- El lienzo se arrastra, se desplaza con la rueda, tiene zoom (Ctrl + rueda o los botones),
  «Ver todo» y saltos directos a cada caja. Muestra el último movimiento del proyecto.
- Al aprobar una caja se vuelve al canvas, centrado en la caja que empieza.

## 6. Qué ve el cliente y qué ve el equipo

| Dato | Cliente | Vista interna |
|---|---|---|
| Lista de ajustes con evidencia concreta | ✓ | ✓ |
| Tabla severidad × arreglabilidad | | ✓ |
| Severidad, arreglabilidad y frecuencia por ajuste | | ✓ |
| Corrida del motor, semilla y carpeta de salida | | ✓ |
| Informe completo (KLM, grabaciones, mirada) | Solo en el estudio sintético | ✓ |

La severidad sirve para ordenar y priorizar dentro del equipo. Al cliente se le pide validar,
no que interprete una matriz. Esto sigue la regla de los informes legibles: nada que no
cambie una decisión.

## 7. Diseño (caja 4)

Hasta la caja 3, el cliente ve interfaces funcionales construidas con sus datos, para
validar el contenido y el flujo. En la caja 4 empiezan las **variantes visuales en alta
definición**:

- Tres variantes aplicadas a las vistas principales, con el voto de los agentes y su razón.
- Las personas con rol de evaluación **votan**, y el responsable **elige** (`eleccion.final`).
- La etapa no puede aprobarse sin una elección final.
- Si una variante tiene un riesgo (por ejemplo, un estado que solo se distingue por el color),
  ese riesgo llega como un ajuste normal, asignado a una persona.

A partir de aquí el diseño elegido se va refinando en las cajas 5 a 7.

## 8. Seguimiento

Empieza cuando el producto está publicado:

1. **Etiqueta.** Es un fragmento de script con el id del proyecto (`SYN-XXXX`). El cliente
   lo instala y la plataforma confirma que llegó la primera visita.
2. **Línea base de 7 días.** Mide visitas, tiempo en página, salidas y los enlaces que se
   usan (se guarda su texto visible y su destino).
3. **En vivo.** Un panel con indicadores de 7 días comparados con la semana anterior, las
   visitas por día, los enlaces más usados y las encuestas.
4. **Encuestas.** CSAT, SUS y NASA-TLX (y NPS si hace falta). Se activan con un interruptor,
   con un disparador («al terminar el pago») y una muestra («1 de cada 10 visitas»).
5. **Evolución por versión.** Cada `version_publicada` guarda qué ajustes aceptados entraron,
   así que se ve el antes y el después de cada cambio.

Privacidad: sesión anónima que rota, nunca se guarda lo que la persona escribe, se respeta
el consentimiento de cookies del sitio y no se toman decisiones sobre individuos. Es la
misma regla que ya aplica el pipeline del motor.

> El modelo sociotécnico (límites de operación y deriva) es otro proyecto y **no** se
> integra aquí por ahora.

## 9. Avisos

Todo cambio escribe una fila en `actividad`. De ahí salen el panel de actividad del
proyecto y los avisos (en la aplicación y por correo):

- Etapa lista para revisar: a todas las personas del proyecto.
- Ajuste asignado: a su validador.
- Se necesita la elección de diseño: al responsable.
- Etapa aprobada o nota que requiere evaluación humana: al equipo Synthetica y al responsable.

La misma tabla sirve para contar entregas y rondas, igual que el reporte de ajustes de
gerencia.

## 10. Arquitectura propuesta

```
Navegador ──▶ API web (auth, proyectos, validaciones)  ──▶ PostgreSQL (modelo-datos.sql)
                     │                                     └▶ almacenamiento de objetos (fuentes, prototipos, imágenes HD)
                     └─▶ cola de trabajos ──▶ trabajadores del motor (_agentes_sinteticos, Playwright)
Sitio del cliente ──▶ etiqueta ──▶ colector de eventos ──▶ tabla evento (particionada por mes)
```

- Cada etapa en estado *pensando* es un trabajo en la cola. El trabajador escribe `corrida`,
  `prototipo`, `ajuste` (desde `backlog-ux.json`) y `logros`, y luego pasa la etapa a revisión.
- El avance de la barra sale de `inicio` y `fin_estimado`. Si el motor reporta pasos, la
  barra puede usar su avance real.
- Nunca se relanza un estudio entero: si faltan recorridos, se completa lo pendiente dentro de
  la misma etapa (`completar_estudio`).
- Nada con costo por ahora: sin servicios de visión de pago. Las imágenes de alta definición
  salen del propio motor.

## 11. Qué hace la maqueta y qué falta

La maqueta (`index.html`, abrir con doble clic) guarda sus datos en el navegador.
**No trae proyectos, personas, contratos ni métricas inventados.** Solo aparecen los
proyectos vigentes del motor (hoy Corvus y eDoc Emiratos, a través de `datos-motor.js`, que
se regenera con `python conector_motor.py`), junto con Cristian y el equipo Synthetica. Todo
lo demás se crea desde la plataforma: el contrato que registra el equipo, los proyectos
nuevos y las personas invitadas. Un seguimiento queda vacío hasta que lleguen datos reales.
La maqueta reproduce:

- La lista de proyectos con su avance, el tiempo restante, las personas y los pendientes.
- El asistente de cuatro pasos, con la detección de carpetas por nombre de archivo.
- El estado *pensando* con barra y hora estimada. El botón «Adelantar el tiempo (maqueta)»
  lo simula.
- La validación de ajustes con nombre y fecha, deshacer, el paso al backlog y la aprobación
  de etapa.
- Las notas con marca de evaluación humana, el panel de personas y la actividad.
- La elección de diseño A/B/C con votos y decisión final.
- El seguimiento en vivo: indicadores, visitas con detalle al pasar el cursor, enlaces,
  encuestas que se activan y la evolución por versión.
- «Ver la maqueta como»: cambia de persona para probar los permisos, el trabajo en paralelo
  y la vista interna.

Falta para la versión real: autenticación, subida real de archivos, la cola con los
trabajadores del motor, el colector de la etiqueta y los avisos por correo.

## 12. Decisiones

Confirmadas el 23-09-2026:

- **Instrumentos de seguimiento:** CSAT, SUS y NASA-TLX (y NPS si hace falta).
- **Tiempos iniciales por etapa:** los del catálogo (fuentes 45 min, cajas de 2 a 6 h,
  ejecución sintética 1 día). Se reemplazan por la mediana real cuando haya datos.

- **No se pueden saltar cajas.** Las etapas van siempre en orden, también cuando el producto
  ya existe: la caja 3 empieza solo cuando se aprueba la 2.
- **Contratación mensual, previa reunión con mercadeo.** Ver la sección 13.

## 13. Contrato

- Synthetica se contrata **por mes**. Antes, el cliente **agenda una reunión con mercadeo**,
  que revisa el producto, recomienda el tipo de proyecto y activa el contrato.
- Sin un contrato vigente no se pueden crear proyectos. En lugar del asistente, el cliente ve
  «Agendar con mercadeo». La solicitud queda registrada y mercadeo la atiende.
- Con un contrato vigente, el cliente ve la fecha de vencimiento en su lista de proyectos.
  El equipo Synthetica puede crear proyectos a nombre de cualquier cliente que tenga un
  contrato vigente.
- Pendiente de definir con mercadeo: qué pasa con los proyectos en curso si el contrato
  vence a mitad de una etapa, y si el plan limita la cantidad de proyectos o de etapas por mes.
