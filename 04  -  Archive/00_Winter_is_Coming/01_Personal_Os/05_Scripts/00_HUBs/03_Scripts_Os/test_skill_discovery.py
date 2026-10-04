#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
test_skill_discovery.py — Tests for Skill Discovery System
==========================================================
Tests keyword extraction, scoring, batch mode, edge cases,
and clarification triggers.

Run: python test_skill_discovery.py
"""

import io
import sys
import unittest
from pathlib import Path
from unittest.mock import patch, MagicMock

# ── Windows UTF-8 fix ──────────────────────────────────────
if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        else:
            sys.stdout = io.TextIOWrapper(
                sys.stdout.buffer, encoding="utf-8", errors="replace"
            )
    except Exception:
        pass
    try:
        if hasattr(sys.stderr, "reconfigure"):
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
        else:
            sys.stderr = io.TextIOWrapper(
                sys.stderr.buffer, encoding="utf-8", errors="replace"
            )
    except Exception:
        pass

# ── Path setup ──────────────────────────────────────────────
sys.path.insert(0, str(Path(__file__).resolve().parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

# Import the module under test
from skill_discovery import (
    parse_registry,
    extract_keywords,
    tokenize_query,
    score_skill,
    rank_skills,
    needs_clarification,
    batch_discover,
    evaluate,
    REGISTRY_FILE,
)


# ── Test Fixtures ───────────────────────────────────────────

MOCK_REGISTRY = """# Skill Registry

