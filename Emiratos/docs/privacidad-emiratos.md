# Privacidad en eDoc Emiratos (épica 3)

Qué norma se aplica en cada pantalla de la épica 3 (historias HU-13 a HU-17), por qué, y de qué documento sale, con la página exacta y el enlace. Al final, la voz y el tono: cómo se escriben estas pantallas para cumplir sin perjudicar al negocio.

Está escrito para producto, desarrollo, legal y gerencia.

**Cómo leer las páginas.** En la ley de Emiratos, la página es la de la edición inglesa de Lexis Middle East (11 páginas). En el RGPD, «DO» es la página del Diario Oficial de la UE (L 119), igual en todos los idiomas. En la guía del Comité Europeo, «apdo.» es el número de párrafo, que no cambia entre versiones.

**Verificado el 21 de octubre de 2026** contra los textos y **ampliado el 23 de octubre** con la sección 4, que explica por qué estas normas y no otras, y **actualizado el 26 de octubre**: vuelve la casilla de aceptación del tratamiento de datos (reunión con Alejandro del 25 de octubre). Cuando algo no se pudo comprobar, lo dice: «por confirmar».

---

## 1. Los documentos

| Código | Documento | Enlace |
|---|---|---|
| **PDPL** | Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (ley de datos de Emiratos). En vigor desde el 02/01/2022. | Oficial: [uaelegislation.gov.ae · ley 45/2021](https://uaelegislation.gov.ae/en/legislations/1972). El portal pide una verificación de navegador, así que las páginas se citan de la edición inglesa de Lexis Middle East: [PDF de 11 páginas](https://privacyarabia.com/wp-content/uploads/2022/08/Decree-Law-45-2021-Data-Protection-Law-English.pdf) ([ficha en Lexis](https://www.lexismiddleeast.com/law/UnitedArabEmirates/DecreeLaw_45_2021/en)). Resumen del gobierno: [u.ae · leyes de protección de datos](https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws). |
| **RGPD** | Reglamento (UE) 2016/679, DO L 119 de 04/05/2016. | [DOUE en español (BOE)](https://www.boe.es/doue/2016/119/L00001-00088.pdf) · [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj) |
| **EDPB** | Comité Europeo de Protección de Datos, Directrices 05/2020 sobre el consentimiento, v1.1. | [edpb.europa.eu · directrices 05/2020 (ES)](https://www.edpb.europa.eu/system/files/documents/files/file1/edpb_guidelines_202005_consent_es.pdf) |
| **MD197** | Ministerial Decision No. 197 of 2026, que modifica la MD 243 (facturación electrónica). En vigor desde el 01/10/2026. | [mof.gov.ae · MD 197](https://mof.gov.ae/wp-content/uploads/2026/10/Ministerial-Decision-No.-197-of-2026-%E2%80%93-Amending-Certain-Provisions-of-Ministerial-Decision-No.-243-of-2025-on-the-Electronic-Invoicing-System_En.pdf) |
| **MD168** | Ministerial Decision No. 168 of 2026, criterios y procedimiento de acreditación de proveedores (deroga la MD 64 de 2025). | [mof.gov.ae · MD 168](https://mof.gov.ae/wp-content/uploads/2026/10/Ministerial-Decision-No-168-of-2026-on-Eligibility-criteria-and-Accreditation-Procedure-EN-FINAL.pdf) |

---

## 2. Qué ley manda y por qué el componente usa el RGPD

**En Emiratos manda la PDPL.** Se aplica a quien trata datos de personas que residen o tienen negocio en Emiratos, esté donde esté el responsable (**PDPL** art. 2, pág. 3). GuruSoft queda dentro.

**Excepción: las zonas francas con ley propia** (**PDPL** art. 2.g, pág. 3). Un cliente de DIFC o ADGM se rige por la ley de su zona. Hay que saber si tenemos alguno (por confirmar con legal).

**El RGPD es el estándar del componente.** Las pantallas de privacidad son las mismas que en Francia. El RGPD es más exigente que la PDPL en todo lo que tocan estas pantallas, así que cumplirlo cubre la PDPL. Hay cuatro diferencias que se notan en pantalla:

| Tema | PDPL (Emiratos) | RGPD (estándar) | Qué hacemos |
|---|---|---|---|
| Plazo para responder | La ley no lo fija; lo dejará el reglamento ejecutivo (art. 28, pág. 10), que no está publicado. | Un mes, prorrogable dos más avisando (art. 12.3, DO 40). | Un mes, como compromiso propio. |
| Verificar la identidad | La ley no lo dice. | Si hay dudas razonables, se piden datos (art. 12.6, DO 40). | Se verifica, como buena práctica. |
| Oponerse | Solo frente a marketing directo, estadística o un tratamiento ilegal (art. 17, pág. 8). | Más amplio (art. 21, DO 45). | Se ofrece el botón; la respuesta depende del caso. |
| Dónde reclamar | Ante la Oficina de Datos de Emiratos (art. 24, pág. 10). | Ante la autoridad de control (art. 77, DO 80). | En Emiratos, «Legales» debe nombrar la Oficina de Datos de Emiratos (UAE Data Office). |

---

## 3. Por historia

### HU-13 · Aceptar los términos y el tratamiento de datos (Registro, paso final)

[Ver en la maqueta](https://gurutestux.vercel.app/Emiratos/registro.html?empezar=1)

![Registro, paso final: tres casillas sin marcar; los términos se aceptan, la política se declara leída y el tratamiento de datos se acepta aparte.](img/privacidad/hu13-registro-aceptaciones.png)

*Registro, paso final: tres casillas sin marcar; los términos se aceptan, la política se declara leída y el tratamiento de datos se acepta aparte.*

| Lo que se ve | Por qué | Emiratos | Estándar |
|---|---|---|---|
| «Accept the Terms of service»: casilla sin marcar, obligatoria. | Es el contrato. Para tratar los datos que el servicio necesita no hace falta consentimiento: basta con el contrato y las obligaciones fiscales. | **PDPL** art. 4, casos 9 (contrato) y 10 (obligación legal), pág. 4 | **RGPD** art. 6.1.b y c, DO 36 |
| «I have read the Privacy policy»: se informa, no se pide aceptar. | La política se da **antes** de tratar los datos: para qué, con quién se comparten y qué pasa si salen del país. | **PDPL** art. 13, último párrafo, pág. 7 | **RGPD** art. 13, DO 40–41 |
| «I accept the processing of my personal data as explained in the Privacy policy»: casilla aparte, sin marcar, obligatoria, con su versión y fecha. | Un oficial de seguridad pregunta dónde aceptó el usuario el tratamiento, y la respuesta tiene que estar a la vista, no deducirse del contrato. Se puede retirar desde Mi perfil: el usuario se desactiva, pero la empresa sigue con sus otros usuarios. Va separada de los términos, para que se vea como lo que es. | **PDPL** art. 6.A (demostrar la aceptación), 6.B (clara e inequívoca) y 6.C (retirable), pág. 4 | **RGPD** art. 7.1 y 7.3, DO 37 |

### HU-14 · Ver y descargar mis datos (Mi perfil › Privacy)

[Ver en la maqueta](https://gurutestux.vercel.app/Emiratos/mi-perfil.html?pestana=privacidad)

![Mi perfil › Privacy: qué datos, para qué y hasta cuándo; la descarga; lo aceptado y los derechos.](img/privacidad/hu14-mi-perfil-privacidad.png)

*Mi perfil › Privacy: qué datos, para qué y hasta cuándo; la descarga; lo aceptado y los derechos.*

| Lo que se ve | Por qué | Emiratos | Estándar |
|---|---|---|---|
| Qué datos guardamos, para qué y hasta cuándo. | Es el derecho a la información: tipos de datos, fines y plazos de conservación. | **PDPL** art. 13.1 a, b y e, pág. 7 | **RGPD** art. 15.1, DO 43 |
| «Download my data» descarga un archivo al momento. | Copia en formato estructurado y legible por máquina. | **PDPL** art. 14, pág. 7 | **RGPD** art. 15.3, DO 43 y art. 20.1, DO 45 |
| Las facturas no están aquí. | Son datos de la empresa, no de la persona, y tienen su propia obligación de conservación (HU-15). | — | — |
| «What you accepted»: documento, versión y fecha. | Hay que poder **demostrar** qué aceptó y cuándo. | **PDPL** art. 6.A, pág. 4 | **RGPD** art. 7.1, DO 37 · **EDPB** sección 5.1, pág. 21 |

### HU-15 · Ejercer mis derechos (Mi perfil › Privacy)

[Ver en la maqueta](https://gurutestux.vercel.app/Emiratos/mi-perfil.html?pestana=privacidad) · [Legales](https://gurutestux.vercel.app/Emiratos/legales.html)

![Pedir un derecho: un formulario breve y el plazo de respuesta.](img/privacidad/hu15-pedir-corregir.png)

*Pedir un derecho: un formulario breve y el plazo de respuesta.*

![Eliminar la cuenta: antes de enviar se dice que las facturas se conservan el plazo legal.](img/privacidad/hu15-pedir-eliminar.png)

*Eliminar la cuenta: antes de enviar se dice que las facturas se conservan el plazo legal.*

![Legales: los derechos y dónde reclamar en Emiratos, la Oficina de Datos (UAE Data Office).](img/privacidad/legales-derechos.png)

*Legales: los derechos y dónde reclamar en Emiratos, la Oficina de Datos (UAE Data Office).*

| Lo que se ve | Por qué | Emiratos | Estándar |
|---|---|---|---|
| Un botón por derecho y un formulario breve. | La ley pide medios «apropiados y claros» para ejercerlos. | **PDPL** art. 19, pág. 9 | **RGPD** art. 12.2, DO 40 |
| Corregir. | Corrección sin demora de lo inexacto. | **PDPL** art. 15.1, pág. 7 | **RGPD** art. 16, DO 43 |
| Limitar. | Por ejemplo, mientras se comprueba si un dato es correcto. | **PDPL** art. 16, pág. 8 | **RGPD** art. 18, DO 44 |
| Oponerse. | En Emiratos es más estrecho (apartado 2). | **PDPL** art. 17, pág. 8 | **RGPD** art. 21, DO 45 |
| Eliminar mi cuenta, con el aviso de que las facturas se conservan el plazo legal. | No se borra lo que otra ley obliga a guardar. Las facturas electrónicas se conservan el plazo de la Ley de Procedimientos Tributarios. | **PDPL** art. 15.3.c, pág. 8 · **MD197** art. 11, pág. 2 | **RGPD** art. 17.3.b, DO 44 |
| Respuesta en un mes como máximo. | Compromiso propio: la PDPL no fija plazo (apartado 2). | **PDPL** art. 28, pág. 10 | **RGPD** art. 12.3, DO 40 |
| Retirar tu aceptación del tratamiento. | Se puede retirar en cualquier momento y tan fácil como se dio. Se explica antes qué pasa: se desactiva el usuario y la empresa sigue con sus otros usuarios. | **PDPL** art. 6.C, pág. 4 | **RGPD** art. 7.3, DO 37 |
| «Your requests» muestra el estado y la respuesta. | La persona ve qué pasó con lo que pidió, sin prometer avisos que no existen. | **PDPL** art. 19, pág. 9 | **RGPD** art. 12.3, DO 40 |
| «If you disagree with our reply, you can file a complaint with the UAE Data Office» (Mi perfil y Legales). | En Emiratos se reclama ante la Oficina de Datos, y se nombra: «la autoridad de protección de datos» no le dice a la persona adónde ir. | **PDPL** art. 24, pág. 10 | **RGPD** art. 77, DO 80 |

### HU-16 · Volver a aceptar si cambian los términos (Inicio)

[Términos nuevos](https://gurutestux.vercel.app/Emiratos/inicio.html?terminos=nuevos) · [Política nueva](https://gurutestux.vercel.app/Emiratos/inicio.html?privacidad=nueva)

![Términos nuevos: ventana obligatoria con lo que cambia, «Accept and continue» o salir.](img/privacidad/hu16-terminos-nuevos.png)

*Términos nuevos: ventana obligatoria con lo que cambia, «Accept and continue» o salir.*

![Política nueva: solo un aviso que informa; no hay que aceptar nada.](img/privacidad/hu16-politica-nueva.png)

*Política nueva: solo un aviso que informa; no hay que aceptar nada.*

| Lo que se ve | Por qué | Emiratos | Estándar |
|---|---|---|---|
| Si cambian los términos: ventana obligatoria con lo que cambia, «Accept and continue» o salir. Queda la versión y la hora. | Un contrato nuevo se acepta otra vez, y la aceptación tiene que poder demostrarse. | **PDPL** art. 6.A, pág. 4 | **RGPD** art. 7.1, DO 37 |
| Si solo cambia la política de privacidad: un aviso que informa, sin pedir aceptar. | La política informa; no es un consentimiento. Pedir que se acepte la convertiría en uno. | **PDPL** art. 13, pág. 7 | **RGPD** art. 12.1, DO 39 |

### HU-17 · Atender las solicitudes (bandeja interna)

[Ver en la maqueta](https://gurutestux.vercel.app/Emiratos/privacidad-solicitudes.html)

![Bandeja interna: cada solicitud con su plazo; «Reply» espera a verificar la identidad.](img/privacidad/hu17-bandeja-solicitudes.png)

*Bandeja interna: cada solicitud con su plazo; «Reply» espera a verificar la identidad.*

| Lo que se ve | Por qué | Emiratos | Estándar |
|---|---|---|---|
| Semáforo con el plazo de cada solicitud. | Se responde dentro del mes que prometemos. | **PDPL** art. 28, pág. 10 (sin plazo propio) | **RGPD** art. 12.3, DO 40 |
| «Reply» espera a verificar la identidad. | Entregar datos a quien no es el titular sería una filtración. | — (la ley no lo regula) · **PDPL** art. 13.3.d, pág. 7 (no si afecta a datos de otros) | **RGPD** art. 12.6, DO 40 |
| «Extend» exige el motivo. | La prórroga se avisa a la persona con su motivo. | — | **RGPD** art. 12.3, DO 40 |
| Se puede rechazar una solicitud repetida o abusiva, con motivo. | La ley lo permite si no está relacionada o es excesivamente repetitiva. | **PDPL** art. 13.3.a, pág. 7 | **RGPD** art. 12.5, DO 40 |

---

## 4. Por qué estas normas y no otras

No es que solo esto aplique. El documento cubre la épica 3, que son **pantallas**, así que de cada norma se toman solo los artículos que una pantalla pone en práctica. Las demás obligaciones de las mismas leyes también aplican, pero no tienen pantalla: son de seguridad, de legal o de desarrollo (apartado 4.3).

### 4.1 Cómo se eligieron

1. **Qué ley aplica.** La PDPL, porque se aplica a quien trata datos de personas en Emiratos, esté donde esté el responsable. El RGPD, como estándar del componente común con Francia. La guía del Comité Europeo, porque es la interpretación oficial del RGPD sobre el consentimiento. La MD 197, porque fija la conservación de las facturas.
2. **Qué ve el usuario.** De cada norma, solo los artículos que se convierten en algo que se ve o se pulsa.
3. **Lo vigente y comprobable.** Cada cita está verificada contra el texto, con su página. Lo no publicado queda marcado como pendiente.

### 4.2 La frase de la norma que hace necesaria cada pantalla

Las citas son literales y cortas; la página es la del documento indicado en el apartado 1.

| Pantalla o elemento | Lo que dice la norma | Dónde |
|---|---|---|
| **Todo el componente** | El responsable aplica medidas «concebidas para aplicar de forma efectiva los principios de protección de datos». | **RGPD** art. 25 (protección de datos desde el diseño), DO 48 |
| **Registro:** casilla aparte de aceptación del tratamiento | La aceptación tiene que poder demostrarse: el responsable «must be able to prove the Consent of the Data Subject». | **PDPL** art. 6.A, pág. 4 |
| | Y tiene que poder retirarse: «Consent must indicate the right of the Data Subject to withdraw». | **PDPL** art. 6.C, pág. 4 |
| | El contrato también es base legal: el tratamiento es lícito si es «necessary to perform a contract to which the Data Subject is a party». Por eso retirar la aceptación desactiva al usuario, no a la empresa. | **PDPL** art. 4, caso 9, pág. 4 · **RGPD** art. 6.1.b, DO 36 |
| **«What you accepted»** y la re-aceptación con versión y hora | El responsable «must be able to prove the Consent of the Data Subject». | **PDPL** art. 6.A, pág. 4 |
| | El responsable «deberá ser capaz de demostrar que aquel consintió». | **RGPD** art. 7.1, DO 37 |
| **Mi perfil › Privacidad:** qué datos, para qué y hasta cuándo | El titular tiene «the right to obtain the following information without charge», incluidos los plazos de conservación. | **PDPL** art. 13.1 y 13.1.e, pág. 7 |
| | Los datos no se guardan una vez cumplido su fin: «may not be kept after fulfilling the purpose». | **PDPL** art. 5, pág. 4 |
| | Se conservan «durante no más tiempo del necesario». | **RGPD** art. 5.1.e, DO 36 |
| **«Download my data»** | Los datos se entregan «in a structured and machine-readable manner». | **PDPL** art. 14, pág. 7 |
| | En un «formato estructurado, de uso común y lectura mecánica». | **RGPD** art. 20.1, DO 45 |
| **Un botón por derecho** | El responsable ofrece «appropriate and clear ways and mechanisms» para pedirlos. | **PDPL** art. 19, pág. 9 |
| | El responsable «facilitará al interesado el ejercicio de sus derechos». | **RGPD** art. 12.2, DO 40 |
| **Corregir** | Derecho a pedir «the correction or completion of his/her inaccurate Personal Data». | **PDPL** art. 15.1, pág. 7 |
| **Limitar** | Derecho a obligar al responsable «to restrict and stop Processing». | **PDPL** art. 16, pág. 8 |
| **Oponerse** | Derecho «to object to and stop the Processing». | **PDPL** art. 17, pág. 8 |
| **Eliminar sin borrar las facturas** | No hay derecho a borrar si la petición «conflicts with other legislation to which the Controller is subject». | **PDPL** art. 15.3.c, pág. 8 |
| | Quien está en el sistema de facturación «shall retain all Electronic Invoices» el plazo de la ley tributaria. | **MD197** art. 11, pág. 2 |
| | No se borra lo necesario «para el cumplimiento de una obligación legal». | **RGPD** art. 17.3.b, DO 44 |
| **Bandeja interna:** plazo de un mes | Se responde «en el plazo de un mes a partir de la recepción de la solicitud». La PDPL no fija plazo hasta su reglamento. | **RGPD** art. 12.3, DO 40 · **PDPL** art. 28, pág. 10 |
| **Bandeja interna:** verificar la identidad | Si hay «dudas razonables en relación con la identidad», se piden datos. | **RGPD** art. 12.6, DO 40 |
| **Bandeja interna:** rechazar con motivo | Se puede rechazar si la petición es «excessively repetitive». | **PDPL** art. 13.3.a, pág. 7 |
| **Legales:** dónde reclamar | El titular «may file a complaint with the Office». | **PDPL** art. 24, pág. 10 |
| | Derecho «a presentar una reclamación ante una autoridad de control». | **RGPD** art. 77, DO 80 |

### 4.3 Lo que también aplica y no necesita diseño

Estas obligaciones son de las mismas leyes, pero no tienen pantalla. No forman parte de la épica 3; se nombran aquí para que no se den por olvidadas y se sepa de quién son.

| Obligación | PDPL | RGPD | De quién es |
|---|---|---|---|
| Obligaciones generales del responsable y registro de los tratamientos | art. 7, pág. 4 | art. 30, DO 50 | Legal |
| Obligaciones del encargado (GuruSoft trata las facturas por cuenta del cliente) | art. 8, pág. 5 | art. 28, DO 49 | Legal (contrato con el cliente) |
| Avisar de una brecha de seguridad | art. 9, pág. 6 | arts. 33 y 34, DO 52 | Seguridad. El plazo en Emiratos lo fijará el reglamento. |
| Delegado de protección de datos | arts. 10 a 12, págs. 6 y 7 | art. 37, DO 55 | Legal |
| Seguridad: cifrado, control de acceso y supervisión | art. 20, pág. 9 | art. 32, DO 51 | Seguridad. La **MD168**, art. 8 (pág. 5), exige además al proveedor doble factor en el acceso, cifrado e ISO 27001. |
| Evaluación de impacto | art. 21, pág. 9 | art. 35, DO 53 | Legal y seguridad |
| Datos que salen del país (por ejemplo, servidores fuera de Emiratos) | arts. 22 y 23, págs. 9 y 10 | art. 44, DO 60 | Arquitectura y legal |
| Sanciones | art. 26, pág. 10 (aún sin tabla) | art. 83, DO 82 | Legal |

**Una que sí necesitaría diseño si se decide:** si el portal mide cómo se usa (la maqueta carga Hotjar), en Europa hay que pedir consentimiento antes, con un aviso de cookies. En Emiratos aplicaría el consentimiento de la PDPL (art. 6, pág. 4). Está anotado en el tablero como pendiente de decidir.

### 4.4 Lo que se dejó fuera a propósito

- **Las leyes de las zonas francas DIFC y ADGM:** la PDPL no se aplica a las empresas de las zonas francas con ley propia (**PDPL** art. 2, pág. 3). Solo importan si hay clientes allí; está como pendiente de Legal.
- **Los datos de salud y los bancarios:** la PDPL los deja a su legislación propia (art. 2, pág. 3), y el portal no los trata.

---

## 5. Voz y tono

Las capturas de arriba ya están ajustadas a estas reglas. Las reglas generales de la vinculación también valen aquí: formal, breve, sin jerga, sin avisos flotantes, en inglés y sin prometer lo que no existe. Estas son las propias de la privacidad.

### 5.1 Pedir solo lo necesario

- **La aceptación del tratamiento va aparte y a la vista.** No se esconde dentro de los términos: un auditor tiene que encontrar dónde y cuándo aceptó cada usuario, con su versión.
- **Siempre se puede retirar.** Se dice antes qué pasa (se desactiva el usuario, la empresa sigue), sin trampas para que la persona no lo haga.
- **Informar no es aceptar.** La política se presenta con «I have read», no con «I accept».
- **Casillas sin marcar.** Nada viene marcado de antemano.
- **Un fin, un permiso.** Si algún día hace falta un consentimiento (por ejemplo, para marketing), va aparte y se puede retirar con la misma facilidad con que se dio.

### 5.2 Decir qué pasa de verdad

- **Eliminar no borra las facturas,** y se dice antes de confirmar: «What the law requires us to keep, such as invoices, is kept for the legal period». Prometer un borrado total sería falso y nos expondría.
- **El plazo es el que podemos cumplir:** un mes. No se escribe «inmediato» ni «en 24 horas».
- **No se prometen avisos por correo** si no hay un sistema que los envíe. El estado se ve en «Your requests».

### 5.3 Sin trampas de diseño

- Los derechos están a la vista, uno por botón. Eliminar la cuenta no se esconde ni pide más pasos que los necesarios.
- La ventana de términos nuevos dice qué cambia y deja salir sin aceptar.
- Los textos explican para qué se usa cada dato con palabras de usuario, no con nombres de sistema.

### 5.4 Lo que protege al negocio

- **Todo lo que se acepta, a la vista y demostrable.** Términos y tratamiento, cada uno con su casilla, su versión, su fecha y su hora.
- **Todo queda demostrado.** Versión, fecha y hora de cada aceptación.
- **Las facturas se conservan siempre** el plazo legal, aunque la persona pida eliminar su cuenta.
- **Identidad antes de responder.** Ningún dato sale sin verificar a quién se le da.
- **Cada pantalla, con su fuente.** Si la norma cambia (llegará el reglamento ejecutivo de la PDPL), se sabe qué revisar.

---

## 6. Ajustes hechos y pendientes

**Hechos el 21 de octubre de 2026:**

- **Dónde reclamar.** Mi perfil y Legales nombran la Oficina de Datos de los Emiratos (UAE Data Office) en lugar de «la autoridad de protección de datos» (**PDPL** art. 24, pág. 10).
- **Notas de diseño.** Las de Mi perfil, la bandeja de solicitudes, Inicio, Legales y Registro citan la PDPL como norma y el RGPD como estándar del componente. También los comentarios de `assets/js/privacidad.js`.

**Hecho el 26 de octubre de 2026** (reunión con Alejandro del 25 de octubre):

- **Vuelve la casilla de aceptación del tratamiento de datos** en el registro, aparte de los términos, con su versión y fecha en «What you accepted».
- **Nuevo derecho en Mi perfil: retirar la aceptación del tratamiento.** Explica que se desactiva el usuario y que la empresa sigue con sus otros usuarios; llega a la bandeja interna.
- **Legales, al día con el registro y con Mi perfil.** Los documentos se llaman igual que en el registro y son tres: «Política de privacidad», «Términos de servicio» y «Tratamiento de datos personales», la aceptación aparte que se puede retirar; y «Tus derechos sobre tus datos» enumera los siete, con las mismas palabras de Mi perfil: saber qué datos tenemos, llevarte una copia, corregir, limitar, oponerte, retirar la aceptación y eliminar la cuenta. Antes era un párrafo que no nombraba retirar la aceptación.
- **Comparación con Amazon, Google, Microsoft, Temu y Mercado Libre**, que pidió Alejandro antes de cerrar un formulario propio (apartado 6.1).

**Pendientes:**

1. **Plazo de conservación de las facturas:** el número de años que fija la Ley de Procedimientos Tributarios, por confirmar con legal.
2. **Clientes en DIFC o ADGM:** saber si los hay; tienen ley propia.
3. **Reglamento ejecutivo de la PDPL:** cuando se publique, revisar plazos y casos.
4. **Contacto de privacidad** y texto de la política: los da legal.
5. **Dónde se reclama:** el 14 de junio de 2026 se creó la Autoridad Federal de Inteligencia Artificial y Datos, que absorbe la Oficina de Datos de los Emiratos. Confirmar con legal si cambia el texto de Mi perfil y Legales.
6. **Inventario de datos personales** por pantalla y por producto (también el portal de soporte), minimización (teléfono, foto del avatar, fecha de nacimiento, documento) y supresión real en la base de datos al eliminar un usuario: lo pidió Alejandro el 25 de octubre.
7. **Medición del uso:** decidir si el portal mide cómo se usa; si lo hace, diseñar el aviso de consentimiento (apartado 4.3).

### 6.1 Cómo lo resuelven Amazon, Google, Microsoft, Temu y Mercado Libre

Revisado el 26 de octubre de 2026 en sus páginas de ayuda y de privacidad. Lo que se repite en los cinco, y qué significa para eDoc:

| Lo que hacen | Quién | En eDoc hoy | Propuesta (por validar) |
|---|---|---|---|
| **Primero lo que la persona resuelve sola**: descargar los datos o borrar la actividad sin esperar a nadie. El formulario queda para lo que la herramienta no resuelve. | Google (Takeout, Mi actividad; formulario solo «si los datos no están en esas herramientas»), Microsoft (panel de privacidad), Amazon («Request your data») | «Download my data» descarga al momento. Corregir pasa por un formulario con respuesta en un mes, aunque el nombre y el teléfono ya se pueden cambiar en la pestaña Cuenta. | «Correct some data» lleva primero a la pestaña Cuenta para lo que se puede editar; el formulario, solo para lo demás. |
| **Lo aceptado se ve y se apaga con un clic.** | Google y Microsoft (paneles con interruptores) | «Lo que aceptaste» era una lista de texto. | **Hecho en la maqueta:** una casilla por aceptación; los términos y la política, marcados y bloqueados; el tratamiento se retira desmarcándolo, y si se cancela vuelve a quedar marcado. |
| **Confirmar por correo** antes de entregar los datos o cerrar la cuenta. | Amazon (un enlace en el correo; sin ese clic no se entrega nada; para cerrar la cuenta, cinco días para confirmar) | La bandeja interna espera a verificar la identidad antes de responder. | Pedir el código de verificación al enviar la solicitud: la persona ya tiene sesión y el portal ya envía códigos. Se ahorra un paso a quien atiende la bandeja. |
| **Eliminar con un plazo para arrepentirse.** | Temu (se borra en 7 días hábiles; si vuelves a entrar antes, se cancela), Google (se puede recuperar durante un tiempo) | Eliminar era «Eliminar tu cuenta». | **Hecho en la maqueta:** «Borrar tus datos (derecho al olvido)», con 7 días para cambiar de idea: si la persona entra antes, se cancela. Los 7 días, por validar con Legal. |
| **Decir qué se conserva al borrar.** | Mercado Libre México («la eliminación no es absoluta»), Temu en Europa (lo que pide la ley o una autoridad) | Ya se dice: las facturas se conservan el plazo legal. | Se mantiene. |
| **Un apartado propio de derechos y un anexo por país**, con plazos distintos según la ley local. | Mercado Libre («Mis derechos de privacidad»; en Colombia, 10 días hábiles para el acceso y 15 para corregir u oponerse) | Una pestaña Privacidad en Mi perfil y un documento por país. | Se mantiene. Con el reglamento de la PDPL, revisar si fija un plazo menor que un mes. |
| **Tiempos reales de respuesta.** | Amazon (hasta 30 días, casi siempre unos pocos), Google (42 días de media cuando se pide por contacto, frente a millones de borrados automáticos) | Un mes como máximo. | Se mantiene. Lo inmediato, como la copia, no promete un mes. |

**Lo que se aprende para eDoc:** responder tarde también es incumplir, y la forma más segura de no llegar tarde es que la mayoría de los derechos no necesiten a nadie. El formulario propio queda para corregir lo que no se puede editar, limitar, oponerse y retirar la aceptación.

Fuentes: [Google, centro de ayuda de privacidad](https://support.google.com/policies/answer/9581826) · [Google, informe de solicitudes de acceso y borrado](https://policies.google.com/privacy/ccpa-report) · [Microsoft, preguntas frecuentes de privacidad](https://www.microsoft.com/en-us/privacy/faq) · [Amazon, cerrar la cuenta y borrar los datos](https://digprjsurvey.amazon.com/csad/help/node/GDK92DNLSGWTV6MP) · [Temu, cómo eliminar la cuenta](https://www.temu.com/fi-en/support/c3/how-can-i-delete-my-temu-account-f-54-s-124.html) · [Temu, política de privacidad para Francia](https://www.temu.com/fr-en/privacy-policy.html) · [Mercado Libre Colombia, anexo de datos](https://www.mercadolibre.com.co/privacidad/declaracion-privacidad/anexo-legal-datos-colombia_45277) · [Mercado Pago México, tus derechos](https://www.mercadopago.com.mx/privacidad/declaracion-privacidad/tus-derechos-datos-personales_48632)
