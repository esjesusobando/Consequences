"""
28_Model_Router_Hub.py — Model Router Orchestrator CLI
======================================================
PersonalOS v1.0 — Routing Hub, orquesta los 3 niveles de ruteo:
  Semantic -> Cascade -> Bandit

Usage:
    python 28_Model_Router_Hub.py --route "Write a Python sort function"
    python 28_Model_Router_Hub.py --route "Explain this concept" --verbose
    python 28_Model_Router_Hub.py --policy
    python 28_Model_Router_Hub.py --learn

Integration:
    - Se registra en HUB_SOTA.py como feature '28_model_router_hub'
    - Usa RunHistory del Model Eval Engine (26_Model_Eval_Engine)
    - Usa los routers: SemanticRouter, CascadeRouter, ContextualBandit
"""

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path


# ── Engine imports (with try/except ImportError) ────────────────────────────
try:
    from run_history import RunHistory
except ImportError:
    _BASE = Path(__file__).parent
    # Try 26_Model_Eval_Engine/
    engine_path = _BASE / "26_Model_Eval_Engine"
    if engine_path.exists():
        sys.path.insert(0, str(engine_path))
    sys.path.insert(0, str(_BASE))
    from run_history import RunHistory

try:
    from semantic_router import SemanticRouter
except ImportError:
    sys.path.insert(0, str(Path(__file__).parent / "28_Model_Router_Engine"))
    from semantic_router import SemanticRouter

try:
    from cascade_router import CascadeRouter
except ImportError:
    sys.path.insert(0, str(Path(__file__).parent / "28_Model_Router_Engine"))
    from cascade_router import CascadeRouter

try:
    from contextual_bandit import ContextualBandit
except ImportError:
    sys.path.insert(0, str(Path(__file__).parent / "28_Model_Router_Engine"))
    from contextual_bandit import ContextualBandit

try:
    from config_paths import ROUTING_POLICY_FILE, MODEL_EVALS_DIR
except ImportError:
    _BASE = Path(__file__).parent.parent if "__file__" in dir() else Path.cwd()
    sys.path.insert(0, str(_BASE))
    from config_paths import ROUTING_POLICY_FILE, MODEL_EVALS_DIR


# ── Severity thresholds ─────────────────────────────────────────────────────
_SEMANTIC_THRESHOLD = 0.8
_CASCADE_THRESHOLD = 0.7
_TASK_TYPES = {
    "code": "code|programming|function|algorithm|script|test",
    "reasoning": "reasoning|explain|analyze|compare|logic|math",
    "vision": "vision|image|photo|diagram|chart|visual",
    "creative": "creative|write|draft|compose|story|content",
    "quick": "quick|simple|short|fast|small",
    "default": "",
}

_SIMULATED_REWARDS = {
    "gpt-5.5-codex":     0.92,
    "claude-opus-4.8":   0.90,
    "gemini-3-ultra":    0.88,
    "claude-sonnet-4.8": 0.85,
    "gemini-3-pro":      0.82,
    "gpt-5.1":           0.80,
    "deepseek-v4":       0.76,
    "llama-4-70b":       0.72,
    "mistral-large-3":   0.75,
    "glm-5.2":           0.70,
}


def _detect_task_type(task: str) -> str:
    """Detect the most likely task type from the task description."""
    task_lower = task.lower()
    best_type = "default"
    best_matches = 0
    for ttype, pattern in _TASK_TYPES.items():
        if ttype == "default":
            continue
        keywords = [k.strip() for k in pattern.split("|")]
        matches = sum(1 for kw in keywords if kw in task_lower)
        if matches > best_matches:
            best_matches = matches
            best_type = ttype
    return best_type


def cmd_route(task: str, verbose: bool = False) -> dict:
    """Execute the 3-layer routing pipeline: Semantic -> Cascade -> Bandit.

    Args:
        task: Task description to route.
        verbose: If True, print detailed decision trace.

    Returns:
        Final routing decision dict.
    """
    task_type = _detect_task_type(task)
    print(f"Routing task: \"{task}\"")
    print(f"  Detected type: {task_type}")
    print()

    # -- Layer 1: Semantic Router --
    sr = SemanticRouter(simulation=True)
    sem_result = sr.route(task)
    if verbose:
        print(f"  [Layer 1 - Semantic] model={sem_result['model']} "
              f"conf={sem_result['confidence']:.4f} "
              f"rule={sem_result['matched_rule']}")

    if sem_result["confidence"] >= _SEMANTIC_THRESHOLD:
        _print_decision(1, "Semantic", sem_result)
        return sem_result | {"deciding_layer": "semantic", "pipeline": "3-layer"}

    # -- Layer 2: Cascade Router --
    print(f"  Semantic conf {sem_result['confidence']:.2f} < {_SEMANTIC_THRESHOLD}, "
          f"escalating to Cascade...")
    rh = RunHistory(simulation=True)
    cr = CascadeRouter(rh)
    cas_result = cr.route(task_type, required_quality=_CASCADE_THRESHOLD)
    if verbose:
        print(f"  [Layer 2 - Cascade] model={cas_result['model']} "
              f"conf={cas_result['confidence']:.4f} "
              f"tier={cas_result['tier_used']}/{cas_result['total_tiers']}")

    if cas_result["confidence"] >= _CASCADE_THRESHOLD:
        _print_decision(2, "Cascade", cas_result)
        return cas_result | {"deciding_layer": "cascade", "pipeline": "3-layer"}

    # -- Layer 3: Contextual Bandit --
    print(f"  Cascade conf {cas_result['confidence']:.2f} < {_CASCADE_THRESHOLD}, "
          f"escalating to Bandit...")
    cb = ContextualBandit(simulation=True)
    ctx = {"task_type": task_type, "difficulty": 0.5, "required_quality": _CASCADE_THRESHOLD}
    ban_result = cb.select_action(ctx)

    # Record simulated reward
    reward = _SIMULATED_REWARDS.get(ban_result["model"], 0.75)
    cb.update(ctx, ban_result["model"], reward)

    if verbose:
        print(f"  [Layer 3 - Bandit] model={ban_result['model']} "
              f"ucb={ban_result['ucb_score']:.4f} "
              f"explored={ban_result['explored']}")

    _print_decision(3, "Bandit", ban_result)
    return ban_result | {"deciding_layer": "bandit", "pipeline": "3-layer"}


