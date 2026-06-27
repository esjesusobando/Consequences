# 🛠️ Skills — Sistema SOTA de Skills v5.0 Consequences

**Versión:** 5.0 — SOTA
**Última actualización:** 2026-06-27
**Source of Truth:** `01_Personal_Os/01_Core/02_Tools/02_Skills/`
**Framework:** Anthropic Skill Creator v2.0 + PersonalOS SOTA
**Estado:** ✅ PURE GREEN — 396 skills validadas contra filesystem (15 áreas funcionales)

> ⚠️ **Nota:** El conteo de "74 skills" del 2026-05-31 correspondía al antiguo sistema de skill-registry. El sistema actual opera con SKILL.md independientes por skill. Ver `Context_Memory.md` para desglose completo.

---

## 📂 Estructura v4.9.1 — 15 Áreas Funcionales (396 skills)

```
02_Skills/
├── 00_Agent_Teams_Lite/      ⚡ SDD Workflow System (14 fases)
├── 00_Compound_Engineering/  ⭐ Core Engineering (9 skills)
├── 00_Personal_Os/           🌱 Personal OS (9 skills)
│   ├── 01_Life_OS/             Sistema de vida personal
│   ├── 02_Personal_Os/         Core del OS
│   ├── 03_Fantasticos/         4 Fantásticos
│   ├── 04_Contexto/            Contexto del sistema
│   ├── 05_Marca/               Marca personal
│   ├── 06_Plantillas/          Templates
│   ├── 07_Hillary/             Hillary — Life OS Specialist
│   ├── 08_Learning_Always/     URL→Knowledge (legacy pipeline)
│   └── 09_Workflow_Os/         Workflow Os — pipelines ejecutables
│       ├── 01_Learning_Always/   LA — Metodología aprendizaje continuo
│       └── 02_Dynamic_Workflows/ DW — Pipeline 11 fases
│
├── 00_Skill_Auditor/         🔍 Auditoría de skills
├── 00_System_Core/           ⭐ Stack Core del OS
├── 00_Workflows/             🔄 Workflows & Orquestación (5 skills)
│   ├── 01_Agent_Teams_Lite/
│   ├── 02_Project_Manager/
│   ├── 03_Product_Manager/
│   ├── 04_PM_Orchestrator/
│   └── 05_Super_Campeones/
│
├── 01_Creacion_Contenidos/   🎨 Contenido (17 skills)
│   ├── 01-15: Brand Voice → Marketing Scripts
│   ├── 16_Imported_Packages/
│   └── 21_Content_Generation/
│
├── 02_Diseno_Ui_Ux/          🎨 UI/UX Design (16 skills)
│   ├── 01-11: Product Design → Marvel Avengers
│   ├── 12_Premium_Image_Studio/
│   ├── 13_Carousel_Master/
│   ├── 14_Video_Visuals_Producer/
│   ├── 15_Youtube_Thumbnail_Prompter/
│   └── 16_Video_Prompt_Builder/
│
├── 03_Video_Media/           🎥 Video & Media (2 skills)
│   ├── 01_Video_Intel/
│   └── 02_James_Cameron/
│
├── 04_Automatizacion/        ⚙️ Automatización (19 skills)
│   ├── 01-08: N8N JS → N8N Invictus
│   ├── 10_Firecrawl/
│   ├── 10_GWS_Client/
│   ├── 11_Gcierr/ + 11_Gws_Client/
│   ├── 13-17: Content From URL → Learning URL→Knowledge
│
├── 05_Claude_Ads/            📢 Claude Ads (9 skills)
├── 06_Tools/                 🛠️ Tools & Dev (6 skills)
│   ├── 06_Testing/
│   ├── 11_Doc_Processing/
│   ├── 12_Qmd/
│   ├── 13_System_Master/
│   ├── 14_Silicon_Valley_Data_Analyst/
│   └── 15_Ai_News_Weekly_Report/
│
├── 07_Invictus_Web/          🌐 Invictus Web (3 skills)
│   ├── 01_Superpowers/
│   ├── 02_Buscador_Skills/
│   └── 03_Playwright/
│
├── 10_Laia_Learning/         🧠 Context Engineering (4 skills)
│   ├── 01_Context_Canonical/
│   ├── 02_Prompts/
│   ├── 03_Workflows/
│   └── 04_References/
│
├── INDEX_AREA_FUNCTIONAL.md  📋 Índice navegable
├── MAPA_MIGRACION.md         🗺️ Mapa de migración (histórico)
└── README.md                  📖 Este archivo
```

---

## 🎯 Quick Reference

