#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
signal_normalizer.py — External Feedback Loop: Signal Normalization
===================================================================
PersonalOS v5.0 — Gap 3: External Feedback Loop

Normalizes raw signals to a 0-100 scale for cross-source comparison.
Applies Winsorization (cap percentiles 1 and 99) before normalizing.

Usage:
    python signal_normalizer.py
    python signal_normalizer.py --input signals.json --output signals_normalized.json
    python signal_normalizer.py --test

Output: 01_Personal_Os/03_Learning/04_Telemetry/signals_normalized.json

Version: 1.0.0
"""

# ── Windows UTF-8 Fix ──────────────────────────────────────
import sys
import io
if sys.platform == "win32" and hasattr(sys.stdout, "buffer") and not sys.stdout.closed:
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    except (AttributeError, ValueError):
        pass
    try:
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")
    except (AttributeError, ValueError):
        pass

import argparse
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# ── Path Resolution ────────────────────────────────────────
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "00_Winter_is_Coming").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os"))

from config_paths import ROOT_DIR, SIGNALS_DIR

# ── Logging ────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("signal_normalizer")

# ── Constants ──────────────────────────────────────────────
DEFAULT_INPUT = SIGNALS_DIR / "signals.json"
DEFAULT_OUTPUT = SIGNALS_DIR / "signals_normalized.json"

# Metrics that are naturally 0-100 or percentages
PERCENTAGE_METRICS = {"engagement_rate", "open_rate", "click_rate", "bounce_rate", "sentiment_score"}

# Metrics where higher = better (for trend calculation)
HIGHER_IS_BETTER = {"engagement_rate", "sentiment_score", "growth_rate", "conversion_rate",
                     "followers", "subscribers", "total_views", "pageviews", "impressions",
                     "post_impressions", "open_rate", "click_rate"}


# ── Winsorization ──────────────────────────────────────────

def winsorize(values: List[float], lower_pct: float = 1.0, upper_pct: float = 99.0) -> List[float]:
    """Cap values at the given percentiles to reduce outlier impact.

    Args:
        values: List of numeric values.
        lower_pct: Lower percentile to cap at (default: 1st).
        upper_pct: Upper percentile to cap at (default: 99th).

    Returns:
        Winsorized list (same length as input).
    """
    if len(values) < 3:
        return values[:]

    sorted_vals = sorted(values)
    n = len(sorted_vals)

    lower_idx = max(0, int(n * lower_pct / 100))
    upper_idx = min(n - 1, int(n * upper_pct / 100))

    lower_bound = sorted_vals[lower_idx]
    upper_bound = sorted_vals[upper_idx]

    return [max(lower_bound, min(upper_bound, v)) for v in values]


# ── Normalization ──────────────────────────────────────────

def normalize_min_max(values: List[float]) -> List[float]:
    """Normalize values to 0-100 using min-max scaling.

    Args:
        values: List of numeric values.

    Returns:
        Normalized values in range [0, 100].
    """
    if not values:
        return []

    min_val = min(values)
    max_val = max(values)

    if max_val == min_val:
        return [50.0] * len(values)  # All same → midpoint

    return [((v - min_val) / (max_val - min_val)) * 100.0 for v in values]


# ── Signal Normalizer ─────────────────────────────────────

class SignalNormalizer:
    """Normalizes raw signals to a 0-100 scale for cross-source comparison.

    Workflow:
        1. Group signals by metric name
        2. Winsorize each group (cap 1st/99th percentile)
        3. Min-max normalize each group to 0-100
    """

    def __init__(self, lower_pct: float = 1.0, upper_pct: float = 99.0):
        self.lower_pct = lower_pct
        self.upper_pct = upper_pct

    def normalize(self, signals: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Normalize a list of raw signals.

        Args:
            signals: List of signal dicts with keys: source, metric, value, timestamp, url.

        Returns:
            List of normalized signal dicts with additional 'normalized_value' field.
        """
        if not signals:
            logger.warning("No signals to normalize")
            return []

        # Group by metric
        by_metric: Dict[str, List[Dict]] = {}
        for sig in signals:
            metric = sig.get("metric", "unknown")
            if metric not in by_metric:
                by_metric[metric] = []
            by_metric[metric].append(sig)

        normalized = []
        for metric, group in by_metric.items():
            raw_values = [s.get("value", 0.0) for s in group]

            # Step 1: Winsorize
            winsorized = winsorize(raw_values, self.lower_pct, self.upper_pct)

            # Step 2: Min-max normalize to 0-100
            norm_values = normalize_min_max(winsorized)

            # Reassemble with normalized values
            for sig, norm_val in zip(group, norm_values):
                entry = dict(sig)  # shallow copy
                entry["normalized_value"] = round(norm_val, 2)
                entry["raw_value"] = sig.get("value", 0.0)
                normalized.append(entry)

            logger.debug(
                f"Metric '{metric}': {len(group)} signals, "
                f"range [{min(raw_values):.2f} - {max(raw_values):.2f}] → [0-100]"
            )

        logger.info(f"Normalized {len(signals)} signals across {len(by_metric)} metrics")
        return normalized


