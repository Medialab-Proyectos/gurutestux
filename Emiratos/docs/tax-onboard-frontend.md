# tax-onboard · vinculación con EmaraTax

Documentación para el equipo de frontend. Describe la página que abre EmaraTax cuando una empresa nos elige como proveedor, tal como la validaron el CEO y producto en las revisiones del 14 al 16 de octubre de 2026. La maqueta es la referencia visual y de comportamiento; este documento explica lo que la maqueta no puede enseñar: qué servicio se llama en cada paso, qué se guarda y qué reglas de seguridad no se ven.

Maqueta: [`Emiratos/tax-onboard.html`](../tax-onboard.html). Cada decisión tiene además su nota de diseño dentro de la página (botón «Notas de diseño» del encabezado).

---

## 1. Qué es y qué no es

- **Es la página de un trámite de la autoridad.** EmaraTax redirige aquí cuando la empresa pulsa «Proceed to ASP». No es parte del portal: no tiene menú, no pide login y se cierra al terminar. «Haga de cuenta que está en otro servidor, no tiene login, no tiene nada y simplemente es una página de un solo uso» (CEO, 16 oct).
- **Sirve tres trámites con la misma página:** alta (linking), reverificación y baja (delinking). Lo decide la dirección: si llega el TIN, es reverificación o baja.
- **El cuadro blanco es de la autoridad.** Sus campos, sus nombres y su orden son los de la guía oficial (*FTA Onboarding Testing Overview – User Guide* v1.0, 23/10/2025, páginas 9 a 14), y no se cambian: «todo lo que esté fuera de lo blanco es suyo, pero lo blanco me lo deja igualito». Lo de fuera —título, bienvenida, «Antes de empezar», el paso y la caja de ayuda— es nuestro y lleva nuestro sistema de diseño.

## 2. Cómo verla

### En la web (Vercel)

La maqueta se publica en `https://gurutestux.vercel.app`. La página responde en `/Emiratos/tax-onboard`, sin `.html`, igual que en producción.

| Qué se ve | Dirección |
|---|---|
| Alta: formulario, con un token simulado a la vista en la barra | https://gurutestux.vercel.app/Emiratos/tax-onboard |
| Reverificación o baja: llega con TIN | https://gurutestux.vercel.app/Emiratos/tax-onboard?TIN=1000001602 |
| Paso 2: datos de la entidad | https://gurutestux.vercel.app/Emiratos/tax-onboard?resultado=ok |
| Los datos no coinciden (error genérico) | https://gurutestux.vercel.app/Emiratos/tax-onboard?resultado=no |
| La empresa no es cliente | https://gurutestux.vercel.app/Emiratos/tax-onboard?resultado=nocliente |
| Como en certificación: sin comprobar si es cliente | https://gurutestux.vercel.app/Emiratos/tax-onboard?certificacion=1 |
| EmaraTax no responde, al verificar | https://gurutestux.vercel.app/Emiratos/tax-onboard?resultado=noresponde |
| EmaraTax no responde, al enviar | https://gurutestux.vercel.app/Emiratos/tax-onboard?resultado=envio |
| No pudimos completar el trámite | https://gurutestux.vercel.app/Emiratos/tax-onboard?resultado=nuestro |
| Falta el código de EmaraTax | https://gurutestux.vercel.app/Emiratos/tax-onboard?sincodigo=1 |
| Con un token «real»: se borra de la barra al entrar | https://gurutestux.vercel.app/Emiratos/tax-onboard?emarataxToken=REAL1234&TIN=1000001602 |
| Todos los casos con un clic | https://gurutestux.vercel.app/Emiratos/panel.html |

