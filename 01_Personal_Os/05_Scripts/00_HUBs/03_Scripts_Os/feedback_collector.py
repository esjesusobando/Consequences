#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
feedback_collector.py — Feedback Collection & Storage
=====================================================
Collects and manages feedback responses from usability tests.

Features:
- Reads test responses from JSON / localStorage exports
- Validates completeness
- Stores in telemetry directory
- Provides status and count queries

CLI:
    python feedback_collector.py --prototype-id "proto_xxx" --min-responses 5
    python feedback_collector.py --prototype-id "proto_xxx" --status
    python feedback_collector.py --prototype-id "proto_xxx" --count
    python feedback_collector.py --prototype-id "proto_xxx" --export
    python feedback_collector.py --test

State: 03_Learning/04_Telemetry/prototype_feedback_{id}.json
"""
import sys
import os
import json
import argparse
import logging
from pathlib import Path
from datetime import datetime, timezone

# ─────────────────────────────────────────────────────────────
# WINDOWS UTF-8 FIX
# ─────────────────────────────────────────────────────────────
def _fix_encoding():
    if sys.platform == "win32":
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

PROTOTYPES_DIR = CACHE_DIR / "prototypes"


def _safe_json_write(data: dict, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix('.tmp')
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(path)


# =============================================================================
# FEEDBACK FILE MANAGEMENT
# =============================================================================

def _feedback_file(prototype_id: str, telemetry_dir: Path = None) -> Path:
    """Get the feedback file path for a prototype."""
    td = telemetry_dir or TELEMETRY_DIR
    return td / f"prototype_feedback_{prototype_id}.json"


def _load_feedback(prototype_id: str, telemetry_dir: Path = None) -> dict:
    """Load existing feedback data."""
    fpath = _feedback_file(prototype_id, telemetry_dir)
    if fpath.exists():
        try:
            return json.loads(fpath.read_text(encoding='utf-8'))
        except (json.JSONDecodeError, OSError):
            return {"prototype_id": prototype_id, "responses": [], "metadata": {}}
    return {"prototype_id": prototype_id, "responses": [], "metadata": {}}


def _save_feedback(prototype_id: str, data: dict, telemetry_dir: Path = None) -> None:
    """Save feedback data atomically."""
    fpath = _feedback_file(prototype_id, telemetry_dir)
    _safe_json_write(data, fpath)


# =============================================================================
# FEEDBACK VALIDATION
# =============================================================================

def _validate_response(response: dict) -> tuple:
    """Validate a feedback response. Returns (is_valid, errors)."""
    errors = []

    if not isinstance(response, dict):
        return False, ["Response must be a dict"]

    if "answers" not in response:
        errors.append("Missing 'answers' field")

    if "prototype_id" not in response:
        errors.append("Missing 'prototype_id' field")

    answers = response.get("answers", {})
    if not answers:
        errors.append("No answers provided")

    return len(errors) == 0, errors


def _extract_metrics(response: dict) -> dict:
    """Extract key metrics from a response."""
    answers = response.get("answers", {})
    metrics = {
        "has_task_completion": "q2" in answers,
        "has_satisfaction": "q4" in answers,
        "has_nps": "q5" in answers,
    }

    # Parse numeric ratings
    if "q4" in answers:
        try:
            metrics["design_rating"] = int(answers["q4"])
        except (ValueError, TypeError):
            metrics["design_rating"] = None

    if "q5" in answers:
        try:
            metrics["nps_score"] = int(answers["q5"])
        except (ValueError, TypeError):
            metrics["nps_score"] = None

    # Task completion
    if "q2" in answers:
        completion = answers["q2"]
        metrics["task_completed"] = "Yes" in str(completion)
        metrics["task_completion_detail"] = completion

    return metrics


# =============================================================================
# PUBLIC API
# =============================================================================

def collect_feedback(prototype_id: str, min_responses: int = 5,
                     telemetry_dir: Path = None,
                     cache_dir: Path = None,
                     response_file: str = None) -> dict:
    """
    Collect feedback for a prototype.

    Args:
        prototype_id: Prototype ID
        min_responses: Minimum responses needed
        telemetry_dir: Where to store feedback
        cache_dir: Cache directory (for prototype files)
        response_file: Optional path to a JSON file with responses

    Returns:
        dict with count, status, and collected data
    """
    td = telemetry_dir or TELEMETRY_DIR

    # Load existing feedback
    data = _load_feedback(prototype_id, td)

    # Import responses from file if provided
    if response_file:
        rf = Path(response_file)
        if rf.exists():
            try:
                imported = json.loads(rf.read_text(encoding='utf-8'))
                if isinstance(imported, list):
                    for resp in imported:
                        valid, errors = _validate_response(resp)
                        if valid:
                            # Check for duplicate
                            resp_id = resp.get("test_id", "")
                            existing_ids = {r.get("test_id", "") for r in data["responses"]}
                            if resp_id not in existing_ids:
                                resp["collected_at"] = datetime.now(timezone.utc).isoformat()
                                resp["metrics"] = _extract_metrics(resp)
                                data["responses"].append(resp)
                        else:
                            logger.warning(f"Invalid response skipped: {errors}")
                elif isinstance(imported, dict) and "answers" in imported:
                    valid, errors = _validate_response(imported)
                    if valid:
                        imported["collected_at"] = datetime.now(timezone.utc).isoformat()
                        imported["metrics"] = _extract_metrics(imported)
                        data["responses"].append(imported)
            except (json.JSONDecodeError, OSError) as e:
                logger.error(f"Failed to read response file: {e}")

    # Check for localStorage exports in cache dir
    cd = cache_dir or PROTOTYPES_DIR
    test_files = list(cd.glob(f"test_*.json"))
    for tf in test_files:
        try:
            test_data = json.loads(tf.read_text(encoding='utf-8'))
            if test_data.get("prototype_id") == prototype_id:
                # Look for matching localStorage data
                pass  # localStorage data is in browser, not file system
        except (json.JSONDecodeError, OSError):
            pass

    # Save
    data["metadata"] = {
        "prototype_id": prototype_id,
        "total_responses": len(data["responses"]),
        "min_responses": min_responses,
        "status": "sufficient" if len(data["responses"]) >= min_responses else "insufficient",
        "last_collected": datetime.now(timezone.utc).isoformat(),
    }
    _save_feedback(prototype_id, data, td)

    count = len(data["responses"])
    status = "sufficient" if count >= min_responses else "insufficient"

    result = {
        "prototype_id": prototype_id,
        "count": count,
        "min_responses": min_responses,
        "status": status,
        "feedback_file": str(_feedback_file(prototype_id, td)),
    }

    logger.info(f"Feedback collected: {count} responses (need {min_responses})")
    logger.info(f"  Status: {status}")

    return result


def get_feedback_status(prototype_id: str, telemetry_dir: Path = None) -> dict:
    """Get the current feedback status for a prototype."""
    td = telemetry_dir or TELEMETRY_DIR
    data = _load_feedback(prototype_id, td)
    meta = data.get("metadata", {})
    responses = data.get("responses", [])

    # Compute summary stats
    metrics_summary = {}
    if responses:
        design_ratings = [r["metrics"]["design_rating"]
                          for r in responses if r.get("metrics", {}).get("design_rating") is not None]
        nps_scores = [r["metrics"]["nps_score"]
                      for r in responses if r.get("metrics", {}).get("nps_score") is not None]
        completed = sum(1 for r in responses
                        if r.get("metrics", {}).get("task_completed"))

        metrics_summary = {
            "avg_design_rating": round(sum(design_ratings) / len(design_ratings), 1) if design_ratings else None,
            "avg_nps": round(sum(nps_scores) / len(nps_scores), 1) if nps_scores else None,
            "task_completion_rate": round(completed / len(responses) * 100, 1) if responses else None,
            "nps_distribution": {
                "promoters": sum(1 for s in nps_scores if s >= 9),
                "passives": sum(1 for s in nps_scores if 7 <= s <= 8),
                "detractors": sum(1 for s in nps_scores if s <= 6),
            } if nps_scores else None,
        }

    return {
        "prototype_id": prototype_id,
        "total_responses": len(responses),
        "min_responses": meta.get("min_responses", 5),
        "status": meta.get("status", "unknown"),
        "last_collected": meta.get("last_collected", "N/A"),
        "metrics_summary": metrics_summary,
    }


def export_feedback(prototype_id: str, output_path: Path = None,
                    telemetry_dir: Path = None) -> Path:
    """Export feedback to a standalone JSON file."""
    td = telemetry_dir or TELEMETRY_DIR
    data = _load_feedback(prototype_id, td)
    out = output_path or (PROTOTYPES_DIR / f"feedback_export_{prototype_id}.json")
    _safe_json_write(data, out)
    logger.info(f"Feedback exported: {out}")
    return out


# =============================================================================
# CLI
# =============================================================================

def main():
    _fix_encoding()
    parser = argparse.ArgumentParser(description="Feedback Collector")
    parser.add_argument("--prototype-id", required=True, help="Prototype ID")
    parser.add_argument("--min-responses", type=int, default=5, help="Min responses needed")
    parser.add_argument("--response-file", help="JSON file with responses to import")
    parser.add_argument("--status", action="store_true", help="Show feedback status")
    parser.add_argument("--count", action="store_true", help="Show response count")
    parser.add_argument("--export", action="store_true", help="Export feedback to file")
    parser.add_argument("--test", action="store_true", help="Run self-test")
    parser.add_argument("--verbose", "-v", action="store_true")

    args = parser.parse_args()
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    if args.test:
        # Test: collect with synthetic data
        test_response = {
            "test_id": "test_self_check_001",
            "prototype_id": "test_proto_001",
            "answers": {
                "q1": "It seems to be a feature for managing things",
                "q2": "Yes, completed successfully",
                "q3": "Less than 5 seconds",
                "q4": "8",
                "q5": "9",
                "q6": "Nothing confusing",
                "q7": "Maybe add dark mode",
                "q8": "Looks good!"
            },
            "completed_at": datetime.now(timezone.utc).isoformat(),
        }

        # Write temp response file
        temp_file = PROTOTYPES_DIR / "_test_response.json"
        _safe_json_write(test_response, temp_file)

        result = collect_feedback("test_proto_001", min_responses=1,
                                   response_file=str(temp_file),
                                   telemetry_dir=TELEMETRY_DIR)

        assert result["count"] >= 1, f"Expected at least 1 response, got {result['count']}"
        assert result["status"] == "sufficient", f"Expected sufficient, got {result['status']}"

        status = get_feedback_status("test_proto_001")
        assert status["total_responses"] >= 1, "Status should show responses"

        # Cleanup
        temp_file.unlink(missing_ok=True)
        fb_file = _feedback_file("test_proto_001")
        fb_file.unlink(missing_ok=True)

        print(f"\n[TEST PASS] Feedback collector works correctly")
        print(f"  Responses: {result['count']}")
        print(f"  Status: {result['status']}")
        return

    if args.status:
        status = get_feedback_status(args.prototype_id)
        print(json.dumps(status, indent=2, ensure_ascii=False))
    elif args.count:
        data = _load_feedback(args.prototype_id)
        print(f"Responses: {len(data.get('responses', []))}")
    elif args.export:
        path = export_feedback(args.prototype_id)
        print(f"Exported to: {path}")
    else:
        result = collect_feedback(args.prototype_id, min_responses=args.min_responses,
                                   response_file=args.response_file)
        print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
