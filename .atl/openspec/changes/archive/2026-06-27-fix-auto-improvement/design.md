# Design: Fix Auto-Improvement Engine

## Architecture Overview

The current pipeline: `DETECT → ANALYZE → EXECUTE → LEARN → EVOLVE`

The fix focuses on the EXECUTE and LEARN stages, with a minor change to DETECT.

```
Before: DETECT(47-55) → ANALYZE → EXECUTE(skip all) → LEARN(write 47 redundant entries) → EVOLVE
After:  DETECT(47-55) → ANALYZE → EXECUTE(apply R001-R004) → LEARN(dedup + 1 entry per pattern) → EVOLVE
```

## Key Design Decisions

### D1. Debug-first approach
We don't know WHY the executor skips all fixes. Root cause could be:
- Path resolution: executor uses relative paths that don't match detector's absolute paths
- Condition check: tier-1 auto_fix check evaluates to False for all detected issues
- Dry-run override: some flag in the cycle logic overrides `dry_run=False`
- Permission: Windows file locking prevents writes

**Strategy**: Add per-fixer logging first, run one cycle, inspect logs, THEN fix.

### D2. learnings.json restructure
Current format is a flat array with duplicate entries. New format:
```
{
  "patterns": [ ... deduplicated ... ],
  "archive": "05_Backups/learnings.json.2026-06-27.bak",
  "last_dedup": "2026-06-27"
}
```

### D3. Self-scan exclusion
Detector walks the entire project root. When it scans `01_Auto_Improvement/`, it finds its own log files and flags them. Adding exclusion pattern for the engine's own directory prevents this.

## Data Flow

```
recursive_improvement_engine.py
  → detector.py (scan root, EXCLUDE engine dir)
    → analyzer.py (match against auto_fix_rules.json)
      → executor.py (FIXED: apply R001-R004 tier-1 rules)
        → learner.py (FIXED: dedup before write)
          → metrics_tracker.py (log results)
```

## Files

| File | Change |
|------|--------|
| `01_Engine/executor.py` | Debug logging + fix application logic |
| `01_Engine/detector.py` | Add exclusion path for `01_Auto_Improvement/` |
| `01_Engine/learner.py` | Add dedup before write |
| `03_Metrics/learnings.json` | Truncate + archive |
| `03_Metrics/execution.log` | Reset |
| `03_Metrics/last_run.json` | Update after fix |
| `04_Operations/01_Auto_Improvement/` | Remove recursive loop |
| `05_Backups/learnings.json.2026-06-27.bak` | Archive of original |

## Verification

1. Run `python recursive_improvement_engine.py --smoke` → PASS
2. Run full cycle `dry_run=True` → logs show fix decisions
3. Run full cycle `dry_run=False` → `fixes_applied > 0`
4. Check `last_run.json` → `fixes_applied > 0`
