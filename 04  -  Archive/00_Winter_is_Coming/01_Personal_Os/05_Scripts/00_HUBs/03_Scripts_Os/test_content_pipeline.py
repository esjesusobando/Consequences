#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
test_content_pipeline.py - Test Suite for Content Pipeline
=========================================================
Tests all pipeline modules: draft, review, publish, analytics, compound.
Uses CACHE_DIR for test isolation (no production files touched).

Usage:
    python test_content_pipeline.py
    python test_content_pipeline.py -v

Ubication: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
"""
import sys
import os
import json
import shutil
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
# TEST CONFIGURATION
# =============================================================================

TEST_DIR = CACHE_DIR / "content_pipeline_tests"
TEST_DRAFTS = TEST_DIR / "drafts"
TEST_STATE_FILE = TEST_DIR / "test_state.json"

TEST_TOPIC = "AI trends for developers"
TEST_PLATFORMS = ["linkedin", "twitter", "blog"]


def _setup_test_env():
    """Create isolated test environment."""
    TEST_DIR.mkdir(parents=True, exist_ok=True)
    TEST_DRAFTS.mkdir(parents=True, exist_ok=True)
    logger.info(f"Test environment: {TEST_DIR}")


def _cleanup_test_env():
    """Remove test artifacts."""
    if TEST_DIR.exists():
        shutil.rmtree(TEST_DIR, ignore_errors=True)
        logger.info("Test environment cleaned up")


def _count_lines(filepath: str) -> int:
    """Count lines in a file."""
    try:
        return len(Path(filepath).read_text(encoding='utf-8').splitlines())
    except Exception:
        return 0


# =============================================================================
# TESTS
# =============================================================================

class TestResult:
    def __init__(self, name):
        self.name = name
        self.passed = False
        self.error = None
        self.details = {}

    def __repr__(self):
        status = "PASS" if self.passed else "FAIL"
        err = f" ({self.error})" if self.error else ""
        return f"[{status}] {self.name}{err}"


def test_draft_generation() -> TestResult:
    """Test 1: Draft generation creates valid file with frontmatter."""
    result = TestResult("draft_generation")
    try:
        from draft_generator import generate_draft

        draft = generate_draft(
            TEST_TOPIC,
            TEST_PLATFORMS,
            style="professional",
            draft_dir=TEST_DRAFTS,
        )

        # Validate
        assert draft["content_id"], "No content_id"
        assert draft["topic"] == TEST_TOPIC, f"Topic mismatch: {draft['topic']}"
        assert len(draft["platform_versions"]) == 3, f"Expected 3 platforms, got {len(draft['platform_versions'])}"

        # Validate file exists and has frontmatter
        draft_path = Path(draft["draft_path"])
        assert draft_path.exists(), f"Draft file not found: {draft_path}"

        content = draft_path.read_text(encoding='utf-8')
        assert content.startswith("---"), "Missing YAML frontmatter"
        assert f"content_id: {draft['content_id']}" in content, "Missing content_id in frontmatter"
        assert f'topic: "{TEST_TOPIC}"' in content, "Missing topic in frontmatter"
        assert "status: draft" in content, "Missing status in frontmatter"

        # Validate platform versions have content
        for platform, version in draft["platform_versions"].items():
            assert version["chars"] > 0, f"Empty content for {platform}"

        result.passed = True
        result.details = {
            "content_id": draft["content_id"],
            "platforms": list(draft["platform_versions"].keys()),
            "draft_path": str(draft_path),
        }

    except Exception as e:
        result.error = str(e)
        logger.error(f"Test failed: {e}")

    return result


def test_review_gates_pass() -> TestResult:
    """Test 2a: Review gates PASS for well-structured content."""
    result = TestResult("review_gates_pass")
    try:
        from draft_generator import generate_draft
        from review_draft import review_draft

        draft = generate_draft(TEST_TOPIC, ["blog"], draft_dir=TEST_DRAFTS)
        review = review_draft(draft["draft_path"], TEST_TOPIC)

        # Validate review structure
        assert "gates" in review, "No gates in result"
        assert len(review["gates"]) == 4, f"Expected 4 gates, got {len(review['gates'])}"
        assert "overall_pass" in review, "No overall_pass"
        assert "status" in review, "No status"

        # Validate gate structure
        for gate in review["gates"]:
            assert "gate" in gate, "Gate missing name"
            assert "passed" in gate, f"Gate {gate.get('gate')} missing passed"
            assert "issues" in gate, f"Gate {gate.get('gate')} missing issues"

        # Verify review result was written
        review_file = Path(draft["draft_path"]).parent / f"{Path(draft['draft_path']).stem}_review.json"
        assert review_file.exists(), f"Review file not written: {review_file}"

        result.passed = True
        result.details = {
            "gates_passed": sum(1 for g in review["gates"] if g["passed"]),
            "gates_total": len(review["gates"]),
            "overall_pass": review["overall_pass"],
        }

    except Exception as e:
        result.error = str(e)
        logger.error(f"Test failed: {e}")

    return result


def test_review_gates_fail() -> TestResult:
    """Test 2b: Review gates FAIL for short/jargon-heavy content."""
    result = TestResult("review_gates_fail")
    try:
        from review_draft import gate_structure, gate_tone, gate_readability, gate_keywords

        # Very short content with jargon
        short_content = "Leverage synergy."

        struct = gate_structure(short_content)
        assert not struct["passed"], "Structure gate should fail for short content"

        tone = gate_tone("We leverage holistic synergy to empower seamless disruption.")
        assert not tone["passed"], "Tone gate should fail for jargon"

        # Very long sentences
        long_sent = " ".join(["word"] * 40) + "."
        read = gate_readability(long_sent)
        assert not read["passed"], "Readability gate should fail for long sentences"

        result.passed = True
        result.details = {
            "short_detected": not struct["passed"],
            "jargon_detected": not tone["passed"],
            "long_sentence_detected": not read["passed"],
        }

    except Exception as e:
        result.error = str(e)
        logger.error(f"Test failed: {e}")

    return result


def test_publish_preview() -> TestResult:
    """Test 3: Publish writes preview files in correct format."""
    result = TestResult("publish_preview")
    try:
        from draft_generator import generate_draft
        from publish_content import publish_linkedin, publish_twitter, publish_blog

        draft = generate_draft(TEST_TOPIC, TEST_PLATFORMS, draft_dir=TEST_DRAFTS)

        # Test LinkedIn
        linkedin = publish_linkedin(draft["draft_path"], test_mode=True)
        assert linkedin.status == "preview", f"LinkedIn status: {linkedin.status}"
        assert linkedin.char_count > 0, "LinkedIn empty content"
        assert linkedin.char_count <= 3000, f"LinkedIn over 3000 chars: {linkedin.char_count}"
        assert linkedin.preview_path, "No preview path"

        # Test Twitter
        twitter = publish_twitter(draft["draft_path"], test_mode=True)
        assert twitter.status == "preview", f"Twitter status: {twitter.status}"
        assert twitter.tweet_count > 0, "Twitter no tweets"
        assert twitter.preview_path, "No preview path"

        # Verify Twitter thread JSON
        twitter_path = Path(twitter.preview_path)
        assert twitter_path.exists(), "Twitter preview file not found"
        thread_data = json.loads(twitter_path.read_text(encoding='utf-8'))
        assert "thread" in thread_data, "Missing thread in Twitter JSON"
        for tweet in thread_data["thread"]:
            assert len(tweet) <= 280, f"Tweet over 280 chars: {len(tweet)}"

        # Test Blog
        blog = publish_blog(draft["draft_path"], test_mode=True)
        assert blog.status == "preview", f"Blog status: {blog.status}"
        assert blog.char_count > 0, "Blog empty content"
        assert blog.preview_path, "No preview path"

        # Verify blog has frontmatter
        blog_path = Path(blog.preview_path)
        blog_content = blog_path.read_text(encoding='utf-8')
        assert blog_content.startswith("---"), "Blog missing frontmatter"

        result.passed = True
        result.details = {
            "linkedin_chars": linkedin.char_count,
            "twitter_tweets": twitter.tweet_count,
            "blog_chars": blog.char_count,
        }

    except Exception as e:
        result.error = str(e)
        logger.error(f"Test failed: {e}")

    return result


def test_analytics_mock() -> TestResult:
    """Test 4: Analytics returns mock metrics and writes file."""
    result = TestResult("analytics_mock")
    try:
        from content_analytics import fetch_analytics, get_analytics_file

        test_cid = "test_analytics_001"
        analytics = fetch_analytics(test_cid, "linkedin")

        assert analytics["source"] == "mock", f"Expected mock source, got {analytics['source']}"
        assert "metrics" in analytics, "No metrics in result"
        assert "impressions" in analytics["metrics"], "Missing impressions"
        assert "engagement_rate" in analytics["metrics"], "Missing engagement_rate"

        # Verify file was written
        analytics_file = get_analytics_file(test_cid)
        assert analytics_file.exists(), f"Analytics file not written: {analytics_file}"
        stored = json.loads(analytics_file.read_text(encoding='utf-8'))
        assert stored["content_id"] == test_cid

        result.passed = True
        result.details = {
            "impressions": analytics["metrics"]["impressions"],
            "engagement_rate": analytics["metrics"]["engagement_rate"],
        }

    except Exception as e:
        result.error = str(e)
        logger.error(f"Test failed: {e}")

    return result


def test_compound_generation() -> TestResult:
    """Test 5: Compound generates 5 derivative formats."""
    result = TestResult("compound_generation")
    try:
        from draft_generator import generate_draft
        from compound_content import compound

        draft = generate_draft(TEST_TOPIC, TEST_PLATFORMS, draft_dir=TEST_DRAFTS)
        comp = compound(draft["content_id"], draft_dir=TEST_DRAFTS)

        assert comp["total_formats"] >= 5, f"Expected 5+ formats, got {comp['total_formats']}"
        assert comp["successful_formats"] >= 5, f"Expected 5+ successful, got {comp['successful_formats']}"

        # Verify output directory
        output_dir = Path(comp["output_dir"])
        assert output_dir.exists(), f"Output dir not created: {output_dir}"

        # Verify all format files exist
        expected_files = [
            "carousel_script.md",
            "twitter_thread.md",
            "quote_card.txt",
            "email_snippet.txt",
            "blog_summary.md",
        ]
        for fname in expected_files:
            fpath = output_dir / fname
            assert fpath.exists(), f"Missing derivative: {fname}"

        # Verify manifest
        manifest_path = output_dir / "manifest.json"
        assert manifest_path.exists(), "Missing manifest.json"

        result.passed = True
        result.details = {
            "formats_generated": comp["successful_formats"],
            "output_dir": str(output_dir),
        }

    except Exception as e:
        result.error = str(e)
        logger.error(f"Test failed: {e}")

    return result


def test_verify_cycle() -> TestResult:
    """Test 6: Full verification cycle passes."""
    result = TestResult("verify_cycle")
    try:
        from content_pipeline import verify_cycle

        cycle = verify_cycle(dry_run=True)

        assert "tests" in cycle, "No tests in verification"
        passed = sum(1 for t in cycle["tests"] if t["status"] == "PASS")
        total = len(cycle["tests"])

        result.passed = cycle["status"] == "success"
        result.details = {
            "passed": passed,
            "total": total,
            "summary": cycle.get("summary", ""),
        }

        if not result.passed:
            failures = [t for t in cycle["tests"] if t["status"] != "PASS"]
            result.error = f"{len(failures)} tests failed: {[t['name'] for t in failures]}"

    except Exception as e:
        result.error = str(e)
        logger.error(f"Test failed: {e}")

    return result


def test_state_persistence() -> TestResult:
    """Test 7: State file is created and updated correctly."""
    result = TestResult("state_persistence")
    try:
        from draft_generator import generate_draft
        from content_pipeline import _update_state, _load_state

        # Generate a draft to trigger state write
        draft = generate_draft("state test topic", ["linkedin"], draft_dir=TEST_DRAFTS)
        content_id = draft["content_id"]

        # Load and verify state
        state = _load_state()
        assert content_id in state, f"Content ID not in state: {content_id}"
        assert state[content_id]["status"] == "draft", f"Status: {state[content_id]['status']}"

        # Update state
        _update_state(content_id, "reviewed")
        state = _load_state()
        assert state[content_id]["status"] == "reviewed", f"After update: {state[content_id]['status']}"
        assert "updated_at" in state[content_id], "Missing updated_at"

        result.passed = True
        result.details = {
            "state_entries": len(state),
            "final_status": state[content_id]["status"],
        }

    except Exception as e:
        result.error = str(e)
        logger.error(f"Test failed: {e}")

    return result


def test_line_counts() -> TestResult:
    """Test 8: Verify all pipeline files have reasonable line counts."""
    result = TestResult("line_counts")
    try:
        script_dir = Path(__file__).parent
        files = {
            "content_pipeline.py": (200, 600),
            "draft_generator.py": (150, 400),
            "review_draft.py": (150, 400),
            "publish_content.py": (200, 500),
            "content_analytics.py": (100, 300),
            "compound_content.py": (150, 400),
            "test_content_pipeline.py": (200, 600),
        }

        details = {}
        all_ok = True
        for fname, (min_lines, max_lines) in files.items():
            fpath = script_dir / fname
            if not fpath.exists():
                details[fname] = "MISSING"
                all_ok = False
                continue

            lines = _count_lines(str(fpath))
            in_range = min_lines <= lines <= max_lines
            details[fname] = f"{lines} lines {'OK' if in_range else f'(expected {min_lines}-{max_lines})'}"
            if not in_range:
                all_ok = False

        result.passed = all_ok
        result.details = details

    except Exception as e:
        result.error = str(e)
        logger.error(f"Test failed: {e}")

    return result


# =============================================================================
# TEST RUNNER
# =============================================================================

ALL_TESTS = [
    test_draft_generation,
    test_review_gates_pass,
    test_review_gates_fail,
    test_publish_preview,
    test_analytics_mock,
    test_compound_generation,
    test_verify_cycle,
    test_state_persistence,
    test_line_counts,
]


def run_all_tests(verbose: bool = False) -> tuple:
    """
    Run all tests and return (results, exit_code).

    Returns:
        tuple of (list[TestResult], int) where int is 0=pass, 1=fail
    """
    _setup_test_env()

    results = []
    try:
        for test_fn in ALL_TESTS:
            name = test_fn.__name__
            logger.info(f"Running: {name}")
            test_result = test_fn()
            results.append(test_result)

            status = "PASS" if test_result.passed else "FAIL"
            logger.info(f"  [{status}] {name}")
            if verbose and test_result.details:
                for k, v in test_result.details.items():
                    logger.info(f"    {k}: {v}")
            if test_result.error:
                logger.info(f"    Error: {test_result.error}")
    finally:
        _cleanup_test_env()

    # Summary
    passed = sum(1 for r in results if r.passed)
    total = len(results)
    exit_code = 0 if passed == total else 1

    print(f"\n{'='*60}")
    print(f"CONTENT PIPELINE TEST RESULTS: {passed}/{total} passed")
    print(f"{'='*60}")
    for r in results:
        status = "PASS" if r.passed else "FAIL"
        err = f" -- {r.error}" if r.error else ""
        print(f"  [{status}] {r.name}{err}")
    print(f"{'='*60}")

    return results, exit_code


# =============================================================================
# CLI
# =============================================================================

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Content Pipeline Test Suite")
    parser.add_argument("-v", "--verbose", action="store_true", help="Verbose output")
    parser.add_argument("--test", action="store_true", help="Quick smoke test")
    args = parser.parse_args()

    if args.test:
        logger.info("Smoke test mode: importing all modules")
        try:
            import draft_generator
            import review_draft
            import publish_content
            import content_analytics
            import compound_content
            import content_pipeline
            logger.info("All modules imported successfully")
            print("Smoke test: PASS")
            return 0
        except ImportError as e:
            logger.error(f"Import failed: {e}")
            print(f"Smoke test: FAIL ({e})")
            return 1

    _, exit_code = run_all_tests(verbose=args.verbose)
    return exit_code


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
