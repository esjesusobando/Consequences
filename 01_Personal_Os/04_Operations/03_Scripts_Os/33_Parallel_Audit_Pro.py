import os
import sys
import time
import subprocess
import io
from colorama import init, Fore, Style

# Initialize Colorama
init()

# =============================================================================
# ARMOR LAYER - PATH RESOLUTION (3-LEVEL)
# =============================================================================
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))

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

def find_fork_tool():
    """Busca el Fork Tool en múltiples ubicaciones posibles (3-level discovery)"""
    possible_paths = [
        # Primary: .agent backup (canonical)
        os.path.join(PROJECT_ROOT, ".agent", "02_Skills", "01_Fork_Terminal", "tools", "fork_terminal.py"),
        # Secondary: skills at root level
        os.path.join(PROJECT_ROOT, ".claude", "04_Skills", "01_Core", "01_Fork_Terminal", "tools", "fork_terminal.py"),
        # Tertiary: nested .agent structure
        os.path.join(PROJECT_ROOT, ".agent", "02_Skills", "07_Personal_Os", "02_Personal_Os", "08_Personal_Os", "01_Fork_Terminal", "tools", "fork_terminal.py"),
        # Quaternary: standalone in .agent
        os.path.join(PROJECT_ROOT, ".agent", "02_Skills", "08_Personal_Os", "01_Fork_Terminal", "tools", "fork_terminal.py"),
    ]
    for path in possible_paths:
        if os.path.exists(path):
            return path
    return None

FORK_TOOL = find_fork_tool()

def launch_agent(id, name, task_cmd):
    """Lanza un sub-agente usando fork_terminal.py oficial o fallback directo"""
    full_cmd = f"echo ==================================== && echo  🕵️ AGENT {id}: {name.upper()} && echo ==================================== && {task_cmd} && echo. && echo ✅ AGENT {id} COMPLETE && pause"

    print(f"🚀 Deploying Agent {id}: {name}")

    if FORK_TOOL and os.path.exists(FORK_TOOL):
        cmd_str = f'python "{FORK_TOOL}" "{full_cmd}"'
        os.system(cmd_str)
    else:
        # Fallback: ejecutar directamente sin fork (menos isolado pero funcional)
        print(f"   [FALLBACK] Ejecutando directamente...")
        os.system(f'start cmd /c "{full_cmd}"')
        time.sleep(0.5)


def main():
    print_banner()
    dynamic_speak("Activando diez sub agentes en paralelo para auditoría profunda")

    print(f"{Fore.RED}{'=' * 75}{Style.RESET_ALL}")
    print("🚀 ACTIVATING 10 PARALLEL SUB-AGENTS (LFG PRO)")
    print(f"{Fore.RED}{'=' * 75}{Style.RESET_ALL}")

    if FORK_TOOL is None:
        print(f"⚠️  Fork Tool no encontrado — usando fallback con cmd.exe directo")
    else:
        print(f"✅ Fork Tool encontrado: {FORK_TOOL}")

    # 1. Agente Estructural
    launch_agent(
        1,
        "Stack Integrity",
        f"python \"{SCRIPT_DIR}/50_System_Health_Monitor.py\"",
    )

    # 2. Agente de Reglas
    launch_agent(
        2,
        "Rules Auditor",
        f"python \"{SCRIPT_DIR}/05_Validator_Hub.py\"",
    )

    # 3. Agente de Enlaces
    launch_agent(
        3,
        "Link Validator",
        f"python \"{SCRIPT_DIR}/57_Repo_Sync_Auditor.py\"",
    )

    # 4. Agente Beautifier (README)
    launch_agent(
        4,
        "Health Check",
        f"python \"{SCRIPT_DIR}/17_Watchdog_Hub.py\"",
    )

    # 5. Agente de MCP Sync
    launch_agent(
        5,
        "MCP Sync",
        f"python \"{SCRIPT_DIR}/15_MCP_Sync_Hub.py\" --report",
    )

    # 6. Agente Skills Audit
    launch_agent(
        6,
        "Skills Audit",
        f"python \"{SCRIPT_DIR}/34_Skill_Auditor.py\"",
    )

    # 7. Agente System Mapper
    launch_agent(
        7,
        "System Mapper",
        f"python \"{SCRIPT_DIR}/20_System_Mapper_Hub.py\" --scan",
    )

    # 8. Agente de Inventario (Skills audit)
    launch_agent(
        8,
        "Skill Auditor",
        f"python \"{SCRIPT_DIR}/22_Validate_Skill_Frontmatter.py\"",
    )

    # 9. Agente de Seguridad
    launch_agent(
        9,
        "Security Scanner",
        f'findstr /S /I \"password secret key api_key\" *.py *.md 2>nul',
    )

    # 10. Agente Reporteador Final
    launch_agent(
        10,
        "Final Reporter",
        f"python \"{SCRIPT_DIR}/01_Auditor_Hub.py\" health",
    )

    print("\n✅ All 10 Agents Deployed.")
    print("   Please review each visible terminal window.")


if __name__ == "__main__":
    main()
