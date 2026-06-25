# Marketing LinkedIn Content Flow Specification

## Purpose

Defines the `linkedin-content-flow` skill YAML — a proof-of-concept skill that orchestrates the full LinkedIn content pipeline (research → content creation → review → publish) by calling specific marketing agents at each stage.

## Requirements

### Requirement: Skill YAML Frontmatter

The skill YAML MUST have valid frontmatter with: `name`, `description`, `trigger_keywords`, `auto_loads_skills: true`, `version`, `type: skill`, and a `pipeline` section defining the agent invocation sequence.

#### Scenario: Frontmatter follows skill convention

- GIVEN existing skills in `01_Creacion_Contenidos/` follow the PersonalOS skill frontmatter pattern
- WHEN the LinkedIn flow skill is created
- THEN its frontmatter MUST match the convention with all required keys
- AND `type` MUST be `skill`
- AND `auto_loads_skills` MUST be `true`

### Requirement: Agent Invocation Sequence

The skill YAML MUST define a 4-stage pipeline: research → content creation → review → publish. Each stage MUST reference the specific agent responsible: Estratega (15) for research, Creador (16) for content, Analista (17) for review.

#### Scenario: Happy path — full pipeline execution

- GIVEN a LinkedIn content brief is provided (topic, target audience, angle, key messages)
- WHEN the skill is triggered with keyword "linkedin post"
- THEN Stage 1 (Research / Estratega) MUST produce a brief with objective, audience, tone, CTA, and success metric
- AND Stage 2 (Creation / Creador) MUST take that brief and produce a complete LinkedIn post (hook → story → insight → CTA)
- AND Stage 3 (Review / Analista) MUST validate the post against brand voice, quality gates, and brief alignment
- AND Stage 4 (Publish) MUST format the post for LinkedIn and present it with scheduling recommendations

#### Scenario: Stage returns error

- GIVEN Stage 1 (Estratega) produces a brief with unspecified tone
- WHEN Stage 2 (Creador) receives the brief
- THEN the Creador MUST flag the missing tone as a blocker
- AND pause the pipeline until the brief is clarified
- AND NOT produce content based on assumptions

#### Scenario: Review stage fails quality gate

- GIVEN a post fails the Analista's review (e.g., brand voice mismatch, missing CTA)
- WHEN Stage 3 completes
- THEN the flow MUST NOT proceed to publish
- AND it MUST output specific revision instructions for the Creador
- AND it MUST offer to retry Stage 2 with corrections

#### Scenario: Agent path not found

- GIVEN the skill references agent `15_Marketing_Estratega.md` by relative path
- WHEN that file is moved or renamed
- THEN the skill SHOULD log a warning at pipeline start
- AND default to prompt-based invocation of the agent role without file reference

### Requirement: Skill Location

The skill YAML MUST be located under `01_Creacion_Contenidos/15_Marketing_Workflows/linkedin-content-flow/SKILL.md`.

#### Scenario: Directory does not exist

- GIVEN `15_Marketing_Workflows/` or its parent does not exist in `02_Skills/01_Creacion_Contenidos/`
- WHEN the skill is created
- THEN the directories MUST be created with a `README.md` explaining the workflows category
- AND the numbering MUST NOT collide with existing directories in `01_Creacion_Contenidos/`

### Requirement: Pipeline Metadata

Each stage in the YAML pipeline MUST include: `agent` (file reference), `phase` (research/create/review/publish), `input` (what the stage expects), `output` (what it produces), and `fallback` (what to do if the stage fails).

#### Scenario: Complete stage metadata

- GIVEN the skill YAML is parsed
- WHEN each stage's metadata is inspected
- THEN every stage MUST have all 5 metadata fields populated
- AND the `fallback` MUST be one of: "retry", "skip", "prompt-user", or "default-value"

## Acceptance Criteria

| Criteria | Verification |
|----------|-------------|
| AC1. Skill YAML file exists at specified path | `ls` |
| AC2. Frontmatter has all required keys with `type: skill` | Read frontmatter |
| AC3. Pipeline defines 4 stages with agent references (15, 16, 17) | Count stages, grep agent refs |
| AC4. Every stage has 5 metadata fields (agent, phase, input, output, fallback) | Per-stage inspection |
| AC5. Non-existent directory paths are auto-created | Run the creation step |
| AC6. Analista review gate blocks publish on failure | Walk through pipeline |

## Test Scenarios (Manual)

1. **YAML parse**: Validate with `python -c "import yaml; yaml.safe_load(open('SKILL.md'))"` — confirm no errors
2. **Agent path resolution**: Follow each agent reference (15, 16, 17) and confirm the relative path resolves
3. **Happy path walkthrough**: Simulate a LinkedIn post request and step through all 4 stages — confirm Estratega creates a brief → Creador produces a post → Analista reviews → publish-ready output
4. **Review gate**: Intentionally write a post that violates brand voice — confirm Analista blocks it and outputs revision instructions
5. **Missing agent test**: Temporarily rename agent 15, trigger the skill, confirm it falls back gracefully with a warning
6. **Skill trigger**: In a test conversation, use a trigger keyword ("linkedin post", "crear post linkedin") and confirm the skill loads
