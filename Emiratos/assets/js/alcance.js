/* ==========================================================================
   eDoc Emiratos · alcance de la entrega
   La reunión pidió maquetar las dos pantallas centrales. Para una presentación
   se entregan solo esas, más el inicio; el resto del portal sigue en el menú
   —para que se vea el alcance completo— pero muestra «En construcción».
   Qué se enseña se decide en panel.html, que no cuelga de ningún menú.
   ========================================================================== */
window.EDOC_ALCANCE = (function () {
  'use strict';

  /* Fuera de la puerta: la entrada y el propio panel siempre se abren. */
  var SIEMPRE = ['index.html', 'panel.html', ''];

  /* `entrega` marca lo que se enseña si nadie ha tocado nada. */
  var VISTAS = [
    { archivo: 'inicio.html',              rotulo: 'Inicio',                                  grupo: 'Portal',        entrega: true },
    { archivo: 'emitidos.html',            rotulo: 'Documentos Emitidos',                     grupo: 'Portal',        entrega: true },
    { archivo: 'recibidos.html',           rotulo: 'Documentos Recibidos',                    grupo: 'Portal',        entrega: true },
    { archivo: 'reportes-generados.html',  rotulo: 'Reportes generados · exportación masiva',  grupo: 'Portal',        entrega: true },
    { archivo: 'bases.html',               rotulo: 'Bases de diseño',                         grupo: 'Diseño',        entrega: false },
    { archivo: 'admin-clave.html',         rotulo: 'Cambiar Contraseña',                      grupo: 'Administración', entrega: false },
    { archivo: 'admin-roles.html',         rotulo: 'Roles',                                   grupo: 'Administración', entrega: false },
    { archivo: 'admin-usuarios.html',      rotulo: 'Usuarios',                                grupo: 'Administración', entrega: false },
    { archivo: 'admin-empresa.html',       rotulo: 'Datos fiscales de la empresa',          grupo: 'Administración', entrega: false },
    { archivo: 'admin-contactos.html',     rotulo: 'Contactos de la empresa',    grupo: 'Administración', entrega: false },
    { archivo: 'admin-credenciales.html',  rotulo: 'Credenciales de consumo Servicio eDoc',   grupo: 'Administración', entrega: false },
    { archivo: 'admin-alertas.html',       rotulo: 'Alertas y comunicados',                   grupo: 'Administración', entrega: false },
    { archivo: 'admin-manuales.html',      rotulo: 'Manuales',                                grupo: 'Administración', entrega: false },
    { archivo: 'admin-clientes.html',      rotulo: 'Clientes y proveedores',                  grupo: 'Administración', entrega: false },
    { archivo: 'onboarding.html',          rotulo: 'Retorno desde EmaraTax',                  grupo: 'Fuera de la sesión', entrega: false },
    { archivo: 'registro.html',            rotulo: 'Registro de la empresa',                  grupo: 'Fuera de la sesión', entrega: false },
    { archivo: 'aprobacion-registro.html', rotulo: 'Aprobación del registro',                 grupo: 'Fuera de la sesión', entrega: false }
  ];

  var LLAVE = 'edoc-vistas';
  /* Sube cada vez que cambia la lista de pantallas. Una selección guardada con
     una versión anterior se descarta: si no, una pantalla nueva no aparecería
     jamás en el navegador de quien ya había guardado. */
  var VERSION = '2';
  var LLAVE_VERSION = 'edoc-vistas-version';

  function porDefecto() {
    return VISTAS.filter(function (v) { return v.entrega; }).map(function (v) { return v.archivo; });
  }

  /* Orden de mando: lo que diga la dirección, luego lo guardado en este
     navegador, y si no, la entrega de hoy. El parámetro permite mandar un
     enlace que abra vistas concretas sin tocar el código. */
  function habilitadas() {
    var parametros = new URLSearchParams(window.location.search);
    var pedido = parametros.get('vistas');
    if (pedido === 'todas') return VISTAS.map(function (v) { return v.archivo; });
    if (pedido === 'entrega') return porDefecto();
    if (pedido) {
      var pedidas = pedido.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
      return VISTAS.filter(function (v) {
        return pedidas.indexOf(v.archivo) >= 0 || pedidas.indexOf(v.archivo.replace('.html', '')) >= 0;
      }).map(function (v) { return v.archivo; });
    }
    try {
      if (window.localStorage.getItem(LLAVE_VERSION) !== VERSION) {
        window.localStorage.removeItem(LLAVE);
        window.localStorage.removeItem(LLAVE_VERSION);
        return porDefecto();
      }
      var guardado = window.localStorage.getItem(LLAVE);
      if (guardado) {
        var lista = JSON.parse(guardado);
        if (Array.isArray(lista)) return lista;
      }
    } catch (error) { /* navegador sin almacenamiento: se usa la entrega */ }
    return porDefecto();
  }

  function estaHabilitada(archivo) {
    if (SIEMPRE.indexOf(archivo) >= 0) return true;
    return habilitadas().indexOf(archivo) >= 0;
  }

  function guardar(lista) {
    try {
      window.localStorage.setItem(LLAVE, JSON.stringify(lista));
      window.localStorage.setItem(LLAVE_VERSION, VERSION);
    } catch (error) { /* nada */ }
  }

  function restablecer() {
    try {
      window.localStorage.removeItem(LLAVE);
      window.localStorage.removeItem(LLAVE_VERSION);
    } catch (error) { /* nada */ }
  }

  /* Enlace que abre exactamente estas vistas en cualquier navegador. */
  function enlace(lista, pagina) {
    var base = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
    var destino = pagina || (lista.indexOf('inicio.html') >= 0 ? 'inicio.html' : (lista[0] || 'inicio.html'));
    var todas = VISTAS.length === lista.length;
    return base + destino + '?vistas=' + (todas ? 'todas' : lista.join(','));
  }

  return {
    VISTAS: VISTAS,
    porDefecto: porDefecto,
    habilitadas: habilitadas,
    estaHabilitada: estaHabilitada,
    guardar: guardar,
    restablecer: restablecer,
    enlace: enlace
  };
})();
