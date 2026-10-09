"""Propuestas de mejora e indicadores para el cliente, a partir de un estudio del motor (solo lectura).

Traduce los hallazgos técnicos (UX del backlog y UI de la evaluación de interfaz) a propuestas en el
lenguaje del cliente, las agrupa por cuándo conviene aplicarlas (ahora, más adelante, a futuro) y
calcula indicadores de producto con lo que pasó en el estudio:

- tropiezos que desaparecen: parte de las ocurrencias observadas que corresponden a lo propuesto;
- esfuerzo: cuántas propuestas son de esfuerzo bajo, medio o alto (el esfuerzo que estima el motor);
- pasos sin tropiezo: pasos de los agentes sin fricción hoy, y los esperados si se corrige lo propuesto;
- satisfacción (CSAT 1–5): la medida hoy y una estimación, con la relación observada entre los tropiezos
  y la satisfacción de cada agente. Es una estimación: se confirma al volver a correr el estudio.

El resultado es un borrador (JSON) que el analista puede pulir antes de publicarlo.
"""
from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

# Cómo se dice cada tipo de hallazgo en palabras del cliente: (propuesta, qué gana la persona, capa).
TEXTOS = {
    "icono_sin_nombre": ("Ponerle nombre a los botones que solo tienen un ícono",
                         "Todas las personas, también quien usa lector de pantalla, saben qué hace cada botón.", "UI"),
    "contraste_insuficiente": ("Hacer más legibles los textos que se ven apagados",
                               "Se leen sin esfuerzo, también en el celular al sol.", "UI"),
    "texto_pequeno": ("Agrandar los textos pequeños", "Se leen sin acercarse a la pantalla.", "UI"),
    "objetivos_tactiles_pequenos": ("Agrandar los botones y enlaces para tocarlos con el dedo",
                                    "Menos toques equivocados en el celular.", "UI"),
    "acierto_tactil_bajo": ("Hacer más fácil de pulsar {control} en el celular", "Menos toques fallidos.", "UI"),
    "fallo_de_apuntado": ("Hacer más fácil de pulsar {control}", "Menos clics en el lugar equivocado.", "UI"),
    "competencia_visual": ("Darle más protagonismo a {control} frente a lo que lo rodea",
                           "La mirada va primero a lo importante.", "UI"),
    "objetivo_visto_tarde": ("Mostrar {control} donde la persona mira primero", "Encuentra antes lo que busca.", "UI"),
    "objetivo_lejano": ("Acercar {control} para no tener que bajar tanto",
                        "La persona llega antes a la acción que quieres que haga.", "UX"),
    "termino_sin_explicar": ("Explicar {termino} con palabras de tu cliente",
                             "Nadie se queda sin entender una palabra clave.", "UX"),
    "duda_de_comprension": ("Aclarar qué pasa al pulsar {control}", "La persona decide con seguridad.", "UX"),
    "tarea_no_completada": ("Revisar el paso donde las personas no logran terminar", "Más personas completan la tarea.", "UX"),
    "control_incoherente": ("Hacer que {control} se vea y se comporte igual en todas partes",
                            "Nadie tiene que volver a aprender dónde está cada cosa.", "UX"),
    "parece_pulsable": ("Evitar que parezca un botón lo que no lo es", "Menos clics que no llevan a ningún lado.", "UI"),
    "obliga_a_recordar": ("Mostrar la información en vez de pedir que la recuerden", "Menos esfuerzo de memoria.", "UX"),
    "control_cambia_de_lugar": ("Dejar {control} siempre en el mismo lugar", "Se encuentra sin buscar.", "UX"),
    "control_sin_significado": ("Ponerle un nombre claro a los botones y enlaces que no dicen qué hacen",
                                "Nadie tiene que pulsar para descubrir a dónde lleva.", "UI"),
    "proposito_poco_claro": ("Decir desde el título para quién es cada página y qué se logra en ella",
                             "La persona sabe en segundos si está en el lugar correcto.", "UX"),
    "demasiado_texto": ("Poner arriba lo necesario para decidir y recortar el resto",
                        "Se decide sin leer de más.", "UX"),
    "texto_da_vueltas": ("Reescribir los textos para leerlos de un vistazo: frases cortas y lo importante primero",
                         "Se entiende a la primera, incluso con prisa.", "UX"),
    "imagenes_decorativas": ("Cambiar las imágenes decorativas por imágenes que informen",
                             "El espacio muestra lo que el cliente viene a buscar.", "UI"),
    "imagen_incongruente": ("Usar imágenes que muestren lo que dice cada página", "La página se entiende también por lo que se ve.", "UI"),
    "ambiguedad_precipita": ("Dejar una sola acción principal clara en cada paso",
                             "Menos decisiones apresuradas y equivocadas.", "UX"),
    "costo_mayor_esperado": ("Poner {control} donde la gente lo espera", "Se encuentra sin buscar.", "UX"),
    "accion_fuera_de_la_mirada": ("Llevar {control} a la zona que se mira primero", "La acción importante se ve de entrada.", "UI"),
}
# Evaluación de la interfaz (UI): por categoría, cuando el motor lo verificó.
TEXTOS_UI = {
    "Responsive": ("Evitar que la página se salga de la pantalla en el celular", "Se ve completa sin mover de lado a lado."),
    "Accesibilidad": ("Corregir lo que impide usar el sitio a personas con discapacidad", "Nadie queda por fuera."),
    "Tipografía": ("Ordenar los tamaños de letra", "Se entiende de un vistazo qué es título y qué es texto."),
    "Design system": ("Usar siempre los mismos colores y tamaños de tu marca", "El sitio se ve más cuidado y confiable."),
    "Objetivos interactivos": ("Agrandar las zonas que se pueden tocar", "Menos toques equivocados."),
    "Formularios": ("Facilitar el llenado de los formularios", "Se completan más rápido y con menos errores."),
    "Arquitectura de información": ("Ordenar la información de cada página", "Cada cosa está donde se espera."),
    "Iconografía": ("Usar un ícono distinto para cada acción", "Nadie confunde una acción con otra."),
    "Contenido": ("Ajustar los textos", "Se entienden sin releer."),
    "Estructura": ("Marcar bien las partes de cada página", "Quien navega con teclado o lector llega directo al contenido."),
    "Flujo": ("Revisar el orden de los pasos", "Menos vueltas para terminar."),
    "Componentes": ("Unificar los componentes que se repiten", "Todo se comporta igual en todo el sitio."),
    "Rendimiento percibido": ("Evitar esperas sin aviso", "La persona sabe que algo está pasando."),
}
HORIZONTES = ("ahora", "despues", "futuro")
ORDEN_ESF = {"bajo": 0, "medio": 1, "alto": 2}


