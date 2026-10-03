# Marketing Agent Orchestration Specification

## Purpose

Defines the Marketing Orchestrator — a Dream Team agent that coordinates the 3-agent marketing pipeline (Estratega → Creador → Analista) with skill auto-loading, MCP integration, and structured workflow orchestration.

## Requirements

### Requirement: Dream Team YAML Frontmatter

The orchestrator MUST have a YAML frontmatter block matching the Dream Team convention: `name`, `description`, `trigger_keywords`, `auto_loads_skills: true`, `version`, `sota_principles`, and MAY include `harness_pattern` and `model_recommendation`.

#### Scenario: Frontmatter matches Dream Team pattern

- GIVEN existing Dream Team agents (01_Product_Builder, 03_Marketing_Tech, 04_Design_Ops) all share the same frontmatter key set
- WHEN the orchestrator is created
- THEN its frontmatter keys MUST be a superset of the common Dream Team keys
- AND `auto_loads_skills` MUST be `true`

#### Scenario: Numbering conflict

- GIVEN Dream Team 04_Design_Ops.md already exists
- WHEN the orchestrator file is created
- THEN it MUST use the next available number (06) unless the operator explicitly renumbers existing agents
- AND the numbering MUST NOT collide with any existing file in `01_Dream_Team/`

### Requirement: Pipeline Definition

The orchestrator MUST define a clear 3-stage pipeline: Estratega (planning/briefing) → Creador (content production) → Analista (measurement/optimization). Each stage MUST reference the corresponding agent file by relative path.

#### Scenario: Happy path — full pipeline triggered

- GIVEN the orchestrator receives a marketing goal (e.g., "Lanzar campaña de producto nuevo")
- WHEN the orchestrator activates
- THEN it MUST invoke Estratega for research and brief generation
- AND forward the brief to Creador for content production
- AND route the published content to Analista for performance measurement

#### Scenario: Pipeline short-circuit

- GIVEN only a brief exists and content production is not needed (e.g., strategy-only request)
- WHEN the orchestrator evaluates the intent
- THEN it MAY skip Creador and Analista stages
- AND it MUST document which stages were skipped and why

#### Scenario: Agent file not found

- GIVEN one of the pipeline agents (15, 16, or 17) is missing or its path is broken
- WHEN the orchestrator tries to reference it
- THEN the orchestrator SHOULD log a warning and continue with available agents
- AND it MUST NOT fail entirely if at least one agent is reachable

### Requirement: Skills Auto-Loading

The orchestrator MUST auto-load marketing skills from `01_Creacion_Contenidos/13_Marketing_Strategy/` and `01_Creacion_Contenidos/14_Marketing_Tech/` via a skills table grouped by category (strategy, production, analysis, MCP tools).

#### Scenario: All skill categories resolve

- GIVEN the skills table lists paths under 13_Marketing_Strategy/ and 14_Marketing_Tech/
- WHEN the orchestrator loads
- THEN each path MUST resolve to an existing directory
- AND the orchestrator SHOULD group skills by pipeline stage (strategy → Estratega, production → Creador, analysis → Analista)

#### Scenario: Category with zero skills

- GIVEN a skill category (e.g., "MCP Tools") has no matching skill directories
- WHEN the orchestrator builds the skills table
- THEN it MUST render the category with a "None yet" placeholder
- AND it MUST NOT error or omit the section

### Requirement: MCP Integration Section

The orchestrator MUST document the top 3 strategic MCPs for marketing (higgsfield for visual content, heygen for video avatars, google-workspace for docs/sheets). Each MCP entry MUST include: purpose, typical use case in the pipeline, and configuration note.

#### Scenario: All 3 MCPs documented with full metadata

- GIVEN the orchestrator is created
- WHEN the MCP section is authored
- THEN it MUST include entries for higgsfield, heygen, and google-workspace
- AND each entry MUST state the MCP's purpose, pipeline stage where it applies, and a configuration reference (e.g., API key location)

#### Scenario: MCP is not available in `.mcp.json`

- GIVEN an MCP (e.g., heygen) is documented in the orchestrator
- WHEN `.mcp.json` is checked for that MCP key
- THEN if the MCP key is missing, the orchestrator MUST note the dependency as "configured externally" or "pending setup"
- AND MUST NOT claim the MCP is active within the project

### Requirement: Marketing Tech Dream Team Reference

The orchestrator MUST reference the existing `03_Marketing_Tech.md` Dream Team agent and explain how the two agents differ: Marketing Tech is the broad Marketing OS skill loader, while the Orchestrator is the pipeline coordinator for the 3 specialist agents.

#### Scenario: Cross-reference exists and is unambiguous

- GIVEN both agents exist in `01_Dream_Team/`
- WHEN a user reads either agent file
- THEN each MUST reference the other with a clear explanation of role differentiation
- AND the reference path MUST be a valid relative path

## Acceptance Criteria

| Criteria | Verification |
|----------|-------------|
| AC1. File exists at `01_Dream_Team/06_Marketing_Orchestrator.md` (or next available) | `ls` |
| AC2. YAML frontmatter has all required keys plus Dream Team extras | Read frontmatter |
| AC3. Pipeline diagram or flow section shows Estratega→Creador→Analista | Visual inspection |
| AC4. Skills table has ≥1 entry per category | Count rows |
| AC5. MCP section documents all 3 MCPs | Read section |
| AC6. Cross-reference to 03_Marketing_Tech.md exists | Grep for `03_Marketing_Tech` |

## Test Scenarios (Manual)

1. **Frontmatter lint**: Validate YAML with `python -c "import yaml; yaml.safe_load(open('06_Marketing_Orchestrator.md'))"`
2. **Agent load**: In a test conversation, trigger with keyword "marketing campaign" and confirm the orchestrator activates
3. **Path check**: Verify all relative agent paths (15, 16, 17, 03) resolve with `ls`
4. **Skill resolution**: For each listed skill path, confirm the directory exists
5. **Numbering**: Confirm no file in `01_Dream_Team/` shares the orchestrator's number
6. **Marketing Tech diff**: Read both agents and confirm role differentiation is clear
