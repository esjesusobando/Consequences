"""
api.py — Public API for Pattern Intelligence Engine
==================================================
Clean interface for find_similar_scripts, register_script, update_index.
"""

import logging
from pathlib import Path
from typing import List, Optional, Tuple

from search import find_similar_scripts as _find_similar_scripts, DEFAULT_THRESHOLD
import database as db
import indexer as idx

logger = logging.getLogger(__name__)


def find_similar_scripts(
    query: str,
    top_k: int = 3,
    tags: Optional[List[str]] = None,
    threshold: float = DEFAULT_THRESHOLD
) -> List[Tuple[Path, float, str]]:
    """Find scripts semantically similar to the query.

    Args:
        query: Textual description of the script you're looking for
        top_k: Maximum number of results to return
        tags: Optional list of tags to filter by (AND logic within hybrid search)
        threshold: Minimum similarity score (0.0-1.0)

    Returns:
        List of (script_path, similarity_score, match_reason) tuples.
        Empty list if no matches above threshold.

    Example:
        >>> find_similar_scripts("auditor skill validate")
        [
            (PosixPath('.../22_Validate_Skill_Frontmatter.py'), 0.87, "..."),
            (PosixPath('.../34_Skill_Auditor.py'), 0.72, "..."),
            (PosixPath('.../01_Auditor_Hub.py'), 0.68, "..."),
        ]
    """
    return _find_similar_scripts(query, top_k, tags, threshold)


def register_script(
    script_path: Path,
    description: Optional[str] = None,
    tags: Optional[List[Tuple[str, str]]] = None,
    force: bool = False
) -> int:
    """Register a new script in the index.

    Args:
        script_path: Absolute or relative path to the script
        description: Optional custom description (auto-generated if None)
        tags: Optional list of (tag, area) tuples
        force: Re-register even if already exists

    Returns:
        script_id of registered script

    Raises:
        FileNotFoundError: If the script file doesn't exist
        ValueError: If script already registered and force=False
    """
    if not script_path.exists():
        raise FileNotFoundError(f"Script not found: {script_path}")

    # Check if already registered
    existing = db.get_script_by_path(script_path)
    if existing and not force:
        raise ValueError(f"Script already registered: {script_path} (id={existing['id']})")

    # Import here to avoid circular dependency
    from embedding import generate_script_embedding, extract_tags_from_path

    # Auto-generate description if not provided
    if description is None:
        _, description = generate_script_embedding(script_path)

    # Get metadata
    meta = idx.get_script_metadata(script_path)

    # Auto-generate tags if not provided
    if tags is None:
        tags = extract_tags_from_path(script_path)

    # Delete existing if force
    if existing and force:
        db.delete_script(existing["id"])

    # Insert into database
    script_id = db.insert_script(
        path=script_path,
        name=script_path.name,
        description=description,
        code_hash=meta["code_hash"],
        lines_of_code=meta["lines_of_code"],
        last_modified=meta["last_modified"]
    )

    # Generate and store embedding
    embedding, _ = generate_script_embedding(script_path)
    db.insert_embedding(script_id, embedding)

    # Store tags
    if tags:
        db.insert_tags(script_id, tags)

    logger.info(f"Registered: {script_path.name} (id={script_id})")
    return script_id


def update_index(force: bool = False) -> dict:
    """Update the index incrementally.

    Args:
        force: If True, re-index all scripts regardless of changes

    Returns:
        dict with: updated, removed, unchanged, total_time, errors
    """
    if force:
        return idx.full_scan(force=True)

    return idx.incremental_update()


def scan_scripts(base_path: Optional[Path] = None) -> dict:
    """Perform a full scan and rebuild of the index.

    Args:
        base_path: Base path for scan (default: current directory)

    Returns:
        dict with: indexed, skipped, total_time, script_count, errors
    """
    return idx.full_scan(base_path, force=True)


def get_index_stats() -> dict:
    """Get statistics about the current index.

    Returns:
        dict with: script_count, last_scan, db_path, is_healthy
    """
    if not db.db_exists():
        return {
            "script_count": 0,
            "last_scan": None,
            "db_path": str(db.DB_PATH),
            "is_healthy": False,
            "error": "No index database found"
        }

    healthy = db.check_integrity()
    scripts = db.get_all_scripts()
    last_scan = db.get_meta("last_full_scan")

    return {
        "script_count": len(scripts),
        "last_scan": last_scan,
        "db_path": str(db.DB_PATH),
        "is_healthy": healthy,
        "total_errors": 0  # Could track this if needed
    }


if __name__ == "__main__":
    import argparse
    import sys

    parser = argparse.ArgumentParser(description="Pattern Intelligence API")
    sub = parser.add_subparsers(dest="cmd")

    sub.add_parser("scan", help="Full scan and rebuild index").add_argument("--base-path", type=str)
    sub.add_parser("update", help="Incremental update")
    sub.add_parser("stats", help="Show index statistics")

    reg = sub.add_parser("register", help="Register a new script")
    reg.add_argument("script", help="Path to script")
    reg.add_argument("--description", type=str, help="Custom description")
    reg.add_argument("--force", action="store_true", help="Re-register if exists")

    srch = sub.add_parser("search", help="Search for scripts")
    srch.add_argument("query", nargs="+", help="Search query")
    srch.add_argument("--top-k", type=int, default=3)
    srch.add_argument("--threshold", type=float, default=DEFAULT_THRESHOLD)

    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO)

    if args.cmd == "scan":
        base = Path(args.base_path) if args.base_path else None
        result = scan_scripts(base)
        print(f"Scan complete: {result}")
    elif args.cmd == "update":
        result = update_index()
        print(f"Update complete: {result}")
    elif args.cmd == "stats":
        stats = get_index_stats()
        print(f"Index stats: {stats}")
    elif args.cmd == "register":
        script_path = Path(args.script)
        desc = args.description
        result = register_script(script_path, desc, force=args.force)
        print(f"Registered script with id: {result}")
    elif args.cmd == "search":
        query = " ".join(args.query)
        results = find_similar_scripts(query, top_k=args.top_k, threshold=args.threshold)
        if results:
            for path, score, desc in results:
                print(f"[{score:.2f}] {path} - {desc[:60]}")
        else:
            print("No results found")
    else:
        parser.print_help()
        sys.exit(1)