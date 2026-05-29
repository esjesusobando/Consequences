import os
import sys
import io
import argparse
from pathlib import Path

# === PROTOCOLO DE RUTA v2.0 Consequences ===
# Script: 01_Personal_Os/04_Operations/03_Scripts_Os/12_Auditors_Os/scripts/
# → scripts/ → 12_Auditors_Os/ → 03_Scripts_Os/ → 04_Operations/ → 01_Personal_Os/ → ROOT
SCRIPT_DIR = Path(__file__).parent.resolve()
SCRIPTS_OS = SCRIPT_DIR.parent.parent  # 03_Scripts_Os
OPERATIONS = SCRIPTS_OS.parent          # 04_Operations
PERSONAL_OS = OPERATIONS.parent         # 01_Personal_Os
ROOT = PERSONAL_OS.parent               # Project root

# Fix encoding (Standard block)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Add Scripts_Os to path for config_paths
sys.path.insert(0, str(SCRIPTS_OS))
from config_paths import *
import re
import glob

PROJECT_ROOT = ROOT_DIR


def validate_table(table_block, file_path, line_num):
    """Valida que una tabla no tenga overflow ni problemas de formato."""
    issues = []
    lines = table_block.strip().split("\n")

    if len(lines) < 2:
        return issues

    # Parse cells
    rows = []
    for i, line in enumerate(lines):
        cells = [c.strip() for c in line.split("|")]
        if cells and cells[0] == "":
            cells.pop(0)
        if cells and cells[-1] == "":
            cells.pop(-1)
        rows.append(cells)

    if not rows:
        return issues

    # Check column consistency (exclude separator row)
    data_rows = [row for row in rows if not all(set(c).issubset({"-", ":", " "}) for c in row)]
    if data_rows:
        col_counts = [len(row) for row in data_rows]
        if len(set(col_counts)) > 1:
            issues.append(f"Línea {line_num}: columnas desiguales {col_counts}")

    # Check separator row exists (only if we have data rows)
    if data_rows and len(rows) > 1:
        if not any(set(c).issubset({"-", ":", " "}) for c in rows[1] if len(rows) > 1):
            issues.append(f"Línea {line_num}: falta fila separadora `|---|`")

    # Check no cell overflow (cell content longer than 400 chars is suspicious - likely URL or path)
    for i, row in enumerate(rows):
        for j, cell in enumerate(row):
            if len(cell) > 400:
                issues.append(f"Línea {line_num + i}: celda [{j}] muy larga ({len(cell)} chars)")

    return issues


def validate_file(file_path):
    """Valida todas las tablas en un archivo."""
    issues = []

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        current_table = []
        current_table_start = 0
        line_num = 0

        for i, line in enumerate(content.splitlines()):
            is_table_row = line.strip().startswith("|") and "|" in line

            if is_table_row:
                if not current_table:
                    current_table_start = i + 1
                current_table.append(line)
            else:
                if current_table:
                    table_block = "\n".join(current_table)
                    if len(current_table) >= 2:
                        table_issues = validate_table(table_block, file_path, current_table_start)
                        issues.extend(table_issues)
                    current_table = []
                line_num = i + 1

        # Check final table
        if current_table:
            table_block = "\n".join(current_table)
            if len(current_table) >= 2:
                table_issues = validate_table(table_block, file_path, current_table_start)
                issues.extend(table_issues)

    except Exception as e:
        issues.append(f"Error leyendo archivo: {e}")

    return issues


def align_table(table_block):
    """Alinea las columnas de una tabla markdown con espaciado equilibrado."""
    lines = table_block.strip().split("\n")
    if len(lines) < 2:
        return table_block

    # Parse rows
    rows = []
    for line in lines:
        if not line.strip().startswith("|"):
            return table_block

        cells = [c.strip() for c in line.split("|")]
        if cells and cells[0] == "":
            cells.pop(0)
        if cells and cells[-1] == "":
            cells.pop(-1)
        rows.append(cells)

    if not rows:
        return table_block

    # Calcular ancho de cada columna (sin padding extra, solo lo necesario)
    col_widths = {}
    for row in rows:
        for i, cell in enumerate(row):
            col_widths[i] = max(col_widths.get(i, 0), len(cell))
            if set(cell) == {"-"}:
                col_widths[i] = max(col_widths.get(i, 0), 3)

    # Reconstruir con espaciado equilibrado (1 espacio)
    new_lines = []
    for row in rows:
        new_row = "|"
        for i, cell in enumerate(row):
            width = col_widths.get(i, 0)
            if set(cell) == {"-"} or (
                set(cell).issubset({"-", ":", " "}) and len(cell) > 1
            ):
                content = "-" * width
            else:
                content = f" {cell.ljust(width)}"
            new_row += content + "|"
        new_lines.append(new_row)

    return "\n".join(new_lines)


