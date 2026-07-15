# Design: Capture + Signal Pipeline (Fase 2+4)

## Technical Approach

Two new CLI modules (`curation_filter.py`, `signal_aggregator.py`) plus a YAML config (`curation_rules.yaml`) and a surgical addition to `learner.py`. All follow existing PersonalOS conventions: Windows UTF-8 fix, `config_paths` imports, argparse CLIs, `logging` module, atomic JSON writes with `ensure_ascii=False`.

---

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Classification engine | Keyword matching in YAML | LLM classification, ML model | V1 simplicity; YAML is editable without code. LLM deferred to Fase 5 per proposal risk table |
| Dedup storage | JSON file (`dedup_cache.json`) | SQLite, Redis | Matches flat-file persistence pattern used across PersonalOS |
| Daily inbox format | One JSON file per day per category | Single inbox file, markdown | Atomic writes per day; no file locking on append |
| Signal aggregator sources | Adapter pattern (list of source callables) | Monolithic if/else, ABC like capture_external_signals | Lighter than ABC — just functions returning `SourceResult` dicts |
| Learner integration | New method on existing `Learner` class + argparse subcommand | Separate script, inheritance | Preserves backward compatibility; existing `main()` untouched |
| Execution model | `--once` only, no daemon | Cron, watch mode | Matches proposal: "On-demand only, no cron in V1" |

---

## Data Flow

```
capture_external_signals.py
        │
        ▼
┌──────────────────┐     ┌────────────────────┐
│  capture_inbox/   │────▶│  curation_filter.py  │
│  (raw signal JSON)│     │  + curation_rules.yaml│
└──────────────────┘     └────────┬───────────┘
                                  │
                    ┌─────────────┼──────────────┐
                    ▼             ▼              ▼
          actionable_       reference_       noise_
          YYYY-MM-DD.json   signals.json    archive.json
          (04_Tasks/)       (02_Knowledge/  (07_Archive/
                             03_Brain/)      05_Signals_Archive/)

┌──────────────────┐     ┌────────────────────┐
│ content_analytics  │     │                    │
│ proposal_tracker   │────▶│ signal_aggregator  │
│ prototype_feedback │     │ .py                │
│ social_mentions    │     │                    │
└──────────────────┘     └────────┬───────────┘
                                  │
                          signal_report_{id}.json
                                  │
                    ┌─────────────┴──────────────┐
                    ▼                             ▼
          show_feedback_dashboard.py      learner.py
          (reads reports)                 learn-from-signal
                                          (score < 40 → pattern)
```

---

## Module Specifications

### curation_filter.py (~300 lines)

```
class CurationFilter:
    __init__(rules_path: Path)
    _load_rules() -> dict              # YAML parse + validation
    _fingerprint(content: str) -> str  # SHA-256 of first 200 chars
    _is_duplicate(fp: str) -> bool     # check dedup_cache.json
    _cache_fingerprint(fp: str) -> None
    classify(signal: dict) -> str      # "actionable"|"reference"|"noise"
    route(classified: dict, signal: dict) -> None  # write to destination
    process_inbox(inbox_dir: Path) -> dict  # main loop; returns stats

CLI: --inbox (default: capture_inbox/), --rules (default: curation_rules.yaml), --dry-run
```

**Classification priority**: actionable > reference > noise (default). Case-insensitive substring match.

**Dedup**: `dedup_cache.json` stores `{fingerprint: timestamp}`. TTL from `curation_rules.yaml` (default 24h). Stale entries pruned on load.

**Routing**: Actionable → `TASKS_DIR/actionable_YYYY-MM-DD.json` (append). Reference → `BRAIN_DIR` equivalent via route mapping. Noise → archive dir. Atomic reads-before-writes.

### signal_aggregator.py (~320 lines)

```
class SignalAggregator:
    __init__(rules_path: Path)
    _load_weights() -> dict            # from curation_rules.yaml, renormalize if needed
    _collect_content_analytics() -> dict
    _collect_proposal_conversion() -> dict
    _collect_prototype_feedback() -> dict
    _collect_social_mentions() -> dict
    _collect_all() -> dict[str, SourceResult]
    _compute_composite(sources: dict) -> float
    _compute_trends(sources: dict) -> dict
    aggregate() -> dict                # main; returns full report

CLI: --once (required), --dry-run, --verbose
```

**SourceResult** shape: `{score: float, status: "ok"|"unavailable", data_days: int}`

**Composite score**: `Σ(source_score × weight)` with renormalization on missing sources. Weights from YAML (tolerance ±0.01).

**Trends**: For each source, compute 7d avg vs 30d avg. If < 30d data, use available days + metadata.

**Output**: `signal_report_{timestamp_id}.json` with keys: `timestamp`, `sources`, `composite_score`, `trends`.

### curation_rules.yaml (~60 lines)

```yaml
classification:
  actionable: ["deadline", "urgent", "review needed", "blocker", "action required"]
  reference: ["research", "article", "learning", "documentation", "insight"]
  noise: ["unsubscribe", "newsletter", "promotion", "spam", "automated"]

dedup:
  window_hours: 24

weights:
  content_analytics: 0.30
  proposal_conversion: 0.25
  prototype_feedback: 0.20
  social_mentions: 0.25

routes:
  actionable: "04_Tasks"
  reference: "02_Knowledge/03_Brain"
  noise: "07_Archive/05_Signals_Archive"

thresholds:
  negative_signal: 40
```

**Validation**: Required keys: `classification`, `dedup`, `weights`. Missing → exit 2 with message.

### learner.py modification (~50 lines added)

Add `learn_from_signal(signal_report: dict)` method to `Learner` class:

