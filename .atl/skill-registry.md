# Skill Registry — Think Different PersonalOS v4.0 Production Ready

> **FUENTE DE VERDAD**: Este archivo es el registry activo. Los sub-agentes leen de aquí para obtener compact rules.
> La fuente de implementación de cada skill está en `01_Personal_Os/01_Core/02_Tools/02_Skills/`.

---

## Proyecto: Think_Different

**Versión:** 4.0 Production Ready (2026-05-10)
**Última actualización:** 2026-05-10 (v4.0 Production Ready + gentle-ai v1.26.6 + Every CE v3.7.3)

### Convenciones del Proyecto

| Convención | Patrón |
|------------|--------|
| Directorios | `XX_Nombre/` (numerados) |
| Scripts | `##_Nombre_Script.py` |
| Reportes | `01_Report_Status.md` |
| Skills | `SKILL.md` en directorios de skills |
| Backup | `.agent/` refleja `01_Personal_Os/01_Core/` |

### Estructura del OS (v4.0 Production Ready)

```
Think_Different/
├── 00_Winter_is_Coming/          # Goals, Backlog, AGENTS.md (INMUTABLE)
├── 01_Personal_Os/               # EL SISTEMA OPERATIVO
│   ├── 01_Core/                  # Motor del OS
│   │   ├── 00_Workflows_Os/      # Workflows (Personal, Marvel, Gentleman, Hillary, CE)
│   │   ├── 01_Rules/             # 10 reglas (.mdc) — FUENTE DE VERDAD
│   │   └── 02_Tools/             # Todas las herramientas
│   │       ├── 01_Agents/        # 52+ Dream Team + Specialists
│   │       ├── 02_Skills/        # 13 áreas funcionales (297+ skills)
│   │       ├── 03_Mcp/           # Config MCPs (33)
│   │       ├── 04_Integrations/  # Fireflies, Granola
│   │       ├── 05_Hooks/         # Pre/Post/Lifecycle/Sound/Harness
│   │       ├── 06_Plugins/       # Plugins OS
│   │       ├── 07_Server/        # MCP Server
│   │       ├── 08_Evals/         # Evaluadores
│   │       └── 09_Templates/     # Templates
│   ├── 02_Knowledge/             # Base de conocimiento
│   ├── 03_Task/                  # Tareas activas (singular)
│   ├── 04_Operations/            # Todo lo operativo
│   │   ├── 00_Context_LLM/       # Memoria, notas, knowledge brain
│   │   ├── 01_Auto_Improvement/  # Motor auto-mejora
│   │   ├── 02_Agent_Teams_Lite/  # SDD registry (10 skills)
│   │   ├── 03_Scripts_Os/        # 19 HUBs + 4 scripts auxiliares (23 .py totales)
│   │   └── 05_Projects/          # Proyectos activos
│   └── 05_Archive/               # Legacy, repos de referencia
├── 02_Playground/                # Zona de pruebas
├── 03_Resultado/                 # Outputs de proyectos
├── .agent/                       # Backup estratégico
└── .atl/                         # SDD Registry + openspec/
```

### SDD Configuration

| Item | Valor |
|------|-------|
| Modo | hybrid (openspec + engram) |
| Strict TDD | ❌ disabled (no test runner) |
| Config | `.atl/openspec/config.yaml` |
| Openspec root | `.atl/openspec/` |
| Engram | ✅ MCP server disponible (verificar con `engram tui`) |

### Available Skills — Sistema v4.0 (11 Áreas Funcionales + Open Design)

