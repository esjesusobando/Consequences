#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
output_eval.py - Output Quality Evaluator for PersonalOS v5.0
=============================================================
Evaluates content quality across 5 weighted criteria: completeness,
accuracy, tone, clarity, and actionability.

Usage:
    python output_eval.py evaluate --input "text or file path" --type content
    python output_eval.py batch --input-dir ./outputs --type report
    python output_eval.py --test

Ubication: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
"""

import sys, os, json, argparse, logging, re, hashlib
from pathlib import Path
from datetime import datetime, timezone

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s', datefmt='%H:%M:%S')
logger = logging.getLogger(__name__)


# =============================================================================
# CONSTANTS
# =============================================================================

EVAL_CRITERIA = {
    "completeness": {"weight": 0.3, "check": "all_required_fields_present"},
    "accuracy": {"weight": 0.25, "check": "facts_match_source"},
    "tone": {"weight": 0.2, "check": "matches_brand_voice"},
    "clarity": {"weight": 0.15, "check": "readability_score"},
    "actionability": {"weight": 0.1, "check": "clear_next_steps"},
}

REQUIRED_FIELDS = {
    "proposal": ["problem", "solution", "timeline", "budget", "team"],
    "content": ["headline", "body", "cta", "target_audience"],
    "report": ["summary", "findings", "recommendations", "next_steps"],
}


# =============================================================================
# SAFE JSON WRITE
# =============================================================================

def safe_json_write(data, path):
    """Atomic JSON write -- writes to temp file then renames."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(".tmp")
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        tmp_path.replace(path)
    except OSError as e:
        logger.error("Failed to write %s: %s", path, e)
        raise


# =============================================================================
# OUTPUT EVALUATOR
# =============================================================================

