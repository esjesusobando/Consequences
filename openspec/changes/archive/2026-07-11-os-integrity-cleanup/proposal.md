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

## Success Criteria

- [ ] `python 20_System_Mapper_Hub.py --sync-rules` generates `.agent/00_Rules/12_Audit_OS_Integrity.mdc` matching the Core version structure.
- [ ] `--validate` passes with all 3 rules files in sync.
- [ ] Zero references to `00_Core/02_Tools/00_SDD/00_Manifest/` remain in the repo.
- [ ] `graphify update .` exits 0.
