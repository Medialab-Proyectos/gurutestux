# Reglamentación de Emiratos en las vistas de eDoc

Qué norma de Emiratos Árabes Unidos se aplica en cada pantalla de eDoc Emiratos, por qué, y de qué documento sale, con la página exacta y el enlace. Al final, la voz y el tono: cómo se escriben estas pantallas para cumplir sin perjudicar al negocio.

Está escrito para producto, desarrollo, comercial y gerencia. Cada regla dice qué se ve en la pantalla y por qué está ahí, sin necesidad de abrir la norma; la referencia exacta queda en la columna «Fuente».

**Cómo leer las páginas.** «Pág.» es el número impreso en el documento. Cuando el PDF numera distinto (la guía de la autoridad tiene portada e índice sin numerar), va entre paréntesis la página del archivo: «pág. 9 (PDF 11)».

**Verificado el 21 de octubre de 2026** contra los documentos originales. Cuando algo no se pudo comprobar, lo dice: «por confirmar».

---

## 1. Los documentos

Cada regla cita su documento con un código corto. Los enlaces públicos son del Ministerio de Hacienda (mof.gov.ae). Los demás salen del portal de acreditación, que exige cuenta; la copia del equipo está en la carpeta interna `Reuniones/Documentos tecnicos/`, que no se publica.

