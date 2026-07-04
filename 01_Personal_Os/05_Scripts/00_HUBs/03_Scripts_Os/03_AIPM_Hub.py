import logging
import typing

logging.basicConfig(level=logging.INFO)
#!/usr/bin/env python3
"""
03_AIPM_Hub.py — Hub centralizador de AIPM (AI Project Management)
Reutiliza scripts AIPM: 22, 23, 24, 28, 30
"""

import argparse
import os
import io
import subprocess
import sys
from pathlib import Path

# === PROTOCOLO DE RUTA v2.0 Consequences ===
SCRIPT_DIR = Path(__file__).parent.resolve()
SCRIPTS_OS = SCRIPT_DIR.parent  # 03_Scripts_Os

PERSONAL_OS = next(p for p in Path(__file__).resolve().parents if p.name == "01_Personal_Os")  # 01_Personal_Os
ROOT = PERSONAL_OS.parent  # Project root

sys.path.insert(0, str(SCRIPTS_OS))
from config_paths import *

# === COLOR SETUP ===
try:
    from colorama import init, Fore, Style
    init(autoreset=True)
except ImportError:
    class Fore: GREEN = YELLOW = RED = CYAN = MAGENTA = BLUE = ""
    class Style: RESET_ALL = ""

# Fix Windows console encoding
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

def print_banner():
    banner = rf"""
{Fore.GREEN}    ###########################################################################
    #                                                                         #
    #              ___    _____ _____  __  __                                 #
    #             /   \  |_   _|  __ \|  \/  |                                #
    #            / /_\ \   | | | |__) | \  / |                                #
    #           / ___ \ \  | | |  ___/| |\/| |                                #
    #          /_/   \_\_| |_| |_|    |_|  |_|                                #
    #                                                                         #
    #                      A I P M   H U B                                    #
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

def run_script(script_name, args=None):
    # Los scripts de AIPM ahora están en 03_AIPM
    script_path = ENGINE_DIR / "03_AIPM" / script_name
    if not script_path.exists():
        print(f"{Fore.RED}[ERROR] Script no encontrado: {script_path}{Style.RESET_ALL}")
        return

    cmd = [sys.executable, str(script_path)]
    if args:
        cmd.extend(args)

    print(f"{Fore.YELLOW}[RUNNING] Ejecutando: {script_name} {' '.join(args) if args else ''}...{Style.RESET_ALL}")
    subprocess.run(cmd)

def main():
    print_banner()
    parser = argparse.ArgumentParser(description="Hub centralizador de AIPM.")
    subparsers = parser.add_subparsers(dest="command", help="Comandos AIPM")

    # Definir subcomandos — nombres actualizados a numeración v4.9
    subparsers.add_parser(
        "logger", help="Logger AIPM (reutiliza 00_AIPM_Trace_Logger.py)"
    )
    subparsers.add_parser(
        "evaluator", help="Evaluador AIPM (reutiliza 01_AIPM_Evaluator.py)"
    )
    subparsers.add_parser(
        "interview", help="Entrevistador AIPM (reutiliza 02_AIPM_Interview_Sim.py)"
    )
    subparsers.add_parser(
        "control", help="Control Center AIPM (reutiliza 06_AIPM_Control_Center.py)"
    )
    subparsers.add_parser(
        "report", help="Reporte AIPM (reutiliza 08_AIPM_Consolidated_Report.py)"
    )

    args = parser.parse_args()

    # Mapeo de comandos — nombres actualizados a numeración v4.9
    cmd_map = {
        "logger": "00_AIPM_Trace_Logger.py",
        "evaluator": "01_AIPM_Evaluator.py",
        "interview": "02_AIPM_Interview_Sim.py",
        "control": "06_AIPM_Control_Center.py",
        "report": "08_AIPM_Consolidated_Report.py",
    }

    if args.command in cmd_map:
        dynamic_speak(f"Ejecutando comando AIPM: {args.command}")
        run_script(cmd_map[args.command])
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
