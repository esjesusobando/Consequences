#!/usr/bin/env python3
"""
15_Agent_Sync_Hub.py — PersonalOS v2.0 Consequences

Sincroniza .agent/01_Agents/ con 01_Personal_Os/01_Core/02_Tools/01_Agents/
Detecta drift y lo reporta. Modo --apply lo corrige.

Usage:
    python 01_Personal_Os/04_Operations/03_Scripts_Os/15_Agent_Sync_Hub.py
    python 01_Personal_Os/04_Operations/03_Scripts_Os/15_Agent_Sync_Hub.py --apply
"""

import io
import shutil
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# Path resolution con fallback (v2.0 Consequences)
_SCRIPT_DIR = Path(__file__).parent.resolve()
sys.path.insert(0, str(_SCRIPT_DIR))

try:
    from config_paths import PROJECT_ROOT
except ImportError:
    PROJECT_ROOT = _SCRIPT_DIR.parent.parent.parent  # ROOT

LIVE = PROJECT_ROOT / "01_Personal_Os" / "01_Core" / "02_Tools" / "01_Agents"
BACKUP = PROJECT_ROOT / ".agent" / "01_Agents"
APPLY = "--apply" in sys.argv


def collect_files(root):
    """Devuelve dict {relative_path: full_path} para todos los .md."""
    if not root.exists():
        return {}
    return {
        str(p.relative_to(root)).replace("\\", "/"): p
        for p in root.rglob("*.md")
        if p.is_file()
    }


def main():
    print("\n" + "=" * 60)
    print("  AGENT SYNC HUB — PersonalOS v2.0 Consequences")
    print(f"  Modo: {'APPLY' if APPLY else 'DRY-RUN'}")
    print("=" * 60)

    if not LIVE.exists():
        print(f"❌ LIVE no existe: {LIVE}")
        return 2
    if not BACKUP.exists():
        print(f"⚠️  BACKUP no existe: {BACKUP} — creando...")
        if APPLY:
            shutil.copytree(LIVE, BACKUP)
            print("✅ Backup inicial creado")
            return 0
        return 1

    live_files = collect_files(LIVE)
    backup_files = collect_files(BACKUP)

    only_live = set(live_files) - set(backup_files)  # Faltan en backup
    only_backup = set(backup_files) - set(live_files)  # Faltan en live
    common = set(live_files) & set(backup_files)

    print(f"\n📊 Estado:")
    print(f"   Live:    {len(live_files)} archivos")
    print(f"   Backup:  {len(backup_files)} archivos")
    print(f"   Common:  {len(common)}")
    print(f"   Only-live (faltan en backup):  {len(only_live)}")
    print(f"   Only-backup (faltan en live):  {len(only_backup)}")

    if not only_live and not only_backup:
        print("\n🎉 ZERO DRIFT — Sync perfecto")
        return 0

    print("\n--- DRIFT DETECTADO ---")
    if only_live:
        print(f"\n📤 ONLY IN LIVE (faltan en backup) — {len(only_live)}:")
        for f in sorted(only_live):
            print(f"   + {f}")
            if APPLY:
                src = live_files[f]
                dst = BACKUP / f
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, dst)
                print(f"     → copiado a backup")

    if only_backup:
        print(f"\n📥 ONLY IN BACKUP (faltan en live) — {len(only_backup)}:")
        for f in sorted(only_backup):
            print(f"   - {f}")
            if APPLY:
                src = backup_files[f]
                dst = LIVE / f
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, dst)
                print(f"     → copiado a live")

    print("\n" + "=" * 60)
    if APPLY:
        print("✅ Drift resuelto")
        return 0
    print("⚠️  Modo DRY-RUN — Ejecutar con --apply para corregir")
    return 1


if __name__ == "__main__":
    sys.exit(main())
