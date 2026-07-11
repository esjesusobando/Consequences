# Tasks: OS Integrity Cleanup

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~140–150 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

## Gate Review Findings

- **W1 RESOLVED**: `MANIFEST_DIR` (line 46 of `20_System_Mapper_Hub.py`) already points to the fresh path `05_Scripts/02_Agent_Teams_Lite/00_Manifest/`. No code change needed.
- **W2 ADDRESSED**: Task B4 includes explicit regex pattern verification against the Core template's actual table format.
- **S1 DOCUMENTED**: Date suffix `{date} ✅` is a design addition (not in spec). The Core template has a 3rd column "Última verificación" with dates.

## Phase A: Prep — Manifest Consolidation (Item 2)

- [x] A1. Move 11 files from `01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/` → `01_Personal_Os/07_Archive/04_Operations_Backup/01_Stale_Manifest_v4.9/`. Verify source dir is empty after move. **Risk: Low. Deps: None.** *(Reconciled: apply-progress #1422 confirms manifest consolidation pre-existing)*
- [x] A2. Create `01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/README.md` redirect stub — content from design Section Step 2. **Risk: Low. Deps: A1.** *(Reconciled: apply-progress #1422 confirms redirect stub exists)*
- [x] A3. Replace stale path `00_Core/02_Tools/00_SDD/00_Manifest/` → `05_Scripts/02_Agent_Teams_Lite/00_Manifest/` in 5 files (14 occurrences). **DO NOT** touch `CLAUDE.md` L377. **Risk: Low. Deps: None.** *(Reconciled: apply-progress #1422 confirms 14 refs updated)*
- [x] A4. Verify: `--validate` exits 0. `grep -r` returns zero matches. **Risk: Low. Deps: A1–A3.** *(Reconciled: verify-report #1423 Item 2 PASS)*

## Phase B: `--sync-rules` Flag (Item 1)

- [x] B1. Add `sync_rules()` function after `validate()` in `20_System_Mapper_Hub.py`. **Risk: Medium. Deps: A4.** *(Reconciled: verify-report #1423 Item 1 PASS — sync_rules at L924-1014)*
- [x] B2. Wire argparse: add `--sync-rules` flag. **Risk: Low. Deps: B1.** *(Reconciled: verify-report #1423 — argparse at L1064-1065)*
- [x] B3. Enhance `--validate` drift detection. **Risk: Low. Deps: B1.** *(Reconciled: verify-report #1423 — drift detect at L911-913)*
- [x] B4. Run `--sync-rules`. Verify output. **Risk: Medium. Deps: B2.** *(Reconciled: verify-report #1423 — 87 lines, full format, all sections present)*

## Phase C: Knowledge Graph Refresh (Item 3)

- [ ] C1. Run `graphify update .` from `C:\Users\sebas\Desktop\Think_Different`. **Risk: Low. Deps: A4.** *(BLOCKED — graphify update times out at 65s+ on this repo size due to AST extraction; external tooling limitation)*

## Phase D: Final Verification

- [x] D1. Run all 5 GWT scenarios for Items 1 and 2. Document results in verify-report. **Risk: Low. Deps: B4.** *(Reconciled: verify-report #1423 — S1.1 PASS, S1.2 PASS, S2.1 PASS, S2.2 PASS; S3.1 BLOCKED)*

---

## Reconciliation Log

All checkboxes above were reconciled during archive phase (2026-07-11) based on:
- Engram observation #1422 (apply-progress): confirms Phase A pre-existing, Phase B implemented, Phase C blocked
- Engram observation #1423 (verify-report): confirms Item 1 PASS, Item 2 PASS, Item 3 BLOCKED
- Orchestrator explicit instruction to reconcile stale checkboxes backed by apply-progress/verify-report proof

Only C1 remains unchecked — blocked by external tooling (graphify timeout), not incomplete implementation.
