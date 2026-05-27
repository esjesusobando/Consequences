#!/usr/bin/env python3
"""
SKILLS MAPPER - Script mapeador de referencias a skills
Optimizado para velocidad
"""

import os
import re
import csv
from pathlib import Path
from typing import List, Dict

ROOT = Path(r"C:\Users\sebas\Downloads\01 Revisar\09 Versiones\00 Respaldo PC Sebas\01 Github\personal-os\Think_Different")
SKILLS_DIR = ROOT / "01_Core" / "03_Skills"
OUTPUT_CSV = ROOT / "04_Operations/03_Scripts_Os" / "14_Otros" / "skills_references.csv"

EXCLUDE = {".mcp.json", "CLAUDE.md", "AGENTS.md", "SKILL.md", "PLAN_SDD_REORGANIZACION_SKILLS.md"}

PATTERN = re.compile(r'(?:01_Core[/\\]03_Skills|\.agent[/\\]03_Skills|skills[/\\])\d+_\w+', re.IGNORECASE)

def scan_file(file_path: Path) -> List[Dict]:
    refs = []
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except:
        return refs
    
    for match in PATTERN.finditer(content):
        line_num = content[:match.start()].count('\n') + 1
        refs.append({
            "file": str(file_path.relative_to(ROOT)),
            "line": line_num,
            "match": match.group(),
            "context": content[max(0, match.start()-30):match.end()+30].replace('\n', ' ')[:80]
        })
    return refs

def main():
    print(f"[MAPPER] Escaneando {ROOT}...")
    
    # Solo archivos relevantes
    extensions = [".md", ".yaml", ".yml", ".json", ".py"]
    files = []
    for ext in extensions:
        files.extend(ROOT.rglob(f"*{ext}"))
    
    # Filtrar
    files = [f for f in files if f.name not in EXCLUDE]
    files = [f for f in files if "skills_mapper" not in f.name]
    files = [f for f in files if "node_modules" not in str(f) and ".git" not in str(f)]
    
    print(f"[MAPPER] Archivos a procesar: {len(files)}")
    
    all_refs = []
    for i, f in enumerate(files):
        refs = scan_file(f)
        all_refs.extend(refs)
        if (i+1) % 100 == 0:
            print(f"  [{i+1}/{len(files)}]")
    
    print(f"[MAPPER] Referencias encontradas: {len(all_refs)}")
    
    # Deduplicar
    unique = {f"{r['file']}:{r['line']}:{r['match']}": r for r in all_refs}
    
    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['file', 'line', 'match', 'context'])
        writer.writeheader()
        for r in unique.values():
            writer.writerow(r)
    
    print(f"[MAPPER] CSV: {OUTPUT_CSV}")
    
    # Stats
    folders = {}
    for r in unique.values():
        m = r['match']
        f = m.split('/')[0].split('\\')[0]
        folders[f] = folders.get(f, 0) + 1
    
    print("\nPor carpeta:")
    for folder, count in sorted(folders.items(), key=lambda x: -x[1])[:10]:
        print(f"  {folder}: {count}")
    
    return len(unique)

if __name__ == "__main__":
    main()