- **Idioma:** la página sale siempre en inglés. Para verla en español se añade `&idioma=es` (o `?idioma=es` si no hay otros parámetros) a su propia dirección.
- **Los parámetros de la maqueta** (`resultado`, `sincodigo`, `idioma`) se leen al entrar y desaparecen de la barra, que solo enseña lo que mandaría EmaraTax.
- **«Proceso completado»** no tiene dirección propia: se llega escribiendo un correo y un TIN, pulsando «Verify Applicant Details», marcando la declaración y pulsando «Submit». En reverificación o baja hay que elegir antes la acción.
- **Simuladores:** dentro del cuadro hay botones de maqueta («Simular que cuadra», «…no cuadra», «…no es cliente», «…EmaraTax no responde», «…un fallo nuestro», y en el paso 2 los de envío). **Son de prueba y en el producto no existen** (apartado 11).

### En local

```
python servidor-maqueta.py 8080
```

y las mismas direcciones con `http://127.0.0.1:8080/Emiratos/…`. El servidor local no usa caché y sirve las direcciones sin `.html` como Vercel.

### Páginas del portal relacionadas

| Qué se ve | Dirección |
|---|---|
| Inicio con la franja «Tu empresa está activa. Falta que nos designes en EmaraTax» | https://gurutestux.vercel.app/Emiratos/inicio.html?asociada=0 |
| Administración, empresa sin designar | https://gurutestux.vercel.app/Emiratos/admin-empresa.html?asociada=0 |
| Administración, empresa designada (cómo reverificar o darse de baja) | https://gurutestux.vercel.app/Emiratos/admin-empresa.html?asociada=1 |
| Mi registro Peppol, empresa designada | https://gurutestux.vercel.app/Emiratos/peppol.html?asociada=1 |
| Mi registro Peppol, empresa sin designar | https://gurutestux.vercel.app/Emiratos/peppol.html?asociada=0 |

## 3. La dirección y sus parámetros

**Ruta:** `/tax-onboard`. Es la que declaramos al Ministerio en la solicitud de acreditación como dirección de redirección del entorno de pruebas: `https://qas-ae-entpr-site.edoclab.com/tax-onboard`. No se puede servir con otro nombre.

| Parámetro | Cuándo llega | Uso |
|---|---|---|
| `emarataxToken` | Siempre: alta, reverificación y baja | Se manda tal cual en las dos llamadas al API. Obligatorio en las dos. |
| `TIN` | Solo en reverificación y baja | Va al campo TIN, bloqueado. Su presencia cambia la página a «Reverifying / Delinking Request». |

- **Los nombres son los del contrato oficial del API** (`emarataxToken`, «Token from the redirect url», y `TIN`). La guía no da el nombre del parámetro de la dirección —solo dice «AUTH code» y «TIN number»—. **Hay que confirmarlo con la primera redirección real**: la dirección completa queda en el registro del servidor. La maqueta acepta también `auth` y `tin` por compatibilidad.
- **El TIN solo cuenta si llega con el token.** Un TIN suelto en la dirección no viene de la autoridad.
- **En la baja también llega el token.** Guía, 6.1: «TIN number also will be passed along with AUTH code».
- **El token se borra de la barra en cuanto se lee** (guía 4.1: «AUTH code parameter to be hidden after receiving the URL»), con `history.replaceState`, sin recargar. En la maqueta, solo cuando se entra sin parámetros, se escribe uno simulado y se deja a la vista: lo pidió el CEO para enseñar cómo llega la dirección. En producción no se ve nunca.
- **No hay dirección de vuelta.** La autoridad no manda ninguna, así que el final no tiene botón de volver a EmaraTax: la ventana de EmaraTax sigue abierta detrás.

## 4. El recorrido paso a paso

