// Registro del acuerdo de confidencialidad firmado al iniciar cada proyecto: quién, cuándo,
// qué versión, desde qué IP y navegador. Es la evidencia de la aceptación electrónica.
import { query, esquema } from '../_synthetica/db.js';
import { usuarioDe } from '../_synthetica/sesion.js';
import { responder, exigirOrigenPropio, cuerpo, ipDe, LEGAL_VIGENTE } from '../_synthetica/http.js';

export default async function handler(req, res) {
  if (!exigirOrigenPropio(req, res)) return;
  if (req.method !== 'POST') return responder(res, 405, { error: 'Método no permitido' });
  try {
    await esquema();
    const u = await usuarioDe(req);
    if (!u) return responder(res, 401, { error: 'Sin sesión' });
    const d = await cuerpo(req);
    const proyecto = String(d.proyecto_id || '').slice(0, 80);
    if (!proyecto) return responder(res, 400, { error: 'Falta el proyecto' });
    const r = await query(`insert into consentimientos (usuario_id, proyecto_id, documento, version, ip, navegador)
                           values ($1, $2, 'acuerdo', $3, $4, $5) returning fecha`,
      [u.id, proyecto, LEGAL_VIGENTE.acuerdo, ipDe(req), String(req.headers['user-agent'] || '').slice(0, 300)]);
    return responder(res, 201, { fecha: r.rows[0].fecha, version: LEGAL_VIGENTE.acuerdo });
  } catch (e) {
    console.error('consentimiento', e);
    return responder(res, 500, { error: 'No pudimos registrar el acuerdo' });
  }
}
