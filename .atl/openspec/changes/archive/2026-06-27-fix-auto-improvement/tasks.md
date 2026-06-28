# Tasks: Fix Auto-Improvement Engine

## Phase 1: Diagnostics

- [ ] **1.1 Add debug logging to executor.py**
  - Add per-fixer logging: issue found?, tier check?, auto_fix flag?, dry_run flag?, apply decision
  - Log each fixer's decision with issue path, rule matched, and reason for skip/apply
  - Files: `01_Engine/executor.py`
  - Verify: `grep "FIXER" execution.log` shows per-fixer decisions

- [ ] **1.2 Run diagnostic cycle (dry_run=False)**
  - One full cycle with debug logging enabled
  - Capture output to identify why fixes aren't applied
  - Files: (runtime only)
  - Verify: `execution.log` shows per-fixer decisions, identifies root cause

## Phase 2: Fix

- [ ] **2.1 Fix root cause in executor.py**
  - Apply the fix based on diagnostic findings (likely: path mismatch between detector absolute paths and executor relative paths, or condition check failing)
  - Files: `01_Engine/executor.py`
  - Verify: executor.py loads without syntax errors

- [ ] **2.2 Add self-scan exclusion to detector.py**
  - Add `01_Auto_Improvement/` to detector's exclusion list
  - Files: `01_Engine/detector.py`
  - Verify: cycle no longer flags engine's own files as issues

- [ ] **2.3 Add dedup to learner.py**
  - Before writing to learnings.json, collapse entries with same `issue_hash`
  - Increment `times_applied` counter instead of creating duplicate entry
  - Files: `01_Engine/learner.py`
  - Verify: two cycles with same issue → 1 entry, `times_applied=2`

## Phase 3: Clean

- [ ] **3.1 Backup and truncate learnings.json**
  - Copy original to `05_Backups/learnings.json.2026-06-27.bak`
  - Replace with deduplicated version: 3 unique patterns (structure, docs, structure)
  - Files: `03_Metrics/learnings.json`, `05_Backups/learnings.json.2026-06-27.bak`
  - Verify: learnings.json has 3 entries, backup has original 17,881 lines

- [ ] **3.2 Remove recursive directory loop**
  - Inspect `04_Operations/01_Auto_Improvement/04_Operations/`
  - If empty or mirror: delete it
  - Files: `04_Operations/01_Auto_Improvement/04_Operations/` (delete)
  - Verify: `04_Operations/` no longer contains nested `01_Auto_Improvement/`

- [ ] **3.3 Reset execution.log**
  - Truncate to a single header line marking the fix date
  - Files: `03_Metrics/execution.log`
  - Verify: file starts fresh

## Phase 4: Verify

- [ ] **4.1 Implement smoke test mode**
  - Add `--smoke` flag to `recursive_improvement_engine.py`
  - Creates a temp dir with a known-fixable issue, runs R001, verifies fix applied
  - Files: `recursive_improvement_engine.py`
  - Verify: `python recursive_improvement_engine.py --smoke` → PASS

- [ ] **4.2 Run live cycle with fixes**
  - One full cycle `dry_run=False`
  - Verify `fixes_applied > 0` in last_run.json
  - Verify `fixes_failed == 0` in last_run.json
  - Files: (runtime — check `last_run.json`)
  - Verify: at least one actual file change in git diff

- [ ] **4.3 Update completion record in proposal.md**
  - Fill in dates for Implemented, Verified
  - Files: `proposal.md`
