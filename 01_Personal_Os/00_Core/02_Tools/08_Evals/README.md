# Eval Framework — Methodology & Usage

> **Purpose:** Objective measurement of agent/skill quality to detect regressions and track improvements.

---

## Quick Start

```bash
# Evaluate all agents
python run_evals.py --all

# Evaluate single agent
python run_evals.py --agent admin

# Check regressions (always runs by default)
python run_evals.py --regress

# Generate dashboard only
python run_evals.py --dashboard
```

---

## Metrics Explained

| Metric               | What It Measures                    | Target                             |
| -------------------- | ----------------------------------- | ---------------------------------- |
| **response_time**    | Seconds to complete task            | < 5s for simple, < 10s for complex |
| **token_usage**      | Tokens consumed (input + output)    | < 3000 for complex tasks           |
| **context_accuracy** | % of relevant context loaded        | > 80%                              |
| **task_completion**  | Binary: task completed successfully | 1.0 (100%)                         |

### Overall Score Formula

```
overall = task_completion * 40 +
          context_accuracy * 0.3 +
          (100 - min(response_time * 10, 100)) * 0.2 +
          (100 - min(token_usage / 50, 100)) * 0.1
```

Weights: Task completion (40%), Context accuracy (30%), Response time (20%), Token efficiency (10%)

---

## Adding New Eval Scenarios

### 1. Create Scenario Directory
```
08_Evals/agents/{agent_key}/scenario_{NN}_{name}.json
```

### 2. Scenario JSON Structure
```json
{
  "id": "{agent}_{NN}",
  "name": "Descriptive Name",
  "description": "What this scenario tests",
  "input": { ... },
  "expected_output": { ... },
  "metrics": {
    "expected_response_time": 5,
    "expected_tokens": 2000,
    "min_context_accuracy": 80
  }
}
```

### 3. Required Fields
| Field             | Purpose                      |
| ----------------- | ---------------------------- |
| `id`              | Unique identifier (agent_NN) |
| `name`            | Human-readable name          |
| `input`           | Data fed to agent            |
| `expected_output` | Criteria for success         |
| `metrics`         | Target thresholds            |

---

## Interpreting Dashboard

### Status Indicators
- ✅ **PASS** — All scenarios passed, score ≥ baseline
- ⚠️ **REGRESSION** — Score dropped >10% from baseline
- ⏳ **PENDING** — Not yet evaluated

### Trend Arrows
- ↑ Improved since last eval
- ↓ Regressed since last eval
- → Stable

### Scores
- **90-100**: Excellent — Agent performing optimally
- **70-89**: Good — Minor optimizations possible
- **50-69**: Needs Work — Significant issues
- **< 50**: Critical — Agent not functional

---

## Updating Baseline

1. Run evals to get current scores: `python run_evals.py --all`
2. Review `08_Evals/dashboard.md` for current scores
3. Update `08_Evals/metrics/baseline.json` with new scores
3. Commit baseline change: `git commit -m "eval: update baseline scores"`

**When to update baseline:**
- After major agent refactor
- After adding significant new capabilities
- Quarterly review
- After fixing known regressions

---

## Regression Detection

The eval runner automatically compares current scores against `baseline.json`:

- **Drop > 10%**: Flagged as REGRESSION in console and dashboard
- **Drop 5-10%**: Warning in console
- **No drop**: Stable or improved

---

## Directory Structure

```
08_Evals/
├── README.md                    # This file
├── run_evals.py                 # Main runner script
├── dashboard.md                 # Auto-generated quality dashboard
├── agents/                      # Per-agent scenarios
│   ├── admin/
│   ├── finance/
│   ├── hr/
│   ├── marketing_strategist/
│   └── content_creator/
├── metrics/
│   ├── baseline.json            # Baseline scores for regression
│   └── history/                 # Historical eval results
│       └── eval_YYYYMMDD_HHMMSS.json
```

---

## Extending the Framework

### Adding New Agents
1. Add agent to `AGENTS` dict in `run_evals.py`
2. Create `08_Evals/agents/{new_agent}/` directory
3. Add 3+ scenario JSON files
4. Update `load_agent_config()` if config path differs

### Custom Metrics
Add new metrics to scenario JSON and extend `run_scenario()` in `run_evals.py`.

### CI/CD Integration
```yaml
# Example GitHub Action
- name: Run Agent Evals
  run: python 08_Evals/run_evals.py --all --regress
```

---

## Philosophy

> "You can't improve what you don't measure."

This framework exists to:
1. **Detect regressions early** — Before they reach production
2. **Track improvements objectively** — Data-driven decisions
3. **Enable safe refactoring** — Confidence that changes don't break agents
4. **Document agent capabilities** — Living documentation of what agents do

---

*For questions or contributions, see `08_Evals/run_evals.py` source.*