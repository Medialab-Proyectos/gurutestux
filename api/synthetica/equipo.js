// Consola del equipo Synthetica (solo cuentas de CORREOS_EQUIPO). La usa operador.py.
//   GET  /api/equipo?accion=proyectos                      → todos los proyectos de todas las cuentas
//   GET  /api/equipo?accion=proyecto&cuenta=<id>&id=<id>   → el proyecto, su ficha y sus archivos
//   GET  /api/equipo?accion=archivo&cuenta=<id>&p=<ruta>   → descarga un archivo de esa cuenta
//   POST /api/equipo?accion=etapa { cuenta, id, n, estado: 'en_curso' | 'progreso' | 'lista', logros?, nota?, detalle?, resultado?, motor? }
//     progreso: solo actualiza «Ahora: …» sin cambiar la etapa. resultado: hallazgos del estudio para auditar.
import { get } from '@vercel/blob';
import { Readable } from 'node:stream';
import { query, esquema } from '../_synthetica/db.js';
import { usuarioDe } from '../_synthetica/sesion.js';
import { responder, exigirOrigenPropio, cuerpo } from '../_synthetica/http.js';

const esEquipo = u => !!u && String(process.env.CORREOS_EQUIPO || '').toLowerCase().split(',').map(x => x.trim()).filter(Boolean).includes(u.correo);

function resumen(p) {
  const etapas = p.etapas || [];
  const actual = etapas.find(e => ['analista', 'pensando', 'detenido', 'revision', 'humana', 'vivo'].includes(e.estado)) || etapas.filter(e => e.estado === 'hecha').pop() || {};
  const pedida = etapas.find(e => e.pedida && !e.pedida.lanzada);
  return {
    id: p.id, nombre: p.nombre, tipo: p.tipo, url: p.url || '', creado: p.creado,
    etapa: actual.n ?? null, estado: p.cancelado ? 'cancelado' : actual.estado || '',
    pide_ejecucion: pedida ? { etapa: pedida.n, agentes: pedida.pedida.agentes, fecha: pedida.pedida.fecha, desde_inicio: !!pedida.pedida.desde_inicio } : null,
    archivos: (p.fuentes?.archivos || []).length + (p.fuentes?.manual ? 1 : 0)
  };
}

// Cambia el documento de una cuenta sin pisar lo que la persona guarde al mismo tiempo.
async function cambiarDocumento(cuenta, fn) {
  for (let intento = 0; intento < 5; intento++) {
    const r = await query('select datos, version from documentos where usuario_id = $1', [cuenta]);
    if (!r.rows.length) return null;
    const { datos, version } = r.rows[0];
    const resultado = fn(datos);
    if (resultado === null) return null;
    const w = await query('update documentos set datos = $2, version = version + 1, actualizado = now() where usuario_id = $1 and version = $3 returning version',
      [cuenta, JSON.stringify(datos), version]);
    if (w.rows.length) return resultado;
  }
  throw new Error('Demasiados cambios simultáneos');
}

function marcarEtapa(p, n, estado, logros, nota, detalle) {
  const e = (p.etapas || []).find(x => x.n === n);
  if (!e) return null;
  const ahora = new Date().toISOString();
  if (detalle) Object.assign(e, { detalle, detalle_fecha: ahora });
  if (estado === 'progreso') return e;
  if (estado === 'en_curso') {
    if (e.pedida) e.pedida.lanzada = true;
    Object.assign(e, { estado: 'pensando', inicio: ahora, fin: null, lanzada_por: 'equipo' });
    e.rondas = e.rondas?.length ? e.rondas : [{ n: 1, inicio: ahora, fin: null, min: null, respuestas: {} }];
    return e;
  }
  e.fin = ahora; e.pedida = null; e.detalle = null;
  if (logros?.length) e.logros = logros;
  if (nota) e.nota_equipo = nota;
  const ronda = e.rondas?.[e.rondas.length - 1]; if (ronda) ronda.fin = ahora;
  if (p.tipo === 'sintetico' && n < 3) {
    // Fuentes, cohorte y ejecución se aprueban solas; el informe es el que se audita.
    e.estado = 'hecha'; e.auto = true;
    const sig = p.etapas.find(x => x.n === n + 1); if (sig) Object.assign(sig, { estado: 'pensando', inicio: ahora, fin: null });
  } else e.estado = 'revision';
  return e;
}

