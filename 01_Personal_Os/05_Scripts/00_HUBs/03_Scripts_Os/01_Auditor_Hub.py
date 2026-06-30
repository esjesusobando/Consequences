import logging
import typing

logging.basicConfig(level=logging.INFO)
#!/usr/bin/env python3
"""
91_Auditor_Hub.py — Hub centralizador de auditorías del sistema
Reutiliza scripts de auditoría existentes: 53, 57, 34, 50, 33
"""

import argparse
import os
import sys
import io
import subprocess
from datetime import datetime
from pathlib import Path

try:
    from colorama import init, Fore, Style

    init()
except ImportError:

    class Fore:
        GREEN = YELLOW = RED = CYAN = MAGENTA = BLUE = ""

    class Style:
        RESET_ALL = ""


# === PROTOCOLO DE RUTA DINÁMICA (v6.2) ===
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "00_Winter_is_Coming").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os"))
from config_paths import *

# PROJECT_ROOT ya viene de config_paths como ROOT_DIR
PROJECT_ROOT = ROOT_DIR
REPORTS_DIR = (
    ROOT_DIR / "03_Resultado" / "07_Reports"
    if (ROOT_DIR / "03_Resultado" / "07_Reports").exists()
    else ROOT_DIR / "03_Resultado" / "03_Reportes"
)

# DIMENSIONES v6.2 - usando config_paths
DIMENSIONS = [
    MATRIX_DIR.name,
    CORE_DIR.name,
    KNOWLEDGE_DIR.name,
    TASKS_DIR.name,
    OPERATIONS_DIR.name,
    ARCHIVE_DIR.name,
    PLAYGROUND_DIR.name,
    PROJECTS_DIR.name,
    ENGINE_DIR.name,
]


def audit_dimensions():
    """Valida las 8 dimensiones del proyecto usando config_paths."""
    print(f"\n{Style.BRIGHT}Validating Dimensions (v6.2):")
    errors = 0
    # Usar las constantes de config_paths
    dims = [
        (MATRIX_DIR, "00_Winter_is_Coming"),
        (CORE_DIR, CORE_DIR.name),
        (KNOWLEDGE_DIR, KNOWLEDGE_DIR.name),
        (TASKS_DIR, TASKS_DIR.name),
        (OPERATIONS_DIR, OPERATIONS_DIR.name),
        (ARCHIVE_DIR, ARCHIVE_DIR.name),
        (PLAYGROUND_DIR, PLAYGROUND_DIR.name),
        (PROJECTS_DIR, PROJECTS_DIR.name),
        (ENGINE_DIR, ENGINE_DIR.name),
    ]
    for path, name in dims:
        if path.exists() and path.is_dir():
            print(f"{Fore.GREEN}[OK] {name}")
        else:
            print(f"{Fore.RED}[ERROR] {name} missing at {path}")
            errors += 1
    return errors


def audit_script_numbering():
    """Valida que scripts del ENGINE_DIR sigan el patrón NN_ o NNN_."""
    print(f"\n{Style.BRIGHT}Validating Engine Script Numbering:")
    errors = 0
    # Solo revisar scripts raíz, no subdirectorios
    for script in ENGINE_DIR.glob("*.py"):
        name = script.name
        # Skip config, __init__, and non-engine scripts
        if name in ("config_paths.py", "__init__.py", "refactor_revert_id.py"):
            continue
        # Pattern: NN_ o NNN_ al inicio
        is_valid = name[:3].isdigit() and name[3] == "_" or name[:2].isdigit() and name[2] == "_"
        if is_valid:
            print(f"{Fore.GREEN}[OK] {name}")
        else:
            print(f"{Fore.RED}[ERROR] {name} does not follow NN_ or NNN_ pattern")
            errors += 1
    return errors


# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")


