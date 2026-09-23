---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\best-practices\shared-utilities-extraction-2026-07-27.md'
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\best-practices\shared-utilities-extraction-2026-07-27.md"
sync_date: "2026-08-01T00:55:46.380813"
sync_updated: true
title: "Extract shared utilities to prevent duplication across scripts"
---

## Problem

Multiple Python scripts in the Skill Auditor (`audit-skills.py`, `validate-essence.py`) contained identical utility functions (`find_project_root()`, `find_opencode_skills_dir()`, `find_skill_dirs_recursive()`, `read_skill_content()`). This duplication caused:

1. **Inconsistent behavior** — `validate-essence.py` used a different OS fallback path (`02_Skills` vs `01_Personal_Os/00_Core/02_Tools/02_Skills`)
2. **Silent encoding errors** — `audit-skills.py` used `errors='ignore'` which silently dropped corrupted bytes instead of warning
3. **Broken references** — SKILL.md referenced `02_References` directory that didn't exist (was `03_References`)
4. **Maintenance burden** — fixing a bug in one script's copy didn't fix the other

## Symptoms

- `ce:review` flagged 4 WARNINGs and 3 SUGGESTIONs
- Progressive Disclosure limit inconsistency: 500 in SKILL.md vs 700 in audit-criteria.md
- OS fallback paths diverged between scripts

## Solution

Created `_auditor_utils.py` as a shared module containing all common utilities:

```python
# _auditor_utils.py — shared utilities for Skill Auditor scripts
import os
import logging

logger = logging.getLogger(__name__)

def find_project_root():
    """Walk up from CWD to find .git or .opencode marker."""
    ...

def find_opencode_skills_dir(project_root):
    """Resolve OpenCode skills directory with OS fallback."""
    ...

def find_skill_dirs_recursive(base_path, max_depth=2):
    """Recursively discover skill directories."""
    ...

def read_skill_content(skill_dir):
    """Read SKILL.md with encoding error warnings (not silent drops)."""
    ...
```

Key improvement in `read_skill_content()`:

```python
# Before (audit-skills.py):
content = f.read().decode("utf-8", errors="ignore")

# After (_auditor_utils.py):
try:
    content = f.read().decode("utf-8")
except UnicodeDecodeError as e:
    logger.warning(f"Encoding error in {skill_dir / 'SKILL.md'}: {e}")
    content = f.read().decode("utf-8", errors="replace")
```

Both scripts now import from the shared module:

```python
from _auditor_utils import (
    find_project_root,
    find_opencode_skills_dir,
    find_skill_dirs_recursive,
    read_skill_content,
)
```

## Why This Works

- **Single source of truth** — one place to fix bugs, one behavior to test
- **Consistent fallback paths** — both scripts use the same OS detection logic
- **Visible warnings** — encoding errors are logged instead of silently swallowed
- **DRY principle** — changes to utility behavior propagate automatically

## Prevention

1. **When creating a new script** that duplicates 2+ functions from an existing script, extract to a shared module first
2. **Run `ce:review`** after refactoring to catch inconsistencies
3. **Use `errors='replace'` instead of `errors='ignore'`** for UTF-8 decoding — corrupted bytes should be visible, not hidden
4. **Validate reference paths** in SKILL.md against actual directory structure before committing

## Files Changed

- `_auditor_utils.py` — NEW shared utilities module
- `audit-skills.py` — imports from shared module, removed duplicated functions
- `validate-essence.py` — imports from shared module, removed duplicated functions, unified OS fallback
- `SKILL.md` — fixed broken reference path, aligned Progressive Disclosure limits
