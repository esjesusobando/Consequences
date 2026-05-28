---
name: tools
description: >
  Área de TOOLS — Skill Creator, Testing, DevOps, Development.
  Skills para creación de skills, testing, DevOps y desarrollo.
---

# 🛠️ TOOLS — Skill Creator, Testing, DevOps, Development

**Área Funcional:** 06_Tools
**Versión:** 2.0 | **Última actualización:** 2026-05-28

---

## Sub-áreas y Contenido

| N° | Sub-área                           | Descripción                     |
|----|-----------------------------------|--------------------------------|
| 01 | `01_Skill_Creator/`                | Creación de skills              |
| 02 | `02_Skill_Template/`               | Templates para skills           |
| 03 | `03_Anthropic_Harness/`            | Harness para Claude Code        |
| 04 | `04_DevOps/`                       | Operaciones DevOps              |
| 05 | `05_Vibe_Coding/`                  | Coding por vibes                |
| 06 | `06_Testing/`                      | Testing y QA                    |
| 07 | `07_Performance/`                  | Performance optimization        |
| 08 | `08_Skill_Creator_Invictus/`       | Skill creator para Invictus     |
| 09 | `09_Accessibility/`                | Accesibilidad web               |
| 10 | `10_Octopus/`                      | Octopus — Ejecución paralela    |
| 11 | `11_Doc_Processing/`               | Procesamiento de documentos     |
| 12 | `12_Qmd/`                          | Búsqueda híbrida BM25 + embed   |
| 13 | `13_System_Master/`                | System Guardian, MCP Builder    |
| 14 | `14_Silicon_Valley_Data_Analyst/`  | Data analysis, SQL, pandas      |
| 15 | `15_Ai_News_Weekly_Report/`        | News semanal con IA             |

## Consolidación

Esta área se redujo de **30 a 15** directorios (12 duplicados archivados en `05_Archive/02_Skills_Legacy/06_Tools/`).

## Octopus — Quick Reference

```
06_Tools/10_Octopus/
├── README.md           ✅
└── 00_Octopus_Skill/
    └── SKILL.md        ✅
```

## Skills Principales

| Skill              | Ubicación                       | Descripción              |
|-------------------|--------------------------------|-------------------------|
| **Octopus**        | `10_Octopus/00_Octopus_Skill/`  | Multi-brazos paralelo    |
| **System Master**  | `13_System_Master/`             | System Guardian, MCP     |
| **Skill Creator**  | `01_Skill_Creator/`             | Crear nuevas skills      |
| **Testing**        | `06_Testing/`                   | Test suites              |

## Runbook: Crear Nueva Skill

```bash
1. Copiar template de 02_Skill_Template/
2. Crear SKILL.md con frontmatter
3. Definir triggers y description
4. Agregar a skill-registry
```

## Testing

```bash
# Ejecutar tests
pytest tests/

# Coverage
pytest --cov
```

---

*Área Tools v2.0 — Consolidación 30→15 completada — 2026-05-28*
