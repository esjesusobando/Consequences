"""
semantic_router.py — Pattern-matching task router

Maps task descriptions to preferred model families via regex rules.
Default rules:
  code|programming|implement|function  ->  openai (gpt-5.1)
  reasoning|math|logic|explain        ->  claude (claude-opus-4.8)
  vision|image|ocr|visual             ->  gemini (gemini-3-ultra)
  creative|write|draft|generate       ->  claude (claude-sonnet-4.8)

Usage:
    from semantic_router import SemanticRouter
    sr = SemanticRouter()
    result = sr.route("Write a Python sort function")
"""

import re
from pathlib import Path
from typing import Optional


# Default routing rules: (pattern, family, model, min_quality)
_DEFAULT_RULES: list[dict] = [
    {
        "pattern": r"code|programming|implement|function|algorithm|script|debug|refactor|test",
        "family": "openai",
        "model": "gpt-5.1",
        "min_quality": 80.0,
        "description": "Code/engineering tasks -> openai"
    },
    {
        "pattern": r"reasoning|math|logic|explain|analyze|evaluate|compare|synthesize",
        "family": "claude",
        "model": "claude-opus-4.8",
        "min_quality": 90.0,
        "description": "Reasoning/analysis tasks -> claude opus"
    },
    {
        "pattern": r"vision|image|ocr|visual|diagram|chart|photo|picture|detect|recognize",
        "family": "gemini",
        "model": "gemini-3-ultra",
        "min_quality": 85.0,
        "description": "Vision/image tasks -> gemini ultra"
    },
    {
        "pattern": r"creative|write|draft|generate|compose|story|poem|script|content",
        "family": "claude",
        "model": "claude-sonnet-4.8",
        "min_quality": 75.0,
        "description": "Creative/writing tasks -> claude sonnet"
    },
]

_FALLBACK_MODEL = "claude-sonnet-4.8"
_FALLBACK_FAMILY = "claude"
_FALLBACK_CONFIDENCE = 0.4
_DEFAULT_CONFIDENCE = 0.85


def _compute_confidence(task: str, pattern: str) -> float:
    """Compute routing confidence based on keyword match strength.

    Regex patterns use | (OR) — matching any keyword is meaningful.
    0.85 = one keyword match (default)
    0.90 = multiple keywords from the same pattern matched
    0.95 = strong semantic coverage (many task tokens matched)
    """
    task_lower = task.lower()
    tokens = set(re.findall(r"[a-z]+", task_lower))
    pattern_keywords = set(re.findall(r"[a-z]+", pattern.lower()))
    if not pattern_keywords:
        return _DEFAULT_CONFIDENCE
    overlap = len(tokens & pattern_keywords)
    if overlap >= 3:
        return 0.95
    elif overlap >= 2:
        return 0.90
    else:
        return _DEFAULT_CONFIDENCE  # 0.85


class SemanticRouter:
    """Pattern-matching router that maps task descriptions to model families.

    Uses regex rules to match task intent and returns the best model + confidence.
    Supports adding custom rules at runtime.

    Args:
        policy_file: Optional path to load custom rules from JSON.
        simulation: If True, use default hardcoded rules. If False,
                    attempt to load from policy_file.
    """

    def __init__(self, policy_file: Optional[Path] = None, simulation: bool = True):
        self._rules: list[dict] = []
        self._family_model_map: dict[str, str] = {
            "openai": "gpt-5.1",
            "claude": "claude-opus-4.8",
            "gemini": "gemini-3-ultra",
        }

        if not simulation and policy_file and policy_file.exists():
            import json
            with open(policy_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            for rule in data.get("semantic_rules", []):
                model = rule.get("model", self._family_model_map.get(rule["preferred_family"], _FALLBACK_MODEL))
                self._rules.append({
                    "pattern": rule["task_pattern"],
                    "family": rule["preferred_family"],
                    "model": model,
                    "min_quality": rule.get("min_quality", 80.0),
                })
        else:
            self._rules = [dict(r) for r in _DEFAULT_RULES]

    def route(self, task: str) -> dict:
        """Find the best model for a task description.

        Iterates rules in order, returns the first match with confidence > 0.8.
        Falls back to claude-sonnet-4.8 at confidence 0.4.

        Returns:
            dict with keys: model, family, confidence, matched_rule, description
        """
        matched_rules = self.evaluate_rules(task)
        for rule, confidence in matched_rules:
            if confidence > 0.8:
                return {
                    "model": rule["model"],
                    "family": rule["family"],
                    "confidence": round(confidence, 4),
                    "matched_rule": rule.get("description", rule["pattern"]),
                }

        # Fallback
        return {
            "model": _FALLBACK_MODEL,
            "family": _FALLBACK_FAMILY,
            "confidence": _FALLBACK_CONFIDENCE,
            "matched_rule": "fallback (no rule matched above threshold)",
        }

    def add_rule(self, pattern: str, family: str, min_quality: float) -> None:
        """Add a custom routing rule at runtime.

        Appends to the front of the rule list so new rules take priority.

        Args:
            pattern: Regex pattern to match against task descriptions.
            family: Model family key (e.g. 'openai', 'claude', 'gemini').
            min_quality: Minimum quality threshold for this routing path.
        """
        model = self._family_model_map.get(family, _FALLBACK_MODEL)
        self._rules.insert(0, {
            "pattern": pattern,
            "family": family,
            "model": model,
            "min_quality": min_quality,
            "description": f"Custom rule: {pattern} -> {family}",
        })

    def evaluate_rules(self, task: str) -> list[tuple[dict, float]]:
        """Evaluate all rules against a task and return matches with confidence scores.

        Returns:
            List of (rule_dict, confidence) tuples, sorted by confidence descending.
            Empty list if no rules match.
        """
        results: list[tuple[dict, float]] = []
        task_lower = task.lower()
        for rule in self._rules:
            pattern = rule["pattern"]
            try:
                if re.search(pattern, task_lower):
                    confidence = _compute_confidence(task, pattern)
                    results.append((rule, confidence))
            except re.error:
                continue
        # Sort by confidence descending
        results.sort(key=lambda x: x[1], reverse=True)
        return results