| Paso | Qué ve la persona | Qué hace el sistema | Qué se guarda |
|---|---|---|---|
| **Al abrir** | Título «Linking Request» o «Reverifying / Delinking Request», bienvenida y el formulario. Lo demás, dentro de la ayuda plegable | Lee `emarataxToken` y `TIN` y borra el token de la barra. Sin token: estado «Falta el código». No llama a nada. | — |
| **Verify Applicant Details** | Botón con el nombre exacto de la guía | 1) `POST …/verifyenduser`. 2) Si la autoridad confirma, busca el TIN **en nuestra base de clientes** (eDoc Consulta). **Apagado en certificación y siempre encendido en producción.** 3) Si no es cliente, se para. | La respuesta de la autoridad, con su fecha |
| **Datos de la entidad** | La ficha de la autoridad, sin edición, la declaración y «Submit» | Nada hasta pulsar «Submit». «Back» vuelve al paso 1 y desmarca la declaración. | — |
| **Submit** | Botón «Submit» | 1) Alta en nuestro SMP de Peppol con `0235:<TIN>`; en la baja, la salida del SMP. 2) `POST …/crregupdate`. 3) Si todo va bien, «Proceso completado». | Acción, fecha y respuesta. La empresa pasa a designada o a dada de baja. |
| **Proceso completado** | Visto verde, «Proceso completado», «Ya puedes cerrar esta ventana» | El token sale de la barra: ya se gastó. No llama a nada. | — |

**Por qué nuestra base va después de la autoridad y no antes:** si se mirara primero, cualquiera podría probar TIN al azar y saber quién es cliente nuestro. Después de la autoridad sabemos que quien pregunta es el administrador de ese TIN.

**Lo que enseña el final según el trámite:**

| Trámite | Bajo «Proceso completado» |
|---|---|
| Alta | «GuruSoft quedó vinculado como tu proveedor de facturación electrónica y ya creamos tu registro en la red Peppol. Puedes consultarlo en eDoc Consulta. Ya puedes cerrar esta ventana.» **La dirección Peppol no se enseña aquí**: es técnica y no está en la pantalla de la guía. Se consulta en el portal, en «Mi registro Peppol». |
| Reverificación | «Tus datos quedaron actualizados con GuruSoft como tu proveedor. Ya puedes cerrar esta ventana.» |
| Baja | «Comunicamos tu baja con GuruSoft. En un máximo de 3 días hábiles finalizaremos tu registro en la red Peppol; sin embargo, hasta entonces seguirás recibiendo los documentos que te envíen.» El plazo sale de los requisitos de la autoridad Peppol: «the existing Accredited SP MUST deregister the End-User from their SMP within 3 working days». |

## 5. El formulario (paso 1)

Rejilla de dos columnas iguales en las dos filas (6/6 en Bootstrap, como la pantalla de la autoridad). Por debajo de 992 px, una columna.

| Campo | Etiqueta | Obligatorio | Validación |
|---|---|---|---|
| `v-correo` | Registered EmaraTax E-mail Address | Sí | Formato de correo. Máximo 254 caracteres (RFC 5321). **No admite pegar**: es el segundo factor de la comprobación y se escribe. |
| `v-tin` | TIN (Tax Identifier Number) | Sí | Exactamente 10 dígitos. Si lo manda EmaraTax, viene puesto y bloqueado. |
| `v-pais` | Country Code | No | Lista de prefijos, con +971 por defecto. |
| `v-tel` | Registered Mobile Number | No | Vacío pasa; escrito, solo dígitos y máximo 12 (E.164 son 15 con el prefijo, que va aparte). |
| `v-accion` | Select the action: Reverify / Delinking | Sí, solo en reverificación y baja | «Mandatory to choose one of the options» (guía 5.1 y 6.1). |

- Los largos de correo y móvil son los de la norma general: **el contrato del API no publica ninguno**. Hay que confirmarlo con José.
- Las etiquetas llevan las cápsulas «Obligatorio» y «Opcional» del sistema de diseño, y el TIN su «?» con la explicación.
- **Tras verificar, el correo y el TIN quedan bloqueados.** Si se pudiera verificar con un correo y enviar con otro, la comprobación no comprobaría nada.

## 6. Datos de la entidad (paso 2)

Los campos de la captura oficial, en su orden, sin edición:

| En pantalla | Campo de `verifyenduser` | Nota |
|---|---|---|
| Legal Type | `legalType` | Llega como código (el ejemplo oficial trae `"L3"`). **Falta el catálogo** para enseñar un nombre legible. |
| Entity Legal Name in English | `entityNameEn` | |
| Entity Legal Name in Arabic | `entityNameAr` | `dir="rtl"`, `lang="ar"` |
| VAT TRN | `vatTrn` | |
| Effective Date of Registration / Joining VAT Group | `effectiveDate` | |
| Date of Submission | — | Está en la captura de la guía, pero **la respuesta no lo trae**. Pregunta abierta. |

