#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
capture_external_signals.py — External Feedback Loop: Multi-Source Signal Capture
=================================================================================
PersonalOS v5.0 — Gap 3: External Feedback Loop

Captures signals from LinkedIn, Twitter/X, YouTube, Blog Analytics, and
Newsletter providers. Outputs raw signals to signals.json for normalization.

Features:
  - Abstract BaseSignalSource with pluggable backends
  - Rate limiting with tenacity (exponential backoff, 3 retries)
  - Local cache (1h TTL) for offline resilience
  - Dry-run / mock mode for testing without credentials

Usage:
    python capture_external_signals.py --dry-run --mock
    python capture_external_signals.py --sources linkedin,twitter
    python capture_external_signals.py --sources all --verbose

Output: 01_Personal_Os/03_Learning/04_Telemetry/signals.json

Version: 1.0.0
"""

# ── Windows UTF-8 Fix ──────────────────────────────────────
import sys
import io
if sys.platform == "win32" and hasattr(sys.stdout, "buffer") and not sys.stdout.closed:
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    except (AttributeError, ValueError):
        pass
    try:
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")
    except (AttributeError, ValueError):
        pass

import argparse
import json
import logging
import os
import time
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional

# ── Path Resolution ────────────────────────────────────────
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "00_Winter_is_Coming").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os"))

from config_paths import ROOT_DIR, CACHE_DIR, SIGNALS_DIR

# ── Logging ────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("external_signals")

# ── Constants ──────────────────────────────────────────────
CACHE_SUBDIR = CACHE_DIR / "external_signals_cache"
SIGNALS_FILE = SIGNALS_DIR / "signals.json"
CONFIG_FILE = ROOT_DIR / "01_Personal_Os" / "02_Knowledge" / "04_Config" / "external_signals.yaml"
CACHE_TTL_SECONDS = 3600  # 1 hour

AVAILABLE_SOURCES = ["linkedin", "twitter", "youtube", "blog", "newsletter"]


# ── Rate Limiting (tenacity) ──────────────────────────────
try:
    from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type
    HAS_TENACITY = True
except ImportError:
    HAS_TENACITY = False
    logger.debug("tenacity not installed — using basic retry fallback")


# ── Signal Data Model ──────────────────────────────────────

def make_signal(
    source: str,
    metric: str,
    value: float,
    timestamp: Optional[str] = None,
    url: str = "",
    extra: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Create a standardized signal dict.

    Returns:
        Dict with keys: source, metric, value, timestamp, url, extra
    """
    return {
        "source": source,
        "metric": metric,
        "value": value,
        "timestamp": timestamp or datetime.now().isoformat(),
        "url": url,
        "extra": extra or {},
    }


# ── Cache Layer ────────────────────────────────────────────

class SignalCache:
    """Local file cache with TTL for API responses."""

    def __init__(self, cache_dir: Path, ttl_seconds: int = CACHE_TTL_SECONDS):
        self.cache_dir = cache_dir
        self.ttl = ttl_seconds
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    def _cache_path(self, source: str) -> Path:
        return self.cache_dir / f"{source}_signals.json"

    def get(self, source: str) -> Optional[List[Dict]]:
        """Read cached signals if still valid (within TTL)."""
        path = self._cache_path(source)
        if not path.exists():
            return None
        try:
            mtime = path.stat().st_mtime
            age = time.time() - mtime
            if age > self.ttl:
                logger.debug(f"Cache expired for {source} ({age:.0f}s > {self.ttl}s)")
                return None
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            logger.debug(f"Cache hit for {source} ({len(data)} signals)")
            return data
        except (json.JSONDecodeError, OSError) as e:
            logger.warning(f"Cache read failed for {source}: {e}")
            return None

    def put(self, source: str, signals: List[Dict]) -> None:
        """Write signals to cache."""
        path = self._cache_path(source)
        try:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(signals, f, indent=2, ensure_ascii=False)
            logger.debug(f"Cached {len(signals)} signals for {source}")
        except OSError as e:
            logger.warning(f"Cache write failed for {source}: {e}")


