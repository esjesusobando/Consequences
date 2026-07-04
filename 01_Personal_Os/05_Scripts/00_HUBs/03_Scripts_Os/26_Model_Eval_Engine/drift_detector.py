"""
drift_detector.py — Statistical Process Control Drift Detection
================================================================
Detects quality drift in model eval runs using SPC (Statistical Process Control).

Compares recent runs against a baseline window using z-scores:
  - z > 3.0  → critical drift (red alert)
  - z > 2.0  → warning drift (yellow alert)
  - else     → no actionable drift

Uses RunHistory as its data source — reads baseline stats and recent means.

Uso:
    from drift_detector import DriftDetector
    from run_history import RunHistory
    dd = DriftDetector(RunHistory())
    report = dd.check("gpt-5.1", "reasoning")
    all_reports = dd.check_all()
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

try:
    from config_paths import DRIFT_REPORTS_DIR
except ImportError:
    import sys
    _BASE = Path(__file__).resolve().parent.parent
    sys.path.insert(0, str(_BASE))
    from config_paths import DRIFT_REPORTS_DIR


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

DEFAULT_WINDOW_RECENT = 5    # Number of recent runs to average
DEFAULT_WINDOW_BASELINE = 20  # Number of baseline runs

# Sigma thresholds
Z_WARNING = 2.0   # |z| > 2.0 → "warning"
Z_CRITICAL = 3.0  # |z| > 3.0 → "critical"


class DriftDetector:
    """Statistical Process Control drift detection for model eval scores.

    Compares the mean of the most recent N runs against the baseline
    (last M runs) using z-scores. Generates structured drift reports.

    Usage:
        dd = DriftDetector(RunHistory(simulation=True))
        report = dd.check("gpt-5.1", "reasoning")
        all_reports = dd.check_all()
        saved = dd.get_report("gpt-5.1")
    """

    def __init__(self, run_history, simulation: bool = True):
        self._rh = run_history
        self.simulation = simulation
        # In-memory report cache: {model: latest_report_dict}
        self._reports: dict[str, dict] = {}

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def check(self, model: str, domain: str, sigma: float = 2.0) -> dict:
        """Check for drift in a specific model+domain combination.

        Args:
            model: Model name (e.g. "gpt-5.1")
            domain: Domain key (e.g. "reasoning")
            sigma: Number of sigma for control limits (default 2.0)

        Returns:
            Drift report dict matching the design schema:
            {
                "model": str,
                "domain": str,
                "checked_at": str (ISO timestamp),
                "baseline_mean": float,
                "baseline_std": float,
                "recent_mean": float,
                "z_score": float,
                "drift_detected": bool,
                "drift_severity": "critical" | "warning" | "none",
                "control_limits": {"upper": float, "lower": float}
            }
        """
        # Get baseline stats from RunHistory
        baseline = self._rh.get_baseline(model, domain, window=DEFAULT_WINDOW_BASELINE)

        # Get recent runs for mean computation
        recent_runs = self._rh.get_runs(model=model, domain=domain, limit=DEFAULT_WINDOW_RECENT)
        recent_scores = self._extract_domain_scores(recent_runs, domain)

        # Compute recent mean
        if recent_scores:
            import statistics
            recent_mean = statistics.mean(recent_scores)
        else:
            recent_mean = 0.0

        baseline_mean = baseline.get("mean", 0.0)
        baseline_std = max(baseline.get("std", 0.0), 0.01)  # Avoid division by zero

        # Compute z-score: (recent_mean - baseline_mean) / baseline_std
        z_score = round((recent_mean - baseline_mean) / baseline_std, 4)

        # Determine severity
        abs_z = abs(z_score)
        if abs_z > Z_CRITICAL:
            severity = "critical"
        elif abs_z > Z_WARNING:
            severity = "warning"
        else:
            severity = "none"

        drift_detected = severity != "none"

        # Control limits
        control_upper = round(baseline_mean + sigma * baseline_std, 4)
        control_lower = round(baseline_mean - sigma * baseline_std, 4)

        report = {
            "model": model,
            "domain": domain,
            "checked_at": datetime.now(timezone.utc).isoformat(),
            "baseline_mean": round(baseline_mean, 4),
            "baseline_std": round(baseline_std, 4),
            "recent_mean": round(recent_mean, 4),
            "z_score": z_score,
            "drift_detected": drift_detected,
            "drift_severity": severity,
            "control_limits": {
                "upper": control_upper,
                "lower": control_lower,
            },
        }

        # Cache the report by model name
        self._reports[model] = report

        # Persist to JSON if not in simulation mode
        if not self.simulation and DRIFT_REPORTS_DIR:
            self._persist_report(report, model, domain)

        return report

    def check_all(self) -> list[dict]:
        """Check drift across all model+domain combinations found in run history.

        Iterates all unique model/domain pairs in the run history and
        runs check() on each.

        Returns:
            List of drift report dicts
        """
        # Get all unique model+domain pairs from run history
        all_runs = self._rh.get_runs(limit=100)

        pairs = set()
        for r in all_runs:
            model = r.get("model", "")
            for domain in r.get("domains", {}).keys():
                pairs.add((model, domain))

        if not pairs:
            # Fallback: check known models on default domain
            known_models = set(r.get("model", "") for r in all_runs if r.get("model"))
            if known_models:
                for model in known_models:
                    pairs.add((model, "reasoning"))

        reports = []
        for model, domain in sorted(pairs):
            report = self.check(model, domain)
            reports.append(report)

        return reports

    def get_report(self, model: str) -> Optional[dict]:
        """Retrieve the latest drift report for a model.

        Args:
            model: Model name

        Returns:
            Cached drift report dict, or None if no check has been run for this model
        """
        return self._reports.get(model)

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _extract_domain_scores(self, runs: list[dict], domain: str) -> list[float]:
        """Extract domain scores from a list of run records.

        Falls back to overall_score if domain data is unavailable.
        """
        scores = []
        for r in runs:
            d_data = r.get("domains", {}).get(domain, {})
            if isinstance(d_data, dict) and "mean_score" in d_data:
                scores.append(d_data["mean_score"])
            else:
                scores.append(r.get("overall_score", 0.0))

        # Filter out entries where the domain had no score (score = 0 and num_questions = 0)
        return [s for s in scores if s > 0] or [0.0]

    def _persist_report(self, report: dict, model: str, domain: str) -> None:
        """Save a drift report to disk as JSON."""
        if not DRIFT_REPORTS_DIR:
            return
        DRIFT_REPORTS_DIR.mkdir(parents=True, exist_ok=True)
        safe_name = f"drift_{model}_{domain}.json".replace(" ", "_")
        filepath = DRIFT_REPORTS_DIR / safe_name
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)


# ---------------------------------------------------------------------------
# Smoke test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    from run_history import RunHistory

    dd = DriftDetector(RunHistory(simulation=True))
    report = dd.check("gpt-5.1", "reasoning")
    print(f"Drift: {report['drift_detected']}, severity: {report['drift_severity']}, z_score: {report['z_score']}")

    all_reports = dd.check_all()
    print(f"Total reports: {len(all_reports)}")

    cached = dd.get_report("gpt-5.1")
    print(f"Cached: {cached['model'] if cached else None}")
