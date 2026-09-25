// Lo que el equipo publica para una cuenta (el recorrido interactivo del estudio y sus capturas).
// Es privado: se sirve solo con la sesión de su dueño, desde u/<cuenta>/publicado/.
//   GET /work/synthetica-plataforma/publicado/<proyecto>/recorrido/index.html  (vercel.json lo reescribe aquí)
import { get } from '@vercel/blob';
import { Readable } from 'node:stream';
import { usuarioDe } from '../_synthetica/sesion.js';
import { responder } from '../_synthetica/http.js';

const TIPOS = { html: 'text/html; charset=utf-8', js: 'text/javascript; charset=utf-8', css: 'text/css; charset=utf-8', json: 'application/json',
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml', webp: 'image/webp', woff2: 'font/woff2' };

export default async function handler(req, res) {
  if (req.method !== 'GET') return responder(res, 405, { error: 'Método no permitido' });
  try {
    const u = await usuarioDe(req);
    if (!u) return responder(res, 401, { error: 'Ingresa a Synthetica para ver este recorrido' });
    const ruta = String(new URL(req.url, 'http://x').searchParams.get('ruta') || '');
    if (!ruta || ruta.includes('..') || ruta.startsWith('/')) return responder(res, 404, { error: 'No existe' });
    const r = await get(`u/${u.id}/publicado/${ruta}`, { access: 'private' });
    if (!r || r.statusCode !== 200) return responder(res, 404, { error: 'No existe' });
    res.statusCode = 200;
    res.setHeader('Content-Type', TIPOS[ruta.split('.').pop().toLowerCase()] || r.blob.contentType || 'application/octet-stream');
    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return Readable.fromWeb(r.stream).pipe(res);
  } catch (e) {
    console.error('publicado', e);
    return responder(res, 500, { error: 'No se pudo abrir' });
  }
}
