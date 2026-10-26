# Pruebas de la vinculación con EmaraTax

Cada caso de la guía de pruebas de la autoridad, con lo que debe verse en la pantalla de eDoc y el enlace para abrirlo en la maqueta. Sirve para preparar las evidencias de la etapa 2 (Sandbox testing) y para que desarrollo compare su versión con la maqueta, caso por caso.

**Fuente:** «UAE E-invoicing · FTA Onboarding Testing Overview User Guide», borrador 1.0 del 23 de octubre de 2025 (Federal Tax Authority). Las páginas son las de la guía. Para los errores técnicos, la especificación del servicio «GSB validateTaxPayerDetails_FTAX» (tablas 12, 13 y 16).

**Cómo usar los enlaces:** abren la maqueta en inglés, como se verá en producción. Para verla en español, añade `&idioma=es` al final. La dirección base es `https://gurutestux.vercel.app/Emiratos/tax-onboard.html`; el resto es el caso. La maqueta no consulta a la autoridad: cada enlace enseña la respuesta de ese caso.

**Cómo leer la tabla:**

- **Tipo:** *positivo* confirma que el paso funciona; *negativo* comprueba cómo se maneja el error. La guía pide los dos para cada paso: «positive test cases to confirm successful operation» y «negative test cases to assess error handling» (pág. 4).
- **Pantalla de:** *EmaraTax* si la pantalla es de la autoridad (la evidencia se toma allí) o *eDoc* si es nuestra.

---

## 1. Resumen

| Paso de la guía | Casos | En eDoc | De EmaraTax |
|---|---|---|---|
| 2. Sign in to EmaraTax | 2 | — | 2 |
| 3. Select the VAT persona | 1 | — | 1 |
| 4. Onboarding Process | 9 | 7 | 2 |
| 5. Reverification Process | 6 | 5 | 1 |
| 6. Offboarding Process | 5 | 4 | 1 |
| Errores técnicos (especificación del servicio) | 5 | 5 | — |
| **Total** | **28** | **21** | **7** |

Los 21 casos de eDoc tienen su pantalla en la maqueta.

---

## 2. Sign in to EmaraTax (págs. 4 y 5)

| N.º | Caso de la guía | Tipo | Pantalla de | Qué debe verse |
|---|---|---|---|---|
| 2.1 | User Interface Page: «EmaraTax Verifies whether the login is successful or not» | Positivo | EmaraTax | El inicio de sesión del usuario de prueba |
| 2.2 | Successful display of the Taxable Persona: «Display the list of Taxable persona List» | Positivo | EmaraTax | La lista de personas obligadas del usuario |

## 3. Select the VAT persona (págs. 6 y 7)

| N.º | Caso de la guía | Tipo | Pantalla de | Qué debe verse |
|---|---|---|---|---|
| 3 | Buscar la empresa por nombre o TIN, «View», pestaña E-invoicing y el aviso para seguir | Positivo | EmaraTax | La persona elegida y el aviso («disclaimer») |

## 4. Onboarding Process: el alta (págs. 7 a 10)

| N.º | Caso de la guía | Tipo | Pantalla de | Qué debe verse | Enlace |
|---|---|---|---|---|---|
| 4.0 | Lista de proveedores, elegir GuruSoft y «Yes» | Positivo | EmaraTax | La lista y la confirmación | — |
| 4.1 | Redirection to ASP: «AUTH code parameter to be hidden after receiving the URL» | Positivo | eDoc | «Linking Request · Applicant Details» y la dirección sin el código | [A](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123) |
| 4.1‑N | Llega sin el código de EmaraTax | Negativo | eDoc | «The EmaraTax code is missing». Volver a EmaraTax y pulsar «Proceed to ASP» | [B](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?sincodigo=1) |
| 4.2 | After clicking Verify, correo correcto: «Response fields from EmaraTax to be displayed without edit option» | Positivo | eDoc | «Entity Details» sin editar, la declaración y «Submit» | [C](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=ok) |
| 4.2‑N | After clicking Verify, correo incorrecto («test the correct email and wrong email») | Negativo | eDoc | «The email or TIN does not match EmaraTax», «Check both details as registered in EmaraTax and try again» y «Try again» | [D](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=no) |
| 4.2‑N | Submit sin marcar la casilla | Negativo | eDoc | «Tick the box to be able to send it» | [E](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=sincasilla) |
| 4.2 | «Select the tick box and click submit» | Positivo | eDoc | «Process completed»: GuruSoft queda como proveedor y se crea el registro en Peppol | [F](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=completado) |
| 4.2‑N | «Recommended to test the peppol linked TIN also»: el TIN ya está en Peppol con otro proveedor | Negativo | eDoc | «Your company is already registered in Peppol with another provider» y «We have not changed anything» | [G](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=peppol) |
| 4.3 | Linked details on EmaraTax: «After successful linking, details will be displayed on EmaraTax» | Positivo | EmaraTax | GuruSoft en «Linkage Status with ASP» | — |