- **El correo que devuelve el API no se enseña nunca**, para no dar pistas a quien prueba datos ajenos.
- Nada de nuestro dentro de este cuadro: ni el TIN bajo el título ni comparaciones con lo que teníamos. La guía pide «Response fields from EmaraTax to be displayed without edit option».
- La declaración es la suya, palabra por palabra: «I declare that all information provided is true, accurate and complete to the best of my knowledge and belief». Sin marcarla, «Submit» no envía y avisa junto a la casilla.

## 7. Estados y mensajes

Todos los resultados siguen el mismo patrón: icono grande con el color de su señal, el mensaje como título, la explicación debajo y los botones centrados. Clases `reg__hecho-icono` (`--error`, `--aviso`), `reg__hecho`, `reg__hecho-sub` y `reg__nav--centro`. Colores: `--senal-exito`, `--senal-advertencia` y `--senal-error` del manual de marca.

| Estado | Cuándo | Icono | Título | Texto | Botones |
|---|---|---|---|---|---|
| Completado | Envío correcto | ✓ verde | Proceso completado | Ya puedes cerrar esta ventana. | — |
| No coinciden | `verifyenduser` dice que no cuadra | ✕ rojo | El correo o el TIN no coinciden con los de EmaraTax | Revisa los dos tal como constan allí y vuelve a intentarlo. | Volver a intentarlo |
| No es cliente | Cuadra con la autoridad, pero el TIN no está en nuestra base (solo en el alta y con la comprobación encendida) | ⚠ ámbar | Tu empresa no tiene un contrato con GuruSoft | Tus datos coinciden con los de EmaraTax. ¿Nos autorizas a pasar tu contacto a nuestro equipo comercial para que te llame? | No, gracias · Sí, que me contacten. Debajo, «Somos GuruSoft. Si quieres más información, haz clic aquí» |
| EmaraTax no responde | 408 o 500, al verificar o al enviar | ⚠ ámbar | EmaraTax no responde ahora | No es un problema de tus datos. Inténtalo de nuevo en unos minutos. | Volver a intentarlo |
| No pudimos completar | 401, 400, 404, error no controlado o fallo al dar de alta en Peppol | ✕ rojo | No pudimos completar el trámite | Vuelve a intentarlo y, si se repite, escríbenos a soporte@edoc.ae con tu TIN. | Volver a intentarlo |
| Falta el código | Se llega sin token, o la autoridad lo rechaza por usado o vencido | ⚠ ámbar | Falta el código de EmaraTax | Esta página la abre EmaraTax cuando nos eliges… Vuelve a EmaraTax y pulsa «Proceed to ASP». | — |
| Validación | Falta un dato obligatorio o tiene mal formato (paso 1) | ✕ pequeño, en la caja roja bajo el formulario | — | El texto del campo que falla | — |

Reglas de estos mensajes:

- **El error de datos es genérico.** No dice si falló el correo o el TIN: decirlo ayuda a quien prueba datos ajenos. La certificación pide probar con el correo correcto y con uno incorrecto, y se cumple igual.
- **«No pudimos completar» tampoco culpa a nadie.** Un 400 o un 401 salen también si alguien manipuló el token o la petición.
- **Nunca se enseña el código ni el texto de la autoridad** (`GSB_001`, `msgDesc`…). Van al registro del servidor.
- **Sin referencias ni «ya nos ha llegado el aviso»** mientras no exista un registro que lo respalde.
- **Sin avisos flotantes de confirmación.** El resultado lo dice la propia pantalla («Proceso completado», el texto del no cliente…); un aviso flotante que lo repita sobra. Solo quedan dos de advertencia: si se intenta pegar el correo y al desbloquear el correo y el TIN para corregirlos.
- **«Volver a intentarlo» empieza de cero:** vuelve al paso 1 con el correo, el móvil y la acción vacíos y la declaración desmarcada. Solo se mantiene el TIN que manda EmaraTax, bloqueado. **Nada de lo escrito se guarda tras un fallo.**
- **No es cliente:** sin registrarse ni formularios. **«Sí, que me contacten»** envía un correo al equipo comercial con la razón social, el TIN, el correo y el móvil si lo dio, y guarda ese consentimiento con su fecha; **«No, gracias»** no comparte nada. El enlace lleva a la web de GuruSoft: hoy `https://guru-soft.com/en/`, porque `/ae` todavía no existe (da 404). **Falta el correo de comercial.**

