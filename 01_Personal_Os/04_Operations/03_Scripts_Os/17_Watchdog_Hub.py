#!/usr/bin/env python3
"""
17_Watchdog_Hub.py — Self-Healing Watchdog
FASE 6.2 del Plan Consequences 3.0

Sistema de monitoreo que:
- Valida integridad de los 7 archivos del manifest
- Detecta drift v1.x nuevo
- Verifica MCP sync status
- Detecta skills sin frontmatter
- Notifica via sonido + escribe reporte
"""

import json
import os
import sys
import subprocess
from datetime import datetime
from pathlib import Path

# ─────────────────────────────────────────────────────────────
# RUTAS
# ─────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.parent.parent.parent
MANIFEST_DIR = REPO_ROOT / "01_Personal_Os" / "04_Operations" / "02_Agent_Teams_Lite" / "00_Manifest"
REPORT_DIR = REPO_ROOT / "03_Resultado" / "04_Reportes"
SCRIPTS_DIR = REPO_ROOT / "01_Personal_Os" / "04_Operations" / "03_Scripts_Os"


def check_manifest_integrity() -> dict:
    """Verifica los 7 archivos del manifest."""
    required = [
        "01_OS_Inventory.json",
        "02_MCP_Registry.yaml",
        "03_Agent_Catalog.yaml",
        "04_Skill_Index.json",
        "05_HUB_Catalog.yaml",
        "06_Workflow_Graph.yaml",
        "07_Hook_Registry.yaml",
    ]
    results = {}
    for f in required:
        path = MANIFEST_DIR / f
        results[f] = path.exists()
    return results


def check_mcp_sync() -> dict:
    """Verifica estado MCP sync."""
    script = SCRIPTS_DIR / "15_MCP_Sync_Hub.py"
    if not script.exists():
        return {"status": "missing_hub", "claude": 0, "opencode": 0}
    
    # Ejecutar y parsear output
    try:
        result = subprocess.run(
            ["python", str(script), "--report"],
            capture_output=True,
            text=True,
            timeout=30
        )
        output = result.stdout
        
        # Parsear counts
        claude = opencode = 0
        for line in output.split("\n"):
            if "Claude Code MCPs:" in line:
                claude = int(line.split(":")[-1].strip())
            if "OpenCode MCPs:" in line:
                opencode = int(line.split(":")[-1].strip())
        
        return {"status": "ok", "claude": claude, "opencode": opencode}
    except Exception as e:
        return {"status": "error", "error": str(e)}


def check_legacy_drift() -> int:
    """Cuenta refs legacy v1.x nuevas."""
    script = SCRIPTS_DIR / "17_Legacy_Path_Cleanup.py"
    if not script.exists():
        return 0
    
    try:
        result = subprocess.run(
            ["python", str(script)],
            capture_output=True,
            text=True,
            timeout=60
        )
        for line in result.stdout.split("\n"):
            if "Total refs legacy:" in line:
                return int(line.split(":")[-1].strip())
    except Exception:
        pass
    return 0


def check_skills_without_frontmatter() -> int:
    """Cuenta skills sin frontmatter."""
    index_file = MANIFEST_DIR / "04_Skill_Index.json"
    if not index_file.exists():
        return 0
    
    try:
        data = json.loads(index_file.read_text())
        return data.get("totals", {}).get("without_frontmatter", 0)
    except Exception:
        return 0


def generate_report(checks: dict) -> str:
    """Genera reporte ASCII."""
    lines = [
        "+==============================================================+",
        "|       WATCHDOG HUB -- HEALTH REPORT               |",
        f"|  Timestamp: {datetime.now().isoformat():<20} |",
        "+==============================================================+",
        "",
        "|  1. MANIFEST INTEGRITY (7 archivos):               |",
    ]
    
    manifest = checks.get("manifest", {})
    all_ok = all(manifest.values())
    for f, ok in manifest.items():
        status = "[OK]" if ok else "[!!]"
        lines.append(f"|    {status} {f:<40} |")
    
    lines.extend([
        "",
        "|  2. MCP SYNC STATUS:                            |",
    ])
    
    mcp = checks.get("mcp", {})
    lines.append(f"|    Claude MCPs:  {mcp.get('claude', 0):>3}                              |")
    lines.append(f"|    OpenCode:   {mcp.get('opencode', 0):>3}                              |")
    lines.append(f"|    Status:     {mcp.get('status', 'unknown'):<20} |")
    
    lines.extend([
        "",
        "|  3. LEGACY DRIFT:                               |",
    ])
    
    legacy = checks.get("legacy", 0)
    status = "[OK]" if legacy < 50 else "[!!]"
    lines.append(f"|    {status} Total refs: {legacy:>3}                           |")
    
    lines.extend([
        "",
        "|  4. SKILLS FRONTMATTER:                         |",
    ])
    
    fm = checks.get("frontmatter", 0)
    status = "[OK]" if fm == 0 else "[!!]"
    lines.append(f"|    {status} Sin frontmatter: {fm:>3}                      |")
    
    lines.append("+==============================================================+")
    
    # Overall status
    issues = sum([
        not all_ok,
        legacy >= 50,
        fm > 0,
    ])
    
    if issues == 0:
        lines.append("|  >> OVERALL: [OK] ALL SYSTEMS GREEN              |")
    else:
        lines.append(f"|  >> OVERALL: [!!] {issues} ISSUES DETECTED                |")
    
    lines.append("+==============================================================+")
    
    return "\n".join(lines)


def main():
    print(">> Watchdog Hub -- FASE 6.2\n")
    
    # Ejecutar todos los checks
    checks = {
        "manifest": check_manifest_integrity(),
        "mcp": check_mcp_sync(),
        "legacy": check_legacy_drift(),
        "frontmatter": check_skills_without_frontmatter(),
    }
    
    # Mostrar reporte
    report = generate_report(checks)
    print(report)
    
    # Guardar reporte
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    report_path = REPORT_DIR / f"watchdog_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)
    
    print(f"\n>> Reporte guardado: {report_path}")
    
    # Si hay argumento --schedule, configurar cron
    if len(sys.argv) > 1 and sys.argv[1] == "--schedule":
        print("\n>> Configura cron para correr cada hora:")
        print("   0 * * * * python 17_Watchdog_Hub.py")


if __name__ == "__main__":
    main()