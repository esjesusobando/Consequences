
# === PROTOCOLO DE RUTA DINÁMICA (v6.1) ===
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "01_Core").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "08_Scripts_Os"))
from config_paths import *
import os
import sys
import time
import subprocess
import io
from colorama import init, Fore, Style

# Initialize Colorama
init()

# Las rutas principales se importan desde config_paths arriba

# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

def dynamic_speak(text):
    """Interfaz de Voz SOTA v2.2"""
    print(f"{Fore.MAGENTA}🔊 [VOICE]: {text}{Style.RESET_ALL}")
    if sys.platform == "win32":
        try:
            cmd = f'PowerShell -Command "Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak(\'{text}\')"'
            subprocess.Popen(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except:
            pass

def print_banner():
    banner = rf"""
{Fore.RED}    ###########################################################################
    #                                                                         #
    #      _____   _    _____         _      _      ______ _                    #
    #     |  __ \ / \  |  __ \       | |    | |    |  ____| |                   #
    #     | |__) / _ \ | |__) | __ _ | |    | |    | |__  | |                   #
    #     |  ___/ ___ \|  _  / / _` || |    | |    |  __| | |                   #
    #     | |  / /   \ \ | \ \| (_| || |____| |____| |____| |____               #
    #     |_| /_/     \_\_| \_\\__,_||______|______|______|______|              #
    #                                                                         #
    #                        P A R A L L E L   A U D I T                      #
    #                       P E R S O N A L   O S                             #
    ###########################################################################{Style.RESET_ALL}
"""
    print(banner)

ROOT_DIR = PROJECT_ROOT
# Official Skill Tool Path - BUSCAR DINÁMICO con get_skill_script()
FORK_TOOL = get_skill_script("fork_terminal.py") if 'get_skill_script' in dir() else None


def launch_agent(id, name, task_cmd):
    """Lanza un sub-agente - si falla, solo avisa pero no detiene."""
    try:
        print(f"🚀 Deploying Agent {id}: {name}")
        # Usar os.system para并行 sin bloquear
        os.system(task_cmd)
        time.sleep(0.5)  # Stagger reducido
    except Exception as e:
        print(f"⚠️  Agent {id} failed: {e}")
        # No throw - solo warn


def main():
    print_banner()
    dynamic_speak("Activando auditoría profunda con agentes paralelos")

    print(f"{Fore.RED}{'=' * 75}{Style.RESET_ALL}")
    print("🚀 PARALLEL AUDIT - PERSONALOS v6.2")
    print(f"{Fore.RED}{'=' * 75}{Style.RESET_ALL}")

    # 1. Agente Estructural - usar config_paths con get_skill_script()
    launch_agent(1, "StackIntegrity", f'python -c "from config_paths import *; print(ROOT_DIR)"')

    # 2. Agente de Reglas - en 03_Validator
    launch_agent(2, "RulesAuditor", f'python "{ENGINE_DIR / "03_Validator" / "40_Validate_Rules.py"}"')

    # 3. Agente de Enlaces - en 14_Otros (no en 01_Ritual)
    launch_agent(3, "LinkValidator", f'python "{ENGINE_DIR / "14_Otros" / "12_Update_Links.py"}"')

    # 4-7. Agentes Beautifier - usar 13_Auditors_Os
    launch_agent(4, "BeautifierREADME", f'python "{ENGINE_DIR / "13_Auditors_Os" / "scripts" / "13_Beautify_Tables.py"}" --target=README.md')

    launch_agent(5, "BeautifierAGENTS", f'python "{ENGINE_DIR / "13_Auditors_Os" / "scripts" / "13_Beautify_Tables.py"}" --target=AGENTS.md')

    launch_agent(6, "BeautifierINVENTORY", f'python "{ENGINE_DIR / "13_Auditors_Os" / "scripts" / "13_Beautify_Tables.py}" --target=01_Core/01_Inventario_Total.md')

    launch_agent(7, "BeautifierCLAUDE", f'python "{ENGINE_DIR / "13_Auditors_Os" / "scripts" / "13_Beautify_Tables.py"}" --target=CLAUDE.md')

    # 8. Agente de Inventario (Skills audit) - en 03_Validator
    launch_agent(8, "SkillAuditor", f'python "{ENGINE_DIR / "03_Validator" / "34_Skill_Auditor.py"}"')

    # 9. Agente de Seguridad - en 03_Validator
    launch_agent(9, "SecurityScanner", f'python "{ENGINE_DIR / "03_Validator" / "skill_security_scan.py"}" --skill={SKILLS_DIR}')

    # 10. Agente Reporteador Final - en 11_Anthropic_Harness (no en 04_Reporting)
    launch_agent(10, "FinalReporter", f'python "{ENGINE_DIR / "11_Anthropic_Harness" / "02_Evaluator_Runner.py"}"')

    print("\n✅ All 10 Agents Deployed.")
    print("   Please review each visible terminal window.")


if __name__ == "__main__":
    main()
