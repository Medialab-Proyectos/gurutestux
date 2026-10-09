"""Consola del analista de Synthetica: ver lo nuevo, bajarlo y marcar el avance de cada fase.

Entra como administrador con la llave de .operador/llave-admin.txt (la misma de SYNTHETICA_LLAVE_ADMIN
en Vercel), sin cuenta ni contraseña. Sin llave, usa una cuenta del equipo con «ingresar».

    python operador.py nuevos                    # lo que llegó o cambió desde la última vez
    python operador.py nuevos --todos            # todos los proyectos
    python operador.py bajar <proyecto>          # ficha + documentos a proyectos/<nombre>-<id>/
    python operador.py etapa <proyecto> <n> en-curso
    python operador.py etapa <proyecto> <n> lista --logro "…" --logro "…" --nota "…"
    python operador.py vigilar                   # reporta solo el avance del motor, cada minuto
    python operador.py vincular <proyecto> <id en el motor>
    python operador.py cuentas                   # cuentas registradas
    python operador.py clave <correo>            # pone una contraseña temporal y la muestra
    python operador.py url <proyecto> <nueva url>  # corrige la URL (solo mientras está en la caja de fuentes)
    python operador.py publicar <proyecto>      # sube el recorrido interactivo del último estudio (popup del informe)
    python operador.py propuestas <proyecto> [--regenerar] [--publicar]   # caja 4: borrador de propuestas y su publicación
    python operador.py reiniciar <proyecto> [--desde n]   # vuelve a su estado real: nada empezado desde la etapa n
    python operador.py borrar <proyecto> --si     # quita el proyecto y sus documentos de la plataforma
    python operador.py salir

<proyecto> es el id que muestra «nuevos» (p-…). Con --base se usa otra dirección, por ejemplo la
prueba local: --base http://localhost:8790/work/synthetica-plataforma/
"""
import argparse, getpass, json, re, sys, unicodedata, zipfile
from datetime import datetime
from pathlib import Path
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError

AQUI = Path(__file__).resolve().parent
ESTADO = AQUI / ".operador"
PROYECTOS = AQUI / "proyectos"
BASE = "https://gurutestux.vercel.app/work/synthetica-plataforma/"
TEXTUALES = re.compile(r"\.(pdf|docx?|xlsx?|csv|txt|md|rtf|odt|ods)$", re.I)
ESTADOS = {"analista": "espera al analista", "pensando": "en curso", "revision": "en revisión del cliente",
           "hecha": "terminada", "detenido": "detenido", "humana": "la hace el cliente", "vivo": "en vivo", "cancelado": "cancelado"}
for _flujo in (sys.stdout, sys.stderr):
    if hasattr(_flujo, "reconfigure"):
        _flujo.reconfigure(encoding="utf-8")


def slug(t):
    t = unicodedata.normalize("NFD", t or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:50]


def leer(nombre, defecto):
    f = ESTADO / nombre
    return json.loads(f.read_text(encoding="utf-8")) if f.exists() else defecto


def escribir(nombre, datos):
    ESTADO.mkdir(exist_ok=True)
    (ESTADO / nombre).write_text(json.dumps(datos, ensure_ascii=False, indent=2), encoding="utf-8")


class Api:
    def __init__(self, base):
        self.base = base.rstrip("/") + "/"
        self.cookie = leer("sesion.json", {}).get(self.base)

    def pedir(self, ruta, metodo="GET", datos=None, crudo=False):
        cab = {"X-Synthetica": "1"}
        llave = ESTADO / "llave-admin.txt"
        if llave.exists() and ruta.startswith("api/equipo"):
            cab["Authorization"] = "Bearer " + llave.read_text(encoding="utf-8").strip()
        elif self.cookie:
            cab["Cookie"] = self.cookie
        cuerpo = None
        if datos is not None:
            cuerpo = json.dumps(datos).encode()
            cab["Content-Type"] = "application/json"
        try:
            with urlopen(Request(self.base + ruta, data=cuerpo, method=metodo, headers=cab), timeout=120) as r:
                galleta = r.headers.get("Set-Cookie")
                if galleta and "syn_sesion=" in galleta:
                    self.cookie = galleta.split(";")[0]
                    sesiones = leer("sesion.json", {}); sesiones[self.base] = self.cookie; escribir("sesion.json", sesiones)
                return r.read() if crudo else json.loads(r.read() or b"{}")
        except HTTPError as e:
            try:
                msg = json.loads(e.read()).get("error", "")
            except Exception:
                msg = ""
            if e.code == 401:
                sys.exit("Sin acceso: falta la llave de administrador en .operador/llave-admin.txt (o ingresa con una cuenta del equipo).")
            if e.code == 403:
                sys.exit("Esta cuenta no es del equipo. Agrega su correo a CORREOS_EQUIPO en Vercel y vuelve a ingresar.")
            sys.exit(f"Error {e.code}: {msg or e.reason}")


def subir(api, cuenta, ruta, datos, tipo):
    cab = {"X-Synthetica": "1", "Content-Type": "application/octet-stream", "X-Tipo": tipo}
    llave = ESTADO / "llave-admin.txt"
    if llave.exists():
        cab["Authorization"] = "Bearer " + llave.read_text(encoding="utf-8").strip()
    url = api.base + "api/equipo?" + urlencode({"accion": "subir", "cuenta": cuenta, "p": ruta})
    for intento in range(3):
        try:
            with urlopen(Request(url, data=datos, method="POST", headers=cab), timeout=120) as r:
                return json.loads(r.read())
        except Exception as e:
            if intento == 2:
                raise
    return None


TIPOS = {".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
         ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".pdf": "application/pdf"}


def publicar_recorrido(api, cuenta, pid, carpeta_estudio):
    """Arma el recorrido interactivo con el conector y lo sube, privado, a la cuenta del cliente."""
    from concurrent.futures import ThreadPoolExecutor
    import conector_motor as con
    r = con.publicar_recorrido(carpeta_estudio, AQUI / "descargas")
    if not r:
        return None
    local = (AQUI / r["href"]).parent
    archivos = [f for f in local.rglob("*") if f.is_file()]
    def uno(f):
        rel = f.relative_to(local).as_posix()
        subir(api, cuenta, f"{pid}/{carpeta_estudio.name}/recorrido/{rel}", f.read_bytes(), TIPOS.get(f.suffix.lower(), "application/octet-stream"))
    with ThreadPoolExecutor(8) as ex:
        list(ex.map(uno, archivos))
    # Cada estudio en su propia carpeta: el navegador no confunde el recorrido nuevo con el anterior.
    return {"href": f"publicado/{pid}/{carpeta_estudio.name}/recorrido/index.html", "archivos": len(archivos)}


