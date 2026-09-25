// Cuentas: crear, ingresar, salir, quién soy y aceptar documentos legales nuevos.
//   POST /api/cuenta?accion=registro  { nombre, correo, clave, acepta }
//   POST /api/cuenta?accion=ingreso   { correo, clave }
//   POST /api/cuenta?accion=salir
//   POST /api/cuenta?accion=aceptar   { acepta }
//   POST /api/cuenta?accion=olvide      { correo }         → envía un enlace para crear una contraseña nueva
//   POST /api/cuenta?accion=nueva-clave { token, clave }
//   GET  /api/cuenta?accion=yo
import crypto from 'node:crypto';
import { query, esquema } from '../_synthetica/db.js';
import { hashClave, verificarClave, crearCookie, borrarCookie, usuarioDe, nuevoId } from '../_synthetica/sesion.js';
import { responder, exigirOrigenPropio, cuerpo, LEGAL_VIGENTE } from '../_synthetica/http.js';

// Las cuentas del equipo Synthetica (CORREOS_EQUIPO, separados por comas) ven la vista interna.
const equipo = correo => String(process.env.CORREOS_EQUIPO || '').toLowerCase().split(',').map(x => x.trim()).filter(Boolean).includes(correo);
const publico = u => ({ id: u.id, nombre: u.nombre, correo: u.correo, aceptaciones: u.aceptaciones || [], equipo: equipo(u.correo) });
const aceptacionesVigentes = () => ['terminos', 'privacidad'].map(documento => ({ documento, version: LEGAL_VIGENTE[documento], fecha: new Date().toISOString() }));
const sha = t => crypto.createHash('sha256').update(t).digest('hex');
// Correo a una persona (recuperar la contraseña). Sin dominio verificado en Resend, solo llega al dueño de la cuenta de Resend.
async function enviarCorreo(para, asunto, texto) {
  if (!process.env.RESEND_API_KEY) return { ok: false, motivo: 'Sin RESEND_API_KEY' };
  const r = await fetch('https://api.resend.com/emails', { method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.CORREO_REMITENTE || 'Synthetica <onboarding@resend.dev>', to: [para], subject: asunto, text: texto }) });
  return r.ok ? { ok: true } : { ok: false, motivo: `${r.status} ${await r.text()}` };
}
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

    if (accion === 'olvide') {
      // Siempre la misma respuesta, exista o no la cuenta, para no revelar qué correos están registrados.
      const listo = { ok: true, mensaje: 'Si hay una cuenta con ese correo, te enviamos un enlace para crear una contraseña nueva. Revisa también el correo no deseado.' };
      const correo = String(d.correo || '').trim().toLowerCase();
      const r = await query('select id, nombre, correo from usuarios where correo = $1', [correo]);
      const u = r.rows[0];
      if (!u) return responder(res, 200, listo);
      const recientes = await query(`select count(*)::int as n from recuperaciones where usuario_id = $1 and creado > now() - interval '1 hour'`, [u.id]);
      if (recientes.rows[0].n >= 3) return responder(res, 200, listo);
      const token = crypto.randomBytes(32).toString('base64url');
      await query(`insert into recuperaciones (token_hash, usuario_id, vence) values ($1, $2, now() + interval '1 hour')`, [sha(token), u.id]);
      const origen = `https://${req.headers['x-forwarded-host'] || req.headers.host}`;
      const enlace = `${origen}/work/synthetica-plataforma/#/nueva-clave/${token}`;
      const envio = await enviarCorreo(u.correo, 'Crea tu contraseña nueva de Synthetica',
        `Hola, ${u.nombre}.

Para crear una contraseña nueva entra a este enlace (vence en 1 hora y sirve una sola vez):
${enlace}

Si no lo pediste, ignora este correo: tu contraseña no cambia.

Synthetica`);
      if (!envio.ok) console.error('recuperacion', u.correo, envio.motivo);
      return responder(res, 200, listo);
    }

    if (accion === 'nueva-clave') {
      const clave = String(d.clave || '');
      if (clave.length < 10 || clave.length > 200) return responder(res, 400, { error: 'La contraseña debe tener al menos 10 caracteres.' });
      const r = await query(`update recuperaciones set usado = true where token_hash = $1 and not usado and vence > now() returning usuario_id`, [sha(String(d.token || ''))]);
      if (!r.rows.length) return responder(res, 400, { error: 'El enlace venció o ya se usó. Pide uno nuevo desde «¿Olvidaste tu contraseña?».' });
      await query('update usuarios set clave_hash = $2 where id = $1', [r.rows[0].usuario_id, hashClave(clave)]);
      const u = (await query('select id, nombre, correo, aceptaciones from usuarios where id = $1', [r.rows[0].usuario_id])).rows[0];
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
