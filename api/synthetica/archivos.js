// Archivos privados de cada cuenta en Vercel Blob. Nadie los abre con un enlace público:
// se descargan por aquí, con la sesión de su dueño.
//   GET    /api/archivos?p=<pathname>&nombre=<nombre>  → el archivo
//   DELETE /api/archivos { pathnames: [...] }          → los borra
// Solo se aceptan rutas dentro de u/<id de la cuenta>/.
import { get, del } from '@vercel/blob';
import { Readable } from 'node:stream';
import { usuarioDe } from '../_synthetica/sesion.js';
import { responder, exigirOrigenPropio, cuerpo } from '../_synthetica/http.js';

const propia = (u, p) => typeof p === 'string' && p.startsWith(`u/${u.id}/`) && !p.includes('..');

export default async function handler(req, res) {
  if (!exigirOrigenPropio(req, res)) return;
  try {
    const u = await usuarioDe(req);
    if (!u) return responder(res, 401, { error: 'Sin sesión' });
    if (req.method === 'GET') {
      const q = new URL(req.url, 'http://x').searchParams;
      const p = q.get('p');
      if (!propia(u, p)) return responder(res, 404, { error: 'No existe' });
      const r = await get(p, { access: 'private' });
      if (!r || r.statusCode !== 200) return responder(res, 404, { error: 'No existe' });
      const nombre = (q.get('nombre') || p.split('/').pop()).replace(/[\r\n"]/g, '');
      res.statusCode = 200;
      res.setHeader('Content-Type', r.blob.contentType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(nombre)}`);
      res.setHeader('Cache-Control', 'private, no-store');
      return Readable.fromWeb(r.stream).pipe(res);
    }
    if (req.method !== 'DELETE') return responder(res, 405, { error: 'Método no permitido' });
    const { pathnames = [] } = await cuerpo(req);
    const propias = pathnames.filter(p => propia(u, p));
    if (propias.length) await del(propias);
    return responder(res, 200, { borrados: propias.length });
  } catch (e) {
    console.error('archivos', e);
    return responder(res, 500, { error: 'No se pudo completar la operación con los archivos' });
  }
}
