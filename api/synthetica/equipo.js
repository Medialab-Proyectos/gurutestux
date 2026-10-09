// Consola del equipo Synthetica (solo cuentas de CORREOS_EQUIPO). La usa operador.py.
//   GET  /api/equipo?accion=proyectos                      → todos los proyectos de todas las cuentas
//   GET  /api/equipo?accion=proyecto&cuenta=<id>&id=<id>   → el proyecto, su ficha y sus archivos
//   GET  /api/equipo?accion=archivo&cuenta=<id>&p=<ruta>   → descarga un archivo de esa cuenta
//   GET  /api/equipo?accion=cuentas                       → cuentas registradas
//   GET  /api/equipo?accion=credenciales&cuenta=<id>&id=<id> → las credenciales del proyecto, descifradas (QA visual)
//   POST /api/equipo?accion=clave { correo, clave }        → el administrador pone una contraseña nueva
//   POST /api/equipo?accion=borrar { cuenta, id }  → quita el proyecto, sus documentos y su historial
//   POST /api/equipo?accion=subir&cuenta=<id>&p=<proyecto>/<ruta>  (cuerpo: el archivo) → publica en u/<cuenta>/publicado/
//   POST /api/equipo?accion=etapa { cuenta, id, n, estado: 'en_curso' | 'progreso' | 'lista' | 'omitida', logros?, nota?, detalle?, resultado?, motor? }
//     omitida: una caja opcional que el motor saltó (la 10): queda hecha y arranca la siguiente.
//     progreso: solo actualiza «Ahora: …» sin cambiar la etapa. resultado: hallazgos del estudio para auditar.
import { get, del, put } from '@vercel/blob';
import crypto from 'node:crypto';
import { Readable } from 'node:stream';
import { query, esquema } from '../_synthetica/db.js';
import { usuarioDe, hashClave } from '../_synthetica/sesion.js';
import { responder, exigirOrigenPropio, cuerpo } from '../_synthetica/http.js';
import { descifrar } from '../_synthetica/cifrado.js';

// El administrador entra sin cuenta con la llave SYNTHETICA_LLAVE_ADMIN (la usa operador.py).
function esAdmin(req) {
  const llave = process.env.SYNTHETICA_LLAVE_ADMIN || '';
  const m = String(req.headers.authorization || '').match(/^Bearer (.+)$/);
  if (llave.length < 32 || !m) return false;
  const a = crypto.createHash('sha256').update(m[1]).digest(), b = crypto.createHash('sha256').update(llave).digest();
  return crypto.timingSafeEqual(a, b);
}
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
  if (estado === 'omitida') {   // caja opcional que el motor saltó: no se revisa; sigue la próxima en orden
    const ahora2 = new Date().toISOString();
    Object.assign(e, { estado: 'hecha', omitida: true, fin: e.fin || ahora2 });
    const sig = p.etapas[p.etapas.indexOf(e) + 1];
    if (sig && ['cola', 'analista'].includes(sig.estado)) Object.assign(sig, { estado: 'pensando', inicio: ahora2, fin: null });
    return e;
  }
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
  const arrancar = sig => { if (sig && ['cola', 'analista'].includes(sig.estado)) Object.assign(sig, { estado: 'pensando', inicio: ahora, fin: null }); };
  if (p.tipo === 'sintetico' && n < 3) {
    // Fuentes, definición y ejecución se aprueban solas.
    e.estado = 'hecha'; e.auto = true;
    arrancar(p.etapas.find(x => x.n === n + 1));
  } else if (p.tipo === 'sintetico' && n === 3) {
    // Los hallazgos se auditan; mientras tanto se redactan las propuestas de mejora (caja 4).
    e.estado = 'revision';
    arrancar(p.etapas.find(x => x.n === 4));
  } else if (p.tipo === 'qa' && n === 2) {
    e.estado = 'hecha'; e.auto = true;
    arrancar(p.etapas.find(x => x.n === 3));
  } else if (p.tipo === 'sintetico' && n === 4) {
    e.estado = 'hecha'; e.auto = true;   // las propuestas se leen y se deciden; no bloquean el estudio
  } else e.estado = 'revision';
  return e;
}

