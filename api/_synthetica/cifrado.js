// Cifrado de las credenciales de los proyectos con AES-256-GCM. La clave se deriva de SESSION_SECRET con HKDF
// (con su propia etiqueta), así que no hace falta otra variable de entorno. Formato: v1.<iv>.<etiqueta>.<datos> en base64url.
import crypto from 'node:crypto';

function clave() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error('SESSION_SECRET debe tener al menos 32 caracteres');
  return Buffer.from(crypto.hkdfSync('sha256', s, 'synthetica', 'credenciales-v1', 32));
}

export function cifrar(objeto) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', clave(), iv);
  const datos = Buffer.concat([c.update(JSON.stringify(objeto), 'utf8'), c.final()]);
  return ['v1', iv, c.getAuthTag(), datos].map(x => typeof x === 'string' ? x : x.toString('base64url')).join('.');
}

export function descifrar(texto) {
  const [v, iv, etiqueta, datos] = String(texto).split('.');
  if (v !== 'v1') throw new Error('Formato de cifrado desconocido');
  const d = crypto.createDecipheriv('aes-256-gcm', clave(), Buffer.from(iv, 'base64url'));
  d.setAuthTag(Buffer.from(etiqueta, 'base64url'));
  return JSON.parse(Buffer.concat([d.update(Buffer.from(datos, 'base64url')), d.final()]).toString('utf8'));
}