def _json(f: Path):
    try:
        return json.loads(Path(f).read_text(encoding="utf-8"))
    except Exception:
        return None


def _nombre_control(h: dict) -> str:
    c = (h.get("controles") or [None])[0] or (h.get("caso") or {}).get("control") or ""
    c = re.sub(r"\s+", " ", str(c)).strip()
    return f"«{c[:48]}{'…' if len(c) > 48 else ''}»" if c else "este control"


def nombre_vista(clave: str, nombres: dict) -> str:
    """Nombre corto de una página: «Inicio», o su título sin el nombre del sitio."""
    if clave in ("index.html", "/", ""):
        return "Inicio"
    n = str(nombres.get(clave) or clave)
    n = re.split(r"\s+[|·—]\s+|\s+-\s+Caso de Éxito", n)[0].replace("-", " ").strip()
    return n[:1].upper() + n[1:55] + ("…" if len(n) > 55 else "")


def _vistas_legibles(h: dict, nombres: dict) -> list[str]:
    vs = list((h.get("vistas") or {}).keys()) or ([h["vista"]] if h.get("vista") and not str(h.get("vista")).endswith("vistas") else [])
    return [nombre_vista(v, nombres) for v in vs]


def horizonte_ux(h: dict) -> str:
    sev, esf = h.get("severidad", "P3"), h.get("esfuerzo", "medio")
    if h.get("quick_win") or (sev in ("P0", "P1") and esf in ("bajo", "medio")):
        return "ahora"
    if sev in ("P0", "P1") or (sev == "P2" and h.get("validacion") == "automatica" and esf != "alto"):
        return "despues"
    return "futuro"


