"""
calibration_loop.py — Judge bias calibration

Calibrates G-Eval scores by comparing them against human feedback.
Uses historical run data from RunHistory to compute per-judge bias
adjustments via exponential moving average (EMA).

Usage:
    from calibration_loop import CalibrationLoop
    cl = CalibrationLoop(run_history)
    adjustments = cl.run(num_samples=50)
    corrected = cl.apply(4.5, "claude-opus-4.8")
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


_EMA_ALPHA = 0.3


# Simulated calibration data for judges without human feedback
_SIM_JUDGE_BIASES: dict[str, float] = {
    "claude-opus-4.8":   0.12,
    "claude-sonnet-4.8": 0.08,
    "gpt-5.5-codex":     0.15,
    "gpt-5.1":           0.10,
    "gemini-3-ultra":   -0.05,
    "gemini-3-pro":     -0.02,
}


class CalibrationLoop:
    """Judge bias calibration using human feedback vs G-Eval score deltas.

    Computes per-judge bias adjustments from historical runs that have
    human_feedback ratings, then applies EMA smoothing. This allows
    correcting systematic over/under-scoring by specific judge models.

    Args:
        run_history: RunHistory instance to query historical runs.
        state_file: Optional path to persist calibration state as JSON.
        simulation: If True, generate synthetic calibration data.
    """

    def __init__(self, run_history: object,
                 state_file: Optional[Path] = None,
                 simulation: bool = True):
        self._run_history = run_history
        self._state_file = state_file
        self._simulation = simulation

        # Current bias adjustments: judge_model -> adjustment (added to score)
        self._adjustments: dict[str, float] = {}

        # Load existing state if available
        if state_file and state_file.exists() and not simulation:
            try:
                with open(state_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                for judge, info in data.get("judge_bias", {}).items():
                    self._adjustments[judge] = info.get("adjustment", 0.0)
            except (json.JSONDecodeError, OSError):
                pass

    def run(self, num_samples: int = 50) -> dict[str, dict]:
        """Run calibration: compute per-judge bias adjustments from run history.

        Fetches recent runs with human_feedback, groups by judge_model,
        computes mean error, and updates bias via EMA.

        Args:
            num_samples: Number of recent runs to consider.

        Returns:
            Dict mapping judge_model -> {mean_error, adjustment, n_samples}.
        """
        results: dict[str, dict] = {}

        if self._simulation:
            # Synthesize calibration data for known judges
            for judge, bias in _SIM_JUDGE_BIASES.items():
                n = 10
                mean_error = bias
                old_adj = self._adjustments.get(judge, 0.0)
                new_adj = (1 - _EMA_ALPHA) * old_adj + _EMA_ALPHA * (-mean_error)
                self._adjustments[judge] = round(new_adj, 4)
                results[judge] = {
                    "mean_error": round(mean_error, 4),
                    "adjustment": round(new_adj, 4),
                    "n_samples": n,
                }
        else:
            # Real calibration: query RunHistory for runs with human_feedback
            try:
                runs = self._run_history.get_runs(limit=num_samples)
                judge_groups: dict[str, list[float]] = {}
                for run in runs:
                    if "human_feedback" not in run:
                        continue
                    judge = run.get("judge_model", "unknown")
                    g_eval = run.get("overall_score", 50.0) / 100.0  # Normalize to 0-1
                    human = run["human_feedback"]
                    error = g_eval - human
                    if judge not in judge_groups:
                        judge_groups[judge] = []
                    judge_groups[judge].append(error)

                for judge, errors in judge_groups.items():
                    n = len(errors)
                    mean_error = sum(errors) / n
                    old_adj = self._adjustments.get(judge, 0.0)
                    new_adj = (1 - _EMA_ALPHA) * old_adj + _EMA_ALPHA * (-mean_error)
                    self._adjustments[judge] = round(new_adj, 4)
                    results[judge] = {
                        "mean_error": round(mean_error, 4),
                        "adjustment": round(new_adj, 4),
                        "n_samples": n,
                    }
            except Exception as exc:
                import logging
                logging.warning("CalibrationLoop.run() real path failed: %s", exc)

        self._save_state(results)
        return results

    def get_adjustments(self) -> dict[str, float]:
        """Return current bias adjustments (judge_model -> score delta)."""
        return dict(self._adjustments)

    def apply(self, score: float, judge: str) -> float:
        """Apply bias adjustment to a raw score.

        Args:
            score: Raw G-Eval score (typically 0-5 or 0-100 scale).
            judge: Judge model name (e.g. 'claude-opus-4.8').

        Returns:
            Bias-corrected score.
        """
        adjustment = self._adjustments.get(judge, 0.0)
        return round(score + adjustment, 4)

    def _save_state(self, results: dict) -> None:
        """Persist calibration state to JSON."""
        if not self._state_file:
            return
        try:
            state = {
                "last_calibration": datetime.now(timezone.utc).isoformat(),
                "judge_bias": {
                    judge: {
                        "mean_error": info["mean_error"],
                        "adjustment": info["adjustment"],
                    }
                    for judge, info in results.items()
                },
            }
            self._state_file.parent.mkdir(parents=True, exist_ok=True)
            with open(self._state_file, "w", encoding="utf-8") as f:
                json.dump(state, f, indent=2)
        except (OSError, PermissionError):
            pass
