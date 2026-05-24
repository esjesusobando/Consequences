#!/usr/bin/env python3
"""Consequences 3.0 — Reverse Engineering Deep Audit"""
import json
import sys
import io
from pathlib import Path
from collections import defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ROOT = Path(__file__).resolve().parent.parent

print("="*70)
print("  CONSEQUENCES 3.0 - REVERSE ENGINEERING DEEP AUDIT")
print("="*70)

# 1. INVENTARIO REAL
print("\n[1] GROUND TRUTH INVENTORY\n")

mcp_path = ROOT / ".mcp.json"
mcp_data = json.loads(mcp_path.read_text(encoding="utf-8"))
mcps = list(mcp_data.get("mcpServers", {}).keys())
print(f"  MCPs Claude Code: {len(mcps)}")

opencode_path = Path.home() / ".config" / "opencode" / "opencode.json"
opencode_mcps = []
if opencode_path.exists():
    try:
        oc_data = json.loads(opencode_path.read_text(encoding="utf-8"))
        opencode_mcps = list(oc_data.get("mcp", {}).keys())
        print(f"  MCPs OpenCode: {len(opencode_mcps)}")
        diff_a = set(mcps) - set(opencode_mcps)
        diff_b = set(opencode_mcps) - set(mcps)
        if diff_a or diff_b:
            print(f"    DRIFT Claude->OC: {len(diff_a)} | OC->Claude: {len(diff_b)}")
    except Exception as e:
        print(f"  OpenCode parse error: {e}")

skills_dir = ROOT / "01_Personal_Os/01_Core/02_Tools/02_Skills"
all_skills = list(skills_dir.rglob("SKILL.md"))
print(f"\n  Skills (SKILL.md): {len(all_skills)}")

by_area = defaultdict(int)
for s in all_skills:
    rel = s.relative_to(skills_dir)
    area = rel.parts[0] if rel.parts else "?"
    by_area[area] += 1
for area, count in sorted(by_area.items()):
    print(f"    {area}: {count}")

agents_main = ROOT / "01_Personal_Os/01_Core/02_Tools/01_Agents"
agents_backup = ROOT / ".agent/01_Agents"
main_agents = list(agents_main.rglob("*.md")) if agents_main.exists() else []
backup_agents = list(agents_backup.rglob("*.md")) if agents_backup.exists() else []
print(f"\n  Agentes core: {len(main_agents)}")
print(f"  Agentes .agent: {len(backup_agents)}")

hubs_dir = ROOT / "01_Personal_Os/04_Operations/03_Scripts_Os"
hubs = sorted([f.stem for f in hubs_dir.glob("*.py")
               if f.stem not in ["config_paths", "__init__"] and f.stem[:2].isdigit()])
print(f"\n  HUBs: {len(hubs)}")

rules_dir = ROOT / "01_Personal_Os/01_Core/01_Rules"
rules = sorted([f.stem for f in rules_dir.glob("*.mdc")])
print(f"\n  Rules: {len(rules)}")

hooks_dir = ROOT / "01_Personal_Os/01_Core/02_Tools/05_Hooks"
hooks = list(hooks_dir.rglob("*.py")) + list(hooks_dir.rglob("*.ps1"))
print(f"\n  Hooks: {len(hooks)}")
hooks_by_phase = defaultdict(int)
for h in hooks:
    rel = h.relative_to(hooks_dir)
    phase = rel.parts[0] if rel.parts else "?"
    hooks_by_phase[phase] += 1
for phase, count in sorted(hooks_by_phase.items()):
    print(f"    {phase}: {count}")

workflows_dir = ROOT / "01_Personal_Os/01_Core/00_Workflows_Os"
workflows = list(workflows_dir.rglob("*.md"))
print(f"\n  Workflows: {len(workflows)}")

int_dir = ROOT / "01_Personal_Os/01_Core/02_Tools/04_Integrations"
integrations = [d.name for d in int_dir.iterdir() if d.is_dir()] if int_dir.exists() else []
print(f"\n  Integrations: {len(integrations)} -> {integrations}")

# 2. CONNECTIVITY
print("\n" + "="*70)
print("[2] CONNECTIVITY MATRIX")
print("="*70)

agents_aware_of_hubs = 0
for agent in backup_agents:
    content = agent.read_text(encoding="utf-8", errors="ignore")
    if any(hub in content for hub in hubs):
        agents_aware_of_hubs += 1
print(f"\n  Agentes que mencionan algun HUB: {agents_aware_of_hubs}/{len(backup_agents)}")

