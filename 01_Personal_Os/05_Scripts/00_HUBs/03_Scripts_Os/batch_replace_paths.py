import logging
import typing

logging.basicConfig(level=logging.INFO)
#!/usr/bin/env python3
"""
Batch path replacement script for OS filesystem restructuring.
Maps old paths → new paths:
  01_Core/ → 00_Core/
  03_Task/ → 04_Tasks/
  05_Scripts/ → 05_Scripts/00_HUBs/03_Scripts_Os/
  04_Operations/ → 05_Scripts/ (general)
"""

import os
import re
import sys
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Set

# Root directory
ROOT = Path(r"C:\Users\sebas\Desktop\Think_Different")

# Project subdirectory where the OS lives
OS_ROOT = ROOT / "01_Personal_Os"

# Excluded directories (never touch these)
EXCLUDED_DIRS = {
    ".git", "node_modules", "07_Archive", 
    ".backup", "13_Legacy", "04_Testing_Legacy"
}

# Replacement rules - ORDER MATTERS (longest prefix first)
# Covers both string paths and pathlib concatenation patterns
REPLACEMENTS: List[Tuple[str, str]] = [
    # Full pathlib path segments (with slash)
    ("05_Scripts/", "05_Scripts/00_HUBs/03_Scripts_Os/"),
    ("04_Operations/02_Tasks/", "04_Tasks/"),
    ("04_Operations/02_Tasks", "04_Tasks"),  # no trailing slash
    ("04_Operations/06_Solutions/", "01_Memory/00_Context_LLM/06_Solutions/"),
    ("04_Operations/05_Plans/", "01_Memory/00_Context_LLM/05_Plans/"),
    ("06_Projects/", "06_Projects/"),
    ("01_Memory/", "01_Memory/00_Context_LLM/"),
    ("05_Scripts/01_Auto_Improvement/", "03_Learning/01_Auto_Improvement/"),
    ("04_Operations/", "05_Scripts/"),  # generic fallback — keep LAST for 04_Operations/*
    ("01_Core/", "00_Core/"),
    ("03_Task/", "04_Tasks/"),
    
    # Pathlib concatenation: "01_Personal_Os" / "01_Core" 
    ('"01_Personal_Os" / "01_Core"', '"01_Personal_Os" / "00_Core"'),
    ("'01_Personal_Os' / '01_Core'", "'01_Personal_Os' / '00_Core'"),
    ('"01_Personal_Os" / "04_Operations"', '"01_Personal_Os" / "05_Scripts"'),
    ("'01_Personal_Os' / '04_Operations'", "'01_Personal_Os' / '05_Scripts'"),
    ('"01_Personal_Os" / "03_Task"', '"01_Personal_Os" / "04_Tasks"'),
    ("'01_Personal_Os' / '03_Task'", "'01_Personal_Os' / '04_Tasks'"),
    
    # String paths (double-quoted)
    ('"01_Core"', '"00_Core"'),
    ('"03_Task"', '"04_Tasks"'),
    ('"04_Operations"', '"05_Scripts"'),
    ('"05_Scripts"', '"05_Scripts/00_HUBs/03_Scripts_Os"'),
    ('"05_Scripts/', '"05_Scripts/00_HUBs/03_Scripts_Os/'),
    
    # String paths (single-quoted)
    ("'01_Core'", "'00_Core'"),
    ("'03_Task'", "'04_Tasks'"),
    ("'04_Operations'", "'05_Scripts'"),
    ("'05_Scripts'", "'05_Scripts/00_HUBs/03_Scripts_Os'"),
    ("'05_Scripts/", "'05_Scripts/00_HUBs/03_Scripts_Os/"),
    
    # Comments/documentation references
    ("01_Personal_Os/01_Core", "01_Personal_Os/00_Core"),
    ("01_Personal_Os/04_Operations", "01_Personal_Os/05_Scripts"),
    ("01_Personal_Os/03_Task", "01_Personal_Os/04_Tasks"),
    ("01_Core/02_Tools", "00_Core/02_Tools"),
    ("01_Core/01_Rules", "00_Core/01_Rules"),
    ("00_Core/00_Workflows_Os", "00_Core/00_Workflows"),
    ("05_Scripts", "05_Scripts/00_HUBs/03_Scripts_Os"),
    ("04_Operations/02_Agent_Teams", "05_Scripts/02_Agent_Teams"),
    ("04_Operations/06_Solutions", "01_Memory/00_Context_LLM/06_Solutions"),
    ("04_Operations/05_Plans", "01_Memory/00_Context_LLM/05_Plans"),
    ("06_Projects", "06_Projects"),
    ("01_Memory", "01_Memory/00_Context_LLM"),
    ("05_Scripts/01_Auto_Improvement", "03_Learning/01_Auto_Improvement"),
    ("03_Task/", "04_Tasks/"),
]

