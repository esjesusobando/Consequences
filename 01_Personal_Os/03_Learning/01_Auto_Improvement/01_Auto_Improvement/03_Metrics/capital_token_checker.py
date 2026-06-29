#!/usr/bin/env python3
"""
Capital Token Quality Checker — Scans Shared Org for quality issues.
Part of Auto-Improvement ↔ Capital Token integration.
"""

import json
import re
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent.parent.parent
SHARED_ORG_DIR = PROJECT_ROOT / "01_Personal_Os" / "02_Knowledge" / "10_Shared_Org"
QUALITY_FILE = Path(__file__).parent / "capital_token_quality.json"


def check_yaml_frontmatter(content: str) -> list:
    """Check YAML frontmatter validity"""
    issues = []
    if not content.startswith("---"):
        issues.append("Missing YAML frontmatter (no opening ---)")
        return issues

    parts = content.split("---", 2)
    if len(parts) < 3:
        issues.append("Incomplete YAML frontmatter (no closing ---)")
        return issues

    frontmatter = parts[1].strip()
    if not frontmatter:
        issues.append("Empty YAML frontmatter")

    return issues


def check_placeholders(content: str) -> list:
    """Check for placeholder text"""
    issues = []
    pattern = r'\{\{[^}]+\}\}'
    matches = re.findall(pattern, content)
    for match in matches:
        issues.append(f"Placeholder found: {match}")
    return issues


def check_broken_refs(content: str, file_path: Path) -> list:
    """Check for broken references"""
    issues = []
    # Check for references to non-existent files
    ref_pattern = r'`([^`]+\.(?:md|yaml|json|py))`'
    for match in re.finditer(ref_pattern, content):
        ref = match.group(1)
        # Try to resolve relative to Shared Org
        if not ref.startswith("/") and not ref.startswith("http"):
            candidate = file_path.parent / ref
            if not candidate.exists():
                issues.append(f"Broken reference: {ref}")
    return issues


def check_incomplete_sections(content: str) -> list:
    """Check for incomplete sections"""
    issues = []
    lines = content.split("\n")
    for i, line in enumerate(lines):
        if line.strip().endswith("TODO") or line.strip().endswith("FIXME"):
            issues.append(f"Line {i+1}: Incomplete section ({line.strip()})")
    return issues


def scan_file(file_path: Path) -> dict:
    """Scan a single file for quality issues"""
    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception as e:
        return {
            "path": str(file_path.relative_to(PROJECT_ROOT)),
            "error": str(e),
            "issues": [],
            "quality_score": 0
        }

    issues = []
    issues.extend(check_yaml_frontmatter(content))
    issues.extend(check_placeholders(content))
    issues.extend(check_broken_refs(content, file_path))
    issues.extend(check_incomplete_sections(content))

    # Calculate quality score (100 = perfect, 0 = worst)
    penalty = len(issues) * 10
    quality_score = max(0, 100 - penalty)

    return {
        "path": str(file_path.relative_to(PROJECT_ROOT)),
        "issues": issues,
        "issue_count": len(issues),
        "quality_score": quality_score,
        "last_checked": datetime.now().isoformat()
    }


def scan_all() -> dict:
    """Scan all Shared Org files"""
    results = {
        "files": [],
        "summary": {
            "total_files": 0,
            "files_with_issues": 0,
            "total_issues": 0,
            "avg_quality_score": 100
        },
        "last_updated": datetime.now().isoformat()
    }

    if not SHARED_ORG_DIR.exists():
        return results

    for md_file in sorted(SHARED_ORG_DIR.rglob("*.md")):
        if md_file.name == "README.md":
            continue
        result = scan_file(md_file)
        results["files"].append(result)
        results["summary"]["total_files"] += 1
        if result["issue_count"] > 0:
            results["summary"]["files_with_issues"] += 1
            results["summary"]["total_issues"] += result["issue_count"]

    # Calculate average quality score
    if results["summary"]["total_files"] > 0:
        total_score = sum(f["quality_score"] for f in results["files"])
        results["summary"]["avg_quality_score"] = round(total_score / results["summary"]["total_files"], 1)

    # Save results
    QUALITY_FILE.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")

    return results


def print_report(results: dict):
    """Print quality report"""
    s = results["summary"]
    print(f"\n{'='*60}")
    print(f"CAPITAL TOKEN QUALITY REPORT")
    print(f"{'='*60}")
    print(f"Total files scanned: {s['total_files']}")
    print(f"Files with issues: {s['files_with_issues']}")
    print(f"Total issues: {s['total_issues']}")
    print(f"Average quality score: {s['avg_quality_score']}/100")
    print(f"{'='*60}\n")

    if s["files_with_issues"] > 0:
        print("FILES WITH ISSUES:")
        for f in results["files"]:
            if f["issue_count"] > 0:
                print(f"  {f['path']} ({f['issue_count']} issues, score: {f['quality_score']})")
                for issue in f["issues"]:
                    print(f"    - {issue}")
    else:
        print("All files pass quality checks!")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "scan":
        results = scan_all()
        print_report(results)
    else:
        print("Usage: python capital_token_checker.py scan")