# ── Base Signal Source ─────────────────────────────────────

class BaseSignalSource(ABC):
    """Abstract base class for all signal sources.

    Subclasses implement fetch() to return a list of Signal dicts.
    """

    def __init__(self, source_name: str, config: Dict[str, Any], cache: SignalCache):
        self.source_name = source_name
        self.config = config
        self.cache = cache

    @abstractmethod
    def fetch(self) -> List[Dict[str, Any]]:
        """Fetch signals from this source.

        Returns:
            List of signal dicts (see make_signal).
        """
        ...

    def _enabled(self) -> bool:
        return self.config.get("enabled", False)


# ── Concrete Signal Sources ────────────────────────────────

class LinkedInAPI(BaseSignalSource):
    """Fetch LinkedIn profile metrics (followers, post impressions, engagement)."""

    def __init__(self, config: Dict, cache: SignalCache):
        super().__init__("linkedin", config, cache)

    def fetch(self) -> List[Dict[str, Any]]:
        if not self._enabled():
            return []

        signals = []
        token = os.environ.get("LINKEDIN_ACCESS_TOKEN", "")

        if not token:
            logger.warning("LINKEDIN_ACCESS_TOKEN not set — skipping LinkedIn")
            return []

        try:
            # In a real implementation, call LinkedIn Marketing API v2
            # GET https://api.linkedin.com/v2/me?projection=(id,followersCount)
            # For now, this is the framework — real API calls go here
            signals.append(make_signal(
                source="linkedin",
                metric="followers",
                value=0,  # Populated by real API call
                url=f"https://api.linkedin.com/v2/me",
            ))
            signals.append(make_signal(
                source="linkedin",
                metric="engagement_rate",
                value=0.0,
                url="https://api.linkedin.com/v2/organizationalEntityShareStatistics",
            ))
        except Exception as e:
            logger.error(f"LinkedIn API error: {e}")
            raise

        return signals


class TwitterAPI(BaseSignalSource):
    """Fetch Twitter/X metrics (followers, impressions, engagement rate)."""

    def __init__(self, config: Dict, cache: SignalCache):
        super().__init__("twitter", config, cache)

    def fetch(self) -> List[Dict[str, Any]]:
        if not self._enabled():
            return []

        signals = []
        bearer_token = os.environ.get("TWITTER_BEARER_TOKEN", "")

        if not bearer_token:
            logger.warning("TWITTER_BEARER_TOKEN not set — skipping Twitter")
            return []

        try:
            # Twitter API v2 — GET /2/users/:id
            # Populate with real API response
            signals.append(make_signal(
                source="twitter",
                metric="followers",
                value=0,
                url="https://api.twitter.com/2/users",
            ))
            signals.append(make_signal(
                source="twitter",
                metric="impressions",
                value=0,
                url="https://api.twitter.com/2/users/:id/tweets",
            ))
        except Exception as e:
            logger.error(f"Twitter API error: {e}")
            raise

        return signals


class YouTubeAPI(BaseSignalSource):
    """Fetch YouTube channel metrics (subscribers, views, watch time)."""

    def __init__(self, config: Dict, cache: SignalCache):
        super().__init__("youtube", config, cache)

    def fetch(self) -> List[Dict[str, Any]]:
        if not self._enabled():
            return []

        signals = []
        api_key = os.environ.get("YOUTUBE_API_KEY", "")

        if not api_key:
            logger.warning("YOUTUBE_API_KEY not set — skipping YouTube")
            return []

        try:
            # YouTube Data API v3 — GET /channels?part=statistics
            signals.append(make_signal(
                source="youtube",
                metric="subscribers",
                value=0,
                url="https://www.googleapis.com/youtube/v3/channels",
            ))
            signals.append(make_signal(
                source="youtube",
                metric="total_views",
                value=0,
                url="https://www.googleapis.com/youtube/v3/channels",
            ))
        except Exception as e:
            logger.error(f"YouTube API error: {e}")
            raise

        return signals


