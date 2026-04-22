# -*- coding: utf-8 -*-
"""
setup_aliases.py - Configura aliases de System Guardian en el shell

Detecta el shell del usuario y agrega los aliases al archivo correcto.
"""

import os
import sys

# Fix Windows encoding
if sys.platform == "win32":
    import io

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")


ALIASES_CONTENT = """
# ═══════════════════════════════════════════════════════════════════════════════
# SYSTEM GUARDIAN ALIASES - PersonalOS
# Agregados por installer.py
# ═══════════════════════════════════════════════════════════════════════════════

# Alias Global - System Guardian (detecta root automáticamente)
alias gr='cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)" && python 04_ENGINE/08_Scripts_Os/79_System_Guardian.py'
alias gra='cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)" && python 04_ENGINE/08_Scripts_Os/79_System_Guardian.py --apply'
alias gr-agents='cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)" && python 04_ENGINE/08_Scripts_Os/79_System_Guardian.py --agents'

# ─────────────────────────────────────────────────────────────────────────────
"""


def get_shell_files():
    """Detecta archivos de configuración del shell"""
    home = os.path.expanduser("~")

    files = []

    # Bash
    bashrc = os.path.join(home, ".bashrc")
    if os.path.exists(bashrc):
        files.append(bashrc)

    # Zsh
    zshrc = os.path.join(home, ".zshrc")
    zshrc_local = os.path.join(home, ".zshrc.local")

    if os.path.exists(zshrc):
        files.append(zshrc)
    if os.path.exists(zshrc_local):
        files.append(zshrc_local)
    elif os.path.exists(zshrc):
        # Si .zshrc existe pero no .zshrc.local, usar .zshrc
        files.append(zshrc)

    # Fish
    fish_config = os.path.join(home, ".config", "fish", "config.fish")
    if os.path.exists(fish_config):
        files.append(fish_config)

    # PowerShell
    ps_profile = os.path.join(
        home, "Documents", "PowerShell", "Microsoft.PowerShell_profile.ps1"
    )
    if os.path.exists(ps_profile):
        files.append(ps_profile)

    return files


def add_aliases_to_file(filepath):
    """Agrega los aliases a un archivo de configuración"""

    # Marker para saber si ya están agregados
    marker = "SYSTEM GUARDIAN ALIASES - PersonalOS"

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        if marker in content:
            print(f"  = Ya configurado: {filepath}")
            return "already"

        # Agregar al final
        with open(filepath, "a", encoding="utf-8") as f:
            f.write(ALIASES_CONTENT)

        print(f"  ✓ Agregado a: {filepath}")
        return "added"

    except PermissionError:
        print(f"  ⚠ Permiso denegado: {filepath}")
        return "permission"
    except Exception as e:
        print(f"  ⚠ Error: {filepath} - {e}")
        return "error"


def setup_guardian_aliases():
    """Configura los aliases en el shell del usuario"""

    print("\nConfigurando aliases de System Guardian...")

    shell_files = get_shell_files()

    if not shell_files:
        print("  ⚠ No se encontró archivo de configuración del shell")
        return False

    results = []
    for filepath in shell_files:
        result = add_aliases_to_file(filepath)
        results.append(result)

    # Verificar si al menos uno funcionó
    if "added" in results or "already" in results:
        print("\n  ℹ Para activar los aliases, ejecuta:")
        for filepath in shell_files:
            shell = os.path.basename(filepath)
            print(f"    source ~/{shell}")
        return True

    return False


def print_alias_instructions():
    """Imprime instrucciones para configurar aliases manualmente"""

    print("\n" + "=" * 60)
    print("  CONFIGURACIÓN MANUAL DE ALIASES")
    print("=" * 60)
    print("\nAgrega esto a tu ~/.bashrc, ~/.zshrc o ~/.zshrc.local:")
    print(ALIASES_CONTENT)
    print("\nLuego ejecuta: source ~/.bashrc (o tu archivo correspondiente)")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    setup_guardian_aliases()