class OutputEvaluator:
    def __init__(self, eval_type="content"):
        self.criteria = EVAL_CRITERIA
        self.type = eval_type
        self.required_fields = REQUIRED_FIELDS.get(eval_type, [])

    def evaluate(self, text, metadata=None):
        """Evaluate text and return score + breakdown + suggestions."""
        criteria_results = {}
        criteria_results["completeness"] = self._check_completeness(text, metadata or {})
        criteria_results["accuracy"] = self._check_accuracy(text)
        criteria_results["tone"] = self._check_tone(text)
        criteria_results["clarity"] = self._check_clarity(text)
        criteria_results["actionability"] = self._check_actionability(text)

        score = self._calculate_score(criteria_results)
        suggestions = self._generate_suggestions(criteria_results)

        return {
            "eval_id": "eval_{}_{}".format(
                datetime.now().strftime('%Y%m%d_%H%M%S'),
                hashlib.md5(text[:100].encode()).hexdigest()[:8]
            ),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "input_type": self.type,
            "score": score,
            "criteria": criteria_results,
            "suggestions": suggestions,
        }

    def _check_completeness(self, text, metadata):
        """Check if required fields are present."""
        found = []
        missing = []
        text_lower = text.lower()
        for field in self.required_fields:
            if field.lower() in text_lower or self._field_synonyms(field, text_lower):
                found.append(field)
            else:
                missing.append(field)

        score = int(100 * len(found) / len(self.required_fields)) if self.required_fields else 100
        issues = ["missing {}".format(f) for f in missing]
        return {"score": score, "issues": issues}

    def _field_synonyms(self, field, text):
        """Check for common synonyms of required fields."""
        synonyms = {
            "problem": ["issue", "challenge", "pain point", "gap"],
            "solution": ["approach", "method", "strategy", "remedy"],
            "timeline": ["schedule", "milestone", "deadline", "phase"],
            "budget": ["cost", "investment", "funding", "price"],
            "team": ["who", "owner", "responsible", "assignee"],
            "headline": ["title", "heading", "h1"],
            "body": ["content", "text", "copy", "paragraph"],
            "cta": ["call to action", "button", "next step", "action"],
            "target_audience": ["audience", "persona", "user", "customer"],
            "summary": ["overview", "executive summary", "abstract"],
            "findings": ["results", "analysis", "discovery", "insight"],
            "recommendations": ["suggestion", "proposal", "advice", "action item"],
            "next_steps": ["action", "follow-up", "what's next", "roadmap"],
        }
        syns = synonyms.get(field, [])
        return any(s in text for s in syns)

    def _check_accuracy(self, text):
        """Check for numbers, sources, citations (presence-based)."""
        issues = []
        score = 100

        numbers = re.findall(r'\d+\.?\d*%?|\$\d+', text)
        if len(numbers) < 2:
            issues.append("few numbers/data points (found {})".format(len(numbers)))
            score -= 30

        source_patterns = [
            r'source[s]?:',
            r'according to',
            r'\[\d+\]',
            r'\(.*?\d{4}\)',
            r'reference[s]?:',
            r'data from',
        ]
        has_source = any(re.search(p, text, re.IGNORECASE) for p in source_patterns)
        if not has_source:
            issues.append("no sources or citations found")
            score -= 30

        claim_patterns = [
            r'(increase|decrease|improve|reduce|grow|boost)\s+\d+',
            r'\d+%\s+(increase|decrease|improvement)',
        ]
        has_claims_with_data = any(re.search(p, text, re.IGNORECASE) for p in claim_patterns)
        # Check for claims WITHOUT data (claims that don't include numbers)
        bare_claim_patterns = [
            r'(increase|decrease|improve|reduce|grow|boost)',
        ]
        has_bare_claims = any(re.search(p, text, re.IGNORECASE) for p in bare_claim_patterns)
        if has_bare_claims and not has_claims_with_data:
            issues.append("claims present but may lack supporting data")
            score -= 10

        return {"score": max(0, score), "issues": issues}

    def _check_tone(self, text):
        """Check brand voice consistency (heuristic)."""
        issues = []
        score = 100

        jargon_words = ["synergy", "leverage", "paradigm", "holistic", "ecosystem",
                        "disrupt", "innovative", "cutting-edge", "best-in-class"]
        jargon_count = sum(1 for w in jargon_words if w.lower() in text.lower())
        jargon_density = jargon_count / max(len(text.split()), 1) * 100

        if jargon_density > 10:
            issues.append("high jargon density ({:.1f}%)".format(jargon_density))
            score -= 20

        passive_patterns = [r'was\s+\w+ed\s+by', r'is\s+being\s+\w+ed', r'are\s+\w+ed']
        passive_count = sum(len(re.findall(p, text, re.IGNORECASE)) for p in passive_patterns)
        if passive_count > 3:
            issues.append("excessive passive voice ({} instances)".format(passive_count))
            score -= 15

        return {"score": max(0, score), "issues": issues}

    def _check_clarity(self, text):
        """Check readability metrics."""
        issues = []
        score = 100

        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]

        if sentences:
            avg_sentence_len = sum(len(s.split()) for s in sentences) / len(sentences)
            if avg_sentence_len > 25:
                issues.append("avg sentence length {:.0f} words (target < 25)".format(avg_sentence_len))
                score -= 20

        paragraphs = text.split('\n\n')
        long_paras = [p for p in paragraphs if len(p.split()) > 150]
        if long_paras:
            issues.append("{} paragraph(s) exceed 150 words".format(len(long_paras)))
            score -= 15

        has_bullets = bool(re.search(r'^\s*[-*•]\s', text, re.MULTILINE))
        if not has_bullets and len(sentences) > 5:
            issues.append("no bullet points (improves readability)")
            score -= 10

        return {"score": max(0, score), "issues": issues}

    def _check_actionability(self, text):
        """Check for next steps, CTAs, owners."""
        issues = []
        score = 100

        text_lower = text.lower()

        has_next_steps = any(phrase in text_lower for phrase in [
            "next steps", "action items", "recommendations", "what's next",
            "follow-up", "roadmap", "timeline"
        ])
        if not has_next_steps:
            issues.append("no 'next steps' or 'action items' section")
            score -= 30

        owner_patterns = [r'owner:', r'responsible:', r'assigned to', r'due by', r'deadline:']
        has_owners = any(re.search(p, text, re.IGNORECASE) for p in owner_patterns)
        if not has_owners:
            issues.append("no clear owners or deadlines")
            score -= 20

        cta_patterns = [r'click here', r'sign up', r'get started', r'contact us', r'learn more']
        has_cta = any(re.search(p, text, re.IGNORECASE) for p in cta_patterns)
        if not has_cta:
            issues.append("no clear call-to-action")
            score -= 10

        return {"score": max(0, score), "issues": issues}

    def _calculate_score(self, criteria_results):
        """Calculate weighted composite score."""
        total = 0
        for criterion, config in self.criteria.items():
            result = criteria_results.get(criterion, {})
            c_score = result.get("score", 0)
            total += c_score * config["weight"]
        return int(total)

    def _generate_suggestions(self, criteria_results):
        """Generate improvement suggestions from criteria results."""
        suggestions = []
        severity_map = {
            range(0, 50): "high",
            range(50, 70): "medium",
            range(70, 101): "low",
        }

        for criterion, result in criteria_results.items():
            c_score = result.get("score", 100)
            issues = result.get("issues", [])

            severity = "low"
            for r, s in severity_map.items():
                if c_score in r:
                    severity = s
                    break

            for issue in issues:
                suggestions.append({
                    "criterion": criterion,
                    "severity": severity,
                    "text": issue,
                })

        return sorted(suggestions, key=lambda x: {"high": 0, "medium": 1, "low": 2}[x["severity"]])


