#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
feedback_synthesizer.py — Feedback Synthesis Engine
===================================================
Synthesizes collected feedback into actionable insights:
- Groups by theme (usability, design, content, features)
- Calculates satisfaction scores
- Identifies top 3 strengths + top 3 weaknesses
- Generates lessons learned

CLI:
    python feedback_synthesizer.py --prototype-id "proto_xxx"
    python feedback_synthesizer.py --test

Output: synthesis_{id}.json + synthesis_{id}.md in .cache/prototypes/
"""
import sys
import os
import json
import argparse
import logging
from pathlib import Path
from datetime import datetime, timezone
from collections import Counter

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


def _gen_id(prefix: str = "synth") -> str:
    import random, string
    date_str = datetime.now().strftime("%Y%m%d")
    rand = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"{prefix}_{date_str}_{rand}"


def _safe_json_write(data: dict, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix('.tmp')
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(path)


def _safe_write(content: str, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix('.tmp')
    tmp.write_text(content, encoding='utf-8')
    tmp.replace(path)


# =============================================================================
# THEME EXTRACTION
# =============================================================================

THEME_KEYWORDS = {
    "usability": ["confus", "hard to", "difficult", "stuck", "couldn't", "unclear",
                   "find", "navigate", "click", "button", "action", "complete"],
    "design": ["design", "look", "visual", "color", "font", "layout", "pretty",
                "ugly", "clean", "beautiful", "style", "theme", "dark mode"],
    "content": ["text", "word", "label", "title", "description", "copy",
                 "read", "language", "translation", "typo"],
    "features": ["add", "want", "need", "feature", "wish", "missing",
                  "improve", "change", "suggest", "idea"],
}


def _categorize_text(text: str) -> str:
    """Categorize free text into a theme."""
    text_lower = text.lower()
    scores = {}
    for theme, keywords in THEME_KEYWORDS.items():
        scores[theme] = sum(1 for kw in keywords if kw in text_lower)

    if max(scores.values()) == 0:
        return "general"
    return max(scores, key=scores.get)


# =============================================================================
# SYNTHESIS
# =============================================================================

def synthesize_feedback(prototype_id: str, telemetry_dir: Path = None,
                        output_dir: Path = None) -> dict:
    """
    Synthesize collected feedback into insights.

    Args:
        prototype_id: Prototype ID
        telemetry_dir: Where feedback is stored
        output_dir: Where to save synthesis

    Returns:
        dict with synthesis results
    """
    td = telemetry_dir or TELEMETRY_DIR
    out = output_dir or PROTOTYPES_DIR
    synthesis_id = _gen_id("synth")
    now = datetime.now(timezone.utc).isoformat()

    # Load feedback
    feedback_file = td / f"prototype_feedback_{prototype_id}.json"
    if not feedback_file.exists():
        raise FileNotFoundError(f"No feedback found for prototype: {prototype_id}")

    feedback_data = json.loads(feedback_file.read_text(encoding='utf-8'))
    responses = feedback_data.get("responses", [])

    if not responses:
        raise ValueError(f"Feedback file exists but has no responses: {prototype_id}")

    # ── Calculate metrics ──
    design_ratings = [r["metrics"]["design_rating"]
                      for r in responses
                      if r.get("metrics", {}).get("design_rating") is not None]
    nps_scores = [r["metrics"]["nps_score"]
                  for r in responses
                  if r.get("metrics", {}).get("nps_score") is not None]
    task_completed = sum(1 for r in responses
                         if r.get("metrics", {}).get("task_completed"))

    avg_design = round(sum(design_ratings) / len(design_ratings), 1) if design_ratings else 0
    avg_nps = round(sum(nps_scores) / len(nps_scores), 1) if nps_scores else 0
    task_rate = round(task_completed / len(responses) * 100, 1) if responses else 0

    # NPS calculation
    promoters = sum(1 for s in nps_scores if s >= 9)
    detractors = sum(1 for s in nps_scores if s <= 6)
    nps_value = round((promoters - detractors) / len(nps_scores) * 100, 1) if nps_scores else 0

    # ── Theme grouping ──
    themes = {"usability": [], "design": [], "content": [], "features": [], "general": []}

    for r in responses:
        answers = r.get("answers", {})
        # q6: confusing things, q7: feature requests, q8: general
        for key in ["q6", "q7", "q8"]:
            text = answers.get(key, "")
            if text and isinstance(text, str) and len(text.strip()) > 3:
                theme = _categorize_text(text)
                themes[theme].append({
                    "text": text.strip(),
                    "test_id": r.get("test_id", "unknown"),
                    "question": key,
                })

    # ── Task completion analysis ──
    completion_responses = []
    for r in responses:
        q2 = r.get("answers", {}).get("q2", "")
        if q2:
            completion_responses.append(q2)

    completion_breakdown = dict(Counter(completion_responses))

    # ── Time analysis ──
    time_responses = []
    for r in responses:
        q3 = r.get("answers", {}).get("q3", "")
        if q3:
            time_responses.append(q3)

    time_breakdown = dict(Counter(time_responses))

    # ── Identify strengths and weaknesses ──
    strengths = []
    weaknesses = []

    if task_rate >= 80:
        strengths.append({"item": "High task completion rate", "score": task_rate, "detail": f"{task_rate}% of users completed the core task"})
    else:
        weaknesses.append({"item": "Low task completion rate", "score": task_rate, "detail": f"Only {task_rate}% completed the core task"})

    if avg_design >= 7:
        strengths.append({"item": "Strong visual design", "score": avg_design, "detail": f"Average design rating: {avg_design}/10"})
    elif avg_design > 0:
        weaknesses.append({"item": "Visual design needs work", "score": avg_design, "detail": f"Average design rating: {avg_design}/10"})

    if avg_nps >= 7:
        strengths.append({"item": "High user satisfaction", "score": avg_nps, "detail": f"Average NPS: {avg_nps}/10"})
    elif avg_nps > 0:
        weaknesses.append({"item": "Low user satisfaction", "score": avg_nps, "detail": f"Average NPS: {avg_nps}/10"})

    if nps_value >= 50:
        strengths.append({"item": "Strong NPS score", "score": nps_value, "detail": f"NPS: {nps_value}"})
    elif nps_value < 0:
        weaknesses.append({"item": "Negative NPS score", "score": nps_value, "detail": f"NPS: {nps_value}"})

    # Top feedback themes
    usability_count = len(themes["usability"])
    if usability_count > 0:
        weaknesses.append({"item": "Usability concerns raised", "score": usability_count,
                          "detail": f"{usability_count} usability-related feedback items"})

    feature_count = len(themes["features"])
    if feature_count > 2:
        strengths.append({"item": "High feature engagement", "score": feature_count,
                          "detail": f"{feature_count} feature suggestions — users are invested"})

    # Ensure we have at least 3 of each
    while len(strengths) < 3:
        strengths.append({"item": "Prototype completed testing", "score": len(responses),
                          "detail": f"Successfully gathered {len(responses)} responses"})
    while len(weaknesses) < 3:
        weaknesses.append({"item": "Insufficient data", "score": 0,
                          "detail": "More responses needed for definitive analysis"})

    strengths = strengths[:3]
    weaknesses = weaknesses[:3]

    # ── Lessons learned ──
    lessons = []
    if task_rate < 80:
        lessons.append("Task completion is below 80% — simplify the core action flow.")
    if avg_design < 7:
        lessons.append("Design satisfaction is below 7 — revisit visual hierarchy and polish.")
    if avg_nps < 7:
        lessons.append("NPS is below 7 — the value proposition may not be clear enough.")
    if usability_count > feature_count:
        lessons.append("More usability issues than feature requests — fix basics before adding features.")
    if feature_count > 3:
        lessons.append("Users are suggesting many features — the core concept resonates.")

    # ── Build synthesis ──
    synthesis = {
        "id": synthesis_id,
        "created_at": now,
        "prototype_id": prototype_id,
        "total_responses": len(responses),
        "scores": {
            "avg_design_rating": avg_design,
            "avg_nps": avg_nps,
            "task_completion_rate": task_rate,
            "nps_value": nps_value,
        },
        "nps_breakdown": {
            "promoters": promoters,
            "passives": len(nps_scores) - promoters - detractors,
            "detractors": detractors,
        },
        "themes": {k: len(v) for k, v in themes.items()},
        "theme_details": themes,
        "task_completion_breakdown": completion_breakdown,
        "time_breakdown": time_breakdown,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "lessons_learned": lessons,
    }

    # Save JSON
    json_path = out / f"synthesis_{synthesis_id}.json"
    _safe_json_write(synthesis, json_path)

    # Save Markdown report
    md = _build_synthesis_md(synthesis)
    md_path = out / f"synthesis_{synthesis_id}.md"
    _safe_write(md, md_path)

    synthesis["synthesis_file"] = str(json_path)
    synthesis["synthesis_md"] = str(md_path)

    logger.info(f"Synthesis complete: {synthesis_id}")
    logger.info(f"  Responses: {len(responses)}")
    logger.info(f"  Design: {avg_design}/10 | NPS: {avg_nps}/10 | Task: {task_rate}%")
    logger.info(f"  Strengths: {len(strengths)} | Weaknesses: {len(weaknesses)}")

    return synthesis


def _build_synthesis_md(synthesis: dict) -> str:
    """Build a markdown report from synthesis data."""
    scores = synthesis.get("scores", {})
    strengths = synthesis.get("strengths", [])
    weaknesses = synthesis.get("weaknesses", [])
    lessons = synthesis.get("lessons_learned", [])
    themes = synthesis.get("themes", {})
    nps = synthesis.get("nps_breakdown", {})

    md = f"""# Feedback Synthesis Report

