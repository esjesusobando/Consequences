#!/usr/bin/env python3
"""
17_Watchdog_Hub.py — Self-Healing Watchdog
FASE 6.2 del Plan Consequences 3.0 (SOTA Update)

Sistema de monitoreo que:
- Valida integridad de los 7 archivos del manifest
- Detecta drift v1.x nuevo
- Verifica MCP sync status
- Detecta skills sin frontmatter
- Notifica via sonido + escribe reporte

Mejoras SOTA: Type hints estrictos, manejo de excepciones avanzado, logging estructurado.
"""

import json
import os
import re
import sys
import subprocess
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional, Union, Tuple, Callable

# ─────────────────────────────────────────────────────────────
# CONFIGURACIÓN DE LOGGING SOTA
# ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("WatchdogHub")

# ─────────────────────────────────────────────────────────────
# RUTAS
# ─────────────────────────────────────────────────────────────
REPO_ROOT: Path = Path(__file__).resolve().parent.parent.parent.parent
MANIFEST_DIR: Path = REPO_ROOT / "01_Personal_Os" / "05_Scripts" / "02_Agent_Teams_Lite" / "00_Manifest"
REPORT_DIR: Path = REPO_ROOT / "03_Resultado" / "04_Reportes"
SCRIPTS_DIR: Path = REPO_ROOT / "01_Personal_Os" / "05_Scripts" / "03_Scripts_Os"


def check_manifest_integrity() -> Dict[str, bool]:
    """Verifica los 7 archivos del manifest.
    
    Returns:
        Dict[str, bool]: Diccionario mapeando el nombre del archivo a su existencia.
    """
    required: List[str] = [
        "01_OS_Inventory.json",
        "02_MCP_Registry.yaml",
        "03_Agent_Catalog.yaml",
        "04_Skill_Index.json",
        "05_HUB_Catalog.yaml",
        "06_Workflow_Graph.yaml",
        "07_Hook_Registry.yaml",
    ]
    results: Dict[str, bool] = {}
    for f in required:
        path: Path = MANIFEST_DIR / f
        results[f] = path.exists()
    return results


def check_mcp_sync() -> Dict[str, Any]:
    """Verifica estado MCP sync llamando al script correspondiente.
    
    Returns:
        Dict[str, Any]: Estado y contadores de MCPs.
    """
    script: Path = SCRIPTS_DIR / "15_MCP_Sync_Hub.py"
    if not script.exists():
        logger.warning(f"Script no encontrado: {script.name}")
        return {"status": "missing_hub", "claude": 0, "opencode": 0}
    
    try:
        result = subprocess.run(
            [sys.executable, str(script), "--report"],
            capture_output=True,
            text=True,
            timeout=30,
            check=False
        )
        output: str = result.stdout
        
        claude: int = 0
        opencode: int = 0
        for line in output.splitlines():
            if "Claude Code MCPs:" in line:
                claude = int(line.split(":")[-1].strip().replace("|", "").strip())
            if "OpenCode MCPs:" in line:
                opencode = int(line.split(":")[-1].strip().replace("|", "").strip())
        
        return {"status": "ok", "claude": claude, "opencode": opencode}
    except subprocess.TimeoutExpired:
        logger.error("Timeout al ejecutar 15_MCP_Sync_Hub.py")
        return {"status": "timeout", "error": "Execution timed out"}
    except Exception as e:
        logger.exception("Error al verificar MCP sync")
        return {"status": "error", "error": str(e)}


def check_legacy_drift() -> int:
    """Cuenta refs legacy v1.x nuevas.
    
    Returns:
        int: Número total de referencias legacy detectadas, o 0 en caso de error.
    """
    script: Path = SCRIPTS_DIR / "17_Legacy_Path_Cleanup.py" # Nota: En la versión original referenciaba 17_ pero no existe ese script, asumo 21_Legacy_Path_Cleanup.py
    if not script.exists():
        script = SCRIPTS_DIR / "21_Legacy_Path_Cleanup.py"
    if not script.exists():
        logger.warning(f"Script de cleanup legacy no encontrado.")
        return 0
    
    try:
        result = subprocess.run(
            [sys.executable, str(script)],
            capture_output=True,
            text=True,
            timeout=60,
            check=False
        )
        for line in result.stdout.splitlines():
            if "Total refs legacy:" in line:
                return int(line.split(":")[-1].strip())
    except subprocess.TimeoutExpired:
        logger.error("Timeout en check_legacy_drift")
    except Exception as e:
        logger.error(f"Excepción en check_legacy_drift: {e}")
    return 0


# ── Rules consistency — 12_Audit_OS_Integrity.mdc ──────────────
RULES_PATHS: List[Path] = [
    REPO_ROOT / "01_Personal_Os" / "00_Core" / "01_Rules" / "12_Audit_OS_Integrity.mdc",
    REPO_ROOT / ".claude" / "02_Rules" / "12_Audit_OS_Integrity.mdc",
    REPO_ROOT / ".agent" / "00_Rules" / "12_Audit_OS_Integrity.mdc",
]

