"""
speed_profiler.py — Model Speed Profiler SOTA
==============================================
Mide métricas de velocidad de inferencia:
  - TTFT: Time to First Token
  - TPS output: tokens de salida por segundo
  - TPS input: tokens de entrada por segundo (prefill)
  - Latencia P50 / P95 / P99
  - Cold start (modelos locales)

Uso:
    from speed_profiler import SpeedProfiler
    profiler = SpeedProfiler()
    result = profiler.measure(model_name="gpt-5.1", input_text="...", output_text="...")
"""

import statistics
import time
from dataclasses import dataclass, field, asdict
from typing import Optional


@dataclass
class SpeedMetrics:
    """Metrics for a single inference call."""
    model_name: str
    ttft_ms: float                    # Time to First Token in ms
    total_time_ms: float               # Total request time in ms
    tokens_input: int = 0
    tokens_output: int = 0
    tps_output: float = 0.0            # Output tokens per second
    tps_input: float = 0.0             # Input tokens per second (prefill)
    cold_start_ms: float = 0.0         # Cold start time (local models)
    latency_p50_ms: float = 0.0        # P50 latency
    latency_p95_ms: float = 0.0        # P95 latency
    latency_p99_ms: float = 0.0        # P99 latency
    error: Optional[str] = None

    def to_dict(self) -> dict:
        return asdict(self)


class SpeedProfiler:
    """Profile model inference speed.

    En modo simulación (sin API keys), genera métricas estimadas.
    En producción, mide tiempos reales de llamadas API.

    Usage:
        profiler = SpeedProfiler()
        metrics = profiler.measure("gpt-5.1", "input text", "output text")
        multi = profiler.measure_multiple("gpt-5.1", [("in1","out1"), ("in2","out2")])
    """

    # Latency baselines (ms) for simulation mode
    _SIMULATION_BASELINES = {
        "gpt-5.1":         {"ttft": 450, "tps": 85, "cold_start": 0},
        "gpt-5.5-codex":   {"ttft": 500, "tps": 90, "cold_start": 0},
        "claude-sonnet-4.8": {"ttft": 600, "tps": 65, "cold_start": 0},
        "claude-opus-4.8": {"ttft": 1200, "tps": 45, "cold_start": 0},
        "gemini-3-pro":    {"ttft": 350, "tps": 110, "cold_start": 0},
        "gemini-3-ultra":  {"ttft": 700, "tps": 80, "cold_start": 0},
        "mistral-large-3": {"ttft": 400, "tps": 95, "cold_start": 0},
        "llama-4-70b":     {"ttft": 3000, "tps": 25, "cold_start": 5000},
        "glm-5.2":         {"ttft": 800, "tps": 60, "cold_start": 0},
        "deepseek-v4":     {"ttft": 500, "tps": 75, "cold_start": 0},
    }

    def __init__(self, simulation: bool = True):
        self.simulation = simulation
        self._history: list = []

    def measure(
        self,
        model_name: str,
        input_text: str,
        output_text: str,
        tokens_input: Optional[int] = None,
        tokens_output: Optional[int] = None,
    ) -> SpeedMetrics:
        """Measure inference speed for a single call.

        Args:
            model_name: Model identifier (matches model_registry.json)
            input_text: Prompt text
            output_text: Generated output
            tokens_input: Known token count (auto-estimated if None)
            tokens_output: Known token count (auto-estimated if None)

        Returns:
            SpeedMetrics dataclass
        """
        # Token estimation (rough: 4 chars per token)
        if tokens_input is None:
            tokens_input = max(1, len(input_text) // 4)
        if tokens_output is None:
            tokens_output = max(1, len(output_text) // 4)

        if self.simulation:
            metrics = self._simulate(model_name, tokens_input, tokens_output)
        else:
            metrics = self._measure_real(model_name, input_text)

        metrics.tokens_input = tokens_input
        metrics.tokens_output = tokens_output
        metrics.model_name = model_name
        self._history.append(metrics)
        return metrics

    def measure_multiple(
        self,
        model_name: str,
        pairs: list,
    ) -> list:
        """Measure multiple input/output pairs and compute percentiles.

        Args:
            model_name: Model identifier
            pairs: List of (input_text, output_text) tuples

        Returns:
            List of SpeedMetrics, one per pair
        """
        results = []
        for input_text, output_text in pairs:
            m = self.measure(model_name, input_text, output_text)
            results.append(m)

        if len(results) > 1:
            total_times = [r.total_time_ms for r in results]
            sorted_times = sorted(total_times)
            n = len(sorted_times)

            p50 = sorted_times[int(n * 0.50)]
            p95 = sorted_times[int(n * 0.95)]
            p99 = sorted_times[int(n * 0.99)]

            for r in results:
                r.latency_p50_ms = p50
                r.latency_p95_ms = p95
                r.latency_p99_ms = p99

        return results

    def get_history(self) -> list:
        return self._history

    def summary(self, model_name: Optional[str] = None) -> dict:
        """Get summary statistics for a model or all models."""
        relevant = [
            m for m in self._history
            if model_name is None or m.model_name == model_name
        ]
        if not relevant:
            return {}

        ttft_values = [m.ttft_ms for m in relevant]
        tps_values = [m.tps_output for m in relevant]
        total_values = [m.total_time_ms for m in relevant]

        return {
            "model": model_name or "all",
            "count": len(relevant),
            "ttft": {
                "avg_ms": round(statistics.mean(ttft_values), 2),
                "min_ms": round(min(ttft_values), 2),
                "max_ms": round(max(ttft_values), 2),
            },
            "tps_output": {
                "avg": round(statistics.mean(tps_values), 2),
                "min": round(min(tps_values), 2),
                "max": round(max(tps_values), 2),
            },
            "total_time_ms": {
                "avg": round(statistics.mean(total_values), 2),
            },
        }

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _simulate(self, model_name: str, tokens_in: int, tokens_out: int) -> SpeedMetrics:
        """Generate simulated speed metrics based on model baselines."""
        baseline = self._SIMULATION_BASELINES.get(model_name, self._SIMULATION_BASELINES["gpt-5.1"])

        # Add jitter for realistic simulation (+/- 15%)
        import random
        jitter = lambda v: v * (1 + random.uniform(-0.15, 0.15))

        ttft = jitter(baseline["ttft"])
        tps = jitter(baseline["tps"])
        cold = jitter(baseline["cold_start"])

        total_time = ttft + (tokens_out / tps) * 1000

        return SpeedMetrics(
            model_name=model_name,
            ttft_ms=round(ttft, 2),
            total_time_ms=round(total_time, 2),
            tps_output=round(tps, 2),
            tps_input=round(tps * 1.3, 2),  # Prefill ~30% faster than decode
            cold_start_ms=round(cold, 2),
        )

    def _measure_real(self, model_name: str, input_text: str) -> SpeedMetrics:
        """Real measurement stub — en producción usa requests reales.

        Aquí se integraría con los providers reales:
        - OpenAI: time los calls a chat.completions
        - Anthropic: time los messages API calls
        - Local: time la inferencia local
        """
        return SpeedMetrics(
            model_name=model_name,
            ttft_ms=0.0,
            total_time_ms=0.0,
            error="Real measurement not implemented in simulation mode",
        )
