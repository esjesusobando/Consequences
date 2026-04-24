#!/usr/bin/env python3
"""
15_SOTA_Integrity_Check.py — PersonalOS v2.0 Consequences

Script de integridad que valida las dimensiones del sistema:
- Submódulos git
- Skills (9 áreas funcionales con SKILL.md en subcarpetas)
- MCPs (30+ configurados)
- Agents
- Hooks
- HUBs (12+)
- Rules (10 consolidadas)
- Metodologías integradas

Usage:
    python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/15_SOTA_Integrity_Check.py
    python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/15_SOTA_Integrity_Check.py --verbose
"""

import os
import sys
import json
from pathlib import Path

# Fix encoding issues
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Config - v2.0 Consequences: script está en
# 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/
# → scripts/ → 13_Auditors_Os/ → 03_Scripts_Os/ → 04_Operations/ → 01_Personal_Os/ → ROOT
SCRIPT_DIR = Path(__file__).parent.resolve()
ROOT = SCRIPT_DIR.parent.parent.parent.parent.parent
VERBOSE = "--verbose" in sys.argv

# Colores (evitar encoding issues en Windows)
GREEN = ""
RED = ""
YELLOW = ""
BLUE = ""
RESET = ""

def log(msg, level="INFO"):
    # Simple output sin special chars
    print(f"[{level}] {msg}")

def check_submodules():
    """Verifica submódulos git."""
    log("=" * 50)
    log("CHECKING: Git Submodules")
    log("=" * 50)

    gitmodules_path = ROOT / ".gitmodules"
    if not gitmodules_path.exists():
        log("No .gitmodules found (may be normal)", "WARN")
        return True  # Not required

    # Verificar que las rutas existen
    issues = []
    with open(gitmodules_path) as f:
        content = f.read()
        for line in content.split("\n"):
            if line.startswith("path = "):
                path = line.replace("path = ", "").strip()
                full_path = ROOT / path
                if not full_path.exists():
                    issues.append(f"Missing: {path}")
                    log(f"Missing submodule: {path}", "ERROR")
                else:
                    log(f"Found: {path}", "OK")

    return len(issues) == 0

def check_skills():
    """Verifica skills en v2.0: 9 áreas funcionales + extras con SKILL.md."""
    print("-" * 50)
    print("CHECKING: Skills (v2.0 — 9 áreas funcionales)")
    print("-" * 50)

    skills_path = ROOT / "01_Personal_Os" / "01_Core" / "02_Tools" / "02_Skills"
    if not skills_path.exists():
        print("Skills directory not found")
        return False

    categories = []
    categories_with_skills = []

    for item in skills_path.iterdir():
        if item.is_dir() and not item.name.startswith("."):
            categories.append(item.name)
            skill_files = list(item.rglob("SKILL.md"))
            if skill_files:
                categories_with_skills.append(item.name)
                if VERBOSE:
                    for sf in skill_files:
                        print(f"[OK] {item.name} -> {sf.parent.name}")
            else:
                print(f"[X] {item.name} (no SKILL.md found)")

    print(f"Total: {len(categories_with_skills)}/{len(categories)} áreas con al menos 1 SKILL.md")

    # v2.0 tiene 12 áreas (9 funcionales + extras); requerir que todas tengan SKILL.md
    return len(categories_with_skills) == len(categories)

def check_mcps():
    """Verifica MCPs documentados en .mcp.json."""
    log("=" * 50)
    log("CHECKING: MCPs (.mcp.json)")
    log("=" * 50)

    mcp_path = ROOT / ".mcp.json"
    if not mcp_path.exists():
        log(".mcp.json not found", "ERROR")
        return False

    try:
        with open(mcp_path) as f:
            data = json.load(f)
        mcp_count = len(data.get("mcpServers", {}))
        log(f"MCPs configured: {mcp_count}", "OK")
        return mcp_count >= 25  # Expect at least 25
    except json.JSONDecodeError as e:
        log(f"JSON error in .mcp.json: {e}", "ERROR")
        return False

def check_agents():
    """Verifica agentes."""
    log("=" * 50)
    log("CHECKING: Agents")
    log("=" * 50)

    # Verificar .agent/01_Agents/
    agents_path = ROOT / ".agent" / "01_Agents"
    count_total = 0
    if agents_path.exists():
        count = sum(1 for _ in agents_path.rglob("*.md") if _.is_file())
        log(f"Agent workflows: {count}", "OK")
        count_total += count

    # Verificar 01_Personal_Os/01_Core/02_Tools/01_Agents/
    core_agents = ROOT / "01_Personal_Os" / "01_Core" / "02_Tools" / "01_Agents"
    if core_agents.exists():
        count = sum(1 for _ in core_agents.rglob("*.md") if _.is_file())
        log(f"Core Agents: {count}", "OK")
        count_total += count

    return count_total > 0

def check_hooks():
    """Verifica hooks."""
    log("=" * 50)
    log("CHECKING: Hooks")
    log("=" * 50)

    hooks_path = ROOT / "01_Personal_Os" / "01_Core" / "02_Tools" / "05_Hooks"
    if not hooks_path.exists():
        log("Hooks directory not found", "ERROR")
        return False

    # Listar scripts
    for script_dir in hooks_path.iterdir():
        if script_dir.is_dir():
            scripts = list(script_dir.rglob("*.py")) + list(script_dir.rglob("*.ps1"))
            log(f"{script_dir.name}: {len(scripts)} scripts", "OK")

    return True

