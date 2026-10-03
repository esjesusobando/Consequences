# Design: Marketing Agents SOTA Upgrade

## Technical Approach

Additive-only YAML frontmatter injection for legacy agents (15/16/17) matching the Dream Team convention, then compose a new Orchestrator (slot 06) that wires them into a pipeline. Document MCP strategy, create a project-level CLAUDE.md template, and add a LinkedIn content flow skill under the existing `14_Marketing_Tech/` directory.

Reference pattern: `04_Design_Ops.md` — the most evolved Dream Team agent (has `harness_pattern`, `model_recommendation`, full skills tables, GAN-pattern architecture section, and MCP references).

## Architecture Decisions

### Decision: Orchestrator numbering — slot 06

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Slot 04 (replacing pending slot) | 04_Design_Ops.md exists — conflict | ❌ |
| Slot 05 (reusing) | 05_Platform_Engineer.md exists — conflict | ❌ |
| **Slot 06** (next available) | Clean, no renumbering needed | ✅ |

### Decision: LinkedIn skill path — under 14_Marketing_Tech/

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `15_Marketing_Workflows/` (spec v1) | Collision with existing `15_Marketing_Scripts/` directory | ❌ |
| `15_Marketing_Workflows/` renamed | Breaks spec path, confuses numbering | ❌ |
| **`14_Marketing_Tech/linkedin-content-flow/`** | Matches existing sub-skill pattern (seo-audit/, paid-ads/, etc.), no numbering collision | ✅ |

### Decision: MCP selection for marketing

Chosen from `.mcp.json`: **google-workspace** (docs/sheets automation → all stages), **higgsfield** (image generation → Creador stage), **heygen** (video avatars → Creador stage). Alternatives considered: magnific (image upscaling — narrow use case, lower pipeline value), firecrawl (web research — more generic, not marketing-specific).

### Decision: Format for sota_principles

Follow `04_Design_Ops.md` exactly: array of lowercase underscore-separated identifiers (e.g., `[pipeline_orchestration, skill_auto_loading, mcp_integration]`). For 15/16/17, keep existing implied principles from their roles.

### Decision: CLAUDE.md template as standalone file

Use `CLAUDE.marketing.md` instead of modifying root `CLAUDE.md`. The root file is PersonalOS-wide (363 lines, 12 laws, boot protocol). A separate file keeps concerns isolated and allows project-specific overrides.

## Data Flow

```
                ┌──────────────────────────────────────┐
                │    06_Marketing_Orchestrator.md       │
                │  (Pipeline coordinator, auto-loads    │
                │   skills, MCP dispatch)               │
                └──┬──────────────┬──────────────┬──────┘
                   │              │              │
         ┌─────────▼──┐  ┌───────▼──────┐  ┌───▼─────────┐
         │ 15 Estratega│  │16 Creador   │  │17 Analista  │
         │ Research    │─▶│ Content     │─▶│ Review      │
         │ Briefs      │  │ Multi-chan  │  │ Metrics     │
         └─────────────┘  └─────────────┘  │ Feedback    │
                                           └─────────────┘
                                                    │
                         ┌──────────────────────────┘
                         ▼
              ┌──────────────────────┐
              │ LinkedIn Content Flow │
              │ (skill YAML, 4-stage) │
              └──────────────────────┘
```

