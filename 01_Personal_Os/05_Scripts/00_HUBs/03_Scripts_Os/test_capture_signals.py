#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
test_capture_signals.py — Unit Tests for External Feedback Loop
================================================================
Mock-based tests for signal capture, normalization, and dashboard.
No real API calls — all network operations are mocked.

Usage:
    python test_capture_signals.py
    python test_capture_signals.py -v

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

import json
import os
import tempfile
import unittest
from datetime import datetime
from pathlib import Path
from unittest.mock import MagicMock, patch

# ── Path Resolution ────────────────────────────────────────
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "00_Winter_is_Coming").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os"))

from config_paths import ROOT_DIR, SIGNALS_DIR

# ── Import modules under test ──────────────────────────────
import capture_external_signals as cap
import signal_normalizer as norm
import show_feedback_dashboard as dash


# ═══════════════════════════════════════════════════════════
# TEST: capture_external_signals
# ═══════════════════════════════════════════════════════════

class TestMakeSignal(unittest.TestCase):
    """Tests for the make_signal factory function."""

    def test_creates_signal_with_defaults(self):
        sig = cap.make_signal("linkedin", "followers", 100)
        self.assertEqual(sig["source"], "linkedin")
        self.assertEqual(sig["metric"], "followers")
        self.assertEqual(sig["value"], 100)
        self.assertIn("timestamp", sig)
        self.assertEqual(sig["url"], "")
        self.assertEqual(sig["extra"], {})

    def test_creates_signal_with_custom_fields(self):
        sig = cap.make_signal(
            "twitter", "impressions", 5000,
            timestamp="2026-07-14T10:00:00",
            url="https://api.twitter.com",
            extra={"retweets": 50},
        )
        self.assertEqual(sig["timestamp"], "2026-07-14T10:00:00")
        self.assertEqual(sig["url"], "https://api.twitter.com")
        self.assertEqual(sig["extra"]["retweets"], 50)

    def test_handles_unknown_fields_via_get(self):
        """New fields should use dict.get with defaults."""
        sig = cap.make_signal("test", "metric", 0)
        self.assertIsNone(sig.get("nonexistent_field"))
        self.assertEqual(sig.get("nonexistent_field", "default"), "default")


class TestSignalCache(unittest.TestCase):
    """Tests for the SignalCache class."""

    def setUp(self):
        self.tmp_dir = Path(tempfile.mkdtemp())
        self.cache = cap.SignalCache(self.tmp_dir, ttl_seconds=3600)

    def tearDown(self):
        import shutil
        shutil.rmtree(self.tmp_dir, ignore_errors=True)

    def test_round_trip(self):
        signals = [cap.make_signal("test", "m", 1.0)]
        self.cache.put("test_source", signals)
        result = self.cache.get("test_source")
        self.assertIsNotNone(result)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["source"], "test")

    def test_cache_miss_when_empty(self):
        result = self.cache.get("nonexistent")
        self.assertIsNone(result)

    def test_cache_expired(self):
        """Cache should return None when TTL is 0 (immediately expired)."""
        cache = cap.SignalCache(self.tmp_dir, ttl_seconds=0)
        cache.put("expired", [cap.make_signal("x", "y", 1)])
        result = cache.get("expired")
        self.assertIsNone(result)


class TestMockSignalSource(unittest.TestCase):
    """Tests for the MockSignalSource."""

    def setUp(self):
        self.tmp_dir = Path(tempfile.mkdtemp())
        self.cache = cap.SignalCache(self.tmp_dir)

    def tearDown(self):
        import shutil
        shutil.rmtree(self.tmp_dir, ignore_errors=True)

    def test_returns_15_signals(self):
        mock = cap.MockSignalSource(self.cache)
        signals = mock.fetch()
        self.assertEqual(len(signals), 15)

    def test_all_sources_represented(self):
        mock = cap.MockSignalSource(self.cache)
        signals = mock.fetch()
        sources = {s["source"] for s in signals}
        self.assertEqual(sources, {"linkedin", "twitter", "youtube", "blog", "newsletter"})

    def test_all_signals_have_required_fields(self):
        mock = cap.MockSignalSource(self.cache)
        signals = mock.fetch()
        for sig in signals:
            self.assertIn("source", sig)
            self.assertIn("metric", sig)
            self.assertIn("value", sig)
            self.assertIn("timestamp", sig)


class TestFetchAllSignals(unittest.TestCase):
    """Tests for the fetch_all_signals orchestrator."""

    def test_mock_mode_returns_signals(self):
        signals = cap.fetch_all_signals(mock=True)
        self.assertGreater(len(signals), 0)

    def test_disabled_source_returns_empty(self):
        config = {"linkedin": {"enabled": False}}
        source = cap.LinkedInAPI(config, cap.SignalCache(Path(tempfile.mkdtemp())))
        signals = source.fetch()
        self.assertEqual(signals, [])

    def test_missing_token_returns_empty(self):
        config = {"enabled": True}
        with patch.dict(os.environ, {"LINKEDIN_ACCESS_TOKEN": ""}, clear=False):
            source = cap.LinkedInAPI(config, cap.SignalCache(Path(tempfile.mkdtemp())))
            signals = source.fetch()
            self.assertEqual(signals, [])


