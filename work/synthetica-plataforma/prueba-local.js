// Prueba local del modo nube sin Vercel: Postgres embebido (PGlite) y archivos en una carpeta
// temporal en lugar de Vercel Blob. Uso, desde la raíz del repositorio: npm run synthetica:local
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
import { usarBaseDePrueba } from '../../api/_synthetica/db.js';
import { usuarioDe } from '../../api/_synthetica/sesion.js';

process.env.SESSION_SECRET ||= 'prueba-local-'.padEnd(48, 'x');
process.env.CORREOS_EQUIPO ||= 'equipo@prueba.local';
const pg = new PGlite();
usarBaseDePrueba((t, p) => pg.query(t, p));
// Sirve el repositorio como Vercel: la página en /work/synthetica-plataforma/ y la API en api/synthetica/.
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BASE = '/work/synthetica-plataforma';
const BLOBS = fs.mkdtempSync(path.join(os.tmpdir(), 'synthetica-blob-'));
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const PUERTO = +process.env.PUERTO || 8790;

// Sustituto de vendor/blob-cliente.js: sube el archivo a esta prueba en vez de a Vercel Blob.
const BLOB_FALSO = `export async function upload(pathname, file, o) {
  const r = await fetch('/__blob?p=' + encodeURIComponent(pathname), { method: 'PUT', body: file, headers: { 'x-synthetica': '1' } });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}`;

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  try {
    if (url.pathname === BASE + '/vendor/blob-cliente.js') { res.setHeader('Content-Type', TIPOS['.js']); return res.end(BLOB_FALSO); }
    if (url.pathname === '/__blob') {
      const u = await usuarioDe(req);
      const p = url.searchParams.get('p');
      if (!u || !p.startsWith(`u/${u.id}/`)) { res.statusCode = 403; return res.end('no'); }
      const trozos = []; for await (const t of req) trozos.push(t);
      const datos = Buffer.concat(trozos);
      if (datos.length > 10 * 1024 * 1024) { res.statusCode = 413; return res.end('grande'); }
      const final = p.replace(/(\.[^./]+)?$/, m => '-' + Math.random().toString(36).slice(2, 8) + m);
      fs.mkdirSync(path.join(BLOBS, path.dirname(final)), { recursive: true });
      fs.writeFileSync(path.join(BLOBS, final), datos);
      res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ pathname: final }));
    }
    if (url.pathname === BASE + '/api/archivos' && req.method === 'GET') {
      const u = await usuarioDe(req); const p = url.searchParams.get('p');
      if (!u || !p.startsWith(`u/${u.id}/`) || p.includes('..')) { res.statusCode = 404; return res.end(); }
      res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(url.searchParams.get('nombre') || 'archivo')}`);
      return fs.createReadStream(path.join(BLOBS, p)).on('error', () => { res.statusCode = 404; res.end(); }).pipe(res);
    }
    if (url.pathname === BASE + '/api/equipo' && url.searchParams.get('accion') === 'archivo') {
      const u = await usuarioDe(req); const p = url.searchParams.get('p') || '';
      if (!u || !process.env.CORREOS_EQUIPO.split(',').includes(u.correo) || p.includes('..')) { res.statusCode = 403; return res.end(); }
      return fs.createReadStream(path.join(BLOBS, p)).on('error', () => { res.statusCode = 404; res.end(); }).pipe(res);
    }
    if (url.pathname === BASE + '/api/archivos' && req.method === 'DELETE') {
      const u = await usuarioDe(req); const trozos = []; for await (const t of req) trozos.push(t);
      const { pathnames = [] } = JSON.parse(Buffer.concat(trozos).toString() || '{}');
      let n = 0; for (const p of pathnames) if (u && p.startsWith(`u/${u.id}/`) && !p.includes('..')) { fs.rmSync(path.join(BLOBS, p), { force: true }); n++; }
      res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ borrados: n }));
    }
    const m = url.pathname.match(/^\/work\/synthetica-plataforma\/api\/([a-z]+)$/);
    if (m && fs.existsSync(path.join(RAIZ, 'api', 'synthetica', m[1] + '.js'))) {
      const { default: h } = await import(`../../api/synthetica/${m[1]}.js`);
      return await h(req, res);
    }
    let f = path.join(RAIZ, decodeURIComponent(url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname));
    if (!f.startsWith(RAIZ) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end('No existe'); }
    res.setHeader('Content-Type', TIPOS[path.extname(f)] || 'application/octet-stream');
    fs.createReadStream(f).pipe(res);
  } catch (e) { console.error(e); res.statusCode = 500; res.end('error'); }
}).listen(PUERTO, () => console.log(`Prueba del modo nube en http://localhost:${PUERTO}${BASE}/ (archivos en ${BLOBS})`));
