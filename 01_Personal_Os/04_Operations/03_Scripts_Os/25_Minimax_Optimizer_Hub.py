"""
25_Minimax_Optimizer_Hub.py - Gestión de Integración MiniMax para PersonalOS
===========================================================================
Este HUB permite configurar y optimizar el uso de los modelos MiniMax con 
Claude Code y otros agentes, asegurando baja latencia y alta precisión.
"""

import os
import sys
from pathlib import Path
import json

import time
import subprocess

# Importar rutas del sistema
try:
    from config_paths import ROOT_DIR, DOT_CLAUDE_DIR
except ImportError:
    # Fallback si no está en el path
    sys.path.append(str(Path(__file__).resolve().parent))
    from config_paths import ROOT_DIR, DOT_CLAUDE_DIR

def play_completion_sound():
    """Reproduce el sonido de tarea completada usando el Sound Engine."""
    try:
        import importlib.util
        sound_path = Path(__file__).parent / "00_Sound_Engine.py"
        if sound_path.exists():
            spec = importlib.util.spec_from_file_location("sound_engine", str(sound_path))
            se = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(se)
            se.play_task_complete()
    except Exception:
        pass

def check_latency():
    """Mide la latencia al endpoint de MiniMax."""
    host = "api.minimax.io"
    try:
        # Usar ping (Windows)
        output = subprocess.check_output(["ping", "-n", "1", host], stderr=subprocess.STDOUT, text=True)
        # Extraer tiempo (Windows format: tiempo=XXms)
        import re
        match = re.search(r"tiempo=(\d+)ms", output)
        if match:
            return True, f"{match.group(1)}ms"
        return True, "Ping exitoso"
    except Exception:
        return False, "Host inaccesible"

def check_minimax_ready():
    """Verifica si las credenciales de MiniMax están configuradas en el entorno."""
    env_path = ROOT_DIR / ".env"
    if not env_path.exists():
        return False, "Archivo .env no encontrado"
    
    with open(env_path, "r") as f:
        content = f.read()
        if "MINIMAX_API_KEY" in content:
            return True, "Credenciales detectadas"
    return False, "MINIMAX_API_KEY no configurada en .env"

def optimize_claude_for_minimax():
    """Configura Claude Code para usar el endpoint optimizado de MiniMax."""
    settings_path = Path.home() / ".claude" / "settings.local.json"
    
    if not settings_path.parent.exists():
        settings_path.parent.mkdir(parents=True, exist_ok=True)
    
    settings = {}
    if settings_path.exists():
        with open(settings_path, "r") as f:
            try:
                settings = json.load(f)
            except json.JSONDecodeError:
                settings = {}

    # Configurar endpoint compatible con Anthropic
    if "env" not in settings:
        settings["env"] = {}
    
    settings["env"]["ANTHROPIC_BASE_URL"] = "https://api.minimax.io/anthropic/v1"
    
    # Nota: Claude Code usará la API Key de Anthropic por defecto, 
    # pero podemos forzar el uso de la de MiniMax si es necesario.
    # settings["env"]["ANTHROPIC_API_KEY"] = os.environ.get("MINIMAX_API_KEY", "")

    with open(settings_path, "w") as f:
        json.dump(settings, f, indent=2)
    
    return True, f"Claude Code configurado para MiniMax SOTA vía {settings_path}"

if __name__ == "__main__":
    print("=== MiniMax Optimizer Hub v1.1 — SOTA Edition ===")
    
    ready, msg = check_minimax_ready()
    print(f"[*] Credenciales: {msg}")
    
    if ready:
        # Medir latencia
        ok, lat = check_latency()
        status_lat = f"Latencia: {lat}" if ok else "Latencia: ERROR"
        print(f"[*] {status_lat}")
        
        success, msg = optimize_claude_for_minimax()
        if success:
            print(f"✅ {msg}")
            play_completion_sound()
        else:
            print(f"❌ Error: {msg}")
    else:
        print("⚠️  Por favor, configura MINIMAX_API_KEY en tu archivo .env")