// Proyectos completos creados con las 9 cajas de antes del 2026-10-08 (motor de creación): la 4 pasa a 5, … la 9 a 10;
// se suman la 3.1 (color), la 4 (maquetación), la 4.1 (imagen) y la 11 (aceptación). Igual que en index.html.
const MIGRA_CAJAS = { 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10 };
function migrarCajas(p, datos) {
  if (p.tipo !== 'completo' || !Array.isArray(p.etapas) || p.etapas.some(e => e.n === 3.1)) return;
  const nuevo = n => MIGRA_CAJAS[n] ?? n;
  p.etapas = p.etapas.map(e => ({ ...e, n: nuevo(e.n) }));
  ['ajustes', 'variantes', 'elecciones', 'notas'].forEach(t => (datos[t] || []).forEach(x => { if (x.proyecto === p.id && typeof x.etapa === 'number') x.etapa = nuevo(x.etapa); }));
  const avanzado = p.etapas.some(e => e.n >= 5 && !['cola', 'analista'].includes(e.estado));
  [3.1, 4, 4.1, 11].forEach(n => { if (!p.etapas.some(e => e.n === n)) p.etapas.push(avanzado && n < 5 ? { n, estado: 'hecha', inicio: null, fin: null, agregada: true } : { n, estado: 'cola', inicio: null, fin: null }); });
  p.etapas.sort((a, b) => a.n - b.n);
}

// Estudios sintéticos creados antes de la caja 4 (propuestas de mejora): se les agrega en cola.
function conCajaDePropuestas(p) {
  if (p.tipo === 'sintetico' && Array.isArray(p.etapas) && !p.etapas.some(x => x.n === 4))
    p.etapas.push({ n: 4, estado: 'cola', inicio: null, fin: null });
}