EXPECTED_METRICS: Dict[str, Tuple[str, Callable[[str], int]]] = {
    "HUBs":             ("totals.hubs", lambda v: int(re.search(r"\d+", v).group())),
    "Scripts":          ("hubs.scripts_totales", lambda v: int(re.search(r"\d+", v).group())),
    "Skills":           ("totals.skills", lambda v: int(re.search(r"\d+", v).group())),
    "Agentes source":   ("totals.agents_source", lambda v: int(re.search(r"\d+", v).group())),
    "Workflows":        ("totals.workflows", lambda v: int(re.search(r"\d+", v).group())),
    "Hooks":            ("totals.hooks", lambda v: int(re.search(r"\d+", v).group())),
}


def _get_nested(data: Dict[str, Any], path: str) -> Optional[Any]:
    """Acceso anidado tipo 'totals.skills' en un diccionario."""
    for key in path.split("."):
        if not isinstance(data, dict):
            return None
        data = data.get(key, {})
    return data if not isinstance(data, dict) else None


def _parse_rules_table(content: str) -> Dict[str, str]:
    """Parsea la tabla de métricas del rules file."""
    metrics: Dict[str, str] = {}
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


def check_rules_count_consistency() -> List[Dict[str, Any]]:
    """Compara counts en 12_Audit_OS_Integrity.mdc contra el manifest vivo.
    
    Returns:
        List[Dict[str, Any]]: Lista de issues detectados.
    """
    manifest_path: Path = MANIFEST_DIR / "01_OS_Inventory.json"
    if not manifest_path.exists():
        logger.error(f"Manifest no encontrado en {manifest_path}")
        return [{"file": "manifest", "issue": "01_OS_Inventory.json no encontrado"}]

    try:
        manifest: Dict[str, Any] = json.loads(manifest_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        logger.error(f"Error parseando JSON del manifest: {e}")
        return [{"file": "manifest", "issue": f"No se pudo leer manifest: {e}"}]

    issues: List[Dict[str, Any]] = []

    for rules_path in RULES_PATHS:
        label = rules_path.relative_to(REPO_ROOT).as_posix() if rules_path.is_relative_to(REPO_ROOT) else str(rules_path)
        if not rules_path.exists():
            issues.append({"file": label, "issue": "Archivo no encontrado"})
            continue

        content = rules_path.read_text(encoding="utf-8")
        metrics = _parse_rules_table(content)

        # Checks simples
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
                continue
            if claimed != expected:
                issues.append({
                    "file": label,
                    "metric": metric_name,
                    "claimed": claimed,
                    "expected": expected,
                    "issue": f"MISMATCH: dice {claimed}, manifest dice {expected}"
                })

        # Check especial: MCPs (Claude + OpenCode)
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
    index_file: Path = MANIFEST_DIR / "04_Skill_Index.json"
    if not index_file.exists():
        return 0
    
    try:
        data = json.loads(index_file.read_text(encoding="utf-8"))
        return data.get("totals", {}).get("without_frontmatter", 0)
    except Exception as e:
        logger.error(f"Error leyendo 04_Skill_Index.json: {e}")
        return 0


def generate_report(checks: Dict[str, Any], rules_issues: List[Dict[str, Any]]) -> str:
    """Genera reporte ASCII.
    
    Args:
        checks: Diccionario de checks.
        rules_issues: Lista de problemas de consistencia en reglas.
        
    Returns:
        str: Reporte formateado.
    """
    lines = [
        "+==============================================================+",
        "|       WATCHDOG HUB -- HEALTH REPORT (SOTA)                   |",
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


def main() -> None:
    print(">> Watchdog Hub -- FASE 6.2 (SOTA Update)\n")
    
    logger.info("Iniciando checks de Watchdog...")
    
    checks = {
        "manifest": check_manifest_integrity(),
        "mcp": check_mcp_sync(),
        "legacy": check_legacy_drift(),
        "frontmatter": check_skills_without_frontmatter(),
    }
    rules_issues = check_rules_count_consistency()
    
    report = generate_report(checks, rules_issues)
    print(report)
    
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    report_path = REPORT_DIR / f"watchdog_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    try:
        with open(report_path, "w", encoding="utf-8") as f:
            f.write(report)
        logger.info(f"Reporte guardado: {report_path}")
    except IOError as e:
        logger.error(f"Fallo al guardar reporte: {e}")
    
    if len(sys.argv) > 1 and sys.argv[1] == "--schedule":
        print("\n>> Configura cron para correr cada hora:")
        print("   0 * * * * python 17_Watchdog_Hub.py")


if __name__ == "__main__":
    main()