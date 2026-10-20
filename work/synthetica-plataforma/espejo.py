"""El espejo: las páginas del motor, tal como las ve el cliente en su servicio local, publicadas en la plataforma.

Recorre el servicio desde `foto.espejo.semillas`, sigue solo los enlaces del proyecto, ajusta las rutas absolutas, pide al
motor que revise que nada traiga un secreto y sube a Blob solo lo que cambió. Ver INTEGRACION.md («Espejo»).
"""
import hashlib
import json
import re
import shutil
import tempfile
from pathlib import Path
from urllib.parse import urljoin, urlsplit

import motores

PREFIJO_WEB = "/work/synthetica-plataforma/publicado"
MAX_ARCHIVOS = 800
MAX_BYTES = 4 * 1024 * 1024        # lo que admite el cuerpo de una función de Vercel
MAX_TOTAL = 150 * 1024 * 1024      # por proyecto y por pasada (Blob tiene costo por encima del plan gratuito)
ENLACE = re.compile(r"""(?:href|src|action|poster)\s*=\s*(["'])([^"'#]+?)\1""", re.I)
URL_CSS = re.compile(r"""url\(\s*(["']?)([^"')#]+)\1\s*\)""", re.I)

# El ajuste que se inyecta al comienzo de cada HTML: traduce rutas absolutas al espejo, firma los POST para la plataforma
# (cabecera contra CSRF) y, si el relé los deja en cola, espera la respuesta real del motor. La página no nota la diferencia.
AJUSTE = r"""<script data-synthetica-espejo>(function(){
var P=__PREFIJO__,API='/work/synthetica-plataforma/api/publicado?buzon=';
function tr(u){if(typeof u!=='string')return u;if(u.charAt(0)==='/'&&u.charAt(1)!=='/'&&u.indexOf('/work/')!==0)return P+u;return u;}
var of=window.fetch.bind(window),aviso=null;
function mostrar(t){if(!document.body)return;if(!aviso){aviso=document.createElement('div');aviso.setAttribute('role','status');aviso.style.cssText='position:fixed;z-index:2147483647;right:16px;bottom:16px;max-width:360px;padding:12px 16px;border-radius:10px;background:#001174;color:#fff;font:600 14px/1.4 system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25)';document.body.appendChild(aviso);}aviso.textContent=t;aviso.hidden=!t;}
function esperar(id){var t0=Date.now();return new Promise(function(ok){(function mira(){of(API+encodeURIComponent(id),{headers:{'X-Synthetica':'1'},cache:'no-store'}).then(function(r){return r.json();}).then(function(j){
if(j.estado==='hecho'||j.estado==='error'){mostrar('');return ok(new Response(j.respuesta||'{}',{status:j.respuesta_estado||(j.estado==='error'?502:200),headers:{'Content-Type':j.respuesta_tipo||'application/json'}}));}
if(Date.now()-t0>120000){mostrar('');return ok(new Response(JSON.stringify({ok:false,error:'Recibimos tu respuesta; el equipo la aplica en unos minutos y te avisamos.'}),{status:202,headers:{'Content-Type':'application/json'}}));}
setTimeout(mira,1500);}).catch(function(){setTimeout(mira,3000);});})();});}
window.fetch=function(i,o){var u=typeof i==='string'?i:(i&&i.url)||'';var m=((o&&o.method)||(i&&i.method)||'GET').toUpperCase();u=tr(u);
if(m==='GET'||m==='HEAD')return of(u,o);o=Object.assign({},o||{});var h=new Headers(o.headers||{});h.set('X-Synthetica','1');o.headers=h;mostrar('Enviando…');
return of(u,o).then(function(r){if(r.status!==202){mostrar('');return r;}return r.clone().json().then(function(j){if(!j.en_cola){mostrar('');return r;}mostrar('Lo estamos aplicando…');return esperar(j.id);});});};
function fija(){document.querySelectorAll('a[href^="/"],link[href^="/"],img[src^="/"],script[src^="/"],form[action^="/"]').forEach(function(e){['href','src','action'].forEach(function(k){var v=e.getAttribute(k);if(v&&v.charAt(1)!=='/'&&v.indexOf('/work/')!==0&&v.indexOf(P)!==0)e.setAttribute(k,P+v);});});}
document.addEventListener('DOMContentLoaded',function(){fija();new MutationObserver(fija).observe(document.documentElement,{childList:true,subtree:true});});
})();</script>"""


