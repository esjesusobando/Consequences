#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
content_analytics.py - Post-Publish Analytics for Content Pipeline
=================================================================
Fetches and stores analytics metrics for published content.
Currently returns mock metrics; designed for real API integration.

Usage:
    from content_analytics import fetch_analytics
    metrics = fetch_analytics("ai-trends_20260714_abc123", "linkedin")

Ubication: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
"""
import sys
import os
import json
import argparse
import logging
import random
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

ANALYTICS_DIR = TELEMETRY_DIR
STATE_FILE = TELEMETRY_DIR / "content_pipeline_state.json"


# =============================================================================
# METRIC DEFINITIONS
# =============================================================================

METRIC_RANGES = {
    "linkedin": {
        "impressions": (100, 5000),
        "engagement_rate": (0.01, 0.08),
        "clicks": (5, 200),
        "shares": (1, 50),
        "comments": (0, 30),
        "likes": (5, 150),
    },
    "twitter": {
        "impressions": (50, 3000),
        "engagement_rate": (0.02, 0.10),
        "clicks": (3, 150),
        "shares": (2, 100),  # Retweets
        "replies": (0, 20),
        "likes": (3, 80),
    },
    "blog": {
        "impressions": (10, 500),  # Page views
        "engagement_rate": (0.3, 0.8),  # Time on page ratio
        "clicks": (0, 0),
        "shares": (0, 20),
        "avg_time_on_page_sec": (30, 300),
        "bounce_rate": (0.2, 0.7),
    },
}


def _generate_mock_metrics(content_id: str, platform: str) -> dict:
    """Generate realistic mock metrics for testing."""
    ranges = METRIC_RANGES.get(platform, METRIC_RANGES["linkedin"])
    metrics = {}

    for metric_name, (low, high) in ranges.items():
        if isinstance(low, float):
            metrics[metric_name] = round(random.uniform(low, high), 4)
        else:
            metrics[metric_name] = random.randint(low, high)

    # Derived metrics
    metrics["engagement_rate_pct"] = round(metrics["engagement_rate"] * 100, 2)

    return metrics


def fetch_analytics(content_id: str, platform: str,
                    force_refresh: bool = False) -> dict:
    """
    Fetch analytics metrics for published content.

    Args:
        content_id: The content identifier
        platform: Platform name ('linkedin', 'twitter', 'blog')
        force_refresh: If True, bypass cache and fetch fresh data

    Returns:
        dict with metrics, timestamps, and metadata
    """
    analytics_file = ANALYTICS_DIR / f"content_analytics_{content_id}.json"

    # Check cache unless forced
    if not force_refresh and analytics_file.exists():
        try:
            cached = json.loads(analytics_file.read_text(encoding='utf-8'))
            logger.info(f"Loaded cached analytics for {content_id}")
            return cached
        except (json.JSONDecodeError, OSError):
            logger.warning("Cache corrupt, regenerating")

    # Generate metrics (mock for now, real API integration point)
    logger.info(f"Fetching analytics for {content_id} on {platform}")
    metrics = _generate_mock_metrics(content_id, platform)

    result = {
        "content_id": content_id,
        "platform": platform,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "metrics": metrics,
        "source": "mock",  # Will be "api" when real integration exists
    }

    # Write analytics file
    ANALYTICS_DIR.mkdir(parents=True, exist_ok=True)
    tmp = analytics_file.with_suffix('.tmp')
    tmp.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding='utf-8')
    tmp.replace(analytics_file)
    logger.info(f"Analytics saved: {analytics_file}")

    # Update pipeline state
    _update_state(content_id, metrics)

    return result


def _update_state(content_id: str, metrics: dict) -> None:
    """Update pipeline state with analytics data."""
    if not STATE_FILE.exists():
        return

    try:
        state = json.loads(STATE_FILE.read_text(encoding='utf-8'))
    except (json.JSONDecodeError, OSError):
        return

    if content_id in state:
        state[content_id]["status"] = "analytics_fetched"
        state[content_id]["updated_at"] = datetime.now(timezone.utc).isoformat()
        state[content_id]["metrics_summary"] = {
            "impressions": metrics.get("impressions", 0),
            "engagement_rate": metrics.get("engagement_rate", 0),
        }
        tmp = STATE_FILE.with_suffix('.tmp')
        tmp.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding='utf-8')
        tmp.replace(STATE_FILE)


def get_analytics_file(content_id: str) -> Path:
    """Get the analytics file path for a content_id."""
    return ANALYTICS_DIR / f"content_analytics_{content_id}.json"


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description="Content Analytics")
    parser.add_argument("content_id", help="Content ID to fetch analytics for")
    parser.add_argument("--platform", default="linkedin",
                        choices=["linkedin", "twitter", "blog"],
                        help="Platform (default: linkedin)")
    parser.add_argument("--fetch", action="store_true", help="Fetch analytics")
    parser.add_argument("--force", action="store_true", help="Force refresh")
    parser.add_argument("--dry-run", action="store_true", help="Dry run")
    parser.add_argument("--verbose", "-v", action="store_true", help="Debug output")
    parser.add_argument("--test", action="store_true", help="Smoke test mode")
    args = parser.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    if args.test:
        logger.info("Smoke test: content_analytics OK")
        result = fetch_analytics("test_content_001", "linkedin")
        print(json.dumps(result, indent=2))
        return 0

    if not args.fetch:
        # Check if analytics exist
        f = get_analytics_file(args.content_id)
        if f.exists():
            print(f.read_text(encoding='utf-8'))
        else:
            print(f"No analytics found for {args.content_id}. Use --fetch to generate.")
        return 0

    if args.dry_run:
        logger.info("DRY RUN: Would fetch analytics")
        return 0

    result = fetch_analytics(args.content_id, args.platform, force_refresh=args.force)
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