**Prototype ID:** {synthesis.get('prototype_id', 'N/A')}
**Generated:** {synthesis.get('created_at', 'N/A')}
**Total Responses:** {synthesis.get('total_responses', 0)}

---

## Scores

| Metric | Score |
|--------|-------|
| Design Rating | {scores.get('avg_design_rating', 'N/A')}/10 |
| NPS Score | {scores.get('avg_nps', 'N/A')}/10 |
| Task Completion | {scores.get('task_completion_rate', 'N/A')}% |
| NPS Value | {scores.get('nps_value', 'N/A')} |

### NPS Breakdown

| Category | Count |
|----------|-------|
| Promoters (9-10) | {nps.get('promoters', 0)} |
| Passives (7-8) | {nps.get('passives', 0)} |
| Detractors (0-6) | {nps.get('detractors', 0)} |

---

## Top 3 Strengths

"""
    for i, s in enumerate(strengths, 1):
        md += f"{i}. **{s['item']}** — {s['detail']}\n"

    md += "\n---\n\n## Top 3 Weaknesses\n\n"
    for i, w in enumerate(weaknesses, 1):
        md += f"{i}. **{w['item']}** — {w['detail']}\n"

    md += "\n---\n\n## Feedback Themes\n\n"
    for theme, count in sorted(themes.items(), key=lambda x: -x[1]):
        md += f"- **{theme.title()}**: {count} items\n"

    md += "\n---\n\n## Lessons Learned\n\n"
    for lesson in lessons:
        md += f"- {lesson}\n"

    md += f"\n---\n\n*Generated by Prototype Studio Feedback Synthesizer*\n"
    return md


# =============================================================================
# CLI
# =============================================================================

def main():
    _fix_encoding()
    parser = argparse.ArgumentParser(description="Feedback Synthesizer")
    parser.add_argument("--prototype-id", required=True, help="Prototype ID")
    parser.add_argument("--output-dir", type=Path, default=None)
    parser.add_argument("--test", action="store_true", help="Run self-test")
    parser.add_argument("--verbose", "-v", action="store_true")

    args = parser.parse_args()
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    if args.test:
        # Create synthetic feedback data for testing
        from feedback_collector import _safe_json_write, _feedback_file
        test_data = {
            "prototype_id": "test_synth_001",
            "responses": [
                {
                    "test_id": f"resp_{i}",
                    "prototype_id": "test_synth_001",
                    "answers": {
                        "q1": "It's a feature for doing things better",
                        "q2": ["Yes, completed successfully", "Partially — got stuck but figured it out",
                                "Yes, completed successfully", "Yes, completed successfully",
                                "Partially — got stuck and gave up"][i],
                        "q3": ["Less than 5 seconds", "5-15 seconds", "Less than 5 seconds",
                                "15-30 seconds", "More than 30 seconds"][i],
                        "q4": str([8, 9, 7, 8, 6][i]),
                        "q5": str([9, 8, 7, 9, 5][i]),
                        "q6": ["", "Hard to find button", "", "Confusing layout", ""][i],
                        "q7": ["Add dark mode", "", "More options", "Better colors", ""][i],
                        "q8": ["Good start!", "", "Needs polish", "", "Nice concept"][i],
                    },
                    "completed_at": datetime.now(timezone.utc).isoformat(),
                    "metrics": {
                        "design_rating": [8, 9, 7, 8, 6][i],
                        "nps_score": [9, 8, 7, 9, 5][i],
                        "task_completed": i != 4,
                    }
                }
                for i in range(5)
            ],
            "metadata": {"total_responses": 5, "status": "sufficient"},
        }

        td = TELEMETRY_DIR
        td.mkdir(parents=True, exist_ok=True)
        _safe_json_write(test_data, _feedback_file("test_synth_001", td))

        result = synthesize_feedback("test_synth_001", telemetry_dir=td, output_dir=PROTOTYPES_DIR)

        assert "scores" in result, "Missing scores"
        assert "strengths" in result, "Missing strengths"
        assert "weaknesses" in result, "Missing weaknesses"
        assert len(result["strengths"]) >= 3, "Need at least 3 strengths"
        assert len(result["weaknesses"]) >= 3, "Need at least 3 weaknesses"

        # Verify files
        assert Path(result["synthesis_file"]).exists(), "JSON file not found"
        assert Path(result["synthesis_md"]).exists(), "MD file not found"

        # Cleanup
        _feedback_file("test_synth_001", td).unlink(missing_ok=True)
        Path(result["synthesis_file"]).unlink(missing_ok=True)
        Path(result["synthesis_md"]).unlink(missing_ok=True)

        print(f"\n[TEST PASS] Feedback synthesizer works correctly")
        print(f"  Design: {result['scores']['avg_design_rating']}/10")
        print(f"  NPS: {result['scores']['avg_nps']}/10")
        print(f"  Task completion: {result['scores']['task_completion_rate']}%")
        return

    result = synthesize_feedback(args.prototype_id, output_dir=args.output_dir)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
