# Design: OS Reorganize — PersonalOS v5.0 Structural Refactor

## Technical Approach

Pure structural refactor: filesystem moves, symlink repoints, config updates. No code logic changes. Execute in 4 sequential phases (A–D) with `config_paths.py --validate` as validation gate between each.

**Safety invariant**: Every phase uses copy-then-delete (never pure `mv`/`rm`). Zip snapshot before each phase for rollback.

```
Phase A: Reference Integrity     → Repoint symlinks, update skill-registry
Phase B: Directory Consolidation → Merge .agents/ into .agent/, move Claude_Ads
Phase C: Cleanup                 → Remove empty dirs, dedup openspec-convention
Phase D: Verification            → Full validate sweep, stale-ref grep
```

## Architecture Decisions

### Decision: Copy-then-delete pattern

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `mv` (atomic move) | Fast but unrecoverable on interruption | Rejected |
| `cp` then `rm` on success | Slower; safe; rollback = delete copy | **Chosen** |
| Git branch + commit per phase | Full history; heavy for filesystem moves | Rejected |

**Rationale**: Interrupted `cp` leaves source intact. Interrupted `mv` can lose files. For a structural refactor touching 21 skill dirs + 26 agent files, safety > speed.

### Decision: Symlinks repointed BEFORE source deletion

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Repoint after delete | Creates broken symlinks window | Rejected |
| Repoint before delete | Brief window with duplicate targets | **Chosen** |
| Delete symlinks + recreate | Loses symlink metadata | Rejected |

**Rationale**: `.claude/skills/` has 21 symlinks currently pointing to `.agents/skills/`. If we delete `.agents/` first, Claude Code skill discovery breaks immediately. Repointing first is safe — both targets exist briefly.

### Decision: config_paths.py as validation gate

**Choice**: Run `config_paths.py --validate` after each phase. If exit != 0, STOP and rollback that phase.

**Rationale**: config_paths.py already validates 82+ path constants against disk. It's the existing ground-truth for path integrity. No new tooling needed.

### Decision: Agent .md file grouping strategy

**Choice**: Group by functional prefix (00–07 = infrastructure, 08–12 = templates/SOPs, 13–22 = named agents, MARKETING = pipeline).

**Rationale**: Files already have numbered prefixes indicating their domain. Grouping preserves existing naming while eliminating root-level clutter.

## File Changes

### Phase A — Reference Integrity (no filesystem moves)

| File | Action | Description |
|------|--------|-------------|
| `.claude/skills/*` (21 symlinks) | Repoint | `.agents/skills/{name}` → `.agent/02_Skills/{name}` |
| `.atl/skill-registry.md` | Modify | Lines 12,14: `.agents\skills` → `.agent\02_Skills` |

**Gate**: `config_paths.py --validate` (no path constants reference `.agents/`, so gate is for general health).

### Phase B — Directory Consolidation

| Source | Destination | Action |
|--------|-------------|--------|
| `.agents/skills/*` (21 dirs) | `.agent/02_Skills/` | Copy new skills only (name-conflict: `.agent/` wins) |
| `.agents/` | — | Delete after all copies verified |
| `.agent/02_Skills/05_Claude_Ads/` | `.agent/01_Agents/05_Claude_Ads/` + `01_Personal_Os/06_Projects/` | Copy; project files → Projects, agent config stays |
| `.agent/02_Skills/05_Claude_Ads/` (original) | — | Delete after copy verified |
| `01_Personal_Os/03_Resultado/` | — | Delete (root `03_Resultado/` is canonical) |

**Note on 05_Claude_Ads**: Contains both project root files (README, CLAUDE.md, etc.) and agent/skill subdirs. The skill dirs (`01_Ads`, `03_Agents`, `05_Skills`, `08_Research`) stay as a skill; the project root files move to `06_Projects/`.

**Gate**: `config_paths.py --validate` + `find .agent/02_Skills -name "SKILL.md" | wc -l` must be ≥ 429 (396 existing + new from .agents merge).

### Phase C — Cleanup

| Target | Action | Description |
|--------|--------|-------------|
| `.agent/04_Extensions/hooks/` | Delete | Empty directory |
| `.cursor/rules/` | Delete | Empty directory |
| `01_Personal_Os/00_Core/03_Content/` | Delete | Empty directory |
| `01_Personal_Os/00_Core/04_Telemetry/` | Delete | Empty directory |
| 11 openspec-convention.md copies (non-archive) | Delete | Keep only `.atl/` canonical; archive copies untouched |
| `.agent/01_Agents/*.md` (26 files) | Organize | Move into group subdirs (see below) |