- Check `composite_score < threshold` (default 40)
- Fingerprint: `source + category` string
- Count occurrences in `learnings["signal_patterns"]`
- At 3+ occurrences: extract pattern, persist to `learnings.json`, print suggestion
- **NEVER auto-apply** — output is human-readable suggestion only
- New argparse subcommand: `learn-from-signal --signal <json_string_or_path>`

**Backward compat**: Existing `record_fix`, `report`, `main()` untouched. New field `signal_patterns` is additive to `learnings.json`.

---

## Data Formats

### Input signal (from capture_inbox/)
```json
{"source": "linkedin", "metric": "engagement_rate", "value": 3.2, "timestamp": "...", "url": "", "extra": {}}
```

### Classified signal
```json
{
  "source": "linkedin", "metric": "engagement_rate", "value": 3.2,
  "timestamp": "...", "classification": "actionable",
  "fingerprint": "a1b2c3...", "routed_to": "04_Tasks/actionable_2026-07-14.json"
}
```

### Aggregated report
```json
{
  "timestamp": "2026-07-14T14:30:00",
  "sources": {
    "content_analytics": {"score": 80, "status": "ok", "data_days": 7},
    "social_mentions": {"score": 90, "status": "ok", "data_days": 30},
    "proposal_conversion": {"score": 0, "status": "unavailable", "data_days": 0}
  },
  "composite_score": 74.0,
  "trends": {"content_analytics": {"7d": 75, "30d": 70, "delta": 7.14}}
}
```

### Daily inbox (actionable_YYYY-MM-DD.json)
```json
{
  "date": "2026-07-14",
  "signals": [
    {"source": "linkedin", "metric": "...", "classification": "actionable", "...": "..."}
  ],
  "count": 3
}
```

---

## Integration Points

| Module | Reads From | Writes To |
|--------|-----------|-----------|
| `curation_filter.py` | `capture_inbox/` (from `capture_external_signals.py`), `curation_rules.yaml`, `config_paths` | Daily inbox JSON, reference signals, noise archive, `dedup_cache.json` |
| `signal_aggregator.py` | `content_analytics.py` (mock/real), `curation_rules.yaml`, `signals.json`, `signals_normalized.json`, `config_paths` | `signal_report_{id}.json` |
| `learner.py` (modified) | `signal_report_*.json`, `curation_rules.yaml` (threshold), `learnings.json` | `learnings.json` (new `signal_patterns` field) |
| Dashboard | `signal_report_*.json` (future Fase 4.3) | ASCII output |

**Path resolution**: All modules import from `config_paths.py`. Key constants: `SIGNALS_DIR`, `TASKS_DIR`, `AUTO_IMPROVEMENT_DIR`, `ROOT_DIR`.

---

## Error Handling Matrix

| Failure | Handling | Exit Code |
|---------|----------|-----------|
| Network (API call) | Retry 3x exponential backoff (tenacity). After 3 failures: log warning, mark source `unavailable`, continue | 0 |
| Malformed JSON in inbox | Log `[WARN] Skipped: {file} — invalid JSON`, skip file, continue | 0 |
| Missing source telemetry | Mark `status: "unavailable"`, renormalize weights, continue | 0 |
| YAML missing required key | Print `"Missing required key: {key}"`, exit | 2 |
| YAML weights ≠ 1.0 (±0.01) | Log warning, auto-renormalize, continue | 0 |
| Empty inbox (no files) | Print nothing, exit 0, no output files | 0 |
| File I/O (disk full, permissions) | Log `[ERROR]`, exit 1 | 1 |
| `--once` flag missing | Print help, exit 1 | 1 |

---

## Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| Unit | `CurationFilter.classify()` | Mock signals with known keywords, verify category |
| Unit | `CurationFilter._fingerprint()` + `_is_duplicate()` | Known input → known hash; add twice within TTL → skip |
| Unit | `SignalAggregator._compute_composite()` | Known weights + scores → exact result |
| Unit | `SignalAggregator._compute_trends()` | Known 7d/30d data → verify delta math |
| Unit | `learner.learn_from_signal()` | Mock `learnings.json`, inject 3 signals, verify pattern extracted |
| Integration | Full curation pipeline | Create `capture_inbox/` with 10 test files, run filter, verify routing |
| Integration | Full aggregation | Mock sources, run `--once --dry-run`, verify JSON output |
| Edge case | Empty inbox | Verify exit 0, no files created |
| Edge case | All sources unavailable | Verify exit 0, composite_score = 0 |
| Edge case | Learner score at threshold (40) | Verify NO pattern extraction (exclusive) |

---

## File Manifest

| File | Action | Est. Lines | Location |
|------|--------|-----------|----------|
| `curation_filter.py` | Create | ~300 | `05_Scripts/00_HUBs/03_Scripts_Os/` |
| `signal_aggregator.py` | Create | ~320 | `05_Scripts/00_HUBs/03_Scripts_Os/` |
| `curation_rules.yaml` | Create | ~60 | `02_Knowledge/04_Config/` |
| `learner.py` | Modify | +50 | `03_Learning/01_Auto_Improvement/01_Engine/` |
| `design.md` | Create | ~1 | `openspec/changes/capture-signal-pipeline/` |

**Total new**: ~680 lines. **Modified**: ~50 lines. **No deletions.**

---

## Open Questions

- [ ] Should `capture_inbox/` be a subdirectory of `SIGNALS_DIR` or a sibling? Proposal says `SIGNALS_DIR/capture_inbox/` — confirm.
- [ ] Dashboard integration (Fase 4.3) reads `signal_report_*.json` — should signal_aggregator also produce a latest symlink/copy for dashboard consumption?
- [ ] For `proposal_conversion` and `prototype_feedback` sources in signal_aggregator: are there existing telemetry files, or are these mock-only for V1?
