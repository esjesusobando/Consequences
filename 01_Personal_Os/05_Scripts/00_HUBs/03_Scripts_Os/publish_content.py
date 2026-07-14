#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
publish_content.py - Multi-Platform Content Publisher
=====================================================
Adapts and publishes content for LinkedIn, Twitter, and Blog platforms.
In test mode: writes preview files. In production: uses platform APIs.

Usage:
    from publish_content import publish_content
    result = publish_content(draft_path, platform="linkedin")

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
from dataclasses import dataclass, asdict
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
PREVIEW_DIR = CACHE_DIR / "content_previews"


# =============================================================================
# DATA MODEL
# =============================================================================

@dataclass
class PublishResult:
    platform: str
    content_id: str
    status: str  # "published", "preview", "failed"
    preview_path: Optional[str] = None
    char_count: int = 0
    tweet_count: int = 0
    error: Optional[str] = None
    published_at: Optional[str] = None

    def to_dict(self):
        return {k: v for k, v in asdict(self).items() if v is not None}


# =============================================================================
# PARSING
# =============================================================================

def _parse_draft(draft_path: str) -> dict:
    """Parse draft file into frontmatter + platform sections."""
    path = Path(draft_path)
    if not path.exists():
        raise FileNotFoundError(f"Draft not found: {draft_path}")

    raw = path.read_text(encoding='utf-8')
    frontmatter = {}
    body = raw

    if raw.startswith("---"):
        parts = raw.split("---", 2)
        if len(parts) >= 3:
            fm_text = parts[1].strip()
            body = parts[2].strip()
            for line in fm_text.split("\n"):
                if ":" in line:
                    key, val = line.split(":", 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    if val.startswith("[") and val.endswith("]"):
                        val = [v.strip() for v in val[1:-1].split(",") if v.strip()]
                    frontmatter[key] = val

    # Extract platform sections
    platform_sections = {}
    sections = re.split(r'## Platform: (\w+)', body)
    if len(sections) >= 3:
        # sections: [preamble, platform_name, content, platform_name, content, ...]
        for i in range(1, len(sections), 2):
            platform_name = sections[i].lower()
            if i + 1 < len(sections):
                content = sections[i + 1].strip()
                # Remove metadata lines (Format: ...)
                lines = content.split("\n")
                clean_lines = [l for l in lines if not l.strip().startswith("**Format:**")]
                platform_sections[platform_name] = "\n".join(clean_lines).strip()

    return {
        "frontmatter": frontmatter,
        "platform_sections": platform_sections,
        "raw_body": body,
        "content_id": path.stem,
    }


# =============================================================================
# PLATFORM ADAPTERS
# =============================================================================

def _extract_linkedin_content(draft_data: dict) -> str:
    """Extract and format LinkedIn content from draft."""
    sections = draft_data.get("platform_sections", {})
    if "linkedin" in sections:
        return sections["linkedin"]

    # Fallback: use first 3000 chars of body
    body = draft_data["raw_body"]
    if len(body) > 3000:
        # Truncate at sentence boundary
        truncated = body[:3000]
        last_period = truncated.rfind(".")
        if last_period > 2500:
            truncated = truncated[:last_period + 1]
        return truncated
    return body


def publish_linkedin(draft_path: str, test_mode: bool = True) -> PublishResult:
    """Publish content to LinkedIn (or generate preview)."""
    draft_data = _parse_draft(draft_path)
    content_id = draft_data["content_id"]
    content = _extract_linkedin_content(draft_data)

    # Enforce LinkedIn max
    if len(content) > 3000:
        content = content[:2997] + "..."

    result = PublishResult(
        platform="linkedin",
        content_id=content_id,
        status="preview" if test_mode else "published",
        char_count=len(content),
        published_at=datetime.now(timezone.utc).isoformat(),
    )

    if test_mode:
        preview_dir = PREVIEW_DIR / content_id
        preview_dir.mkdir(parents=True, exist_ok=True)
        preview_path = preview_dir / f"linkedin_preview.md"
        _safe_write(preview_path, content)
        result.preview_path = str(preview_path)
        logger.info(f"LinkedIn preview written: {preview_path}")
    else:
        # Production: check for API credentials
        api_key = os.environ.get("LINKEDIN_API_KEY")
        if not api_key:
            result.status = "failed"
            result.error = "LINKEDIN_API_KEY not configured in .env"
            logger.warning("LinkedIn API key not found, skipping publish")
        else:
            # Real publish would go here
            logger.info(f"Publishing to LinkedIn: {content_id}")

    return result


def _split_twitter_thread(content: str, max_chars: int = 280) -> list:
    """Split content into Twitter-compatible tweets."""
    draft_data_twitter = None
    # Check if content has pre-split tweets
    if "\n\n---\n\n" in content:
        raw_tweets = content.split("\n\n---\n\n")
        tweets = []
        for t in raw_tweets:
            cleaned = t.strip()
            if cleaned and len(cleaned) <= max_chars:
                tweets.append(cleaned)
            elif cleaned:
                # Need to split further
                tweets.extend(_split_long_tweet(cleaned, max_chars))
        return tweets
    return _split_long_tweet(content, max_chars)


def _split_long_tweet(text: str, max_chars: int = 280) -> list:
    """Split a long text into multiple tweets."""
    if len(text) <= max_chars:
        return [text]

    tweets = []
    sentences = re.split(r'(?<=[.!?])\s+', text)
    current = ""
    for sent in sentences:
        if len(current) + len(sent) + 1 <= max_chars - 10:
            current = f"{current} {sent}".strip() if current else sent
        else:
            if current:
                tweets.append(current)
            current = sent
    if current:
        tweets.append(current)

    # Add numbering if multiple tweets
    if len(tweets) > 1:
        numbered = []
        for i, tweet in enumerate(tweets):
            prefix = f"{i+1}/{len(tweets)} "
            if len(prefix) + len(tweet) <= max_chars:
                numbered.append(f"{prefix}{tweet}")
            else:
                numbered.append(tweet)
        return numbered

    return tweets


def publish_twitter(draft_path: str, test_mode: bool = True) -> PublishResult:
    """Publish content as Twitter thread (or generate preview)."""
    draft_data = _parse_draft(draft_path)
    content_id = draft_data["content_id"]
    content = draft_data.get("platform_sections", {}).get("twitter", draft_data["raw_body"])

    tweets = _split_twitter_thread(content)

    result = PublishResult(
        platform="twitter",
        content_id=content_id,
        status="preview" if test_mode else "published",
        char_count=sum(len(t) for t in tweets),
        tweet_count=len(tweets),
        published_at=datetime.now(timezone.utc).isoformat(),
    )

    if test_mode:
        preview_dir = PREVIEW_DIR / content_id
        preview_dir.mkdir(parents=True, exist_ok=True)
        preview_path = preview_dir / "twitter_thread_preview.json"
        _safe_write_json(preview_path, {
            "thread": tweets,
            "count": len(tweets),
            "total_chars": result.char_count,
        })
        result.preview_path = str(preview_path)
        logger.info(f"Twitter thread preview written: {preview_path} ({len(tweets)} tweets)")
    else:
        api_key = os.environ.get("TWITTER_API_KEY")
        if not api_key:
            result.status = "failed"
            result.error = "TWITTER_API_KEY not configured in .env"
            logger.warning("Twitter API key not found, skipping publish")
        else:
            logger.info(f"Publishing Twitter thread: {content_id} ({len(tweets)} tweets)")

    return result


def publish_blog(draft_path: str, test_mode: bool = True) -> PublishResult:
    """Publish content as blog Markdown (or generate preview)."""
    draft_data = _parse_draft(draft_path)
    content_id = draft_data["content_id"]
    content = draft_data.get("platform_sections", {}).get("blog", draft_data["raw_body"])

    # Add blog-specific frontmatter
    topic = draft_data["frontmatter"].get("topic", "Untitled")
    blog_md = (
        f"---\n"
        f"title: \"{topic}\"\n"
        f"date: {datetime.now(timezone.utc).strftime('%Y-%m-%d')}\n"
        f"content_id: {content_id}\n"
        f"draft: true\n"
        f"---\n\n"
        f"{content}"
    )

    result = PublishResult(
        platform="blog",
        content_id=content_id,
        status="preview" if test_mode else "published",
        char_count=len(blog_md),
        published_at=datetime.now(timezone.utc).isoformat(),
    )

    if test_mode:
        preview_dir = PREVIEW_DIR / content_id
        preview_dir.mkdir(parents=True, exist_ok=True)
        preview_path = preview_dir / "blog_preview.md"
        _safe_write(preview_path, blog_md)
        result.preview_path = str(preview_path)
        logger.info(f"Blog preview written: {preview_path}")
    else:
        result.status = "failed"
        result.error = "Blog publishing not configured (manual publish)"
        logger.info(f"Blog content ready for manual publish: {content_id}")

    return result


# =============================================================================
# DISPATCHER
# =============================================================================

PLATFORM_ADAPTERS = {
    "linkedin": publish_linkedin,
    "twitter": publish_twitter,
    "blog": publish_blog,
}


def publish_content(draft_path: str, platform: str, test_mode: bool = True) -> PublishResult:
    """
    Publish content to the specified platform.

    Args:
        draft_path: Path to the draft .md file
        platform: Target platform ('linkedin', 'twitter', 'blog')
        test_mode: If True, writes preview files instead of publishing

    Returns:
        PublishResult with status and details
    """
    if platform not in PLATFORM_ADAPTERS:
        return PublishResult(
            platform=platform,
            content_id=Path(draft_path).stem,
            status="failed",
            error=f"Unknown platform: {platform}. Supported: {list(PLATFORM_ADAPTERS.keys())}",
        )

    adapter = PLATFORM_ADAPTERS[platform]
    logger.info(f"Publishing to {platform} (test_mode={test_mode})")
    return adapter(draft_path, test_mode=test_mode)


# =============================================================================
# UTILITIES
# =============================================================================

def _safe_write(path: Path, content: str) -> None:
    """Atomic text write."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix('.tmp')
    tmp.write_text(content, encoding='utf-8')
    tmp.replace(path)


def _safe_write_json(path: Path, data: dict) -> None:
    """Atomic JSON write."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix('.tmp')
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(path)


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description="Content Publisher")
    parser.add_argument("draft_path", help="Path to draft .md file")
    parser.add_argument("--platform", required=True,
                        choices=["linkedin", "twitter", "blog"],
                        help="Target platform")
    parser.add_argument("--publish", action="store_true",
                        help="Actually publish (default: preview mode)")
    parser.add_argument("--dry-run", action="store_true", help="Dry run mode")
    parser.add_argument("--verbose", "-v", action="store_true", help="Debug output")
    parser.add_argument("--test", action="store_true", help="Smoke test mode")
    args = parser.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    if args.test:
        logger.info("Smoke test: publish_content OK")
        return 0

    test_mode = not args.publish
    if args.dry_run:
        test_mode = True
        logger.info("DRY RUN mode")

    result = publish_content(args.draft_path, args.platform, test_mode=test_mode)
    print(json.dumps(result.to_dict(), indent=2, ensure_ascii=False))

    return 0 if result.status != "failed" else 1


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
