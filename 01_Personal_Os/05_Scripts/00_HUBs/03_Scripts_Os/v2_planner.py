#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v2_planner.py — V2 Plan Generator
==================================
Takes synthesis results and generates an actionable V2 plan:
- Prioritized fixes (must-have / should-have / nice-to-have)
- New feature ideas from feedback
- Design improvements
- Actionable next steps

CLI:
    python v2_planner.py --prototype-id "proto_xxx"
    python v2_planner.py --test

Output: v2_plan_{id}.md in .cache/prototypes/
"""
import sys
import os
import json
import argparse
import logging
from pathlib import Path
from datetime import datetime, timezone

# ─────────────────────────────────────────────────────────────
# WINDOWS UTF-8 FIX
# ─────────────────────────────────────────────────────────────
def _fix_encoding():
    if sys.platform == "win32":
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

PROTOTYPES_DIR = CACHE_DIR / "prototypes"


def _gen_id(prefix: str = "v2") -> str:
    import random, string
    date_str = datetime.now().strftime("%Y%m%d")
    rand = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"{prefix}_{date_str}_{rand}"


def _safe_write(content: str, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix('.tmp')
    tmp.write_text(content, encoding='utf-8')
    tmp.replace(path)


# =============================================================================
# V2 PLAN GENERATION
# =============================================================================

def generate_v2_plan(prototype_id: str, output_dir: Path = None) -> dict:
    """
    Generate a V2 plan from synthesis results.

    Args:
        prototype_id: Prototype ID
        output_dir: Where to save

    Returns:
        dict with plan data and file path
    """
    out = output_dir or PROTOTYPES_DIR
    plan_id = _gen_id("v2")
    now = datetime.now(timezone.utc).isoformat()

    # Load synthesis
    synthesis_files = list(out.glob(f"synthesis_*_*.json"))
    if not synthesis_files:
        raise FileNotFoundError(f"No synthesis found for prototype: {prototype_id}")

    # Find synthesis matching prototype_id
    synthesis = None
    for sf in synthesis_files:
        try:
            data = json.loads(sf.read_text(encoding='utf-8'))
            if data.get("prototype_id") == prototype_id:
                synthesis = data
                break
        except (json.JSONDecodeError, OSError):
            continue

    if not synthesis:
        raise FileNotFoundError(f"No synthesis found matching prototype: {prototype_id}")

    scores = synthesis.get("scores", {})
    strengths = synthesis.get("strengths", [])
    weaknesses = synthesis.get("weaknesses", [])
    lessons = synthesis.get("lessons_learned", [])
    themes = synthesis.get("themes", {})
    theme_details = synthesis.get("theme_details", {})

    # ── Generate prioritized fixes ──
    must_have = []
    should_have = []
    nice_to_have = []

    # Must-have: fix low scores
    task_rate = scores.get("task_completion_rate", 0)
    if task_rate < 80:
        must_have.append({
            "item": "Improve task completion flow",
            "reason": f"Task completion rate is {task_rate}% (target: 80%+)",
            "effort": "medium",
            "impact": "high",
        })

    avg_nps = scores.get("avg_nps", 0)
    if avg_nps < 7:
        must_have.append({
            "item": "Increase overall user satisfaction",
            "reason": f"NPS is {avg_nps}/10 (target: 7+)",
            "effort": "high",
            "impact": "high",
        })

    avg_design = scores.get("avg_design_rating", 0)
    if avg_design < 7:
        must_have.append({
            "item": "Polish visual design and layout",
            "reason": f"Design rating is {avg_design}/10 (target: 7+)",
            "effort": "medium",
            "impact": "medium",
        })

    # Add usability fixes from themes
    usability_items = theme_details.get("usability", [])
    if usability_items:
        must_have.append({
            "item": "Fix reported usability issues",
            "reason": f"{len(usability_items)} usability issues reported",
            "detail": [u["text"][:80] for u in usability_items[:3]],
            "effort": "medium",
            "impact": "high",
        })

    # Should-have: design improvements
    design_items = theme_details.get("design", [])
    if design_items:
        should_have.append({
            "item": "Address design feedback",
            "reason": f"{len(design_items)} design-related comments",
            "detail": [d["text"][:80] for d in design_items[:3]],
            "effort": "low",
            "impact": "medium",
        })

    content_items = theme_details.get("content", [])
    if content_items:
        should_have.append({
            "item": "Review and improve copy/labels",
            "reason": f"{len(content_items)} content-related comments",
            "effort": "low",
            "impact": "medium",
        })

    # Nice-to-have: feature requests
    feature_items = theme_details.get("features", [])
    for fi in feature_items[:5]:
        nice_to_have.append({
            "item": fi["text"][:100],
            "source": "User feedback",
            "effort": "varies",
            "impact": "varies",
        })

    # Ensure minimum items
    if not must_have:
        must_have.append({
            "item": "Continue testing with more users",
            "reason": "More data needed for confident decisions",
            "effort": "low",
            "impact": "high",
        })

    # ── Build the plan ──
    plan = {
        "id": plan_id,
        "created_at": now,
        "prototype_id": prototype_id,
        "synthesis_id": synthesis.get("id", ""),
        "current_scores": scores,
        "priorities": {
            "must_have": must_have,
            "should_have": should_have,
            "nice_to_have": nice_to_have,
        },
        "design_improvements": _suggest_design_improvements(scores, design_items),
        "next_steps": _suggest_next_steps(scores, lessons),
    }

    # Save JSON
    json_path = out / f"v2_plan_{plan_id}.json"
    tmp = json_path.with_suffix('.tmp')
    tmp.write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(json_path)

    # Save Markdown
    md = _build_v2_plan_md(plan, synthesis)
    md_path = out / f"v2_plan_{plan_id}.md"
    _safe_write(md, md_path)

    plan["v2_plan_file"] = str(md_path)
    plan["v2_plan_json"] = str(json_path)

    logger.info(f"V2 plan generated: {plan_id}")
    logger.info(f"  Must-have: {len(must_have)} | Should-have: {len(should_have)} | Nice-to-have: {len(nice_to_have)}")

    return plan


def _suggest_design_improvements(scores: dict, design_feedback: list) -> list:
    """Suggest design improvements based on scores and feedback."""
    improvements = []
    avg_design = scores.get("avg_design_rating", 0)

    if avg_design < 5:
        improvements.append("Major visual overhaul needed — consider new color palette and layout")
    if avg_design < 7:
        improvements.append("Improve visual hierarchy — make primary actions more prominent")
        improvements.append("Review spacing and alignment for consistency")

    for item in design_feedback[:3]:
        improvements.append(f"Address feedback: '{item['text'][:80]}'")

    if not improvements:
        improvements.append("Design is performing well — focus on iterative polish")

    return improvements


def _suggest_next_steps(scores: dict, lessons: list) -> list:
    """Suggest concrete next steps."""
    steps = []
    task_rate = scores.get("task_completion_rate", 0)

    if task_rate < 60:
        steps.append("CRITICAL: Redesign core flow — too many users can't complete the task")
    elif task_rate < 80:
        steps.append("Simplify the core action — remove unnecessary steps")

    if scores.get("avg_nps", 0) < 5:
        steps.append("Revisit value proposition — users don't see enough value")

    steps.append("Implement must-have fixes from this plan")
    steps.append("Build V2 prototype and run another usability test")
    steps.append("Compare V2 scores against V1 baseline")

    return steps


def _build_v2_plan_md(plan: dict, synthesis: dict) -> str:
    """Build markdown V2 plan."""
    priorities = plan.get("priorities", {})
    must_have = priorities.get("must_have", [])
    should_have = priorities.get("should_have", [])
    nice_to_have = priorities.get("nice_to_have", [])
    scores = plan.get("current_scores", {})
    design_imp = plan.get("design_improvements", [])
    next_steps = plan.get("next_steps", [])

    md = f"""# V2 Plan — Prototype {plan.get('prototype_id', 'N/A')}

