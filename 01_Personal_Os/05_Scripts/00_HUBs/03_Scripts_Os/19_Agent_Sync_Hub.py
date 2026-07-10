import logging
import typing

logging.basicConfig(level=logging.INFO)
#!/usr/bin/env python3
"""
19_Agent_Sync_Hub.py — PersonalOS v4.9 Consequences

Sincroniza .agent/ (backup) con 01_Personal_Os/00_Core/ (fuente de verdad).
Detecta drift y lo reporta. Modo --apply lo corrige.
Soporta trash retention: archivos eliminados se archivan con fecha (90 días).

Usage:
    python 19_Agent_Sync_Hub.py                       # Solo agents (dry-run)
    python 19_Agent_Sync_Hub.py --apply                # Solo agents (apply)
    python 19_Agent_Sync_Hub.py --all                  # Agents + Skills (dry-run)
    python 19_Agent_Sync_Hub.py --all --apply           # Agents + Skills (apply)
    python 19_Agent_Sync_Hub.py --trash-report         # Reporte de trash actual
"""

import io
import json
import shutil
import sys
from datetime import datetime, timedelta
from pathlib import Path

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# Path resolution via config_paths (v5.0 dynamic protocol)
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "00_Winter_is_Coming").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os"))
from config_paths import ROOT_DIR
REPO_ROOT: Path = ROOT_DIR

CORE = REPO_ROOT / "01_Personal_Os" / "00_Core" / "02_Tools"
BACKUP = REPO_ROOT / ".agent"
ARCHIVE = BACKUP / "archive"
TRASH_DAYS = 90  # Retention en días antes de purgar

# Pares de sync: (origen_relativo, nombre_visible)
SYNC_PAIRS = [
    ("01_Agents", "Agentes"),
    ("02_Skills", "Skills"),
]

APPLY = "--apply" in sys.argv
SYNC_ALL = "--all" in sys.argv
TRASH_REPORT = "--trash-report" in sys.argv


def collect_files(root):
    """Devuelve dict {relative_path: full_path} para todos los .md."""
    if not root.exists():
        return {}
    return {
        str(p.relative_to(root)).replace("\\", "/"): p
        for p in root.rglob("*.md")
        if p.is_file()
    }


def archive_deleted(backup_root, subdir, only_backup_files, backup_dict):
    """Archiva archivos que ya no existen en live con timestamp."""
    archived = []
    for rel_path in sorted(only_backup_files):
        src = backup_dict[rel_path]
        # Construir destino: .agent/archive/01_Agents/2026-06-01_relpath.md
        today = datetime.now().strftime("%Y-%m-%d")
        dst_dir = ARCHIVE / subdir / today
        dst = dst_dir / rel_path
        if APPLY:
            dst_dir.mkdir(parents=True, exist_ok=True)
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(src), str(dst))
            print(f"     → archivado en {dst.relative_to(REPO_ROOT)}")
        archived.append(rel_path)
    return archived


def purge_expired_trash():
    """Elimina archivos en archive/ con más de TRASH_DAYS días."""
    if not ARCHIVE.exists():
        return 0
    cutoff = datetime.now() - timedelta(days=TRASH_DAYS)
    purged = 0
    for subdir_dir in ARCHIVE.iterdir():
        if not subdir_dir.is_dir():
            continue
        for date_dir in subdir_dir.iterdir():
            if not date_dir.is_dir():
                continue
            try:
                file_date = datetime.strptime(date_dir.name, "%Y-%m-%d")
            except ValueError:
                continue
            for item in date_dir.rglob("*"):
                if item.is_file() and file_date < cutoff:
                    if APPLY:
                        item.unlink()
                    purged += 1
    # Limpiar directorios vacíos
    if APPLY:
        for d in sorted(ARCHIVE.rglob("*"), key=lambda p: len(str(p)), reverse=True):
            if d.is_dir() and not any(d.iterdir()):
                d.rmdir()
    return purged


