#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
compound_content.py - Content Repurposing Engine
=================================================
Derives 5+ content formats from a single content piece:
  1. Carousel script (LinkedIn)
  2. Thread (Twitter)
  3. Quote card text
  4. Email snippet
  5. Blog summary

Usage:
    from compound_content import compound
    results = compound("ai-trends_20260714_abc123")

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
from typing import Optional

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
# DERIVATIVE GENERATORS
# =============================================================================

def _extract_key_sentences(text: str, count: int = 5) -> list:
    """Extract the most impactful sentences from text."""
    # Remove markdown headers
    clean = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    sentences = re.split(r'(?<=[.!?])\s+', clean)
    # Filter out very short sentences
    good = [s.strip() for s in sentences if len(s.strip()) > 30]
    # Return evenly distributed selection
    if len(good) <= count:
        return good
    step = max(1, len(good) // count)
    return [good[i] for i in range(0, len(good), step)][:count]


def _extract_quotes(text: str) -> list:
    """Extract quotable sentences from text."""
    sentences = re.split(r'(?<=[.!?])\s+', text)
    # Look for statements that could stand alone as quotes
    quotable = []
    for s in sentences:
        s = s.strip()
        if (len(s) > 40 and len(s) < 200 and
                not s.startswith("#") and
                not s.startswith("-") and
                any(keyword in s.lower() for keyword in
                    ["key", "important", "critical", "best", "never",
                     "always", "must", "should", "future", "win", "success"])):
            quotable.append(s)
    return quotable[:5]


def _get_content_text(content_id: str, draft_dir: Path = None) -> str:
    """Load content text from draft file."""
    if draft_dir is None:
        draft_dir = DRAFTS_DIR

    draft_path = draft_dir / f"{content_id}.md"
    if not draft_path.exists():
        # Try searching in draft_dir and subdirectories
        for p in draft_dir.rglob(f"{content_id}.md"):
            draft_path = p
            break
        else:
            raise FileNotFoundError(f"Draft not found for content_id: {content_id}")

    raw = draft_path.read_text(encoding='utf-8')

    # Strip frontmatter
    if raw.startswith("---"):
        parts = raw.split("---", 2)
        if len(parts) >= 3:
            return parts[2].strip()
    return raw


def generate_carousel(content_text: str, topic: str) -> str:
    """Generate LinkedIn carousel script (5-8 slides)."""
    key_points = _extract_key_sentences(content_text, count=6)

    slides = []
    slides.append(f"SLIDE 1 (Cover):\n\"{topic}\"\n3 Key Insights for 2026\n\n")
    for i, point in enumerate(key_points[:5], 2):
        slides.append(
            f"SLIDE {i}:\n{point}\n\n"
            f"[Visual: Supporting graphic or icon]\n\n"
        )
    slides.append(
        f"SLIDE {len(key_points[:5]) + 2} (CTA):\n"
        f"What's your experience with {topic.lower()}?\n"
        f"Drop a comment or DM me.\n\n"
        f"[Visual: Profile + Follow prompt]\n"
    )

    return "\n---\n\n".join(slides)


def generate_thread(content_text: str, topic: str) -> str:
    """Generate Twitter/X thread format."""
    key_points = _extract_key_sentences(content_text, count=5)
    if not key_points:
        key_points = [f"Insights on {topic} in 2026:"]

    tweets = [f"Thread: {topic} -- 5 key insights from hands-on experience"]
    for i, point in enumerate(key_points[:5], 1):
        tweet = f"{i}/ {point}"
        if len(tweet) > 280:
            tweet = tweet[:277] + "..."
        tweets.append(tweet)
    tweets.append(f"That is a wrap on {topic.lower()}. If this was helpful, "
                  "retweet the first tweet to share with your network.")

    return "\n\n".join(tweets)


def generate_quote_card(content_text: str, topic: str) -> str:
    """Generate quote card text (single powerful quote)."""
    quotes = _extract_quotes(content_text)
    if quotes:
        primary_quote = quotes[0]
    else:
        primary_quote = _extract_key_sentences(content_text, count=1)[0] if \
            _extract_key_sentences(content_text, count=1) else f"Key insight on {topic}"

    return (
        f"QUOTE CARD:\n"
        f"\"{primary_quote}\"\n\n"
        f"-- Your Name\n"
        f"   {topic} | Think Different PersonalOS\n\n"
        f"[Design: Dark background, white text, brand accent color]\n"
        f"[Dimensions: 1080x1080px]\n"
    )


def generate_email_snippet(content_text: str, topic: str) -> str:
    """Generate email newsletter snippet."""
    key_points = _extract_key_sentences(content_text, count=3)

    bullets = "\n".join(f"  * {p}" for p in key_points)

    return (
        f"Subject: {topic} -- What I Learned This Week\n\n"
        f"Hey {{first_name}},\n\n"
        f"I just published a deep-dive on {topic.lower()}. "
        f"Here are the highlights:\n\n"
        f"{bullets}\n\n"
        f"Read the full article on the blog.\n\n"
        f"Best,\n"
        f"Your Name\n\n"
        f"P.S. Reply to this email with your thoughts -- I read every response.\n"
    )


def generate_blog_summary(content_text: str, topic: str) -> str:
    """Generate blog summary / TL;DR."""
    key_points = _extract_key_sentences(content_text, count=5)
    word_count = len(content_text.split())

    summary_points = "\n".join(f"- {p}" for p in key_points[:4])

    return (
        f"## Summary\n\n"
        f"**Topic:** {topic}\n"
        f"**Read time:** ~{max(1, word_count // 200)} min ({word_count} words)\n\n"
        f"### TL;DR\n"
        f"{summary_points}\n\n"
        f"### Key Takeaways\n"
        f"1. {key_points[0] if key_points else 'Core insight'}\n"
        f"2. {key_points[1] if len(key_points) > 1 else 'Supporting point'}\n"
        f"3. Actionable next step for readers\n"
    )


# =============================================================================
# MAIN COMPOUND FUNCTION
# =============================================================================

COMPOUND_FORMATS = {
    "carousel": ("carousel_script.md", generate_carousel),
    "thread": ("twitter_thread.md", generate_thread),
    "quote_card": ("quote_card.txt", generate_quote_card),
    "email_snippet": ("email_snippet.txt", generate_email_snippet),
    "blog_summary": ("blog_summary.md", generate_blog_summary),
}


def compound(content_id: str, draft_dir: Path = None) -> dict:
    """
    Generate 5 derived content formats from one content piece.

    Args:
        content_id: The content identifier
        draft_dir: Override draft directory (for testing)

    Returns:
        dict with content_id, output_dir, and list of generated files
    """
    if draft_dir is None:
        draft_dir = DRAFTS_DIR

    # Load source content
    content_text = _get_content_text(content_id, draft_dir)

    # Extract topic from frontmatter
    topic = "Content"
    draft_path = draft_dir / f"{content_id}.md"
    if draft_path.exists():
        raw = draft_path.read_text(encoding='utf-8')
        if raw.startswith("---"):
            parts = raw.split("---", 2)
            if len(parts) >= 3:
                for line in parts[1].strip().split("\n"):
                    if line.strip().startswith("topic:"):
                        topic = line.split(":", 1)[1].strip().strip('"').strip("'")
                        break

    logger.info(f"Compounding content '{content_id}' into 5 formats (topic: {topic})")

    # Create output directory
    output_dir = draft_dir / f"{content_id}_compound"
    output_dir.mkdir(parents=True, exist_ok=True)

    generated = []
    for format_name, (filename, generator) in COMPOUND_FORMATS.items():
        try:
            result = generator(content_text, topic)
            file_path = output_dir / filename
            tmp = file_path.with_suffix('.tmp')
            tmp.write_text(result, encoding='utf-8')
            tmp.replace(file_path)
            generated.append({
                "format": format_name,
                "filename": filename,
                "path": str(file_path),
                "chars": len(result),
            })
            logger.info(f"  Generated {format_name}: {filename} ({len(result)} chars)")
        except Exception as e:
            logger.error(f"  Failed to generate {format_name}: {e}")
            generated.append({
                "format": format_name,
                "filename": filename,
                "error": str(e),
            })

    # Write manifest
    manifest = {
        "content_id": content_id,
        "topic": topic,
        "output_dir": str(output_dir),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "derivatives": generated,
        "total_formats": len(generated),
        "successful_formats": sum(1 for g in generated if "error" not in g),
    }

    manifest_path = output_dir / "manifest.json"
    tmp = manifest_path.with_suffix('.tmp')
    tmp.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding='utf-8')
    tmp.replace(manifest_path)

    # Update pipeline state
    _update_state(content_id)

    logger.info(f"Compound complete: {manifest['successful_formats']}/{manifest['total_formats']} formats")
    return manifest


def _update_state(content_id: str) -> None:
    """Update pipeline state with compound status."""
    if not STATE_FILE.exists():
        return

    try:
        state = json.loads(STATE_FILE.read_text(encoding='utf-8'))
    except (json.JSONDecodeError, OSError):
        return

    if content_id in state:
        state[content_id]["status"] = "compounded"
        state[content_id]["updated_at"] = datetime.now(timezone.utc).isoformat()
        tmp = STATE_FILE.with_suffix('.tmp')
        tmp.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding='utf-8')
        tmp.replace(STATE_FILE)


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description="Content Compound Engine")
    parser.add_argument("content_id", help="Content ID to compound")
    parser.add_argument("--dry-run", action="store_true", help="Dry run")
    parser.add_argument("--verbose", "-v", action="store_true", help="Debug output")
    parser.add_argument("--test", action="store_true", help="Smoke test mode")
    args = parser.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    if args.test:
        logger.info("Smoke test: compound_content OK")
        return 0

    if args.dry_run:
        logger.info(f"DRY RUN: Would compound {args.content_id}")
        return 0

    result = compound(args.content_id)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


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