def buscar(api, pid):
    for p in api.pedir("api/equipo?accion=proyectos")["proyectos"]:
        if p["id"] == pid or p["id"].lower() == pid.lower():
            return p
    sys.exit(f"No encontré el proyecto {pid}. Mira los ids con: python operador.py nuevos --todos")


def firma(p):
    return f'{p["estado"]}|{p["etapa"]}|{p.get("url", "")}|{json.dumps(p["pide_ejecucion"], sort_keys=True)}'


def cmd_ingresar(api, a):
    correo = a.correo or input("Correo del equipo: ").strip()
    # Con la entrada redirigida (scripts) se lee de ahí; en la terminal, sin mostrarla.
    clave = getpass.getpass("Contraseña: ") if sys.stdin.isatty() else sys.stdin.readline().rstrip("\r\n")
    r = api.pedir("api/cuenta?accion=ingreso", "POST", {"correo": correo, "clave": clave})
    print(f'Listo, {r["cuenta"]["nombre"]}.' + ("" if r["cuenta"].get("equipo") else " Ojo: esta cuenta no está en CORREOS_EQUIPO."))


def cmd_salir(api, a):
    api.pedir("api/cuenta?accion=salir", "POST", {})
    sesiones = leer("sesion.json", {}); sesiones.pop(api.base, None); escribir("sesion.json", sesiones)
    print("Sesión cerrada.")


def cmd_nuevos(api, a):
    lista = api.pedir("api/equipo?accion=proyectos")["proyectos"]
    vistos = leer("vistos.json", {})
    filas = []
    for p in lista:
        antes = vistos.get(p["id"])
        motivo = "NUEVO" if antes is None else ("CAMBIÓ" if antes != firma(p) else "")
        if p["pide_ejecucion"]:
            motivo = (motivo + " · " if motivo else "") + f'PIDE EJECUTAR ({p["pide_ejecucion"]["agentes"]} agentes)'
        if a.todos or motivo:
            filas.append((motivo or "-", p))
    if not filas:
        print("Nada nuevo desde la última vez. Para ver todo: python operador.py nuevos --todos")
    for motivo, p in filas:
        estado = ESTADOS.get(p["estado"], p["estado"])
        print(f'\n{motivo}\n  {p["nombre"]}  ({p["tipo"]})  id: {p["id"]}\n  {p["cuenta"]["nombre"]} <{p["cuenta"]["correo"]}>'
              f'\n  Etapa {p["etapa"]}: {estado} · {p["archivos"]} documento(s) · creado {p["creado"][:16].replace("T", " ")}'
              + (f'\n  URL: {p["url"]}' if p["url"] else ""))
    if filas:
        print("\nPara bajar uno: python operador.py bajar <id>")
    for _, p in filas:
        if p.get("url"):
            actualizar_url_local(p["id"], p["url"])
        vistos[p["id"]] = firma(p)
    escribir("vistos.json", vistos)