| # | Área Funcional | Categorías | Skills principales | Metodología | Path |
|---|---------------|------------|-------------------|-------------|------|
| **00** | ⭐ **Core Engineering** | Compound_Engineering, Personal_Os_Stack, Skill_Auditor | ce:ideate, ce:brainstorm, ce:plan, /lfg, /slfg | CE | `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Compound_Engineering/` |
| **01** | 🎨 **Creación Contenidos** | Brand_Voice, Content_Creation, SEO_SOTA_Master, Carousel_Master | social-content, paid-ads, brand-voice, content-ideation | CE | `01_Personal_Os/01_Core/02_Tools/02_Skills/01_Creacion_Contenidos/` |
| **02** | 🎨 **Diseño UI/UX** | Product_Design, Taste_Skills, Diseno_Minimalista, Marca, Excalidraw, **Huashu_Design**, **Dumbledor_Design** | taste-skill, soft-skill, minimalist-skill, redesign-skill, **huashu-design**, **dumbledor-design** | CE | `01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/` |
| **03** | 🎥 **Video Media** | Video_Intel, James_Cameron (Remotion, Audio) | youtube-analysis, video-prompt, seedance, remotion | CE | `01_Personal_Os/01_Core/02_Tools/02_Skills/03_Video_Media/` |
| **04** | ⚙️ **Automatización** | N8N_JS, N8N_Python, Firecrawl, GWS_Client | workflow-builder, webhook, automation, scraping | Automation | `01_Personal_Os/01_Core/02_Tools/02_Skills/04_Automatizacion/` |
| **05** | 🔄 **Workflows** | Agent_Teams_Lite, Project_Manager, Product_Manager, PM_Orchestrator | sdd-*, /ce:*, issue-creation, jira-epic | SDD+CE | `01_Personal_Os/01_Core/02_Tools/02_Skills/05_Workflows/` |
| **06** | 🛠️ **Tools** | Skill_Creator, Anthropic_Harness, DevOps, Testing, Doc_Processing, System_Master, Data_Analyst, Qmd | react-19, nextjs-15, pytest, playwright, docker | CE+GGA | `01_Personal_Os/01_Core/02_Tools/02_Skills/06_Tools/` |
| **07** | 🌱 **Personal OS** | Life_OS, Personal_Os, Hillary, Contexto, Rituales | quick-capture, plan-my-day, morning-standup, weekly-review | OS | `01_Personal_Os/01_Core/02_Tools/02_Skills/07_Personal_Os/` |
| **08** | 🌐 **Invictus Web** | Superpowers, Buscador_Skills, Playwright | browser-automation, search, scraping | Web | `01_Personal_Os/01_Core/02_Tools/02_Skills/08_Invictus_Web/` |
| **09** | 📦 **Legacy Archive** | Skills obsoletas | — | Archive | `01_Personal_Os/01_Core/02_Tools/02_Skills/09_Legacy_Archive/` |
| **10** | 🏆 **Open Design** (external) | Multi-Agent Design Framework | critique, tweaks, design-brief | Design OS | `05_Archive/07_Repos_Gentleman/open-design/` |

> **✅ v4.0 Production Ready:** Every CE v3.7.3 + gentle-ai v1.26.6. 300+ skills, 52 agents, 28 HUBs, 11 áreas funcionales, 28 workflows. Open Design: 62 skills + 138 design systems. Pure Green State.

### Project Conventions (AGENTS.md)

- Root AGENTS.md → GGA pre-commit hook
- Core rules → 00_Winter_is_Coming/AGENTS.md
- Code review rules: No `var`, prefer interfaces, no `any`, functional components, named exports
- HUBs → `01_Personal_Os/04_Operations/03_Scripts_Os/`

### Skill Registry Sources

- **Project-level (FUENTE):** `01_Personal_Os/01_Core/02_Tools/02_Skills/`
- **User-level skills global:** `~/.config/opencode/skills/`
- **Backup (legacy):** `.agent/02_Skills/` (estratégico, no para trabajo activo)
- **SDD Config:** `.atl/openspec/config.yaml`

> ⚠️ **CRITICAL:** Siempre usar `01_Personal_Os/01_Core/02_Tools/02_Skills/` como fuente de skills. NO usar paths antiguos como `01_Core/03_Skills/` o `.agent/02_Skills/`.

---

*PersonalOS v4.0 Production Ready — 2026-05-10. Every CE v3.7.3 + gentle-ai v1.26.6*
*Fuente de implementación: `01_Personal_Os/01_Core/02_Tools/02_Skills/`*