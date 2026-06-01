#!/usr/bin/env python3
"""
32_Graphify_Update.py — Actualización automática del grafo Graphify
Ejecutado por hooks de git o schedule para mantener el grafo actualizado
"""

import subprocess
import sys
from pathlib import Path

# === PROTOCOLO DE RUTA v2.0 Consequences ===
SCRIPT_DIR = Path(__file__).parent.resolve()
SCRIPTS_OS = SCRIPT_DIR.parent  # 03_Scripts_Os
OPERATIONS = SCRIPTS_OS.parent  # 04_Operations
PERSONAL_OS = OPERATIONS.parent  # 01_Personal_Os
ROOT = PERSONAL_OS.parent  # Project root

sys.path.insert(0, str(SCRIPTS_OS))
from config_paths import *

def update_graph():
    """Actualiza el grafo si hay cambios en el códigobase"""
    # Verificar si hay cambios no staged en archivos relevantes
    result = subprocess.run(
        ["git", "diff", "--name-only", "--diff-filter=ACM", 
         "*.py", "*.md", "*.txt", "*.json", "*.yaml", "*.yml"],
        cwd=str(ROOT),
        capture_output=True,
        text=True
    )
    
    changes = result.stdout.strip()
    if not changes:
        print("[Graphify] No hay cambios en archivos relevantes, omitiendo actualización")
        return True
        
    print(f"[Graphify] Detectados cambios, actualizando grafo...")
    print(f"[Graphify] Archivos modificados:\n{changes}")
    
    # Construir grafo actualizado
    from 31_Graphify_Hub import build_graph
    return build_graph()

if __name__ == "__main__":
    success = update_graph()
    sys.exit(0 if success else 1)