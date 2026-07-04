"""
26_Model_Eval_Hub.py — Model Evaluation Orchestrator SOTA
==========================================================
PersonalOS v5.0 — HUB principal del Módulo de Evaluación de Modelos.

Orquesta todos los motores de evaluación: G-Eval, benchmarks, velocidad, costo.

Usage:
    python 26_Model_Eval_Hub.py --benchmark <suite>    # Run benchmark suite
    python 26_Model_Eval_Hub.py --run <model> <task>    # Evaluate model on task
    python 26_Model_Eval_Hub.py --geval <criterion>     # G-Eval evaluation
    python 26_Model_Eval_Hub.py --compare <a> <b>       # Head-to-head comparison
    python 26_Model_Eval_Hub.py --pareto <task_type>    # Pareto frontier
    python 26_Model_Eval_Hub.py --drift <model>         # Drift report
    python 26_Model_Eval_Hub.py --status                # General status
    python 26_Model_Eval_Hub.py --list-benchmarks       # List available benchmarks

Integration:
    - Se registra en HUB_SOTA.py como feature '06_model_eval_hub'
    - Loggea cada run a 18_Telemetry_Hub.py
    - Lee gold standards de 13_Model_Evals/
"""

import argparse
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# Path setup
# ---------------------------------------------------------------------------

_HUB_DIR = Path(__file__).resolve().parent
_ENGINE_DIR = _HUB_DIR / "26_Model_Eval_Engine"
sys.path.insert(0, str(_HUB_DIR))
sys.path.insert(0, str(_ENGINE_DIR))

try:
    from config_paths import MODEL_EVALS_DIR, ENGINE_DIR
except ImportError:
    # Fallback: walk up to find 00_Winter_is_Coming (same logic as config_paths.find_project_root)
    _root = None
    for _candidate in [_HUB_DIR, *_HUB_DIR.parents]:
        if (_candidate / "00_Winter_is_Coming").exists():
            _root = _candidate
            break
    if _root is not None:
        MODEL_EVALS_DIR = _root / "01_Personal_Os" / "01_Memory" / "00_Context_LLM" / "08_Model_Evals"
    else:
        MODEL_EVALS_DIR = _HUB_DIR.parent / "00_Context_LLM" / "13_Model_Evals"

# Import engine modules
try:
    from g_eval import g_eval, g_eval_ensemble, g_eval_pairwise
except ImportError:
    g_eval = g_eval_ensemble = g_eval_pairwise = None

try:
    from quality_runner import QualityRunner
except ImportError:
    QualityRunner = None

try:
    from speed_profiler import SpeedProfiler
except ImportError:
    SpeedProfiler = None

try:
    from cost_analyzer import CostAnalyzer
except ImportError:
    CostAnalyzer = None

try:
    from token_counter import TokenCounter
except ImportError:
    TokenCounter = None

try:
    from run_history import RunHistory
except ImportError:
    RunHistory = None

try:
    from drift_detector import DriftDetector
except ImportError:
    DriftDetector = None

try:
    from pareto_frontier import ParetoFrontier
except ImportError:
    ParetoFrontier = None

try:
    from calibration_loop import CalibrationLoop
except ImportError:
    CalibrationLoop = None

try:
    from g_eval import set_calibration, get_calibration
except ImportError:
    set_calibration = get_calibration = None


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

VERSION = "2.0.0"


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------


