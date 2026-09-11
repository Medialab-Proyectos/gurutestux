/* ==========================================================================
   eDoc Emiratos · DataTables
   Bolivia sirve DataTables 1.10.25 sobre Bootstrap 4. Se usa lo mismo, con la
   misma traducción, para que la maqueta y el portal se comporten igual y el
   desarrollo no tenga que reescribir la paginación ni el «Mostrar N registros».
   ========================================================================== */
(function () {
  'use strict';

  /* Traducción, calcada de la que ya usa el portal de Bolivia. */
  var IDIOMA = {
    processing:     'Procesando...',
    lengthMenu:     'Mostrar _MENU_ registros',
    zeroRecords:    'No se encontraron resultados',
    emptyTable:     'Ningún dato disponible en esta tabla',
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
    return tabla;
  };
})();
