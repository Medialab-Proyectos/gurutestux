/* ==========================================================================
   eDoc Emiratos · ayudas compartidas por las pantallas
   Rellena los huecos de icono declarados con data-icono y da un par de
   utilidades que usan varias vistas.
   ========================================================================== */
(function () {
  'use strict';

  function pintarIconos(raiz) {
    (raiz || document).querySelectorAll('[data-icono]').forEach(function (el) {
      if (el.dataset.iconoPintado) return;
      el.innerHTML = window.edocIcono(el.dataset.icono) + el.innerHTML;
      el.dataset.iconoPintado = '1';
    });
  }
  window.edocPintarIconos = pintarIconos;

  /* Toda tabla de la maqueta se apila en pantallas estrechas, sea un DataTable
     o una tabla estática de las Bases de diseño. Para eso cada celda necesita
     el rótulo de su columna. */
  function prepararTablas(raiz) {
    (raiz || document).querySelectorAll('table.edoc-tabla').forEach(function (t) {
      t.classList.add('apilable');
      var cabeceras = t.querySelectorAll('thead tr:last-child th');
      if (!cabeceras.length) return;
      var rotulos = Array.prototype.map.call(cabeceras, function (th) {
        return th.textContent.trim().replace(/[⇅↑↓]\s*$/, '');
      });
      t.querySelectorAll('tbody tr').forEach(function (fila) {
        Array.prototype.forEach.call(fila.children, function (celda, i) {
          if (rotulos[i] && !celda.hasAttribute('data-rotulo')) {
            celda.setAttribute('data-rotulo', rotulos[i]);
          }
        });
      });
    });
  }
  window.edocPrepararTablas = prepararTablas;

  /* Pastilla de estado con los colores de señalización del manual. */
  window.edocPastilla = function (estado) {
    var e = (window.EDOC && window.EDOC.ESTADOS[estado]) || null;
    if (!e || estado === 'noaplica') return '<span class="edoc-secundario">—</span>';
    return '<span class="edoc-estado edoc-estado--' + e.clase + '">' + e.rotulo + '</span>';
  };

  function arrancar() { pintarIconos(); prepararTablas(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
