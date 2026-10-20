// Lo que el equipo publica para una cuenta: el recorrido del estudio, los informes y el espejo de las páginas de cada motor.
// Es privado: se sirve solo con la sesión de su dueño, desde u/<cuenta>/publicado/.
//   GET  /work/synthetica-plataforma/publicado/<proyecto>/<ruta>   (vercel.json lo reescribe aquí, con ?ruta=)
//   POST /work/synthetica-plataforma/publicado/<proyecto>/m/<ruta del motor>
//        relé: una acción del cliente desde una página del espejo. Si la ruta está entre las que declara el motor en la foto
//        del proyecto (foto.rutas_cliente), queda en el buzón y el vigilante la lleva al motor → 202 { ok, en_cola, id }.
//   GET  /work/synthetica-plataforma/api/publicado?buzon=<id>     cómo va esa acción (y la respuesta del motor, cuando está).
import { get } from '@vercel/blob';
import { Readable } from 'node:stream';
import { query, esquema } from '../_synthetica/db.js';
import { usuarioDe } from '../_synthetica/sesion.js';
import { responder, exigirOrigenPropio } from '../_synthetica/http.js';

const TIPOS = { html: 'text/html; charset=utf-8', js: 'text/javascript; charset=utf-8', css: 'text/css; charset=utf-8', json: 'application/json',
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml', webp: 'image/webp', woff2: 'font/woff2', pdf: 'application/pdf' };
const MAX_CUERPO = 4 * 1024 * 1024;
const ACCIONES = { aprobar: 'aprobó', cambios: 'pidió cambios', reevaluar: 'pidió otra vuelta', respuestas: 'respondió', enviar: 'envió «Tu proyecto»',
  guardar: 'guardó sus datos', respuesta: 'respondió el previo', cerrar: 'cerró la caja de datos', ajustes: 'pidió ajustes', aceptacion: 'firmó el acta',
  pendientes: 'entregó lo pendiente', reanudar: 'pidió continuar', archivos: 'subió un archivo', imagenes: 'subió imágenes' };

// Aviso al equipo de lo que hizo el cliente: solo la acción y dónde, nunca su contenido (un código del segundo factor no
// viaja por correo). Mismo proveedor y mismo límite diario que api/correo.
async function avisarEquipo(u, p, rutaMotor) {
  if (!process.env.RESEND_API_KEY) return;
  const accion = rutaMotor.split('/').filter(Boolean).pop();
  if (!ACCIONES[accion] || ['guardar', 'archivos', 'imagenes'].includes(accion)) return;   // lo frecuente no avisa
  const hoy = await query(`select count(*)::int as n from correos_enviados where usuario_id = $1 and fecha > now() - interval '1 day'`, [u.id]);
  if (hoy.rows[0].n >= 50) return;
  const asunto = `${p.nombre}: el cliente ${ACCIONES[accion]}`;
  const r = await fetch('https://api.resend.com/emails', { method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.CORREO_REMITENTE || 'Synthetica <onboarding@resend.dev>', to: ['hello@medialab.design'], reply_to: u.correo,
      subject: asunto, text: `Cuenta: ${u.nombre} <${u.correo}>\nProyecto: ${p.nombre} (${p.id})\nAcción: ${rutaMotor}\n\nEl vigilante la aplica en el motor; corre «python operador.py foto ${p.id}» para ver qué sigue.` }) });
  await query('insert into correos_enviados (usuario_id, asunto, enviado) values ($1, $2, $3)', [u.id, asunto, r.ok]);
}

async function crudo(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body);
  if (req.body && typeof req.body === 'object') return Buffer.from(JSON.stringify(req.body));
  const t = []; let n = 0;
  for await (const x of req) { n += x.length; if (n > MAX_CUERPO) throw Object.assign(new Error('grande'), { grande: true }); t.push(x); }
  return Buffer.concat(t);
}