| Qué necesitas                                                  | Ve a                                                        |
|---------------------------------------------------------------|------------------------------------------------------------|
| Core Engineering (CE)                                          | `00_Compound_Engineering/`                                  |
| Contenido (Brand, YouTube)                                     | `01_Creacion_Contenidos/`                                   |
| UI/UX Design                                                   | `02_Diseno_Ui_Ux/`                                          |
| Video & Media                                                  | `03_Video_Media/`                                           |
| Automatización (N8N, Firecrawl)                                | `04_Automatizacion/`                                        |
| Workflows (Agent Teams, PM)                                    | `00_Workflows/`                                             |
| Tools (Testing, Qmd, System Master)                            | `06_Tools/`                                                 |
| Personal OS (Hillary, Life OS, Workflows)                      | `00_Personal_Os/`                                           |
| Aprendizaje continuo con IA                                    | `00_Personal_Os/09_Workflow_Os/01_Learning_Always/`         |
| Pipeline completo de ejecución                                 | `00_Personal_Os/09_Workflow_Os/02_Dynamic_Workflows/`       |
| Invictus Web                                                   | `07_Invictus_Web/`                                          |
| Claude Ads                                                     | `05_Claude_Ads/`                                            |
| Context Engineering & Onboarding (Laia Learning)               | `11_Laia_Learning/`                                         |

---

## 📝 Changelog

**2026-05-31:** Fix Registry + Wrapper Cleanup (SOTA 🏆)
- ✅ 8 wrapper directories flattened (Life OS, Personal OS, Fantasticos, PM Orchestrator, Video Intel, Superpowers, Buscador, Playwright)
- ✅ 9 empty skill dirs removed from registry (Area 06 — Skill Creator, Template, Harness, DevOps, Vibe, Perf, Invictus, A11y, Octopus)
- ✅ 2 .md file entries removed from registry (Workflow Orchestrator, LFG Engine)
- ✅ 5 SKILL.md files created for content-full dirs without them
- ✅ validate-registry.py fixed: Unicode-safe, skips Anthropic Area 11 (tag-only)
- ✅ Registry validator: 0 failures, 74/74 skills OK
- ✅ README structure actualizada con directorios reales
- ✅ UNIFIED_REGISTRY.md sync con estado actual
- ✅ OS Conductor counts actualizados (agents 47→67, tools 15→6)

**2026-05-30:** Workflow Os — LA + Dynamic Workflows 🆕
- ✅ Movido `11_Learning_Always` → `09_Workflow_Os/01_Learning_Always/`
- ✅ Movido `12_Dynamic_Workflows` → `09_Workflow_Os/02_Dynamic_Workflows/`
- ✅ Dynamic Workflows ahora delega cada fase a una skill específica del OS
- ✅ Actualizado OS Conductor (registry + routing)
- ✅ Eliminados directorios legacy

**2026-05-19:** Auditoría Completa v4.1
- ✅ Sincronizado con estructura real: 369 skills, 13 áreas funcionales
- ✅ Añadida área `05_Claude_Ads/` (20 items)
- ✅ Eliminada referencia a `00_Gcierr/` y `09_Legacy_Archive/` (no existen en disco)
- ✅ Consistencia total entre README, OS_DIRECTORY y skill-registry
- ✅ PURE GREEN STATE mantenido

**2026-05-03:** Auditoría Completa v3.1
- ✅ Actualización de métricas: 299 skills, 11 áreas funcionales
- ✅ Verificación de estructura y paths
- ✅ Consistencia entre README, OS_DIRECTORY y skill-registry
- ✅ PURE GREEN STATE alcanzado

**2026-04-28:** Dumbledor Design + Frontend Slides
- ✅ Nuevas skills de diseño integradas
- ✅ Sistema de scoring TOP 11 Design Skills

**2026-04-23:** Auditoría Integral v1.2
- ✅ Reconciliado duplicado 09_Marketing/ → integrado en 01_Creacion_Contenidos/
- ✅ Eliminado duplicado 09_LEGACY/ (mantenido 09_Legacy_Archive/)
- ✅ Eliminados duplicados internos (04_Content_Creation, 05_Pptx_Generator)
- ✅ Total: 369 source skills / 734 backup skills, 13 áreas canónicas

**2026-04-21:** Migración v2.0
- 59+ carpetas reorganizadas
- Sistema de naming: `Primera_Mayúscula` con `_` como separador
- Testing completo del workflow YouTube ✅

---

## 🔗 Referencias

- **Índice navegable:** `INDEX_AREA_FUNCTIONAL.md`
- **Sistema OS:** `01_Personal_Os/04_Operations/`
- **Context Memory:** `01_Personal_Os/04_Operations/00_Context_LLM/Context_Memory.md`
- **Skills globales (OpenCode):** `~/.config/opencode/skills/` — incluye `claude-seo-ai/` (SEO + AI-Search)
- **claude-seo-ai source:** https://github.com/Hainrixz/claude-seo-ai
- **Auditoría vigente:** `01_Personal_Os/04_Operations/00_Context_LLM/01_Process_Notes/40_NP_Auditoria_Completa_Estado_del_Arte_2026_06_27.md`

*PersonalOS v4.9.1 — 2026-06-27 — Audit: 396 skills, 15 áreas, claude-seo-ai integrado*
