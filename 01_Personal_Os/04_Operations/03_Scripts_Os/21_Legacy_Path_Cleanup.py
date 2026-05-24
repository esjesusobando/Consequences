#!/usr/bin/env python3
"""
17_Legacy_Path_Cleanup.py — Legacy Path Cleanup Scanner
FASE 2.3 del Plan Consequences 3.0

Escanea refs legacy v1.x y ofrece fix cirurgico por area.
NO hace bulk replace -- estrategia manual + script por area.
"""

import os
import re
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────
# RUTAS Y CONFIG
# ─────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.parent.parent.parent
LEGACY_PATTERNS = [
    ("08_Scripts_Os", "01_Personal_Os/04_Operations/03_Scripts_Os"),
    ("01_Core/02_Tools/02_Skills", "01_Personal_Os/01_Core/02_Tools/02_Skills"),
    ("06_Playground", "01_Personal_Os/02_Playground"),
]

EXCLUDE_DIRS = {"05_Archive", "06_Snapshots", "10_Backup", ".git", "node_modules", ".next"}

REPORT_DIR = REPO_ROOT / "03_Resultado" / "04_Reportes"


def scan_file(path: Path, patterns: list) -> list:
    """Escanea un archivo buscando refs legacy."""
    findings = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        for old, new in patterns:
            if old in content:
                # Buscar contexto
                matches = re.finditer(re.escape(old), content)
                for m in matches:
                    start = max(0, m.start() - 40)
                    end = min(len(content), m.end() + 40)
                    context = content[start:end].replace("\n", " ")
                    findings.append({
                        "old": old,
                        "new": new,
                        "context": context,
                        "line_hint": content[:m.start()].count("\n") + 1
                    })
    except Exception:
        pass
    return findings


def scan_directory(root: Path, extensions: list = [".md", ".yaml", ".json", ".mdc"]) -> dict:
    """Escanea directorio completo."""
    results = {}
    for dirpath, dirnames, filenames in os.walk(root):
        # Excluir directorios
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]

        for filename in filenames:
            if any(filename.endswith(ext) for ext in extensions):
                filepath = Path(dirpath) / filename
                findings = scan_file(filepath, LEGACY_PATTERNS)
                if findings:
                    rel_path = filepath.relative_to(REPO_ROOT)
                    results[str(rel_path)] = findings
    return results


def generate_report(results: dict) -> str:
    """Genera reporte ASCII."""
    total_files = len(results)
    total_refs = sum(len(f) for f in results.values())

    lines = [
        "+==============================================================+",
        "|       LEGACY PATH CLEANUP -- SCAN REPORT                |",
        "+==============================================================+",
        f"|  Archivos con refs legacy: {total_files:>3}                        |",
        f"|  Total refs legacy:         {total_refs:>3}                        |",
        "+==============================================================+",
    ]

    # Agrupar por tipo de ref
    ref_types = {}
    for path, findings in results.items():
        for f in findings:
            old = f["old"]
            if old not in ref_types:
                ref_types[old] = {"count": 0, "files": []}
            ref_types[old]["count"] += 1
            ref_types[old]["files"].append(path)

    lines.append("|  Por tipo de ref legacy:                                |")
    for old, data in sorted(ref_types.items()):
        lines.append(f"|    {old:<20} -> {data['count']:>3} refs en {len(data['files']):>3} files  |")

    lines.append("+==============================================================+")
    lines.append("|  Archivos afectados (primeros 20):                       |")
    for i, (path, _) in enumerate(sorted(results.items())[:20]):
        lines.append(f"|    {i+1}. {path:<46} |")

    if total_files > 20:
        lines.append(f"|    ... y {total_files - 20} mas archivos                      |")

    lines.append("+==============================================================+")
    lines.append("|  ESTRATEGIA:                                             |")
    lines.append("|    1. Archivos criticos -> fix MANUAL                     |")
    lines.append("|    2. Skills/Agentes -> script --dry-run primero          |")
    lines.append("|    3. Archive/Backup -> MARCAR con <!-- LEGACY-OK -->    |")
    lines.append("+==============================================================+")
    return "\n".join(lines)


def main():
    print(">> Legacy Path Cleanup -- FASE 2.3\n")

    # Si hay argumento, escanear solo esa area
    if len(sys.argv) > 1:
        target = sys.argv[1]
        if target == "--dry-run":
            target = "01_Personal_Os"
        scan_root = REPO_ROOT / target if target else REPO_ROOT
    else:
        scan_root = REPO_ROOT / "01_Personal_Os"

    print(f">> Escaneando: {scan_root}")
    results = scan_directory(scan_root)
    print(generate_report(results))

    # Guardar reporte
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    report_path = REPORT_DIR / "legacy_path_cleanup_report.txt"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(generate_report(results))
    print(f"\n>> Reporte guardado: {report_path}")


if __name__ == "__main__":
    main()