class TestSafeJsonWrite(unittest.TestCase):
    """Tests for atomic JSON writing."""

    def setUp(self):
        self.tmp_dir = Path(tempfile.mkdtemp())

    def tearDown(self):
        import shutil
        shutil.rmtree(self.tmp_dir, ignore_errors=True)

    def test_atomic_write(self):
        path = self.tmp_dir / "test.json"
        cap.safe_json_write({"hello": "world"}, path)
        self.assertTrue(path.exists())
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.assertEqual(data["hello"], "world")

    def test_no_temp_file_leftbehind(self):
        path = self.tmp_dir / "clean.json"
        cap.safe_json_write({"x": 1}, path)
        tmp = path.with_suffix(".tmp")
        self.assertFalse(tmp.exists())


# ═══════════════════════════════════════════════════════════
# TEST: signal_normalizer
# ═══════════════════════════════════════════════════════════

class TestWinsorize(unittest.TestCase):
    """Tests for Winsorization function."""

    def test_basic_winsorize(self):
        vals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 100]
        result = norm.winsorize(vals, lower_pct=10, upper_pct=90)
        # With 10 elements, 90th percentile index=9 (last), so use stricter pct
        self.assertEqual(len(result), len(vals))
        self.assertLessEqual(max(result), max(vals))
        self.assertGreaterEqual(min(result), min(vals))
        # With 80th percentile, the outlier 100 should be capped
        result_80 = norm.winsorize(vals, lower_pct=10, upper_pct=80)
        self.assertLess(max(result_80), 100)

    def test_small_list_unchanged(self):
        vals = [5, 10]
        result = norm.winsorize(vals)
        self.assertEqual(result, vals)

    def test_empty_list(self):
        result = norm.winsorize([])
        self.assertEqual(result, [])


class TestNormalizeMinMax(unittest.TestCase):
    """Tests for min-max normalization."""

    def test_basic_normalization(self):
        result = norm.normalize_min_max([10, 20, 30])
        self.assertAlmostEqual(result[0], 0.0)
        self.assertAlmostEqual(result[1], 50.0)
        self.assertAlmostEqual(result[2], 100.0)

    def test_all_same_returns_midpoint(self):
        result = norm.normalize_min_max([5, 5, 5])
        self.assertTrue(all(v == 50.0 for v in result))

    def test_empty_input(self):
        self.assertEqual(norm.normalize_min_max([]), [])

    def test_single_value(self):
        result = norm.normalize_min_max([42])
        self.assertEqual(result, [50.0])


class TestSignalNormalizer(unittest.TestCase):
    """Tests for the SignalNormalizer class."""

    def setUp(self):
        self.normalizer = norm.SignalNormalizer()

    def test_normalizes_multiple_metrics(self):
        signals = [
            {"source": "a", "metric": "followers", "value": 100},
            {"source": "b", "metric": "followers", "value": 200},
            {"source": "c", "metric": "engagement_rate", "value": 3.0},
        ]
        result = self.normalizer.normalize(signals)
        self.assertEqual(len(result), 3)
        # followers: 100→0, 200→100
        followers = [r for r in result if r["metric"] == "followers"]
        followers_sorted = sorted(followers, key=lambda x: x["raw_value"])
        self.assertAlmostEqual(followers_sorted[0]["normalized_value"], 0.0)
        self.assertAlmostEqual(followers_sorted[1]["normalized_value"], 100.0)

    def test_empty_input(self):
        result = self.normalizer.normalize([])
        self.assertEqual(result, [])

    def test_preserves_original_fields(self):
        signals = [
            {"source": "x", "metric": "m", "value": 50, "url": "http://test.com"},
        ]
        result = self.normalizer.normalize(signals)
        self.assertEqual(result[0]["url"], "http://test.com")
        self.assertEqual(result[0]["raw_value"], 50)


class TestTrendCalculation(unittest.TestCase):
    """Tests for trend calculation."""

    def test_trend_up(self):
        current = [{"source": "a", "metric": "m", "normalized_value": 70.0}]
        previous = [{"source": "a", "metric": "m", "normalized_value": 40.0}]
        result = norm.calculate_trends(current, previous)
        self.assertEqual(result[0]["trend"], "up")

    def test_trend_down(self):
        current = [{"source": "a", "metric": "m", "normalized_value": 30.0}]
        previous = [{"source": "a", "metric": "m", "normalized_value": 60.0}]
        result = norm.calculate_trends(current, previous)
        self.assertEqual(result[0]["trend"], "down")

    def test_trend_flat_within_threshold(self):
        current = [{"source": "a", "metric": "m", "normalized_value": 50.0}]
        previous = [{"source": "a", "metric": "m", "normalized_value": 51.0}]
        result = norm.calculate_trends(current, previous)
        self.assertEqual(result[0]["trend"], "flat")

    def test_no_previous_data(self):
        current = [{"source": "a", "metric": "m", "normalized_value": 50.0}]
        result = norm.calculate_trends(current, None)
        self.assertEqual(result[0]["trend"], "flat")