def cmd_status():
    """Show general status of the eval module."""
    print(f"\n{'='*60}")
    print(f"  MODEL EVAL HUB — v{VERSION}")
    print(f"  {datetime.now(timezone.utc).isoformat()}")
    print(f"{'='*60}\n")

    # Engine modules
    modules = {
        "G-Eval (g_eval)": g_eval is not None,
        "Quality Runner": QualityRunner is not None,
        "Speed Profiler": SpeedProfiler is not None,
        "Cost Analyzer": CostAnalyzer is not None,
        "Token Counter": TokenCounter is not None,
    }

    print("  Engine Modules:")
    for name, loaded in modules.items():
        icon = "[OK]" if loaded else "[--]"
        print(f"    {icon} {name}")

    # Gold standards
    if MODEL_EVALS_DIR:
        gold_dir = MODEL_EVALS_DIR / "gold_standards"
        if gold_dir.exists():
            files = list(gold_dir.glob("quality_*.json"))
            print(f"\n  Gold Standards: {len(files)} files")
            for f in sorted(files):
                print(f"    - {f.stem.replace('quality_', '')}")
        else:
            print(f"\n  Gold Standards: directory not found")
    else:
        print(f"\n  Gold Standards: not configured")

    # Model registry
    registry_path = MODEL_EVALS_DIR / "model_registry.json"
    if registry_path.exists():
        try:
            with open(registry_path, "r", encoding="utf-8") as f:
                registry = json.load(f)
            models = registry.get("models", {})
            active = [k for k, v in models.items() if v.get("status") == "active"]
            candidates = [k for k, v in models.items() if v.get("status") == "candidate"]
            print(f"\n  Registry: {len(models)} models ({len(active)} active, {len(candidates)} candidates)")
        except (json.JSONDecodeError, IOError):
            print(f"\n  Registry: could not parse")

    # Calibration state
    if get_calibration is not None:
        cal = get_calibration()
        if cal:
            print(f"\n  Calibration: {len(cal)} judges adjusted")
            for judge, adj in sorted(cal.items()):
                print(f"    - {judge}: {adj:+.4f}")
        else:
            print(f"\n  Calibration: not active (run --calibrate)")

    print(f"\n  HUB Location: {_HUB_DIR}")
    print(f"{'='*60}\n")


def cmd_list_benchmarks():
    """List all available benchmark domains and suites."""
    if QualityRunner is None:
        print("  [ERROR] QualityRunner not available")
        return

    runner = QualityRunner(simulation=True)
    domains = runner.list_benchmarks()

    print(f"\n{'='*60}")
    print(f"  AVAILABLE BENCHMARKS")
    print(f"{'='*60}\n")

    print(f"  Domains ({len(domains)}):")
    for d in sorted(domains):
        print(f"    - {d}")

    print(f"\n  Suites:")
    from quality_runner import BENCHMARK_SUITES
    for name, info in BENCHMARK_SUITES.items():
        print(f"    - {name:<12} {info['description']}")

    print(f"{'='*60}\n")


def cmd_benchmark(suite_name: str, model_name: Optional[str] = None):
    """Run a benchmark suite."""
    if QualityRunner is None:
        print("  [ERROR] QualityRunner not available")
        return

    models_to_run = [model_name] if model_name else _get_active_models()

    print(f"\n{'='*60}")
    print(f"  RUNNING BENCHMARK SUITE: {suite_name}")
    print(f"{'='*60}\n")

    runner = QualityRunner(simulation=True)
    rh = RunHistory(simulation=True) if RunHistory is not None else None

    for model in models_to_run:
        print(f"  Evaluating: {model}")
        result = runner.run_suite(model, suite_name)
        if "error" in result:
            print(f"    ERROR: {result['error']}")
            continue
        print(f"    Overall Score: {result.get('overall_score', 'N/A')}")
        print(f"    Domains: {result.get('num_domains', 0)}")
        for domain, dr in result.get("domains", {}).items():
            print(f"      {domain}: {dr.get('mean_score', 'N/A')}")

        # Persist to run history
        if rh is not None:
            try:
                run_id = rh.save_run(result)
                print(f"    Saved as: {run_id}")
            except Exception as e:
                print(f"    [WARN] Could not save run: {e}")

        print()

    print(f"{'='*60}\n")


def cmd_run(model_name: str, task_text: str):
    """Evaluate a single model on a specific task."""
    print(f"\n{'='*60}")
    print(f"  RUN EVAL: {model_name}")
    print(f"{'='*60}\n")

    # G-Eval evaluation
    if g_eval:
        print("  Running G-Eval evaluation...")
        result = g_eval(
            actual_output=f"[Simulated output from {model_name}]",
            input_text=task_text,
            criterion="task_completion",
        )
        print(f"    Score: {result['score']}")
        print(f"    Judge: {result['judge_model']}")
        print(f"    Criterion: {result['criterion']}")

    # Speed profiling
    if SpeedProfiler:
        print("\n  Profiling speed...")
        profiler = SpeedProfiler(simulation=True)
        speed = profiler.measure(model_name, task_text, "Simulated output text here.")
        print(f"    TTFT: {speed.ttft_ms}ms")
        print(f"    Total: {speed.total_time_ms}ms")
        print(f"    TPS out: {speed.tps_output}")

    # Cost analysis
    if CostAnalyzer:
        print("\n  Analyzing cost...")
        analyzer = CostAnalyzer()
        cost = analyzer.calculate(model_name, tokens_in=100, tokens_out=200)
        print(f"    Cost: ${cost['cost_usd']}")

    print(f"\n{'='*60}\n")


