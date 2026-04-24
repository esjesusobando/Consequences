#!/usr/bin/env python3
"""
16_Carousel_Engine.py — PersonalOS v1.0
Motor central para la generación de carruseles estratégicos.
"""

import os
import json
import argparse
from pathlib import Path

# Configuración de Rutas
from config_paths import ROOT_DIR, OPERATIONS_DIR

OUTPUT_DIR = OPERATIONS_DIR / "03_Process_Notes" / "Carousel_Exports"
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
