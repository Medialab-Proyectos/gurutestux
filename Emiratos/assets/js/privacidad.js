/* Privacidad: lo común a Mi perfil (pestaña Privacidad), la re-aceptación de
   los términos al entrar y la bandeja interna de solicitudes.

   En Emiratos manda la ley de datos personales de Emiratos (PDPL, Decreto-ley
   federal 45/2021, arts. 13 a 19). El componente sigue el RGPD (arts. 15 a 21),
   que es más exigente y la cubre. La PDPL no fija plazo de respuesta hasta que
   se publique su reglamento (art. 28): damos un mes, prorrogable dos más
   avisando a la persona (RGPD, art. 12.3). Fuentes: docs/privacidad-emiratos.md.

   En la maqueta todo vive en el navegador (localStorage) para que lo que pide
   la persona en su perfil aparezca en la bandeja interna y la respuesta vuelva
   a su perfil. En el producto, en la base de datos. */
(function () {
  'use strict';

  var LLAVE_SOL = 'edoc-privacidad-solicitudes';
  var LLAVE_ACE = 'edoc-privacidad-aceptaciones';

  var YO = {
    persona: 'Fatima Al Marzooqi', usuario: 'fatima.almarzooqi',
    correo: 'f.almarzooqi@alnoor.ae', empresa: 'Al Noor Trading LLC'
  };

  var TIPOS = {
    corregir: 'Corregir un dato',
    limitar: 'Limitar el uso',
    oponerse: 'Oponerse a un uso',
    eliminar: 'Eliminar la cuenta'
  };

  var ESTADOS = {
    recibida: ['Recibida', 'neutro'],
    prorrogada: ['Prorrogada', 'advertencia'],
    respondida: ['Respondida', 'exito']
  };

  function leer(llave) {
    try { return JSON.parse(window.localStorage.getItem(llave) || 'null'); } catch (e) { return null; }
  }
  function guardar(llave, valor) {
    try { window.localStorage.setItem(llave, JSON.stringify(valor)); } catch (e) { /* nada */ }
  }

  function dos(n) { return (n < 10 ? '0' : '') + n; }
  function fecha(d) { d = new Date(d); return dos(d.getDate()) + '/' + dos(d.getMonth() + 1) + '/' + d.getFullYear(); }
  function fechaHora(d) { d = new Date(d); return fecha(d) + ' ' + dos(d.getHours()) + ':' + dos(d.getMinutes()); }

  /* Un mes de calendario, como dice el RGPD: del 31 de enero al 28 de febrero. */
  function masMeses(d, n) {
    d = new Date(d);
    var dia = d.getDate();
    d.setMonth(d.getMonth() + n);
    if (d.getDate() < dia) d.setDate(0);
    return d;
  }
  function masDias(d, n) { d = new Date(d); d.setDate(d.getDate() + n); return d; }
  function diasHasta(d) {
    var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    var fin = new Date(d); fin.setHours(0, 0, 0, 0);
    return Math.round((fin - hoy) / 86400000);
  }

  /* Ejemplos de otras personas, para que la bandeja no salga vacía. Las
     fechas van relativas a hoy para que se vean los tres semáforos. */
  function ejemplos() {
    var hoy = new Date();
    var r1 = masDias(hoy, -27), r2 = masDias(hoy, -9), r3 = masDias(hoy, -40);
    return [
      { id: 'PRV-1041', tipo: 'eliminar', detalle: 'Ya no trabajo en la empresa. Quiero que borren mi usuario.',
        persona: 'Sara Mansour', usuario: 'sara.mansour', correo: 's.mansour@gulfmarine.ae',
        empresa: 'Gulf Marine Services', recibida: r1.toISOString(), plazo: masMeses(r1, 1).toISOString(),
        estado: 'recibida', identidad: true, respuesta: '' },
      { id: 'PRV-1046', tipo: 'corregir', detalle: 'Mi cargo es Director financiero, no Contador.',
        persona: 'Omar Haddad', usuario: 'omar.haddad', correo: 'o.haddad@alnoor.ae',
        empresa: 'Al Noor Trading LLC', recibida: r2.toISOString(), plazo: masMeses(r2, 1).toISOString(),
        estado: 'recibida', identidad: false, respuesta: '' },
      { id: 'PRV-1032', tipo: 'limitar', detalle: 'No usen mis registros de acceso mientras revisan una incidencia.',
        persona: 'Layla Nasser', usuario: 'layla.nasser', correo: 'l.nasser@desertfoods.ae',
        empresa: 'Desert Foods FZE', recibida: r3.toISOString(), plazo: masMeses(r3, 1).toISOString(),
        estado: 'respondida', identidad: true,
        respuesta: 'Limitado el uso de tus registros de acceso hasta cerrar la incidencia.' }
    ];
  }

  function solicitudes() {
    var lista = leer(LLAVE_SOL);
    if (!lista) { lista = ejemplos(); guardar(LLAVE_SOL, lista); }
    return lista;
  }
  function mias() {
    return solicitudes().filter(function (s) { return s.usuario === YO.usuario; });
  }

  function nueva(tipo, detalle) {
    var lista = solicitudes();
    var ahora = new Date();
    var numero = 1050 + lista.length;
    var s = {
      id: 'PRV-' + numero, tipo: tipo, detalle: detalle || '',
      persona: YO.persona, usuario: YO.usuario, correo: YO.correo, empresa: YO.empresa,
      recibida: ahora.toISOString(), plazo: masMeses(ahora, 1).toISOString(),
      estado: 'recibida', identidad: false, respuesta: ''
    };
    lista.unshift(s);
    guardar(LLAVE_SOL, lista);
    return s;
  }

  function actualizar(id, cambios) {
    var lista = solicitudes();
    lista.forEach(function (s) {
      if (s.id === id) Object.keys(cambios).forEach(function (k) { s[k] = cambios[k]; });
    });
    guardar(LLAVE_SOL, lista);
  }

  /* Lo que aceptó: qué documento, qué versión, cómo y cuándo. Sin esto una
     aceptación no prueba nada: hay que poder demostrarla (PDPL, art. 6.A;
     RGPD, art. 7.1). */
  function aceptaciones() {
    return leer(LLAVE_ACE) || [
      { doc: 'Términos de servicio', version: '1.0', como: 'Aceptados', cuando: '2026-09-02T10:41:00' },
      { doc: 'Política de privacidad', version: '1.0', como: 'Leída', cuando: '2026-09-02T10:41:00' }
    ];
  }
  function registrarAceptacion(doc, version, como) {
    var lista = aceptaciones();
    lista.unshift({ doc: doc, version: version, como: como, cuando: new Date().toISOString() });
    guardar(LLAVE_ACE, lista);
  }

  window.EDOC_PRIVACIDAD = {
    YO: YO, TIPOS: TIPOS, ESTADOS: ESTADOS,
    solicitudes: solicitudes, mias: mias, nueva: nueva, actualizar: actualizar,
    aceptaciones: aceptaciones, registrarAceptacion: registrarAceptacion,
    fecha: fecha, fechaHora: fechaHora, masMeses: masMeses, diasHasta: diasHasta
  };
}());