## 5. Reverification Process: reverificar (págs. 10 a 12)

| N.º | Caso de la guía | Tipo | Pantalla de | Qué debe verse | Enlace |
|---|---|---|---|---|---|
| 5.1 | Llega con el TIN: «has reverify or delinking option… (Mandatory to choose one of the options)» | Positivo | eDoc | El TIN puesto por la autoridad y bloqueado, y las dos opciones | [H](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602) |
| 5.1‑N | Verificar sin elegir una opción | Negativo | eDoc | «Choose whether to stay with us or unlink. One of the two must be chosen» | [I](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&resultado=sinaccion) |
| 5.2 | After clicking verify, correo correcto | Positivo | eDoc | «Entity Details» sin editar, la declaración y «Submit» | [J](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&resultado=ok) |
| 5.2‑N | After clicking verify, correo incorrecto | Negativo | eDoc | «The email or TIN does not match EmaraTax» y «Try again» | [K](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&resultado=no) |
| 5.2 | Casilla y Submit; el TIN vinculado en Peppol es el nuestro y se actualiza | Positivo | eDoc | «Process completed»: los datos quedan actualizados con GuruSoft | [L](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&resultado=completado) |
| 5.3 | Linked details on EmaraTax después de reverificar | Positivo | EmaraTax | Los datos actualizados en «Linkage Status with ASP» | — |

## 6. Offboarding Process: la baja (págs. 12 a 14)

| N.º | Caso de la guía | Tipo | Pantalla de | Qué debe verse | Enlace |
|---|---|---|---|---|---|
| 6.1 | Llega con el TIN y se elige «Delinking» | Positivo | eDoc | El TIN bloqueado y «Delinking» elegido | [M](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&accion=baja) |
| 6.2 | After clicking verify, correo correcto | Positivo | eDoc | «Entity Details» sin editar, la declaración y «Submit» | [N](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&accion=baja&resultado=ok) |
| 6.2‑N | After clicking verify, correo incorrecto | Negativo | eDoc | «The email or TIN does not match EmaraTax» y «Try again» | [O](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&accion=baja&resultado=no) |
| 6.2 | Casilla y Submit: «Delinked details will be sent to EmaraTax via API» | Positivo | eDoc | «Process completed»: la baja comunicada y salida de Peppol en 3 días hábiles como máximo | [P](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&accion=baja&resultado=completado) |
| 6.3 | Linked details on EmaraTax después de la baja | Positivo | EmaraTax | El estado de desvinculado en EmaraTax | — |

Los **3 días hábiles** de la baja salen de los requisitos de la autoridad Peppol de Emiratos («United Arab Emirates – Peppol Authority Specific Requirements», pág. 2, punto 5): «the existing Accredited SP MUST deregister the End-User from their SMP within 3 working days».

## 7. Errores técnicos (pruebas negativas)

La guía pide evaluar cómo se manejan los errores (pág. 4). Los códigos salen de la especificación del servicio, que para 408 y 500 dice: «the request will not be processed» y «Service provider have to retry sending the request again» (tabla 12).

| N.º | Caso | Código | Qué debe verse | Enlace |
|---|---|---|---|---|
| E1 | EmaraTax no responde al verificar | 408 GSB_002 · 500 GSB_001 / GSB_999 | «EmaraTax is not responding right now», «It is not a problem with your details» y «Try again» | [Q](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=noresponde) |
| E2 | Fallo nuestro al verificar | 401 GSB_003 · 404 GSB_404 · 400 | «We could not complete the request», soporte con el TIN y «Try again» | [R](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=nuestro) |
| E3 | EmaraTax no responde al enviar | 408 · 500 | «We have received your request»: se reintenta durante una hora, sin botón | [S](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=espera) |
| E4 | Fallo nuestro al enviar | 401 · 404 · 400 · fallo en Peppol | «We could not complete the request» | [T](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=envio) |
| E5 | Cuadra con EmaraTax pero no es cliente nuestro (solo en producción) | — | «Your company does not have a contract with GuruSoft» y la pregunta de pasar el contacto a comercial | [U](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=nocliente) |

---

## 8. Para preparar la evidencia

Lo pidió Alejandro en la revisión del 26 de octubre:

