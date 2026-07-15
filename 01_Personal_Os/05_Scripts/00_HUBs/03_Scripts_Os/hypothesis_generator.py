#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
hypothesis_generator.py — Hypothesis Generation Engine
======================================================
Takes a raw idea and generates a structured hypothesis with:
- Problem statement
- Target user persona
- Success metrics
- Assumptions to validate
- Acceptance criteria

CLI:
    python hypothesis_generator.py --idea "daily playlist for Spotify"
    python hypothesis_generator.py --idea "daily playlist" --brand spotify --style minimalist
    python hypothesis_generator.py --test

Output: hypothesis_{id}.json in .cache/prototypes/
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

# ─────────────────────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────────────────────
sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

PROTOTYPES_DIR = CACHE_DIR / "prototypes"


# =============================================================================
# ID GENERATION
# =============================================================================

def _gen_id(prefix: str = "hyp") -> str:
    """Generate nanoid-style ID: {prefix}_{date}_{random8}."""
    import random
    import string
    date_str = datetime.now().strftime("%Y%m%d")
    rand = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"{prefix}_{date_str}_{rand}"


def _safe_json_write(data: dict, path: Path) -> None:
    """Atomic JSON write."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix('.tmp')
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(path)


# =============================================================================
# HYPOTHESIS GENERATION
# =============================================================================

def generate_hypothesis(idea: str, brand: str = "generic", style: str = "minimalist",
                        output_dir: Path = None) -> dict:
    """
    Generate a structured hypothesis from a raw idea.

    Args:
        idea: Raw idea description
        brand: Brand design system to use
        style: Visual style preference
        output_dir: Where to save the hypothesis JSON

    Returns:
        dict with hypothesis data and ID
    """
    out = output_dir or PROTOTYPES_DIR
    hypothesis_id = _gen_id("hyp")
    now = datetime.now(timezone.utc).isoformat()

    # Build hypothesis structure
    hypothesis = {
        "id": hypothesis_id,
        "created_at": now,
        "idea": idea,
        "brand": brand,
        "style": style,
        "problem_statement": _generate_problem_statement(idea),
        "target_user": _generate_target_user(idea),
        "success_metrics": _generate_success_metrics(idea),
        "assumptions": _generate_assumptions(idea),
        "acceptance_criteria": _generate_acceptance_criteria(idea),
        "hypothesis_statement": _generate_hypothesis_statement(idea),
    }

    # Save
    filepath = out / f"hypothesis_{hypothesis_id}.json"
    _safe_json_write(hypothesis, filepath)
    hypothesis["hypothesis_file"] = str(filepath)

    logger.info(f"Hypothesis generated: {hypothesis_id}")
    logger.info(f"  Problem: {hypothesis['problem_statement']}")
    logger.info(f"  User: {hypothesis['target_user']['persona']}")
    logger.info(f"  Saved: {filepath}")

    return hypothesis


def _generate_problem_statement(idea: str) -> str:
    """Generate a problem statement from the idea."""
    # Structured decomposition of the idea into a problem statement
    idea_lower = idea.lower().strip()

    # Pattern match common idea types
    if any(w in idea_lower for w in ["spotify", "music", "playlist", "song"]):
        return f"Users need a better way to {idea_lower} because current solutions are fragmented and don't adapt to their preferences."
    elif any(w in idea_lower for w in ["dashboard", "analytics", "data", "metrics"]):
        return f"Users lack clear visibility into {idea_lower} — data exists but isn't actionable."
    elif any(w in idea_lower for w in ["app", "mobile", "notification"]):
        return f"Users want to {idea_lower} on-the-go but现有 tools are desktop-only or too complex."
    elif any(w in idea_lower for w in ["automation", "auto", "workflow", "pipeline"]):
        return f"Users spend too much time on repetitive tasks related to {idea_lower} that could be automated."
    else:
        return f"Users need a better solution for {idea_lower} — current approaches are either too complex, too simple, or miss the mark."


def _generate_target_user(idea: str) -> dict:
    """Generate target user persona."""
    idea_lower = idea.lower().strip()

    if any(w in idea_lower for w in ["spotify", "music", "playlist"]):
        return {
            "persona": "Music Enthusiast (18-35)",
            "demographics": "Young professional, tech-savvy, streams daily",
            "pain_points": [
                "Too many playlists to manage manually",
                "Discovery feels repetitive",
                "Mood-based listening isn't automated"
            ],
            "goals": [
                "Fresh music without effort",
                "Playlists that match mood and activity",
                "Share music with friends"
            ]
        }
    elif any(w in idea_lower for w in ["dashboard", "analytics", "metrics"]):
        return {
            "persona": "Data-Driven Professional (25-45)",
            "demographics": "Manager or analyst, uses multiple tools daily",
            "pain_points": [
                "Data scattered across multiple dashboards",
                "Hard to spot trends quickly",
                "Reports take too long to generate"
            ],
            "goals": [
                "One view of all key metrics",
                "Instant trend detection",
                "Shareable reports in one click"
            ]
        }
    else:
        return {
            "persona": "Early Adopter (22-40)",
            "demographics": "Tech-comfortable, values efficiency",
            "pain_points": [
                "Current solutions are too complex",
                "No single tool does it well",
                "Time wasted switching between tools"
            ],
            "goals": [
                "Simple, focused solution",
                "Get results fast",
                "Works on any device"
            ]
        }


def _generate_success_metrics(idea: str) -> list:
    """Generate success metrics for the hypothesis."""
    return [
        {
            "metric": "Task Completion Rate",
            "target": "80%+",
            "measurement": "Usability test — can user complete core action?",
            "priority": "must_have"
        },
        {
            "metric": "Time to Complete",
            "target": "< 30 seconds",
            "measurement": "Usability test — time from start to core action",
            "priority": "must_have"
        },
        {
            "metric": "User Satisfaction (NPS)",
            "target": "7+ / 10",
            "measurement": "Post-test satisfaction survey",
            "priority": "should_have"
        },
        {
            "metric": "Clarity Score",
            "target": "85%+",
            "measurement": "Can user describe the purpose without help?",
            "priority": "should_have"
        },
        {
            "metric": "Return Intent",
            "target": "70%+",
            "measurement": "Would user use this again?",
            "priority": "nice_to_have"
        }
    ]


def _generate_assumptions(idea: str) -> list:
    """Generate assumptions that need validation."""
    return [
        {
            "assumption": f"Users actually want/need: {idea}",
            "risk": "high",
            "validation_method": "Task-based usability test + satisfaction score",
            "status": "unvalidated"
        },
        {
            "assumption": "The core action can be completed in under 30 seconds",
            "risk": "medium",
            "validation_method": "Timed task in usability test",
            "status": "unvalidated"
        },
        {
            "assumption": "Users understand the interface without explanation",
            "risk": "medium",
            "validation_method": "Clarity test — can they describe it?",
            "status": "unvalidated"
        },
        {
            "assumption": "The visual design builds trust",
            "risk": "low",
            "validation_method": "NPS-style satisfaction rating",
            "status": "unvalidated"
        }
    ]


def _generate_acceptance_criteria(idea: str) -> list:
    """Generate pass/fail acceptance criteria."""
    return [
        {
            "criterion": "User can identify the main action within 5 seconds",
            "measurement": "Observation in usability test",
            "pass_threshold": "4 out of 5 users"
        },
        {
            "criterion": "User can complete the core action without help",
            "measurement": "Task completion in usability test",
            "pass_threshold": "80% completion rate"
        },
        {
            "criterion": "User rates satisfaction 7+ out of 10",
            "measurement": "Post-test survey",
            "pass_threshold": "Average 7+"
        },
        {
            "criterion": "User would recommend or use again",
            "measurement": "Return intent question",
            "pass_threshold": "70% yes"
        }
    ]


def _generate_hypothesis_statement(idea: str) -> str:
    """Generate a formal hypothesis statement."""
    return (
        f"We believe that by building {idea}, "
        f"our target users will achieve their goal faster and with higher satisfaction "
        f"than existing solutions. We will know this is true when "
        f"80%+ complete the core task, rate satisfaction 7+/10, "
        f"and 70%+ express intent to use again."
    )


def load_hypothesis(hypothesis_id: str, directory: Path = None) -> dict:
    """Load a hypothesis by ID."""
    d = directory or PROTOTYPES_DIR
    filepath = d / f"hypothesis_{hypothesis_id}.json"
    if not filepath.exists():
        # Try glob for partial match
        matches = list(d.glob(f"hypothesis_{hypothesis_id}*.json"))
        if matches:
            filepath = matches[0]
        else:
            raise FileNotFoundError(f"Hypothesis not found: {hypothesis_id}")
    return json.loads(filepath.read_text(encoding='utf-8'))


# =============================================================================
# CLI
# =============================================================================

def main():
    _fix_encoding()
    parser = argparse.ArgumentParser(description="Hypothesis Generator")
    parser.add_argument("--idea", required=True, help="Raw idea to generate hypothesis for")
    parser.add_argument("--brand", default="generic", help="Brand design system")
    parser.add_argument("--style", default="minimalist", help="Visual style")
    parser.add_argument("--output-dir", type=Path, default=None, help="Output directory")
    parser.add_argument("--test", action="store_true", help="Run self-test")
    parser.add_argument("--verbose", "-v", action="store_true")

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    if args.test:
        result = generate_hypothesis("test feature for demo")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        # Verify file exists
        f = PROTOTYPES_DIR / f"hypothesis_{result['id']}.json"
        assert f.exists(), f"File not found: {f}"
        print(f"\n[TEST PASS] Hypothesis file created: {f}")
        return

    result = generate_hypothesis(args.idea, brand=args.brand, style=args.style,
                                  output_dir=args.output_dir)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