// La foto del proyecto (con sus rutas del cliente) y si está archivado, desde el documento de la cuenta.
async function proyectoDe(usuario, pid) {
  const r = await query(`select p as proyecto from documentos d, jsonb_array_elements(d.datos -> 'proyectos') p
                         where d.usuario_id = $1 and p ->> 'id' = $2`, [usuario, pid]);
  return r.rows[0]?.proyecto || null;
}

export default async function handler(req, res) {
  try {
    const u = await usuarioDe(req);
    if (!u) return responder(res, 401, { error: 'Ingresa a Synthetica para ver esta página' });
    const q = new URL(req.url, 'http://x').searchParams;

    if (req.method === 'GET' && q.get('buzon')) {
      await esquema();
      const r = await query(`select estado, respuesta_estado, respuesta_tipo, respuesta, creado, hecho from buzon where id = $1 and usuario_id = $2`,
        [Number(q.get('buzon')) || 0, u.id]);
      if (!r.rows.length) return responder(res, 404, { error: 'No existe' });
      return responder(res, 200, r.rows[0]);
    }

    const ruta = String(q.get('ruta') || '');
    if (!ruta || ruta.includes('..') || ruta.startsWith('/')) return responder(res, 404, { error: 'No existe' });

    if (req.method === 'POST') {
      if (!exigirOrigenPropio(req, res)) return;
      const m = ruta.match(/^([\w-]+)\/m(\/.+)$/);
      if (!m) return responder(res, 404, { error: 'No existe' });
      await esquema();
      const p = await proyectoDe(u.id, m[1]);
      if (!p || !p.foto) return responder(res, 404, { error: 'Este proyecto todavía no está conectado a su motor' });
      if (p.archivado) return responder(res, 409, { ok: false, error: 'El proyecto está archivado: restáuralo para seguir.' });
      const permitida = (p.foto.rutas_cliente || []).some(x => { try { return new RegExp(x).test(m[2]); } catch { return false; } });
      if (!permitida) return responder(res, 403, { ok: false, error: 'Esta acción no se puede hacer desde la plataforma.' });
      let datos;
      try { datos = await crudo(req); } catch (e) {
        if (e.grande) return responder(res, 413, { ok: false, error: 'El archivo pesa más de 4 MB: comprímelo o divídelo.' });
        throw e;
      }
      if (datos.length > MAX_CUERPO) return responder(res, 413, { ok: false, error: 'El archivo pesa más de 4 MB: comprímelo o divídelo.' });
      const consulta = [...q.entries()].filter(([k]) => k !== 'ruta').map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
      const r = await query(`insert into buzon (usuario_id, proyecto_id, metodo, ruta, consulta, tipo, cuerpo) values ($1, $2, 'POST', $3, $4, $5, $6) returning id`,
        [u.id, m[1], m[2], consulta, String(req.headers['content-type'] || 'application/octet-stream').slice(0, 120), datos.toString('base64')]);
      await avisarEquipo(u, p, m[2]).catch(e => console.error('aviso', e));
      return responder(res, 202, { ok: true, en_cola: true, id: String(r.rows[0].id) });
    }

    if (req.method !== 'GET') return responder(res, 405, { error: 'Método no permitido' });
    const archivo = ruta.endsWith('/') ? ruta + 'index.html' : ruta;
    const r = await get(`u/${u.id}/publicado/${archivo}`, { access: 'private' });
    if (!r || r.statusCode !== 200) return responder(res, 404, { error: 'No existe' });
    res.statusCode = 200;
    res.setHeader('Content-Type', TIPOS[archivo.split('.').pop().toLowerCase()] || r.blob.contentType || 'application/octet-stream');
    // El espejo cambia con cada acción del cliente: se revalida siempre (el navegador guarda, pero pregunta).
    res.setHeader('Cache-Control', 'private, no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return Readable.fromWeb(r.stream).pipe(res);
  } catch (e) {
    console.error('publicado', e);
    return responder(res, 500, { error: 'No se pudo abrir' });
  }
}
