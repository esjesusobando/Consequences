#!/usr/bin/env python3
"""
README Table Beautifier — Pixel Perfect v2
Recorre todos los README.md del PersonalOS y alinea las tablas markdown perfectamente.
Detecta ROOT automáticamente por sentinel (00_Winter_is_Coming/).
"""
import re
import sys
from pathlib import Path


def find_repo_root() -> Path:
    """Detecta raíz del repo buscando el sentinel 00_Winter_is_Coming/."""
    cwd = Path.cwd()
    for parent in [cwd] + list(cwd.parents):
        if (parent / "00_Winter_is_Coming").is_dir():
            return parent
    # Fallback: el directorio del script
    return Path(__file__).parent.parent.parent.parent.parent


ROOT = find_repo_root()

# READMEs del sistema operativo (excluye proyectos externos, node_modules, backups)
SKIP_PATTERNS = [
    "node_modules",
    ".git",
    "__pycache__",
    ".venv",
    ".mypy_cache",
    ".pytest_cache",
    # Archivos/backups de terceros
    "01_Repos_Reference",
    "04_Operations_Backup",
    "_sdd_backup",
    ".agent_backup_pre_sync",
    "Zero_Consequences-main",
]


def should_skip(path: Path) -> bool:
    path_str = str(path)
    return any(skip in path_str for skip in SKIP_PATTERNS)


def parse_table_rows(lines: list[str]) -> list[list[str]]:
    """Parse markdown table lines into list of cell lists."""
    rows = []
    for line in lines:
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        rows.append(cells)
    return rows


def is_separator_row(row: list[str]) -> bool:
    return all(re.match(r"^:?-+:?$", c.strip()) or c.strip() == "" for c in row)


def format_table(table_lines: list[str]) -> list[str]:
    """Reformat a markdown table with perfect column alignment."""
    rows = parse_table_rows(table_lines)
    if len(rows) < 2:
        return table_lines

    # Find separator row index
    sep_idx = None
    for i, row in enumerate(rows):
        if is_separator_row(row):
            sep_idx = i
            break
    if sep_idx is None:
        return table_lines

    # Normalize all rows to same column count
    max_cols = max(len(r) for r in rows)
    rows = [r + [""] * (max_cols - len(r)) for r in rows]

    # Compute column widths
    col_widths = [0] * max_cols
    for i, row in enumerate(rows):
        if is_separator_row(row):
            continue
        for j, cell in enumerate(row):
            col_widths[j] = max(col_widths[j], len(cell))

    # Build formatted rows
    result = []
    for i, row in enumerate(rows):
        if is_separator_row(row):
            # Rebuild separator with correct widths
            sep_cells = ["-" * max(col_widths[j], 3) for j in range(max_cols)]
            result.append("| " + " | ".join(sep_cells) + " |")
        else:
            cells = [row[j].ljust(col_widths[j]) for j in range(max_cols)]
            result.append("| " + " | ".join(cells) + " |")
    return result


def beautify_tables(content: str) -> tuple[str, int]:
    """Find all markdown tables in content and reformat them. Returns (new_content, count_changed)."""
    lines = content.splitlines()
    result = []
    i = 0
    tables_fixed = 0

    while i < len(lines):
        line = lines[i]
        # Detect start of a markdown table
        stripped = line.strip()
        if stripped.startswith("|") and "|" in stripped[1:]:
            # Collect all consecutive table lines
            table_lines = []
            j = i
            while j < len(lines) and lines[j].strip().startswith("|"):
                table_lines.append(lines[j])
                j += 1

            # Only process if it has a separator row
            rows = parse_table_rows(table_lines)
            has_sep = any(is_separator_row(r) for r in rows)
            if has_sep:
                formatted = format_table(table_lines)
                if formatted != table_lines:
                    tables_fixed += 1
                result.extend(formatted)
            else:
                result.extend(table_lines)
            i = j
        else:
            result.append(line)
            i += 1

    return "\n".join(result), tables_fixed


def main():
    dry_run = "--dry-run" in sys.argv

    readmes = list(ROOT.rglob("README.md"))
    processed = 0
    fixed = 0
    skipped = 0

    if dry_run:
        print("[DRY-RUN] No files will be modified\n")

    for readme in sorted(readmes):
        if should_skip(readme):
            skipped += 1
            continue

        try:
            original = readme.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            print(f"  [WARN] Error reading {readme.relative_to(ROOT)}: {e}")
            continue

        new_content, tables_fixed = beautify_tables(original)
        processed += 1

        if tables_fixed > 0:
            rel = readme.relative_to(ROOT)
            if dry_run:
                print(f"  [DRY] Would fix {tables_fixed} table(s): {rel}")
            else:
                # Preserve original line endings
                if "\r\n" in original:
                    new_content = new_content.replace("\n", "\r\n")
                readme.write_text(new_content, encoding="utf-8")
                print(f"  [OK] Fixed {tables_fixed} table(s): {rel}")
            fixed += 1
        else:
            print(f"  [SKIP] Already OK: {readme.relative_to(ROOT)}")

    print(f"\n== Results: {processed} READMEs checked, {fixed} need fixing, {skipped} skipped.")
    if dry_run and fixed > 0:
        print("[TIP] Run without --dry-run to apply fixes.")


if __name__ == "__main__":
    main()
