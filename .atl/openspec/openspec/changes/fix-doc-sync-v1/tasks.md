# Tasks: Fix Doc Sync v1

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 30–50 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Phase 0: SSOT Scan

- [ ] 0.1 Run `python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan` to get manifest numbers
- [ ] 0.2 Read `00_Manifest/03_Agent_Catalog.yaml` — record total agent count
- [ ] 0.3 Count `.mcp.json` entry objects across `00_Manifest/02_MCP_Registry.yaml` — record root + backup counts

## Phase 1: Version Unification (v4.9.1)

- [ ] 1.1 README.md L1 — change `v5.0 SOTA` → `v4.9.1 SOTA`
- [ ] 1.2 AGENTS.md L1 — change `v4.9` → `v4.9.1`
- [ ] 1.3 `00_Winter_is_Coming/00_Iron_Man_Gen.md` L1+L9 — change `v4.9` → `v4.9.1`
- [ ] 1.4 CLAUDE.md — verify v4.9.1 is already correct; skip if yes

## Phase 2: Agent & MCP Count Consistency

- [ ] 2.1 README.md — update agent count and MCP count from manifest SSOT
- [ ] 2.2 CLAUDE.md — update agent count (3 lines) and MCP count
- [ ] 2.3 AGENTS.md — update agent count and MCP count
- [ ] 2.4 GOALS.md — update agent count if referenced

## Phase 3: Skills Table Fix (README.md)

- [ ] 3.1 Add missing `| 08_JAO | ... |` row to skills table
- [ ] 3.2 Update areas count in header from 14 to 15

## Phase 4: Formatting & Cleanup Fixes

- [ ] 4.1 CHANGELOG.md L43 — add blank line before `## 4.1.0`
- [ ] 4.2 GOALS.md L64 — change `* *Current Role:**` → `**Current Role:**`
- [ ] 4.3 BACKLOG.md L17 — strip `?fbclid=...` tracking parameter from URL

## Phase 5: File Rename

- [ ] 5.1 `git mv "00_Resumen_Sesión.md" "00_Resumen_Sesion.md"` — remove accent

## Phase 6: Commit

- [ ] 6.1 Verify all changes with `git diff --stat`
- [ ] 6.2 `git add` all modified + renamed + untracked files
- [ ] 6.3 Commit with message: `docs: unify version to v4.9.1 and fix doc sync inconsistencies`
