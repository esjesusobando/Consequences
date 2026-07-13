# Conversion Workflow Specification

## Purpose

Automated reminders, state transition validation, and data retention for the lead conversion pipeline. Enforces the lead lifecycle and keeps the store clean.

## Requirements

### Requirement: State Machine

Leads SHALL follow a strict state machine: `nuevo` → `contacto` → `propuesta` → `negociación` → `cerrado`. Transitions MUST be validated — forward-only by default, with explicit `--force` for backward transitions. A lead MAY also transition to `perdido` from any state except `cerrado`.

#### Scenario: Valid forward transition

- GIVEN a lead with status `nuevo`
- WHEN user runs `python track_leads.py update-status --id 1 --status contacto`
- THEN the lead status changes to `contacto`
- AND `updated_at` is set to current timestamp

#### Scenario: Invalid jump rejected

- GIVEN a lead with status `nuevo`
- WHEN user runs `update-status --id 1 --status negociación`
- THEN the system SHALL exit with error code 1
- AND display: `Error: invalid transition nuevo → negociación. Valid: contacto, perdido`

#### Scenario: Transition to perdido

- GIVEN a lead with status `propuesta`
- WHEN user runs `update-status --id 1 --status perdido`
- THEN the lead status changes to `perdido`
- AND the lead is excluded from `list` output

#### Scenario: Update non-existent lead

- GIVEN no lead with ID 999 exists
- WHEN user runs `update-status --id 999 --status contacto`
- THEN the system SHALL exit with error code 1
- AND display: `Error: lead 999 not found`

### Requirement: Reminders

The system SHALL provide a `reminders` subcommand that lists leads stuck in their current status for more than 3 days. Output MUST go to stdout only (no external integrations).

#### Scenario: Leads needing attention

- GIVEN lead #1 has been `contacto` for 5 days and lead #2 has been `propuesta` for 1 day
- WHEN user runs `python track_leads.py reminders`
- THEN lead #1 is displayed with message: `Lead #1 (Acme Corp) stuck in contacto for 5 days`
- AND lead #2 is NOT displayed

#### Scenario: No stale leads

- GIVEN all leads have been updated within the last 3 days
- WHEN user runs `reminders`
- THEN display: `No leads needing attention.`

### Requirement: Archive Retention

The system SHALL provide an `archive` subcommand that moves leads with status `cerrado` or `perdido` and `updated_at` older than 90 days to `03_Learning/04_Telemetry/leads_archive.json`.

#### Scenario: Archive old closed leads

- GIVEN lead #3 is `cerrado` with `updated_at` 95 days ago
- WHEN user runs `python track_leads.py archive`
- THEN lead #3 is removed from `leads.json`
- AND lead #3 is appended to `leads_archive.json`

#### Scenario: No leads to archive

- GIVEN no leads are `cerrado`/`perdido` with > 90 days
- WHEN user runs `archive`
- THEN display: `No leads to archive.`
- AND `leads.json` is unchanged

### Requirement: Qualified Lead Metric

A lead is considered "qualified" for GOALS.md tracking when `estimated_value > 0`. The `list` subcommand SHALL display a count of qualified leads.

#### Scenario: Qualified lead count

- GIVEN 3 leads: one with `estimated_value: 5000`, one with `estimated_value: 0`, one with `estimated_value: 1200`
- WHEN user runs `list`
- THEN display count: `Qualified leads: 2`
