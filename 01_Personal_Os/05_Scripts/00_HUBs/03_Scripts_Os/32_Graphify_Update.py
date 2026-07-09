import logging
import typing

logging.basicConfig(level=logging.INFO)
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

from path_guardian import resolve_os_root
PERSONAL_OS = resolve_os_root(Path(__file__).resolve().parent)
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
    import importlib.util
    spec = importlib.util.spec_from_file_location("graphify_hub", str(SCRIPTS_OS / "31_Graphify_Hub.py"))
    graphify_hub = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(graphify_hub)
    return graphify_hub.build_graph()

if __name__ == "__main__":
    success = update_graph()
    sys.exit(0 if success else 1)