def cmd_geval(criterion: str):
    """Interactive G-Eval mode."""
    if g_eval is None:
        print("  [ERROR] G-Eval module not available")
        return

    print(f"\n{'='*60}")
    print(f"  G-EVAL EVALUATION — criterion: {criterion}")
    print(f"{'='*60}\n")
    print("  Enter input text (Ctrl+D or Ctrl+Z then Enter to finish):")

    try:
        input_lines = []
        for line in sys.stdin:
            input_lines.append(line)
        input_text = "".join(input_lines).strip()
    except EOFError:
        input_text = ""

    if not input_text:
        print("  No input provided. Skipping.")
        return

    # Run ensemble evaluation
    # When only input text is provided (no separate model output), use a
    # placeholder so the judge evaluates the content rather than identity.
    result = g_eval_ensemble(
        actual_output="[Model output not provided — using input as output]",
        input_text=input_text,
        criterion=criterion,
        judges=3,
    )

    print(f"\n  Results:")
    print(f"    Mean Score: {result['mean_score']}")
    print(f"    Std Dev: {result['std_dev']}")
    print(f"    Confidence: {result['confidence']}")
    print(f"    Judges: {result['num_judges']}")

    for i, individual in enumerate(result["individual"]):
        print(f"      Judge {i+1} ({individual['judge_model']}): {individual['score']}")


def cmd_compare(model_a: str, model_b: str, domain: str = "reasoning"):
    """Compare two models head-to-head."""
    if QualityRunner is None:
        print("  [ERROR] QualityRunner not available")
        return

    print(f"\n{'='*60}")
    print(f"  HEAD-TO-HEAD: {model_a} vs {model_b}")
    print(f"  Domain: {domain}")
    print(f"{'='*60}\n")

    runner = QualityRunner(simulation=True)
    result = runner.compare(model_a, model_b, domain)

    print(f"  {model_a}: {result['model_a']['score']}")
    print(f"  {model_b}: {result['model_b']['score']}")
    print(f"  Delta: {result['delta']}")
    print(f"  Winner: {result['winner']}")
    print(f"{'='*60}\n")


def cmd_pareto(task_type: str = "complex_reasoning"):
    """Calculate Pareto frontier for a task type using ParetoFrontier engine."""
    print(f"\n{'='*60}")
    print(f"  PARETO FRONTIER — task_type: {task_type}")
    print(f"{'='*60}\n")

    if ParetoFrontier is None or RunHistory is None:
        print("  [ERROR] ParetoFrontier or RunHistory not available")
        print(f"{'='*60}\n")
        return

    try:
        rh = RunHistory(simulation=True)
        pf = ParetoFrontier(rh, simulation=True)
        frontier = pf.compute()

        f_models = frontier.get("frontier", [])
        if not f_models:
            print("  No model data available for Pareto calculation.")
            print("  Run some benchmarks first to populate scores.")
            print(f"{'='*60}\n")
            return

        sweet = frontier.get("sweet_spot", "none")
        print(f"  Pareto-Optimal Models ({len(f_models)}):")
        for m in f_models:
            marker = " *" if m.get("model") == sweet else "  "
            print(f"    {marker} {m.get('model', '?'):<25} quality={m['quality']:.2f}  cost=${m['cost']:.6f}")

        print(f"\n  * Sweet spot: {sweet} (best quality/cost ratio)")
    except Exception as e:
        print(f"  [ERROR] Pareto calculation failed: {e}")

    print(f"{'='*60}\n")


def cmd_drift(model_name: Optional[str] = None):
    """Show drift report for a model or all models using DriftDetector engine."""
    print(f"\n{'='*60}")
    print(f"  DRIFT REPORT")
    print(f"{'='*60}\n")

    if DriftDetector is None or RunHistory is None:
        print("  [ERROR] DriftDetector or RunHistory not available")
        print(f"{'='*60}\n")
        return

    try:
        rh = RunHistory(simulation=True)
        dd = DriftDetector(rh, simulation=True)

        if model_name:
            # Single model: check all its domains
            reports = dd.check_all()
            model_reports = [r for r in reports if r["model"] == model_name]
            if not model_reports:
                # Check anyway — will generate for default domains
                report = dd.check(model_name, "reasoning")
                model_reports = [report]

            for report in model_reports:
                _print_drift_report(report)
        else:
            # All models
            reports = dd.check_all()
            print(f"  Checking drift across {len(reports)} model/domain combinations...\n")
            for report in reports[:10]:  # Show first 10
                _print_drift_report(report)
            if len(reports) > 10:
                print(f"  ... and {len(reports) - 10} more (use --drift <model> for details)\n")
    except Exception as e:
        print(f"  [ERROR] Drift detection failed: {e}")

    print(f"{'='*60}\n")


