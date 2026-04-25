import os
import sys
import io
from pathlib import Path

# === PROTOCOLO DE RUTA v2.0 Consequences ===
# Script: 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/
# → scripts/ → 13_Auditors_Os/ → 03_Scripts_Os/ → 04_Operations/ → 01_Personal_Os/ → ROOT
SCRIPT_DIR = Path(__file__).parent.resolve()
SCRIPTS_OS = SCRIPT_DIR.parent.parent  # 03_Scripts_Os
OPERATIONS = SCRIPTS_OS.parent          # 04_Operations
PERSONAL_OS = OPERATIONS.parent         # 01_Personal_Os
ROOT = PERSONAL_OS.parent               # Project root

# Fix encoding for Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Add Scripts_Os to path for config_paths
sys.path.insert(0, str(SCRIPTS_OS))
from config_paths import *

import re
import glob
import hashlib

BASE_DIR = ROOT_DIR


def get_content_hash(text: str) -> str:
    """Hash del contenido sin espacios."""
    pure = "".join(text.split())
    return hashlib.sha256(pure.encode("utf-8")).hexdigest()


def beautify_markdown(content: str) -> str:
    """Reglas de estética premium."""
    # Normalizar saltos entre títulos y párrafos
    content = re.sub(r"(#+ .*?)\n+", r"\1\n\n", content)
    # Espacio después de títulos
    content = re.sub(r"(#+ .*?)\n(?!\n)", r"\1\n\n", content)
    # Listas con un espacio
    content = re.sub(r"^(\s*[\-\*])\s*", r"\1 ", content, flags=re.MULTILINE)
    # Máximo 2 saltos
    content = re.sub(r"\n{3,}", r"\n\n", content)
    # Un salto al final
    content = content.strip() + "\n"
    return content


def process_file(file_path: str) -> tuple:
    """Procesa archivo individual. Returns (success, message)"""
    try:
        if not os.path.exists(file_path):
            return False, f"[SKIP] No existe: {os.path.basename(file_path)}"

        with open(file_path, "r", encoding="utf-8") as f:
            original = f.read()
        original_hash = get_content_hash(original)

        beautified = beautify_markdown(original)
        beautified_hash = get_content_hash(beautified)

        # Validar integridad
        if original_hash != beautified_hash:
            return (
                False,
                f"[ERROR] Integridad comprometida: {os.path.basename(file_path)}",
            )

        if original != beautified:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(beautified)
            return True, f"[BEAUTY] Optimizado: {os.path.basename(file_path)}"

        return True, f"[OK] Ya bello: {os.path.basename(file_path)}"

    except (OSError, UnicodeDecodeError) as e:
        return False, f"[EXCEPTION] {os.path.basename(file_path)}: {e}"


def main():
    print("=" * 50)
    print("   PERSONAL OS : BEAUTY DOC v2.0")
    print("=" * 50)

    # Buscar TODOS los .md en el proyecto
    all_md_files = glob.glob(os.path.join(BASE_DIR, "**/*.md"), recursive=True)

    # Excluir ciertos paths
    exclude_patterns = [
        "node_modules",
        ".git",
        "dist",
        "build",
        "__pycache__",
        "Legacy",
        "legacy",
        "backup",
        ".claude",
    ]

    files_to_process = []
    for f in all_md_files:
        if not any(pattern in f for pattern in exclude_patterns):
            files_to_process.append(f)

    print(f"📄 Encontrados: {len(files_to_process)} archivos .md")

    success_count = 0
    error_count = 0

    for file_path in files_to_process:
        success, msg = process_file(file_path)
        print(msg)
        if success:
            success_count += 1
        else:
            error_count += 1

    print("=" * 50)
    print(f"✅ Procesados: {success_count}")
    print(f"❌ Errores: {error_count}")
    print("=" * 50)


if __name__ == "__main__":
    main()