def cmd_bajar(api, a):
    p = buscar(api, a.proyecto)
    d = api.pedir(f'api/equipo?accion=proyecto&cuenta={quote(p["cuenta"]["id"])}&id={quote(p["id"])}')
    pr = d["proyecto"]
    carpeta = PROYECTOS / f'{slug(pr["nombre"]) or "proyecto"}-{pr["id"].lower()}'
    fuentes = carpeta / "fuentes"
    fuentes.mkdir(parents=True, exist_ok=True)
    (carpeta / "proyecto.json").write_text(json.dumps({"cuenta": d["cuenta"], **pr}, ensure_ascii=False, indent=2), encoding="utf-8")
    if d["correos"]:
        (carpeta / "ficha.txt").write_text(d["correos"][-1]["cuerpo"], encoding="utf-8")
    for x in d["archivos"]:
        destino = fuentes / (("marca--" if x.get("clase") == "marca" else "") + Path(x["nombre"]).name)
        datos = api.pedir(f'api/equipo?accion=archivo&cuenta={quote(d["cuenta"]["id"])}&p={quote(x["pathname"])}', crudo=True)
        destino.write_bytes(datos)
        print(f"  documento: {destino.relative_to(AQUI)}")
        if destino.suffix.lower() == ".zip":  # el motor lee documentos sueltos: se abren solo los de texto
            with zipfile.ZipFile(destino) as z:
                for n in z.namelist():
                    if TEXTUALES.search(n) and ".." not in n and not n.startswith("/"):
                        z.extract(n, fuentes / destino.stem)
            print(f"    abierto en {(fuentes / destino.stem).relative_to(AQUI)} (solo documentos de texto)")
    en = (pr.get("fuentes") or {}).get("entradas") or {}
    print(f'\nBajado en {carpeta}\n')
    if pr["tipo"] == "sintetico":
        arranque = {
            "id": slug(pr["nombre"]) or pr["id"].lower(), "nombre": pr["nombre"],
            # El público (a quién representa la cohorte) no se deduce de la intención: se define al iniciar el proyecto.
            "publico": "Por definir al iniciar el proyecto en el motor",
            # El motor busca las fuentes desde la raíz del repositorio (como en edoc-uae.arranque.json).
            "conversaciones": [f'{fuentes.relative_to(AQUI.parent.parent).as_posix()}/**/*.*'],
            "reglas_negocio": [x for x in [en.get("intencion"), f'Alcance: {en["alcance"]}' if en.get("alcance") else "",
                                           f'Problemas que identificó el cliente: {en["analizar"]}' if en.get("analizar") else ""] if x],
            "url": pr.get("url", "")
        }
        (carpeta / "arranque.json").write_text(json.dumps(arranque, ensure_ascii=False, indent=2), encoding="utf-8")
        vincular(pr["id"], d["cuenta"]["id"], arranque["id"], pr.get("url", ""))
        print("Estudio sintético. Siguiente paso, en Claude Code (motor de agentes):")
        print(f'  /agentes-iniciar-proyecto {arranque["id"]} {arranque["url"]} {fuentes}')
        print(f'  (el arranque ya está listo en {carpeta / "arranque.json"})')
        print("Deja corriendo el vigilante: cada minuto reporta a la plataforma lo que haga el motor.")
        print("  python operador.py vigilar")
    elif pr["tipo"] == "completo":
        # El motor de creación es independiente: se le da esta carpeta como contexto, igual que al motor de agentes.
        mid = slug(pr["nombre"]) or pr["id"].lower()
        vincular(pr["id"], d["cuenta"]["id"], mid, pr.get("url", ""), tipo="creacion")
        print("Proyecto completo. Siguiente paso, en Claude Code (motor de creación de productos):")
        print(f"  /creacion-iniciar-proyecto {mid} {carpeta}" + (f" {pr['url']}" if pr.get("url") else ""))
        print("Deja corriendo el vigilante: publica al cliente cada escenario que cierre el motor.")
        print("  python operador.py vigilar")
    elif pr["tipo"] == "qa":
        # El motor de QA visual es independiente: se le da esta carpeta. Las credenciales se bajan descifradas a un
        # archivo aparte (la carpeta está fuera de git) y el motor las mueve a su carpeta privada al crear el proyecto.
        mid = slug(pr["nombre"]) or pr["id"].lower()
        try:
            cred = api.pedir(f'api/equipo?accion=credenciales&cuenta={quote(d["cuenta"]["id"])}&id={quote(pr["id"])}')
            cred.pop("actualizado", None)
            (carpeta / "credenciales.json").write_text(json.dumps(cred, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"  credenciales: {len(cred.get('grupos') or {})} grupo(s){' y token de Figma' if cred.get('figma_token') else ''} (descifradas solo en este equipo)")
        except Exception:
            print("  sin credenciales guardadas en la plataforma")
        vincular(pr["id"], d["cuenta"]["id"], mid, pr.get("url", ""), tipo="qa")
        print("QA visual. Siguiente paso, en Claude Code (motor de QA visual):")
        print(f"  /qa-iniciar-proyecto {mid} {carpeta}")
        print("Deja corriendo el vigilante: publica al cliente el plan (caja 1) y el informe (caja 3).")
        print("  python operador.py vigilar")
    else:
        print("Seguimiento: revisa la ficha y configura la etiqueta de medición.")
    vistos = leer("vistos.json", {}); vistos[p["id"]] = firma(p); escribir("vistos.json", vistos)


def cmd_cuentas(api, a):
    for c in api.pedir("api/equipo?accion=cuentas")["cuentas"]:
        print(f'{c["correo"]:40} {c["nombre"]:28} {c["proyectos"]} proyecto(s) · creada {str(c["creado"])[:10]}')


def cmd_clave(api, a):
    import secrets
    # Contraseña temporal: la persona la usa para entrar y luego crea la suya con «¿Olvidaste tu contraseña?».
    clave = "Syn-" + secrets.token_urlsafe(9)
    r = api.pedir("api/equipo?accion=clave", "POST", {"correo": a.correo, "clave": clave})
    print(f'Contraseña temporal de {r["nombre"]} <{r["correo"]}>: {clave}')


def cmd_url(api, a):
    p = buscar(api, a.proyecto)
    nueva = a.url if a.url.lower().startswith(("http://", "https://")) else "https://" + a.url
    r = api.pedir("api/equipo?accion=url", "POST", {"cuenta": p["cuenta"]["id"], "id": p["id"], "url": nueva})
    actualizar_url_local(p["id"], r["url"])
    print(f'{r["nombre"]}: la URL ahora es {r["url"]}.')


def actualizar_url_local(pid, url):
    # El vigilante y el arranque del motor usan la URL nueva.
    v = leer("vinculos.json", {})
    if pid in v:
        v[pid]["url"] = url; escribir("vinculos.json", v)
    for arr in PROYECTOS.glob(f"*-{pid.lower()}/arranque.json"):
        d = json.loads(arr.read_text(encoding="utf-8")); d["url"] = url
        arr.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding="utf-8")


def cmd_publicar(api, a):
    import conector_motor as con
    p = buscar(api, a.proyecto)
    v = leer("vinculos.json", {}).get(p["id"])
    if not v:
        sys.exit("Este proyecto no está ligado al motor. Usa: python operador.py vincular <proyecto> <id en el motor>")
    motor = Path(a.motor).resolve()
    c = estudio_elegido(motor, v, a.estudio)
    est = con.estudio(c, con.proyectos_motor(motor), v["motor_id"])
    import propuestas as prop
    est["ui"] = prop.hallazgos_ui(c)
    for h in est.get("hallazgos", []):
        h["capa"] = prop.capa_de(h.get("tipo", ""))
    est["indicadores"] = prop.indicadores_hallazgos(c)
    print(f"Publicando {c.name} y su recorrido…")
    rec = publicar_recorrido(api, v["cuenta"], p["id"], c)
    if rec:
        est["recorrido"] = {"href": rec["href"]}
    ux_n = sum(1 for h in est.get("hallazgos", []) if h.get("capa") == "UX")
    ui_n = len(est.get("hallazgos", [])) - ux_n + sum(1 for h in est["ui"] if h.get("verificado"))
    base = {"cuenta": v["cuenta"], "id": p["id"]}
    api.pedir("api/equipo?accion=etapa", "POST", {**base, "n": 2, "estado": "lista", "logros": [
        f"{est.get('agentes') or '?'} agentes recorrieron tu producto en {est.get('recorridos') or '?'} recorridos", f"{ux_n + ui_n} hallazgos con su evidencia"]})
    api.pedir("api/equipo?accion=etapa", "POST", {**base, "n": 3, "estado": "lista", "resultado": est,
              "motor": {"proyecto_id": v["motor_id"], "estudio": c.name},
              "logros": [f"{ux_n + ui_n} hallazgos listos para que los audites: {ux_n} de experiencia (UX) y {ui_n} de interfaz (UI)"]})
    estado = leer("vigilancia.json", {}); estado.setdefault(p["id"], {})["estudio"] = c.name; escribir("vigilancia.json", estado)
    print(f'{p["nombre"]}: {c.name} publicado ({ux_n} UX, {ui_n} UI, recorrido de {rec["archivos"] if rec else 0} archivos). '
          f'Sigue con: python operador.py propuestas {p["id"]} --regenerar --estudio {c.name}')


def estudio_elegido(motor, v, nombre=None):
    """El estudio que pide el analista (--estudio) o, si no dice, el más reciente del proyecto."""
    c = (motor / "salidas" / nombre) if nombre else _estudio_del_proyecto(motor, v["motor_id"], v.get("url", ""), 0)
    if not c or not (c / "backlog-ux.json").exists():
        sys.exit(f"No hay un estudio terminado{' con ese nombre' if nombre else ' de este proyecto'}.")
    return c