**Plan ID:** {plan.get('id', 'N/A')}
**Generated:** {plan.get('created_at', 'N/A')}
**Based on:** {plan.get('synthesis_id', 'N/A')}

---

## Current V1 Scores

| Metric | Score | Target | Status |
|--------|-------|--------|--------|
| Design Rating | {scores.get('avg_design_rating', 'N/A')}/10 | 7+ | {'PASS' if scores.get('avg_design_rating', 0) >= 7 else 'FAIL'} |
| NPS | {scores.get('avg_nps', 'N/A')}/10 | 7+ | {'PASS' if scores.get('avg_nps', 0) >= 7 else 'FAIL'} |
| Task Completion | {scores.get('task_completion_rate', 'N/A')}% | 80%+ | {'PASS' if scores.get('task_completion_rate', 0) >= 80 else 'FAIL'} |

---

## Priority: Must-Have (Blocks Launch)

"""
    for i, item in enumerate(must_have, 1):
        md += f"{i}. **{item['item']}**\n"
        md += f"   - Reason: {item['reason']}\n"
        md += f"   - Effort: {item.get('effort', 'TBD')} | Impact: {item.get('impact', 'TBD')}\n"
        if 'detail' in item:
            for d in item['detail']:
                md += f"   - > {d}\n"
        md += "\n"

    md += "---\n\n## Priority: Should-Have (Improves Experience)\n\n"
    for i, item in enumerate(should_have, 1):
        md += f"{i}. **{item['item']}**\n"
        md += f"   - Reason: {item['reason']}\n"
        md += f"   - Effort: {item.get('effort', 'TBD')} | Impact: {item.get('impact', 'TBD')}\n"
        if 'detail' in item:
            for d in item['detail']:
                md += f"   - > {d}\n"
        md += "\n"

    md += "---\n\n## Priority: Nice-to-Have (Future Ideas)\n\n"
    for i, item in enumerate(nice_to_have, 1):
        md += f"{i}. {item['item']}\n"
        if 'source' in item:
            md += f"   - Source: {item['source']}\n"

    md += "\n---\n\n## Design Improvements\n\n"
    for imp in design_imp:
        md += f"- {imp}\n"

    md += "\n---\n\n## Next Steps\n\n"
    for i, step in enumerate(next_steps, 1):
        md += f"{i}. {step}\n"

    md += f"\n---\n\n*Generated by Prototype Studio V2 Planner*\n"
    return md


# =============================================================================
# CLI
# =============================================================================

def main():
    _fix_encoding()
    parser = argparse.ArgumentParser(description="V2 Plan Generator")
    parser.add_argument("--prototype-id", required=True, help="Prototype ID")
    parser.add_argument("--output-dir", type=Path, default=None)
    parser.add_argument("--test", action="store_true", help="Run self-test")
    parser.add_argument("--verbose", "-v", action="store_true")

    args = parser.parse_args()
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    if args.test:
        # Create synthetic synthesis for testing
        from feedback_synthesizer import _safe_json_write
        synth_data = {
            "id": "synth_test_001",
            "prototype_id": "test_v2_001",
            "total_responses": 5,
            "scores": {
                "avg_design_rating": 6.5,
                "avg_nps": 7.2,
                "task_completion_rate": 75.0,
                "nps_value": 40.0,
            },
            "nps_breakdown": {"promoters": 3, "passives": 1, "detractors": 1},
            "themes": {"usability": 3, "design": 2, "content": 1, "features": 4, "general": 2},
            "theme_details": {
                "usability": [{"text": "Hard to find the main button", "test_id": "r1", "question": "q6"}],
                "design": [{"text": "Colors look a bit off", "test_id": "r2", "question": "q6"}],
                "features": [{"text": "Add dark mode please", "test_id": "r3", "question": "q7"}],
            },
            "strengths": [
                {"item": "Task completion decent", "score": 75, "detail": "75% completed"},
                {"item": "Good NPS", "score": 7.2, "detail": "NPS 7.2/10"},
                {"item": "Feature engagement high", "score": 4, "detail": "4 feature suggestions"},
            ],
            "weaknesses": [
                {"item": "Task completion below target", "score": 75, "detail": "75% vs 80% target"},
                {"item": "Design needs polish", "score": 6.5, "detail": "6.5/10"},
                {"item": "Usability issues reported", "score": 3, "detail": "3 usability items"},
            ],
            "lessons_learned": [
                "Task completion is below 80% — simplify the core action flow.",
                "Design satisfaction is below 7 — revisit visual hierarchy.",
            ],
        }
        synth_path = PROTOTYPES_DIR / "synthesis_synth_test_001.json"
        _safe_json_write(synth_data, synth_path)

        result = generate_v2_plan("test_v2_001", output_dir=PROTOTYPES_DIR)

        assert "priorities" in result, "Missing priorities"
        assert len(result["priorities"]["must_have"]) > 0, "No must-have items"
        assert Path(result["v2_plan_file"]).exists(), "MD file not found"

        # Cleanup
        Path(result["v2_plan_file"]).unlink(missing_ok=True)
        Path(result["v2_plan_json"]).unlink(missing_ok=True)
        synth_path.unlink(missing_ok=True)

        print(f"\n[TEST PASS] V2 planner works correctly")
        print(f"  Must-have: {len(result['priorities']['must_have'])}")
        print(f"  Should-have: {len(result['priorities']['should_have'])}")
        print(f"  Nice-to-have: {len(result['priorities']['nice_to_have'])}")
        return

    result = generate_v2_plan(args.prototype_id, output_dir=args.output_dir)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
