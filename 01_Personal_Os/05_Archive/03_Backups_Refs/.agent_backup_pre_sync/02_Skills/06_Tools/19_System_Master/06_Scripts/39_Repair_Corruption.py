# Importar pathlib primero para el protocolo de ruta
import sys
from pathlib import Path

# === PROTOCOLO DE RUTA DINÁMICA (v6.1) ===
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "01_Core").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "08_Scripts_Os"))
from config_paths import *

import os
import time
import glob

def repair_md(file_path):
    print(f"Repairing {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Algoritmo de des-inyección inteligente
        # 1. El emoji legítimo 🟢 se convirtió en 🟢🟢🟢
        # 2. Los demás caracteres se rodearon de 🟢

        repaired = content.replace("🟢🟢🟢", "TEMP_GREEN")
        repaired = repaired.replace("🟢", "")
        repaired = repaired.replace("TEMP_GREEN", "🟢")

        # Limpieza de posibles pipes dobles o espacios extraños causados por el desajuste de tablas
        # Pero primero devolvemos el texto plano.

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(repaired)
    except Exception as e:
        print(f"Error repairing {file_path}: {e}")

def main():
    # Usar PROJECT_ROOT dinámico desde config_paths
    base_dir = PROJECT_ROOT

    # Archivos raíz
    for md_file in glob.glob(os.path.join(base_dir, "*.md")):
        repair_md(md_file)

    # Operations / Tasks
    ops_dir = os.path.join(base_dir, "02_Operations")
    if os.path.exists(ops_dir):
        # rglob simulation with walk
        for root, dirs, files in os.walk(ops_dir):
            for file in files:
                if file.endswith(".md"):
                    repair_md(os.path.join(root, file))

    # Engine
    engine_dir = os.path.join(base_dir, "../..")
    if os.path.exists(engine_dir):
        for root, dirs, files in os.walk(engine_dir):
            for file in files:
                if file.endswith(".md"):
                    repair_md(os.path.join(root, file))

if __name__ == "__main__":
    main()
