# Spec: Debug and Fix Executor

## REQ-EXEC-01: Executor Diagnostics
The executor MUST log per-fixer decisions when `dry_run=True`, showing for each fixer:
- Whether a fixable issue was found
- Why it decided to skip or apply
- The exact path and proposed change

## REQ-EXEC-02: Fix Application
When `dry_run=False`, the executor MUST apply fixes for all issues matching tier-1 auto_fix rules (R001-R004). At least 1 fix MUST be applied per cycle on a non-pristine codebase.

## REQ-EXEC-03: Fix Verification
After applying a fix, the executor MUST verify the file was actually modified (check mtime or content hash). If the write silently failed, it MUST log a WARNING and retry once.

## REQ-EXEC-04: Error Resilience
If a fixer fails (exception, permission denied, file not found), the executor MUST:
- Log the error with stack trace
- Continue to the next fixer
- Report total applied/failed/skipped at cycle end

---

# Spec: Clean Learnings and Remove Recursive Dir

## REQ-CLEAN-01: Learnings Dedup
`learnings.json` MUST contain only unique pattern entries. Consecutive entries with the same `issue_hash` MUST be collapsed into one entry with an increased `times_applied` counter.

## REQ-CLEAN-02: Learnings Archive
The original `learnings.json` MUST be backed up to `05_Backups/learnings.json.2026-06-27.bak` before truncation.

## REQ-CLEAN-03: Recursive Directory Removal
The path `04_Operations/01_Auto_Improvement/04_Operations/` MUST be inspected for real files. If empty or containing only mirrored structure, it MUST be deleted. The detector SHOULD exclude `01_Auto_Improvement/` from its own scan path to prevent future self-referential issues.

## REQ-CLEAN-04: Log Reset
After cleanup, `execution.log` SHOULD start fresh with a single entry marking the fix date.

---

# Spec: Health Monitoring

## REQ-HEALTH-01: Zero-Fix Warning
After each cycle, if `fixes_applied == 0` for 3 or more consecutive cycles, the system MUST emit a WARNING-level log entry.

## REQ-HEALTH-02: Smoke Test
A smoke-test mode (`--smoke`) MUST run a single fixer (R001: broken_import_legacy) against a known test directory and report PASS/FAIL.
