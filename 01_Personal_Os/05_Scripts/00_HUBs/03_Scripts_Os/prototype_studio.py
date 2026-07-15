#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
prototype_studio.py — AI Native Prototype Orchestrator
======================================================
Full pipeline: Idea → Hypothesis → Build → Test → Feedback → Synthesis → V2 Plan

Based on Theo Taba's Labs Page model (LCA).

CLI:
    python prototype_studio.py run --idea "daily playlist for Spotify" --brand spotify
    python prototype_studio.py hypothesis --idea "daily playlist"
    python prototype_studio.py build --hypothesis-id "hyp_xxx" --brand spotify
    python prototype_studio.py test --prototype-id "proto_xxx"
    python prototype_studio.py synthesize --prototype-id "proto_xxx"
    python prototype_studio.py v2 --prototype-id "proto_xxx"
    python prototype_studio.py labs --prototype-id "proto_xxx"
    python prototype_studio.py collect --prototype-id "proto_xxx" --min-responses 5
    python prototype_studio.py report --prototype-id "proto_xxx"
    python prototype_studio.py list
    python prototype_studio.py --test
    python prototype_studio.py --verify-cycle

State: 03_Learning/04_Telemetry/prototype_studio_state.json
Cache: .cache/prototypes/

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

# ─────────────────────────────────────────────────────────────
# WINDOWS UTF-8 FIX
# ─────────────────────────────────────────────────────────────
def _fix_encoding():
    """Fix Windows console encoding (call only in __main__)."""
    if sys.platform == "win32":
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# ─────────────────────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────────────────────
sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────
# DIRECTORIES
# ─────────────────────────────────────────────────────────────
PROTOTYPES_DIR = CACHE_DIR / "prototypes"
STATE_FILE = TELEMETRY_DIR / "prototype_studio_state.json"

PROTOTYPES_DIR.mkdir(parents=True, exist_ok=True)
TELEMETRY_DIR.mkdir(parents=True, exist_ok=True)

# ─────────────────────────────────────────────────────────────
# IMPORT PIPELINE MODULES
# ─────────────────────────────────────────────────────────────
try:
    from hypothesis_generator import generate_hypothesis, load_hypothesis
    from prototype_builder import build_prototype
    from usability_test_generator import generate_usability_test
    from feedback_collector import collect_feedback, get_feedback_status
    from feedback_synthesizer import synthesize_feedback
    from v2_planner import generate_v2_plan
    from labs_page_generator import generate_labs_page
except ImportError as e:
    logger.error(f"Failed to import pipeline modules: {e}")
    logger.error("Ensure all prototype_studio modules are in the same directory")
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


def _update_state(prototype_id: str, status: str, **extra) -> None:
    """Update a single prototype entry in state."""
    state = _load_state()
    now = datetime.now(timezone.utc).isoformat()
    if prototype_id in state:
        state[prototype_id]["status"] = status
        state[prototype_id]["updated_at"] = now
        state[prototype_id].update(extra)
    else:
        state[prototype_id] = {
            "status": status,
            "created_at": now,
            "updated_at": now,
            **extra,
        }
    _save_state(state)


# =============================================================================
# PIPELINE PHASES
# =============================================================================

def phase_hypothesis(idea: str, brand: str = "generic", style: str = "minimalist",
                     dry_run: bool = False) -> dict:
    """Phase 1: Generate hypothesis from idea."""
    logger.info(f"[PHASE 1] Hypothesis: idea='{idea}', brand={brand}, style={style}")
    result = generate_hypothesis(idea, brand=brand, style=style, output_dir=PROTOTYPES_DIR)
    if not dry_run:
        _update_state(result["id"], "hypothesis_generated",
                       idea=idea, brand=brand, style=style,
                       hypothesis_file=result.get("hypothesis_file", ""))
    logger.info(f"[PHASE 1] Hypothesis generated: {result['id']}")
    return result