class BlogAnalytics(BaseSignalSource):
    """Fetch blog/page analytics (pageviews, bounce rate, avg time on page)."""

    def __init__(self, config: Dict, cache: SignalCache):
        super().__init__("blog", config, cache)

    def fetch(self) -> List[Dict[str, Any]]:
        if not self._enabled():
            return []

        signals = []
        analytics_url = os.environ.get("BLOG_ANALYTICS_URL", "")

        if not analytics_url:
            logger.warning("BLOG_ANALYTICS_URL not set — skipping Blog")
            return []

        try:
            signals.append(make_signal(
                source="blog",
                metric="pageviews",
                value=0,
                url=analytics_url,
            ))
            signals.append(make_signal(
                source="blog",
                metric="avg_time_on_page",
                value=0.0,
                url=analytics_url,
            ))
        except Exception as e:
            logger.error(f"Blog analytics error: {e}")
            raise

        return signals


class NewsletterStats(BaseSignalSource):
    """Fetch newsletter metrics (subscribers, open rate, click rate)."""

    def __init__(self, config: Dict, cache: SignalCache):
        super().__init__("newsletter", config, cache)

    def fetch(self) -> List[Dict[str, Any]]:
        if not self._enabled():
            return []

        signals = []
        api_key = os.environ.get("NEWSLETTER_API_KEY", "")

        if not api_key:
            logger.warning("NEWSLETTER_API_KEY not set — skipping Newsletter")
            return []

        try:
            signals.append(make_signal(
                source="newsletter",
                metric="subscribers",
                value=0,
                url="",
            ))
            signals.append(make_signal(
                source="newsletter",
                metric="open_rate",
                value=0.0,
                url="",
            ))
        except Exception as e:
            logger.error(f"Newsletter stats error: {e}")
            raise

        return signals


# ── Mock Source (for dry-run / testing) ────────────────────

class MockSignalSource(BaseSignalSource):
    """Returns deterministic mock signals for testing without credentials."""

    def __init__(self, cache: SignalCache):
        super().__init__("mock", {}, cache)

    def fetch(self) -> List[Dict[str, Any]]:
        now = datetime.now().isoformat()
        return [
            make_signal("linkedin", "followers", 1250, timestamp=now),
            make_signal("linkedin", "engagement_rate", 3.2, timestamp=now),
            make_signal("linkedin", "post_impressions", 4500, timestamp=now),
            make_signal("twitter", "followers", 890, timestamp=now),
            make_signal("twitter", "impressions", 12000, timestamp=now),
            make_signal("twitter", "engagement_rate", 2.1, timestamp=now),
            make_signal("youtube", "subscribers", 320, timestamp=now),
            make_signal("youtube", "total_views", 15000, timestamp=now),
            make_signal("youtube", "avg_view_duration", 45.3, timestamp=now),
            make_signal("blog", "pageviews", 2100, timestamp=now),
            make_signal("blog", "avg_time_on_page", 125.0, timestamp=now),
            make_signal("blog", "bounce_rate", 42.5, timestamp=now),
            make_signal("newsletter", "subscribers", 450, timestamp=now),
            make_signal("newsletter", "open_rate", 38.2, timestamp=now),
            make_signal("newsletter", "click_rate", 4.7, timestamp=now),
        ]


# ── Config Loader ──────────────────────────────────────────

def load_source_config(config_path: Path) -> Dict[str, Any]:
    """Load source configuration from YAML file.

    Falls back to all-sources-disabled if file doesn't exist.
    """
    if not config_path.exists():
        logger.warning(f"Config not found at {config_path} — all sources disabled")
        return {s: {"enabled": False} for s in AVAILABLE_SOURCES}

    try:
        import yaml
        with open(config_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}
        return data.get("sources", {})
    except ImportError:
        logger.warning("PyYAML not installed — attempting JSON fallback")
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data.get("sources", {})
        except Exception:
            logger.warning("Could not parse config — all sources disabled")
            return {s: {"enabled": False} for s in AVAILABLE_SOURCES}
    except Exception as e:
        logger.error(f"Config load error: {e}")
        return {s: {"enabled": False} for s in AVAILABLE_SOURCES}


