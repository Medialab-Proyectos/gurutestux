# eDoc Emiratos · maqueta de alcance

Maqueta navegable del portal de facturación electrónica de Emiratos Árabes Unidos.
No es el diseño final: es lo que gerencia pidió ver antes de que se escriba una línea de código.

La aplicación está en **[`Emiratos/`](Emiratos/)**, con su propio README.

```bash
cd Emiratos
python -m http.server 8000     # o doble clic en servir.bat
```

Y abrir <http://127.0.0.1:8000/>.

## Despliegue en Vercel

Sitio estático, sin build. Al conectar el repositorio hay que poner:

| Ajuste | Valor |
|---|---|
| **Root Directory** | `Emiratos` |
| `ACCESO_USUARIO` | el usuario de acceso a la maqueta |
| `ACCESO_CLAVE` | la contraseña de acceso a la maqueta |

Las dos variables son obligatorias. `Emiratos/middleware.js` pone una puerta de acceso delante de
todo el sitio y, si no están definidas, no deja entrar a nadie: este repositorio es público y una
contraseña escrita en el código sería una contraseña publicada.

## Qué no está aquí

Este repositorio es público, así que el material de trabajo se queda fuera: la transcripción de la
reunión, el manual de marca, los mapas de los portales de Bolivia y Francia, y las credenciales y
capturas de los entornos de calidad. Está todo listado en [`.gitignore`](.gitignore) con el motivo
de cada exclusión.