def hallazgos_ui(carpeta: Path) -> list[dict]:
    """Lo que la evaluación de interfaz verificó (fallas de accesibilidad, defectos y desviaciones del sistema)."""
    ui = (_json(carpeta / "informe.json") or {}).get("evaluacion_ui") or {}
    nombres = ui.get("nombres_vistas") or {}
    sev = {"VERIFIED_ACCESSIBILITY_FAILURE": "P1", "VERIFIED_UI_DEFECT": "P1", "DESIGN_SYSTEM_DEVIATION": "P3",
           "POTENTIAL_USABILITY_ISSUE": "P3", "MANUAL_REVIEW_REQUIRED": "P3"}
    salida = []
    for h in ui.get("hallazgos") or []:
        ver = h.get("verificacion", "")
        salida.append({
            "id": h.get("id"), "capa": "UI", "categoria": h.get("categoria", ""), "verificacion": ver,
            "verificado": ver.startswith("VERIFIED") or ver == "DESIGN_SYSTEM_DEVIATION",
            "titulo": h.get("descripcion", ""), "recomendacion": h.get("accion", ""), "referencia": h.get("referencia", ""),
            "severidad": sev.get(ver, "P3"), "vistas": [nombre_vista(v, nombres) for v in (h.get("vistas") or [])],
            "dispositivo": h.get("dispositivo", ""), "elementos": len(h.get("elementos") or []),
        })
    return salida


def _tropiezos_por_agente_y_paso(carpeta: Path):
    """Pasos terminados y fricciones observadas, por agente y por paso (recorrido::paso)."""
    pasos, friccion = [], defaultdict(set)
    f = carpeta / "eventos.jsonl"
    if not f.exists():
        return pasos, friccion
    for linea in f.open(encoding="utf-8", errors="ignore"):
        try:
            e = json.loads(linea)
        except Exception:
            continue
        d = e.get("datos") or {}
        if e.get("tipo") == "paso.fin":
            clave = f'{d.get("recorrido_id")}::{d.get("paso_id")}'
            pasos.append((d.get("agente_id"), clave))  # «fricciones» de paso.fin son anotaciones de todos los pasos: no cuentan
        elif e.get("tipo") == "interaccion.camino" and d.get("estado") == "friccion":
            friccion[d.get("agente")].add(f'{d.get("recorrido")}::{d.get("paso")}')
    return pasos, friccion


def _regresion(xs: list[float], ys: list[float]):
    n = len(xs)
    if n < 4:
        return None
    mx, my = sum(xs) / n, sum(ys) / n
    sxx = sum((x - mx) ** 2 for x in xs)
    if sxx == 0:
        return None
    b = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sxx
    return my - b * mx, b


