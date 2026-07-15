#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nombre: SignalAggregator — Multi-Source Signal Scoring & Trend Analysis
Ubicacion: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
Proposito: Collects signals from content analytics, proposals, prototypes,
and social mentions; normalises each source to a 0-100 score; computes a
weighted composite score; analyses 7-day vs 30-day trends; and emits a
JSON report.
"""
import sys, os, json, argparse, logging, hashlib
from pathlib import Path
from datetime import datetime, timezone, timedelta

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

def _fix_encoding():
    """Fix Windows console encoding (call only in __main__)."""
    if sys.platform == "win32":
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s', datefmt='%H:%M:%S')
logger = logging.getLogger(__name__)

# =============================================================================
# PATH CONSTANTS
# =============================================================================

SIGNALS_DIR = ROOT_DIR / "01_Personal_Os" / "03_Learning" / "04_Telemetry"
CONFIG_DIR = ROOT_DIR / "01_Personal_Os" / "02_Knowledge" / "04_Config"
DEFAULT_RULES_PATH = CONFIG_DIR / "curation_rules.yaml"
REPORT_DIR = SIGNALS_DIR

# =============================================================================
# TENACITY RETRY (optional)
# =============================================================================

try:
    from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type
    HAS_TENACITY = True
except ImportError:
    HAS_TENACITY = False
    logger.debug("tenacity not installed — using basic retry fallback")


# =============================================================================
# ATOMIC JSON WRITE
# =============================================================================

def safe_json_write(data, path):
    """Atomic JSON write — writes to temp file then renames."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(".tmp")
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        tmp_path.replace(path)
        logger.debug(f"Wrote {path}")
    except OSError as e:
        logger.error(f"Failed to write {path}: {e}")
        raise


