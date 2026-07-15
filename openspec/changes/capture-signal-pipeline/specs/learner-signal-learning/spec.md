# Learner Signal Learning Specification

## Purpose

Extends the existing `learner.py` with negative signal learning. When the signal aggregator produces a composite score below a threshold, the learner extracts patterns, persists them to `learnings.json`, and suggests skill updates. Never auto-applies changes.

## Requirements

### Requirement: Negative Signal Trigger

The system SHALL invoke signal learning when the composite signal score from `signal_aggregator.py` falls below 40 (configurable via `curation_rules.yaml`).

#### Scenario: Score below threshold

- GIVEN composite signal score is 35
- WHEN `learner.py learn-from-signal --signal <json>` is invoked
- THEN the learner processes the negative signal
- AND a pattern is extracted

#### Scenario: Score at threshold

- GIVEN composite signal score is 40
- WHEN learning is triggered
- THEN no negative signal processing occurs (threshold is exclusive: < 40)

#### Scenario: Score above threshold

- GIVEN composite signal score is 75
- WHEN learning is triggered
- THEN no negative signal processing occurs

### Requirement: Minimum Occurrence Threshold

The system SHALL require at least 3 occurrences of a similar negative signal before extracting a pattern. This threshold is hardcoded for V1.

#### Scenario: Fewer than 3 occurrences

- GIVEN 2 negative signals with the same source+category fingerprint exist in `learnings.json`
- WHEN a 3rd identical signal arrives
- THEN the occurrence count increments to 3
- AND a pattern is extracted and persisted

#### Scenario: First occurrence

- GIVEN no previous signals with this fingerprint exist
- WHEN a negative signal arrives
- THEN the occurrence is recorded (count = 1)
- AND no pattern is extracted yet

#### Scenario: Third occurrence triggers extraction

- GIVEN 2 previous occurrences exist (count = 2)
- WHEN the 3rd signal arrives
- THEN the pattern is extracted
- AND `learnings.json` is updated with the new pattern entry

### Requirement: Pattern Extraction

The system SHALL extract a pattern from negative signals containing: `source`, `category`, `score`, `occurrence_count`, `first_seen`, `last_seen`, `suggested_action`.

#### Scenario: Pattern persisted

- GIVEN 3 negative signals from `social_mentions` with category `low_engagement`
- WHEN extraction runs
- THEN `learnings.json` contains a pattern entry with `source: social_mentions`, `category: low_engagement`, `occurrence_count: 3`

### Requirement: Suggestion Without Auto-Apply

The system SHALL output a human-readable suggestion for each extracted pattern. Suggestions MUST NEVER be auto-applied.

#### Scenario: Suggestion output

- GIVEN a pattern is extracted for `social_mentions` / `low_engagement`
- WHEN learning completes
- THEN stdout includes a suggestion line: "SUGGESTION: Review social_mentions skill for low_engagement patterns (3 occurrences)"
- AND no files outside `learnings.json` are modified

#### Scenario: Idempotent extraction

- GIVEN a pattern already exists in `learnings.json` for this fingerprint
- WHEN another occurrence arrives
- THEN `occurrence_count` is incremented
- AND no duplicate pattern entry is created

## Non-Functional Requirements

- **Safety**: The learner MUST NOT auto-apply any changes to skills or rules
- **Persistence**: Pattern data persists in `learnings.json` using the existing Learner class storage format
- **Backward compatibility**: Existing `learnings.json` structure is preserved; new pattern fields are additive
- **CLI**: `argparse` subcommand `learn-from-signal` with `--signal` (JSON string or file path) and `--threshold` (default: 40)

## Integration Points

| Consumer | Interface | Direction |
|----------|-----------|-----------|
| `signal_aggregator.py` | Reads `signal_report_*.json` for scores | Upstream |
| `learner.py` (existing) | Adds `learn_from_signal()` method | Modified |
| `learnings.json` | Persists pattern data | Writes |
| `curation_rules.yaml` | Reads `negative_signal_threshold` | Reads |
| Human operator | Reads suggestions on stdout | Downstream |

## Acceptance Criteria

- [ ] `python learner.py learn-from-signal --signal <json>` processes signals below threshold
- [ ] Pattern extraction requires 3+ occurrences (hardcoded V1)
- [ ] Suggestions are printed but never auto-applied
- [ ] `learnings.json` is updated correctly without breaking existing data
- [ ] Idempotent: running twice with same signal increments count, not duplicates
- [ ] Backward compatible: existing learner.py methods still work unchanged