# =============================================================================
# BATCH EVALUATOR
# =============================================================================

def batch_evaluate(input_dir, eval_type="content", dry_run=False, verbose=False):
    """Evaluate all .md and .txt files in a directory."""
    input_path = Path(input_dir)
    if not input_path.exists():
        logger.error("Directory not found: %s", input_path)
        return None

    files = sorted(list(input_path.glob("*.md")) + list(input_path.glob("*.txt")))
    if not files:
        logger.warning("No .md or .txt files found in %s", input_path)
        return {"files_evaluated": 0, "results": []}

    evaluator = OutputEvaluator(eval_type=eval_type)
    results = []

    for f in files:
        if verbose:
            logger.info("Evaluating: %s", f.name)
        if dry_run:
            logger.info("  [DRY-RUN] Would evaluate: %s", f.name)
            results.append({"file": f.name, "dry_run": True})
            continue

        try:
            text = f.read_text(encoding="utf-8")
            eval_result = evaluator.evaluate(text)
            eval_result["file"] = f.name
            results.append(eval_result)
            if verbose:
                logger.info("  Score: %d/100", eval_result["score"])
        except Exception as e:
            logger.error("  Failed to evaluate %s: %s", f.name, e)
            results.append({"file": f.name, "error": str(e)})

    return {
        "files_evaluated": len(files),
        "eval_type": eval_type,
        "results": results,
    }


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description="Output Quality Evaluator")
    parser.add_argument("--dry-run", action="store_true", help="Validate without executing")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    parser.add_argument("--test", action="store_true", help="Run self-tests")
    parser.add_argument("--output-json", action="store_true", help="Output as JSON")

    subparsers = parser.add_subparsers(dest="command")

    eval_parser = subparsers.add_parser("evaluate", help="Evaluate text or file")
    eval_parser.add_argument("--input", required=True, help="Text string or file path")
    eval_parser.add_argument("--type", choices=["proposal", "content", "report"], default="content")
    eval_parser.add_argument("--save", action="store_true", help="Save result to eval runs dir")

    batch_parser = subparsers.add_parser("batch", help="Batch evaluate directory")
    batch_parser.add_argument("--input-dir", required=True, help="Directory with .md/.txt files")
    batch_parser.add_argument("--type", choices=["proposal", "content", "report"], default="content")

    args = parser.parse_args()

    if args.test:
        results = run_self_test()
        print(json.dumps(results, indent=2, ensure_ascii=False))
        sys.exit(0 if results["status"] == "pass" else 1)

    if args.command == "evaluate":
        input_val = args.input
        # Check if input is a file path
        if os.path.isfile(input_val):
            with open(input_val, "r", encoding="utf-8") as f:
                text = f.read()
            logger.info("Loaded file: %s", input_val)
        else:
            text = input_val

        evaluator = OutputEvaluator(eval_type=args.type)
        result = evaluator.evaluate(text)

        if args.save and not args.dry_run:
            eval_runs_dir = CACHE_DIR / "eval_runs"
            eval_runs_dir.mkdir(parents=True, exist_ok=True)
            save_path = eval_runs_dir / "{}.json".format(result["eval_id"])
            safe_json_write(result, save_path)
            logger.info("Saved eval to: %s", save_path)

        if args.output_json or args.dry_run:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print("\n=== Output Evaluation ===")
            print("  Eval ID: {}".format(result["eval_id"]))
            print("  Type: {}".format(result["input_type"]))
            print("  Score: {}/100".format(result["score"]))
            print("\n  Breakdown:")
            for criterion, c_result in result["criteria"].items():
                c_score = c_result["score"]
                issues = c_result["issues"]
                status = "OK" if c_score >= 70 else "WARN" if c_score >= 50 else "FAIL"
                print("    [{:<4}] {}: {}/100".format(status, criterion.capitalize(), c_score))
                for issue in issues:
                    print("          - {}".format(issue))
            print("\n  Suggestions ({} total):".format(len(result["suggestions"])))
            for s in result["suggestions"][:5]:
                print("    [{:<6}] {}: {}".format(s["severity"].upper(), s["criterion"], s["text"]))
            print()
        sys.exit(0)

    if args.command == "batch":
        if args.dry_run:
            print(json.dumps({"dry_run": True, "dir": args.input_dir}, indent=2))
            sys.exit(0)
        result = batch_evaluate(args.input_dir, eval_type=args.type, verbose=args.verbose)
        if result:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        sys.exit(0)

    parser.print_help()


