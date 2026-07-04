"""
cost_analyzer.py — Cost Analysis Engine
========================================
Calcula costos de inferencia por modelo usando los precios del registry.
Soporta:
  - API providers (pricing por token)
  - Modelos locales (costo GPU estimado)
  - Eficiencia: quality_score / costo

Uso:
    from cost_analyzer import CostAnalyzer
    analyzer = CostAnalyzer()
    cost = analyzer.calculate("gpt-5.1", tokens_in=500, tokens_out=200)
"""

import json
from pathlib import Path
from typing import Optional


# Default pricing fallback (USD) si no se puede cargar el registry
DEFAULT_PRICING = {
    "gpt-5.1":         {"input_per_mtok": 1.25, "output_per_mtok": 10.00},
    "gpt-5.5-codex":   {"input_per_mtok": 2.50, "output_per_mtok": 15.00},
    "claude-sonnet-4.8": {"input_per_mtok": 1.50, "output_per_mtok": 7.50},
    "claude-opus-4.8": {"input_per_mtok": 3.00, "output_per_mtok": 15.00},
    "gemini-3-pro":    {"input_per_mtok": 0.50, "output_per_mtok": 1.50},
    "gemini-3-ultra":  {"input_per_mtok": 1.00, "output_per_mtok": 3.00},
    "mistral-large-3": {"input_per_mtok": 0.40, "output_per_mtok": 1.20},
    "llama-4-70b":     {"input_per_mtok": 0.00, "output_per_mtok": 0.00},  # local
    "glm-5.2":         {"input_per_mtok": 0.14, "output_per_mtok": 0.86},
    "deepseek-v4":     {"input_per_mtok": 0.14, "output_per_mtok": 0.28},
}


class CostAnalyzer:
    """Calculate and track inference costs.

    Usage:
        analyzer = CostAnalyzer()
        cost = analyzer.calculate("gpt-5.1", tokens_in=500, tokens_out=200)
        # Returns: {"cost_usd": 0.002625, "input_cost": 0.000625, "output_cost": 0.002, ...}

        efficiency = analyzer.efficiency("gpt-5.1", quality_score=4.5, tokens_in=500, tokens_out=200)
    """

    def __init__(self, registry_path: Optional[Path] = None):
        self._pricing = self._load_pricing(registry_path)
        self._history = []

    def _load_pricing(self, registry_path: Optional[Path]) -> dict:
        """Load pricing from model_registry.json or use defaults."""
        if registry_path and registry_path.exists():
            try:
                with open(registry_path, "r", encoding="utf-8") as f:
                    registry = json.load(f)
                pricing = {}
                for name, info in registry.get("models", {}).items():
                    p = info.get("pricing", {})
                    pricing[name] = {
                        "input_per_mtok": p.get("input_per_mtok", 0),
                        "output_per_mtok": p.get("output_per_mtok", 0),
                        "type": info.get("type", "api"),
                    }
                if pricing:
                    return pricing
            except (json.JSONDecodeError, IOError):
                pass
        return DEFAULT_PRICING

    def get_pricing(self, model_name: str) -> dict:
        """Get pricing info for a model."""
        return self._pricing.get(model_name, {"input_per_mtok": 0, "output_per_mtok": 0, "type": "api"})

    def calculate(
        self,
        model_name: str,
        tokens_in: int = 0,
        tokens_out: int = 0,
        gpu_hours: Optional[float] = None,
        gpu_cost_per_hour: float = 2.0,
    ) -> dict:
        """Calculate cost for a single inference call.

        Args:
            model_name: Model identifier
            tokens_in: Number of input tokens
            tokens_out: Number of output tokens
            gpu_hours: GPU hours (for local models, overrides token pricing)
            gpu_cost_per_hour: Cost per GPU hour (default $2.00/hr for A100)

        Returns:
            dict with cost breakdown
        """
        pricing = self.get_pricing(model_name)
        model_type = pricing.get("type", "api")

        if model_type == "local" or gpu_hours is not None:
            # Local model: cost is GPU time
            hours = gpu_hours or (tokens_in + tokens_out) / 100000 * 0.1  # rough estimate
            input_cost = 0.0
            output_cost = 0.0
            total_cost = hours * gpu_cost_per_hour
            cost_type = "gpu_time"
        else:
            # API model: cost is per-token
            input_rate = pricing.get("input_per_mtok", 0) / 1_000_000
            output_rate = pricing.get("output_per_mtok", 0) / 1_000_000

            input_cost = tokens_in * input_rate
            output_cost = tokens_out * output_rate
            total_cost = input_cost + output_cost
            cost_type = "per_token"

        result = {
            "model": model_name,
            "cost_usd": round(total_cost, 6),
            "input_cost": round(input_cost, 6),
            "output_cost": round(output_cost, 6),
            "tokens_in": tokens_in,
            "tokens_out": tokens_out,
            "cost_type": cost_type,
            "currency": "USD",
        }

        self._history.append(result)
        return result

    def calculate_batch(
        self,
        model_name: str,
        calls: list,
    ) -> dict:
        """Calculate total cost for multiple calls.

        Args:
            model_name: Model identifier
            calls: List of dicts with 'tokens_in' and 'tokens_out' keys

        Returns:
            dict with total and per-call breakdown
        """
        total = {"cost_usd": 0.0, "input_cost": 0.0, "output_cost": 0.0}
        details = []

        for call in calls:
            cost = self.calculate(
                model_name,
                tokens_in=call.get("tokens_in", 0),
                tokens_out=call.get("tokens_out", 0),
            )
            total["cost_usd"] += cost["cost_usd"]
            total["input_cost"] += cost["input_cost"]
            total["output_cost"] += cost["output_cost"]
            details.append(cost)

        total["cost_usd"] = round(total["cost_usd"], 6)
        total["input_cost"] = round(total["input_cost"], 6)
        total["output_cost"] = round(total["output_cost"], 6)

        return {"total": total, "calls": len(calls), "details": details}

    def efficiency(
        self,
        model_name: str,
        quality_score: float,
        tokens_in: int = 0,
        tokens_out: int = 0,
    ) -> dict:
        """Calculate cost efficiency: quality_score / cost.

        Returns:
            dict with efficiency score (points per dollar)
        """
        cost = self.calculate(model_name, tokens_in, tokens_out)
        cost_usd = cost["cost_usd"]

        if cost_usd == 0:
            efficiency_score = float("inf") if quality_score > 0 else 0.0
        else:
            efficiency_score = round(quality_score / cost_usd, 2)

        return {
            "model": model_name,
            "quality_score": quality_score,
            "cost_usd": cost_usd,
            "efficiency_pts_per_dollar": efficiency_score,
            "tokens_total": tokens_in + tokens_out,
        }

    def get_history(self) -> list:
        return self._history

    def summary(self) -> dict:
        """Get cost summary across all tracked calls."""
        if not self._history:
            return {}

        total_cost = sum(h["cost_usd"] for h in self._history)
        total_tokens_in = sum(h["tokens_in"] for h in self._history)
        total_tokens_out = sum(h["tokens_out"] for h in self._history)

        return {
            "total_calls": len(self._history),
            "total_cost_usd": round(total_cost, 4),
            "total_tokens_in": total_tokens_in,
            "total_tokens_out": total_tokens_out,
            "avg_cost_per_call": round(total_cost / len(self._history), 6),
        }