def cmd_reiniciar(api, a):
    p = buscar(api, a.proyecto)
    r = api.pedir("api/equipo?accion=reiniciar", "POST", {"cuenta": p["cuenta"]["id"], "id": p["id"], "desde": a.desde})
    estado = leer("vigilancia.json", {}); estado.pop(p["id"], None); escribir("vigilancia.json", estado)
    print(f'{r["reiniciado"]}: desde la etapa {r["desde"]} espera al analista; lo demás, en cola.')


def cmd_borrar(api, a):
    p = buscar(api, a.proyecto)
    if not a.si:
        sys.exit(f'Esto borra «{p["nombre"]}» de {p["cuenta"]["correo"]} con sus documentos. Para confirmar, repite con --si')
    r = api.pedir("api/equipo?accion=borrar", "POST", {"cuenta": p["cuenta"]["id"], "id": p["id"]})
    v = leer("vinculos.json", {}); v.pop(p["id"], None); escribir("vinculos.json", v)
    print(f'Borrado «{r["borrado"]}» y {r["archivos"]} documento(s).')


def cmd_etapa(api, a):
    p = buscar(api, a.proyecto)
    estado = {"en-curso": "en_curso", "lista": "lista"}[a.estado]
    r = api.pedir("api/equipo?accion=etapa", "POST", {"cuenta": p["cuenta"]["id"], "id": p["id"], "n": a.n, "estado": estado,
                                                        "logros": a.logro or None, "nota": a.nota or ""})
    print(f'{p["nombre"]}: etapa {r["etapa"]} → {ESTADOS.get(r["estado"], r["estado"])}.')


# ---------------------------------------------------------------- Vigilante del motor de agentes
# Lee lo que el motor deja en disco (solo lectura, sin tocarlo) y reporta cada paso a la plataforma:
#   0 Lectura de tus fuentes   → existe proyectos/<id>.json
#   1 Cohorte y recorridos     → cohorte.json y recorridos.json con recorridos reales
#   2 Ejecución de los agentes → un estudio del proyecto en salidas/; avance según eventos.jsonl
#   3 Informe y ajustes        → backlog-ux.json del estudio: se publican los hallazgos para auditar

def vincular(pid, cuenta, motor_id, url, tipo=None):
    v = leer("vinculos.json", {})
    v[pid] = {**v.get(pid, {}), "cuenta": cuenta, "motor_id": motor_id, "url": url, "desde": v.get(pid, {}).get("desde") or datetime.now().timestamp()}
    if tipo:
        v[pid]["tipo"] = tipo
    escribir("vinculos.json", v)


def cmd_vincular(api, a):
    p = buscar(api, a.proyecto)
    vincular(p["id"], p["cuenta"]["id"], a.motor_id, p.get("url", ""), tipo="creacion" if a.creacion else None)
    motor = "de creación de productos" if a.creacion else "de agentes"
    print(f'{p["nombre"]} queda ligado al proyecto «{a.motor_id}» del motor {motor}. Corre: python operador.py vigilar')


def _estudio_del_proyecto(motor, mid, url, desde):
    """El estudio más reciente de este proyecto hecho después de ligarlo."""
    mejor = None
    for c in sorted((motor / "salidas").glob("estudio-completo-*")):
        if not c.is_dir() or c.stat().st_mtime < desde - 60:
            continue
        inf = _json(c / "informe.json") or {}
        bk = _json(c / "backlog-ux.json") or {}
        pre = _json(c / "prevalidacion-web.json") or {}
        suyo = ((inf.get("proyecto") or {}).get("id") == mid or (bk.get("estudio") or {}).get("proyecto_id") == mid
                or (url and pre.get("base_url", "").rstrip("/") == url.rstrip("/")))
        if suyo and (mejor is None or c.stat().st_mtime >= mejor.stat().st_mtime):
            mejor = c
    return mejor


def _json(f):
    try:
        return json.loads(f.read_text(encoding="utf-8"))
    except Exception:
        return None


def _agentes(carpeta):
    ini = fin = 0
    f = carpeta / "eventos.jsonl"
    if f.exists():
        with f.open(encoding="utf-8", errors="ignore") as h:
            for linea in h:
                if '"agente.inicio"' in linea: ini += 1
                elif '"agente.fin"' in linea: fin += 1
    return ini, fin


