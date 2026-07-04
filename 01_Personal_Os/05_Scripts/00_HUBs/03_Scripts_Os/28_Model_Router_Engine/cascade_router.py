"""
cascade_router.py — Cost-escalation router

Tries models from cheapest to most expensive, escalating when quality
checks fail. Each task_type has a cascade order; unknown types use a default.

Usage:
    from cascade_router import CascadeRouter
    cr = CascadeRouter(run_history)
    result = cr.route("reasoning", required_quality=0.9)
"""

from pathlib import Path
from typing import Optional


# Default cascade order per task type (cheapest first)
_DEFAULT_CASCADE_ORDER: dict[str, list[str]] = {
    "default": [
        "gemini-3-pro",
        "claude-sonnet-4.8",
        "claude-opus-4.8",
        "gpt-5.5-codex",
    ],
    "quick": [
        "gemini-3-pro",
        "claude-sonnet-4.8",
    ],
    "reasoning": [
        "claude-sonnet-4.8",
        "claude-opus-4.8",
        "gpt-5.5-codex",
    ],
    "code": [
        "gpt-5.1",
        "gpt-5.5-codex",
        "claude-opus-4.8",
    ],
    "vision": [
        "gemini-3-pro",
        "gemini-3-ultra",
        "claude-opus-4.8",
    ],
}


class CascadeRouter:
    """Cost-escalation router that tries cheapest models first.

    For a given task_type, iterates through ordered models and returns
    the first one whose predicted quality (from RunHistory baseline) meets
    or exceeds the required_quality. Falls back to the most expensive model
    if no tier qualifies.

    Args:
        run_history: RunHistory instance for quality predictions.
        policy: Optional dict to override cascade_order.
        simulation: If True, use run_history simulation data.
    """

    def __init__(self, run_history: object, policy: Optional[dict] = None,
                 simulation: bool = True):
        self._run_history = run_history
        self._simulation = simulation

        if policy and "cascade_order" in policy:
            self._cascade_order = dict(policy["cascade_order"])
        else:
            self._cascade_order = {}
        # Ensure default always exists
        if "default" not in self._cascade_order:
            self._cascade_order["default"] = list(_DEFAULT_CASCADE_ORDER["default"])

    def route(self, task_type: str, required_quality: float = 0.8) -> dict:
        """Route a task_type through the cascade, returning the cheapest qualifying model.

        Args:
            task_type: Type of task (e.g. 'reasoning', 'code', 'quick').
            required_quality: Minimum quality threshold (0.0 to 1.0).

        Returns:
            dict with keys: model, confidence, task_type, tier_used, total_tiers
        """
        order = list(self._get_order(task_type))
        total_tiers = len(order)

        for tier_idx, model in enumerate(order):
            quality = self._predict_quality(model, task_type)
            if quality >= required_quality:
                return {
                    "model": model,
                    "confidence": round(quality, 4),
                    "task_type": task_type,
                    "tier_used": tier_idx + 1,
                    "total_tiers": total_tiers,
                    "escalated": tier_idx > 0,
                }

        # Fallback: most expensive (last) model
        fallback_model = order[-1]
        fallback_quality = self._predict_quality(fallback_model, task_type)
        return {
            "model": fallback_model,
            "confidence": round(fallback_quality, 4),
            "task_type": task_type,
            "tier_used": total_tiers,
            "total_tiers": total_tiers,
            "escalated": True,
        }

    def set_order(self, task_type: str, models: list[str]) -> None:
        """Override the cascade order for a specific task type.

        Args:
            task_type: Task type key (e.g. 'reasoning', 'code').
            models: List of model names in cheapest-first order.
        """
        self._cascade_order[task_type] = list(models)

    def _get_order(self, task_type: str) -> list[str]:
        """Get the cascade order for a task type, falling back to default."""
        if task_type in self._cascade_order:
            return self._cascade_order[task_type]
        if task_type in _DEFAULT_CASCADE_ORDER:
            return list(_DEFAULT_CASCADE_ORDER[task_type])
        return list(self._cascade_order["default"])

    def _predict_quality(self, model: str, task_type: str) -> float:
        """Predict model quality for a task_type using RunHistory baseline.

        Uses baseline mean from run history. Falls back to hardcoded
        heuristic when simulation=True and no baseline exists.
        """
        try:
            baseline = self._run_history.get_baseline(model, task_type)
            if baseline and baseline.get("n", 0) > 0:
                return baseline["mean"] / 100.0  # Normalize 0-100 to 0-1
        except Exception:
            pass

        # Hardcoded quality heuristics for simulation / fallback
        quality_map: dict[str, float] = {
            "gpt-5.5-codex":     0.92,
            "claude-opus-4.8":   0.90,
            "gemini-3-ultra":    0.88,
            "claude-sonnet-4.8": 0.85,
            "gemini-3-pro":      0.82,
            "gpt-5.1":           0.80,
            "deepseek-v4":       0.78,
            "llama-4-70b":       0.76,
            "mistral-large-3":   0.77,
            "glm-5.2":           0.74,
        }
        return quality_map.get(model, 0.80)
