/* ==========================================================================
   eDoc Emiratos · idioma del portal
   Un solo selector para todo el recorrido. Antes había dos: en el acceso un
   desplegable con English / Español / العربية y dentro del portal una pastilla
   fija que ponía «en-AE» y no se podía abrir. Eran dos vocabularios distintos
   —nombres de idioma frente a código de configuración regional— y lo que
   elegías al entrar no llegaba a ninguna parte.

   Aquí se define la lista una vez y la pintan por igual el acceso, la barra
   superior y el menú de la cuenta en móvil.

   La lista incluye español porque la maqueta está escrita en español: un
   selector que dijera «en-AE» sobre una pantalla en castellano no informaba de
   nada, solo parecía un fallo. Aquí el código que se ve es siempre el idioma
   que se está leyendo.

   Ojo con lo que esto NO dice: el portal real se declara a la autoridad en
   inglés, o en inglés y árabe. El español es el idioma de esta revisión, no
   del producto. Esa decisión sigue anotada en las Bases de diseño.
   ========================================================================== */
(function () {
  'use strict';

  var LLAVE = 'edoc-idioma';

  /* El portal arranca en INGLÉS, que es su idioma estándar: el primero de la
     lista es el que se usa cuando nadie ha elegido nada. El español se queda
     para quien lo elija, y la elección se recuerda. */
  var IDIOMAS = [
    { codigo: 'EN', nombre: 'English', dir: 'ltr' },
    { codigo: 'ES', nombre: 'Español', dir: 'ltr' },
    { codigo: 'AR', nombre: 'العربية', dir: 'rtl' }
  ];
  window.EDOC_IDIOMAS = IDIOMAS;

  function ficha(codigo) {
    return IDIOMAS.filter(function (i) { return i.codigo === codigo; })[0] || IDIOMAS[0];
  }

  function actual() {
    try { return ficha(window.localStorage.getItem(LLAVE)).codigo; }
    catch (error) { return IDIOMAS[0].codigo; }
  }
  window.edocIdioma = actual;

  /* El icono vive en edoc.js, que no está en la pantalla de acceso; si no está,
     se dibuja aquí el mismo trazo. */
  function icono() {
    if (window.edocIcono) return window.edocIcono('idioma');
    return '<svg class="edoc-icono" viewBox="0 0 20 20" fill="none" stroke="currentColor" ' +
      'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M2.8 5.6h8.4"/><path d="M7 3.4v2.2"/><path d="M9.1 5.6c0 3.2-2.5 6-6.3 7.1"/>' +
      '<path d="M5 9.2c1 1.7 2.7 3 4.6 3.5"/><path d="m10.8 16.6 3.2-8 3.2 8"/>' +
      '<path d="M11.9 14.2h4.2"/></svg>';
  }

  /* Las opciones, iguales en los tres sitios donde aparecen. */
  function opciones() {
    var elegido = actual();
    return '<li><h6 class="dropdown-header">Idioma del portal</h6></li>' +
      IDIOMAS.map(function (i) {
        return '<li><button type="button" class="dropdown-item edoc-idioma__opcion' +
          (i.codigo === elegido ? ' activo' : '') + '" data-idioma="' + i.codigo + '">' +
          '<span class="edoc-idioma__nombre"' + (i.dir === 'rtl' ? ' lang="ar" dir="rtl"' : '') + '>' +
            i.nombre + '</span>' +
          '<span class="edoc-idioma__codigo cifra">' + i.codigo + '</span>' +
          '</button></li>';
      }).join('');
  }
  window.edocIdiomaOpciones = opciones;

  /* El selector completo: la misma pastilla en el acceso y en la barra. La
     variante «claro» es para fondo blanco, la de por defecto para el azul. */
  function selector(variante) {
    return '<div class="dropdown edoc-idioma' + (variante ? ' edoc-idioma--' + variante : '') + '">' +
      '<button type="button" class="edoc-btn-util edoc-btn-util--idioma" data-toggle="dropdown" ' +
        'aria-haspopup="true" aria-expanded="false" ' +
        'title="Idioma del portal">' +
        icono() +
        '<span class="edoc-btn-util__codigo" data-idioma-activo>' + actual() + '</span>' +
        '<svg class="edoc-btn-util__chevron" viewBox="0 0 10 6" aria-hidden="true">' +
        '<path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4" ' +
        'stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<ul class="dropdown-menu dropdown-menu-right edoc-idioma__lista">' + opciones() + '</ul>' +
    '</div>';
  }
  window.edocSelectorIdioma = selector;

  /* Deja todos los selectores de la página diciendo lo mismo. */
  function repintar() {
    var elegido = actual();
    document.querySelectorAll('[data-idioma-activo]').forEach(function (el) {
      el.textContent = elegido;
    });
    document.querySelectorAll('[data-idioma]').forEach(function (b) {
      b.classList.toggle('activo', b.dataset.idioma === elegido);
    });
  }
  window.edocPintarIdioma = repintar;

  /* ------------------------------------------------------------------------
     Traducción al inglés.

     La maqueta está escrita en español y hasta ahora el selector solo avisaba
     de que no traducía. El inglés es el idioma estándar del portal real, así
     que ahora el selector cambia de verdad.

     Se traduce por texto exacto sobre lo que ya está pintado, y un observador
     traduce también lo que se pinta después —el armazón, la campana, los
     avisos, las tablas—. Así no hay que tocar las 21 pantallas. El diccionario
     empieza por lo que se repite: 57 textos que salen en tres pantallas o más
     son el 45 % de todo lo que se lee. Lo que no está en él se queda en
     español, y el aviso al elegir el idioma lo dice.

     El árabe no entra en esta entrega: pide lectura de derecha a izquierda,
     que no es un cambio de texto sino de maquetación. Elegirlo enseña el
     inglés, que es el estándar del portal, y también lo dice.            */
  var EN = {
      "Inicio": "Home",
      // Títulos de pestaña que no salen en ninguna otra parte de la pantalla.
      "Acceso": "Sign-in",
      "Datos fiscales": "Tax details",
      "Clientes y proveedores": "Customers and suppliers",
      "Panel de alcance": "Scope panel",
      "Bases de diseño": "Design foundations",
      "Administración": "Administration",
      "Roles y Usuarios": "Roles and users",
      "Usuarios": "Users",
      "Actualización Datos empresas": "Company details",
      "Actualización de identificación fiscal": "Tax identification",
      "Actualización de contactos": "Contacts",
      "Credenciales de consumo Servicio eDoc": "eDoc service credentials",
      "Alertas y comunicados": "Alerts and announcements",
      "Manuales": "Manuals",
      "Emisión": "Issuing",
      "Reportes": "Reports",
      "Documentos Emitidos": "Issued documents",
      "Documentos por criterios · fase 3": "Search by criteria · phase 3",
      "Recepción": "Receiving",
      "Documentos Recibidos": "Received documents",
      "Importar": "Import",
      "Cargar XML · fase 2": "Upload XML · phase 2",
      "Workflow Aprobación": "Approval workflow",
      "Gestión proveedores · fase 3": "Supplier management · phase 3",
      "Fuera de la sesión": "Signed out",
      "Recuperar contraseña": "Recover password",
      "Cambiar Contraseña": "Change password",
      "Acceso al soporte": "Support",
      "Salir": "Sign out",
      "Notificaciones": "Notifications",
      "Idioma del portal": "Portal language",
      "Nombre nativo": "Native name",
      "(Calidad)": "(Quality)",
      "Emiratos Árabes Unidos": "United Arab Emirates",
      "Saltar al contenido": "Skip to content",
      "GuruSoft S.A. © 2026. Todos los derechos reservados.": "GuruSoft S.A. © 2026. All rights reserved.",
      "eDoc Emiratos · maqueta de alcance · v1.0 · no es el diseño final": "eDoc Emirates · scope mockup · v1.0 · not the final design",
      "Estás conectado al ambiente de QA": "You are connected to the QA environment",
      "eDoc · inicio": "eDoc · home",
      "Muestra el nombre del emisor y del receptor tal como llega, en árabe": "Shows the issuer and recipient names as received, in Arabic",
      "Muestra el nombre de la empresa tal como llega, en árabe": "Shows the company name as received, in Arabic",
      "Emiratos Árabes Unidos · cambiar de portal": "United Arab Emirates · switch portal",
      "Menú principal": "Main menu",
      "Abrir el menú": "Open menu",
      "Cerrar el menú": "Close menu",
      "Cerrar este aviso": "Close this notice",
      "Cerrar": "Close",
      "Mostrar la contraseña": "Show password",
      "Ocultar la contraseña": "Hide password",
      "Archivar": "Archive",
      "Archivado:": "Archived:",
      "Fuera de la primera entrega.": "Not in the first release.",
      "Está en el alcance, pero no en la entrega de hoy.": "In scope, but not in this release.",
      "Llegará en una próxima entrega.": "Coming in a later release.",
      "Volver al acceso": "Back to sign-in",
      "Abre la wiki de eDoc en otra pestaña": "Opens the eDoc wiki in a new tab",
      "Leer en la wiki": "Read on the wiki",
      "Notificaciones · ninguna sin leer": "Notifications · none unread",
      "Alerta": "Alert",
      "Notificación": "Notification",
      "Comunicado": "Announcement",
      "No te queda ningún aviso.": "You have no notices left.",
      "Leer el comunicado entero": "Read the full announcement",
      "hace 2 horas": "2 hours ago",
      "ayer": "yesterday",
      "Dos documentos esperan tu respuesta": "Two documents are awaiting your response",
      "Emirates Global Aluminium y Al Ain Water Company llevan más de 24 horas sin responder.": "Emirates Global Aluminium and Al Ain Water Company have been waiting more than 24 hours for a response.",
      "Se quita sola en cuanto respondas a los dos.": "Clears automatically once you respond to both.",
      "Tu licencia comercial vence en 21 días": "Your trade licence expires in 21 days",
      "Caduca el 30 de septiembre. Si no la renuevas, dejamos de poder emitir en tu nombre.": "It expires on 30 September. If you do not renew it, we can no longer issue on your behalf.",
      "Se quita sola en cuanto subas la licencia renovada.": "Clears automatically once you upload the renewed licence.",
      "Mantenimiento programado": "Scheduled maintenance",
      "El sábado 6 de septiembre, de 02:00 a 04:00, el portal no estará disponible.": "On Saturday 6 September, from 02:00 to 04:00, the portal will be unavailable.",
      "Un documento quedó fuera de la respuesta": "A document received no response",
      "INV-882317 no recibió respuesta de la plataforma receptora dentro del plazo.": "INV-882317 did not receive a response from the receiving platform in time.",
      "Nueva versión del esquema de factura": "New invoice schema version",
      "A partir del 1 de octubre entra en vigor la versión 2.1 del esquema. No tienes que hacer nada si emites desde el portal; si integras por API, hay dos campos nuevos.": "Version 2.1 of the schema takes effect on 1 October. Nothing to do if you issue from the portal; if you integrate via API, there are two new fields.",
      "Tu contrato de servicio se renueva el 30 de septiembre": "Your service contract renews on 30 September",
      "Se renueva solo. Si quieres cambiar algo, habla con tu contacto comercial.": "It renews automatically. To change anything, talk to your account manager.",
      "Tienes": "You have",
      ". Están en la campana, arriba a la derecha.": ". They are in the bell, top right.",
      "Portal en mantenimiento.": "Portal under maintenance.",
      "escríbenos": "write to us",
      "Esta función está en mantenimiento": "This feature is under maintenance",
      "Volver al inicio": "Back to home",
      "Escribir a soporte": "Contact support",
      "Función limitada por el mantenimiento.": "Feature limited by maintenance.",
      "Los permisos se guardan en el servidor de identidades, que está en mantenimiento. No hace falta que hagas nada: en cuanto termine, esta pantalla vuelve a funcionar. El resto del portal sigue disponible.": "Permissions are stored on the identity server, which is under maintenance. You do not need to do anything: as soon as it finishes, this screen will work again. The rest of the portal remains available.",
      "Crear y rotar credenciales toca el servidor de identidades, que es justo lo que estamos actualizando. No hace falta que hagas nada: en cuanto termine, esta pantalla vuelve a funcionar. El resto del portal sigue disponible.": "Creating and rotating credentials uses the identity server, which is exactly what we are updating. You do not need to do anything: as soon as it finishes, this screen will work again. The rest of the portal remains available.",
      "Puedes consultar lo que has recibido, pero las respuestas —aprobar, rechazar o acusar recibo— no saldrán hasta que termine el mantenimiento.": "You can review what you have received, but responses —approve, reject or confirm receipt— will not be sent until maintenance ends.",
      "Simulacro:": "Simulation:",
      "Sin mensajes": "No messages",
      "Alertas": "Alerts",
      "Mantenimiento": "Maintenance",
      "Mantenimiento y alertas": "Maintenance and alerts",
      "Lo pide la dirección de esta página.": "Requested by this page’s address.",
      "Fijado desde el panel de alcance. Sigue puesto hasta que lo quites.": "Pinned from the scope panel. It stays on until you remove it.",
      "Volver al portal normal": "Back to the normal portal",
      "El código caduca en": "The code expires in",
      "El código ha caducado.": "The code has expired.",
      "Pide uno nuevo para seguir.": "Request a new one to continue.",
      "Portal Consulta": "Consultation Portal",
      "Consulta tus documentos emitidos, responde los recibidos y administra tu conexión. Somos tu proveedor de facturación electrónica en la red Peppol.": "Review the documents you issue, respond to the ones you receive and manage your connection. We are your e-invoicing provider on the Peppol network.",
      "Acceso al portal": "Portal sign-in",
      "Bienvenido": "Welcome",
      "Entra con las credenciales que te enviamos por correo.": "Sign in with the credentials we emailed you.",
      "Usuario": "Username",
      "Contraseña": "Password",
      "Verificación de seguridad": "Security check",
      "No soy un robot": "I’m not a robot",
      "Entrar": "Sign in",
      "¿Olvidaste tu contraseña?": "Forgot your password?",
      "¿Todavía no tienes acceso?": "Don’t have access yet?",
      "Registrar mi empresa": "Register my company",
      "Empieza el alta: seis pasos y la revisamos nosotros.": "Start your registration: six steps, and we review it.",
      "Ya me registré y vengo de EmaraTax": "I’ve registered and I’m coming from EmaraTax",
      "Si en EmaraTax nos elegiste como proveedor y pulsaste «Proceed to ASP», termina aquí la asociación.": "If you chose us as your provider in EmaraTax and clicked “Proceed to ASP”, finish the association here.",
      "¿Qué es EmaraTax y por qué me lo piden?": "What is EmaraTax and why am I asked for it?",
      "Aviso de privacidad": "Privacy notice",
      "Términos y condiciones": "Terms and conditions",
      "Acceso interno": "Internal access",
      "Confirma que eres tú": "Confirm it’s you",
      "Te mandamos un código de seis cifras a": "We sent a six-digit code to",
      ". Escríbelo aquí para terminar de entrar.": ". Enter it here to finish signing in.",
      "Código": "Code",
      "En la maqueta vale cualquier código de seis cifras.": "In this mockup any six-digit code works.",
      "No me ha llegado, mándalo otra vez": "I didn’t get it, send it again",
      "Volver": "Back",
      "¿Con qué empresa entras?": "Which company are you signing in to?",
      "Tu usuario tiene varias empresas asociadas. Elige una para continuar; podrás cambiar de empresa sin volver a entrar.": "Your user has several companies. Choose one to continue; you can switch company without signing in again.",
      "Qué es EmaraTax y por qué te lo pedimos": "What EmaraTax is and why we ask for it",
      "es el sistema de la autoridad fiscal de Emiratos Árabes Unidos. Ahí las empresas gestionan sus impuestos y, entre otras cosas, eligen con qué proveedor acreditado quieren facturar electrónicamente.": "is the tax authority system of the United Arab Emirates. Companies manage their taxes there and, among other things, choose which accredited provider they want to e-invoice with.",
      "Ese proveedor es lo que allí se llama un": "That provider is what the system calls an",
      ". Para poder emitir y recibir documentos en tu nombre, a la autoridad tiene que constarle que": ". To issue and receive documents on your behalf, the authority must have on record that",
      "tú nos has elegido": "you have chosen us",
      ". Y esa elección no se hace aquí: se hace en EmaraTax.": ". That choice is not made here: it is made in EmaraTax.",
      "Cómo es el recorrido": "How it works",
      "1 · Nos contratas": "1 · You hire us",
      "El acuerdo comercial ocurre fuera del portal.": "The commercial agreement happens outside the portal.",
      "2 · Registras tu empresa aquí": "2 · You register your company here",
      "El alta de seis pasos. La revisamos y te enviamos tus credenciales.": "The six-step registration. We review it and send you your credentials.",
      "3 · Entras por primera vez": "3 · You sign in for the first time",
      "El portal te avisa de que falta el último paso y todavía no te deja operar.": "The portal tells you the last step is missing and does not let you operate yet.",
      "4 · Vas a EmaraTax y nos eliges": "4 · You go to EmaraTax and choose us",
      "Nos buscas en la lista de proveedores y pulsas": "You find us in the list of providers and click",
      ". El sistema te avisa de que vas a salir de EmaraTax.": ". The system warns you that you are leaving EmaraTax.",
      "5 · Vuelves aquí": "5 · You come back here",
      "La autoridad nos comunica tu elección y confirmamos la asociación.": "The authority notifies us of your choice and we confirm the association.",
      "6 · Ya puedes operar": "6 · You can start operating",
      "El portal se desbloquea y empiezas a consultar y a responder documentos.": "The portal unlocks and you start reviewing and responding to documents.",
      "Si ya hiciste ese recorrido y el portal sigue bloqueado, entra por": "If you already did this and the portal is still locked, go to",
      "«Ya me registré y vengo de EmaraTax»": "“I’ve registered and I’m coming from EmaraTax”",
      ": desde ahí comprobamos la asociación.": ": from there we check the association.",
      "Ir a terminar la asociación": "Finish the association",
      "Tu facturación electrónica en Emiratos, en un solo sitio.": "Your e-invoicing in the Emirates, in one place.",
      "Consulta lo que emitiste, responde lo que recibes y administra tu conexión con nosotros. Somos tu proveedor de facturación electrónica en la red Peppol.": "Review what you issued, respond to what you receive and manage your connection with us. We are your e-invoicing provider on the Peppol network.",
      "Proveedor de facturación electrónica": "E-invoicing provider",
      "Red Peppol": "Peppol network",
      "Estado del documento": "Document status",
      "Documento generado": "Document generated",
      "Tu sistema crea la factura y la deja lista para enviar.": "Your system creates the invoice and gets it ready to send.",
      "Entregado a eDoc": "Delivered to eDoc",
      "Recepción del documento": "Document received",
      "El sistema del cliente entrega el XML a eDoc.": "The client’s system delivers the XML to eDoc.",
      "Validación de esquema": "Schema validation",
      "Estructura y campos obligatorios.": "Structure and mandatory fields.",
      "Aprobado por eDoc antes de transmitirlo.": "Approved by eDoc before transmitting it.",
      "Reporte fiscal generado": "Tax report generated",
      "eDoc arma el resumen y le adjunta la factura original.": "eDoc builds the summary and attaches the original invoice.",
      "Enviado a la autoridad": "Sent to the authority",
      "Transmitido al concentrador de la autoridad, en paralelo al envío al comprador.": "Transmitted to the authority’s hub, in parallel with the delivery to the buyer.",
      "Acuse de recibo": "Acknowledgement of receipt",
      "La autoridad confirma que lo tiene. Todavía no dice si está bien.": "The authority confirms it has it. It does not yet say whether it is correct.",
      "Validado. La autoridad tiene diez minutos como máximo para responder.": "Validated. The authority has up to ten minutes to respond.",
      "Envío": "Transmission",
      "Transmitido por la red a la plataforma del comprador.": "Transmitted over the network to the buyer’s platform.",
      "La plataforma receptora confirma la entrega.": "The receiving platform confirms delivery.",
      "Validaciones técnicas superadas.": "Technical validations passed.",
      "Puesto a disposición": "Made available",
      "El documento queda visible para el comprador.": "The document becomes visible to the buyer.",
      "Sin actuación": "Not involved",
      "El documento no llegó hasta esta entidad porque se detuvo antes.": "The document did not reach this party because it stopped earlier.",
      "A la espera de respuesta": "Awaiting response",
      "Esta entidad todavía no ha respondido.": "This party has not responded yet.",
      "El comprador confirma que le llegó. No es una aprobación.": "The buyer confirms it arrived. It is not an approval.",
      "Rechazado por esta entidad.": "Rejected by this party.",
      "Falta el número de registro fiscal del receptor · dato obligatorio": "The recipient’s tax registration number is missing · mandatory field",
      "Cantidad": "Quantity",
      "Precio": "Price",
      "Importe": "Amount",
      "Orden de compra": "Purchase order",
      "Registro fiscal": "Tax registration number",
      "Soporte preferente · trimestre": "Priority support · quarter",
      "Suministro según orden de compra": "Supply as per purchase order",
      "En construcción": "Under construction",
      "Está dentro del alcance del portal y su sitio en el menú ya está decidido, pero": "It is within the portal’s scope and its place in the menu is already decided, but",
      "no entra en el MVP": "it is not in the MVP",
      ". Lo que se entrega es lo que recoge el documento de MVP del portal y las APIs; lo demás se diseña igual, para que se vea el alcance completo, y se enciende cuando le toque su fase.": ". What is delivered is what the portal and API MVP document covers; the rest is designed the same way, so the full scope can be seen, and it is switched on when its phase comes.",
      "Ir a Documentos Emitidos": "Go to Issued documents",
      "Te mandamos el código a": "We sent the code to",
      "Entra a EmaraTax": "Sign in to EmaraTax",
      "Pulsa «Proceed to ASP»": "Click «Proceed to ASP»",
      "Jebel Ali Free Zone, Bloque C, Oficina 214": "Jebel Ali Free Zone, Block C, Office 214",
      "Más filtros": "More filters",
      "Menos filtros": "Fewer filters",
      "Dónde está": "Where it is",
      "Quién tiene que actuar": "Who needs to act",
      "Última actualización": "Last update",
      "Qué sigue": "What’s next",
      "Tú": "You",
      "Nadie": "No one",
      "No tienes que hacer nada.": "You don’t need to do anything.",
      "No tienes que hacer nada: esperamos su respuesta.": "You don’t need to do anything: we are waiting for their response.",
      "El comprador confirmó que le llegó. Todavía puede aprobarlo o rechazarlo.": "The buyer confirmed it arrived. They can still approve or reject it.",
      "Sale de tu sistema hacia tu proveedor de servicios.": "It leaves your system for your service provider.",
      "Acciones": "Actions",
      "Cancelar": "Cancel",
      "Anterior": "Previous",
      "Siguiente": "Next",
      "Siguiente ›": "Next ›",
      "registros": "entries",
      "Mostrar": "Show",
      "Estado": "Status",
      "Pendiente": "Pending",
      "Nombre": "Name",
      "Exportar resultados": "Export results",
      "Exportar": "Export",
      "Descargar PDF": "Download PDF",
      "Descargar XML": "Download XML",
      "Descargar": "Download",
      "Activo": "Active",
      "Buscar": "Search",
      "Consultar": "Search",
      "Resultados": "Results",
      "Mostrar u ocultar": "Show or hide",
      "Visor de la factura": "Invoice viewer",
      "Guardar": "Save",
      "Confirmar": "Confirm",
      "Aprobar": "Approve",
      "Rechazar": "Reject",
      "Volver sin cambios": "Back without changes",
      "Confirmar recepción": "Confirm receipt",
      "Confirmar recepción de la factura": "Confirm receipt of the invoice",
      "Esto no aprueba, acepta ni paga la factura.": "This does not approve, accept or pay the invoice.",
      "Solo deja constancia de que llegó. Sigues pudiendo aprobarla o rechazarla después.": "It only records that it arrived. You can still approve or reject it afterwards.",
      "Fecha": "Date",
      "Tipo": "Type",
      "Número": "Number",
      "Correo": "Email",
      "Teléfono": "Phone",
      "Descripción": "Description",
      "Versión": "Version",
      "Título": "Title",
      "Fecha de creación": "Created on",
      "Documentación": "Documentation",
      "Documentación técnica": "Technical documentation",
      "Estado por entidad": "Status by party",
      "Número de documento": "Document number",
      "Fecha de emisión": "Issue date",
      "Fecha de recepción": "Receipt date",
      "Tipo de documento": "Document type",
      "Receptor": "Recipient",
      "Emisor": "Issuer",
      "Moneda": "Currency",
      "Base imponible": "Taxable amount",
      "IVA": "VAT",
      "Tu empresa (C1)": "Your company (C1)",
      "Plataforma receptora (C3)": "Receiving platform (C3)",
      "Destinatario (C4)": "Recipient (C4)",
      "Autoridad (C5)": "Authority (C5)",
      "Recepción en eDoc (C3)": "Received at eDoc (C3)",
      "Tu respuesta (C4)": "Your response (C4)",
      "Esquina": "Corner",
      "Quién es": "Who it is",
      "Qué puede responder": "What it can respond",
      "Clase": "Class",
      "Quién lo hace": "Who does it",
      "Qué hacer": "What to do",
      "Permisos": "Permissions",
      "Correo Electrónico": "Email",
      "Rol": "Role",
      "Cargo": "Position",
      "Comercial": "Sales",
      "Cobros": "Collections",
      "Técnico": "Technical",
      "Aplicación": "Application",
      "Identificador de cliente": "Client ID",
      "Creada": "Created",
      "Último uso": "Last used",
      "Servicio": "Service",
      "Dirección": "URL",
      "Enviar documentos al gobierno y al receptor": "Send documents to the authority and the recipient",
      "El resumen al gobierno, solo": "The summary to the authority, automatically",
      "Recibir los estados de lo que emitiste": "Receive the statuses of what you issued",
      "Consultar un documento emitido": "Look up an issued document",
      "Recibir documentos": "Receive documents",
      "La lista de lo que no has visto": "The list of what you haven’t seen",
      "Marcar como visto": "Mark as seen",
      "Acusar recibo": "Acknowledge receipt",
      "Documento": "Document",
      "Qué cubre": "What it covers",
      "Registro de la empresa": "Company registration",
      "Pantalla de acceso": "Sign-in screen",
      "Pie del portal": "Portal footer",
      "Quién": "Who",
      "Qué documento": "Which document",
      "Cuándo": "When",
      "Desde dónde": "From where",
      "Referencia": "Reference",
      "Empresa y registro fiscal": "Company and tax registration",
      "Recibida": "Received",
      "No se encontraron resultados": "No matching records found",
      "Ningún dato disponible en esta tabla": "No data available in table",
      "Primero": "First",
      "Último": "Last",
      "Tu usuario": "Your username",
      "Tu contraseña": "Your password",
      "Escribe tu usuario.": "Enter your username.",
      "Escribe tu contraseña.": "Enter your password.",
      "Marca la verificación de seguridad.": "Tick the security check.",
      "Tu empresa": "Your company",
      "Recepción en eDoc": "Received at eDoc",
      "Tu respuesta": "Your response",
      "Plataforma receptora": "Receiving platform",
      "Destinatario": "Recipient",
      "Autoridad": "Authority",
      "Roles definidos": "Defined roles",
      "C3 Plataforma receptora:": "C3 Receiving platform:",
      "C4 Destinatario:": "C4 Recipient:",
      "C5 Autoridad:": "C5 Authority:",
      "Cualquiera": "Any",
      "Limpiar": "Clear",
      "Proveedor": "Supplier",
      "Reportes generados": "Generated reports",
      "Vas a aprobar": "You are about to approve",
      "Vas a rechazar": "You are about to reject",
      "Crear": "Create",
      "Crear rol": "Create role",
      "Empezar desde": "Start from",
      "Crear usuario": "Create user",
      "Editar": "Edit",
      "nombre.apellido": "firstname.lastname",
      "Abu Dabi": "Abu Dhabi",
      "Sharja": "Sharjah",
      "Fujaira": "Fujairah",
      "Actividad": "Activity",
      "Emirato": "Emirate",
      "Nombre comercial": "Trade name",
      "Registro fiscal · TRN": "Tax registration · TRN",
      "Directora comercial": "Sales director",
      "Directora financiera": "Finance director",
      "3 · Pide otro cuando caduque": "3 · Request another when it expires",
      "Continuar": "Continue",
      "Enviar archivo": "Send file",
      "Enviar evento": "Send event",
      "Enviar facturas": "Send invoices",
      "Permiso a permiso": "Permission by permission",
      "Secreto": "Secret",
      "Cuando vuelvas": "When you come back",
      "+974 · Catar": "+974 · Qatar",
      "Actualizar registro existente": "Update existing registration",
      "Empresa sujeta a IVA": "VAT-registered company",
      "Obligatorio": "Required",
      "Opcional": "Optional",
      "Portal consulta": "Consultation portal",
      "Registro completado": "Registration completed",
      "Solicitud": "Application",
      "Verificado": "Verified",
      "‹ Anterior": "‹ Previous",
      "Aprobadas": "Approved",
      "Pendientes": "Pending",
      "Borrar el rol": "Delete the role",
      "Como lo verá quien asigne usuarios.": "As whoever assigns users will see it.",
      "Copia los permisos de un rol que ya existe y luego los ajustas.": "Copy the permissions of an existing role and then adjust them.",
      "Crear un rol": "Create a role",
      "El rol de administrador no se puede borrar": "The administrator role cannot be deleted",
      "Nombre del rol": "Role name",
      "Qué puede hacer este rol, en una línea": "What this role can do, in one line",
      "Qué ventanas y qué acciones puede usar cada rol. El menú no es fijo: se arma con los permisos del usuario que entra.": "Which screens and actions each role can use. The menu is not fixed: it is built from the permissions of the user who signs in.",
      "Se ve en la tabla, y evita acabar con tres roles de nombre parecido sin saber en qué se diferencian.": "It shows in the table, and avoids ending up with three similarly named roles without knowing how they differ.",
      "Ver estados de las cinco esquinas": "View the statuses of the five corners",
      "Ver la pantalla de bienvenida": "View the welcome screen",
      "Visor del documento": "Document viewer",
      "Acusar recibo · MLS AB": "Acknowledge receipt · MLS AB",
      ". Escríbelo aquí para ver el secreto.": ". Enter it here to see the secret.",
      ". Escríbelo para generar las claves.": ". Enter it to generate the keys.",
      ". Solo funcionará con los permisos que le diste a esa aplicación.": ". It will only work with the permissions you gave that application.",
      "1 · Pide un token": "1 · Request a token",
      "2 · Llama con el token": "2 · Call with the token",
      "Abrir la wiki de integración": "Open the integration wiki",
      "Activa": "Active",
      "Retirada": "Retired",
      "Contabilidad": "Accounting",
      "Obtener archivo": "Get file",
      "Al menos diez caracteres. Dentro de un año esto es lo único que dirá para qué servía.": "At least ten characters. A year from now this will be the only thing that says what it was for.",
      "Con el identificador y el secreto de la aplicación, contra el servicio de autenticación.": "With the application’s client ID and secret, against the authentication service.",
      "Copia el secreto ahora.": "Copy the secret now.",
      "Crea una aplicación por cada sistema que vaya a conectarse, dale solo los permisos que necesita y pásale las claves a quien lo integre.": "Create one application for each system that will connect, give it only the permissions it needs, and hand the keys to whoever integrates it.",
      "Crear una aplicación": "Create an application",
      "Crear una aplicación es una acción sensible: antes de generar las claves te pediremos el código que te mandamos por correo.": "Creating an application is a sensitive action: before generating the keys we will ask for the code we email you.",
      "Cuerpos, errores, códigos y ejemplos completos.": "Bodies, errors, codes and full examples.",
      "Cómo se conecta": "How it connects",
      "Ejemplo, para copiar tal cual": "Example, to copy as is",
      "El detalle de cada llamada está en la wiki.": "The details of each call are on the wiki.",
      "El detalle de cada llamada —direcciones, cuerpos y errores— va en la wiki, no aquí. Esta pantalla dice": "The details of each call —URLs, bodies and errors— are on the wiki, not here. This screen says",
      "qué": "what",
      "se puede hacer; la wiki dice": "can be done; the wiki says",
      "cómo": "how",
      "El servicio completo": "The full service",
      "El sistema que se va a conectar. Así lo reconoces en la lista.": "The system that will connect. That is how you recognise it in the list.",
      "Es la única vez que se enseña sin pedirte nada. Para volver a verlo tendrás que confirmar con otro código.": "This is the only time it is shown without asking you for anything. To see it again you will have to confirm with another code.",
      "Estas son las tres esenciales, para no tener que salir de aquí. El resto de los servicios, los campos de cada uno y los ejemplos completos están en la": "These are the three essentials, so you don’t have to leave this page. The rest of the services, their fields and full examples are in the",
      "Falta algo por rellenar. Revisa lo que está marcado en rojo.": "Something is missing. Check what is marked in red.",
      "Generar un secreto nuevo": "Generate a new secret",
      "Las direcciones que vas a necesitar": "The URLs you will need",
      "Marca solo lo que ese sistema necesita. Si mañana necesita más, se le añade. Aquí aparecen los servicios que tu empresa tiene contratados.": "Tick only what that system needs. If it needs more tomorrow, it can be added. The services your company has contracted appear here.",
      "Marca un servicio y la aplicación podrá hacer todo lo que incluye. Es lo normal.": "Tick a service and the application will be able to do everything it includes. That is the usual choice.",
      "Para cuando un sistema solo debe poder hacer una cosa concreta.": "For when a system should only be able to do one specific thing.",
      "Para qué es": "What it is for",
      "Qué podrá hacer": "What it will be able to do",
      "Qué se puede hacer por API": "What can be done via API",
      "Retirar la aplicación": "Retire the application",
      "Se espera una aplicación por sistema: una para el ERP que emite, otra para el que recibe. No es obligatorio —puedes meterlo todo en una—, pero separarlas deja ver de dónde viene cada llamada y te deja retirar una sin dejar sin servicio a las demás.": "One application per system is expected: one for the ERP that issues, another for the one that receives. It is not mandatory —you can put everything in one—, but separating them shows where each call comes from and lets you retire one without cutting off the others.",
      "Tu sistema lo renueva solo. No hace falta que nadie entre aquí a tocar nada.": "Your system renews it by itself. Nobody needs to come in here to change anything.",
      "Tu sistema no manda el secreto en cada llamada. Lo cambia una vez por un": "Your system does not send the secret in every call. It exchanges it once for a",
      "que caduca, y ese token es el que viaja. Si algún día se filtra, deja de valer solo.": "that expires, and that token is what travels. If it ever leaks, it stops working by itself.",
      "Tus aplicaciones": "Your applications",
      "Va en la cabecera": "It goes in the header",
      "de cada petición, como": "of each request, as",
      "Ver el secreto": "View the secret",
      "Ver el secreto de": "View the secret of",
      "documentación técnica": "technical documentation",
      "curl -X POST https://auth.edoc.ae/auth/realms/ae/protocol/openid-connect/token \\ -d \"grant_type=client_credentials\" \\ -d \"client_id=alnoor-erp-sap\" \\ -d \"client_secret=EL_SECRETO_DE_TU_APLICACION\" # Respuesta { \"access_token\": \"eyJhbGciOi...\", \"token_type\": \"Bearer\", \"expires_in\": 3600 } # Y a partir de ahí, en cada llamada curl https://api.edoc.ae/api/ae/emision/v1/documentos \\ -H \"Authorization: Bearer eyJhbGciOi...\"": "curl -X POST https://auth.edoc.ae/auth/realms/ae/protocol/openid-connect/token \\\n  -d \"grant_type=client_credentials\" \\\n  -d \"client_id=alnoor-erp-sap\" \\\n  -d \"client_secret=YOUR_APPLICATION_SECRET\"\n\n# Response\n{ \"access_token\": \"eyJhbGciOi...\", \"token_type\": \"Bearer\", \"expires_in\": 3600 }\n\n# From then on, in every call\ncurl https://api.edoc.ae/api/ae/emision/v1/documentos \\\n  -H \"Authorization: Bearer eyJhbGciOi...\"",
      "Aparecemos como": "We appear as",
      "Ya puedes entrar": "You can sign in now",
      "Lo que tu empresa ha emitido y en qué punto está: primero el camino hasta el comprador, y aparte la respuesta de la autoridad.": "What your company has issued and where it stands: first the path to the buyer, and separately the authority’s response.",
      "Fecha de emisión desde": "Issue date from",
      "Fecha de emisión hasta": "Issue date to",
      "Todos": "All",
      "Todas": "All",
      "Estado de la entidad": "Party status",
      "Registro fiscal del receptor": "Recipient tax registration",
      "Busca por el nombre tal como llega, en el alfabeto que llegue.": "Search by the name as received, in whichever alphabet it arrives.",
      "C1 Tu empresa:": "C1 Your company:",
      "Las cinco esquinas de un documento": "The five corners of a document",
      "Cinco entidades responden por un documento, y no todas están en la misma fila.": "Five parties respond for a document, and they are not all on the same line.",
      "La factura recorre un camino": "The invoice travels a path",
      "—de ti al comprador— y, aparte,": "—from you to the buyer— and, separately,",
      "se le reporta a la autoridad": "the authority is sent",
      "un documento fiscal distinto.": "a different fiscal document.",
      "El camino de la factura": "The invoice path",
      "El reporte a la autoridad": "The report to the authority",
      "Hay dos clases de rechazo": "There are two kinds of rejection",
      "No significan lo mismo ni se arreglan igual, aunque los dos se pinten en rojo.": "They do not mean the same thing or get fixed the same way, even though both are shown in red.",
      "Estados del documento": "Document statuses",
      "Cada entidad responde por su cuenta.": "Each party responds on its own.",
      "«Aprobado» siempre dice quién aprobó": "“Approved” always says who approved",
      ", porque cada columna es una entidad distinta. Un aprobado de la plataforma receptora no es la aceptación del comprador.": ", because each column is a different party. An approval from the receiving platform is not the buyer’s acceptance.",
      "Esta vista no es la representación gráfica oficial del documento.": "This view is not the official graphical representation of the document.",
      "Es un render de los campos del XML que eDoc genera para que puedas leer la factura. Por la red viaja el XML limpio, sin PDF adjunto.": "It is a rendering of the XML fields that eDoc generates so you can read the invoice. The clean XML travels over the network, with no PDF attached.",
      "Nombre del receptor": "Recipient name",
      "Qué son C1, C2, C3, C4 y C5": "What C1, C2, C3, C4 and C5 are",
      "Abrir el visor de la factura": "Open the invoice viewer",
      "Ver estados de las cuatro entidades": "View the statuses of the parties",
      "Más acciones": "More actions",
      "El documento se detuvo antes de llegar a esta entidad": "The document stopped before reaching this party",
      "Lo que llega por la red a nombre de tu empresa. Desde aquí lo apruebas, lo rechazas con un motivo o dejas constancia de que llegó.": "What arrives over the network in your company’s name. From here you approve it, reject it with a reason or record that it arrived.",
      "Fecha de recepción desde": "Receipt date from",
      "Fecha de recepción hasta": "Receipt date to",
      "Registro fiscal del emisor": "Issuer tax registration",
      "Se pueden marcar varios. Aparecen con el nombre tal como llega.": "You can select several. They appear with the name as received.",
      "Aprobar o rechazar en bloque · fase 2": "Approve or reject in bulk · phase 2",
      "Aprobar el documento": "Approve the document",
      "de": "from",
      ". Se enviará por la red la respuesta": ". The response sent over the network will be",
      "La aprobación no se deshace desde el portal. Si después hay que corregir el documento, el emisor tiene que emitir una nota de crédito: en Emiratos anular no existe.": "An approval cannot be undone from the portal. If the document needs correcting later, the issuer must issue a credit note: cancellation does not exist in the Emirates.",
      "Rechazar el documento": "Reject the document",
      "Motivo del rechazo": "Rejection reason",
      "Elige un motivo": "Choose a reason",
      "El motivo es tipificado: viaja como código dentro de la respuesta, no como texto libre.": "The reason is coded: it travels as a code inside the response, not as free text.",
      "Detalle para el emisor": "Details for the issuer",
      "Vas a confirmar que": "You are about to confirm that",
      "llegó. Se enviará la respuesta": "arrived. The response sent will be",
      "Es un render de los campos del XML que llegó. Por la red viaja el XML limpio, sin PDF adjunto: sin visor no habría nada que mirar.": "It is a rendering of the fields of the XML that arrived. The clean XML travels over the network, with no PDF attached: without the viewer there would be nothing to look at.",
      "No entra en la primera entrega": "Not in the first release",
      "Ya respondiste este documento": "You already responded to this document",
      "Opcional. Ayuda al emisor a corregir.": "Optional. Helps the issuer correct it.",
      "Aprobar · MLS AP": "Approve · MLS AP",
      "Rechazar · MLS RE": "Reject · MLS RE",
      "Tu contraseña y tu verificación en dos pasos. Los datos del resto de usuarios se administran en Usuarios.": "Your password and your two-step verification. Other users’ details are managed in Users.",
      "Contraseña actual": "Current password",
      "Contraseña nueva": "New password",
      "Al menos diez caracteres, con una mayúscula, un número y un símbolo.": "At least ten characters, with an uppercase letter, a number and a symbol.",
      "Repite la contraseña nueva": "Repeat the new password",
      "Después de guardar te pediremos entrar otra vez con la contraseña nueva.": "After saving we will ask you to sign in again with the new password.",
      "Además de la contraseña, al entrar te pedimos un código de un solo uso. Hasta que no lo escribes no has iniciado sesión, así que una contraseña robada no basta para entrar a tu cuenta.": "Besides the password, when you sign in we ask for a one-time code. Until you enter it you are not signed in, so a stolen password is not enough to get into your account.",
      "No se puede desactivar: en Emiratos la verificación en dos pasos es obligatoria (Decisión Ministerial nº 64 de 2025, artículo 9.1).": "It cannot be turned off: in the UAE two-step verification is mandatory (Ministerial Decision No. 64 of 2025, Article 9.1).",
      "Cómo llega el código": "How the code arrives",
      "Por correo electrónico": "By email",
      "A qué dirección": "To which address",
      "Si cambias tu dirección de correo, el código empieza a llegar a la nueva.": "If you change your email address, the code starts arriving at the new one.",
      "Además del acceso, se te pedirá el código en": "Besides sign-in, you will be asked for the code when",
      "Crear las credenciales de una aplicación": "Creating an application’s credentials",
      "Cambiar o rotar el secreto de una aplicación": "Changing or rotating an application’s secret",
      "Cambiar datos sensibles de tu usuario": "Changing sensitive details of your user",
      "Las acciones de seguridad del sistema": "System security actions",
      "Activar / Inactivar MFA": "Enable / Disable MFA",
      "Alta y baja de los usuarios de tu empresa. El administrador es el primer usuario que se crea al habilitar la empresa.": "Add and remove your company’s users. The administrator is the first user created when the company is enabled.",
      "Usuarios de la empresa": "Company users",
      "Añadir usuario": "Add user",
      "Nombre y apellidos": "Full name",
      "Nombre en árabe": "Name in Arabic",
      "Opcional. Un solo alfabeto por campo.": "Optional. One alphabet per field.",
      "Ahí llegan las credenciales y todos los códigos de verificación.": "Credentials and all verification codes arrive there.",
      "Se propone a partir del nombre; puedes cambiarlo.": "Suggested from the name; you can change it.",
      "Los permisos se definen en la pantalla de": "Permissions are defined on the screen",
      "Un usuario inactivo conserva su histórico pero no puede entrar.": "An inactive user keeps their history but cannot sign in.",
      "Al crearlo le mandamos un correo de bienvenida con sus credenciales. Al entrar por primera vez tendrá que cambiar la contraseña, y siempre le pediremos el código de verificación.": "When the user is created, we send a welcome email with their credentials. On first sign-in they must change the password, and we will always ask for the verification code.",
      "Reenviar el correo de bienvenida": "Resend the welcome email",
      "No puedes desactivar tu propio usuario": "You cannot deactivate your own user",
      "Guardar permisos": "Save permissions",
      "Con qué identidad factura tu empresa: nombre legal, registro fiscal y domicilio. A quién avisamos se configura en Contactos.": "The identity your company invoices with: legal name, tax registration and address. Who we notify is set up in Contacts.",
      "Identificación": "Identification",
      "Nombre legal en inglés": "Legal name in English",
      "Nombre legal en árabe": "Legal name in Arabic",
      "Campo aparte, en un solo alfabeto. Nunca se traduce el nombre de una empresa.": "A separate field, in one alphabet. A company’s name is never translated.",
      "Dubái": "Dubai",
      "Ajmán": "Ajman",
      "Ras al-Jaima": "Ras Al Khaimah",
      "Ras Al Jaima": "Ras Al Khaimah",
      "Umm al-Qaywayn": "Umm Al Quwain",
      "El nombre con el que se conoce a tu empresa, aunque la razón social sea otra.": "The name your company is known by, even if the registered name is different.",
      "El de la empresa, no el de una persona. El de cada contacto va en «Actualización de contactos».": "The company’s, not a person’s. Each contact’s goes in “Contacts”.",
      "Indicaciones de facturación para cobro del producto eDoc": "Billing instructions for the eDoc service",
      "Cómo te facturamos nosotros": "How we invoice you",
      "Correo para facturar": "Billing email",
      "Ahí mandamos la factura del servicio de eDoc.": "We send the eDoc service invoice there.",
      "Día máximo para facturar": "Latest billing day",
      "Del 1 al 28. Después de ese día del mes, la factura pasa al siguiente ciclo.": "From 1 to 28. After that day of the month, the invoice moves to the next cycle.",
      "Requiere orden de compra": "Requires a purchase order",
      "Si tu empresa no acepta facturas sin número de orden, márcalo y nos lo pedirás por adelantado.": "If your company does not accept invoices without an order number, tick this and we will ask you for it in advance.",
      "Número de orden vigente": "Current order number",
      "Observaciones para facturar": "Billing notes",
      "Va tal cual en la factura, así que escríbelo como quieres verlo.": "It goes on the invoice as is, so write it the way you want to see it.",
      "Confirmar información": "Confirm information",
      "Centro de coste, referencia interna o cualquier dato que tenga que ir en la factura.": "Cost centre, internal reference or any detail that must appear on the invoice.",
      "A quién avisamos y para qué. Cada contacto lleva su tipo, y de un mismo tipo puede haber más de uno.": "Who we notify and what for. Each contact has a type, and there can be more than one of the same type.",
      "Contactos para comunicarnos con usted": "Contacts to reach you",
      "Añadir contacto": "Add contact",
      "Qué recibe cada tipo": "What each type receives",
      "Ahí llegan los avisos de ese tipo.": "Notices of that type arrive there.",
      "Quitar el contacto": "Remove the contact",
      "A qué correos te escribimos según el tema. De cada uno puede haber varios.": "Which email addresses we write to, by topic. There can be several for each.",
      "Se pueden poner varios correos por bloque": "Several addresses per block are allowed",
      "Contacto financiero y de contrato": "Finance and contract contact",
      "Añadir": "Add",
      "Gestión de temas relacionados con el contrato, cartera y vencimientos.": "Matters related to the contract, accounts and due dates.",
      "Contacto técnico": "Technical contact",
      "Errores en la cuenta, ventanas de mantenimiento y cambios normativos.": "Account errors, maintenance windows and regulatory changes.",
      "Contacto de notificaciones": "Notifications contact",
      "Comunicados generales que se envían a todos los clientes.": "General announcements sent to all clients.",
      "Deshacer los cambios": "Undo changes",
      "La documentación de uso del portal. Se lee aquí o se descarga.": "The portal’s user documentation. Read it here or download it.",
      "Recuperar contraseña · sin sesión": "Recover password · signed out",
      "Tres pasos, con el mismo código por correo que usa el acceso. No es un mecanismo aparte.": "Three steps, with the same emailed code used for sign-in. It is not a separate mechanism.",
      "Los tres pasos": "The three steps",
      "Paso 1 · Quién eres": "Step 1 · Who you are",
      "Tu usuario o el correo con el que entras.": "Your username or the email you sign in with.",
      "Paso 2 · El código": "Step 2 · The code",
      "Seis cifras al correo registrado.": "Six digits sent to the registered email.",
      "Paso 3 · La contraseña nueva": "Step 3 · The new password",
      "Y se cierran las sesiones abiertas.": "And open sessions are closed.",
      "Dinos con qué entras al portal. Te mandaremos un código al correo que tengas registrado.": "Tell us what you sign in with. We will send a code to your registered email.",
      "Usuario o correo": "Username or email",
      "Si la cuenta existe, el código sale al momento.": "If the account exists, the code is sent right away.",
      "Mandarme el código": "Send me the code",
      "Si esa cuenta existe, mandamos un código a su correo registrado.": "If that account exists, we send a code to its registered email.",
      "No decimos cuál es": "We do not say which one",
      ": enseñar la dirección permitiría averiguar quién tiene cuenta.": ": showing the address would reveal who has an account.",
      "No me ha llegado": "I didn’t get it",
      "Al menos doce caracteres, con mayúsculas, minúsculas y un número.": "At least twelve characters, with upper and lower case letters and a number.",
      "Repítela": "Repeat it",
      "Las dos tienen que coincidir.": "Both must match.",
      "Al cambiarla": "When you change it",
      "se cierran las sesiones abiertas": "open sessions are closed",
      "en otros navegadores. Es lo que se espera de una recuperación: si alguien había entrado, deja de estar dentro.": "in other browsers. That is what a recovery should do: if someone had got in, they are no longer in.",
      "Guardar y entrar": "Save and sign in",
      "Contraseña cambiada": "Password changed",
      "Las demás sesiones se han cerrado. Al entrar te pediremos otra vez el código: la contraseña es solo el primer factor.": "Other sessions have been closed. When you sign in we will ask for the code again: the password is only the first factor.",
      "Ir al acceso": "Go to sign-in",
      "Textos legales · sin sesión": "Legal texts · signed out",
      "Textos legales y tratamiento de datos": "Legal texts and data processing",
      "Los documentos legales del portal: su versión, su fecha y dónde descargarlos.": "The portal’s legal documents: their version, their date and where to download them.",
      "Los documentos todavía no están publicados.": "The documents are not published yet.",
      "Aquí verás su versión, su fecha y podrás descargarlos en cuanto se publiquen.": "Here you will see their version and date, and you can download them as soon as they are published.",
      "Los documentos": "The documents",
      "Este documento todavía no está publicado.": "This document is not published yet.",
      "En cuanto lo esté, aparecerá aquí con su versión y su fecha.": "As soon as it is, it will appear here with its version and date.",
      "Ver el documento": "View the document",
      "Ver el aviso de privacidad": "View the privacy notice",
      "Ver los términos y condiciones": "View the terms and conditions",
      "Al Noor Trading LLC · sin activar": "Al Noor Trading LLC · not activated",
      "Fuera del menú": "Outside the menu",
      "Asociarnos en EmaraTax": "Associate us in EmaraTax",
      "Falta un paso en el portal de impuestos para que podamos emitir y recibir documentos a tu nombre.": "One step is missing in the tax portal so we can issue and receive documents on your behalf.",
      "Tu empresa está registrada, pero todavía no nos has asociado como proveedor.": "Your company is registered, but you have not yet associated us as your provider.",
      "Hasta que lo hagas no podemos emitir ni recibir documentos a tu nombre.": "Until you do, we cannot issue or receive documents on your behalf.",
      "Qué tienes que hacer": "What you need to do",
      "Con las credenciales fiscales de tu empresa. Es el portal de la Federal Tax Authority, no el nuestro.": "With your company’s tax credentials. It is the Federal Tax Authority portal, not ours.",
      "Búscanos en la lista de proveedores": "Find us in the list of providers",
      "en la lista de proveedores de servicios.": "in the list of service providers.",
      "EmaraTax te avisará de que vas a salir de su sistema. Acepta y te traemos de vuelta aquí.": "EmaraTax will warn you that you are leaving its system. Accept and we will bring you back here.",
      "El portal se desbloquea solo. No tienes que avisarnos, ni escribir ningún código, ni volver a entrar: la autoridad nos confirma la asociación y tus opciones se activan.": "The portal unlocks by itself. You do not need to tell us, enter any code or sign in again: the authority confirms the association to us and your options are enabled.",
      "Si vuelves y sigues viendo este aviso, escríbenos desde el acceso al soporte.": "If you come back and still see this notice, write to us through Support.",
      "Desde aquí no se sale de verdad al portal de impuestos. Este botón hace como si ya hubieras vuelto, para poder seguir viendo la maqueta.": "This does not really take you to the tax portal. This button acts as if you had already come back, so you can keep exploring the mockup.",
      "Simular la vuelta desde EmaraTax": "Simulate the return from EmaraTax",
      "Ir a EmaraTax": "Go to EmaraTax",
      "Registro · sin sesión": "Registration · signed out",
      "Verificamos tu correo corporativo y después son seis pasos.": "We verify your corporate email, and then there are six steps.",
      "Registro de empresa": "Company registration",
      "Se abre al verificar el correo": "Opens when the email is verified",
      "Solicitud y acceso": "Application and access",
      "Tipo de solicitud y verificación": "Application type and verification",
      "Administrador de la cuenta": "Account administrator",
      "Responsable principal": "Main person responsible",
      "Datos de la empresa": "Company details",
      "Razón social, TRN e IVA": "Registered name, TRN and VAT",
      "Documento legal": "Legal document",
      "Licencia comercial": "Trade licence",
      "Contactos por área": "Contacts by area",
      "Comercial, cobros y técnico": "Sales, collections and technical",
      "Consentimientos legales": "Legal consents",
      "Revisión y aceptación": "Review and acceptance",
      "Revisión final": "Final review",
      "Verifica antes de enviar": "Check before sending",
      "Registro de empresa · Verificación": "Company registration · Verification",
      "Completado": "Completed",
      "Requerido": "Required",
      "Aceptado": "Accepted",
      "✓ Todo bien": "✓ All good",
      "Confirmar registro": "Confirm registration",
      "Indica si deseas crear un nuevo registro o actualizar uno existente. Esta información permite identificar tu solicitud y asociarla a un seguimiento previo si aplica.": "Indicate whether you want to create a new registration or update an existing one. This lets us identify your application and link it to a previous one if applicable.",
      "Tipo de solicitud": "Application type",
      "Nuevo registro": "New registration",
      "La empresa no está dada de alta todavía.": "The company is not registered yet.",
      "Para corregir lo que el revisor observó.": "To correct what the reviewer pointed out.",
      "Código de seguimiento": "Tracking code",
      "Los 36 caracteres que te dimos al enviar la solicitud.": "The 36 characters we gave you when you sent the application.",
      "Correo electrónico corporativo": "Corporate email",
      "Del dominio de la empresa, no un correo personal.": "From the company’s domain, not a personal email.",
      "Ese correo ya tiene un expediente abierto.": "That email already has an open application.",
      "Si vuelves a empezar de cero se creará un segundo expediente que alguien tendrá que revisar y descartar a mano.": "If you start over, a second application will be created that someone will have to review and discard by hand.",
      "Actualiza el que ya existe": "Update the existing one",
      "Código de verificación": "Verification code",
      "➤ Reenviar código": "➤ Resend code",
      "Este código es el mismo del doble factor.": "This code is the same as the two-factor one.",
      "Al reenviarlo, el código de seguimiento no cambia: es el mismo expediente.": "If you resend it, the tracking code does not change: it is the same application.",
      "Esta información permite identificar al responsable principal de la cuenta para la validación de la solicitud y la gestión administrativa y legal.": "This information identifies the account’s main person responsible, for validating the application and for administrative and legal matters.",
      "Nombre completo del administrador": "Administrator’s full name",
      "Cargo en la empresa": "Position in the company",
      "+971 · Emiratos Árabes Unidos": "+971 · United Arab Emirates",
      "+966 · Arabia Saudí": "+966 · Saudi Arabia",
      "+968 · Omán": "+968 · Oman",
      "+973 · Baréin": "+973 · Bahrain",
      "Elige el país de tu número.": "Choose your number’s country.",
      "Solo cifras, sin el código de país. Lo usamos si hace falta llamarte para desatascar el alta.": "Digits only, without the country code. We use it if we need to call you to unblock the registration.",
      "Esta información permite identificar legal y fiscalmente a la empresa, verificar su registro y aplicar correctamente el tratamiento correspondiente de IVA.": "This information identifies the company legally and for tax purposes, verifies its registration and applies the correct VAT treatment.",
      "Razón social": "Registered name",
      "Razón social en árabe": "Registered name in Arabic",
      "Un solo alfabeto por campo: aquí el árabe, arriba el latino.": "One alphabet per field: Arabic here, Latin above.",
      "Número de registro fiscal · TRN": "Tax registration number · TRN",
      "Quince cifras, tal como figura en tu registro fiscal.": "Fifteen digits, as shown in your tax registration.",
      "Selecciona una opción": "Select an option",
      "Sí": "Yes",
      "Régimen de IVA": "VAT regime",
      "Pendiente de la lista de Emiratos": "Pending the Emirates list",
      "Se habilitará cuando la lista de regímenes esté publicada.": "It will be enabled when the list of regimes is published.",
      "La licencia comercial permite validar la existencia legal de la empresa y completar el proceso de verificación empresarial.": "The trade licence validates the company’s legal existence and completes the business verification process.",
      "Haz clic para subir un archivo": "Click to upload a file",
      "Formatos permitidos: PDF, PNG o JPG · Máximo 10 MB por archivo": "Allowed formats: PDF, PNG or JPG · Maximum 10 MB per file",
      "Número de licencia": "Licence number",
      "Válida hasta": "Valid until",
      "Estos contactos permiten dirigir cada comunicación al responsable adecuado según el tema: gestión comercial, cobros o soporte técnico.": "These contacts let us direct each communication to the right person by topic: sales, collections or technical support.",
      "Contacto comercial": "Sales contact",
      "Correo del contacto comercial": "Sales contact email",
      "Contacto de cobros": "Collections contact",
      "Correo del contacto de cobros": "Collections contact email",
      "Correo del contacto técnico": "Technical contact email",
      "La aceptación de estos consentimientos confirma que la empresa conoce y aprueba las condiciones de uso, la política de privacidad y el tratamiento de sus datos.": "Accepting these consents confirms that the company knows and agrees to the terms of use, the privacy policy and the processing of its data.",
      "Acepto la": "I accept the",
      "Acepto los": "I accept the",
      "Acepto el": "I accept the",
      "Política de privacidad": "Privacy policy",
      "Términos de servicio": "Terms of service",
      "Tratamiento de datos": "Data processing",
      "Los documentos se abren en una pestaña aparte y puedes descargarlos para guardarlos.": "The documents open in a separate tab and you can download them to keep.",
      "Repasa los seis pasos antes de enviar. Cada tarjeta abre su detalle, y desde ella puedes volver al paso si algo no cuadra.": "Review the six steps before sending. Each card opens its details, and from there you can go back to the step if something is off.",
      "Éxito": "Success",
      "Tu registro se envió correctamente. Guarda este código para consultarlo más adelante.": "Your registration was sent successfully. Keep this code to check it later.",
      "Copiar código": "Copy code",
      "Son 36 caracteres. Mejor cópialo que transcribirlo.": "It is 36 characters. Better to copy it than to type it.",
      "Ir al login →": "Go to sign-in →",
      "Ingresa el código de 6 dígitos": "Enter the 6-digit code",
      "Ej: Al Noor": "e.g. Al Noor",
      "Copiar el código de seguimiento": "Copy the tracking code",
      "Aprobación del registro": "Registration approval",
      "La bandeja donde el Office Manager revisa cada solicitud de alta y decide si un cliente nuevo entra al portal.": "The inbox where the Office Manager reviews each registration request and decides whether a new client enters the portal.",
      "Esta pantalla no es del cliente.": "This screen is not for clients.",
      "La ve solo el Office Manager, que no es usuario del portal. Se queda aquí por ahora para no levantar un segundo sistema, pero hay riesgo de roles cruzados: él puede ver los menús de los demás. Lo correcto sería un portal aparte que muestre solo esto.": "Only the Office Manager sees it, and they are not a portal user. It stays here for now to avoid standing up a second system, but there is a risk of crossed roles: they can see the other menus. The right thing would be a separate portal showing only this.",
      "Solicitudes de alta": "Registration requests",
      "No conformes": "Non-compliant",
      "No hay solicitudes en ese estado.": "There are no requests in that status.",
      "Revisión de la solicitud": "Request review",
      "Se revisa paso a paso, igual que se rellenó. Cada bloque se marca como conforme o no, y lo que quede sin conformidad se le explica a la empresa por correo.": "It is reviewed step by step, just as it was filled in. Each block is marked compliant or not, and whatever is non-compliant is explained to the company by email.",
      "Qué tiene que corregir la empresa": "What the company must correct",
      "Va tal cual en el correo, así que escríbelo para que se entienda fuera.": "It goes into the email as is, so write it so it can be understood outside.",
      "El expediente está en": "The application is in",
      "inglés": "English",
      ". Escríbelo en ese idioma: la plantilla del correo se traduce, pero": ". Write it in that language: the email template is translated, but",
      "este texto viaja tal cual": "this text travels as is",
      "Enviar no conformidad": "Send non-compliance",
      "Aprobar el registro": "Approve the registration",
      "Revisar la solicitud": "Review the request",
      "La licencia comercial adjunta caducó en junio. Hace falta la renovada.": "The attached trade licence expired in June. The renewed one is needed.",
      "Un Aprobado aquí significa que la plataforma del otro lado recibió el documento sin errores técnicos. No es la aceptación del comprador: esa es la de C4.": "An Approved here means the platform on the other side received the document without technical errors. It is not the buyer’s acceptance: that one is C4.",
      "Qué significa Aprobado en esta esquina": "What Approved means at this corner",
      "El administrador siempre tiene todo. Si se le pudiera quitar un permiso, una empresa podría dejarse fuera de su propio portal.": "The administrator always has everything. If a permission could be removed, a company could lock itself out of its own portal.",
      "Por qué no se pueden cambiar estos permisos": "Why these permissions cannot be changed",
      "C3 es la plataforma que recibe el documento en tu nombre: somos nosotros, eDoc. Aquí ves si llegó bien por la red.": "C3 is the platform that receives the document on your behalf: that is us, eDoc. Here you see whether it arrived correctly over the network.",
      "C4 eres tú, el destinatario. Aquí ves qué has respondido: aprobar, rechazar o confirmar la recepción.": "C4 is you, the recipient. Here you see what you responded: approve, reject or confirm receipt.",
      "Qué es C3": "What C3 is",
      "Qué es C4": "What C4 is",
      "Lo que tu sistema puede hacer hoy con la API de eDoc.": "What your system can do today with the eDoc API.",
      "¿Lo va a conectar otra persona de tu equipo?": "Will someone else on your team connect it?",
      "Así se lo pasas sin riesgo:": "Here is how to hand it over safely:",
      "Crea la aplicación con los permisos que necesite.": "Create the application with the permissions it needs.",
      "Envíale el identificador de cliente. No es secreto.": "Send them the client ID. It is not secret.",
      "Envíale el secreto por un canal privado —en persona, por teléfono o con un gestor de contraseñas—. Nunca por correo.": "Send them the secret through a private channel —in person, by phone or with a password manager—. Never by email.",
      "Copiar instrucciones para tu técnico": "Copy instructions for your technician",
      "Verificación en dos pasos": "Two-step verification",
      "Verificación": "Verification",
      "Volver a la verificación": "Back to verification",
      "Ver detalle": "View details",
      "Factura": "Invoice",
      "Nota de crédito": "Credit note",
      "Factura no comercial": "Non-commercial invoice",
      "Nota de crédito no comercial": "Non-commercial credit note",
      "Factura de exportación": "Export invoice",
      "Autofactura": "Self-billed invoice",
      "Autonota de crédito": "Self-billed credit note",
      "Aprobado": "Approved",
      "Rechazado": "Rejected",
      "Entregado": "Delivered",
      "Enviado": "Sent",
      "Acuse": "Acknowledged",
      "Pendiente de responder": "Awaiting response",
      "Todos los estados": "All statuses",
      "Aprobada · MLS AP": "Approved · MLS AP",
      "Rechazada · MLS RE": "Rejected · MLS RE",
      "Acuse · MLS AB": "Acknowledged · MLS AB",
      "Acuse de recibo · MLS AB": "Acknowledgement of receipt · MLS AB",
      "Rechazo técnico": "Technical rejection",
      "Rechazo comercial": "Commercial rejection",
      "Los datos del receptor no corresponden": "The recipient details do not match",
      "El importe no coincide con lo pactado": "The amount does not match what was agreed",
      "Bienes o servicios no recibidos": "Goods or services not received",
      "Cantidad o descripción incorrecta": "Incorrect quantity or description",
      "Documento duplicado": "Duplicate document",
      "Impuesto aplicado de forma incorrecta": "Tax applied incorrectly",
      "Falta la referencia de la orden de compra": "Purchase order reference missing",
      "El esquema del XML no valida contra la versión vigente": "The XML does not validate against the current schema version",
      "La firma del sobre de transmisión no valida · error técnico": "The transmission envelope signature does not validate · technical error",
      "Quien emite el documento": "Who issues the document",
      "Tu proveedor de servicios en la red Peppol": "Your service provider on the Peppol network",
      "El ASP del comprador": "The buyer’s ASP",
      "El comprador · destinatario final": "The buyer · final recipient",
      "Concentrador de la Federal Tax Authority · recibe el reporte fiscal": "Federal Tax Authority hub · receives the fiscal report",
      "Tú, quien emite el documento.": "You, the one who issues the document.",
      "Lo entrega a eDoc para que lo transmita.": "Hands it to eDoc for transmission.",
      "Tu proveedor de servicios en la red Peppol. Es quien transmite el documento.": "Your service provider on the Peppol network. It transmits the document.",
      "Aprueba el documento o lo rechaza si el XML no valida.": "Approves the document, or rejects it if the XML does not validate.",
      "El proveedor de servicios del comprador.": "The buyer’s service provider.",
      "Entrega o rechaza por validaciones técnicas.": "Delivers, or rejects on technical validation.",
      "El comprador, la empresa que recibe.": "The buyer, the company that receives.",
      "Aprueba, rechaza con motivo o solo acusa recibo.": "Approves, rejects with a reason, or only acknowledges receipt.",
      "El concentrador de la Federal Tax Authority. Detrás están Finanzas, el Ministerio y las demás entidades que fiscalizan.": "The Federal Tax Authority hub. Behind it are Finance, the Ministry and the other supervising bodies.",
      "Acepta o rechaza el": "Accepts or rejects the",
      "reporte fiscal": "fiscal report",
      ", no la factura. Tiene diez minutos para contestar.": ", not the invoice. It has ten minutes to respond.",
      "El documento no pasó las validaciones. Hay que corregirlo y volver a emitirlo.": "The document failed validation. It must be corrected and issued again.",
      "El documento está bien hecho, pero el comprador no está de acuerdo. Se corrige con una nota de crédito, porque en Emiratos anular no existe.": "The document is correct, but the buyer disagrees. It is corrected with a credit note, because cancellation does not exist in the Emirates.",
      "El documento está bien hecho, pero el comprador no está de acuerdo. Se corrige con una nota de crédito.": "The document is correct, but the buyer disagrees. It is corrected with a credit note.",
      "eDoc, la autoridad o la plataforma receptora": "eDoc, the authority or the receiving platform",
      "El destinatario": "The recipient",
      "El documento original tal como llegó": "The original document as received",
      "El documento original tal como salió": "The original document as sent",
      "La representación del documento": "The document rendering",
      "Integración con ERP · horas de servicio": "ERP integration · service hours",
      "Licencia de plataforma eDoc · anualidad": "eDoc platform licence · annual fee",
      "Administrador": "Administrator",
      "Consulta": "Read-only",
      "Inactivo": "Inactive",
      "Administrador del sistema": "System administrator",
      "Analista de cobros": "Collections analyst",
      "Jefa de sistemas": "Head of IT",
      "Responsable de tesorería": "Treasury manager",
      "Solo lectura de emitidos y recibidos": "Read-only access to issued and received documents",
      "Responde los documentos que llegan": "Responds to incoming documents",
      "Sin ningún permiso": "No permissions",
      "Emisión · completo": "Issuing · full",
      "Recepción · completo": "Receiving · full",
      "Facturación del servicio y avisos de pago.": "Service billing and payment notices.",
      "Gestión del contrato, cartera y vencimientos. Es a quien se escribe cuando hay algo que decidir sobre el servicio.": "Contract, accounts and due dates. The person we write to when something about the service needs a decision.",
      "Errores en la cuenta, ventanas de mantenimiento y cambios normativos. Solo hace falta si la empresa integra por API.": "Account errors, maintenance windows and regulatory changes. Only needed if the company integrates via API.",
      "Emisión desde el ERP de la planta de Jebel Ali": "Issuing from the Jebel Ali plant ERP",
      "Portal de compras": "Procurement portal",
      "Descarga mensual de XML para el cierre contable": "Monthly XML download for the accounting close",
      "Consulta y respuesta de las facturas de proveedores": "Review and response to supplier invoices",
      "Búsqueda específica de factura": "Specific invoice search",
      "Autenticación · pedir el token": "Authentication · request the token",
      "Factura, nota de crédito y": "Invoice, credit note and",
      "los demás tipos que indique la ley": "the other types required by law",
      ". En Emiratos hay más que factura y nota: no comerciales, de exportación, autofactura y autonota.": ". The Emirates have more than invoice and credit note: non-commercial, export, self-billed invoice and self-billed credit note.",
      "No hay que pedirlo ni programarlo:": "No need to request or schedule it:",
      "sale con cada envío": "it goes out with every submission",
      "Del receptor —aprobado o rechazado por quien recibe la factura— y de la autoridad, por separado. Son dos respuestas distintas, no una.": "From the recipient —approved or rejected by whoever receives the invoice— and from the authority, separately. They are two different responses, not one.",
      "Por su número o por su identificador de seguimiento.": "By its number or by its tracking identifier.",
      "Lo que otros te emiten, tal como llega.": "What others issue to you, as received.",
      "Solo los encabezados": "Headers only",
      ", para saber qué hay sin traerlo todo.": ", to see what is there without fetching everything.",
      "Uno o varios de una vez.": "One or several at once.",
      "· con motivo tipificado": "· with a coded reason",
      "· dice que llegó,": "· says it arrived,",
      "no que se acepta": "not that it is accepted",
      "MLS AB · deja constancia de que llegó, no la aprueba": "MLS AB · records that it arrived, does not approve it",
      "Ya dejaste constancia de que llegó": "You already recorded that it arrived",
      "Guía de primeros pasos": "Getting started guide",
      "Conexión con tu sistema": "Connecting your system",
      "Tipos de documento en Emiratos": "Document types in the Emirates",
      "Cómo entrar, qué encuentras en cada sección y qué hacer el primer día.": "How to sign in, what you will find in each section and what to do on day one.",
      "Cómo consultar, leer los cuatro estados y exportar resultados.": "How to search, read the four statuses and export results.",
      "Cómo aprobar, rechazar con motivo y acusar recibo.": "How to approve, reject with a reason and acknowledge receipt.",
      "Credenciales, entornos y ejemplos de llamada.": "Credentials, environments and request examples.",
      "Factura, nota de crédito, no comerciales, exportación y autofacturas.": "Invoice, credit note, non-commercial, export and self-billed.",
      "Sin publicar": "Not published",
      "Accesibles con la sesión abierta, para releerlos cuando haga falta.": "Available while signed in, to reread whenever needed.",
      "Es el único punto donde se aceptan, y sin aceptarlos no se puede enviar la solicitud.": "The only place where they are accepted; without accepting them the application cannot be sent.",
      "Fecha y hora, con su huso.": "Date and time, with time zone.",
      "La persona y la empresa que envió la solicitud.": "The person and the company that sent the application.",
      "Lo mínimo que permita demostrar que la aceptación existió.": "The minimum needed to prove the acceptance took place.",
      "Las reglas del servicio: qué presta eDoc como proveedor de servicios, qué se espera del cliente y qué pasa si una de las dos partes deja de cumplir.": "The rules of the service: what eDoc provides as a service provider, what is expected of the client and what happens if either party fails to comply.",
      "Qué datos personales se recogen, para qué, cuánto se guardan y a quién se ceden. Aquí entra el registro de la empresa, que pide nombre, cargo y teléfono de personas.": "Which personal data is collected, for what, how long it is kept and who it is shared with. This covers company registration, which asks for people’s name, position and phone.",
      "Cuál de los dos, y en": "Which of the two, and in",
      "qué versión": "which version"
  };

  var DIAS = { 'lunes': 'Monday', 'martes': 'Tuesday', 'miércoles': 'Wednesday',
               'jueves': 'Thursday', 'viernes': 'Friday', 'sábado': 'Saturday',
               'domingo': 'Sunday' };

  /* Lo que lleva un dato dentro: una hora, un número, un nombre. */
  var EN_PATRONES = [
    [/^Dura hasta el (\S+) a las (\d{1,2}:\d{2}) y puede que algunas funciones no respondan como siempre\. Puedes seguir consultando; si algo no te deja continuar,$/,
     function (m, dia, hora) {
       return 'Lasts until ' + (DIAS[dia] || dia) + ' at ' + hora +
         ' and some features may not respond as usual. You can keep browsing; if something stops you,';
     }],
    [/^Vuelve sola el (\S+) a las (\d{1,2}:\d{2})$/,
     function (m, dia, hora) { return 'Back automatically on ' + (DIAS[dia] || dia) + ' at ' + hora; }],
    [/^Esos son todos · (\d+)$/, 'That’s all · $1'],
    [/^(\d+) avisos? sin leer$/, '$1 unread notices'],
    [/^Notificaciones · (\d+) sin leer$/, 'Notifications · $1 unread'],
    [/^Archivar: (.+)$/, function (m, t) { return 'Archive: ' + (aIngles(t) || t); }],
    [/^Menú de la cuenta de (.+)$/, 'Account menu for $1'],
    [/^Paso (\d+) de (\d+)$/, 'Step $1 of $2'],
    // El pie de las tablas lleva los números dentro.
    [/^Mostrando registros del (\d+) al (\d+) de un total de (\d+) registros$/, 'Showing entries $1 to $2 of $3'],
    [/^\(filtrado de un total de (\d+) registros\)$/, '(filtered from $1 total entries)'],
    // El motivo lleva su código delante: «RE-02 · El importe no coincide…».
    [/^(RE-\d{2}) · (.+)$/, function (m, c, t) { return c + ' · ' + (aIngles(t) || t); }],
    // Permisos marcados: «10 de 23».
    [/^(\d+) de (\d+)$/, '$1 of $2'],
    [/^Volver al paso (\d+)$/, 'Back to step $1'],
    // Las etiquetas que llevan un dato dentro, generadas fila a fila.
    [/^(.+): activar para ordenar la columna de manera (ascendente|descendente)$/, function (m, e, sentido) {
      var limpia = e.replace(/\s*\?$/, '');
      return (aIngles(limpia) || limpia) + ': activate to sort column ' +
        (sentido === 'ascendente' ? 'ascending' : 'descending');
    }],
    [/^(Aprobado|Rechazado|Entregado|Enviado|Acuse|Pendiente) por (Tu empresa|eDoc|Plataforma receptora|Destinatario|Autoridad) · (.+)$/,
     function (m, e, n, q) { return (aIngles(e) || e) + ' by ' + (aIngles(n) || n) + ' · ' + (aIngles(q) || q); }],
    [/^Abrir el visor de (.+)$/, 'Open the viewer for $1'],
    [/^Ver los estados de (.+)$/, 'View the statuses of $1'],
    [/^Más acciones para (.+)$/, 'More actions for $1'],
    [/^Reenviar el correo de bienvenida a (.+)$/, 'Resend the welcome email to $1'],
    [/^Editar a (.+)$/, 'Edit $1'],
    [/^Desactivar a (.+)$/, 'Deactivate $1'],
    [/^Activar a (.+)$/, 'Activate $1'],
    [/^Quitar a (.+)$/, 'Remove $1'],
    [/^Descargar (.+)$/, function (m, t) { return 'Download ' + (aIngles(t) || t); }],
    [/^Registro de empresa · Paso (\d+) de (\d+)$/, 'Company registration · Step $1 of $2'],
    [/^Falta (\d+)$/, 'Missing $1'],
    // El visor: «Emisión 2026-08-31», y las direcciones que acaban en el país.
    [/^(Emisión|Recepción|Vencimiento) (\d{4}-\d{2}-\d{2})$/, function (m, q, f) {
      return { 'Emisión': 'Issued', 'Recepción': 'Received', 'Vencimiento': 'Due' }[q] + ' ' + f;
    }],
    [/^(.+) · Emiratos Árabes Unidos$/, '$1 · United Arab Emirates'],
    // Nombre accesible de los botones de fila de Recibidos.
    [/^Aprobar · MLS AP · (.+)$/, 'Approve · MLS AP · $1'],
    [/^Rechazar · MLS RE · (.+)$/, 'Reject · MLS RE · $1'],
    // Tiempo relativo: «hace 6 minutos».
    [/^hace (\d+) (minuto|hora|día)s?$/, function (m, n, u) {
      var en = { 'minuto': 'minute', 'hora': 'hour', 'día': 'day' }[u];
      return n + ' ' + en + (n === '1' ? '' : 's') + ' ago';
    }],
    [/^Borrar el rol (.+)$/, function (m, r) { return 'Delete the role ' + (aIngles(r) || r); }],
    [/^Permisos del rol (.+)$/, function (m, r) { return 'Permissions of the ' + (aIngles(r) || r) + ' role'; }],
    [/^Generar un secreto nuevo para (.+)$/, function (m, a) { return 'Generate a new secret for ' + (aIngles(a) || a); }],
    [/^Ver el secreto de (.+)$/, function (m, a) { return 'View the secret of ' + (aIngles(a) || a); }],
    [/^Retirar (.+)$/, function (m, a) { return 'Retire ' + (aIngles(a) || a); }],
    [/^(\d+) permisos?$/, function (m, n) { return n + (n === '1' ? ' permission' : ' permissions'); }],
    [/^Revisar (.+)$/, 'Review $1'],
    [/^(.+) · no disponible: (.+)$/, function (m, a, b) {
      return (aIngles(a) || a) + ' · not available: ' + (aIngles(b) || b);
    }]
  ];

  /* Elegir inglés no avisa de nada: el cambio se ve. Solo el árabe lo dice,
     porque se pide una cosa y se enseña otra. */
  var AVISO_AR = 'Arabic is not available yet, so the portal is shown in English.';

  function aIngles(texto) {
    if (Object.prototype.hasOwnProperty.call(EN, texto)) return EN[texto];
    for (var i = 0; i < EN_PATRONES.length; i++) {
      if (EN_PATRONES[i][0].test(texto)) return texto.replace(EN_PATRONES[i][0], EN_PATRONES[i][1]);
    }
    return null;
  }

  // data-content es el texto de los '?' de ayuda.
  // data-seccion-actual: el nombre de la sección en la barra del menú móvil,
  // que el CSS pinta con attr() y no es un nodo de texto.
  var ATRIBUTOS = ['title', 'aria-label', 'placeholder', 'data-content', 'data-seccion-actual'];
  var traduciendo = false;
  var observador = null;

  function limpio(v) { return String(v).replace(/\s+/g, ' ').trim(); }

  function traducirTexto(n) {
    var v = n.nodeValue;
    if (!v) return;
    var t = limpio(v);
    if (t.length < 2) return;
    var en = aIngles(t);
    // Si ya está en inglés, o la traducción coincide, no se toca: escribir lo
    // mismo dispararía el observador otra vez y no pararía nunca.
    if (en == null || en === t) return;
    n.nodeValue = v.match(/^\s*/)[0] + en + v.match(/\s*$/)[0];
  }

  function traducirAtributos(el) {
    ATRIBUTOS.forEach(function (a) {
      var v = el.getAttribute(a);
      if (!v) return;
      var t = limpio(v);
      var en = aIngles(t);
      if (en == null || en === t) return;
      el.setAttribute(a, en);
    });
  }

  /* Las notas de diseño son internas y se quedan en español. */
  var FILTRO = {
    acceptNode: function (n) {
      if (n.nodeType === 1 && n.matches('script, style, .nota')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  };

  function recorrer(raiz) {
    if (!raiz) return;
    if (raiz.nodeType === 3) {
      var padre = raiz.parentElement;
      if (!padre || !padre.closest('script, style, .nota')) traducirTexto(raiz);
      return;
    }
    if (raiz.nodeType !== 1 || raiz.closest('script, style, .nota')) return;
    traducirAtributos(raiz);
    var w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, FILTRO);
    var n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 1) traducirAtributos(n);
      else traducirTexto(n);
    }
  }

  function vigilar() {
    if (observador || !window.MutationObserver) return;
    observador = new MutationObserver(function (cambios) {
      if (traduciendo) return;
      traduciendo = true;
      try {
        cambios.forEach(function (c) {
          if (c.type === 'characterData') recorrer(c.target);
          else if (c.type === 'attributes') traducirAtributos(c.target);
          else c.addedNodes.forEach(recorrer);
        });
      } finally { traduciendo = false; }
    });
    observador.observe(document.body, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATRIBUTOS
    });
  }

  function aplicar() {
    document.documentElement.lang = 'en';
    traduciendo = true;
    try {
      recorrer(document.body);
      // El título de la pestaña: «Documentos Emitidos · eDoc Emiratos».
      var partes = document.title.split(' · ');
      partes = partes.map(function (p) {
        if (p === 'eDoc Emiratos') return 'eDoc Emirates';
        return aIngles(p) || p;
      });
      document.title = partes.join(' · ');
    } finally { traduciendo = false; }
    vigilar();
  }

  function avisar(texto) {
    if (window.edocAvisar) { window.edocAvisar(texto); return; }
    /* En la pantalla de acceso no está la capa de avisos del portal. */
    var caja = document.getElementById('aviso-idioma');
    if (!caja) return;
    caja.textContent = texto;
    caja.hidden = false;
  }

  function elegir(codigo) {
    var antes = actual();
    try { window.localStorage.setItem(LLAVE, ficha(codigo).codigo); } catch (error) { /* nada */ }
    repintar();
    var i = ficha(codigo);
    if (i.codigo === 'ES') {
      /* Volver al español es recargar: la página está escrita en español, y
         deshacer a mano cada texto traducido es buscarse descuadres. */
      if (antes !== 'ES') window.location.reload();
      return;
    }
    aplicar();
    if (i.codigo === 'AR') avisar(AVISO_AR);
  }

  function arrancar() {
    document.querySelectorAll('[data-selector-idioma]').forEach(function (hueco) {
      hueco.innerHTML = selector(hueco.dataset.selectorIdioma || '');
    });
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-idioma]');
      if (!b) return;
      e.preventDefault();
      elegir(b.dataset.idioma);
    });
    repintar();
    // Lo que se eligió en otra pantalla, o en el acceso, sigue aquí.
    if (actual() !== 'ES') aplicar();
  }

  /* Se traduce en cuanto se ejecuta este archivo, que va al final del <body>:
     el documento ya está entero y así no se ve el español un instante antes
     de que cambie. Lo que se pinte después lo recoge el observador. */
  if (document.body && actual() !== 'ES') aplicar();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
