# Proposal: Fix Stale Documentation Counts

## Intent

Active OS documentation (AGENTS.md, OS_DIRECTORY.md, Structure_v5.0.md, README.md, INDEX_AREA_FUNCTIONAL.md, 03_Agent_Catalog.yaml) contains stale factual numbers — agent counts (62→74), skill counts (392→396) — that mislead agents reading them on boot. Additionally, claude-seo-ai (Hainrixz) is installed globally but not documented in core OS docs. Ley #8 in CLAUDE.md needs updating to explicitly permit correcting factual errors in active documentation.

## Scope

### In Scope
- Update stale agent/skill/area counts in `00_Winter_is_Coming/AGENTS.md`, `OS_DIRECTORY.md`, `Structure_v5.0.md`, `01_Personal_Os/01_Core/02_Tools/02_Skills/INDEX_AREA_FUNCTIONAL.md`, and `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/03_Agent_Catalog.yaml`
- Update stale counts in `README.md` Structure section (lines 41-42)
- Update Ley #8 in `CLAUDE.md` to allow correcting factual data in active docs
- Add claude-seo-ai documentation to `OS_DIRECTORY.md`, `Structure_v5.0.md`, and `AGENTS.md`
- Keep historical changelog entries intact — only update current-state numbers

### Out of Scope
- Deleting or rewriting Process Notes (40_NP)
- Changing architecture descriptions, design decisions, or historical references
- Regenerating skill-registry or agent manifests (count updates only)
- Fixing non-count content errors discovered during review
- Automating count verification (one-time manual fix)

## Capabilities

### New Capabilities
- None — no new spec-level behavior introduced

### Modified Capabilities
- None — this is a documentation accuracy fix, not a behavior change

## Approach

1. **Update Ley #8** in `CLAUDE.md`: add explicit exception for correcting stale factual data in active documentation (protects historical/architecture content, allows number fixes)
2. **Count sweep — 6 files**: replace stale agent/skill numbers with verified disk counts (74 agents, 396 skills, 15 áreas)
3. **claude-seo-ai documentation**: add tool entry in `AGENTS.md` (Slash Commands / MCP section), `OS_DIRECTORY.md` (Global Skills section), and `Structure_v5.0.md` (available tools)
4. **Verify no stale numbers remain**: grep all affected files for the old values

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `CLAUDE.md` | Modified | Update Ley #8 to allow factual corrections |
| `00_Winter_is_Coming/AGENTS.md` | Modified | 6+ stale numbers (agent/skill counts), add claude-seo-ai ref |
| `00_Winter_is_Coming/OS_DIRECTORY.md` | Modified | 8+ stale numbers, add claude-seo-ai ref |
| `README.md` | Modified | Lines 41-42: 63→74 agents, 392→396 skills |
| `Structure_v5.0.md` | Modified | Line 160: 63→74 agentes, add claude-seo-ai ref |
| `01_Personal_Os/01_Core/02_Tools/02_Skills/INDEX_AREA_FUNCTIONAL.md` | Modified | Line 231: 392→396 skills |
| `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/03_Agent_Catalog.yaml` | Modified | Line 11: source 63→74 |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Overwriting historical changelog entries | Low | Fix only current-state tables/headers; leave CHANGELOG and historical notes untouched |
| Ley #8 change interpreted too broadly | Low | Narrow wording: "corregir datos factuales obsoletos en documentación activa" only |
| Agent count discrepancy (63 vs 74) | Low | Use actual `.md` file count on disk from `01_Agents/` as source of truth |

## Rollback Plan

Revert each file individually via `git checkout <file>` — changes are independent per file with no cross-file dependencies.

## Dependencies

- None — changes are pure text edits, no tooling or build required

## Completion Record

| Event | Date |
|-------|------|
| Proposed | 2026-06-27 |
| Implemented | 2026-06-27 |
| Verified | 2026-06-27 |
| Archived | 2026-06-27 |

### Post-Verify Fix

CLAUDE.md line 206: `63` → `74` — one remaining stale count found during verification grep sweep and corrected immediately.

### Success Criteria

- [x] All stale counts verified via grep — no remaining 61/62/63 agent or 392 skill references in active documentation
- [x] claude-seo-ai referenced in AGENTS.md, OS_DIRECTORY.md, and Structure_v5.0.md
- [x] Ley #8 updated in CLAUDE.md with factual-correction exception
- [x] All historical/changelog entries intentionally preserved
