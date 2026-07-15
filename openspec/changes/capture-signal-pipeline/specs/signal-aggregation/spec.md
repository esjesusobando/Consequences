# Signal Aggregation Specification

## Purpose

Multi-source signal collection engine with trend analysis. Pulls from content analytics, proposal conversion, prototype feedback, and social mentions. Produces composite signal reports with 7d vs 30d trend deltas.

## Requirements

### Requirement: Multi-Source Collection

The system SHALL collect signals from four source categories: `content_analytics`, `proposal_conversion`, `prototype_feedback`, `social_mentions`. Each source reads from its telemetry file or external API.

#### Scenario: All sources available

- GIVEN telemetry files exist for all four source categories
- WHEN `signal_aggregator.py --once` runs
- THEN all sources are queried
- AND the report includes data from each source

#### Scenario: Partial source availability

- GIVEN only `content_analytics` and `social_mentions` telemetry files exist
- WHEN aggregation runs
- THEN available sources are included in the report
- AND unavailable sources are listed with status `unavailable`
- AND aggregation does not fail

#### Scenario: No sources available

- GIVEN no telemetry files exist
- WHEN aggregation runs
- THEN the report is produced with all sources `unavailable`
- AND exit code is 0

### Requirement: On-Demand Execution Mode

The system SHALL execute only when invoked with `--once` flag. No cron or background scheduling in V1.

#### Scenario: Run with --once flag

- WHEN `signal_aggregator.py --once` is invoked
- THEN one aggregation cycle runs and exits

#### Scenario: Run without --once flag

- WHEN `signal_aggregator.py` is invoked without `--once`
- THEN the system prints usage help and exits with code 1

### Requirement: Composite Signal Score

The system SHALL compute a composite signal score (0–100) from weighted source contributions. Weights are configurable in `curation_rules.yaml`.

#### Scenario: High signal activity

- GIVEN content_analytics score=80 (weight=0.3), social_mentions score=90 (weight=0.25), proposal_conversion score=70 (weight=0.25), prototype_feedback score=60 (weight=0.2)
- WHEN composite score is computed
- THEN the result is `80*0.3 + 90*0.25 + 70*0.25 + 60*0.2 = 74.0`

#### Scenario: Missing source contribution

- GIVEN content_analytics score=80 (weight=0.3), other sources unavailable (weight=0)
- WHEN composite score is computed
- THEN available source weights are renormalized to sum to 1.0
- AND the score reflects only available sources

### Requirement: Trend Analysis

The system SHALL include trend deltas comparing 7-day vs 30-day windows for each source metric.

#### Scenario: Both windows have data

- GIVEN 7d average for social_mentions = 15, 30d average = 10
- WHEN trend is computed
- THEN the report includes `"social_mentions": {"7d": 15, "30d": 10, "delta": +50.0}`

#### Scenario: Insufficient data for 30d window

- GIVEN only 5 days of data exist for a source
- WHEN trend is computed
- THEN the 30d field uses available data and includes `"data_days": 5`

### Requirement: Report Output

The system SHALL write `signal_report_{timestamp_id}.json` to `SIGNALS_DIR` containing all source data, composite score, and trends.

#### Scenario: Report file creation

- WHEN aggregation completes successfully
- THEN a file named `signal_report_20260714T143000.json` exists in `SIGNALS_DIR`
- AND the file is valid JSON with keys: `timestamp`, `sources`, `composite_score`, `trends`

## Non-Functional Requirements

- **Performance**: Full aggregation completes in < 30 seconds (network calls included)
- **Retry**: External API calls use tenacity (exponential backoff, 3 retries)
- **Encoding**: UTF-8 with `ensure_ascii=False`
- **Idempotency**: Running twice produces separate report files (unique timestamp IDs)
- **Error handling**: Source failures are logged and isolated; one source failure does not block others
- **CLI**: `argparse` with `--once` (required), `--dry-run` (optional, prints to stdout only), `--verbose`

## Integration Points

| Consumer | Interface | Direction |
|----------|-----------|-----------|
| `capture_external_signals.py` | Produces `signals.json` | Upstream |
| `signal_normalizer.py` | Produces `signals_normalized.json` | Upstream |
| `curation_rules.yaml` | Source weights, scoring config | Reads |
| `config_paths.py` | `SIGNALS_DIR`, `ROOT_DIR` | Imports |
| Dashboard / reports | Reads `signal_report_*.json` | Downstream |

## Acceptance Criteria

- [ ] `python signal_aggregator.py --once` produces valid `signal_report_*.json`
- [ ] `--dry-run` prints JSON to stdout without writing files
- [ ] Composite score is correctly weighted (test with known values)
- [ ] Trend deltas are mathematically correct
- [ ] Missing sources are gracefully handled (no crashes)
- [ ] All network calls retry with backoff on failure
- [ ] Passes `python config_paths.py --validate`
