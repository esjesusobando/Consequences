# Spec: Eval Framework

## REQ-EVAL-01: Eval Directory Structure
The eval framework MUST create the following directory structure:
```
08_Evals/
├── README.md              # Methodology documentation
├── run_evals.py           # Eval runner script
├── dashboard.md           # Quality dashboard (auto-generated)
├── agents/                # Per-agent eval scenarios
│   ├── admin/
│   ├── finance/
│   ├── hr/
│   ├── marketing_strategist/
│   └── content_creator/
└── metrics/               # Baseline and historical data
    ├── baseline.json      # Baseline scores
    └── history/           # Historical eval results
```

## REQ-EVAL-02: Eval Runner Script
`run_evals.py` MUST:
- Accept agent name as argument (or "all" for all agents)
- Load agent config from `10_Shared_Org/agents/`
- Execute eval scenarios from `08_Evals/agents/{agent}/`
- Collect metrics: response_time, token_usage, context_accuracy, task_completion
- Output results to `08_Evals/metrics/history/{timestamp}.json`
- Update `08_Evals/dashboard.md` with latest scores
- Exit with code 0 if all agents pass, 1 if any fail

## REQ-EVAL-03: Eval Scenarios
Each agent MUST have 3-5 eval scenarios. Each scenario MUST include:
- `scenario.md`: Description of the task
- `input.json`: Input data for the scenario
- `expected_output.json`: Expected output (or validation criteria)
- `metrics.json`: Metrics to collect for this scenario

Scenarios MUST be based on real agent tasks documented in process notes.

## REQ-EVAL-04: Metrics Collection
The eval runner MUST collect these metrics for each scenario:
- **response_time**: Time in seconds to complete the task
- **token_usage**: Number of tokens consumed (input + output)
- **context_accuracy**: % of relevant context loaded (0-100)
- **task_completion**: Binary (1=completed successfully, 0=failed)

## REQ-EVAL-05: Quality Dashboard
`dashboard.md` MUST display:
- Overall quality score (weighted average of all agents)
- Per-agent scores (0-100 scale)
- Metrics breakdown (response_time, token_usage, context_accuracy, task_completion)
- Trend indicators (↑↓→) comparing to previous eval
- Regression warnings (if score drops >10% from baseline)

## REQ-EVAL-06: Regression Detection
The eval runner MUST:
- Load baseline from `08_Evals/metrics/baseline.json`
- Compare current scores against baseline
- Flag any agent with score drop >10% as "REGRESSION"
- Output warning to console and dashboard

## REQ-EVAL-07: Documentation
`README.md` MUST explain:
- How to run evals (`python run_evals.py --agent admin`)
- How to add new eval scenarios
- How to interpret dashboard metrics
- How to update baseline
- Eval methodology (what each metric means)
