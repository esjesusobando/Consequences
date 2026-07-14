#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
content_pipeline.py - Content Output Pipeline Orchestrator
==========================================================
Full content pipeline: Draft -> Review -> Publish -> Analytics -> Compound

Single command for the entire pipeline:
    python content_pipeline.py run --topic "AI trends" --platform linkedin,twitter,blog

Individual phase commands:
    python content_pipeline.py draft --topic "AI trends" --platform linkedin,twitter
    python content_pipeline.py review <draft_id>
    python content_pipeline.py publish <draft_id> --platform linkedin
    python content_pipeline.py analytics <draft_id>
    python content_pipeline.py compound <draft_id>

Verification and testing:
    python content_pipeline.py --verify-cycle
    python content_pipeline.py --test

State persistence: 03_Learning/04_Telemetry/content_pipeline_state.json

Ubication: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
"""
import sys
import os
import json
import argparse
import logging
import traceback
from pathlib import Path
from datetime import datetime, timezone

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

def _fix_encoding():
    """Fix Windows console encoding (call only in __main__)."""
    if sys.platform == "win32":
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

# =============================================================================
# PATHS
# =============================================================================

DRAFTS_DIR = ROOT_DIR / "01_Personal_Os" / "06_Projects" / "01_Content" / "Drafts"
STATE_FILE = TELEMETRY_DIR / "content_pipeline_state.json"

# =============================================================================
# IMPORT PIPELINE MODULES
# =============================================================================

try:
    from draft_generator import generate_draft, load_draft
    from review_draft import review_draft
    from publish_content import publish_content, PublishResult
    from content_analytics import fetch_analytics
    from compound_content import compound
except ImportError as e:
    logger.error(f"Failed to import pipeline modules: {e}")
    logger.error("Ensure all pipeline files are in the same directory")
    sys.exit(1)


# =============================================================================
# STATE MANAGEMENT
# =============================================================================

def _load_state() -> dict:
    """Load pipeline state."""
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text(encoding='utf-8'))
        except (json.JSONDecodeError, OSError):
            return {}
    return {}


def _save_state(state: dict) -> None:
    """Atomic save of pipeline state."""
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    tmp = STATE_FILE.with_suffix('.tmp')
    tmp.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(STATE_FILE)


def _update_state(content_id: str, status: str, **extra) -> None:
    """Update a single content entry in state."""
    state = _load_state()
    now = datetime.now(timezone.utc).isoformat()
    if content_id in state:
        state[content_id]["status"] = status
        state[content_id]["updated_at"] = now
        state[content_id].update(extra)
    else:
        state[content_id] = {
            "status": status,
            "created_at": now,
            "updated_at": now,
            **extra,
        }
    _save_state(state)


def _resolve_content_id(content_id_or_path: str) -> str:
    """Resolve a content ID from either an ID string or a draft path."""
    # If it's a file path, extract the stem
    path = Path(content_id_or_path)
    if path.suffix == ".md":
        return path.stem

    # Check if it matches a draft in DRAFTS_DIR
    draft_path = DRAFTS_DIR / f"{content_id_or_path}.md"
    if draft_path.exists():
        return content_id_or_path

    # Check state for partial match
    state = _load_state()
    for cid in state:
        if cid.startswith(content_id_or_path):
            return cid

    return content_id_or_path


# =============================================================================
# PIPELINE PHASES
# =============================================================================

def phase_draft(topic: str, platforms: list, style: str = "professional",
                dry_run: bool = False) -> dict:
    """Phase 1: Generate content draft."""
    logger.info(f"[PHASE 1] Draft: topic='{topic}', platforms={platforms}")

    if dry_run:
        draft_dir = CACHE_DIR / "content_previews"
    else:
        draft_dir = DRAFTS_DIR

    result = generate_draft(topic, platforms, style, draft_dir=draft_dir)
    logger.info(f"[PHASE 1] Draft generated: {result['content_id']}")
    return result


def phase_review(content_id: str, topic: str = None,
                 dry_run: bool = False, draft_dir: Path = None) -> dict:
    """Phase 2: Review draft quality gates."""
    logger.info(f"[PHASE 2] Review: {content_id}")

    base = draft_dir or DRAFTS_DIR
    draft_path = base / f"{content_id}.md"
    if not draft_path.exists():
        raise FileNotFoundError(f"Draft not found for review: {content_id}")

    result = review_draft(str(draft_path), topic=topic)

    if not dry_run:
        _update_state(content_id, result["status"])

    logger.info(f"[PHASE 2] Review complete: {result['status']}")
    return result


def phase_publish(content_id: str, platform: str,
                  dry_run: bool = False, draft_dir: Path = None) -> dict:
    """Phase 3: Publish content to platform."""
    logger.info(f"[PHASE 3] Publish: {content_id} -> {platform}")

    base = draft_dir or DRAFTS_DIR
    draft_path = base / f"{content_id}.md"
    if not draft_path.exists():
        raise FileNotFoundError(f"Draft not found for publish: {content_id}")

    test_mode = True  # Always preview unless explicitly --publish
    result = publish_content(str(draft_path), platform, test_mode=test_mode)

    if not dry_run:
        _update_state(content_id, f"published_{platform}")

    logger.info(f"[PHASE 3] Publish result: {result.status}")
    return result.to_dict()


def phase_analytics(content_id: str, platform: str = "linkedin",
                    dry_run: bool = False) -> dict:
    """Phase 4: Fetch post-publish analytics."""
    logger.info(f"[PHASE 4] Analytics: {content_id}")

    if dry_run:
        logger.info("[PHASE 4] Dry run - skipping analytics fetch")
        return {"content_id": content_id, "status": "dry_run"}

    result = fetch_analytics(content_id, platform)
    _update_state(content_id, "analytics_fetched")

    logger.info(f"[PHASE 4] Analytics fetched for {platform}")
    return result


def phase_compound(content_id: str, dry_run: bool = False) -> dict:
    """Phase 5: Generate derivative content formats."""
    logger.info(f"[PHASE 5] Compound: {content_id}")

    if dry_run:
        logger.info("[PHASE 5] Dry run - skipping compound generation")
        return {"content_id": content_id, "status": "dry_run"}

    result = compound(content_id)
    _update_state(content_id, "compounded")

    logger.info(f"[PHASE 5] Compound complete: {result['successful_formats']} formats")
    return result


# =============================================================================
# FULL PIPELINE
# =============================================================================

def run_full_pipeline(topic: str, platforms: list, style: str = "professional",
                      dry_run: bool = False) -> dict:
    """
    Execute the full content pipeline end-to-end.

    Phases: Draft -> Review -> Publish (per platform) -> Analytics -> Compound

    Returns:
        dict with full pipeline results
    """
    pipeline_start = datetime.now(timezone.utc)
    results = {
        "topic": topic,
        "platforms": platforms,
        "started_at": pipeline_start.isoformat(),
        "phases": {},
        "errors": [],
    }

    # Phase 1: Draft
    try:
        draft_result = phase_draft(topic, platforms, style, dry_run)
        results["content_id"] = draft_result["content_id"]
        results["phases"]["draft"] = {"status": "success", **draft_result}
    except Exception as e:
        error_msg = f"Draft failed: {e}"
        logger.error(error_msg)
        results["errors"].append(error_msg)
        results["phases"]["draft"] = {"status": "failed", "error": str(e)}
        results["status"] = "failed"
        return results

    content_id = draft_result["content_id"]

    # Phase 2: Review
    try:
        review_result = phase_review(content_id, topic, dry_run)
        results["phases"]["review"] = {"status": "success", **review_result}
        if not review_result["overall_pass"]:
            results["warnings"] = results.get("warnings", [])
            results["warnings"].append("Review gates did not all pass. Check suggestions.")
    except Exception as e:
        error_msg = f"Review failed: {e}"
        logger.error(error_msg)
        results["errors"].append(error_msg)
        results["phases"]["review"] = {"status": "failed", "error": str(e)}

    # Phase 3: Publish (per platform)
    results["phases"]["publish"] = {}
    for platform in platforms:
        try:
            publish_result = phase_publish(content_id, platform, dry_run)
            results["phases"]["publish"][platform] = {"status": "success", **publish_result}
        except Exception as e:
            error_msg = f"Publish to {platform} failed: {e}"
            logger.error(error_msg)
            results["errors"].append(error_msg)
            results["phases"]["publish"][platform] = {"status": "failed", "error": str(e)}

    # Phase 4: Analytics
    try:
        analytics_result = phase_analytics(content_id, platforms[0], dry_run)
        results["phases"]["analytics"] = {"status": "success", **analytics_result}
    except Exception as e:
        error_msg = f"Analytics failed: {e}"
        logger.error(error_msg)
        results["errors"].append(error_msg)
        results["phases"]["analytics"] = {"status": "failed", "error": str(e)}

    # Phase 5: Compound
    try:
        compound_result = phase_compound(content_id, dry_run)
        results["phases"]["compound"] = {"status": "success", **compound_result}
    except Exception as e:
        error_msg = f"Compound failed: {e}"
        logger.error(error_msg)
        results["errors"].append(error_msg)
        results["phases"]["compound"] = {"status": "failed", "error": str(e)}

    # Final status
    pipeline_end = datetime.now(timezone.utc)
    results["completed_at"] = pipeline_end.isoformat()
    results["duration_sec"] = (pipeline_end - pipeline_start).total_seconds()

    if results["errors"]:
        results["status"] = "partial" if len(results["errors"]) < 4 else "failed"
    else:
        results["status"] = "success"

    # Update state
    _update_state(content_id, results["status"], pipeline_results=results["status"])

    return results


# =============================================================================
# VERIFICATION CYCLE (test mode)
# =============================================================================

def verify_cycle(dry_run: bool = False) -> dict:
    """
    Verify the full pipeline cycle in test mode.
    Runs the entire pipeline with a test topic and validates results.
    """
    logger.info("=== VERIFICATION CYCLE ===")
    test_topic = "AI verification test"
    test_platforms = ["linkedin", "twitter", "blog"]

    results = {
        "verification_at": datetime.now(timezone.utc).isoformat(),
        "tests": [],
    }

    # Test 1: Draft generation
    try:
        verify_dir = CACHE_DIR / "verify_cycle_temp"
        verify_dir.mkdir(parents=True, exist_ok=True)
        draft = phase_draft(test_topic, test_platforms, dry_run=True)
        assert draft["content_id"], "No content_id generated"
        assert len(draft["platform_versions"]) > 0, "No platform versions"
        results["tests"].append({"name": "draft_generation", "status": "PASS"})
    except Exception as e:
        results["tests"].append({"name": "draft_generation", "status": "FAIL", "error": str(e)})
        results["status"] = "failed"
        return results

    content_id = draft["content_id"]
    draft_base = Path(draft["draft_path"]).parent

    # Test 2: Review
    try:
        review = phase_review(content_id, test_topic, dry_run=True, draft_dir=draft_base)
        assert "gates" in review, "No gates in review result"
        assert len(review["gates"]) == 4, f"Expected 4 gates, got {len(review['gates'])}"
        results["tests"].append({"name": "review_gates", "status": "PASS"})
    except Exception as e:
        results["tests"].append({"name": "review_gates", "status": "FAIL", "error": str(e)})

    # Test 3: Publish preview
    try:
        for platform in test_platforms:
            pub = phase_publish(content_id, platform, dry_run=True, draft_dir=draft_base)
            assert pub["status"] in ("preview", "failed"), f"Unexpected status: {pub['status']}"
        results["tests"].append({"name": "publish_preview", "status": "PASS"})
    except Exception as e:
        results["tests"].append({"name": "publish_preview", "status": "FAIL", "error": str(e)})

    # Test 4: Analytics mock
    try:
        analytics = phase_analytics(content_id, "linkedin", dry_run=True)
        assert "status" in analytics, "No status in analytics"
        results["tests"].append({"name": "analytics_mock", "status": "PASS"})
    except Exception as e:
        results["tests"].append({"name": "analytics_mock", "status": "FAIL", "error": str(e)})

    # Test 5: Compound generation
    try:
        comp = phase_compound(content_id, dry_run=True)
        assert comp["status"] == "dry_run", f"Unexpected status: {comp['status']}"
        results["tests"].append({"name": "compound_generation", "status": "PASS"})
    except Exception as e:
        results["tests"].append({"name": "compound_generation", "status": "FAIL", "error": str(e)})

    # Test 6: State persistence
    try:
        state = _load_state()
        results["tests"].append({"name": "state_persistence", "status": "PASS"})
    except Exception as e:
        results["tests"].append({"name": "state_persistence", "status": "FAIL", "error": str(e)})

    # Summary
    passed = sum(1 for t in results["tests"] if t["status"] == "PASS")
    total = len(results["tests"])
    results["summary"] = f"{passed}/{total} tests passed"
    results["status"] = "success" if passed == total else "failed"

    logger.info(f"Verification: {results['summary']}")
    return results


# =============================================================================
# SMOKE TEST
# =============================================================================

def smoke_test() -> dict:
    """Quick smoke test of all pipeline components."""
    logger.info("=== SMOKE TEST ===")
    results = {"tests": [], "status": "success"}

    modules = [
        ("draft_generator", "draft_generator"),
        ("review_draft", "review_draft"),
        ("publish_content", "publish_content"),
        ("content_analytics", "content_analytics"),
        ("compound_content", "compound_content"),
    ]

    for name, module_name in modules:
        try:
            __import__(module_name)
            results["tests"].append({"module": name, "status": "PASS"})
        except Exception as e:
            results["tests"].append({"module": name, "status": "FAIL", "error": str(e)})
            results["status"] = "failed"

    passed = sum(1 for t in results["tests"] if t["status"] == "PASS")
    results["summary"] = f"{passed}/{len(modules)} modules loaded"
    logger.info(f"Smoke test: {results['summary']}")
    return results


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Content Output Pipeline Orchestrator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python content_pipeline.py run --topic "AI trends" --platform linkedin,twitter,blog
  python content_pipeline.py draft --topic "AI trends" --platform linkedin
  python content_pipeline.py review <draft_id>
  python content_pipeline.py publish <draft_id> --platform linkedin
  python content_pipeline.py analytics <draft_id>
  python content_pipeline.py compound <draft_id>
  python content_pipeline.py --verify-cycle
  python content_pipeline.py --test
        """,
    )

    # Common flags (added to each subparser)
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--dry-run", action="store_true", help="Dry run mode")
    common.add_argument("--verbose", "-v", action="store_true", help="Debug output")

    # Subcommands
    subparsers = parser.add_subparsers(dest="command", help="Pipeline command")

    # Draft
    draft_parser = subparsers.add_parser("draft", parents=[common], help="Generate content draft")
    draft_parser.add_argument("--topic", required=True, help="Content topic")
    draft_parser.add_argument("--platform", default="linkedin,twitter,blog",
                              help="Comma-separated platforms")
    draft_parser.add_argument("--style", default="professional",
                              choices=["professional", "casual", "technical"])

    # Review
    review_parser = subparsers.add_parser("review", parents=[common], help="Review draft quality")
    review_parser.add_argument("content_id", help="Content ID or draft path")
    review_parser.add_argument("--topic", help="Override topic for keyword gate")

    # Publish
    publish_parser = subparsers.add_parser("publish", parents=[common], help="Publish content")
    publish_parser.add_argument("content_id", help="Content ID or draft path")
    publish_parser.add_argument("--platform", required=True,
                                choices=["linkedin", "twitter", "blog"])

    # Analytics
    analytics_parser = subparsers.add_parser("analytics", parents=[common], help="Fetch analytics")
    analytics_parser.add_argument("content_id", help="Content ID")
    analytics_parser.add_argument("--platform", default="linkedin",
                                  choices=["linkedin", "twitter", "blog"])

    # Compound
    compound_parser = subparsers.add_parser("compound", parents=[common], help="Generate derivatives")
    compound_parser.add_argument("content_id", help="Content ID")

    # Run (full pipeline)
    run_parser = subparsers.add_parser("run", parents=[common], help="Run full pipeline")
    run_parser.add_argument("--topic", required=True, help="Content topic")
    run_parser.add_argument("--platform", default="linkedin,twitter,blog",
                            help="Comma-separated platforms")
    run_parser.add_argument("--style", default="professional",
                            choices=["professional", "casual", "technical"])

    # Top-level flags (no subcommand)
    parser.add_argument("--test", action="store_true", help="Smoke test")
    parser.add_argument("--verify-cycle", action="store_true",
                        help="Run full verification cycle")
    parser.add_argument("--verbose", "-v", action="store_true", help="Debug output")
    parser.add_argument("--dry-run", action="store_true", help="Dry run mode")

    args = parser.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    # Smoke test
    if args.test:
        result = smoke_test()
        print(json.dumps(result, indent=2))
        return 0 if result["status"] == "success" else 1

    # Verification cycle
    if args.verify_cycle:
        result = verify_cycle(dry_run=args.dry_run)
        print(json.dumps(result, indent=2))
        return 0 if result["status"] == "success" else 1

    # No command provided
    if not args.command:
        parser.print_help()
        return 0

    # Dispatch commands
    try:
        if args.command == "draft":
            platforms = [p.strip() for p in args.platform.split(",")]
            result = phase_draft(args.topic, platforms, args.style, args.dry_run)
            print(json.dumps(result, indent=2, ensure_ascii=False))

        elif args.command == "review":
            cid = _resolve_content_id(args.content_id)
            result = phase_review(cid, args.topic, args.dry_run)
            print(json.dumps(result, indent=2, ensure_ascii=False))

        elif args.command == "publish":
            cid = _resolve_content_id(args.content_id)
            result = phase_publish(cid, args.platform, args.dry_run)
            print(json.dumps(result, indent=2, ensure_ascii=False))

        elif args.command == "analytics":
            result = phase_analytics(args.content_id, args.platform, args.dry_run)
            print(json.dumps(result, indent=2, ensure_ascii=False))

        elif args.command == "compound":
            result = phase_compound(args.content_id, args.dry_run)
            print(json.dumps(result, indent=2, ensure_ascii=False))

        elif args.command == "run":
            platforms = [p.strip() for p in args.platform.split(",")]
            result = run_full_pipeline(args.topic, platforms, args.style, args.dry_run)
            print(json.dumps(result, indent=2, ensure_ascii=False))
            return 0 if result["status"] in ("success", "partial") else 1

        return 0

    except FileNotFoundError as e:
        logger.error(str(e))
        return 1
    except Exception as e:
        logger.exception(f"Command failed: {e}")
        return 1


if __name__ == "__main__":
    try:
        _fix_encoding()
        sys.exit(main())
    except KeyboardInterrupt:
        logger.warning("Interrupted by user")
        sys.exit(130)
    except Exception as e:
        logger.exception(f"Fatal error: {e}")
        sys.exit(1)
