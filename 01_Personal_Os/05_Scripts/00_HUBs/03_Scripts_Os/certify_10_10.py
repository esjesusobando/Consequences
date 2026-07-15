#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
certify_10_10.py - Master Certification Validator for PersonalOS v5.0
=====================================================================
Runs ALL system validators in sequence and produces a final
certification report.  The name "10/10" reflects the goal: every
validator passes, giving the system a perfect score.

Usage:
    python certify_10_10.py --verbose
    python certify_10_10.py --json
    python certify_10_10.py --test

Ubication: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
"""

import sys, os, json, argparse, logging, subprocess, time
from pathlib import Path
from datetime import datetime, timezone

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%H:%M:%S',
)
logger = logging.getLogger(__name__)

# ── Validator Registry ────────────────────────────────────────

ENGINE_DIR = ROOT_DIR / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os"

VALIDATORS = [
    {
        "name": "config_paths",
        "command": "python config_paths.py --validate",
        "timeout": 30,
        "critical": True,
    },
    {
        "name": "sync_copies",
        "command": "python sync_copies.py --dry-run",
        "timeout": 15,
        "critical": True,
    },
    {
        "name": "system_mapper",
        "command": "python 20_System_Mapper_Hub.py --scan",
        "timeout": 30,
        "critical": True,
    },
    {
        "name": "sota_integrity",
        "command": "python 12_Auditors_Os/scripts/03_SOTA_Integrity_Check.py",
        "timeout": 30,
        "critical": True,
    },
    {
        "name": "parallel_audit",
        "command": "python 05_Validator/00_Parallel_Audit_Pro.py --full",
        "timeout": 60,
        "critical": True,
    },
    {
        "name": "session_init",
        "command": "python session_init_test.py --test",
        "timeout": 30,
        "critical": True,
    },
    {
        "name": "telemetry",
        "command": "python 18_Telemetry_Hub.py --morning",
        "timeout": 30,
        "critical": False,
    },
    {
        "name": "skill_chain",
        "command": "python skill_chain.py --test",
        "timeout": 30,
        "critical": True,
    },
    {
        "name": "output_eval",
        "command": "python output_eval.py --test",
        "timeout": 30,
        "critical": True,
    },
    {
        "name": "curation_filter",
        "command": "python curation_filter.py --test",
        "timeout": 30,
        "critical": True,
    },
    {
        "name": "signal_aggregator",
        "command": "python signal_aggregator.py --test",
        "timeout": 30,
        "critical": True,
    },
    {
        "name": "prototype_studio",
        "command": "python prototype_studio.py --test",
        "timeout": 30,
        "critical": True,
    },
]


# ── Result Model ──────────────────────────────────────────────

class ValidatorResult:
    """Encapsulates a single validator run."""

    def __init__(self, name: str, critical: bool, timeout: int):
        self.name = name
        self.critical = critical
        self.timeout = timeout
        self.status = "SKIP"
        self.duration_sec = 0.0
        self.output = ""
        self.error = ""

    def to_dict(self) -> dict:
        d = {
            "name": self.name,
            "status": self.status,
            "duration_sec": round(self.duration_sec, 2),
            "critical": self.critical,
        }
        if self.output:
            d["output"] = self.output
        if self.error:
            d["error"] = self.error
        return d


# ── Execution ─────────────────────────────────────────────────

def run_validator(vdef: dict, verbose: bool = False) -> ValidatorResult:
    """Execute a single validator and return its result."""
    r = ValidatorResult(vdef["name"], vdef["critical"], vdef["timeout"])
    cmd = vdef["command"]
    timeout = vdef["timeout"]

    if verbose:
        logger.info(f"Running: {vdef['name']}  ({cmd})")

    t0 = time.time()
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=str(ENGINE_DIR),
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        r.duration_sec = time.time() - t0

        stdout = (result.stdout or "").strip()
        stderr = (result.stderr or "").strip()

        if result.returncode == 0:
            r.status = "PASS"
            r.output = stdout[-200:] if stdout else "OK"
        else:
            r.status = "FAIL"
            r.output = stdout[-200:] if stdout else ""
            r.error = stderr[-200:] if stderr else f"exit code {result.returncode}"

        if verbose:
            sym = "[PASS]" if r.status == "PASS" else "[FAIL]"
            logger.info(f"  {sym} {r.name} ({r.duration_sec:.1f}s)")
            if r.error:
                logger.warning(f"    stderr: {r.error[:120]}")

    except subprocess.TimeoutExpired:
        r.duration_sec = time.time() - t0
        r.status = "TIMEOUT"
        r.error = f"Exceeded {timeout}s timeout"
        logger.warning(f"  [TIMEOUT] {r.name} after {timeout}s")

    except Exception as e:
        r.duration_sec = time.time() - t0
        r.status = "ERROR"
        r.error = str(e)[:200]
        logger.error(f"  [ERROR] {r.name}: {r.error}")

    return r


def run_all(validators: list, verbose: bool = False) -> dict:
    """Run every validator and build the certification report."""
    cert_id = f"cert_{datetime.now().strftime('%Y%m%d')}"
    ts = datetime.now(timezone.utc).isoformat()
    results = []

    t_start = time.time()

    for vdef in validators:
        vr = run_validator(vdef, verbose=verbose)
        results.append(vr)

    total_duration = time.time() - t_start

    passed = sum(1 for r in results if r.status == "PASS")
    failed = sum(1 for r in results if r.status in ("FAIL", "TIMEOUT", "ERROR"))
    skipped = sum(1 for r in results if r.status == "SKIP")
    total = len(results)

    # A system scores 10/10 only when ALL critical validators pass
    critical_results = [r for r in results if r.critical]
    critical_passed = all(r.status == "PASS" for r in critical_results)

    if failed == 0 and passed == total:
        status = "PASS"
        score = "10/10"
    elif critical_passed and failed > 0:
        status = "PASS_WITH_WARNINGS"
        score = f"{passed}/{total}"
    else:
        status = "FAIL"
        score = f"{passed}/{total}"

    report = {
        "certification_id": cert_id,
        "timestamp": ts,
        "status": status,
        "total": total,
        "passed": passed,
        "failed": failed,
        "skipped": skipped,
        "duration_sec": round(total_duration, 2),
        "results": [r.to_dict() for r in results],
        "score": score,
    }

    return report


# ── Output Formatters ─────────────────────────────────────────

def print_human(report: dict) -> None:
    """Pretty-print the certification report for humans."""
    print()
    print("=" * 60)
    print("  PersonalOS v5.0 — CERTIFICATION REPORT")
    print("=" * 60)
    print(f"  ID       : {report['certification_id']}")
    print(f"  Timestamp: {report['timestamp']}")
    print(f"  Status   : {report['status']}")
    print(f"  Score    : {report['score']}")
    print(f"  Duration : {report['duration_sec']}s")
    print("-" * 60)

    for r in report["results"]:
        sym = {
            "PASS": "[PASS]",
            "FAIL": "[FAIL]",
            "TIMEOUT": "[TIMEOUT]",
            "ERROR": "[ERROR]",
            "SKIP": "[SKIP]",
        }.get(r["status"], "[????]")
        crit = " *" if r.get("critical") else "  "
        print(f"  {sym}{crit} {r['name']:<20s} {r['duration_sec']:>5.1f}s  {r.get('output', '')[:50]}")
        if r.get("error"):
            print(f"         err: {r['error'][:70]}")

    print("-" * 60)
    print(f"  {report['passed']}/{report['total']} passed  |  "
          f"{report['failed']} failed  |  {report['skipped']} skipped")
    print(f"  (* = critical validator)")
    print("=" * 60)
    print()


def print_json(report: dict) -> None:
    """Print machine-readable JSON report."""
    print(json.dumps(report, indent=2, ensure_ascii=False))


# ── Meta-Tests (--test mode) ─────────────────────────────────

def run_meta_tests(verbose: bool = False) -> int:
    """Self-test: validate the certify script's own structure and logic.

    Returns 0 if all meta-tests pass, 1 otherwise.
    """
    errors = 0
    passed = 0

    def check(label: str, condition: bool, detail: str = ""):
        nonlocal errors, passed
        if condition:
            passed += 1
            if verbose:
                print(f"  [PASS] {label}")
        else:
            errors += 1
            print(f"  [FAIL] {label} — {detail}")

    print("certify_10_10.py — Meta-Tests")
    print("-" * 40)

    # T1: VALIDATORS list is non-empty
    check("T01_validators_not_empty", len(VALIDATORS) > 0,
          "VALIDATORS list is empty")

    # T2: All validators have required keys
    required_keys = {"name", "command", "timeout", "critical"}
    for v in VALIDATORS:
        missing = required_keys - set(v.keys())
        check(f"T02_keys_{v['name']}", len(missing) == 0,
              f"Missing keys: {missing}")

    # T3: Timeouts are positive integers
    for v in VALIDATORS:
        check(f"T03_timeout_{v['name']}", isinstance(v["timeout"], int) and v["timeout"] > 0,
              f"timeout={v['timeout']}")

    # T4: All validator names are unique
    names = [v["name"] for v in VALIDATORS]
    check("T04_unique_names", len(names) == len(set(names)),
          f"Duplicates: {[n for n in names if names.count(n) > 1]}")

    # T5: ValidatorResult model works
    vr = ValidatorResult("test", True, 10)
    vr.status = "PASS"
    vr.output = "hello"
    d = vr.to_dict()
    check("T05_result_model", d["status"] == "PASS" and d["output"] == "hello",
          f"Got: {d}")

    # T6: run_all produces expected structure
    report = run_all([], verbose=False)
    check("T06_empty_report", report["status"] == "PASS" and report["total"] == 0,
          f"Unexpected: {report['status']}")

    # T7: ENGINE_DIR exists
    check("T07_engine_dir", ENGINE_DIR.exists(),
          f"ENGINE_DIR not found: {ENGINE_DIR}")

    # T8: All validator scripts exist on disk
    for v in VALIDATORS:
        cmd = v["command"]
        script = cmd.split()[1]  # "python <script> ..."
        script_path = ENGINE_DIR / script
        check(f"T08_exists_{v['name']}", script_path.exists(),
              f"Not found: {script_path}")

    # T9: ROOT_DIR is set and valid
    check("T09_root_dir", ROOT_DIR is not None and ROOT_DIR.exists(),
          f"ROOT_DIR={ROOT_DIR}")

    # T10: TELEMETRY_DIR is set
    check("T10_telemetry_dir", TELEMETRY_DIR is not None,
          "TELEMETRY_DIR is None")

    print("-" * 40)
    print(f"Results: {passed} passed, {errors} failed")
    print("=" * 40)
    return 0 if errors == 0 else 1


# ── CLI ───────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="PersonalOS v5.0 — Master Certification Validator"
    )
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="Show detailed output during validation")
    parser.add_argument("--json", action="store_true",
                        help="Output report as JSON")
    parser.add_argument("--test", action="store_true",
                        help="Run meta-tests on this script")

    args = parser.parse_args()

    if args.test:
        exit(run_meta_tests(verbose=args.verbose))

    report = run_all(VALIDATORS, verbose=args.verbose)

    if args.json:
        print_json(report)
    else:
        print_human(report)

    # Persist report to telemetry directory
    try:
        TELEMETRY_DIR.mkdir(parents=True, exist_ok=True)
        report_file = TELEMETRY_DIR / f"certification_{report['certification_id']}.json"
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        if args.verbose:
            logger.info(f"Report saved to: {report_file}")
    except Exception as e:
        logger.warning(f"Could not persist report: {e}")

    # Exit code: 0 if all critical validators pass, 1 otherwise
    critical_results = [r for r in report["results"] if r.get("critical")]
    all_critical_pass = all(r["status"] == "PASS" for r in critical_results)
    exit(0 if all_critical_pass else 1)


if __name__ == "__main__":
    main()