def clave(ruta: str) -> str:
    """La ruta del motor → la clave publicada (sin barra inicial; los directorios terminan en index.html)."""
    r = ruta.lstrip("/")
    return r + "index.html" if r.endswith("/") or not r else r


def _ajustar_html(texto: str, prefijo: str) -> str:
    """Las rutas absolutas del HTML apuntan al espejo, y el ajuste va antes que cualquier script de la página."""
    texto = ENLACE.sub(lambda m: m.group(0) if not m.group(2).startswith("/") or m.group(2).startswith(("//", "/work/"))
                       else m.group(0).replace(m.group(2), prefijo + m.group(2), 1), texto)
    script = AJUSTE.replace("__PREFIJO__", json.dumps(prefijo))
    m = re.search(r"<head[^>]*>", texto, re.I)
    return texto[:m.end()] + script + texto[m.end():] if m else script + texto


NO_ES_RUTA = re.compile(r"[\s(){}$+`<>|]")   # código JavaScript que la expresión de enlaces confunde con una ruta


EXTENSIONES = {"html", "htm", "css", "js", "mjs", "json", "png", "jpg", "jpeg", "gif", "svg", "webp", "avif", "ico", "woff", "woff2", "ttf", "otf",
               "pdf", "md", "txt", "csv", "xlsx", "docx", "zip", "mp4", "webm"}


def _parece_archivo(valor: str) -> bool:
    """`document.referrer` o `a.href` vienen del código, no son archivos: solo pasan las extensiones conocidas."""
    nombre = valor.split("?")[0].rstrip("/").rsplit("/", 1)[-1]
    return "." not in nombre or nombre.rsplit(".", 1)[-1].lower() in EXTENSIONES


def _es_pagina(ruta: str) -> bool:
    nombre = ruta.rsplit("/", 1)[-1]
    return ruta.endswith("/") or "." not in nombre or nombre.lower().endswith((".html", ".htm"))


def vigentes(foto: dict) -> tuple:
    """Lo que se publica: las semillas, las páginas que declara cada caja y todo lo de su vuelta actual (su carpeta).
    Los ciclos anteriores se quedan en el motor: el espejo es lo vigente, no el historial (Blob tiene costo)."""
    esp, mid = foto.get("espejo") or {}, foto["proyecto"]["id"]
    paginas = [c.get("pagina") for c in foto.get("cajas", []) if c.get("pagina")] + [x["ruta"] for c in foto.get("cajas", []) for x in c.get("enlaces") or []]
    semillas = list(dict.fromkeys([*esp.get("semillas", []), *esp.get("extra", []), *paginas]))
    prefijos = sorted({p.rsplit("/", 1)[0] + "/" for p in paginas if p.count("/") > 2} - {f"/{mid}/"})
    return semillas, prefijos


