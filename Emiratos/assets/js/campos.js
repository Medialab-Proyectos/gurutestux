/* Dos arreglos que tienen que valer en TODO el portal, incluida la pantalla de
   acceso. Van aquí y no dentro de `edoc.js` porque el acceso no carga el
   armazón —no tiene menú ni encabezado— y se quedaba fuera justo la pantalla
   donde más se notan.

   Los dos salen de los Quick Wins del portal de Francia:

   · Recortar espacios (17). Pegar un código desde el correo arrastra un espacio
     final, el acceso falla y el mensaje no dice que sobra un carácter
     invisible. Falló durante la propia demostración interna del equipo. Se
     recorta al salir del campo, para que además se vea.

   · Ver la contraseña (19). Allí hay tres campos de contraseña sin un botón
     para mirar lo escrito, así que el usuario descubre las reglas fallando.
     Su propio login sí lo tiene; las pantallas de dentro, no. */
(function () {
  'use strict';

  var OJO = '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" ' +
    'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M1.8 10S4.9 4.5 10 4.5 18.2 10 18.2 10 15.1 15.5 10 15.5 1.8 10 1.8 10Z"/>' +
    '<circle cx="10" cy="10" r="2.6"/></svg>';

  function icono() {
    // Si el armazón está cargado se usa su juego de iconos, para que no haya dos.
    return window.edocIcono ? window.edocIcono('ver') : OJO;
  }

  var ESCRIBIBLES = ['text', 'email', 'search', 'tel', 'url'];

  function recortar() {
    document.addEventListener('blur', function (e) {
      var c = e.target;
      if (!c || c.tagName !== 'INPUT') return;
      if (ESCRIBIBLES.indexOf(c.type) < 0) return;
      var limpio = (c.value || '').trim();
      if (limpio !== c.value) {
        c.value = limpio;
        c.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, true);
  }

  function ponerOjo(campo) {
    if (campo.dataset.conOjo) return;
    campo.dataset.conOjo = '1';

    var caja = document.createElement('div');
    caja.className = 'edoc-clave-caja';
    campo.parentNode.insertBefore(caja, campo);
    caja.appendChild(campo);

    var boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'edoc-clave-ojo';
    boton.setAttribute('aria-label', 'Mostrar la contraseña');
    boton.setAttribute('aria-pressed', 'false');
    boton.innerHTML = icono();
    boton.addEventListener('click', function () {
      var visible = campo.type === 'text';
      campo.type = visible ? 'password' : 'text';
      boton.setAttribute('aria-pressed', visible ? 'false' : 'true');
      boton.setAttribute('aria-label', visible ? 'Mostrar la contraseña' : 'Ocultar la contraseña');
      campo.focus();
    });
    caja.appendChild(boton);
  }

  function mirar() {
    document.querySelectorAll('input[type="password"]').forEach(ponerOjo);
  }

  function arrancar() {
    recortar();
    mirar();
    /* Los campos de contraseña que nacen después —una ventana de alta, un paso
       del asistente— también lo necesitan. */
    if (window.MutationObserver) {
      new window.MutationObserver(mirar).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
}());

/* --- El plazo del codigo, contando -----------------------------------------
   Un codigo de un solo uso caduca, y decirlo en una tabla ('es un parametro',
   'son cinco minutos') no le sirve a quien lo esta escribiendo. Lo que sirve es
   ver cuanto queda.

   Se pone en cualquier elemento con data-cuenta-atras="<segundos>". Al llegar a
   cero deja de valer y se dice, en vez de dejar que lo escriba y falle.

       <p data-cuenta-atras="300" data-reloj-para="#boton-confirmar"></p>

   El naranja del ultimo minuto es el de ADVERTENCIA del manual de marca, que es
   exactamente lo que es: un aviso de que se acaba el tiempo.                */
(function () {
  'use strict';

  function pinta(el, quedan) {
    var m = Math.floor(quedan / 60);
    var sg = quedan % 60;
    el.innerHTML = 'El código caduca en <strong class="cifra">' +
      m + ':' + (sg < 10 ? '0' : '') + sg + '</strong>';
    el.classList.toggle('edoc-reloj--poco', quedan <= 60);
  }

  function caducado(el) {
    el.innerHTML = '<strong>El código ha caducado.</strong> Pide uno nuevo para seguir.';
    el.classList.remove('edoc-reloj--poco');
    el.classList.add('edoc-reloj--fuera');
    var destino = el.dataset.relojPara && document.querySelector(el.dataset.relojPara);
    if (destino) destino.disabled = true;
  }

  function arranca(el) {
    if (el._relojEdoc) window.clearInterval(el._relojEdoc);
    var quedan = parseInt(el.dataset.cuentaAtras, 10) || 300;
    el.classList.remove('edoc-reloj--fuera');
    var destino = el.dataset.relojPara && document.querySelector(el.dataset.relojPara);
    if (destino) destino.disabled = false;
    pinta(el, quedan);
    el._relojEdoc = window.setInterval(function () {
      quedan -= 1;
      if (quedan <= 0) {
        window.clearInterval(el._relojEdoc);
        el._relojEdoc = null;
        caducado(el);
        return;
      }
      pinta(el, quedan);
    }, 1000);
  }

  /* Se vuelve a arrancar al pedir otro codigo, y al abrir el paso del codigo:
     el contador tiene que empezar cuando el codigo se manda, no cuando se cargo
     la pagina. */
  window.edocReloj = function (donde) {
    var el = typeof donde === 'string' ? document.querySelector(donde) : donde;
    if (el) arranca(el);
  };

  /* Casi todos los contadores nacen escondidos: el paso del codigo aparece
     despues de la contrasena, o dentro de un modal. Arrancarlos al cargar la
     pagina seria contar un plazo que todavia no ha empezado, y dejarlo a que
     cada pantalla llame a edocReloj() ya fallo -en recuperar y en credenciales
     me olvide de llamarlo y el contador se quedaba en blanco-.

     Asi que arrancan solos en cuanto se ven, y no hay nada que recordar. */
  function vigilar() {
    if (!window.IntersectionObserver) {
      // Sin observador, al menos los que ya se ven.
      document.querySelectorAll('[data-cuenta-atras]').forEach(function (el) {
        if (el.offsetParent !== null) arranca(el);
      });
      return;
    }
    var ojo = new window.IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting && !e.target._relojEdoc) arranca(e.target);
      });
    });
    document.querySelectorAll('[data-cuenta-atras]').forEach(function (el) {
      ojo.observe(el);
    });
  }

  function alArrancar() { vigilar(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', alArrancar);
  } else {
    alArrancar();
  }
}());

/* --- Pegar el código ------------------------------------------------------
   El código llega por correo y lo normal es copiarlo. Al pegar puede venir con
   espacios («482 913»), con guion o dentro de una frase («Tu código es
   482913»). Con maxlength=6 el campo se quedaba con «Tu cód» y nadie
   entendía por qué fallaba. Se quedan las cifras y nada más.            */
(function () {
  'use strict';

  var CAMPO = 'input[autocomplete="one-time-code"]';

  function soloCifras(el, texto) {
    var tope = parseInt(el.getAttribute('maxlength'), 10) || 6;
    el.value = String(texto || '').replace(/\D+/g, '').slice(0, tope);
    // Que se enteren quienes escuchan el campo: el contador, la validación.
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  document.addEventListener('paste', function (e) {
    var el = e.target;
    if (!el || !el.matches || !el.matches(CAMPO)) return;
    var datos = e.clipboardData || window.clipboardData;
    if (!datos) return;
    e.preventDefault();
    soloCifras(el, datos.getData('text'));
  });

  /* También al escribir: el autocompletado del móvil a veces mete un espacio. */
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (!el || !el.matches || !el.matches(CAMPO)) return;
    if (/\D/.test(el.value)) soloCifras(el, el.value);
  });
}());
