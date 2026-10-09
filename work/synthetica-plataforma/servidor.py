"""Servidor local de la plataforma Synthetica.

Sirve la maqueta en http://localhost:8765 y guarda en disco lo que se sube desde ella:

    proyectos/<carpeta-del-proyecto>/
        fuentes/        los documentos que subió la persona
        proyecto.json   la ficha del proyecto (lo mismo que llega a hello@medialab.design)
        correo.txt      el correo al equipo, en texto

Los borradores guardan sus archivos en proyectos/borradores/<id>/ y se mueven a la carpeta
del proyecto al enviarlo. No escribe nunca fuera de esta carpeta ni toca el motor.

Uso:
    python servidor.py              # y abre http://localhost:8765
    python servidor.py --puerto 9000
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import smtplib
import urllib.request
import webbrowser
from email.message import EmailMessage
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, quote, unquote, urlparse

AQUI = Path(__file__).resolve().parent
PROYECTOS = AQUI / "proyectos"
# La «base de datos» local: el mismo contenido que tendrá PostgreSQL en producción.
BASE = AQUI / "datos" / "base.json"
LIMITE_BASE = 50 * 1024 * 1024
# El correo solo sale hacia el equipo: el servidor local no envía a direcciones arbitrarias.
CORREO_EQUIPO = "hello@medialab.design"


def cargar_env():
    """Lee work/synthetica-plataforma/.env (fuera de git) sin pisar variables ya definidas."""
    f = AQUI / ".env"
    if f.exists():
        for linea in f.read_text(encoding="utf-8").splitlines():
            linea = linea.strip()
            if linea and not linea.startswith("#") and "=" in linea:
                k, v = linea.split("=", 1)
                os.environ.setdefault(k.strip(), v.split("#")[0].strip().strip('"').strip("'"))


def enviar_correo(asunto: str, cuerpo: str) -> dict:
    """Envía al equipo con SendGrid o con SMTP, según .env. Si no hay configuración, lo dice."""
    prov = os.environ.get("CORREO_PROVEEDOR", "").lower()
    remitente = os.environ.get("CORREO_REMITENTE", "")
    if not prov or not remitente:
        return {"enviado": False, "motivo": "Correo sin configurar: falta .env con CORREO_PROVEEDOR y CORREO_REMITENTE"}
    try:
        if prov == "sendgrid":
            datos = {"personalizations": [{"to": [{"email": CORREO_EQUIPO}]}], "from": {"email": remitente, "name": "Synthetica"},
                     "subject": asunto, "content": [{"type": "text/plain", "value": cuerpo}]}
            req = urllib.request.Request("https://api.sendgrid.com/v3/mail/send", data=json.dumps(datos).encode("utf-8"), method="POST",
                                         headers={"Authorization": f"Bearer {os.environ['SENDGRID_API_KEY']}", "Content-Type": "application/json"})
            urllib.request.urlopen(req, timeout=20)
        elif prov == "smtp":
            m = EmailMessage(); m["From"] = remitente; m["To"] = CORREO_EQUIPO; m["Subject"] = asunto; m.set_content(cuerpo)
            with smtplib.SMTP(os.environ["SMTP_SERVIDOR"], int(os.environ.get("SMTP_PUERTO", "587")), timeout=20) as srv:
                srv.starttls(); srv.login(os.environ["SMTP_USUARIO"], os.environ["SMTP_CLAVE"]); srv.send_message(m)
        else:
            return {"enviado": False, "motivo": f"Proveedor desconocido: {prov}"}
        return {"enviado": True}
    except KeyError as e:
        return {"enviado": False, "motivo": f"Falta {e.args[0]} en .env"}
    except Exception as e:  # el detalle va a la consola del servidor, no a la página
        print("  Error al enviar correo:", e)
        return {"enviado": False, "motivo": "El proveedor rechazó el envío; revisa la consola del servidor"}
LIMITE = 10 * 1024 * 1024  # 10 MB por envío, igual que la plataforma en Vercel
CARPETA_VALIDA = re.compile(r"^[a-z0-9][a-z0-9-]{0,120}$")
# Los informes y videos de los estudios (solo lectura). Nada más del motor se sirve:
# ni proyectos/ (acceso.json) ni el resto del repositorio.
MOTOR_SALIDAS = (AQUI.parent.parent / "_agentes_sinteticos" / "salidas").resolve()
PREFIJO_MOTOR = "/_agentes_sinteticos/salidas/"


def carpeta(nombre: str) -> Path:
    """Carpeta de un proyecto o borrador; solo nombres simples, siempre dentro de proyectos/."""
    if not CARPETA_VALIDA.match(nombre or ""):
        raise ValueError("Nombre de carpeta no válido")
    base = PROYECTOS / "borradores" / nombre if nombre.startswith("borrador-") else PROYECTOS / nombre
    base = base.resolve()
    if PROYECTOS.resolve() not in base.parents:
        raise ValueError("Fuera de proyectos/")
    return base


def nombre_seguro(nombre: str) -> str:
    nombre = Path(nombre or "archivo").name.strip().replace("\x00", "")
    nombre = re.sub(r'[<>:"/\\|?*]', "_", nombre)
    return nombre[:180] or "archivo"


class Manejador(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(AQUI), **k)

    def translate_path(self, path):
        ruta = unquote(urlparse(path).path)
        if ruta.startswith(PREFIJO_MOTOR):
            destino = (MOTOR_SALIDAS / ruta[len(PREFIJO_MOTOR):]).resolve()
            return str(destino) if MOTOR_SALIDAS in destino.parents else str(AQUI / "__no_existe__")
        return super().translate_path(path)

    def do_PUT(self):
        ruta, _ = self._params()
        if ruta != "/api/base":
            return self._json({"error": "Ruta desconocida"}, 404)
        n = int(self.headers.get("Content-Length") or 0)
        if n > LIMITE_BASE:
            return self._json({"error": "Base demasiado grande"}, 413)
        try:
            datos = json.loads(self.rfile.read(n) or b"null")
        except json.JSONDecodeError:
            return self._json({"error": "JSON no válido"}, 400)
        BASE.parent.mkdir(exist_ok=True)
        tmp = BASE.with_suffix(".tmp"); tmp.write_text(json.dumps(datos, ensure_ascii=False), encoding="utf-8"); tmp.replace(BASE)
        return self._json({"ok": True})

    # --- utilidades
    def _json(self, datos, codigo=200):
        cuerpo = json.dumps(datos, ensure_ascii=False).encode("utf-8")
        self.send_response(codigo)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(cuerpo)))
        self.end_headers()
        self.wfile.write(cuerpo)

    def _cuerpo(self) -> bytes:
        n = int(self.headers.get("Content-Length") or 0)
        if n > LIMITE:
            raise ValueError("El envío supera 10 MB")
        return self.rfile.read(n)

    def _params(self):
        u = urlparse(self.path)
        return u.path, {k: v[0] for k, v in parse_qs(u.query).items()}

    def _lista(self, base: Path):
        fuentes = base / "fuentes"
        if not fuentes.is_dir():
            return []
        rel = base.relative_to(AQUI).as_posix()
        return [{"nombre": f.name, "bytes": f.stat().st_size,
                 "fecha": datetime.fromtimestamp(f.stat().st_mtime).isoformat(timespec="seconds"),
                 "clase": "marca" if f.name.startswith("marca--") else "fuente",
                 "url": f"{quote(rel)}/fuentes/{quote(f.name)}",
                 "ruta": f"{rel}/fuentes/{f.name}"}
                for f in sorted(fuentes.iterdir()) if f.is_file()]

    # --- API
    def do_GET(self):
        ruta, q = self._params()
        if ruta == "/api/base":
            return self._json(json.loads(BASE.read_text(encoding="utf-8")) if BASE.exists() else None)
        if ruta == "/api/estado":
            return self._json({"ok": True, "carpeta": PROYECTOS.relative_to(AQUI.parent.parent).as_posix()})
        if ruta == "/api/adjuntos":
            try:
                return self._json(self._lista(carpeta(q.get("dueno", ""))))
            except ValueError as e:
                return self._json({"error": str(e)}, 400)
        return super().do_GET()

    def do_POST(self):
        ruta, q = self._params()
        try:
            if ruta == "/api/correo":
                d = json.loads(self._cuerpo() or b"{}")
                return self._json(enviar_correo(str(d.get("asunto", ""))[:300], str(d.get("cuerpo", ""))[:20000]))
            if ruta == "/api/copiar":
                de, a = carpeta(q.get("de", "")), carpeta(q.get("a", ""))
                if (de / "fuentes").is_dir():
                    (a / "fuentes").mkdir(parents=True, exist_ok=True)
                    for f in (de / "fuentes").iterdir():
                        if f.is_file():
                            shutil.copy2(f, a / "fuentes" / f.name)
                return self._json({"ok": True})
            if ruta == "/api/adjuntos":
                base = carpeta(q.get("dueno", ""))
                nombre = nombre_seguro(q.get("nombre", ""))
                if q.get("clase") == "marca":
                    nombre = "marca--" + nombre
                datos = self._cuerpo()  # primero el límite: si no cabe, no se crea nada
                destino = base / "fuentes" / nombre
                destino.parent.mkdir(parents=True, exist_ok=True)
                destino.write_bytes(datos)
                return self._json({"ok": True, "ruta": destino.relative_to(AQUI).as_posix()})
            if ruta == "/api/mover":
                de, a = carpeta(q.get("de", "")), carpeta(q.get("a", ""))
                if (de / "fuentes").is_dir():
                    (a / "fuentes").mkdir(parents=True, exist_ok=True)
                    for f in (de / "fuentes").iterdir():
                        shutil.move(str(f), str(a / "fuentes" / f.name))
                shutil.rmtree(de, ignore_errors=True)
                return self._json({"ok": True})
            if ruta == "/api/ficha":
                base = carpeta(q.get("dueno", ""))
                datos = json.loads(self._cuerpo() or b"{}")
                base.mkdir(parents=True, exist_ok=True)
                (base / "proyecto.json").write_text(json.dumps(datos.get("proyecto", {}), ensure_ascii=False, indent=2), encoding="utf-8")
                if datos.get("correo"):
                    c = datos["correo"]
                    with (base / "correo.txt").open("a", encoding="utf-8") as h:
                        h.write(f"Para: {c.get('para')}\nFecha: {c.get('fecha')}\nAsunto: {c.get('asunto')}\n\n{c.get('cuerpo')}\n\n{'-' * 60}\n\n")
                return self._json({"ok": True})
        except (ValueError, json.JSONDecodeError) as e:
            return self._json({"error": str(e)}, 400)
        return self._json({"error": "Ruta desconocida"}, 404)

    def do_DELETE(self):
        ruta, q = self._params()
        if ruta == "/api/adjuntos":
            try:
                if q.get("nombre"):  # un solo archivo que la persona quitó
                    (carpeta(q.get("dueno", "")) / "fuentes" / nombre_seguro(q["nombre"])).unlink(missing_ok=True)
                    return self._json({"ok": True})
                shutil.rmtree(carpeta(q.get("dueno", "")), ignore_errors=True)
                return self._json({"ok": True})
            except ValueError as e:
                return self._json({"error": str(e)}, 400)
        return self._json({"error": "Ruta desconocida"}, 404)

    def log_message(self, formato, *args):
        if args and "/api/" in str(args[0]):
            print("  " + formato % args)


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--puerto", type=int, default=8765)
    ap.add_argument("--sin-navegador", action="store_true")
    a = ap.parse_args()
    cargar_env()
    PROYECTOS.mkdir(exist_ok=True)
    print(f"Base de datos: {BASE}\nCorreo al equipo: {os.environ.get('CORREO_PROVEEDOR') or 'sin configurar (copia correo.env.ejemplo como .env)'}")
    srv = ThreadingHTTPServer(("127.0.0.1", a.puerto), Manejador)
    url = f"http://localhost:{a.puerto}/index.html"
    print(f"Synthetica en {url}\nLos archivos se guardan en {PROYECTOS}\nCtrl+C para detener.")
    if not a.sin_navegador:
        webbrowser.open(url)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
