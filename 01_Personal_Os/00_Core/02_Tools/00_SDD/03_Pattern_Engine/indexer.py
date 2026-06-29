"""
indexer.py — Script Scanner and Indexer
=====================================
Scans PersonalOS for Python scripts and builds the embedding index.
Supports incremental updates via hash checking.
"""

import hashlib
import logging
import time
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple, Optional, Set

import database as db

logger = logging.getLogger(__name__)

# Base directories to scan
SCRIPT_DIRECTORIES = [
    Path("01_Personal_Os/05_Scripts/03_Scripts_Os"),
    Path("01_Personal_Os/00_Core/02_Tools/02_Skills"),
]

# Patterns to exclude
EXCLUDE_DIRS = {
    "__pycache__",
    ".git",
    "10_Legacy",       # Deprecated scripts
    "node_modules",
    ".venv",
    "venv",
}

EXCLUDE_FILES = {
    "setup.py",
    "conftest.py",
    "__init__.py",     # Usually empty or minimal
    "test_*.py",
    "*_test.py",
}


def should_exclude(path: Path) -> bool:
    """Check if a path should be excluded from indexing."""
    parts = path.parts

    # Exclude certain directories
    for exclude in EXCLUDE_DIRS:
        if exclude in parts:
            return True

    # Exclude certain files
    for exclude in EXCLUDE_FILES:
        if path.match(exclude):
            return True

    # Must be a Python file
    if path.suffix != ".py":
        return True

    return False


def scan_for_scripts(base_path: Optional[Path] = None) -> List[Path]:
    """Find all Python scripts in the configured directories."""
    if base_path is None:
        base_path = Path(".").resolve()

    scripts = []
    for script_dir in SCRIPT_DIRECTORIES:
        full_dir = base_path / script_dir
        if not full_dir.exists():
            logger.warning(f"Script directory not found: {full_dir}")
            continue

        for path in full_dir.rglob("*.py"):
            if should_exclude(path):
                continue
            scripts.append(path)

    return scripts


def get_script_metadata(script_path: Path) -> Dict:
    """Extract metadata from a Python script.

    Returns dict with:
    - lines_of_code: total non-empty lines
    - last_modified: file modification time
    - code_hash: SHA256 hash of content
    """
    try:
        stat = script_path.stat()
        last_modified = datetime.fromtimestamp(stat.st_mtime)
        lines_of_code = len([
            line for line in script_path.read_text(encoding="utf-8").splitlines()
            if line.strip()
        ])
    except Exception as e:
        logger.warning(f"Could not read {script_path}: {e}")
        last_modified = datetime.now()
        lines_of_code = 0

    code_hash = db.compute_code_hash(script_path)

    return {
        "lines_of_code": lines_of_code,
        "last_modified": last_modified,
        "code_hash": code_hash,
    }


def index_scripts(scripts: List[Path], force: bool = False) -> Dict:
    """Index a list of scripts.

    Args:
        scripts: List of script paths to index
        force: If True, re-index even if hash unchanged

    Returns:
        dict with: indexed, skipped, errors
    """
    from embedding import generate_script_embedding, extract_tags_from_path

    results = {"indexed": 0, "skipped": 0, "errors": []}
    total = len(scripts)

    for i, script_path in enumerate(scripts):
        try:
            # Get metadata
            meta = get_script_metadata(script_path)

            # Check if already indexed and unchanged
            existing = db.get_script_by_path(script_path)
            if existing and not force:
                if existing["code_hash"] == meta["code_hash"]:
                    results["skipped"] += 1
                    continue

            # Generate embedding + description
            embedding, description = generate_script_embedding(script_path)

            # Extract tags
            tags = extract_tags_from_path(script_path)

            # Insert into database
            script_id = db.insert_script(
                path=script_path,
                name=script_path.name,
                description=description,
                code_hash=meta["code_hash"],
                lines_of_code=meta["lines_of_code"],
                last_modified=meta["last_modified"]
            )

            # Store embedding
            db.insert_embedding(script_id, embedding)

            # Store tags
            if tags:
                db.insert_tags(script_id, tags)

            results["indexed"] += 1

            if (i + 1) % 20 == 0:
                logger.info(f"Indexed {i + 1}/{total} scripts...")

        except Exception as e:
            logger.error(f"Error indexing {script_path}: {e}")
            results["errors"].append((str(script_path), str(e)))

    return results


