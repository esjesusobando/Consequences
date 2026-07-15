# Tasks: Capture + Signal Pipeline (Fase 2+4)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 1210 (680 new + 50 modified + ~480 tests) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Config + Curation Filter + tests (~610 lines) → PR 2: Signal Aggregator + tests (~550 lines) → PR 3: Learner integration (~50 lines) |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: size-exception
400-line budget risk: High

**Note**: Total estimated lines (~1210) significantly exceed the 400-line budget. With `single-pr` delivery strategy, a **size:exception** must be approved before apply. Alternatively, the orchestrator may suggest chained PRs to stay within budget per review.

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Config + Curation Filter + tests | PR 1 (size:exception) | curation_rules.yaml + curation_filter.py + test_curation_filter.py |
| 2 | Signal Aggregator + tests | PR 1 (size:exception) | signal_aggregator.py + test_signal_aggregator.py — independent of Unit 1 logic but shares YAML config |
| 3 | Learner integration | PR 1 (size:exception) | Surgical edit to learner.py — depends on curation_rules.yaml for threshold |

## Phase 1: Foundation — Configuration

- [x] 1.1 Create `01_Personal_Os/02_Knowledge/04_Config/curation_rules.yaml` (~60 lines): classification keywords (actionable/reference/noise), dedup window (24h), aggregator weights (4 sources summing to 1.0), route mappings, negative_signal threshold (40). Validate required keys: `classification`, `dedup`, `weights`.

## Phase 2: Core — Curation Filter

- [x] 2.1 Create `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/curation_filter.py` (~350 lines): `CurationFilter` class with `_load_rules()`, `_fingerprint()` (SHA-256 first 200 chars), `_is_duplicate()` (dedup_cache.json with TTL), `classify()` (priority: actionable > reference > noise), `route()` (atomic JSON writes per category), `process_inbox()` (main loop returning stats). CLI: `--inbox`, `--rules`, `--dry-run`. Must use project header, Windows UTF-8 fix, `config_paths` imports, argparse, logging.

## Phase 3: Core — Signal Aggregator

- [x] 3.1 Create `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/signal_aggregator.py` (~350 lines): `SignalAggregator` class with `_load_weights()` (renormalize if needed), 4 source collectors (`_collect_content_analytics`, `_collect_proposal_conversion`, `_collect_prototype_feedback`, `_collect_social_mentions`), `_collect_all()`, `_compute_composite()` (weighted sum with renormalization on missing), `_compute_trends()` (7d vs 30d delta), `aggregate()`. CLI: `--once` (required), `--dry-run`, `--verbose`. Output: `signal_report_{timestamp_id}.json`. Must use tenacity retry (3x exponential backoff), mark unavailable sources gracefully.

## Phase 4: Testing

- [x] 4.1 Create `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/test_curation_filter.py` (~200 lines): Unit tests for `classify()` (actionable/reference/noise/multi-keyword priority), `_fingerprint()` determinism, `_is_duplicate()` TTL window, daily inbox append, empty inbox exit 0, stats output correctness. Integration test: create 10 mock inbox files, run filter, verify routing.
- [x] 4.2 Create `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/test_signal_aggregator.py` (~200 lines): Unit tests for `_compute_composite()` (known weights → exact result), `_compute_trends()` (delta math), missing source renormalization. Integration test: mock sources, run `--once --dry-run`, verify JSON structure. Edge cases: all sources unavailable (composite_score=0), empty sources.

## Phase 5: Integration — Learner Modification

- [x] 5.1 Modify `01_Personal_Os/03_Learning/01_Auto_Improvement/01_Engine/learner.py` (+50 lines): Add `learn_from_signal(signal_report: dict)` method — check `composite_score < threshold` (default 40, exclusive), fingerprint `source+category`, count occurrences in `learnings["signal_patterns"]`, at 3+ extract pattern and persist, print suggestion (NEVER auto-apply). Add argparse subcommand `learn-from-signal --signal <json_string_or_path>`. Existing methods (`record_fix`, `report`, `main()`) untouched. New `signal_patterns` field is additive to `learnings.json`.

## Phase 6: Verification

- [x] 6.1 Run `python curation_filter.py --inbox <test_dir> --rules <yaml> --dry-run` and verify classification output matches expected categories.
- [x] 6.2 Run `python signal_aggregator.py --once --dry-run` and verify valid `signal_report_*.json` structure.
- [x] 6.3 Run `python learner.py learn-from-signal --signal <json>` with score < 40 and verify pattern extraction after 3+ signals.
- [x] 6.4 Run `python config_paths.py --validate` and verify 0 broken paths.
