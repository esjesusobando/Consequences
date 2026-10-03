# Proposal: Eval Framework — Automated Agent Quality Measurement

## Intent

Create a comprehensive evaluation system in `08_Evals/` that allows objective measurement of agent/skill quality. Currently there's no way to detect regressions or measure improvements. The eval framework will provide automated tests for the 5 most critical agents, metrics tracking, and a quality dashboard.

## Scope

### In Scope
- Create eval test suite structure in `08_Evals/`
- Implement eval runner script (`run_evals.py`)
- Create evals for 5 critical agents: Admin, Finance, HR, Marketing Strategist, Content Creator
- Define metrics: response time, context usage accuracy, task completion rate, token efficiency
- Create quality dashboard (`08_Evals/dashboard.md`)
- Add regression detection (fail if quality drops >10% from baseline)
- Document eval methodology in `08_Evals/README.md`

### Out of Scope
- CI/CD integration (future phase)
- Automated eval generation from agent specs
- Cross-agent collaboration evals
- Performance benchmarking against external systems

## Capabilities

### New Capabilities
- **Agent Eval Runner**: Script that executes eval scenarios and collects metrics
- **Quality Dashboard**: Markdown-based dashboard showing agent quality scores
- **Regression Detection**: Automatic flagging when agent quality drops below baseline

## Approach

1. **Design eval structure**: Create `08_Evals/` with subdirectories per agent
2. **Build eval runner**: Python script that loads agent configs, runs test scenarios, measures metrics
3. **Create eval scenarios**: For each of 5 agents, define 3-5 test scenarios with expected outcomes
4. **Implement metrics collection**: Track response time, token usage, context accuracy, task completion
5. **Build quality dashboard**: Generate markdown report with scores per agent, trends, regressions
6. **Add regression detection**: Compare current scores against baseline, flag drops >10%
7. **Document methodology**: Write README explaining how to add new evals, interpret results

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `08_Evals/` | Created | New directory for eval framework |
| `08_Evals/run_evals.py` | Created | Eval runner script |
| `08_Evals/dashboard.md` | Created | Quality dashboard |
| `08_Evals/README.md` | Created | Methodology documentation |
| `08_Evals/agents/` | Created | Per-agent eval scenarios |
| `08_Evals/metrics/` | Created | Baseline and historical metrics |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Eval scenarios don't cover real-world usage | Medium | Base scenarios on actual agent tasks from process notes |
| Metrics are too subjective | Medium | Use objective measures (token count, time) + binary pass/fail for task completion |
| Eval runner is slow | Low | Run evals in parallel where possible, cache results |
| Baseline becomes stale | Medium | Re-baseline quarterly or after major agent changes |

## Rollback Plan

Delete `08_Evals/` directory. No dependencies on existing systems.

## Dependencies

- Python 3.x (already available)
- Agent config files (already exist in `01_Personal_Os/02_Knowledge/10_Shared_Org/agents/`)
- Engram MCP for context loading (already configured)

## Completion Record

| Event | Date |
|-------|------|
| Proposed | 2026-06-27 |
| Implemented | |
| Verified | |
| Archived | |