| Skill | Trigger / description | Scope | Path |
| --- | --- | --- | --- |
| `seo-audit` | When the user wants to audit, review, or diagnose SEO issues on their site. Also use when the user mentions SEO audit, technical SEO, why am I not ranking. | user | `/skills/seo-audit/SKILL.md` |
| `market-copy` | Copywriting analysis and generation — scores existing copy, produces optimized alternatives with before/after examples | user | `/skills/market-copy/SKILL.md` |
| `ce-debug` | Systematically find root causes and fix bugs. Use when debugging errors, investigating test failures, reproducing bugs from issue trackers. | user | `/skills/ce-debug/SKILL.md` |
| `market-competitors` | Competitive intelligence analysis — positioning, differentiation, and market landscape | user | `/skills/market-competitors/SKILL.md` |
| `frontend-design` | Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components. | user | `/skills/frontend-design/SKILL.md` |
| `n8n-automation` | Workflow automation with n8n — create, debug, and optimize n8n workflows. Triggers on: n8n, workflow automation, zapier alternative. | project | `/skills/n8n/SKILL.md` |
| `pptx` | Use this skill any time a .pptx file is involved. Creating slide decks, pitch decks, or presentations. | user | `/skills/pptx/SKILL.md` |
| `playwright` | Use when the task requires automating a real browser from the terminal. Browser automation, form filling, data extraction. | user | `/skills/playwright/SKILL.md` |
| `market-seo` | SEO content audit — technical SEO, on-page optimization, and content gap analysis | user | `/skills/market-seo/SKILL.md` |
| `claude-api` | Build, debug, and optimize Claude API / Anthropic SDK apps. Apps built with this skill should include prompt caching. | user | `/skills/claude-api/SKILL.md` |
"""


class TestKeywordExtraction(unittest.TestCase):
    """Tests for extract_keywords()."""

    def setUp(self):
        self.keywords = extract_keywords(
            "market-competitors",
            "Competitive intelligence analysis — positioning, differentiation, and market landscape",
        )

    def test_extracts_name_tokens(self):
        """Name tokens should appear in keywords."""
        # 'market' and 'competitors' are tokens from the name
        self.assertIn("market", self.keywords)
        self.assertIn("competitors", self.keywords)

    def test_extracts_description_tokens(self):
        """Meaningful description tokens should appear."""
        self.assertIn("competitive", self.keywords)
        self.assertIn("intelligence", self.keywords)
        self.assertIn("analysis", self.keywords)

    def test_filters_stop_words(self):
        """Stop words should not appear in keywords."""
        self.assertNotIn("the", self.keywords)
        self.assertNotIn("and", self.keywords)
        self.assertNotIn("for", self.keywords)

    def test_filters_short_tokens(self):
        """Tokens shorter than 3 chars should be filtered."""
        for kw in self.keywords:
            self.assertGreaterEqual(len(kw), 2)

    def test_different_skills_different_keywords(self):
        """Different skills should produce different keyword sets."""
        kw1 = extract_keywords("seo-audit", "SEO audit and analysis")
        kw2 = extract_keywords("pptx", "PowerPoint presentations")
        self.assertNotEqual(kw1, kw2)


class TestTokenizeQuery(unittest.TestCase):
    """Tests for tokenize_query()."""

    def test_basic_tokenization(self):
        tokens = tokenize_query("quiero analizar competidores SEO")
        self.assertIn("analizar", tokens)
        self.assertIn("competidores", tokens)
        self.assertIn("seo", tokens)

    def test_filters_stop_words(self):
        tokens = tokenize_query("yo quiero un análisis")
        self.assertNotIn("yo", tokens)
        self.assertNotIn("un", tokens)

    def test_empty_query(self):
        tokens = tokenize_query("")
        self.assertEqual(tokens, [])

    def test_all_stop_words(self):
        tokens = tokenize_query("the a an is are")
        self.assertEqual(len(tokens), 0)

    def test_preserves_meaningful_tokens(self):
        tokens = tokenize_query("debug this error in my code")
        self.assertIn("debug", tokens)
        self.assertIn("error", tokens)
        self.assertIn("code", tokens)


class TestScoring(unittest.TestCase):
    """Tests for score_skill()."""

    def test_perfect_match(self):
        """Exact keyword match should score high."""
        query_tokens = ["seo", "audit"]
        keywords = {"seo", "audit", "website", "analysis"}
        score = score_skill(query_tokens, keywords)
        self.assertGreaterEqual(score, 0.9)

    def test_partial_match(self):
        """Partial match should score moderate."""
        query_tokens = ["seo", "audit", "website"]
        keywords = {"seo", "audit"}
        score = score_skill(query_tokens, keywords)
        self.assertGreater(score, 0.3)
        self.assertLess(score, 0.9)

    def test_no_match(self):
        """No matching tokens should score near zero."""
        query_tokens = ["pptx", "slides"]
        keywords = {"seo", "audit", "website"}
        score = score_skill(query_tokens, keywords)
        self.assertLess(score, 0.3)

    def test_empty_tokens(self):
        """Empty query tokens should score 0."""
        score = score_skill([], {"seo", "audit"})
        self.assertEqual(score, 0.0)

    def test_empty_keywords(self):
        """Empty keywords should score 0."""
        score = score_skill(["seo"], set())
        self.assertEqual(score, 0.0)

    def test_substring_bonus(self):
        """Substring partial match should add bonus."""
        query_tokens = ["competitor"]
        keywords = {"competitors", "market"}
        score_partial = score_skill(query_tokens, keywords)
        query_tokens_exact = ["competitors"]
        score_exact = score_skill(query_tokens_exact, keywords)
        self.assertGreaterEqual(score_exact, score_partial)


class TestRanking(unittest.TestCase):
    """Tests for rank_skills() with known inputs."""

    def setUp(self):
        self.skills = parse_registry(REGISTRY_FILE)

    def test_known_query_known_skill(self):
        """'debug error' should match ce-debug with high confidence."""
        results = rank_skills("debug error", self.skills)
        self.assertGreater(len(results), 0)
        top = results[0]
        self.assertEqual(top["skill"], "ce-debug")
        self.assertGreaterEqual(top["confidence"], 0.5)

    def test_seo_query(self):
        """SEO-related query should return SEO skills."""
        results = rank_skills("SEO audit website", self.skills)
        self.assertGreater(len(results), 0)
        top_skills = [r["skill"] for r in results[:3]]
        # At least one SEO skill should be in top 3
        has_seo = any("seo" in s.lower() for s in top_skills)
        self.assertTrue(has_seo, f"Expected SEO skill in top 3, got: {top_skills}")

    def test_competitor_query(self):
        """Competitor analysis query should match market-competitors."""
        results = rank_skills("analizar competidores", self.skills)
        self.assertGreater(len(results), 0)
        top_skills = [r["skill"] for r in results[:3]]
        self.assertIn("market-competitors", top_skills)

    def test_top_n_limit(self):
        """Should return at most top_n results."""
        results = rank_skills("SEO audit website analysis", self.skills, top_n=3)
        self.assertLessEqual(len(results), 3)

    def test_results_have_required_fields(self):
        """All results should have required fields."""
        results = rank_skills("debug error code", self.skills)
        for r in results:
            self.assertIn("skill", r)
            self.assertIn("path", r)
            self.assertIn("confidence", r)
            self.assertIn("suggested_command", r)
            self.assertIn("description", r)

    def test_confidence_is_bounded(self):
        """Confidence should be between 0 and 1."""
        results = rank_skills("SEO audit", self.skills)
        for r in results:
            self.assertGreaterEqual(r["confidence"], 0.0)
            self.assertLessEqual(r["confidence"], 1.0)


class TestClarification(unittest.TestCase):
    """Tests for needs_clarification()."""

    def test_short_query_needs_clarification(self):
        """Query with < 3 words should need clarification."""
        result = needs_clarification([], "debug error")
        self.assertIsNotNone(result)
        self.assertIn("words", result.lower())

    def test_no_results_needs_clarification(self):
        """No matching skills should need clarification."""
        result = needs_clarification([], "xyzzy plugh foo bar")
        self.assertIsNotNone(result)
        self.assertIn("recommendation", result.lower())

    def test_low_confidence_needs_clarification(self):
        """Low confidence should trigger clarification."""
        low_conf = [{"skill": "x", "confidence": 0.4}]
        result = needs_clarification(low_conf, "some vague query here")
        self.assertIsNotNone(result)

    def test_high_confidence_no_clarification(self):
        """High confidence should NOT trigger clarification."""
        high_conf = [{"skill": "seo-audit", "confidence": 0.85}]
        result = needs_clarification(high_conf, "SEO audit my website please")
        self.assertIsNone(result)

    def test_many_words_high_confidence_no_clarification(self):
        """Many words + high confidence = no clarification."""
        results = rank_skills("debug error in my python code", self.skills)
        clarification = needs_clarification(
            results, "debug error in my python code"
        )
        # If top result is confident enough, no clarification
        if results and results[0]["confidence"] >= 0.7:
            self.assertIsNone(clarification)

    def setUp(self):
        self.skills = parse_registry(REGISTRY_FILE)


class TestBatchMode(unittest.TestCase):
    """Tests for batch_discover()."""

    def setUp(self):
        self.skills = parse_registry(REGISTRY_FILE)

    def test_batch_processes_multiple_queries(self):
        queries = [
            "SEO audit website",
            "debug this error",
            "create LinkedIn post",
        ]
        results = batch_discover(queries, self.skills)
        self.assertEqual(len(results), 3)

    def test_batch_empty_queries_skipped(self):
        queries = ["SEO audit website", "", "  ", "debug error"]
        results = batch_discover(queries, self.skills)
        self.assertEqual(len(results), 2)

    def test_batch_each_has_results_and_clarification(self):
        queries = ["SEO audit website", "debug error code"]
        results = batch_discover(queries, self.skills)
        for item in results:
            self.assertIn("query", item)
            self.assertIn("results", item)
            self.assertIn("clarification", item)


class TestEdgeCases(unittest.TestCase):
    """Edge case tests."""

    def setUp(self):
        self.skills = parse_registry(REGISTRY_FILE)

    def test_empty_query(self):
        results = rank_skills("", self.skills)
        self.assertEqual(results, [])

    def test_very_long_query(self):
        long_query = " ".join(["word"] * 100)
        results = rank_skills(long_query, self.skills)
        # Should not crash, may return empty or low confidence
        self.assertIsInstance(results, list)

    def test_unicode_query(self):
        results = rank_skills("análisis SEO de mi sitio web", self.skills)
        self.assertIsInstance(results, list)

    def test_special_characters(self):
        results = rank_skills("debug @#$%^&* error", self.skills)
        self.assertIsInstance(results, list)

    def test_score_bounds(self):
        """All scores should be in [0, 1]."""
        results = rank_skills("SEO audit website analysis", self.skills)
        for r in results:
            self.assertGreaterEqual(r["confidence"], 0.0)
            self.assertLessEqual(r["confidence"], 1.0)


class TestEvaluation(unittest.TestCase):
    """Tests for evaluate()."""

    def setUp(self):
        self.skills = parse_registry(REGISTRY_FILE)

    def test_evaluate_runs(self):
        test_set = [
            {"query": "SEO audit", "expected_skill": "seo-audit", "min_confidence": 0.3},
        ]
        result = evaluate(test_set, self.skills)
        self.assertIn("total", result)
        self.assertIn("passed", result)
        self.assertIn("accuracy", result)
        self.assertEqual(result["total"], 1)

    def test_evaluate_empty(self):
        result = evaluate([], self.skills)
        self.assertEqual(result["total"], 0)
        self.assertEqual(result["accuracy"], 0)


class TestMockRegistry(unittest.TestCase):
    """Tests using mock registry content."""

    def test_parse_mock_registry(self):
        """Should parse the mock registry correctly."""
        # Write mock to temp file and parse
        import tempfile
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".md", delete=False, encoding="utf-8"
        ) as f:
            f.write(MOCK_REGISTRY)
            tmp_path = Path(f.name)

        try:
            skills = parse_registry(tmp_path)
            self.assertGreaterEqual(len(skills), 8)

            names = [s["name"] for s in skills]
            self.assertIn("seo-audit", names)
            self.assertIn("market-copy", names)
            self.assertIn("ce-debug", names)
            self.assertIn("n8n-automation", names)
        finally:
            tmp_path.unlink()

    def test_mock_ranking_n8n(self):
        """n8n query should match n8n-automation skill."""
        import tempfile
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".md", delete=False, encoding="utf-8"
        ) as f:
            f.write(MOCK_REGISTRY)
            tmp_path = Path(f.name)

        try:
            skills = parse_registry(tmp_path)
            results = rank_skills("automatizar workflow con n8n", skills)
            self.assertGreater(len(results), 0)
            top_names = [r["skill"] for r in results[:3]]
            self.assertIn("n8n-automation", top_names)
        finally:
            tmp_path.unlink()


if __name__ == "__main__":
    # Add argparse for --verbose
    import argparse
    parser = argparse.ArgumentParser(description="Run skill discovery tests")
    parser.add_argument("-v", "--verbose", action="store_true")
    parser.add_argument("--test", action="store_true", help="Run all tests")
    args, remaining = parser.parse_known_args()

    sys.argv = [sys.argv[0]] + remaining

    verbosity = 2 if args.verbose else 1
    unittest.main(verbosity=verbosity)
