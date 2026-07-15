#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nombre: Engram Restore — Disaster Recovery Restore
Ubicacion: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
Proposito: Restore Engram observations from a gzip-compressed JSON snapshot
           with merge or replace strategy and post-verification.

Usage:
    python engram_restore.py --snapshot <file> --strategy merge --dry-run --verbose
"""

import sys
import os
import json
import argparse
import logging
import hashlib
import gzip
import sqlite3
import shutil
from pathlib import Path
from datetime import datetime, timezone

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, ARCHIVE_DIR

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

# Columns that should NOT be restored (derived/computed)
SKIP_RESTORE_COLUMNS = {"embedding", "embedding_model", "embedding_created_at"}


# ── Helpers ──────────────────────────────────────────────────

def compute_sha256(path: Path) -> str:
    """Compute SHA-256 hex digest of a file."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def read_snapshot(snapshot_path: Path) -> dict:
    """Read a gzipped JSON snapshot file."""
    if not snapshot_path.exists():
        raise FileNotFoundError(f"Snapshot file not found: {snapshot_path}")

    with gzip.open(snapshot_path, "rt", encoding="utf-8") as gz:
        return json.load(gz)


def backup_database(db_path: Path) -> Path:
    """Create a timestamped backup of the current database."""
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = db_path.parent / f"engram.db.pre-restore.{ts}"
    shutil.copy2(str(db_path), str(backup_path))
    logger.info(f"Database backup: {backup_path}")
    return backup_path


def check_schema_version(snapshot: dict) -> bool:
    """Check schema version compatibility."""
    snap_version = snapshot.get("schema_version", "unknown")
    if snap_version != SCHEMA_VERSION:
        logger.warning(
            f"Schema version mismatch: snapshot={snap_version}, expected={SCHEMA_VERSION}"
        )
        return False
    return True


# ── Restore Strategies ───────────────────────────────────────

def restore_merge(
    conn: sqlite3.Connection,
    snapshot: dict,
    dry_run: bool = False,
    verbose: bool = False,
) -> dict:
    """Merge strategy: insert new rows, skip existing by (session_id, type, title) hash."""
    stats = {"inserted": 0, "skipped": 0, "errors": 0}
    cursor = conn.cursor()

    for table_name, rows in snapshot.get("tables", {}).items():
        if not rows:
            continue

        # Get existing table columns
        try:
            cursor.execute(f"PRAGMA table_info({table_name})")
            existing_cols = {r[1] for r in cursor.fetchall()}
        except sqlite3.OperationalError:
            logger.warning(f"Table {table_name} not found in database, skipping")
            stats["errors"] += len(rows)
            continue

        # Filter to columns that exist in both snapshot and schema
        for row in rows:
            cols = [c for c in row.keys() if c in existing_cols and c not in SKIP_RESTORE_COLUMNS]
            if not cols:
                stats["skipped"] += 1
                continue

            placeholders = ", ".join(["?" for _ in cols])
            col_names = ", ".join(cols)
            values = [row[c] for c in cols]

            # Check if row exists (for observations: by id; for others: by content hash)
            if table_name == "observations" and "id" in row:
                cursor.execute(
                    f"SELECT 1 FROM {table_name} WHERE id = ?", (row["id"],)
                )
                if cursor.fetchone():
                    stats["skipped"] += 1
                    if verbose:
                        logger.debug(f"Skip existing {table_name} id={row['id']}")
                    continue
            elif table_name == "sessions" and "id" in row:
                cursor.execute(
                    f"SELECT 1 FROM {table_name} WHERE id = ?", (row["id"],)
                )
                if cursor.fetchone():
                    stats["skipped"] += 1
                    continue
            elif table_name == "user_prompts" and "session_id" in row and "content" in row:
                content_hash = hashlib.sha256(
                    (row.get("content", "") + row.get("session_id", "")).encode()
                ).hexdigest()
                cursor.execute(
                    f"SELECT 1 FROM {table_name} WHERE session_id = ? AND content = ?",
                    (row["session_id"], row["content"]),
                )
                if cursor.fetchone():
                    stats["skipped"] += 1
                    continue
            elif table_name == "memory_relations" and "id" in row:
                cursor.execute(
                    f"SELECT 1 FROM {table_name} WHERE id = ?", (row["id"],)
                )
                if cursor.fetchone():
                    stats["skipped"] += 1
                    continue

            if not dry_run:
                try:
                    cursor.execute(
                        f"INSERT INTO {table_name} ({col_names}) VALUES ({placeholders})",
                        values,
                    )
                    stats["inserted"] += 1
                except sqlite3.Error as e:
                    stats["errors"] += 1
                    logger.debug(f"Insert error on {table_name}: {e}")
            else:
                stats["inserted"] += 1

    if not dry_run:
        conn.commit()
    return stats


