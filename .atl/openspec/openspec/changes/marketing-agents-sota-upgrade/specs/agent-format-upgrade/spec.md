# Agent Format Upgrade Specification

## Purpose

Specifies the YAML-frontmatter upgrade for legacy marketing agents (15, 16, 17) to match the PersonalOS Dream Team SOTA format while preserving all existing content.

## Requirements

### Requirement: YAML Frontmatter Injection

Each of the 3 agent files MUST gain a valid YAML frontmatter block between the opening line and the existing content header. The frontmatter MUST contain: `name`, `description`, `trigger_keywords` (array), `auto_loads_skills: true`, `version`, and `sota_principles` (array).

#### Scenario: Frontmatter applied to 15_Marketing_Estratega

- GIVEN the file `15_Marketing_Estratega.md` currently starts with `# 🧠 Agente de Marketing: Estratega`
- WHEN the upgrade adds YAML frontmatter between a `---` fence
- THEN the file begins with `---`, followed by valid YAML keys, then `---`, then the original `# 🧠 Agente de Marketing: Estratega` header
- AND all keys (`name`, `description`, `trigger_keywords`, `auto_loads_skills`, `version`, `sota_principles`) are present with non-empty values

#### Scenario: Frontmatter applied to 16_Marketing_Creador

- GIVEN the file `16_Marketing_Creador.md` currently starts with `# ✍️ Agente de Marketing: Creador de Contenido`
- WHEN the upgrade adds YAML frontmatter
- THEN the same key set is present and valid

#### Scenario: Frontmatter applied to 17_Marketing_Analista

- GIVEN the file `17_Marketing_Analista.md` currently starts with `# 📊 Agente de Marketing: Analista`
- WHEN the upgrade adds YAML frontmatter
- THEN the same key set is present and valid

#### Scenario: Frontmatter parse failure

- GIVEN the YAML frontmatter has a syntax error (unclosed quote, bad indentation, trailing comma in array)
- WHEN the agent loader attempts to parse the file
- THEN the loader MUST reject the file with an error message identifying the exact line and nature of the YAML syntax issue

### Requirement: Skills Table Injection

Each agent MUST include a `## Skills that auto-load` section with a table mapping skill names to their directory paths, usage triggers, and expected output. Tables MUST reference skills under `01_Creacion_Contenidos/13_Marketing_Strategy/` and `01_Creacion_Contenidos/14_Marketing_Tech/`.

#### Scenario: Estratega loads strategy skills

- GIVEN the Estratega agent's role is planning and research
- WHEN the skills table is added
- THEN it MUST include strategy skills (`content-strategy`, `marketing-ideas`) and MAY include execution skills
- AND all referenced skill paths MUST resolve to existing directories under `02_Skills/01_Creacion_Contenidos/13_Marketing_Strategy/` or `14_Marketing_Tech/`

#### Scenario: Creador loads content production skills

- GIVEN the Creador agent's role is content execution
- WHEN the skills table is added
- THEN it MUST include content-production skills and MAY include strategy or analysis skills
- AND all table paths resolve correctly

#### Scenario: Analista loads measurement and tracking skills

- GIVEN the Analista agent's role is performance analysis
- WHEN the skills table is added
- THEN it MUST include analytics and tracking skills
- AND all table paths resolve correctly

#### Scenario: Broken skill path in table

- GIVEN a skill table references a path that does not exist (e.g., typo in directory name)
- WHEN the Agent Sync Hub (19) validates cross-references
- THEN the validator MUST report a broken-reference warning for that path
- AND agent loading MAY continue but the non-resolving skill SHALL NOT auto-load

### Requirement: Content Preservation

All existing content in agents 15, 16, and 17 MUST remain exactly as-is — every section, line, emoji, and formatting character. The upgrade is additive only.

#### Scenario: Full preservation after upgrade

- GIVEN agent 15's original content has 79 lines with sections `Propósito`, `Protocolo de Blindaje`, `Responsabilidades`, `Input / Output`, `Formato de Brief`, `Referencias`
- WHEN frontmatter and skill tables are added
- THEN every original line appears unchanged after the frontmatter block
- AND the `---` delimiters do not interfere with any existing `---` horizontal rule

#### Scenario: Accidental content modification

- GIVEN the upgrade script modifies a line inside an existing section (e.g., changes a responsibility text)
- WHEN the diff is reviewed before commit
- THEN the reviewer MUST flag any non-frontmatter, non-skills-table change as out-of-scope
- AND such changes SHALL be reverted before merge

### Requirement: Agent Mirror Sync

After all agent files are modified, the Agent Sync Hub (`19_Agent_Sync_Hub.py`) MUST be executed to mirror changes to `.agent/01_Agents/`. The mirrored copies in `.agent/` MUST be byte-identical to the source files.

#### Scenario: Successful mirror after upgrade

- GIVEN all 3 agent files are modified with frontmatter and skill tables
- WHEN `19_Agent_Sync_Hub.py` runs
- THEN `.agent/01_Agents/15_Marketing_Estratega.md`, `16_Marketing_Creador.md`, and `17_Marketing_Analista.md` match their `01_Personal_Os/` counterparts exactly
- AND the script exits with code 0

#### Scenario: Mirror fails mid-way

- GIVEN the sync script encounters a permission error on `.agent/01_Agents/15_Marketing_Estratega.md`
- WHEN the script continues execution
- THEN the remaining agents (16, 17) MUST still be synced
- AND the script MUST report which files succeeded and which failed
- AND the operator MUST resolve the permission issue and re-run

## Acceptance Criteria

| Criteria | Verification |
|----------|-------------|
| AC1. All 3 agents have valid YAML frontmatter with 6 required keys | Dry-run YAML lint on each file |
| AC2. Skills tables reference only existing directories | `ls` each listed path |
| AC3. All original content is preserved | `diff` original vs upgraded (frontmatter-only diff) |
| AC4. `.agent/` mirror is in sync | `diff` source vs mirrored for all 3 files |
| AC5. Agent Sync Hub reports clean exit | Run `python 19_Agent_Sync_Hub.py --check` |

## Test Scenarios (Manual)

1. **Frontmatter validation**: Open each file, confirm `---` fences exist and `yaml` parses cleanly through a YAML linter (`python -c "import yaml; yaml.safe_load(open('file.md'))"`)
2. **Content integrity**: Run `git diff --stat` and confirm only new lines (frontmatter + skills table) were added — zero deletions or modifications to existing lines
3. **Path resolution**: For each skill table row, run `ls <path>` and confirm the directory exists
4. **Agent Sync**: Execute `19_Agent_Sync_Hub.py` and verify exit code 0; then `diff <source> <mirror>` for each agent
5. **Load test**: Trigger each agent by its trigger keyword in a test conversation and confirm it loads
