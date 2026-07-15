#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nombre: Engram Snapshot — Disaster Recovery Export
Ubicacion: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
Proposito: Export all Engram observations to a gzip-compressed JSON snapshot
           with SHA-256 checksum for disaster recovery.

Usage:
    python engram_snapshot.py --output-dir <path> --dry-run --verbose
"""

import sys
import os
import json
import argparse
import logging
import hashlib
import gzip
import sqlite3
import tempfile
from pathlib import Path
from datetime import datetime, timezone

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, ARCHIVE_DIR, CACHE_DIR

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%H:%M:%S',
)
logger = logging.getLogger(__name__)

# ── Constants ────────────────────────────────────────────────

SCHEMA_VERSION = "1.0.0"
ENGRAM_DB = Path.home() / ".engram" / "engram.db"
SNAPSHOT_SUBDIR = "04_Engram_Snapshots"
STATE_FILE_NAME = "engram_snapshot_state.json"

# Tables to export (ordered by dependency)
EXPORT_TABLES = ["sessions", "observations", "user_prompts", "memory_relations"]
SKIP_COLUMNS = {"embedding"}  # BLOB columns too large for JSON


# ── Helpers ──────────────────────────────────────────────────

def safe_json_write(data: dict, path: Path) -> None:
    """Atomic JSON write — writes to temp file then renames."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(".tmp")
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        tmp_path.replace(path)
        logger.debug(f"Wrote {path}")
    except OSError as e:
        logger.error(f"Failed to write {path}: {e}")
        raise


