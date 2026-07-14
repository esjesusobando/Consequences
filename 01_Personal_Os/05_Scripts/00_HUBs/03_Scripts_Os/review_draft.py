#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
review_draft.py - Quality Gates Pipeline for Content Drafts
===========================================================
Runs 4 quality gates on content drafts:
  Gate 1: Readability (sentence/paragraph length)
  Gate 2: Tone (corporate jargon, passive voice)
  Gate 3: Structure (title, CTA, word count)
  Gate 4: Keywords (topic in first 100 words)

Usage:
    from review_draft import review_draft
    result = review_draft(draft_path, topic="AI trends")

Ubication: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
"""
import sys
import os
import json
import argparse
import re
import logging
from pathlib import Path
from datetime import datetime, timezone

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

def _fix_encoding():
    """Fix Windows console encoding (call only in __main__)."""
    if sys.platform == "win32":
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

# =============================================================================
# PATHS
# =============================================================================

DRAFTS_DIR = ROOT_DIR / "01_Personal_Os" / "06_Projects" / "01_Content" / "Drafts"
STATE_FILE = TELEMETRY_DIR / "content_pipeline_state.json"

# =============================================================================
# QUALITY GATE CONSTANTS
# =============================================================================

MAX_SENTENCE_LENGTH = 30  # words
MAX_PARAGRAPH_LENGTH = 5  # sentences
MIN_WORD_COUNT = 100
MAX_WORD_COUNT = 2000
KEYWORD_WINDOW = 100  # words from start

# Corporate jargon patterns to flag
JARGON_PATTERNS = [
    r'\bleverage\b', r'\bsynerg\b', r'\bparadigm\b', r'\bdisrupt\b',
    r'\bscalab', r'\bunprecedented\b', r'\brobust\b', r'\bseamless\b',
    r'\bestos\b', r'\bharness\b', r'\bempower\b', r'\bholistic\b',
    r'\bgame[\s-]?chang', r'\bvalue[\s-]?add', r'\bbest[\s-]?in[\s-]?class',
    r'\bmission[\s-]?critical', r'\bthought[\s-]?leader',
]

# Passive voice indicators
PASSIVE_PATTERNS = [
    r'\b(?:is|are|was|were|be|been|being)\s+(?:\w+ed|built|done|made|set|seen|found|given|taken|known|shown)\b',
    r'\bwas\s+\w+ed\s+by\b',
    r'\bwere\s+\w+ed\s+by\b',
]

# CTA indicators
CTA_PATTERNS = [
    r'\bwhat.{0,20}(?:your|do you)\b', r'\bdrop\s+your\b',
    r'\bshare\s+(?:your|in)\b', r'\blet\s+me\s+know\b',
    r'\bcomment\s+below\b', r'\bjoin\s+the\b', r'\btry\s+this\b',
    r'\bstart\s+(?:today|now|here)\b', r'\bcheck\s+out\b',
    r'\bclick\b', r'\bsign\s+up\b', r'\bdownload\b',
    r'\bleave\s+a\s+comment\b', r'\bwhat\s+do\s+you\s+think\b',
]


# =============================================================================
# GATE FUNCTIONS
# =============================================================================

def _split_sentences(text: str) -> list:
    """Split text into sentences."""
    sentences = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in sentences if s.strip() and len(s.strip()) > 5]


def _split_paragraphs(text: str) -> list:
    """Split text into paragraphs."""
    paragraphs = re.split(r'\n\s*\n', text)
    return [p.strip() for p in paragraphs if p.strip()]


def _count_words(text: str) -> int:
    """Count words in text."""
    return len(re.findall(r'\b\w+\b', text))


def gate_readability(text: str) -> dict:
    """Gate 1: Readability - sentence and paragraph length checks."""
    sentences = _split_sentences(text)
    paragraphs = _split_paragraphs(text)

    issues = []
    long_sentences = []
    for i, sent in enumerate(sentences):
        word_count = len(re.findall(r'\b\w+\b', sent))
        if word_count > MAX_SENTENCE_LENGTH:
            long_sentences.append({"index": i, "words": word_count, "text": sent[:80]})
            issues.append(f"Sentence {i+1} exceeds {MAX_SENTENCE_LENGTH} words ({word_count})")

    long_paragraphs = []
    for i, para in enumerate(paragraphs):
        sent_count = len(_split_sentences(para))
        if sent_count > MAX_PARAGRAPH_LENGTH:
            long_paragraphs.append({"index": i, "sentences": sent_count})
            issues.append(f"Paragraph {i+1} exceeds {MAX_PARAGRAPH_LENGTH} sentences ({sent_count})")

    passed = len(issues) == 0
    return {
        "gate": "readability",
        "passed": passed,
        "issues": issues,
        "details": {
            "total_sentences": len(sentences),
            "total_paragraphs": len(paragraphs),
            "long_sentences": long_sentences,
            "long_paragraphs": long_paragraphs,
        },
        "suggestion": "Break long sentences into shorter ones. Keep paragraphs to 3-4 sentences max." if not passed else None,
    }


def gate_tone(text: str) -> dict:
    """Gate 2: Tone - detect corporate jargon and passive voice."""
    issues = []
    lower_text = text.lower()

    found_jargon = []
    for pattern in JARGON_PATTERNS:
        matches = re.findall(pattern, lower_text)
        if matches:
            found_jargon.extend(matches)
            issues.append(f"Corporate jargon detected: '{matches[0]}'")

    found_passive = []
    for pattern in PASSIVE_PATTERNS:
        matches = re.findall(pattern, lower_text)
        if matches:
            found_passive.extend(matches)
            if len(found_passive) <= 3:  # Only report first few
                issues.append(f"Passive voice detected: '{matches[0]}'")

    passed = len(found_jargon) == 0 and len(found_passive) <= 2
    return {
        "gate": "tone",
        "passed": passed,
        "issues": issues,
        "details": {
            "jargon_found": found_jargon,
            "passive_count": len(found_passive),
        },
        "suggestion": "Replace jargon with plain language. Convert passive voice to active voice." if not passed else None,
    }


def gate_structure(text: str) -> dict:
    """Gate 3: Structure - check title, CTA, word count."""
    issues = []
    word_count = _count_words(text)

    # Check for title (line starting with # or first non-empty line)
    lines = text.strip().split("\n")
    has_title = False
    for line in lines[:5]:
        stripped = line.strip()
        if stripped.startswith("#") or (len(stripped) > 10 and stripped[0].isupper()):
            has_title = True
            break
    if not has_title:
        issues.append("No title detected (expected Markdown heading or capitalized first line)")

    # Check for CTA
    lower_text = text.lower()
    has_cta = any(re.search(p, lower_text) for p in CTA_PATTERNS)
    if not has_cta:
        issues.append("No call-to-action detected")

    # Check word count
    if word_count < MIN_WORD_COUNT:
        issues.append(f"Too short: {word_count} words (minimum {MIN_WORD_COUNT})")
    elif word_count > MAX_WORD_COUNT:
        issues.append(f"Too long: {word_count} words (maximum {MAX_WORD_COUNT})")

    passed = len(issues) == 0
    return {
        "gate": "structure",
        "passed": passed,
        "issues": issues,
        "details": {
            "has_title": has_title,
            "has_cta": has_cta,
            "word_count": word_count,
        },
        "suggestion": "Add a clear title and call-to-action. Aim for 200-1500 words." if not passed else None,
    }


def gate_keywords(text: str, topic: str) -> dict:
    """Gate 4: Keywords - topic keywords appear in first 100 words."""
    words = re.findall(r'\b\w+\b', text)
    first_n = " ".join(words[:KEYWORD_WINDOW]).lower()

    # Extract keywords from topic
    topic_words = [w.lower() for w in re.findall(r'\b\w+\b', topic) if len(w) > 2]

    found = []
    missing = []
    for kw in topic_words:
        if kw in first_n:
            found.append(kw)
        else:
            missing.append(kw)

    passed = len(missing) == 0 or len(found) > 0
    issues = []
    if not found:
        issues.append(f"No topic keywords found in first {KEYWORD_WINDOW} words: {topic_words}")
    elif missing:
        issues.append(f"Missing keywords in opening: {missing}")

    return {
        "gate": "keywords",
        "passed": passed,
        "issues": issues,
        "details": {
            "topic_keywords": topic_words,
            "found_in_opening": found,
            "missing_from_opening": missing,
            "window_words": KEYWORD_WINDOW,
        },
        "suggestion": f"Include topic keywords '{', '.join(topic_words)}' in the first {KEYWORD_WINDOW} words." if not passed else None,
    }


# =============================================================================
# MAIN REVIEW FUNCTION
# =============================================================================

def review_draft(draft_path: str, topic: str = None) -> dict:
    """
    Run all quality gates on a draft.

    Args:
        draft_path: Path to the draft .md file
        topic: Topic for keyword gate (extracted from frontmatter if not provided)

    Returns:
        dict with gate results, overall pass/fail, and suggestions
    """
    path = Path(draft_path)
    if not path.exists():
        raise FileNotFoundError(f"Draft not found: {draft_path}")

    raw = path.read_text(encoding='utf-8')

    # Extract frontmatter topic if not provided
    if topic is None:
        if raw.startswith("---"):
            parts = raw.split("---", 2)
            if len(parts) >= 3:
                for line in parts[1].strip().split("\n"):
                    if line.strip().startswith("topic:"):
                        topic = line.split(":", 1)[1].strip().strip('"').strip("'")
                        break
        if topic is None:
            topic = "general"

    # Extract body text (skip frontmatter)
    body = raw
    if raw.startswith("---"):
        parts = raw.split("---", 2)
        if len(parts) >= 3:
            body = parts[2].strip()

    logger.info(f"Reviewing draft: {path.name} (topic: {topic})")

    # Run all gates
    results = {
        "draft_path": str(path),
        "topic": topic,
        "reviewed_at": datetime.now(timezone.utc).isoformat(),
        "gates": [
            gate_readability(body),
            gate_tone(body),
            gate_structure(body),
            gate_keywords(body, topic),
        ],
    }

    # Overall result
    all_passed = all(g["passed"] for g in results["gates"])
    results["overall_pass"] = all_passed
    results["status"] = "reviewed" if all_passed else "needs_revision"
    results["suggestions"] = [g["suggestion"] for g in results["gates"] if g["suggestion"]]

    # Write review result
    review_path = path.parent / f"{path.stem}_review.json"
    tmp = review_path.with_suffix('.tmp')
    tmp.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding='utf-8')
    tmp.replace(review_path)
    logger.info(f"Review result written to: {review_path}")

    # Update pipeline state
    _update_state_from_path(path, results["status"])

    return results


def _update_state_from_path(draft_path: Path, status: str) -> None:
    """Update pipeline state from draft path."""
    if not STATE_FILE.exists():
        return

    try:
        state = json.loads(STATE_FILE.read_text(encoding='utf-8'))
    except (json.JSONDecodeError, OSError):
        return

    content_id = draft_path.stem
    if content_id in state:
        state[content_id]["status"] = status
        state[content_id]["updated_at"] = datetime.now(timezone.utc).isoformat()
        tmp = STATE_FILE.with_suffix('.tmp')
        tmp.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding='utf-8')
        tmp.replace(STATE_FILE)


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description="Content Draft Review")
    parser.add_argument("draft_path", help="Path to draft .md file")
    parser.add_argument("--topic", help="Topic for keyword gate")
    parser.add_argument("--dry-run", action="store_true", help="Review without updating state")
    parser.add_argument("--verbose", "-v", action="store_true", help="Debug output")
    parser.add_argument("--test", action="store_true", help="Smoke test mode")
    args = parser.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    if args.test:
        logger.info("Smoke test: review_draft OK")
        return 0

    result = review_draft(args.draft_path, args.topic)

    # Print summary
    print(f"\nReview: {result['status'].upper()}")
    for gate in result["gates"]:
        status = "PASS" if gate["passed"] else "FAIL"
        print(f"  [{status}] {gate['gate']}")
        for issue in gate["issues"]:
            print(f"        - {issue}")

    if result["suggestions"]:
        print(f"\nSuggestions:")
        for s in result["suggestions"]:
            print(f"  -> {s}")

    return 0 if result["overall_pass"] else 1


if __name__ == "__main__":
    try:
        _fix_encoding()
        sys.exit(main())
    except KeyboardInterrupt:
        logger.warning("Interrupted by user")
        sys.exit(130)
    except Exception as e:
        logger.exception(f"Fatal error: {e}")
        sys.exit(1)
