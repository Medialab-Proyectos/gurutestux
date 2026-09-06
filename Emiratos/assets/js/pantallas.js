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

  /* --- Reportes pedidos desde una exportación ---------------------------
     Se guardan en el navegador para que el recorrido llegue entero: pides el
     archivo en un listado y lo encuentras en la bandeja, como en el portal. */
  var LLAVE_REPORTES = 'edoc-reportes';

  function leerReportes() {
    try {
      var crudo = window.localStorage.getItem(LLAVE_REPORTES);
      var lista = crudo ? JSON.parse(crudo) : [];
      return Array.isArray(lista) ? lista : [];
    } catch (error) { return []; }
  }

  function escribirReportes(lista) {
    try { window.localStorage.setItem(LLAVE_REPORTES, JSON.stringify(lista)); } catch (error) { /* nada */ }
  }

  function sello(fecha) {
    function dd(n) { return String(n).padStart(2, '0'); }
    return fecha.getFullYear() + '-' + dd(fecha.getMonth() + 1) + '-' + dd(fecha.getDate()) +
           ' ' + dd(fecha.getHours()) + ':' + dd(fecha.getMinutes());
  }

  window.edocReportes = leerReportes;

  window.edocPedirReporte = function (datos) {
    var lista = leerReportes();
    var ficha = {
      ref: 'REP-2026-00' + (319 + lista.length),
      tipo: datos.tipo,
      formato: datos.formato,
      creado: sello(new Date()),
      desde: datos.desde,
      hasta: datos.hasta,
      registros: datos.registros,
      estado: 'generando',
      pedido: Date.now()
    };
    lista.unshift(ficha);
    escribirReportes(lista);
    return ficha;
  };

  /* Un reporte que lleva pedido más de este tiempo ya está listo. Sustituye al
     trabajo de fondo que en el portal real avisa por su cuenta. */
  window.edocMadurarReportes = function (segundos) {
    var lista = leerReportes();
    var cambiados = false;
    var ahora = Date.now();
    lista.forEach(function (r) {
      if (r.estado === 'generando' && ahora - r.pedido > segundos * 1000) {
        r.estado = 'listo'; cambiados = true;
      }
    });
    if (cambiados) escribirReportes(lista);
    return cambiados;
  };

  function arrancar() { pintarIconos(); prepararTablas(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
