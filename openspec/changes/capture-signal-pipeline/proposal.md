# Proposal: Capture + Signal Pipeline (Fase 2+4)

## Intent

PersonalOS captures external signals (`capture_external_signals.py`) and normalizes them (`signal_normalizer.py`), but has no automated pipeline to classify, route, learn from, or aggregate those signals. The OS can hear the world — it can't understand or act on it. This change builds the curation filter and signal aggregation layers that close the Capture → Signal → Feedback loop from PLAN_AI_NATIVE.

## Scope

### In Scope
- `curation_filter.py` (~350 lines) — classifies raw signals into actionable/reference/noise, routes to tasks or brain
- `curation_rules.yaml` (~60 lines) — configurable keyword/pattern rules for classification
- `signal_aggregator.py` (~350 lines) — multi-source signal aggregation with trend analysis
- `learner.py` modification (~50 lines) — auto-learn from negative signals (rejection, low scores)

### Out of Scope
- `capture_pipeline.py` (Fase 2.1) — already exists as `capture_external_signals.py`
- Dashboard modifications (`18_Telemetry_Hub.py` Fase 4.3)
- Labs page (`labs_page.py` Fase 3)
- Cron/Task Scheduler setup (operational, not code)

## Capabilities

### New Capabilities
- `curation-filter`: Rule-based signal classification engine routing actionable items to tasks, references to brain, noise to archive
- `signal-aggregation`: Multi-source signal collection with JSON report output and trend analysis

### Modified Capabilities
- None — `learner.py` is a surgical edit (add `learn_from_signal()` method), not a spec-level behavior change

## Approach

1. **Curation filter** reads raw signals from `03_Learning/04_Telemetry/capture_inbox/`, applies rules from `02_Knowledge/04_Config/curation_rules.yaml`, and routes outputs using atomic JSON writes
2. **Signal aggregator** pulls from analytics APIs, CRM, labs feedback, support tickets, feature usage, social mentions — produces `signal_report_{id}.json` + trend delta
3. **Learner modification** adds `learn_from_signal(negative_signal)` that auto-analyzes rejections, adds patterns to `learnings.json`, and suggests skill updates
4. All files follow project conventions: Windows UTF-8 fix, `config_paths` import, argparse CLI, no hardcoded paths, retry logic for network calls

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/curation_filter.py` | New | Classification engine |
| `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/signal_aggregator.py` | New | Multi-source aggregation |
| `01_Personal_Os/02_Knowledge/04_Config/curation_rules.yaml` | New | Classification rules config |
| `01_Personal_Os/03_Learning/01_Auto_Improvement/01_Engine/learner.py` | Modified | Add signal-based learning |
| `01_Personal_Os/03_Learning/04_Telemetry/capture_inbox/` | Consumed | Raw signals from capture engine |
| `01_Personal_Os/04_Tasks/` | Consumed | Actionable item destination |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Keyword-only classification misses context | Medium | Rules are YAML-configurable; LLM enhancement deferred to Fase 5 |
| Signal API rate limits or auth failures | High | Retry with tenacity (existing pattern), mock mode, cache fallback |
| Negative-signal learning produces false patterns | Medium | Minimum sample threshold (3+ occurrences) before pattern extraction |
| PR exceeds 400-line budget | Medium | Curation filter and signal aggregator are independent; can split to chained PRs |

## Rollback Plan

All new files are additive — delete `curation_filter.py`, `signal_aggregator.py`, `curation_rules.yaml` and revert `learner.py` git diff. No existing behavior depends on these files yet.

## Dependencies

- `capture_external_signals.py` — must produce `capture_inbox/` files (already exists)
- `signal_normalizer.py` — normalizer output consumed by signal aggregator (already exists)
- `config_paths.py` — path resolution (already exists, provides `SIGNALS_DIR`, `AUTO_IMPROVEMENT_DIR`)

## Success Criteria

- [ ] `python curation_filter.py --inbox <dir> --rules <yaml>` classifies 90%+ of test signals correctly
- [ ] `python signal_aggregator.py --dry-run` produces valid `signal_report_{id}.json`
- [ ] `python learner.py learn-from-signal --signal <json>` adds pattern after 3+ negative signals
- [ ] All files pass `python config_paths.py --validate` with 0 broken paths
- [ ] No hardcoded paths; all imports via `config_paths`
- [ ] Atomic JSON writes with UTF-8 encoding on Windows