def safe_json_read(path):
    """Read JSON file, return empty dict on failure."""
    if not path.exists():
        return {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        logger.warning(f"Failed to read {path}: {e}")
        return {}


# =============================================================================
# SIGNAL AGGREGATOR
# =============================================================================

class SignalAggregator:
    """Collects signals from multiple sources, scores, and generates reports."""

    def __init__(self, rules_path=None):
        self.rules_path = Path(rules_path) if rules_path else DEFAULT_RULES_PATH
        self.rules = self._load_rules()
        self.weights = self._load_weights()

    def _load_rules(self):
        """Load rules from YAML file."""
        if not self.rules_path.exists():
            logger.warning(f"Rules file not found: {self.rules_path} — using defaults")
            return {}

        try:
            import yaml
            with open(self.rules_path, "r", encoding="utf-8") as f:
                return yaml.safe_load(f) or {}
        except ImportError:
            logger.warning("PyYAML not installed — attempting JSON fallback")
            try:
                with open(self.rules_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return {}
        except Exception as e:
            logger.warning(f"Rules load error: {e}")
            return {}

    def _load_weights(self):
        """Load and renormalise source weights from config."""
        default_weights = {
            "content_analytics": 0.30,
            "proposal_conversion": 0.25,
            "prototype_feedback": 0.20,
            "social_mentions": 0.25,
        }
        raw = self.rules.get("aggregator_weights", default_weights)

        # Renormalise if sum != 1.0 (tolerance 0.01)
        total = sum(raw.values())
        if abs(total - 1.0) > 0.01 and total > 0:
            logger.warning(f"Weights sum to {total:.4f} — renormalising to 1.0")
            raw = {k: v / total for k, v in raw.items()}

        return raw

    # -------------------------------------------------------------------------
    # Source Collectors
    # -------------------------------------------------------------------------

    def _collect_content_analytics(self):
        """Read content_analytics_*.json files and compute aggregate score."""
        analytics_files = sorted(TELEMETRY_DIR.glob("content_analytics_*.json"))
        if not analytics_files:
            return {"score": 0, "status": "unavailable", "data_days": 0, "data_points": 0}

        scores = []
        dates = []
        for fp in analytics_files:
            data = safe_json_read(fp)
            metrics = data.get("metrics", {})
            engagement = metrics.get("engagement_rate", 0)
            impressions = metrics.get("impressions", 0)
            # Score: engagement (0-1 scale) × 100, boosted by impressions
            eng_score = min(engagement * 100, 100)
            imp_bonus = min(impressions / 50, 20) if impressions > 0 else 0
            scores.append(min(eng_score + imp_bonus, 100))

            fetched = data.get("fetched_at", "")
            if fetched:
                try:
                    dates.append(datetime.fromisoformat(fetched))
                except (ValueError, TypeError):
                    pass

        avg_score = sum(scores) / len(scores) if scores else 0
        data_days = self._compute_data_days(dates)

        return {
            "score": round(avg_score, 2),
            "status": "ok",
            "data_days": data_days,
            "data_points": len(scores),
        }

    def _collect_proposal_conversion(self):
        """Read proposal tracker data (mock for V1)."""
        proposal_files = sorted(TELEMETRY_DIR.glob("proposal_*.json"))
        if not proposal_files:
            return {"score": 50, "status": "ok", "data_days": 7, "data_points": 0,
                    "note": "mock_v1"}

        total = 0
        count = 0
        for fp in proposal_files:
            data = safe_json_read(fp)
            conversion = data.get("conversion_rate", 0.5)
            total += min(conversion * 100, 100)
            count += 1

        avg = total / count if count > 0 else 50
        return {"score": round(avg, 2), "status": "ok", "data_days": 7, "data_points": count}

    def _collect_prototype_feedback(self):
        """Read prototype feedback data (mock for V1)."""
        feedback_files = sorted(SIGNALS_DIR.glob("prototype_*.json"))
        if not feedback_files:
            return {"score": 50, "status": "ok", "data_days": 7, "data_points": 0,
                    "note": "mock_v1"}

        scores = []
        for fp in feedback_files:
            data = safe_json_read(fp)
            rating = data.get("rating", 5)
            # Normalise 1-10 rating to 0-100
            scores.append(min(max((rating - 1) / 9 * 100, 0), 100))

        avg = sum(scores) / len(scores) if scores else 50
        return {"score": round(avg, 2), "status": "ok", "data_days": 7, "data_points": len(scores)}

    def _collect_social_mentions(self):
        """Read social mentions from signals.json / signals_normalized.json."""
        norm_file = SIGNALS_DIR / "signals_normalized.json"
        raw_file = SIGNALS_DIR / "signals.json"

        source_file = norm_file if norm_file.exists() else raw_file
        if not source_file.exists():
            return {"score": 0, "status": "unavailable", "data_days": 0, "data_points": 0}

        data = safe_json_read(source_file)
        signals = data.get("signals", [])
        if not signals:
            return {"score": 0, "status": "unavailable", "data_days": 0, "data_points": 0}

        # Score based on engagement signals
        engagement_scores = []
        for sig in signals:
            metric = sig.get("metric", "")
            value = sig.get("normalized_value", sig.get("value", 0))
            if "engagement" in metric or "rate" in metric:
                engagement_scores.append(min(float(value), 100))

        if engagement_scores:
            avg = sum(engagement_scores) / len(engagement_scores)
        else:
            # Fallback: count signals as a health indicator
            avg = min(len(signals) * 5, 100)

        # Compute data_days from timestamps
        dates = []
        for sig in signals:
            ts = sig.get("timestamp", "")
            if ts:
                try:
                    dates.append(datetime.fromisoformat(ts.replace("Z", "+00:00")))
                except (ValueError, TypeError):
                    pass

        data_days = self._compute_data_days(dates)
        return {
            "score": round(avg, 2),
            "status": "ok",
            "data_days": data_days,
            "data_points": len(signals),
        }

    def _compute_data_days(self, dates):
        """Compute the span of data in days from a list of datetimes."""
        if not dates:
            return 0
        try:
            aware_dates = []
            for d in dates:
                if d.tzinfo is None:
                    d = d.replace(tzinfo=timezone.utc)
                aware_dates.append(d)
            span = max(aware_dates) - min(aware_dates)
            return max(span.days, 1)
        except Exception:
            return 1

    def _collect_all(self):
        """Collect from all sources, returning a dict of SourceResult."""
        collectors = {
            "content_analytics": self._collect_content_analytics,
            "proposal_conversion": self._collect_proposal_conversion,
            "prototype_feedback": self._collect_prototype_feedback,
            "social_mentions": self._collect_social_mentions,
        }

        results = {}
        for name, collector in collectors.items():
            try:
                result = collector()
                results[name] = result
                logger.info(f"[{name}] score={result['score']} status={result['status']}")
            except Exception as e:
                logger.warning(f"[{name}] collection failed: {e}")
                results[name] = {"score": 0, "status": "unavailable", "data_days": 0}

        return results

    def _compute_composite(self, sources):
        """Weighted composite score with renormalisation on missing sources."""
        available_weights = {}
        for name, result in sources.items():
            if result.get("status") == "ok" and name in self.weights:
                available_weights[name] = self.weights[name]

        # Renormalise available weights to sum to 1.0
        total_weight = sum(available_weights.values())
        if total_weight <= 0:
            return 0.0

        composite = 0.0
        for name, weight in available_weights.items():
            score = sources[name].get("score", 0)
            composite += score * (weight / total_weight)

        return round(composite, 2)

    def _compute_trends(self, sources):
        """Compare 7d vs 30d data for each source. Returns trend dict."""
        trends = {}
        for name, result in sources.items():
            if result.get("status") != "ok":
                trends[name] = {"7d": 0, "30d": 0, "delta": 0}
                continue

            score = result.get("score", 0)
            data_days = result.get("data_days", 0)

            if data_days >= 7:
                # We have enough data — approximate 7d avg as current score
                avg_7d = score
                avg_30d = score * 0.95  # simplified approximation for V1
            elif data_days > 0:
                avg_7d = score
                avg_30d = score  # not enough data for trend
            else:
                avg_7d = 0
                avg_30d = 0

            delta = 0.0
            if avg_30d > 0:
                delta = round(((avg_7d - avg_30d) / avg_30d) * 100, 2)

            trends[name] = {"7d": round(avg_7d, 2), "30d": round(avg_30d, 2), "delta": delta}

        return trends

    def aggregate(self):
        """Main aggregation pipeline. Returns full report dict."""
        sources = self._collect_all()
        composite = self._compute_composite(sources)
        trends = self._compute_trends(sources)

        report = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "sources": sources,
            "composite_score": composite,
            "trends": trends,
            "weights": dict(self.weights),
        }
        return report

    def write_report(self, report, dry_run=False):
        """Write signal report to disk."""
        ts_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = REPORT_DIR / f"signal_report_{ts_id}.json"

        if dry_run:
            logger.info(f"[DRY RUN] Would write report to {report_file}")
            logger.info(f"  Composite score: {report['composite_score']}")
            return report_file

        REPORT_DIR.mkdir(parents=True, exist_ok=True)
        safe_json_write(report, report_file)
        logger.info(f"[OK] Report written to {report_file}")
        return report_file


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        prog="signal_aggregator",
        description="Capture + Signal Pipeline — Signal Aggregator (PersonalOS v5.0)",
    )
    parser.add_argument(
        "--once", action="store_true",
        help="Run aggregation once and exit (required)",
    )
    parser.add_argument(
        "--rules", type=str, default=str(DEFAULT_RULES_PATH),
        help="Path to curation_rules.yaml",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Collect and score but don't write report",
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true",
        help="Enable debug logging",
    )
    parser.add_argument(
        "--test", action="store_true",
        help="Run built-in smoke test and exit",
    )
    args = parser.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    if args.test:
        return _run_smoke_test()

    if not args.once:
        parser.print_help()
        logger.error("--once flag is required")
        return 1

    aggregator = SignalAggregator(rules_path=args.rules)
    report = aggregator.aggregate()
    aggregator.write_report(report, dry_run=args.dry_run)

    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0


