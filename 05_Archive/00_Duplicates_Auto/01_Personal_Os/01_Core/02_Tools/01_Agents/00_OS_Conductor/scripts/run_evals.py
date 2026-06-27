#!/usr/bin/env python3
"""
run_evals.py — OS Conductor Eval Runner (Skill Creator v2.0)

Executes the evaluation tests defined in evals.json against the Conductor's
SKILL.md, registry, and structure. Each test checks that the required
sections, patterns, and configurations exist.

Usage:
    python scripts/run_evals.py              # Run all evals
    python scripts/run_evals.py --verbose    # Detailed output
    python scripts/run_evals.py --name routing  # Filter by eval name
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime

CONDUCTOR_DIR = Path(__file__).resolve().parent.parent
EVALS_FILE = CONDUCTOR_DIR / "evals.json"
SKILL_FILE = CONDUCTOR_DIR / "SKILL.md"
REGISTRY_FILE = CONDUCTOR_DIR / "registry.md"


def load_evals() -> list[dict]:
    with open(EVALS_FILE, encoding="utf-8") as f:
        data = json.load(f)
    return data["evals"]


def check_skill_content(pattern: str, description: str = "") -> bool:
    """Check if SKILL.md contains a given pattern."""
    if not SKILL_FILE.exists():
        return False
    content = SKILL_FILE.read_text(encoding="utf-8")
    return re.search(pattern, content, re.IGNORECASE | re.DOTALL) is not None


def check_registry_content(pattern: str) -> bool:
    """Check if registry.md contains a given pattern."""
    if not REGISTRY_FILE.exists():
        return False
    content = REGISTRY_FILE.read_text(encoding="utf-8")
    return re.search(pattern, content, re.IGNORECASE | re.DOTALL) is not None


def eval_routing_content_creation() -> dict:
    """Routing un request de contenido al área correcta."""
    passed = True
    details = []

    checks = [
        ("SKILL.md references 01_Creacion_Contenidos",
         r"01_Creacion_Contenidos"),
        ("SKILL.md has content creation trigger",
         r"crear contenido|post.*linkedin|artículo|blog"),
        ("Registry has content skills listed",
         r"01_Creacion_Contenidos"),
    ]

    for desc, pattern in checks:
        ok = check_skill_content(pattern) or check_registry_content(pattern)
        if not ok:
            passed = False
            details.append(f"❌ {desc}")
        else:
            details.append(f"✅ {desc}")

    return {
        "name": "routing-content-creation",
        "passed": passed,
        "checks": len(checks),
        "passed_checks": count_passed(details),
        "details": details,
    }


def eval_routing_sdd() -> dict:
    """Routing request de implementación a SDD."""
    passed = True
    details = []

    checks = [
        ("SKILL.md references 00_Compound_Engineering",
         r"00_Compound_Engineering"),
        ("SKILL.md defines SDD flow",
         r"SDD.*flow|flujo.*SDD|SDD.*Init|SDD.*Archive"),
        ("SKILL.md mentions compound engineering for code",
         r"00_Compound_Engineering.*SDD|escribir.*testear.*código"),
    ]

    for desc, pattern in checks:
        ok = check_skill_content(pattern) or check_registry_content(pattern)
        if not ok:
            passed = False
            details.append(f"❌ {desc}")
        else:
            details.append(f"✅ {desc}")

    return {
        "name": "routing-sdd-development",
        "passed": passed,
        "checks": len(checks),
        "passed_checks": count_passed(details),
        "details": details,
    }


def count_passed(details: list[str]) -> int:
    """Count items that start with ✅."""
    return sum(1 for d in details if d.startswith("✅"))


def eval_auto_exclusion() -> dict:
    """El Conductor no se selecciona a sí mismo."""
    passed = True
    details = []

    checks = [
        ("SKILL.md has auto-exclusion rule",
         r"auto-exclusión|Auto.Exclusión|NUNCA.*selecciona"),
        ("SKILL.md prevents self-invocation",
         r"no.*re.invoca|no.*re.selecciona|nunca.*sí mismo"),
        ("No self-reference in routing table",
         r"00_OS_Conductor"),  # Should appear only as context, not as target
    ]

    for desc, pattern in checks:
        ok = check_skill_content(pattern)
        if not ok:
            passed = False
            details.append(f"❌ {desc}")
        else:
            details.append(f"✅ {desc}")

    # Special check: verify Conductor doesn't list itself as a route target
    has_self_route = check_skill_content(r"\|\s*00_OS_Conductor\s*\|")
    if has_self_route:
        passed = False
        details.append("❌ No self-route in routing table")
    else:
        details.append("✅ No self-route in routing table")

    return {
        "name": "auto-exclusion-guard",
        "passed": passed,
        "checks": len(checks) + 1,
        "passed_checks": count_passed(details),
        "details": details,
    }


def eval_multi_category() -> dict:
    """Request multi-categoría debe preguntar."""
    passed = True
    details = []

    checks = [
        ("SKILL.md has multi-category detection",
         r"multi.categorí|3\+.*áreas|matchea.*3"),
        ("SKILL.md specifies to ask user",
         r"preguntar.*usuario|clarificar|qué.*prioridad"),
        ("SKILL.md has tiebreaker priority table",
         r"CORE.*ALTA.*MEDIA|tiebreaker|prioridad"),
    ]

    for desc, pattern in checks:
        ok = check_skill_content(pattern)
        if not ok:
            passed = False
            details.append(f"❌ {desc}")
        else:
            details.append(f"✅ {desc}")

    return {
        "name": "multi-category-detection",
        "passed": passed,
        "checks": len(checks),
        "passed_checks": count_passed(details),
        "details": details,
    }


def eval_sprint_contract() -> dict:
    """Sprint Contract negociado antes de ejecutar."""
    passed = True
    details = []

    checks = [
        ("SKILL.md has Sprint Contract section",
         r"Sprint Contract|Paso 0.*Sprint"),
        ("SKILL.md shows example negotiation",
         r"CONDUCTOR.*Entendido|Contrato firmado|criterios.*acordados"),
        ("SKILL.md references contract template",
         r"sprint-contract\.md|contracts/"),
    ]

    for desc, pattern in checks:
        ok = check_skill_content(pattern)
        if not ok:
            passed = False
            details.append(f"❌ {desc}")
        else:
            details.append(f"✅ {desc}")

    return {
        "name": "sprint-contract-proposal",
        "passed": passed,
        "checks": len(checks),
        "passed_checks": count_passed(details),
        "details": details,
    }


def eval_system_diagnosis() -> dict:
    """Diagnóstico invoca System_Core + Skill_Auditor."""
    passed = True
    details = []

    checks = [
        ("SKILL.md routes to 00_System_Core for diagnosis",
         r"00_System_Core.*diagnóstico|diagnóstico.*00_System_Core"),
        ("SKILL.md references 10_Skill_Auditor",
         r"10_Skill_Auditor"),
        ("SKILL.md has system health commands",
         r"diagnóstico.*OS|diagnóstico.*sistema|salud.*OS"),
    ]

    for desc, pattern in checks:
        ok = check_skill_content(pattern)
        if not ok:
            passed = False
            details.append(f"❌ {desc}")
        else:
            details.append(f"✅ {desc}")

    return {
        "name": "system-diagnosis-flow",
        "passed": passed,
        "checks": len(checks),
        "passed_checks": count_passed(details),
        "details": details,
    }


def eval_unrecognized() -> dict:
    """Request no reconocido pide clarificación."""
    passed = True
    details = []

    checks = [
        ("SKILL.md has unrecognized request handler",
         r"No reconozco|UNRECOGNIZED|no.*match.*categorí|default.*case"),
        ("SKILL.md clarifies instead of guessing",
         r"clarificación|preguntar.*qué.*necesita|pedir.*clarif"),
        ("Routing table has default/else fallback",
         r"00_System_Core.*diagnóstico|Pedir clarificación"),
    ]

    for desc, pattern in checks:
        ok = check_skill_content(pattern)
        if not ok:
            passed = False
            details.append(f"❌ {desc}")
        else:
            details.append(f"✅ {desc}")

    return {
        "name": "unrecognized-request",
        "passed": passed,
        "checks": len(checks),
        "passed_checks": count_passed(details),
        "details": details,
    }


def compute_grade(results: list[dict]) -> str:
    passed = sum(1 for r in results if r["passed"])
    total = len(results)
    pct = (passed / total * 100) if total > 0 else 0
    if pct >= 90:
        return "✅ EXCELLENT"
    elif pct >= 70:
        return "👍 GOOD"
    elif pct >= 50:
        return "⚠️ NEEDS WORK"
    return "❌ FAILED"


def main():
    # Fix Windows encoding for emoji output
    if sys.platform == "win32":
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    verbose = "--verbose" in sys.argv
    name_filter = None
    for i, arg in enumerate(sys.argv):
        if arg == "--name" and i + 1 < len(sys.argv):
            name_filter = sys.argv[i + 1]

    print("=" * 65)
    print("🎯 OS CONDUCTOR — EVAL RUNNER (Skill Creator v2.0)")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 65)

    if not EVALS_FILE.exists():
        print(f"\n❌ evals.json not found at {EVALS_FILE}")
        sys.exit(1)

    evals = load_evals()
    if name_filter:
        evals = [e for e in evals if name_filter.lower() in e["name"].lower()]
        if not evals:
            print(f"\n❌ No evals matched '{name_filter}'")
            sys.exit(1)

    # Run all eval functions
    eval_fns = {
        "routing-content-creation": eval_routing_content_creation,
        "routing-sdd-development": eval_routing_sdd,
        "auto-exclusion-guard": eval_auto_exclusion,
        "multi-category-detection": eval_multi_category,
        "sprint-contract-proposal": eval_sprint_contract,
        "system-diagnosis-flow": eval_system_diagnosis,
        "unrecognized-request": eval_unrecognized,
    }

    results = []
    for eval_def in evals:
        fn = eval_fns.get(eval_def["name"])
        if not fn:
            print(f"\n⚠️  No test function for '{eval_def['name']}'")
            continue

        result = fn()
        results.append(result)

        status = "✅" if result["passed"] else "❌"
        print(f"\n{status} {result['name']}")
        print(f"   Checks: {result['passed_checks']}/{result['checks']}")

        if verbose or not result["passed"]:
            for detail in result["details"]:
                print(f"   {detail}")

    # Summary
    total_evals = len(results)
    passed_evals = sum(1 for r in results if r["passed"])
    total_checks = sum(r["checks"] for r in results)
    passed_checks = sum(r["passed_checks"] for r in results)

    grade = compute_grade(results)

    print("\n" + "=" * 65)
    print("📊 BENCHMARK SUMMARY")
    print("=" * 65)
    print(f"Evals run:     {total_evals}")
    print(f"Evals passed:  {passed_evals}/{total_evals}")
    print(f"Checks passed: {passed_checks}/{total_checks}")
    print(f"Pass rate:     {(passed_checks/total_checks*100):.1f}%" if total_checks > 0 else "N/A")
    print(f"Grade:         {grade}")
    print("=" * 65)

    return 0 if all(r["passed"] for r in results) else 1


if __name__ == "__main__":
    sys.exit(main())
