import sys
from pathlib import Path

# === PROTOCOLO DE RUTA DINÁMICA (v6.1) ===
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "01_Core").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "08_Scripts_Os"))
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
