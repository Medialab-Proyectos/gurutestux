/* ==========================================================================
   eDoc Emiratos · datos de muestra
   Inventados para la maqueta. Nada sale de un entorno real: los portales se
   recorren sin escribir. Sirven para enseñar los cuatro estados, los tipos de
   documento de Emiratos y la regla del árabe.
   ========================================================================== */
window.EDOC = (function () {
  'use strict';

  /* Los cuatro corners. El código 2 significa «aprobado» para todas las
     entidades; por eso la columna no puede ser una sola.

     `rechazo` dice de qué clase es el rechazo de cada una, que no son lo mismo
     ni se arreglan igual. Las tres primeras son plataformas y rechazan por
     validaciones: el documento está mal hecho y hay que corregirlo y reenviarlo.
     El destinatario rechaza por negocio: el documento está bien hecho pero no
     está de acuerdo, y la salida es una nota de crédito. */
  /* Son cinco, no cuatro, y el orden importa. Del glosario oficial de PINT AE:
     «C2 = Sending AP, C3 = Receiving AP, C5 = Tax Authority AP». C1 es el
     emisor y C4 el receptor.

     Y la autoridad NO está en el camino de la factura. Esa recorre
     C1 → C2 → C3 → C4 y no pasa por hacienda. Lo que va a C5 es un TDD —Tax
     Data Document: un resumen con la factura original adjunta—, y en Emiratos
     se manda dos veces: una la emite C2 al enviar, y otra la emite C3 al
     recibir, para que el gobierno cruce los datos. «Emiratos es el primer país
     del mundo que yo conozca en que el receptor está obligado a enviarle otra
     vez un TDD al gobierno.»

     C5 tampoco es «el gobierno» a secas: es un concentrador, y detrás están
     Finanzas, el Ministerio y las demás entidades que fiscalizan. */
  var CORNERS = [
    { clave: 'C1', nombre: 'Tu empresa',            quien: 'Quien emite el documento',
      rama: 'entrega', rechazo: 'tecnico' },
    { clave: 'C2', nombre: 'eDoc',                  quien: 'Tu proveedor de servicios en la red Peppol',
      rama: 'entrega', rechazo: 'tecnico' },
    { clave: 'C3', nombre: 'Plataforma receptora',  quien: 'El ASP del comprador',
      rama: 'entrega', rechazo: 'tecnico' },
    { clave: 'C4', nombre: 'Destinatario',          quien: 'El comprador · destinatario final',
      rama: 'entrega', rechazo: 'comercial' },
    { clave: 'C5', nombre: 'Autoridad',             quien: 'Concentrador de la Federal Tax Authority · recibe el reporte fiscal',
      rama: 'fiscal', rechazo: 'tecnico' }
  ];

  /* Las dos clases de rechazo, con el nombre que se enseña y qué hacer. */
  var RECHAZOS = {
    tecnico:   { rotulo: 'Rechazo técnico',
                 que: 'El documento no pasó las validaciones. Hay que corregirlo y volver a emitirlo.' },
    comercial: { rotulo: 'Rechazo comercial',
                 que: 'El documento está bien hecho, pero el comprador no está de acuerdo. Se corrige con una nota de crédito.' }
  };

  /* Estado → cómo se pinta. Los colores son los de señalización del manual.
     Ojo: el MLS —evolución del MLR clásico— admite más estados de los que usa
     la maqueta. Además de reconocido, aprobado y rechazado están «en proceso
     bajo consulta» —falta información—, «aceptado condicionalmente» y
     «pagado». Salen de una lista de códigos cerrada. */
  var ESTADOS = {
    aprobado:  { rotulo: 'Aprobado',    clase: 'exito' },
    rechazado: { rotulo: 'Rechazado',   clase: 'error' },
    entregado: { rotulo: 'Entregado',   clase: 'transito' },
    enviado:   { rotulo: 'Enviado',     clase: 'transito' },
    acuse:     { rotulo: 'Acuse',       clase: 'advertencia' },
    pendiente: { rotulo: 'Pendiente',   clase: 'neutro' },
    noaplica:  { rotulo: '—',           clase: 'neutro' }
  };

  /* Tipos de documento de Emiratos. No son los cuatro clásicos de LATAM:
     hay no comerciales, de exportación, autofacturas y autonotas. */
  var TIPOS = [
    'Factura',
    'Nota de crédito',
    'Factura no comercial',
    'Nota de crédito no comercial',
    'Factura de exportación',
    'Autofactura',
    'Autonota de crédito'
  ];

  /* Motivos tipificados de rechazo. En Emiratos el rechazo pide motivo;
     el texto libre es opcional y va aparte. */
  var MOTIVOS_RECHAZO = [
    { codigo: 'RE-01', texto: 'Los datos del receptor no corresponden' },
    { codigo: 'RE-02', texto: 'El importe no coincide con lo pactado' },
    { codigo: 'RE-03', texto: 'Bienes o servicios no recibidos' },
    { codigo: 'RE-04', texto: 'Cantidad o descripción incorrecta' },
    { codigo: 'RE-05', texto: 'Documento duplicado' },
    { codigo: 'RE-06', texto: 'Impuesto aplicado de forma incorrecta' },
    { codigo: 'RE-07', texto: 'Falta la referencia de la orden de compra' }
  ];

  function d(n) { return n.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  /* --- Documentos emitidos ---------------------------------------------- */
  var EMITIDOS = [
    { numero: 'INV-2026-004871', fecha: '2026-08-31', tipo: 'Factura',
      receptorLatino: 'Al Futtaim Logistics LLC', receptorArabe: 'الفطيم للخدمات اللوجستية ذ.م.م',
      trn: '100234567800003', moneda: 'AED', base: 18400.00, iva: 920.00, total: 19320.00,
      c1: 'aprobado', c2: 'aprobado', c5: 'aprobado', c3: 'aprobado', c4: 'aprobado' },

    { numero: 'INV-2026-004870', fecha: '2026-08-31', tipo: 'Factura',
      receptorLatino: 'Emirates Steel Arkan PJSC', receptorArabe: 'الإمارات للحديد والصلب أركان',
      trn: '100987654300003', moneda: 'AED', base: 6250.00, iva: 312.50, total: 6562.50,
      c1: 'aprobado', c2: 'aprobado', c5: 'aprobado', c3: 'aprobado', c4: 'acuse' },

    { numero: 'INV-2026-004869', fecha: '2026-08-30', tipo: 'Nota de crédito',
      receptorLatino: 'Gulf Marine Services', receptorArabe: 'خدمات الخليج البحرية',
      trn: '100445566700003', moneda: 'AED', base: -1200.00, iva: -60.00, total: -1260.00,
      c1: 'aprobado', c2: 'aprobado', c5: 'aprobado', c3: 'aprobado', c4: 'pendiente' },

    { numero: 'INV-2026-004868', fecha: '2026-08-30', tipo: 'Factura',
      receptorLatino: 'Dubai Investments PJSC', receptorArabe: 'دبي للاستثمار ش.م.ع',
      trn: '100112233400003', moneda: 'AED', base: 43900.00, iva: 2195.00, total: 46095.00,
      c1: 'aprobado', c2: 'aprobado', c5: 'aprobado', c3: 'aprobado', c4: 'rechazado',
      motivoC4: 'RE-02 · El importe no coincide con lo pactado' },

    { numero: 'INV-2026-004867', fecha: '2026-08-29', tipo: 'Factura de exportación',
      receptorLatino: 'Qatar Fuel Company', receptorArabe: 'شركة قطر للوقود',
      trn: '100778899100003', moneda: 'USD', base: 12750.00, iva: 0.00, total: 12750.00,
      c1: 'aprobado', c2: 'aprobado', c5: 'aprobado', c3: 'entregado', c4: 'pendiente' },

    { numero: 'INV-2026-004866', fecha: '2026-08-29', tipo: 'Factura',
      receptorLatino: 'Sharjah Cement Factory', receptorArabe: 'مصنع الشارقة للإسمنت',
      trn: '100556677800003', moneda: 'AED', base: 9800.00, iva: 490.00, total: 10290.00,
      c1: 'aprobado', c2: 'aprobado', c5: 'rechazado', c3: 'noaplica', c4: 'noaplica',
      motivoC5: 'Falta el número de registro fiscal del receptor · dato obligatorio' },

    { numero: 'INV-2026-004865', fecha: '2026-08-28', tipo: 'Autofactura',
      receptorLatino: 'Ras Al Khaimah Ceramics', receptorArabe: 'رأس الخيمة للسيراميك',
      trn: '100334455600003', moneda: 'AED', base: 3150.00, iva: 157.50, total: 3307.50,
      c1: 'aprobado', c2: 'aprobado', c5: 'aprobado', c3: 'rechazado', c4: 'noaplica',
      motivoC3: 'La firma del sobre de transmisión no valida · error técnico' },

    { numero: 'INV-2026-004864', fecha: '2026-08-28', tipo: 'Factura no comercial',
      receptorLatino: 'Mohammed Bin Saeed Trading', receptorArabe: 'محمد بن سعيد للتجارة',
      trn: '—', moneda: 'AED', base: 740.00, iva: 0.00, total: 740.00,
      c1: 'aprobado', c2: 'aprobado', c5: 'aprobado', c3: 'entregado', c4: 'pendiente' },

    { numero: 'INV-2026-004863', fecha: '2026-08-27', tipo: 'Factura',
      receptorLatino: 'Abu Dhabi Ports Company', receptorArabe: 'شركة موانئ أبوظبي',
      trn: '100223344500003', moneda: 'AED', base: 27500.00, iva: 1375.00, total: 28875.00,
      c1: 'aprobado', c2: 'aprobado', c5: 'enviado', c3: 'pendiente', c4: 'pendiente' },

    { numero: 'INV-2026-004862', fecha: '2026-08-27', tipo: 'Factura',
      receptorLatino: 'Etihad Rail PJSC', receptorArabe: 'الاتحاد للقطارات ش.م.ع',
      trn: '100667788900003', moneda: 'AED', base: 15200.00, iva: 760.00, total: 15960.00,
      c1: 'aprobado', c2: 'rechazado', c5: 'noaplica', c3: 'noaplica', c4: 'noaplica',
      motivoC2: 'El esquema del XML no valida contra la versión vigente' }
  ];

  /* --- Documentos recibidos ---------------------------------------------
     Aquí eDoc es el corner 3 y la empresa que entra al portal es el corner 4. */
  var RECIBIDOS = [
    { numero: 'INV-882301', fecha: '2026-08-31', fechaEmision: '2026-08-29', tipo: 'Factura',
      emisorLatino: 'Al Ain Water Company', emisorArabe: 'شركة العين للمياه',
      trn: '100908070600003', moneda: 'AED', base: 2400.00, iva: 120.00, total: 2520.00,
      recepcion: 'aprobado', respuesta: 'pendiente' },

    { numero: 'INV-2026-77120', fecha: '2026-08-31', fechaEmision: '2026-08-30', tipo: 'Factura',
      emisorLatino: 'Emirates Global Aluminium', emisorArabe: 'الإمارات العالمية للألمنيوم',
      trn: '100101202300003', moneda: 'AED', base: 88500.00, iva: 4425.00, total: 92925.00,
      recepcion: 'aprobado', respuesta: 'pendiente' },

    { numero: 'CN-2026-0043', fecha: '2026-08-30', fechaEmision: '2026-08-28', tipo: 'Nota de crédito',
      emisorLatino: 'Jumeirah Facilities Management', emisorArabe: 'الجميرا لإدارة المرافق',
      trn: '100404505600003', moneda: 'AED', base: -960.00, iva: -48.00, total: -1008.00,
      recepcion: 'aprobado', respuesta: 'acuse', respuestaSello: '2026-08-30 14:12' },

    { numero: 'INV-55219', fecha: '2026-08-30', fechaEmision: '2026-08-29', tipo: 'Factura',
      emisorLatino: 'Union Coop', emisorArabe: 'جمعية الاتحاد التعاونية',
      trn: '100606707800003', moneda: 'AED', base: 1180.00, iva: 59.00, total: 1239.00,
      recepcion: 'aprobado', respuesta: 'aprobado', respuestaSello: '2026-08-30 09:41' },

    { numero: 'INV-2026-00918', fecha: '2026-08-29', fechaEmision: '2026-08-27', tipo: 'Factura',
      emisorLatino: 'Khalifa Industrial Zone Services', emisorArabe: 'خدمات مدينة خليفة الصناعية',
      trn: '100808909100003', moneda: 'AED', base: 34200.00, iva: 1710.00, total: 35910.00,
      recepcion: 'aprobado', respuesta: 'rechazado', respuestaSello: '2026-08-29 16:05',
      motivo: 'RE-03 · Bienes o servicios no recibidos' },

    { numero: 'INV-2026-00917', fecha: '2026-08-29', fechaEmision: '2026-08-26', tipo: 'Factura de exportación',
      emisorLatino: 'Oman National Transport', emisorArabe: 'النقل الوطنية العمانية',
      trn: '100303404500003', moneda: 'USD', base: 7600.00, iva: 0.00, total: 7600.00,
      recepcion: 'aprobado', respuesta: 'pendiente' },

    { numero: 'INV-71044', fecha: '2026-08-28', fechaEmision: '2026-08-27', tipo: 'Factura no comercial',
      emisorLatino: 'Ahmed Al Suwaidi Services', emisorArabe: 'أحمد السويدي للخدمات',
      trn: '—', moneda: 'AED', base: 520.00, iva: 0.00, total: 520.00,
      recepcion: 'aprobado', respuesta: 'pendiente' },

    { numero: 'INV-2026-31288', fecha: '2026-08-28', fechaEmision: '2026-08-26', tipo: 'Factura',
      emisorLatino: 'DP World Logistics', emisorArabe: 'موانئ دبي العالمية للخدمات اللوجستية',
      trn: '100505606700003', moneda: 'AED', base: 19750.00, iva: 987.50, total: 20737.50,
      recepcion: 'aprobado', respuesta: 'aprobado', respuestaSello: '2026-08-28 11:20' }
  ];

  /* --- Detalle del visor · un documento renderizado desde el XML --------- */
  var DETALLE = {
    'INV-2026-004871': {
      emisorLatino: 'GuruSoft Middle East FZ-LLC', emisorArabe: 'جوروسوفت الشرق الأوسط',
      emisorTrn: '100776655400003',
      direccionEmisor: 'Dubai Internet City, Building 12 · Dubai · Emiratos Árabes Unidos',
      direccionReceptor: 'Jebel Ali Free Zone, Warehouse 44 · Dubai · Emiratos Árabes Unidos',
      vencimiento: '2026-09-30', orden: 'PO-2026-11842',
      lineas: [
        { d: 'Licencia de plataforma eDoc · anualidad', c: 1,  p: 14000.00, iva: 5 },
        { d: 'Integración con ERP · horas de servicio', c: 20, p: 180.00,   iva: 5 },
        { d: 'Soporte preferente · trimestre',          c: 1,  p: 800.00,   iva: 5 }
      ]
    }
  };

  /* Los avisos que le llegan al usuario, con las tres palabras separadas a
     propósito. Nadie ha establecido todavía qué es cada una —arquitectura lo
     confirmó: «no hay un lenguaje establecido para cada una»—, así que aquí se
     usan con el sentido que se les da hoy, para poder mirarlos y decidir:

       alerta       le toca hacer algo al usuario
       notificacion ya pasó algo y conviene saberlo
       comunicado   lo anuncia GuruSoft, no va ligado a un documento suyo   */
  /* Cada aviso lleva su ciclo de vida, y eso es lo que de verdad separa los
     tres tipos —que era justo lo que estaba sin definir—:

       alerta        nace de una condición tuya y se va sola cuando esa
                     condición deja de ser cierta. NO se puede archivar: si se
                     dejara cerrar, alguien cerraría el aviso del vencimiento
                     de su licencia y se le pasaría la fecha. Por eso lleva
                     `seVa`, que dice qué hay que hacer para que desaparezca,
                     en lugar del aspa.
       notificacion  un hecho puntual y pasado, de tu cuenta. Se lee y se
                     archiva a mano.
       comunicado    va a todos los clientes, lo publica soporte y tiene fecha
                     de fin. Se archiva igual que una notificación.

     `texto` es para los largos: el desplegable mide 360 px y no es sitio para
     leer tres párrafos, así que el detalle se corta a dos líneas y el texto
     entero se abre aparte. Si un aviso trae `texto`, eso manda sobre `ir`: se
     abre el texto, no una pantalla. */
  var AVISOS = [
    { id: 'av-respuesta', tipo: 'alerta', leido: false, cuando: 'hace 2 horas', ir: 'recibidos.html',
      titulo: 'Dos documentos esperan tu respuesta',
      detalle: 'Emirates Global Aluminium y Al Ain Water Company llevan más de 24 horas sin responder.',
      seVa: 'Se quita sola en cuanto respondas a los dos.' },
    { id: 'av-licencia', tipo: 'alerta', leido: false, cuando: 'ayer', ir: 'admin-empresa.html',
      titulo: 'Tu licencia comercial vence en 21 días',
      detalle: 'Caduca el 30 de septiembre. Si no la renuevas, dejamos de poder emitir en tu nombre.',
      seVa: 'Se quita sola en cuanto subas la licencia renovada.' },
    /* `fijo` significa que además de la campana va en una franja arriba, a la
       vista en toda pantalla: un corte de servicio hay que verlo sin abrir
       nada. */
    { id: 'av-ventana', tipo: 'notificacion', leido: false, cuando: 'ayer', ir: '', fijo: true,
      titulo: 'Mantenimiento programado',
      detalle: 'El sábado 6 de septiembre, de 02:00 a 04:00, el portal no estará disponible.' },
    { id: 'av-inv882317', tipo: 'notificacion', leido: true, cuando: '2026-09-02', ir: 'emitidos.html',
      titulo: 'Un documento quedó fuera de la respuesta',
      detalle: 'INV-882317 no recibió respuesta de la plataforma receptora dentro del plazo.' },
    /* El caso de comunicación larga, que es el que no tenía sitio: cuatro
       párrafos que no caben en el desplegable. */
    { id: 'av-esquema21', tipo: 'comunicado', leido: true, cuando: '2026-08-12', ir: '',
      titulo: 'Nueva versión del esquema de factura',
      detalle: 'A partir del 1 de octubre entra en vigor la versión 2.1 del esquema. No tienes que ' +
               'hacer nada si emites desde el portal; si integras por API, hay dos campos nuevos.',
      hasta: '2026-10-31',
      texto:
        '<p>La Federal Tax Authority ha publicado la versión 2.1 del esquema de factura ' +
        'electrónica. Entra en vigor el <strong>1 de octubre de 2026</strong> y convive con la ' +
        'versión 2.0 hasta el 31 de diciembre.</p>' +
        '<p><strong>Si emites desde el portal, no tienes que hacer nada.</strong> Nosotros ' +
        'generamos el documento con la versión que corresponda en cada fecha.</p>' +
        '<p><strong>Si integras por API</strong>, la versión 2.1 añade dos campos en la cabecera ' +
        'del documento:</p>' +
        '<ul><li><strong>Modo de transporte</strong>, obligatorio solo en documentos de ' +
        'exportación.</li>' +
        '<li><strong>Referencia del contrato marco</strong>, opcional, hasta 50 caracteres.</li></ul>' +
        '<p>Los dos campos se aceptan desde hoy en el entorno de pruebas. A partir del 1 de octubre, ' +
        'un documento de exportación sin modo de transporte será rechazado por la autoridad con ' +
        'error de esquema.</p>' },
    { id: 'av-contrato', tipo: 'comunicado', leido: true, cuando: '2026-07-30', ir: '',
      titulo: 'Tu contrato de servicio se renueva el 30 de septiembre',
      detalle: 'Se renueva solo. Si quieres cambiar algo, habla con tu contacto comercial.',
      hasta: '2026-09-30' }
  ];

  /* Se distinguen por icono y por la palabra, no por color. El manual de marca
     reserva los colores de señalización para éxito, siguiente, advertencia y
     rechazo; «tipo de aviso» no es ninguna de esas cuatro cosas. */
  /* El estado del sistema. No es un aviso: es una condición que sigue siendo
     verdad mientras dura, y por eso no se puede cerrar ni se guarda en la
     campana. `activo` se enciende desde la propia pantalla de alertas para
     poder enseñarlo en la revisión. */
  var ESTADOS_SISTEMA = [
    { clave: 'mantenimiento', activo: false, senal: 'advertencia',
      titulo: 'Mantenimiento en curso',
      detalle: 'Estamos trabajando en el portal. Puedes consultar, pero las respuestas a documentos ' +
               'no se enviarán hasta que terminemos. Previsto hasta las 04:00.' },
    { clave: 'conexion', activo: false, senal: 'error',
      titulo: 'Sin conexión con la autoridad',
      detalle: 'No estamos recibiendo respuesta de la Federal Tax Authority. Lo que emitas queda en ' +
               'cola y sale solo en cuanto se restablezca. No hace falta que lo reintentes.' }
  ];

  /* Se distinguen por el icono y por la palabra. El icono va teñido, que es el
     patrón «Gris con color» del manual de marca: allí el icono se tiñe según lo
     que representa —ZIP naranja, XML azul, PDF rojo, XLS verde—. El rótulo se
     queda en gris; la pastilla de fondo de color no está en el manual. */
  var TIPOS_AVISO = {
    alerta:       { rotulo: 'Alerta',       icono: 'alerta',   matiz: 'alerta' },
    notificacion: { rotulo: 'Notificación', icono: 'info',     matiz: 'notificacion' },
    comunicado:   { rotulo: 'Comunicado',   icono: 'megafono', matiz: 'comunicado' }
  };

  return {
    CORNERS: CORNERS, RECHAZOS: RECHAZOS, ESTADOS: ESTADOS, TIPOS: TIPOS, MOTIVOS_RECHAZO: MOTIVOS_RECHAZO,
    EMITIDOS: EMITIDOS, RECIBIDOS: RECIBIDOS, DETALLE: DETALLE, dinero: d,
    AVISOS: AVISOS, TIPOS_AVISO: TIPOS_AVISO, ESTADOS_SISTEMA: ESTADOS_SISTEMA
  };
})();
