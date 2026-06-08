#!/usr/bin/env python3
"""
31_Graphify_Hub.py — Hub centralizador de Graphify
PersonalOS v6.2 | Think Different

Gestiona el conocimiento estructural del proyecto mediante Graphify:
- Construye y mantiene el grafo de conocimiento del codebase
- Proporciona consultas estructurales para otros componentes
- Integra con el orquestador para conciencia de arquitectura

Uso:
    python 31_Graphify_Hub.py --build     # Construir/actualizar grafo
    python 31_Graphify_Hub.py --query "función main"  # Consultar grafo
    python 31_Graphify_Hub.py --report    # Mostrar GRAPH_REPORT.md
    python 31_Graphify_Hub.py --server    # Iniciar MCP server
"""

import argparse
import json
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
{Fore.BLUE}    ###########################################################################
    #                                                                         #
    #      _____ _           _       _   _              _____                #
    #     |_   _| |__   ___ | |_ ___| |_| |_ ___ _ __  |   __|_ _ _ _ ___    #
    #       | | | '_ \ / _ \| __/ _ \ __|  _/ -_) '_|  |  | | | | | | '_ \   #
    #       |_| |_.__/ \___/ \__\___/\_|_| \___|_|     |_|  |_|  _|_| |_,_|   #
    #                                                                         #
    #                       G R A P H I F Y   H U B                           #
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
            subprocess.Popen(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except:
            pass

def build_graph():
    """Construye o actualiza el grafo de conocimiento (modo AST-only)"""
    dynamic_speak("Iniciando construcción del grafo Graphify")
    
    # Asegurar que el directorio de salida existe
    GRAPHIFY_DIR.mkdir(parents=True, exist_ok=True)
    
    # Ejecutar graphify update en modo AST-only (no requiere API keys)
    print(f"{Fore.YELLOW}[BUILD] Actualizando códigobase: {ROOT}{Style.RESET_ALL}")
    result = subprocess.run(
        ["graphify", "update", str(ROOT), "--no-cluster"], 
        cwd=str(ROOT),
        capture_output=True, 
        text=True, 
        encoding="utf-8", 
        errors="replace"
    )
    
    if result.returncode == 0:
        print(f"{Fore.GREEN}[OK] Grafo actualizado exitosamente{Style.RESET_ALL}")
        print(f"{Fore.CYAN}📊 Reporte: {GRAPHIFY_REPORT.relative_to(ROOT)}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}🌐 Visualización: {GRAPHIFY_HTML.relative_to(ROOT)}{Style.RESET_ALL}")
        return True
    else:
        print(f"{Fore.RED}[ERROR] Falló actualización: {result.stderr}{Style.RESET_ALL}")
        return False

def query_graph(query_text):
    """Ejecuta una consulta contra el grafo"""
    if not GRAPHIFY_DB.exists():
        print(f"{Fore.RED}[ERROR] Grafo no encontrado. Ejecute --build primero{Style.RESET_ALL}")
        return False
        
    dynamic_speak(f"Consultando grafo: '{query_text}'")
    result = subprocess.run(
        ["graphify", "query", query_text],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace"
    )
    
    if result.returncode == 0:
        print(f"{Fore.GREEN}Resultado de la consulta:{Style.RESET_ALL}")
        print(result.stdout)
        return True
    else:
        print(f"{Fore.RED}[ERROR] Falló consulta: {result.stderr}{Style.RESET_ALL}")
        return False

def show_report():
    """Muestra el GRAPH_REPORT.md"""
    if not GRAPHIFY_REPORT.exists():
        print(f"{Fore.RED}[ERROR] Reporte no encontrado. Ejecute --build primero{Style.RESET_ALL}")
        return False
        
    print(f"{Fore.CYAN}=== GRAPH REPORT ==={Style.RESET_ALL}")
    print(GRAPHIFY_REPORT.read_text(encoding="utf-8"))
    return True

def start_mcp_server():
    """Inicia el servidor MCP de Graphify"""
    if not GRAPHIFY_DB.exists():
        print(f"{Fore.RED}[ERROR] Grafo no encontrado. Ejecute --build primero{Style.RESET_ALL}")
        return False
        
    dynamic_speak("Iniciando servidor MCP Graphify")
    print(f"{Fore.YELLOW}[MCP] Servidor disponible en: http://localhost:5000{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}[MCP] Presione Ctrl+C para detener{Style.RESET_ALL}")
    
    try:
        subprocess.run(["graphify", "serve", str(GRAPHIFY_DB)], cwd=str(ROOT))
    except KeyboardInterrupt:
        print(f"\n{Fore.GREEN}[MCP] Servidor detenido{Style.RESET_ALL}")
    return True

def main():
    print_banner()
    parser = argparse.ArgumentParser(
        description="Hub centralizador de Graphify para conocimiento estructural."
    )
    parser.add_argument(
        "--build", 
        action="store_true", 
        help="Construir/actualizar el grafo de conocimiento"
    )
    parser.add_argument(
        "--query", 
        type=str, 
        help="Consultar el grafo (ej: --query \"función main\")"
    )
    parser.add_argument(
        "--report", 
        action="store_true", 
        help="Mostrar el reporte estructural (GRAPH_REPORT.md)"
    )
    parser.add_argument(
        "--server", 
        action="store_true", 
        help="Iniciar servidor MCP para acceso programático"
    )
    
    args = parser.parse_args()
    
    if args.build:
        build_graph()
    elif args.query:
        query_graph(args.query)
    elif args.report:
        show_report()
    elif args.server:
        start_mcp_server()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()