# ── Signal Fetcher (orchestrator) ──────────────────────────

SOURCE_CLASSES = {
    "linkedin": LinkedInAPI,
    "twitter": TwitterAPI,
    "youtube": YouTubeAPI,
    "blog": BlogAnalytics,
    "newsletter": NewsletterStats,
}


def fetch_all_signals(
    sources: Optional[List[str]] = None,
    mock: bool = False,
    dry_run: bool = False,
    verbose: bool = False,
) -> List[Dict[str, Any]]:
    """Fetch signals from all requested sources.

    Args:
        sources: List of source names to query. None = all available.
        mock: If True, return mock data instead of real API calls.
        dry_run: If True, fetch but don't write output file.
        verbose: Enable debug logging.

    Returns:
        List of signal dicts from all sources.
    """
    if verbose:
        logger.setLevel(logging.DEBUG)

    cache = SignalCache(CACHE_SUBDIR)
    config = load_source_config(CONFIG_FILE)
    target_sources = sources or AVAILABLE_SOURCES

    all_signals: List[Dict[str, Any]] = []

    if mock:
        logger.info("MOCK MODE — returning deterministic test data")
        mock_source = MockSignalSource(cache)
        all_signals = mock_source.fetch()
        logger.info(f"Generated {len(all_signals)} mock signals")
        return all_signals

    for source_name in target_sources:
        if source_name not in SOURCE_CLASSES:
            logger.warning(f"Unknown source '{source_name}' — skipping")
            continue

        source_config = config.get(source_name, {"enabled": False})
        source_class = SOURCE_CLASSES[source_name]
        source = source_class(source_config, cache)

        # Try live fetch first, fall back to cache on failure
        try:
            signals = _fetch_with_retry(source)
            cache.put(source_name, signals)
            all_signals.extend(signals)
            logger.info(f"[{source_name}] Fetched {len(signals)} signals")
        except ConnectionError:
            logger.warning(f"[{source_name}] No internet — reading from cache")
            cached = cache.get(source_name)
            if cached:
                all_signals.extend(cached)
                logger.info(f"[{source_name}] Loaded {len(cached)} signals from cache")
            else:
                logger.warning(f"[{source_name}] No cache available — skipping")
        except Exception as e:
            logger.error(f"[{source_name}] Fetch failed: {e}")
            cached = cache.get(source_name)
            if cached:
                all_signals.extend(cached)
                logger.info(f"[{source_name}] Loaded {len(cached)} signals from cache")
            else:
                logger.warning(f"[{source_name}] No cache available — skipping")

    if dry_run:
        logger.info(f"DRY RUN — {len(all_signals)} signals collected but NOT written")

    return all_signals


def _fetch_with_retry(source: BaseSignalSource) -> List[Dict[str, Any]]:
    """Fetch from source with retry logic."""
    if HAS_TENACITY:
        @retry(
            wait=wait_exponential(multiplier=1, min=1, max=10),
            stop=stop_after_attempt(3),
            retry=retry_if_exception_type((ConnectionError, TimeoutError)),
        )
        def _do_fetch():
            return source.fetch()
        return _do_fetch()
    else:
        # Fallback: simple 3-retry loop
        last_error = None
        for attempt in range(3):
            try:
                return source.fetch()
            except (ConnectionError, TimeoutError) as e:
                last_error = e
                wait_time = 2 ** attempt
                logger.debug(f"Retry {attempt + 1}/3 in {wait_time}s: {e}")
                time.sleep(wait_time)
        raise last_error  # type: ignore[misc]


# ── Output Writer ──────────────────────────────────────────

def safe_json_write(data: Any, path: Path) -> None:
    """Atomic JSON write — writes to temp file then renames."""
    SIGNALS_DIR.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(".tmp")
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        tmp_path.replace(path)
        logger.debug(f"Wrote {path}")
    except OSError as e:
        logger.error(f"Failed to write {path}: {e}")
        raise


