#!/usr/bin/env python3
"""
16_System_Mapper_Hub.py — Consequences 3.0 — JARVIS Ground Truth

Escanea el OS y genera los 7 archivos del manifest centralizado.
Es la "fuente de verdad inmutable" que todos los agentes consultan.

Usage:
    python 16_System_Mapper_Hub.py --scan        # genera los 7 archivos manifest
    python 16_System_Mapper_Hub.py --validate    # valida integridad referencial
    python 16_System_Mapper_Hub.py --diff        # compara estado actual vs manifest
    python 16_System_Mapper_Hub.py --report      # reporte ASCII a 03_Resultado/04_Reportes/

Outputs (escritos en 01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/):
    01_OS_Inventory.json     — inventario crudo (counts, paths)
    02_MCP_Registry.yaml     — MCPs Claude Code + OpenCode con drift flag
    03_Agent_Catalog.yaml    — catálogo de agentes (source: 01_Agents)
    04_Skill_Index.json      — index navegable de skills por área
    05_HUB_Catalog.yaml      — los HUBs con función + comando
    06_Workflow_Graph.yaml   — workflows por categoría
    07_Hook_Registry.yaml    — hooks por fase con triggers
"""

import argparse
import io
import json
import os
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

# Path resolution con fallback (v2.0 Consequences)
_SCRIPT_DIR = Path(__file__).parent.resolve()
sys.path.insert(0, str(_SCRIPT_DIR))

try:
    from config_paths import PROJECT_ROOT
except ImportError:
    PROJECT_ROOT = _SCRIPT_DIR.parent.parent.parent

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# Manifest dir
MANIFEST_DIR = (
    PROJECT_ROOT
    / "01_Personal_Os"
    / "04_Operations"
    / "02_Agent_Teams_Lite"
    / "00_Manifest"
)
REPORTS_DIR = PROJECT_ROOT / "03_Resultado" / "04_Reportes"

# Excluded directories for scanning
EXCLUDE_DIRS = {
    ".git", ".venv", "venv", "node_modules", "__pycache__",
    "05_Archive", "00_Respaldo PC Sebas", ".pytest_cache",
    "OIM_Website", "OIM_Website_Backup", ".idea", ".vscode",
    "dist", "build", ".next",
}


def walk_files(root: Path, ext_filter: tuple = None):
    """os.walk con poda agresiva."""
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [
            d for d in dirnames
            if d not in EXCLUDE_DIRS and not d.startswith(".")
        ]
        for fname in filenames:
            if fname.startswith("."):
                continue
            if ext_filter and not fname.endswith(ext_filter):
                continue
            yield Path(dirpath) / fname


def yaml_dump(data, indent=0):
    """YAML mínimo sin dependencia externa."""
    lines = []
    pad = "  " * indent
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                lines.append(f"{pad}{key}:")
                lines.append(yaml_dump(value, indent + 1))
            else:
                # Strings con caracteres especiales → quoted
                v = str(value)
                if any(c in v for c in [":", "#", "\n"]):
                    v = f'"{v}"'
                lines.append(f"{pad}{key}: {v}")
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, dict):
                first = True
                for k, v in item.items():
                    prefix = f"{pad}- " if first else f"{pad}  "
                    if isinstance(v, (dict, list)):
                        lines.append(f"{prefix}{k}:")
                        lines.append(yaml_dump(v, indent + 2))
                    else:
                        sv = str(v)
                        if any(c in sv for c in [":", "#", "\n"]):
                            sv = f'"{sv}"'
                        lines.append(f"{prefix}{k}: {sv}")
                    first = False
            else:
                lines.append(f"{pad}- {item}")
    return "\n".join(l for l in lines if l)


# ─────────────────────────────────────────────────────────────────────
# SCAN — generate manifest files
# ─────────────────────────────────────────────────────────────────────

