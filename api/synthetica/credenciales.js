// Credenciales de un proyecto (QA visual): grupos de campos (usuario, contraseña…) y el token de Figma opcional.
//   POST /api/credenciales { proyecto_id, grupos: { "<grupo>": { "<etiqueta>": "<valor>" } }, figma_token? } → { guardadas }
// Se guardan cifradas y nunca se devuelven al navegador: solo el equipo las descifra al bajar el proyecto.
import { query, esquema } from '../_synthetica/db.js';
import { usuarioDe } from '../_synthetica/sesion.js';
import { responder, exigirOrigenPropio, cuerpo } from '../_synthetica/http.js';
import { cifrar } from '../_synthetica/cifrado.js';

const texto = (x, n) => String(x ?? '').slice(0, n);

export default async function handler(req, res) {
  if (!exigirOrigenPropio(req, res)) return;
  if (req.method !== 'POST') return responder(res, 405, { error: 'Método no permitido' });
  try {
    await esquema();
    const u = await usuarioDe(req);
    if (!u) return responder(res, 401, { error: 'Sin sesión' });
    const d = await cuerpo(req);
    const proyecto = texto(d.proyecto_id, 80);
    if (!proyecto) return responder(res, 400, { error: 'Falta el proyecto' });
    const r = await query(`select 1 from documentos where usuario_id = $1 and datos -> 'proyectos' @> $2::jsonb`, [u.id, JSON.stringify([{ id: proyecto }])]);
    if (!r.rows.length) return responder(res, 404, { error: 'No existe ese proyecto' });
    const grupos = {};
    for (const [g, campos] of Object.entries(d.grupos || {}).slice(0, 20)) {
      grupos[texto(g, 80)] = Object.fromEntries(Object.entries(campos || {}).slice(0, 20).map(([k, v]) => [texto(k, 80), texto(v, 500)]));
    }
    const datos = { grupos, figma_token: texto(d.figma_token, 200) };
    await query(`insert into credenciales (usuario_id, proyecto_id, cifrado) values ($1, $2, $3)
                 on conflict (usuario_id, proyecto_id) do update set cifrado = excluded.cifrado, actualizado = now()`, [u.id, proyecto, cifrar(datos)]);
    return responder(res, 200, { guardadas: Object.keys(grupos).length, figma_token: !!datos.figma_token });
  } catch (e) {
    console.error('credenciales', e);
    return responder(res, 500, { error: 'No pudimos guardar las credenciales' });
  }
}
