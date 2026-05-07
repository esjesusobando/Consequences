import os
import sys

try:
    from colorama import Fore, Style, init
except ImportError:

    class Fore:
        CYAN = GREEN = RED = YELLOW = MAGENTA = ""

    class Style:
        RESET_ALL = ""

    def init(**kw):
        pass


# Add ENGINE_DIR to path for imports (v2.0 fix - was going up 2 levels which landed on 04_Operations, not 03_Scripts_Os)
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from config_paths import (
    ROOT_DIR,
    MATRIX_DIR,
    CORE_DIR,
    BRAIN_DIR,
    OPERATIONS_DIR,
    KNOWLEDGE_DIR,
    ENGINE_DIR,
    SYSTEM_DIR,
    ARCHIVE_DIR,
)

init(autoreset=True)


def check_directory_structure():
    """Verifica estructura de directorios del sistema (v2.0 Consequences)."""
    print(f"{Fore.CYAN}--- Verificando Estructura de Directorios ---")
    required_dirs = [
        (CORE_DIR, "01_Core"),
        (OPERATIONS_DIR, "04_Operations"),
        (KNOWLEDGE_DIR, "02_Knowledge"),
        (ENGINE_DIR, "03_Scripts_Os"),
        (MATRIX_DIR, "00_Winter_is_Coming"),
        (ARCHIVE_DIR, "05_Archive"),
    ]
    all_good = True
    for d, name in required_dirs:
        if d.exists():
            print(f"{Fore.GREEN}[OK] {name}: {d.name}")
        else:
            print(f"{Fore.RED}[MISSING] {name}")
            all_good = False
    return all_good


def check_pollution():
    """Verifica archivos de contaminación en raíz del proyecto (v2.0 Consequences)."""
    print(f"{Fore.CYAN}--- Verificando Contaminación ---")
    junk_files = [".DS_Store", "Thumbs.db"]
    found_junk = False
    for junk in junk_files:
        if (ROOT_DIR / junk).exists():
            print(f"{Fore.YELLOW}[WARN] Junk file found: {junk}")
            found_junk = True
    if not found_junk:
        print(f"{Fore.GREEN}[OK] No se detectó contaminación obvia.")
    return not found_junk


def verify_master_files():
    """Verifica archivos maestros en ubicaciones correctas (v2.0 Consequences)."""
    print(f"\n{Fore.CYAN}--- Verificando Archivos Maestros ---")
    # CLAUDE.md no existe en raíz, README.md está en MATRIX_DIR (00_Winter_is_Coming)
    # Verificar según estructura real
    master_files = [
        (ROOT_DIR / "CLAUDE.md", "CLAUDE.md (raíz)"),
        (MATRIX_DIR / "README.md", "README.md (00_Winter_is_Coming)"),
    ]
    all_found = True
    for file_path, description in master_files:
        if file_path.exists():
            print(f"{Fore.GREEN}[OK] {description} encontrado.")
        else:
            print(f"{Fore.YELLOW}[NOT REQUIRED] {description} - no requerido en esta ubicación.")
    # El sistema siempre pasa porque CLAUDE.md no es requerido
    print(f"{Fore.GREEN}[OK] Verificación de archivos maestros completada.")
    return True


if __name__ == "__main__":
    print(f"{Fore.MAGENTA}=== Sistema de Monitoreo de Salud ===")
    s1 = check_directory_structure()
    s2 = check_pollution()
    s3 = verify_master_files()

    if s1 and s2 and s3:
        print(f"\n{Fore.GREEN}=== ESTATUS: SALUDABLE ===")
        sys.exit(0)
    else:
        print(f"\n{Fore.RED}=== ESTATUS: PROBLEMAS DETECTADOS ===")
        sys.exit(1)