- **La numeración de la guía, tal cual:** 2 Sign in to EmaraTax, 2.1 User Interface Page… como en esta tabla. Ni otra numeración ni otros nombres.
- **Sin columna de «pasó, falló, bloqueado»:** es una evidencia, no una prueba de calidad.
- **Debajo de cada captura, qué muestra y la hora:** la de Emiratos y la de Colombia. Para no convertir horas, el equipo que toma las capturas puede poner Windows en la zona «(UTC+04:00) Abu Dabi, Mascate».
- **Con los datos de prueba de la autoridad:** una captura con otro correo (por ejemplo, uno nuestro) no sirve. Si todavía no los tenemos, mejor esperar.
- **Las instrucciones internas en amarillo** y con «solo uso interno», para quitarlas del documento final.

## 9. Pendiente de confirmar

| Tema | Con quién |
|---|---|
| Cuánto dura el código de EmaraTax y si sirve para reintentar durante una hora (E3) | José y la autoridad (e-invoicingsupport@tax.gov.ae) |
| Qué fecha se manda al reintentar (`eventDate`) y que reintentar no dé de alta dos veces en Peppol | José |
| Qué responde el registro de Peppol cuando el TIN ya está con otro proveedor (4.2-N) y si conviene comprobarlo al verificar | José |
| «ASP to call the Peppol and display the relevant details» (pág. 10): «Process completed» dice que se creó el registro en Peppol, pero no enseña el identificador 0235:TIN, que se quitó en la reunión del 19 de octubre | Alejandro o gerencia |
| La plantilla de evidencias de la etapa 2 con sus puntos («please provide evidence…»), que no está en `Reuniones/Documentos tecnicos` | Alejandro |

---

## Enlaces

Dirección base: `https://gurutestux.vercel.app/Emiratos/tax-onboard.html`

| | Caso | Enlace |
|---|---|---|
| A | 4.1 Redirección | [?emarataxToken=abc123](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123) |
| B | 4.1-N Sin código | [?sincodigo=1](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?sincodigo=1) |
| C | 4.2 Correo correcto | [?emarataxToken=abc123&resultado=ok](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=ok) |
| D | 4.2-N Correo incorrecto | [?emarataxToken=abc123&resultado=no](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=no) |
| E | 4.2-N Sin casilla | [?emarataxToken=abc123&resultado=sincasilla](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=sincasilla) |
| F | 4.2 Alta completada | [?emarataxToken=abc123&resultado=completado](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=completado) |
| G | 4.2-N TIN ya en Peppol | [?emarataxToken=abc123&resultado=peppol](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=peppol) |
| H | 5.1 Reverificación | [?emarataxToken=abc123&TIN=1000001602](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602) |
| I | 5.1-N Sin elegir | [?emarataxToken=abc123&TIN=1000001602&resultado=sinaccion](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&resultado=sinaccion) |
| J | 5.2 Correo correcto | [?emarataxToken=abc123&TIN=1000001602&resultado=ok](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&resultado=ok) |
| K | 5.2-N Correo incorrecto | [?emarataxToken=abc123&TIN=1000001602&resultado=no](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&resultado=no) |
| L | 5.2 Reverificación completada | [?emarataxToken=abc123&TIN=1000001602&resultado=completado](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&resultado=completado) |
| M | 6.1 Delinking elegido | [?emarataxToken=abc123&TIN=1000001602&accion=baja](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&accion=baja) |
| N | 6.2 Correo correcto | [?emarataxToken=abc123&TIN=1000001602&accion=baja&resultado=ok](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&accion=baja&resultado=ok) |
| O | 6.2-N Correo incorrecto | [?emarataxToken=abc123&TIN=1000001602&accion=baja&resultado=no](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&accion=baja&resultado=no) |
| P | 6.2 Baja completada | [?emarataxToken=abc123&TIN=1000001602&accion=baja&resultado=completado](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&TIN=1000001602&accion=baja&resultado=completado) |
| Q | E1 No responde al verificar | [?emarataxToken=abc123&resultado=noresponde](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=noresponde) |
| R | E2 Fallo nuestro al verificar | [?emarataxToken=abc123&resultado=nuestro](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=nuestro) |
| S | E3 No responde al enviar | [?emarataxToken=abc123&resultado=espera](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=espera) |
| T | E4 Fallo nuestro al enviar | [?emarataxToken=abc123&resultado=envio](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=envio) |
| U | E5 No es cliente | [?emarataxToken=abc123&resultado=nocliente](https://gurutestux.vercel.app/Emiratos/tax-onboard.html?emarataxToken=abc123&resultado=nocliente) |
