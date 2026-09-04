# eDoc Emiratos · maqueta de alcance

Maqueta navegable del portal de Emiratos Árabes Unidos. No es el diseño final: es lo que gerencia
pidió ver **antes** de que se escriba una línea de código.

Sale de tres fuentes y de ninguna más:

- La reunión del mapa del portal (`Reuniones/guru207.txt`).
- El cruce de capacidades (`Conexion/MapaPortal_eDoc_Francia_Bolivia_Emiratos_15.xlsx`), hojas
  **Menú Emiratos** y **Emiratos**.
- El **Manual de Identidad Corporativa · BrandBook eDoc**, del que salen todos los colores, las
  tipografías, la iconografía y las reglas de escritura.

## El stack, medido en los portales reales

No se dedujo de la reunión: se midió entrando a los portales.

| Portal | Lo que sirve hoy |
|---|---|
| **Bolivia** · `devbo-emp-consultaweb-v2-1` | ASP.NET · **jQuery 3.5.1** · **Bootstrap 4.4.1** · **DataTables 1.10.25** (y 1.11.5 en Usuarios) · jquery-validation · jGrowl |
| **Francia** · `qas-fr-entpr-site` | **Angular 20.3.19** · **Angular Material** |

La maqueta usa **exactamente las versiones de Bolivia**, que es de donde parte Emiratos: Bootstrap
4.4.1, jQuery 3.5.1 y DataTables 1.10.25 con la misma traducción al español. Así copiar y pegar
funciona sin traducir una sola clase, que era la condición de Reynaldo. Angular Material queda fuera:
está atado a Angular y aquí el back es .NET.

Bootstrap 4 no trae `gap-*` ni los gutters `g-*` —llegaron en la 5—, así que `assets/css/edoc.css`
añade `.hueco-1/2/3` y `.rejilla` · `.rejilla-2`. Son las únicas clases de utilidad propias.

---

## Cómo verla

```bash
python -m http.server 8000     # o cualquier servidor estático
```

Y abrir <http://localhost:8000/>. También vale abrir `index.html` directamente en el navegador.

---

## Qué se enseña hoy

La reunión pidió maquetar las dos pantallas centrales, así que la entrega va con **tres vistas**:

| | |
|---|---|
| **Inicio** | La bienvenida, solo la imagen |
| **Documentos Emitidos** | Los cuatro estados separados |
| **Documentos Recibidos** | Las tres respuestas MLS |

El resto del portal **sigue en el menú** —marcado «en construcción», para que se vea el alcance
completo— y muestra un aviso si alguien entra. No está roto: está fuera de la entrega de hoy.

### El panel para abrir el resto

Está en **`/panel.html`** y no cuelga de ningún menú: se llega con **Ctrl + Alt + P** o escribiendo
la dirección. Desde ahí se enciende o apaga cada pantalla, se guarda para ese navegador y se genera
un enlace que lleva la selección escrita, para mandárselo a alguien sin tocar nada. Es también el
único sitio desde donde se encienden las **notas de diseño**.

Tres formas de abrir pantallas, de la más temporal a la más permanente:

| Cómo | Alcance |
|---|---|
| `?vistas=todas` en la dirección | Solo esa visita |
| Guardar en el panel | Ese navegador, hasta que se restablezca |
| La marca `entrega` en `assets/js/alcance.js` | Todo el mundo, por defecto |

---

## Dos interruptores para la revisión

Los dos recuerdan su estado entre pantallas, pero viven en sitios distintos a propósito:

| Interruptor | Dónde | Para qué sirve |
|---|---|---|
| **Nombre nativo** | Barra superior | Cambia el nombre del emisor y del receptor por el que llega en árabe. Solo cambia esa celda: importes, fechas, números de documento y registros fiscales se quedan siempre en caracteres latinos. Enseña la regla dura de que ningún campo mezcla los dos alfabetos. Se enseña durante la demo, así que está a mano. |
| **Notas de diseño** | Solo en `/panel.html` | Muestra, junto a cada bloque, la decisión que lo sostiene: lo que se decidió en la reunión, lo que sigue abierto y lo que queda fuera del MVP. Es una capa de revisión interna, no algo que deba aparecer por error en una presentación, así que fuera del panel no hay forma de encenderla. |

---

## Las pantallas

### Las dos centrales

| Pantalla | Archivo | Qué resuelve |
|---|---|---|
| **Documentos Emitidos** | `emitidos.html` | Los cuatro estados **separados**: C2 eDoc, C5 Autoridad, C3 plataforma receptora y C4 destinatario. Cada uno con su columna, su estado y su motivo cuando rechaza. Dentro: banner de búsqueda, «Ver estados» con la línea de tiempo de las cuatro entidades, visor de la factura, descarga de XML y exportación. |
| **Documentos Recibidos** | `recibidos.html` | Una sola página con un menú de acciones que se habilita según el estado de la fila. Las tres respuestas: **MLS AP** aprobada, **MLS RE** rechazada con motivo tipificado y **MLS AB** acuse de recibo, que no es una aprobación. |

