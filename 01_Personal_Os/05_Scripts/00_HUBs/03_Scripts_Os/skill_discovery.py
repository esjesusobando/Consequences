#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
skill_discovery.py — Skill Discovery System (Gap 6)
====================================================
Natural-language query to skill recommendation engine.

Parses .atl/skill-registry.md, extracts keywords from each skill entry,
scores user queries against those keywords using TF-IDF-like scoring,
and returns ranked recommendations with confidence scores.

CLI modes:
  python skill_discovery.py "quiero analizar competidores SEO"
  python skill_discovery.py --interactive
  python skill_discovery.py --batch problems.txt --output results.csv
  python skill_discovery.py --eval test_set.json
"""

import io
import sys
import os
import re
import json
import csv
import argparse
import math
from pathlib import Path
from collections import Counter
from typing import Any

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

# ── Constants ───────────────────────────────────────────────
REGISTRY_FILE = ROOT_DIR / ".atl" / "skill-registry.md"
DISCOVERY_CACHE = CACHE_DIR / "skill_discovery_cache.json"

MIN_QUERY_WORDS = 3
HIGH_CONFIDENCE = 0.7
MIN_CONFIDENCE_THRESHOLD = 0.3

# Spanish → English term map for cross-language matching
ES_EN_MAP = {
    "analizar": "analysis",
    "competidores": "competitors",
    "competidor": "competitor",
    "analisis": "analysis",
    "analise": "analysis",
    "auditoria": "audit",
    "revisar": "review",
    "revisar": "audit",
    "sitio": "website",
    "web": "website",
    "sitio web": "website",
    "crear": "create",
    "crea": "create",
    "automatizar": "automate",
    "automatizacion": "automation",
    "debug": "debug",
    "depurar": "debug",
    "error": "error",
    "errores": "errors",
    "post": "post",
    "publicar": "publish",
    "linkedin": "linkedin",
    "seo": "seo",
    "marketing": "marketing",
    "contenido": "content",
    "copywriting": "copywriting",
    "copy": "copy",
    "pagina": "page",
    "landing": "landing",
    "email": "email",
    "emails": "emails",
    "workflow": "workflow",
    "flujo": "workflow",
    "herramienta": "tool",
    "herramientas": "tools",
    "codigo": "code",
    "código": "code",
    "desplegar": "deploy",
    "deploy": "deploy",
    "presentacion": "presentation",
    "presentaciones": "presentations",
    "diagrama": "diagram",
    "diagramas": "diagrams",
    "pruebas": "testing",
    "test": "testing",
    "tests": "testing",
    "optimizar": "optimize",
    "optimizacion": "optimization",
    "investigar": "research",
    "investigacion": "research",
    "estrategia": "strategy",
    "estrategia": "strategy",
    "brand": "brand",
    "marca": "brand",
    "voz": "voice",
    "diseño": "design",
    "diseno": "design",
    "diseñar": "design",
    "diseñar": "design",
    "renderizar": "render",
    "render": "render",
    "audio": "audio",
    "video": "video",
    "imagen": "image",
    "imagenes": "images",
    "imagenes": "images",
    "imagen": "image",
    "logo": "logo",
    "pdf": "pdf",
    "powerpoint": "pptx",
    "powerpoint": "pptx",
    "presentación": "presentation",
    "slides": "slides",
    "diapositivas": "slides",
    "post": "copy",
    "publicación": "copy",
    "publicaciones": "copy",
    "contenido": "content",
    "redes": "social",
    "social": "social",
}


# ── Registry Parsing ────────────────────────────────────────

def parse_registry(registry_path: Path) -> list[dict]:
    """Parse skill-registry.md markdown table into list of skill dicts.

    Expected table format:
    | `skill-name` | Trigger / description text | scope | `path/to/SKILL.md` |

    Returns list of:
        {"name": str, "description": str, "scope": str, "path": str, "keywords": set}
    """
    if not registry_path.exists():
        raise FileNotFoundError(
            f"Registry not found: {registry_path}\n"
            "Run skill-registry refresh first."
        )

    content = registry_path.read_text(encoding="utf-8")
    skills: list[dict] = []

    # Match table rows: | `name` | description | scope | `path` |
    # The backtick-wrapped name is optional — some rows may omit them.
    row_pattern = re.compile(
        r"^\|\s*`?([^`|]+?)`?\s*\|"     # skill name (column 1)
        r"\s*(.+?)\s*\|"                  # description/trigger (column 2)
        r"\s*(\w+)\s*\|"                  # scope (column 3)
        r"\s*`?([^`|]+?)`?\s*\|$",        # path (column 4)
        re.MULTILINE,
    )

    for match in row_pattern.finditer(content):
        name = match.group(1).strip()
        description = match.group(2).strip()
        scope = match.group(3).strip()
        path = match.group(4).strip()

        # Skip the header separator row
        if name.startswith("-") or name == "Skill":
            continue

        keywords = extract_keywords(name, description)
        skills.append({
            "name": name,
            "description": description,
            "scope": scope,
            "path": path,
            "keywords": keywords,
        })

    return skills


def extract_keywords(name: str, description: str) -> set[str]:
    """Extract meaningful keywords from skill name and description.

    Combines name tokens (higher weight) and description tokens.
    Filters out Spanish/English stop words and very short tokens.
    """
    stop_words = {
        # English
        "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would", "could",
        "should", "may", "might", "shall", "can", "need", "dare", "ought",
        "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
        "as", "into", "through", "during", "before", "after", "above", "below",
        "between", "out", "off", "over", "under", "again", "further", "then",
        "once", "this", "that", "these", "those", "it", "its", "your", "you",
        "and", "or", "but", "not", "no", "nor", "so", "if", "when", "where",
        "how", "what", "which", "who", "whom", "why", "all", "each", "every",
        "both", "few", "more", "most", "other", "some", "such", "than", "too",
        "very", "just", "about", "also", "only", "up", "down", "any", "own",
        "same", "they", "them", "their", "we", "he", "she", "him", "her",
        "my", "me", "i",
        # Spanish
        "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del",
        "al", "en", "que", "es", "por", "con", "para", "se", "su", "sus",
        "como", "más", "mas", "o", "pero", "este", "esta", "estos", "estas",
        "yo", "tú", "nosotros", "ellos", "ellas", "le", "les", "lo", "ya",
        "muy", "sin", "sobre", "entre", "desde", "hasta", "cuando", "donde",
        "quien", "quién", "qué", "cómo", "cuál", "cuáles",
        # Common filler
        "use", "when", "user", "skill", "skills", "trigger", "triggers",
        "also", "apply", "create", "new", "set", "make", "want", "using",
        "available", "provide", "support", "default", "via", "run",
    }

    tokens = set()

    # Name tokens: split on non-alphanumeric, keep meaningful ones
    for token in re.split(r"[\W_]+", name.lower()):
        if len(token) >= 2 and token not in stop_words:
            tokens.add(token)

    # Description tokens: split on non-alphanumeric
    for token in re.split(r"[\W_]+", description.lower()):
        if len(token) >= 3 and token not in stop_words:
            tokens.add(token)

    return tokens


# ── Scoring Engine ──────────────────────────────────────────

def tokenize_query(query: str) -> list[str]:
    """Tokenize user query into lowercase meaningful tokens.

    Applies Spanish→English translation for cross-language matching.
    """
    stop_words = {
        "the", "a", "an", "is", "are", "i", "me", "my", "we", "you",
        "to", "of", "in", "for", "on", "with", "at", "by", "from",
        "and", "or", "but", "not", "no", "so", "if", "it", "its",
        "this", "that", "want", "need", "wantto", "needto",
        "el", "la", "los", "las", "un", "una", "de", "del", "al",
        "en", "que", "es", "por", "con", "para", "se", "su", "como",
        "más", "mas", "yo", "tú", "ya", "sin", "sobre",
    }

    tokens = []
    for token in re.split(r"[\W_]+", query.lower()):
        if len(token) >= 2 and token not in stop_words:
            # Translate Spanish tokens to English if possible
            translated = ES_EN_MAP.get(token, token)
            tokens.append(translated)
            # Also keep original for partial matching
            if translated != token:
                tokens.append(token)
    return tokens


def score_skill(query_tokens: list[str], skill_keywords: set[str]) -> float:
    """Score a skill against query tokens using TF-IDF-like scoring.

    Scoring formula:
    - For each query token found in skill keywords: +1.0
    - Bonus for exact name matches: +0.5 per name token found
    - Normalize by max possible score (all query tokens matching)
    - Apply length penalty for very short or very long keyword sets
    """
    if not query_tokens or not skill_keywords:
        return 0.0

    matches = 0
    for token in query_tokens:
        if token in skill_keywords:
            matches += 1
        else:
            # Partial match: check if token is substring of any keyword
            for kw in skill_keywords:
                if len(token) >= 4 and token in kw:
                    matches += 0.5
                    break
                elif len(kw) >= 4 and kw in token:
                    matches += 0.5
                    break

    # Base score: fraction of query tokens matched
    base_score = matches / len(query_tokens) if query_tokens else 0.0

    # Boost for multiple matches (reinforcement)
    if matches >= 2:
        base_score *= 1.0 + (0.1 * min(matches - 1, 5))

    return min(base_score, 1.0)


def rank_skills(
    query: str,
    skills: list[dict],
    top_n: int = 5,
) -> list[dict]:
    """Rank skills against a user query. Returns top N results.

    Each result: {"skill": str, "path": str, "confidence": float,
                  "suggested_command": str}
    """
    query_tokens = tokenize_query(query)
    if not query_tokens:
        return []

    results = []
    for skill in skills:
        confidence = score_skill(query_tokens, skill["keywords"])
        if confidence >= MIN_CONFIDENCE_THRESHOLD:
            results.append({
                "skill": skill["name"],
                "path": skill["path"],
                "description": skill["description"],
                "scope": skill["scope"],
                "confidence": round(confidence, 4),
                "suggested_command": _build_command(skill["name"], query),
            })

    # Sort by confidence descending
    results.sort(key=lambda x: x["confidence"], reverse=True)
    return results[:top_n]


def _build_command(skill_name: str, query: str) -> str:
    """Build a suggested CLI command for using the skill."""
    return f"Load skill '{skill_name}' and execute: {query}"


# ── Clarification ───────────────────────────────────────────

def needs_clarification(results: list[dict], query: str) -> str | None:
    """Check if we should ask a clarifying question.

    Returns a clarification question string, or None if confident.
    """
    query_tokens = tokenize_query(query)

    if len(query_tokens) < MIN_QUERY_WORDS:
        return (
            f"Your query has only {len(query_tokens)} words. "
            "Can you add more context about what you want to do? "
            "For example: what tool, platform, or goal are you working with?"
        )

    if not results:
        return (
            "I don't have a clear recommendation. "
            "Can you describe what you need more specifically? "
            "Include the tool, platform, or action you want to perform."
        )

    top = results[0]
    if top["confidence"] < HIGH_CONFIDENCE:
        return (
            f"I found '{top['skill']}' (confidence: {top['confidence']:.0%}) "
            "but I'm not very confident. Can you tell me more about "
            "what you're trying to accomplish?"
        )

    return None


# ── Batch Mode ──────────────────────────────────────────────

def batch_discover(
    queries: list[str],
    skills: list[dict],
) -> list[dict]:
    """Run discovery on multiple queries.

    Returns list of {"query": str, "results": [...], "clarification": str|None}
    """
    batch_results = []
    for query in queries:
        query = query.strip()
        if not query:
            continue
        results = rank_skills(query, skills)
        clarification = needs_clarification(results, query)
        batch_results.append({
            "query": query,
            "results": results,
            "clarification": clarification,
        })
    return batch_results


def write_batch_csv(
    batch_results: list[dict],
    output_path: Path,
) -> None:
    """Write batch results to CSV."""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "query", "top_skill", "confidence", "path", "suggested_command",
            "needs_clarification",
        ])
        for item in batch_results:
            top = item["results"][0] if item["results"] else {}
            writer.writerow([
                item["query"],
                top.get("skill", "none"),
                top.get("confidence", 0),
                top.get("path", ""),
                top.get("suggested_command", ""),
                "yes" if item["clarification"] else "no",
            ])


# ── Evaluation Mode ─────────────────────────────────────────

def evaluate(
    test_set: list[dict],
    skills: list[dict],
    verbose: bool = False,
) -> dict:
    """Evaluate discovery accuracy against expected results.

    test_set items: {"query": str, "expected_skill": str, "min_confidence": float}

    Returns: {"total": int, "passed": int, "failed": int,
              "details": [...]}
    """
    passed = 0
    failed = 0
    details = []

    for item in test_set:
        query = item["query"]
        expected = item["expected_skill"]
        min_conf = item.get("min_confidence", 0.5)

        results = rank_skills(query, skills)
        top_skill = results[0]["skill"] if results else "none"
        top_conf = results[0]["confidence"] if results else 0.0

        # Check if expected skill is in top results (exact or substring match)
        found_in_top = False
        for r in results:
            if r["skill"] == expected:
                found_in_top = True
                break
            # Substring match: expected appears in skill name or vice versa
            if expected in r["skill"] or r["skill"] in expected:
                found_in_top = True
                break
        top_matches = top_skill == expected

        test_passed = found_in_top and top_conf >= min_conf
        if test_passed:
            passed += 1
        else:
            failed += 1

        detail = {
            "query": query,
            "expected": expected,
            "got": top_skill,
            "confidence": top_conf,
            "found_in_top": found_in_top,
            "passed": test_passed,
        }
        details.append(detail)

        if verbose:
            status = "PASS" if test_passed else "FAIL"
            print(
                f"  [{status}] '{query}' -> expected={expected}, "
                f"got={top_skill} ({top_conf:.2%})"
            )

    return {
        "total": len(test_set),
        "passed": passed,
        "failed": failed,
        "accuracy": round(passed / len(test_set), 4) if test_set else 0,
        "details": details,
    }


# ── Interactive Mode ────────────────────────────────────────

def interactive_mode(skills: list[dict], verbose: bool = False) -> None:
    """TUI-like interactive skill discovery."""
    print("=" * 60)
    print("  Skill Discovery — Think Different PersonalOS")
    print(f"  Loaded {len(skills)} skills from registry")
    print("=" * 60)
    print()
    print("Type your question in natural language.")
    print("Type 'quit' or 'exit' to stop.")
    print()

    while True:
        try:
            query = input("You> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye!")
            break

        if not query or query.lower() in ("quit", "exit", "q"):
            print("Goodbye!")
            break

        results = rank_skills(query, skills)
        clarification = needs_clarification(results, query)

        if clarification:
            print(f"\n  -> {clarification}\n")
            continue

        print(f"\n  Top recommendations for: '{query}'")
        print("  " + "-" * 50)

        for i, r in enumerate(results, 1):
            conf_bar = "#" * int(r["confidence"] * 20)
            print(
                f"  {i}. {r['skill']:30s} [{r['confidence']:.0%}] "
                f"{conf_bar}"
            )
            print(f"     {r['suggested_command']}")
            if verbose:
                print(f"     Path: {r['path']}")
            print()

        print()


# ── CLI ─────────────────────────────────────────────────────

def safe_json_write(data: Any, path: Path) -> None:
    """Atomic JSON write — writes to temp file then renames."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(".tmp")
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        tmp_path.replace(path)
    except OSError as e:
        print(f"[ERROR] Failed to write {path}: {e}", file=sys.stderr)
        raise