# Category definitions
CATEGORIES: Dict[str, Dict] = {
    "config_paths": {
        "globs": ["05_Scripts/00_HUBs/03_Scripts_Os/config_paths.py"],
        "description": "Central path config (single file)"
    },
    "aliases": {
        "globs": [
            "00_Core/02_Tools/07_Server/00_Config_Aliases/*.sh",
            "00_Core/02_Tools/07_Server/00_Config_Aliases/*.ps1",
        ],
        "description": "Terminal alias files"
    },
    "auditors": {
        "globs": [
            "05_Scripts/00_HUBs/03_Scripts_Os/12_Auditors_Os/**/*",
            "05_Scripts/00_HUBs/03_Scripts_Os/05_Validator/**/*",
            "05_Scripts/00_HUBs/03_Scripts_Os/26_*",
            "05_Scripts/00_HUBs/03_Scripts_Os/27_*",
            "05_Scripts/00_HUBs/03_Scripts_Os/29_*",
        ],
        "description": "Auditor scripts (scan-validate-audit)"
    },
    "hub-scripts": {
        "globs": ["05_Scripts/00_HUBs/03_Scripts_Os/*.py"],
        "description": "Top-level hub entry scripts"
    },
    "skills": {
        "globs": ["00_Core/02_Tools/02_Skills/**/*.md"],
        "description": "SKILL.md files"
    },
    "hooks": {
        "globs": ["00_Core/02_Tools/05_Hooks/**/*.py"],
        "description": "Hook scripts"
    },
    "auto-improvement": {
        "globs": ["03_Learning/01_Auto_Improvement/**/*.py"],
        "description": "Auto-improvement engine"
    },
    "agents": {
        "globs": ["00_Core/02_Tools/01_Agents/**/*.md"],
        "description": "Agent definition files"
    },
    "core-docs": {
        "globs": [
            "00_Core/README.md",
            "00_Core/02_Tools/README.md",
            "00_Core/02_Tools/00_SDD/**/*.md",
            "00_Core/02_Tools/06_Plugins/**/*.md",
            "00_Core/02_Tools/03_Mcp/**/*.md",
            "00_Core/02_Tools/04_Integrations/**/*.md",
            "00_Core/02_Tools/08_Evals/**/*.md",
            "00_Core/01_Inventario_Core.md",
        ],
        "description": "Core documentation files"
    },
    "agent-backup": {
        "globs": [".agent/**/*.md"],
        "description": "Agent backup files (.agent/)"
    },
    "workflows": {
        "globs": [
            "00_Core/00_Workflows/**/*.md",
            "00_Core/00_Comandos_Workflows.md",
        ],
        "description": "Workflow documentation files"
    },
    "other": {
        "globs": [
            "**/*.py", "**/*.bat", "**/*.sh", "**/*.ps1",
        ],
        "exclude_globs": [
            "**/05_Scripts/00_HUBs/03_Scripts_Os/**",  # covered by other categories
            "**/00_Core/02_Tools/02_Skills/**",
            "**/00_Core/02_Tools/05_Hooks/**",
            "**/00_Core/02_Tools/07_Server/**",
            "**/03_Learning/01_Auto_Improvement/**",
        ],
        "description": "Remaining active scripts"
    },
}


