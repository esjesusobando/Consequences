#!/usr/bin/env python3
"""
94_Ritual_Hub.py — Hub centralizador de Rituales y Standups
Reutiliza scripts de rituales: 08, 09, 14, 15, 17
"""

import argparse
import os
import io
import sys
import subprocess
from pathlib import Path


# === PROTOCOLO DE RUTA v2.0 Consequences ===
SCRIPT_DIR = Path(__file__).parent.resolve()
SCRIPTS_OS = SCRIPT_DIR.parent  # 03_Scripts_Os
OPERATIONS = SCRIPTS_OS.parent  # 04_Operations
PERSONAL_OS = OPERATIONS.parent  # 01_Personal_Os
ROOT = PERSONAL_OS.parent  # Project root

sys.path.insert(0, str(SCRIPTS_OS))
from config_paths import *

# === COLOR SETUP ===
try:
    from colorama import init, Fore, Style

    init(autoreset=True)
except ImportError:

    class Fore:
        GREEN = YELLOW = RED = CYAN = MAGENTA = BLUE = ""

    class Style:
        RESET_ALL = ""


# Fix Windows console encoding
if sys.platform == "win32":
    import io

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")


def print_banner():
    banner = rf"""
{Fore.YELLOW}    ###########################################################################
    #                                                                         #
    #      _____ _____ _______ _    _   _      __                             #
    #     |  __ \_   _|__   __| |  | | | |    / /                             #
    #     | |__) || |    | |  | |  | | | |   / /                              #
    #     |  _  / | |    | |  | |  | | | |  / /                               #
    #     | | \ \| |_   | |  | |__| | | | / /                                #
    #     |_|  \_\_____| |_|   \____/  |_|/_/                                 #
    #                                                                         #
    #                       R I T U A L   H U B                               #
    #                       P E R S O N A L   O S                             #
    ###########################################################################{Style.RESET_ALL}
"""
    print(banner)


def dynamic_speak(text):
    """Interfaz de Voz SOTA v2.2"""
    print(f"{Fore.MAGENTA}🔊 [VOICE]: {text}{Style.RESET_ALL}")
    if sys.platform == "win32":
        try:
            cmd = f"PowerShell -Command \"Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak('{text}')\""
            subprocess.Popen(
                cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
            )
        except:
            pass


def run_script(script_name, script_subdir="01_Ritual"):
    """Ejecuta un script de ritual - usa get_skill_script() si está en el mapa."""
    from config_paths import get_skill_script
    script_path = get_skill_script(script_name)
    if not script_path or not script_path.exists():
        # Fallback legacy
        script_path = ENGINE_DIR / script_subdir / script_name
    if not script_path.exists():
        print(f"{Fore.RED}[ERROR] Script no encontrado: {script_name}{Style.RESET_ALL}")
        return

    print(f"{Fore.YELLOW}[RUNNING] Ejecutando: {script_name}...{Style.RESET_ALL}")
    scripts_dir = str(Path(__file__).parent)
    env = {**__import__("os").environ, "PYTHONPATH": scripts_dir}
    result = subprocess.run(
        [sys.executable, str(script_path)],
        cwd=str(ROOT),
        env=env,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace"
    )
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(f"{Fore.RED}[STDERR] {result.stderr}{Style.RESET_ALL}")


def main():
    print_banner()

    # Parser principal para --mode
    parser = argparse.ArgumentParser(
        description="Hub centralizador de Rituales y Standups."
    )
    parser.add_argument(
        "--mode",
        choices=["genesis", "cierre", "triage", "standup", "weekly", "dominical"],
        help="Modo de ejecución",
    )
    parser.add_argument("command", nargs="?", help="Comando alternativo")

    args = parser.parse_args()

    # Determinar el comando a ejecutar
    command = args.mode or args.command

    # Mapeo de comandos a scripts (ubicación real)
    cmd_map = {
        "genesis": "87_Iron_Man_Gen.py",  # En 01_Ritual (via get_skill_script)
        "cierre": "08_Ritual_Cierre.py",
        "triage": "09_Backlog_Triage.py",
        "standup": "14_Morning_Standup.py",
        "weekly": "15_Weekly_Review.py",
        "dominical": "17_Ritual_Dominical.py",
    }

    if command in cmd_map:
        # Usar get_skill_script para resolución dinámica
        script_path = get_skill_script(cmd_map[command])
        if script_path:
            # Mensaje descriptivo segun el ritual
            ritual_msgs = {
                "genesis": "Iniciando análisis de contexto y memoria",
                "cierre": "Ejecutando ritual de cierre y comet",
                "triage": "Ejecutando clasificación de backlog",
                "standup": "Ejecutando análisis de prioridades diarias",
                "weekly": "Ejecutando revisión semanal",
                "dominical": "Ejecutando ritual dominical",
            }
            msg = ritual_msgs.get(command, f"Ejecutando: {command}")
            dynamic_speak(msg)
            run_script(cmd_map[command])
        else:
            dynamic_speak(f"Script no encontrado: {cmd_map[command]}")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
