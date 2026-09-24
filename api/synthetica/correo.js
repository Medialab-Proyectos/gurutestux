// Aviso al equipo (hello@medialab.design) cuando se crea, se ejecuta, se detiene o se cancela
// un proyecto. Solo envía al equipo y como máximo 50 correos por cuenta al día.
import { query, esquema } from '../_synthetica/db.js';
import { usuarioDe } from '../_synthetica/sesion.js';
import { responder, exigirOrigenPropio, cuerpo } from '../_synthetica/http.js';

const PARA = 'hello@medialab.design';

export default async function handler(req, res) {
  if (!exigirOrigenPropio(req, res)) return;
  if (req.method !== 'POST') return responder(res, 405, { error: 'Método no permitido' });
  try {
    await esquema();
    const u = await usuarioDe(req);
    if (!u) return responder(res, 401, { error: 'Sin sesión' });
    const d = await cuerpo(req);
    const asunto = String(d.asunto || '').slice(0, 300);
    const texto = `Cuenta: ${u.nombre} <${u.correo}>\n\n${String(d.cuerpo || '').slice(0, 20000)}`;
    const hoy = await query(`select count(*)::int as n from correos_enviados where usuario_id = $1 and fecha > now() - interval '1 day'`, [u.id]);
    if (hoy.rows[0].n >= 50) return responder(res, 429, { enviado: false, motivo: 'Límite diario de avisos alcanzado' });
    let resultado = { enviado: false, motivo: 'Correo sin configurar en el servidor (RESEND_API_KEY)' };
    if (process.env.RESEND_API_KEY) {
      // Sin dominio verificado en Resend, onboarding@resend.dev solo puede enviar al correo dueño de la cuenta de Resend.
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: process.env.CORREO_REMITENTE || 'Synthetica <onboarding@resend.dev>', to: [PARA],
          reply_to: u.correo, subject: asunto, text: texto })
      });
      resultado = r.ok ? { enviado: true } : { enviado: false, motivo: `El proveedor rechazó el envío (${r.status})` };
      if (!r.ok) console.error('resend', r.status, await r.text());
    }
    await query('insert into correos_enviados (usuario_id, asunto, enviado) values ($1, $2, $3)', [u.id, asunto, resultado.enviado]);
    return responder(res, 200, resultado);
  } catch (e) {
    console.error('correo', e);
    return responder(res, 500, { enviado: false, motivo: 'Error del servidor' });
  }
}
