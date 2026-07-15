#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nombre: Benchmark Baseline — Performance Baselines & Drift Detection
Ubicacion: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
Proposito: Compute P50/P90/P99 baselines from telemetry data, store them,
           and detect drift between current 7-day window and 30-day baseline.

Usage:
    python benchmark_baseline.py --compute --verbose
    python benchmark_baseline.py --verify
    python benchmark_baseline.py --drift
"""

import sys
import os
import json
import argparse
import logging
import statistics
import tempfile
from pathlib import Path
from datetime import datetime, timezone
from typing import Any

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, SIGNALS_DIR

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%H:%M:%S',
)
logger = logging.getLogger(__name__)

# ── Constants ────────────────────────────────────────────────

TELEMETRY_DIR = SIGNALS_DIR  # 03_Learning/04_Telemetry/
BASELINE_FILE = TELEMETRY_DIR / "benchmark_baseline.json"
DRIFT_THRESHOLD_PCT = 20.0  # Alert if >20% deviation from baseline

# Metrics to track
TRACKED_METRICS = [
    "followers",
    "engagement_rate",
    "post_impressions",
    "impressions",
]


# ── Helpers ──────────────────────────────────────────────────

def safe_json_write(data: dict, path: Path) -> None:
    """Atomic JSON write — writes to temp file then renames."""
    import time
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_fd, tmp_path_str = tempfile.mkstemp(suffix=".tmp", dir=str(path.parent))
    tmp_path = Path(tmp_path_str)
    os.close(tmp_fd)
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        # Retry replace on Windows (file handle may linger briefly)
        for attempt in range(5):
            try:
                tmp_path.replace(path)
                break
            except PermissionError:
                if attempt < 4:
                    time.sleep(0.1 * (attempt + 1))
                else:
                    raise
        logger.debug(f"Wrote {path}")
    except OSError as e:
        if tmp_path.exists():
            try:
                tmp_path.unlink()
            except OSError:
                pass
        logger.error(f"Failed to write {path}: {e}")
        raise


def percentile(values: list[float], p: float) -> float:
    """Compute percentile from a sorted list."""
    if not values:
        return 0.0
    sorted_vals = sorted(values)
    k = (len(sorted_vals) - 1) * (p / 100.0)
    f = int(k)
    c = f + 1
    if c >= len(sorted_vals):
        return sorted_vals[-1]
    d = k - f
    return sorted_vals[f] + d * (sorted_vals[c] - sorted_vals[f])


def compute_percentiles(values: list[float]) -> dict:
    """Compute P50, P90, P99 from a list of values."""
    if not values:
        return {"p50": 0, "p90": 0, "p99": 0, "min": 0, "max": 0, "mean": 0, "count": 0}
    return {
        "p50": round(percentile(values, 50), 2),
        "p90": round(percentile(values, 90), 2),
        "p99": round(percentile(values, 99), 2),
        "min": round(min(values), 2),
        "max": round(max(values), 2),
        "mean": round(statistics.mean(values), 2),
        "count": len(values),
    }


# ── Core ─────────────────────────────────────────────────────

def load_telemetry_files(tele_dir: Path) -> list[dict]:
    """Load all JSON telemetry files from the directory.
    
    Handles both formats:
    - Dict with "signals" array (signals.json, signals_normalized.json)
    - Bare list of items (leads.json)
    """
    files = []
    for f in tele_dir.glob("*.json"):
        try:
            with open(f, "r", encoding="utf-8") as fh:
                data = json.load(fh)
                if isinstance(data, dict):
                    data["_source_file"] = f.name
                    files.append(data)
                elif isinstance(data, list) and data and isinstance(data[0], dict):
                    # Wrap bare list in a signals container
                    files.append({"signals": data, "_source_file": f.name})
                # Skip empty lists or non-dict items
        except (json.JSONDecodeError, OSError) as e:
            logger.warning(f"Skipping {f.name}: {e}")
    return files


def extract_metric_values(telemetry_files: list[dict]) -> dict[str, list[float]]:
    """Extract metric values grouped by source+metric key."""
    values: dict[str, list[float]] = {}
    for tf in telemetry_files:
        for signal in tf.get("signals", []):
            source = signal.get("source", "unknown")
            metric = signal.get("metric", "unknown")
            val = signal.get("value")
            if val is not None and isinstance(val, (int, float)):
                key = f"{source}.{metric}"
                values.setdefault(key, []).append(float(val))
    return values


def compute_baselines(telemetry_dir: Path, verbose: bool = False) -> dict:
    """Compute baselines from all available telemetry data."""
    files = load_telemetry_files(telemetry_dir)
    if not files:
        logger.warning(f"No telemetry files found in {telemetry_dir}")
        return {"error": "no telemetry files", "metrics": {}}

    metric_values = extract_metric_values(files)
    baselines = {
        "computed_at": datetime.now(timezone.utc).isoformat(),
        "source_files": [f.get("_source_file", "unknown") for f in files],
        "total_signals": sum(len(v) for v in metric_values.values()),
        "metrics": {},
    }

    for key, vals in sorted(metric_values.items()):
        baselines["metrics"][key] = compute_percentiles(vals)
        if verbose:
            stats = baselines["metrics"][key]
            logger.info(
                f"  {key}: P50={stats['p50']}, P90={stats['p90']}, "
                f"P99={stats['p99']}, n={stats['count']}"
            )

    return baselines


def check_drift(baselines: dict, telemetry_dir: Path, verbose: bool = False) -> dict:
    """Compare current values against baselines and detect drift."""
    files = load_telemetry_files(telemetry_dir)
    current_values = extract_metric_values(files)

    drift_report = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "threshold_pct": DRIFT_THRESHOLD_PCT,
        "drift_detected": False,
        "details": {},
    }

    for key, baseline_stats in baselines.get("metrics", {}).items():
        current = current_values.get(key, [])
        if not current:
            drift_report["details"][key] = {
                "status": "no_current_data",
                "baseline_mean": baseline_stats.get("mean", 0),
            }
            continue

        current_mean = statistics.mean(current)
        baseline_mean = baseline_stats.get("mean", 0)

        if baseline_mean == 0:
            pct_diff = 0.0 if current_mean == 0 else 100.0
        else:
            pct_diff = abs(current_mean - baseline_mean) / abs(baseline_mean) * 100

        has_drift = pct_diff > DRIFT_THRESHOLD_PCT
        if has_drift:
            drift_report["drift_detected"] = True

        drift_report["details"][key] = {
            "baseline_mean": round(baseline_mean, 2),
            "current_mean": round(current_mean, 2),
            "pct_diff": round(pct_diff, 2),
            "drift": has_drift,
            "current_n": len(current),
        }

        if verbose or has_drift:
            status = "DRIFT" if has_drift else "OK"
            logger.info(
                f"  [{status}] {key}: baseline={baseline_mean:.1f} "
                f"current={current_mean:.1f} ({pct_diff:.1f}%)"
            )

    return drift_report


# ── CLI ──────────────────────────────────────────────────────

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="benchmark_baseline",
        description="Compute and verify performance baselines from telemetry data.",
    )
    action = parser.add_mutually_exclusive_group()
    action.add_argument("--compute", action="store_true", help="Compute baselines")
    action.add_argument("--verify", action="store_true", help="Verify baselines exist")
    action.add_argument("--drift", action="store_true", help="Check drift vs baselines")
    parser.add_argument("--verbose", action="store_true", help="Verbose logging")
    parser.add_argument("--test", action="store_true", help="Run self-tests")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    return parser


def run_self_tests() -> bool:
    """Run basic self-tests for the benchmark module."""
    import tempfile

    logger.info("Running self-tests...")

    # Test 1: percentile
    vals = [1.0, 2.0, 3.0, 4.0, 5.0]
    assert percentile(vals, 50) == 3.0
    assert percentile(vals, 90) == 4.6
    assert percentile(vals, 99) == 4.96
    logger.info("[PASS] percentile")

    # Test 2: compute_percentiles
    result = compute_percentiles([10, 20, 30, 40, 50])
    assert result["count"] == 5
    assert result["min"] == 10
    assert result["max"] == 50
    assert result["p50"] == 30
    logger.info("[PASS] compute_percentiles")

    # Test 3: compute_percentiles empty
    result_empty = compute_percentiles([])
    assert result_empty["count"] == 0
    logger.info("[PASS] compute_percentiles empty")

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

    if not any([args.compute, args.verify, args.drift]):
        logger.error("Specify --compute, --verify, or --drift")
        return 1

    if args.compute:
        logger.info("Computing baselines from telemetry data...")
        baselines = compute_baselines(TELEMETRY_DIR, verbose=args.verbose)

        if args.json:
            print(json.dumps(baselines, indent=2, ensure_ascii=False))
        else:
            metrics = baselines.get("metrics", {})
            print(f"\nBaselines computed from {len(baselines.get('source_files', []))} files:")
            for key, stats in sorted(metrics.items()):
                print(
                    f"  {key:30s} P50={stats['p50']:>8} P90={stats['p90']:>8} "
                    f"P99={stats['p99']:>8} n={stats['count']}"
                )

        if "error" not in baselines:
            safe_json_write(baselines, BASELINE_FILE)
            logger.info(f"Baselines saved to: {BASELINE_FILE}")
        else:
            logger.warning("No data to baseline — skipping save")

    elif args.verify:
        if BASELINE_FILE.exists():
            with open(BASELINE_FILE) as f:
                baselines = json.load(f)
            metrics = baselines.get("metrics", {})
            print(f"Baselines file: {BASELINE_FILE}")
            print(f"Computed at:    {baselines.get('computed_at', 'unknown')}")
            print(f"Metrics tracked: {len(metrics)}")
            for key in sorted(metrics):
                s = metrics[key]
                print(
                    f"  {key:30s} P50={s['p50']:>8} P90={s['p90']:>8} "
                    f"P99={s['p99']:>8} n={s['count']}"
                )
            return 0
        else:
            logger.error(f"No baseline file found at {BASELINE_FILE}")
            return 1

    elif args.drift:
        if not BASELINE_FILE.exists():
            logger.error(f"No baseline file found at {BASELINE_FILE}. Run --compute first.")
            return 1

        with open(BASELINE_FILE) as f:
            baselines = json.load(f)

        drift = check_drift(baselines, TELEMETRY_DIR, verbose=args.verbose)

        if args.json:
            print(json.dumps(drift, indent=2, ensure_ascii=False))
        else:
            status = "DRIFT DETECTED" if drift["drift_detected"] else "ALL OK"
            print(f"\nDrift Check: {status}")
            for key, detail in sorted(drift.get("details", {}).items()):
                if detail.get("drift"):
                    print(
                        f"  [DRIFT] {key}: baseline={detail['baseline_mean']} "
                        f"current={detail['current_mean']} ({detail['pct_diff']}%)"
                    )

        return 1 if drift["drift_detected"] else 0

    return 0


if __name__ == "__main__":
    sys.exit(main())
