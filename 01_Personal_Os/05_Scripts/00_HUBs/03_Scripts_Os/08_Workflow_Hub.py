import logging
import typing

logging.basicConfig(level=logging.INFO)
#!/usr/bin/env python3
"""
08_Workflow_Hub.py — Workflow Automation Hub
=============================================
PersonalOS v6.1 | Think Different -> SOTA Upgraded (v6.2)

Automatiza flujos de trabajo recurrentes del OS: rituales de apertura/cierre,
procesamiento de backlog, generación de reportes de sesión y ejecución de
pipelines predefinidos (SDD, CE, etc.).

Uso:
    python 08_Workflow_Hub.py --help
    python 08_Workflow_Hub.py open         # Ritual de apertura
    python 08_Workflow_Hub.py close        # Ritual de cierre
    python 08_Workflow_Hub.py list         # Listar workflows
    python 08_Workflow_Hub.py run <name>   # Ejecutar workflow específico
"""
import argparse
import subprocess
import sys
import time
from pathlib import Path
from typing import Optional, Dict

# === PROTOCOLO DE RUTA v2.0 Consequences ===
SCRIPT_DIR = Path(__file__).parent.resolve()
SCRIPTS_OS = SCRIPT_DIR.parent  # 03_Scripts_Os

PERSONAL_OS = next(p for p in Path(__file__).resolve().parents if p.name == "01_Personal_Os")  # 01_Personal_Os
ROOT = PERSONAL_OS.parent  # Project root

sys.path.insert(0, str(SCRIPTS_OS))
try:
    from config_paths import get_skill_script, WORKFLOWS_DIR
except ImportError:
    WORKFLOWS_DIR = PERSONAL_OS / "00_Core" / "00_Workflows"
    def get_skill_script(name: str) -> Optional[Path]: return None

# === COLOR SETUP ===
try:
    from colorama import init, Fore, Style
    init(autoreset=True)
except ImportError:
    class Fore: GREEN = YELLOW = RED = CYAN = MAGENTA = BLUE = ""
    class Style: RESET_ALL = ""

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

def print_banner() -> None:
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
    #                       P E R S O N A L   O S   [SOTA UPGRADE]            #
    ###########################################################################{Style.RESET_ALL}
"""
    print(banner)

def dynamic_speak(text: str) -> None:
    print(f"{Fore.MAGENTA}🔊 [VOICE]: {text}{Style.RESET_ALL}")

def timer_decorator(func):
    """Decorator to measure execution time of workflows (SOTA improvement)"""
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{Fore.BLUE}⏱️ [TELEMETRY] Execution time: {elapsed:.2f}s{Style.RESET_ALL}")
        return result
    return wrapper

@timer_decorator
def run_script(script_name: str) -> None:
    script_path = get_skill_script(script_name)
    if not script_path or not script_path.exists():
        # Fallback directo a 13_Legacy (workflows heredados)
        script_path = SCRIPT_DIR / "13_Legacy" / script_name
    
    if not script_path.exists():
        print(f"{Fore.RED}[ERROR] Script no encontrado: {script_name}. Verifique config_paths.{Style.RESET_ALL}")
        return

    print(f"{Fore.YELLOW}[RUNNING] Ejecutando workflow seguro: {script_name}...{Style.RESET_ALL}")
    env = {**__import__('os').environ, "PYTHONPATH": str(SCRIPT_DIR)}
    
    try:
        result = subprocess.run([sys.executable, str(script_path)], cwd=str(SCRIPT_DIR), env=env, check=True)
        if result.returncode == 0:
            print(f"{Fore.GREEN}✅ [SUCCESS] Workflow {script_name} completado.{Style.RESET_ALL}")
    except subprocess.CalledProcessError as e:
        print(f"{Fore.RED}❌ [CRITICAL] Fallo en la ejecución del workflow {script_name}. Retcode: {e.returncode}{Style.RESET_ALL}")
    except Exception as e:
        print(f"{Fore.RED}❌ [SYSTEM ERROR] Error inesperado ejecutando {script_name}: {str(e)}{Style.RESET_ALL}")

def list_workflows() -> None:
    dynamic_speak("Listando todos los flujos de trabajo disponibles (v6.2)...")
    if not WORKFLOWS_DIR.exists():
        print(f"{Fore.RED}[FAIL] WORKFLOWS_DIR no detectado en: {WORKFLOWS_DIR}{Style.RESET_ALL}")
        return
    
    print(f"\n{Fore.GREEN}--- Catálogo Jerárquico de Workflows ---{Style.RESET_ALL}")
    workflows_found = 0
    for wf_file in sorted(WORKFLOWS_DIR.rglob("*.md")):
        if "README.md" in wf_file.name: continue
        rel_path = wf_file.relative_to(WORKFLOWS_DIR)
        print(f"  [WF] {rel_path}")
        workflows_found += 1
    print(f"{Fore.GREEN}--- Total Encontrados: {workflows_found} ---{Style.RESET_ALL}\n")

def main() -> None:
    print_banner()
    parser = argparse.ArgumentParser(description="Hub centralizador de Workflows y Procesos (SOTA).")
    subparsers = parser.add_subparsers(dest="command", help="Comandos de Workflows")

    subparsers.add_parser("list", help="Lista todos los flujos de trabajo disponibles (recursivo)")
    subparsers.add_parser("brainstorm", help="Spider Brainstorm")
    subparsers.add_parser("plan", help="Professor X Plan")
    subparsers.add_parser("lfg-lite", help="AntMan LFG Lite")
    subparsers.add_parser("lfg-full", help="Doc Strange LFG")
    subparsers.add_parser("avengers", help="Avengers Workflow SOTA")

    args = parser.parse_args()

    if args.command == "list":
        list_workflows()
        return

    cmd_map: Dict[str, str] = {
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

