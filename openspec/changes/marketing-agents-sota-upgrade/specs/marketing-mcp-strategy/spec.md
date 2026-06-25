# Marketing MCP Strategy Specification

## Purpose

Defines the documentation and integration strategy for the top 3 marketing-specialized MCPs (Model Context Protocol servers) across all upgraded marketing agents and the orchestrator.

## Requirements

### Requirement: MCP Selection Criteria

The system MUST select exactly 3 MCPs from the existing `.mcp.json` configuration. Selection MUST prioritize: relevance to marketing content production, visual asset generation, and workflow automation.

#### Scenario: Happy path — 3 MCPs selected and documented

- GIVEN `.mcp.json` contains 7+38 MCP servers
- WHEN the marketing MCP strategy is documented
- THEN the top 3 SHALL be: **higgsfield** (image/video generation), **heygen** (AI video avatar), and **google-workspace** (docs, sheets, slides automation)
- AND each entry MUST include its MCP server key as it appears in `.mcp.json`

#### Scenario: Alternative selection justified

- GIVEN a different MCP (e.g., magnific for upscaling, firecrawl for scraping, notion for knowledge base) is equally marketing-relevant
- WHEN the top 3 are selected
- THEN the selection MUST explain why each of the 3 chosen MCPs was prioritized over alternatives
- AND the explanation SHOULD reference specific marketing pipeline stages

### Requirement: Agent-Level Documentation

Each upgraded agent (15 Estratega, 16 Creador, 17 Analista) and the Orchestrator MUST reference relevant MCPs in a dedicated `## MCPs used` section, scoped to that agent's role.

#### Scenario: Estratega references research MCPs

- GIVEN Estratega's role is planning and research
- WHEN the MCP section is added to agent 15
- THEN it MUST reference google-workspace (research docs/spreadsheets)
- AND it MUST NOT reference heygen (video avatar creation — out of role scope)

#### Scenario: Creador references production MCPs

- GIVEN Creador's role is content production
- WHEN the MCP section is added to agent 16
- THEN it MUST reference higgsfield (image generation) and heygen (video avatar)
- AND it MAY reference google-workspace for content drafting in Docs

#### Scenario: Analista references analytics MCPs

- GIVEN Analista's role is performance measurement
- WHEN the MCP section is added to agent 17
- THEN it MUST reference google-workspace (Sheets for metrics)
- AND it MUST NOT reference higgsfield or heygen (content creation — out of role scope)

#### Scenario: MCP key mismatch

- GIVEN an MCP section references a key (e.g., `higgsfield`) that is not present in `.mcp.json`
- WHEN the integration status is checked
- THEN the agent file MUST note the MCP as "not yet configured in this project"
- AND MUST NOT claim the MCP is active

### Requirement: Orchestrator-Level Aggregation

The Marketing Orchestrator (C2) MUST aggregate all 3 MCPs into a single reference section, showing which MCP is used at which pipeline stage.

#### Scenario: Full pipeline MCP map

- GIVEN the orchestrator defines Estratega→Creador→Analista pipeline
- WHEN the MCP aggregation section is written
- THEN it MUST show a table: pipeline stage → agent → MCP(s) used → purpose
- AND the table MUST have at least 3 rows (one per stage)

## Acceptance Criteria

| Criteria | Verification |
|----------|-------------|
| AC1. Top 3 MCPs (higgsfield, heygen, google-workspace) documented | Read MCP sections |
| AC2. Each of 4 agents (15, 16, 17, Orchestrator) has an MCP section | Grep for `## MCPs` |
| AC3. Each MCP entry includes purpose and use case | Visual inspection |
| AC4. Orchestrator has aggregated pipeline-MCP mapping table | Visual inspection |

## Test Scenarios (Manual)

1. **MCP key validation**: For each referenced MCP, grep `.mcp.json` for the server key — confirm it exists or is flagged as "not configured"
2. **Role scoping**: For each agent, verify the MCPs listed match their role (Estratega → research, Creador → production, Analista → analytics)
3. **Cross-reference check**: Confirm the orchestrator's MCP table references all 3 MCPs and maps each to a pipeline stage
4. **Duplicate consistency**: If the same MCP appears in multiple agents (e.g., google-workspace in both 15 and 16), the purpose described MUST be consistent
