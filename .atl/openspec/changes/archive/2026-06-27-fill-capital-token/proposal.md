# Proposal: Fill Capital Token — From Skeleton to Real Content

## Intent

The Capital Token system (`01_Personal_Os/02_Knowledge/10_Shared_Org/`) has a solid architectural foundation (Opción C Híbrida, templates, MCP Bridge v0.1, 3 agent templates, 1 playbook) but almost no real content. The core `context/organizacion.md` is all `{{placeholders}}`, there are 0 real processes documented, and the MCP Bridge has never been deployed. The goal is to transform this skeleton into a working system with real content.

## Scope

### In Scope
- Fill `context/organizacion.md` with real organizational data
- Document 2-3 real processes in `processes/` (beyond the template)
- Document 1 real decision in `decisions/` (beyond ADR-001)
- Create a 2nd playbook as real reference material
- Deploy MCP Bridge v0.1 as a functional server
- Connect at least 1 agent template to a real agent config
- Update the dashboard with current real metrics
- Write a CLI quickstart/cheatsheet for using the bridge

### Out of Scope
- Slack/Notion/WhatsApp integrations (Fase 2 — requires external API keys)
- Codex workspace setup (requires team access)
- Multi-client architecture (Fase 4)
- Auto-improvement integration (Fase 3)

## Capabilities

### New Capabilities
- **Shared Context Query**: Functional bridge server that indexes and serves Shared Org content via JSON-RPC stdin
- **Agent Boot Context**: Real agent configs that load Shared Org context on startup

### Modified Capabilities
- **context/organizacion.md**: From placeholder to real org data
- **Dashboard**: From template to real metrics tracking
- **Bridge**: From functional-but-unused to deployed-and-usable

## Approach

1. **Fill context/organizacion.md**: Replace `{{templates}}` with real data about the organization, team, stack, and clients.
2. **Document 2 processes**: Pick the most common organizational processes (e.g., project kickoff, client reporting) and write them as SOPs using the existing template.
3. **Document 1 decision**: Write a real ADR about a past architectural or process decision.
4. **Create 2nd playbook**: E.g., "Content Production Workflow" or "Weekly Reporting Cycle".
5. **Deploy MCP Bridge**: Test `--serve` mode works end-to-end with `--index` and `--query`.
6. **Connect agent template**: Create a real agent config for the Admin Agent that loads Shared Org context on boot.
7. **Update dashboard**: Fill in real numbers, add tracking for what gets documented this session.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `10_Shared_Org/context/organizacion.md` | Modified | Replace placeholders with real data |
| `10_Shared_Org/processes/` | Created | 2 real SOP documents |
| `10_Shared_Org/decisions/` | Created | 1 real ADR |
| `10_Shared_Org/playbooks/` | Created | 1 additional playbook |
| `10_Shared_Org/capital-token-bridge.py` | Verified | Tested in serve mode |
| `10_Shared_Org/agents/` | Modified | Real agent config (not just template) |
| `10_Shared_Org/metrics/capital-token-dashboard.md` | Modified | Real metrics |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Organizational data incomplete (unknown team/stack details) | Medium | Mark unknowns as `[TBD]` and flag them — don't fabricate |
| Processes documented don't match real workflows | Medium | Use generic-but-true descriptions focused on "what SHOULD happen" |
| Bridge serve mode has bugs on first real run | Low | Test with `--index` and `--query` before `--serve` |

## Rollback Plan

Individual file reverts via `git checkout`. No cross-file dependencies.

## Dependencies

- Organizational knowledge (may need user input for team/stack details)
- Python 3.x for bridge testing

## Completion Record

| Event | Date |
|-------|------|
| Proposed | 2026-06-27 |
| Implemented | 2026-06-27 |
| Verified | 2026-06-27 |
| Archived | 2026-06-27 |

### Verification Results

- ✅ context/organizacion.md: All {{placeholders}} replaced with real data
- ✅ 2 process SOPs created (project kickoff, weekly reporting)
- ✅ 1 ADR created (knowledge structure decision)
- ✅ 1 additional playbook created (content production)
- ✅ Bridge verified: --index, --query, --sync all work
- ✅ Bridge bug fixed: UnicodeEncodeError on Windows (emoji → ASCII markers)
- ✅ Real Admin Agent config created (admin-config.yaml)
- ✅ Dashboard updated with real metrics
- ✅ CLI usage guide added to README

### Success Criteria

- [x] All {{placeholders}} replaced with real data or [TBD] markers
- [x] At least 2 process SOPs with YAML frontmatter and quality gates
- [x] At least 1 real ADR beyond the architecture decision
- [x] At least 1 additional playbook matching onboarding detail level
- [x] Bridge functional in all 4 modes (index, query, sync, interactive)
- [x] Real agent config exists (not just template)
- [x] Dashboard reflects current real state
- [x] CLI usage guide exists and is usable