def _print_drift_report(report: dict):
    """Pretty-print a single drift report."""
    model = report.get("model", "?")
    domain = report.get("domain", "?")
    severity = report.get("drift_severity", "none")
    z = report.get("z_score", 0)
    detected = report.get("drift_detected", False)

    if severity == "critical":
        icon = "CRIT"
    elif severity == "warning":
        icon = "WARN"
    else:
        icon = "OK"

    print(f"  [{icon}] {model:<25} domain={domain:<12} z={z:>8.4f}  baseline={report.get('baseline_mean', 0):.2f} -> recent={report.get('recent_mean', 0):.2f}")
    if detected:
        limits = report.get("control_limits", {})
        print(f"        Control limits: [{limits.get('lower', 0):.2f}, {limits.get('upper', 0):.2f}]")
    print()


def cmd_history(model_name: Optional[str] = None, domain: Optional[str] = None):
    """Show recent run history in a formatted table."""
    print(f"\n{'='*60}")
    print(f"  RUN HISTORY")
    print(f"{'='*60}\n")

    if RunHistory is None:
        print("  [ERROR] RunHistory not available")
        print(f"{'='*60}\n")
        return

    try:
        rh = RunHistory(simulation=True)
        runs = rh.get_runs(model=model_name, domain=domain, limit=25)

        if not runs:
            print("  No runs found.")
            print(f"{'='*60}\n")
            return

        print(f"  {'Run ID':<28} {'Model':<22} {'Score':>7} {'Suite':<12} {'Cost':>10}")
        print(f"  {'-'*28} {'-'*22} {'-'*7} {'-'*12} {'-'*10}")

        for r in runs[:20]:
            rid = r.get("run_id", "")
            mdl = r.get("model", "")[:22]
            score = r.get("overall_score", 0)
            suite = r.get("suite", "")[:12]
            cost = r.get("cost", {}).get("cost_usd", 0)
            print(f"  {rid:<28} {mdl:<22} {score:>7.2f} {suite:<12} ${cost:>8.6f}")

        print(f"\n  Showing {min(len(runs), 20)} of {len(runs)} runs")

        # Show summary stats if a model is specified
        if model_name:
            summary = rh.summarize(model_name)
            print(f"\n  Summary for {model_name}:")
            print(f"    Total runs: {summary.get('count', 0)}")
            print(f"    Mean score: {summary.get('mean_score', 0):.2f}")
            print(f"    Std dev:    {summary.get('std_dev', 0):.2f}")
            print(f"    Recent trend (last 5): {summary.get('recent_trend_mean', 0):.2f}")
            if summary.get("domain_breakdown"):
                print(f"    Domains:")
                for d_key, d_val in summary["domain_breakdown"].items():
                    print(f"      {d_key}: mean={d_val['mean']}, std={d_val['std']}, n={d_val['n']}")

    except Exception as e:
        print(f"  [ERROR] Could not load run history: {e}")

    print(f"{'='*60}\n")


def cmd_calibrate(num_samples: int = 50) -> None:
    """Run calibration: compute per-judge bias adjustments."""
    if CalibrationLoop is None:
        print("  [ERROR] CalibrationLoop not available")
        return

    print(f"\n{'='*60}")
    print(f"  CALIBRATION LOOP ({num_samples} samples)")
    print(f"{'='*60}\n")

    try:
        rh = RunHistory(simulation=True)
        cl = CalibrationLoop(rh, simulation=True)
        adjustments = cl.run(num_samples=num_samples)

        print(f"  {'Judge Model':25s} {'Mean Error':>10s} {'Adjustment':>10s} {'Samples':>8s}")
        print(f"  {'-'*25} {'-'*10} {'-'*10} {'-'*8}")

        for judge, info in sorted(adjustments.items()):
            print(f"  {judge:25s} {info['mean_error']:>10.4f} {info['adjustment']:>10.4f} {info['n_samples']:>8d}")

        # Apply corrections globally
        if set_calibration is not None:
            bias_dict = {j: info["adjustment"] for j, info in adjustments.items()}
            set_calibration(bias_dict)
            print(f"\n  Calibration applied globally to g_eval module.")

    except Exception as e:
        print(f"  [ERROR] Calibration failed: {e}")

    print(f"{'='*60}\n")


