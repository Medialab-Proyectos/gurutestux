"""El contrato `synthetica.estado/v1` entre los motores y la plataforma (ver INTEGRACION.md): validación y riesgo por tiempo.

La misma regla de riesgo vive en index.html (riesgoCaja): si cambia aquí, cambia allá.
"""
from datetime import datetime

CONTRATO = "synthetica.estado/v1"
MOTORES = {"creacion": "completo", "agentes": "sintetico", "qa": "qa"}
ESTADOS = ("pendiente", "bloqueada", "en_curso", "espera_cliente", "espera_equipo", "aprobada", "omitida", "detenida")
GENERAL = ("en_curso", "espera_cliente", "espera_equipo", "detenido", "terminado")
ESPERA = (None, "cliente", "equipo")
NIVELES = ("ok", "atencion", "alto")
CLIENTE_HORAS = (24, 72)    # horas sin respuesta del cliente: atención, alto (supuestos a calibrar)
MAX_BYTES = 200_000


def validar(f: dict) -> list:
    """Los errores de la foto; vacío si cumple el contrato."""
    e = []
    if not isinstance(f, dict):
        return ["La foto no es un objeto JSON."]
    if f.get("contrato") != CONTRATO:
        e.append(f"contrato debe ser {CONTRATO}")
    if f.get("motor") not in MOTORES or f.get("tipo") != MOTORES.get(f.get("motor")):
        e.append("motor y tipo deben corresponder (creacion→completo, agentes→sintetico, qa→qa)")
    p = f.get("proyecto") or {}
    if not p.get("id") or not p.get("nombre"):
        e.append("proyecto necesita id y nombre")
    if f.get("estado") not in GENERAL:
        e.append(f"estado general no válido: {f.get('estado')}")
    entrada = str(f.get("entrada") or "")
    if not entrada.startswith(f"/{p.get('id')}/"):
        e.append("entrada debe ser /<id>/…")
    cajas = f.get("cajas")
    if not isinstance(cajas, list) or not cajas:
        return e + ["cajas debe ser una lista con al menos una caja"]
    ids = set()
    for c in cajas:
        cid = str(c.get("id", ""))
        if not cid or cid in ids:
            e.append(f"caja sin id o repetida: «{cid}»")
        ids.add(cid)
        if c.get("estado") not in ESTADOS:
            e.append(f"caja {cid}: estado no válido «{c.get('estado')}»")
        if c.get("espera") not in ESPERA:
            e.append(f"caja {cid}: espera no válida «{c.get('espera')}»")
        if not c.get("nombre"):
            e.append(f"caja {cid}: falta el nombre")
        if (c.get("riesgo") or {}).get("nivel") not in NIVELES:
            e.append(f"caja {cid}: riesgo.nivel no válido")
        for k in ("pagina",):
            if c.get(k) and not str(c[k]).startswith(f"/{p.get('id')}/"):
                e.append(f"caja {cid}: {k} debe estar dentro de /{p.get('id')}/")
        for x in c.get("enlaces") or []:
            if not str(x.get("ruta", "")).startswith(f"/{p.get('id')}/"):
                e.append(f"caja {cid}: enlace fuera del proyecto")
    sig = (f.get("siguiente") or {}).get("caja")
    if sig is not None and str(sig) not in ids:
        e.append(f"siguiente apunta a una caja que no existe: {sig}")
    for r in f.get("rutas_cliente") or []:
        if not (str(r).startswith("^/") and str(r).endswith("$")):
            e.append(f"ruta del cliente sin anclas ^…$: {r}")
    esp = f.get("espejo") or {}
    if not esp.get("semillas"):
        e.append("espejo.semillas no puede estar vacío")
    import json
    if len(json.dumps(f, ensure_ascii=False).encode("utf-8")) > MAX_BYTES:
        e.append(f"la foto pesa más de {MAX_BYTES // 1000} KB")
    return e


def _horas(desde: str | None, ahora: datetime) -> float | None:
    try:
        return (ahora - datetime.fromisoformat(str(desde)[:19])).total_seconds() / 3600
    except (TypeError, ValueError):
        return None


def riesgo(c: dict, ahora: datetime | None = None, ayudas: list | None = None) -> dict:
    """El riesgo de una caja: el del motor más el de tiempo (eta vencida, cliente sin responder, ayuda pendiente)."""
    ahora = ahora or datetime.now()
    nivel = (c.get("riesgo") or {}).get("nivel", "ok")
    motivos = list((c.get("riesgo") or {}).get("motivos") or [])
    sube = lambda n: NIVELES[max(NIVELES.index(nivel), NIVELES.index(n))]
    if c.get("estado") == "en_curso" and c.get("eta_min") and c.get("inicio"):
        h = _horas(c["inicio"], ahora)
        if h is not None and h * 60 > c["eta_min"]:
            nivel = sube("alto" if h * 60 > 2 * c["eta_min"] else "atencion")
            motivos.append(f"Lleva {round(h, 1)} h; se esperaba en {round(c['eta_min'] / 60, 1)} h")
    if c.get("espera") == "cliente":
        h = _horas(c.get("fin") or c.get("inicio"), ahora)
        if h is not None and h > CLIENTE_HORAS[0]:
            nivel = sube("alto" if h > CLIENTE_HORAS[1] else "atencion")
            motivos.append(f"Espera tu respuesta hace {round(h)} h")
    if any(str(a.get("caja")) == str(c.get("id")) and a.get("para") == "cliente" for a in ayudas or []):
        nivel = sube("alto")
    if c.get("estado") == "detenida":
        nivel = sube("alto")
    return {"nivel": nivel, "motivos": motivos}


def peor(f: dict, ahora: datetime | None = None) -> str:
    niveles = [riesgo(c, ahora, f.get("ayuda"))["nivel"] for c in f.get("cajas") or []]
    return max(niveles, key=NIVELES.index) if niveles else "ok"
