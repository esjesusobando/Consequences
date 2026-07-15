# Curation Rules Specification

## Purpose

YAML configuration file defining classification keywords, deduplication parameters, priority weights, and route mappings for the curation filter and signal aggregator.

## Requirements

### Requirement: Classification Keyword Lists

The system SHALL define three keyword lists in `curation_rules.yaml`: `actionable`, `reference`, and `noise`. Each list contains case-insensitive string patterns matched against signal content.

#### Scenario: Actionable keywords match

- GIVEN `actionable` list contains `["deadline", "urgent", "review needed", "blocker"]`
- WHEN a signal contains "This has a DEADLINE tomorrow"
- THEN the signal is classified as `actionable`

#### Scenario: Noise keywords match

- GIVEN `noise` list contains `["unsubscribe", "newsletter", "promotion"]`
- WHEN a signal contains "Unsubscribe from our newsletter"
- THEN the signal is classified as `noise`

#### Scenario: No keywords match

- GIVEN signal content does not match any keyword in any list
- WHEN classification runs
- THEN the signal defaults to `noise`

### Requirement: Deduplication Window

The system SHALL define a configurable deduplication window in hours (default: 24). Signals with identical fingerprints within this window are skipped.

#### Scenario: Custom dedup window

- GIVEN `dedup_window_hours: 12` in `curation_rules.yaml`
- WHEN a signal matches a fingerprint from 11 hours ago
- THEN the signal is skipped as duplicate

#### Scenario: Window expiry

- GIVEN `dedup_window_hours: 12`
- WHEN a signal matches a fingerprint from 13 hours ago
- THEN the signal is processed normally

### Requirement: Priority Weights

The system SHALL define weights for the signal aggregator composite score. Keys: `content_analytics`, `proposal_conversion`, `prototype_feedback`, `social_mentions`. Weights MUST sum to 1.0.

#### Scenario: Valid weights

- GIVEN weights sum to 1.0
- WHEN signal aggregator loads config
- THEN aggregation proceeds normally

#### Scenario: Invalid weights

- GIVEN weights do not sum to 1.0 (tolerance ±0.01)
- WHEN signal aggregator loads config
- THEN a warning is logged and weights are renormalized automatically

### Requirement: Route Mappings

The system SHALL define destination paths for each classification category.

#### Scenario: Route mapping applied

- GIVEN routes: `actionable: 04_Tasks`, `reference: 02_Knowledge/03_Brain`, `noise: 07_Archive/05_Signals_Archive`
- WHEN curation filter routes a signal
- THEN the signal is written to the corresponding directory relative to `ROOT_DIR / 01_Personal_Os/`

### Requirement: Schema Validation

The system SHALL validate the YAML file on load. Missing or malformed keys produce a clear error message and exit code 2.

#### Scenario: Missing required key

- GIVEN `curation_rules.yaml` is missing the `actionable` key
- WHEN `curation_filter.py` loads the rules
- THEN the system prints "Missing required key: actionable" and exits with code 2

## Non-Functional Requirements

- **Format**: YAML 1.2, UTF-8 encoded
- **Size**: File SHALL NOT exceed 200 lines
- **Defaults**: All optional fields have sensible defaults when omitted
- **Reload**: Rules are loaded once per invocation; no hot-reload in V1

## Acceptance Criteria

- [ ] Valid YAML parses without errors
- [ ] All required keys are validated on load
- [ ] Default values are applied for omitted optional fields
- [ ] Weights sum validation warns on mismatch
- [ ] File is human-readable and self-documenting with comments
