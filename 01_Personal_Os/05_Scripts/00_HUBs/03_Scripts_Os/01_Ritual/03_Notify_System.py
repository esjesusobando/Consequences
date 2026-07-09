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

import winsound
import json
import os
import time

def get_config_path():
    """Obtiene la ruta del config desde varias ubicaciones posibles"""
    possible_paths = [
        os.path.join(os.path.dirname(__file__), "..", "07_Installer", "config.json"),
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "05_System",
            "04_Env",
            "display_config.json",
        ),
        os.path.join(
            os.path.dirname(__file__), "..", "..", "05_System", "04_Env", "config.json"
        ),
    ]

    for config_path in possible_paths:
        if os.path.exists(config_path):
            return config_path

    return None

CONFIG_PATH = get_config_path()

def play_sound():
    if CONFIG_PATH and os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r") as f:
            config = json.load(f)
            side = config.get("side", "left")

            if side == "left":
                # Single Chime (A4 tone, 440Hz)
                winsound.Beep(440, 300)
            elif side == "right":
                # Double Chime
                winsound.Beep(440, 200)
                time.sleep(0.1)
                winsound.Beep(440, 200)
    else:
        # Default
        winsound.Beep(440, 300)

if __name__ == "__main__":
    play_sound()
