// Cuentas: crear, ingresar, salir, quién soy y aceptar documentos legales nuevos.
//   POST /api/cuenta?accion=registro  { nombre, correo, clave, acepta }
//   POST /api/cuenta?accion=ingreso   { correo, clave }
//   POST /api/cuenta?accion=salir
//   POST /api/cuenta?accion=aceptar   { acepta }
//   GET  /api/cuenta?accion=yo
import { query, esquema } from '../_synthetica/db.js';
import { hashClave, verificarClave, crearCookie, borrarCookie, usuarioDe, nuevoId } from '../_synthetica/sesion.js';
import { responder, exigirOrigenPropio, cuerpo, LEGAL_VIGENTE } from '../_synthetica/http.js';

// Las cuentas del equipo Synthetica (CORREOS_EQUIPO, separados por comas) ven la vista interna.
const equipo = correo => String(process.env.CORREOS_EQUIPO || '').toLowerCase().split(',').map(x => x.trim()).filter(Boolean).includes(correo);
const publico = u => ({ id: u.id, nombre: u.nombre, correo: u.correo, aceptaciones: u.aceptaciones || [], equipo: equipo(u.correo) });
const aceptacionesVigentes = () => ['terminos', 'privacidad'].map(documento => ({ documento, version: LEGAL_VIGENTE[documento], fecha: new Date().toISOString() }));
const correoValido = c => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c);

export default async function handler(req, res) {
  if (!exigirOrigenPropio(req, res)) return;
  const accion = new URL(req.url, 'http://x').searchParams.get('accion');
  try {
    await esquema();
    if (req.method === 'GET' && accion === 'yo') {
      const u = await usuarioDe(req);
      return u ? responder(res, 200, { cuenta: publico(u) }) : responder(res, 401, { error: 'Sin sesión' });
    }
    if (req.method !== 'POST') return responder(res, 405, { error: 'Método no permitido' });
    const d = await cuerpo(req);

    if (accion === 'registro') {
      const nombre = String(d.nombre || '').trim().slice(0, 120);
      const correo = String(d.correo || '').trim().toLowerCase().slice(0, 200);
      const clave = String(d.clave || '');
      if (!nombre) return responder(res, 400, { error: 'Escribe tu nombre.' });
      if (!correoValido(correo)) return responder(res, 400, { error: 'Revisa el correo.' });
      if (clave.length < 10 || clave.length > 200) return responder(res, 400, { error: 'La contraseña debe tener al menos 10 caracteres.' });
      if (d.acepta !== true) return responder(res, 400, { error: 'Para crear la cuenta debes aceptar los Términos y la Política de privacidad.' });
      const existe = await query('select 1 from usuarios where correo = $1', [correo]);
      if (existe.rows.length) return responder(res, 409, { error: 'Ya hay una cuenta con ese correo. Ingresa con ella.' });
      const u = { id: nuevoId('c'), nombre, correo, aceptaciones: aceptacionesVigentes() };
      await query('insert into usuarios (id, nombre, correo, clave_hash, aceptaciones) values ($1, $2, $3, $4, $5)',
        [u.id, nombre, correo, hashClave(clave), JSON.stringify(u.aceptaciones)]);
      return responder(res, 201, { cuenta: publico(u) }, { 'Set-Cookie': crearCookie(u.id) });
    }

    if (accion === 'ingreso') {
      const correo = String(d.correo || '').trim().toLowerCase();
      const r = await query('select id, nombre, correo, clave_hash, aceptaciones from usuarios where correo = $1', [correo]);
      const u = r.rows[0];
      // Mismo mensaje y mismo trabajo tanto si el correo existe como si no.
      const ok = u ? verificarClave(String(d.clave || ''), u.clave_hash) : (verificarClave('x', 'scrypt$AAAAAAAAAAAAAAAAAAAAAA==$' + 'A'.repeat(86)), false);
      if (!ok) return responder(res, 401, { error: 'El correo o la contraseña no coinciden.' });
      return responder(res, 200, { cuenta: publico(u) }, { 'Set-Cookie': crearCookie(u.id) });
    }

    if (accion === 'salir') return responder(res, 200, { ok: true }, { 'Set-Cookie': borrarCookie() });

    if (accion === 'aceptar') {
      const u = await usuarioDe(req);
      if (!u) return responder(res, 401, { error: 'Sin sesión' });
      if (d.acepta !== true) return responder(res, 400, { error: 'Marca la casilla para continuar.' });
      const nuevas = [...(u.aceptaciones || []), ...aceptacionesVigentes()];
      await query('update usuarios set aceptaciones = $2 where id = $1', [u.id, JSON.stringify(nuevas)]);
      return responder(res, 200, { cuenta: publico({ ...u, aceptaciones: nuevas }) });
    }
    return responder(res, 400, { error: 'Acción desconocida' });
  } catch (e) {
    console.error('cuenta', e);
    return responder(res, 500, { error: 'No pudimos completar la operación. Intenta de nuevo.' });
  }
}
