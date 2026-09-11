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
`vercel.json` manda la raíz a `/Emiratos/`.

**La maqueta está abierta**: no pide usuario ni contraseña para entrar, para que cualquiera con el
enlace pueda recorrerla (y quede registrada en Hotjar). Sigue sin indexarse en buscadores por la
cabecera `X-Robots-Tag: noindex, nofollow` de `vercel.json`.

Antes había una puerta con usuario y contraseña (`middleware.js`, con las variables `ACCESO_USUARIO`
y `ACCESO_CLAVE`). Si hay que volver a cerrarla, está en el historial de git; tiene que ir en la
raíz del repositorio, porque Vercel solo detecta el middleware ahí.

## Qué no está aquí

Este repositorio es público, así que el material de trabajo se queda fuera: la transcripción de la
reunión, el manual de marca, los mapas de los portales de Bolivia y Francia, y las credenciales y
capturas de los entornos de calidad. Está todo listado en [`.gitignore`](.gitignore) con el motivo
de cada exclusión.