## 8. Lo de fuera del cuadro (nuestro)

- **Título y bienvenida**, alineados con el cuadro (1040 px de ancho, centrado). La barra del título no es pegajosa en esta página.
- **Todo lo demás va dentro de la ayuda**, para que el formulario sea lo único que se ve: es la pantalla de la autoridad y cada proveedor tendrá la suya.
- **Ayuda**: caja plegable, **cerrada de entrada** en todos los pasos (`<details>` con flecha y foco visible). En su rótulo, a la derecha, «Paso 1 de 2» o «Paso 2 de 2» (en los resultados no se enseña). Dentro, puntos con icono:
  - Paso 1: «Esta comprobación la define la autoridad… Nada de lo que escribas aquí cambia tus datos en eDoc».
  - Paso 2: «Tus datos cuadran con el registro fiscal…», «¿Te equivocaste al escribir el correo o el TIN?» con el enlace para corregir, y la salida «Cierra esta ventana».
  - Final: cerrar la ventana y «¿Cómo compruebo que quedó hecho?». En la baja cambia a «¿Seguimos apareciendo?».

## 9. El API de EmaraTax

### Dónde está

- **Para desarrollar no hace falta el portal: el contrato completo ya lo tenemos** (punto siguiente). El portal solo sirve para consultar la ficha publicada.
- **UAE API Marketplace**, el portal oficial de APIs del gobierno, donde está publicado el servicio: https://api.government.ae/#default/home (catálogo en https://api.government.ae/#default/gallery). Lo confirma la página oficial del gobierno, [u.ae](https://u.ae/en/about-the-uae/digital-uae/digital-transformation/platforms-and-apps/uae-api-marketplace). La ficha del servicio, según la especificación técnica de la autoridad (*FTA Onboarding Technical Specifications*), es https://api.government.ae/#default/apiDetails/c.restObject.API-Portal.oY0ngV2YEfBCQABQVgESBg.-1.
  - **El acceso está restringido.** Desde fuera de su red el servidor corta la conexión segura (comprobado el 19/10/2026: el dominio existe y conecta, pero rechaza el HTTPS, mientras u.ae y tax.gov.ae abren con normalidad). Si no abre, no es la dirección: hay que pedir acceso.
  - **Para pedir acceso o resolver dudas del servicio:** soporte de e-invoicing de la autoridad, `e-invoicingsupport@tax.gov.ae` (la dirección que da la guía de onboarding en cada página).
- **La pasarela de llamadas** (`api.gsb.government.ae`) sí responde, pero cada llamada necesita las cabeceras de la tabla de abajo, que se obtienen al dar de alta al proveedor en la pasarela. Las pruebas se hacen solo contra el entorno de pruebas.
- **El contrato** (OpenAPI, Swagger, RAML, especificación y ejemplos de la pasarela GSB) está en la carpeta compartida del proyecto, `Reuniones/Documentos tecnicos/Api/`. **No está en este repositorio, que es público**, a propósito: pedírselo a producto.
  - `validateTaxPayerDetailsFTAX_openapi.json` y `validateTaxPayerDetailsFTAX.raml`: el contrato.
  - `GSB_validateTaxPayerDetails_FTAX_Specifications.docx`: campos, obligatoriedad y tabla de errores.
  - `GSB_validateTaxPayerDetails_FTAX_Service_Samples.docx`: ejemplos de cada respuesta.
- **La guía de onboarding** (*FTA Onboarding Testing Overview – User Guide*), con las capturas de las pantallas, está en `Reuniones/Documentos tecnicos/Desde Portal de Certificacion/`.

