#!/usr/bin/env python3
"""sync_copies.py — Sync PersonalOS Copy B (canonical) → Copy A (mirror)

Detects dual PersonalOS copies, compares mapped files by SHA256, and syncs
B→A with dry-run or apply modes, safety backup, and strict exit-code contract.

Exit codes:
    0  — All files in sync (dry-run or apply with no drift)
    1  — Drift detected (dry-run only)
    2  — Changes applied (apply mode)
    3  — Error (detection failure, runtime error)
"""

import argparse
import hashlib
import shutil
import sys
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path
from typing import Literal

from os_errors import PersonalOSError
from path_guardian import resolve_os_root, detect_copy_type


# ── Detection ──────────────────────────────────────────

def detect_copy(script_dir: Path) -> Literal["A", "B"]:
    """Detect which PersonalOS copy the script runs from.

    Delegates to ``path_guardian.resolve_os_root()`` and
    ``path_guardian.detect_copy_type()`` for centralised path resolution.
    """
    personal_os = resolve_os_root(script_dir)
    copy_type = detect_copy_type(script_dir)
    if copy_type == "A":
        return "A"
    elif copy_type == "B":
        return "B"
    else:
        raise ValueError(f"Cannot detect copy type near {personal_os}")


# ── File Mapping ──────────────────────────────────────

# Key:   relative path within Copy B (canonical v5 structure)
# Value: equivalent relative path within Copy A (flat structure)
#
# To add more files, append entries here. The script will compare and sync
# every entry on every invocation.
FILE_PATHS: dict[str, str] = {
    # engine/config_paths.py → flat config_paths.py under Copy A's 05_Scripts/
    "05_Scripts/00_HUBs/03_Scripts_Os/config_paths.py":
        "05_Scripts/config_paths.py",
}


def resolve_roots(script_dir: Path, copy_type: str) -> tuple[Path, Path]:
    """Return ``(source_root, dest_root)`` based on detected copy type.

    For Copy B (the only valid run-from location):
        *source_root* — project root (parent of ``01_Personal_Os``, e.g. Think_Different/)
        *dest_root*   — ``$HOME/01_Personal_Os`` (Copy A mirror)

    For Copy A — raises ``RuntimeError``: sync is one-directional B→A.
    """
    if copy_type != "B":
        raise RuntimeError(
            "sync_copies.py must be run from Copy B (canonical). "
            "Sync is one-directional: B → A only."
        )

    personal_os = resolve_os_root(script_dir)
    src_root = personal_os.parent          # e.g. C:/Users/sebas/Desktop/Think_Different
    dest_root = Path.home() / "01_Personal_Os"  # e.g. C:/Users/sebas/01_Personal_Os
    return src_root, dest_root


# ── Core Logic ─────────────────────────────────────────

def sha256_file(path: Path) -> str:
    """Return hex SHA-256 digest of *path* contents (64 KB buffered, binary)."""
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


@dataclass
class Diff:
    """Result of comparing one mapped file pair between source and destination.

    Attributes:
        b_rel:  Relative path within Copy B (from FILE_PATHS key)
        a_rel:  Relative path within Copy A (from FILE_PATHS value)
        status: One of SYNCED | DRIFTED | MISSING_SRC | MISSING_DST
        b_hash: SHA-256 of source file (None if source missing)
        a_hash: SHA-256 of dest file   (None if dest missing)
    """
    b_rel: str
    a_rel: str
    status: Literal["SYNCED", "DRIFTED", "MISSING_SRC", "MISSING_DST"]
    b_hash: str | None = None
    a_hash: str | None = None


