// Contraseñas con scrypt y sesión en una cookie HttpOnly firmada con HMAC. Sin dependencias.
import crypto from 'node:crypto';
import { query, esquema } from './db.js';

const COOKIE = 'syn_sesion';
const DURACION_S = 30 * 24 * 3600;

function secreto() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error('SESSION_SECRET debe tener al menos 32 caracteres');
  return s;
}

export function hashClave(clave) {
  const sal = crypto.randomBytes(16);
  const h = crypto.scryptSync(clave, sal, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${sal.toString('base64')}$${h.toString('base64')}`;
}

export function verificarClave(clave, guardado) {
  const [alg, sal, h] = String(guardado).split('$');
  if (alg !== 'scrypt' || !sal || !h) return false;
  const esperado = Buffer.from(h, 'base64');
  const calculado = crypto.scryptSync(clave, Buffer.from(sal, 'base64'), esperado.length, { N: 16384, r: 8, p: 1 });
  return crypto.timingSafeEqual(esperado, calculado);
}

const b64 = s => Buffer.from(s).toString('base64url');
const firma = datos => crypto.createHmac('sha256', secreto()).update(datos).digest('base64url');

export function crearCookie(usuarioId) {
  const datos = b64(JSON.stringify({ u: usuarioId, exp: Math.floor(Date.now() / 1000) + DURACION_S }));
  const token = `${datos}.${firma(datos)}`;
  return `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${DURACION_S}`;
}
export const borrarCookie = () => `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;

function leerToken(req) {
  const m = String(req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return null;
  const [datos, f] = m[1].split('.');
  if (!datos || !f) return null;
  const esperada = firma(datos);
  if (f.length !== esperada.length || !crypto.timingSafeEqual(Buffer.from(f), Buffer.from(esperada))) return null;
  try {
    const p = JSON.parse(Buffer.from(datos, 'base64url').toString());
    return p.exp > Date.now() / 1000 ? p.u : null;
  } catch { return null; }
}

export async function usuarioDe(req) {
  const id = leerToken(req);
  if (!id) return null;
  await esquema();
  const r = await query('select id, nombre, correo, aceptaciones, creado from usuarios where id = $1', [id]);
  return r.rows[0] || null;
}

export const nuevoId = prefijo => `${prefijo}-${crypto.randomBytes(9).toString('base64url')}`;