def generar(carpeta: Path, est: dict) -> dict:
    """Borrador de propuestas e indicadores de un estudio."""
    bk = _json(carpeta / "backlog-ux.json") or {}
    nombres = {}
    for h in bk.get("hallazgos", []):
        nombres.update(h.get("vistas_nombres") or {})
    ux = bk.get("hallazgos", [])
    # 1. Propuestas: se agrupan los hallazgos del mismo tipo para no repetir la misma idea en cada paso.
    grupos: dict[tuple, dict] = {}
    for h in ux:
        tipo = h.get("tipo", "")
        plantilla, gana, capa = TEXTOS.get(tipo, (h.get("titulo", ""), "", "UX"))
        clave = (capa, tipo)
        g = grupos.setdefault(clave, {"capa": capa, "tipo": tipo, "plantilla": plantilla, "gana": gana, "terminos": [],
                                      "hallazgos": [], "controles": [], "vistas": [], "pasos": set(), "ocurrencias": 0,
                                      "agentes": 0, "esfuerzo": "bajo", "horizonte": "futuro"})
        # El término técnico viene en «detalle»: todos los términos van en una sola propuesta.
        if tipo == "termino_sin_explicar" and h.get("detalle") and h["detalle"] not in g["terminos"]:
            g["terminos"].append(h["detalle"])
        g["hallazgos"].append(h.get("id"))
        ctrl = _nombre_control(h)
        if ctrl not in g["controles"]:
            g["controles"].append(ctrl)
        for v in _vistas_legibles(h, nombres):
            if v not in g["vistas"]:
                g["vistas"].append(v)
        g["pasos"].update(h.get("pasos_clave") or [])
        g["ocurrencias"] += int(h.get("ocurrencias") or 0) or int(h.get("agentes_afectados") or 0)
        g["agentes"] = max(g["agentes"], int(h.get("agentes_afectados") or 0))
        if ORDEN_ESF.get(h.get("esfuerzo", "medio"), 1) > ORDEN_ESF[g["esfuerzo"]]:
            g["esfuerzo"] = h.get("esfuerzo", "medio")
        hz = horizonte_ux(h)
        if HORIZONTES.index(hz) < HORIZONTES.index(g["horizonte"]):
            g["horizonte"] = hz
        g.setdefault("tecnico", []).append(h.get("recomendacion", ""))
    propuestas = []
    for g in grupos.values():
        ctrl = g["controles"][0] if len(g["controles"]) == 1 else "los botones clave"
        t = g["terminos"]
        termino = ("«" + "», «".join(t[:4]) + "»" + (f" y {len(t) - 4} más" if len(t) > 4 else "")) if t else "los términos técnicos"
        titulo = g["plantilla"].format(control=ctrl, termino=termino)
        if t:
            g["controles"] = []
        donde = g["vistas"][:4]
        propuestas.append({
            "id": "PM-" + (g["hallazgos"][0] or "x"), "capa": g["capa"], "titulo": titulo[:1].upper() + titulo[1:],
            "gana": g["gana"], "donde": donde, "mas_lugares": max(0, len(g["vistas"]) - len(donde)),
            "controles": [c for c in g["controles"] if c != "este control"][:5], "horizonte": g["horizonte"], "esfuerzo": g["esfuerzo"],
            "tropiezos": g["ocurrencias"], "agentes": g["agentes"], "hallazgos": g["hallazgos"], "pasos": sorted(g["pasos"]),
            "tecnico": [t for t in dict.fromkeys(g["tecnico"]) if t][:3],
        })
    # UI verificado por la evaluación de interfaz, agrupado por categoría.
    ui = hallazgos_ui(carpeta)
    por_cat = defaultdict(list)
    for h in ui:
        por_cat[h["categoria"]].append(h)
    for cat, hs in por_cat.items():
        verificado = any(h["verificado"] for h in hs)
        titulo, gana = TEXTOS_UI.get(cat, (f"Mejorar {cat.lower()}", ""))
        vistas = list(dict.fromkeys(v for h in hs for v in h["vistas"]))
        propuestas.append({
            "id": "PM-" + (hs[0]["id"] or cat), "capa": "UI", "titulo": titulo, "gana": gana,
            "donde": vistas[:4],
            "mas_lugares": max(0, len(vistas) - 4), "controles": [],
            "horizonte": ("ahora" if any(h["verificacion"] == "VERIFIED_ACCESSIBILITY_FAILURE" for h in hs) else "despues") if verificado else "futuro",
            "esfuerzo": "bajo" if cat in ("Design system", "Tipografía", "Contenido", "Estructura", "Iconografía") else "medio",
            "tropiezos": 0, "agentes": 0, "hallazgos": [h["id"] for h in hs], "pasos": [],
            "tecnico": list(dict.fromkeys(h["recomendacion"] for h in hs if h["recomendacion"]))[:3], "casos": len(hs),
            "verificado": verificado,
        })
    orden_h = {h: i for i, h in enumerate(HORIZONTES)}
    propuestas.sort(key=lambda p: (orden_h[p["horizonte"]], ORDEN_ESF[p["esfuerzo"]], -p["tropiezos"]))

    # 2. Indicadores.
    total = sum(p["tropiezos"] for p in propuestas) or 1
    def pct(filtro):
        return round(100 * sum(p["tropiezos"] for p in propuestas if filtro(p)) / total)
    pasos, friccion = _tropiezos_por_agente_y_paso(carpeta)
    ahora = pct(lambda p: p["horizonte"] == "ahora") / 100
    todo = pct(lambda p: p["horizonte"] in ("ahora", "despues")) / 100
    # Pasos sin tropiezo hoy (medido). Lo esperado supone que los pasos con tropiezo mejoran en la misma
    # proporción en que desaparecen los tropiezos: es una estimación y se confirma al volver a correr el estudio.
    hoy_sin = round(100 * sum(1 for ag, k in pasos if k not in friccion.get(ag, set())) / len(pasos)) if pasos else None
    def sin_tropiezo(parte):
        return None if hoy_sin is None else round(hoy_sin + (100 - hoy_sin) * parte)
    sat = _json(carpeta / "satisfaccion-sintetica.json") or {}
    resp = sat.get("respuestas") or []
    csat_hoy = (sat.get("resumen") or {}).get("csat_media_1_5")
    xs, ys = [], []
    for r in resp:
        if r.get("csat_1_5") is not None:
            xs.append(len(friccion.get(r.get("agente_id"), set()))); ys.append(float(r["csat_1_5"]))
    reg = _regresion(xs, ys)
    # Satisfacción esperada: con la relación tropiezos → satisfacción de este estudio, si es clara; si no, un
    # supuesto a calibrar: sube en proporción a los tropiezos que desaparecen, con techo de 4,5 sobre 5.
    metodo_csat = "relacion-del-estudio" if reg and reg[1] < 0 else "supuesto-a-calibrar"
    def csat_estimado(parte):
        # Siempre el más prudente de los dos cálculos: con pocos agentes la relación exagera.
        if csat_hoy is None:
            return None
        supuesto = csat_hoy + max(0.0, 4.5 - csat_hoy) * parte
        if metodo_csat == "relacion-del-estudio":
            a, b = reg
            media_x = sum(xs) / len(xs)
            supuesto = min(supuesto, a + b * media_x * (1 - parte))
        return round(max(csat_hoy, min(4.5, supuesto)), 1)
    esf = Counter(p["esfuerzo"] for p in propuestas if p["horizonte"] == "ahora")
    indicadores = {
        "tropiezos_observados": sum(p["tropiezos"] for p in propuestas),
        "resuelve_ahora_pct": pct(lambda p: p["horizonte"] == "ahora"),
        "resuelve_ahora_y_despues_pct": pct(lambda p: p["horizonte"] in ("ahora", "despues")),
        "resuelve_esfuerzo_bajo_pct": pct(lambda p: p["esfuerzo"] == "bajo"),
        "propuestas_esfuerzo_bajo": sum(1 for p in propuestas if p["esfuerzo"] == "bajo"),
        "esfuerzo_ahora": {k: esf.get(k, 0) for k in ("bajo", "medio", "alto")},
        "pasos_sin_tropiezo_hoy": hoy_sin,
        "pasos_sin_tropiezo_ahora": sin_tropiezo(ahora),
        "pasos_sin_tropiezo_todo": sin_tropiezo(todo),
        "csat_hoy": csat_hoy,
        "csat_ahora": csat_estimado(ahora),
        "csat_todo": csat_estimado(todo),
        "metodo_csat": metodo_csat,
        "nps_hoy": (sat.get("resumen") or {}).get("nps_estimado"),
        "agentes": len(resp),
        "metodo": ("Tropiezos: veces que los agentes se trabaron en el estudio y que corresponden a cada propuesta. Pasos sin tropiezo: "
                   "medido hoy; lo esperado mejora en la misma proporción en que desaparecen los tropiezos. Satisfacción: medida hoy en "
                   "la encuesta de cada agente; lo esperado es una estimación que se confirma al volver a correr el estudio."),
    }
    return {"estudio": carpeta.name, "generado": datetime.now().isoformat(timespec="seconds"), "borrador": True,
            "indicadores": indicadores, "propuestas": propuestas}


