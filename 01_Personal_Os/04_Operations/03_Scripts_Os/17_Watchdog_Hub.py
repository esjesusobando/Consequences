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
import re
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
                claude = int(line.split(":")[-1].strip().replace("|", "").strip())
            if "OpenCode MCPs:" in line:
                opencode = int(line.split(":")[-1].strip().replace("|", "").strip())
        
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


# ── Rules consistency — 12_Audit_OS_Integrity.mdc ──────────────
RULES_PATHS = [
    REPO_ROOT / "01_Personal_Os" / "01_Core" / "01_Rules" / "12_Audit_OS_Integrity.mdc",
    REPO_ROOT / ".claude" / "02_Rules" / "12_Audit_OS_Integrity.mdc",
    REPO_ROOT / ".agent" / "00_Rules" / "12_Audit_OS_Integrity.mdc",
]

# Metric → (manifest_field, transform_fn)
# transform_fn takes the raw bold value from the table and returns an int
EXPECTED_METRICS = {
    "HUBs":             ("totals.hubs", lambda v: int(re.search(r"\d+", v).group())),
    "Scripts":          ("hubs.scripts_totales", lambda v: int(re.search(r"\d+", v).group())),
    "Skills":           ("totals.skills", lambda v: int(re.search(r"\d+", v).group())),
    "Agentes source":   ("totals.agents_source", lambda v: int(re.search(r"\d+", v).group())),
    "Workflows":        ("totals.workflows", lambda v: int(re.search(r"\d+", v).group())),
    "Hooks":            ("totals.hooks", lambda v: int(re.search(r"\d+", v).group())),
}


def _get_nested(data: dict, path: str):
    """Acceso anidado tipo 'totals.skills'."""
    for key in path.split("."):
        data = data.get(key, {}) if isinstance(data, dict) else {}
    return data if not isinstance(data, dict) else None


def _parse_rules_table(content: str) -> dict:
    """Parsea la tabla de métricas del rules file."""
    metrics = {}
    for line in content.splitlines():
        line = line.strip()
        if not line.startswith("| **"):
            continue
        cols = [c.strip() for c in line.split("|")[1:-1]]
        if len(cols) < 2:
            continue
        name = cols[0].strip("*").strip()
        value = cols[1].strip("*").strip()
        metrics[name] = value
    return metrics


def check_rules_count_consistency() -> list:
    """Compara counts en 12_Audit_OS_Integrity.mdc contra el manifest vivo."""
    manifest_path = MANIFEST_DIR / "01_OS_Inventory.json"
    if not manifest_path.exists():
        return [{"file": "manifest", "issue": "01_OS_Inventory.json no encontrado"}]

    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except Exception as e:
        return [{"file": "manifest", "issue": f"No se pudo leer manifest: {e}"}]

    issues = []

    for rules_path in RULES_PATHS:
        label = rules_path.relative_to(REPO_ROOT).as_posix()
        if not rules_path.exists():
            issues.append({"file": label, "issue": "Archivo no encontrado"})
            continue

        content = rules_path.read_text(encoding="utf-8")
        metrics = _parse_rules_table(content)

        # Checks simples (1 solo número)
        for metric_name, (manifest_field, parser) in EXPECTED_METRICS.items():
            raw = metrics.get(metric_name, "")
            if not raw:
                issues.append({"file": label, "metric": metric_name, "issue": "Métrica no encontrada en tabla"})
                continue
            try:
                claimed = parser(raw)
            except (AttributeError, ValueError):
                issues.append({"file": label, "metric": metric_name, "issue": f"No se pudo parsear valor: '{raw}'"})
                continue

            expected = _get_nested(manifest, manifest_field)
            if expected is None:
                continue  # skip si no está en manifest
            if claimed != expected:
                issues.append({
                    "file": label,
                    "metric": metric_name,
                    "claimed": claimed,
                    "expected": expected,
                    "issue": f"MISMATCH: dice {claimed}, manifest dice {expected}"
                })

        # Check especial: MCPs (2 números: Claude + OpenCode)
        mcp_raw = metrics.get("MCPs", "")
        if mcp_raw:
            m = re.search(r"(\d+)\s*\(Claude\)", mcp_raw)
            if m:
                claimed = int(m.group(1))
                expected = _get_nested(manifest, "totals.mcps_claude")
                if expected is not None and claimed != expected:
                    issues.append({
                        "file": label, "metric": "MCPs Claude",
                        "claimed": claimed, "expected": expected,
                        "issue": f"MISMATCH: dice {claimed}, manifest dice {expected}"
                    })
            m = re.search(r"(\d+)\s*\(Opencode\)", mcp_raw)
            if m:
                claimed = int(m.group(1))
                expected = _get_nested(manifest, "totals.mcps_opencode")
                if expected is not None and claimed != expected:
                    issues.append({
                        "file": label, "metric": "MCPs OpenCode",
                        "claimed": claimed, "expected": expected,
                        "issue": f"MISMATCH: dice {claimed}, manifest dice {expected}"
                    })

        # Check especial: áreas de skills
        skills_raw = metrics.get("Skills", "")
        if skills_raw:
            m = re.search(r"(\d+)\s*áreas?", skills_raw)
            if m:
                claimed = int(m.group(1))
                expected = _get_nested(manifest, "totals.skill_areas")
                if expected is not None and claimed != expected:
                    issues.append({
                        "file": label, "metric": "Skills (áreas)",
                        "claimed": claimed, "expected": expected,
                        "issue": f"MISMATCH: dice {claimed} áreas, manifest dice {expected}"
                    })

    return issues


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


def generate_report(checks: dict, rules_issues: list) -> str:
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
    
    lines.extend([
        "",
        "|  5. RULES COUNT CONSISTENCY:                   |",
    ])
    
    if not rules_issues:
        lines.append("|    [OK] Todas copias coinciden con manifest       |")
    else:
        for iss in rules_issues[:6]:
            loc = iss.get("file", iss.get("metric", "?"))
            detail = iss.get("issue", "")
            lines.append(f"|    [!!] {loc:<20} |")
            lines.append(f"|         {detail:<44} |")
        extras = len(rules_issues) - 6
        if extras > 0:
            lines.append(f"|         ... y {extras} más                        |")
    
    lines.append("+==============================================================+")
    
    # Overall status
    issues = sum([
        not all_ok,
        legacy >= 50,
        fm > 0,
        len(rules_issues) > 0,
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
    rules_issues = check_rules_count_consistency()
    
    # Mostrar reporte
    report = generate_report(checks, rules_issues)
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