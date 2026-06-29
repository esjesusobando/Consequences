import logging
import typing

logging.basicConfig(level=logging.INFO)
#!/usr/bin/env python3
"""
PATH REPLACEMENT SCRIPT — Think Different OS v4.9
Reemplaza paths old con nuevos paths correctos.

Uso:
    python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/path_replacement.py --dry-run
    python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/path_replacement.py --apply

Precaución: Usar --dry-run primero para ver qué cambiaría.
"""

import os
import re
from pathlib import Path
from datetime import datetime

# Paths a reemplazar
REPLACEMENTS = [
    # Path principal - skills
    (
        r'01_Personal_Os/00_Core/02_Tools/02_Skills/',
        '01_Personal_Os/00_Core/02_Tools/02_Skills/'
    ),
    # Backup estratégico
    (
        r'\01_Personal_Os/00_Core/02_Tools/02_Skills/',
        '01_Personal_Os/00_Core/02_Tools/02_Skills/'
    ),
]

# Extensiones de archivo a procesar
EXTENSIONS = {'.md', '.yaml', '.yml', '.json', '.py', '.txt', '.mdc'}

# Directorios a excluir (no procesar)
EXCLUDE_DIRS = {
    '.git',
    'node_modules',
    '__pycache__',
    '.claude',
    '.opencode',
    '.agent/02_Skills',  # El backup mismo
    '02_Skills',  # Otro backup
}

def should_process_file(filepath: Path) -> bool:
    """Determina si un archivo debe ser procesado."""
    # Verificar extensión
    if filepath.suffix.lower() not in EXTENSIONS:
        return False

    # Verificar que no esté en directorio excluido
    parts = filepath.parts
    for excluded in EXCLUDE_DIRS:
        if excluded in parts:
            return False

    return True

def process_file(filepath: Path, dry_run: bool = True) -> tuple[int, list]:
    """
    Procesa un archivo reemplazando paths old.
    Returns: (num_replacements, list_of_changes)
    """
    try:
        content = filepath.read_text(encoding='utf-8')
    except Exception as e:
        return 0, [f"ERROR reading: {e}"]

    original_content = content
    changes = []

    for old_pattern, new_pattern in REPLACEMENTS:
        # Usar regex para reemplazo preciso
        new_content, count = re.subn(
            old_pattern,
            new_pattern,
            content
        )
        if count > 0:
            changes.append(f"  {old_pattern} -> {new_pattern}: {count} occurrences")
            content = new_content

    if content != original_content:
        if not dry_run:
            # Crear backup
            backup_path = filepath.with_suffix(filepath.suffix + f'.bak.{datetime.now().strftime("%Y%m%d_%H%M%S")}')
            filepath.rename(backup_path)
            # Escribir archivo nuevo
            filepath.write_text(content, encoding='utf-8')
            changes.append(f"  ✓ BACKUP: {backup_path.name}")
            changes.append(f"  ✓ WRITTEN: {filepath.name}")

        return len(changes), changes

    return 0, []

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Path Replacement Script')
    parser.add_argument('--dry-run', action='store_true', help='Solo mostrar qué se cambiaría')
    parser.add_argument('--apply', action='store_true', help='Aplicar cambios (requiere --dry-run primero)')
    parser.add_argument('--path', default='.', help='Path base a procesar')

    args = parser.parse_args()

    if not args.dry_run and not args.apply:
        print("[*] Usar --dry-run para ver cambios, o --apply para aplicar")
        return

    base_path = Path(args.path)
    if not base_path.exists():
        print(f"[-] Path no existe: {base_path}")
        return

    print(f"\n[*] PROCESSING: {base_path}")
    print(f"[*] MODE: {'DRY RUN' if args.dry_run else 'APPLYING CHANGES'}")
    print("-" * 60)

    total_files = 0
    total_replacements = 0
    files_with_changes = []

    for filepath in base_path.rglob('*'):
        if filepath.is_file() and should_process_file(filepath):
            total_files += 1
            count, changes = process_file(filepath, dry_run=args.dry_run)

            if count > 0 or changes:
                files_with_changes.append({
                    'file': filepath,
                    'count': count,
                    'changes': changes
                })
                total_replacements += count

    print(f"\n[*] RESULTS:")
    print(f"    Files scanned: {total_files}")
    print(f"    Files with changes: {len(files_with_changes)}")
    print(f"    Total replacements: {total_replacements}")

    if files_with_changes:
        print(f"\n[*] FILES TO MODIFY:")
        for item in files_with_changes[:20]:  # Show first 20
            print(f"\n    {item['file']}")
            for change in item['changes']:
                print(change)

        if len(files_with_changes) > 20:
            print(f"\n    ... and {len(files_with_changes) - 20} more files")

    if args.dry_run:
        print(f"\n[*] Run con --apply para aplicar estos cambios")

    if args.apply:
        print(f"\n[*] DONE: {len(files_with_changes)} files modified")

if __name__ == '__main__':
    main()