# ---------------------------------------------------------------- versión actual (29-09-2026)
# Caja 3 (Hallazgos): qué gana el producto si corrige lo que falla.
# Caja 4 (Mejoras): las «Oportunidades sobre lo que ya funciona» del motor, por cuándo aplicarlas.

MOTOR = Path(__file__).resolve().parents[2] / "_agentes_sinteticos"
NIVEL_A_HORIZONTE = {"alta": "ahora", "media": "despues", "baja": "futuro"}


def capa_de(tipo: str) -> str:
    """UX o UI con la misma regla del motor: lo «de superficie» va a Recomendaciones UI."""
    import sys
    if str(MOTOR) not in sys.path:
        sys.path.insert(0, str(MOTOR))
    try:
        from agentes_sinteticos.lentes_nuevas import DE_SUPERFICIE
    except Exception:
        return TEXTOS.get(tipo, ("", "", "UX"))[2]
    return "UI" if tipo in DE_SUPERFICIE else "UX"


def indicadores_hallazgos(carpeta: Path) -> dict:
    """Qué gana el producto si corrige los hallazgos: medido hoy y estimado al corregir los graves."""
    bk = _json(carpeta / "backlog-ux.json") or {}
    ux = bk.get("hallazgos", [])
    ocur = lambda h: int(h.get("ocurrencias") or 0) or int(h.get("agentes_afectados") or 0)
    total = sum(ocur(h) for h in ux) or 1
    graves = [h for h in ux if h.get("severidad") in ("P0", "P1")]
    bajos = [h for h in ux if h.get("esfuerzo") == "bajo"]
    parte_graves = sum(ocur(h) for h in graves) / total
    pasos, friccion = _tropiezos_por_agente_y_paso(carpeta)
    hoy_sin = round(100 * sum(1 for ag, k in pasos if k not in friccion.get(ag, set())) / len(pasos)) if pasos else None
    sat = _json(carpeta / "satisfaccion-sintetica.json") or {}
    res = sat.get("resumen") or {}
    csat_hoy = res.get("csat_media_1_5")
    xs, ys = [], []
    for r in sat.get("respuestas") or []:
        if r.get("csat_1_5") is not None:
            xs.append(len(friccion.get(r.get("agente_id"), set()))); ys.append(float(r["csat_1_5"]))
    reg = _regresion(xs, ys)
    def csat_est(parte):
        # El más prudente entre la relación del estudio y un supuesto a calibrar, con techo de 4,5 sobre 5.
        if csat_hoy is None:
            return None
        v = csat_hoy + max(0.0, 4.5 - csat_hoy) * parte
        if reg and reg[1] < 0:
            v = min(v, reg[0] + reg[1] * (sum(xs) / len(xs)) * (1 - parte))
        return round(max(csat_hoy, min(4.5, v)), 1)
    ui = hallazgos_ui(carpeta)
    return {
        "hallazgos_ux": sum(1 for h in ux if capa_de(h.get("tipo", "")) == "UX"),
        "hallazgos_ui": sum(1 for h in ux if capa_de(h.get("tipo", "")) == "UI") + sum(1 for h in ui if h["verificado"]),
        "graves": len(graves) + sum(1 for h in ui if h["verificacion"] == "VERIFIED_ACCESSIBILITY_FAILURE"),
        "resuelve_graves_pct": round(100 * parte_graves),
        "resuelve_esfuerzo_bajo_pct": round(100 * sum(ocur(h) for h in bajos) / total),
        "hallazgos_esfuerzo_bajo": len(bajos),
        "pasos_sin_tropiezo_hoy": hoy_sin,
        "pasos_sin_tropiezo_graves": None if hoy_sin is None else round(hoy_sin + (100 - hoy_sin) * parte_graves),
        "csat_hoy": csat_hoy, "csat_graves": csat_est(parte_graves),
        "nps_hoy": res.get("nps_estimado"), "agentes": len(sat.get("respuestas") or []),
        "metodo": ("Tropiezos: veces que los agentes se trabaron en este estudio. Graves: hallazgos críticos y altos. Pasos sin "
                   "tropiezo y satisfacción: medidos hoy; lo estimado mejora en la misma proporción en que desaparecen los "
                   "tropiezos, con el cálculo más prudente. Se confirma al volver a correr el estudio."),
    }