def revisar(api, motor, pid, v, hecho):
    """Una pasada: devuelve lo que se reportó."""
    import conector_motor as con
    dicho = []
    def etapa(n, estado, **extra):
        api.pedir("api/equipo?accion=etapa", "POST", {"cuenta": v["cuenta"], "id": pid, "n": n, "estado": estado, **extra})
        dicho.append(f"etapa {n}: {estado}" + (f" ({extra.get('detalle')})" if extra.get("detalle") else ""))
    mid = v["motor_id"]
    pj = motor / "proyectos" / f"{mid}.json"
    if not pj.exists():
        if hecho.get("espera") != "0":
            hecho["espera"] = "0"  # la etapa sigue «esperando al analista» hasta que el motor cree el proyecto
        return dicho
    datos = _json(pj) or {}
    mp = next((x for x in con.proyectos_motor(motor) if x["id"] == mid), {})
    if not hecho.get("0"):
        n = (mp.get("fuentes") or {}).get("total", 0)
        etapa(0, "lista", logros=[f"Leímos {n} documento{'s' if n != 1 else ''} tuyo{'s' if n != 1 else ''}" if n else "Configuramos tu producto en el motor"])
        hecho["0"] = True
    perfiles, recorridos = mp.get("perfiles") or [], [r for r in (mp.get("recorridos") or []) if r.get("id") != "ejemplo"]
    # Lo que el cliente ve y valida en las cajas 0 y 1: se publica cada vez que cambia en el motor.
    resumen = resumen_para_cliente(motor, mid, mp, pid)
    firma_resumen = json.dumps(resumen, sort_keys=True, ensure_ascii=False)
    if hecho.get("resumen") != firma_resumen:
        # Los rostros de las personas (FairFace, CC BY 4.0) se publican privados junto al proyecto.
        for x in resumen["perfiles"]:
            if x.get("foto_local"):
                try:
                    subir(api, v["cuenta"], f'{pid}/rostros/{Path(x["foto_local"]).name}', Path(x["foto_local"]).read_bytes(), "image/jpeg")
                except Exception as e:
                    dicho.append(f"no se pudo subir el rostro de {x['nombre']}: {e}"); x["foto"] = None
            x.pop("foto_local", None)
        etapa(1 if perfiles else 0, "progreso", proyecto_motor=resumen); hecho["resumen"] = firma_resumen
    if not hecho.get("1"):
        if perfiles and recorridos:
            etapa(1, "lista", logros=[f"{len(perfiles)} perfiles de personas basados en tus documentos",
                                      f"{len(recorridos)} recorridos con metas reales de tu producto"])
            hecho["1"] = True
        else:
            det = f"Armando la cohorte: {len(perfiles)} perfiles y {len(recorridos)} recorridos por ahora"
            if hecho.get("det1") != det:
                etapa(1, "progreso", detalle=det); hecho["det1"] = det
            return dicho
    c = _estudio_del_proyecto(motor, mid, v.get("url") or datos.get("url_base", ""), v["desde"])
    if not c:
        if hecho.get("det2") != "espera":
            etapa(2, "progreso", detalle="Prevalidando los recorridos antes de lanzar a los agentes"); hecho["det2"] = "espera"
        return dicho
    listo = (c / "backlog-ux.json").exists()
    if not listo:
        ini, fin = _agentes(c)
        det = (f"{fin} agente{'s terminaron' if fin != 1 else ' terminó'} su recorrido; {ini - fin} {'siguen' if ini - fin != 1 else 'sigue'}" if ini
               else "Prevalidando los recorridos antes de lanzar a los agentes")
        if hecho.get("det2") != det:
            etapa(2, "progreso", detalle=det); hecho["det2"] = det
        return dicho
    if hecho.get("estudio") == c.name:
        return dicho
    est = con.estudio(c, con.proyectos_motor(motor), mid)
    if not est:
        return dicho
    import propuestas as prop
    est["ui"] = prop.hallazgos_ui(c)   # hallazgos de interfaz (UI), junto a los de experiencia (UX)
    for h in est.get("hallazgos", []):  # UX o UI con la regla del motor (lo de superficie va a UI)
        h["capa"] = prop.capa_de(h.get("tipo", ""))
    try:  # el recorrido interactivo que el cliente abre en un popup desde el informe
        rec = publicar_recorrido(api, v["cuenta"], pid, c)
        if rec:
            est["recorrido"] = {"href": rec["href"]}; dicho.append(f"recorrido publicado ({rec['archivos']} archivos)")
    except Exception as e:
        dicho.append(f"no se pudo publicar el recorrido: {e}")
    if not hecho.get("2") or hecho.get("estudio") != c.name:
        etapa(2, "lista", logros=[f"{est.get('agentes') or '?'} agentes recorrieron tu producto",
                                  f"{len(est.get('hallazgos', []))} hallazgos con su evidencia"])
        hecho["2"] = True
    est["indicadores"] = prop.indicadores_hallazgos(c)   # qué gana el producto si corrige los hallazgos (caja 3)
    ux_n = sum(1 for h in est.get("hallazgos", []) if h.get("capa") == "UX")
    ui_n = len(est.get("hallazgos", [])) - ux_n + sum(1 for h in est["ui"] if h.get("verificado"))
    etapa(3, "lista", resultado=est, motor={"proyecto_id": mid, "estudio": c.name},
          logros=[f"{ux_n + ui_n} hallazgos listos para que los audites: {ux_n} de experiencia (UX) y {ui_n} de interfaz (UI)"])
    # Caja 4: las oportunidades sobre lo que ya funciona quedan en borrador para que el analista las pula y publique.
    ruta = archivo_propuestas(pid)
    ruta.write_text(json.dumps(prop.borrador(c), ensure_ascii=False, indent=1), encoding="utf-8")
    etapa(4, "progreso", detalle="Preparando las mejoras sobre lo que ya funciona, en tu lenguaje")
    dicho.append(f"borrador de mejoras en {ruta} · publícalo con: python operador.py propuestas {pid} --publicar")
    hecho["estudio"] = c.name
    return dicho


def archivo_propuestas(pid):
    carpeta = next(iter(PROYECTOS.glob(f"*-{pid.lower()}")), None)
    if carpeta is None:
        carpeta = ESTADO; carpeta.mkdir(exist_ok=True)
    return carpeta / "propuestas.json"


