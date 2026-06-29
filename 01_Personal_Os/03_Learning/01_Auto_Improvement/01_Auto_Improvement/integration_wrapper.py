#!/usr/bin/env python3
"""
Integration Wrapper — Connects Auto-Improvement Engine with Capital Token.
Runs the engine, feeds patterns to aggregator, generates playbooks when threshold reached.
"""

import json
import sys
import subprocess
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
ENGINE_DIR = PROJECT_ROOT / "01_Personal_Os" / "05_Scripts" / "01_Auto_Improvement"
AGGREGATOR_SCRIPT = ENGINE_DIR / "03_Metrics" / "pattern_aggregator.py"
QUALITY_CHECKER = ENGINE_DIR / "03_Metrics" / "capital_token_checker.py"
LEARNINGS_FILE = ENGINE_DIR / "learnings.json"
AGGREGATOR_FILE = ENGINE_DIR / "03_Metrics" / "pattern_aggregator.json"


def run_engine(dry_run: bool = False, iterations: int = 1) -> dict:
    """Run the Auto-Improvement engine"""
    mode = "--scan" if dry_run else "--live"
    cmd = [sys.executable, str(ENGINE_DIR / "recursive_improvement_engine.py"), mode, "--iterations", str(iterations)]

    print(f"[INTEGRATION] Running engine: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(ENGINE_DIR))

    if result.returncode != 0:
        print(f"[ERROR] Engine failed: {result.stderr}")
        return {"success": False, "error": result.stderr}

    # Parse output to get detected issues
    output = result.stdout
    issues_detected = 0
    fixes_applied = 0

    for line in output.split("\n"):
        if "Issues detectados:" in line or "issues detected:" in line:
            try:
                issues_detected = int(line.split(":")[-1].strip())
            except ValueError:
                pass
        if "Fixes aplicados:" in line or "fixes applied:" in line:
            try:
                fixes_applied = int(line.split(":")[-1].strip())
            except ValueError:
                pass

    return {
        "success": True,
        "issues_detected": issues_detected,
        "fixes_applied": fixes_applied,
        "output": output
    }


def feed_patterns_to_aggregator(engine_result: dict):
    """Feed detected patterns to the aggregator"""
    if not engine_result.get("success"):
        return

    # Read learnings.json to get patterns
    if not LEARNINGS_FILE.exists():
        print("[INTEGRATION] No learnings.json found")
        return

    try:
        learnings = json.loads(LEARNINGS_FILE.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"[ERROR] Failed to read learnings: {e}")
        return

    patterns = learnings.get("patterns", [])
    fixes = learnings.get("fixes_history", [])

    print(f"[INTEGRATION] Found {len(patterns)} patterns, {len(fixes)} fixes in learnings.json")

    # Import and use aggregator
    sys.path.insert(0, str(ENGINE_DIR / "03_Metrics"))
    from pattern_aggregator import record_pattern

    # Feed unique patterns from fixes
    seen_hashes = set()
    for fix in fixes:
        issue = fix.get("issue", {})
        pattern_hash = issue.get("issue_hash", "")
        if not pattern_hash or pattern_hash in seen_hashes:
            continue
        seen_hashes.add(pattern_hash)

        success = record_pattern(
            pattern_hash=pattern_hash,
            description=issue.get("description", "Unknown pattern"),
            severity=issue.get("severity", "MEDIUM"),
            category=issue.get("category", "general"),
            fix=issue.get("suggestion", "")
        )

        if success:
            print(f"[INTEGRATION] Playbook generated for pattern: {pattern_hash}")


def run_quality_check():
    """Run Capital Token quality check"""
    print(f"\n[INTEGRATION] Running Capital Token quality check...")
    cmd = [sys.executable, str(QUALITY_CHECKER), "scan"]
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(PROJECT_ROOT))
    print(result.stdout)
    return result.returncode == 0


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Integration Wrapper — Auto-Improvement + Capital Token")
    parser.add_argument("--dry-run", action="store_true", help="Dry run (scan only)")
    parser.add_argument("--iterations", type=int, default=1, help="Number of iterations")
    parser.add_argument("--skip-quality", action="store_true", help="Skip quality check")
    args = parser.parse_args()

    print("=" * 60)
    print("INTEGRATION: Auto-Improvement + Capital Token")
    print("=" * 60)

    # Step 1: Run engine
    engine_result = run_engine(dry_run=args.dry_run, iterations=args.iterations)

    # Step 2: Feed patterns to aggregator
    if engine_result.get("success"):
        feed_patterns_to_aggregator(engine_result)

    # Step 3: Quality check
    if not args.skip_quality:
        run_quality_check()

    # Summary
    print("\n" + "=" * 60)
    print("INTEGRATION SUMMARY")
    print("=" * 60)
    print(f"Engine: {'OK' if engine_result.get('success') else 'FAILED'}")
    print(f"Issues detected: {engine_result.get('issues_detected', 0)}")
    print(f"Fixes applied: {engine_result.get('fixes_applied', 0)}")
    print("=" * 60)


if __name__ == "__main__":
    main()