def process_file(file_path, dry_run=False):
    """Procesa un archivo y beautifica sus tablas."""
    try:
        if not os.path.exists(file_path):
            return False, f"[SKIP] No existe: {os.path.basename(file_path)}"

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        original = content

        # State machine para tablas
        new_lines = []
        current_table = []
        in_table = False

        for line in content.splitlines():
            is_table_row = line.strip().startswith("|") and "|" in line

            if is_table_row:
                current_table.append(line)
                in_table = True
            else:
                if in_table:
                    table_block = "\n".join(current_table)
                    if len(current_table) >= 2 and any(
                        "---" in l for l in current_table
                    ):
                        new_lines.append(align_table(table_block))
                    else:
                        new_lines.extend(current_table)
                    current_table = []
                    in_table = False
                new_lines.append(line)

        # Fin del archivo con tabla
        if in_table and current_table:
            table_block = "\n".join(current_table)
            if len(current_table) >= 2 and any("---" in l for l in current_table):
                new_lines.append(align_table(table_block))
            else:
                new_lines.extend(current_table)

        new_content = "\n".join(new_lines) + "\n"

        if new_content != original:
            if dry_run:
                return True, f"[DRY] {os.path.basename(file_path)}"
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            return True, f"[BEAUTY] {os.path.basename(file_path)}"

        return True, f"[OK] {os.path.basename(file_path)}"

    except Exception as e:
        return False, f"[ERROR] {os.path.basename(file_path)}: {e}"


def validate_all_files(files):
    """Valida todas las tablas en una lista de archivos."""
    print("=" * 50)
    print("   TABLE VALIDATOR - PersonalOS v4.9")
    print("=" * 50)

    all_issues = []
    files_with_issues = 0

    for f in files:
        issues = validate_file(f)
        if issues:
            files_with_issues += 1
            all_issues.append((f, issues))

    if all_issues:
        print(f"\n⚠️ Archivos con problemas: {files_with_issues}")
        print("-" * 50)
        for f_path, issues in all_issues:
            print(f"\n📄 {os.path.relpath(f_path, PROJECT_ROOT)}:")
            for issue in issues:
                print(f"   ❌ {issue}")
    else:
        print("\n✅ Todas las tablas están correctamente formateadas")

    print("=" * 50)
    return all_issues


def main():
    parser = argparse.ArgumentParser(description="Beautify and validate markdown tables")
    parser.add_argument("files", nargs="*", help="Archivos a procesar (default: todos)")
    parser.add_argument("--validate", "-v", action="store_true", help="Solo validar tablas")
    parser.add_argument("--dry-run", "-n", action="store_true", help="No modificar archivos")
    args = parser.parse_args()

    print("=" * 50)
    print("   BEAUTIFY TABLES - PersonalOS v4.9")
    print("=" * 50)

    if args.validate:
        all_md = glob.glob(os.path.join(PROJECT_ROOT, "**/*.md"), recursive=True)
        exclude = ["node_modules", ".git", "dist", "build", "__pycache__", "Legacy", "legacy"]
        files = [f for f in all_md if not any(p in f for p in exclude)]
        validate_all_files(files)
        return

    if args.files:
        files = args.files
    else:
        all_md = glob.glob(os.path.join(PROJECT_ROOT, "**/*.md"), recursive=True)
        exclude = ["node_modules", ".git", "dist", "build", "__pycache__", "Legacy", "legacy"]
        files = [f for f in all_md if not any(p in f for p in exclude)]

    print(f"📊 Archivos a procesar: {len(files)}")

    success = 0
    errors = 0

    for f in files:
        ok, msg = process_file(f, dry_run=args.dry_run)
        print(msg)
        if ok:
            success += 1
        else:
            errors += 1

    print("=" * 50)
    print(f"✅ Procesados: {success}")
    print(f"❌ Errores: {errors}")
    print("=" * 50)

    # Si hay archivos especificados, también validar
    if args.files:
        print("\n🔍 Validando tablas...\n")
        validate_all_files(args.files)


if __name__ == "__main__":
    main()
