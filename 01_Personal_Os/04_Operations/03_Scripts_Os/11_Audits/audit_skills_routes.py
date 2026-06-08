#!/usr/bin/env python3
# === PROTOCOLO DE RUTA v2.0 Consequences ===
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()
SCRIPTS_OS = next(
    (p for p in [SCRIPT_DIR, *SCRIPT_DIR.parents] if p.name == "03_Scripts_Os"),
    SCRIPT_DIR.parent,
)
OPERATIONS = SCRIPTS_OS.parent  # 04_Operations
PERSONAL_OS = OPERATIONS.parent  # 01_Personal_Os
ROOT = next(
    (p for p in [SCRIPT_DIR, *SCRIPT_DIR.parents] if (p / "00_Winter_is_Coming").exists() and (p / "01_Personal_Os").exists()),
    PERSONAL_OS.parent,
)

if str(SCRIPTS_OS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_OS))
from config_paths import *


"""
AUDITORÍA DE RUTAS DE SKILLS - DRY RUN
=====================================
Refactorizar referencias legacy hacia la ruta canónica v4:
01_Personal_Os/01_Core/02_Tools/02_Skills/

Objetivo: identificar TODAS las referencias que quedarían stale después de la
migración de estructura, sin tocar archivos por defecto.

Usage: python audit_skills_routes.py
"""

import os
import re
import subprocess
from collections import defaultdict

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ROOT ya viene de config_paths como ROOT_DIR
ROOT = ROOT_DIR

OLD_PATHS = (
    ".agent/02_Skills/",
    "01_Core/02_Tools/02_Skills/",
    "01_Personal_Os/01_Core/02_Tools/02_Skills/",
)
NEW_PATH = "01_Personal_Os/01_Core/02_Tools/02_Skills/"

PATHSPECS = [
    "*.md",
    "*.py",
    "*.yaml",
    "*.yml",
    "*.json",
    "*.txt",
    "*.sh",
    "*.bash",
    "*.zsh",
    "*.ps1",
    ":!**/node_modules/**",
    ":!**/.next/**",
    ":!**/dist/**",
    ":!**/build/**",
    ":!**/out/**",
    ":!**/package-lock.json",
    ":!**/pnpm-lock.yaml",
]


def find_references():
    """Encuentra referencias a rutas legacy de skills."""
    refs = defaultdict(list)

    for old_path in OLD_PATHS:
        command = ["git", "-C", str(ROOT), "grep", "-n", "-I", "-F", "--", old_path, "--", *PATHSPECS]
        result = subprocess.run(
            command,
            text=True,
            encoding="utf-8",
            errors="replace",
            capture_output=True,
            check=False,
        )
        if result.returncode not in {0, 1}:
            print(f"[WARN] git grep failed for {old_path!r}: {result.stderr.strip()}")
            continue
        for raw_line in result.stdout.splitlines():
            parts = raw_line.split(":", 2)
            if len(parts) != 3:
                continue
            file, line_number, line = parts
            refs[file].append((int(line_number), old_path, line.strip()[:100]))

    return refs


