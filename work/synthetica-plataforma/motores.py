"""Cómo habla la plataforma con cada motor: solo por su interfaz pública.

- la foto y la revisión de secretos, con su `plataforma.py`, que es del motor;
- las páginas y las acciones del cliente, con su servicio local.

Nunca se leen sus archivos internos.
"""
import json
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import Request, urlopen

RAIZ = Path(__file__).resolve().parent.parent.parent
PY = sys.executable

MOTORES = {
    "qa": {"cwd": RAIZ / "_qa_visual", "foto": [PY, "plataforma.py"], "servicio": "http://127.0.0.1:8797",
           "arrancar": [PY, "qa.py", "abrir", "--sin-navegador"]},
    "creacion": {"cwd": RAIZ / "_creacion_productos", "foto": [PY, "plataforma.py"], "servicio": "http://127.0.0.1:8795",
                 "arrancar": [PY, "servicio.py"], "fondo": True},
    "agentes": {"cwd": RAIZ / "_agentes_sinteticos", "foto": [PY, "-m", "agentes_sinteticos.plataforma"], "servicio": "http://127.0.0.1:8796",
                "arrancar": [PY, "-m", "agentes_sinteticos.servicio_cajas"], "fondo": True},
}
for _k, _m in MOTORES.items():   # SYNTHETICA_SERVICIO_QA, …: solo para probar contra una copia en otro puerto
    _m["servicio"] = __import__("os").environ.get(f"SYNTHETICA_SERVICIO_{_k.upper()}", _m["servicio"])
# El tipo con que operador.py vincula cada proyecto → su motor.
DE_VINCULO = {"qa": "qa", "creacion": "creacion", "agentes": "agentes"}


class FallaMotor(Exception):
    pass


def _correr(motor: str, *args, timeout=120) -> dict:
    m = MOTORES[motor]
    r = subprocess.run([*m["foto"], *args], cwd=m["cwd"], capture_output=True, timeout=timeout,
                       env={**__import__("os").environ, "PYTHONIOENCODING": "utf-8"})
    if r.returncode != 0:
        raise FallaMotor((r.stderr or r.stdout).decode("utf-8", "replace").strip().splitlines()[-1:] or ["sin salida"])
    return json.loads(r.stdout.decode("utf-8"))


def foto(motor: str, mid: str) -> dict:
    return _correr(motor, mid)


def revisar(motor: str, mid: str, carpeta: Path) -> list:
    """Los archivos de la carpeta que traen un secreto del proyecto: lo decide el motor, sin mostrar los valores."""
    return _correr(motor, mid, "--revisar", str(carpeta)).get("con_secretos", [])


def vivo(motor: str) -> bool:
    try:
        with urlopen(MOTORES[motor]["servicio"] + "/salud", timeout=2) as r:
            return r.status < 500
    except Exception as e:
        return getattr(e, "code", 0) and e.code < 500   # un 404 en /salud también es un servicio que responde


def asegurar(motor: str) -> bool:
    """Arranca el servicio local del motor si no corre."""
    if vivo(motor):
        return True
    m = MOTORES[motor]
    banderas = (subprocess.DETACHED_PROCESS | subprocess.CREATE_NEW_PROCESS_GROUP) if sys.platform == "win32" else 0
    if m.get("fondo"):
        subprocess.Popen(m["arrancar"], cwd=m["cwd"], creationflags=banderas, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    else:
        subprocess.run(m["arrancar"], cwd=m["cwd"], capture_output=True, timeout=30)
    for _ in range(40):
        if vivo(motor):
            return True
        time.sleep(0.25)
    return False


def pedir(motor: str, metodo: str, ruta: str, cuerpo: bytes | None = None, tipo: str | None = None, timeout=60) -> tuple:
    """Una petición al servicio local, como si viniera de su propia página (mismo Host y Origin)."""
    base = MOTORES[motor]["servicio"]
    cab = {"Origin": base, "Referer": base + ruta}
    if tipo:
        cab["Content-Type"] = tipo
    try:
        with urlopen(Request(base + ruta, data=cuerpo, method=metodo, headers=cab), timeout=timeout) as r:
            return r.status, r.headers.get("Content-Type", ""), r.read()
    except Exception as e:
        if hasattr(e, "code"):
            return e.code, e.headers.get("Content-Type", "") if e.headers else "", e.read()
        raise FallaMotor(str(e))
