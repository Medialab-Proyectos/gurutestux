/* ==========================================================================
   eDoc Emiratos · DataTables
   Bolivia sirve DataTables 1.10.25 sobre Bootstrap 4. Se usa lo mismo, con la
   misma traducción, para que la maqueta y el portal se comporten igual y el
   desarrollo no tenga que reescribir la paginación ni el «Mostrar N registros».
   ========================================================================== */
(function () {
  'use strict';

  /* Traducción, calcada de la que ya usa el portal de Bolivia. */
  /* El estado de una lista sin filas. Hay dos y no dicen lo mismo: «no hay
     nada todavía» y «hay, pero tus filtros lo esconden». Solo el segundo lleva
     «Limpiar filtros», que es la salida que tiene quien lo ve. */
  window.edocVacio = function (titulo, texto, conLimpiar, icono) {
    var dibujo = window.edocIcono ? window.edocIcono(icono || (conLimpiar ? 'buscar' : 'emision')) : '';
    return '<div class="edoc-vacio">' +
      '<span class="edoc-vacio__icono" aria-hidden="true">' + dibujo + '</span>' +
      '<span class="edoc-vacio__titulo">' + titulo + '</span>' +
      (texto ? '<span class="edoc-vacio__texto">' + texto + '</span>' : '') +
      (conLimpiar ? '<button type="button" class="btn btn-edoc-terciario btn-sm" data-limpiar-filtros>Limpiar filtros</button>' : '') +
    '</div>';
  };

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-limpiar-filtros]')) return;
    var forma = document.getElementById('forma-buscar');
    if (forma) forma.reset();
  });

  var IDIOMA = {
    processing:     'Procesando...',
    lengthMenu:     'Mostrar _MENU_ registros',
    zeroRecords:    window.edocVacio('Ningún resultado con esos filtros', 'Prueba con otras fechas o quita algún filtro.', true),
    emptyTable:     window.edocVacio('Todavía no hay nada aquí', 'Cuando haya registros, aparecerán en esta lista.'),
    info:           'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
    infoEmpty:      'Mostrando registros del 0 al 0 de un total de 0 registros',
    infoFiltered:   '(filtrado de un total de _MAX_ registros)',
    search:         'Buscar:',
    loadingRecords: 'Cargando...',
    paginate: { first: 'Primero', last: 'Último', next: 'Siguiente', previous: 'Anterior' },
    aria: { sortAscending: ': activar para ordenar la columna de manera ascendente',
            sortDescending: ': activar para ordenar la columna de manera descendente' }
  };

  /* La caja de búsqueda propia de DataTables se apaga: cada pantalla ya tiene
     su banner de búsqueda, y dos buscadores en la misma vista confunden. */
  var DISPOSICION = '<"dt-cabecera"l><"dt-cuerpo"tr><"dt-pie"ip>';

  /* Destruye la tabla si ya estaba montada. Hay que llamarla ANTES de
     reescribir el <tbody>: DataTables guarda las filas y al destruirse las
     devuelve, así que hacerlo después borra lo que acabas de pintar. */
  window.edocDestruirTabla = function (selector) {
    if (window.jQuery.fn.dataTable.isDataTable(selector)) {
      window.jQuery(selector).DataTable().destroy();
    }
  };

  /* Copia el rótulo de cada columna a sus celdas. En pantallas estrechas la
     tabla se apila y cada celda tiene que decir de qué columna viene: sin esto
     el usuario ve una lista de valores sueltos. Se vuelve a aplicar en cada
     dibujado porque DataTables recrea las filas al paginar y al ordenar. */
  function rotularCeldas(tabla, selector) {
    var $t = window.jQuery(selector);
    var rotulos = $t.find('thead tr:last-child th').map(function () {
      return window.jQuery(this).text().trim().replace(/[⇅↑↓]\s*$/, '');
    }).get();
    $t.find('tbody tr').each(function () {
      window.jQuery(this).children('td').each(function (i) {
        if (rotulos[i]) this.setAttribute('data-rotulo', rotulos[i]);
      });
    });
  }

  window.edocTabla = function (selector, opciones) {
    var $t = window.jQuery(selector);
    if (!$t.length) return null;
    window.edocDestruirTabla(selector);
    $t.addClass('apilable');
    var tabla = $t.DataTable(window.jQuery.extend(true, {
      language: IDIOMA,
      dom: DISPOSICION,
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100],
      autoWidth: false,
      // Al volver a la vista, la tabla sigue en la página y el orden en que
      // se dejó. Dura lo que la pestaña (-1 = sessionStorage).
      stateSave: true,
      stateDuration: -1,
      // La primera columna es siempre «Acciones»: no se ordena.
      columnDefs: [{ orderable: false, targets: 0 }],
      order: []
    }, opciones || {}));

    rotularCeldas(tabla, selector);
    tabla.on('draw.dt', function () { rotularCeldas(tabla, selector); });
    // Para ver el estado de una lista sin datos: añadir ?sin-datos a la dirección.
    if (/[?&]sin-datos(=|&|$)/.test(window.location.search)) tabla.clear().draw();
    return tabla;
  };

  /* Los filtros de búsqueda, sobre las filas que ya tiene la tabla. Se leen al
     pulsar «Consultar» —no al teclear— y se guardan: al paginar u ordenar se
     sigue viendo lo que se consultó. «Limpiar» vuelve a enseñarlo todo, y los
     filtros que campos.js restaura al volver a la vista se aplican al cargar.

     o.leer()                 lo que hay puesto en el formulario
     o.cumple(c, fila, i)     si la fila i entra con esos criterios
     o.fechas                 [desde, hasta], para no aceptar un rango al revés
     o.unidad                 ['documento', 'documentos'], para el aviso */
  window.edocFiltrar = function (selector, forma, o) {
    var $ = window.jQuery;
    var criterios = null;
    $.fn.dataTable.ext.search.push(function (settings, datos, i) {
      if (!criterios || settings.nTable !== $(selector)[0]) return true;
      var fila = settings.aoData[i];
      return o.cumple(criterios, fila ? fila.nTr : null, i);
    });
    function aplicar(avisar) {
      criterios = o.leer();
      if (!$.fn.dataTable.isDataTable(selector)) return;
      var tabla = $(selector).DataTable();
      tabla.draw();
      if (!avisar) return;
      var n = tabla.rows({ search: 'applied' }).count();
      window.edocAvisar('<span>Encontrados:</span> <strong>' + n + '</strong> <span>' +
        (n === 1 ? o.unidad[0] : o.unidad[1]) + '.</span>', n ? 'exito' : 'info');
    }
    forma.addEventListener('submit', function (e) {
      e.preventDefault();
      if (o.fechas) {
        var desde = document.getElementById(o.fechas[0]);
        var hasta = document.getElementById(o.fechas[1]);
        desde.classList.remove('is-invalid');
        hasta.classList.remove('is-invalid');
        if (desde.value && hasta.value && desde.value > hasta.value) {
          hasta.classList.add('is-invalid');
          hasta.focus();
          window.edocAvisar('La fecha «desde» no puede ser posterior a «hasta».', 'error');
          return;
        }
      }
      aplicar(true);
    });
    forma.addEventListener('reset', function () {
      window.setTimeout(function () {
        forma.querySelectorAll('.is-invalid').forEach(function (x) { x.classList.remove('is-invalid'); });
        aplicar(false);
      }, 0);
    });
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { aplicar(false); });
    } else {
      aplicar(false);
    }
    return { aplicar: aplicar };
  };
})();