| Código | Documento | Versión | Dónde está |
|---|---|---|---|
| **GUÍA** | FTA Onboarding Testing Overview – User Guide | v1.0, 23/10/2025, clasificada «PUBLIC» | Portal de acreditación (sin enlace público). Copia: `Desde Portal de Certificacion/FTA Onboarding Testing Overview - User Guide.pdf`. Consultas: e-invoicingsupport@tax.gov.ae (pie de cada página). |
| **LIN** | UAE Electronic Invoicing Guidelines | V1.1, 01/06/2026 | [mof.gov.ae · Guidelines V1.1](https://mof.gov.ae/wp-content/uploads/2026/06/UAE-Electronic-Invoicing-Guidelines_V-1.1-01June2026.pdf) |
| **API** | GSB_validateTaxPayerDetails_FTAX Specifications | 2025 | Mercado de API del gobierno, de acceso restringido: [api.government.ae](https://api.government.ae/#default/home) (qué es: [u.ae · UAE API Marketplace](https://u.ae/en/about-the-uae/digital-uae/digital-transformation/platforms-and-apps/uae-api-marketplace)). La ficha exacta la da «FTA Onboarding Technical Specifications», pág. 2. Copia: `Api/`. |
| **TIN** | Circular – Clarification on TIN and TRN Requirements for EmaraTax End-User Onboarding | 2026 | Portal de acreditación. Copia: `Desde Portal de Certificacion/`. |
| **PASR** | United Arab Emirates – Peppol Authority Specific Requirements | — | Lo publica OpenPeppol para cada autoridad ([peppol.org · PASR](https://peppol.org/?p=2376)); no se encontró enlace directo al de Emiratos. Copia: `Desde paginas publicas Taxes Auths/`. |
| **MD243** | Ministerial Decision No. 243 of 2025 on the Electronic Invoicing System | 2025 | [mof.gov.ae · MD 243](https://mof.gov.ae/wp-content/uploads/2025/09/Ministerial-Decision-no.-243-of-2025-on-the-Electronic-Invoicing-System.pdf) |
| **MD197** | Ministerial Decision No. 197 of 2026, que modifica la MD 243 | En vigor desde el 01/10/2026 | [mof.gov.ae · MD 197](https://mof.gov.ae/wp-content/uploads/2026/10/Ministerial-Decision-No.-197-of-2026-%E2%80%93-Amending-Certain-Provisions-of-Ministerial-Decision-No.-243-of-2025-on-the-Electronic-Invoicing-System_En.pdf) |
| **CD106** | Cabinet Decision No. 106 of 2025, infracciones y sanciones de la facturación electrónica | 08/12/2025 | [mof.gov.ae · Decisión del Gabinete 106](https://mof.gov.ae/wp-content/uploads/2025/12/Cabinet-Decision-Violations-and-Penalties-eInvoicing-final-version-en-8.12.25.pdf) |
| **CAMPOS** | UAE Electronic Invoice mandatory fields | V1.0, 23/02/2026 | [mof.gov.ae · campos obligatorios](https://mof.gov.ae/wp-content/uploads/2026/02/UAE-Electronic-Invoice-mandatory-fields_V-1.0-23Feb2026.pdf) |
| **PRUEBAS** | Circular – Restriction on Testing Activities in the EmaraTax Production Environment | 22/06/2026 | Portal de acreditación. Copia: `Desde Portal de Certificacion/`. |
| **ACRED** | Nuestra solicitud de acreditación («eInvoicing Service Provider Accreditation Application») | 2026 | Documento interno, con datos técnicos que no se publican. |
| **PDPL** | Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data | En vigor desde el 02/01/2022 | [uaelegislation.gov.ae · ley 45/2021](https://uaelegislation.gov.ae/en/legislations/1972) |
| **IVA** | Federal Decree-Law No. 8 of 2017 on Value Added Tax | — | [uaelegislation.gov.ae](https://uaelegislation.gov.ae/en) (buscar «Value Added Tax») |
| **RGPD** | Reglamento (UE) 2016/679 | — | [eur-lex.europa.eu · RGPD](https://eur-lex.europa.eu/eli/reg/2016/679/oj). Solo como estándar del componente común con Francia (apartado 5). |

---

## 2. Novedades encontradas al preparar este documento

1. **La MD 197 de 2026 modifica la MD 243 desde el 1 de octubre de 2026.** Lo que nos toca:
   - **No cambia el artículo 5.** Siguen en pie los **cinco días hábiles** para avisar al proveedor de un cambio, que usamos en el portal (apartado 4).
   - **Deroga el artículo 12** (artículo tercero, MD197 pág. 2) y **elimina la definición de «System Failure»** (artículo primero, 3; pág. 1). Ver el punto 2.
   - **Plazo de emisión:** la factura se emite y transmite en un máximo de **14 días hábiles** desde la operación (art. 6.5 nuevo, pág. 2).
   - **Conservación:** remite al plazo de la Ley de Procedimientos Tributarios (art. 11 nuevo, pág. 2).
   - **Grupos fiscales:** las operaciones entre miembros del mismo grupo quedan excluidas durante 24 meses desde el 1 de enero de 2027 (art. 4.1.f, pág. 2).
2. **Corregido en la maqueta:** el aviso «Sin conexión con la autoridad» decía que el cliente debía avisar a la autoridad de una caída en 2 días hábiles. Esa obligación era el artículo 12 de la MD 243, que la MD 197 derogó. Se quitó la frase: anunciaba al cliente una obligación que ya no existe (`assets/js/datos.js` y su traducción).
3. **Corregido en la maqueta:** una nota citaba «campos obligatorios, página 5» para la regla del TIN en los grupos fiscales; está en la **página 4**.
4. **Pendiente de decisión:** el consentimiento explícito para el alta en Peppol (apartado 3.3).
5. **Pendiente de decisión:** citar la ley de Emiratos (PDPL) en las pantallas de privacidad (apartado 5).

---

## 3. Página de vinculación con EmaraTax (`tax-onboard`)

Es la página a la que EmaraTax envía a la empresa después de elegirnos como proveedor. La tarjeta blanca reproduce la pantalla que pide la autoridad; lo de alrededor es nuestro.

### 3.1 Llegada desde EmaraTax

| Lo que se ve | Por qué | Fuente |
|---|---|---|
| La empresa llega desde EmaraTax, donde eligió un proveedor de la lista y confirmó con «Proceed to ASP» y «Yes». | El trámite empieza en EmaraTax, no en eDoc. Por eso la página no tiene menú ni inicio de sesión. | **LIN** Anexo 1, pág. 39 · **GUÍA** §4, pág. 8 (PDF 10) |
| Se elige un solo proveedor. | La empresa nombra **un único proveedor** para enviar y recibir. Si ya tiene otro, cambiar es una baja allí y un alta aquí. | **LIN** pág. 14 («must appoint only one ASP») y pág. 39 |
| La dirección es la que declaramos en la acreditación (`…/tax-onboard`). | La autoridad solo redirige a la dirección declarada. Cambiarla obliga a volver a declararla. | **ACRED** pág. 5 (dirección del entorno de pruebas) |
| El código de acceso (`emarataxToken`) desaparece de la barra al leerlo. | La guía lo exige: «AUTH code parameter to be hidden after receiving the URL». Evita que quede en el historial o en una captura. | **GUÍA** §4.1, pág. 9 (PDF 11) · nombre del parámetro: **API** tabla 7 |
| La página va en inglés. | En la acreditación declaramos el portal en inglés («Is Your eInvoicing Portal Available in Arabic? No»). El sistema admite árabe e inglés; el árabe queda como decisión futura, no como obligación incumplida. | **ACRED** pág. 5 · **LIN** pág. 11 |

### 3.2 Solicitud de vinculación (alta)

| Lo que se ve | Por qué | Fuente |
|---|---|---|
| Correo del administrador y TIN obligatorios; móvil opcional; botón «Verify Applicant Details». | Es la pantalla de la guía, campo por campo: «Tax payer to key in the ADMIN email id of the selected TIN & Selected TIN number. Mobile number is optional. Click on Verify». El nombre del botón sale de su captura. | **GUÍA** §4.1, pág. 9 (PDF 11) · **API** tabla 7 (móvil 0..1) |
| Se pide el **TIN**, no el TRN. | La circular lo deja claro: el TRN no es requisito y la dirección en la red sale del TIN. | **TIN** §3, pág. 1 (PDF 3) · §5, pág. 2 (PDF 4): «The TRN shall not be used as the Peppol Participant Identifier» |
| La ayuda explica que el TIN son las diez primeras cifras del TRN, y que en un grupo fiscal es el de la propia empresa. | Es la duda más común. La norma da la respuesta exacta. | **CAMPOS** pág. 4 y glosario, pág. 6 |
| Si los datos no coinciden, el error es genérico. | La guía pide probar correo correcto e incorrecto, pero no dice qué mostrar. El mensaje genérico es decisión nuestra, por seguridad (apartado 6). | **GUÍA** §4.2, pág. 9 (PDF 11) · códigos de error: **API** tablas 12 y 13 |

### 3.3 Datos de la entidad y envío

| Lo que se ve | Por qué | Fuente |
|---|---|---|
| Los datos que devuelve EmaraTax, **sin poder editarlos**. | «Response fields from EmaraTax to be displayed without edit option». | **GUÍA** §4.2, pág. 10 (PDF 12) |
| Una casilla de declaración con el texto de la autoridad, y «Submit». | «Select the tick box and click submit». El texto de la declaración es el suyo, sin reescribirlo. | **GUÍA** §4.2, pág. 10 (PDF 12) |
| Al enviar, se crea el registro en la red Peppol y se muestra el resultado. | «ASP to call the Peppol and display the relevant details». | **GUÍA** §4.2, pág. 10 (PDF 12) |
| La dirección en la red es `0235:` + TIN (en el portal, «Mi registro Peppol»). | Es el esquema de identificación de Emiratos. | **PASR** §1, pág. 1 · **LIN** pág. 3 |

**Pendiente de decisión: consentimiento explícito.** El documento Peppol de Emiratos dice que el proveedor «MUST obtain explicit consent from an End User before registering the End User on its SMP» (**PASR** §1, pág. 1). Hoy la página solo tiene la declaración de la autoridad, que no menciona la red. No reescribimos la declaración, porque el texto no es nuestro. El consentimiento puede ir en el contrato con GuruSoft, que se firma antes, o en una casilla aparte. **Lo decide legal**, y es lo primero que conviene cerrar antes de producción.

### 3.4 Reverificación y baja

| Lo que se ve | Por qué | Fuente |
|---|---|---|
| Llega con el código y el TIN ya puesto, que no se puede tocar. | «TIN number also will be passed along with AUTH code». | **GUÍA** §5.1, pág. 11 (PDF 13) y §6.1, pág. 13 (PDF 15) |
| Hay que elegir entre «reverificar» y «darse de baja». | «Mandatory to choose one of the options». | **GUÍA** §5.1 y §6.1 (mismas páginas) |
| El motivo es obligatorio. | El campo `reason` es obligatorio para actualizar y para dar de baja. | **API** tabla 10 |
| Al final de una baja: «En un máximo de 3 días hábiles finalizaremos tu registro en la red Peppol; sin embargo, hasta entonces seguirás recibiendo los documentos que te envíen». | El proveedor anterior tiene hasta 3 días hábiles para retirar a la empresa de la red. Decirlo evita que la empresa crea que está en dos sitios a la vez o que pierde documentos. | **PASR** §5, pág. 2 («within 3 working days») |
| La baja y la reverificación se ven después en EmaraTax. | «delinked status will be displayed on EmaraTax». No hay que prometer nada más. | **GUÍA** §5.2, pág. 12 (PDF 14) y §6.2, pág. 14 (PDF 16) |

### 3.5 La empresa no es cliente

| Lo que se ve | Por qué | Fuente |
|---|---|---|
| «Tu empresa no tiene un contrato con GuruSoft», con «No, gracias» y «Sí, que me contacten». | El orden de la norma es elegir proveedor y **cerrar el contrato**, y después vincularse en EmaraTax. Sin contrato no hay vinculación. | **LIN** paso 2, pág. 21: «Select an ASP and finalize all contractual obligations. b. Onboard … via EmaraTax» |
| Solo se avisa a comercial si la persona lo pide. | Usar su correo para contactarla es un uso nuevo de sus datos; por eso se pide antes. | **PDPL** arts. 4 y 6 (consentimiento; artículos por confirmar contra el texto oficial, ver apartado 5) |

### 3.6 Certificación y producción

| Regla | Por qué | Fuente |
|---|---|---|
| Las pruebas se hacen solo en el entorno de pruebas de la autoridad, con sus empresas de prueba. | «The production environment must not be used for testing activities». | **PRUEBAS** §1, pág. 1 (PDF 3); también pág. PDF 2 |
| Para certificar se aplica exactamente lo que pide la guía. La comprobación «¿es cliente?» se enciende en producción. | La autoridad certifica su flujo. Lo nuestro (contrato primero) es política de la empresa, que la norma respalda (**LIN** pág. 21). | **GUÍA** completa · **LIN** pág. 21 |

---

## 4. Portal de eDoc

| Vista | Lo que se ve | Por qué | Fuente |
|---|---|---|---|
| **Administración › Empresa** | «Tienes cinco días hábiles desde que la autoridad te confirma el cambio para avisárnoslo, y cada día de retraso se sanciona con AED 1.000. La reverificación es la forma de hacerlo.» | Es la obligación del cliente con más multa y menos conocida. Avisarla protege al cliente y a nosotros. | **MD243** art. 5.3, pág. 4 (no la modifica **MD197**) · **CD106** tabla, infracción 6, pág. 3 · **LIN** pág. 21 y pág. 41 («using the reverification/offboarding process») |
| **Administración › Empresa** | «Entrar o salir de un grupo fiscal no cambia tu TIN.» | Tranquiliza con la regla exacta: el TIN es el de la propia empresa, no el del representante del grupo. | **CAMPOS** pág. 4 |
| **Mi registro Peppol** | La dirección `0235:` + TIN, la fecha de alta y el proveedor. | Es lo que la empresa da a sus clientes para que le envíen facturas. Se construye con el TIN y nunca con el TRN. | **PASR** §1, pág. 1 · **TIN** §5, pág. 2 (PDF 4) |
| **Registro** | La razón social vale en árabe o en alfabeto latino, y basta con una. | La factura lleva un solo nombre legal y ningún documento impone alfabeto; el sistema admite los dos idiomas. Exigir el latino sería más estricto que la norma. | **LIN** pág. 11 · **CAMPOS** (nombre legal, cardinalidad 1..1) |
| **Registro** | El tipo de documento legal: licencia comercial (TL), Emirates ID (EID), pasaporte (PAS) o decisión del gabinete (CD). | Es la lista cerrada de la norma; no se añaden ni se quitan opciones. | **CAMPOS** campo 14, págs. 8 y 9 (repetido en págs. 13 y 14) |
| **Avisos del sistema** | «Sin conexión con la autoridad»: lo emitido queda en cola y sale solo. | Ya no se anuncia un plazo de aviso a la autoridad: la obligación se derogó (apartado 2). | **MD197** artículos primero.3 y tercero, págs. 1 y 2 |
| **Emitidos** | En una factura con inversión del sujeto pasivo: «El receptor es quien debe liquidar el impuesto, conforme al artículo 48 del Decreto-Ley del IVA». | Explica por qué esa factura no lleva el IVA cobrado. | **IVA** art. 48 (por confirmar contra el texto oficial) |
| **Emitidos** | Los documentos emitidos no se borran. | La norma obliga a conservarlos durante el plazo de la Ley de Procedimientos Tributarios. | **MD197** art. 11 nuevo, pág. 2 (por confirmar el número de años con legal) |

---

## 5. Privacidad

**En Emiratos manda la ley de datos de Emiratos (PDPL), no el RGPD.** La PDPL aplica a los datos de personas en Emiratos, con exclusión de las zonas francas financieras DIFC y ADGM, que tienen ley propia. Las pantallas de privacidad son un componente común con Francia y sus notas citan el RGPD, que cubre de sobra lo que pide la PDPL. Aun así, en Emiratos la cita correcta es la PDPL.

| Vista | Lo que se ve | Fuente en Emiratos | Estándar del componente |
|---|---|---|---|
| **Registro**, paso final | Dos casillas sin marcar: términos y política de privacidad. | **PDPL** art. 6 (consentimiento) | **RGPD** art. 7 |
| **Inicio** | Si cambian los términos, se piden otra vez y queda la versión y la hora. | **PDPL** art. 6 | **RGPD** art. 7.1 |
| **Mi perfil › Privacidad** | Un botón por derecho: copia, corregir, limitar, oponerse, eliminar, portabilidad. | **PDPL** arts. 13 a 18 (derechos del titular) | **RGPD** arts. 15 a 21 |
| **Solicitudes de privacidad** (interna) | Bandeja con plazo y verificación de identidad. | **PDPL** (plazos en el reglamento ejecutivo) | **RGPD** art. 12.3 y 12.6 |
| **Legales** | «Tus derechos sobre tus datos». | **PDPL** art. 13 | **RGPD** art. 13 |

**Por confirmar.**

- Los números de artículo de la PDPL salen de fuentes secundarias: el portal oficial no respondió al verificarlos (error 403). Hay que contrastarlos con el texto oficial.
- El reglamento ejecutivo de la PDPL no está publicado, así que los plazos de respuesta en Emiratos no están fijados. Usamos el del RGPD (un mes).
- **Decisión pendiente:** cambiar las notas de las pantallas de Emiratos para que citen la PDPL como norma y el RGPD como estándar común.

---

## 6. Voz y tono

Estas reglas salen de las revisiones de producto de octubre de 2026. Sirven para cumplir con la autoridad sin perjudicar al negocio. Valen para toda pantalla nueva de Emiratos.

### 6.1 Lo de la autoridad no se toca

- **La tarjeta blanca es de la autoridad.** Campos, orden, textos y nombre del botón («Verify Applicant Details») son los de su guía. Lo que está fuera de la tarjeta es nuestro.
- **No se reescriben sus textos.** La declaración es la suya, palabra por palabra. Si necesitamos decir algo más (el consentimiento para la red), va aparte.
- **No se inventa lo que la autoridad no dijo.** Por ejemplo, ningún documento dice cuánto dura el código de acceso. Por eso no se anuncia que caduca.
- **No se pide más de lo que pide la norma.** Por ejemplo, no se exige el alfabeto latino ni el TRN. Ser más estrictos por nuestra cuenta es lo primero que se mira en una revisión.

### 6.2 Errores que no dan pistas ni culpan

- **Errores genéricos.** El mensaje no dice qué campo falló. Así no se puede adivinar un correo o un TIN probando.
- **No se culpa a nadie.** Ni «el fallo es nuestro» ni «el fallo es tuyo». Un error puede venir de un intento de fraude, de una letra cambiada o de la autoridad. Se dice qué hacer: «vuelve a intentarlo y, si sigue, escríbenos».
- **Un solo error de conexión.** No se distingue si cayó la autoridad o nuestro servidor.
- **Al reintentar se empieza de cero.** No se guardan los datos escritos ni la opción elegida.
- **El correo que devuelve la autoridad nunca se muestra.**

### 6.3 Solo se promete lo que existe

- No hay número de referencia, aviso por correo ni alerta si no hay un registro que lo respalde.
- Los plazos que se dan son los de la norma, con su fuente: 3 días hábiles para la baja y 5 para avisar de un cambio. Si la norma cambia, el texto cambia (apartado 2).
- No se anuncian obligaciones derogadas ni multas que no apliquen. Asustar al cliente sin motivo también es un error.

### 6.4 Formal y breve

- **Formal.** Se dice «Comunicamos tu baja con GuruSoft. En un máximo de 3 días hábiles finalizaremos tu registro…», no «te sacamos de la red».
- **Sin jerga.** No se escribe «linking», «delinking», SMP ni «Participant ID» en la página de vinculación; la dirección `0235:` solo aparece en «Mi registro Peppol».
- **Breve.** La ayuda va plegada y lo contiene todo. La pantalla muestra solo lo necesario para dar el paso.
- **Sin avisos flotantes de confirmación.** El resultado se ve en la propia pantalla.
- **Para gerentes, no técnicos.** Frases cortas y ejemplos concretos.

### 6.5 Lo que protege al negocio

- **Primero el contrato.** No se vincula a una empresa sin contrato con GuruSoft. Esto lo respalda **LIN** pág. 21.
- **La página de vinculación no es un registro.** Desde ella no se crea cuenta ni se vende. Si no es cliente, se ofrece el contacto y solo se avisa a comercial si la persona lo pide.
- **No se publicita la dirección de vinculación.** Solo debe llegarse a ella desde EmaraTax.
- **No se amplía el alcance.** Hacemos lo que pide la autoridad, bien hecho; lo demás se decide aparte.
- **Primero la certificación.** Lo nuestro (comprobar si es cliente) se enciende en producción.
- **Cada afirmación normativa, con su fuente.** Si una pantalla cita una norma, esa norma está en este documento con su página. Las normas cambian, como la MD 197, y hay que poder revisarlas rápido.

---

## 7. Mantener este documento

- Cuando el Ministerio publique algo nuevo en [mof.gov.ae/einvoicing](https://mof.gov.ae/einvoicing/), se revisa este documento antes que las pantallas.
- Si una regla cambia, se corrige la pantalla, su nota de diseño y la fila de este documento, con la fecha.
- Lo marcado «por confirmar» se cierra con legal o con la autoridad (e-invoicingsupport@tax.gov.ae).