def restore_replace(
    conn: sqlite3.Connection,
    snapshot: dict,
    dry_run: bool = False,
    verbose: bool = False,
) -> dict:
    """Replace strategy: clear and reload all tables."""
    stats = {"inserted": 0, "cleared": 0, "errors": 0}
    cursor = conn.cursor()

    for table_name, rows in snapshot.get("tables", {}).items():
        if not rows:
            continue

        # Get existing table columns
        try:
            cursor.execute(f"PRAGMA table_info({table_name})")
            existing_cols = {r[1] for r in cursor.fetchall()}
        except sqlite3.OperationalError:
            logger.warning(f"Table {table_name} not found in database, skipping")
            stats["errors"] += len(rows)
            continue

        if not dry_run:
            try:
                cursor.execute(f"DELETE FROM {table_name}")
                stats["cleared"] += cursor.rowcount
                if verbose:
                    logger.info(f"Cleared {stats['cleared']} rows from {table_name}")
            except sqlite3.Error as e:
                logger.error(f"Failed to clear {table_name}: {e}")
                stats["errors"] += 1
                continue

        for row in rows:
            cols = [c for c in row.keys() if c in existing_cols and c not in SKIP_RESTORE_COLUMNS]
            if not cols:
                continue

            placeholders = ", ".join(["?" for _ in cols])
            col_names = ", ".join(cols)
            values = [row[c] for c in cols]

            if not dry_run:
                try:
                    cursor.execute(
                        f"INSERT INTO {table_name} ({col_names}) VALUES ({placeholders})",
                        values,
                    )
                    stats["inserted"] += 1
                except sqlite3.Error as e:
                    stats["errors"] += 1
                    logger.debug(f"Insert error on {table_name}: {e}")
            else:
                stats["inserted"] += 1

    if not dry_run:
        conn.commit()
    return stats


def post_verify(conn: sqlite3.Connection, snapshot: dict, verbose: bool = False) -> dict:
    """Post-restore verification: count rows and compare."""
    verification = {"match": True, "details": {}}
    cursor = conn.cursor()

    for table_name, snap_rows in snapshot.get("tables", {}).items():
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            db_count = cursor.fetchone()[0]
            snap_count = len(snap_rows)
            match = db_count >= snap_count
            verification["details"][table_name] = {
                "db_count": db_count,
                "snapshot_count": snap_count,
                "match": match,
            }
            if not match:
                verification["match"] = False
                logger.warning(
                    f"Post-verify FAIL: {table_name} db={db_count} < snapshot={snap_count}"
                )
            elif verbose:
                logger.info(
                    f"Post-verify OK: {table_name} db={db_count} >= snapshot={snap_count}"
                )
        except sqlite3.OperationalError:
            verification["details"][table_name] = {"error": "table not found"}
            verification["match"] = False

    return verification