def should_exclude(path: Path) -> bool:
    """Check if path is in an excluded directory."""
    try:
        rel = path.relative_to(OS_ROOT)
        parts = set(rel.parts)
        return any(excl in parts for excl in EXCLUDED_DIRS)
    except ValueError:
        return True


def collect_files(category: str) -> List[Path]:
    """Collect files for a given category."""
    cat = CATEGORIES[category]
    files = []
    
    for glob in cat["globs"]:
        for p in OS_ROOT.glob(glob):
            if p.is_file() and not should_exclude(p):
                files.append(p)
    
    # For "other" category, also apply exclude globs
    if category == "other":
        exclude_patterns = cat.get("exclude_globs", [])
        filtered = []
        for f in files:
            rel = f.relative_to(ROOT)
            if not any(rel.match(pat.replace("**/", "")) or 
                      str(rel).startswith(pat.replace("**/", "")) 
                      for pat in exclude_patterns):
                filtered.append(f)
        files = filtered
    
    return files


def apply_replacements(content: str) -> Tuple[str, int]:
    """Apply all replacements to content, return (new_content, count)."""
    total_replacements = 0
    new_content = content
    for old, new in REPLACEMENTS:
        # Use word boundaries to avoid partial matches in identifiers
        # But we need to be careful with path separators
        pattern = re.escape(old)
        matches = list(re.finditer(pattern, new_content))
        if matches:
            new_content = re.sub(pattern, new, new_content)
            total_replacements += len(matches)
    return new_content, total_replacements


def process_category(category: str, dry_run: bool = True) -> Dict:
    """Process a category of files."""
    files = collect_files(category)
    results = {
        "category": category,
        "files_scanned": len(files),
        "files_changed": 0,
        "total_replacements": 0,
        "changes": [],
    }
    
    for f in files:
        try:
            content = f.read_text(encoding="utf-8", errors="ignore")
            new_content, count = apply_replacements(content)
            
            if count > 0:
                results["files_changed"] += 1
                results["total_replacements"] += count
                results["changes"].append({
                    "file": str(f.relative_to(ROOT)),
                    "replacements": count,
                })
                
                if not dry_run:
                    f.write_text(new_content, encoding="utf-8")
        except Exception as e:
            results["changes"].append({
                "file": str(f.relative_to(ROOT)),
                "error": str(e),
            })
    
    return results


def main():
    parser = argparse.ArgumentParser(description="Batch replace OS paths")
    parser.add_argument("--category", required=True, 
                       choices=list(CATEGORIES.keys()) + ["all"],
                       help="Category to process")
    parser.add_argument("--dry-run", action="store_true", default=True,
                       help="Show changes without applying (default)")
    parser.add_argument("--apply", action="store_true", default=False,
                       help="Apply changes")
    args = parser.parse_args()
    
    # If --apply is specified, override dry-run
    dry_run = not args.apply
    
    categories = [args.category] if args.category != "all" else list(CATEGORIES.keys())
    
    for cat in categories:
        print(f"\n{'='*60}")
        print(f"Category: {cat} ({CATEGORIES[cat]['description']})")
        print(f"Mode: {'DRY-RUN' if dry_run else 'APPLY'}")
        print(f"{'='*60}")
        
        result = process_category(cat, dry_run=dry_run)
        
        print(f"Files scanned: {result['files_scanned']}")
        print(f"Files with changes: {result['files_changed']}")
        print(f"Total replacements: {result['total_replacements']}")
        
        if result["changes"]:
            for ch in result["changes"]:
                if "error" in ch:
                    print(f"  ERROR {ch['file']}: {ch['error']}")
                else:
                    print(f"  {ch['file']}: {ch['replacements']} replacements")
        
        if result["total_replacements"] == 0:
            print("  No changes needed")


if __name__ == "__main__":
    main()