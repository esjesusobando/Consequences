# Proposal: Fix Auto-Improvement Engine — Stop Detecting, Start Fixing

## Intent

The Auto-Improvement System v6.1 (`01_Personal_Os/04_Operations/01_Auto_Improvement/`) has been running for 20+ days (60+ cycles) detecting 47-55 issues per cycle but applying ZERO fixes. The engine architecture (DETECT → ANALYZE → EXECUTE → LEARN → EVOLVE) is correct, but the executor silently fails to apply any changes. Additionally, `learnings.json` has bloated to 17,881 lines with redundant entries, and a recursive directory loop exists in `04_Operations/`.

The goal is to debug the executor, clean the data rot, remove recursive noise, and make the engine actually improve the OS instead of just reporting issues.

## Scope

### In Scope
- Debug executor.py v2.0 (6 fixers) to determine why `fixes_applied=0` despite `dry_run=False`
- Fix root cause so fixes actually apply
- Truncate and restructure `learnings.json` — deduplicate, cap at current patterns, move history to archive
- Remove recursive directory loop `04_Operations/01_Auto_Improvement/04_Operations/...`
- Update `last_run.json` and `execution.log` to reflect clean state
- Add logging to detect future executor failures early
- Run one live cycle with `dry_run=False` to prove fixes apply

### Out of Scope
- Redesigning the engine architecture
- Adding new fixer rules (existing 7 rules are sufficient for now)
- Changing the cron trigger schedule
- Integrating with other OS systems

## Capabilities

### Modified Capabilities
- **Executor**: MUST apply fixes when `dry_run=False`, not silently skip
- **Learner**: MUST deduplicate patterns before writing to `learnings.json`
- **Detector/config**: SHOULD exclude `04_Operations/01_Auto_Improvement/` from scanning to prevent self-referential detection

## Approach

1. **Diagnose executor**: Add debug logging to executor.py to trace why each fixer decides NOT to apply a fix. Test each fixer individually against known-fixable issues.
2. **Fix executor**: Patch the root cause (likely a path resolution bug, permission issue, or conditional that never evaluates to True).
3. **Clean learnings.json**: Replace 17,881-line blob with deduplicated patterns + archive the old file to `05_Backups/`.
4. **Remove recursive directory**: `04_Operations/01_Auto_Improvement/04_Operations/` — move any real content, delete the loop.
5. **Run live cycle**: Execute one full cycle with `--apply` to prove fixes apply. Verify `fixes_applied > 0` in `last_run.json`.
6. **Add health check**: After each cycle, log `fixes_applied` count. If 0 for 3+ consecutive cycles, emit a WARNING.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `01_Engine/executor.py` | Modified | Debug + fix executor logic |
| `01_Engine/detector.py` | Modified | Add self-scan exclusion |
| `01_Engine/learner.py` | Modified | Add dedup before write |
| `02_Rules/auto_fix_rules.json` | Modified | Add realistic test pattern if missing |
| `03_Metrics/learnings.json` | Modified | Truncate to deduplicated patterns |
| `03_Metrics/execution.log` | Modified | Clean start after fix |
| `03_Metrics/last_run.json` | Modified | Reflect fixed state |
| `04_Operations/` | Modified | Remove recursive directory loop |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Executor root cause is subtle (Windows path encoding, permission) | Medium | Add debug logging per fixer; test each fixer independently |
| learnings.json truncation loses valuable patterns | Low | Archive original to `05_Backups/learnings.json.2026-06-27.bak` |
| Live cycle breaks something | Medium | Dry-run first; `git status` before and after to verify only expected files change |
| Recursive dir has real files | Low | Inspect before deleting; move anything real |

## Rollback Plan

For executor: `git checkout 01_Engine/executor.py`
For learnings: revert from `05_Backups/learnings.json.2026-06-27.bak`
For recursive dir: the deletion is safe (empty or mirror of parent)

## Dependencies

- Python 3.x with standard library only (no external deps)
- Git to snapshot state before/after live cycle

## Completion Record

| Event | Date |
|-------|------|
| Proposed | 2026-06-27 |
| Implemented | 2026-06-27 |
| Verified | 2026-06-27 |
| Archived | 2026-06-27 |

### Verification Results

- ✅ Smoke test passed: 2 fixes detected, 0 failures
- ✅ Live run passed: 6 fixes applied, 0 failures
- ✅ learnings.json truncated: 17,881 → 2,332 lines
- ✅ Backup created: learnings.json.bak (17,880 lines)
- ✅ Recursive directory removed: 04_Operations/01_Auto_Improvement/04_Operations/
- ✅ Git status: only expected files modified

### Success Criteria

- [x] Executor applies fixes when dry_run=False (verified: 6 fixes applied in live run)
- [x] learnings.json deduplicated (17,881 → 2,332 lines, 87% reduction)
- [x] Recursive directory loop removed
- [x] Smoke test mode implemented and passing
- [x] Self-scan exclusion added to detector