def compute_drift(src_root: Path, dest_root: Path) -> list[Diff]:
    """Compare every mapped file pair; return one ``Diff`` per entry."""
    src_os = src_root / "01_Personal_Os"
    dest_os = dest_root
    diffs: list[Diff] = []

    for b_rel, a_rel in FILE_PATHS.items():
        src_file = src_os / b_rel
        dest_file = dest_os / a_rel

        if not src_file.exists():
            diffs.append(Diff(b_rel=b_rel, a_rel=a_rel, status="MISSING_SRC"))
            continue

        b_hash = sha256_file(src_file)

        if not dest_file.exists():
            diffs.append(
                Diff(b_rel=b_rel, a_rel=a_rel, status="MISSING_DST", b_hash=b_hash)
            )
            continue

        a_hash = sha256_file(dest_file)
        status: Literal["SYNCED", "DRIFTED"] = (
            "SYNCED" if b_hash == a_hash else "DRIFTED"
        )
        diffs.append(Diff(b_rel=b_rel, a_rel=a_rel, status=status,
                         b_hash=b_hash, a_hash=a_hash))

    return diffs


def backup_file(path: Path, backup_dir: Path) -> Path:
    """Copy *path* into *backup_dir* (creating it if needed); return backup path."""
    backup_dir.mkdir(parents=True, exist_ok=True)
    dest = backup_dir / path.name
    shutil.copy2(path, dest)
    return dest


def sync_file(diff: Diff, src_root: Path, dest_root: Path,
              backup_dir: Path) -> None:
    """Backup destination (if it exists), then copy source → destination."""
    src_file = (src_root / "01_Personal_Os" / diff.b_rel)
    dest_file = (dest_root / diff.a_rel)

    if dest_file.exists():
        backup_file(dest_file, backup_dir)

    dest_file.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src_file, dest_file)


# ── CLI ────────────────────────────────────────────────

def _configure_stdio() -> None:
    """Configure stdout/stderr with ``errors='replace'`` for cp1252 safety."""
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(errors="replace")


def main() -> None:
    _configure_stdio()

    parser = argparse.ArgumentParser(
        description="Sync PersonalOS Copy B (canonical) → Copy A (mirror)"
    )
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--dry-run", action="store_true", default=True,
                       help="Report drift without making changes (default mode)")
    group.add_argument("--apply", action="store_true",
                       help="Actually sync files (creates timestamped backup)")
    args = parser.parse_args()

    # ── Detect copy type ──────────────────────────────────────────────────
    script_dir = Path(__file__).resolve().parent
    try:
        copy_type = detect_copy(script_dir)
    except (ValueError, PersonalOSError) as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        sys.exit(3)

    if copy_type != "B":
        print("[ERROR] This script must be run from Copy B (canonical).",
              file=sys.stderr)
        sys.exit(3)

    # ── Resolve roots ─────────────────────────────────────────────────────
    try:
        src_root, dest_root = resolve_roots(script_dir, copy_type)
    except (RuntimeError, PersonalOSError) as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        sys.exit(3)

    print(f"[INFO] Source (B): {src_root}", file=sys.stderr)
    print(f"[INFO] Dest   (A): {dest_root}", file=sys.stderr)

    # ── Compare ───────────────────────────────────────────────────────────
    diffs = compute_drift(src_root, dest_root)
    drifted = [d for d in diffs if d.status != "SYNCED"]

    # ── Apply mode ────────────────────────────────────────────────────────
    if args.apply:
        if not drifted:
            print("[OK] All files in sync — nothing to apply")
            sys.exit(0)

        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir = dest_root / f"sync_copies_backup_{ts}"

        for d in drifted:
            try:
                sync_file(d, src_root, dest_root, backup_dir)
            except Exception as exc:
                print(f"[ERROR] Failed to sync {d.b_rel}: {exc}",
                      file=sys.stderr)
                sys.exit(3)

        print(f"[OK] {len(drifted)} file(s) synced, backup at {backup_dir}")
        sys.exit(2)

    # ── Dry-run mode (default) ────────────────────────────────────────────
    if not drifted:
        print("[OK] All files in sync — exit 0")
        sys.exit(0)

    print(f"[WARN] {len(drifted)} file(s) drifted:")
    for d in drifted:
        if d.status == "MISSING_SRC":
            print(f"  {d.b_rel}: MISSING (source not found)")
        elif d.status == "MISSING_DST":
            print(f"  {d.b_rel}: MISSING (destination not found)")
        else:
            print(f"  {d.b_rel}: DIFFERENT (hash mismatch)")
    sys.exit(1)


if __name__ == "__main__":
    main()
