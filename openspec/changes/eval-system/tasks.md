# Tasks: Eval System (Fase 3 — PLAN_AI_NATIVE)

## Delivery Forecast

- **Decision needed before apply**: No
- **Chained PRs recommended**: No
- **400-line budget risk**: Medium (~680 total, but 3 files independent)

## Phase 1: Core Evaluator

- [x] 1.1 Create output_eval.py skeleton
- [x] 1.2 Implement completeness check
- [x] 1.3 Implement accuracy check
- [x] 1.4 Implement tone check
- [x] 1.5 Implement clarity check
- [x] 1.6 Implement actionability check
- [x] 1.7 Implement scoring, suggestions, and evaluate()

## Phase 2: CLI and Telemetry

- [x] 2.1 Implement CLI with argparse
- [x] 2.2 Implement telemetry writer (via --save flag + safe_json_write)
- [x] 2.3 Implement batch evaluation
- [x] 2.4 Implement --test and --verify-cycle (self-test function)

## Phase 3: Tests

- [x] 3.1 Create test_output_eval.py (26 tests, all passing)

## Phase 4: Skill Chain Integration

- [x] 4.1 Add --eval flag to skill_chain.py
- [x] 4.2 Add eval hook in run_chain()/execute_step()
- [x] 4.3 Add _read_step_output helper (integrated into execute_step, reads stdout)

## Task Summary

| Phase | Tasks | Est. Lines | Dependencies |
|-------|-------|-----------|-------------|
| 1: Core | 1.1–1.7 | ~400 | None |
| 2: CLI+Telemetry | 2.1–2.4 | ~120 | Phase 1 |
| 3: Tests | 3.1 | ~250 | Phase 1 |
| 4: Chain Integration | 4.1–4.3 | +20 | Phase 1 |
| **Total** | **15 tasks** | **~680** | |

## Parallelization Notes

- Phase 1 tasks should be sequential (each builds on the class)
- Phase 2 and Phase 3 can run in parallel (both depend on Phase 1 only)
- Phase 4 can run in parallel with Phase 2 and 3