# ── Trend Calculator ───────────────────────────────────────

def calculate_trends(
    current: List[Dict], previous: Optional[List[Dict]], days: int = 7
) -> List[Dict[str, Any]]:
    """Add trend direction to normalized signals by comparing with previous data.

    Args:
        current: Current normalized signals.
        previous: Previous normalized signals (or None if no historical data).
        days: Comparison window in days.

    Returns:
        Current signals with 'trend' field added (up/down/flat).
    """
    if not previous:
        for sig in current:
            sig["trend"] = "flat"
            sig["trend_pct"] = 0.0
        return current

    # Build lookup from previous: (source, metric) → normalized_value
    prev_lookup: Dict[Tuple[str, str], float] = {}
    for sig in previous:
        key = (sig.get("source", ""), sig.get("metric", ""))
        prev_lookup[key] = sig.get("normalized_value", 50.0)

    for sig in current:
        key = (sig.get("source", ""), sig.get("metric", ""))
        if key in prev_lookup:
            curr_val = sig.get("normalized_value", 50.0)
            prev_val = prev_lookup[key]
            diff = curr_val - prev_val
            threshold = 2.0  # 2-point threshold to avoid noise
            if diff > threshold:
                sig["trend"] = "up"
            elif diff < -threshold:
                sig["trend"] = "down"
            else:
                sig["trend"] = "flat"
            sig["trend_pct"] = round(diff, 2)
        else:
            sig["trend"] = "flat"
            sig["trend_pct"] = 0.0

    return current


# ── Data I/O ───────────────────────────────────────────────

