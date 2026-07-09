import logging
import typing

logging.basicConfig(level=logging.INFO)
# === PROTOCOLO DE RUTA v2.0 Consequences ===
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()
SCRIPTS_OS = SCRIPT_DIR.parent  # 03_Scripts_Os

from path_guardian import resolve_os_root
PERSONAL_OS = resolve_os_root(Path(__file__).resolve().parent)
ROOT = PERSONAL_OS.parent  # Project root

sys.path.insert(0, str(SCRIPTS_OS))
from config_paths import *

"""
CAMPANILLA - PersonalOS v1.0
Función para reproducir sonido al completar tareas.
"""

import os
import subprocess
import io

# UTF-8 encoding para Windows
if sys.stdout.encoding != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

# HOOKS_DIR ya viene de config_paths

def play_completion_sound():
    """
    Reproduce sonido de campanilla al completar una tarea.
    Usa el script task-complete-sound.ps1
    """
    sound_script = os.path.join(HOOKS_DIR, "task-complete-sound.ps1")

    try:
        if os.path.exists(sound_script):
            subprocess.run(
                ["powershell.exe", "-ExecutionPolicy", "Bypass", "-File", sound_script],
                capture_output=True,
                timeout=5,
            )
        else:
            # Fallback: beep simple
            print("\a", end="")  # Bell character
    except Exception:
        # Silencioso si falla
        pass

def notify_voz(mensaje):
    """
    Notifica por voz usando el hook de común.
    """
    try:
        common_hook = os.path.join(HOOKS_DIR, "utils", "common.py")
        if os.path.exists(common_hook):
            import importlib.util

            spec = importlib.util.spec_from_file_location("common", common_hook)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            if hasattr(module, "speak"):
                module.speak(mensaje)
    except Exception:
        print(f"[VOZ] {mensaje}")

if __name__ == "__main__":
    print("🔔 Probando campanilla...")
    play_completion_sound()
    print("✅ Sonido reproducido")
