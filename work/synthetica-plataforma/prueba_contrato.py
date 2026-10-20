"""Prueba del contrato synthetica.estado/v1: la foto de cada proyecto de cada motor cumple el esquema (solo lectura).

    python work/synthetica-plataforma/prueba_contrato.py
"""
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
import contrato
import motores

RAIZ = AQUI.parent.parent
PROYECTOS = {
    "qa": [p.name for p in (RAIZ / "_qa_visual" / "proyectos").iterdir() if (p / "proyecto.json").exists()],
    "creacion": [p.name for p in (RAIZ / "_creacion_productos" / "proyectos").iterdir() if (p / "proyecto.json").exists()],
    "agentes": [p.parent.parent.name for p in (RAIZ / "_agentes_sinteticos" / "proyectos").glob("*/cajas/estado.json")],
}

fallas = 0
for motor, ids in PROYECTOS.items():
    for mid in ids:
        try:
            f = motores.foto(motor, mid)
        except Exception as e:
            print(f"FALLA {motor}/{mid}: sin foto ({e})"); fallas += 1; continue
        errores = contrato.validar(f)
        estados = sorted({c['estado'] for c in f['cajas']})
        print(("OK   " if not errores else "FALLA") + f" {motor}/{mid}: {len(f['cajas'])} cajas · {f['estado']} · riesgo {contrato.peor(f)} · {', '.join(estados)}")
        for x in errores:
            print("       ✗ " + x)
        fallas += bool(errores)
print(f"\n{'Todo cumple el contrato.' if not fallas else f'{fallas} con fallas.'}")
sys.exit(1 if fallas else 0)