def oportunidades_del_estudio(carpeta: Path) -> list[dict]:
    """Las «Oportunidades sobre lo que ya funciona» del motor (UX y UI), con su aplicabilidad en este producto."""
    import sys
    if str(MOTOR) not in sys.path:
        sys.path.insert(0, str(MOTOR))
    from agentes_sinteticos import tendencias as T   # solo lectura: el motor no se modifica
    inf = _json(carpeta / "informe.json") or {}
    bk = _json(carpeta / "backlog-ux.json") or {}
    t = T.tendencias_del_estudio(inf)
    ops = T.oportunidades(inf, t)
    ctx = T.contexto_estudio(bk.get("hallazgos", []), (inf.get("evaluacion_ui") or {}).get("hallazgos", []), t.get("plataformas") or [], ops)
    nombres = dict(((inf.get("evaluacion_ui") or {}).get("nombres_vistas") or {}))
    for h in bk.get("hallazgos", []):
        nombres.update(h.get("vistas_nombres") or {})
    # Oportunidades UI, como en Recomendaciones UI del motor: propuestas del experto UI marcadas como innovación
    # y las de la experta estética, con la misma forma que una oportunidad de tendencia.
    try:
        from agentes_sinteticos.tarjetas_experto import items_del_backlog, entrega, oportunidad
        from agentes_sinteticos.estetica_ui import estetica_estudio
        from agentes_sinteticos.estetica_experta import recomendaciones
        del_experto = [oportunidad(x) for x, k in items_del_backlog(bk) if k == "innovacion" and entrega(x, k) == "UI"]
        del_experto += [oportunidad(x) for x in recomendaciones(inf, estetica_estudio(inf, carpeta) or {}, t)]
        for o in del_experto:
            o["capacidad"] = o.get("capacidad") or ""; o["nombre_experto"] = o["nombre"]; o["nombre"] = "Propuesta del experto UI"
        ops = ops + del_experto
    except Exception as e:  # sin estos módulos, solo quedan las oportunidades de tendencia
        print(f"(oportunidades UI del experto no disponibles: {e})")
    salida = []
    for o in ops:
        vistas = [nombre_vista(v, nombres) for v in o.get("vistas") or []]
        for n, a in enumerate(o["alternativas"]):
            ap = T.aplicabilidad(a, o["capacidad"], ctx)
            experto = bool(o.get("nombre_experto"))
            salida.append({
                "id": f'OP-{o.get("id") or o["capacidad"]}-{n}', "sobre": "Propuesta del experto UI" if experto else o["nombre"],
                "de": "Experto UI" if experto else "Tendencia", "capa": T.plano_alternativa(a, o["capacidad"]),
                # Las del experto traen un nombre corto y una explicación larga: el nombre va de título.
                "titulo": o["nombre_experto"] if experto else a["alternativa"], "detalle": a["alternativa"] if experto else "",
                "conviene": "" if experto else a.get("cuando_conviene", ""), "riesgo": a.get("riesgo", ""),
                "fuente": a.get("referencia", ""), "horizonte": NIVEL_A_HORIZONTE[ap["nivel"]], "aplicabilidad": ap["nivel"],
                "razones": ap["razones"], "donde": list(dict.fromkeys(vistas))[:4], "mas_lugares": max(0, len(set(vistas)) - 4),
            })
    orden = {"ahora": 0, "despues": 1, "futuro": 2}
    salida.sort(key=lambda x: (orden[x["horizonte"]], -len(x["donde"]) - x["mas_lugares"]))
    return salida


def borrador(carpeta: Path) -> dict:
    """Borrador de la caja 4: oportunidades sobre lo que ya funciona, para pulir y publicar."""
    return {"estudio": carpeta.name, "generado": datetime.now().isoformat(timespec="seconds"), "borrador": True,
            "oportunidades": oportunidades_del_estudio(carpeta)}


if __name__ == "__main__":
    import sys
    c = Path(sys.argv[1])
    print(json.dumps(indicadores_hallazgos(c), ensure_ascii=False, indent=1))
    for x in borrador(c)["oportunidades"]:
        print(f'{x["horizonte"]:8} {x["capa"]} {x["sobre"]}: {x["titulo"]}')
