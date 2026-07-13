# Proposal Generation Specification

## Purpose

Template-driven proposal creation from a client brief, producing a professional Markdown document. Designed for < 5 minute turnaround using a fixed template with pricing tiers.

## Requirements

### Requirement: Proposal Template

The system SHALL provide a Markdown template at `01_Personal_Os/02_Knowledge/03_Templates/proposal_template.md` with placeholder fields delimited by `{{FIELD_NAME}}` syntax. Template MUST include: client name, project scope, pricing tiers (3 fixed tiers + custom line), timeline, and deliverables section.

#### Scenario: Template exists and is valid

- GIVEN the proposal template is at the expected path
- WHEN the template is loaded
- THEN it MUST contain placeholders: `{{CLIENT_NAME}}`, `{{SCOPE}}`, `{{TIER_1_NAME}}`, `{{TIER_1_PRICE}}`, `{{TIER_2_NAME}}`, `{{TIER_2_PRICE}}`, `{{TIER_3_NAME}}`, `{{TIER_3_PRICE}}`, `{{CUSTOM_PRICING}}`, `{{TIMELINE}}`, `{{DELIVERABLES}}`

#### Scenario: Fixed pricing tiers

- GIVEN the template is loaded
- WHEN reviewing pricing section
- THEN tier names and prices SHALL be pre-filled with defaults
- AND a `{{CUSTOM_PRICING}}` field MUST be available for overrides

### Requirement: Proposal Generation CLI

The system SHALL provide a `generate-proposal` subcommand that accepts `--client`, `--scope`, and optional `--tier`/`--custom-price` flags. It reads the template, replaces placeholders, and outputs a completed proposal file.

#### Scenario: Generate proposal with defaults

- GIVEN the template exists
- WHEN user runs `python track_leads.py generate-proposal --client "Acme Corp" --scope "Web app development"`
- THEN a file `Acme_Corp_proposal.md` is created in the current directory
- AND all `{{CLIENT_NAME}}` and `{{SCOPE}}` placeholders are replaced
- AND pricing tiers use default values from template

#### Scenario: Generate proposal with custom pricing

- GIVEN user runs `generate-proposal` with `--custom-price "15000"`
- WHEN the file is generated
- THEN `{{CUSTOM_PRICING}}` is replaced with the provided value
- AND fixed tiers remain unchanged

#### Scenario: Missing client name

- GIVEN user runs `generate-proposal` without `--client`
- WHEN the command executes
- THEN the system SHALL exit with error code 1
- AND display usage help

### Requirement: Template Readability

The generated proposal MUST be readable as a standalone Markdown document. Placeholder syntax MUST NOT appear in the output.

#### Scenario: No orphaned placeholders

- GIVEN a proposal is generated from the template
- WHEN reviewing the output file
- THEN no `{{...}}` patterns SHALL appear in the output