### El resto del MVP

| Pantalla | Archivo |
|---|---|
| Acceso | `index.html` |
| Inicio · solo la imagen | `inicio.html` |
| Retorno desde EmaraTax · onboarding | `onboarding.html` |
| Registro de la empresa · wizard de seis pasos | `registro.html` |
| Aprobación del registro · bandeja del Office Manager | `aprobacion-registro.html` |
| Clientes y proveedores | `admin-clientes.html` |
| Cambiar Contraseña | `admin-clave.html` |
| Roles | `admin-roles.html` |
| Usuarios | `admin-usuarios.html` |
| Actualización datos de empresa | `admin-empresa.html` |
| Actualización información de empresa | `admin-contactos.html` |
| Credenciales de consumo Servicio eDoc | `admin-credenciales.html` |
| Alertas y comunicados | `admin-alertas.html` |
| Manuales | `admin-manuales.html` |
| **Bases de diseño · la plantilla base** | `bases.html` |

`bases.html` es lo que pidió Reynaldo: la rejilla, la jerarquía de botones, la paleta con sus
códigos, la tipografía, los estados, la iconografía, la regla del árabe y las dos listas de alcance.
Es el archivo del que parten los tres países.

---

## La marca

Los logotipos de `assets/img/` se reconstruyeron como SVG vectorial a partir del brandbook, no como
capturas. Hay cuatro:

| Archivo | Uso |
|---|---|
| `edoc-logo.svg` | Imagotipo completo sobre fondo claro |
| `edoc-logo-neg.svg` | El mismo en negativo, sobre el azul `#001174` |
| `edoc-logo-neg-compacto.svg` | Sin la línea «Facturación Electrónica», para la barra superior |
| `edoc-logo-compacto.svg` | La misma variante sobre fondo claro |
| `edoc-iso.svg` · `favicon.svg` | Solo el isotipo |

Colores, tipografías y reglas de escritura salen del manual y están documentados en `bases.html` y
comentados dentro de `assets/css/edoc.css`.

Una diferencia que conviene señalar: el resumen de contexto del proyecto decía «Arial en todo el
portal», pero el brandbook asigna **Open Sans** a las plataformas de Facturación Electrónica y
**Poppins** a contenidos y títulos. La maqueta sigue el brandbook y deja Arial como respaldo del
stack.

---

## Lo que la maqueta deja dicho sin decirlo dos veces

**Decidido en la reunión**

- El portal de Emiratos **no emite**. eDoc Emisor queda fuera: sin formulario de factura, sin notas,
  sin contingencia y sin catálogo de productos. «Emisión» aquí significa consultar lo emitido.
- **Anular no existe.** La única corrección es una nota de crédito, y este portal no emite notas.
- Los **cuatro estados van separados**. En Francia se fusionaron C3 y C4 y hoy «aprobado» no dice
  quién aprobó.
- **Recepción es una sola página**, no un árbol de ventanas.
- **Hace falta un visor**: por la red viaja el XML limpio, sin PDF adjunto. El visor no es la
  representación gráfica oficial, y la propia pantalla lo dice.
- **El árabe va acotado**: ningún campo mezcla los dos alfabetos.
- El **inicio es solo la imagen**: sin botonera y sin cuadro de mando.

**Fuera del MVP**

eDoc Emisor, workflow de aprobaciones, cola de reportes pesados, buscador general, informes
fiscales, catálogos oficiales, servidor de correo y OAuth de correo, sucursales, puntos de venta,
parámetros de empresa y token de la autoridad.

**Sin decidir**

Modelo de credenciales (bloquea esa pantalla), idioma del portal, reenviar por correo, firma con
certificado, registro de empresas, si el PDF viaja dentro del XML, dónde vive la bandeja del Office
Manager, textos legales y buscar datos fiscales de un tercero.

---

## Lo que se validó contra los portales

Se entró a **Bolivia y a Francia** en modo lectura y se leyeron los menús y las pantallas centrales.

Francia confirmó el diseño de la pantalla principal. Sus columnas son casi las mismas —número,
fecha, comprador, moneda, base, impuesto, total— con **un solo estado receptor**. Emiratos añade el
tipo de documento, que allí hace falta, y parte ese estado en C3 y C4: es exactamente la decisión de
la reunión, y ahora se ve contra qué se decidió. En recibidos, Francia muestra un único «Statut
eDoc»; aquí van dos columnas.

De ese recorrido salieron estos ajustes, ya aplicados:

