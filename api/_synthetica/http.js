// Ayudas comunes de las funciones de la API.

export function responder(res, codigo, datos, cabeceras = {}) {
  res.statusCode = codigo;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [k, v] of Object.entries(cabeceras)) res.setHeader(k, v);
  res.end(JSON.stringify(datos));
}

// Las peticiones que cambian algo deben traer X-Synthetica: 1. Un sitio ajeno no puede
// agregar esa cabecera sin permiso CORS, así que esto bloquea los ataques CSRF.
export function exigirOrigenPropio(req, res) {
  if (req.method !== 'GET' && req.headers['x-synthetica'] !== '1') {
    responder(res, 403, { error: 'Petición no permitida' });
    return false;
  }
  return true;
}

export async function cuerpo(req) {
  if (req.body !== undefined && req.body !== null && typeof req.body !== 'string' && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return req.body ? JSON.parse(req.body) : {};
  const trozos = [];
  for await (const t of req) trozos.push(t);
  const texto = Buffer.concat(trozos).toString('utf8');
  return texto ? JSON.parse(texto) : {};
}

export const ipDe = req => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();

// Versiones vigentes de los documentos legales. Si cambian aquí, se vuelven a pedir.
export const LEGAL_VIGENTE = { terminos: '1.0', privacidad: '1.0', acuerdo: '1.0' };
export const aceptoVigente = aceptaciones => ['terminos', 'privacidad'].every(k => (aceptaciones || []).some(a => a.documento === k && a.version === LEGAL_VIGENTE[k]));
