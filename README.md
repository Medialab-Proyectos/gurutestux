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

Sitio estático, sin build y **sin ajustes que tocar**: se despliega la raíz del repositorio tal cual.
`vercel.json` manda la raíz a `/Emiratos/` y `middleware.js` pone la puerta de acceso delante de todo.

Lo único obligatorio son dos variables de entorno, en **Settings › Environment Variables**:

| Variable | Valor |
|---|---|
| `ACCESO_USUARIO` | el usuario de acceso a la maqueta |
| `ACCESO_CLAVE` | la contraseña de acceso a la maqueta |

Sin ellas el sitio no deja entrar a nadie y responde explicando qué falta. Es a propósito: este
repositorio es público, y una contraseña escrita en el código sería una contraseña publicada.

**Los dos archivos tienen que quedarse en la raíz.** Vercel solo detecta el middleware en la raíz de
lo que despliega; dentro de `Emiratos/` no se ejecuta y el sitio queda abierto sin que se note.

## Qué no está aquí

Este repositorio es público, así que el material de trabajo se queda fuera: la transcripción de la
reunión, el manual de marca, los mapas de los portales de Bolivia y Francia, y las credenciales y
capturas de los entornos de calidad. Está todo listado en [`.gitignore`](.gitignore) con el motivo
de cada exclusión.
