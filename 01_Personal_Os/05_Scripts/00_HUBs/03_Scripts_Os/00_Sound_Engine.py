import logging
import typing

logging.basicConfig(level=logging.INFO)
#!/usr/bin/env python3
import sys
import io
from pathlib import Path

# === PROTOCOLO DE RUTA v2.0 Consequences ===
SCRIPT_DIR = Path(__file__).parent.resolve()
SCRIPTS_OS = SCRIPT_DIR.parent  # 03_Scripts_Os

PERSONAL_OS = next(p for p in Path(__file__).resolve().parents if p.name == "01_Personal_Os")  # 01_Personal_Os
ROOT = PERSONAL_OS.parent  # Project root

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Add Scripts_Os to path for config_paths
sys.path.insert(0, str(SCRIPTS_OS))
from config_paths import *

import winsound

def play_task_complete():
    """Melodia: C-E-G (do mi sol) - sonido de tarea completada"""
    winsound.Beep(523, 100)   # C5 - DO
    winsound.Beep(659, 100)   # E5 - MI
    winsound.Beep(784, 150)   # G5 - SOL

if __name__ == "__main__":
    play_task_complete()
    print("Tarea completada!")
