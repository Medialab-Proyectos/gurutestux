/* El simulacro de avisos.

   La maqueta la van a evaluar más de cien personas. Si los mensajes de
   mantenimiento, las alertas y las notificaciones estuvieran siempre puestos,
   nadie los miraría; y si no estuvieran nunca, nadie sabría que existen. Así
   que pueden salir **al azar**: a cada persona que entra le toca un escenario,
   y unas ven cosas que otras no.

   Pero eso viene **APAGADO**. Con el sorteo puesto de entrada, a uno de cada
   tres le salía «Portal en mantenimiento» con dos pantallas bloqueadas, y quien
   abre la maqueta por primera vez no lo lee como una simulación: lo lee como
   que está rota. El sorteo se enciende a mano desde el panel de alcance, para
   la ronda de evaluación.

   Que esta simulación exista NO decide nada. La opción «Alertas y comunicados»
   sigue sin definirse hasta que se cierre el MVP, y aquí solo se enseña cómo se
   sentiría, para poder opinar sobre algo mirado y no sobre una idea.

   Lo que cambia según el escenario:

     nada           no sale ningún mensaje
     alertas        la campana trae avisos sin leer, y salta un aviso al entrar
     mantenimiento  barra fija que no se cierra, y algunas funciones bloqueadas
     todo           las dos cosas a la vez

   El escenario se decide una vez por sesión: al recargar no cambia, para que
   quien evalúa pueda recorrer el portal sin que le baile la pantalla. Desde la
   pantalla de Alertas se puede forzar cualquiera de los cuatro. */
