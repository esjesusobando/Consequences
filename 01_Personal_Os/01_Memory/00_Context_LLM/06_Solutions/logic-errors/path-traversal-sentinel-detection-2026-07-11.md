---
title: "Fixed repeated .parent() path resolution bug across 10+ Python scripts"
category: logic-errors/
problem_type: logic_error
component: tooling
root_cause: config_error
resolution_type: tooling_addition
severity: high
date: 2026-07-11
project: "Personal OS"
files_changed: 11
verification: "config_paths.py --validate exits 0, 82/82 paths correct"
tags:
  - python
  - path-resolution
  - sentinel-detection
  - config-paths
  - bug-pattern
  - centralization
last_updated: 2026-07-11
---

# Path Traversal Bug — Sentinel-Based Repository Root Detection

## Problem

Ten-plus Python scripts each hardcoded `Path(__file__).parent.parent.parent.parent` to find the repository root, but used the wrong number of `.parent` calls — resolving to `01_Personal_Os/` instead of the actual project root. This caused **every derived path to double-nest** (e.g., `01_Personal_Os/01_Personal_Os/05_Scripts/...`).

## Symptoms

- All path-dependent operations pointed at doubled directory prefixes
- Any file read, write, or config lookup constructed through the old `REPO_ROOT` silently resolved to a non-existent or wrong location
- Scripts appeared to run but operated on phantom paths
- The Watchdog (17_Watchdog_Hub.py) monitored the wrong directory tree
- Agent mirrors wrote configs to incorrect locations
- Telemetry data couldn't be found

## Root Cause

Scripts are located at: `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/<script_name>.py`

The `.parent` chain:
- `.parent` → `03_Scripts_Os/`
- `.parent` → `00_HUBs/`
- `.parent` → `05_Scripts/`
- `.parent` → `01_Personal_Os/` ← WRONG, needs ONE MORE level to reach repo root

Counting directory levels by hand is fragile — it breaks whenever the script moves to a different nesting depth.

## What Didn't Work

| Approach | Why It Failed |
|----------|--------------|
| Manually adjusting `.parent` count per script | Fragile — breaks if file moves between nesting levels |
| Hardcoding absolute repo root path | Breaks on different machines/users |
| Using `os.getcwd()` | Fails when script is invoked from a different directory |

## Solution

Replace all positional `.parent` counting with **sentinel-based upward directory search**. A single function walks parent directories looking for a known marker folder (`00_Winter_is_Coming`), and every script imports path constants from one shared module.

### Before (fragile, repeated in every script)

```python
from pathlib import Path
REPO_ROOT = Path(__file__).parent.parent.parent.parent  # WRONG count
```

### After (centralized in `config_paths.py`)

```python
from pathlib import Path

def find_repo_root(marker: str = "00_Winter_is_Coming") -> Path:
    """Find repo root by searching for a sentinel marker in parent directories."""
    current = Path(__file__).resolve().parent
    for parent in current.parents:
        if (parent / marker).exists():
            return parent
    raise FileNotFoundError(f"Sentinel '{marker}' not found in any parent of {current}")

REPO_ROOT = find_repo_root()
SCRIPTS_DIR = REPO_ROOT / "01_Personal_Os" / "05_Scripts"
HUBS_DIR = SCRIPTS_DIR / "00_HUBs"
SCRIPTS_OS_DIR = HUBS_DIR / "03_Scripts_Os"
```

### Script Usage

```python
from config_paths import ROOT_DIR, SCRIPTS_DIR, HUBS_DIR
```

No more path logic in individual scripts. Just import and use.

### Verification

Built-in validation: `config_paths.py --validate` checks all 82 derived paths and exits non-zero if any are broken.

## Why This Works

The root cause was **counting directory levels by hand** — an assumption about file location depth that silently breaks when the assumption changes. Sentinel-based detection removes the depth assumption entirely: it does not care how many levels deep the calling script lives, it only cares that it can walk upward until it finds a known marker.

The marker `00_Winter_is_Coming` is a unique, unambiguous directory that exists only at the repo root. By centralizing this logic in one module, the count-of-parents problem exists in exactly one place and every script inherits the correct result.

## Prevention

1. **Never use more than one `.parent` call** in any script. If you need the repo root, import from `config_paths.py`.
2. **`config_paths.py` is the single source of truth** for every path constant. Add new paths there, never inline.
3. **After adding or changing paths**, run `config_paths.py --validate` to confirm all 82 paths resolve.
4. **Code review gate**: any script containing more than one `.parent` in a path assignment gets flagged and must be refactored to use the shared module.
5. **Document the sentinel convention** (`00_Winter_is_Coming` prefix) so new contributors understand the pattern.

## Related Docs

- `05_Plans/2026-07-07-001-fix-os-edge-cases-sota-plan.md` — Original implementation plan that created `path_guardian.py`
- `01_Process_Notes/46_NP_Paths_Compactacion_v5_2026-07-03.md` — Key lesson: `config_paths.py` es la fuente de verdad
- `01_Process_Notes/_archive/06_NP_Edge_Cases_Audit.md` — Original audit that identified the problem (EC-06, EC-08, EC-09)

## Remaining Risk

**15 files still use raw `.parent` chains** and have NOT been migrated:

| File | Parent chain length |
|------|-------------------|
| `lazy_loader.py` | 4 |
| `adaptive_boot.py` | 4 |
| `post_hulk_compound.py` | 3 |
| `post_tool_use.py` | 3 |
| `stop.py` | 3 |
| `subagent_stop.py` | 3 |
| `pre_tool_use.py` | 3 |
| `secret_scanner.py` | 6 |
| `22_Validate_Skill_Frontmatter.py` | 5 |
| `integration_wrapper.py` | 4 |
| `pattern_aggregator.py` | 5 |
| `capital_token_checker.py` | 5 |

The hooks directory (`00_Core/02_Tools/05_Hooks/`) is the biggest holdout — likely because hooks cannot import `config_paths` without adding `sys.path.insert`, creating a chicken-and-egg bootstrap problem.

## Verification Evidence

```
> python config_paths.py --validate
config_paths validation: 82/82 paths OK, 0 references live
Exit code: 0
```
