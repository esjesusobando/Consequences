# Tasks: fix-registry-paths-v1 — Fix registry paths, sync INDEX with disk, fix TOP_20 paths, fix Conductor area count, create UNIFIED_REGISTRY

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~230 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: single-pr
400-line budget risk: Low

---

## Phase 1: Fix Area Count & Remove Duplicate

- [ ] 1.1 **`SKILL.md` line 51** — Change `"14 áreas"` → `"12 áreas"` in: *"El usuario tendría que leer 14 áreas de skills"*
- [ ] 1.2 **`registry.md`** — Remove entire ÁREA 10: SKILL AUDITOR section (lines 166-171). It's a duplicate of Area 00 #4 (`00_Skill_Auditor/`).

## Phase 2: Fix Broken Paths in registry.md (Area 05 — 7 paths)

- [ ] 2.1 **`registry.md` Area 05** — Add `00_Workflows/` prefix and fix numbering on all 7 paths:

| # | Current path (broken) | Correct path |
|---|----------------------|--------------|
| 1 | `01_Agent_Teams_Lite/` | `00_Workflows/01_Agent_Teams_Lite/` |
| 2 | `02_Project_Manager/` | `00_Workflows/02_Project_Manager/` |
| 3 | `03_Product_Manager/` | `00_Workflows/03_Product_Manager/` |
| 4 | `04_PM_Orchestrator/` | `00_Workflows/04_PM_Orchestrator/` |
| 5 | `04_Super_Campeones/` | `00_Workflows/05_Super_Campeones/` |
| 6 | `05_Workflow_Orchestrator.md` | `00_Workflows/05_Workflow_Orchestrator.md` |
| 7 | `06_LFG_Engine.md` | `00_Workflows/06_LFG_Engine.md` |

## Phase 3: Fix Broken Paths in INDEX_AREA_FUNCTIONAL.md

- [ ] 3.1 **`INDEX_AREA_FUNCTIONAL.md`** — Fix Firecrawl path: `04_Automatizacion/09_Firecrawl/` → `04_Automatizacion/10_Firecrawl/`
- [ ] 3.2 **`INDEX_AREA_FUNCTIONAL.md`** — Fix second broken path (TBD by implementer — diff against actual on-disk structure to identify)

## Phase 4: Add Missing Skills to INDEX_AREA_FUNCTIONAL.md

- [ ] 4.1 **Add 13 missing skills to Area 04 (Automatización)** — Insert after existing row `04_Automatizacion/07_N8N_Workflows/`:

| # | Skill | Path | Description |
|---|-------|------|-------------|
| 1 | N8N Nodes | `04_Automatizacion/05_N8N_Nodes/` | Configuración de nodos N8N |
| 2 | N8N Validation | `04_Automatizacion/06_N8N_Validation/` | Validación de workflows N8N |
| 3 | N8N Invictus | `04_Automatizacion/08_N8N_Invictus/` | Workflows del ecosistema Invictus |
| 4 | AI News Weekly | `04_Automatizacion/08_AI_News_Weekly/` | News semanal con IA |
| 5 | GWS Client | `04_Automatizacion/10_GWS_Client/` | Cliente Google Workspace |
| 6 | Gcierr | `04_Automatizacion/11_Gcierr/` | Herramientas Gcierr |
| 7 | (merge Gws_Client with Gcierr or add) | `04_Automatizacion/11_Gws_Client/` | (verify if duplicate) |
| 8 | Content From URL | `04_Automatizacion/13_Content_From_Url/` | Extraer contenido desde URL |
| 9 | Compound Knowledge | `04_Automatizacion/14_Compound_Knowledge/` | Conocimiento compuesto |
| 10 | N8n General | `04_Automatizacion/14_N8n/` | Skill N8N general |
| 11 | OS Self Improvement | `04_Automatizacion/15_Os_Self_Improvement/` | Auto-mejora del OS |
| 12 | Reverse Engineering | `04_Automatizacion/16_Reverse_Engineering/` | Ingeniería inversa |
| 13 | Learning URL→Knowledge | `04_Automatizacion/17_Learning_Url_To_Knowledge/` | Pipeline URL → conocimiento |

> **Note:** Implementer should deduplicate `10_GWS_Client` vs `11_Gws_Client` and `14_Compound_Knowledge` vs `14_N8n` — keep both if they have distinct SKILL.md content.

- [ ] 4.2 **Add 2 missing skills to Area 05 (Workflows)** — Add after existing row `00_Workflows/05_Workflow_Orchestrator.md`:

| # | Skill | Path | Description |
|---|-------|------|-------------|
| 1 | Super Campeones | `00_Workflows/05_Super_Campeones/` | Workflows Super Campeones |
| 2 | LFG Engine | `00_Workflows/06_LFG_Engine.md` | Motor autónomo LFG |

## Phase 5: Fix TOP_20_SKILLS.md Paths (TOP 10 sub-ranking)

- [ ] 5.1 **#3 Frontend Slides** — `02_Diseno_Ui_Ux/07_Marvel_Avengers/` → point to correct Frontend Slides path
- [ ] 5.2 **#4 Premium Image Studio** — `01_Creacion_Contenidos/11_Premium_Image_Studio/` → `02_Diseno_Ui_Ux/12_Premium_Image_Studio/`
- [ ] 5.3 **#5 Ui Ux Pro Max** — `02_Diseno_Ui_Ux/06_Ui_Ux_Pro_Max/` → `02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/`
- [ ] 5.4 **#6 Video Visuals Producer** — `01_Creacion_Contenidos/10_Video_Visuals_Producer/` → `02_Diseno_Ui_Ux/14_Video_Visuals_Producer/`
- [ ] 5.5 **#7 Carousel Master** — `01_Creacion_Contenidos/12_Carousel_Master/` → `02_Diseno_Ui_Ux/13_Carousel_Master/`
- [ ] 5.6 **#9 SEO SOTA Master** — `01_Creacion_Contenidos/13_Seo_Sota_Master/` → `01_Creacion_Contenidos/08_Seo_Sota_Master/`

## Phase 6: Create UNIFIED_REGISTRY.md

- [ ] 6.1 **Create `01_Personal_Os/01_Core/02_Tools/01_Agents/00_OS_Conductor/UNIFIED_REGISTRY.md`** — New file covering all 5 categories:
  - **Agents**: Reference to 47 agents in `01_Agents/` (Core 13 + Dream Team 5 + Specialists 24 + Growth 5)
  - **MCP Servers**: Point to `01_Core/02_Tools/03_Mcp/01_Claude_Code/`, `02_OpenCode/`, `00_Config_Mcp/`
  - **Commands**: Quick-reference commands (diagnóstico, plan, audit, etc.) mapped to their skills
  - **Hooks**: Claude Code hooks from `Engram/plugin/claude-code/hooks/hooks.json`
  - **Skills**: Link to `registry.md` as canonical skill reference (no duplication)

> File should be a concise **directory-style index** with category headers, paths, and brief descriptions for each entry — designed as the entry point for discovering ALL system components.

## Implementation Order

1. **Phase 1** first (SKILL.md + duplicate removal) — independent, changes the area count
2. **Phase 2** (registry.md paths) — independent of other fixes
3. **Phase 3 + 4** (INDEX fixes and additions) — together in one pass over the same file
4. **Phase 5** (TOP_20 paths) — independent
5. **Phase 6** (UNIFIED_REGISTRY.md creation) — depends on understanding all other files; do last

Phases 1, 2, 3/4, and 5 can be done in parallel. Phase 6 is last because it references the corrected state.