MCP mapping per pipeline stage:
| Stage | Agent | MCP(s) | Purpose |
|-------|-------|--------|---------|
| Research | 15 Estratega | google-workspace | Brief docs, competitive spreadsheets |
| Content | 16 Creador | higgsfield, heygen | Image gen, video avatar production |
| Review | 17 Analista | google-workspace | Metrics in Sheets, report docs |

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `01_Personal_Os/01_Core/02_Tools/01_Agents/15_Marketing_Estratega.md` | **Modify** | Add YAML frontmatter, skills table, MCPs section. Preserve all 79 existing lines. |
| `01_Personal_Os/01_Core/02_Tools/01_Agents/16_Marketing_Creador.md` | **Modify** | Same pattern — frontmatter, skills, MCPs. Preserve all 75 lines. |
| `01_Personal_Os/01_Core/02_Tools/01_Agents/17_Marketing_Analista.md` | **Modify** | Same pattern — frontmatter, skills, MCPs. Preserve all 88 lines. |
| `01_Personal_Os/01_Core/02_Tools/01_Agents/01_Dream_Team/06_Marketing_Orchestrator.md` | **Create** | New Dream Team orchestrator agent. |
| `01_Personal_Os/01_Core/02_Tools/02_Skills/01_Creacion_Contenidos/14_Marketing_Tech/linkedin-content-flow/SKILL.md` | **Create** | LinkedIn pipeline skill YAML. |
| `CLAUDE.marketing.md` | **Create** | Marketing project CLAUDE.md template. |
| `.agent/01_Agents/15_Marketing_Estratega.md` | **Sync** | Mirror via 19_Agent_Sync_Hub.py after changes. |
| `.agent/01_Agents/16_Marketing_Creador.md` | **Sync** | Mirror via sync hub. |
| `.agent/01_Agents/17_Marketing_Analista.md` | **Sync** | Mirror via sync hub. |

## Interfaces / Contracts

### YAML Frontmatter Contract (for all 5 agents)

```yaml
---
name: {string}               # Human-readable agent name
description: {string}        # One-line role description (max 120 chars)
trigger_keywords: [{string}] # Keywords that trigger auto-load
auto_loads_skills: true      # MUST be true per spec
version: {semver}            # Starting at "1.0"
sota_principles: [{string}]  # Lowercase underscore-separated identifiers
harness_pattern: [{string}]  # OPTIONAL — only for orchestrator/complex agents
model_recommendation: {str}  # OPTIONAL — only for orchestrator/complex agents
---
```

### Skills Table Format (in all agents)

```
| Skill | Cuando Usar | Output |
|-------|-------------|--------|
| `{skill-name}` | {trigger context} | {expected output} |
```

All paths must resolve to `02_Skills/01_Creacion_Contenidos/13_Marketing_Strategy/` or `14_Marketing_Tech/` subdirectories.

### Agent-to-Agent Contract (Orchestrator pipeline)

- **Input** from user → Orchestrator parses intent (research, content creation, analysis)
- **Stage 1 → Stage 2**: Estratega brief → Creador input (must include objective, audience, tone, CTA, KPIs)
- **Stage 2 → Stage 3**: Creador content → Analista input (published piece + original brief KPIs)
- **Stage 3 → feedback**: Analista recommendations → Estratega (closes the loop)
- Short-circuit allowed: strategy-only requests skip Creador/Analista

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Validation | YAML frontmatter parse | `python -c "import yaml; yaml.safe_load(open(f))"` for all 4 agent files |
| Validation | Content preservation | `git diff --stat` — verify zero deletions/modifications to existing lines |
| Validation | Skill path resolution | `ls` each path in every skills table across all agents |
| Integration | Agent Sync Hub | Run `19_Agent_Sync_Hub.py --check`; verify exit code 0 |
| Integration | Mirror sync | `diff source .agent/mirror` for 15/16/17 |
| Manual | LinkedIn flow walkthrough | Trigger with "linkedin post", step through 4 stages |

## Migration / Rollout

No data migration required. Changes are additive file modifications + new files. Rollback: `git checkout` for modified agents (15/16/17), delete new files, re-run Agent Sync Hub.

## Open Questions

- [ ] Should the `CLAUDE.marketing.md` template be placed at root or inside `01_Personal_Os/02_Knowledge/`? Decision: root, matching the existing root `CLAUDE.md` convention. Confirm with user.
- [ ] The `15_Marketing_Scripts/` directory already exists — does user prefer renumbering or keeping `14_Marketing_Tech/linkedin-content-flow/` as designed?