def phase_build(hypothesis_id: str, brand: str = "generic", style: str = "minimalist",
                dry_run: bool = False) -> dict:
    """Phase 2: Build prototype from hypothesis."""
    logger.info(f"[PHASE 2] Build: hypothesis_id={hypothesis_id}")
    hypothesis = load_hypothesis(hypothesis_id, PROTOTYPES_DIR)
    result = build_prototype(hypothesis, brand=brand, style=style, output_dir=PROTOTYPES_DIR)
    if not dry_run:
        _update_state(result["id"], "prototype_built",
                       hypothesis_id=hypothesis_id,
                       prototype_file=result.get("prototype_file", ""))
    logger.info(f"[PHASE 2] Prototype built: {result['id']}")
    return result


def phase_test(prototype_id: str, dry_run: bool = False) -> dict:
    """Phase 3: Generate usability test from prototype."""
    logger.info(f"[PHASE 3] Test: prototype_id={prototype_id}")
    prototype_file = PROTOTYPES_DIR / f"prototype_{prototype_id}.html"
    if not prototype_file.exists():
        # Try matching by prefix
        matches = list(PROTOTYPES_DIR.glob(f"prototype_{prototype_id}*.html"))
        if matches:
            prototype_file = matches[0]
        else:
            raise FileNotFoundError(f"Prototype not found: {prototype_id}")
    result = generate_usability_test(prototype_id, str(prototype_file), output_dir=PROTOTYPES_DIR)
    if not dry_run:
        _update_state(prototype_id, "test_generated",
                       test_file=result.get("test_file", ""))
    logger.info(f"[PHASE 3] Test generated for: {prototype_id}")
    return result


def phase_collect(prototype_id: str, min_responses: int = 5,
                  dry_run: bool = False) -> dict:
    """Phase 4: Collect feedback."""
    logger.info(f"[PHASE 4] Collect: prototype_id={prototype_id}, min={min_responses}")
    result = collect_feedback(prototype_id, min_responses=min_responses,
                               telemetry_dir=TELEMETRY_DIR, cache_dir=PROTOTYPES_DIR)
    if not dry_run:
        _update_state(prototype_id, "feedback_collected",
                       response_count=result.get("count", 0))
    logger.info(f"[PHASE 4] Feedback collected: {result.get('count', 0)} responses")
    return result


def phase_synthesize(prototype_id: str, dry_run: bool = False) -> dict:
    """Phase 5: Synthesize feedback into insights."""
    logger.info(f"[PHASE 5] Synthesize: prototype_id={prototype_id}")
    result = synthesize_feedback(prototype_id, telemetry_dir=TELEMETRY_DIR,
                                  output_dir=PROTOTYPES_DIR)
    if not dry_run:
        _update_state(prototype_id, "synthesized",
                       synthesis_file=result.get("synthesis_file", ""))
    logger.info(f"[PHASE 5] Synthesis complete for: {prototype_id}")
    return result


def phase_v2(prototype_id: str, dry_run: bool = False) -> dict:
    """Phase 6: Generate V2 plan from synthesis."""
    logger.info(f"[PHASE 6] V2 Plan: prototype_id={prototype_id}")
    result = generate_v2_plan(prototype_id, output_dir=PROTOTYPES_DIR)
    if not dry_run:
        _update_state(prototype_id, "v2_planned",
                       v2_plan_file=result.get("v2_plan_file", ""))
    logger.info(f"[PHASE 6] V2 plan generated for: {prototype_id}")
    return result


# =============================================================================
# FULL PIPELINE
# =============================================================================

