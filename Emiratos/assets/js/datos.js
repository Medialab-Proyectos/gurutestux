/* ==========================================================================
   eDoc Emiratos · datos de muestra
   Inventados para la maqueta. Nada sale de un entorno real: los portales se
   recorren sin escribir. Sirven para enseñar los cuatro estados, los tipos de
   documento de Emiratos y la regla del árabe.
   ========================================================================== */
window.EDOC = (function () {
  'use strict';

  /* Los cuatro corners. El código 2 significa «aprobado» para todas las
     entidades; por eso la columna no puede ser una sola. */
  var CORNERS = [
    { clave: 'C2', nombre: 'eDoc',                  quien: 'Plataforma emisora acreditada · nosotros' },
    { clave: 'C5', nombre: 'Autoridad',             quien: 'Federal Tax Authority · gobierno' },
    { clave: 'C3', nombre: 'Plataforma receptora',  quien: 'El ASP del comprador' },
    { clave: 'C4', nombre: 'Destinatario',          quien: 'El comprador · destinatario final' }
  ];

  /* Estado → cómo se pinta. Los colores son los de señalización del manual. */
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
      c2: 'aprobado', c5: 'aprobado', c3: 'aprobado', c4: 'aprobado' },

    { numero: 'INV-2026-004870', fecha: '2026-08-31', tipo: 'Factura',
      receptorLatino: 'Emirates Steel Arkan PJSC', receptorArabe: 'الإمارات للحديد والصلب أركان',
      trn: '100987654300003', moneda: 'AED', base: 6250.00, iva: 312.50, total: 6562.50,
      c2: 'aprobado', c5: 'aprobado', c3: 'aprobado', c4: 'acuse' },

    { numero: 'INV-2026-004869', fecha: '2026-08-30', tipo: 'Nota de crédito',
      receptorLatino: 'Gulf Marine Services', receptorArabe: 'خدمات الخليج البحرية',
      trn: '100445566700003', moneda: 'AED', base: -1200.00, iva: -60.00, total: -1260.00,
      c2: 'aprobado', c5: 'aprobado', c3: 'aprobado', c4: 'pendiente' },

    { numero: 'INV-2026-004868', fecha: '2026-08-30', tipo: 'Factura',
      receptorLatino: 'Dubai Investments PJSC', receptorArabe: 'دبي للاستثمار ش.م.ع',
      trn: '100112233400003', moneda: 'AED', base: 43900.00, iva: 2195.00, total: 46095.00,
      c2: 'aprobado', c5: 'aprobado', c3: 'aprobado', c4: 'rechazado',
      motivoC4: 'RE-02 · El importe no coincide con lo pactado' },

    { numero: 'INV-2026-004867', fecha: '2026-08-29', tipo: 'Factura de exportación',
      receptorLatino: 'Qatar Fuel Company', receptorArabe: 'شركة قطر للوقود',
      trn: '100778899100003', moneda: 'USD', base: 12750.00, iva: 0.00, total: 12750.00,
      c2: 'aprobado', c5: 'aprobado', c3: 'entregado', c4: 'pendiente' },

    { numero: 'INV-2026-004866', fecha: '2026-08-29', tipo: 'Factura',
      receptorLatino: 'Sharjah Cement Factory', receptorArabe: 'مصنع الشارقة للإسمنت',
      trn: '100556677800003', moneda: 'AED', base: 9800.00, iva: 490.00, total: 10290.00,
      c2: 'aprobado', c5: 'rechazado', c3: 'noaplica', c4: 'noaplica',
      motivoC5: 'Falta el número de registro fiscal del receptor · dato obligatorio' },

    { numero: 'INV-2026-004865', fecha: '2026-08-28', tipo: 'Autofactura',
      receptorLatino: 'Ras Al Khaimah Ceramics', receptorArabe: 'رأس الخيمة للسيراميك',
      trn: '100334455600003', moneda: 'AED', base: 3150.00, iva: 157.50, total: 3307.50,
      c2: 'aprobado', c5: 'aprobado', c3: 'rechazado', c4: 'noaplica',
      motivoC3: 'La firma del sobre de transmisión no valida · error técnico' },

    { numero: 'INV-2026-004864', fecha: '2026-08-28', tipo: 'Factura no comercial',
      receptorLatino: 'Mohammed Bin Saeed Trading', receptorArabe: 'محمد بن سعيد للتجارة',
      trn: '—', moneda: 'AED', base: 740.00, iva: 0.00, total: 740.00,
      c2: 'aprobado', c5: 'aprobado', c3: 'entregado', c4: 'pendiente' },

    { numero: 'INV-2026-004863', fecha: '2026-08-27', tipo: 'Factura',
      receptorLatino: 'Abu Dhabi Ports Company', receptorArabe: 'شركة موانئ أبوظبي',
      trn: '100223344500003', moneda: 'AED', base: 27500.00, iva: 1375.00, total: 28875.00,
      c2: 'aprobado', c5: 'enviado', c3: 'pendiente', c4: 'pendiente' },

    { numero: 'INV-2026-004862', fecha: '2026-08-27', tipo: 'Factura',
      receptorLatino: 'Etihad Rail PJSC', receptorArabe: 'الاتحاد للقطارات ش.م.ع',
      trn: '100667788900003', moneda: 'AED', base: 15200.00, iva: 760.00, total: 15960.00,
      c2: 'rechazado', c5: 'noaplica', c3: 'noaplica', c4: 'noaplica',
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

  return {
    CORNERS: CORNERS, ESTADOS: ESTADOS, TIPOS: TIPOS, MOTIVOS_RECHAZO: MOTIVOS_RECHAZO,
    EMITIDOS: EMITIDOS, RECIBIDOS: RECIBIDOS, DETALLE: DETALLE, dinero: d
  };
})();
