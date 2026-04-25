# 🛠️ 03_Skills — Sistema SOTA de Skills

**Versión:** 2.0 (Areas Funcionales)
**Última actualización:** 2026-04-23
**Source of Truth:** `01_Personal_Os/01_Core/02_Tools/02_Skills/`
**Framework:** Anthropic Skill Creator v2.0 + PersonalOS SOTA
**Estado:** ✅ POST-AUDITORÍA 2026-04-23

---

## 📂 Estructura v2.0 — Áreas Funcionales (Actualizada)

```
03_Skills/
├── 00_Compound_Engineering/    ⭐ Core Engineering (CE)
├── 00_Gcierr/                 ⭐ Gcierr integration
├── 00_Personal_Os_Stack/      ⭐ Stack Core
├── 00_Skill_Auditor/          ⭐ Auditoría de skills
│
├── 01_Creacion_Contenidos/    🎨 Contenido (22 items)
│   ├── 01_Brand_Voice/
│   ├── 02_Content_Creation/
│   ├── 03_Pptx_Generator/
│   ├── 06_Ai_Agents/
│   ├── 07_Content_Ideation/
│   ├── 08_Offer_And_Bio_Writer/
│   ├── 10_Content_Transformer.md
│   ├── 11_Youtube_Script_Writer.md
│   ├── 12_Thumbnail_Prompter.md
│   ├── 13_Title_Generator.md
│   ├── 14_Youtube_Full_Video.md
│   ├── 15_Marketing_Strategy/       # Movido desde 09_Marketing/
│   ├── 16_Marketing_Tech/          # Movido desde 09_Marketing/
│   ├── 17_Compound_Engine/         # Movido desde 09_Marketing/
│   ├── 18_Premium_Image_Studio/   # Movido desde 09_Marketing/
│   ├── 19_Video_Visuals_Producer/  # Movido desde 09_Marketing/
│   ├── 20_Remotion_Video_Creator/ # Movido desde 09_Marketing/
│   ├── 21_Remotion_Best_Practices/ # Movido desde 09_Marketing/
│   └── 22_Marketing_Scripts/       # Movido desde 09_Marketing/
│
├── 02_Diseno_Ui_Ux/          🎨 UI/UX Design
│   ├── 01_Product_Design/
│   ├── 03_Taste_Skills/
│   ├── 04_Diseno_Minimalista/
│   ├── 05_Directrices_Marca/
│   ├── 06_Excalidraw_Flowchart/
│   └── 14_UI_UX_Pro_Max/
│
├── 03_Video_Media/            🎥 Video & Media
│   └── 01_Video_Intel/
│
├── 04_Automatizacion/         ⚙️ Automation (N8N, Firecrawl)
│   ├── 01_N8N_JS/
│   ├── 02_N8N_Python/
│   ├── 03_N8N_Expressions/
│   ├── 04_N8N_MCP/
│   ├── 05_N8N_Nodes/
│   ├── 06_N8N_Validation/
│   ├── 07_N8N_Workflows/
│   ├── 08_N8N_Invictus/
│   ├── 09_Firecrawl/
│   ├── 10_GWS_Client/
│   └── 12_N8N/
│
├── 05_Workflows/              🔄 Workflows & Orchestration
│   ├── 01_Agent_Teams_Lite/
│   ├── 02_Project_Manager/
│   ├── 03_Product_Manager/
│   ├── 04_PM_Orchestrator/
│   ├── 05_Workflow_Orchestrator.md
│   └── 06_LFG_Engine.md
│
├── 06_Tools/                  🛠️ Tools & Dev
│   ├── 01_Skill_Creator/
│   ├── 02_Skill_Template/
│   ├── 03_Anthropic_Harness/
│   ├── 04_DevOps/
│   ├── 05_Vibe_Coding/
│   ├── 06_Testing/
│   ├── 07_Skill_Creator_Invictus/
│   └── 08_Octopus/
│
├── 07_Personal_Os/            🌱 Personal OS
│   ├── 01_Life_OS/
│   ├── 02_Personal_Os/
│   ├── 03_Fantasticos/
│   ├── 04_Hillary.md
│   ├── 05_Contexto/
│   ├── 06_Marca/
│   └── 07_Plantillas/
│
├── 08_Invictus_Web/           🌐 Invictus Web
│   ├── 01_Superpowers/
│   ├── 02_Buscador_Skills/
│   └── 03_Playwright/
│
├── 09_Legacy_Archive/         📦 Legacy Archive
│   └── 01_Backup/
│
├── 11_Doc_Processing/         📚 Docs
├── 13_System_Master/          🏆 System Master
├── 16_Silicon_Valley_Data_Analyst/ 📊 Analytics
├── 17_SEO_SOTA_Master/       🔍 SEO
├── 20_James_Cameron/          🎬 Video Production
├── 27_Qmd/                   💾 QMD Search
├── 28_Carousel_Master/       🎠 Carruseles
│
├── INDEX_AREA_FUNCTIONAL.md   📋 Índice navegable
├── MAPA_MIGRACION.md         🗺️ Mapa de migración
└── README.md                  📖 Este archivo
```

---

## 🎯 Quick Reference

| Qué necesitas                             | Ve a                                   |
|-------------------------------------------|----------------------------------------|
| Core Engineering (CE)                     | `00_Compound_Engineering/`             |
| Contenido (Brand, YouTube)                | `01_Creacion_Contenidos/`              |
| UI/UX Design                              | `02_Diseno_Ui_Ux/`                     |
| Video & Media                             | `03_Video_Media/`                      |
| Automatización (N8N, Firecrawl)           | `04_Automatizacion/`                   |
| Workflows (Agent Teams, PM)               | `05_Workflows/`                        |
| Tools (Testing, DevOps)                   | `06_Tools/`                            |
| Personal OS (Hillary, Life OS)            | `07_Personal_Os/`                      |
| Legacy                                    | `09_Legacy_Archive/`                   |

---

## 📝 Changelog

**2026-04-23:** Auditoría Integral v1.2
- ✅ Reconciliado duplicado 09_Marketing/ → integrado en 01_Creacion_Contenidos/
- ✅ Eliminado duplicado 09_LEGACY/ (mantenido 09_Legacy_Archive/)
- ✅ Eliminados duplicados internos (04_Content_Creation, 05_Pptx_Generator)
- ✅ Total: 165+ skills, 22 categorías, 9 áreas funcionales

**2026-04-21:** Migración v2.0
- 59+ carpetas reorganizadas
- Sistema de naming: `Primera_Mayúscula` con `_` como separador
- Testing completo del workflow YouTube ✅

---

## 🔗 Referencias

- **Índice navegable:** `INDEX_AREA_FUNCTIONAL.md`
- **Mapa de migración:** `MAPA_MIGRACION.md`
- **Sistema OS:** `04_Operations/01_Auto_Improvement/`
- **Auditoría:** `04_Operations/01_Auto_Improvement/AUDITORIA_2026-04-23.md`