def run_full_pipeline(idea: str, brand: str = "generic", style: str = "minimalist",
                      dry_run: bool = False) -> dict:
    """
    Execute the full prototype pipeline end-to-end.

    Hypothesis -> Build -> Test -> Collect -> Synthesize -> V2 Plan

    Returns:
        dict with full pipeline results
    """
    pipeline_start = datetime.now(timezone.utc)
    results = {
        "idea": idea,
        "brand": brand,
        "style": style,
        "started_at": pipeline_start.isoformat(),
        "phases": {},
        "errors": [],
    }

    # Phase 1: Hypothesis
    try:
        hyp_result = phase_hypothesis(idea, brand=brand, style=style, dry_run=dry_run)
        results["phases"]["hypothesis"] = hyp_result
        prototype_id = hyp_result["id"]
    except Exception as e:
        error = f"Hypothesis phase failed: {e}"
        logger.error(error)
        results["errors"].append(error)
        return results

    # Phase 2: Build
    try:
        build_result = phase_build(prototype_id, brand=brand, style=style, dry_run=dry_run)
        results["phases"]["build"] = build_result
        # Build creates a NEW prototype ID — use it for all subsequent phases
        prototype_id = build_result["id"]
    except Exception as e:
        error = f"Build phase failed: {e}"
        logger.error(error)
        results["errors"].append(error)
        return results

    # Phase 3: Test
    try:
        test_result = phase_test(prototype_id, dry_run=dry_run)
        results["phases"]["test"] = test_result
    except Exception as e:
        error = f"Test phase failed: {e}"
        logger.error(error)
        results["errors"].append(error)
        return results

    # Phase 4: Collect (placeholder — needs real users)
    try:
        collect_result = phase_collect(prototype_id, dry_run=dry_run)
        results["phases"]["collect"] = collect_result
    except Exception as e:
        error = f"Collect phase skipped: {e}"
        logger.warning(error)
        results["phases"]["collect"] = {"status": "skipped", "reason": str(e)}

    # Phase 5: Synthesize (only if we have feedback)
    feedback_count = results["phases"].get("collect", {}).get("count", 0)
    if feedback_count > 0:
        try:
            synth_result = phase_synthesize(prototype_id, dry_run=dry_run)
            results["phases"]["synthesize"] = synth_result
        except Exception as e:
            error = f"Synthesize phase failed: {e}"
            logger.error(error)
            results["errors"].append(error)
    else:
        results["phases"]["synthesize"] = {"status": "skipped", "reason": "no feedback yet"}
        logger.info("Skipping synthesis — no feedback responses yet")

    # Phase 6: V2 Plan (only if synthesis exists)
    if "synthesize" in results["phases"] and results["phases"]["synthesize"].get("status") != "skipped":
        try:
            v2_result = phase_v2(prototype_id, dry_run=dry_run)
            results["phases"]["v2"] = v2_result
        except Exception as e:
            error = f"V2 plan phase failed: {e}"
            logger.error(error)
            results["errors"].append(error)
    else:
        results["phases"]["v2"] = {"status": "skipped", "reason": "no synthesis yet"}

    # Final state
    pipeline_end = datetime.now(timezone.utc)
    results["completed_at"] = pipeline_end.isoformat()
    results["duration_seconds"] = (pipeline_end - pipeline_start).total_seconds()
    results["prototype_id"] = prototype_id

    if not dry_run:
        _update_state(prototype_id, "pipeline_complete",
                       idea=idea, brand=brand, style=style,
                       duration_seconds=results["duration_seconds"])

    logger.info(f"[PIPELINE] Complete in {results['duration_seconds']:.1f}s — ID: {prototype_id}")
    return results


# =============================================================================
# LABS PAGE
# =============================================================================

def generate_labs(prototype_id: str, dry_run: bool = False) -> dict:
    """Generate a feedback collection labs page."""
    logger.info(f"[LABS] Generating labs page for: {prototype_id}")
    result = generate_labs_page(prototype_id, output_dir=PROTOTYPES_DIR)
    if not dry_run:
        _update_state(prototype_id, "labs_generated",
                       labs_file=result.get("labs_file", ""))
    logger.info(f"[LABS] Labs page generated: {result.get('labs_file', 'N/A')}")
    return result


# =============================================================================
# LIST PROTOTYPES
# =============================================================================

def list_prototypes() -> list:
    """List all prototypes in state."""
    state = _load_state()
    prototypes = []
    for pid, info in state.items():
        prototypes.append({
            "id": pid,
            "status": info.get("status", "unknown"),
            "idea": info.get("idea", "N/A"),
            "created_at": info.get("created_at", "N/A"),
            "updated_at": info.get("updated_at", "N/A"),
        })
    return sorted(prototypes, key=lambda x: x.get("created_at", ""), reverse=True)


# =============================================================================
# SELF-TEST
# =============================================================================

