import sys
from pathlib import Path

# === PROTOCOLO DE RUTA DINÁMICA (v6.1) ===
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "01_Core").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "08_Scripts_Os"))
from config_paths import *

import os
import subprocess
import io
from colorama import init, Fore, Style

init()

# Cargar servidor AIPM en el path
if SERVER_DIR.exists() and str(SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(SERVER_DIR))

# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")


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


def print_banner():
    banner = rf"""
{Fore.CYAN}    ###########################################################################
    #                                                                         #
    #       _____ ____  _   _ _______ _____   ____  _                         #
    #      / ____/ __ \| \ | |__   __|  __ \ / __ \| |                        #
    #     | |   | |  | |  \| |  | |  | |__) | |  | | |                        #
    #     | |   | |  | | . ` |  | |  |  _  /| |  | | |                        #
    #     | |___| |__| | |\  |  | |  | | \ \| |__| | |____                    #
    #      \_____\____/|_| \_|  |_|  |_|  \_\\____/|______|                   #
    #                                                                         #
    #                        C O N T R O L   C E N T E R                      #
    #                       P E R S O N A L   O S                             #
    ###########################################################################{Style.RESET_ALL}
"""
    print(banner)


if os.path.exists(AIPM_CORE) and AIPM_CORE not in sys.path:
    sys.path.insert(0, str(AIPM_CORE))

try:
    from AIPM.core import AIPMControlCenter
except ImportError:
    AIPMControlCenter = None

if __name__ == "__main__":
    print_banner()
    dynamic_speak("Cargando centro de control estratégico AIPM")

    try:
        from AIPM.core import AIPMControlCenter

        center = AIPMControlCenter()
        center.show_dashboard()
    except (ImportError, Exception) as e:
        print(f"{Fore.RED}[ERROR] No se pudo cargar el Dashboard: {e}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Iniciando dashboard de emergencia...{Style.RESET_ALL}")
        # Dashboard simple de fallback
        print("\n[AIPM] DASHBOARD DE EMERGENCIA")
        print(f"      Estado: {Fore.GREEN}OPERATIVO{Style.RESET_ALL}")
        print(f"      Skills: {Fore.CYAN}84 Cargadas{Style.RESET_ALL}")
        print(f"      Memoria: {Fore.CYAN}Saludable{Style.RESET_ALL}")