def sync_pair(subdir, label):
    """Sincroniza un par live → backup."""
    live_dir = CORE / subdir
    backup_dir = BACKUP / subdir

    print(f"\n{'=' * 60}")
    print(f"  📂 {label}: {subdir}")
    print(f"  Live:   {live_dir.relative_to(REPO_ROOT)}")
    print(f"  Backup: {backup_dir.relative_to(REPO_ROOT)}")
    print(f"{'=' * 60}")

    if not live_dir.exists():
        print(f"❌ Live no existe: {live_dir}")
        return 1

    if not backup_dir.exists():
        print(f"⚠️  Backup no existe — creando...")
        if APPLY:
            shutil.copytree(live_dir, backup_dir)
            print("✅ Backup inicial creado")
            # Marcar como sync
            mark_synced(subdir, "initial_copy")
            return 0
        return 1

    live_files = collect_files(live_dir)
    backup_files = collect_files(backup_dir)

    only_live = set(live_files) - set(backup_files)
    only_backup = set(backup_files) - set(live_files)
    common = set(live_files) & set(backup_files)

    print(f"\n📊 Estado:")
    print(f"   Live:    {len(live_files)} archivos")
    print(f"   Backup:  {len(backup_files)} archivos")
    print(f"   Common:  {len(common)}")
    print(f"   Solo live (faltan en backup):  {len(only_live)}")
    print(f"   Solo backup (eliminados de live):  {len(only_backup)}")

    if not only_live and not only_backup:
        print("\n🎉 ZERO DRIFT — Sync perfecto")
        return 0

    print("\n--- DRIFT DETECTADO ---")

    if only_live:
        print(f"\n📤 SOLO LIVE (faltan en backup) — {len(only_live)}:")
        for f in sorted(only_live):
            print(f"   + {f}")
            if APPLY:
                src = live_files[f]
                dst = backup_dir / f
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, dst)
                print(f"     → copiado a backup")

    if only_backup:
        print(f"\n📥 SOLO BACKUP (eliminados de live) — {len(only_backup)}:")
        archived = archive_deleted(backup_dir, subdir, only_backup, backup_files)
        for f in archived:
            print(f"   - {f} (archivado)")
        if not APPLY:
            print(f"   → {len(archived)} archivos serán archivados con --apply")

    if APPLY and (only_live or only_backup):
        mark_synced(subdir, "sync")
        print(f"\n✅ {label}: drift resuelto")
    return 0


def mark_synced(subdir, action):
    """Marca en el manifest que este subdir fue sincronizado."""
    manifest_dir = REPO_ROOT / "01_Personal_Os" / "05_Scripts" / "02_Agent_Teams_Lite" / "00_Manifest"
    manifest_dir.mkdir(parents=True, exist_ok=True)
    sync_log = manifest_dir / "08_Sync_Log.json"

    record = {
        "subdir": subdir,
        "action": action,
        "timestamp": datetime.now().isoformat(),
        "applied": APPLY,
    }

    if sync_log.exists():
        try:
            with open(sync_log, "r", encoding="utf-8") as f:
                log = json.load(f)
        except (json.JSONDecodeError, Exception):
            log = []
    else:
        log = []

    log.append(record)
    with open(sync_log, "w", encoding="utf-8") as f:
        json.dump(log, f, indent=2, ensure_ascii=False)

    if APPLY:
        print(f"   📝 Sync log actualizado: 08_Sync_Log.json")


def trash_report():
    """Reporta el estado actual del trash (archive/)."""
    if not ARCHIVE.exists():
        print("\n📭 No hay archivos en trash (archive/ no existe)")
        return

    total = 0
    for subdir_dir in sorted(ARCHIVE.iterdir()):
        if not subdir_dir.is_dir():
            continue
        print(f"\n📂 {subdir_dir.name}/")
        for date_dir in sorted(subdir_dir.iterdir()):
            if not date_dir.is_dir():
                continue
            count = len(list(date_dir.rglob("*.md")))
            if count > 0:
                age = (datetime.now() - datetime.strptime(date_dir.name, "%Y-%m-%d")).days
                expiry = TRASH_DAYS - age
                status = f"⏳ expira en {expiry}d" if expiry > 0 else "🧹 LISTO PARA PURGAR"
                print(f"   {date_dir.name}: {count} archivos ({status})")
                total += count
    print(f"\n📊 Total en trash: {total} archivos (retención: {TRASH_DAYS} días)")


def main():
    print("\n" + "=" * 60)
    print("  AGENT SYNC HUB v2 — PersonalOS v4.9 Consequences")
    print(f"  Modo: {'APPLY' if APPLY else 'DRY-RUN'}")
    if SYNC_ALL:
        print("  Target: Agents + Skills")
    else:
        print("  Target: Agents (usa --all para incluir Skills)")
    print("=" * 60)

    # Filtrar pares según flag
    pairs = SYNC_PAIRS if SYNC_ALL else [SYNC_PAIRS[0]]

    # Fase 1: trash report si se pide
    if TRASH_REPORT:
        trash_report()
        print(f"\n💡 Para purgar: ejecutar con --apply (elimina archivos > {TRASH_DAYS}d)")
        return 0

    # Fase 2: purgar trash expirado
    if APPLY:
        purged = purge_expired_trash()
        if purged:
            print(f"\n🧹 Trash purgado: {purged} archivos eliminados (> {TRASH_DAYS} días)")
    else:
        print(f"\n💡 Trash retention: {TRASH_DAYS} días (usa --apply para purgar)")

    # Fase 3: sync por cada par
    exit_code = 0
    for subdir, label in pairs:
        result = sync_pair(subdir, label)
        if result != 0:
            exit_code = result

    # Resumen final
    print("\n" + "=" * 60)
    if APPLY:
        print(f"✅ Sync completo — backup actualizado")
    else:
        target = "Agents + Skills" if SYNC_ALL else "Agents"
        print(f"⚠️  DRY-RUN — Ejecutar con --apply para sync de {target}")
        print(f"   --all --apply para sync completo (Agents + Skills)")

    return exit_code


if __name__ == "__main__":
    sys.exit(main())