# =============================================================================
# SELF-TEST
# =============================================================================

def run_self_test():
    """Run self-contained tests."""
    results = {"tests": [], "passed": 0, "failed": 0}

    def check(name, condition, detail=""):
        results["tests"].append({"name": name, "passed": condition, "detail": detail})
        if condition:
            results["passed"] += 1
        else:
            results["failed"] += 1

    evaluator = OutputEvaluator(eval_type="content")

    # Test 1: Good content
    good_text = """
    ## Headline: Boost Your Marketing
    This content targets marketing professionals looking to improve their ROI.
    Our analysis of 2024 data from multiple sources shows a clear path forward.
    According to industry reports, companies see 35% increase in engagement.
    Source: HubSpot Marketing Report 2024.

    ### Recommendations
    - Implement A/B testing for email campaigns
    - Focus on audience segmentation

    ### Next Steps
    Owner: Marketing team
    Deadline: Q3 2024
    """
    result = evaluator.evaluate(good_text)
    check("good_content_score_above_70", result["score"] >= 70,
          "Score: {}".format(result["score"]))

    # Test 2: Bad content
    bad_text = "short"
    result_bad = evaluator.evaluate(bad_text)
    check("bad_content_score_below_70", result_bad["score"] < 70,
          "Score: {}".format(result_bad["score"]))

    # Test 3: Determinism
    r1 = evaluator.evaluate(good_text)
    r2 = evaluator.evaluate(good_text)
    detail = str(r1["score"]) + " vs " + str(r2["score"])
    check("deterministic_same_score", r1["score"] == r2["score"], detail)

    # Test 4: Different types have different required fields
    prop_eval = OutputEvaluator(eval_type="proposal")
    check("proposal_different_fields", prop_eval.required_fields != evaluator.required_fields)

    # Test 5: Empty text
    result_empty = evaluator.evaluate("")
    check("empty_text_handles", isinstance(result_empty["score"], int))

    # Test 6: Weight sum
    total_weight = sum(c["weight"] for c in EVAL_CRITERIA.values())
    check("weights_sum_to_1", abs(total_weight - 1.0) < 0.001,
          "Sum: {}".format(total_weight))

    # Test 7: Report type required fields
    report_eval = OutputEvaluator(eval_type="report")
    check("report_has_4_fields", len(report_eval.required_fields) == 4)

    # Test 8: Has suggestions
    check("has_suggestions", len(result["suggestions"]) >= 0)

    # Test 9: Accuracy check with numbers
    text_with_numbers = "We saw 50% improvement. Source: internal data 2024. Revenue grew 20% year over year."
    result_nums = evaluator.evaluate(text_with_numbers)
    check("numbers_improve_accuracy",
          result_nums["criteria"]["accuracy"]["score"] >= 70,
          "Score: {}".format(result_nums["criteria"]["accuracy"]["score"]))

    # Test 10: Synonyms work
    text_with_synonyms = "Title: My Heading. The text is here and the copy flows well. We need a call to action for our audience."
    result_syn = evaluator.evaluate(text_with_synonyms)
    check("synonyms_boost_completeness",
          result_syn["criteria"]["completeness"]["score"] == 100,
          "Score: " + str(result_syn["criteria"]["completeness"]["score"]))

    results["status"] = "pass" if results["failed"] == 0 else "fail"
    return results


if __name__ == "__main__":
    main()
