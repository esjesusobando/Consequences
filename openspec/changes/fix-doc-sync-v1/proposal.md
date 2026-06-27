# Proposal: Fix Doc Sync v1

## Intent

The 2026-06-25 session completed 13 tasks but left documentation desynchronized. Version numbers, agent counts, MCP counts, and area counts are inconsistent across README.md, CLAUDE.md, AGENTS.md, Iron_Man_Gen.md, CHANGELOG.md, GOALS.md, and BACKLOG.md. Two files are untracked. This change unifies all numbers to a single source of truth (JARVIS manifests from `20_System_Mapper_Hub.py --scan`) and fixes formatting issues.

## Scope

### In Scope
1. Unify version to v4.9.1 across all 5 files (README.md, CLAUDE.md, AGENTS.md, Iron_Man_Gen.md, CHANGELOG.md)
2. Unify agent count to manifest number across README, CLAUDE.md (3 lines), AGENTS.md, GOALS.md
3. Unify MCP count (7 root + 38 backup) across README, CLAUDE.md, AGENTS.md
4. Add missing 08_JAO row to README skills table; fix "14/15 áreas" header
5. Fix CHANGELOG.md L43 — add blank line before `## 4.1.0`
6. Fix GOALS.md L64 — remove extra asterisk in `* *Current Role:**`
7. Clean BACKLOG.md L17 — remove `?fbclid=...` tracking param
8. Rename `00_Resumen_Sesión.md` → `00_Resumen_Sesion.md` (remove accent)
9. `git add` both untracked files + commit

### Out of Scope
- Regenerating JARVIS manifests (will run `--scan` but results are SSOT reference only)
- Changing v4.9.1 to v5.0 (no code changes justify a major bump)
- Structural changes to any doc beyond the listed fixes
- Adding new documentation content

## Capabilities

### New Capabilities
None — pure doc fix, no spec-level behavior change.

### Modified Capabilities
None — no existing capabilities change behavior.

## Approach

### 1. Run SSOT scan
```
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan
```
Use manifest numbers as single source of truth.

### 2. Fix version (v4.9.1) — 5 files
| File | Fix |
|------|-----|
| README.md L1 | "v5.0 SOTA" → "v4.9.1" |
| CLAUDE.md L4 | Already v4.9.1 — verify |
| AGENTS.md L1 | "v4.9" → "v4.9.1" |
| Iron_Man_Gen.md L1+L9 | "v4.9" → "v4.9.1" |
| CHANGELOG.md | Already v4.9.1 — verify |

### 3. Fix agent count — 5 locations across 4 files
Use manifest `03_Agent_Catalog.yaml` count as SSOT.

### 4. Fix MCP count — 3 files
Use manifest `02_MCP_Registry.yaml` count (7+38).

### 5. Fix CHANGELOG formatting
Add blank line before `## 4.1.0`.

### 6. Fix GOALS.md markdown
`* *Current Role:**` → `**Current Role:**`.

### 7. Clean BACKLOG.md URL
Strip `?fbclid=...` parameter.

### 8. Rename file + git operations
Rename `00_Resumen_Sesión.md` → `00_Resumen_Sesion.md`, `git add` both files, commit.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `README.md` | Modified | Version, agent count, MCP count, skills table |
| `CLAUDE.md` | Modified | Agent count (3 lines), MCP count |
| `AGENTS.md` | Modified | Version, agent count, MCP count |
| `00_Winter_is_Coming/00_Iron_Man_Gen.md` | Modified | Version |
| `00_Winter_is_Coming/CHANGELOG.md` | Modified | L43 formatting |
| `00_Winter_is_Coming/GOALS.md` | Modified | L64 markdown fix |
| `00_Winter_is_Coming/BACKLOG.md` | Modified | L17 URL cleanup |
| `00_Resumen_Sesión.md` | Renamed | Remove accent from filename |
| `00_Capital_Token_Plan.md` | Added | git add untracked |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Manifest numbers also wrong | Low | Run `--scan` first; manual verify if unclear |
| Version debate (v5.0 vs v4.9.1) | Medium | Decision: no code changes justify v5.0 bump |
| Accent rename breaks git history | Low | Pure rename, no content change |

## Rollback Plan

`git checkout -- README.md CLAUDE.md AGENTS.md 00_Winter_is_Coming/00_Iron_Man_Gen.md 00_Winter_is_Coming/CHANGELOG.md 00_Winter_is_Coming/GOALS.md 00_Winter_is_Coming/BACKLOG.md` + rename file back.

## Dependencies

- `20_System_Mapper_Hub.py` must run successfully for SSOT numbers
- JARVIS manifests (`00_Manifest/02_MCP_Registry.yaml`, `03_Agent_Catalog.yaml`) must be accurate

## Success Criteria

- [ ] All 5 files agree on version v4.9.1
- [ ] Agent count consistent across all files (matches manifest)
- [ ] MCP count consistent (7+38) across all files
- [ ] README skills table shows 15 areas including 08_JAO
- [ ] CHANGELOG L43 has blank line before `## 4.1.0`
- [ ] GOALS.md L64 renders as bold, not italic+bold
- [ ] BACKLOG.md L17 has clean URL without fbclid
- [ ] `00_Resumen_Sesion.md` exists (no accent)
- [ ] `git status` shows clean working tree
