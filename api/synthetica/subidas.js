// Subida directa del navegador a Vercel Blob (el archivo no pasa por la función, así que el
// límite de 4,5 MB no aplica). Aquí solo se autoriza: sesión, carpeta propia, 10 MB, documentos (y el logo).
import { handleUpload } from '@vercel/blob/client';
import { usuarioDe } from '../_synthetica/sesion.js';
import { responder, cuerpo } from '../_synthetica/http.js';

const LIMITE = 10 * 1024 * 1024;
const TIPOS = [
  'application/zip', 'application/x-zip-compressed', 'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'text/plain', 'text/markdown',
  'application/rtf', 'application/vnd.oasis.opendocument.text', 'application/vnd.oasis.opendocument.spreadsheet',
  'image/png', 'image/jpeg', 'application/octet-stream'
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return responder(res, 405, { error: 'Método no permitido' });
  try {
    const body = await cuerpo(req);
    const resultado = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async pathname => {
        const u = await usuarioDe(req);
        if (!u) throw new Error('Sin sesión');
        if (!pathname.startsWith(`u/${u.id}/`)) throw new Error('Carpeta no permitida');
        return { allowedContentTypes: TIPOS, maximumSizeInBytes: LIMITE, addRandomSuffix: true, tokenPayload: JSON.stringify({ u: u.id }) };
      },
      // Sin onUploadCompleted: el navegador registra el archivo en los datos de su cuenta al terminar.
    });
    return responder(res, 200, resultado);
  } catch (e) {
    return responder(res, 400, { error: e.message || 'No se pudo autorizar la subida' });
  }
}