### Llamadas

Base: `https://api.gsb.government.ae/gateway/validateTaxPayerDetails_FTAX/1.0`

Cabeceras en las dos llamadas:

| Cabecera | Qué es |
|---|---|
| `GW-APIKey` | Clave del API que nos da la pasarela |
| `Authorization` | `Bearer` del servicio `getAccessToken` |
| `CustomAuth` | `Bearer` del servicio `generateAccessToken_FTAX` (**no tenemos su especificación**) |

**1. `POST /api/prc/ects-einvoicing/v1/verifyenduser`** — al pulsar «Verify Applicant Details».

```json
{ "TIN": "1000001602", "email": "admin@empresa.ae", "mobile": "", "emarataxToken": "<token de la dirección>" }
```

`mobile` es opcional. Responde `TIN`, `email`, `mobile`, `emarataxToken`, `verificationStatus`, `msgCode`, `msgDesc`, `entityNameEn`, `entityNameAr`, `vatTrn`, `effectiveDate` y `legalType`.

**2. `POST /api/prc/ects-einvoicing/v1/crregupdate`** — al pulsar «Submit», después del alta o la baja en Peppol.

```json
{
  "TIN": "1000001602", "legalType": "L3", "entityNameEn": "…", "entityNameAr": "…",
  "vatTrn": "100776655400003", "effectiveDate": "2022-02-01",
  "emarataxToken": "<token>", "peppolParticipantId": "0235:1000001602",
  "eventDate": "2026-10-16", "aspName": "…", "aspAccrediationNumber": "…",
  "reason": "…", "action": 1,
  "field1": "", "field2": "", "field3": "", "field4": "", "field5": ""
}
```

| `action` | Trámite | `reason` (obligatorio en 2 y 3) |
|---|---|---|
| `1` | Alta (Register) | — |
| `2` | Reverificación (Update) | `Reverification requested by the taxpayer` |
| `3` | Baja (Remove) | `Delinking requested by the taxpayer` |

- **El motivo no se le pregunta a la persona:** su formulario no lo tiene. Lo pone el proveedor según la acción. Los textos son nuestros: **la autoridad no publica catálogo**.
- `field1` a `field5` figuran como obligatorios y **sin descripción**.
- Responde `TIN`, `verificationStatus`, `onboardingStatus` y `recordUpdateTimestamp`. Hay que guardarlos con la fecha.

### Errores (especificación, tabla de fallos)

| Código | HTTP | Qué dice la especificación | Qué ve la persona |
|---|---|---|---|
| `GSB_001` | 500 | Servicio caído o inaccesible. «The request will not be processed… Service provider have to retry sending the request again» | EmaraTax no responde |
| `GSB_002` | 408 | Tiempo agotado. La petición no se procesa; reintenta el proveedor | EmaraTax no responde |
| `GSB_003` | 401 | Credenciales incorrectas | No pudimos completar |
| `GSB_404` | 404 | Recurso no encontrado | No pudimos completar |
| `GSB_999` | 500 | Excepción no controlada | No pudimos completar |
| — | 400 | Petición mal formada (ejemplo oficial: «One or more validation errors occurred») | No pudimos completar |

- **Reintentar es obligación del proveedor**: el servidor debería reintentar solo, una o dos veces, antes de enseñar «EmaraTax no responde».
- **Registro (requisito, hoy no existe):** guardar el código y el `Unique ReferenceID` que viene en `ExceptionDescription`, que es lo que pide el soporte de GSB.
- Los ejemplos de error del documento de muestras están copiados de otro servicio (`manageInstituteApplicantDetails_MOE`): los textos exactos pueden variar.

### Entornos

- **No se prueba contra producción.** Circular del Ministerio: «the production environment must not be used for testing activities». La página tiene que saber contra qué entorno habla, y la dirección de pruebas no puede ser la de producción.
- Entorno de pruebas declarado en la acreditación: `qas-ae-entpr-site.edoclab.com/tax-onboard`.

