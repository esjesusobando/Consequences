import logging
import typing

logging.basicConfig(level=logging.INFO)
#!/usr/bin/env python3
"""
validate_skill_frontmatter.py — Skill Frontmatter Validator
FASE 6.3 del Plan Consequences 3.0

Detecta skills sin frontmatter y genera frontmatter basico automaticamente.
"""

import json
import os
import re
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────
# RUTAS
# ─────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.parent.parent.parent
SKILLS_DIR = REPO_ROOT / "01_Personal_Os" / "00_Core" / "02_Tools" / "02_Skills"
EXCLUDE_DIRS = {"09_Legacy_Archive", "10_Backup", ".git"}


def extract_skill_name_from_path(path: Path) -> str:
    """Extrae nombre de skill desde path."""
    parts = path.parts
    for i, part in enumerate(parts):
        if part == "02_Skills":
            if i + 1 < len(parts):
                return parts[i + 1]
    return path.stem


def has_frontmatter(content: str) -> bool:
    """Verifica si content tiene frontmatter YAML."""
    return content.strip().startswith("---")


def scan_skills() -> dict:
    """Escanea todas las skills."""
    results = {"has_frontmatter": [], "missing": []}
    
    for dirpath, dirnames, filenames in os.walk(SKILLS_DIR):
        # Excluir directorios
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        
        for filename in filenames:
            if filename in ("SKILL.md", "skill.md"):
                filepath = Path(dirpath) / filename
                try:
                    content = filepath.read_text(encoding="utf-8")
                    skill_name = extract_skill_name_from_path(filepath)
                    
                    if has_frontmatter(content):
                        results["has_frontmatter"].append({
                            "path": str(filepath.relative_to(REPO_ROOT)),
                            "name": skill_name
                        })
                    else:
                        results["missing"].append({
                            "path": str(filepath.relative_to(REPO_ROOT)),
                            "name": skill_name
                        })
                except Exception as e:
                    pass
    return results


def generate_frontmatter(skill_name: str) -> str:
    """Genera frontmatter basico."""
    import datetime
    return f"""---
name: {skill_name}
description: (descripcion de la skill)
type: skill
version: 1.0
date: {datetime.date.today().isoformat()}
status: active
---
"""


def main():
    print(">> Skill Frontmatter Validator -- FASE 6.3\n")
    
    results = scan_skills()
    
    print(f"|  Skills con frontmatter: {len(results['has_frontmatter'])}")
    print(f"|  Skills sin frontmatter: {len(results['missing'])}")
    print()
    
    if results["missing"]:
        print("|  Skills sin frontmatter (primeros 20):")
        for i, s in enumerate(results["missing"][:20]):
            print(f"|    {i+1}. {s['name']:<40} ({s['path'][:30]})")
        
        if len(results["missing"]) > 20:
            print(f"|    ... y {len(results['missing'])-20} mas")
    
    # Si es --apply, generar frontmatter
    if len(sys.argv) > 1 and sys.argv[1] == "--apply":
        print("\n>> Generando frontmatter...")
        for s in results["missing"]:
            filepath = REPO_ROOT / s["path"]
            if filepath.exists():
                try:
                    content = filepath.read_text(encoding="utf-8")
                    fm = generate_frontmatter(s["name"])
                    new_content = fm + "\n" + content
                    filepath.write_text(new_content, encoding="utf-8")
                    print(f"   [GENERATED] {s['name']}")
                except Exception as e:
                    print(f"   [ERROR] {s['name']}: {e}")
        
        print("\n>> Listo. Ejecuta de nuevo para verificar.")


if __name__ == "__main__":
    main()