def main():
    parser = argparse.ArgumentParser(
        description="Skill Discovery — NL query to skill recommendation"
    )
    parser.add_argument(
        "query",
        nargs="?",
        help="Natural language query to find matching skills",
    )
    parser.add_argument(
        "--interactive", "-i",
        action="store_true",
        help="Interactive TUI mode with follow-up questions",
    )
    parser.add_argument(
        "--batch", "-b",
        type=str,
        help="Path to file with one query per line",
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        help="Output path for batch results (default: stdout JSON)",
    )
    parser.add_argument(
        "--eval", "-e",
        type=str,
        help="Path to evaluation test set JSON file",
    )
    parser.add_argument(
        "--registry",
        type=str,
        default=str(REGISTRY_FILE),
        help=f"Path to skill registry (default: {REGISTRY_FILE})",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be done without executing",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Verbose output with extra details",
    )
    parser.add_argument(
        "--test",
        action="store_true",
        help="Run built-in smoke tests",
    )
    parser.add_argument(
        "--top",
        type=int,
        default=5,
        help="Number of top results to return (default: 5)",
    )
    parser.add_argument(
        "--json-output",
        action="store_true",
        help="Force JSON output format",
    )

    args = parser.parse_args()

    # ── Load registry ──
    registry_path = Path(args.registry)
    try:
        skills = parse_registry(registry_path)
    except FileNotFoundError as e:
        print(f"[ERROR] {e}", file=sys.stderr)
        sys.exit(1)

    if args.verbose:
        print(f"[INFO] Loaded {len(skills)} skills from {registry_path}")

    # ── Built-in smoke test ──
    if args.test:
        print("Running smoke tests...")
        _run_smoke_tests(skills)
        return

    # ── Interactive mode ──
    if args.interactive:
        interactive_mode(skills, verbose=args.verbose)
        return

    # ── Batch mode ──
    if args.batch:
        batch_path = Path(args.batch)
        if not batch_path.exists():
            print(f"[ERROR] Batch file not found: {batch_path}", file=sys.stderr)
            sys.exit(1)

        queries = [
            line.strip()
            for line in batch_path.read_text(encoding="utf-8").splitlines()
            if line.strip() and not line.strip().startswith("#")
        ]

        if args.dry_run:
            print(f"[DRY RUN] Would process {len(queries)} queries:")
            for q in queries:
                print(f"  - {q}")
            return

        batch_results = batch_discover(queries, skills)

        if args.output:
            output_path = Path(args.output)
            if output_path.suffix == ".csv":
                write_batch_csv(batch_results, output_path)
                print(f"[OK] Results written to {output_path}")
            else:
                safe_json_write(batch_results, output_path)
                print(f"[OK] Results written to {output_path}")
        else:
            print(json.dumps(batch_results, indent=2, ensure_ascii=False))
        return

    # ── Evaluation mode ──
    if args.eval:
        eval_path = Path(args.eval)
        if not eval_path.exists():
            print(f"[ERROR] Eval file not found: {eval_path}", file=sys.stderr)
            sys.exit(1)

        test_set = json.loads(eval_path.read_text(encoding="utf-8"))

        if args.dry_run:
            print(f"[DRY RUN] Would evaluate {len(test_set)} test cases")
            return

        results = evaluate(test_set, skills, verbose=args.verbose)

        print(f"\n  Evaluation: {results['passed']}/{results['total']} "
              f"({results['accuracy']:.0%} accuracy)")
        if results["failed"] > 0:
            print(f"\n  Failed cases:")
            for d in results["details"]:
                if not d["passed"]:
                    print(
                        f"    - '{d['query']}' expected={d['expected']}, "
                        f"got={d['got']} ({d['confidence']:.2%})"
                    )

        # Save eval results
        eval_output = CACHE_DIR / "skill_discovery_eval.json"
        safe_json_write(results, eval_output)
        print(f"\n  Full results saved to {eval_output}")
        return

    # ── Single query mode ──
    if not args.query:
        parser.print_help()
        sys.exit(1)

    query = args.query

    if args.dry_run:
        print(f"[DRY RUN] Would search for: '{query}'")
        tokens = tokenize_query(query)
        print(f"[DRY RUN] Tokens: {tokens}")
        return

    results = rank_skills(query, skills, top_n=args.top)
    clarification = needs_clarification(results, query)

    output = {
        "query": query,
        "results": results,
        "clarification": clarification,
    }

    if args.json_output or not sys.stdout.isatty():
        print(json.dumps(output, indent=2, ensure_ascii=False))
    else:
        if clarification:
            print(f"\n  {clarification}\n")
        elif results:
            print(f"\n  Recommendations for: '{query}'")
            print("  " + "-" * 50)
            for i, r in enumerate(results, 1):
                conf_bar = "#" * int(r["confidence"] * 20)
                print(
                    f"  {i}. {r['skill']:30s} [{r['confidence']:.0%}] "
                    f"{conf_bar}"
                )
                print(f"     {r['suggested_command']}")
                print()
        else:
            print("\n  No matching skills found.\n")


