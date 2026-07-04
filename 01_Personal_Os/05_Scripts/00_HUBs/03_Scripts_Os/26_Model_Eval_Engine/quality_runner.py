"""
quality_runner.py — Benchmark Quality Runner
==============================================
Ejecuta benchmarks contra gold standards y registra resultados.
Compara outputs de modelos contra respuestas esperadas o evaluaciones G-Eval.

Uso:
    from quality_runner import QualityRunner
    runner = QualityRunner()
    result = runner.run_benchmark("gpt-5.1", "reasoning")
    report = runner.run_all_benchmarks("claude-opus-4.8")
"""

import json
import statistics
from pathlib import Path
from typing import Optional

try:
    from config_paths import GOLD_STANDARDS_DIR, EVAL_RUNS_DIR, MODEL_REGISTRY_FILE
except ImportError:
    import sys
    _BASE = Path(__file__).resolve().parent.parent
    sys.path.insert(0, str(_BASE))
    from config_paths import GOLD_STANDARDS_DIR, EVAL_RUNS_DIR, MODEL_REGISTRY_FILE

from g_eval import g_eval, g_eval_ensemble


# ---------------------------------------------------------------------------
# Benchmark suite definitions
# ---------------------------------------------------------------------------

BENCHMARK_SUITES = {
    "quick": {
        "benchmarks": ["reasoning", "factual"],
        "description": "Quick smoke test (~2 min)",
    },
    "standard": {
        "benchmarks": ["reasoning", "vision", "code", "factual"],
        "description": "Standard eval suite (~5 min)",
    },
    "full": {
        "benchmarks": ["reasoning", "vision", "code", "agent", "factual"],
        "description": "Full eval suite (~10 min)",
    },
    "reasoning": {
        "benchmarks": ["reasoning"],
        "description": "Reasoning only",
    },
    "code": {
        "benchmarks": ["code"],
        "description": "Code only",
    },
}