def _get_active_models() -> list:
    """Get list of active models from registry."""
    registry_path = MODEL_EVALS_DIR / "model_registry.json"
    if not registry_path.exists():
        return ["gpt-5.1", "claude-sonnet-4.8", "claude-opus-4.8"]

    try:
        with open(registry_path, "r", encoding="utf-8") as f:
            registry = json.load(f)
        return [
            k for k, v in registry.get("models", {}).items()
            if v.get("status") == "active"
        ]
    except (json.JSONDecodeError, IOError):
        return ["gpt-5.1", "claude-sonnet-4.8", "claude-opus-4.8"]



# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(
        description="Model Evaluation Hub — PersonalOS v5.0 SOTA",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python 26_Model_Eval_Hub.py --status                    # General status
  python 26_Model_Eval_Hub.py --list-benchmarks           # Available benchmarks
  python 26_Model_Eval_Hub.py --benchmark quick           # Quick benchmark suite
  python 26_Model_Eval_Hub.py --run gpt-5.1 "Hello"      # Evaluate model on task
  python 26_Model_Eval_Hub.py --geval coherence           # G-Eval evaluation (stdin)
   python 26_Model_Eval_Hub.py --compare opus sonnet       # Compare two models
   python 26_Model_Eval_Hub.py --pareto reasoning          # Pareto frontier
   python 26_Model_Eval_Hub.py --drift claude-opus-4.8     # Drift report
   python 26_Model_Eval_Hub.py --history                   # Run history
   python 26_Model_Eval_Hub.py --history --model gpt-5.1   # History for specific model
   python 26_Model_Eval_Hub.py --calibrate                 # Calibration loop
   python 26_Model_Eval_Hub.py --calibrate 100              # Calibration (100 samples)
        """,
    )

    parser.add_argument("--status", action="store_true", help="Show general status")
    parser.add_argument("--list-benchmarks", action="store_true", help="List available benchmarks")
    parser.add_argument("--benchmark", type=str, metavar="SUITE", help="Run benchmark suite (quick/standard/full/reasoning/code)")
    parser.add_argument("--run", type=str, nargs=2, metavar=("MODEL", "TASK"), help="Evaluate model on a task")
    parser.add_argument("--geval", type=str, metavar="CRITERION", help="G-Eval evaluation from stdin")
    parser.add_argument("--compare", type=str, nargs=2, metavar=("MODEL_A", "MODEL_B"), help="Compare two models head-to-head")
    parser.add_argument("--domain", type=str, default="reasoning", metavar="DOMAIN", help="Domain for comparison")
    parser.add_argument("--pareto", type=str, nargs="?", const="complex_reasoning", metavar="TASK_TYPE", help="Pareto frontier")
    parser.add_argument("--drift", type=str, nargs="?", const=None, metavar="MODEL", help="Drift report")
    parser.add_argument("--history", action="store_true", help="Show run history")
    parser.add_argument("--model", type=str, default=None, metavar="MODEL", help="Filter by model (for --history, --drift)")
    parser.add_argument("--calibrate", type=int, nargs="?", const=50, metavar="N",
                        help="Run calibration loop (N samples)")

    args = parser.parse_args()

    if args.status:
        cmd_status()
    elif args.list_benchmarks:
        cmd_list_benchmarks()
    elif args.benchmark:
        cmd_benchmark(args.benchmark)
    elif args.run:
        model, task = args.run
        cmd_run(model, task)
    elif args.geval:
        cmd_geval(args.geval)
    elif args.compare:
        model_a, model_b = args.compare
        cmd_compare(model_a, model_b, args.domain)
    elif args.pareto is not None:
        cmd_pareto(args.pareto)
    elif args.drift is not None:
        model = args.model if args.drift is None else args.drift
        cmd_drift(model)
    elif args.history:
        cmd_history(model_name=args.model, domain=args.domain)
    elif args.calibrate is not None:
        cmd_calibrate(num_samples=args.calibrate)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