def run_self_test() -> bool:
    """Run self-test: generate hypothesis and prototype, verify outputs."""
    logger.info("[TEST] Running prototype studio self-test...")
    results = {"hypothesis": False, "prototype": False, "test_gen": False}

    # Test 1: Hypothesis generation
    try:
        hyp = generate_hypothesis("test feature for demo", brand="generic",
                                   style="minimalist", output_dir=PROTOTYPES_DIR)
        assert "id" in hyp, "Hypothesis missing ID"
        assert "problem_statement" in hyp, "Hypothesis missing problem_statement"
        hyp_file = PROTOTYPES_DIR / f"hypothesis_{hyp['id']}.json"
        assert hyp_file.exists(), f"Hypothesis file not found: {hyp_file}"
        results["hypothesis"] = True
        logger.info("[TEST]   hypothesis generation: PASS")
    except Exception as e:
        logger.error(f"[TEST]   hypothesis generation: FAIL — {e}")

    # Test 2: Prototype build
    try:
        proto = build_prototype(hyp, brand="generic", style="minimalist",
                                 output_dir=PROTOTYPES_DIR)
        assert "id" in proto, "Prototype missing ID"
        proto_file = PROTOTYPES_DIR / f"prototype_{proto['id']}.html"
        assert proto_file.exists(), f"Prototype file not found: {proto_file}"
        content = proto_file.read_text(encoding='utf-8')
        assert "<html" in content.lower(), "Prototype HTML missing <html> tag"
        results["prototype"] = True
        logger.info("[TEST]   prototype build: PASS")
    except Exception as e:
        logger.error(f"[TEST]   prototype build: FAIL — {e}")

    # Test 3: Usability test generation
    try:
        test_result = generate_usability_test(proto['id'], str(proto_file),
                                               output_dir=PROTOTYPES_DIR)
        assert "questions" in test_result, "Test missing questions"
        assert len(test_result["questions"]) >= 5, "Test has fewer than 5 questions"
        results["test_gen"] = True
        logger.info("[TEST]   usability test generation: PASS")
    except Exception as e:
        logger.error(f"[TEST]   usability test generation: FAIL — {e}")

    all_pass = all(results.values())
    logger.info(f"[TEST] Self-test: {'ALL PASS' if all_pass else 'SOME FAILED'}")
    logger.info(f"[TEST] Results: {json.dumps(results, indent=2)}")
    return all_pass


# =============================================================================
# VERIFY CYCLE
# =============================================================================

def verify_cycle() -> bool:
    """Verify the full pipeline cycle works end-to-end."""
    logger.info("[VERIFY] Running full pipeline verify cycle...")

    try:
        result = run_full_pipeline(
            idea="verify cycle test feature",
            brand="generic",
            style="minimalist",
            dry_run=True
        )

        # Check hypothesis was generated
        assert "hypothesis" in result["phases"], "Hypothesis phase missing"
        # Check build was attempted
        assert "build" in result["phases"], "Build phase missing"
        # Check test was attempted
        assert "test" in result["phases"], "Test phase missing"

        logger.info("[VERIFY] Pipeline cycle: PASS")
        logger.info(f"[VERIFY] Phases completed: {list(result['phases'].keys())}")
        return True
    except Exception as e:
        logger.error(f"[VERIFY] Pipeline cycle: FAIL — {e}")
        logger.error(traceback.format_exc())
        return False


# =============================================================================
# CLI
# =============================================================================