def compute_sha256(path: Path) -> str:
    """Compute SHA-256 hex digest of a file."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def table_row_to_dict(cursor: sqlite3.Cursor, row: sqlite3.Row) -> dict:
    """Convert a sqlite3.Row to a dict, skipping BLOB columns."""
    cols = [desc[0] for desc in cursor.description]
    return {
        col: row[i]
        for i, col in enumerate(cols)
        if col not in SKIP_COLUMNS and row[i] is not None
    }


# ── Core ─────────────────────────────────────────────────────

def read_observations(db_path: Path, verbose: bool = False) -> dict:
    """Read all observations from the Engram SQLite database."""
    if not db_path.exists():
        raise FileNotFoundError(f"Engram database not found: {db_path}")

    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    snapshot = {
        "schema_version": SCHEMA_VERSION,
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "source": str(db_path),
        "tables": {},
    }

    for table in EXPORT_TABLES:
        try:
            cursor.execute(f"SELECT * FROM {table}")
            rows = cursor.fetchall()
            snapshot["tables"][table] = [table_row_to_dict(cursor, r) for r in rows]
            if verbose:
                logger.info(f"Exported {len(rows)} rows from {table}")
        except sqlite3.OperationalError as e:
            logger.warning(f"Table {table} not accessible: {e}")
            snapshot["tables"][table] = []

    # Compute totals
    total = sum(len(rows) for rows in snapshot["tables"].values())
    snapshot["observation_count"] = total
    snapshot["table_counts"] = {
        name: len(rows) for name, rows in snapshot["tables"].items()
    }

    conn.close()
    return snapshot


def write_snapshot(snapshot: dict, output_dir: Path, dry_run: bool = False) -> Path:
    """Write snapshot to gzip-compressed JSON. Returns snapshot path."""
    import time

    ts = datetime.now().strftime("%Y-%m-%d_%H%M%S")
    filename = f"snapshot_{ts}.json.gz"
    output_dir.mkdir(parents=True, exist_ok=True)
    snapshot_path = output_dir / filename

    if dry_run:
        logger.info(f"[DRY-RUN] Would write snapshot to: {snapshot_path}")
        logger.info(
            f"[DRY-RUN] Observations: {snapshot.get('observation_count', 0)}"
        )
        logger.info(
            f"[DRY-RUN] Tables: {list(snapshot.get('table_counts', {}).keys())}"
        )
        return snapshot_path

    # Atomic write: compress to temp file, then rename
    # On Windows, gzip may hold the file briefly after close — retry replace.
    tmp_fd, tmp_path_str = tempfile.mkstemp(suffix=".gz.tmp", dir=str(output_dir))
    tmp_path = Path(tmp_path_str)
    os.close(tmp_fd)  # Close the fd from mkstemp; gzip.open will reopen

    try:
        with gzip.open(tmp_path, "wt", encoding="utf-8") as gz:
            json.dump(snapshot, gz, indent=2, ensure_ascii=False)
            gz.write("\n")
        # Ensure file is fully written and closed before rename
        for attempt in range(5):
            try:
                tmp_path.replace(snapshot_path)
                break
            except PermissionError:
                if attempt < 4:
                    time.sleep(0.1 * (attempt + 1))
                else:
                    raise
        logger.info(f"Snapshot written: {snapshot_path}")
    except OSError as e:
        if tmp_path.exists():
            try:
                tmp_path.unlink()
            except OSError:
                pass
        raise RuntimeError(f"Failed to write snapshot: {e}")

    return snapshot_path


def save_state(
    snapshot_path: Path,
    checksum: str,
    observation_count: int,
    output_dir: Path,
    dry_run: bool = False,
) -> None:
    """Save snapshot state file with metadata."""
    state = {
        "last_snapshot": str(snapshot_path),
        "last_snapshot_file": snapshot_path.name,
        "checksum": checksum,
        "observation_count": observation_count,
        "schema_version": SCHEMA_VERSION,
        "snapshot_at": datetime.now(timezone.utc).isoformat(),
    }

    if dry_run:
        logger.info(f"[DRY-RUN] State: {json.dumps(state, indent=2)}")
        return

    state_path = output_dir / STATE_FILE_NAME
    safe_json_write(state, state_path)
    logger.info(f"State saved: {state_path}")


# ── CLI ──────────────────────────────────────────────────────

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="engram_snapshot",
        description="Export Engram observations to a disaster recovery snapshot.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=ARCHIVE_DIR / SNAPSHOT_SUBDIR,
        help="Directory to save the snapshot (default: 07_Archive/04_Engram_Snapshots/)",
    )
    parser.add_argument(
        "--db",
        type=Path,
        default=ENGRAM_DB,
        help="Path to the Engram SQLite database",
    )
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing")
    parser.add_argument("--verbose", action="store_true", help="Verbose logging")
    parser.add_argument("--test", action="store_true", help="Run self-tests")
    return parser


def run_self_tests() -> bool:
    """Run basic self-tests for the snapshot module."""
    import tempfile

    logger.info("Running self-tests...")

    # Test 1: compute_sha256
    test_data = b"hello world"
    test_path = Path(tempfile.mktemp(suffix=".txt"))
    test_path.write_bytes(test_data)
    digest = compute_sha256(test_path)
    assert digest == "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
    test_path.unlink()
    logger.info("[PASS] compute_sha256")

    # Test 2: safe_json_write
    test_json = Path(tempfile.mktemp(suffix=".json"))
    safe_json_write({"test": True, "count": 42}, test_json)
    with open(test_json) as f:
        loaded = json.load(f)
    assert loaded == {"test": True, "count": 42}
    test_json.unlink()
    logger.info("[PASS] safe_json_write")

    # Test 3: write_snapshot (dry-run)
    test_output = Path(tempfile.mkdtemp()) / "test_snapshots"
    snapshot_data = {
        "schema_version": SCHEMA_VERSION,
        "observation_count": 0,
        "tables": {},
    }
    snap_path = write_snapshot(snapshot_data, test_output, dry_run=True)
    assert not snap_path.exists()
    logger.info("[PASS] write_snapshot dry-run")

    logger.info("All self-tests passed.")
    return True


# ── Main ─────────────────────────────────────────────────────

def main() -> int:
    args = build_parser().parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    if args.test:
        ok = run_self_tests()
        return 0 if ok else 1

    logger.info("Engram Snapshot — Starting export")

    # Read from database
    try:
        snapshot = read_observations(args.db, verbose=args.verbose)
    except FileNotFoundError as e:
        logger.error(f"Database not found: {e}")
        return 1
    except Exception as e:
        logger.error(f"Failed to read database: {e}")
        return 1

    obs_count = snapshot.get("observation_count", 0)
    logger.info(f"Read {obs_count} observations from {len(EXPORT_TABLES)} tables")

    # Write snapshot
    snapshot_path = write_snapshot(snapshot, args.output_dir, dry_run=args.dry_run)

    if not args.dry_run:
        # Compute checksum
        checksum = compute_sha256(snapshot_path)
        logger.info(f"Checksum: {checksum[:16]}...")
        save_state(snapshot_path, checksum, obs_count, args.output_dir, dry_run=False)
        logger.info("Snapshot complete.")
    else:
        logger.info("[DRY-RUN] Snapshot preview complete. No files written.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
