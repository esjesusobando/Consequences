# 41_NP_Plan: Fix Documentación Activa — Conteos Factuales
**Fecha:** 2026-06-27
**Tipo:** Plan de corrección masiva de documentación
**Regla:** Los números factuales verificables contra disco se ACTUALIZAN siempre. La historia vive en Process Notes y changelog.

---

## 🔍 Alcance: Documentos con datos stale

| # | Documento | Dato Incorrecto | Dato Correcto | Prioridad |
|---|-----------|-----------------|---------------|-----------|
| 1 | `Structure_v5.0.md` (línea 41) | "63 agentes" | "74 agentes" | 🔴 Alta |
| 2 | `Structure_v5.0.md` (línea 42) | "392 skills" | "396 skills" | 🔴 Alta |
| 3 | `Structure_v5.0.md` (líneas 139-156) | Skills table con números viejos | Skills table con conteos reales 2026-06-27 | 🔴 Alta |
| 4 | `Structure_v5.0.md` (líneas 160-168) | "63 agentes" + tabla vieja | "74 agentes" + tabla real | 🔴 Alta |
| 5 | `00_Winter_is_Coming/AGENTS.md` (línea 44) | "Skills (392, 15 áreas)" | "396 skills" | 🔴 Alta |
| 6 | `00_Winter_is_Coming/AGENTS.md` (línea 46) | "Agentes (62)" | "74 agentes" | 🔴 Alta |
| 7 | `00_Winter_is_Coming/AGENTS.md` (línea 172) | "61 agentes" | "74 agentes" | 🔴 Alta |
| 8 | `00_Winter_is_Coming/AGENTS.md` (línea 173) | "392 skills" | "396 skills" | 🔴 Alta |
| 9 | `Skills/README.md` (changelog línea 120) | "74/74 skills OK" | Nota aclaratoria + dejar histórico | 🟡 Media |
| 10 | `INDEX_AREA_FUNCTIONAL.md` (línea 231) | "Skills: 392 activas" | "Skills: 396 activas" | 🟡 Media |
| 11 | `03_Agent_Catalog.yaml` (línea 11) | "source: 63" | "source: 74" | 🟡 Media |
| 12 | `04_Skill_Index.json` (línea 7) | "skills: 396" | ✅ Ya correcto — no tocar | — |
| 13 | `CLAUDE.md` (Ley #8) | "No borres información sin permiso" | Actualizar con excepción para datos factuales incorrectos | 🔴 Alta |

---

## 📋 Pasos de ejecución

### Fase 1: Fix Structure_v5.0.md (3 edits)
- [ ] 1a. Tree view: "63 agentes" → "74 agentes"
- [ ] 1b. Tree view: "392 skills" → "396 skills"
- [ ] 1c. Skills table: reemplazar con conteos reales
- [ ] 1d. Agents table: reemplazar con 9 categorías reales

### Fase 2: Fix 00_Winter_is_Coming/AGENTS.md (4 edits)
- [ ] 2a. Tabla recursos: "Skills (392" → "(396"
- [ ] 2b. Tabla recursos: "Agentes (62)" → "(74)"
- [ ] 2c. Tree view: "61 agentes" → "74 agentes"
- [ ] 2d. Tree view: "392 skills" → "396 skills"

### Fase 3: Fix Skills/README.md + INDEX + Manifest
- [ ] 3a. Skills/README.md: aclarar changelog "74/74 skills OK"
- [ ] 3b. INDEX_AREA_FUNCTIONAL.md: actualizar footer
- [ ] 3c. 03_Agent_Catalog.yaml: actualizar source count

### Fase 4: Update Rule (Ley #8)
- [ ] 4a. CLAUDE.md: Modificar Ley #8 para permitir corrección de datos factuales

### Fase 5: Documentación complementaria
- [ ] 5a. Verificar que Context_Memory.md refleje cambios
- [ ] 5b. Actualizar 40_NP con resumen de cambios aplicados
- [ ] 5c. Commit de todos los cambios

---

## 📊 Conteos reales verificados (2026-06-27)

### Agentes: 74 archivos .md

| Categoría | Count | Dir |
|-----------|-------|-----|
| Root agents | 26 | `01_Agents/` |
| Dream Team | 7 | `01_Dream_Team/` |
| Specialists Compound | 24 | `02_Specialists_Compound/` |
| Growth | 6 | `03_Growth/` |
| Contexto | 2 | `04_Contexto/` |
| Marca | 2 | `05_Marca/` |
| Plantillas | 2 | `06_Plantillas/` |
| OS Conductor | 4 | `00_OS_Conductor/` |
| Agent Teams Lite Gen | 1 | `07_Agent_Teams_Lite_Gen/` |
| **TOTAL** | **74** | |

### Skills: 396 SKILL.md

| Área | Count |
|------|-------|
| 00_Agent_Teams_Lite | 14 |
| 00_Compound_Engineering | 63 |
| 00_Personal_Os | 24 |
| 00_Skill_Auditor | 1 |
| 00_System_Core | 1 |
| 00_Workflows | 39 |
| 01_Creacion_Contenidos | 52 |
| 02_Diseno_Ui_Ux | 34 |
| 03_Video_Media | 11 |
| 04_Automatizacion | 27 |
| 05_Claude_Ads | 21 |
| 06_Tools | 83 |
| 07_Invictus_Web | 18 |
| 08_JAO | 7 |
| 10_Laia_Learning | 1 |
| **TOTAL** | **396** |

---

*Think Different PersonalOS v4.9.1 — Plan de Fix Documentación Activa — 2026-06-27*
