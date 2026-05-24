#!/usr/bin/env python3
"""
08_Workflow_Hub.py — Workflow Automation Hub
=============================================
PersonalOS v6.1 | Think Different

Automatiza flujos de trabajo recurrentes del OS: rituales de apertura/cierre,
procesamiento de backlog, generación de reportes de sesión y ejecución de
pipelines predefinidos (SDD, CE, etc.).

Uso:
    python 08_Workflow_Hub.py --help
    python 08_Workflow_Hub.py open         # Ritual de apertura
    python 08_Workflow_Hub.py close        # Ritual de cierre
    python 08_Workflow_Hub.py list         # Listar workflows (v6.1)
    python 08_Workflow_Hub.py run <name>   # Ejecutar workflow específico
"""
import argparse
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
{Fore.CYAN}    ###########################################################################
    #                                                                         #
    #      __        _______ _____ _   _ ______ _____                          #
    #      \ \      / / ____|_   _| \ | |  ____|  __ \                         #
    #       \ \ /\ / / |      | | |  \| | |__  | |__) |                        #
    #        \ V  V /| |      | | | . ` |  __| |  _  /                         #
    #         \_/\_/  |____| |_| |_|\_|_|_____|_| \_\                          #
    #                                                                         #
    #                      W O R K F L O W   H U B                            #
    #                       P E R S O N A L   O S                             #
    ###########################################################################{Style.RESET_ALL}
"""
    print(banner)


def dynamic_speak(text):
    print(f"{Fore.MAGENTA}🔊 [VOICE]: {text}{Style.RESET_ALL}")


def run_script(script_name):
    from config_paths import get_skill_script
    script_path = get_skill_script(script_name)
    if not script_path or not script_path.exists():
        script_path = Path(__file__).parent / "04_Workflow" / script_name
    if not script_path.exists():
        print(f"{Fore.RED}[ERROR] Script no encontrado: {script_name}{Style.RESET_ALL}")
        return

    print(f"{Fore.YELLOW}[RUNNING] Ejecutando: {script_name}...{Style.RESET_ALL}")
    scripts_dir = str(Path(__file__).parent)
    env = {**__import__('os').environ, "PYTHONPATH": scripts_dir}
    subprocess.run([sys.executable, str(script_path)], cwd=scripts_dir, env=env)


def main():
    print_banner()
    parser = argparse.ArgumentParser(
        description="Hub centralizador de Workflows y Procesos."
    )
    subparsers = parser.add_subparsers(dest="command", help="Comandos de Workflows")

    # Definir subcomandos
    subparsers.add_parser("list", help="Lista todos los flujos de trabajo disponibles (recursivo)")
    subparsers.add_parser("brainstorm", help="Spider Brainstorm")
    subparsers.add_parser("plan", help="Professor X Plan")
    subparsers.add_parser("lfg-lite", help="AntMan LFG Lite")
    subparsers.add_parser("lfg-full", help="Doc Strange LFG")
    subparsers.add_parser("avengers", help="Avengers Workflow SOTA")

    args = parser.parse_args()

    if args.command == "list":
        dynamic_speak("Listando todos los flujos de trabajo disponibles (v6.1)...")
        if not WORKFLOWS_DIR.exists():
            print(f"{Fore.RED}[FAIL] WORKFLOWS_DIR no detectado{Style.RESET_ALL}")
            return
        
        print(f"\n{Fore.GREEN}--- Catálogo Jerárquico de Workflows ---{Style.RESET_ALL}")
        for wf_file in sorted(WORKFLOWS_DIR.rglob("*.md")):
            if "README.md" in wf_file.name: continue
            rel_path = wf_file.relative_to(WORKFLOWS_DIR)
            print(f"  [WF] {rel_path}")
        print(f"{Fore.GREEN}--------------------------------------{Style.RESET_ALL}\n")
        return

    # Mapeo de comandos
    cmd_map = {
        "brainstorm": "01_Spider_Brainstorm.py",
        "plan": "02_Professor_X_Plan.py",
        "lfg-lite": "06_AntMan_Lfg_Lite.py",
        "lfg-full": "07_Doc_Strange_Lfg.py",
        "avengers": "73_Avengers_Workflow_v3.py",
    }

    if args.command in cmd_map:
        dynamic_speak(f"Ejecutando workflow: {args.command}")
        run_script(cmd_map[args.command])
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
