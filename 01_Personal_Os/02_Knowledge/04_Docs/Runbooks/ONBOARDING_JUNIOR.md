# Onboarding Junior Runbook — PersonalOS

> **Owner:** Sebastian  
> **Last Updated:** 2026-07-14  
> **Audience:** New team members joining the PersonalOS ecosystem

---

## Day 1-30 Onboarding Plan

### Week 1: Foundation (Days 1-7)

| Day | Focus | Tasks |
|-----|-------|-------|
| 1 | Environment Setup | Clone repo, install Python 3.10+, configure PERSONAL_OS_ROOT, run `python config_paths.py --validate` |
| 2 | Architecture Overview | Read `00_Winter_is_Coming/AGENTS.md`, understand the 4 core folders (Core, Memory, Knowledge, Scripts) |
| 3 | Validators | Run `python session_init_test.py --verbose`, understand each test |
| 4 | Skills System | Read `01_Personal_Os/02_Tools/02_Skills/` structure, review 2-3 skills |
| 5 | Engram & Memory | Read DISASTER_RECOVERY.md, run `engram stats`, understand memory lifecycle |
| 6 | Git Workflow | Understand commit conventions, run `python 02_Git_Hub.py` |
| 7 | First Contribution | Pick a small task from BACKLOG.md, implement with a PR |

### Week 2: Deep Dive (Days 8-14)

| Day | Focus | Tasks |
|-----|-------|-------|
| 8 | Skill Chain | Run `python skill_chain.py list`, understand chaining |
| 9 | Telemetry | Read `18_Telemetry_Hub.py`, understand metrics flow |
| 10 | System Mapper | Run `python 20_System_Mapper_Hub.py --scan` |
| 11 | Validator Hub | Explore `05_Validator/`, run parallel audit |
| 12 | Content Pipeline | Review content creation scripts |
| 13 | Agents | Read agent configs, understand agent lifecycle |
| 14 | Weekly Review | Attend weekly review, contribute observations |

### Weeks 3-4: Independence (Days 15-30)

- Pick a medium-complexity task from BACKLOG.md
- Create or modify a skill following SKILL_LIFECYCLE.md
- Write a test for your changes
- Submit PR and participate in code review
- Run full certification: `python certify_10_10.py --verbose`

---

## Key Guides

| Guide | Location | Purpose |
|-------|----------|---------|
| AGENTS.md | `00_Winter_is_Coming/AGENTS.md` | Master system rules |
| DISASTER_RECOVERY.md | `02_Knowledge/04_Docs/Runbooks/` | Emergency procedures |
| RELEASE_PROCESS.md | `02_Knowledge/04_Docs/Runbooks/` | How to ship |
| SKILL_LIFECYCLE.md | `02_Knowledge/04_Docs/Runbooks/` | Skill creation/modification |

---

## Contact Points

| Role | When to Reach Out |
|------|-------------------|
| System Owner | Architecture decisions, blockers, access requests |
| Engram | Memory/persistence issues, data questions |
| Validators | Test failures, CI/CD issues |

---

## Daily Ritual

```bash
# Morning check (2 min)
python session_init_test.py --verbose
python config_paths.py --validate

# Evening check (1 min)
python certify_10_10.py --json
```

---

## Common Pitfalls

1. **Wrong ROOT_DIR** — Always use `PERSONAL_OS_ROOT` env var, never hardcode paths
2. **Forgetting encoding** — Every `.py` file needs the Windows UTF-8 wrapper
3. **Skipping validation** — Always run validators before committing
4. **Not reading specs** — Read the spec before implementing any feature