def main():
    _fix_encoding()

    parser = argparse.ArgumentParser(
        description="Prototype Studio — AI Native Prototype Creation Pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python prototype_studio.py run --idea "daily playlist for Spotify" --brand spotify
  python prototype_studio.py hypothesis --idea "daily playlist"
  python prototype_studio.py build --hypothesis-id "hyp_xxx" --brand spotify
  python prototype_studio.py test --prototype-id "proto_xxx"
  python prototype_studio.py list
        """
    )

    parser.add_argument("--dry-run", action="store_true", help="Preview without writing state")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    parser.add_argument("--test", action="store_true", help="Run self-test")
    parser.add_argument("--verify-cycle", action="store_true", help="Verify full pipeline cycle")

    subparsers = parser.add_subparsers(dest="command", help="Pipeline commands")

    # run — full pipeline
    run_parser = subparsers.add_parser("run", help="Run full pipeline")
    run_parser.add_argument("--idea", required=True, help="The idea to prototype")
    run_parser.add_argument("--brand", default="generic", help="Brand design system")
    run_parser.add_argument("--style", default="minimalist", help="Visual style")

    # hypothesis
    hyp_parser = subparsers.add_parser("hypothesis", help="Generate hypothesis")
    hyp_parser.add_argument("--idea", required=True, help="The idea")
    hyp_parser.add_argument("--brand", default="generic", help="Brand")
    hyp_parser.add_argument("--style", default="minimalist", help="Style")

    # build
    build_parser = subparsers.add_parser("build", help="Build prototype")
    build_parser.add_argument("--hypothesis-id", required=True, help="Hypothesis ID")
    build_parser.add_argument("--brand", default="generic", help="Brand")
    build_parser.add_argument("--style", default="minimalist", help="Style")

    # test
    test_parser = subparsers.add_parser("test", help="Generate usability test")
    test_parser.add_argument("--prototype-id", required=True, help="Prototype ID")

    # synthesize
    synth_parser = subparsers.add_parser("synthesize", help="Synthesize feedback")
    synth_parser.add_argument("--prototype-id", required=True, help="Prototype ID")

    # v2
    v2_parser = subparsers.add_parser("v2", help="Generate V2 plan")
    v2_parser.add_argument("--prototype-id", required=True, help="Prototype ID")

    # labs
    labs_parser = subparsers.add_parser("labs", help="Generate labs feedback page")
    labs_parser.add_argument("--prototype-id", required=True, help="Prototype ID")

    # collect
    collect_parser = subparsers.add_parser("collect", help="Collect feedback")
    collect_parser.add_argument("--prototype-id", required=True, help="Prototype ID")
    collect_parser.add_argument("--min-responses", type=int, default=5, help="Min responses")

    # report
    report_parser = subparsers.add_parser("report", help="Show feedback report")
    report_parser.add_argument("--prototype-id", required=True, help="Prototype ID")

    # list
    subparsers.add_parser("list", help="List all prototypes")

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    # Self-test
    if args.test:
        success = run_self_test()
        sys.exit(0 if success else 1)

    # Verify cycle
    if args.verify_cycle:
        success = verify_cycle()
        sys.exit(0 if success else 1)

    # Pipeline commands
    if args.command == "run":
        result = run_full_pipeline(args.idea, brand=args.brand, style=args.style,
                                    dry_run=args.dry_run)
        print(json.dumps(result, indent=2, ensure_ascii=False))

    elif args.command == "hypothesis":
        result = phase_hypothesis(args.idea, brand=args.brand, style=args.style,
                                   dry_run=args.dry_run)
        print(json.dumps(result, indent=2, ensure_ascii=False))

    elif args.command == "build":
        result = phase_build(args.hypothesis_id, brand=args.brand, style=args.style,
                              dry_run=args.dry_run)
        print(json.dumps(result, indent=2, ensure_ascii=False))

    elif args.command == "test":
        result = phase_test(args.prototype_id, dry_run=args.dry_run)
        print(json.dumps(result, indent=2, ensure_ascii=False))

    elif args.command == "synthesize":
        result = phase_synthesize(args.prototype_id, dry_run=args.dry_run)
        print(json.dumps(result, indent=2, ensure_ascii=False))

    elif args.command == "v2":
        result = phase_v2(args.prototype_id, dry_run=args.dry_run)
        print(json.dumps(result, indent=2, ensure_ascii=False))

    elif args.command == "labs":
        result = generate_labs(args.prototype_id, dry_run=args.dry_run)
        print(json.dumps(result, indent=2, ensure_ascii=False))

    elif args.command == "collect":
        result = phase_collect(args.prototype_id, min_responses=args.min_responses,
                                dry_run=args.dry_run)
        print(json.dumps(result, indent=2, ensure_ascii=False))

    elif args.command == "report":
        status = get_feedback_status(args.prototype_id, telemetry_dir=TELEMETRY_DIR)
        print(json.dumps(status, indent=2, ensure_ascii=False))

    elif args.command == "list":
        prototypes = list_prototypes()
        if not prototypes:
            print("No prototypes found.")
        else:
            print(f"\n{'ID':<35} {'Status':<25} {'Idea':<40} {'Created'}")
            print("-" * 120)
            for p in prototypes:
                print(f"{p['id']:<35} {p['status']:<25} {p['idea']:<40} {p['created_at'][:10]}")
            print(f"\nTotal: {len(prototypes)} prototypes")

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