## 10. Seguridad (lo que no se ve)

1. **El token se borra de la barra al leerlo** y se guarda solo en memoria del servidor o de la sesión.
2. **Página de un solo uso** (CEO, 16 oct): «Si usted la vuelve a invocar, después le debe decir: este proceso ya se terminó». Si se vuelve a abrir una dirección ya usada, no se repite el trámite. **No está en la maqueta**: hoy cae en «Falta el código».
3. **Caducidad del enlace** (CEO, 16 oct): «este link solo vale por 20 minutos… se supone que debe tener un time out». **Ningún documento de la autoridad la menciona** —ni la guía, ni la especificación, ni las directrices del Ministerio v1.1, apéndice 1— y por eso la pantalla no promete plazos ni lleva cuenta atrás. Es una decisión de producto pendiente.
4. **El correo no se pega** en el paso 1.
5. **Errores genéricos**: no se dice qué dato falló, ni de quién es el fallo, ni el código de la autoridad.
6. **Nada de lo escrito sobrevive a un fallo.**
7. **Nuestra base de clientes se consulta después de la autoridad.**

## 11. Certificación y paso a producción

La misma página sirve para las dos fases, pero hay cosas que cambian. Lo primero es certificarnos con exactamente lo que pide la autoridad; las reglas de la empresa se encienden al salir a producción.

| | Certificación (pruebas de la autoridad) | Producción |
|---|---|---|
| **Entorno** | El de pruebas de la autoridad, con la dirección que declaramos en la acreditación: `https://qas-ae-entpr-site.edoclab.com/tax-onboard`. **Nunca contra producción**: circular del Ministerio, «the production environment must not be used for testing activities». | El de producción de la autoridad, con nuestra dirección de producción (pendiente de declarar). |
| **¿Es cliente nuestro?** (consulta a eDoc Consulta tras verificar) | **Apagada.** La autoridad no la pide en sus pruebas y se programa ya, pero desactivada. | **Siempre encendida.** Política de la empresa: sin contrato, documentos aprobados por la Office Manager y producto creado, no hay vinculación. |
| **Estado «no es cliente»** | No aparece. | Aparece, con «No, gracias / Sí, que me contacten» y el correo a comercial. |
| **El interruptor** | Configuración del servidor, apagada. | Configuración del servidor, encendida. **No es un parámetro de la dirección**: en la maqueta se simula con `?certificacion=1`. |
| **Alta en Peppol** | Al enviar, en el entorno de pruebas que indique la autoridad. | Al enviar, en nuestro SMP de producción. Se consulta en «Mi registro Peppol». |
| **Registro de llamadas** | Guardar cada respuesta con fecha y hora: es la evidencia. | Lo mismo, más el código de error y el `Unique ReferenceID` cuando falla. |

**Evidencias que pide la certificación** (formato de evidencia de la autoridad):

1. En EmaraTax, la persona elige a GuruSoft en la lista de proveedores y confirma («Proceed to ASP» y «Yes»).
2. La redirección llega a `tax-onboard` con el código y **el código desaparece de la barra**.
3. Verificación con el **correo correcto** (pasa a los datos de la entidad) y con un **correo incorrecto** (error genérico).
4. Envío: la declaración marcada, «Submit» y el final.
5. En EmaraTax, la vinculación hecha («Linkage Status with ASP»).
6. Lo mismo para la **reverificación** y la **baja**, que llegan con el TIN.
7. **Fecha y hora** visibles en cada captura.

Para entrar a EmaraTax de pruebas, la autoridad da credenciales y empresas de prueba ya creadas («persona 1, persona 2…»). No se crea ninguna empresa.

**Lo que es solo de la maqueta y no va al producto:**

- **Los botones «Simular…»** del paso 1 y del paso 2, y su texto «Aquí no se consulta de verdad a la autoridad». Son de prueba: en el producto las respuestas las da el API.
- **El token a la vista en la barra.** En la maqueta, sin parámetros, se escribe uno simulado para enseñar cómo llega. En el producto la barra nunca muestra el token.
- **Los parámetros `resultado`, `sincodigo`, `certificacion` e `idioma`.** Solo sirven para recorrer la maqueta.
- **Los datos de ejemplo**: Al Noor Trading LLC, el TIN `1000001602`, los correos y las fechas.
- **Las notas de diseño** (botón «Notas de diseño»), que son para el equipo.

