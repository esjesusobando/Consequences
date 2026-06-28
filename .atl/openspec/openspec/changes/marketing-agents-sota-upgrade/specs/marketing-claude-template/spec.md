# Marketing CLAUDE.md Template Specification

## Purpose

Defines the CLAUDE.md template for marketing content projects — a boot protocol file that configures the AI agent's behavior, tool access, and quality gates when working on marketing deliverables.

## Requirements

### Requirement: Template Structure

The template MUST be a valid markdown file located at the project root as `CLAUDE.md` (or the marketing-specific variant `CLAUDE.marketing.md`) and MUST contain the following sections in order: project description, brand voice, content rules, tools/MCPs reference, and commands.

#### Scenario: Template created with all required sections

- GIVEN a new marketing content project is initialized
- WHEN the template is applied
- THEN the resulting CLAUDE.md MUST contain: `# Project Description`, `## Brand Voice`, `## Content Rules`, `## Tools & MCPs`, and `## Commands`
- AND each section MUST have placeholder text or instructions that the user replaces with project-specific values

#### Scenario: Template applied over existing CLAUDE.md

- GIVEN the project already has a `CLAUDE.md` (e.g., from PersonalOS root)
- WHEN the marketing template is applied
- THEN the template MUST be written to `CLAUDE.marketing.md` instead of overwriting the existing file
- AND the root `CLAUDE.md` MUST NOT be modified

### Requirement: Section Content

Each section MUST contain specific, actionable instructions:

- **Project Description**: Project name, goals, target audience, content type(s)
- **Brand Voice**: Tone, language (Rioplatense Spanish by default), do/don't examples, key messaging pillars
- **Content Rules**: Quality gates (min engagement metrics, brand consistency checks), review workflow, approval gates
- **Tools & MCPs**: Which MCPs to prefer (higgsfield, heygen, google-workspace), which skills to auto-load (from 13_Marketing_Strategy/ and 14_Marketing_Tech/)
- **Commands**: Shortcut commands for common workflows (e.g., `publish` → review → schedule → post)

#### Scenario: Brand voice section is specific enough for consistent output

- GIVEN the brand voice section is populated with tone, language, and examples
- WHEN 3 different content pieces are generated using the same template
- THEN the output voice MUST be consistent across all 3 pieces
- AND deviations (e.g., using formal Spanish when the template specifies Rioplatense voseo) MUST be detectable by a reviewer

#### Scenario: Content rules enforce quality gate

- GIVEN the content rules specify "LinkedIn posts MUST include a hook in the first 2 lines"
- WHEN the Creador agent produces a post using this template
- THEN the agent MUST validate the hook exists at the beginning of the post
- AND the Analista agent MUST flag any post missing a hook as needing revision

### Requirement: Template Extensibility

The template MUST support optional sections that a project MAY include: analytics tracking setup, A/B test configuration, content calendar integration, and SEO keyword targets.

#### Scenario: Optional section omitted

- GIVEN a simple project that only needs core sections
- WHEN the template is initialized
- THEN the optional sections MAY be omitted by deleting them
- AND the template must include a comment or instruction like `<!-- Optional: remove if not needed -->` for each optional section

## Acceptance Criteria

| Criteria | Verification |
|----------|-------------|
| AC1. Template file exists | File exists check |
| AC2. All 5 required sections are present | Grep for section headers |
| AC3. Brand voice section includes tone + do/don't examples | Visual inspection |
| AC4. Tools/MCPs section references the 3 strategic MCPs | Grep for MCP names |
| AC5. Content rules include ≥2 quality gates | Visual inspection |

## Test Scenarios (Manual)

1. **Section validation**: Open the template file and verify all 5 required `##` headers are present
2. **Variable placeholder test**: Confirm every section that needs user input has a clear `{placeholder}` or bracketed instruction
3. **MCP accuracy**: Cross-reference the MCP names in the template against the actual MCP keys in `.mcp.json`
4. **Template application dry-run**: Copy the template to a temp directory as `CLAUDE.md`, trigger the agent with a content request, and verify the agent loads the brand voice correctly
5. **Optional section test**: Delete an optional section, reload, confirm the template still works without it
