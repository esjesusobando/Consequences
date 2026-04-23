# Skill Registry — Think Different PersonalOS v1.2

> **FUENTE DE VERDAD**: Este archivo es el registry activo. Los sub-agentes leen de aquí para obtener compact rules.
> La fuente de implementación de cada skill está en `01_Core/03_Skills/`.

---

## Proyecto: Think_Different

**Versión:** 1.2 (Post-Auditoría 2026-04-23)
**Última actualización:** 2026-04-23

### Convenciones del Proyecto

| Convención | Patrón |
|------------|--------|
| Directorios | `XX_Nombre/` (numerados) |
| Scripts | `##_Nombre_Script.py` |
| Reportes | `01_Report_Status.md` |
| Skills | `SKILL.md` en directorios de skills |
| Backup | `.agent/` refleja `01_Core/` |

### Estructura del OS (v1.2)

```
Think_Different/
├── 00_Winter_is_Coming/    # Goals, Backlog, AGENTS.md (Orquestador)
├── 01_Core/               # Skills (20 dirs, 165+), Rules (25 .mdc), MCPs (33), Agents
│   ├── 01_Rules/          # 25 reglas (.mdc) — FUENTE DE VERDAD ✅ SYNC
│   ├── 03_Skills/         # 20 carpetas - Sistema v2.0 (9 Áreas Funcionales)
│   ├── 05_Mcp/            # 33 MCPs configurados ✅
│   └── 07_Hooks/          # Hooks del sistema
├── 02_Knowledge/          # Documentación, Research, Docs
├── 03_Tasks/              # Tareas activas (YAML frontmatter)
├── 04_Operations/         # Auto-Improvement Engine ✅ CREADO
├── 05_Archive/           # Legacy archivado
├── 06_Playground/         # Área de pruebas
├── 07_Projects/           # Proyectos activos
├── 08_Scripts_Os/         # 14 HUBs + 92 scripts legacy ✅
├── .agent/                # Backup estratégico ✅ SYNC (25 reglas)
└── .atl/                  # SDD Registry + openspec/
```

### SDD Configuration

| Item | Valor |
|------|-------|
| Modo | openspec |
| Strict TDD | ❌ disabled |
| Config | `.atl/openspec/config.yaml` |

### Available Skills — Sistema v2.0 (9 Áreas Funcionales, 22+ Categorías)

| # | Área Funcional | Categorías | Skills principales | Metodología | Path |
|---|---------------|------------|-------------------|-------------|------|
| **00** | ⭐ **Core Engineering** | Compound_Engineering, Gcierr, Personal_Os_Stack, Skill_Auditor | ce:ideate, ce:brainstorm, ce:plan, /lfg, /slfg | CE | `01_Core/03_Skills/00_Compound_Engineering/` |
| **01** | 🎨 **Creación Contenidos** | Brand_Voice, Content_Creation, Pptx_Generator, AI_Agents, Carousel_Master | social-content, paid-ads, brand-voice, content-ideation | CE | `01_Core/03_Skills/01_Creacion_Contenidos/` |
| **02** | 🎨 **Diseño UI/UX** | Product_Design, Taste_Skills, Diseno_Minimalista, Marca, Excalidraw | taste-skill, soft-skill, minimalist-skill, redesign-skill | CE | `01_Core/03_Skills/02_Diseno_Ui_Ux/` |
| **03** | 🎥 **Video Media** | Video_Intel, James_Cameron (Remotion, Audio) | youtube-analysis, video-prompt, seedance, remotion | CE | `01_Core/03_Skills/03_Video_Media/` |
| **04** | ⚙️ **Automatización** | N8N_JS, N8N_Python, Firecrawl, GWS_Client, Gcierr | workflow-builder, webhook, automation, scraping | Automation | `01_Core/03_Skills/04_Automatizacion/` |
| **05** | 🔄 **Workflows** | Agent_Teams_Lite, Project_Manager, Product_Manager, PM_Orchestrator | sdd-*, /ce:*, issue-creation, jira-epic | SDD+CE | `01_Core/03_Skills/05_Workflows/` |
| **06** | 🛠️ **Tools** | Skill_Creator, Anthropic_Harness, DevOps, Vibe_Coding, Testing | react-19, nextjs-15, pytest, playwright, docker | CE+GGA | `01_Core/03_Skills/06_Tools/` |
| **07** | 🌱 **Personal OS** | Life_OS, Personal_Os, Fantasticos, Hillary, Contexto, Marca | quick-capture, plan-my-day, morning-standup, weekly-review | OS | `01_Core/03_Skills/07_Personal_Os/` |
| **08** | 🌐 **Invictus Web** | Superpowers, Buscador_Skills, Playwright | browser-automation, search, scraping | Web | `01_Core/03_Skills/08_Invictus_Web/` |
| **09** | 📦 **Legacy Archive** | Backup | Legacy support | Legacy | `01_Core/03_Skills/09_Legacy_Archive/` |
| **10** | 📚 **Docs** | Doc_Processing (Universal_Reader, Batch, Resumen) | doc-analyzer, readme-writer, doc-formatter | CE | `01_Core/03_Skills/11_Doc_Processing/` |
| **11** | 🏆 **System** | System_Master, Mcp_Builder, Find_Skills, Google_Stitch | system-guardian, mcp-builder, observability | OS | `01_Core/03_Skills/13_System_Master/` |
| **12** | 📊 **Analytics** | Silicon_Valley_Data_Analyst | data-analysis, sql, pandas, visualization, reporting | Data | `01_Core/03_Skills/16_Silicon_Valley_Data_Analyst/` |
| **13** | 🔍 **SEO** | SEO_SOTA_Master | technical-seo, keyword-research, link-building | Marketing | `01_Core/03_Skills/17_SEO_SOTA_Master/` |
| **14** | 💾 **QMD** | Qmd | Hybrid search BM25 + embeddings | Search | `01_Core/03_Skills/27_Qmd/` |

> **🟡 NOTA:** Sistema v2.0 reorganizado en 9 Áreas Funcionales. Las categorías 00-21 ahora están agrupadas por dominio funcional.

### Project Conventions (AGENTS.md)

- Root AGENTS.md → GGA pre-commit hook
- Core rules → 00_Winter_is_Coming/AGENTS.md
- Code review rules: No `var`, prefer interfaces, no `any`, functional components, named exports

### Skill Registry Sources

- User-level: `~/.config/opencode/skills/`
- Project-level: `.agent/02_Skills/`
- SDD Config: `.atl/openspec/config.yaml`

---

*PersonalOS v1.2 — 2026-04-23. Fuente de implementación: `01_Core/03_Skills/` (Sistema v2.0)*