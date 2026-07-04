import logging
import typing

logging.basicConfig(level=logging.INFO)
#!/usr/bin/env python3
"""
16_Carousel_Engine.py — PersonalOS v4.9 Consequences
Motor central para la generación de carruseles estratégicos.
"""

import os
import sys
import io
import json
import argparse
from pathlib import Path

# === PROTOCOLO DE RUTA v2.0 Consequences ===
# Script: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/12_Auditors_Os/scripts/
# → scripts/ → 12_Auditors_Os/ → 03_Scripts_Os/ → 05_Scripts/ → 01_Personal_Os/ → ROOT
SCRIPT_DIR = Path(__file__).parent.resolve()
SCRIPTS_OS = SCRIPT_DIR.parent.parent  # 03_Scripts_Os

PERSONAL_OS = next(p for p in Path(__file__).resolve().parents if p.name == "01_Personal_Os")         # 01_Personal_Os
ROOT = PERSONAL_OS.parent               # Project root

# Fix encoding for Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Add Scripts_Os to path for config_paths
sys.path.insert(0, str(SCRIPTS_OS))
from config_paths import *

# Output directory: v4.7 uses 01_Process_Notes inside Context_LLM
OUTPUT_DIR = ROOT_DIR / "01_Personal_Os" / "05_Scripts" / "00_Context_LLM" / "01_Process_Notes" / "Carousel_Exports"
os.makedirs(OUTPUT_DIR, exist_ok=True)

class CarouselEngine:
    def __init__(self, niche, goal):
        self.niche = niche
        self.goal = goal
        self.slides = []

    def generate_structure(self):
        """Define el arco narrativo SOTA para 5 slides."""
        self.slides = [
            {
                "id": 1,
                "type": "Hook",
                "title": f"La verdad sobre {self.niche}",
                "content": "Lo que nadie te dice pero todos necesitan saber.",
                "design_prompt": f"Minimalist clean background, high contrast typography, {self.niche} related icon, premium vibe."
            },
            {
                "id": 2,
                "type": "Context",
                "title": "El Problema Real",
                "content": "Estás atrapado en [PROBLEMA], y no es tu culpa.",
                "design_prompt": "Dark empathetic aesthetic, subtle glow, centered focus."
            },
            {
                "id": 3,
                "type": "Value_1",
                "title": "Paso 1: [SOLUCIÓN]",
                "content": "Implementa esto hoy mismo para ver resultados.",
                "design_prompt": "Clean informative layout, bold key points, white space."
            },
            {
                "id": 4,
                "type": "Value_2",
                "title": "Paso 2: [ACCIÓN]",
                "content": "El secreto está en la consistencia de [ACCIÓN].",
                "design_prompt": "Dynamic progression visual, sleek lines, brand colors."
            },
            {
                "id": 5,
                "type": "CTA",
                "title": "¿Listo para el cambio?",
                "content": "Guarda este post si te sirvió. Únete a la comunidad.",
                "design_prompt": "Magnetic final slide, clear call to action button visual, premium finish."
            }
        ]

    def save_output(self, name):
        filename = f"carousel_{name.lower().replace(' ', '_')}.json"
        filepath = OUTPUT_DIR / filename
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump({
                "niche": self.niche,
                "goal": self.goal,
                "slides": self.slides
            }, f, indent=4, ensure_ascii=False)
        return str(filepath)

def main():
    parser = argparse.ArgumentParser(description="Carousel Engine PersonalOS")
    parser.add_argument("--niche", required=True, help="El nicho del carrusel")
    parser.add_argument("--goal", default="Education", help="Objetivo del carrusel")
    parser.add_argument("--name", default="Draft", help="Nombre del proyecto")
    
    args = parser.parse_args()
    
    engine = CarouselEngine(args.niche, args.goal)
    engine.generate_structure()
    path = engine.save_output(args.name)
    
    print(f"[OK] Estructura de carrusel generada en: {path}")

if __name__ == "__main__":
    main()