- Las tablas son **DataTables**, no una paginación a mano. Se cablearon las seis.
- **Usuarios** conserva el reenvío del correo de bienvenida, que en Bolivia se usa a diario.
- **Manuales** lleva el lector dentro del portal y las columnas reales: título, descripción, fecha
  de creación y versión.
- **Alertas y comunicados** en Bolivia configura *a quién avisa el sistema* —contacto financiero,
  técnico y de notificaciones—. Aquí cambia de sentido y esos contactos viven en «Actualización
  información de empresa». La nota de la pantalla lo dice.
- El **acceso** lleva el bloque de verificación de seguridad, que Bolivia y Francia piden.
- Se dejaron marcados como abiertos el equivalente del **CUF**, **cargar un XML a mano** y la
  distinción de Bolivia entre «Rechazar y notificar» y «Solo rechazar».
- **Documentos Recibidos** muestra la fecha de emisión *y* la de recepción. Los dos portales enseñan
  la de emisión; Bolivia filtra por la de recepción. Hacen falta las dos para saber cuánto queda
  para responder.
- **Usuarios** incorpora la última conexión, que Francia sí tiene y Bolivia no.
- Las acciones de fila son **botones en línea**, como en Bolivia, no un menú desplegable: una acción
  a un clic en vez de dos, y nada que se recorte al desplazar la tabla. El número de documento es
  además el enlace al visor.

## Usabilidad

La auditoría de Francia encontró que ninguna de sus diez tablas se puede ordenar ni leer con un
lector de pantalla. Esta maqueta no repite eso:

- Cada pastilla de estado **dice a qué entidad pertenece** para quien la escucha: «C5 Autoridad:
  Aprobado». El sentido de la reunión era que «aprobado» no puede quedarse sin decir quién aprobó.
- La cabecera de los cuatro corners lleva una **ayuda** que explica quién es cada entidad y qué
  puede responder. Es el concepto nuevo del portal y no puede vivir solo dentro de un modal.
- Las tablas se ordenan, toda cabecera declara `scope`, cada botón de icono lleva su nombre, hay un
  salto al contenido como primera parada del teclado, el foco se ve y los avisos se anuncian con
  `aria-live`.
- Los estados vacíos dicen algo útil: «No hay documentos emitidos en ese rango de fechas. Prueba a
  ampliarlo», en vez de «Ningún dato disponible».
- Ninguna pantalla desplaza la página en horizontal, comprobado a 1600, 1200, 1024, 768, 500 y 360 px.

## Fijos y responsive

- **Encabezado y menú fijos arriba**, y la **cabecera de la tabla** también mientras recorres el
  listado: con catorce columnas, perder los rótulos es perder el sentido de la fila.
- **Pie fijo abajo**, con la versión, el aviso de maqueta y el enlace a las bases de diseño.
- **Por debajo de 900 px la tabla no se desplaza de lado: se apila.** Cada fila pasa a ser una ficha
  y cada celda lleva el rótulo de su columna, así que no hace falta volver a la cabecera. Es la
  respuesta al hallazgo de Francia: «la misma tabla ocupa lo mismo en un teléfono que en un
  escritorio».
- **El menú se pliega en un cajón** con el árbol completo, y la barra dice en qué sección estás.
  Francia perdía la navegación entre 1104 y 1080 px; aquí el corte está declarado y probado.

Dos cosas quedaron sin comprobar en vivo:

- **Bolivia** tiene reCAPTCHA con clave real en el acceso; hay que entrar a mano.
- **Francia** no acepta `USER TEST` como usuario. Su reCAPTCHA sí usa la clave de pruebas de Google,
  así que con el usuario correcto se entra sin fricción.

En `_validacion/` quedan los dos guiones del recorrido: `abrir-sesion.py` abre un navegador con
puerto de depuración para iniciar sesión a mano, y `recorrer.py` se conecta a esa ventana y vuelca
menús, stack y capturas sin escribir nada.

## Despliegue y acceso

Sitio estático, sin build. En Vercel:

```bash
npm i -g vercel
vercel --prod
```

### La maqueta va con contraseña

`middleware.js` y `vercel.json` viven en la **raíz del repositorio**, un nivel por encima de esta
carpeta: Vercel solo detecta el middleware ahí. La puerta se ejecuta en el borde, antes de servir
cualquier archivo, así que no se salta mirando el HTML.

No hay contraseña por defecto: se definen en **Vercel › Settings › Environment Variables**.

| Variable | Valor |
|---|---|
| `ACCESO_USUARIO` | el usuario que quieras |
| `ACCESO_CLAVE` | la contraseña que quieras |

Sin ellas el sitio no deja entrar a nadie y explica qué falta. El repositorio es público: una
contraseña escrita en el código sería una contraseña publicada.

En local no corre: `python -m http.server` no ejecuta middleware, así que la maqueta se abre directa
mientras trabajas. Eso es lo que quieres en tu máquina.
