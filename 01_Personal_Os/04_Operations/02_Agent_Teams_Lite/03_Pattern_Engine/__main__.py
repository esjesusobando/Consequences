"""
__main__.py — CLI Entry Point for Pattern Intelligence Engine
============================================================
Usage:
    python -m pattern_engine --scan
    python -m pattern_engine --update
    python -m pattern_engine --register path/to/script.py
    python -m pattern_engine --search "query text"
    python -m pattern_engine --stats
"""

import argparse
import logging
import sys
import os
from pathlib import Path

# Fix Windows console encoding for emoji output
if sys.platform == "win32":
    os.environ["PYTHONIOENCODING"] = "utf-8"
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

from api import (
    find_similar_scripts,
    register_script,
    update_index,
    scan_scripts,
    get_index_stats,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger(__name__)


def cmd_scan(args):
    """Handle --scan command."""
    base = Path(args.base_path) if args.base_path else None
    result = scan_scripts(base)

    print("\n" + "=" * 50)
    print("  PATTERN INTELLIGENCE -- SCAN COMPLETE")
    print("=" * 50)
    print(f"  [OK] Indexed:   {result['indexed']}")
    print(f"  [->] Skipped:   {result['skipped']}")
    print(f"  [i] Scripts:   {result['script_count']}")
    print(f"  [*] Time:      {result['total_time']}")
    if result.get("errors"):
        print(f"  [X] Errors:    {len(result['errors'])}")
    print("=" * 50)

    if result.get("errors"):
        print("\nErrors:")
        for path, err in result["errors"][:5]:
            print(f"  • {path}: {err}")


def cmd_update(args):
    """Handle --update command."""
    result = update_index()

    print("\n" + "=" * 50)
    print("  PATTERN INTELLIGENCE -- UPDATE COMPLETE")
    print("=" * 50)
    print(f"  [OK] Updated:   {result['updated']}")
    print(f"  [X] Removed:   {result['removed']}")
    print(f"  [->] Unchanged:{result['unchanged']}")
    print(f"  [*] Time:      {result['total_time']}")
    print("=" * 50)


def cmd_register(args):
    """Handle --register command."""
    script_path = Path(args.script)
    if not script_path.exists():
        print(f"❌ Error: Script not found: {script_path}")
        sys.exit(1)

    try:
        desc = args.description if hasattr(args, "description") else None
        force = args.force if hasattr(args, "force") else False
        script_id = register_script(script_path, desc, force=force)
        print(f"✅ Registered: {script_path.name} (id={script_id})")
    except ValueError as e:
        print(f"⚠️  {e}")
        sys.exit(1)


def cmd_search(args):
    """Handle --search command."""
    query = args.search if isinstance(args.search, list) else [args.search]
    query_text = " ".join(query)

    results = find_similar_scripts(
        query=query_text,
        top_k=args.top_k,
        tags=args.tags.split(",") if args.tags else None,
        threshold=args.threshold
    )

    print("\n" + "=" * 50)
    print(f"  SEARCH: \"{query_text}\"")
    if args.tags:
        print(f"  Tags: {args.tags}")
    print("=" * 50)

    if not results:
        print("  No results found (threshold={})".format(args.threshold))
    else:
        for i, (path, score, description) in enumerate(results, 1):
            print(f"\n  {i}. [{score:.2f}] {path.name}")
            print(f"     {description[:100]}...")
            print(f"     {path}")

    print("\n" + "=" * 50)


def cmd_stats(args):
    """Handle --stats command."""
    stats = get_index_stats()

    print("\n" + "=" * 50)
    print("  PATTERN INTELLIGENCE -- INDEX STATS")
    print("=" * 50)
    print(f"  [i] Scripts:   {stats['script_count']}")
    print(f"  [i] Last scan: {stats['last_scan'] or 'Never'}")
    print(f"  [i] DB path:   {stats['db_path']}")
    print(f"  [OK] Healthy:  {'Yes' if stats['is_healthy'] else 'No'}")
    print("=" * 50)


def main():
    parser = argparse.ArgumentParser(
        description="Pattern Intelligence Engine — Semantic Script Search",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python -m pattern_engine --scan
  python -m pattern_engine --update
  python -m pattern_engine --search "auditor skill"
  python -m pattern_engine --register path/to/script.py
  python -m pattern_engine --stats
        """
    )

    parser.add_argument("--scan", action="store_true", help="Full scan and rebuild index")
    parser.add_argument("--update", action="store_true", help="Incremental update")
    parser.add_argument("--register", type=str, metavar="PATH", help="Register a new script")
    parser.add_argument("--search", nargs="+", metavar="QUERY", help="Search for scripts")
    parser.add_argument("--stats", action="store_true", help="Show index statistics")

    # --scan options
    parser.add_argument("--base-path", type=str, help="Base path for scan (default: current dir)")

    # --register options
    parser.add_argument("--description", type=str, help="Custom description for --register")
    parser.add_argument("--force", action="store_true", help="Force re-register if exists")

    # --search options
    parser.add_argument("--top-k", type=int, default=3, help="Number of results (default: 3)")
    parser.add_argument("--threshold", type=float, default=0.70, help="Minimum similarity (default: 0.70)")
    parser.add_argument("--tags", type=str, help="Comma-separated tags to filter by")

    args = parser.parse_args()

    # Default: show stats
    if not any([args.scan, args.update, args.register, args.search, args.stats]):
        args.stats = True

    if args.scan:
        cmd_scan(args)
    elif args.update:
        cmd_update(args)
    elif args.register:
        args.script = args.register
        cmd_register(args)
    elif args.search:
        cmd_search(args)
    elif args.stats:
        cmd_stats(args)


if __name__ == "__main__":
    main()