# Tasks: Eval Framework

## Phase 1: Infrastructure

- [ ] **1.1 Create eval directory structure**
  - Create `08_Evals/` with subdirectories: `agents/`, `metrics/`, `metrics/history/`
  - Create agent subdirectories: `agents/admin/`, `agents/finance/`, `agents/hr/`, `agents/marketing_strategist/`, `agents/content_creator/`
  - Files: `08_Evals/` (directories)
  - Verify: `ls 08_Evals/` shows correct structure

- [ ] **1.2 Create baseline.json**
  - Create `08_Evals/metrics/baseline.json` with initial baseline scores
  - Set all scores to 70 (neutral baseline) for each agent
  - Files: `08_Evals/metrics/baseline.json`
  - Verify: JSON is valid, contains all 5 agents

## Phase 2: Eval Runner

- [ ] **2.1 Build eval runner script**
  - Create `08_Evals/run_evals.py` with CLI interface
  - Accept `--agent` argument (or "all")
  - Load agent config from `10_Shared_Org/agents/`
  - Load scenarios from `08_Evals/agents/{agent}/`
  - Execute scenarios and collect metrics
  - Save results to `08_Evals/metrics/history/{timestamp}.json`
  - Update `08_Evals/dashboard.md`
  - Files: `08_Evals/run_evals.py`
  - Verify: `python run_evals.py --help` shows usage

- [ ] **2.2 Implement metrics collection**
  - Add timing measurement (response_time)
  - Add token counting (token_usage) via Engram or estimation
  - Add context accuracy scoring (context_accuracy)
  - Add task completion tracking (task_completion)
  - Files: `08_Evals/run_evals.py`
  - Verify: Metrics are collected and saved correctly

- [ ] **2.3 Add regression detection**
  - Load baseline from `08_Evals/metrics/baseline.json`
  - Compare current scores against baseline
  - Flag any agent with score drop >10% as "REGRESSION"
  - Output warning to console
  - Files: `08_Evals/run_evals.py`
  - Verify: Regression is flagged when score drops

## Phase 3: Eval Scenarios

- [ ] **3.1 Create Admin agent evals**
  - Create 3 scenarios in `08_Evals/agents/admin/`:
    - `scenario_01_client_onboarding.md` + `.json`
    - `scenario_02_invoice_processing.md` + `.json`
    - `scenario_03_team_coordination.md` + `.json`
  - Each scenario: description, input, expected output, metrics
  - Files: `08_Evals/agents/admin/scenario_*.md`, `scenario_*.json`
  - Verify: 3 scenarios exist with valid JSON

- [ ] **3.2 Create Finance agent evals**
  - Create 3 scenarios in `08_Evals/agents/finance/`:
    - `scenario_01_budget_tracking.md` + `.json`
    - `scenario_02_financial_reporting.md` + `.json`
    - `scenario_03_cost_analysis.md` + `.json`
  - Files: `08_Evals/agents/finance/scenario_*.md`, `scenario_*.json`
  - Verify: 3 scenarios exist with valid JSON

- [ ] **3.3 Create HR agent evals**
  - Create 3 scenarios in `08_Evals/agents/hr/`:
    - `scenario_01_employee_onboarding.md` + `.json`
    - `scenario_02_performance_review.md` + `.json`
    - `scenario_03_policy_documentation.md` + `.json`
  - Files: `08_Evals/agents/hr/scenario_*.md`, `scenario_*.json`
  - Verify: 3 scenarios exist with valid JSON

- [ ] **3.4 Create Marketing Strategist evals**
  - Create 3 scenarios in `08_Evals/agents/marketing_strategist/`:
    - `scenario_01_brand_voice_setup.md` + `.json`
    - `scenario_02_content_strategy.md` + `.json`
    - `scenario_03_campaign_planning.md` + `.json`
  - Files: `08_Evals/agents/marketing_strategist/scenario_*.md`, `scenario_*.json`
  - Verify: 3 scenarios exist with valid JSON

- [ ] **3.5 Create Content Creator evals**
  - Create 3 scenarios in `08_Evals/agents/content_creator/`:
    - `scenario_01_linkedin_post.md` + `.json`
    - `scenario_02_newsletter_draft.md` + `.json`
    - `scenario_03_blog_article.md` + `.json`
  - Files: `08_Evals/agents/content_creator/scenario_*.md`, `scenario_*.json`
  - Verify: 3 scenarios exist with valid JSON

## Phase 4: Dashboard & Documentation

- [ ] **4.1 Build quality dashboard generator**
  - Generate `08_Evals/dashboard.md` from eval results
  - Display overall quality score (weighted average)
  - Display per-agent scores (0-100)
  - Show metrics breakdown (response_time, token_usage, context_accuracy, task_completion)
  - Show trend indicators (↑↓→)
  - Show regression warnings
  - Files: `08_Evals/run_evals.py` (dashboard generation function)
  - Verify: `08_Evals/dashboard.md` is generated with correct format

- [ ] **4.2 Write eval methodology documentation**
  - Create `08_Evals/README.md` explaining:
    - How to run evals (`python run_evals.py --agent admin`)
    - How to add new eval scenarios
    - How to interpret dashboard metrics
    - How to update baseline
    - Eval methodology (what each metric means)
  - Files: `08_Evals/README.md`
  - Verify: README is clear and complete

## Phase 5: Verification

- [ ] **5.1 Run initial eval suite**
  - Execute `python run_evals.py --all`
  - Verify all 5 agents are evaluated
  - Verify metrics are collected
  - Verify dashboard is updated
  - Files: (runtime only)
  - Verify: No errors, dashboard shows scores for all agents

- [ ] **5.2 Test regression detection**
  - Manually lower one agent's score in baseline.json
  - Run evals again
  - Verify regression is flagged
  - Restore baseline
  - Files: (runtime only)
  - Verify: Regression warning appears

- [ ] **5.3 Update completion record**
  - Fill in dates in proposal.md
  - Files: `.atl/openspec/changes/eval-framework/proposal.md`
