#!/usr/bin/env python3
"""Verify SSOT counts against actual filesystem."""
import os
from pathlib import Path

root = Path(r"C:\Users\sebas\Desktop\Think_Different")

EXCLUDE_DIRS = {".git", ".venv", "venv", "node_modules", "__pycache__",
    "05_Archive", "00_Respaldo PC Sebas", ".pytest_cache",
    "OIM_Website", "OIM_Website_Backup", ".idea", ".vscode",
    "dist", "build", ".next"}

# 1. Agent count (matching scan_agents logic)
source_dir = root / "01_Personal_Os/01_Core/02_Tools/01_Agents"
NON_AGENT_FILES = {"README.md", "LEEME.md", "SKILL.md", "registry.md"}
NON_AGENT_DIRS = {"references"}

source_agents = []
for f in source_dir.rglob("*.md"):
    if any(p in EXCLUDE_DIRS for p in f.parts):
        continue
    if any(p in NON_AGENT_DIRS for p in f.parts):
        continue
    if f.name in NON_AGENT_FILES:
        continue
    rel = str(f.relative_to(source_dir)).replace("\\", "/")
    source_agents.append(rel)

print(f"=== AGENTS (source) ===")
print(f"Count: {len(source_agents)}")
# Excluded: show what was filtered
print()

# 2. Skills count (matching scan_skills logic)
skills_dir = root / "01_Personal_Os/01_Core/02_Tools/02_Skills"
skill_count = 0
for dirpath, dirnames, filenames in os.walk(str(skills_dir)):
    dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS and not d.startswith(".")]
    for fname in filenames:
        if fname == "SKILL.md" and not fname.startswith("."):
            skill_count += 1

print(f"=== SKILLS ===")
print(f"Count: {skill_count}")
print()

# 3. HUBs count (matching scan_hubs logic)
hubs_dir = root / "01_Personal_Os/04_Operations/03_Scripts_Os"
hubs = []
scripts = []
for f in sorted(hubs_dir.glob("*.py")):
    if f.stem in ("config_paths", "__init__", "refactor_revert_id"):
        continue
    if not f.stem[:2].isdigit():
        continue
    hubs.append(f.stem)

for subdir in sorted(hubs_dir.iterdir()):
    if not subdir.is_dir():
        continue
    if subdir.name.startswith("."):
        continue
    for f in sorted(subdir.rglob("*.py")):
        if any(p == "__pycache__" for p in f.parts):
            continue
        if f.stem in ("__init__",):
            continue
        if not f.stem[:2].isdigit():
            continue
        scripts.append(f.relative_to(root))

print(f"=== HUBS ===")
print(f"Hubs (numbered .py in root, excl config/init/revert): {len(hubs)}")
for h in hubs:
    print(f"  {h}")
print(f"\nScripts (numbered .py in subdirs): {len(scripts)}")
for s in scripts:
    print(f"  {s}")
print()

# 4. Rules count
rules_dir = root / "01_Personal_Os/01_Core/01_Rules"
rules_count = len(list(rules_dir.glob("*.mdc"))) if rules_dir.exists() else 0
print(f"=== RULES ===")
print(f"Count: {rules_count}")
print()

# 5. What's the hub_con_interfaz count?
print("=== Hub interface check ===")
for h_name in hubs:
    fp = hubs_dir / f"{h_name}.py"
    content = fp.read_text(encoding="utf-8", errors="ignore")
    has_main = any(x in content for x in ['if __name__ == "__main__"', "def run(", "def main("])
    has_args = any(x in content for x in ["add_argument", "ArgumentParser", "--help", "sys.argv"])
    numerado = h_name[:2].isdigit()
    if not has_main and not has_args:
        print(f"  {h_name}: main={has_main} args={has_args}")