def cmd_propuestas(api, a):
    """Borrador de propuestas del último estudio: lo muestra, lo regenera o lo publica en la caja 4."""
    import conector_motor as con
    import propuestas as prop
    p = buscar(api, a.proyecto)
    ruta = archivo_propuestas(p["id"])
    if a.regenerar or not ruta.exists():
        v = leer("vinculos.json", {}).get(p["id"])
        if not v:
            sys.exit("Este proyecto no está ligado al motor. Usa: python operador.py vincular <proyecto> <id en el motor>")
        c = estudio_elegido(Path(a.motor).resolve(), v, a.estudio)
        ruta.write_text(json.dumps(prop.borrador(c), ensure_ascii=False, indent=1), encoding="utf-8")
    datos = json.loads(ruta.read_text(encoding="utf-8"))
    if "oportunidades" not in datos:
        sys.exit("Ese borrador es del formato anterior. Vuelve a crearlo con --regenerar.")
    ops = datos["oportunidades"]
    nombres = {"ahora": "Prioriza ahora", "despues": "Más adelante", "futuro": "A futuro"}
    print(f"Borrador: {ruta}")
    for h in ("ahora", "despues", "futuro"):
        ps = [x for x in ops if x["horizonte"] == h]
        print(f"  {nombres[h]} ({len(ps)}): " + "; ".join(x["titulo"] for x in ps[:3]) + (" …" if len(ps) > 3 else ""))
    if not a.publicar:
        print("Pule «titulo», «conviene» y «horizonte» en ese archivo (en el lenguaje del cliente) y publícalo con --publicar.")
        return
    datos["borrador"] = False
    datos["publicado"] = datetime.now().isoformat(timespec="seconds")
    ahora = sum(1 for x in ops if x["horizonte"] == "ahora")
    api.pedir("api/equipo?accion=etapa", "POST", {"cuenta": p["cuenta"]["id"], "id": p["id"], "n": 4, "estado": "lista", "propuestas": datos,
              "logros": [f"{len(ops)} oportunidades para mejorar lo que ya funciona, de experiencia (UX) e interfaz (UI)",
                         f"{ahora} para priorizar ahora; el resto, más adelante o a futuro"]})
    ruta.write_text(json.dumps(datos, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f'{p["nombre"]}: mejoras publicadas en la caja 4.')


def resumen_para_cliente(motor, mid, mp, pid=""):
    base = motor / "proyectos" / mid
    cohorte = _json(base / "cohorte.json") or {}
    rec = _json(base / "recorridos.json") or {}
    fu = mp.get("fuentes") or {}
    rostros = _json(motor / "proyectos" / f"{mid}" / "rostros.json") or {}
    def foto(perfil_id):
        r = rostros.get(perfil_id) or {}
        f = base / r["archivo"] if r.get("archivo") else None
        if not f or not f.exists():
            return {}
        return {"foto": f"publicado/{pid}/rostros/{f.name}", "foto_local": str(f),
                "foto_credito": f'{r.get("autor", "")} · {r.get("licencia", "")}'.strip(" ·")}
    return {
        "id": mid,
        "fuentes": {"total": fu.get("total", 0), "patrones": [], "archivos": [
            {"nombre": x["nombre"], "carpeta": "Tus documentos", "tipo": x.get("tipo", ""), "kb": x.get("kb", 0), "descripcion": x.get("descripcion", "")}
            for x in fu.get("archivos", [])]},
        "perfiles": [{"id": x.get("id"), "nombre": x.get("nombre"), "rol": x.get("rol"), "edad": x.get("edad"),
                      "dispositivo": x.get("dispositivo"), "objetivos": x.get("objetivos") or [], **foto(x.get("id"))}
                     for x in cohorte.get("perfiles", [])],
        # Sin las citas internas del motor («(archivo.txt: …)»): el cliente solo necesita la situación.
        "contextos": [re.sub(r"\s*\([^)]*\.(txt|pdf|docx?|md)[^)]*\)", "", x.get("descripcion") or x.get("id") or "").strip()
                      for x in cohorte.get("contextos", [])],
        "recorridos": [{"id": r.get("id"), "nombre": r.get("nombre"), "descripcion": r.get("descripcion"), "pasos": len(r.get("pasos", [])),
                        "objetivos": [p.get("objetivo") for p in r.get("pasos", []) if p.get("objetivo")]}
                       for r in rec.get("recorridos", []) if r.get("id") != "ejemplo"],
    }


# ---------------------------------------------------------------- motor de creación de productos (proyecto completo)
# El motor vive aparte (_creacion_productos/) y no sabe de la plataforma. El vigilante lee sus carpetas (solo lectura):
#   escenario-N/vuelta-K/entrada.md  → el escenario N está en curso (el cliente ve el reloj)
#   escenario-N/vuelta-K/cierre.json → se publican el prototipo y los logros; el cliente revisa
CREACION = AQUI.parent.parent / "_creacion_productos" / "proyectos"
sys.path.insert(0, str(CREACION.parent))
import cajas as K   # las cajas del motor por su función (numeración del 2026-10-08)

# Etapa de la plataforma de cada caja del motor: desde el 2026-10-08 el catálogo «completo» de index.html tiene las
# mismas cajas (1 a 11, con 3.1 y 4.1), así que es el mismo número (las de decimal van como número: 3.1, 4.1).
ETAPA_PLATAFORMA = {m: (float(m) if isinstance(m, str) else m) for m in K.CAJAS[1:]}


def caja_del_motor(mid: str, etapa):
    """La caja del motor que corresponde a una etapa de la plataforma (el mismo número)."""
    try:
        return K.caja_id(f"{float(etapa):g}")
    except (TypeError, ValueError):
        return None
PREGUNTAS_ESCENARIO = {   # las mismas de index.html (PREGUNTAS), por caja
    1: {"menu": "¿El menú es válido para ti?", "menu_claro": "¿El menú se entiende? ¿Recomiendas algo más?", "contenido": "¿Las opciones del contenido son cómodas?", "falta": "¿Falta información que no estemos considerando?"},
    2: {"personas": "¿Las protopersonas se parecen a quienes usarán tu producto?", "escenarios": "¿Los escenarios son las tareas que de verdad hacen?", "lenguaje": "¿El lenguaje es el de tu público?", "falta": "¿Falta alguien o alguna situación?"},
    3: {"leer": "¿Todo se lee con comodidad (tamaños, contraste)?", "errores": "¿Los mensajes de error dicen qué hacer?", "teclado": "¿Se puede usar sin ratón y con lector de pantalla?", "falta": "¿Algo te costó más de lo que debería?"},
    3.1: {"gama": "¿La gama transmite lo que quieres que sienta tu público?", "marca": "¿Encaja con tu marca?", "falta": "¿Qué cambiarías del color?"},
    4: {"estilo": "¿La propuesta representa tu marca?", "jerarquia": "¿Lo importante es lo primero que se ve?", "imagenes": "¿Las imágenes y los íconos te sirven?", "falta": "¿Qué cambiarías de la propuesta elegida?"},
    4.1: {"recursos": "¿Los recursos propios representan tu marca?", "lugar": "¿Quedaron en el lugar correcto?", "falta": "¿Qué cambiarías?"},
    5: {"jerarquia": "¿Lo importante es lo primero que se ve?", "leer": "¿Se lee y se recorre con comodidad?", "imagenes": "¿Las imágenes y los íconos te sirven?", "falta": "¿Qué cambiarías del diseño?"},
    6: {"encontrar": "¿Encuentras cada cosa donde la esperas?", "caminos": "¿Algún camino queda a medias o sin salida?", "textos": "¿Los textos y botones dicen lo que va a pasar?", "falta": "¿Falta alguna pantalla o paso?"},
    7: {"empuja": "¿Algún mensaje te empuja de más o te incomoda?", "claro": "¿Se entiende qué pasa en cada paso y por qué?", "confianza": "¿Te da confianza para decidir?", "falta": "¿Algo te hizo dudar?"},
    8: {"volver": "¿Volverías a usarla? ¿Qué te haría volver?", "insiste": "¿Algo se siente insistente o adictivo?", "rutina": "¿Encaja en tu rutina real?", "falta": "¿Qué quitarías?"},
    9: {"voz": "¿Lo que dicen los agentes se parece a lo que dirían tus usuarios?", "personas": "¿Qué quieres comprobar con personas reales?", "falta": "¿Algo más antes de cerrar el diseño?"},
    10: {"sirve": "¿Qué recomendaciones te sirven para el futuro?", "ya": "¿Alguna te parece necesaria ya?", "falta": "¿Qué más te preocupa del impacto del producto?"},
}


# ---------------------------------------------------------------- motor de QA visual (pixel perfect)
# Vive aparte (_qa_visual/) y no sabe de la plataforma. El vigilante lee sus carpetas (solo lectura):
#   caja-N/vuelta-K/entrada.md  → la caja N está en curso
#   caja-N/vuelta-K/cierre.json → se publican sus logros; la caja 1 con «Lo que vamos a comparar» y la 3 con el informe
QA = AQUI.parent.parent / "_qa_visual" / "proyectos"
QA_PUBLICA = {1: ("resumen.html", ["resumen.html", "miniaturas"], "Plan de la comparación"),
              3: ("informe/index.html", ["informe", "informe.pdf"], "Informe de QA visual")}


def revisar_qa(api, motor_agentes, pid, v, hecho):
    dicho = []
    base = QA / v["motor_id"]
    if not (base / "proyecto.json").exists():
        return dicho
    for n in (1, 2, 3):
        for vuelta in sorted((base / f"caja-{n}").glob("vuelta-*"), key=lambda x: int(x.name.split("-")[1])):
            clave = f"qa-{n}-{vuelta.name}"
            if (vuelta / "entrada.md").exists() and not hecho.get("ini-" + clave):
                api.pedir("api/equipo?accion=etapa", "POST", {"cuenta": v["cuenta"], "id": pid, "n": n, "estado": "en_curso"})
                hecho["ini-" + clave] = True; dicho.append(f"caja {n} de QA visual en curso ({vuelta.name})")
            if (vuelta / "cierre.json").exists() and not hecho.get("fin-" + clave):
                datos = {"cuenta": v["cuenta"], "id": pid, "n": n, "estado": "lista",
                         "logros": [x.strip("-• ").strip() for x in (vuelta / "logros.txt").read_text(encoding="utf-8").splitlines() if x.strip()][:8]}
                if n in QA_PUBLICA:
                    doc, partes, nombre = QA_PUBLICA[n]
                    ruta = f"{pid}/qa/caja-{n}/{vuelta.name}"
                    for parte in partes:
                        x = vuelta / parte
                        for a in ([x] if x.is_file() else [y for y in x.rglob("*") if y.is_file()] if x.exists() else []):
                            subir(api, v["cuenta"], f"{ruta}/{a.relative_to(vuelta).as_posix()}", a.read_bytes(), TIPOS.get(a.suffix.lower(), "application/octet-stream"))
                    datos["prototipo"] = {"nombre": nombre, "href": f"publicado/{ruta}/{doc}"}
                api.pedir("api/equipo?accion=etapa", "POST", datos)
                hecho["fin-" + clave] = True
                dicho.append({1: "plan publicado; el cliente lo aprueba", 2: "comparación terminada; arranca el informe", 3: "informe publicado"}[n] + f" ({vuelta.name})")
    return dicho


def revisar_creacion(api, motor_agentes, pid, v, hecho):
    dicho = []
    base = CREACION / v["motor_id"]
    if not (base / "proyecto.json").exists():
        return dicho
    est_motor = _json(base / "estado.json") or {}
    for n in K.CAJAS[1:]:
        vueltas = sorted((base / f"escenario-{n}").glob("vuelta-*"), key=lambda x: int(x.name.split("-")[1]))
        etapa = ETAPA_PLATAFORMA.get(n)
        if n in K.OMITIBLES and est_motor.get(str(n), {}).get("estado") == "omitida" and not hecho.get(f"omitida-{n}"):
            api.pedir("api/equipo?accion=etapa", "POST", {"cuenta": v["cuenta"], "id": pid, "n": etapa, "estado": "omitida"})
            hecho[f"omitida-{n}"] = True; dicho.append(f"caja {n} omitida en el motor: en la plataforma queda hecha y sigue la próxima")
            continue
        if etapa is None:
            if vueltas and not hecho.get(f"sin-etapa-{n}"):
                hecho[f"sin-etapa-{n}"] = True
                dicho.append(f"la caja {n} ({K.nombre(n)}) no tiene etapa en la plataforma: no se publica")
            continue
        for vuelta in vueltas:
            clave = f"{n}-{vuelta.name}"
            if (vuelta / "entrada.md").exists() and not hecho.get("ini-" + clave):
                api.pedir("api/equipo?accion=etapa", "POST", {"cuenta": v["cuenta"], "id": pid, "n": etapa, "estado": "en_curso"})
                hecho["ini-" + clave] = True; dicho.append(f"caja {n} en curso ({vuelta.name}; etapa {etapa} de la plataforma)")
            if (vuelta / "cierre.json").exists() and not hecho.get("fin-" + clave):
                cierre = _json(vuelta / "cierre.json") or {}
                datos = {"cuenta": v["cuenta"], "id": pid, "n": etapa, "estado": "lista",
                         "logros": [x.strip("-• ").strip() for x in (vuelta / "logros.txt").read_text(encoding="utf-8").splitlines() if x.strip()][:8]}
                if cierre.get("respuesta_a_dudas"):
                    datos["respuesta"] = cierre["respuesta_a_dudas"]
                proto = vuelta / "prototipo"
                if (proto / "index.html").exists():
                    ruta = f"{pid}/escenario-{n}/{vuelta.name}/prototipo"
                    archivos = [x for x in proto.rglob("*") if x.is_file()]
                    for x in archivos:
                        subir(api, v["cuenta"], f"{ruta}/{x.relative_to(proto).as_posix()}", x.read_bytes(), TIPOS.get(x.suffix.lower(), "application/octet-stream"))
                    datos["prototipo"] = {"nombre": f"Prototipo · caja {n} · {vuelta.name.replace('-', ' ')}", "href": f"publicado/{ruta}/index.html"}
                api.pedir("api/equipo?accion=etapa", "POST", datos)
                hecho["fin-" + clave] = True; dicho.append(f"caja {n} entregada ({vuelta.name}; etapa {etapa} de la plataforma); el cliente revisa")
    return dicho


def cmd_respuestas(api, a):
    """Lo que respondió el cliente de un proyecto completo, en un archivo para dárselo al motor de creación."""
    p = buscar(api, a.proyecto)
    d = api.pedir(f'api/equipo?accion=proyecto&cuenta={quote(p["cuenta"]["id"])}&id={quote(p["id"])}')
    pr = d["proyecto"]; mid = leer("vinculos.json", {}).get(p["id"], {}).get("motor_id", "<id>")
    carpeta = next(iter(PROYECTOS.glob(f"*-{p['id'].lower()}")), PROYECTOS / f"{slug(pr['nombre'])}-{p['id'].lower()}")
    (carpeta / "respuestas").mkdir(parents=True, exist_ok=True)
    valor = {"si": "Sí", "parcial": "En parte", "no": "No"}
    hay = False
    for e in pr.get("etapas", []):
        for r in e.get("rondas") or []:
            if not r.get("respuestas") and not r.get("sin_dudas"):
                continue
            lineas = [f"# Respuestas del cliente · escenario {e['n']} · vuelta {r['n']}", ""]
            for o in (r.get("respuestas") or {}).values():
                lineas.append(f"## {str(o.get('fecha', ''))[:16].replace('T', ' ')}")
                if o.get("gusta"): lineas.append(f"- ¿Le gusta?: {'Sí' if o['gusta'] == 'si' else 'No'}")
                if o.get("cumple"): lineas.append(f"- ¿Cumple?: {valor.get(o['cumple'], o['cumple'])}")
                for q, x in (o.get("preguntas") or {}).items():
                    lineas.append(f"- {PREGUNTAS_ESCENARIO.get(e['n'], {}).get(q, q)}: {valor.get(x.get('v'), x.get('v') or '—')}" + (f" · «{x['c']}»" if x.get("c") else ""))
                if o.get("dudas"): lineas.append(f"- **Dudas:** {o['dudas']}")
                lineas.append("")
            if r.get("sin_dudas"):
                lineas.append("**Marcó «No tengo más dudas».**")
            f = carpeta / "respuestas" / f"escenario-{e['n']}-vuelta-{r['n']}.md"
            f.write_text("\n".join(lineas) + "\n", encoding="utf-8"); hay = True
            print(f"  {f}")
    for e in pr.get("etapas", []):
        rondas = e.get("rondas") or []
        if e.get("estado") == "pensando" and len(rondas) > 1:
            previa = carpeta / "respuestas" / f"escenario-{e['n']}-vuelta-{len(rondas) - 1}.md"
            m = caja_del_motor(mid, e["n"])
            print(f"\nEl cliente pidió la vuelta {len(rondas)} de la etapa {e['n']} (caja {m} del motor). En el motor de creación:")
            print(f"  /creacion-rehacer {mid} {m}  (con las respuestas de {previa})")
            return
    aprobados = [e["n"] for e in pr.get("etapas", []) if e.get("estado") == "hecha" and e.get("aprobada_en")]
    if aprobados:
        m = caja_del_motor(mid, max(aprobados))
        print(f"\nEl cliente aprobó hasta la etapa {max(aprobados)} (caja {m} del motor). En el motor de creación:")
        print(f"  python _creacion_productos/producto.py aprobado {mid} {m}")
        sig = K.CAJAS[K.CAJAS.index(m) + 1] if m in K.CAJAS and K.CAJAS.index(m) + 1 < len(K.CAJAS) else None
        if sig is not None:
            print(f"  /creacion-escenario {mid} {sig}   (caja {sig}: {K.nombre(sig)})")
        return
    print("\nEl cliente todavía está revisando." if hay else "\nTodavía no hay respuestas del cliente.")


def cmd_vigilar(api, a):
    import time
    motor = Path(a.motor).resolve()
    sys.path.insert(0, str(AQUI))
    print(f"Vigilando el motor en {motor}. Cada {a.cada} s reporta a {api.base}. Ctrl+C para salir.")
    while True:
        vinculos = leer("vinculos.json", {})
        estado = leer("vigilancia.json", {})
        for pid, v in vinculos.items():
            hecho = estado.setdefault(pid, {})
            try:
                revisor = {"creacion": revisar_creacion, "qa": revisar_qa}.get(v.get("tipo"), revisar)
                for linea in revisor(api, motor, pid, v, hecho):
                    print(f'{datetime.now():%H:%M} {pid} → {linea}')
            except SystemExit as e:
                print(f'{datetime.now():%H:%M} {pid}: {e}')
            escribir("vigilancia.json", estado)
        if a.una_vez:
            return
        time.sleep(a.cada)


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0], formatter_class=argparse.RawDescriptionHelpFormatter, epilog=__doc__)
    ap.add_argument("--base", default=BASE, help="Dirección de la plataforma")
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("ingresar"); s.add_argument("--correo")
    sub.add_parser("salir")
    s = sub.add_parser("nuevos"); s.add_argument("--todos", action="store_true")
    s = sub.add_parser("bajar"); s.add_argument("proyecto")
    s = sub.add_parser("etapa"); s.add_argument("proyecto"); s.add_argument("n", type=int); s.add_argument("estado", choices=["en-curso", "lista"])
    s.add_argument("--logro", action="append", help="Lo que logramos (se puede repetir)"); s.add_argument("--nota")
    sub.add_parser("cuentas")
    s = sub.add_parser("clave"); s.add_argument("correo")
    s = sub.add_parser("url"); s.add_argument("proyecto"); s.add_argument("url")
    s = sub.add_parser("propuestas"); s.add_argument("proyecto"); s.add_argument("--publicar", action="store_true")
    s.add_argument("--regenerar", action="store_true"); s.add_argument("--motor", default=str(AQUI.parent.parent / "_agentes_sinteticos"))
    s.add_argument("--estudio", help="Carpeta del estudio en salidas/ (si no, el más reciente)")
    s = sub.add_parser("publicar"); s.add_argument("proyecto"); s.add_argument("--estudio", help="Carpeta del estudio en salidas/ (si no, el más reciente)"); s.add_argument("--motor", default=str(AQUI.parent.parent / "_agentes_sinteticos"))
    s = sub.add_parser("reiniciar"); s.add_argument("proyecto"); s.add_argument("--desde", type=int, default=0)
    s = sub.add_parser("borrar"); s.add_argument("proyecto"); s.add_argument("--si", action="store_true")
    s = sub.add_parser("vincular"); s.add_argument("proyecto"); s.add_argument("motor_id"); s.add_argument("--creacion", action="store_true", help="Proyecto del motor de creación de productos")
    s = sub.add_parser("respuestas"); s.add_argument("proyecto")
    s = sub.add_parser("vigilar"); s.add_argument("--cada", type=int, default=60, help="Segundos entre revisiones")
    s.add_argument("--una-vez", action="store_true"); s.add_argument("--motor", default=str(AQUI.parent.parent / "_agentes_sinteticos"))
    a = ap.parse_args()
    api = Api(a.base)
    {"ingresar": cmd_ingresar, "salir": cmd_salir, "nuevos": cmd_nuevos, "bajar": cmd_bajar, "etapa": cmd_etapa,
     "cuentas": cmd_cuentas, "clave": cmd_clave, "url": cmd_url, "propuestas": cmd_propuestas, "publicar": cmd_publicar, "reiniciar": cmd_reiniciar, "borrar": cmd_borrar, "vincular": cmd_vincular, "respuestas": cmd_respuestas, "vigilar": cmd_vigilar}[a.cmd](api, a)


if __name__ == "__main__":
    main()
