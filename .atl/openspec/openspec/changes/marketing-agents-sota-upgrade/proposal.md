# Proposal: Marketing Agents SOTA Upgrade

## Intent

3 marketing agents (15/16/17) are legacy-style (no YAML frontmatter, no `auto_loads_skills`, no `trigger_keywords`). The Dream Team `03_Marketing_Tech.md` has the SOTA format but no orchestration link to the specialist agents. Marketing workflows lack a unified orchestrator, documented MCP strategy, project-level CLAUDE.md, and skill-to-agent wiring. This change upgrades all marketing surfaces to the PersonalOS SOTA standard.

## Scope

### In Scope
- **C1**: Upgrade 3 legacy agents (15/16/17) to YAML-frontmatter SOTA format matching Dream Team style
- **C2**: Create Marketing Orchestrator agent in Dream Team (`04_Marketing_Orchestrator.md`)
- **C3**: Document top 3 strategic MCPs for marketing (higgsfield, heygen, google-workspace)
- **C4**: Create `CLAUDE.md` template for marketing content projects
- **C5**: Create 1 proof-of-concept skill YAML (`linkedin-content-flow`) that orchestrates agent pipeline

### Out of Scope
- Creating/populating `04_Contexto/`, `05_Marca/`, `06_Plantillas/` content (covered by existing Plan_SOTA_Marketing_Agency)
- Configuring new MCPs beyond documentation of existing ones
- Upgrading workflow agents 18/19/20 (separate change)
- Building dashboards or reporting
- Multi-tenant client structure

## Capabilities

### New Capabilities
- `marketing-agent-orchestration`: Unified orchestrator coordinates Estratega→Creador→Analista pipeline with skill auto-loading and MCP integration
- `marketing-linkedin-flow`: Skill YAML that triggers the full LinkedIn content pipeline from brief to publish-ready copy

### Modified Capabilities
- None — pure agent/skill upgrade, no spec-level behavior changes

## Approach

| Change | Approach |
|--------|----------|
| **C1** | Add YAML frontmatter (`name`, `description`, `trigger_keywords`, `auto_loads_skills`, `version`, `sota_principles`) to 15/16/17. Add `## Skills that auto-load` table referencing `13_Marketing_Strategy/` and `14_Marketing_Tech/` skills. Add `## MCPs used` section. Preserve existing `## Propósito`, `## Responsabilidades`, `## Protocolo` content. |
| **C2** | Create `01_Dream_Team/04_Marketing_Orchestrator.md` with YAML frontmatter, pipeline diagram (Estratega→Creador→Analista), skill-loading tables referencing marketing skills, MCP integration section, and trigger keywords. |
| **C3** | Select top 3 MCPs (higgsfield, heygen, google-workspace) from `.mcp.json`. Document each in the Orchestrator and individual agents. |
| **C4** | Create `CLAUDE.md` template at project level with marketing-specific boot protocol, skill references, and quality gates. |
| **C5** | Create `01_Creacion_Contenidos/15_Marketing_Workflows/linkedin-content-flow/` with YAML frontmatter, agent invocation sequence, and output spec. |

## Files Affected

| File | Action |
|------|--------|
| `01_Personal_Os/01_Core/02_Tools/01_Agents/15_Marketing_Estratega.md` | **Modified** — add YAML frontmatter + skill tables |
| `01_Personal_Os/01_Core/02_Tools/01_Agents/16_Marketing_Creador.md` | **Modified** — add YAML frontmatter + skill tables |
| `01_Personal_Os/01_Core/02_Tools/01_Agents/17_Marketing_Analista.md` | **Modified** — add YAML frontmatter + skill tables |
| `01_Personal_Os/01_Core/02_Tools/01_Agents/01_Dream_Team/04_Marketing_Orchestrator.md` | **New** — orchestrator agent |
| `01_Personal_Os/01_Core/02_Tools/02_Skills/01_Creacion_Contenidos/15_Marketing_Workflows/linkedin-content-flow/SKILL.md` | **New** — PoC skill YAML |
| `CLAUDE.md` (or `CLAUDE.marketing.md`) | **New** — marketing project template |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Mirror drift — `.agent/` backup gets out of sync | High | Agent Sync Hub (19) must be run after changes; document in state |
| Agent numbering conflict for new orchestrator | Low | Verify `01_Dream_Team/` has slots 01-05; new file is 06 or next available |
| Skill YAML paths not resolving | Medium | Use exact relative paths from `01_Creacion_Contenidos/`; test with a dry-run agent load |

## Rollback Plan

1. Revert all file changes via `git checkout` for modified agents (15/16/17)
2. Delete new files (`04_Marketing_Orchestrator.md`, skill YAML, CLAUDE template)
3. Run `python .../19_Agent_Sync_Hub.py` to restore `.agent/` mirror

## Dependencies

- Existing `13_Marketing_Strategy/` and `14_Marketing_Tech/` skill directories (already present)
- Dream Team frontmatter convention (already established in 01/02/03/05)
- Agent Sync Hub at `04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py`

## Success Criteria

- [ ] All 3 legacy agents have valid YAML frontmatter and `auto_loads_skills: true`
- [ ] `04_Marketing_Orchestrator.md` exists in Dream Team with full pipeline spec
- [ ] LinkedIn content flow skill YAML resolves without errors
- [ ] `python 19_Agent_Sync_Hub.py` passes after all changes
- [ ] No broken cross-references in modified agents
