/* ==========================================================================
   eDoc Emiratos · idioma del portal
   Un solo selector para todo el recorrido. Antes había dos: en el acceso un
   desplegable con English / Español / العربية y dentro del portal una pastilla
   fija que ponía «en-AE» y no se podía abrir. Eran dos vocabularios distintos
   —nombres de idioma frente a código de configuración regional— y lo que
   elegías al entrar no llegaba a ninguna parte.

   Aquí se define la lista una vez y la pintan por igual el acceso, la barra
   superior y el menú de la cuenta en móvil.

   La lista incluye español porque la maqueta está escrita en español: un
   selector que dijera «en-AE» sobre una pantalla en castellano no informaba de
   nada, solo parecía un fallo. Aquí el código que se ve es siempre el idioma
   que se está leyendo.

   Ojo con lo que esto NO dice: el portal real se declara a la autoridad en
   inglés, o en inglés y árabe. El español es el idioma de esta revisión, no
   del producto. Esa decisión sigue anotada en las Bases de diseño.
   ========================================================================== */
(function () {
  'use strict';

  var LLAVE = 'edoc-idioma';

  var IDIOMAS = [
    { codigo: 'ES', nombre: 'Español', dir: 'ltr' },
    { codigo: 'EN', nombre: 'English', dir: 'ltr' },
    { codigo: 'AR', nombre: 'العربية', dir: 'rtl' }
  ];
  window.EDOC_IDIOMAS = IDIOMAS;

  function ficha(codigo) {
    return IDIOMAS.filter(function (i) { return i.codigo === codigo; })[0] || IDIOMAS[0];
  }

  function actual() {
    try { return ficha(window.localStorage.getItem(LLAVE)).codigo; }
    catch (error) { return IDIOMAS[0].codigo; }
  }
  window.edocIdioma = actual;

  /* El icono vive en edoc.js, que no está en la pantalla de acceso; si no está,
     se dibuja aquí el mismo trazo. */
  function icono() {
    if (window.edocIcono) return window.edocIcono('idioma');
    return '<svg class="edoc-icono" viewBox="0 0 20 20" fill="none" stroke="currentColor" ' +
      'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M2.8 5.6h8.4"/><path d="M7 3.4v2.2"/><path d="M9.1 5.6c0 3.2-2.5 6-6.3 7.1"/>' +
      '<path d="M5 9.2c1 1.7 2.7 3 4.6 3.5"/><path d="m10.8 16.6 3.2-8 3.2 8"/>' +
      '<path d="M11.9 14.2h4.2"/></svg>';
  }

  /* Las opciones, iguales en los tres sitios donde aparecen. */
  function opciones() {
    var elegido = actual();
    return '<li><h6 class="dropdown-header">Idioma del portal</h6></li>' +
      IDIOMAS.map(function (i) {
        return '<li><button type="button" class="dropdown-item edoc-idioma__opcion' +
          (i.codigo === elegido ? ' activo' : '') + '" data-idioma="' + i.codigo + '">' +
          '<span class="edoc-idioma__nombre"' + (i.dir === 'rtl' ? ' lang="ar" dir="rtl"' : '') + '>' +
            i.nombre + '</span>' +
          '<span class="edoc-idioma__codigo cifra">' + i.codigo + '</span>' +
          '</button></li>';
      }).join('');
  }
  window.edocIdiomaOpciones = opciones;

  /* El selector completo: la misma pastilla en el acceso y en la barra. La
     variante «claro» es para fondo blanco, la de por defecto para el azul. */
  function selector(variante) {
    return '<div class="dropdown edoc-idioma' + (variante ? ' edoc-idioma--' + variante : '') + '">' +
      '<button type="button" class="edoc-btn-util edoc-btn-util--idioma" data-toggle="dropdown" ' +
        'aria-haspopup="true" aria-expanded="false" ' +
        'title="Idioma del portal">' +
        icono() +
        '<span class="edoc-btn-util__codigo" data-idioma-activo>' + actual() + '</span>' +
        '<svg class="edoc-btn-util__chevron" viewBox="0 0 10 6" aria-hidden="true">' +
        '<path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4" ' +
        'stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<ul class="dropdown-menu dropdown-menu-right edoc-idioma__lista">' + opciones() + '</ul>' +
    '</div>';
  }
  window.edocSelectorIdioma = selector;

  /* Deja todos los selectores de la página diciendo lo mismo. */
  function repintar() {
    var elegido = actual();
    document.querySelectorAll('[data-idioma-activo]').forEach(function (el) {
      el.textContent = elegido;
    });
    document.querySelectorAll('[data-idioma]').forEach(function (b) {
      b.classList.toggle('activo', b.dataset.idioma === elegido);
    });
  }
  window.edocPintarIdioma = repintar;

  function avisar(texto) {
    if (window.edocAvisar) { window.edocAvisar(texto); return; }
    /* En la pantalla de acceso no está la capa de avisos del portal. */
    var caja = document.getElementById('aviso-idioma');
    if (!caja) return;
    caja.textContent = texto;
    caja.hidden = false;
  }

  function elegir(codigo) {
    try { window.localStorage.setItem(LLAVE, ficha(codigo).codigo); } catch (error) { /* nada */ }
    repintar();
    var i = ficha(codigo);
    /* La maqueta no se traduce y hay que decirlo donde se pulsa, no en una nota
       aparte: si no, parece que el selector está roto. */
    avisar('Idioma del portal: ' + i.nombre + '. Los textos de la maqueta no se traducen; ' +
           'el control está para enseñar dónde vive y cómo se cambia.');
  }

  function arrancar() {
    document.querySelectorAll('[data-selector-idioma]').forEach(function (hueco) {
      hueco.innerHTML = selector(hueco.dataset.selectorIdioma || '');
    });
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-idioma]');
      if (!b) return;
      e.preventDefault();
      elegir(b.dataset.idioma);
    });
    repintar();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