def recorrer(motor: str, foto: dict) -> tuple:
    """GET al servicio local desde lo vigente: [(ruta, tipo, bytes)] y los avisos (lo que no se pudo o no se debía)."""
    esp = foto.get("espejo") or {}
    mid = foto["proyecto"]["id"]
    excluir = [re.compile(x) for x in esp.get("excluir") or []]
    extra = set(esp.get("extra") or [])
    semillas, prefijos = vigentes(foto)
    pendientes = list(semillas)
    permitida = lambda r: r in semillas or not _es_pagina(r) or any(r.startswith(p) for p in prefijos)
    vistos, salida, avisos, total = set(), [], [], 0
    while pendientes and len(salida) < MAX_ARCHIVOS:
        ruta = pendientes.pop(0)
        if ruta in vistos:
            continue
        vistos.add(ruta)
        if any(x.search(ruta) for x in excluir):
            continue
        try:
            estado, tipo, cuerpo = motores.pedir(motor, "GET", ruta, timeout=60)
        except motores.FallaMotor as e:
            avisos.append(f"{ruta}: {e}")
            continue
        if estado != 200:
            if ruta not in extra:
                avisos.append(f"{ruta}: {estado}")
            continue
        if len(cuerpo) > MAX_BYTES:
            avisos.append(f"{ruta}: pesa {len(cuerpo) // 1024} KB, más de lo que se publica")
            continue
        total += len(cuerpo)
        if total > MAX_TOTAL:
            avisos.append(f"El espejo superó {MAX_TOTAL // (1024 * 1024)} MB: se publica hasta aquí")
            break
        salida.append((ruta, tipo or "application/octet-stream", cuerpo))
        if "html" in tipo or "css" in tipo:
            texto = cuerpo.decode("utf-8", "replace")
            for m in [*ENLACE.finditer(texto), *URL_CSS.finditer(texto)]:
                valor = m.group(2).strip()
                if NO_ES_RUTA.search(valor) or valor.startswith(("javascript:", "data:", "mailto:", "tel:")) or not _parece_archivo(valor):
                    continue
                destino = urlsplit(urljoin(ruta, valor))
                if destino.netloc or destino.query or not destino.path.startswith(f"/{mid}/"):
                    continue
                if destino.path not in vistos and permitida(destino.path):
                    pendientes.append(destino.path)
    if pendientes:
        avisos.append(f"Quedaron {len(pendientes)} rutas sin recorrer (máximo {MAX_ARCHIVOS} archivos)")
    return salida, avisos


def publicar(api, subir, cuenta: str, pid: str, motor: str, foto: dict, manifiesto: dict, solo: list | None = None) -> dict:
    """Recorre, ajusta, revisa secretos y sube lo que cambió. Devuelve {subidos, sin_cambio, avisos, bloqueado}."""
    prefijo = f"{PREFIJO_WEB}/{pid}/m"
    if solo is not None:
        archivos, avisos = [], []
        for ruta in solo:
            try:
                e, t, b = motores.pedir(motor, "GET", ruta, timeout=30)
                if e == 200:
                    archivos.append((ruta, t, b))
            except motores.FallaMotor as ex:
                avisos.append(f"{ruta}: {ex}")
    else:
        archivos, avisos = recorrer(motor, foto)
    listos = []
    for ruta, tipo, cuerpo in archivos:
        if "text/html" in tipo:
            cuerpo = _ajustar_html(cuerpo.decode("utf-8", "replace"), prefijo).encode("utf-8")
        listos.append((clave(ruta), tipo, cuerpo))
    # El motor revisa lo que se va a publicar: si algo trae un secreto, no se publica nada de esta pasada.
    tmp = Path(tempfile.mkdtemp(prefix="espejo-"))
    try:
        for k, _, cuerpo in listos:
            f = tmp / k
            f.parent.mkdir(parents=True, exist_ok=True)
            f.write_bytes(cuerpo)
        malos = motores.revisar(motor, foto["proyecto"]["id"], tmp)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    if malos:
        return {"subidos": 0, "sin_cambio": 0, "avisos": avisos + [f"NO SE PUBLICÓ: {len(malos)} archivo(s) traen un secreto ({', '.join(malos[:5])})"], "bloqueado": True}
    subidos = sin_cambio = 0
    for k, tipo, cuerpo in listos:
        huella = hashlib.sha256(cuerpo).hexdigest()
        if manifiesto.get(k) == huella:
            sin_cambio += 1
            continue
        subir(api, cuenta, f"{pid}/m/{k}", cuerpo, tipo)
        manifiesto[k] = huella
        subidos += 1
    return {"subidos": subidos, "sin_cambio": sin_cambio, "avisos": avisos, "bloqueado": False}
