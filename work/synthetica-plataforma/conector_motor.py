"""Conector de solo lectura entre la plataforma Synthetica y el motor de agentes.

Lee los proyectos y los estudios que produce `_agentes_sinteticos` y escribe
`datos-motor.js` junto a la plataforma. Nunca escribe dentro del motor ni lee
archivos de acceso o credenciales (`acceso.json`, bloques `acceso` o
`autenticacion` de los proyectos).

Uso:
    python conector_motor.py                 # motor en ../../_agentes_sinteticos
    python conector_motor.py --motor RUTA    # otra ubicación del motor

Correrlo después de cada estudio: la plataforma muestra el estudio nuevo y
conserva las validaciones ya hechas sobre los hallazgos que se repiten.
"""
from __future__ import annotations

import argparse
import glob
import json
import os
import re
import zipfile
from datetime import datetime
from pathlib import Path

AQUI = Path(__file__).resolve().parent
MOTOR_DEFECTO = AQUI.parent.parent / "_agentes_sinteticos"

# Campos del proyecto del motor que la plataforma puede ver. Todo lo demás
# (acceso, autenticación, interacción, selectores) se queda en el motor.
CAMPOS_PROYECTO = ("id", "nombre", "mercado", "publico", "url_base", "tipo_producto")

# Informes del estudio que se enlazan desde la plataforma, con lo que se ve al abrirlos.
ENTREGABLES = [
    ("index.html", "Índice del estudio", "Resumen del estudio y enlaces a todo lo demás"),
    ("recomendaciones-ux.html", "Recomendaciones UX", "Cada hallazgo con su evidencia, lentes expertas y cómo validarlo"),
    ("recomendaciones-ui.html", "Recomendaciones UI", "Mediciones de la interfaz marcadas sobre las capturas"),
    ("auditoria-experta.html", "Auditoría experta", "Normas, leyes de UX y métodos aplicados"),
    ("mirada-simulada.html", "Mirada simulada", "Por dónde se predice que mira cada agente"),
    ("reporte-frustraciones.html", "Frustraciones", "Dónde se frustraron los agentes y por qué"),
    ("satisfaccion-sintetica.html", "Satisfacción sintética", "NPS, CSAT y NASA-TLX de cada agente al terminar"),
    ("diagrama-flujo-errores.html", "Flujo y errores", "Recorridos con los pasos donde hubo errores"),
    ("mapas-calor.html", "Mapas de calor", "Clics y atención por vista"),
    ("goms-estados.html", "GOMS y KLM", "Metas, métodos y tiempos por paso"),
    ("workflow-live.html", "Monitor de la corrida", "La ejecución paso a paso de cada agente"),
]