def _print_decision(layer: int, name: str, result: dict) -> None:
    """Print the final routing decision."""
    print()
    print(f"  >> DECISION: Layer {layer} ({name})")
    print(f"     Model:      {result['model']}")
    print(f"     Confidence: {result.get('confidence', result.get('ucb_score', 0)):.4f}")
    print(f"     Details:    {result.get('matched_rule', result.get('tier_used', 'UCB select'))}")
    print()


def cmd_policy() -> None:
    """Display the current bandit policy (from simulation defaults)."""
    cb = ContextualBandit(simulation=True)
    policy = cb.get_policy()
    print()
    print("  BANDIT POLICY")
    print("  " + "=" * 50)
    print(f"  Epsilon: {policy['epsilon']}")
    print(f"  Arms: {len(policy['arms'])}")
    print()
    print(f"  {'Model':25s} {'N':>4s} {'Avg Reward':>10s}")
    print(f"  {'-'*25} {'-'*4} {'-'*10}")
    for model, stats in sorted(policy['arms'].items()):
        print(f"  {model:25s} {stats['n']:4d} {stats['avg_reward']:10.4f}")
    print()


def cmd_learn(num_rounds: int = 100) -> None:
    """Run a bandit learning loop.

    Simulates routing requests and records rewards to train the bandit.

    Args:
        num_rounds: Number of simulated learning rounds.
    """
    print(f"\n  BANDIT LEARNING LOOP ({num_rounds} rounds)\n")

    sample_tasks = [
        "Write a Python function that sorts a list",
        "Explain the theory of relativity",
        "Detect objects in this image",
        "Write a creative poem about space",
        "What is the capital of France?",
        "Refactor this code for better performance",
        "Analyze this chart for trends",
        "Compare two machine learning models",
        "Write a short story about AI",
        "Debug this Python script",
    ]

    cb = ContextualBandit(simulation=True)

    for i in range(num_rounds):
        task = sample_tasks[i % len(sample_tasks)]
        task_type = _detect_task_type(task)
        ctx = {"task_type": task_type, "difficulty": 0.5, "required_quality": 0.7}
        result = cb.select_action(ctx)
        reward = _SIMULATED_REWARDS.get(result["model"], 0.75)
        cb.update(ctx, result["model"], reward)

    policy = cb.get_policy()
    print(f"  Training complete: {num_rounds} rounds across "
          f"{len(policy['arms'])} arms")
    print()
    print(f"  {'Model':25s} {'N':>4s} {'Avg Reward':>10s}")
    print(f"  {'-'*25} {'-'*4} {'-'*10}")
    for model, stats in sorted(policy['arms'].items()):
        print(f"  {model:25s} {stats['n']:4d} {stats['avg_reward']:10.4f}")
    print()


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="28_Model_Router_Hub.py",
        description="Model Router Orchestrator — 3-layer routing pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python 28_Model_Router_Hub.py --route "Write a Python sort function"
  python 28_Model_Router_Hub.py --route "Explain this" --verbose
  python 28_Model_Router_Hub.py --policy
  python 28_Model_Router_Hub.py --learn
        """,
    )

    parser.add_argument("--route", type=str, metavar="TASK",
                        help="Route a task through the 3-layer pipeline")
    parser.add_argument("--verbose", action="store_true",
                        help="Show detailed decision trace (with --route)")
    parser.add_argument("--policy", action="store_true",
                        help="Show current bandit policy")
    parser.add_argument("--learn", type=int, nargs="?", const=100,
                        metavar="N", help="Run bandit learning loop (N rounds)")

    args = parser.parse_args()

    if args.route:
        cmd_route(args.route, verbose=args.verbose)
    elif args.policy:
        cmd_policy()
    elif args.learn is not None:
        cmd_learn(num_rounds=args.learn)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