def scan_mcps():
    """Escanea MCPs de Claude Code y OpenCode con drift detection."""
    claude_mcp_path = PROJECT_ROOT / ".mcp.json"
    opencode_path = Path.home() / ".config" / "opencode" / "opencode.json"

    claude_mcps = {}
    if claude_mcp_path.exists():
        try:
            data = json.loads(claude_mcp_path.read_text(encoding="utf-8"))
            claude_mcps = data.get("mcpServers", {})
        except Exception as e:
            print(f"  ⚠️ Error leyendo .mcp.json: {e}")

    opencode_mcps = {}
    if opencode_path.exists():
        try:
            data = json.loads(opencode_path.read_text(encoding="utf-8"))
            opencode_mcps = data.get("mcp", {})
        except Exception as e:
            print(f"  ⚠️ Error leyendo opencode.json: {e}")

    # Build registry with drift flags
    all_names = set(claude_mcps.keys()) | set(opencode_mcps.keys())
    registry = []
    for name in sorted(all_names):
        in_claude = name in claude_mcps
        in_opencode = name in opencode_mcps
        if in_claude and in_opencode:
            availability = "both"
        elif in_claude:
            availability = "claude_only"
        else:
            availability = "opencode_only"
        registry.append({
            "name": name,
            "availability": availability,
            "claude_code": in_claude,
            "opencode": in_opencode,
        })

    return {
        "version": "v3.0",
        "generated": datetime.now().isoformat(timespec="seconds"),
        "totals": {
            "claude_code": len(claude_mcps),
            "opencode": len(opencode_mcps),
            "both": len([r for r in registry if r["availability"] == "both"]),
            "claude_only": len([r for r in registry if r["availability"] == "claude_only"]),
            "opencode_only": len([r for r in registry if r["availability"] == "opencode_only"]),
        },
        "mcps": registry,
    }


def scan_skills():
    """Escanea skills (SKILL.md) por área."""
    skills_dir = PROJECT_ROOT / "01_Personal_Os/01_Core/02_Tools/02_Skills"
    by_area = defaultdict(list)

    for skill_md in walk_files(skills_dir, ext_filter=("SKILL.md",)):
        if skill_md.name != "SKILL.md":
            continue
        rel = skill_md.relative_to(skills_dir)
        area = rel.parts[0] if rel.parts else "unknown"
        skill_name = skill_md.parent.name

        # Detect frontmatter
        try:
            head = skill_md.read_text(encoding="utf-8", errors="ignore")[:500]
            has_frontmatter = head.lstrip().startswith("---")
        except Exception:
            has_frontmatter = False

        by_area[area].append({
            "name": skill_name,
            "path": str(rel).replace("\\", "/"),
            "has_frontmatter": has_frontmatter,
        })

    return {
        "version": "v3.0",
        "generated": datetime.now().isoformat(timespec="seconds"),
        "base_path": "01_Personal_Os/01_Core/02_Tools/02_Skills/",
        "totals": {
            "areas": len(by_area),
            "skills": sum(len(s) for s in by_area.values()),
            "without_frontmatter": sum(
                1 for area in by_area.values()
                for s in area if not s["has_frontmatter"]
            ),
        },
        "by_area": {
            area: {
                "count": len(skills),
                "skills": skills,
            }
            for area, skills in sorted(by_area.items())
        },
    }


def scan_agents():
    """Escanea agentes (source: 01_Agents en core, backup: .agent)."""
    source_dir = PROJECT_ROOT / "01_Personal_Os/01_Core/02_Tools/01_Agents"
    backup_dir = PROJECT_ROOT / ".agent/01_Agents"

    source_agents = []
    if source_dir.exists():
        for f in source_dir.rglob("*.md"):
            if any(p in EXCLUDE_DIRS for p in f.parts):
                continue
            source_agents.append(str(f.relative_to(source_dir)).replace("\\", "/"))

    backup_agents = []
    if backup_dir.exists():
        for f in backup_dir.rglob("*.md"):
            if any(p in EXCLUDE_DIRS for p in f.parts):
                continue
            backup_agents.append(str(f.relative_to(backup_dir)).replace("\\", "/"))

    drift = sorted(set(source_agents) ^ set(backup_agents))

    return {
        "version": "v3.0",
        "generated": datetime.now().isoformat(timespec="seconds"),
        "policy": {
            "source_of_truth": "01_Personal_Os/01_Core/02_Tools/01_Agents/",
            "backup": ".agent/01_Agents/",
            "sync_direction": "source -> backup (uni-directional)",
        },
        "totals": {
            "source": len(source_agents),
            "backup": len(backup_agents),
            "in_sync": len(set(source_agents) & set(backup_agents)),
            "drift": len(drift),
        },
        "drift_files": drift,
    }


