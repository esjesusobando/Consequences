# Proposal: Documentation Overhaul — Ground Truth Sync v4.9.1

## Intent

Sync all docs to verified disk state after months of undocumented drift. No renaming, moving, or code changes.

## Scope

**In**: Structure_v5.0.md, README.md, AGENTS.md (root+Winter), GOALS.md, CLAUDE.md, .atl/openspec/config.yaml
**Out**: Renaming dirs, moving files, code changes, new docs

## Capabilities

**New**: None. **Modified**: None — documentation-only.

## Approach

| Phase | What |
|-------|------|
| 1 | Structure_v5.0.md (source of truth) |
| 2 | README.md |
| 3 | AGENTS.md (both root + Winter) |
| 4 | GOALS.md |
| 5 | CLAUDE.md + config.yaml |
| 6 | Any remaining doc with wrong counts |

## Ground Truth (verified 2026-06-27)

| Metric | Docs Say | Reality |
|--------|----------|---------|
| Skills | 396 | 396 ✅ |
| Agents | 71/74/61 | ~58 def files |
| Scripts | 163 | 266+ |
| HUBs | 30 | ~22 hub-named .py |
| Workflows | 28 | 30 .md |
| Hooks | 10 | 13 files |
| MCP root | 7/11 | 11 ✅ |
| MCP backup | 38/43 | 4 JSON |
| Archive | 14,769 | 15,529 |

## Critical Path Errors

| Error | Doc | Fix |
|-------|-----|-----|
| 04_Operations engine/rules/metrics/triggers shown flat | Structure_v5.0 | Nest inside 01_Auto_Improvement/ |
| SDD path says 05_Workflows/ | Winter AGENTS.md | → 00_Agent_Teams_Lite/ |
| 02_Knowledge numbering off by +2 | Structure_v5.0 | Fix numbering |
| 02_Playground numbering wrong | Structure_v5.0 | Match disk |
| Winter file count: 11 stated, 8 real | Structure_v5.0 | Correct count |

## Principles

- Fix docs only, NOT disk. Document what IS, not what SHOULD BE
- Preserve CHANGELOG entries. Add Ground Truth sections for future-proofing
- Leave AGENTS.md operational procedures intact

## Risks

| Risk | Mitigation |
|------|------------|
| Counts shift during project | Lock snapshot; flag volatile counts |
| Agent count imprecise | Document as approximate with method |
| Auto-Improvement reverts fixes | Ground Truth section makes re-fixes idempotent |

## Rollback

All files git-versioned — revert individually:
```bash
git checkout HEAD -- Structure_v5.0.md README.md
```

## Success Criteria

- [ ] Structure_v5.0.md counts match disk state (all metrics)
- [ ] README.md metric table matches verified counts
- [ ] Both AGENTS.md have correct agent counts, SDD paths, MCP counts
- [ ] GOALS.md metric references match reality
- [ ] CLAUDE.md system status table synced
- [ ] Zero filesystem files renamed, moved, or deleted
