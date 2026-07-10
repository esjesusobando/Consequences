# Proposal: OS Integrity Cleanup

## Intent

Resolve 3 integrity gaps found after `os-integrity-sync`: divergent .agent audit rules, duplicate manifest locations, and stale knowledge graph. All are low-risk but cause silent drift over time.

## Scope

### In Scope
1. **Sync .agent audit rules** — update `20_System_Mapper_Hub.py` to generate the full-format `.agent/00_Rules/12_Audit_OS_Integrity.mdc` (matching `01_Personal_Os/00_Core/01_Rules/`), not the current 31-line table.
2. **Consolidate manifests** — remove the stale copy at `01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/` after redirecting all references to the fresh path at `01_Personal_Os/05_Scripts/02_Agent_Teams_Lite/00_Manifest/`.
3. **Refresh knowledge graph** — run `graphify update .` from project root.

### Out of Scope
- Full sync of master docs (OS_DIRECTORY.md, CLAUDE.md, AGENTS.md, README.md) — deferred to a dedicated sync change.
- Structural changes to the manifest generation pipeline beyond the rules template.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- None — pure cleanup/ops, no spec-level behavior changes.

## Approach

**Item 1** — Extend `20_System_Mapper_Hub.py` with a `--sync-rules` flag that:
  1. Reads the Core mdc template (`01_Personal_Os/00_Core/01_Rules/12_Audit_OS_Integrity.mdc`).
  2. Substitutes canonical numbers from the current manifest JSON.
  3. Writes the full-format file to `.agent/00_Rules/12_Audit_OS_Integrity.mdc`.
  4. Optionally auto-triggers after `--validate` when drift is detected.

**Item 2** — Two-phase:
  - Phase A: Update all files referencing the stale path (6 files identified) to point to the fresh manifest path.
  - Phase B: Archive the stale manifest dir, replacing it with a README redirect stub.

**Item 3** — Single `graphify update .` execution from project root. No recurring change.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `20_System_Mapper_Hub.py` | Modified | Add `--sync-rules` subcommand |
| `.agent/00_Rules/12_Audit_OS_Integrity.mdc` | Modified | Regenerated with full format |
| `CLAUDE.md` (root) | Modified | Reference path update |
| `.agent/CLAUDE.md` | Modified | Reference path update |
| `.agent/README.md` | Modified | Reference path update |
| `.agent/02_Skills/README.md` | Modified | Reference path update |
| `OS_DIRECTORY.md` | Modified | Reference path update |
| `01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/` | Removed | Archived with redirect stub |
| `02_Playground/Graphify_Out/` | Modified | Graph refresh |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Miss a stale-path reference in docs | Low | Grep full repo for `00_SDD/00_Manifest` after changes |
| `--sync-rules` overwrites hand-edited .agent mdc | Low | Script reads Core as template — .agent is auto, not hand-curated |
| graphify missing/unavailable | Low | Fall back to manual step in tasks |

## Rollback Plan

- **Item 1**: Revert the `20_System_Mapper_Hub.py` change; the old .agent file was auto-generated and `--validate` can re-check.
- **Item 2**: Restore the archived stale manifest dir from git (`git checkout -- <path>`). Revert doc references.
- **Item 3**: Not applicable — graphify is additive only.

## Dependencies

- `20_System_Mapper_Hub.py` must be runnable (Python 3.10+).

## Success Criteria

- [ ] `python 20_System_Mapper_Hub.py --sync-rules` generates `.agent/00_Rules/12_Audit_OS_Integrity.mdc` matching the Core version structure.
- [ ] `--validate` passes with all 3 rules files in sync.
- [ ] Zero references to `00_Core/02_Tools/00_SDD/00_Manifest/` remain in the repo.
- [ ] `graphify update .` exits 0.
