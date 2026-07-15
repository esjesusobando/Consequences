# Curation Filter Specification

## Purpose

Rule-based signal classification engine. Reads raw signals from `capture_inbox/`, classifies them into actionable/reference/noise, deduplicates, and routes outputs to daily inbox, brain folder, or archive.

## Requirements

### Requirement: Signal Classification

The system SHALL classify each signal from `capture_inbox/` into exactly one category: `actionable`, `reference`, or `noise`. Classification uses keyword matching against `curation_rules.yaml`.

#### Scenario: Actionable signal classified

- GIVEN a signal file containing keywords matching the `actionable` list in `curation_rules.yaml`
- WHEN `curation_filter.py --inbox <dir>` runs
- THEN the signal is classified as `actionable`
- AND the signal content is included in the daily inbox output

#### Scenario: Reference signal classified

- GIVEN a signal file containing keywords matching the `reference` list but not `actionable`
- WHEN `curation_filter.py --inbox <dir>` runs
- THEN the signal is classified as `reference`
- AND the signal is routed to the brain folder

#### Scenario: Noise signal classified

- GIVEN a signal file containing no matching keywords from any classification list
- WHEN `curation_filter.py --inbox <dir>` runs
- THEN the signal is classified as `noise`
- AND the signal is moved to the archive

#### Scenario: Multiple keywords match different categories

- GIVEN a signal file containing keywords from both `actionable` and `reference` lists
- WHEN classification runs
- THEN the signal is classified as `actionable` (actionable takes priority)

### Requirement: Deduplication

The system SHALL skip duplicate signals within a configurable time window (default: 24 hours). Fingerprint = SHA-256 hash of first 200 characters of signal content.

#### Scenario: Duplicate signal within window

- GIVEN a signal whose fingerprint exists in the dedup cache from 12 hours ago
- WHEN classification runs
- THEN the signal is skipped
- AND the `duplicates_skipped` counter increments

#### Scenario: Duplicate signal outside window

- GIVEN a signal whose fingerprint exists in the dedup cache from 25 hours ago
- WHEN classification runs
- THEN the signal is classified normally (cache entry expired)

#### Scenario: First occurrence of signal

- GIVEN a signal whose fingerprint does not exist in the dedup cache
- WHEN classification runs
- THEN the signal is classified normally
- AND the fingerprint is written to the dedup cache with current timestamp

### Requirement: Actionable Routing to Daily Inbox

The system SHALL write all actionable signals to `actionable_YYYY-MM-DD.json` in the tasks directory. One file per day, append if exists.

#### Scenario: Daily inbox file does not exist

- GIVEN actionable signals exist and no `actionable_2026-07-14.json` exists
- WHEN routing runs
- THEN a new `actionable_2026-07-14.json` is created with the signals

#### Scenario: Daily inbox file exists

- GIVEN actionable signals exist and `actionable_2026-07-14.json` already contains 2 items
- WHEN routing runs
- THEN the new signals are appended to the existing file (3+ items total)

### Requirement: Empty Inbox Behavior

The system SHALL exit with code 0 when no signal files exist in the inbox directory.

#### Scenario: Empty inbox

- GIVEN `capture_inbox/` contains zero files
- WHEN `curation_filter.py --inbox <dir>` runs
- THEN the process exits with code 0
- AND no output files are created

### Requirement: Processing Statistics

The system SHALL emit a JSON stats object to stdout after processing: `{processed, actionable, reference, noise, duplicates_skipped}`.

#### Scenario: Stats output after processing

- GIVEN 10 signals in the inbox (3 actionable, 2 reference, 1 noise, 4 duplicates)
- WHEN processing completes
- THEN stdout contains `{"processed": 10, "actionable": 3, "interface": 2, "noise": 1, "duplicates_skipped": 4}`

## Non-Functional Requirements

- **Performance**: Process 100 signals in < 2 seconds (no network calls)
- **Encoding**: All file I/O MUST use UTF-8 with `ensure_ascii=False` (Windows compatibility)
- **Atomicity**: Inbox file reads MUST complete before any routing writes begin
- **Error handling**: Malformed signal files are logged and skipped, never crash the pipeline
- **CLI**: `argparse` with `--inbox` (default: `capture_inbox/`) and `--rules` (default: `curation_rules.yaml`)

## Integration Points

| Consumer | Interface | Direction |
|----------|-----------|-----------|
| `capture_external_signals.py` | Produces files in `capture_inbox/` | Upstream |
| `curation_rules.yaml` | Classification keywords, dedup window | Reads |
| `config_paths.py` | `SIGNALS_DIR`, `TASKS_DIR`, `ROOT_DIR` | Imports |
| Daily inbox consumers (tasks) | Reads `actionable_YYYY-MM-DD.json` | Downstream |

## Acceptance Criteria

- [ ] Classifies 90%+ of test signals correctly against keyword lists
- [ ] Deduplication skips identical content within 24h window
- [ ] Daily inbox files are valid JSON and append correctly
- [ ] Empty inbox exits 0 without errors
- [ ] Stats output matches actual processing counts
- [ ] Passes `python config_paths.py --validate` with 0 broken paths
- [ ] No hardcoded paths; all imports via `config_paths`
