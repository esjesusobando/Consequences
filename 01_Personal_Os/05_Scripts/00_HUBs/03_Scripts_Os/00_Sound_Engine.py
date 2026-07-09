#!/usr/bin/env python3
"""
00_Sound_Engine.py — Cross-platform notification sounds for PersonalOS.

Platform support:
  - Windows: winsound.Beep() (native)
  - Linux/WSL: print('\\a') (terminal bell)
  - macOS: os.system('say') (spoken notification)
  - Fallback: silent (no crash on any platform)
"""

import io
import logging
import os
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# === PROTOCOLO DE RUTA v2.0 Consequences ===
SCRIPT_DIR = Path(__file__).parent.resolve()
SCRIPTS_OS = SCRIPT_DIR.parent  # 03_Scripts_Os

from path_guardian import resolve_os_root
PERSONAL_OS = resolve_os_root(Path(__file__).resolve().parent)
ROOT = PERSONAL_OS.parent  # Project root

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Add Scripts_Os to path for config_paths
sys.path.insert(0, str(SCRIPTS_OS))
from config_paths import *


def _beep(frequency: int, duration: int) -> None:
    """Emit a beep on any platform. Never raises."""
    try:
        if sys.platform == "win32":
            import winsound
            winsound.Beep(frequency, duration)
        elif sys.platform == "darwin":
            os.system(f'say --rate=200 "beep" 2>/dev/null || printf "\\a"')
        else:
            # Linux / WSL / others — terminal bell
            print('\a', end='', flush=True)
    except Exception:
        logger.debug("Beep failed (platform: %s)", sys.platform)


def play_task_complete() -> None:
    """Melody: C-E-G (do mi sol) — task completed sound."""
    try:
        _beep(523, 100)   # C5 - DO
        _beep(659, 100)   # E5 - MI
        _beep(784, 150)   # G5 - SOL
    except Exception as e:
        logger.warning("play_task_complete failed: %s", e)


def play_error() -> None:
    """Short error buzz."""
    try:
        _beep(200, 300)
    except Exception as e:
        logger.warning("play_error failed: %s", e)


if __name__ == "__main__":
    play_task_complete()
    print("Tarea completada!")