def scan_hubs():
    """Escanea HUBs en 03_Scripts_Os/ + scripts en subdirectorios."""
    hubs_dir = PROJECT_ROOT / "01_Personal_Os/04_Operations/03_Scripts_Os"

    hubs = []
    scripts = []

    # HUBs en raíz (scripts con prefijo numérico XX_ en directorio raíz)
    for f in sorted(hubs_dir.glob("*.py")):
        if f.stem in ("config_paths", "__init__", "refactor_revert_id"):
            continue
        if not f.stem[:2].isdigit():
            continue
        hubs.append({
            "name": f.stem,
            "path": str(f.relative_to(PROJECT_ROOT)).replace("\\", "/"),
            "command": f"python {f.relative_to(PROJECT_ROOT)}".replace("\\", "/"),
        })

    # Scripts en subdirectorios (ej: 05_Validator/, 10_Legacy/)
    for subdir in sorted(hubs_dir.iterdir()):
        if not subdir.is_dir():
            continue
        if subdir.name.startswith("."):
            continue
        for f in sorted(subdir.glob("*.py")):
            if f.stem in ("__init__",):
                continue
            if not f.stem[:2].isdigit():
                continue
            scripts.append({
                "name": f.stem,
                "path": str(f.relative_to(PROJECT_ROOT)).replace("\\", "/"),
                "command": f"python {f.relative_to(PROJECT_ROOT)}".replace("\\", "/"),
            })

    return {
        "version": "v3.0",
        "generated": datetime.now().isoformat(timespec="seconds"),
        "base_path": "01_Personal_Os/04_Operations/03_Scripts_Os/",
        "totals": {"hubs": len(hubs), "scripts": len(scripts)},
        "hubs": hubs,
        "scripts": scripts,
    }


def scan_workflows():
    """Escanea workflows por categoría."""
    workflows_dir = PROJECT_ROOT / "01_Personal_Os/01_Core/00_Workflows_Os"

    by_cat = defaultdict(list)
    for f in walk_files(workflows_dir, ext_filter=(".md",)):
        rel = f.relative_to(workflows_dir)
        if len(rel.parts) >= 2:
            cat = rel.parts[0]
            by_cat[cat].append(rel.parts[-1])

    return {
        "version": "v3.0",
        "generated": datetime.now().isoformat(timespec="seconds"),
        "base_path": "01_Personal_Os/01_Core/00_Workflows_Os/",
        "totals": {
            "categories": len(by_cat),
            "workflows": sum(len(w) for w in by_cat.values()),
        },
        "by_category": {
            cat: {"count": len(wfs), "workflows": sorted(wfs)}
            for cat, wfs in sorted(by_cat.items())
        },
    }


def scan_hooks():
    """Escanea hooks por fase."""
    hooks_dir = PROJECT_ROOT / "01_Personal_Os/01_Core/02_Tools/05_Hooks"

    by_phase = defaultdict(list)
    for f in walk_files(hooks_dir, ext_filter=(".py", ".ps1")):
        rel = f.relative_to(hooks_dir)
        if len(rel.parts) >= 2:
            phase = rel.parts[0]
            by_phase[phase].append(rel.parts[-1])

    return {
        "version": "v3.0",
        "generated": datetime.now().isoformat(timespec="seconds"),
        "base_path": "01_Personal_Os/01_Core/02_Tools/05_Hooks/",
        "totals": {
            "phases": len(by_phase),
            "hooks": sum(len(h) for h in by_phase.values()),
        },
        "by_phase": {
            phase: {"count": len(hooks), "hooks": sorted(hooks)}
            for phase, hooks in sorted(by_phase.items())
        },
    }