export default async function handler(req, res) {
  if (!exigirOrigenPropio(req, res)) return;
  try {
    await esquema();
    const u = await usuarioDe(req);
    if (!esEquipo(u)) return responder(res, 403, { error: 'Solo el equipo Synthetica' });
    const q = new URL(req.url, 'http://x').searchParams;
    const accion = q.get('accion');

    if (req.method === 'GET' && accion === 'proyectos') {
      const r = await query(`select u.id, u.nombre, u.correo, d.datos -> 'proyectos' as proyectos, d.actualizado
                             from documentos d join usuarios u on u.id = d.usuario_id order by d.actualizado desc`);
      const lista = r.rows.flatMap(c => (c.proyectos || []).map(p => ({ cuenta: { id: c.id, nombre: c.nombre, correo: c.correo }, ...resumen(p) })));
      return responder(res, 200, { proyectos: lista });
    }
    if (req.method === 'GET' && accion === 'proyecto') {
      const r = await query(`select u.id, u.nombre, u.correo, d.datos from documentos d join usuarios u on u.id = d.usuario_id where u.id = $1`, [q.get('cuenta')]);
      const c = r.rows[0]; const p = c && (c.datos.proyectos || []).find(x => x.id === q.get('id'));
      if (!p) return responder(res, 404, { error: 'No existe' });
      const duenos = new Set([p.id]);
      return responder(res, 200, {
        cuenta: { id: c.id, nombre: c.nombre, correo: c.correo }, proyecto: p,
        archivos: (c.datos.adjuntos || []).filter(x => duenos.has(x.dueno)),
        correos: (c.datos.correos || []).filter(x => x.proyecto === p.id)
      });
    }
    if (req.method === 'GET' && accion === 'archivo') {
      const cuenta = q.get('cuenta'), p = q.get('p');
      if (!cuenta || !p || !p.startsWith(`u/${cuenta}/`) || p.includes('..')) return responder(res, 404, { error: 'No existe' });
      const r = await get(p, { access: 'private' });
      if (!r || r.statusCode !== 200) return responder(res, 404, { error: 'No existe' });
      res.statusCode = 200;
      res.setHeader('Content-Type', r.blob.contentType || 'application/octet-stream');
      res.setHeader('Cache-Control', 'private, no-store');
      return Readable.fromWeb(r.stream).pipe(res);
    }
    if (req.method === 'POST' && accion === 'etapa') {
      const d = await cuerpo(req);
      if (!['en_curso', 'progreso', 'lista'].includes(d.estado)) return responder(res, 400, { error: 'estado debe ser en_curso, progreso o lista' });
      if (d.resultado && JSON.stringify(d.resultado).length > 2_500_000) return responder(res, 413, { error: 'El resultado es demasiado grande' });
      const logros = Array.isArray(d.logros) ? d.logros.map(x => String(x).slice(0, 300)).slice(0, 12) : null;
      const e = await cambiarDocumento(String(d.cuenta || ''), datos => {
        const p = (datos.proyectos || []).find(x => x.id === d.id);
        if (!p) return null;
        if (d.resultado && typeof d.resultado === 'object') p.resultado_motor = d.resultado;
        if (d.motor && typeof d.motor === 'object') p.motor = { proyecto_id: String(d.motor.proyecto_id || ''), estudio: d.motor.estudio ? String(d.motor.estudio) : null };
        return marcarEtapa(p, Number(d.n), d.estado, logros, d.nota ? String(d.nota).slice(0, 4000) : '', d.detalle ? String(d.detalle).slice(0, 300) : '');
      });
      return e ? responder(res, 200, { etapa: e.n, estado: e.estado }) : responder(res, 404, { error: 'No existe ese proyecto o esa etapa' });
    }
    return responder(res, 400, { error: 'Acción desconocida' });
  } catch (e) {
    console.error('equipo', e);
    return responder(res, 500, { error: 'Error del servidor' });
  }
}
