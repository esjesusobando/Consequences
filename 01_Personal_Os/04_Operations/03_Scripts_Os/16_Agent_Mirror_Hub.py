#!/usr/bin/env python3
"""
16_Agent_Mirror_Hub.py — Agent Mirror Sync
FASE 2.2 del Plan Consequences 3.0

Sincroniza agentes entre:
- SOURCE: 01_Personal_Os/01_Core/02_Tools/01_Agents/
- BACKUP: .agent/01_Agents/

Politica: SOURCE siempre gana. Sync uni-direccional source -> backup.
"""

import os
import shutil
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────
# RUTAS
# ─────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.parent.parent.parent
SOURCE_DIR = REPO_ROOT / "01_Personal_Os" / "01_Core" / "02_Tools" / "01_Agents"
BACKUP_DIR = REPO_ROOT / ".agent" / "01_Agents"


def get_agent_files(directory: Path) -> dict:
    """Obtiene todos los archivos .md de un directorio recursivamente."""
    agents = {}
    if not directory.exists():
        return agents
    for root, _, files in os.walk(directory):
        for f in files:
            if f.endswith(".md"):
                full_path = Path(root) / f
                rel_path = full_path.relative_to(directory)
                agents[str(rel_path)] = full_path
    return agents


def compare_agents():
    """Compara agentes entre source y backup."""
    source_agents = get_agent_files(SOURCE_DIR)
    backup_agents = get_agent_files(BACKUP_DIR)

    source_keys = set(source_agents.keys())
    backup_keys = set(backup_agents.keys())

    both = source_keys & backup_keys
    only_source = source_keys - backup_keys
    only_backup = backup_keys - source_keys

    return {
        "source": source_agents,
        "backup": backup_agents,
        "both": both,
        "only_source": only_source,
        "only_backup": only_backup,
    }


def sync_to_backup(diff: dict, dry_run: bool = True):
    """Sincroniza source -> backup."""
    print(f"\n>> Agent Mirror Sync {'(DRY RUN)' if dry_run else '(APPLYING)'}")

    if not diff["only_source"] and not diff["only_backup"]:
        print("[OK] Backup esta al dia con source.")
        return

    # Archivos nuevos en source
    if diff["only_source"]:
        print(f"\n>> Archivos para copiar a backup ({len(diff['only_source'])}):")
        for key in sorted(diff["only_source"]):
            src = diff["source"][key]
            dst = BACKUP_DIR / key
            if dry_run:
                print(f"    [COPY] {key}")
            else:
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, dst)
                print(f"    [COPIED] {key}")

    # Archivos huérfanos en backup (existen en backup pero no en source)
    if diff["only_backup"]:
        print(f"\n>> Archivos huérfanos en backup (no existen en source):")
        for key in sorted(diff["only_backup"]):
            print(f"    [ORPHAN] {key} -- se mantiene en backup (no se toca)")


def generate_report(diff: dict) -> str:
    """Genera reporte ASCII del estado de mirror."""
    lines = [
        "+==============================================================+",
        "|           AGENT MIRROR HUB -- STATUS REPORT             |",
        "+==============================================================+",
        f"|  Source (01_Agents):    {len(diff['source']):>3} files                      |",
        f"|  Backup (.agent):       {len(diff['backup']):>3} files                      |",
        f"|  En ambos:              {len(diff['both']):>3}                             |",
        f"|  Solo en Source:        {len(diff['only_source']):>3}                        |",
        f"|  Solo en Backup:        {len(diff['only_backup']):>3} (huerfanos)           |",
        "+==============================================================+",
    ]

    if diff["only_source"]:
        lines.append("|  >> Archivos nuevos en Source (copiar a backup):       |")
        for key in sorted(diff["only_source"])[:10]:
            lines.append(f"|    - {key:<50} |")
        if len(diff["only_source"]) > 10:
            lines.append(f"|    ... y {len(diff['only_source'])-10} mas                              |")

    if diff["only_backup"]:
        lines.append("|  << Archivos solo en Backup (huerfanos):            |")
        for key in sorted(diff["only_backup"])[:10]:
            lines.append(f"|    - {key:<50} |")
        if len(diff["only_backup"]) > 10:
            lines.append(f"|    ... y {len(diff['only_backup'])-10} mas                              |")

    lines.append("+==============================================================+")
    lines.append("|  Politica: SOURCE (01_Agents) siempre gana               |")
    lines.append("|  Sync: uni-direccional source -> backup                  |")
    lines.append("+==============================================================+")
    return "\n".join(lines)


def main():
    print(">> Agent Mirror Hub -- FASE 2.2\n")

    diff = compare_agents()
    print(generate_report(diff))

    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == "--sync":
            sync_to_backup(diff, dry_run=False)
            print("\n>> Sync completado.")
        elif cmd == "--dry-run":
            sync_to_backup(diff, dry_run=True)
        elif cmd == "--validate":
            if not diff["only_source"] and not diff["only_backup"]:
                print("\n[OK] Backup sincronizado con source.")
            else:
                print("\n[!] Hay diferencias. Ejecuta --sync para sincronizar.")


if __name__ == "__main__":
    main()
