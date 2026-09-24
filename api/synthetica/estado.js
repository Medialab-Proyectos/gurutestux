// La plataforma pregunta aquí al arrancar: si responde «nube», guarda todo en el servidor.
import { responder } from '../_synthetica/http.js';

export default function handler(req, res) {
  responder(res, 200, {
    ok: true,
    modo: 'nube',
    base: !!process.env.DATABASE_URL,
    archivos: !!process.env.BLOB_READ_WRITE_TOKEN,
    correo: !!process.env.RESEND_API_KEY
  });
}
