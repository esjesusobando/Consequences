#!/usr/bin/env python3
"""
validate-registry.py — OS Conductor Registry Validator

Checks that every skill referenced in registry.md actually exists on disk.
Ensures the map of the OS stays in sync with reality.
"""
import re
import sys
from pathlib import Path

CONDUCTOR_DIR = Path(__file__).resolve().parent.parent
SKILLS_DIR = CONDUCTOR_DIR.parent.parent / "02_Skills"
REGISTRY_FILE = CONDUCTOR_DIR / "registry.md"


def extract_skill_paths_from_registry() -> list[tuple[str, str]]:
    """Extract skill names and their expected paths from registry.md."""
    text = REGISTRY_FILE.read_text(encoding="utf-8")
    skills = []

    # Match lines like: | \d+ | **Skill Name** | `path/` |
    pattern = re.compile(r"\|\s*\d+\s*\|\s*\*\*(.+?)\*\*\s*\|\s*`(.+?)`\s*\|")
    for match in pattern.finditer(text):
        name = match.group(1).strip()
        rel_path = match.group(2).strip()
        # Handle paths prefixed with area number like "01_N8N_JS/"
        if not rel_path.startswith(".."):
            # Relative to the area folder in 02_Skills
            skills.append((name, rel_path))
        else:
            # Could be an external reference
            skills.append((name, rel_path))

    return skills


def find_skill_on_disk(rel_path: str) -> Path | None:
    """Search for a skill directory by its relative path."""
    # Search in all area directories under 02_Skills
    if not SKILLS_DIR.exists():
        return None

    for area_dir in sorted(SKILLS_DIR.iterdir()):
        if not area_dir.is_dir():
            continue
        candidate = area_dir / rel_path
        if candidate.exists() and (candidate / "SKILL.md").exists():
            return candidate

    # Try direct path
    candidate = SKILLS_DIR / rel_path
    if candidate.exists() and (candidate / "SKILL.md").exists():
        return candidate

    return None


def main():
    errors = 0
    warnings = 0

    print("=" * 60)
    print("🔍 OS Conductor — Registry Validator")
    print(f"Registry: {REGISTRY_FILE}")
    print(f"Skills dir: {SKILLS_DIR}")
    print("=" * 60)

    if not REGISTRY_FILE.exists():
        print(f"\n❌ ERROR: registry.md not found at {REGISTRY_FILE}")
        sys.exit(1)

    skills = extract_skill_paths_from_registry()
    print(f"\n📋 Found {len(skills)} skills in registry\n")

    for name, rel_path in skills:
        found = find_skill_on_disk(rel_path)
        if found:
            print(f"   ✅ {name:35s} → {rel_path}")
        else:
            print(f"   ❌ {name:35s} → NOT FOUND: {rel_path}")
            errors += 1

    print("\n" + "=" * 60)
    if errors == 0:
        print("🎉 ALL SKILLS VALIDATED — Registry matches filesystem")
    else:
        print(f"⚠️  {errors} skills referenced in registry.md but not found on disk")
        print("   Run: python scripts/validate-registry.py to recheck after fixes")
    print("=" * 60)

    return errors


if __name__ == "__main__":
    sys.exit(main())
