# Design: OS Integrity Cleanup

**Change:** `os-integrity-cleanup`
**Phase:** Design
**Previous phase:** Spec (completed)
**Root:** `C:\Users\sebas\Desktop\Think_Different`
**Date:** 2026-07-09

---

## Architecture Overview

Three independent items, executed sequentially:

```
Item 1: --sync-rules flag          → Modify 20_System_Mapper_Hub.py (add ~90 lines)
Item 2: Stale manifest cleanup     → Archive dir + update 5 markdown files (14 occurrences)
Item 3: graphify update            → Single command execution
```

## Implementation Sequence

```
1. Item 2  — Archive stale manifest, create redirect stub, update 5 files
2. Item 1  — Modify 20_System_Mapper_Hub.py (sync-rules function + argparse + validate enhancement)
3. Item 1 verification — Run --sync-rules, then --validate
4. Item 3  — graphify update . (BLOCKED — see known limitations)
```

## Files Modified

| File | Change | Lines Affected |
|------|--------|---------------|
| `20_System_Mapper_Hub.py` | Add `sync_rules()` + argparse + dispatch + enhance `--validate` | ~90 new lines after line 902, ~5 lines in argparse block |
| `.agent/CLAUDE.md` | Path update | 41, 162, 204, 257 |
| `.agent/README.md` | Path update | 127 |
| `.agent/02_Skills/README.md` | Path update | 5, 59, 88 |
| `CLAUDE.md` | Path update | 256 |
| `00_Winter_is_Coming/OS_DIRECTORY.md` | Path update | 50, 251 |
| `01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/*` | Archive + replace with README stub | All files in dir |
| `01_Personal_Os/07_Archive/04_Operations_Backup/01_Stale_Manifest_v4.9/` | New archive directory | 11 files moved |
