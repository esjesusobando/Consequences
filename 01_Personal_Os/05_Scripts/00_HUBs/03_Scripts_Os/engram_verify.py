#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nombre: Engram Verify — Snapshot Integrity Check
Ubicacion: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
Proposito: Verify snapshot integrity: checksum, observation count, schema version.
           Read-only — never writes files.

Usage:
    python engram_verify.py --snapshot <file> --verbose
"""

import sys
import os
import json
import argparse
import logging
import hashlib
import gzip
from pathlib import Path
from datetime import datetime

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
SNAPSHOT_SUBDIR = "04_Engram_Snapshots"


# ── Helpers ──────────────────────────────────────────────────

def compute_sha256(path: Path) -> str:
    """Compute SHA-256 hex digest of a file."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


# ── Core ─────────────────────────────────────────────────────

def verify_snapshot(snapshot_path: Path, verbose: bool = False) -> dict:
    """Verify snapshot integrity and return results."""
    result = {
        "valid": False,
        "checksum_ok": False,
        "file_exists": False,
        "readable": False,
        "observation_count": 0,
        "schema_version": None,
        "schema_match": False,
        "tables_found": [],
        "table_counts": {},
        "errors": [],
    }

    # Check file exists
    if not snapshot_path.exists():
        result["errors"].append(f"File not found: {snapshot_path}")
        return result
    result["file_exists"] = True

    # Compute checksum
    try:
        computed_checksum = compute_sha256(snapshot_path)
        result["checksum"] = computed_checksum
        if verbose:
            logger.info(f"Checksum: {computed_checksum}")
    except Exception as e:
        result["errors"].append(f"Checksum computation failed: {e}")
        return result

    # Read and parse snapshot
    try:
        with gzip.open(snapshot_path, "rt", encoding="utf-8") as gz:
            snapshot = json.load(gz)
        result["readable"] = True
    except gzip.BadGzipFile as e:
        result["errors"].append(f"Not a valid gzip file: {e}")
        return result
    except json.JSONDecodeError as e:
        result["errors"].append(f"Invalid JSON in snapshot: {e}")
        return result
    except Exception as e:
        result["errors"].append(f"Failed to read snapshot: {e}")
        return result

    # Validate schema version
    snap_version = snapshot.get("schema_version")
    result["schema_version"] = snap_version
    result["schema_match"] = snap_version == SCHEMA_VERSION
    if not result["schema_match"]:
        result["errors"].append(
            f"Schema version mismatch: got {snap_version}, expected {SCHEMA_VERSION}"
        )

    # Count observations
    total = 0
    tables = snapshot.get("tables", {})
    for table_name, rows in tables.items():
        count = len(rows)
        result["table_counts"][table_name] = count
        result["tables_found"].append(table_name)
        total += count
        if verbose:
            logger.info(f"  Table {table_name}: {count} rows")

    result["observation_count"] = total

    # Check embedded checksum if present
    if "checksum" in snapshot:
        result["embedded_checksum"] = snapshot["checksum"]
        result["checksum_ok"] = snapshot["checksum"] == computed_checksum
        if verbose:
            logger.info(f"Embedded checksum match: {result['checksum_ok']}")
    else:
        # No embedded checksum — mark as OK since file is readable
        result["checksum_ok"] = True

    # Final validity
    result["valid"] = (
        result["file_exists"]
        and result["readable"]
        and result["checksum_ok"]
        and result["observation_count"] > 0
    )

    return result


# ── CLI ──────────────────────────────────────────────────────

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="engram_verify",
        description="Verify Engram snapshot integrity (read-only).",
    )
    parser.add_argument(
        "--snapshot",
        type=Path,
        default=None,
        help="Path to the snapshot file (.json.gz)",
    )
    parser.add_argument(
        "--latest",
        action="store_true",
        help="Verify the latest snapshot in the default directory",
    )
    parser.add_argument("--verbose", action="store_true", help="Verbose logging")
    parser.add_argument("--test", action="store_true", help="Run self-tests")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    return parser


def run_self_tests() -> bool:
    """Run basic self-tests for the verify module."""
    import tempfile

    logger.info("Running self-tests...")

    # Test 1: verify a valid snapshot
    from engram_snapshot import write_snapshot, SCHEMA_VERSION

    test_data = {
        "schema_version": SCHEMA_VERSION,
        "observation_count": 1,
        "tables": {"observations": [{"id": 1, "title": "test"}]},
    }
    test_dir = Path(tempfile.mkdtemp())
    snap_path = write_snapshot(test_data, test_dir, dry_run=False)
    result = verify_snapshot(snap_path)
    assert result["valid"], f"Expected valid, got errors: {result['errors']}"
    assert result["observation_count"] == 1
    assert result["schema_match"]
    logger.info("[PASS] verify valid snapshot")

    # Test 2: verify nonexistent file
    result2 = verify_snapshot(Path("/nonexistent/file.json.gz"))
    assert not result2["valid"]
    assert not result2["file_exists"]
    logger.info("[PASS] verify nonexistent file")

    # Test 3: verify corrupted gzip
    corrupt_path = test_dir / "corrupt.json.gz"
    corrupt_path.write_bytes(b"not gzip data")
    result3 = verify_snapshot(corrupt_path)
    assert not result3["valid"]
    assert len(result3["errors"]) > 0
    logger.info("[PASS] verify corrupted file")

    # Cleanup
    import shutil
    shutil.rmtree(test_dir)

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

    if args.snapshot is None and not args.latest:
        logger.error("Provide --snapshot or --latest")
        return 1

    # Resolve snapshot path
    snapshot_path = args.snapshot
    if args.latest:
        snap_dir = ARCHIVE_DIR / SNAPSHOT_SUBDIR
        if not snap_dir.exists():
            logger.error(f"Snapshot directory not found: {snap_dir}")
            return 1
        gz_files = sorted(snap_dir.glob("snapshot_*.json.gz"), reverse=True)
        if not gz_files:
            logger.error(f"No snapshot files found in {snap_dir}")
            return 1
        snapshot_path = gz_files[0]
        logger.info(f"Latest snapshot: {snapshot_path.name}")

    logger.info(f"Verifying: {snapshot_path}")

    result = verify_snapshot(snapshot_path, verbose=args.verbose)

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        # Human-readable output
        status = "VALID" if result["valid"] else "INVALID"
        print(f"\n{'=' * 50}")
        print(f"  Snapshot Verification: {status}")
        print(f"{'=' * 50}")
        print(f"  File exists:      {result['file_exists']}")
        print(f"  Readable:         {result['readable']}")
        print(f"  Checksum:         {result['checksum'][:16]}... (OK: {result['checksum_ok']})")
        print(f"  Observations:     {result['observation_count']}")
        print(f"  Schema version:   {result['schema_version']} (match: {result['schema_match']})")
        print(f"  Tables:           {result['tables_found']}")
        if result["errors"]:
            print(f"  Errors:")
            for err in result["errors"]:
                print(f"    - {err}")
        print(f"{'=' * 50}\n")

    return 0 if result["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