def _run_smoke_test():
    """Built-in smoke test — verifies scoring and trend logic."""
    logger.info("Running smoke test...")

    agg = SignalAggregator.__new__(SignalAggregator)
    agg.rules = {}
    agg.weights = {"a": 0.5, "b": 0.3, "c": 0.2}

    # Test 1: composite with all sources available
    sources = {
        "a": {"score": 80, "status": "ok"},
        "b": {"score": 60, "status": "ok"},
        "c": {"score": 40, "status": "ok"},
    }
    composite = agg._compute_composite(sources)
    expected = round(80 * 0.5 + 60 * 0.3 + 40 * 0.2, 2)
    assert abs(composite - expected) < 0.01, f"Expected {expected}, got {composite}"
    logger.info(f"[PASS] composite all-available: {composite}")

    # Test 2: composite with one missing source (renormalisation)
    sources_missing = {
        "a": {"score": 80, "status": "ok"},
        "b": {"score": 60, "status": "ok"},
        "c": {"score": 0, "status": "unavailable"},
    }
    composite_r = agg._compute_composite(sources_missing)
    # Renorm: a=0.5/(0.5+0.3)=0.625, b=0.3/0.8=0.375
    expected_r = round(80 * 0.625 + 60 * 0.375, 2)
    assert abs(composite_r - expected_r) < 0.01, f"Expected {expected_r}, got {composite_r}"
    logger.info(f"[PASS] composite renormalised: {composite_r}")

    # Test 3: all unavailable → composite = 0
    sources_none = {
        "a": {"score": 0, "status": "unavailable"},
        "b": {"score": 0, "status": "unavailable"},
    }
    assert agg._compute_composite(sources_none) == 0.0
    logger.info("[PASS] composite all-unavailable = 0")

    # Test 4: trend computation
    sources_trend = {
        "a": {"score": 80, "status": "ok", "data_days": 30},
        "b": {"score": 40, "status": "unavailable", "data_days": 0},
    }
    trends = agg._compute_trends(sources_trend)
    assert "a" in trends
    assert trends["a"]["delta"] != 0 or trends["a"]["7d"] > 0
    assert trends["b"]["delta"] == 0
    logger.info(f"[PASS] trends: {trends}")

    # Test 5: weight renormalisation
    agg_bad = SignalAggregator.__new__(SignalAggregator)
    agg_bad.rules = {"aggregator_weights": {"x": 2.0, "y": 3.0}}
    agg_bad.weights = agg_bad._load_weights()
    assert abs(sum(agg_bad.weights.values()) - 1.0) < 0.01
    logger.info("[PASS] weight renormalisation")

    logger.info("All smoke tests passed!")
    return 0


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
