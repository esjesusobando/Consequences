# Design: Documentation Overhaul — Ground Truth Sync v4.9.1

> **Change:** `documentation-overhaul-ground-truth-sync`
> **Phase:** Design
> **Verification Date:** 2026-06-27
> **Scope:** Documentation-only. Zero filesystem changes.

## Technical Approach

Sync 7 docs to verified disk state (snapshot 2026-06-27). Structure_v5.0.md is the **Source of Truth (SOT)** for all structure/layout/counts. All other docs reference SOT counts inline with volatility annotations. Changes applied in dependency order: SOT first, then consumers, then config.

## Architecture Decisions

### Decision: Ground Truth Pattern

| Option | Tradeoff | Decision |
|--------|----------|----------|
| A: GT table per doc | Duplication, maintenance burden | ❌ Rejected |
| B: Inline footnotes | Hard to find, too subtle | ❌ Rejected |
| C: Separate GROUND_TRUTH.md | Another file to maintain | ❌ Rejected |
| **D: SOT table in Structure_v5.0.md + inline refs in consumers** | Single source, lightweight refs | **✅ Chosen** |

**Rationale:** Structure_v5.0.md already serves as the canonical structure reference. Adding a "Ground Truth (verified 2026-06-27)" table there makes it the discoverable SOT. Other docs get a brief inline `*(Verified 2026-06-27 — see Structure_v5.0.md)*` stamp instead of duplicating the full table.

### Decision: Agent Count Precision

| Option | Tradeoff | Decision |
|--------|----------|----------|
| A: ~58 with method | Honest, reproducible | **✅ Chosen** |
| B: Range 55-60 | Too vague | ❌ Rejected |
| C: 58 verified | False precision | ❌ Rejected |

**Rationale:** The count is "~58 definition files" because `01_Agents/` includes agent `.md` files and some subdirectories contain non-agent files. The spec recommends documenting the scan command for future audits. Format: `~58` with footnote: *(~58 agent definition files in `01_Agents/` — count `.md` files recursively for live audit)*.

### Decision: Version Conflict Resolution

| Option | Tradeoff | Decision |
|--------|----------|----------|
| A: Fix root AGENTS.md to v4.9.1 | Corrects wrong claim | **✅ Chosen** |
| B: Bump all to v5.0 | Requires user sign-off, out of scope | ❌ Rejected |

**Rationale:** Root AGENTS.md claims `v5.0 SOTA` but the project is at v4.9.1. This is a factual error that the spec explicitly flags for correction. No version bump — we fix the wrong doc.

### Decision: Dynamic Count Volatility

| Annotation | Meaning | Applied To |
|------------|---------|------------|
| `[FIXED]` | Stable — changes require explicit action | Skills (396), Rules (14), MCP root (11), Hooks (11) |
| `[MAY DRIFT]` | Auto-improvement may change | Scripts (~266), Archive (15,529), Files by directory |

### Decision: 04_Operations Layout

Fix indentation in the existing ASCII tree (Option C). The engine/rules/metrics/triggers dirs and files are children of `01_Auto_Improvement/`, not siblings of `00_Context_LLM/`. Also ensure `02_Agent_Teams_Lite/` through `07_Reports/` remain at the 04_Operations level (not inside auto-improvement).

### Decision: Winter_is_Coming File Count

Remove the 3 non-existent entries from the listing silently (as spec recommends). Do NOT create a diff of what's missing — the archive has full history. Update comment from `(11 files)` to `(8 files)`.

### Decision: CHANGELOG Preservation

CHANGELOG.md is explicitly out of scope. Do not read, modify, or reference it. Zero changes.

## Data Flow

```
Structure_v5.0.md (SOT)
│
├─── README.md           (pulls metric table & tree)
├─── Root AGENTS.md      (version footer only)
├─── Winter AGENTS.md     (SDD path, MCP/agent/script counts, date)
├─── GOALS.md            (metric refs ×2 sections + date)
├─── CLAUDE.md           (status table + manifest counts)
└─── config.yaml         (version + stack MCP count)
```

No reverse dependencies. No cross-file sync needed beyond applying same verified numbers.

## File Changes

