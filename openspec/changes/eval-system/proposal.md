# Proposal: Eval System (Fase 3 — PLAN_AI_NATIVE)

## Intent

The PersonalOS produces agent outputs (proposals, content, reports) but has no per-output quality measurement. `review_draft.py` provides 4 generic gates (readability, tone, structure, keywords) with no weighted scoring, no suggestion generation, and no skill-chain integration. This gap means bad outputs propagate through chains undetected. The eval system closes this by scoring every output 0–100 with criterion-level breakdowns and improvement suggestions.

## Scope

### In Scope
- `output_eval.py` — standalone evaluator (~400–500 lines): 5 weighted criteria, CLI, JSON output
- `test_output_eval.py` — test suite (smoke + verify-cycle)
- Eval hook in `skill_chain.py` — optional `--eval` flag, per-step scoring, score < 70 warning
- Telemetry output — eval results persisted to `03_Learning/04_Telemetry/eval_results/`

### Out of Scope
- Labs page (`labs_page.py`) — separate Fase 3 deliverable
- Auto-retry on low scores (V2)
- External API calls for evaluation (V1 is all local/heuristic)
- LLM-as-judge scoring (V2)

## Capabilities

### New Capabilities
- `output-evaluation`: Weighted quality scoring (completeness, accuracy, tone, clarity, actionability) with per-criterion breakdown and suggestion generation

### Modified Capabilities
- None — skill_chain.py integration is an optional import hook, not a spec-level behavior change

## Approach

**Evaluator core** — 5 heuristic checkers, each returns score 0–100:
| Criterion | Weight | Heuristic |
|-----------|--------|-----------|
| completeness | 0.30 | Required fields/sections present per output type |
| accuracy | 0.25 | Factual claims flagged, source references present |
| tone | 0.20 | Corporate jargon detection, brand voice alignment |
| clarity | 0.15 | Sentence length, paragraph density, Flesch-like score |
| actionability | 0.10 | Next steps section, clear CTA, concrete deliverables |

**Input handling**: Accepts raw text, JSON string, or file path. Auto-detects format.

**Output types**: `proposal`, `content`, `report` — each defines its own required-fields checklist for completeness.

**Determinism**: Same input → same score. No randomness, no API calls, no time-dependent values.

**Skill chain integration**: Add `--eval` flag to `skill_chain.py run`. After each step completes, import `output_eval`, run on step output, log score. If score < 70, emit warning (V1 — no abort).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `03_Scripts_Os/output_eval.py` | New | Core evaluator module |
| `03_Scripts_Os/test_output_eval.py` | New | Test suite |
| `03_Scripts_Os/skill_chain.py` | Modified | Add `--eval` flag + eval hook (~15 lines) |
| `03_Learning/04_Telemetry/eval_results/` | New dir | Eval result persistence |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Heuristic scores misrepresent actual quality | Medium | Calibrate against review_draft.py output; document scoring rationale |
| review_draft.py overlap causes confusion | Low | output_eval supersedes review_draft for chain use; review_draft stays for standalone content review |
| skill_chain.py integration breaks existing chains | Low | `--eval` is opt-in; no behavior change without flag |

## Rollback Plan

1. Remove `--eval` flag and eval hook from `skill_chain.py` (git revert)
2. Delete `output_eval.py` and `test_output_eval.py`
3. No data migration — eval results are telemetry-only, deletion is safe

## Dependencies

- `config_paths.py` — ROOT_DIR, TELEMETRY_DIR, CACHE_DIR imports
- `skill_chain.py` — existing `run_chain()` function (import only, no modification of core logic)

## Success Criteria

- [ ] `python output_eval.py evaluate --input <file> --type proposal` returns JSON with score 0–100 and 5 criterion breakdowns
- [ ] `python output_eval.py --test` passes all smoke tests
- [ ] `python output_eval.py --verify-cycle` passes verification
- [ ] Same input always produces same score (determinism check in tests)
- [ ] `python skill_chain.py run proposal_chain --eval` runs eval after each step without breaking chain execution
- [ ] Eval results written to `eval_results/` as atomic JSON

## Proposal Question Round

Before finalizing, a few product questions to sharpen the spec:

1. **Score thresholds**: Is 70 the right "warning" threshold, or should different output types have different thresholds (e.g., proposals at 75, content at 65)?

2. **Accuracy checking**: V1 uses heuristic checks (are there source references? are claims verifiable?). Should "accuracy" in V1 simply check for the *presence* of citations/numbers, or attempt basic pattern validation (e.g., "market size" claims should have a number + source)?

3. **Output type extensibility**: Should new output types (e.g., `email`, `social_post`) be addable via YAML config, or hardcoded in V1?

4. **Telemetry format**: Should eval results include the full output text for audit, or just the score + suggestions to keep files small?
