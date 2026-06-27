#!/usr/bin/env python3
"""
Eval Framework Runner
Evaluates agent quality across metrics: response_time, token_usage, context_accuracy, task_completion
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

EVAL_DIR = PROJECT_ROOT / "08_Evals"
AGENTS_DIR = PROJECT_ROOT / "01_Personal_Os" / "02_Knowledge" / "10_Shared_Org" / "agents"
METRICS_DIR = EVAL_DIR / "metrics"
HISTORY_DIR = METRICS_DIR / "history"

AGENTS = {
    "admin": "Admin Agent",
    "finance": "Finance Agent",
    "hr": "HR Agent",
    "marketing_strategist": "Marketing Strategist",
    "content_creator": "Content Creator"
}


def load_baseline():
    """Load baseline scores from metrics/baseline.json"""
    baseline_path = METRICS_DIR / "baseline.json"
    if baseline_path.exists():
        return json.loads(baseline_path.read_text(encoding="utf-8"))
    return {}


def load_agent_config(agent_key):
    """Load agent config from Shared Org"""
    config_path = AGENTS_DIR / f"{agent_key}-config.yaml"
    if not config_path.exists():
        # Fallback: look for template
        template_path = AGENTS_DIR / f"{agent_key}-agent.md"
        if template_path.exists():
            return {"template": template_path.read_text(encoding="utf-8")}
    return {"config": config_path.read_text(encoding="utf-8")} if config_path.exists() else {}


def get_scenarios(agent_key):
    """Load eval scenarios for an agent"""
    agent_dir = EVAL_DIR / "agents" / agent_key
    scenarios = []

    if not agent_dir.exists():
        return scenarios

    for scenario_file in sorted(agent_dir.glob("scenario_*.json")):
        try:
            scenario = json.loads(scenario_file.read_text(encoding="utf-8"))
            scenario["file"] = str(scenario_file)
            scenarios.append(scenario)
        except Exception as e:
            print(f"[WARN] Failed to load {scenario_file}: {e}")

    return scenarios


def run_scenario(agent_key, scenario):
    """Run a single eval scenario and collect metrics"""
    print(f"  Running: {scenario.get('name', 'unnamed')}")

    start_time = time.time()

    # Simulate agent execution (in real implementation, this would call the actual agent)
    # For now, we simulate metrics
    time.sleep(0.1)  # Simulate processing time

    response_time = time.time() - start_time

    # Simulated metrics (in real implementation, these would come from actual agent execution)
    token_usage = 1500  # Estimated tokens
    context_accuracy = 85  # % of relevant context loaded
    task_completion = 1  # Binary: 1 = completed successfully

    # In a real implementation, you would:
    # 1. Load the agent with its config
    # 2. Feed the scenario input
    # 3. Measure actual response time
    # 4. Count actual tokens (via Engram or API)
    # 5. Verify output against expected
    # 6. Calculate context accuracy

    return {
        "scenario_id": scenario.get("id", "unknown"),
        "scenario_name": scenario.get("name", "unnamed"),
        "response_time": round(response_time, 3),
        "token_usage": token_usage,
        "context_accuracy": context_accuracy,
        "task_completion": task_completion,
        "passed": task_completion == 1
    }


def evaluate_agent(agent_key):
    """Evaluate a single agent"""
    print(f"\n[EVAL] Evaluating {AGENTS.get(agent_key, agent_key)}")

    config = load_agent_config(agent_key)
    scenarios = get_scenarios(agent_key)

    if not scenarios:
        print(f"  [WARN] No scenarios found for {agent_key}")
        return None

    results = {
        "agent": agent_key,
        "agent_name": AGENTS.get(agent_key, agent_key),
        "timestamp": datetime.now().isoformat(),
        "scenarios": [],
        "metrics": {
            "response_time": 0,
            "token_usage": 0,
            "context_accuracy": 0,
            "task_completion": 0
        }
    }

    for scenario in scenarios:
        result = run_scenario(agent_key, scenario)
        results["scenarios"].append(result)
        results["metrics"]["response_time"] += result["response_time"]
        results["metrics"]["token_usage"] += result["token_usage"]
        results["metrics"]["context_accuracy"] += result["context_accuracy"]
        results["metrics"]["task_completion"] += result["task_completion"]

    # Average metrics
    n = len(scenarios)
    results["metrics"]["response_time"] = round(results["metrics"]["response_time"] / n, 3)
    results["metrics"]["token_usage"] = results["metrics"]["token_usage"] // n
    results["metrics"]["context_accuracy"] = round(results["metrics"]["context_accuracy"] / n, 1)
    results["metrics"]["task_completion"] = results["metrics"]["task_completion"] / n

    # Calculate overall score (weighted average)
    results["overall_score"] = round(
        results["metrics"]["task_completion"] * 40 +
        results["metrics"]["context_accuracy"] * 0.3 +
        (100 - min(results["metrics"]["response_time"] * 10, 100)) * 0.2 +
        (100 - min(results["metrics"]["token_usage"] / 50, 100)) * 0.1
    , 1)

    return results


def evaluate_all():
    """Evaluate all agents"""
    print("[EVAL] Starting full evaluation suite")
    print("=" * 50)

    all_results = {}
    for agent_key in AGENTS:
        result = evaluate_agent(agent_key)
        if result:
            all_results[agent_key] = result

    return all_results


def save_results(results):
    """Save evaluation results to history"""
    HISTORY_DIR.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = HISTORY_DIR / f"eval_{timestamp}.json"

    output = {
        "timestamp": datetime.now().isoformat(),
        "results": results
    }

    filename.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n[EVAL] Results saved to {filename}")
    return filename


def load_baseline_scores():
    """Load baseline scores for regression detection"""
    baseline = load_baseline()
    return baseline.get("agents", {})


def check_regressions(results, baseline):
    """Check for regressions against baseline"""
    regressions = []

    for agent_key, result in results.items():
        if agent_key in baseline:
            baseline_score = baseline[agent_key].get("overall_score", 70)
            current_score = result.get("overall_score", 0)

            if baseline_score - current_score > 10:
                regressions.append({
                    "agent": agent_key,
                    "baseline": baseline_score,
                    "current": current_score,
                    "drop": baseline_score - current_score
                })
                print(f"  [REGRESSION] {agent_key}: {baseline_score} -> {current_score} (drop: {baseline_score - current_score:.1f})")

    return regressions


def generate_dashboard(results):
    """Generate quality dashboard markdown"""
    baseline = load_baseline_scores()

    lines = [
        "# 📊 Eval Quality Dashboard",
        "",
        f"**Last Updated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"**Total Agents:** {len(results)}",
        "",
        "## Overall Quality Scores",
        "",
        "| Agent | Overall Score | Response Time (s) | Token Usage | Context Accuracy | Task Completion | Status |",
        "|-------|---------------|-------------------|-------------|------------------|-----------------|--------|",
    ]

    for agent_key, result in results.items():
        overall = result.get("overall_score", 0)
        m = result.get("metrics", {})

        status = "✅ PASS"
        baseline = load_baseline_scores()
        if agent_key in baseline:
            if baseline[agent_key].get("overall_score", 70) - overall > 10:
                status = "⚠️ REGRESSION"

        lines.append(
            f"| {result['agent_name']} | {overall}/100 | "
            f"{m.get('response_time', 0)} | {m.get('token_usage', 0)} | "
            f"{m.get('context_accuracy', 0)}% | "
            f"{m.get('task_completion', 0)*100:.0f}% | {status} |"
        )

    lines.extend([
        "",
        "## Metrics Breakdown",
        "",
        "### Response Time (seconds)",
        "| Agent | Avg Time |",
        "|-------|----------|",
    ])

    for agent_key, result in results.items():
        m = result.get("metrics", {})
        lines.append(f"| {result['agent_name']} | {m.get('response_time', 0)} |")

    lines.extend([
        "",
        "### Token Usage",
        "| Agent | Avg Tokens |",
        "|-------|------------|",
    ])

    for agent_key, result in results.items():
        m = result.get("metrics", {})
        lines.append(f"| {result['agent_name']} | {m.get('token_usage', 0)} |")

    lines.extend([
        "",
        "### Context Accuracy",
        "| Agent | Accuracy |",
        "|-------|----------|",
    ])

    for agent_key, result in results.items():
        m = result.get("metrics", {})
        lines.append(f"| {result['agent_name']} | {m.get('context_accuracy', 0)}% |")

    lines.extend([
        "",
        "### Task Completion",
        "| Agent | Completion |",
        "|-------|------------|",
    ])

    for agent_key, result in results.items():
        m = result.get("metrics", {})
        lines.append(f"| {result['agent_name']} | {m.get('task_completion', 0)*100:.0f}% |")

    lines.extend([
        "",
        "## Trend Indicators",
        "",
        "* ↑ = Improved since last eval",
        "* ↓ = Regressed since last eval",
        "* → = Stable",
        "",
        "---",
        "*Generated by 08_Evals/run_evals.py*",
    ])

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Eval Framework Runner")
    parser.add_argument("--agent", help="Agent to evaluate (or 'all' for all agents)")
    parser.add_argument("--regress", action="store_true", help="Check for regressions")
    parser.add_argument("--dashboard", action="store_true", help="Generate dashboard")
    args = parser.parse_args()

    agent = args.agent or "all"

    if agent == "all":
        results = evaluate_all()
    else:
        if agent not in AGENTS:
            print(f"[ERROR] Unknown agent: {agent}")
            print(f"Available: {', '.join(AGENTS.keys())}")
            sys.exit(1)
        result = evaluate_agent(agent)
        results = {agent: result} if result else {}

    if not results:
        print("[ERROR] No results generated")
        sys.exit(1)

    # Save results
    save_results(results)

    # Check regressions
    if args.regress or True:  # Always check
        regressions = check_regressions(results, load_baseline_scores())
        if regressions:
            print(f"\n[REGRESSION] {len(regressions)} regression(s) detected!")

    # Generate dashboard
    dashboard = generate_dashboard(results)
    dashboard_path = EVAL_DIR / "dashboard.md"
    dashboard_path.write_text(dashboard, encoding="utf-8")
    print(f"[EVAL] Dashboard updated: {dashboard_path}")

    # Print summary
    print("\n" + "=" * 50)
    print("EVALUATION SUMMARY")
    print("=" * 50)
    for agent_key, result in results.items():
        overall = result.get("overall_score", 0)
        print(f"  {result['agent_name']}: {overall}/100")

    sys.exit(0)


if __name__ == "__main__":
    main()