export default async function handler(req, res) {
  if (!exigirOrigenPropio(req, res)) return;
  try {
    await esquema();
    const admin = esAdmin(req);
    const u = admin ? null : await usuarioDe(req);
    if (!admin && !u) return responder(res, 401, { error: 'Sin sesión' });
    if (!admin && !esEquipo(u)) return responder(res, 403, { error: 'Solo el equipo Synthetica' });
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
      migrarCajas(p, c.datos);   // solo en la respuesta: se guarda migrado la próxima vez que cambie
      const duenos = new Set([p.id]);
      return responder(res, 200, {
        cuenta: { id: c.id, nombre: c.nombre, correo: c.correo }, proyecto: p,
        archivos: (c.datos.adjuntos || []).filter(x => duenos.has(x.dueno)),
        correos: (c.datos.correos || []).filter(x => x.proyecto === p.id)
      });
    }
    if (req.method === 'POST' && accion === 'subir') {
      // Publica un archivo para el cliente (el recorrido y sus capturas). Solo dentro de su carpeta «publicado».
      const cuenta = q.get('cuenta') || '', ruta = q.get('p') || '';
      if (!/^c-[\w-]+$/.test(cuenta) || !ruta || ruta.includes('..') || ruta.startsWith('/')) return responder(res, 400, { error: 'Ruta no válida' });
      // Llega como application/octet-stream para que Vercel no lo convierta; el tipo real viene en X-Tipo.
      const datos = Buffer.isBuffer(req.body) ? req.body : typeof req.body === 'string' ? Buffer.from(req.body)
        : await (async () => { const t = []; for await (const x of req) t.push(x); return Buffer.concat(t); })();
      const b = await put(`u/${cuenta}/publicado/${ruta}`, datos, { access: 'private', addRandomSuffix: false, allowOverwrite: true,
        contentType: String(req.headers['x-tipo'] || 'application/octet-stream') });
      return responder(res, 200, { ruta, bytes: datos.length, pathname: b.pathname });
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
      if (!['en_curso', 'progreso', 'lista', 'omitida'].includes(d.estado)) return responder(res, 400, { error: 'estado debe ser en_curso, progreso, lista u omitida' });
      if (d.resultado && JSON.stringify(d.resultado).length > 2_500_000) return responder(res, 413, { error: 'El resultado es demasiado grande' });
      if (d.propuestas && JSON.stringify(d.propuestas).length > 1_500_000) return responder(res, 413, { error: 'Las propuestas son demasiado grandes' });
      const logros = Array.isArray(d.logros) ? d.logros.map(x => String(x).slice(0, 300)).slice(0, 12) : null;
      const e = await cambiarDocumento(String(d.cuenta || ''), datos => {
        const p = (datos.proyectos || []).find(x => x.id === d.id);
        if (!p) return null;
        conCajaDePropuestas(p);
        migrarCajas(p, datos);
        if (d.resultado && typeof d.resultado === 'object') p.resultado_motor = d.resultado;
        // Propuestas de mejora e indicadores (caja 4), ya pulidas por el analista.
        if (d.propuestas && typeof d.propuestas === 'object') p.propuestas = d.propuestas;
        // Producto sintético: el prototipo navegable de la vuelta y la respuesta a las dudas de la vuelta anterior.
        const et = (p.etapas || []).find(x => x.n === Number(d.n));
        if (et && d.prototipo && typeof d.prototipo === 'object') {
          et.prototipo = String(d.prototipo.nombre || 'Prototipo').slice(0, 200);
          et.prototipo_href = /^publicado\/[\w./-]+$/.test(String(d.prototipo.href || '')) ? d.prototipo.href : null;
        }
        if (et && d.respuesta && Array.isArray(et.rondas) && et.rondas.length) {
          et.rondas[Math.max(0, et.rondas.length - 2)].respuesta_equipo = String(d.respuesta).slice(0, 4000);
        }
        // Fuentes, cohorte y recorridos del motor, para que el cliente los vea y los valide.
        if (d.proyecto_motor && typeof d.proyecto_motor === 'object' && JSON.stringify(d.proyecto_motor).length < 400_000) {
          p.motor_proyecto = d.proyecto_motor;
          p.motor = { proyecto_id: String(d.proyecto_motor.id || ''), estudio: p.motor?.estudio || null };
        }
        if (d.motor && typeof d.motor === 'object') p.motor = { proyecto_id: String(d.motor.proyecto_id || ''), estudio: d.motor.estudio ? String(d.motor.estudio) : null };
        return marcarEtapa(p, Number(d.n), d.estado, logros, d.nota ? String(d.nota).slice(0, 4000) : '', d.detalle ? String(d.detalle).slice(0, 300) : '');
      });
      return e ? responder(res, 200, { etapa: e.n, estado: e.estado }) : responder(res, 404, { error: 'No existe ese proyecto o esa etapa' });
    }
    if (req.method === 'GET' && accion === 'cuentas') {
      const r = await query(`select u.id, u.nombre, u.correo, u.creado, coalesce(jsonb_array_length(d.datos -> 'proyectos'), 0) as proyectos
                             from usuarios u left join documentos d on d.usuario_id = u.id order by u.creado`);
      return responder(res, 200, { cuentas: r.rows });
    }
    if (req.method === 'POST' && accion === 'clave') {
      const d = await cuerpo(req);
      const clave = String(d.clave || '');
      if (clave.length < 10) return responder(res, 400, { error: 'La contraseña debe tener al menos 10 caracteres' });
      const r = await query('update usuarios set clave_hash = $2 where correo = $1 returning nombre, correo', [String(d.correo || '').trim().toLowerCase(), hashClave(clave)]);
      return r.rows.length ? responder(res, 200, r.rows[0]) : responder(res, 404, { error: 'No hay una cuenta con ese correo' });
    }
    if (req.method === 'POST' && accion === 'url') {
      // Misma regla que ve el cliente: solo mientras la caja 0 (fuentes) no ha terminado.
      const d = await cuerpo(req); let motivo = 'No existe ese proyecto';
      const nueva = String(d.url || '').trim();
      if (!/^https?:\/\/[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i.test(nueva)) return responder(res, 400, { error: 'La URL debe empezar por https:// y verse como https://tuproducto.com' });
      const r = await cambiarDocumento(String(d.cuenta || ''), datos => {
        const p = (datos.proyectos || []).find(x => x.id === d.id);
        if (!p) return null;
        const e0 = (p.etapas || []).find(e => e.n === 0), e1 = (p.etapas || []).find(e => e.n === 1);
        if (!(p.tipo === 'sintetico' && e0 && ['pensando', 'analista', 'detenido'].includes(e0.estado) && (!e1 || e1.estado === 'cola'))) { motivo = 'La URL ya no se puede cambiar: el proyecto pasó de la caja de fuentes'; return null; }
        (p.cambios_url || (p.cambios_url = [])).push({ de: p.url, a: nueva, fecha: new Date().toISOString(), por: 'equipo' });
        p.url = nueva; return { nombre: p.nombre, url: nueva };
      });
      return r ? responder(res, 200, r) : responder(res, 409, { error: motivo });
    }
    if (req.method === 'POST' && accion === 'reiniciar') {
      // Devuelve el proyecto a su estado real: desde la etapa «desde» nada ha empezado y espera al analista.
      const d = await cuerpo(req); const desde = Number(d.desde) || 0;
      const r = await cambiarDocumento(String(d.cuenta || ''), datos => {
        const p = (datos.proyectos || []).find(x => x.id === d.id);
        if (!p) return null;
        for (const e of p.etapas || []) if (e.n >= desde)
          Object.assign(e, { estado: e.n === desde ? 'analista' : 'cola', inicio: null, fin: null, logros: null, detalle: null, nota_equipo: null, auto: false, rondas: undefined });
        if (desde <= 3) { delete p.resultado_motor; datos.ajustes = (datos.ajustes || []).filter(a => !(a.proyecto === p.id && a.hallazgo_ref && !a.auditoria)); }
        return p.nombre;
      });
      return r ? responder(res, 200, { reiniciado: r, desde }) : responder(res, 404, { error: 'No existe ese proyecto' });
    }
    if (req.method === 'GET' && accion === 'credenciales') {
      const r = await query('select cifrado, actualizado from credenciales where usuario_id = $1 and proyecto_id = $2', [q.get('cuenta'), q.get('id')]);
      if (!r.rows.length) return responder(res, 404, { error: 'Ese proyecto no tiene credenciales' });
      return responder(res, 200, { ...descifrar(r.rows[0].cifrado), actualizado: r.rows[0].actualizado });
    }
    if (req.method === 'POST' && accion === 'borrar') {
      const d = await cuerpo(req);
      let archivos = [];
      const nombre = await cambiarDocumento(String(d.cuenta || ''), datos => {
        const p = (datos.proyectos || []).find(x => x.id === d.id);
        if (!p) return null;
        const quitar = (datos.adjuntos || []).filter(x => x.dueno === p.id);
        datos.adjuntos = (datos.adjuntos || []).filter(x => x.dueno !== p.id);
        archivos = [...new Set(quitar.map(x => x.pathname))].filter(x => !datos.adjuntos.some(y => y.pathname === x));
        datos.proyectos = datos.proyectos.filter(x => x.id !== p.id);
        for (const k of ['ajustes', 'notas', 'correos', 'avisos', 'variantes', 'elecciones']) if (Array.isArray(datos[k])) datos[k] = datos[k].filter(x => x.proyecto !== p.id);
        return p.nombre;
      });
      if (!nombre) return responder(res, 404, { error: 'No existe ese proyecto' });
      if (archivos.length) await del(archivos);
      await query('delete from credenciales where usuario_id = $1 and proyecto_id = $2', [String(d.cuenta || ''), String(d.id || '')]);
      return responder(res, 200, { borrado: nombre, archivos: archivos.length });
    }
    return responder(res, 400, { error: 'Acción desconocida' });
  } catch (e) {
    console.error('equipo', e);
    return responder(res, 500, { error: 'Error del servidor' });
  }
}