(function () {
  'use strict';

  var LLAVE_SESION = 'edoc-simulacro-sesion';
  var LLAVE_FORZADO = 'edoc-simulacro';
  var LLAVE_SALUDO = 'edoc-simulacro-saludo';
  var LLAVE_MODO = 'edoc-simulacro-modo';   // 'apagado' · 'azar'
  /* Cuántas veces se ha entrado con un OTP en este navegador. Es lo que separa
     la primera entrada —que nunca cae en mantenimiento— del resto. */
  var LLAVE_ENTRADAS = 'edoc-simulacro-entradas';
  /* Si la visita está en curso. Se enciende al meter el OTP y se apaga al
     volver al acceso, que es lo que significa haber salido. */
  var LLAVE_DENTRO = 'edoc-simulacro-dentro';

  /* Con qué frecuencia le toca cada escenario a quien entra. El «nada» pesa
     más a propósito: un portal que siempre está en mantenimiento no se
     entiende como una excepción. */
  var REPARTO = [
    { clave: 'nada',          peso: 40 },
    { clave: 'alertas',       peso: 28 },
    { clave: 'mantenimiento', peso: 20 },
    { clave: 'todo',          peso: 12 }
  ];

  /* Qué deja de funcionar mientras hay mantenimiento. No es aleatorio: son las
     funciones que de verdad dependen de un sistema de por medio —el servidor
     de identidades y la red— y por eso son las que se caerían. */
  var EN_MANTENIMIENTO = {
    'admin-credenciales.html': 'Crear y rotar credenciales toca el servidor de identidades, que es ' +
      'justo lo que estamos actualizando.',
    'admin-roles.html': 'Los permisos se guardan en el servidor de identidades, que está en ' +
      'mantenimiento.'
  };

  /* Y esto no se bloquea, pero se avisa: se puede mirar, no responder. */
  var LIMITADO = {
    'recibidos.html': 'Puedes consultar lo que has recibido, pero las respuestas —aprobar, rechazar ' +
      'o acusar recibo— no saldrán hasta que termine el mantenimiento.'
  };

  function leer(almacen, llave) {
    try { return window[almacen].getItem(llave); } catch (error) { return null; }
  }
  function escribir(almacen, llave, valor) {
    try { window[almacen].setItem(llave, valor); } catch (error) { /* nada */ }
  }

  function entradas() {
    var n = parseInt(leer('localStorage', LLAVE_ENTRADAS), 10);
    return isNaN(n) ? 0 : n;
  }

  function sortear() {
    /* El OTP es el disparador, así que sin haber entrado nunca no hay
       escenario: quien solo abre una dirección del portal ve el portal.
       Y la primera entrada no cae nunca en mantenimiento —quien abre la maqueta
       por primera vez y ve «Portal en mantenimiento» con dos pantallas
       bloqueadas no lo lee como una simulación, lo lee como que está rota, y
       eso ya pasó una vez—. A partir de la segunda entra el reparto entero,
       que es lo que hace falta para evaluarlo. */
    if (entradas() === 0) return 'nada';

    /* La PRIMERA entrada reparte a partes iguales entre los tres escenarios que
       se ven, y deja fuera «sin mensajes».

       Las dos razones son de la ronda de evaluación. Casi todo el mundo va a
       entrar una sola vez: si en esa entrada no hay nada que mirar, esa persona
       se va sin haber visto ni la campana ni el mantenimiento, y esa parte no
       se evalúa. Y tiene que estar repartido —a unos mantenimiento, a otros
       alertas, a otros las dos cosas— para que entre cien personas se mire todo
       y no siempre lo mismo.

       Desde la segunda entrada manda el reparto entero, «sin mensajes»
       incluido, que es el estado normal del portal. */
    var reparto = entradas() === 1
      ? [{ clave: 'alertas', peso: 1 },
         { clave: 'mantenimiento', peso: 1 },
         { clave: 'todo', peso: 1 }]
      : REPARTO;
    var total = reparto.reduce(function (a, r) { return a + r.peso; }, 0);
    var n = Math.random() * total;
    for (var i = 0; i < reparto.length; i++) {
      n -= reparto[i].peso;
      if (n <= 0) return reparto[i].clave;
    }
    return 'nada';
  }

  /* `?sim=` en la dirección manda sobre todo lo demás. Sirve para enseñar un
     escenario concreto sin tocar nada —basta pasar el enlace— y para que las
     pruebas no dependan del sorteo. */
  function delEnlace() {
    try {
      var v = new URLSearchParams(window.location.search).get('sim');
      return v && REPARTO.some(function (r) { return r.clave === v; }) ? v : null;
    } catch (error) { return null; }
  }

  /* Encendido salvo que alguien lo apague. Se puede porque el escenario ya no
     se sortea al abrir cualquier página, sino al entrar con un OTP, y porque la
     primera entrada nunca cae en mantenimiento. */
  function alAzar() {
    return leer('localStorage', LLAVE_MODO) !== 'apagado';
  }

  /* El acceso es el sitio donde uno está fuera. Da igual cómo se llegue
     -pulsando Salir, con el botón de atrás o escribiendo la dirección-: si se
     ve el acceso, la visita anterior terminó. */
  function enElAcceso() {
    var ruta = window.location.pathname;
    return /(^|\/)(index\.html)?$/.test(ruta);
  }

  function escenario() {
    // El enlace manda: sirve para enseñar uno concreto sin tocar nada.
    var porEnlace = delEnlace();
    if (porEnlace) return porEnlace;
    // Después, un escenario fijado a mano desde el panel.
    var forzado = leer('localStorage', LLAVE_FORZADO);
    if (forzado) return forzado;
    // Y solo si alguien encendió el sorteo, se sortea. Si no, nada.
    if (!alAzar()) return 'nada';

    /* Volver al acceso cierra la visita. Sin esto, la barra de mantenimiento se
       quedaba pegada en la pantalla de entrar después de salir del portal. */
    if (enElAcceso()) {
      try { window.sessionStorage.removeItem(LLAVE_SESION); } catch (e) { /* nada */ }
      try { window.sessionStorage.removeItem(LLAVE_DENTRO); } catch (e) { /* nada */ }
      try { window.sessionStorage.removeItem(LLAVE_SALUDO); } catch (e) { /* nada */ }
      return 'nada';
    }
    // Fuera de una visita no hay escenario: el disparador es entrar con el OTP.
    if (leer('sessionStorage', LLAVE_DENTRO) !== '1') return 'nada';
    var deSesion = leer('sessionStorage', LLAVE_SESION);
    if (!deSesion) {
      deSesion = sortear();
      escribir('sessionStorage', LLAVE_SESION, deSesion);
    }
    return deSesion;
  }

  var actual = escenario();

  var API = {
    escenario: actual,
    forzado: !!leer('localStorage', LLAVE_FORZADO) || !!delEnlace(),
    porEnlace: !!delEnlace(),
    alAzar: alAzar(),
    /* Si hay una visita en curso. El panel lo necesita para no decir «por
       sorteo» cuando lo que pasa es que nadie ha entrado todavía. */
    dentro: leer('sessionStorage', LLAVE_DENTRO) === '1',
    modo: delEnlace() ? 'enlace'
        : (leer('localStorage', LLAVE_FORZADO) ? 'fijo' : (alAzar() ? 'azar' : 'apagado')),
    hayMantenimiento: actual === 'mantenimiento' || actual === 'todo',
    hayAvisos: actual === 'alertas' || actual === 'todo',
    reparto: REPARTO,

    /* Hasta cuándo dura, para poder decirlo en el mensaje. Se calcula sobre la
       marcha para que no envejezca dentro de la maqueta. */
    hasta: function () {
      var d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(4, 0, 0, 0);
      var dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      return 'el ' + dias[d.getDay()] + ' a las 04:00';
    },

    bloqueada: function (pagina) {
      return API.hayMantenimiento ? (EN_MANTENIMIENTO[pagina] || '') : '';
    },
    limitada: function (pagina) {
      return API.hayMantenimiento ? (LIMITADO[pagina] || '') : '';
    },

    /* Fijar un escenario concreto. Al fijarlo se apaga el sorteo, para que no
       queden dos mandos peleándose. */
    forzar: function (clave) {
      if (clave) {
        escribir('localStorage', LLAVE_FORZADO, clave);
        escribir('localStorage', LLAVE_MODO, 'apagado');
      } else {
        try { window.localStorage.removeItem(LLAVE_FORZADO); } catch (e) { /* nada */ }
      }
      try { window.sessionStorage.removeItem(LLAVE_SESION); } catch (e) { /* nada */ }
      try { window.sessionStorage.removeItem(LLAVE_SALUDO); } catch (e) { /* nada */ }
    },

    /* Encender o apagar el sorteo. Al encenderlo se suelta el escenario fijo. */
    sortearOno: function (encendido) {
      escribir('localStorage', LLAVE_MODO, encendido ? 'azar' : 'apagado');
      if (encendido) { try { window.localStorage.removeItem(LLAVE_FORZADO); } catch (e) { /* nada */ } }
      try { window.sessionStorage.removeItem(LLAVE_SESION); } catch (e) { /* nada */ }
      try { window.sessionStorage.removeItem(LLAVE_SALUDO); } catch (e) { /* nada */ }
    },

    /* Entrar con un OTP nuevo es lo que vuelve a sortear. Es el disparador:
       cada entrada al portal es una visita distinta, y por eso puede tocarle un
       escenario distinto. Sin esto el escenario se quedaba fijo toda la sesión
       del navegador y volver a entrar no cambiaba nada. */
    nuevaEntrada: function () {
      escribir('localStorage', LLAVE_ENTRADAS, String(entradas() + 1));
      escribir('sessionStorage', LLAVE_DENTRO, '1');
      try { window.sessionStorage.removeItem(LLAVE_SESION); } catch (e) { /* nada */ }
      try { window.sessionStorage.removeItem(LLAVE_SALUDO); } catch (e) { /* nada */ }
    },

    entradas: entradas,

    /* El aviso de bienvenida sale una sola vez por sesión: repetirlo en cada
       pantalla sería exactamente el ruido que hace que nadie los lea. */
    saludoPendiente: function () {
      if (!API.hayAvisos) return false;
      if (leer('sessionStorage', LLAVE_SALUDO) === '1') return false;
      escribir('sessionStorage', LLAVE_SALUDO, '1');
      return true;
    }
  };

  window.EDOC_SIMULACRO = API;

  /* ------------------------------------------------------------------------
     Lo que tiene que verse en TODA pantalla, tenga armazón o no.

     El acceso (index.html) no carga edoc.js: no tiene menú, ni campana, ni
     armazón. Pero es por donde se entra, y quien llega durante un
     mantenimiento tiene que enterarse antes de escribir su clave. Igual con la
     salida del simulacro: si alguien fijó un escenario, tiene que poder
     soltarlo desde donde esté, y el acceso es donde más fácil es quedarse
     atrapado.

     El marcado vive aqui y edoc.js lo pide, para no tener dos copias que se
     separen con el tiempo.                                                 */

  // El mismo trazo que usa edoc.js. Va repetido porque en el acceso edoc.js no
  // existe, y son dos lineas.
  var SVG_ALERTA =
    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M10 2.9 18 16.8H2z"/><path d="M10 8v3.4"/><path d="M10 14h.01"/></svg>';

  API.barraHTML = function () {
    if (!API.hayMantenimiento) return '';
    return '<div class="edoc-estado-sistema edoc-estado-sistema--advertencia" role="alert">' +
      '<span class="edoc-estado-sistema__icono">' + SVG_ALERTA + '</span>' +
      '<span><strong>Portal en mantenimiento.</strong> Dura hasta ' + API.hasta() + ' y puede que ' +
      'algunas funciones no respondan como siempre. Puedes seguir consultando; si algo no te deja ' +
      'continuar, <a href="#" data-sin-destino>escríbenos</a>.</span>' +
    '</div>';
  };

  var NOMBRES = {
    nada: 'Sin mensajes',
    alertas: 'Alertas',
    mantenimiento: 'Mantenimiento',
    todo: 'Mantenimiento y alertas'
  };

  /* La salida del simulacro. Solo aparece cuando hay un escenario fijado a mano
     o pedido por enlace: durante el sorteo no, porque ahí el escenario es justo
     lo que se quiere que vean los evaluadores. */
  function montarChincheta() {
    if (API.modo !== 'fijo' && API.modo !== 'enlace') return;
    if (document.getElementById('edoc-chincheta')) return;

    var comoLlego = API.modo === 'enlace'
      ? 'Lo pide la dirección de esta página.'
      : 'Fijado desde el panel de alcance. Sigue puesto hasta que lo quites.';

    document.body.insertAdjacentHTML('beforeend',
      '<div class="edoc-chincheta" id="edoc-chincheta" role="status">' +
        '<span class="edoc-chincheta__t">Simulacro: <strong>' +
          (NOMBRES[API.escenario] || API.escenario) + '</strong></span>' +
        '<span class="edoc-chincheta__d">' + comoLlego + '</span>' +
        '<button type="button" class="edoc-chincheta__x" data-soltar-sim>' +
          'Volver al portal normal</button>' +
      '</div>');

    document.getElementById('edoc-chincheta')
      .querySelector('[data-soltar-sim]')
      .addEventListener('click', function () {
        if (API.modo === 'enlace') {
          /* Vino en la dirección, así que se quita de la dirección: soltar el
             fijado no serviría de nada mientras el parámetro siga ahí. */
          var url = new URL(window.location.href);
          url.searchParams.delete('sim');
          window.location.href = url.toString();
          return;
        }
        API.forzar('');
        window.location.reload();
      });
  }

  function montarSuelto() {
    /* Si hay armazón, la barra la coloca edoc.js en su sitio, debajo del
       encabezado. Aquí solo se cubre la pantalla que no tiene armazón. */
    if (!document.getElementById('armazon') && API.hayMantenimiento &&
        !document.querySelector('.edoc-estado-sistema')) {
      document.body.insertAdjacentHTML('afterbegin', API.barraHTML());
      document.body.classList.add('con-barra-estado');
    }
    montarChincheta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montarSuelto);
  } else {
    montarSuelto();
  }
}());