## 12. Textos e idiomas

- Inglés por defecto y español con `?idioma=es`. Diccionario en [`assets/js/idioma.js`](../assets/js/idioma.js).
- **`tax-onboard` va siempre en inglés** (`data-idioma-propio="EN"` en el `<body>`), aunque el navegador recuerde el español de otra página. Solo cambia si su propia dirección lleva `?idioma=es`.
- **El diccionario traduce nodos de texto enteros.** Una `<strong>` dentro de una frase la parte en trozos y cada trozo necesita su entrada. Los textos que pone el guion también pasan por el diccionario.
- Términos que no se traducen: los botones y títulos de la autoridad (*Verify Applicant Details*, *Submit*, *Linking Request*, *Proceed to ASP*), TIN, TRN, Peppol, EmaraTax.

## 13. En el portal

- **Empresa activa sin designar:** franja «Tu empresa está activa. Falta que nos designes en EmaraTax», sin enlaces. **El portal no publicita el onboarding de EmaraTax**: no hay guía ni enlace, porque lo inicia EmaraTax y sin su token no se puede hacer. La portada dice «Activa · falta designarnos en EmaraTax» y Administración enseña el mismo estado. **Ningún enlace del portal lleva a `tax-onboard`**: sin el token de EmaraTax no se puede terminar.
- **Mi registro Peppol** (`peppol.html`, en Administración): el Participant ID `0235:<TIN>` con «Copiar», la fecha de alta y quién lo dio de alta. Sin designar: «Todavía no tienes registro en la red Peppol». En baja: «Dándose de baja», con el plazo de 3 días hábiles. El alta en Peppol se hace al enviar en `tax-onboard`.
- **Empresa designada:** Administración explica cómo reverificar o darse de baja (se hace en EmaraTax), el plazo de 5 días hábiles para avisar cambios (MD 243, art. 5.3) y la sanción de AED 1.000 por día (Decisión del Gabinete 106/2025).
- **El orden del negocio** (CEO, 16 oct): comercial, contrato, alta en el portal con credenciales y, después, la designación en EmaraTax. «No existe nuestro modelo de negocio de primero regístrate y luego yo te registro».

## 14. Preguntas abiertas para José y la autoridad

1. El nombre real del parámetro del token en la dirección.
2. Si el token caduca, cuánto dura y con qué respuesta lo rechaza la autoridad cuando está usado o vencido.
3. Si el token sigue valiendo después de un 408 o un 500.
4. El catálogo de `legalType`.
5. Qué son `field1` a `field5`.
6. Los textos de `reason` que acepta la autoridad.
7. La especificación de `generateAccessToken_FTAX` (`CustomAuth`).
8. La fecha de la solicitud: está en su pantalla y no en la respuesta.
9. Los largos máximos de correo y móvil.
10. Si EmaraTax indica en la dirección qué eligió la persona (Reverify u Offboarding).

## 15. Archivos

| Archivo | Qué contiene |
|---|---|
| `Emiratos/tax-onboard.html` | La página, sus estados, los simuladores y las notas de diseño |
| `Emiratos/emaratax-verificacion.html` | Redirección de la dirección antigua a `tax-onboard`, con sus parámetros |
| `Emiratos/assets/css/edoc.css` | Estilos (`reg__hecho*`, `edoc-fuera*`, `reg__nav--centro`…) |
| `Emiratos/assets/js/edoc.js` | Encabezado mínimo (`data-armazon="minimo"`), iconos y la franja del portal |
| `Emiratos/assets/js/idioma.js` | Textos en inglés |
| `vercel.json` | La reescritura de `/Emiratos/tax-onboard` a `tax-onboard.html` |
| `servidor-maqueta.py` | Servidor local sin caché y con direcciones limpias |
