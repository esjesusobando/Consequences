"""
setup_dependencies.py - Instala las dependencias de Python
"""

import os
import sys
import subprocess


def install_dependencies():
    """Instala las dependencias del proyecto"""
    installer_dir = os.path.dirname(os.path.abspath(__file__))
    requirements_file = os.path.join(installer_dir, "requirements.txt")

    print("📦 Instalando dependencias...")

    # Verificar Python
    try:
        result = subprocess.run(["python", "--version"], capture_output=True, text=True)
        print(f"✓ Python: {result.stdout.strip()}")
    except FileNotFoundError:
        print("❌ Python no encontrado. Instala Python 3.12+ desde python.org")
        return False

    # Instalar dependencias con uv o pip
    try:
        # Intentar con uv primero
        result = subprocess.run(["uv", "--version"], capture_output=True, text=True)
        print(f"✓ uv: {result.stdout.strip()}")

        # Instalar con uv
        result = subprocess.run(
            ["uv", "pip", "install", "-r", requirements_file],
            capture_output=True,
            text=True,
        )

        if result.returncode == 0:
            print("✓ Dependencias instaladas con uv")
            return True
        else:
            print(f"⚠ uv falló, intentando con pip: {result.stderr}")
            raise Exception("uv failed")

    except (FileNotFoundError, Exception):
        # Fallback a pip
        print("📦 Usando pip como fallback...")
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "-r", requirements_file],
            capture_output=True,
            text=True,
        )

        if result.returncode == 0:
            print("✓ Dependencias instaladas con pip")
            return True
        else:
            print(f"❌ Error instalando dependencias: {result.stderr}")
            return False


def check_node():
    """Verifica que Node.js esté instalado"""
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        print(f"✓ Node.js: {result.stdout.strip()}")
        return True
    except FileNotFoundError:
        print("⚠ Node.js no encontrado. Algunos MCPs no funcionarán.")
        return False


def check_git():
    """Verifica que Git esté instalado"""
    try:
        result = subprocess.run(["git", "--version"], capture_output=True, text=True)
        print(f"✓ Git: {result.stdout.strip()}")
        return True
    except FileNotFoundError:
        print("❌ Git no encontrado. Instala Git desde git-scm.com")
        return False


if __name__ == "__main__":
    print("=== Verificando Dependencias ===")
    check_git()
    check_node()
    install_dependencies()
    print("=== Instalación completada ===")
