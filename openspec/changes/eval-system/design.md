# Design: Eval System (Fase 3 — PLAN_AI_NATIVE)

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    CLI Layer                         │
│  output_eval.py evaluate --input X --type Y         │
│  output_eval.py batch --input-dir D --type Y        │
│  output_eval.py --test / --verify-cycle             │
│  skill_chain.py run chain --eval   (optional hook)  │
└───────────┬──────────────────────┬──────────────────┘
            │                      │
            ▼                      ▼
┌──────────────────────┐  ┌────────────────────────┐
│  OutputEvaluator     │  │  skill_chain.py        │
│                      │  │  (modified ~15 lines)  │
│  evaluate(text,meta) │  │                        │
│    ├─ completeness   │  │  After each step:      │
│    ├─ accuracy       │  │  if --eval:            │
│    ├─ tone           │  │    import output_eval  │
│    ├─ clarity        │  │    eval = evaluate()   │
│    └─ actionability  │  │    store in state.json │
│         │            │  │    warn if < 70        │
│         ▼            │  └────────────────────────┘
│  weighted_score      │
│  + suggestions       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Telemetry           │
│  eval_results/*.json │
│  (scores only)       │
└──────────────────────┘
```

## Module Design

### output_eval.py (~400 lines)

#### Constants (lines ~30–80)

```python
THRESHOLD = 70  # universal warning threshold

EVAL_CRITERIA = {
    "completeness": {"weight": 0.30, "check": "all_required_fields_present"},
    "accuracy":     {"weight": 0.25, "check": "facts_match_source"},
    "tone":         {"weight": 0.20, "check": "matches_brand_voice"},
    "clarity":      {"weight": 0.15, "check": "readability_score"},
    "actionability": {"weight": 0.10, "check": "clear_next_steps"},
}

REQUIRED_FIELDS = {
    "proposal": ["problem", "solution", "timeline", "budget", "team"],
    "content":  ["headline", "body", "cta", "target_audience"],
    "report":   ["summary", "findings", "recommendations", "next_steps"],
}

VALID_TYPES = list(REQUIRED_FIELDS.keys())
```

#### Corporate Jargon Patterns (lines ~80–100)

Reuse the JARGON_PATTERNS list from review_draft.py with additions. This is the only shared logic — output_eval is a new, independent module.

#### Class: OutputEvaluator (lines ~100–350)

```
__init__(eval_type: str)
  - validates type against VALID_TYPES
  - stores criteria and required_fields

evaluate(text: str, metadata: dict = None) -> dict
  - normalizes text (strip, handle encoding)
  - calls each _check_* method
  - calculates weighted score
  - generates suggestions
  - returns {score, threshold, passed, criteria: [...], suggestions: [...]}

_check_completeness(text, metadata) -> dict
  - scans text for each required field keyword (case-insensitive)
  - also checks metadata dict if provided (e.g., JSON input with field keys)
  - returns {score: 0-100, missing: [...], present: [...]}

_check_accuracy(text) -> dict
  - regex for numbers: \d+[\.,]?\d*[%$KMBkmb]?
  - regex for sources: "source:", "according to", "per ", URLs, citations
  - score = f(presence_count, total_claims) mapped to 0-100
  - returns {score, numbers_found, sources_found}

_check_tone(text) -> dict
  - jargon density = jargon_words / total_words
  - passive voice detection (reuse PASSIVE_PATTERNS)
  - score = 100 - (jargon% * 50 + passive% * 50), clamped 0-100
  - returns {score, jargon_density, passive_ratio}

_check_clarity(text) -> dict
  - avg sentence length (split on .!?)
  - max paragraph length (split on \n\n)
  - score = weighted(sentence_score, paragraph_score)
  - returns {score, avg_sentence_len, max_paragraph_len}

_check_actionability(text) -> dict
  - presence of "next steps" / "action items" / "recommendations"
  - presence of owner patterns: "@name", "assigned to", "responsible:"
  - presence of deadline patterns: dates, "by Friday", "Q3", "2024"
  - presence of CTA patterns (reuse from review_draft.py)
  - score = f(has_section, has_owners, has_deadlines, has_cta)
  - returns {score, has_section, has_owners, has_deadlines, has_cta}

_generate_suggestions(criteria_results) -> list[str]
  - for each criterion with score < 70, add specific suggestion
  - suggestions are prescriptive: "Add a budget section with estimated costs"

_calculate_score(criteria_results) -> int
  - weighted_sum = sum(criterion.score * criterion.weight)
  - return round(weighted_sum)  # deterministic, no randomness
```

#### Input Handling (lines ~350–380)

```python
def resolve_input(input_str: str) -> str:
    """Detect if input is file path, JSON, or raw text."""
    # 1. If file path exists → read file
    # 2. If starts with '{' → parse JSON, extract text/content field
    # 3. Otherwise → treat as raw text
    # 4. If empty → return ""
```

#### CLI (lines ~380–400)

```
evaluate --input <path|json|text> --type <proposal|content|report>
batch    --input-dir <dir>        --type <proposal|content|report>
--test        → smoke tests
--verify-cycle → verification pass
```

#### Telemetry Writer (lines ~25–30 of module)

```python
EVAL_RESULTS_DIR = ROOT_DIR / "01_Personal_Os" / "03_Learning" / "04_Telemetry" / "eval_results"

def _write_telemetry(result: dict, eval_type: str) -> Path:
    """Atomic write of eval result. Scores only, no input text."""
    # filename: {eval_type}_{timestamp}_{hash8}.json
    # content: {score, threshold, passed, criteria, suggestions, timestamp, type}
```

### test_output_eval.py (~250 lines)

| Test # | Name | Validates |
|--------|------|-----------|
| 1 | test_weighted_score_calculation | 5 criteria * weights = correct composite |
| 2 | test_completeness_all_present | All required fields → score 100 |
| 3 | test_completeness_missing_fields | Missing fields → score < 100 + suggestions |
| 4 | test_accuracy_numbers_present | Numbers in text → high accuracy |
| 5 | test_accuracy_no_numbers | No numbers/sources → low accuracy |
| 6 | test_clarity_readable | Short sentences → high clarity |
| 7 | test_clarity_jargon_heavy | Many jargon words → low clarity |
| 8 | test_actionability_with_next_steps | "Next steps" section → high score |
| 9 | test_actionability_no_next_steps | No next steps → low score |
| 10 | test_determinism | Same input twice → identical scores |
| 11 | test_empty_input | Empty string → score 0 |
| 12 | test_unknown_type | Invalid type → error with valid types |
| 13 | test_batch_evaluation | Directory with 3 files → 3 results |
| 14 | test_suggestion_generation | Low scores → suggestions present |
| 15 | test_file_input | File path → reads and evaluates |

### skill_chain.py Modification (~15 lines)

**Location**: Inside `run_chain()`, after the step execution loop body (line ~489), before the failure handling block.

**Changes**:
1. Add `--eval` argument to run subparser (~3 lines in argparse block)
2. After each step completes (line ~489), add eval block (~12 lines):

```python
# --- EVAL HOOK (V1) ---
if run_eval and result["status"] == "completed" and result.get("output"):
    try:
        from output_eval import OutputEvaluator
        eval_text = _read_step_output(result["output"])
        if eval_text:
            evaluator = OutputEvaluator(eval_type="content")
            eval_result = evaluator.evaluate(eval_text)
            step["eval_score"] = eval_result["score"]
            step["eval_criteria"] = eval_result["criteria"]
            if eval_result["score"] < THRESHOLD:
                logger.warning(
                    "  [EVAL] Step %s scored %d/100 (threshold: %d)",
                    step["name"], eval_result["score"], THRESHOLD,
                )
    except Exception as e:
        logger.debug("  [EVAL] Skipped: %s", e)
# --- END EVAL ---
```

3. New helper `_read_step_output(path) -> str` (~5 lines) — reads file if path exists, returns text.

**Key decisions**:
- `eval_type` defaults to "content" in chain context (chain steps produce content)
- eval failure never aborts the chain (wrapped in try/except)
- eval results stored in step dict, persisted via existing `save_state(state)`
- `--eval` is on the `run` subparser, not top-level

## Data Formats

### Evaluate Output

```json
{
  "score": 82,
  "threshold": 70,
  "passed": true,
  "type": "proposal",
  "criteria": [
    {"name": "completeness", "weight": 0.30, "score": 90, "detail": {"missing": [], "present": ["problem","solution","timeline","budget","team"]}},
    {"name": "accuracy", "weight": 0.25, "score": 85, "detail": {"numbers_found": 3, "sources_found": 1}},
    {"name": "tone", "weight": 0.20, "score": 75, "detail": {"jargon_density": 0.05, "passive_ratio": 0.08}},
    {"name": "clarity", "weight": 0.15, "score": 88, "detail": {"avg_sentence_len": 16.2, "max_paragraph_len": 120}},
    {"name": "actionability", "weight": 0.10, "score": 70, "detail": {"has_section": true, "has_owners": true, "has_deadlines": false, "has_cta": true}}
  ],
  "suggestions": ["Add specific deadlines to the timeline section"],
  "timestamp": "2026-07-14T21:30:00Z"
}
```

### Telemetry File

```json
{
  "score": 82,
  "threshold": 70,
  "passed": true,
  "type": "proposal",
  "criteria": ["..."],
  "suggestions": ["..."],
  "timestamp": "2026-07-14T21:30:00Z"
}
```

### Chain State Addition (per step)

```json
{
  "eval_score": 82,
  "eval_criteria": ["..."]
}
```

## Error Handling

| Condition | Behavior |
|-----------|----------|
| Missing file | sys.exit(1) + "File not found: {path}" |
| Unknown type | sys.exit(1) + "Invalid type 'X'. Use: proposal, content, report" |
| Empty input | Score 0, suggestion "Input is empty — provide text to evaluate" |
| Malformed metadata | Skip metadata-dependent checks, continue with text-only checks |
| --eval import fails | Log debug, continue chain (never abort) |

## Dependencies

| Module | Import | Used For |
|--------|--------|----------|
| config_paths.py | ROOT_DIR, TELEMETRY_DIR | Path resolution |
| re | stdlib | Regex for all pattern checks |
| json | stdlib | Output formatting |
| pathlib | stdlib | File path handling |
| argparse | stdlib | CLI |
| datetime | stdlib | Timestamps |

No external dependencies. Python 3.14.2 stdlib only.

## Files Created/Modified

| File | Action | Est. Lines |
|------|--------|-----------|
| 03_Scripts_Os/output_eval.py | New | ~400 |
| 03_Scripts_Os/test_output_eval.py | New | ~250 |
| 03_Scripts_Os/skill_chain.py | Modified | +15 |
| 03_Learning/04_Telemetry/eval_results/ | New dir | — |

**Total new code**: ~665 lines | **Total with modifications**: ~680 lines