def analyze_impact():
    """Analiza el impacto de la migración"""
    refs = find_references()

    print("=" * 80)
    print("AUDITORÍA DE RUTAS DE SKILLS - DRY RUN")
    print("=" * 80)
    print("\nRutas legacy:")
    for old_path in OLD_PATHS:
        print(f"  - {old_path}")
    print(f"Ruta canónica: {NEW_PATH}")
    print(f"\nTotal archivos con referencias: {len(refs)}")

    by_category = defaultdict(int)
    by_legacy_path = defaultdict(int)
    for file in refs:
        ext = Path(file).suffix
        by_category[ext] += 1
        for _, old_path, _ in refs[file]:
            by_legacy_path[old_path] += 1

    print("\n--- Referencias por tipo de archivo ---")
    for ext, count in sorted(by_category.items(), key=lambda x: -x[1]):
        print(f"  {ext}: {count}")

    print("\n--- Referencias por ruta legacy ---")
    for old_path, count in sorted(by_legacy_path.items(), key=lambda x: -x[1]):
        print(f"  {old_path}: {count}")

    print("\n--- Archivos afectados (primeros 30) ---")
    for i, (file, lines) in enumerate(list(refs.items())[:30]):
        print(f"\n{i + 1}. {file}")
        for line_num, old_path, line in lines[:2]:
            print(f"   L{line_num} [{old_path}]: {line[:70]}...")

    if len(refs) > 30:
        print(f"\n... y {len(refs) - 30} archivos más")

    print("\n" + "=" * 80)
    print("RESUMEN DE IMPACTO")
    print("=" * 80)
    print(f"Archivos a modificar: {len(refs)}")
    print(f"Reemplazos totales a revisar: {sum(len(v) for v in refs.values())}")
    print("\nPrecaución: Muchos archivos son documentación histórica.")
    print("Actualizar solo referencias operativas; preservar contexto legacy en archivos de archivo/historia.")

    return refs


def generate_script(refs):
    """Genera script de migración (sed para Unix/Mac, ps1 para Windows)"""

    script_path = ROOT / "03_Resultado" / "04_Reportes" / "migrate_skills_routes.ps1"

    old_paths = "\n".join(f'    "{old_path}",' for old_path in OLD_PATHS)
    script = f"""# Script de Migración de Rutas de Skills
# Generated: Auto-refactor legacy skill paths -> {NEW_PATH}
# DRY RUN - NO modifica archivos

$OLD_PATHS = @(
{old_paths}
)
$NEW_PATH = "01_Personal_Os/01_Core/02_Tools/02_Skills/"
$PROTECTED_PATTERNS = @(
    "00_Winter_is_Coming/ROUTES.md",
    "02_Playground/01_OS_Runtime_Test.py",
    "01_Personal_Os/04_Operations/03_Scripts_Os/12_Audits/",
    "01_Personal_Os/04_Operations/00_Context_LLM/",
    "03_Resultado/04_Reportes/"
)

$files = @(
"""

    for file in sorted(refs.keys()):
        script += f'    "{file}",\n'

    script += """)

Write-Host "DRY RUN - Archivos que serían modificados:" -ForegroundColor Yellow
$files | ForEach-Object {{ Write-Host "  $_" }}

$count = $files.Count
Write-Host "`nTotal: $count archivos" -ForegroundColor Cyan

Write-Host "`nPara ejecutar la migración, cambia '$false' a '$true' en la línea siguiente:" -ForegroundColor Yellow
$migrate = $false

if ($migrate) {{
    foreach ($file in $files) {{
        $normalized = $file -replace "\\", "/"
        $isProtected = $false
        foreach ($pattern in $PROTECTED_PATTERNS) {{
            if ($normalized.StartsWith($pattern) -or $normalized -eq $pattern) {{
                $isProtected = $true
                break
            }}
        }}
        if ($isProtected) {{
            Write-Host "Skipped protected context: $file" -ForegroundColor DarkYellow
            continue
        }}

        $fullPath = Join-Path $PSScriptRoot "..\\..\\$file"
        if (Test-Path $fullPath) {{
            $content = Get-Content $fullPath -Raw
            foreach ($old in $OLD_PATHS) {
                $content = $content.Replace($old, $NEW_PATH)
            }
            Set-Content $fullPath -Value $content -NoNewline
            Write-Host "Updated: $file" -ForegroundColor Green
        }}
    }}
    Write-Host "`nMigración completada!" -ForegroundColor Green
}} else {{
    Write-Host "`nDRY RUN completado. No se modificó ningún archivo." -ForegroundColor Yellow
}}
"""

    script_path.write_text(script, encoding="utf-8")
    print(f"\nScript generado: {script_path}")
    return script_path


if __name__ == "__main__":
    refs = analyze_impact()
    script_path = generate_script(refs)
    print("\n✅ Auditoría completada. Ejecutar script para ver preview.")