class QualityRunner:
    """Run benchmarks against gold standards.

    En modo simulación, genera resultados plausibles para desarrollo.
    En producción, invoca modelos reales vía API.

    Usage:
        runner = QualityRunner()
        # Run a single benchmark
        result = runner.run_benchmark("gpt-5.1", "reasoning")
        # Run a suite
        suite_result = runner.run_suite("gpt-5.1", "quick")
        # Compare two models
        comparison = runner.compare("gpt-5.1", "claude-opus-4.8", "reasoning")
    """

    def __init__(self, simulation: bool = True):
        self.simulation = simulation
        self._results = []
        self._gold_standards = self._load_gold_standards()

    def _load_gold_standards(self) -> dict:
        """Load all gold standard files."""
        standards = {}
        if GOLD_STANDARDS_DIR and GOLD_STANDARDS_DIR.exists():
            for fpath in GOLD_STANDARDS_DIR.glob("quality_*.json"):
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    domain = fpath.stem.replace("quality_", "")
                    standards[domain] = data
                except (json.JSONDecodeError, IOError):
                    pass
        return standards

    def list_benchmarks(self) -> list:
        """List available benchmark domains."""
        return list(self._gold_standards.keys())

    def run_benchmark(
        self,
        model_name: str,
        domain: str,
        suite: str = "standard",
    ) -> dict:
        """Run a single benchmark domain against a model.

        Args:
            model_name: Model to evaluate
            domain: Benchmark domain (reasoning, vision, code, factual, agent)
            suite: Suite name for metadata

        Returns:
            dict with scores, individual results, and summary
        """
        gold = self._gold_standards.get(domain)
        if not gold:
            return {
                "model": model_name,
                "domain": domain,
                "error": f"No gold standard found for domain '{domain}'",
                "score": 0.0,
            }

        questions = gold.get("questions", gold.get("tasks", []))
        if not questions:
            return {
                "model": model_name,
                "domain": domain,
                "error": f"Empty gold standard: {domain}",
                "score": 0.0,
            }

        benchmark_name = gold.get("benchmark", domain)
        sota_score = gold.get("sota_score", 100.0)
        sota_model = gold.get("sota_model", "unknown")

        individual = []
        scores = []

        for q in questions:
            input_text = q.get("question", q.get("task", ""))
            expected = q.get("expected_answer")

            if self.simulation:
                # Simulation: generate plausible output based on expected answer
                model_output = self._simulate_output(input_text, expected)
            else:
                # Production: would call the actual model API
                model_output = f"[Real API call to {model_name} not implemented]"

            # Evaluate with G-Eval
            eval_result = g_eval(
                actual_output=model_output,
                input_text=input_text,
                expected_output=expected,
                criterion="correctness" if expected else "task_completion",
            )

            individual.append({
                "id": q.get("id", f"q_{len(individual)}"),
                "input": input_text[:100],
                "expected": expected[:100] if expected else None,
                "model_output": model_output[:200],
                "g_eval_score": eval_result["score"],
                "domain": q.get("domain", ""),
                "difficulty": q.get("difficulty", ""),
            })
            scores.append(eval_result["score"])

        # Aggregate scores
        mean_score = statistics.mean(scores) if scores else 0.0
        std_dev = statistics.stdev(scores) if len(scores) > 1 else 0.0

        # Score vs SOTA
        pct_of_sota = round(SCORE_TO_PCT(SCALE_MAX=5, score=mean_score, sota=sota_score), 1)

        result = {
            "model": model_name,
            "domain": domain,
            "benchmark": benchmark_name,
            "sota_score": sota_score,
            "sota_model": sota_model,
            "mean_score": round(mean_score, 4),
            "std_dev": round(std_dev, 4),
            "pct_of_sota": pct_of_sota,
            "num_questions": len(questions),
            "individual": individual,
            "suite": suite,
        }

        self._results.append(result)
        return result

    def run_suite(self, model_name: str, suite_name: str = "quick") -> dict:
        """Run a predefined benchmark suite.

        Args:
            model_name: Model to evaluate
            suite_name: Suite key (quick, standard, full, reasoning, code)

        Returns:
            dict with all benchmark results and aggregate scores
        """
        suite = BENCHMARK_SUITES.get(suite_name)
        if not suite:
            available = list(BENCHMARK_SUITES.keys())
            return {
                "model": model_name,
                "error": f"Unknown suite '{suite_name}'. Available: {available}",
                "score": 0.0,
            }

        domain_results = []
        for domain in suite["benchmarks"]:
            dr = self.run_benchmark(model_name, domain, suite=suite_name)
            domain_results.append(dr)

        # Aggregate across domains
        scores = [r["mean_score"] for r in domain_results if "mean_score" in r]
        overall_score = statistics.mean(scores) if scores else 0.0

        return {
            "model": model_name,
            "suite": suite_name,
            "description": suite["description"],
            "overall_score": round(overall_score, 4),
            "domains": {r["domain"]: r for r in domain_results},
            "num_domains": len(domain_results),
        }

    def compare(self, model_a: str, model_b: str, domain: str) -> dict:
        """Compare two models head-to-head on a benchmark.

        Args:
            model_a: First model name
            model_b: Second model name
            domain: Benchmark domain

        Returns:
            dict with comparison results
        """
        result_a = self.run_benchmark(model_a, domain)
        result_b = self.run_benchmark(model_b, domain)

        score_a = result_a.get("mean_score", 0)
        score_b = result_b.get("mean_score", 0)
        delta = round(score_a - score_b, 4)

        return {
            "domain": domain,
            "benchmark": result_a.get("benchmark", domain),
            "model_a": {"name": model_a, "score": score_a},
            "model_b": {"name": model_b, "score": score_b},
            "delta": delta,
            "winner": model_a if delta > 0 else model_b if delta < 0 else "tie",
        }

    def get_history(self) -> list:
        return self._results

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _simulate_output(self, input_text: str, expected: Optional[str]) -> str:
        """Simulate a model output for development/testing.

        Si hay expected answer, devuelve una version con ruido.
        """
        if expected:
            # Simulate: sometimes correct, sometimes with errors
            words = expected.split()
            if len(words) > 5:
                # Drop a word to simulate imperfection
                return " ".join(words[:-1]) + "."
            return expected
        return f"Simulated response to: {input_text[:50]}..."


def SCORE_TO_PCT(SCALE_MAX: int, score: float, sota: float) -> float:
    """Convert G-Eval score (1-5 scale) to percentage of SOTA."""
    # Normalize score to 0-100 scale
    normalized = (score - 1) / (SCALE_MAX - 1) * 100
    # Compare to SOTA percentage
    if sota > 0:
        return (normalized / sota) * 100
    return normalized