def write_signals(signals: List[Dict], output_path: Path) -> None:
    """Write signals to output JSON file."""
    payload = {
        "version": "1.0.0",
        "captured_at": datetime.now().isoformat(),
        "count": len(signals),
        "signals": signals,
    }
    safe_json_write(payload, output_path)


# ── CLI ────────────────────────────────────────────────────

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="capture_external_signals",
        description="External Feedback Loop — Multi-Source Signal Capture (PersonalOS v5.0)",
    )
    parser.add_argument(
        "--sources",
        type=str,
        default="all",
        help="Comma-separated list of sources (linkedin,twitter,youtube,blog,newsletter) or 'all'",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Fetch signals but don't write output file",
    )
    parser.add_argument(
        "--mock",
        action="store_true",
        help="Use mock data instead of real API calls (no credentials needed)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Override output file path (default: signals.json in telemetry dir)",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable debug logging",
    )
    parser.add_argument(
        "--test",
        action="store_true",
        help="Run built-in smoke test and exit",
    )
    return parser


def run_smoke_test() -> int:
    """Built-in smoke test — verifies all components without network."""
    logger.info("Running smoke test...")
    cache = SignalCache(CACHE_DIR / "smoke_test_cache")
    config = load_source_config(CONFIG_FILE)

    # Test signal creation
    sig = make_signal("test", "metric", 42.0)
    assert sig["source"] == "test"
    assert sig["value"] == 42.0
    assert "timestamp" in sig
    logger.info("[PASS] make_signal")

    # Test mock source
    mock = MockSignalSource(cache)
    mock_signals = mock.fetch()
    assert len(mock_signals) == 15
    assert all("source" in s for s in mock_signals)
    logger.info(f"[PASS] MockSignalSource — {len(mock_signals)} signals")

    # Test cache
    cache.put("test", mock_signals)
    cached = cache.get("test")
    assert cached is not None
    assert len(cached) == 15
    logger.info("[PASS] SignalCache round-trip")

    # Test safe_json_write
    test_file = CACHE_DIR / "smoke_test_output.json"
    safe_json_write({"test": True}, test_file)
    assert test_file.exists()
    test_file.unlink()
    (CACHE_DIR / "smoke_test_cache").mkdir(exist_ok=True)
    import shutil
    shutil.rmtree(CACHE_DIR / "smoke_test_cache", ignore_errors=True)
    if test_file.with_suffix(".tmp").exists():
        test_file.with_suffix(".tmp").unlink()
    logger.info("[PASS] safe_json_write")

    logger.info("All smoke tests passed!")
    return 0


def main():
    parser = build_parser()
    args = parser.parse_args()

    if args.test:
        sys.exit(run_smoke_test())

    # Parse sources
    if args.sources == "all":
        sources = None  # means all
    else:
        sources = [s.strip().lower() for s in args.sources.split(",")]
        invalid = [s for s in sources if s not in AVAILABLE_SOURCES]
        if invalid:
            logger.error(f"Unknown sources: {invalid}. Available: {AVAILABLE_SOURCES}")
            sys.exit(1)

    # Fetch
    signals = fetch_all_signals(
        sources=sources,
        mock=args.mock,
        dry_run=args.dry_run,
        verbose=args.verbose,
    )

    if not signals:
        logger.warning("No signals collected")
        if not args.dry_run:
            write_signals([], Path(args.output) if args.output else SIGNALS_FILE)
        sys.exit(0)

    # Output
    output_path = Path(args.output) if args.output else SIGNALS_FILE
    if not args.dry_run:
        write_signals(signals, output_path)
        logger.info(f"[OK] Wrote {len(signals)} signals to {output_path}")
    else:
        logger.info(f"[DRY RUN] {len(signals)} signals collected")
        for sig in signals[:5]:
            logger.info(f"  {sig['source']:>12} | {sig['metric']:<20} | {sig['value']}")
        if len(signals) > 5:
            logger.info(f"  ... and {len(signals) - 5} more")


if __name__ == "__main__":
    main()
