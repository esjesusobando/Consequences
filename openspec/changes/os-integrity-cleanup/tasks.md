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

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | All changes (A+B+C) | PR 1 | Single PR — well under 400-line budget |

## Gate Review Findings

- **W1 RESOLVED**: `MANIFEST_DIR` (line 46 of `20_System_Mapper_Hub.py`) already points to the fresh path `05_Scripts/02_Agent_Teams_Lite/00_Manifest/`. No code change needed.
- **W2 ADDRESSED**: Task B4 includes explicit regex pattern verification against the Core template's actual table format.
- **S1 DOCUMENTED**: Date suffix `{date} ✅` is a design addition (not in spec). The Core template has a 3rd column "Última verificación" with dates. Implementation must overwrite the date in column 3 with today's date, NOT inject dates into the value cell (column 2). The 8 substitution regexes only target the leading number in column 2; a separate pass updates the date column.

## Phase A: Prep — Manifest Consolidation (Item 2)

- [ ] A1. Move 11 files from `01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/` → `01_Personal_Os/07_Archive/04_Operations_Backup/01_Stale_Manifest_v4.9/`. Verify source dir is empty after move. **Risk: Low. Deps: None.**
- [ ] A2. Create `01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/README.md` redirect stub — content from design Section Step 2. **Risk: Low. Deps: A1.**
- [ ] A3. Replace stale path `00_Core/02_Tools/00_SDD/00_Manifest/` → `05_Scripts/02_Agent_Teams_Lite/00_Manifest/` in 5 files (14 occurrences): `.agent/CLAUDE.md` (L41,162,204,257), `.agent/README.md` (L127), `.agent/02_Skills/README.md` (L5,59,88), `CLAUDE.md` (L256), `00_Winter_is_Coming/OS_DIRECTORY.md` (L50,251). **DO NOT** touch `CLAUDE.md` L377 (SDD Registry parent path, out of scope). **Risk: Low. Deps: None.**
- [ ] A4. Verify: `python 20_System_Mapper_Hub.py --validate` exits 0. Verify: `grep -r "00_Core/02_Tools/00_SDD/00_Manifest" .` returns zero matches. **Risk: Low. Deps: A1–A3.**

## Phase B: `--sync-rules` Flag (Item 1)

- [ ] B1. Add `sync_rules()` function after `validate()` (after line 902) in `20_System_Mapper_Hub.py`. Reads Core template + manifest, applies 8 regex substitutions (design table: HUBs, Scripts, Skills, MCPs, Agentes source, Workflows, Hooks, Rules), updates column-3 dates to today, injects auto-generated warning comment after YAML frontmatter, writes to `.agent/00_Rules/` and `.claude/02_Rules/`. Includes 6-point verification output (line count, frontmatter, números, hallazgos, protocolo, árboles). **Risk: Medium. Deps: A4.**
- [ ] B2. Wire argparse: add `--sync-rules` flag after `--report`, add `if args.sync_rules: return sync_rules()` dispatch in `main()`. **Risk: Low. Deps: B1.**
- [ ] B3. Enhance `--validate` rules loop (after line 899): compare Core vs `.agent` line counts; if delta > 10, print drift warning suggesting `--sync-rules`, increment errors. **Risk: Low. Deps: B1.**
- [ ] B4. Run `--sync-rules`. Verify: (1) `.agent/00_Rules/12_Audit_OS_Integrity.mdc` > 70 lines, has YAML frontmatter, all 6 sections, auto-generated warning; (2) metric values match manifest counts; (3) `--validate` exits 0. Test each of 8 regex patterns against actual Core table rows. **Risk: Medium. Deps: B2.**

## Phase C: Knowledge Graph Refresh (Item 3)

- [ ] C1. Run `graphify update .` from `C:\Users\sebas\Desktop\Think_Different`. Verify exit 0, `graph.json` mtime updated. **Risk: Low. Deps: A4.**

## Phase D: Final Verification

- [ ] D1. Run all 6 GWT scenarios: S1.1 (sync-rules generates full format), S1.2 (no wrong overwrite + drift suggest), S2.1 (stale manifest archived + redirect), S2.2 (all 14 refs updated, zero stale matches), S3.1 (graphify succeeds). Document results in verify-report. **Risk: Low. Deps: B4, C1.**

---

*Generated: 2026-07-09 | Phase: Tasks | Next: sdd-apply*
