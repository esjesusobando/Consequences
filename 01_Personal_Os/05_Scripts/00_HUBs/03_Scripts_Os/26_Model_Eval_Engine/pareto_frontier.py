"""
pareto_frontier.py — Pareto Frontier Computation
==================================================
Computes Pareto-optimal model sets for quality vs. cost tradeoff analysis.

Pareto logic: Model A dominates Model B if:
  - quality_A >= quality_B AND cost_A <= cost_B
  - AND at least one inequality is strict (A is strictly better on at least one axis)

The frontier is the set of non-dominated models.

Sweet spot = model on the frontier with the best quality/cost ratio.

Uso:
    from pareto_frontier import ParetoFrontier
    from run_history import RunHistory
    pf = ParetoFrontier(RunHistory())
    frontier = pf.compute()
    best = pf.sweet_spot(frontier)
"""

import json
import statistics
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

try:
    from config_paths import PARETO_FILE, MODEL_EVALS_DIR
except ImportError:
    import sys
    _BASE = Path(__file__).resolve().parent.parent
    sys.path.insert(0, str(_BASE))
    from config_paths import PARETO_FILE, MODEL_EVALS_DIR


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

DEFAULT_TASK_TYPE = "complex_reasoning"


class ParetoFrontier:
    """Pareto-optimal model frontier for quality vs. cost analysis.

    Computes which models are Pareto-optimal (not dominated) and
    identifies the best quality/cost tradeoff (sweet spot).

    Usage:
        pf = ParetoFrontier(RunHistory(simulation=True))
        frontier = pf.compute()
        best = pf.sweet_spot(frontier)
        pf.visualize(frontier)
    """

    def __init__(self, run_history, simulation: bool = True):
        self._rh = run_history
        self.simulation = simulation

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def compute(self, objectives: Optional[list[str]] = None) -> dict:
        """Compute the Pareto frontier from run history data.

        Args:
            objectives: List of metric names to optimize for.
                        Default quality (maximize) vs cost (minimize).
                        Convention: maximize first element, minimize second.

        Returns:
            Dict matching the Pareto Frontier schema:
            {
                "calculated_at": str (ISO timestamp),
                "task_type": str,
                "frontier": [{"model": str, "quality": float, "cost_per_call": float}, ...],
                "sweet_spot": str
            }
        """
        if objectives is None:
            objectives = ["quality", "cost"]

        # Get all models with their aggregated scores and costs
        models_data = self._compute_model_aggregates()

        if not models_data:
            return {
                "calculated_at": datetime.now(timezone.utc).isoformat(),
                "task_type": DEFAULT_TASK_TYPE,
                "frontier": [],
                "sweet_spot": "none",
            }

        # Determine Pareto-optimal set
        # maximize first objective (quality), minimize second (cost)
        quality_axis = objectives[0]
        cost_axis = objectives[1] if len(objectives) > 1 else "cost"

        frontier = []
        for m in models_data:
            dominated = False
            for n in models_data:
                if n[quality_axis] >= m[quality_axis] and n[cost_axis] <= m[cost_axis]:
                    if n[quality_axis] > m[quality_axis] or n[cost_axis] < m[cost_axis]:
                        dominated = True
                        break
            if not dominated:
                frontier.append(m)

        # Sort frontier by quality descending
        frontier.sort(key=lambda x: x[quality_axis], reverse=True)

        # Find sweet spot: best quality/cost ratio on the frontier
        sweet_spot_model = self._find_sweet_spot(frontier, quality_axis, cost_axis)

        result = {
            "calculated_at": datetime.now(timezone.utc).isoformat(),
            "task_type": DEFAULT_TASK_TYPE,
            "frontier": frontier,
            "sweet_spot": sweet_spot_model,
        }

        # Persist to PARETO_FILE if not in simulation mode
        if not self.simulation:
            self._persist(result)

        return result

    def sweet_spot(self, frontier: dict) -> str:
        """Return the sweet spot model name from a frontier dict.

        Args:
            frontier: The dict returned by compute()

        Returns:
            Model name string (e.g. "gemini-3-pro") or "none"
        """
        return frontier.get("sweet_spot", "none")

    def visualize(self, frontier: Optional[dict] = None) -> None:
        """Print an ASCII visualization of the Pareto frontier.

        Args:
            frontier: Frontier dict from compute(). If None, computes fresh.
        """
        if frontier is None:
            frontier = self.compute()

        f_models = frontier.get("frontier", [])
        sweet = frontier.get("sweet_spot", "none")

        if not f_models:
            print("  [No frontier data available]")
            return

        print(f"\n  Pareto Frontier — {frontier.get('task_type', 'unknown')}")
        print(f"  {'='*55}")
        print(f"  {'Model':<25} {'Quality':>8} {'Cost':>10}  {'Sweet?'}")
        print(f"  {'-'*25} {'-'*8} {'-'*10}  {'-'*6}")

        for m in f_models:
            marker = " *" if m.get("model") == sweet else "  "
            print(f"  {m.get('model', '?'):<25} {m.get('quality', 0):>8.2f} ${m.get('cost', 0):>8.4f}{marker}")

        print(f"  {'='*55}")
        if sweet != "none":
            print(f"  * Sweet spot: {sweet} (best quality/cost ratio)")
        print()

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _compute_model_aggregates(self) -> list[dict]:
        """Aggregate per-model quality and cost data from RunHistory.

        Returns:
            List of dicts: [
                {"model": str, "quality": float, "cost_per_call": float},
                ...
            ]
        """
        all_runs = self._rh.get_runs(limit=100)

        # Group runs by model
        model_runs: dict[str, list[dict]] = {}
        for r in all_runs:
            model = r.get("model", "")
            if model:
                if model not in model_runs:
                    model_runs[model] = []
                model_runs[model].append(r)

        if not model_runs and self.simulation:
            # Fallback: use known model profiles
            return self._simulated_model_data()

        aggregates = []
        for model, runs in model_runs.items():
            scores = [r.get("overall_score", 0) for r in runs if r.get("overall_score", 0) > 0]
            costs = [r.get("cost", {}).get("cost_usd", 0) for r in runs if r.get("cost", {}).get("cost_usd", 0) > 0]

            if not scores or not costs:
                continue

            aggregates.append({
                "model": model,
                "quality": round(statistics.mean(scores), 2),
                "cost": round(statistics.mean(costs), 6),
            })

        return aggregates

    def _find_sweet_spot(self, frontier: list[dict], quality_key: str, cost_key: str) -> str:
        """Find the model with the best quality/cost ratio on the frontier."""
        best_ratio = 0.0
        best_model = "none"

        for m in frontier:
            q = m.get(quality_key, 0)
            c = m.get(cost_key, 1)  # Avoid division by zero
            if c <= 0:
                c = 0.001
            ratio = q / c
            if ratio > best_ratio:
                best_ratio = ratio
                best_model = m.get("model", "none")

        return best_model

    def _simulated_model_data(self) -> list[dict]:
        """Generate simulated model data for development/testing."""
        return [
            {"model": "gemini-3-pro",    "quality": 87.4, "cost": 0.02},
            {"model": "mistral-large-3", "quality": 83.0, "cost": 0.03},
            {"model": "claude-sonnet-4.8", "quality": 86.5, "cost": 0.04},
            {"model": "gemini-3-ultra",  "quality": 91.0, "cost": 0.04},
            {"model": "gpt-5.1",         "quality": 85.2, "cost": 0.05},
            {"model": "gpt-5.5-codex",   "quality": 87.0, "cost": 0.08},
            {"model": "claude-opus-4.8", "quality": 94.6, "cost": 0.09},
        ]

    def _persist(self, result: dict) -> None:
        """Save Pareto frontier to PARETO_FILE."""
        if not PARETO_FILE:
            return
        PARETO_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(PARETO_FILE, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)


# ---------------------------------------------------------------------------
# Smoke test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    from run_history import RunHistory

    pf = ParetoFrontier(RunHistory(simulation=True))
    f = pf.compute()
    print(f"Frontier: {len(f.get('frontier', []))} models, sweet_spot: {pf.sweet_spot(f)}")
    pf.visualize(f)
