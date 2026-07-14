#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
draft_generator.py - Content Draft Generator for PersonalOS Content Pipeline
=============================================================================
Generates structured content drafts for multiple platforms.
Creates drafts in 06_Projects/01_Content/Drafts/{content_id}.md with YAML frontmatter.

Usage:
    from draft_generator import generate_draft
    result = generate_draft("AI trends", ["linkedin", "twitter"], style="professional")

Ubication: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
"""
import sys
import os
import json
import argparse
import logging
import re
import hashlib
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
# CONTENT TEMPLATES (template-based generation for testability)
# =============================================================================

PLATFORM_TEMPLATES = {
    "linkedin": {
        "format": "text_post",
        "max_chars": 3000,
        "structure": "hook_body_cta",
        "style_notes": "Professional, value-driven, personal insight tone",
    },
    "twitter": {
        "format": "thread",
        "max_chars": 280,
        "structure": "hook_expansion_cta",
        "style_notes": "Concise, punchy, thread format",
    },
    "blog": {
        "format": "markdown_article",
        "max_chars": 10000,
        "structure": "title_intro_body_conclusion_cta",
        "style_notes": "Long-form, SEO-optimized, detailed analysis",
    },
}

TOPIC_HUMANIZERS = {
    "ai": "Artificial Intelligence",
    "ml": "Machine Learning",
    "dev": "Software Development",
    "startup": "Startup Ecosystem",
    "tech": "Technology",
    "marketing": "Digital Marketing",
    "product": "Product Management",
}


def _generate_content_id(topic: str) -> str:
    """Generate a deterministic content ID from topic + timestamp."""
    slug = re.sub(r'[^a-z0-9]+', '-', topic.lower()).strip('-')[:40]
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    short_hash = hashlib.md5(f"{topic}{timestamp}".encode()).hexdigest()[:6]
    return f"{slug}_{timestamp}_{short_hash}"


def _humanize_topic(topic: str) -> str:
    """Expand common abbreviations in topic names."""
    lower = topic.lower().strip()
    return TOPIC_HUMANIZERS.get(lower, topic)


def _generate_linkedin_draft(topic: str, style: str, content_id: str) -> str:
    """Generate LinkedIn text post content."""
    human_topic = _humanize_topic(topic)
    return (
        f"The {human_topic} landscape is shifting faster than ever.\n\n"
        f"Here are 3 insights I've gathered from hands-on experience:\n\n"
        f"1. {human_topic} is not about replacing human thinking -- "
        f"it's about amplifying it. The teams that win are the ones that "
        f"combine AI capabilities with domain expertise.\n\n"
        f"2. Implementation speed matters more than perfection. "
        f"Start small, measure, iterate. The best {human_topic.lower()} "
        f"strategies are built in weeks, not months.\n\n"
        f"3. The gap between early adopters and everyone else is widening. "
        f"If you're not experimenting now, you're already behind.\n\n"
        f"What's your take on {human_topic.lower()} in 2026?\n\n"
        f"Drop your thoughts below.\n\n"
        f"#ThinkDifferent #{human_topic.replace(' ', '')} #PersonalOS"
    )


def _generate_twitter_draft(topic: str, style: str, content_id: str) -> list:
    """Generate Twitter thread content (list of tweets)."""
    human_topic = _humanize_topic(topic)
    return [
        f"Thread: Why {human_topic} matters more than ever in 2026. Here is what I learned.",
        f"1/ The biggest mistake people make with {human_topic.lower()} is treating it as a destination instead of a journey.",
        f"2/ Practical insight: Start with ONE problem. Do not try to boil the ocean. Small wins compound into massive results.",
        f"3/ The real competitive advantage is not the tool itself -- it is how fast you can learn and adapt. Speed of iteration wins.",
        f"4/ What I see working right now: teams that combine {human_topic.lower()} with clear processes are 3x more productive.",
        f"5/ Bottom line: The future belongs to those who experiment relentlessly and share what they learn. What is your experience?"
    ]


def _generate_blog_draft(topic: str, style: str, content_id: str) -> str:
    """Generate blog article content in Markdown."""
    human_topic = _humanize_topic(topic)
    return (
        f"# {human_topic} in 2026: A Practical Guide\n\n"
        f"## Introduction\n\n"
        f"The {human_topic.lower()} space has evolved dramatically. "
        f"In this article, we'll explore what actually works, backed by "
        f"real-world experience and practical frameworks.\n\n"
        f"## The Current Landscape\n\n"
        f"2026 has been a defining year for {human_topic.lower()}. "
        f"Several key trends are shaping how professionals approach this space:\n\n"
        f"### Trend 1: Integration Over Isolation\n"
        f"The era of {human_topic.lower()} as a standalone discipline is over. "
        f"Success now requires integrating multiple capabilities into cohesive workflows.\n\n"
        f"### Trend 2: Speed as Strategy\n"
        f"Organizations that can iterate fastest are winning. The advantage goes to "
        f"those who ship, measure, and refine in tight loops.\n\n"
        f"### Trend 3: Human-Centered Approach\n"
        f"Technology is a multiplier, not a replacement. The most effective teams "
        f"use {human_topic.lower()} to amplify human judgment, not substitute it.\n\n"
        f"## Practical Framework\n\n"
        f"Here's a 4-step framework for applying {human_topic.lower()} effectively:\n\n"
        f"1. **Identify** -- Pick one specific problem to solve\n"
        f"2. **Experiment** -- Run small, time-boxed experiments\n"
        f"3. **Measure** -- Track meaningful metrics, not vanity numbers\n"
        f"4. **Scale** -- Double down on what works, cut what doesn't\n\n"
        f"## Conclusion\n\n"
        f"The future of {human_topic.lower()} is not about having the best tools. "
        f"It's about having the best process for learning and adapting. "
        f"Start small, stay consistent, and share your journey.\n\n"
        f"What's your experience with {human_topic.lower()}? "
        f"Share in the comments below.\n"
    )


def _build_frontmatter(content_id: str, topic: str, platforms: list,
                       style: str, status: str = "draft") -> str:
    """Build YAML frontmatter for the draft file."""
    platforms_str = ", ".join(platforms)
    now = datetime.now(timezone.utc).isoformat()
    return (
        f"---\n"
        f"content_id: {content_id}\n"
        f"topic: \"{topic}\"\n"
        f"platforms: [{platforms_str}]\n"
        f"style: {style}\n"
        f"created_at: {now}\n"
        f"status: {status}\n"
        f"version: 1.0\n"
        f"pipeline: content_pipeline\n"
        f"---\n"
    )


def generate_draft(topic: str, platforms: list, style: str = "professional",
                   draft_dir: Path = None) -> dict:
    """
    Generate a content draft for specified platforms.

    Args:
        topic: Content topic string
        platforms: List of platform names ('linkedin', 'twitter', 'blog')
        style: Content style ('professional', 'casual', 'technical')
        draft_dir: Override draft output directory (for testing)

    Returns:
        dict with keys: content_id, topic, platforms, draft_path, platform_versions
    """
    if draft_dir is None:
        draft_dir = DRAFTS_DIR

    draft_dir.mkdir(parents=True, exist_ok=True)

    content_id = _generate_content_id(topic)
    logger.info(f"Generating draft '{content_id}' for topic: {topic}")

    # Generate platform-specific content
    platform_versions = {}
    for platform in platforms:
        if platform not in PLATFORM_TEMPLATES:
            logger.warning(f"Unknown platform '{platform}', skipping")
            continue

        if platform == "linkedin":
            platform_versions[platform] = {
                "content": _generate_linkedin_draft(topic, style, content_id),
                "format": PLATFORM_TEMPLATES[platform]["format"],
                "max_chars": PLATFORM_TEMPLATES[platform]["max_chars"],
            }
        elif platform == "twitter":
            tweets = _generate_twitter_draft(topic, style, content_id)
            platform_versions[platform] = {
                "content": "\n\n---\n\n".join(tweets),
                "tweets": tweets,
                "format": PLATFORM_TEMPLATES[platform]["format"],
                "max_chars": PLATFORM_TEMPLATES[platform]["max_chars"],
            }
        elif platform == "blog":
            platform_versions[platform] = {
                "content": _generate_blog_draft(topic, style, content_id),
                "format": PLATFORM_TEMPLATES[platform]["format"],
                "max_chars": PLATFORM_TEMPLATES[platform]["max_chars"],
            }

        logger.info(f"  Generated {platform} version ({len(platform_versions[platform]['content'])} chars)")

    # Combine all platform content into single draft file
    frontmatter = _build_frontmatter(content_id, topic, platforms, style)
    sections = [frontmatter, f"# Draft: {topic}\n"]

    for platform, version in platform_versions.items():
        sections.append(f"## Platform: {platform.upper()}\n")
        sections.append(f"**Format:** {version['format']} | **Max chars:** {version['max_chars']}\n")
        sections.append(version["content"])
        sections.append("")

    draft_content = "\n".join(sections)

    # Write draft file
    draft_path = draft_dir / f"{content_id}.md"
    safe_json_write_text(draft_path, draft_content)
    logger.info(f"Draft written to: {draft_path}")

    # Update state
    _update_state(content_id, topic, platforms, "draft")

    return {
        "content_id": content_id,
        "topic": topic,
        "platforms": platforms,
        "draft_path": str(draft_path),
        "platform_versions": {k: {"format": v["format"], "chars": len(v["content"])}
                              for k, v in platform_versions.items()},
    }


def safe_json_write_text(path: Path, content: str) -> None:
    """Atomic text file write."""
    tmp = path.with_suffix('.tmp')
    tmp.write_text(content, encoding='utf-8')
    tmp.replace(path)


def safe_json_write(path: Path, data: dict) -> None:
    """Atomic JSON write."""
    tmp = path.with_suffix('.tmp')
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(path)


def _update_state(content_id: str, topic: str, platforms: list, status: str) -> None:
    """Update pipeline state file."""
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    state = {}
    if STATE_FILE.exists():
        try:
            state = json.loads(STATE_FILE.read_text(encoding='utf-8'))
        except (json.JSONDecodeError, OSError):
            state = {}

    state[content_id] = {
        "topic": topic,
        "platforms": platforms,
        "status": status,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    safe_json_write(STATE_FILE, state)


def load_draft(draft_path: str) -> dict:
    """Load and parse a draft file, extracting frontmatter and content."""
    path = Path(draft_path)
    if not path.exists():
        raise FileNotFoundError(f"Draft not found: {draft_path}")

    raw = path.read_text(encoding='utf-8')

    # Parse YAML frontmatter (simple parser, no pyyaml dependency)
    frontmatter = {}
    content = raw
    if raw.startswith("---"):
        parts = raw.split("---", 2)
        if len(parts) >= 3:
            fm_text = parts[1].strip()
            content = parts[2].strip()
            for line in fm_text.split("\n"):
                if ":" in line:
                    key, val = line.split(":", 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    if val.startswith("[") and val.endswith("]"):
                        val = [v.strip() for v in val[1:-1].split(",") if v.strip()]
                    frontmatter[key] = val

    return {
        "frontmatter": frontmatter,
        "content": content,
        "path": str(path),
    }


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description="Content Draft Generator")
    parser.add_argument("topic", help="Content topic")
    parser.add_argument("--platform", default="linkedin,twitter,blog",
                        help="Comma-separated platforms (default: linkedin,twitter,blog)")
    parser.add_argument("--style", default="professional",
                        choices=["professional", "casual", "technical"],
                        help="Content style")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing")
    parser.add_argument("--verbose", "-v", action="store_true", help="Debug output")
    parser.add_argument("--test", action="store_true", help="Smoke test mode")
    args = parser.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    if args.test:
        logger.info("Smoke test: draft_generator OK")
        result = generate_draft("test topic", ["linkedin"], draft_dir=CACHE_DIR / "test_drafts")
        print(json.dumps(result, indent=2, default=str))
        return 0

    platforms = [p.strip() for p in args.platform.split(",")]

    if args.dry_run:
        logger.info(f"DRY RUN: Would generate draft for '{args.topic}' on {platforms}")
        result = generate_draft(args.topic, platforms, args.style,
                                draft_dir=CACHE_DIR / "draft_previews")
    else:
        result = generate_draft(args.topic, platforms, args.style)

    print(json.dumps(result, indent=2, ensure_ascii=False, default=str))
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