def print_banner():
    banner = rf"""
{Fore.CYAN}    ###########################################################################
    #                                                                         #
    #      _____  _    _ _____  _____   ____  _    _ _____  _    _ _____      #
    #     |  __ \| |  | |  __ \|  __ \ / __ \| |  | |  __ \| |  | |  __ \     #
    #     | |__) | |  | | |__) | |  | | |  | | |  | | |__) | |__| | |  | |    #
    #     |  _  /| |  | |  _  /| |  | | |  | | |  | |  _  /|  __  | |  | |    #
    #     | | \ \| |__| | | \ \| |__| | |__| | |__| | | \ \| |  | | |__| |    #
    #     |_|  \_\____/|_|  \_\_____/ \____/ \____/|_|  \_\_|  |_|_____/     #
    #                                                                         #
    #                          A U D I T O R   H U B                          #
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


def run_script(script_name, report_path=None):
    """Ejecuta un script con fallback robusto. Guarda output en report_path si se provee."""
    try:
        from config_paths import get_skill_script
        script_path = get_skill_script(script_name)
    except ImportError:
        script_path = None

    # Fallback 1: buscar en ENGINE_DIR raíz
    if not script_path or not script_path.exists():
        script_path = ENGINE_DIR / script_name

    # Fallback 2: subdirectorios conocidos
    if not script_path or not script_path.exists():
        for subdir in ["05_Validator", "12_Auditors_Os", "09_Auxiliary", "10_Anthropic"]:
            candidate = ENGINE_DIR / subdir / script_name
            if candidate.exists():
                script_path = candidate
                break

    if not script_path or not script_path.exists():
        print(f"{Fore.RED}[ERROR] Script no encontrado: {script_name}{Style.RESET_ALL}")
        return ""

    print(f"{Fore.YELLOW}[RUNNING] Ejecutando: {script_name}...{Style.RESET_ALL}")
    scripts_dir = str(ENGINE_DIR)
    env = {**os.environ, "PYTHONPATH": scripts_dir}
    try:
        result = subprocess.run(
            [sys.executable, str(script_path)], cwd=scripts_dir, env=env,
            capture_output=True, text=True, encoding="utf-8", errors="replace", check=False
        )
        output = (result.stdout or "") + (result.stderr or "")
        print(output, end="")
        if report_path:
            report_path.parent.mkdir(parents=True, exist_ok=True)
            report_path.write_text(output, encoding="utf-8")
            print(f"{Fore.CYAN}📄 Reporte: {report_path.relative_to(ROOT_DIR)}{Style.RESET_ALL}")
        return output
    except Exception as e:
        print(f"{Fore.RED}[ERROR] Falló script: {e}{Style.RESET_ALL}")
        return ""


def main():
    print_banner()
    parser = argparse.ArgumentParser(
        description="Hub centralizador de auditorías del sistema."
    )
    subparsers = parser.add_subparsers(dest="command", help="Comandos disponibles")

    subparsers.add_parser(
        "estructura", help="Auditoría de estructura (reutiliza 53_Structure_Auditor.py)"
    )
    subparsers.add_parser(
        "links", help="Auditoría de links (reutiliza 29_Repo_Sync_Auditor.py)"
    )
    subparsers.add_parser(
        "skills", help="Auditoría de skills (reutiliza 27_Skill_Auditor.py)"
    )
    subparsers.add_parser(
        "health", help="Monitoreo de salud (reutiliza 28_System_Health_Monitor.py)"
    )
    subparsers.add_parser(
        "profundo", help="Auditoría profunda (reutiliza 26_Parallel_Audit_Pro.py)"
    )

    args = parser.parse_args()

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    if args.command == "estructura":
        dynamic_speak("Iniciando auditoría de estructura")
        print(f"{Style.BRIGHT}--- Structure Auditor ---")
        errors_dim = audit_dimensions()
        errors_num = audit_script_numbering()
        total_errors = errors_dim + errors_num
        if total_errors == 0:
            print(f"\n{Fore.GREEN}{Style.BRIGHT}✓ Estructura válida{Style.RESET_ALL}")
        else:
            print(
                f"\n{Fore.RED}{Style.BRIGHT}✗ Se encontraron {total_errors} errores{Style.RESET_ALL}"
            )
        report = REPORTS_DIR / f"audit_estructura_{ts}.txt"
        report.write_text(
            f"Audit estructura — {ts}\n"
            f"Dimension errors: {errors_dim}\n"
            f"Numbering errors: {errors_num}\n"
            f"Total errors: {total_errors}\n",
            encoding="utf-8",
        )
        print(f"{Fore.CYAN}📄 Reporte: 03_Resultado/04_Reportes/audit_estructura_{ts}.txt{Style.RESET_ALL}")
    elif args.command == "links":
        dynamic_speak("Iniciando auditoría de enlaces")
        run_script("29_Repo_Sync_Auditor.py", REPORTS_DIR / f"audit_links_{ts}.txt")
    elif args.command == "skills":
        dynamic_speak("Iniciando auditoría de skills")
        run_script("27_Skill_Auditor.py", REPORTS_DIR / f"audit_skills_{ts}.txt")
    elif args.command == "health":
        dynamic_speak("Iniciando monitoreo de salud")
        run_script("28_System_Health_Monitor.py", REPORTS_DIR / f"audit_health_{ts}.txt")
    elif args.command == "profundo":
        dynamic_speak("Iniciando auditoría profunda paralela")
        run_script("26_Parallel_Audit_Pro.py", REPORTS_DIR / f"audit_profundo_{ts}.txt")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
