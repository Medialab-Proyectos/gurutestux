/* ==========================================================================
   eDoc Emiratos · armazón compartido de la maqueta
   Inyecta encabezado, menú y pie para que las quince vistas no se separen.
   La jerarquía del menú es la de la hoja «Menú Emiratos» del mapa, con los
   nombres reales del menú. Nada de descripciones inventadas.
   ========================================================================== */
(function () {
  'use strict';

  /* --- Iconos · trazo simple, sin relleno · BrandBook p.43 --------------- */
  var ICONOS = {
    inicio:   '<path d="M3 9.5 10 3l7 6.5V17a1 1 0 0 1-1 1h-3.5v-5h-5v5H4a1 1 0 0 1-1-1z"/>',
    admin:    '<circle cx="10" cy="6.2" r="3"/><path d="M3.6 17c0-3.2 2.9-5.2 6.4-5.2s6.4 2 6.4 5.2"/>',
    emision:  '<path d="M5 2.5h7l3.5 3.5v11.5H5z"/><path d="M12 2.5V6h3.5"/><path d="M7.6 10h4.8M7.6 13h4.8"/>',
    recepcion:'<path d="M2.8 10.5h4l1.2 2.2h4l1.2-2.2h4"/><path d="M4.6 4.2h10.8l1.8 6.3V16a1 1 0 0 1-1 1H3.8a1 1 0 0 1-1-1v-5.5z"/>',
    buscar:   '<circle cx="8.6" cy="8.6" r="5.4"/><path d="m12.6 12.6 4 4"/>',
    ver:      '<path d="M1.8 10S4.7 4.6 10 4.6 18.2 10 18.2 10 15.3 15.4 10 15.4 1.8 10 1.8 10Z"/><circle cx="10" cy="10" r="2.5"/>',
    /* «Ver estados» es el recorrido del documento en el tiempo: un reloj se lee
       a 15 px, tres círculos en fila no. */
    estados:  '<circle cx="10" cy="10" r="7.2"/><path d="M10 5.6V10l3 1.9"/>',
    xml:      '<path d="M5 2.5h7L15.5 6v11.5H5z"/><path d="M12 2.5V6h3.5"/><path d="m8.6 9.6-1.7 2 1.7 2M11.4 9.6l1.7 2-1.7 2"/>',
    pdf:      '<path d="M5 2.5h7L15.5 6v11.5H5z"/><path d="M12 2.5V6h3.5"/><path d="M7.4 13.4c2.6-1 4-4.6 3.2-5.4-.9-.9-1.9 2.6.6 4.3 1 .7 2.2 1 3.1.9"/>',
    xls:      '<path d="M5 2.5h7L15.5 6v11.5H5z"/><path d="M12 2.5V6h3.5"/><path d="m8 9.8 3.4 4M11.4 9.8 8 13.8"/>',
    descargar:'<path d="M10 3v9"/><path d="m6.4 8.6 3.6 3.6 3.6-3.6"/><path d="M3.6 15.4h12.8"/>',
    aprobar:  '<circle cx="10" cy="10" r="7.2"/><path d="m6.6 10.2 2.3 2.3 4.5-4.7"/>',
    rechazar: '<circle cx="10" cy="10" r="7.2"/><path d="m7.3 7.3 5.4 5.4M12.7 7.3l-5.4 5.4"/>',
    acuse:    '<path d="M3 5.4h14v9.2H3z"/><path d="m3 5.9 7 4.6 7-4.6"/>',
    soporte:  '<circle cx="10" cy="10" r="7.2"/><path d="M8 8.1a2.1 2.1 0 1 1 2.9 1.9c-.6.3-.9.8-.9 1.4v.4"/><path d="M10 14.6h.01"/>',
    pais:     '<circle cx="10" cy="10" r="7.2"/><path d="M2.9 10h14.2"/><path d="M10 2.8c1.9 2 2.9 4.5 2.9 7.2s-1 5.2-2.9 7.2c-1.9-2-2.9-4.5-2.9-7.2S8.1 4.8 10 2.8Z"/>',
    /* «Nombre nativo» no es el idioma del portal: es ver el nombre del emisor
       tal como llega. Lleva icono propio —una A latina junto a una letra
       árabe— porque antes compartía dibujo con el selector de idioma y en la
       barra parecían el mismo botón repetido. */
    alfabeto: '<path d="m2.6 14.4 3.3-8.8 3.3 8.8"/><path d="M3.9 11.6h4"/>' +
              '<path d="M12 9.4v1.9c0 1.7 1 2.7 2.6 2.7h2.8"/><path d="M14.2 16.4h.01"/>',
    idioma:   '<path d="M2.8 5.6h8.4"/><path d="M7 3.4v2.2"/><path d="M9.1 5.6c0 3.2-2.5 6-6.3 7.1"/><path d="M5 9.2c1 1.7 2.7 3 4.6 3.5"/><path d="m10.8 16.6 3.2-8 3.2 8"/><path d="M11.9 14.2h4.2"/>',
    salir:    '<path d="M12.4 5.6V4a1 1 0 0 0-1-1H4.4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-1.6"/><path d="M8.6 10h8"/><path d="m14 7.4 2.6 2.6L14 12.6"/>',
    filtro:   '<path d="M3 4.6h14l-5.4 6.2v4.9l-3.2 1.7v-6.6z"/>',
    limpiar:  '<path d="M4 4.8h12"/><path d="M6.4 4.8V3.4a1 1 0 0 1 1-1h5.2a1 1 0 0 1 1 1v1.4"/><path d="M5.6 4.8 6.4 17a1 1 0 0 0 1 .9h5.2a1 1 0 0 0 1-.9l.8-12.2"/>',
    info:     '<circle cx="10" cy="10" r="7.4"/><path d="M10 9v4.6"/><path d="M10 6.6h.01"/>',
    alerta:   '<path d="M10 2.9 18 16.8H2z"/><path d="M10 8v3.4"/><path d="M10 14h.01"/>',
    candado:  '<rect x="4" y="8.6" width="12" height="8.4" rx="1.2"/><path d="M6.8 8.6V6.4a3.2 3.2 0 0 1 6.4 0v2.2"/>',
    llave:    '<circle cx="6.6" cy="10" r="3.4"/><path d="M10 10h7"/><path d="M14.4 10v2.8M16.4 10v2"/>',
    empresa:  '<path d="M3.4 17V4.2a1 1 0 0 1 1-1h6.2a1 1 0 0 1 1 1V17"/><path d="M11.6 8.4h4a1 1 0 0 1 1 1V17"/><path d="M2.4 17h15.2"/><path d="M5.8 6.4h3.4M5.8 9.4h3.4M5.8 12.4h3.4"/>',
    libro:    '<path d="M3.2 4.4c2.4-.9 4.6-.9 6.8.5 2.2-1.4 4.4-1.4 6.8-.5v10.7c-2.4-.9-4.6-.9-6.8.5-2.2-1.4-4.4-1.4-6.8-.5z"/><path d="M10 4.9v10.7"/>',
    megafono: '<path d="M3.4 8.2h2.8l6.4-3.6v10.8L6.2 11.8H3.4z"/><path d="M15.4 7.6a3.4 3.4 0 0 1 0 4.8"/>',
    reenviar: '<path d="M3 5.4h14v9.2H3z"/><path d="m3 5.9 7 4.6 7-4.6"/><path d="m13.6 13.4 2.4 2.4-2.4 2.4"/>',
    mas:      '<path d="M10 4.4v11.2M4.4 10h11.2"/>',
    /* Los tres puntos van rellenos: el resto de iconos se dibuja con
       fill="none", y así estos salían como tres anillos de un pixel que a 15 px
       no se veían. El botón parecía vacío. */
    puntos:   '<circle cx="10" cy="4.6" r="1.5" fill="currentColor" stroke="none"/>' +
              '<circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none"/>' +
              '<circle cx="10" cy="15.4" r="1.5" fill="currentColor" stroke="none"/>',
    /* El ambiente se identifica con un icono de servidor: es el lenguaje
       universal para «en qué máquina estoy», sin tener que leer «entorno». */
    servidor: '<rect x="3" y="3.6" width="14" height="5" rx="1"/><rect x="3" y="11.4" width="14" height="5" rx="1"/>' +
              '<path d="M6 6.1h.01M6 13.9h.01"/>',
    perfil:   '<circle cx="10" cy="6.6" r="3.1"/><path d="M4.2 16.6c0-2.9 2.6-4.7 5.8-4.7s5.8 1.8 5.8 4.7"/>',
    campana:  '<path d="M15.4 13.4V9a5.4 5.4 0 1 0-10.8 0v4.4L3.2 15.4h13.6z"/>' +
              '<path d="M8.2 15.4a1.8 1.8 0 0 0 3.6 0"/>'
  };

  /* La bandera va con sus colores, no con el trazo de los demás iconos, y
     recortada en círculo como en el portal de Francia. */
  function bandera() {
    return '<span class="edoc-bandera">' +
      '<svg viewBox="0 0 21 14" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<rect x="0" y="0" width="7" height="14" fill="#CE1126"/>' +
      '<rect x="7" y="0" width="14" height="4.67" fill="#00843D"/>' +
      '<rect x="7" y="4.67" width="14" height="4.66" fill="#ffffff"/>' +
      '<rect x="7" y="9.33" width="14" height="4.67" fill="#000000"/>' +
      '</svg></span>';
  }

  function icono(nombre, clase) {
    var d = ICONOS[nombre] || '';
    return '<svg class="' + (clase || '') + '" viewBox="0 0 20 20" fill="none" stroke="currentColor" ' +
           'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }
  window.edocIcono = icono;

  /* --- Jerarquía del menú · hoja «Menú Emiratos» ------------------------- */
  /* El árbol del MVP, tal como quedó en «MVP_Portal_y_APIs.xlsx». Los rótulos
     son los de ese documento, no los míos: si comercial lee «Actualización
     Datos empresas» y en el portal dice «Mi empresa», la pregunta es si son
     dos cosas.

     Lo que no entra ya no se llama «posterior» sino por su fase, porque eso es
     justo lo que comercial pregunta: «no me comprometo a hacer cosas que puedo
     hacer la siguiente semana o el siguiente mes». Se deja a la vista, en
     gris, para no tenderle una trampa a quien tiene clientes esperando. */
  var MENU = [
    { id: 'inicio', rotulo: 'Inicio', icono: 'inicio', url: 'inicio.html' },
    { id: 'administracion', rotulo: 'Administración', icono: 'admin', grupos: [
        { enlaces: [ { rotulo: 'Cambiar Contraseña', url: 'admin-clave.html' } ] },
        { titulo: 'Roles y Usuarios', enlaces: [
            { rotulo: 'Roles', url: 'admin-roles.html' },
            { rotulo: 'Usuarios', url: 'admin-usuarios.html' } ] },
        { titulo: 'Actualización Datos empresas', enlaces: [
            { rotulo: 'Actualización de identificación fiscal', url: 'admin-empresa.html' },
            { rotulo: 'Actualización de contactos', url: 'admin-contactos.html' } ] },
        { enlaces: [
            { rotulo: 'Credenciales de consumo Servicio eDoc', url: 'admin-credenciales.html' },
            { rotulo: 'Alertas y comunicados', url: 'admin-alertas.html' },
            { rotulo: 'Manuales', url: 'admin-manuales.html' } ] }
      ] },
    { id: 'emision', rotulo: 'Emisión', icono: 'emision', grupos: [
        { titulo: 'Reportes', enlaces: [
            { rotulo: 'Documentos Emitidos', url: 'emitidos.html' },
            { rotulo: 'Documentos por criterios', fase: 3 } ] }
      ] },
    { id: 'recepcion', rotulo: 'Recepción', icono: 'recepcion', grupos: [
        { titulo: 'Reportes', enlaces: [ { rotulo: 'Documentos Recibidos', url: 'recibidos.html' } ] },
        // Ubicación decidida en la revisión: traer un documento de fuera hacia
        // dentro es importar, no un reporte.
        { titulo: 'Importar', enlaces: [ { rotulo: 'Cargar XML', fase: 2 } ] },
        { titulo: 'Workflow Aprobación', enlaces: [ { rotulo: 'Gestión proveedores', fase: 3 } ] }
      ] }
  ];

  /* El panel de alcance decide si la herramienta de revisión está disponible.
     Si lo está, el botón aparece en la barra superior y desde ahí se encienden
     y apagan las notas. Si no, no hay botón ni notas. */
  function herramientaNotas() {
    try { return window.localStorage.getItem('edoc-notas-herramienta') === '1'; }
    catch (error) { return false; }
  }

  function habilitada(archivo) {
    return !window.EDOC_ALCANCE || window.EDOC_ALCANCE.estaHabilitada(archivo);
  }

  /* Lo que ve quien entra a una pantalla que está en el alcance pero no en la
     entrega de hoy. No es un error: es el mapa, con esa parada todavía cerrada. */
  function pantallaEnObra(rotulo) {
    return '' +
    '<div class="edoc-obra">' +
      '<div class="edoc-obra__tarjeta">' +
        '<div class="edoc-obra__marca">' + icono('emision') + '</div>' +
        '<h1 class="edoc-obra__titulo">En construcción</h1>' +
        '<p class="edoc-obra__rotulo">' + (rotulo || 'Esta pantalla') + '</p>' +
        '<p class="edoc-obra__texto">Está dentro del alcance del portal y su sitio en el menú ya está' +
        ' decidido, pero <strong>no entra en el MVP</strong>. Lo que se entrega es lo que recoge el' +
        ' documento de MVP del portal y las APIs; lo demás se diseña igual, para que se vea el alcance' +
        ' completo, y se enciende cuando le toque su fase.</p>' +
        '<div class="edoc-obra__botones">' +
          '<a class="btn btn-edoc-primario" href="inicio.html">Volver al inicio</a>' +
          '<a class="btn btn-edoc-secundario" href="emitidos.html">Ir a Documentos Emitidos</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* La campana se pinta desde los datos, no a mano: así el contador de sin
     leer no puede desmentir a la lista, y las tres palabras se ven separadas.
     Enseña los tres más recientes; el resto, en «Ver todas». */
  /* Que se ha leido y que se ha archivado. Va en sessionStorage a proposito:
     cada persona que abre la maqueta tiene que ver el punto rojo la primera
     vez. Si fuera localStorage, el segundo evaluador que entrara en el mismo
     equipo ya no veria nunca que habia avisos. */
  /* «anotar», no «marcar»: mas abajo ya hay un marcar(boton, activo) para los
     interruptores del encabezado, y como las declaraciones se izan, la ultima
     gana y se comia a esta. */
  var LLAVE_LEIDOS = 'edoc-avisos-leidos';
  var LLAVE_ARCHIVADOS = 'edoc-avisos-archivados';

  function anotados(llave) {
    try { return JSON.parse(window.sessionStorage.getItem(llave)) || []; }
    catch (error) { return []; }
  }

  function anotar(llave, ids) {
    var lista = anotados(llave);
    ids.forEach(function (id) { if (lista.indexOf(id) < 0) lista.push(id); });
    try { window.sessionStorage.setItem(llave, JSON.stringify(lista)); } catch (error) { /* nada */ }
  }

  /* Los avisos que siguen vivos: los archivados desaparecen, y los leidos se
     marcan sin tocar el original -`leido` en datos.js es el estado de partida,
     no un sitio donde escribir-. */
  function avisosVivos() {
    var sim = window.EDOC_SIMULACRO;
    if (sim && !sim.hayAvisos) return [];
    var fuera = anotados(LLAVE_ARCHIVADOS);
    var vistos = anotados(LLAVE_LEIDOS);
    var hoy = new Date().toISOString().slice(0, 10);
    return ((window.EDOC && window.EDOC.AVISOS) || [])
      .filter(function (a) { return fuera.indexOf(a.id) < 0; })
      /* La vigencia se cumple sola: un comunicado con la fecha pasada se retira
         sin que nadie lo archive. Es lo que hace que `hasta` sea una fecha de
         verdad y no un adorno en el visor. */
      .filter(function (a) { return !a.hasta || a.hasta >= hoy; })
      .map(function (a) {
        var copia = {};
        Object.keys(a).forEach(function (k) { copia[k] = a[k]; });
        copia.leido = a.leido || vistos.indexOf(a.id) >= 0;
        return copia;
      });
  }

  function renglon(a) {
    var tipos = (window.EDOC && window.EDOC.TIPOS_AVISO) || {};
    var t = tipos[a.tipo] || { rotulo: a.tipo, icono: 'info', matiz: 'notificacion' };
    var largo = !!a.texto;

    var dentro =
      '<span class="edoc-aviso-tipo edoc-aviso-tipo--' + t.matiz + '">' +
        icono(t.icono) + t.rotulo + '</span>' +
      '<span class="edoc-notificacion__titulo">' + a.titulo + '</span>' +
      '<span class="edoc-notificacion__detalle">' + a.detalle + '</span>' +
      '<span class="edoc-notificacion__sello">' + a.cuando + '</span>' +
      /* La alerta no se archiva, así que en el sitio del aspa va lo que hay
         que hacer para que se vaya. Sin esto, «no puedo quitarla» se lee como
         un fallo. */
      (a.seVa ? '<span class="edoc-notificacion__solo">' + a.seVa + '</span>' : '') +
      (largo ? '<button type="button" class="edoc-notificacion__leer" data-leer="' + a.id + '">' +
        'Leer el comunicado entero</button>' : '');

    /* Solo es enlace lo que de verdad lleva a alguna parte, y el texto largo
       manda sobre el enlace: si el aviso trae su propio texto, el renglón abre
       el texto y no una pantalla. Un comunicado no se disfraza de enlace -antes
       caían todos en «Alertas y comunicados», que es un formulario de correos-. */
    var cuerpo = (a.ir && !largo)
      ? '<a class="dropdown-item edoc-notificacion__cuerpo" href="' + a.ir + '">' + dentro + '</a>'
      : '<span class="dropdown-item-text edoc-notificacion__cuerpo">' + dentro + '</span>';

    /* El aspa archiva. No la llevan las alertas: una alerta se va cuando deja
       de ser verdad, no cuando a alguien le molesta. */
    var aspa = (a.tipo === 'alerta') ? '' :
      '<button type="button" class="edoc-notificacion__x" data-archivar="' + a.id + '" ' +
        'title="Archivar" aria-label="Archivar: ' + a.titulo + '">&times;</button>';

    return '<li class="edoc-notificacion' + (a.leido ? '' : ' edoc-notificacion--nueva') + '" ' +
      'data-aviso="' + a.id + '">' + cuerpo + aspa + '</li>';
  }

  function campana() {
    var avisos = avisosVivos();
    var sinLeer = avisos.filter(function (a) { return !a.leido; }).length;

    var lista = avisos.length
      ? avisos.map(renglon).join('') +
        '<li><hr class="dropdown-divider"></li>' +
        '<li><span class="dropdown-item-text edoc-notificaciones__pie">' +
          'Esos son todos · ' + avisos.length + '</span></li>'
      : '<li><span class="dropdown-item-text edoc-secundario edoc-notificaciones__vacio">' +
          'No te queda ningún aviso.</span></li>';

    return '<div class="dropdown" id="edoc-campana-caja">' +
      '<button type="button" class="edoc-btn-util edoc-btn-util--icono edoc-campana" ' +
        'data-toggle="dropdown" title="Notificaciones" ' +
        'aria-label="Notificaciones · ' + (sinLeer ? sinLeer + ' sin leer' : 'ninguna sin leer') + '">' +
        icono('campana') +
        (sinLeer ? '<span class="edoc-campana__punto">' + sinLeer + '</span>' : '') +
      '</button>' +
      '<ul class="dropdown-menu dropdown-menu-right edoc-notificaciones">' +
        '<li><h6 class="dropdown-header">Notificaciones</h6></li>' +
        lista +
      '</ul>' +
    '</div>';
  }

  /* El visor del texto largo. Se monta una sola vez y se rellena al abrirlo. */
  function visorAviso() {
    if (document.getElementById('modal-aviso')) return;
    document.body.insertAdjacentHTML('beforeend',
      '<div class="modal fade" id="modal-aviso" tabindex="-1" role="dialog" ' +
        'aria-labelledby="titulo-aviso" aria-hidden="true">' +
        '<div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">' +
          '<div class="modal-content">' +
            '<div class="modal-header">' +
              '<h5 class="modal-title" id="titulo-aviso">Comunicado</h5>' +
              '<button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">' +
                '<span aria-hidden="true">&times;</span></button>' +
            '</div>' +
            '<div class="modal-body" id="cuerpo-aviso"></div>' +
            '<div class="modal-footer">' +
              '<button type="button" class="btn btn-edoc-terciario" data-dismiss="modal">Cerrar</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>');
  }

  /* Los tres gestos de la campana. */
  function cablearCampana() {
    var caja = document.getElementById('edoc-campana-caja');
    if (!caja) return;

    /* Abrir la campana marca todo como leido: el contador se va y no vuelve.
       Pero el resalte de «nuevo» se queda mientras el desplegable esta abierto
       -si se quitara al abrir, nadie llegaria a ver cuales eran los nuevos- y
       se retira al cerrarlo. Leido no es lo mismo que hecho: no se borra nada. */
    if (window.jQuery) {
      window.jQuery(caja)
        .on('shown.bs.dropdown', function () {
          anotar(LLAVE_LEIDOS, avisosVivos().map(function (a) { return a.id; }));
          var punto = caja.querySelector('.edoc-campana__punto');
          if (punto) punto.remove();
          var boton = caja.querySelector('.edoc-campana');
          if (boton) boton.setAttribute('aria-label', 'Notificaciones · ninguna sin leer');
        })
        .on('hidden.bs.dropdown', function () {
          caja.querySelectorAll('.edoc-notificacion--nueva').forEach(function (li) {
            li.classList.remove('edoc-notificacion--nueva');
          });
        });
    }

    caja.addEventListener('click', function (e) {
      var x = e.target.closest('[data-archivar]');
      if (x) {
        // Sin esto, Bootstrap cierra el desplegable en cuanto se archiva uno y
        // hay que volver a abrirlo para archivar el siguiente.
        e.preventDefault();
        e.stopPropagation();
        archivarAviso(caja, x.dataset.archivar);
        return;
      }
      var leer = e.target.closest('[data-leer]');
      if (!leer) return;
      e.preventDefault();
      e.stopPropagation();
      abrirAviso(leer.dataset.leer);
    });
  }

  function archivarAviso(caja, id) {
    var aviso = avisosVivos().filter(function (a) { return a.id === id; })[0];
    anotar(LLAVE_ARCHIVADOS, [id]);
    var li = caja.querySelector('[data-aviso="' + id + '"]');
    if (li) li.remove();

    var quedan = avisosVivos();
    var pie = caja.querySelector('.edoc-notificaciones__pie');
    if (quedan.length && pie) {
      pie.textContent = 'Esos son todos · ' + quedan.length;
    } else if (!quedan.length) {
      var menu = caja.querySelector('.edoc-notificaciones');
      if (menu) {
        menu.innerHTML = '<li><h6 class="dropdown-header">Notificaciones</h6></li>' +
          '<li><span class="dropdown-item-text edoc-secundario edoc-notificaciones__vacio">' +
          'No te queda ningún aviso.</span></li>';
      }
    }
    if (aviso) avisar('Archivado: <strong>' + aviso.titulo + '</strong>.');
  }

  function abrirAviso(id) {
    var aviso = avisosVivos().filter(function (a) { return a.id === id; })[0];
    if (!aviso || !window.jQuery) return;
    visorAviso();
    document.getElementById('titulo-aviso').textContent = aviso.titulo;
    document.getElementById('cuerpo-aviso').innerHTML =
      '<p class="edoc-secundario mb-3">' + aviso.cuando +
      (aviso.hasta ? ' · se retira el ' + aviso.hasta : '') + '</p>' + aviso.texto;
    window.jQuery('#modal-aviso').modal('show');
  }

  /* El estado del sistema. Va encima de todo, no se puede cerrar y no entra en
     la campana: mientras el mantenimiento esté en curso o la conexión caída,
     esconderlo sería ocultar algo que sigue siendo verdad. Los dos colores que
     usa —advertencia y error— son los que el manual de marca reserva justo
     para eso. */
  function barraEstado() {
    /* El marcado vive en simulacro.js, que lo carga toda pantalla incluida la
       del acceso, donde este armazon no existe. Aqui solo se coloca en su
       sitio: debajo del encabezado. */
    var sim = window.EDOC_SIMULACRO;
    return (sim && sim.barraHTML) ? sim.barraHTML() : '';
  }

  /* Los avisos que hay que ver sin abrir nada: un corte de servicio, un
     cambio que afecta a todo el mundo. Van en una franja arriba de la página,
     en toda pantalla. Lleva el naranja de ADVERTENCIA, que es lo que el manual
     de marca reserva justo para esto. Se puede cerrar, y vuelve en la sesión
     siguiente: no es un aviso que convenga perder para siempre. */
  function franjaFija() {
    var sim = window.EDOC_SIMULACRO;
    if (sim && !sim.hayAvisos) return '';
    var avisos = (window.EDOC && window.EDOC.AVISOS) || [];
    var fijos = avisos.filter(function (a) { return a.fijo; });
    if (!fijos.length) return '';
    return fijos.map(function (a, i) {
      var llave = 'edoc-franja-' + i;
      var cerrada = false;
      try { cerrada = window.sessionStorage.getItem(llave) === '1'; } catch (e) { cerrada = false; }
      if (cerrada) return '';
      return '<div class="edoc-franja" role="status" data-franja="' + llave + '">' +
        '<span class="edoc-franja__icono">' + icono('alerta') + '</span>' +
        '<span class="edoc-franja__texto"><strong>' + a.titulo + '</strong> ' + a.detalle + '</span>' +
        '<button type="button" class="edoc-franja__cerrar" data-cerrar-franja="' + llave + '" ' +
          'aria-label="Cerrar este aviso">&times;</button>' +
      '</div>';
    }).join('');
  }

  /* Lo que ve quien entra a una función que está caída por el mantenimiento.
     Se diferencia de «En construcción» a propósito: aquello no existe todavía,
     esto existe y vuelve solo. */
  function pantallaMantenimiento(motivo, hasta) {
    return '' +
    '<div class="edoc-obra">' +
      '<div class="edoc-obra__tarjeta">' +
        '<div class="edoc-obra__marca edoc-obra__marca--mantenimiento">' + icono('alerta') + '</div>' +
        '<h1 class="edoc-obra__titulo">Esta función está en mantenimiento</h1>' +
        '<p class="edoc-obra__rotulo">Vuelve sola ' + hasta + '</p>' +
        '<p class="edoc-obra__texto">' + motivo + ' No hace falta que hagas nada: en cuanto termine, ' +
        'esta pantalla vuelve a funcionar. El resto del portal sigue disponible.</p>' +
        '<div class="edoc-obra__botones">' +
          '<a class="btn btn-edoc-primario" href="inicio.html">Volver al inicio</a>' +
          '<a class="btn btn-edoc-secundario" href="#" data-sin-destino>Escribir a soporte</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* --- Encabezado reducido -----------------------------------------------
     Para lo que vive fuera de la sesión del cliente: el registro de la empresa
     y la bandeja del Office Manager. No lleva el menú del portal ni la
     identidad de un usuario cliente, porque ahí no hay ninguno.            */
  function encabezadoReducido(quien) {
    var ambiente = cuerpoDato('ambiente', 'QA');
    return '' +
    '<header class="edoc-encabezado">' +
      '<div class="edoc-contexto">' +
        '<span class="edoc-ambiente edoc-ambiente--' + ambiente.toLowerCase() + '" ' +
          'title="Estás conectado al ambiente de ' + ambiente + '">' +
          icono('servidor') + '<span>' + rotuloAmbiente(ambiente) + '</span></span>' +
        (quien ? '<span class="edoc-empresa"><span class="edoc-empresa__textos">' +
                 '<span class="edoc-empresa__nombre">' + quien + '</span></span></span>' : '') +
      '</div>' +
      '<a class="edoc-encabezado__marca" href="index.html" aria-label="eDoc">' +
        '<img src="assets/img/edoc-logo-neg-compacto.svg" alt="eDoc · Facturación Electrónica">' +
      '</a>' +
      '<div class="edoc-encabezado__util">' +
        '<button type="button" class="edoc-btn-util" data-alterna-arabe title="Muestra el nombre de la empresa tal como llega, en árabe">' +
          icono('alfabeto') + '<span class="edoc-btn-util__texto">Nombre nativo</span></button>' +
        (herramientaNotas()
          ? '<button type="button" class="edoc-btn-util" data-alterna-notas ' +
            'title="Muestra las decisiones de la reunión sobre cada bloque">' +
            icono('info') + '<span class="edoc-btn-util__texto">Notas de diseño</span></button>'
          : '') +
        '<a class="edoc-btn-util" href="index.html" title="Volver al acceso">' + icono('salir') + '</a>' +
      '</div>' +
    '</header>';
  }

  /* --- Encabezado ---------------------------------------------------------
     Izquierda: información de contexto —en qué ambiente estoy, con qué empresa
     y con qué usuario—. Derecha: herramientas. Centro: la marca.
     Es el reparto que se acordó y el que ya sigue el portal de Francia.      */
  function encabezado() {
    var empresa = cuerpoDato('empresa', 'Al Noor Trading LLC');
    var usuario = cuerpoDato('usuario', 'Fatima Al Marzooqi');
    var ambiente = cuerpoDato('ambiente', 'QA');
    return '' +
    '<header class="edoc-encabezado">' +
      '<div class="edoc-contexto">' +
        '<span class="edoc-ambiente edoc-ambiente--' + ambiente.toLowerCase() + '" ' +
          'title="Estás conectado al ambiente de ' + ambiente + '">' +
          icono('servidor') + '<span>' + rotuloAmbiente(ambiente) + '</span></span>' +
        '<span class="edoc-empresa" title="' + empresa + ' · ' + usuario + '">' +
          icono('empresa') +
          '<span class="edoc-empresa__textos">' +
            '<span class="edoc-empresa__nombre">' + empresa + '</span>' +
            '<span class="edoc-empresa__usuario">' + icono('perfil') + usuario + '</span>' +
          '</span>' +
        '</span>' +
        '<span class="edoc-encabezado__separador"></span>' +
      '</div>' +

      '<a class="edoc-encabezado__marca" href="inicio.html" aria-label="eDoc · inicio">' +
        '<img src="assets/img/edoc-logo-neg-compacto.svg" alt="eDoc · Facturación Electrónica">' +
      '</a>' +

      '<div class="edoc-encabezado__util">' +
        '<button type="button" class="edoc-btn-util" data-alterna-arabe ' +
          'title="Muestra el nombre del emisor y del receptor tal como llega, en árabe">' +
          icono('alfabeto') + '<span class="edoc-btn-util__texto">Nombre nativo</span></button>' +
        (herramientaNotas()
          ? '<button type="button" class="edoc-btn-util" data-alterna-notas ' +
            'title="Muestra las decisiones de la reunión sobre cada bloque">' +
            icono('info') + '<span class="edoc-btn-util__texto">Notas de diseño</span></button>'
          : '') +
        '<span class="edoc-encabezado__separador"></span>' +
        // El mismo selector que se ve al entrar: misma lista, mismo código, y lo
        // que elijas en el acceso es lo que aparece aquí.
        '<span class="edoc-solo-ancho">' + window.edocSelectorIdioma() + '</span>' +
        '<a class="edoc-btn-util edoc-btn-util--icono edoc-solo-ancho" href="#" data-sin-destino ' +
          'title="Emiratos Árabes Unidos · cambiar de portal">' + bandera() + '</a>' +
        campana() +
        // El soporte lleva a la wiki de eDoc: es el destino de ayuda que existe.
        '<a class="edoc-btn-util edoc-btn-util--icono edoc-solo-ancho" href="https://wikiedoc.guru-soft.com/" ' +
          'target="_blank" rel="noopener" title="Acceso al soporte">' + icono('soporte') + '</a>' +
        '<div class="dropdown">' +
          '<button type="button" class="edoc-usuario" data-toggle="dropdown" ' +
            'title="' + usuario + '" aria-label="Menú de la cuenta de ' + usuario + '">' +
            '<span class="edoc-usuario__avatar" data-iniciales="' + iniciales(usuario) + '">' +
              // Una fotografía, no un dibujo: es lo que se pidió en la revisión.
              // El origen y la licencia están en assets/img/CREDITOS.md.
              '<img src="assets/img/avatar.jpg" alt="" width="34" height="34">' +
            '</span>' +
          '</button>' +
          '<ul class="dropdown-menu dropdown-menu-right">' +
            '<li><h6 class="dropdown-header">' + usuario + '</h6></li>' +
            '<li><a class="dropdown-item" href="admin-clave.html">' + icono('perfil') + 'Cambiar Contraseña</a></li>' +
            // En pantallas estrechas las herramientas del portal no caben en la
            // barra y caen aquí: siguen a un toque, sin amontonarse arriba.
            '<li class="solo-movil"><hr class="dropdown-divider"></li>' +
            (window.edocIdiomaOpciones
              ? window.edocIdiomaOpciones().replace(/<li>/g, '<li class="solo-movil">') +
                '<li class="solo-movil"><hr class="dropdown-divider"></li>'
              : '') +
            '<li class="solo-movil"><a class="dropdown-item" href="#" data-sin-destino>' +
              bandera() + 'Emiratos Árabes Unidos</a></li>' +
            '<li class="solo-movil"><a class="dropdown-item" href="https://wikiedoc.guru-soft.com/" target="_blank" rel="noopener">' +
              icono('soporte') + 'Acceso al soporte</a></li>' +
            '<li><hr class="dropdown-divider"></li>' +
            '<li><a class="dropdown-item" href="index.html">' + icono('salir') + 'Salir</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</header>';
  }

  /* Datos de contexto, con valor por defecto. Se pueden cambiar por pantalla
     con data-empresa, data-usuario o data-ambiente en el <body>. */
  function cuerpoDato(nombre, porDefecto) {
    return document.body.dataset[nombre] || porDefecto;
  }

  /* El código es el que usa el equipo; el nombre entre paréntesis es para quien
     entra al portal y no tiene por qué saber qué significa «QA». */
  var NOMBRE_AMBIENTE = { QA: 'Calidad', PRO: 'Producción', PROD: 'Producción', DEV: 'Desarrollo' };
  function rotuloAmbiente(codigo) {
    var nombre = NOMBRE_AMBIENTE[codigo.toUpperCase()];
    return nombre ? codigo + ' <span class="edoc-ambiente__nombre">(' + nombre + ')</span>' : codigo;
  }

  function iniciales(nombre) {
    var partes = nombre.trim().split(/\s+/);
    return ((partes[0] || '')[0] || '') + ((partes[1] || '')[0] || '');
  }

  /* --- Menú -------------------------------------------------------------- */
  function menu(activo) {
    var rotuloActivo = (MENU.filter(function (x) { return x.id === activo; })[0] || {}).rotulo || 'eDoc';
    var html = '<nav class="edoc-menu" aria-label="Menú principal" data-seccion-actual="' + rotuloActivo + '">' +
      '<button type="button" class="edoc-menu__hamburguesa" data-abre-menu ' +
        'aria-expanded="false" aria-controls="menu-movil" aria-label="Abrir el menú">' +
        '<span></span><span></span><span></span></button>';
    MENU.forEach(function (seccion) {
      var esActivo = seccion.id === activo ? ' activo' : '';
      if (!seccion.grupos) {
        html += '<div class="edoc-menu__contenedor"><a class="edoc-menu__item' + esActivo + '" href="' +
                seccion.url + '">' + icono(seccion.icono) + seccion.rotulo + '</a></div>';
        return;
      }
      html += '<div class="edoc-menu__contenedor">' +
              '<a class="edoc-menu__item' + esActivo + '" href="#" data-sin-destino>' +
              icono(seccion.icono) + seccion.rotulo + '</a>' +
              '<div class="edoc-menu__panel">';
      seccion.grupos.forEach(function (grupo) {
        var hijos = '';
        grupo.enlaces.forEach(function (enlace) {
          if (enlace.fase) {
            hijos += '<span class="edoc-menu__enlace edoc-menu__enlace--fase" ' +
                    'title="Fuera de la primera entrega.">' +
                    enlace.rotulo + ' · fase ' + enlace.fase + '</span>';
          } else {
            var act = document.body.dataset.pagina === enlace.url ? ' activo' : '';
            var dudoso = enlace.porUbicar ? ' edoc-menu__enlace--por-ubicar' : '';
            var obra = habilitada(enlace.url) ? '' : ' edoc-menu__enlace--obra';
            var pista = enlace.porUbicar
              ? ' title="Llegará en una próxima entrega."'
              : (obra ? ' title="Está en el alcance, pero no en la entrega de hoy."' : '');
            var cola = enlace.porUbicar ? ' · por ubicar' : (obra ? ' · en construcción' : '');
            hijos += '<a class="edoc-menu__enlace' + act + dudoso + obra + '" href="' + enlace.url + '"' + pista + '>' +
                    enlace.rotulo + cola + '</a>';
          }
        });
        // Con título hay dos niveles: el rótulo del grupo y sus hijos sangrados.
        // Sin título, los enlaces cuelgan directamente de la sección.
        if (grupo.titulo) {
          html += '<div class="edoc-menu__grupo">' + grupo.titulo + '</div>' +
                  '<div class="edoc-menu__hijos">' + hijos + '</div>';
        } else {
          html += hijos;
        }
      });
      html += '</div></div>';
    });
    return html + '</nav>' + menuMovil(activo);
  }

  /* El mismo árbol, desplegado, para pantallas estrechas. No es otro menú:
     se arma con la misma estructura, para que no puedan divergir. */
  function menuMovil(activo) {
    var html = '<div class="edoc-menu-movil" id="menu-movil" hidden>';
    MENU.forEach(function (seccion) {
      if (!seccion.grupos) {
        html += '<a class="edoc-menu-movil__seccion' + (seccion.id === activo ? ' activo' : '') +
                '" href="' + seccion.url + '">' + icono(seccion.icono) + seccion.rotulo + '</a>';
        return;
      }
      html += '<div class="edoc-menu-movil__seccion' + (seccion.id === activo ? ' activo' : '') + '">' +
              icono(seccion.icono) + seccion.rotulo + '</div>';
      seccion.grupos.forEach(function (grupo) {
        var hijos = '';
        grupo.enlaces.forEach(function (enlace) {
          if (enlace.fase) {
            hijos += '<span class="edoc-menu-movil__enlace edoc-menu__enlace--fase">' +
                    enlace.rotulo + ' · fase ' + enlace.fase + '</span>';
          } else {
            var act = document.body.dataset.pagina === enlace.url ? ' activo' : '';
            var dudoso = enlace.porUbicar ? ' edoc-menu__enlace--por-ubicar' : '';
            var obra = habilitada(enlace.url) ? '' : ' edoc-menu__enlace--obra';
            var cola = enlace.porUbicar ? ' · por ubicar' : (obra ? ' · en construcción' : '');
            hijos += '<a class="edoc-menu-movil__enlace' + act + dudoso + obra + '" href="' + enlace.url + '">' +
                    enlace.rotulo + cola + '</a>';
          }
        });
        if (grupo.titulo) {
          html += '<div class="edoc-menu-movil__grupo">' + grupo.titulo + '</div>' +
                  '<div class="edoc-menu-movil__hijos">' + hijos + '</div>';
        } else {
          html += hijos;
        }
      });
    });
    return html + '</div>';
  }

  /* --- Pie --------------------------------------------------------------- */
  function pie() {
    return '<footer class="edoc-pie">' +
      '<span>GuruSoft S.A. © 2026. Todos los derechos reservados.</span>' +
      '<span>eDoc Emiratos · maqueta de alcance · ' + (window.EDOC_VERSION || '') + ' · no es el diseño final' +
      (habilitada('bases.html') ? ' · <a href="bases.html">Bases de diseño</a>' : '') + '</span>' +
    '</footer>';
  }

  /* --- Montaje ----------------------------------------------------------- */
  function montar() {
    var sim = window.EDOC_SIMULACRO;
    var cuerpo = document.body;
    var pagina = cuerpo.dataset.pagina || '';
    var seccion = cuerpo.dataset.seccion || '';
    var soporte = document.getElementById('armazon');
    var reducido = cuerpo.dataset.armazon === 'reducido';
    if (soporte) {
      soporte.insertAdjacentHTML('beforebegin',
        (reducido ? encabezadoReducido(cuerpo.dataset.quien || '') : encabezado() + menu(seccion)) +
        barraEstado() + franjaFija());
    }
    cuerpo.insertAdjacentHTML('beforeend', pie());
    // El armazón se pinta después de que idioma.js haya arrancado, así que hay
    // que dejarle marcar cuál es el idioma activo.
    if (window.edocPintarIdioma) window.edocPintarIdioma();
    // El armazón se pinta después de que idioma.js haya arrancado, así que
    // hay que dejarle marcar cuál es el idioma activo.
    // Los enlaces del encabezado, del menú y del pie nacen aquí, después de
    // alcance.js: hay que pasarles el ?vistas= para que el alcance del enlace
    // no se pierda al primer clic.
    if (window.EDOC_ALCANCE && window.EDOC_ALCANCE.propagar) window.EDOC_ALCANCE.propagar();

    cablearCampana();

    /* Los '?' de ayuda. Se abren al pulsarlos y se cierran al pulsar fuera,
       que es el patron 'dismiss on next click' de Bootstrap: hace falta que
       sean <button> para que puedan recibir el foco. */
    if (window.jQuery && window.jQuery.fn.popover) {
      window.jQuery('[data-toggle="popover"]').popover({ trigger: 'focus', html: false });
    }
    // Un '?' dentro de una cabecera de tabla abre su ayuda, no reordena la
    // columna: se para el clic antes de que llegue a la cabecera.
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('th .edoc-ayuda-que')) e.stopPropagation();
    }, true);

    /* Una función que se puede mirar pero no usar: se dice dentro de la propia
       pantalla, no en una barra de arriba que ya se leyó. */
    if (sim && !window.edocEnObra) {
      var limite = sim.limitada(pagina);
      if (limite && soporte) {
        var barra = soporte.querySelector('.edoc-titulo-barra');
        var aviso = '<div class="edoc-aviso edoc-aviso--advertencia mb-3">' +
          '<div><strong>Función limitada por el mantenimiento.</strong> ' + limite + '</div></div>';
        if (barra) barra.insertAdjacentHTML('afterend', aviso);
        else soporte.insertAdjacentHTML('afterbegin', aviso);
      }
    }

    /* El saludo con el número de notificaciones, una sola vez por sesión: es lo
       que hace que alguien abra la campana en vez de pasar de largo. */
    if (sim && sim.saludoPendiente()) {
      var pendientes = avisosVivos().filter(function (a) { return !a.leido; }).length;
      if (pendientes) {
        window.setTimeout(function () {
          avisar('Tienes <strong>' + pendientes + ' avisos sin leer</strong>. Están en la campana, ' +
            'arriba a la derecha.');
        }, 900);
      }
    }

    // Si la pantalla no entra en la entrega, se cambia su contenido por el
    // aviso. El armazón se queda: el menú tiene que seguir enseñando el alcance.
    if (soporte && pagina && !habilitada(pagina)) {
      var rotuloVista = '';
      if (window.EDOC_ALCANCE) {
        var ficha = window.EDOC_ALCANCE.VISTAS.filter(function (v) { return v.archivo === pagina; })[0];
        rotuloVista = ficha ? ficha.rotulo : '';
      }
      soporte.innerHTML = pantallaEnObra(rotuloVista);
      soporte.classList.add('edoc-pagina--obra');
      document.title = 'En construcción · eDoc Emiratos';
      /* El contenido de la página acaba de desaparecer, así que su script no
         va a encontrar nada. Sin esta bandera revienta con un «null» en la
         consola, que es lo que pasó al sacar la cola de reportes del MVP. */
      window.edocEnObra = true;
    }

    /* Y si esa pantalla está caída por el mantenimiento, lo mismo pero con otro
       motivo. Va después, para que «no entra en el MVP» gane: si algo no
       existe, da igual que además esté en mantenimiento. */
    if (soporte && sim && !window.edocEnObra) {
      var motivo = sim.bloqueada(pagina);
      if (motivo) {
        soporte.innerHTML = pantallaMantenimiento(motivo, sim.hasta());
        soporte.classList.add('edoc-pagina--obra');
        document.title = 'En mantenimiento · eDoc Emiratos';
        window.edocEnObra = true;
      }
    }

    // Si la herramienta está apagada, la capa se apaga con ella: si no, unas
    // notas encendidas ayer se quedarían sin forma de quitarlas.
    if (!herramientaNotas()) {
      cuerpo.classList.remove('con-notas');
      try { localStorage.setItem('edoc-notas', '0'); } catch (error) { /* nada */ }
    }

    // «Nombre nativo» vive en el encabezado, porque se enseña durante la demo.
    // «Notas de diseño» no: es una capa de revisión interna y solo se enciende
    // desde el panel de alcance, que no cuelga de ningún menú.
    aplicarPreferencia('con-notas', 'edoc-notas', '[data-alterna-notas]');
    aplicarPreferencia('mostrar-arabe', 'edoc-arabe', '[data-alterna-arabe]');

    document.querySelectorAll('[data-alterna-notas]').forEach(function (b) {
      b.addEventListener('click', function () { alternar('con-notas', 'edoc-notas', b); });
    });
    document.querySelectorAll('[data-alterna-arabe]').forEach(function (b) {
      b.addEventListener('click', function () { alternar('mostrar-arabe', 'edoc-arabe', b); pintarNombres(); });
    });

    // Enlaces que todavía no tienen pantalla: se avisa, no se navega en silencio.
    // Es justo el hallazgo de Francia (ocho rutas que vuelven al inicio sin decir nada).
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-sin-destino]');
      if (!a) return;
      e.preventDefault();
      avisar('Esta opción no entra en la maqueta. La decisión de si va y cómo se ve está en el mapa del portal.');
    });

    var hamburguesa = document.querySelector('[data-abre-menu]');
    var cajon = document.getElementById('menu-movil');
    if (hamburguesa && cajon) {
      hamburguesa.addEventListener('click', function () {
        var abierto = !cajon.hidden;
        cajon.hidden = abierto;
        hamburguesa.setAttribute('aria-expanded', abierto ? 'false' : 'true');
        hamburguesa.setAttribute('aria-label', abierto ? 'Abrir el menú' : 'Cerrar el menú');
        hamburguesa.classList.toggle('abierta', !abierto);
      });
      // Al ensanchar la ventana el cajón sobra: manda la barra horizontal.
      window.addEventListener('resize', function () {
        if (window.innerWidth > 900 && !cajon.hidden) {
          cajon.hidden = true;
          hamburguesa.setAttribute('aria-expanded', 'false');
          hamburguesa.classList.remove('abierta');
        }
      });
    }

    // El panel de alcance no cuelga de ningún menú. Se llega con Ctrl+Alt+P
    // o escribiendo la dirección.
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        window.location.href = window.EDOC_ALCANCE ? window.EDOC_ALCANCE.conVistas('panel.html') : 'panel.html';
      }
    });

    // Si el archivo del avatar no llega, se cae a las iniciales: nunca un hueco.
    document.querySelectorAll('.edoc-usuario__avatar img').forEach(function (img) {
      img.addEventListener('error', function () {
        var caja = img.parentNode;
        img.remove();
        caja.textContent = caja.dataset.iniciales || '';
      });
    });

    pintarNombres();
  }

  function aplicarPreferencia(clase, llave, selector) {
    var activo = localStorage.getItem(llave) === '1';
    document.body.classList.toggle(clase, activo);
    document.querySelectorAll(selector).forEach(function (b) { marcar(b, activo); });
  }
  function alternar(clase, llave, boton) {
    var activo = document.body.classList.toggle(clase);
    localStorage.setItem(llave, activo ? '1' : '0');
    document.querySelectorAll('[' + (llave === 'edoc-notas' ? 'data-alterna-notas' : 'data-alterna-arabe') + ']')
      .forEach(function (b) { marcar(b, activo); });
  }
  function marcar(boton, activo) {
    boton.style.background = activo ? 'rgba(168,198,52,.9)' : '';
    boton.style.borderColor = activo ? 'var(--edoc-verde)' : '';
    boton.style.color = activo ? '#12160a' : '';
    boton.setAttribute('aria-pressed', activo ? 'true' : 'false');
  }

  /* --- Regla del árabe ---------------------------------------------------
     Un solo alfabeto por campo. El nombre se aísla; el resto de la fila
     —importes, fechas, números— se queda siempre en caracteres latinos.   */
  function pintarNombres() {
    var enArabe = document.body.classList.contains('mostrar-arabe');
    document.querySelectorAll('[data-nombre-latino]').forEach(function (el) {
      var nativo = el.dataset.nombreArabe;
      if (enArabe && nativo) {
        el.textContent = nativo;
        el.setAttribute('dir', 'rtl');
        el.setAttribute('lang', 'ar');
        el.classList.add('nombre-nativo');
        el.insertAdjacentHTML('afterend', '<span class="marca-ar" data-marca-ar>AR</span>');
        var celda = el.closest('td'); if (celda) celda.classList.add('celda-ar');
      } else {
        el.textContent = el.dataset.nombreLatino;
        el.setAttribute('dir', 'ltr');
        el.setAttribute('lang', 'en');
        el.classList.add('nombre-nativo');
        var s = el.nextElementSibling;
        if (s && s.hasAttribute('data-marca-ar')) s.remove();
        var celda = el.closest('td'); if (celda) celda.classList.remove('celda-ar');
      }
    });
  }
  window.edocPintarNombres = pintarNombres;

  /* --- Aviso flotante ---------------------------------------------------- */
  function avisar(texto, tipo) {
    var caja = document.getElementById('edoc-avisos');
    if (!caja) {
      caja = document.createElement('div');
      caja.id = 'edoc-avisos';
      caja.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2000;display:flex;flex-direction:column;gap:8px;max-width:390px';
      caja.setAttribute('role', 'status');
      caja.setAttribute('aria-live', 'polite');
      document.body.appendChild(caja);
    }
    var el = document.createElement('div');
    el.className = 'edoc-aviso edoc-aviso--' + (tipo || 'info');
    el.style.cssText = 'background:#fff;box-shadow:0 6px 20px rgba(0,0,0,.18)';
    el.innerHTML = icono('info', 'edoc-aviso__icono') + '<div>' + texto + '</div>';
    caja.appendChild(el);
    setTimeout(function () { el.style.transition = 'opacity .3s'; el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 320); }, 4200);
  }
  /* Cerrar la franja la guarda por la sesión, no para siempre: un
     mantenimiento que aún no ha pasado conviene volver a verlo mañana. */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cerrar-franja]');
    if (!b) return;
    var caja = b.closest('.edoc-franja');
    if (caja) caja.remove();
    try { window.sessionStorage.setItem(b.dataset.cerrarFranja, '1'); } catch (error) { /* nada */ }
  });

  window.edocAvisar = avisar;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
