// El estado de la plataforma de cada cuenta: proyectos, auditorías, borradores, notas y correos.
//   GET /api/base               → { datos, version }
//   PUT /api/base { datos, version } → { version }  ·  409 si otra pestaña o equipo guardó antes
import { query, esquema } from '../_synthetica/db.js';
import { usuarioDe } from '../_synthetica/sesion.js';
import { responder, exigirOrigenPropio, cuerpo } from '../_synthetica/http.js';

const LIMITE = 4 * 1024 * 1024;  // el cuerpo de una función de Vercel admite hasta 4,5 MB

export default async function handler(req, res) {
  if (!exigirOrigenPropio(req, res)) return;
  try {
    await esquema();
    const u = await usuarioDe(req);
    if (!u) return responder(res, 401, { error: 'Sin sesión' });
    if (req.method === 'GET') {
      const r = await query('select datos, version, actualizado from documentos where usuario_id = $1', [u.id]);
      return responder(res, 200, r.rows[0] || { datos: null, version: 0 });
    }
    if (req.method !== 'PUT') return responder(res, 405, { error: 'Método no permitido' });
    const d = await cuerpo(req);
    const texto = JSON.stringify(d.datos ?? null);
    if (!d.datos || typeof d.datos !== 'object') return responder(res, 400, { error: 'Datos no válidos' });
    if (texto.length > LIMITE) return responder(res, 413, { error: 'Tus datos superan el tamaño permitido' });
    const version = Number(d.version) || 0;
    // Solo guarda si nadie guardó una versión más nueva en el medio.
    const r = version === 0
      ? await query(`insert into documentos (usuario_id, datos, version) values ($1, $2, 1)
                     on conflict (usuario_id) do nothing returning version`, [u.id, texto])
      : await query(`update documentos set datos = $2, version = version + 1, actualizado = now()
                     where usuario_id = $1 and version = $3 returning version`, [u.id, texto, version]);
    if (!r.rows.length) return responder(res, 409, { error: 'Hay cambios más nuevos guardados desde otra pestaña o equipo' });
    return responder(res, 200, { version: r.rows[0].version });
  } catch (e) {
    console.error('base', e);
    return responder(res, 500, { error: 'No pudimos guardar. Intenta de nuevo.' });
  }
}