# ── Smoke Tests ─────────────────────────────────────────────

def _run_smoke_tests(skills: list[dict]) -> None:
    """Built-in smoke tests for quick validation."""
    passed = 0
    failed = 0

    def check(name: str, condition: bool, detail: str = ""):
        nonlocal passed, failed
        if condition:
            passed += 1
            print(f"  [PASS] {name}")
        else:
            failed += 1
            print(f"  [FAIL] {name} — {detail}")

    # 1. Registry parsing
    check("Registry loaded skills", len(skills) > 50, f"got {len(skills)}")

    seo_skills = [s for s in skills if "seo" in s["name"].lower()]
    check("SEO skills found", len(seo_skills) > 0, "expected >= 1")

    # 2. Keyword extraction
    kw = extract_keywords("market-competitors", "Competitive intelligence analysis")
    check("Keywords extracted", len(kw) > 0, "empty keywords")
    check(
        "Competitor keyword present",
        "competitor" in kw or "competitive" in kw,
        f"got: {kw}",
    )

    # 3. Scoring: known query → known skill
    results = rank_skills("analizar competidores SEO", skills)
    check("Query returns results", len(results) > 0, "empty results")
    if results:
        check(
            "Top result has confidence >= 0.3",
            results[0]["confidence"] >= 0.3,
            f"got {results[0]['confidence']}",
        )

    # 4. Tokenize
    tokens = tokenize_query("quiero crear un post para linkedin")
    check("Tokenizer works", len(tokens) >= 3, f"got {tokens}")

    # 5. Clarification triggers on short query
    short_clarif = needs_clarification([], "debug")
    check("Short query triggers clarification", short_clarif is not None)

    # 6. No results triggers clarification
    empty_clarif = needs_clarification([], "xyzzy plugh")
    check("No results triggers clarification", empty_clarif is not None)

    # 7. Good query does NOT trigger clarification
    good_results = rank_skills("seo audit website analysis", skills)
    good_clarif = needs_clarification(good_results, "seo audit website analysis")
    check(
        "Good query does not trigger clarification",
        good_clarif is None,
        f"got: {good_clarif}",
    )

    print(f"\n  Results: {passed} passed, {failed} failed")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