def full_scan(base_path: Optional[Path] = None, force: bool = False) -> Dict:
    """Perform a full scan and index of all scripts.

    Returns:
        dict with: indexed, skipped, total_time, script_count
    """
    start = time.time()

    # Initialize DB
    db.init_db()

    # Scan for scripts
    scripts = scan_for_scripts(base_path)

    # Index them
    results = index_scripts(scripts, force=force)

    elapsed = time.time() - start

    # Update meta
    db.set_meta("last_full_scan", datetime.now().isoformat())
    db.set_meta("total_scripts", str(len(scripts)))

    return {
        "indexed": results["indexed"],
        "skipped": results["skipped"],
        "errors": results["errors"],
        "total_time": f"{elapsed:.1f}s",
        "script_count": len(scripts),
    }


def incremental_update(base_path: Optional[Path] = None) -> Dict:
    """Update index with only changed scripts since last scan.

    Detects changes via:
    - File hash (content changed)
    - File mtime (moved or new)
    """
    start = time.time()

    # Ensure DB exists
    if not db.db_exists():
        logger.info("No index found, performing full scan...")
        return full_scan(base_path, force=True)

    # Scan current scripts
    scripts = scan_for_scripts(base_path)
    script_paths = {s for s in scripts}

    # Get already indexed scripts
    indexed = db.get_all_scripts()
    indexed_paths = {Path(s["path"]) for s in indexed}

    # Detect new or modified scripts
    new_or_modified = []
    for script_path in scripts:
        existing = db.get_script_by_path(script_path)
        if existing is None:
            new_or_modified.append(script_path)
            continue

        # Check hash
        current_hash = db.compute_code_hash(script_path)
        if current_hash != existing["code_hash"]:
            new_or_modified.append(script_path)

    # Detect deleted scripts (in DB but not on disk)
    deleted = []
    for indexed_script in indexed:
        indexed_path = Path(indexed_script["path"])
        if indexed_path not in script_paths:
            deleted.append(indexed_script["id"])

    # Remove deleted scripts from DB
    for script_id in deleted:
        db.delete_script(script_id)
        logger.info(f"Removed deleted script from index: id={script_id}")

    # Index new/modified
    results = index_scripts(new_or_modified, force=True)

    elapsed = time.time() - start

    return {
        "updated": results["indexed"],
        "removed": len(deleted),
        "unchanged": len(scripts) - len(new_or_modified),
        "errors": results["errors"],
        "total_time": f"{elapsed:.1f}s",
    }


# CLI entry point
def main():
    import argparse
    import sys

    parser = argparse.ArgumentParser(description="Pattern Intelligence Indexer")
    parser.add_argument("--scan", action="store_true", help="Full scan and rebuild index")
    parser.add_argument("--update", action="store_true", help="Incremental update")
    parser.add_argument("--force", action="store_true", help="Force re-index even if unchanged")
    parser.add_argument("--base-path", type=str, help="Base path for scan (default: current dir)")

    args = parser.parse_args()

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s"
    )

    base = Path(args.base_path) if args.base_path else None

    if args.scan:
        result = full_scan(base, force=args.force)
        print(f"\n✅ Scan complete:")
        print(f"   Indexed: {result['indexed']}")
        print(f"   Skipped: {result['skipped']}")
        print(f"   Scripts: {result['script_count']}")
        print(f"   Time: {result['total_time']}")
        if result['errors']:
            print(f"   Errors: {len(result['errors'])}")
            for path, err in result['errors'][:5]:
                print(f"      {path}: {err}")
    elif args.update:
        result = incremental_update(base)
        print(f"\n✅ Update complete:")
        print(f"   Updated: {result['updated']}")
        print(f"   Removed: {result['removed']}")
        print(f"   Unchanged: {result['unchanged']}")
        print(f"   Time: {result['total_time']}")
        if result['errors']:
            print(f"   Errors: {len(result['errors'])}")
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()