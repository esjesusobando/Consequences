# Skill Registry — Think Different PersonalOS v1.0

> **FUENTE DE VERDAD**: Este archivo es el registry activo. Los sub-agentes leen de aquí para obtener compact rules.
> La fuente de implementación de cada skill está en `01_Core/03_Skills/`.

---

## Proyecto: Think_Different

**Versión:** 1.0
**Última actualización:** 2026-04-18

### Convenciones del Proyecto

| Convención | Patrón |
|------------|--------|
| Directorios | `XX_Nombre/` (numerados) |
| Scripts | `##_Nombre_Script.py` |
| Reportes | `01_Report_Status.md` |
| Skills | `SKILL.md` en directorios de skills |
| Backup | `.agent/` refleja `01_Core/` |

### Estructura del OS (v1.0)

```
Think_Different/
├── 00_Winter_is_Coming/    # Goals, Backlog, AGENTS.md (Orchestrator Manifest)
├── 01_Core/               # Skills (22 cats), Rules (24), MCPs (36), Agents (71)
│   ├── 01_Rules/          # 24 reglas (.mdc) — fuente de verdad
│   ├── 03_Skills/         # 22 categorías de skills (24 dirs con SKILL.md)
│   ├── 05_Mcp/            # Configuración MCP + MCP_CATALOG.md
│   └── 07_Hooks/          # Hooks sistema (Pre/Post/Lifecycle/Sound/Harness)
├── 02_Knowledge/          # Documentación + Audit v1.0
├── 03_Tasks/              # Tareas activas con YAML frontmatter
├── 04_Operations/         # Auto-Improvement Engine (detector→analyzer→executor→learner)
├── 06_Playground/         # Área de pruebas
├── 07_Projects/           # 8 proyectos históricos
├── 08_Scripts_Os/         # 14 HUBs + HUB_CATALOG.md
├── .agent/                # Backup estratégico (71 agentes, 24 reglas, GGA)
└── .atl/                  # SDD Registry (este archivo) + openspec/
```

### SDD Configuration

| Item | Valor |
|------|-------|
| Modo | openspec |
| Strict TDD | ❌ disabled |
| Config | `.atl/openspec/config.yaml` |

### Available Skills — 22 Categorías (v1.0)

| # | Categoría | Skills principales | Metodología | Path |
|---|-----------|-------------------|-------------|------|
| 00 | **Skill_Auditor** | skill-audit, quality-check | CE | `01_Core/03_Skills/00_Skill_Auditor/` |
| 00 | **Compound_Engineering** | ce:ideate, ce:brainstorm, ce:plan, ce:work, ce:review, ce:compound, /lfg, /slfg | CE | `01_Core/03_Skills/00_Compound_Engineering/` |
| 00 | **Personal_Os_Stack** | OS core workflows | OS | `01_Core/03_Skills/00_Personal_Os_Stack/` |
| 01 | **Agent_Teams_Lite** | sdd-init, sdd-explore, sdd-propose, sdd-spec, sdd-design, sdd-tasks, sdd-apply, sdd-verify, sdd-archive | SDD | `01_Core/03_Skills/01_Agent_Teams_Lite/` |
| 02 | **Project_Manager** | issue-creation, branch-pr, brainstorming, writing-plans, jira-epic, jira-task | SDD+CE | `01_Core/03_Skills/02_Project_Manager/` |
| 03 | **Product_Manager** | prd, user-stories, roadmap, okrs | SDD | `01_Core/03_Skills/03_Product_Manager/` |
| 04 | **Product_Design** | taste-skill, soft-skill, minimalist-skill, redesign-skill, output-skill, pencil | CE | `01_Core/03_Skills/04_Product_Design/` |
| 05 | **Vibe_Coding** | react-19, nextjs-15, tailwind-4, zod-4, zustand-5, angular, typescript, django-drf | CE | `01_Core/03_Skills/05_Vibe_Coding/` |
| 06 | **Testing** | pytest, playwright, tdd-test-first, security-review, pr-review, go-testing | GGA+CE | `01_Core/03_Skills/06_Testing/` |
| 07 | **DevOps** | docker, vercel, ci-cd, sentry, github-actions | CE | `01_Core/03_Skills/07_DevOps/` |
| 08 | **Personal_Os** | morning-standup, planning, recap, weekly-review, backlog-processing | OS | `01_Core/03_Skills/08_Personal_Os/` |
| 09 | **Marketing** | social-content, paid-ads, seo-audit, programmatic-seo, brand-voice, content-ideation | CE | `01_Core/03_Skills/09_Marketing/` |
| 10 | **Backup** | Legacy support | Legacy | `01_Core/03_Skills/10_Backup/` |
| 11 | **Doc_Processing** | doc-analyzer, readme-writer, doc-formatter | CE | `01_Core/03_Skills/11_Doc_Processing/` |
| 12 | **N8N** | workflow-builder, webhook, automation, trigger | Automation | `01_Core/03_Skills/12_N8N/` |
| 13 | **System_Master** | system-guardian, mcp-builder, observability | OS | `01_Core/03_Skills/13_System_Master/` |
| 14 | **Anthropic_Harness** | evaluators, harness, batch-testing, prompt-caching | Evaluators | `01_Core/03_Skills/14_Anthropic_Harness/` |
| 15 | **Skill_Creator_Oficial** | skill-creator-v2, skill-template, skill-auditor | Meta | `01_Core/03_Skills/15_Skill_Creator_Oficial/` |
| 16 | **Silicon_Valley_Data_Analyst** | data-analysis, sql, pandas, visualization, reporting | Data | `01_Core/03_Skills/16_Silicon_Valley_Data_Analyst/` |
| 17 | **SEO_SOTA_Master** | technical-seo, keyword-research, link-building, on-page | Marketing | `01_Core/03_Skills/17_SEO_SOTA_Master/` |
| 18 | **Personal_Life_OS** | quick-capture, plan-my-day, daily-notes, recording-mode, returns-tracker | Life OS | `01_Core/03_Skills/18_Personal_Life_OS/` |
| 19 | **Video_Intel** | youtube-analysis, video-research, github-intel | CE | `01_Core/03_Skills/19_Video_Intel/` |
| 20 | **James_Cameron** | video-prompt, seedance, remotion, browser-animation, audio-engine | Video | `01_Core/03_Skills/20_James_Cameron/` |
| 21 | **Skill_Template** | Template oficial para nuevos skills | Meta | `01_Core/03_Skills/21_Skill_Template/` |

### Project Conventions (AGENTS.md)

- Root AGENTS.md → GGA pre-commit hook
- Core rules → 00_Winter_is_Coming/AGENTS.md
- Code review rules: No `var`, prefer interfaces, no `any`, functional components, named exports

### Skill Registry Sources

- User-level: `~/.config/opencode/skills/`
- Project-level: `.agent/02_Skills/`
- SDD Config: `.atl/openspec/config.yaml`

---

*PersonalOS v1.0 — 2026-04-18. Fuente de implementación: `01_Core/03_Skills/`*