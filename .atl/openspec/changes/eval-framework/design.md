# Design: Eval Framework

## Architecture Overview

```
┌─────────────────┐
│  run_evals.py   │
│  (Eval Runner)  │
└────────┬────────┘
         │
         ├─► Load agent config from 10_Shared_Org/agents/
         │
         ├─► Execute scenarios from 08_Evals/agents/{agent}/
         │
         ├─► Collect metrics (time, tokens, accuracy, completion)
         │
         ├─► Save to 08_Evals/metrics/history/{timestamp}.json
         │
         ├─► Compare against baseline.json
         │
         └─► Update 08_Evals/dashboard.md
```

## Key Design Decisions

### D1. Scenario-based evaluation
Each eval is a discrete scenario with input, expected output, and metrics. This allows:
- Granular testing of specific agent capabilities
- Easy addition of new scenarios
- Clear pass/fail criteria

### D2. Metrics collection via Engram
Use Engram MCP to track token usage and context loading. This provides:
- Accurate token counting
- Context relevance scoring
- Historical tracking

### D3. Markdown dashboard
Generate dashboard as markdown (not HTML) because:
- Can be viewed in any editor
- Easy to version control
- Can be included in process notes

### D4. Baseline comparison
Store baseline as JSON for:
- Easy programmatic comparison
- Version control friendly
- Can be updated without code changes

## Data Flow

```
1. Load agent config (YAML)
   ↓
2. Load scenarios (JSON + MD)
   ↓
3. Execute scenario (simulate agent task)
   ↓
4. Collect metrics (Engram + timing)
   ↓
5. Compare to expected output
   ↓
6. Calculate scores
   ↓
7. Save to history
   ↓
8. Update dashboard
```

## Files

| File | Purpose |
|------|---------|
| `08_Evals/run_evals.py` | Main eval runner script |
| `08_Evals/dashboard.md` | Auto-generated quality dashboard |
| `08_Evals/README.md` | Methodology documentation |
| `08_Evals/metrics/baseline.json` | Baseline scores for regression detection |
| `08_Evals/metrics/history/*.json` | Historical eval results |
| `08_Evals/agents/{agent}/scenario_*.md` | Scenario descriptions |
| `08_Evals/agents/{agent}/scenario_*.json` | Scenario inputs/expected outputs |

## Verification

1. Run `python run_evals.py --agent admin` → should execute 3-5 scenarios
2. Check `08_Evals/metrics/history/` for new JSON file
3. Check `08_Evals/dashboard.md` for updated scores
4. Verify no regressions flagged (unless baseline is wrong)
5. Run `python run_evals.py --all` → should evaluate all 5 agents
