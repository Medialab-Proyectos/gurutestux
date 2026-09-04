/**
 * Puerta de acceso de la maqueta.
 *
 * Esto es una maqueta interna que se publica para que gerencia la revise, no un
 * sitio abierto. El portal pide usuario y contraseña antes de servir nada.
 *
 * Se ejecuta en el borde de Vercel, delante de los archivos estáticos, así que
 * no hay forma de saltárselo mirando el HTML: la petición no llega al archivo
 * hasta que la autenticación es correcta.
 *
 * Vive en la RAÍZ del repositorio a propósito: Vercel solo detecta el
 * middleware en la raíz del directorio que despliega. Dentro de Emiratos/ no se
 * ejecutaba, y el prototipo quedaba abierto sin que se notara.
 *
 * Credenciales: se ponen en Vercel › Settings › Environment Variables como
 * ACCESO_USUARIO y ACCESO_CLAVE. Aquí no hay ninguna por defecto a propósito:
 * este repositorio es público, y una contraseña escrita en el código es una
 * contraseña publicada. Sin esas dos variables el sitio no deja entrar a nadie,
 * que es la única postura segura.
 *
 * En local (python -m http.server) esto no corre: el servidor de Python no
 * ejecuta middleware. La maqueta se abre directamente, que es lo que quieres
 * mientras trabajas.
 */

export const config = {
  // Todo queda detrás de la puerta menos lo interno de la plataforma.
  matcher: ['/((?!_vercel/).*)'],
};

/** Comparación de largo constante: no delata la clave por el tiempo de respuesta. */
function iguales(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diferencia = 0;
  for (let i = 0; i < a.length; i++) {
    diferencia |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diferencia === 0;
}

const PAGINA_401 = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Acceso restringido · eDoc Emiratos</title>
<style>
  :root { color-scheme: light; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    background: #001174; color: #fff; padding: 24px;
    font-family: Arial, Helvetica, sans-serif; line-height: 1.55;
  }
  .caja { max-width: 460px; text-align: center; }
  h1 { font-size: 21px; font-weight: 600; margin: 0 0 10px; }
  p { margin: 0 0 10px; color: rgba(255,255,255,.82); font-size: 14px; }
  .marca {
    display: inline-block; width: 54px; height: 54px; border-radius: 50%;
    background: #A8C634; margin-bottom: 18px;
  }
  .pie { margin-top: 22px; font-size: 12px; color: rgba(255,255,255,.55); }
</style>
</head>
<body>
  <div class="caja">
    <span class="marca"></span>
    <h1>Acceso restringido</h1>
    <p>Esta es una maqueta interna de eDoc Emiratos. Necesitas usuario y contraseña para verla.</p>
    <p>Si tendrías que tener acceso y no lo tienes, pídeselo al equipo de diseño.</p>
    <p class="pie">GuruSoft S.A. © 2026</p>
  </div>
</body>
</html>`;

const PAGINA_SIN_CONFIGURAR = PAGINA_401
  .replace('Acceso restringido</h1>', 'Falta configurar el acceso</h1>')
  .replace(
    '<p>Esta es una maqueta interna de eDoc Emiratos. Necesitas usuario y contraseña para verla.</p>',
    '<p>Este despliegue no tiene credenciales definidas, así que no deja entrar a nadie.</p>')
  .replace(
    '<p>Si tendrías que tener acceso y no lo tienes, pídeselo al equipo de diseño.</p>',
    '<p>Define <strong>ACCESO_USUARIO</strong> y <strong>ACCESO_CLAVE</strong> en Vercel › Settings › ' +
    'Environment Variables y vuelve a desplegar.</p>');

export default function middleware(peticion) {
  const usuarioEsperado = process.env.ACCESO_USUARIO;
  const claveEsperada = process.env.ACCESO_CLAVE;

  // Sin credenciales configuradas no se abre la puerta. Es preferible que el
  // despliegue quede inaccesible a que quede abierto sin que nadie se entere.
  if (!usuarioEsperado || !claveEsperada) {
    return new Response(PAGINA_SIN_CONFIGURAR, {
      status: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  const cabecera = peticion.headers.get('authorization') || '';

  if (cabecera.startsWith('Basic ')) {
    let descifrado = '';
    try {
      descifrado = atob(cabecera.slice(6));
    } catch (error) {
      descifrado = '';
    }
    const corte = descifrado.indexOf(':');
    if (corte >= 0) {
      const usuario = descifrado.slice(0, corte);
      const clave = descifrado.slice(corte + 1);
      // Se comprueban las dos siempre, para no delatar cuál falló.
      const usuarioOk = iguales(usuario, usuarioEsperado);
      const claveOk = iguales(clave, claveEsperada);
      if (usuarioOk && claveOk) {
        // Sin respuesta: la petición sigue su curso hasta el archivo estático.
        return;
      }
    }
  }

  return new Response(PAGINA_401, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="eDoc Emiratos - maqueta de alcance", charset="UTF-8"',
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