agents_aware_of_mcps = 0
for agent in backup_agents:
    content = agent.read_text(encoding="utf-8", errors="ignore").lower()
    if any(mcp.lower() in content for mcp in mcps[:15]):
        agents_aware_of_mcps += 1
print(f"  Agentes que mencionan algun MCP: {agents_aware_of_mcps}/{len(backup_agents)}")

skills_aware_of_mcps = 0
for skill in all_skills:
    try:
        content = skill.read_text(encoding="utf-8", errors="ignore").lower()
        if any(mcp.lower() in content for mcp in mcps[:15]):
            skills_aware_of_mcps += 1
    except: pass
print(f"  Skills que mencionan algun MCP: {skills_aware_of_mcps}/{len(all_skills)}")

skill_names = defaultdict(list)
for s in all_skills:
    skill_names[s.parent.name].append(s)
duplicates = {n: paths for n, paths in skill_names.items() if len(paths) > 1}
print(f"\n  Skills DUPLICADAS (mismo nombre): {len(duplicates)}")
for name, paths in list(duplicates.items())[:5]:
    print(f"    {name}: {len(paths)} copias")

# 3. DRIFT
print("\n" + "="*70)
print("[3] DRIFT - LEGACY v1.x RESIDUOS")
print("="*70)

legacy_patterns = [
    ("08_Scripts_Os", "v1.x scripts"),
    ("01_Core/02_Tools/02_Skills", "v1.x skills"),
    ("06_Playground", "v1.x playground"),
]

for pattern, desc in legacy_patterns:
    count = 0
    samples = []
    for f in ROOT.rglob("*.md"):
        if any(skip in str(f) for skip in [".git/", "node_modules/", "05_Archive/"]):
            continue
        try:
            if pattern in f.read_text(encoding="utf-8", errors="ignore"):
                count += 1
                if len(samples) < 2:
                    samples.append(str(f.relative_to(ROOT))[:70])
        except: pass
    if count > 0:
        print(f"  '{pattern}' ({desc}): {count} archivos")
        for s in samples:
            print(f"    {s}")

# 4. SPOFs
print("\n" + "="*70)
print("[4] SINGLE POINTS OF FAILURE")
print("="*70)

critical_files = [
    ("CLAUDE.md", "config IA"),
    (".mcp.json", "MCPs"),
    ("01_Personal_Os/04_Operations/03_Scripts_Os/config_paths.py", "rutas"),
    ("00_Winter_is_Coming/AGENTS.md", "manifest"),
    (".atl/skill-registry.md", "SDD registry"),
]

for path, desc in critical_files:
    p = ROOT / path
    exists = p.exists()
    size = p.stat().st_size if exists else 0
    print(f"  [{('OK' if exists else 'X')}] {path} ({size}B) - {desc}")

# 5. EDGE CASES
print("\n" + "="*70)
print("[5] EDGE CASES Y FRAGILIDAD")
print("="*70)

config_importers = 0
for py in ROOT.rglob("*.py"):
    if any(skip in str(py) for skip in [".git/", "node_modules/", "__pycache__"]):
        continue
    try:
        if "from config_paths" in py.read_text(encoding="utf-8", errors="ignore"):
            config_importers += 1
    except: pass
print(f"\n  Scripts que importan config_paths: {config_importers}")
print(f"  IMPACTO: si rompemos config_paths -> {config_importers} scripts caen")

no_frontmatter = 0
sample = all_skills[:100]
for s in sample:
    try:
        content = s.read_text(encoding="utf-8", errors="ignore")
        if not content.lstrip().startswith("---"):
            no_frontmatter += 1
    except: pass
print(f"\n  Skills SIN frontmatter YAML (sample 100): {no_frontmatter}")

# 6. BLAST RADIUS
print("\n" + "="*70)
print("[6] BLAST RADIUS")
print("="*70)
total = len(all_skills) + len(backup_agents) + len(main_agents) + len(rules) + len(workflows) + len(hooks)
print(f"\n  Total archivos en el OS core: ~{total}")
print(f"  Cambios bulk = riesgo regresion alto")
print(f"  Estrategia: cambios atomicos por capa con tests")

# 7. SDD REGISTRY STATE
print("\n" + "="*70)
print("[7] SDD / .atl REGISTRY")
print("="*70)
atl_dir = ROOT / ".atl"
if atl_dir.exists():
    files = list(atl_dir.rglob("*"))
    print(f"\n  .atl/ contiene: {len([f for f in files if f.is_file()])} archivos")
    for f in atl_dir.glob("*"):
        if f.is_file():
            print(f"    {f.name} ({f.stat().st_size}B)")

print("\n" + "="*70)
print("END OF AUDIT")
print("="*70)