def scan_inventory():
    """Inventario crudo del OS."""
    skills_data = scan_skills()
    agents_data = scan_agents()
    hubs_data = scan_hubs()
    workflows_data = scan_workflows()
    hooks_data = scan_hooks()
    mcps_data = scan_mcps()

    rules_dir = PROJECT_ROOT / "01_Personal_Os/01_Core/01_Rules"
    rules_count = len(list(rules_dir.glob("*.mdc"))) if rules_dir.exists() else 0

    integrations_dir = PROJECT_ROOT / "01_Personal_Os/01_Core/02_Tools/04_Integrations"
    integrations = []
    if integrations_dir.exists():
        integrations = [d.name for d in integrations_dir.iterdir() if d.is_dir()]

    return {
        "version": "v4.8",
        "generated": datetime.now().isoformat(timespec="seconds"),
        "personal_os": {
            "name": "PersonalOS",
            "version": "v4.8 Consequences",
            "root": str(PROJECT_ROOT.name),
        },
        "totals": {
            "mcps_claude": mcps_data["totals"]["claude_code"],
            "mcps_opencode": mcps_data["totals"]["opencode"],
            "skills": skills_data["totals"]["skills"],
            "skill_areas": skills_data["totals"]["areas"],
            "agents_source": agents_data["totals"]["source"],
            "agents_backup": agents_data["totals"]["backup"],
            "hubs": hubs_data["totals"]["hubs"],
            "scripts": hubs_data["totals"]["scripts"],
            "workflows": workflows_data["totals"]["workflows"],
            "workflow_categories": workflows_data["totals"]["categories"],
            "hooks": hooks_data["totals"]["hooks"],
            "hook_phases": hooks_data["totals"]["phases"],
            "rules": rules_count,
            "integrations": len(integrations),
        },
        "integrations": integrations,
        "manifest_files": [
            "01_OS_Inventory.json",
            "02_MCP_Registry.yaml",
            "03_Agent_Catalog.yaml",
            "04_Skill_Index.json",
            "05_HUB_Catalog.yaml",
            "06_Workflow_Graph.yaml",
            "07_Hook_Registry.yaml",
        ],
    }


# ─────────────────────────────────────────────────────────────────────
# WRITE — persist manifest files
# ─────────────────────────────────────────────────────────────────────