def check_hubs():
    """Verifica HUBs (11 activos)."""
    log("=" * 50)
    log("CHECKING: HUBs (11)")
    log("=" * 50)

    hubs_path = ROOT / "01_Personal_Os" / "04_Operations" / "03_Scripts_Os"
    if not hubs_path.exists():
        log("08_Scripts_Os not found", "ERROR")
        return False

    # Contar HUBs por prefijo numérico
    hub_files = []
    for f in hubs_path.glob("*.py"):
        if f.stem[0].isdigit():
            hub_files.append(f.stem)

    log(f"HUBs found: {len(hub_files)}", "OK")
    if VERBOSE:
        for h in sorted(hub_files):
            print(f"  - {h}")

    return len(hub_files) >= 10

def check_rules():
    """Verifica reglas (10 consolidadas en v1.1 Alpha)."""
    log("=" * 50)
    log("CHECKING: Rules (10 consolidadas)")
    log("=" * 50)

    rules_path = ROOT / "01_Personal_Os" / "01_Core" / "01_Rules"
    if not rules_path.exists():
        log("Rules directory not found", "ERROR")
        return False

    # Contar archivos .mdc
    mdc_files = list(rules_path.glob("*.mdc"))
    log(f"Rules (.mdc): {len(mdc_files)}", "OK")

    # En v1.1 Alpha, deben haber ~10 rules (no 25)
    if len(mdc_files) < 8:
        log(f"Warning: Expected ~10 rules, found {len(mdc_files)}", "WARN")

    # Verificar RULES_INDEX.md
    index = rules_path / "RULES_INDEX.md"
    if index.exists():
        log("RULES_INDEX.md exists", "OK")
    else:
        log("RULES_INDEX.md not found", "WARN")

    return len(mdc_files) >= 8

def check_methodologies():
    """Verifica metodologías integradas en v2.0 Consequences."""
    log("=" * 50)
    log("CHECKING: Metodologias Integradas (v2.0)")
    log("=" * 50)

    _tools = ROOT / "01_Personal_Os" / "01_Core" / "02_Tools"
    _scripts = ROOT / "01_Personal_Os" / "04_Operations" / "03_Scripts_Os"
    checks = [
        ("Super Campeones / Agent Teams", ROOT / "00_Winter_is_Coming" / "AGENTS.md"),
        ("Compound Engineering", _tools / "02_Skills" / "00_Compound_Engineering" / "SKILL.md"),
        ("GGA Pre-Commit", ROOT / ".agent" / "05_GGA"),
        ("Design SOTA", _tools / "02_Skills" / "02_Diseno_Ui_Ux"),
        ("Automatizacion", _tools / "02_Skills" / "04_Automatizacion"),
        ("Auditor Hub", _scripts / "01_Auditor_Hub.py"),
        ("Auto-Improvement Engine", ROOT / "01_Personal_Os" / "04_Operations" / "01_Auto_Improvement" / "01_Engine"),
    ]

    for name, path in checks:
        if path.exists():
            log(f"[OK] {name}", "OK")
        else:
            log(f"[X] {name} not found at {path}", "WARN")

    return True  # Warn only — no falla el sistema

def check_core_structure():
    """Verifica estructura core de v2.0 Consequences."""
    log("=" * 50)
    log("CHECKING: Core Structure (v2.0 Consequences)")
    log("=" * 50)

    _os = ROOT / "01_Personal_Os"
    required_paths = [
        ("01_Personal_Os/01_Core/01_Rules",   _os / "01_Core" / "01_Rules"),
        ("01_Personal_Os/01_Core/02_Tools",   _os / "01_Core" / "02_Tools"),
        ("01_Personal_Os/04_Operations",       _os / "04_Operations"),
        ("03_Scripts_Os",                      _os / "04_Operations" / "03_Scripts_Os"),
        ("02_Playground",                      ROOT / "02_Playground"),
        ("03_Resultado",                       ROOT / "03_Resultado"),
        ("00_Winter_is_Coming",                ROOT / "00_Winter_is_Coming"),
    ]

    all_ok = True
    for name, path in required_paths:
        if path.exists():
            log(f"[OK] {name}", "OK")
        else:
            log(f"[X] {name}", "ERROR")
            all_ok = False

    return all_ok

def main():
    """Ejecutar todos los checks."""
    print("\n===========================================")
    print(" SOTA INTEGRITY CHECK -- PersonalOS v1.1 Alpha")
    print("===========================================\n")

    results = {
        "submodules": check_submodules(),
        "skills": check_skills(),
        "mcps": check_mcps(),
        "agents": check_agents(),
        "hooks": check_hooks(),
        "hubs": check_hubs(),
        "rules": check_rules(),
        "methodologies": check_methodologies(),
        "core_structure": check_core_structure(),
    }

    log("=" * 50)
    log("RESUMEN")
    log("=" * 50)

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for name, status in results.items():
        icon = "[OK]" if status else "[FAIL]"
        log(f"{icon} {name}", "OK" if status else "ERROR")

    log("=" * 50)
    if passed == total:
        print(f"\n===========================================")
        print(f" SOTA INTEGRITY: PASSED ({passed}/{total})")
        print(f"===========================================\n")
        return 0
    else:
        print(f"\n===========================================")
        print(f" SOTA INTEGRITY: FAILED ({passed}/{total})")
        print(f"===========================================\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())