# Integration Methodology — Auto-Improvement ↔ Capital Token

> How the two systems learn from each other.

---

## Overview

```
┌─────────────────────┐         ┌─────────────────────┐
│  Auto-Improvement   │ ──────► │   Capital Token     │
│  (detects patterns) │         │  (stores knowledge) │
└──────────┬──────────┘         └──────────▲──────────┘
           │                               │
           │    ┌──────────────────────┐   │
           └───►│  Pattern Aggregator  │───┘
                │  (threshold: 3x)     │
                └──────────────────────┘
```

---

## Flow: Pattern → Playbook

1. **Detection**: Auto-Improvement detects an issue pattern
2. **Aggregation**: Pattern occurrences tracked in `pattern_aggregator.json`
3. **Threshold**: When pattern reaches 3+ occurrences, flagged as playbook candidate
4. **Generation**: Engine creates draft playbook in `auto-generated/`
5. **Review**: Human reviews and refines the playbook
6. **Publication**: Playbook moved to `10_Shared_Org/playbooks/`

---

## Flow: Capital Token → Quality Check

1. **Monitoring**: Auto-Improvement scans Shared Org for quality issues
2. **Detection**: Checks for placeholders, broken refs, incomplete sections
3. **Reporting**: Issues logged in `capital_token_quality.json`
4. **Dashboard**: Quality score shown in knowledge dashboard

---

## Files

| File | Purpose |
|------|---------|
| `03_Metrics/pattern_aggregator.json` | Pattern occurrence tracking |
| `03_Metrics/capital_token_quality.json` | Capital Token quality metrics |
| `03_Metrics/knowledge_dashboard.md` | Unified knowledge dashboard |
| `10_Shared_Org/playbooks/auto-generated/` | Auto-generated playbook drafts |

---

## Configuration

### Pattern Threshold
Default: 3 occurrences before generating playbook.
To change: edit `learner.py` → `PATTERN_THRESHOLD` constant.

### Quality Checks
Current checks:
- YAML frontmatter validity
- Placeholder text (`{{...}}`)
- Broken references
- Incomplete sections

To add checks: edit `detector.py` → `check_capital_token_quality()` function.

---

## Dashboard

The knowledge dashboard (`03_Metrics/knowledge_dashboard.md`) shows:
- Total patterns detected
- Patterns by severity
- Playbooks generated (auto + manual)
- Capital Token quality score
- Trend indicators

---

## Philosophy

> "The system learns from itself."

Auto-Improvement provides the detection engine.
Capital Token provides the knowledge store.
Together, they create a self-improving organizational knowledge base.