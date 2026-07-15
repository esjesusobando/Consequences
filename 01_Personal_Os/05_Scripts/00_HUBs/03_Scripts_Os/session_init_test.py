#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nombre: Session Init Test — Pre-Session Health Check Suite
Ubicacion: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
Proposito: Run critical system checks before a session starts to verify
           config paths, sync copies, structure, git status, and engram connectivity.

Usage:
    python session_init_test.py --verbose
    python session_init_test.py --test
"""

import sys
import os
import json
import argparse
import logging
import time
import subprocess
import sqlite3
from pathlib import Path
from datetime import datetime, timezone

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import (
    ROOT_DIR,
    CORE_DIR,
    KNOWLEDGE_DIR,
    ENGINE_DIR,
    ARCHIVE_DIR,
    TELEMETRY_DIR,
    CACHE_DIR,
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%H:%M:%S',
)
logger = logging.getLogger(__name__)

# ── Constants ────────────────────────────────────────────────

ENGRAM_DB = Path.home() / ".engram" / "engram.db"
TEST_TIMEOUT = 10  # seconds per test

# Required directories for system health
REQUIRED_DIRS = [
    ("CORE_DIR", CORE_DIR),
    ("KNOWLEDGE_DIR", KNOWLEDGE_DIR),
    ("ENGINE_DIR", ENGINE_DIR),
    ("ARCHIVE_DIR", ARCHIVE_DIR),
    ("TELEMETRY_DIR", TELEMETRY_DIR),
]


# ── Test Infrastructure ──────────────────────────────────────

class TestResult:
    """Encapsulates a single test result."""

    def __init__(self, name: str, critical: bool = False):
        self.name = name
        self.critical = critical
        self.passed = False
        self.skipped = False
        self.message = ""
        self.duration_ms = 0

    def ok(self, msg: str = "") -> None:
        self.passed = True
        self.message = msg

    def fail(self, msg: str) -> None:
        self.passed = False
        self.message = msg

    def skip(self, msg: str) -> None:
        self.skipped = True
        self.message = msg

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "passed": self.passed,
            "skipped": self.skipped,
            "critical": self.critical,
            "message": self.message,
            "duration_ms": self.duration_ms,
        }


# ── Tests ────────────────────────────────────────────────────

def test_config_paths(verbose: bool = False) -> TestResult:
    """Test that config_paths module loads and critical paths exist."""
    r = TestResult("config_paths", critical=True)
    try:
        # Verify ROOT_DIR and key paths exist
        assert ROOT_DIR.exists(), f"ROOT_DIR not found: {ROOT_DIR}"
        assert ENGINE_DIR.exists(), f"ENGINE_DIR not found: {ENGINE_DIR}"
        assert (ENGINE_DIR / "config_paths.py").exists(), "config_paths.py not found"
        r.ok(f"ROOT_DIR={ROOT_DIR}")
    except Exception as e:
        r.fail(str(e))
    return r


def test_structure_check(verbose: bool = False) -> TestResult:
    """Test that all required system directories exist."""
    r = TestResult("structure_check", critical=True)
    missing = []
    for name, path in REQUIRED_DIRS:
        if not path.exists():
            missing.append(name)
        elif verbose:
            logger.debug(f"  [OK] {name}: {path}")
    if missing:
        r.fail(f"Missing directories: {', '.join(missing)}")
    else:
        r.ok(f"All {len(REQUIRED_DIRS)} directories present")
    return r


def test_sync_copies(verbose: bool = False) -> TestResult:
    """Test that sync_copies.py exists and is importable."""
    r = TestResult("sync_copies", critical=False)
    sync_script = ENGINE_DIR / "sync_copies.py"
    if sync_script.exists():
        r.ok(f"sync_copies.py found at {sync_script}")
    else:
        # Check legacy locations
        legacy = ENGINE_DIR / "13_Legacy" / "sync_copies.py"
        if legacy.exists():
            r.ok(f"sync_copies.py found at legacy path {legacy}")
        else:
            r.fail("sync_copies.py not found")
    return r


def test_git_status(verbose: bool = False) -> TestResult:
    """Test that the project has a valid git status."""
    r = TestResult("git_status", critical=False)
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=str(ROOT_DIR),
            capture_output=True,
            text=True,
            timeout=TEST_TIMEOUT,
        )
        if result.returncode == 0:
            lines = [l for l in result.stdout.strip().split("\n") if l.strip()]
            r.ok(f"Git repo OK, {len(lines)} uncommitted changes")
        else:
            r.fail(f"git status failed: {result.stderr[:200]}")
    except FileNotFoundError:
        r.skip("Git not installed")
    except subprocess.TimeoutExpired:
        r.fail("Git status timed out")
    except Exception as e:
        r.fail(str(e))
    return r


def test_engram_connectivity(verbose: bool = False) -> TestResult:
    """Test that the Engram SQLite database is accessible."""
    r = TestResult("engram_connectivity", critical=True)
    try:
        if not ENGRAM_DB.exists():
            r.fail(f"Engram database not found: {ENGRAM_DB}")
            return r

        conn = sqlite3.connect(str(ENGRAM_DB))
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM observations")
        count = cursor.fetchone()[0]
        conn.close()
        r.ok(f"Engram DB accessible, {count} observations")
    except Exception as e:
        r.fail(str(e))
    return r


def test_engram_server(verbose: bool = False) -> TestResult:
    """Test that the Engram server binary is available."""
    r = TestResult("engram_server", critical=False)
    engram_bin = Path.home() / "go" / "bin" / "engram.exe"
    if engram_bin.exists():
        r.ok(f"Engram binary: {engram_bin}")
    else:
        r.fail(f"Engram binary not found: {engram_bin}")
    return r


def test_telemetry_files(verbose: bool = False) -> TestResult:
    """Test that telemetry data files exist."""
    r = TestResult("telemetry_files", critical=False)
    json_files = list(TELEMETRY_DIR.glob("*.json")) if TELEMETRY_DIR.exists() else []
    if json_files:
        r.ok(f"{len(json_files)} telemetry files found")
    else:
        r.fail("No telemetry files found")
    return r


def test_snapshot_dir(verbose: bool = False) -> TestResult:
    """Test that the snapshot archive directory exists or can be created."""
    r = TestResult("snapshot_dir", critical=False)
    snap_dir = ARCHIVE_DIR / "04_Engram_Snapshots"
    if snap_dir.exists():
        snaps = list(snap_dir.glob("snapshot_*.json.gz"))
        r.ok(f"Snapshot dir exists, {len(snaps)} snapshots")
    else:
        # Can be created on first snapshot
        r.ok("Snapshot dir does not exist yet (will be created on first snapshot)")
    return r


# ── Runner ───────────────────────────────────────────────────

def run_all_tests(verbose: bool = False) -> list[TestResult]:
    """Run all tests and return results."""
    tests = [
        test_config_paths,
        test_structure_check,
        test_sync_copies,
        test_git_status,
        test_engram_connectivity,
        test_engram_server,
        test_telemetry_files,
        test_snapshot_dir,
    ]

    results = []
    for test_fn in tests:
        start = time.time()
        try:
            result = test_fn(verbose=verbose)
        except Exception as e:
            result = TestResult(test_fn.__name__, critical=True)
            result.fail(f"Unhandled exception: {e}")
        result.duration_ms = round((time.time() - start) * 1000)
        results.append(result)

        icon = "SKIP" if result.skipped else ("PASS" if result.passed else "FAIL")
        crit = " [CRITICAL]" if result.critical else ""
        logger.info(f"  [{icon}] {result.name}{crit}: {result.message} ({result.duration_ms}ms)")

    return results


def format_summary(results: list[TestResult]) -> dict:
    """Format results into a summary dict."""
    passed = sum(1 for r in results if r.passed)
    failed = sum(1 for r in results if not r.passed and not r.skipped)
    skipped = sum(1 for r in results if r.skipped)
    total_ms = sum(r.duration_ms for r in results)
    critical_fails = [
        r.name for r in results if not r.passed and not r.skipped and r.critical
    ]

    return {
        "passed": passed,
        "failed": failed,
        "skipped": skipped,
        "total": len(results),
        "duration_sec": round(total_ms / 1000, 2),
        "critical_fails": critical_fails,
        "tests": [r.to_dict() for r in results],
    }


# ── CLI ──────────────────────────────────────────────────────

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="session_init_test",
        description="Pre-session health check suite for PersonalOS.",
    )
    parser.add_argument("--verbose", action="store_true", help="Verbose logging")
    parser.add_argument("--test", action="store_true", help="Run self-tests")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    return parser


def run_self_tests() -> bool:
    """Run self-tests for the test suite itself."""
    logger.info("Running meta self-tests...")

    # Test 1: TestResult works correctly
    r = TestResult("meta_test")
    r.ok("it works")
    assert r.passed
    assert r.to_dict()["passed"]
    logger.info("[PASS] TestResult basics")

    # Test 2: format_summary works
    results = [
        TestResult("a"),
        TestResult("b"),
    ]
    results[0].ok("fine")
    results[1].fail("oops")
    summary = format_summary(results)
    assert summary["passed"] == 1
    assert summary["failed"] == 1
    assert summary["total"] == 2
    logger.info("[PASS] format_summary")

    logger.info("All meta self-tests passed.")
    return True


# ── Main ─────────────────────────────────────────────────────

def main() -> int:
    args = build_parser().parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    if args.test:
        ok = run_self_tests()
        return 0 if ok else 1

    logger.info("Session Init Test — Running health checks...")

    results = run_all_tests(verbose=args.verbose)
    summary = format_summary(results)

    if args.json:
        print(json.dumps(summary, indent=2, ensure_ascii=False))
    else:
        print(f"\n{'=' * 50}")
        print(f"  Session Init Test Results")
        print(f"{'=' * 50}")
        print(f"  Passed:   {summary['passed']}/{summary['total']}")
        print(f"  Failed:   {summary['failed']}/{summary['total']}")
        print(f"  Skipped:  {summary['skipped']}")
        print(f"  Duration: {summary['duration_sec']}s")
        if summary["critical_fails"]:
            print(f"\n  CRITICAL FAILURES:")
            for name in summary["critical_fails"]:
                print(f"    - {name}")
        print(f"{'=' * 50}\n")

    # Exit 1 if any critical tests failed
    return 1 if summary["critical_fails"] else 0


if __name__ == "__main__":
    sys.exit(main())
