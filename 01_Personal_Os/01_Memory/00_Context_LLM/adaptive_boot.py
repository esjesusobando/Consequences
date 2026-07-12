#!/usr/bin/env python3
"""
Adaptive Boot — Conditional Context Loading
Determines which context files to load based on agent type and task type.
"""

import json
import yaml
import sys
from pathlib import Path
from datetime import datetime

def _find_repo_root() -> Path:
    """Find repo root by walking up until sentinel '00_Winter_is_Coming' is found."""
    for parent in Path(__file__).resolve().parents:
        if (parent / "00_Winter_is_Coming").exists():
            return parent
    raise RuntimeError("Could not find repo root — sentinel '00_Winter_is_Coming' not found")


PROJECT_ROOT = _find_repo_root()
PROFILES_FILE = PROJECT_ROOT / "01_Personal_Os" / "00_Core" / "01_Rules" / "context_profiles.yaml"
AGENTS_CONFIG_DIR = PROJECT_ROOT / "01_Personal_Os" / "00_Core" / "02_Tools" / "01_Agents"


def load_profiles() -> dict:
    """Load context profiles from YAML"""
    if not PROFILES_FILE.exists():
        print(f"[WARN] Context profiles not found: {PROFILES_FILE}")
        return {}
    try:
        return yaml.safe_load(PROFILES_FILE.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"[ERROR] Failed to load profiles: {e}")
        return {}


def detect_agent_type(agent_name: str = "", agent_config: str = "", task_description: str = "") -> str:
    """Detect agent type from name, config, or task description"""
    text = f"{agent_name} {agent_config} {task_description}".lower()

    type_keywords = {
        "admin": ["admin", "operaciones", "onboarding", "coordinación", "facturación"],
        "finance": ["finance", "finanzas", "presupuesto", "budget", "reporting financiero"],
        "hr": ["hr", "rrhh", "recursos humanos", "employee", "personal"],
        "marketing_strategist": ["marketing", "estratega", "brand", "campaña", "estrategia"],
        "content_creator": ["content", "contenido", "creador", "redactor", "copywriter"]
    }

    for agent_type, keywords in type_keywords.items():
        for kw in keywords:
            if kw in text:
                return agent_type

    return "unknown"


def detect_task_type(task_description: str = "") -> str:
    """Detect task type from description"""
    text = task_description.lower()

    task_keywords = {
        "onboarding": ["onboarding", "nuevo cliente", "nuevo empleado", "incorporación"],
        "reporting": ["reporte", "report", "dashboard", "métricas", "kpi"],
        "content_creation": ["contenido", "content", "blog", "newsletter", "post", "artículo"],
        "analysis": ["análisis", "analysis", "datos", "data", "métricas"],
        "coordination": ["coordinar", "coordinación", "reunión", "sync", "equipo"]
    }

    for task_type, keywords in task_keywords.items():
        for kw in keywords:
            if kw in text:
                return task_type

    return "general"


def get_context_plan(agent_type: str, task_type: str = "general") -> dict:
    """Determine which context files to load"""
    profiles = load_profiles()

    plan = {
        "agent_type": agent_type,
        "task_type": task_type,
        "required": [],
        "optional": [],
        "boost": [],
        "excluded": [],
        "total_files": 0,
        "estimated_tokens": 0
    }

    # Agent profile
    if agent_type in profiles:
        agent_profile = profiles[agent_type]
        plan["required"].extend(agent_profile.get("required", []))
        plan["optional"].extend(agent_profile.get("optional", []))
        plan["excluded"].extend(agent_profile.get("excluded", []))

    # Task type boost
    task_types = profiles.get("task_types", {})
    if task_type in task_types:
        plan["boost"].extend(task_types[task_type].get("boost", []))

    # Always load core context
    core_files = [
        "00_Winter_is_Coming/GOALS.md",
        "00_Winter_is_Coming/BACKLOG.md"
    ]
    plan["required"].extend(core_files)

    # Deduplicate
    plan["required"] = list(dict.fromkeys(plan["required"]))
    plan["optional"] = list(dict.fromkeys(plan["optional"]))
    plan["boost"] = list(dict.fromkeys(plan["boost"]))

    # Remove excluded from required and optional
    excluded_set = set(plan["excluded"])
    plan["required"] = [f for f in plan["required"] if f not in excluded_set]
    plan["optional"] = [f for f in plan["optional"] if f not in excluded_set]
    plan["boost"] = [f for f in plan["boost"] if f not in excluded_set]

    plan["total_files"] = len(plan["required"]) + len(plan["boost"])

    return plan


def estimate_tokens(plan: dict) -> int:
    """Estimate tokens for the context plan"""
    # Rough estimate: 1 token ≈ 4 characters
    total_chars = 0
    for file_list in [plan["required"], plan["boost"]]:
        for fp in file_list:
            path = PROJECT_ROOT / fp
            if path.exists():
                total_chars += path.stat().st_size
    return total_chars // 4


def print_boot_plan(plan: dict):
    """Print the boot plan in a readable format"""
    print(f"\n{'='*60}")
    print(f"ADAPTIVE BOOT PLAN")
    print(f"{'='*60}")
    print(f"Agent Type: {plan['agent_type']}")
    print(f"Task Type:  {plan['task_type']}")
    print(f"{'='*60}\n")

    print(f"[REQ] REQUIRED ({len(plan['required'])} files):")
    for fp in plan["required"]:
        exists = "[OK]" if (PROJECT_ROOT / fp).exists() else "[!!]"
        print(f"  {exists} {fp}")

    if plan["boost"]:
        print(f"\n[BOOST] TASK BOOST ({len(plan['boost'])} files):")
        for fp in plan["boost"]:
            exists = "[OK]" if (PROJECT_ROOT / fp).exists() else "[!!]"
            print(f"  {exists} {fp}")

    if plan["optional"]:
        print(f"\n[OPT] OPTIONAL ({len(plan['optional'])} files):")
        for fp in plan["optional"]:
            exists = "[OK]" if (PROJECT_ROOT / fp).exists() else "[!!]"
            print(f"  {exists} {fp}")

    if plan["excluded"]:
        print(f"\n[SKIP] EXCLUDED ({len(plan['excluded'])} files):")
        for fp in plan["excluded"]:
            print(f"  - {fp}")

    tokens = estimate_tokens(plan)
    print(f"\n{'='*60}")
    print(f"Total files: {plan['total_files']}")
    print(f"Estimated tokens: ~{tokens:,}")
    print(f"{'='*60}\n")


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Adaptive Boot — Context Loading Plan")
    parser.add_argument("--agent", default="", help="Agent name or type")
    parser.add_argument("--task", default="", help="Task description")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    args = parser.parse_args()

    agent_type = detect_agent_type(agent_name=args.agent, task_description=args.task)
    task_type = detect_task_type(args.task)

    plan = get_context_plan(agent_type, task_type)

    if args.json:
        plan["estimated_tokens"] = estimate_tokens(plan)
        print(json.dumps(plan, indent=2, ensure_ascii=False))
    else:
        print_boot_plan(plan)


if __name__ == "__main__":
    main()