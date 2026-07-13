# Lead Tracking Specification

## Purpose

Lead registration, state persistence, JSON telemetry storage, and status lifecycle management for the monetization pipeline. This is the data layer that `track_leads.py` implements.

## Requirements

### Requirement: Lead Registration

The system SHALL accept a new lead via the `add` subcommand with fields: `--name`, `--source`, `--estimated-value`, `--notes`. The `source` field MUST be validated against the predefined set: `linkedin`, `email`, `voz`, `referido`, `web`.

#### Scenario: Register valid lead

- GIVEN the leads store exists at `03_Learning/04_Telemetry/leads.json`
- WHEN user runs `python track_leads.py add --name "Acme Corp" --source linkedin --estimated-value 5000`
- THEN a new lead record is created with status `nuevo`
- AND `created_at` and `updated_at` are set to current ISO timestamp
- AND the lead is appended to `leads.json`

#### Scenario: Reject invalid source

- GIVEN user runs `add` with `--source twitter`
- WHEN the command executes
- THEN the system SHALL exit with error code 1
- AND display: `Error: source must be one of: linkedin, email, voz, referido, web`

#### Scenario: Missing required field

- GIVEN user runs `add` without `--name`
- WHEN the command executes
- THEN the system SHALL exit with error code 1
- AND display usage help for the `add` subcommand

### Requirement: Lead Persistence

The system SHALL store all leads in `03_Learning/04_Telemetry/leads.json` as a JSON array. Each lead MUST include: `id`, `name`, `source`, `status`, `estimated_value`, `created_at`, `updated_at`, `notes`.

#### Scenario: Persistence after add

- GIVEN a lead is successfully registered
- WHEN the add command completes
- THEN `leads.json` MUST contain the new lead record
- AND the file MUST be valid JSON

#### Scenario: Empty store initialization

- GIVEN `leads.json` does not exist
- WHEN the script runs any command
- THEN `leads.json` SHALL be created as an empty array `[]`

### Requirement: Lead Listing

The system SHALL provide a `list` subcommand that displays all active leads (status != `cerrado`) in a table format with columns: ID, Name, Source, Status, Est. Value, Days Since Update.

#### Scenario: List active leads

- GIVEN 3 leads exist (2 active, 1 cerrado)
- WHEN user runs `python track_leads.py list`
- THEN only the 2 active leads are displayed
- AND output is formatted as aligned columns

#### Scenario: List with no leads

- GIVEN `leads.json` is empty
- WHEN user runs `python track_leads.py list`
- THEN display: `No active leads.`

### Requirement: Lead ID Generation

The system SHALL generate unique IDs for leads using sequential integers starting from 1, stored in the leads JSON array order.

#### Scenario: ID uniqueness

- GIVEN 5 leads already exist
- WHEN a new lead is added
- THEN its ID SHALL be 6
