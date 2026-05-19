"""
25_Minimax_Optimizer_Hub.py - Gestión de Integración MiniMax para PersonalOS
===========================================================================
Este HUB permite configurar y optimizar el uso de los modelos MiniMax con
Claude Code y otros agentes, asegurando baja latencia y alta precisión.

Uso:
    python 25_Minimax_Optimizer_Hub.py --check
    python 25_Minimax_Optimizer_Hub.py --optimize
    python 25_Minimax_Optimizer_Hub.py --status
    python 25_Minimax_Optimizer_Hub.py --latency
"""

import argparse
import io
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# Importar rutas del sistema
try:
    from config_paths import ROOT_DIR
except ImportError:
    sys.path.append(str(Path(__file__).resolve().parent))
    from config_paths import ROOT_DIR


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


def check_latency():
    """Mide la latencia al endpoint de MiniMax."""
    host = "api.minimax.io"
    try:
        output = subprocess.check_output(
            ["ping", "-n", "1", host],
            stderr=subprocess.STDOUT,
            text=True
        )
        match = re.search(r"tiempo=(\d+)ms", output)
        if match:
            return True, f"{match.group(1)}ms"
        return True, "Ping exitoso"
    except Exception:
        return False, "Host inaccesible"


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

    if "env" not in settings:
        settings["env"] = {}

    settings["env"]["ANTHROPIC_BASE_URL"] = "https://api.minimax.io/anthropic/v1"

    with open(settings_path, "w") as f:
        json.dump(settings, f, indent=2)

    return True, f"Claude Code configurado para MiniMax SOTA"


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


def cmd_status(args):
    """Muestra el estado actual de la integración MiniMax."""
    print("=== MiniMax Optimizer Hub v1.1 -- STATUS ===")
    print()

    # Check credentials
    ready, msg = check_minimax_ready()
    status = "[OK]" if ready else "[WARN]"
    print(f"  {status} Credenciales: {msg}")

    # Check latency
    if ready:
        ok, lat = check_latency()
        status = "[OK]" if ok else "[ERROR]"
        print(f"  {status} Latencia: {lat}")

    # Check settings file
    settings_path = Path.home() / ".claude" / "settings.local.json"
    if settings_path.exists():
        print(f"  [INFO] Settings: {settings_path}")
        with open(settings_path, "r") as f:
            try:
                settings = json.load(f)
                base_url = settings.get("env", {}).get("ANTHROPIC_BASE_URL", "no configurado")
                print(f"  [INFO] Endpoint: {base_url}")
            except json.JSONDecodeError:
                print("  [WARN] Settings file corrupto")
    else:
        print("  [INFO] Settings: no existe todavia")

    print()


def cmd_check(args):
    """Verifica la configuración completa."""
    print("=== MiniMax Optimizer Hub v1.1 -- CHECK ===")
    print()

    ready, msg = check_minimax_ready()
    print(f"[*] Credenciales: {msg}")

    if ready:
        ok, lat = check_latency()
        status = f"Latencia: {lat}" if ok else "Latencia: ERROR"
        print(f"[*] {status}")

        success, msg = optimize_claude_for_minimax()
        if success:
            print(f"[OK] {msg}")
            if not args.no_sound:
                play_completion_sound()
        else:
            print(f"[ERROR] {msg}")
    else:
        print("[WARN] Por favor, configura MINIMAX_API_KEY en tu archivo .env")


def cmd_latency(args):
    """Mide y reporta la latencia."""
    print("=== MiniMax Optimizer Hub v1.1 -- LATENCY TEST ===")
    print()

    for i in range(3):
        ok, lat = check_latency()
        status = "[OK]" if ok else "[ERROR]"
        print(f"  Intento {i+1}: {status} {lat}")
        time.sleep(1)


def cmd_optimize(args):
    """Aplica la optimización de Claude Code para MiniMax."""
    print("=== MiniMax Optimizer Hub v1.1 -- OPTIMIZE ===")
    print()

    success, msg = optimize_claude_for_minimax()
    if success:
        print(f"[OK] {msg}")
        if not args.no_sound:
            play_completion_sound()
    else:
        print(f"[ERROR] {msg}")


def main():
    parser = argparse.ArgumentParser(
        description="MiniMax Optimizer Hub - Gestión de integración MiniMax para PersonalOS",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  python 25_Minimax_Optimizer_Hub.py --status
  python 25_Minimax_Optimizer_Hub.py --check
  python 25_Minimax_Optimizer_Hub.py --optimize
  python 25_Minimax_Optimizer_Hub.py --latency
        """
    )

    parser.add_argument("--status", action="store_true", help="Muestra estado actual")
    parser.add_argument("--check", action="store_true", help="Verifica configuración completa")
    parser.add_argument("--optimize", action="store_true", help="Aplica optimización")
    parser.add_argument("--latency", action="store_true", help="Test de latencia")
    parser.add_argument("--no-sound", action="store_true", help="No reproducir sonidos")

    args = parser.parse_args()

    # Default: show status
    if not any([args.status, args.check, args.optimize, args.latency]):
        args.status = True

    if args.status:
        cmd_status(args)
    elif args.check:
        cmd_check(args)
    elif args.optimize:
        cmd_optimize(args)
    elif args.latency:
        cmd_latency(args)


if __name__ == "__main__":
    main()