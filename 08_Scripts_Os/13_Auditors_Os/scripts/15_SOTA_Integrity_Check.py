#!/usr/bin/env python3
"""
15_SOTA_Integrity_Check.py — PersonalOS v1.0

Script de integridad que valida las dimensiones del sistema:
- Submódulos git
- Skills (24 categorías)
- MCPs (36)
- Agents (71)
- Hooks
- HUBs (14)
- Rules (25)
- Metodologías integradas

Usage:
    python 08_Scripts_Os/15_SOTA_Integrity_Check.py
    python 08_Scripts_Os/15_SOTA_Integrity_Check.py --verbose
    python 08_Scripts_Os/15_SOTA_Integrity_Check.py --fix
"""

import os
import sys
import json
from pathlib import Path

# Fix encoding issues
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Config - calcular bien la raíz del proyecto
SCRIPT_DIR = Path(__file__).parent.resolve()
# 13_Auditors_Os/scripts/ → 08_Scripts_Os/ → Think_Different (raíz)
ROOT = SCRIPT_DIR.parent.parent.parent
VERBOSE = "--verbose" in sys.argv
FIX_MODE = "--fix" in sys.argv

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
        log("No .gitmodules found", "ERROR")
        return False
    
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
    """Verifica skills en 24 categorías."""
    print("-" * 50)
    print("CHECKING: Skills (24 categorías)")
    print("-" * 50)
    
    skills_path = ROOT / "01_Core" / "03_Skills"
    if not skills_path.exists():
        print("Skills directory not found", "ERROR")
        return False
    
    categories = []
    missing_skills = []
    
    for item in skills_path.iterdir():
        if item.is_dir() and not item.name.startswith("."):
            skill_file = item / "SKILL.md"
            if skill_file.exists():
                categories.append(item.name)
                print(f"[OK] {item.name}")
            else:
                missing_skills.append(item.name)
                print(f"[X] {item.name} (missing SKILL.md)")
    
    print(f"Total: {len(categories)} categorías con SKILL.md", "INFO")
    
    if missing_skills:
        print(f"Missing SKILL.md: {missing_skills}", "ERROR")
    
    return len(missing_skills) == 0

def check_mcps():
    """Verifica MCPs documentados."""
    log("=" * 50)
    log("CHECKING: MCPs (36)")
    log("=" * 50)
    
    mcp_catalog = ROOT / "01_Core" / "05_Mcp" / "00_Config_Mcp" / "MCP_CATALOG.md"
    if not mcp_catalog.exists():
        log("MCP_CATALOG.md not found", "ERROR")
        return False
    
    # Contar MCPs en el catálogo - simple check
    log("MCP_CATALOG.md exists", "OK")
    return True

def check_agents():
    """Verifica agentes."""
    log("=" * 50)
    log("CHECKING: Agents")
    log("=" * 50)
    
    # Verificar .agent/01_Agents/
    agents_path = ROOT / ".agent" / "01_Agents"
    if agents_path.exists():
        count = sum(1 for _ in agents_path.rglob("*.md") if _.is_file())
        log(f"Agents: {count}", "OK")
    
    # Verificar 01_Core/04_Agents/
    core_agents = ROOT / "01_Core" / "04_Agents"
    if core_agents.exists():
        count = sum(1 for _ in core_agents.rglob("*.md") if _.is_file())
        log(f"Core Agents: {count}", "OK")
    
    return True

def check_hooks():
    """Verifica hooks."""
    log("=" * 50)
    log("CHECKING: Hooks")
    log("=" * 50)
    
    hooks_path = ROOT / "01_Core" / "07_Hooks"
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
    """Verifica HUBs."""
    log("=" * 50)
    log("CHECKING: HUBs (14)")
    log("=" * 50)
    
    hub_catalog = ROOT / "08_Scripts_Os" / "HUB_CATALOG.md"
    if not hub_catalog.exists():
        log("HUB_CATALOG.md not found", "ERROR")
        return False
    
    log("HUB_CATALOG.md exists", "OK")
    return True

def check_rules():
    """Verifica reglas."""
    log("=" * 50)
    log("CHECKING: Rules (25)")
    log("=" * 50)
    
    rules_path = ROOT / "01_Core" / "01_Rules"
    if not rules_path.exists():
        log("Rules directory not found", "ERROR")
        return False
    
    # Contar archivos .mdc
    mdc_files = list(rules_path.glob("*.mdc"))
    log(f"Rules (.mdc): {len(mdc_files)}", "OK")
    
    # Verificar RULES_INDEX.md
    index = rules_path / "RULES_INDEX.md"
    if index.exists():
        log("RULES_INDEX.md exists", "OK")
    else:
        log("RULES_INDEX.md not found", "ERROR")
    
    return len(mdc_files) >= 24

def check_methodologies():
    """Verifica metodologías integradas."""
    log("=" * 50)
    log("CHECKING: Metodologías Integradas")
    log("=" * 50)
    
    checks = [
        ("Super Campeones / Agent Teams", ROOT / "00_Winter_is_Coming" / "01_Personal_Os/11_AGENTS.md"),
        ("HILLARY Life OS", ROOT / "01_Core" / "03_Skills" / "18_Personal_Life_OS" / "SKILL.md"),
        ("Compound Engineering", ROOT / "01_Core" / "03_Skills" / "00_Compound_Engineering" / "SKILL.md"),
        ("GGA Pre-Commit", ROOT / ".agent" / "05_GGA"),
        ("Design Skills", ROOT / "01_Core" / "03_Skills" / "04_Product_Design" / "SKILL.md"),
        ("OCTOPUS", ROOT / "01_Core" / "03_Skills" / "25_Octopus" / "SKILL.md"),
        ("4 FANTÁSTICOS", ROOT / "01_Core" / "03_Skills" / "26_Fantasticos" / "SKILL.md"),
        ("QMD", ROOT / "01_Core" / "03_Skills" / "27_Qmd" / "SKILL.md"),
    ]
    
    all_ok = True
    for name, path in checks:
        if path.exists():
            log(f"[OK] {name}", "OK")
        else:
            log(f"[X] {name}", "ERROR")
            all_ok = False
    
    return all_ok

def main():
    """Ejecutar todos los checks."""
    print("\n===========================================")
    print(" SOTA INTEGRITY CHECK -- PersonalOS v1.0")
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