**Agent .md grouping**:
- `00_Infrastructure/`: 00_Agent_Template, 00_Orchestrator, 01_Scope_Rule_Architect, 02_TDD_Test_First
- `01_Frontend/`: 03_React_Test_Implementer, 04_React_Mentor, 07_Accessibility_Auditor
- `02_Ops/`: 05_Security_Auditor, 06_Git_Workflow_Manager
- `03_Templates/`: 08_PRD_Dashboard_Template, 09_Design_SOP_Document
- `04_Orchestration/`: 10_Workflow_Orchestrator, 11_AIPM_Judge, 12_LFG_Autonomous_Engine, 22_Dynamic_Workflows
- `05_Named_Agents/`: 13_Hillary through 21_Learning_Always
- `06_Marketing/`: 15_Marketing_Estratega, 16_Marketing_Creador, 17_Marketing_Analista, MARKETING_PIPELINE

**Gate**: `config_paths.py --validate` + `find .agent/01_Agents -maxdepth 1 -name "*.md" | wc -l` = 0 (no loose .md in root).

### Phase D — Verification Sweep

| Check | Command | Expected |
|-------|---------|----------|
| Zero .agents refs in configs | `grep -r "\.agents" CLAUDE.md .mcp.json opencode.json .atl/skill-registry.md` | 0 matches |
| Symlinks valid | `find .claude/skills -type l -exec sh -c 'test -e "$1" || echo BROKEN' _ {} \;` | 0 BROKEN |
| Skill count | `find .agent/02_Skills -name "SKILL.md" \| wc -l` | ≥ 429 |
| config_paths clean | `python config_paths.py --validate` | exit 0 |
| No loose agent .md | `find .agent/01_Agents -maxdepth 1 -name "*.md"` | 0 results |
| 03_Resultado singular | `find . -name "03_Resultado" -type d \| wc -l` | 1 (root only) |
| 05_Claude_Ads only in Projects | `find . -name "05_Claude_Ads" -type d` | 1 result, path contains `06_Projects` |

## Interfaces / Contracts

No new interfaces. The `config_paths.py --validate` CLI is the existing contract. All path constants remain unchanged — no paths in config_paths.py reference `.agents/`, so Phase A/B moves don't require config_paths.py edits.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Pre-phase | Baseline validation | `config_paths.py --validate` before any changes |
| Per-phase gate | Path integrity | `config_paths.py --validate` exits 0 after each phase |
| Post-phase A | Symlink targets | `readlink` on all `.claude/skills/` symlinks → `.agent/` prefix |
| Post-phase B | Skill count integrity | `find .agent/02_Skills -name "SKILL.md" \| wc -l` ≥ 429 |
| Post-phase C | No loose files | `find .agent/01_Agents -maxdepth 1 -name "*.md"` = 0 |
| Post-phase D | Stale reference sweep | `grep -r "\.agents" CLAUDE.md .mcp.json opencode.json` = 0 |
| Final | Full system health | `config_paths.py --validate --json` → status "ok" |

## Migration / Rollout

### Rollback Plan

1. **Pre-phase zip**: `tar -czf /tmp/os-reorganize-backup-{phase}.tar.gz` of affected dirs before each phase
2. **Mid-phase failure**: Restore from phase-specific backup, re-run `config_paths.py --validate`
3. **Post-phase failure**: Restore backup + revert reference changes in skill-registry.md
4. **Critical rule**: No destructive deletes until validation passes. Copy-then-delete ensures source is always recoverable until the final `rm` in each phase.

### Phase Dependencies

```
Phase A (references)  ← MUST complete before B (moves change disk state)
Phase B (moves)       ← MUST complete before C (cleanup removes things)
Phase C (cleanup)     ← MUST complete before D (verification is final)
```

Each phase gate must pass before the next begins. If any gate fails, stop and rollback that phase.

## Open Questions

- [ ] 05_Claude_Ads split: should skill subdirs (`01_Ads/`, `05_Skills/`) merge into existing `.agent/02_Skills/` categories, or stay as a standalone skill group under `06_Projects/`?
- [ ] Agent .md grouping: the proposed groups are based on prefix ranges — confirm these groupings match intended functional domains?
- [ ] 00_Workflows in Skills area: spec requires rename to avoid collision with `00_Core/00_Workflows/`. What name? Proposal suggests renaming but doesn't specify target name.