def safe_json_write(data: Any, path: Path) -> None:
    """Atomic JSON write — writes to temp file then renames."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(".tmp")
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        tmp_path.replace(path)
    except OSError as e:
        logger.error(f"Failed to write {path}: {e}")
        raise


def load_signals(path: Path) -> List[Dict[str, Any]]:
    """Load signals from a JSON file."""
    if not path.exists():
        logger.error(f"Input file not found: {path}")
        return []

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        signals = data.get("signals", [])
        logger.info(f"Loaded {len(signals)} signals from {path}")
        return signals
    except (json.JSONDecodeError, OSError) as e:
        logger.error(f"Failed to read {path}: {e}")
        return []


def load_previous_normalized(output_path: Path) -> Optional[List[Dict]]:
    """Load previously normalized signals for trend comparison."""
    if not output_path.exists():
        return None
    try:
        with open(output_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data.get("signals", [])
    except (json.JSONDecodeError, OSError):
        return None


# ── CLI ────────────────────────────────────────────────────

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="signal_normalizer",
        description="External Feedback Loop — Signal Normalization (PersonalOS v5.0)",
    )
    parser.add_argument(
        "--input", "-i",
        type=str,
        default=str(DEFAULT_INPUT),
        help="Input signals JSON file",
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default=str(DEFAULT_OUTPUT),
        help="Output normalized signals JSON file",
    )
    parser.add_argument(
        "--days", "-d",
        type=int,
        default=7,
        help="Trend comparison window in days (default: 7)",
    )
    parser.add_argument(
        "--lower-pct",
        type=float,
        default=1.0,
        help="Lower Winsorization percentile (default: 1.0)",
    )
    parser.add_argument(
        "--upper-pct",
        type=float,
        default=99.0,
        help="Upper Winsorization percentile (default: 99.0)",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable debug logging",
    )
    parser.add_argument(
        "--test",
        action="store_true",
        help="Run built-in smoke test and exit",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Normalize but don't write output file",
    )
    return parser


def run_smoke_test() -> int:
    """Built-in smoke test — verifies normalization without I/O."""
    logger.info("Running smoke test...")

    # Test winsorize
    vals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 100]
    w = winsorize(vals, lower_pct=1.0, upper_pct=90.0)
    assert max(w) <= 100
    assert min(w) >= 1
    logger.info(f"[PASS] winsorize: {vals} → {w}")

    # Test normalize_min_max
    normed = normalize_min_max([10, 20, 30])
    assert normed[0] == 0.0
    assert normed[-1] == 100.0
    logger.info(f"[PASS] normalize_min_max: [10,20,30] → {normed}")

    # Test edge case: all same values
    same = normalize_min_max([5, 5, 5])
    assert all(v == 50.0 for v in same)
    logger.info("[PASS] normalize_min_max handles all-same values")

    # Test edge case: empty
    assert normalize_min_max([]) == []
    logger.info("[PASS] normalize_min_max handles empty input")

    # Test full normalization pipeline
    normalizer = SignalNormalizer()
    test_signals = [
        {"source": "linkedin", "metric": "followers", "value": 100, "timestamp": "2026-01-01", "url": ""},
        {"source": "twitter", "metric": "followers", "value": 200, "timestamp": "2026-01-01", "url": ""},
        {"source": "youtube", "metric": "subscribers", "value": 50, "timestamp": "2026-01-01", "url": ""},
    ]
    result = normalizer.normalize(test_signals)
    assert len(result) == 3
    assert all("normalized_value" in r for r in result)
    # followers are normalized together: 100→0, 200→100
    followers = {r["source"]: r["normalized_value"] for r in result if r["metric"] == "followers"}
    assert followers["twitter"] == 100.0  # highest followers
    assert followers["linkedin"] == 0.0  # lowest followers
    # subscribers has only one value → midpoint 50.0
    subs = [r for r in result if r["metric"] == "subscribers"]
    assert len(subs) == 1
    assert subs[0]["normalized_value"] == 50.0
    logger.info("[PASS] Full normalization pipeline")

    # Test trend calculation
    prev = [
        {"source": "linkedin", "metric": "followers", "normalized_value": 40.0},
    ]
    current = [
        {"source": "linkedin", "metric": "followers", "normalized_value": 60.0},
    ]
    with_trends = calculate_trends(current, prev)
    assert with_trends[0]["trend"] == "up"
    logger.info("[PASS] Trend calculation")

    logger.info("All smoke tests passed!")
    return 0


def main():
    parser = build_parser()
    args = parser.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    if args.test:
        sys.exit(run_smoke_test())

    input_path = Path(args.input)
    output_path = Path(args.output)

    # Load raw signals
    signals = load_signals(input_path)
    if not signals:
        logger.error("No signals found — run capture_external_signals.py first")
        sys.exit(1)

    # Load previous for trends
    previous = load_previous_normalized(output_path)

    # Normalize
    normalizer = SignalNormalizer(
        lower_pct=args.lower_pct,
        upper_pct=args.upper_pct,
    )
    normalized = normalizer.normalize(signals)

    # Calculate trends
    normalized = calculate_trends(normalized, previous, days=args.days)

    # Write output
    payload = {
        "version": "1.0.0",
        "normalized_at": datetime.now().isoformat(),
        "count": len(normalized),
        "trend_window_days": args.days,
        "signals": normalized,
    }

    if not args.dry_run:
        safe_json_write(payload, output_path)
        logger.info(f"[OK] Wrote {len(normalized)} normalized signals to {output_path}")
    else:
        logger.info(f"[DRY RUN] {len(normalized)} signals normalized")
        for sig in normalized[:5]:
            trend_icon = {"up": "📈", "down": "📉", "flat": "➡️"}.get(sig.get("trend", "flat"), "➡️")
            logger.info(
                f"  {sig['source']:>12} | {sig['metric']:<20} | "
                f"{sig['normalized_value']:>5.1f} | {trend_icon}"
            )


if __name__ == "__main__":
    main()