# ── CLI ──────────────────────────────────────────────────────

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="engram_restore",
        description="Restore Engram observations from a disaster recovery snapshot.",
    )
    parser.add_argument(
        "--snapshot",
        type=Path,
        default=None,
        help="Path to the snapshot file (.json.gz)",
    )
    parser.add_argument(
        "--strategy",
        choices=["merge", "replace"],
        default="merge",
        help="Restore strategy: merge (add new, skip existing) or replace (overwrite all)",
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
    parser.add_argument(
        "--no-backup",
        action="store_true",
        help="Skip database backup before restore",
    )
    return parser


def run_self_tests() -> bool:
    """Run basic self-tests for the restore module."""
    import tempfile

    logger.info("Running self-tests...")

    # Test 1: read_snapshot from a synthetic gzip
    from engram_snapshot import write_snapshot, SCHEMA_VERSION

    test_snapshot = {
        "schema_version": SCHEMA_VERSION,
        "observation_count": 2,
        "tables": {
            "observations": [
                {"id": 1, "title": "test", "content": "hello", "type": "manual"},
                {"id": 2, "title": "test2", "content": "world", "type": "manual"},
            ],
            "sessions": [],
        },
    }
    test_dir = Path(tempfile.mkdtemp())
    snap_path = write_snapshot(test_snapshot, test_dir, dry_run=False)
    loaded = read_snapshot(snap_path)
    assert loaded["observation_count"] == 2
    assert len(loaded["tables"]["observations"]) == 2
    logger.info("[PASS] read_snapshot roundtrip")
    shutil.rmtree(test_dir)

    # Test 2: check_schema_version
    assert check_schema_version({"schema_version": SCHEMA_VERSION})
    assert not check_schema_version({"schema_version": "99.0.0"})
    logger.info("[PASS] check_schema_version")

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

    if args.snapshot is None:
        logger.error("--snapshot is required (unless using --test)")
        return 1

    logger.info(f"Engram Restore — Strategy: {args.strategy}")

    # Read snapshot
    try:
        snapshot = read_snapshot(args.snapshot)
    except FileNotFoundError as e:
        logger.error(str(e))
        return 1
    except Exception as e:
        logger.error(f"Failed to read snapshot: {e}")
        return 1

    # Schema version check
    if not check_schema_version(snapshot):
        logger.error(
            "Schema version mismatch. Use --verbose for details. "
            "Restore may proceed but could cause issues."
        )
        # Continue anyway — user may want to force

    obs_count = snapshot.get("observation_count", 0)
    logger.info(
        f"Snapshot contains {obs_count} observations across "
        f"{len(snapshot.get('tables', {}))} tables"
    )

    # Check database exists
    if not args.db.exists():
        logger.error(f"Database not found: {args.db}")
        return 1

    # Backup
    if not args.dry_run and not args.no_backup:
        try:
            backup_database(args.db)
        except Exception as e:
            logger.error(f"Backup failed: {e}")
            return 1

    # Connect and restore
    try:
        conn = sqlite3.connect(str(args.db))
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        return 1

    try:
        if args.strategy == "merge":
            stats = restore_merge(conn, snapshot, dry_run=args.dry_run, verbose=args.verbose)
        else:
            stats = restore_replace(conn, snapshot, dry_run=args.dry_run, verbose=args.verbose)
    except Exception as e:
        logger.error(f"Restore failed: {e}")
        conn.close()
        return 1

    logger.info(
        f"Restore stats: inserted={stats.get('inserted', 0)}, "
        f"skipped={stats.get('skipped', stats.get('cleared', 0))}, "
        f"errors={stats.get('errors', 0)}"
    )

    # Post-verify
    if not args.dry_run:
        verification = post_verify(conn, snapshot, verbose=args.verbose)
        if verification["match"]:
            logger.info("Post-verification PASSED")
        else:
            logger.warning("Post-verification FAILED — check details with --verbose")

    conn.close()

    if args.dry_run:
        logger.info("[DRY-RUN] Restore preview complete. No changes made.")
    else:
        logger.info("Restore complete.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