def leer_json(ruta: Path):
    try:
        with ruta.open(encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def relativa(destino: Path) -> str:
    return Path(os.path.relpath(destino, AQUI)).as_posix()


# Nunca se lee ni se lista un archivo que pueda traer accesos o credenciales.
PROHIBIDOS = re.compile(r"link|acceso|credencial|password|contrase|clave|secret", re.I)


def resumen_archivo(f: Path) -> str:
    """Una línea que diga de qué trata el archivo, sacada de su propio contenido."""
    try:
        ext = f.suffix.lower()
        texto = ""
        if ext in (".txt", ".md", ".csv"):
            with f.open(encoding="utf-8", errors="ignore") as h:
                for linea in h:  # las primeras líneas con contenido, hasta tener una frase útil
                    linea = linea.strip().lstrip("#").strip()
                    if linea:
                        texto = f"{texto} · {linea}" if texto else linea
                    if len(texto) >= 80:
                        break
        elif ext == ".docx":
            with zipfile.ZipFile(f) as z:
                xml = z.read("word/document.xml").decode("utf-8", "ignore")
            texto = " ".join(re.sub(r"<[^>]+>", " ", xml.replace("</w:p>", " ")).split())
        elif ext == ".xlsx":
            with zipfile.ZipFile(f) as z:
                xml = z.read("xl/workbook.xml").decode("utf-8", "ignore")
            texto = "Hojas: " + ", ".join(re.findall(r'<sheet[^>]*name="([^"]+)"', xml))
        elif ext == ".pdf":
            try:
                from pypdf import PdfReader
                r = PdfReader(str(f))
                texto = " ".join((r.pages[0].extract_text() or "").split()) if r.pages else ""
            except Exception:
                texto = ""
        texto = texto.strip()
        return (texto[:157] + "…") if len(texto) > 160 else texto
    except Exception:
        return ""


def fuentes_de(d: dict, raiz: Path) -> dict:
    archivos, vistos = [], set()
    for patron in d.get("fuentes") or []:
        for ruta in sorted(glob.glob(str(raiz / patron), recursive=True)):
            f = Path(ruta)
            if not f.is_file() or f in vistos or PROHIBIDOS.search(f.name):
                continue
            vistos.add(f)
            archivos.append({"nombre": f.name, "carpeta": f.parent.relative_to(raiz).as_posix(), "tipo": f.suffix.lower().lstrip("."),
                             "kb": round(f.stat().st_size / 1024), "descripcion": resumen_archivo(f)})
    return {"patrones": d.get("fuentes") or [], "total": len(archivos), "archivos": archivos[:150]}


def proyectos_motor(motor: Path) -> list[dict]:
    salida = []
    for f in sorted((motor / "proyectos").glob("*.json")):
        if f.name.endswith(".arranque.json") or f.stem.upper().startswith("ARRANQUE"):
            continue
        d = leer_json(f)
        if not isinstance(d, dict) or "id" not in d:
            continue
        p = {k: d.get(k) for k in CAMPOS_PROYECTO if k in d}
        p["marca"] = (d.get("marca") or {}).get("nombre", "")
        p["fuentes"] = fuentes_de(d, motor.parent)
        carpeta = motor / "proyectos" / d["id"]
        cohorte = leer_json(carpeta / "cohorte.json") or {}
        p["perfiles"] = [{"id": x.get("id"), "nombre": x.get("nombre"), "rol": x.get("rol"), "edad": x.get("edad")}
                         for x in cohorte.get("perfiles", [])]
        p["contextos"] = [x.get("nombre") or x.get("id") for x in cohorte.get("contextos", [])]
        rec = leer_json(carpeta / "recorridos.json") or {}
        p["recorridos"] = [{"id": r.get("id"), "nombre": r.get("nombre"), "descripcion": r.get("descripcion"),
                            "pasos": len(r.get("pasos", []))} for r in rec.get("recorridos", [])]
        salida.append(p)
    return salida


# Qué medición de la vista corresponde a cada tipo de hallazgo (las demás son contexto).
MEDICION_POR_TIPO = {
    "competencia_visual": "compiten", "objetivo_lejano": "desplaz", "objetivo_visto_tarde": "no se ve sin desplazarse",
}
# Hallazgos que se miden elemento por elemento en todas las vistas: su evidencia es el conteo.
CONTEO_POR_VISTA = {
    "contraste_insuficiente": "textos con contraste insuficiente",
    "texto_pequeno": "textos más pequeños de lo recomendable",
    "objetivos_tactiles_pequenos": "controles táctiles más pequeños de lo recomendable",
}


def evidencia_de(h: dict) -> list[str]:
    """Lo que se observó del problema: los ejemplos del hallazgo y la medición de su tipo.
    `caso.que_paso` no sirve aquí: cuenta cómo terminó el paso, no el problema."""
    caso = h.get("caso") or {}
    salida = []
    for x in (h.get("ejemplos") or []) + [caso.get("ejemplo") or ""]:
        # Los selectores técnicos (`button[type="submit"]`) no dicen nada a quien audita.
        x = re.sub(r"\s*`[^`]*`", "", x).strip()
        if x and x not in salida:
            salida.append(x)
    unidad = CONTEO_POR_VISTA.get(h.get("tipo"))
    vistas = h.get("vistas") or {}
    if unidad and vistas:
        nombres = h.get("vistas_nombres") or {}
        top = sorted(vistas.items(), key=lambda kv: -kv[1])[:4]
        detalle = ", ".join(f"{nombres.get(v, v)} ({n})" for v, n in top)
        total = sum(vistas.values())
        salida.append(f"{total} {unidad} en {len(vistas)} {'vista' if len(vistas) == 1 else 'vistas'}; donde más: {detalle}")
        return salida
    clave = MEDICION_POR_TIPO.get(h.get("tipo"))
    if clave:
        salida += [x for x in caso.get("exigencias") or [] if clave in x.lower() and x not in salida]
    return salida


def hallazgo(h: dict, quick: set) -> dict:
    caso = h.get("caso") or {}
    # Si el hallazgo se mide en varias vistas, no se nombra solo la del caso de ejemplo.
    varias = h.get("tipo") in CONTEO_POR_VISTA and len(h.get("vistas") or {}) > 1
    return {
        "id": h["id"],
        "tipo": h.get("tipo"),
        "titulo": h.get("titulo"),
        "severidad": h.get("severidad"),
        "vista": f"{len(h['vistas'])} vistas" if varias else caso.get("vista_nombre") or h.get("vista"),
        "recorrido": "" if varias else caso.get("recorrido_nombre") or ", ".join((h.get("recorridos_nombres") or {}).values()),
        "control": caso.get("control") or "",
        "evidencia": evidencia_de(h),
        "por_que": caso.get("por_que") or [],
        "resultado_paso": re.sub(r"\s*`[^`]*`", "", caso.get("que_paso") or "").strip(),
        "recomendacion": h.get("recomendacion"),
        "criterio": h.get("criterio"),
        "validacion": h.get("validacion"),
        "validacion_texto": h.get("validacion_texto"),
        "cambio": h.get("cambio_texto"),
        "esfuerzo": h.get("esfuerzo"),
        "afectados": h.get("agentes_afectados"),
        "expuestos": h.get("agentes_expuestos"),
        "dispositivos": h.get("dispositivos", []),
        "estado": h.get("estado"),
        "quick_win": h["id"] in quick,
    }


def estudio(carpeta: Path, proyectos: list[dict], defecto: str) -> dict | None:
    b = leer_json(carpeta / "backlog-ux.json")
    if not isinstance(b, dict) or "hallazgos" not in b:
        return None
    e = b.get("estudio", {})
    pid = e.get("proyecto_id")
    if not pid:  # estudios anteriores a que el motor guardara el id del proyecto
        pid = next((p["id"] for p in proyectos if p.get("nombre") == e.get("proyecto")), defecto)
    consumo = leer_json(carpeta / "consumo.json") or {}
    cob = leer_json(carpeta / "cobertura-userflow.json") or {}
    cobp = leer_json(carpeta / "cobertura-producto.json") or {}
    sat = (leer_json(carpeta / "satisfaccion-sintetica.json") or {}).get("resumen") or {}
    tlx = sat.get("nasa_tlx") or {}
    quick = set(b.get("quick_wins", []))
    videos = sorted((carpeta / "videos").glob("*.webm")) if (carpeta / "videos").is_dir() else []
    return {
        "carpeta": carpeta.name,
        "proyecto_id": pid,
        "fecha_hora": e.get("fecha_hora"),
        "agentes": e.get("agentes"),
        "recorridos": e.get("recorridos"),
        "version_recorridos": e.get("version_recorridos"),
        "version_medicion": e.get("version_medicion"),
        "pasos": consumo.get("pasos"),
        "duracion_s": consumo.get("duracion_total_segundos"),
        "costo_usd": consumo.get("costo_ia_usd"),
        "cobertura_pasos": cob.get("cobertura_pasos"),
        "cobertura_vistas": cobp.get("cobertura_vistas_producto"),
        "satisfaccion": {
            "csat": sat.get("csat_media_1_5"),
            "nps": sat.get("nps_estimado"),
            "tlx": tlx.get("puntuacion_global_media_0_100"),
            "tlx_banda": tlx.get("banda"),
            "tlx_dominante": tlx.get("dimension_dominante_cohorte"),
        } if sat else None,
        "resumen": b.get("resumen", {}),
        "comparacion": b.get("cambios", {}),
        "limites": [{"recorrido": x.get("recorrido"), "paso": x.get("paso"), "que_paso": x.get("que_paso")}
                    for x in b.get("limites_medicion", [])],
        "hallazgos": [hallazgo(h, quick) for h in b["hallazgos"]],
        "entregables": [{"archivo": a, "titulo": t, "descripcion": d, "href": relativa(carpeta / a)}
                        for a, t, d in ENTREGABLES if (carpeta / a).exists()],
        "videos": [{"agente": v.stem, "href": relativa(v)} for v in videos],
    }


# El reporte en PDF: el resumen del estudio y, detrás, las recomendaciones UX priorizadas.
PARTES_REPORTE = ["index.html", "recomendaciones-ux.html"]


def reporte_pdf(carpeta: Path, destino: Path) -> dict | None:
    """PDF del reporte del estudio, impreso con Chromium con las secciones desplegadas.
    Solo se rehace si alguna parte cambió después del último PDF."""
    partes = [carpeta / a for a in PARTES_REPORTE if (carpeta / a).exists()]
    if not partes:
        return None
    destino.mkdir(exist_ok=True)
    pdf = destino / f"reporte-{carpeta.name}.pdf"
    if not pdf.exists() or pdf.stat().st_mtime < max(f.stat().st_mtime for f in partes):
        try:
            from playwright.sync_api import sync_playwright
            from pypdf import PdfWriter
        except ImportError:
            print("  (faltan Playwright o pypdf: no se genera el PDF del reporte)")
            return None
        temporales = []
        with sync_playwright() as pw:
            nav = pw.chromium.launch()
            for n, fuente in enumerate(partes):
                pagina = nav.new_page()
                pagina.goto(fuente.resolve().as_uri(), wait_until="networkidle")
                pagina.evaluate("document.querySelectorAll('details').forEach(d => d.open = true)")
                pagina.emulate_media(media="print")
                tmp = destino / f".parte-{n}.pdf"
                pagina.pdf(path=str(tmp), format="A4", print_background=True,
                           margin={"top": "14mm", "bottom": "14mm", "left": "12mm", "right": "12mm"})
                temporales.append(tmp)
            nav.close()
        unido = PdfWriter()
        for tmp in temporales:
            unido.append(str(tmp))
        with pdf.open("wb") as h:
            unido.write(h)
        for tmp in temporales:
            tmp.unlink()
    try:
        from pypdf import PdfReader
        paginas = len(PdfReader(str(pdf)).pages)
    except Exception:
        paginas = None
    return {"href": relativa(pdf), "mb": round(pdf.stat().st_size / 1024 / 1024, 1), "paginas": paginas}


# El recorrido interactivo (workflow-live.html) es lo único del estudio que se publica en la web
# para el cliente, además del reporte. Se copia con el estilo de la plataforma: el motor no se toca.
ESTILO_PLATAFORMA = """
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet">
<style id="estilo-plataforma">
:root{--ui-blue:#5C43C5;--ui-blue-2:#7156D9;--ui-green:#247A61;--ui-red:#C93F4F;--ui-orange:#B96A16;--ui-ink:#242327;
  --ui-gray:#66616F;--ui-bg:#F4F2F8;--board:#FFFFFF;--line:#DDD8E7;--title:'Manrope',Arial,sans-serif;--body:'Manrope',Arial,sans-serif}
body{background:var(--ui-bg)!important;color:var(--ui-ink)!important}
.top,.report-topbar{background:#FFFFFF!important;color:#242327!important;border-bottom:1px solid #DDD8E7!important;box-shadow:none!important}
.top *,.report-topbar *{color:inherit}
.brand-copy p,.report-topbar p{color:#66616F!important}
.board,.report-hero{border-color:#DDD8E7!important;box-shadow:0 10px 24px rgba(92,67,197,.08)!important}
.report-hero{border-top-color:#7156D9!important}
h1,h2,h3{letter-spacing:-.01em}
/* En la plataforma no se muestra el estado de la corrida ni el enlace al estudio completo del motor. */
.live,a[href="index.html"]{display:none!important}
/* Embebido en la plataforma (?embebido=1): sin cabeceras, solo el recorrido. */
html.embebido .fecha-estudio-global,html.embebido .top,html.embebido .report-topbar,html.embebido .report-hero{display:none!important}
html.embebido main{margin-top:.5rem!important}
</style>
<script>if(/[?&]embebido=1/.test(location.search))document.documentElement.classList.add('embebido')</script>
"""


def estado_recorrido(motor: Path, carpeta: Path) -> dict | None:
    """Rearma el estado del recorrido (agentes, metas, clics y mirada por punto) reproduciendo
    eventos.jsonl con el propio monitor del motor, en memoria. No escribe nada en el motor.
    Hace falta porque el workflow-live.html guardado puede haberse regenerado sin los eventos."""
    try:
        import sys
        if str(motor) not in sys.path:
            sys.path.insert(0, str(motor))
        from agentes_sinteticos import monitor_workflow as mw
        from agentes_sinteticos.proyecto import cargar_proyecto, recorridos_del_proyecto
        b = leer_json(carpeta / "backlog-ux.json") or {}
        pid = (b.get("estudio") or {}).get("proyecto_id") or (motor / "proyectos" / "predeterminado.txt").read_text(encoding="utf-8").strip()
        proyecto = cargar_proyecto(motor / "proyectos" / f"{pid}.json")
        monitor = mw.MonitorWorkflow(carpeta, [], list(recorridos_del_proyecto(proyecto)))
        eventos = [json.loads(l) for l in (carpeta / "eventos.jsonl").open(encoding="utf-8")]
        for e in eventos:
            if e.get("tipo") == "agente.inicio":
                d = e["datos"]; aid = d["agente"]
                monitor._estado["agentes"][aid] = {
                    "id": aid, "nombre": d.get("perfil", aid), "dispositivo": d.get("dispositivo"),
                    "viewport": [390, 844] if d.get("dispositivo") == "movil" else [1440, 900],
                    "contexto": d.get("contexto", ""), "trayectoria": (d.get("trayectoria_uso") or {}).get("tipo", ""),
                    "recorridos_asignados": [], "metas": [], "trazas": {}, "estado": "esperando", "recorrido": None,
                    "paso": None, "progreso": 0, "total": 0, "tiempo_paso_s": 0, "pensamiento": "", "pregunta": "", "error": None}
        mapa = leer_json(carpeta / "mapa-sitio.json")
        if mapa:
            monitor.incorporar_mapa_sitio(mapa)
        for e in eventos:
            monitor.registrar(e)
        estado = monitor.snapshot()
        informe = leer_json(carpeta / "informe.json") or {}
        if informe.get("resultados"):
            mw.incorporar_detalles_cognitivos(estado, informe["resultados"], carpeta)
        return {"estado": estado, "html": mw._html_dashboard(estado)}
    except Exception as e:  # si el motor cambia, se publica el recorrido tal como está
        print(f"  (no se pudo rearmar el recorrido de {carpeta.name}: {e})")
        return None


def publicar_recorrido(carpeta: Path, destino: Path) -> dict | None:
    fuente = carpeta / "workflow-live.html"
    if not fuente.exists():
        return None
    salida = destino / f"recorrido-{carpeta.name}"
    html_out = salida / "index.html"
    if html_out.exists() and html_out.stat().st_mtime >= (carpeta / "eventos.jsonl").stat().st_mtime and html_out.stat().st_mtime >= fuente.stat().st_mtime:
        return {"href": relativa(html_out)}
    salida.mkdir(parents=True, exist_ok=True)
    rearmado = estado_recorrido(carpeta.parent.parent, carpeta)
    html = rearmado["html"] if rearmado else fuente.read_text(encoding="utf-8")
    html = html.replace("</head>", ESTILO_PLATAFORMA + "</head>", 1)
    # El logo y las capturas que usa el recorrido (clics y mirada por punto) van junto a él,
    # comprimidas en JPEG para la web.
    try:
        from PIL import Image
    except ImportError:
        Image = None
    refs = set(re.findall(r'(?:src|href)="((?:assets|capturas)/[^"]+)"', html)) | set(re.findall(r'"captura_rel":\s*"([^"]+)"', html))
    for rel in sorted(refs):
        origen = carpeta / rel
        if not origen.is_file():
            continue
        if Image and origen.suffix.lower() in (".png", ".jpg", ".jpeg") and rel.startswith("capturas/"):
            nuevo = re.sub(r"\.(png|jpe?g)$", ".jpg", rel, flags=re.I)
            (salida / nuevo).parent.mkdir(parents=True, exist_ok=True)
            img = Image.open(origen).convert("RGB")
            if img.size[0] > 720:
                img = img.resize((720, int(img.size[1] * 720 / img.size[0])), Image.LANCZOS)
            img.save(salida / nuevo, "JPEG", quality=58, optimize=True)
            if nuevo != rel:
                html = html.replace(rel, nuevo)
        else:
            (salida / rel).parent.mkdir(parents=True, exist_ok=True)
            (salida / rel).write_bytes(origen.read_bytes())
    html_out.write_text(html, encoding="utf-8")
    return {"href": relativa(html_out), "rearmado": bool(rearmado)}


def mapas_de_calor(carpeta: Path, destino: Path, nombres_vista: dict) -> dict | None:
    """Capturas con el calor ya pintado, una por vista y dispositivo, sumando a todos los agentes:
    - mirada simulada: fijaciones del modelo (no es eye tracking real);
    - clics: dónde hicieron clic, verde si respondió y rojo si no hubo respuesta.
    Se dibujan sobre la captura del viewport que guarda el motor, que usa las mismas coordenadas."""
    eventos = carpeta / "eventos.jsonl"
    if not eventos.exists():
        return None
    salida = destino / f"mapas-{carpeta.name}"
    indice = salida / "mapas.json"
    if indice.exists() and indice.stat().st_mtime >= eventos.stat().st_mtime:
        return json.loads(indice.read_text(encoding="utf-8"))
    try:
        import numpy as np
        from PIL import Image, ImageDraw
    except ImportError:
        print("  (faltan numpy o Pillow: no se generan los mapas de calor)")
        return None
    from urllib.parse import urlparse as _u
    vistas = {}
    with eventos.open(encoding="utf-8") as h:
        for linea in h:
            e = json.loads(linea)
            if e.get("tipo") != "paso.fin":
                continue
            d = e["datos"]; ev = d.get("evidencia") or {}; m = ev.get("mirada") or {}
            if not m.get("captura") or not Path(m["captura"]).exists():
                continue
            u = _u(ev.get("url") or "")
            clave_vista = (u.fragment or u.path).strip("/#").split("?")[0] or "inicio"
            disp = "movil" if (m.get("viewport") or [1440])[0] < 700 else "escritorio"
            v = vistas.setdefault((clave_vista, disp), {"captura": m["captura"], "viewport": m.get("viewport") or [1440, 900], "fij": [], "clics": []})
            v["fij"] += [(f["x"], f["y"]) for f in m.get("fijaciones") or [] if f.get("x") is not None]
            c = ev.get("coordenada_click_intencion")
            if c and ev.get("click_ejecutado"):
                v["clics"].append((c["x"], c["y"], bool(ev.get("click_muerto") or ev.get("click_sin_destino"))))
    if not vistas:
        return None
    salida.mkdir(parents=True, exist_ok=True)

    def calor(img, puntos, sigma):
        w, h = img.size; esc = 4
        gw, gh = max(1, w // esc), max(1, h // esc)
        yy, xx = np.mgrid[0:gh, 0:gw]
        campo = np.zeros((gh, gw), dtype=np.float32)
        for x, y in puntos:
            campo += np.exp(-(((xx - x / esc) ** 2 + (yy - y / esc) ** 2) / (2 * (sigma / esc) ** 2)))
        if campo.max() <= 0:
            return img
        campo /= campo.max()
        # rampa: transparente → azul → verde → amarillo → rojo
        paradas = [(0.0, (0, 0, 255)), (0.35, (0, 200, 120)), (0.65, (255, 220, 0)), (1.0, (230, 30, 30))]
        rgba = np.zeros((gh, gw, 4), dtype=np.uint8)
        for (a0, c0), (a1, c1) in zip(paradas, paradas[1:]):
            m = (campo >= a0) & (campo <= a1); t = ((campo - a0) / (a1 - a0))[m]
            for k in range(3):
                rgba[..., k][m] = (c0[k] + (c1[k] - c0[k]) * t).astype(np.uint8)
        rgba[..., 3] = (np.clip((campo - 0.05) / 0.95, 0, 1) * 170).astype(np.uint8)
        capa = Image.fromarray(rgba, "RGBA").resize((w, h), Image.BILINEAR)
        return Image.alpha_composite(img.convert("RGBA"), capa)

    items = []
    for (clave, disp), v in sorted(vistas.items()):
        base = Image.open(v["captura"]).convert("RGBA")
        k = base.size[0] / float(v["viewport"][0])  # captura y coordenadas a la misma escala
        nombre = nombres_vista.get(clave) or clave.replace("-", " ")
        for tipo, puntos in (("mirada", v["fij"]), ("clics", [(x, y) for x, y, _ in v["clics"]])):
            if not puntos:
                continue
            img = calor(base, [(x * k, y * k) for x, y in puntos], sigma=(38 if tipo == "mirada" else 30) * k)
            if tipo == "clics":
                dib = ImageDraw.Draw(img)
                for x, y, muerto in v["clics"]:
                    r = 9 * k; col = (201, 63, 79, 255) if muerto else (36, 122, 97, 255)
                    dib.ellipse([x * k - r, y * k - r, x * k + r, y * k + r], outline=col, width=max(2, int(3 * k)))
            img = img.convert("RGB")
            if img.size[0] > 1280:
                img = img.resize((1280, int(img.size[1] * 1280 / img.size[0])), Image.LANCZOS)
            archivo = f"{tipo}-{re.sub(r'[^a-z0-9]+', '-', clave.lower()).strip('-') or 'vista'}-{disp}.jpg"
            img.save(salida / archivo, "JPEG", quality=72, optimize=True)
            items.append({"tipo": tipo, "vista": nombre, "dispositivo": disp, "href": relativa(salida / archivo),
                          "puntos": len(puntos), "sin_respuesta": sum(1 for *_, mu in v["clics"] if mu) if tipo == "clics" else 0})
    datos = {"items": items, "nota": "La mirada es una predicción del modelo de agentes (mirada simulada), no eye tracking con personas."}
    indice.write_text(json.dumps(datos, ensure_ascii=False, indent=1), encoding="utf-8")
    return datos


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--motor", type=Path, default=MOTOR_DEFECTO)
    args = ap.parse_args()
    motor = args.motor.resolve()
    if not (motor / "proyectos").is_dir():
        raise SystemExit(f"No encuentro el motor en {motor}")

    defecto = ((motor / "proyectos" / "predeterminado.txt").read_text(encoding="utf-8").strip()
               if (motor / "proyectos" / "predeterminado.txt").exists() else "")
    proyectos = proyectos_motor(motor)
    estudios = [x for c in sorted((motor / "salidas").glob("estudio-completo-*")) if c.is_dir()
                for x in [estudio(c, proyectos, defecto)] if x]
    estudios.sort(key=lambda x: x["fecha_hora"] or "")
    # PDF del reporte del estudio vigente de cada proyecto (el último).
    for p in proyectos:
        es = [e for e in estudios if e["proyecto_id"] == p["id"]]
        if es:
            es[-1]["reporte_pdf"] = reporte_pdf(motor / "salidas" / es[-1]["carpeta"], AQUI / "descargas")
            es[-1]["recorrido"] = publicar_recorrido(motor / "salidas" / es[-1]["carpeta"], AQUI / "descargas")
            b = leer_json(motor / "salidas" / es[-1]["carpeta"] / "backlog-ux.json") or {}
            nombres = {k: v for h in b.get("hallazgos", []) for k, v in (h.get("vistas_nombres") or {}).items()}
            es[-1]["mapas"] = mapas_de_calor(motor / "salidas" / es[-1]["carpeta"], AQUI / "descargas", nombres)

    datos = {
        "generado": datetime.now().isoformat(timespec="seconds"),
        "motor": motor.as_posix(),
        "proyectos": proyectos,
        "estudios": estudios,
    }
    destino = AQUI / "datos-motor.js"
    destino.write_text("// Generado por conector_motor.py. No editar a mano: se reescribe en cada lectura del motor.\n"
                       "window.SYNTHETICA_MOTOR = " + json.dumps(datos, ensure_ascii=False, indent=1) + ";\n",
                       encoding="utf-8")
    print(f"{len(proyectos)} proyectos y {len(estudios)} estudios del motor -> {destino.name}")
    for p in proyectos:
        es = [e for e in estudios if e["proyecto_id"] == p["id"]]
        print(f"  {p['id']}: {len(es)} estudios" + (f", el último del {es[-1]['fecha_hora']} con {len(es[-1]['hallazgos'])} hallazgos" if es else ""))


if __name__ == "__main__":
    main()