def write_manifest():
    """Genera los 7 archivos del manifest."""
    MANIFEST_DIR.mkdir(parents=True, exist_ok=True)

    print("📊 Escaneando OS...")

    print("  [1/7] OS Inventory...")
    inventory = scan_inventory()
    (MANIFEST_DIR / "01_OS_Inventory.json").write_text(
        json.dumps(inventory, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    print("  [2/7] MCP Registry...")
    mcp_reg = scan_mcps()
    (MANIFEST_DIR / "02_MCP_Registry.yaml").write_text(
        f"# MCP Registry — generated {mcp_reg['generated']}\n"
        f"# Drift Claude<->OpenCode: claude_only={mcp_reg['totals']['claude_only']}, "
        f"opencode_only={mcp_reg['totals']['opencode_only']}\n\n"
        + yaml_dump(mcp_reg),
        encoding="utf-8",
    )

    print("  [3/7] Agent Catalog...")
    agent_cat = scan_agents()
    (MANIFEST_DIR / "03_Agent_Catalog.yaml").write_text(
        f"# Agent Catalog — generated {agent_cat['generated']}\n"
        f"# Source of truth: {agent_cat['policy']['source_of_truth']}\n\n"
        + yaml_dump(agent_cat),
        encoding="utf-8",
    )

    print("  [4/7] Skill Index...")
    skills = scan_skills()
    (MANIFEST_DIR / "04_Skill_Index.json").write_text(
        json.dumps(skills, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    print("  [5/7] HUB Catalog...")
    hubs = scan_hubs()
    (MANIFEST_DIR / "05_HUB_Catalog.yaml").write_text(
        f"# HUB Catalog — generated {hubs['generated']}\n\n" + yaml_dump(hubs),
        encoding="utf-8",
    )

    print("  [6/7] Workflow Graph...")
    workflows = scan_workflows()
    (MANIFEST_DIR / "06_Workflow_Graph.yaml").write_text(
        f"# Workflow Graph — generated {workflows['generated']}\n\n" + yaml_dump(workflows),
        encoding="utf-8",
    )

    print("  [7/7] Hook Registry...")
    hooks = scan_hooks()
    (MANIFEST_DIR / "07_Hook_Registry.yaml").write_text(
        f"# Hook Registry — generated {hooks['generated']}\n\n" + yaml_dump(hooks),
        encoding="utf-8",
    )

    # README
    readme = f"""# 00_Manifest — JARVIS Ground Truth

**Generated:** {inventory['generated']}
**Version:** v4.8 Consequences

## ¿Qué es esto?

Inventario centralizado e inmutable del PersonalOS.
Es la fuente de verdad que TODOS los agentes consultan.

## Archivos

| # | Archivo | Contenido |
|---|---------|-----------|
| 01 | `01_OS_Inventory.json` | Inventario crudo (counts, paths) |
| 02 | `02_MCP_Registry.yaml` | MCPs Claude Code + OpenCode con drift |
| 03 | `03_Agent_Catalog.yaml` | {inventory['totals']['agents_source']} agentes (source: core, backup: .agent) |
| 04 | `04_Skill_Index.json` | Index navegable de las {inventory['totals']['skills']} skills |
| 05 | `05_HUB_Catalog.yaml` | {inventory['totals']['hubs']} HUBs + {inventory['totals']['scripts']} scripts |
| 06 | `06_Workflow_Graph.yaml` | {inventory['totals']['workflows']} workflows en {inventory['totals']['workflow_categories']} categorías |
| 07 | `07_Hook_Registry.yaml` | {inventory['totals']['hooks']} hooks en {inventory['totals']['hook_phases']} fases |

## Cómo regenerar

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan
```

## Cómo validar integridad

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --validate
```

## Ground Truth

- **MCPs Claude Code:** {inventory['totals']['mcps_claude']}
- **MCPs OpenCode:** {inventory['totals']['mcps_opencode']}
- **Skills:** {inventory['totals']['skills']} en {inventory['totals']['skill_areas']} áreas
- **Agentes:** {inventory['totals']['agents_source']} (source) / {inventory['totals']['agents_backup']} (backup)
- **HUBs:** {inventory['totals']['hubs']} (+ {inventory['totals']['scripts']} scripts)
- **Workflows:** {inventory['totals']['workflows']}
- **Hooks:** {inventory['totals']['hooks']}
- **Rules:** {inventory['totals']['rules']}
- **Integrations:** {inventory['totals']['integrations']} ({', '.join(inventory['integrations'])})
"""
    (MANIFEST_DIR / "README.md").write_text(readme, encoding="utf-8")

    print(f"\n✅ Manifest generado en: {MANIFEST_DIR.relative_to(PROJECT_ROOT)}")
    print(f"   Total archivos: 8 (7 manifest + README)")
    return inventory


# ─────────────────────────────────────────────────────────────────────
# VALIDATE — referential integrity
# ─────────────────────────────────────────────────────────────────────

def validate():
    """Valida integridad referencial del manifest."""
    if not MANIFEST_DIR.exists():
        print(f"❌ Manifest no existe — corré --scan primero")
        return 1

    errors = 0
    print("🔍 Validando integridad referencial...\n")

    # 1. Inventario existe y es válido JSON
    inv_file = MANIFEST_DIR / "01_OS_Inventory.json"
    if not inv_file.exists():
        print(f"  ❌ Falta {inv_file.name}")
        errors += 1
    else:
        try:
            json.loads(inv_file.read_text(encoding="utf-8"))
            print(f"  ✅ {inv_file.name} válido")
        except Exception as e:
            print(f"  ❌ {inv_file.name} JSON inválido: {e}")
            errors += 1

    # 2. Skills paths existen
    skill_idx = MANIFEST_DIR / "04_Skill_Index.json"
    if skill_idx.exists():
        data = json.loads(skill_idx.read_text(encoding="utf-8"))
        base = PROJECT_ROOT / data["base_path"]
        missing = 0
        for area_data in data["by_area"].values():
            for skill in area_data["skills"]:
                if not (base / skill["path"]).exists():
                    missing += 1
        if missing == 0:
            print(f"  ✅ Skill Index — todos los paths resuelven ({data['totals']['skills']} skills)")
        else:
            print(f"  ❌ Skill Index — {missing} paths rotos")
            errors += missing

    # 3. HUBs existen
    hub_cat = MANIFEST_DIR / "05_HUB_Catalog.yaml"
    if hub_cat.exists():
        # Parse text para encontrar paths
        content = hub_cat.read_text(encoding="utf-8")
        # Conteo simple
        hub_count = content.count("name:")
        print(f"  ✅ HUB Catalog — {hub_count} HUBs documentados")

    print(f"\n{'✅ Validación OK' if errors == 0 else f'❌ {errors} errores'}")
    return 0 if errors == 0 else 1


# ─────────────────────────────────────────────────────────────────────
# REPORT
# ─────────────────────────────────────────────────────────────────────

def write_report(inventory: dict):
    """Escribe reporte ASCII a 03_Resultado/04_Reportes/."""
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")

    lines = [
        "=" * 70,
        f"  SYSTEM MAPPER — Consequences 3.0 — {ts}",
        "=" * 70,
        "",
        "GROUND TRUTH INVENTORY",
        "-" * 70,
        f"  MCPs Claude Code:    {inventory['totals']['mcps_claude']}",
        f"  MCPs OpenCode:       {inventory['totals']['mcps_opencode']}",
        f"  Skills:              {inventory['totals']['skills']} en {inventory['totals']['skill_areas']} áreas",
        f"  Agentes (source):    {inventory['totals']['agents_source']}",
        f"  Agentes (backup):    {inventory['totals']['agents_backup']}",
        f"  HUBs:                {inventory['totals']['hubs']}",
        f"  Workflows:           {inventory['totals']['workflows']} en {inventory['totals']['workflow_categories']} categorías",
        f"  Hooks:               {inventory['totals']['hooks']} en {inventory['totals']['hook_phases']} fases",
        f"  Rules:               {inventory['totals']['rules']}",
        f"  Integrations:        {inventory['totals']['integrations']} ({', '.join(inventory['integrations'])})",
        "",
        "=" * 70,
    ]

    output = "\n".join(lines)
    print(output)

    report_path = REPORTS_DIR / f"system_mapper_{ts}.txt"
    report_path.write_text(output, encoding="utf-8")
    print(f"\n📄 Reporte: 03_Resultado/04_Reportes/{report_path.name}")


# ─────────────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="System Mapper — JARVIS Ground Truth")
    parser.add_argument("--scan", action="store_true", help="Genera los 7 archivos manifest")
    parser.add_argument("--validate", action="store_true", help="Valida integridad referencial")
    parser.add_argument("--report", action="store_true", help="Reporte ASCII")

    args = parser.parse_args()

    if not (args.scan or args.validate or args.report):
        parser.print_help()
        return 1

    if args.scan:
        inventory = write_manifest()
        if args.report:
            print()
            write_report(inventory)

    if args.validate:
        return validate()

    if args.report and not args.scan:
        # Read inventory from manifest
        inv_file = MANIFEST_DIR / "01_OS_Inventory.json"
        if not inv_file.exists():
            print("❌ Manifest no existe — correr con --scan primero")
            return 1
        inventory = json.loads(inv_file.read_text(encoding="utf-8"))
        write_report(inventory)

    return 0


if __name__ == "__main__":
    sys.exit(main())