| File | Changes | Type |
|------|---------|------|
| `Structure_v5.0.md` | Fix 04_Operations nesting, 02_Knowledge numbering, 02_Playground numbering, archive counts, Winter listing (11→8), metric counts (agents 71→~58, HUBs 30→22, scripts 163→~266, hooks 10→11, workflows 28→29, MCP backup 43→4). Add Ground Truth table. | Modify |
| `README.md` | Metric table: agents 74→~58, HUBs 30→22, scripts 163→~266, MCP backup 43→4, workflows 28→29, archive 14,769→15,529. Fix OS_DIRECTORY.md in tree. Tagline 71→~58. Date 2026-06-25→2026-06-27. | Modify |
| `AGENTS.md` (root) | Footer: `v5.0 SOTA`→`v4.9.1`, date 2026-06-25→2026-06-27. | Modify |
| `00_Winter_is_Coming/AGENTS.md` | SDD path: `05_Workflows/`→`00_Agent_Teams_Lite/`. MCP counts: 7→11 root, 38→4 backup. Agent counts: 71→~58 (×4 locations). HUB/scripts: 30/163→22/~266. Workflows: 28→29. Date: 2026-06-01→2026-06-27. Section 6 header "36 Servers". | Modify |
| `00_Winter_is_Coming/GOALS.md` | Metric refs in Progress table, Strategic Context, Core Stack. Date: June 25→June 27. | Modify |
| `CLAUDE.md` | Status table: header v4.9→v4.9.1, all counts synced (HUBs, scripts, MCPs, workflows, hooks, agents). JARVIS manifest counts. Date stamps. | Modify |
| `.atl/openspec/config.yaml` | Version: `v3.0 Consequences (2026-04-26)`→`v4.9.1 (2026-06-27)`. MCP count: `33 servers`→`11 servers`. | Modify |

## Volatility Annotations

| Metric | Value | Volatility | Rationale |
|--------|-------|-----------|-----------|
| SKILL.md files | 396 | `[FIXED]` | Only changes with explicit add/remove |
| Agents | ~58 def files | `[MAY DRIFT]` | New agents can be created anytime |
| Scripts | ~266 | `[MAY DRIFT]` | Auto-improvement creates new scripts |
| HUBs (.py) | 22 | `[MAY DRIFT]` | New hubs can be added |
| Workflows (.md) | 29 | `[FIXED]` | Workflow files are stable |
| Hooks | 11 | `[FIXED]` | Hook scripts are stable |
| MCP root | 11 | `[FIXED]` | `.mcp.json` entries |
| MCP backup | 4 | `[FIXED]` | JSON in `03_Mcp/` |
| Rules (.mdc) | 14 | `[FIXED]` | Rules are governance files |

## Rollback Strategy

All files git-versioned. Individual revert:

```bash
git checkout HEAD -- Structure_v5.0.md README.md AGENTS.md 00_Winter_is_Coming/AGENTS.md 00_Winter_is_Coming/GOALS.md CLAUDE.md .atl/openspec/config.yaml
```

No data migration. No schema changes. No feature flags.

## Open Questions

- [ ] **MCP backup count**: Verified says "4 JSON files" in `03_Mcp/`. Winter AGENTS.md Section 6 lists "36 Servers" — is that the ACTIVE total (root + OpenCode combined)? Clarify in fix to avoid future confusion. **Recommended**: label Section 6 as "Active MCP Servers (11 root)" and add note about backup in `03_Mcp/`.
- [ ] **GOALS.md "Core Stack" references** (line 158): This repeats counts in an ongoing narrative. Should ALL counts be updated, or only the metric-tables? **Recommended**: Update all for consistency, flag as dynamic.

## Sequence (Apply Order)

1. `Structure_v5.0.md` — SOT, all structural fixes + Ground Truth table
2. `README.md` — Metric table + tree fix + tagline
3. `AGENTS.md` (root) — Version footer
4. `00_Winter_is_Coming/AGENTS.md` — SDD path + counts + date (skip operational procedures)
5. `00_Winter_is_Coming/GOALS.md` — Metric refs + date
6. `CLAUDE.md` — Status table + manifest + dates
7. `.atl/openspec/config.yaml` — Version + MCP count