# ═══════════════════════════════════════════════════════════
# TEST: show_feedback_dashboard
# ═══════════════════════════════════════════════════════════

class TestActionSuggestion(unittest.TestCase):
    """Tests for the suggest_action function."""

    def test_known_rule_engagement_down(self):
        action = dash.suggest_action("engagement_rate", "down", 30.0)
        self.assertIn("Revisar", action)

    def test_known_rule_open_rate_up(self):
        action = dash.suggest_action("open_rate", "up", 70.0)
        self.assertIn("Optimizar", action)

    def test_critical_value(self):
        action = dash.suggest_action("unknown_metric", "flat", 10.0)
        self.assertIn("Crítico", action)

    def test_excellent_value(self):
        action = dash.suggest_action("unknown_metric", "flat", 90.0)
        self.assertIn("Excelente", action)

    def test_default_trend_actions(self):
        self.assertIn("mantener", dash.suggest_action("x", "up", 50.0))
        self.assertIn("Investigar", dash.suggest_action("x", "down", 50.0))
        self.assertIn("no requiere", dash.suggest_action("x", "flat", 50.0).lower())


class TestRenderDashboard(unittest.TestCase):
    """Tests for the ASCII dashboard renderer."""

    def test_empty_signals_message(self):
        result = dash.render_ascii_dashboard([], {})
        self.assertIn("No signals captured yet", result)

    def test_renders_all_signals(self):
        signals = [
            {"source": "linkedin", "metric": "followers", "raw_value": 100,
             "normalized_value": 50.0, "trend": "up", "trend_pct": 5.0},
            {"source": "twitter", "metric": "impressions", "raw_value": 5000,
             "normalized_value": 80.0, "trend": "down", "trend_pct": -3.0},
        ]
        meta = {"captured_at": datetime.now().isoformat(), "trend_window_days": 7, "count": 2}
        result = dash.render_ascii_dashboard(signals, meta)
        self.assertIn("linkedin", result)
        self.assertIn("twitter", result)
        self.assertIn("followers", result)
        self.assertIn("impressions", result)

    def test_includes_top_bottom_five(self):
        signals = [
            {"source": f"s{i}", "metric": f"m{i}", "raw_value": i * 10,
             "normalized_value": float(i * 10), "trend": "flat", "trend_pct": 0.0}
            for i in range(10)
        ]
        meta = {"captured_at": "2026-07-14", "trend_window_days": 7, "count": 10}
        result = dash.render_ascii_dashboard(signals, meta)
        self.assertIn("TOP 5", result)
        self.assertIn("BOTTOM 5", result)

    def test_summary_stats(self):
        signals = [
            {"source": "a", "metric": "m", "raw_value": 1, "normalized_value": 20.0, "trend": "up"},
            {"source": "b", "metric": "m", "raw_value": 2, "normalized_value": 80.0, "trend": "down"},
            {"source": "c", "metric": "m", "raw_value": 3, "normalized_value": 50.0, "trend": "flat"},
        ]
        meta = {"captured_at": "2026-07-14", "trend_window_days": 7, "count": 3}
        result = dash.render_ascii_dashboard(signals, meta)
        self.assertIn("Subiendo", result)
        self.assertIn("Bajando", result)
        self.assertIn("Estable", result)


# ═══════════════════════════════════════════════════════════
# TEST: Integration (no network)
# ═══════════════════════════════════════════════════════════

class TestIntegrationPipeline(unittest.TestCase):
    """End-to-end test: mock capture → normalize → dashboard."""

    def test_full_pipeline(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp = Path(tmpdir)

            # Step 1: Capture mock signals
            signals = cap.fetch_all_signals(mock=True)
            self.assertGreater(len(signals), 0)

            # Write to temp signals.json
            signals_file = tmp / "signals.json"
            cap.safe_json_write({
                "version": "1.0.0",
                "captured_at": datetime.now().isoformat(),
                "count": len(signals),
                "signals": signals,
            }, signals_file)

            # Step 2: Normalize
            normalizer = norm.SignalNormalizer()
            raw = norm.load_signals(signals_file)
            normalized = normalizer.normalize(raw)
            normalized = norm.calculate_trends(normalized, None)
            self.assertEqual(len(normalized), len(signals))

            # Step 3: Dashboard
            dashboard = dash.render_ascii_dashboard(
                normalized,
                {"captured_at": datetime.now().isoformat(), "trend_window_days": 7, "count": len(normalized)},
            )
            self.assertIn("EXTERNAL FEEDBACK LOOP", dashboard)


if __name__ == "__main__":
    unittest.main(verbosity=2)
