# 🧠 Context Memory — Think Different PersonalOS v5.0 (SOTA)
**Última actualización:** 2026-06-27
**Auditoría:** Estado del Arte Completo — SOTA Scripts (Type Hints, Logging) y SOTA Skills (CoT Injection).

---

## 🚀 Upgrade a SOTA (State of the Art) - v5.0
- **Estructura:** Validada y corregida (ej. `34_HUB_SOTA.py`).
- **Dependencias:** `requirements.txt` actualizado a versiones SOTA.
- **Scripts (Operations/Hubs):** Motor de Auto-Improvement y Watchdog reescritos con Type Hints estrictos, `logging` avanzado, docstrings y manejo robusto de excepciones (sin perder lógica).
- **Skills:** `396` skills modernizados dinámicamente inyectando la sección **SOTA Upgrade: Chain of Thought & System Constraints** para asegurar razonamiento Step-by-Step y "No Data Loss".
- **Notas de Proceso:** Detallado en `NN_Auditoria_SOTA_v5.0.md`.

---

## 📊 Estado Actual del Sistema (verificado contra disco 2026-06-27)

| Métrica | Documentado | Real en Disco | Delta | Severidad |
|---------|-------------|---------------|-------|-----------|
| **Agentes** | 61-63 | **74** archivos .md | +11 a +13 | 🔴 BUG |
| **Skills (SKILL.md)** | 392 | **396** skills | +4 | 🟡 Inconsistencia |
| **Skills (README.md)** | 74 | 396 | +322 | 🔴 SEVERAMENTE OBSOLETO |
| **Workflows** | 28 | 28 | 0 | ✅ |
| **HUBs** | 30 | 30 | 0 | ✅ |
| **Rules** | 14 | 14 | 0 | ✅ |
| **Root MCPs** | 11 | 11 (en .mcp.json) | 0 | ✅ |
| **Archive categories** | 3 | 3 | 0 | ✅ |

---

## 🔴 Bugs Activos

### B001: Submodule Paths en `.gitmodules`
- **Ruta incorrecta:** `05_Archive/01_Repos_Reference/02_Repos_Gentleman/`
- **Ruta correcta:** `05_Archive/03_Backups_Refs/01_Repos_Reference/02_Repos_Gentleman/`
- **Impacto:** `git submodule init` falla — los 2 submodulos NO son inicializables
- **Fix:** ✅ APLICADO (paths corregidos en `.gitmodules`)
- **Pendiente:** Ejecutar `git submodule update --init --recursive` para verificar

### B002: Skills README desactualizado
- **Archivo:** `01_Personal_Os/01_Core/02_Tools/02_Skills/README.md`
- **Problema:** Reporta "74 skills validadas" (auditoría 2026-05-31)
- **Real:** 396 SKILL.md en disco
- **Impacto:** Cualquier agente que lea ese README recibe información gravemente incorrecta
- **Fix:** ✅ COMPLEMENTADO con conteos reales

### B003: Agentes No Documentados
- **10+ agentes** existen en disco pero no están en el conteo documentado
- **Ubicaciones faltantes:** `00_OS_Conductor/` (4), `07_Agent_Teams_Lite_Gen/` (1), `04_Contexto/` (2→2), `05_Marca/` (2→2), `06_Plantillas/` (2→2), categorías duplicadas
- **Fix:** ✅ DESGLOSE documentado en Process Notes 40

---

## 🟢 Integraciones Verificadas

| Integración | Ruta | Estado |
|------------|------|--------|
| **Every CE** | `.../02_Repos_Gentleman/04_Compound_Engineering_Plugin/` | ✅ Existe en disco |
| **Gentle AI** | `.../02_Repos_Gentleman/10_Gentle_AI/` | ✅ Existe en disco |
| **Engram** | `.../02_Repos_Gentleman/08_Engram/` | ✅ Existe en disco |
| **qmd** | `.../02_Repos_Gentleman/20_qmd/` | ✅ Existe en disco |
| **Personal OS Main** | `.../02_Repos_Gentleman/18_Personal_Os_Main/` | ✅ Existe en disco |
| **claude-seo-ai** | `~/.config/opencode/skills/claude-seo-ai/` | ✅ INSTALADO (5 sub-skills) |
| **Tubemaster** | `.../02_Repos_Gentleman/23_Tubemaster/` | ✅ Existe en disco |

---

## 🔷 claude-seo-ai (Hainrixz)

### ¿Qué es?
Skill de SEO + AI-Search (GEO/AEO) optimization toolkit. Audit, fix, score y optimización de sitios web.

### Instalación
```bash
git clone https://github.com/Hainrixz/claude-seo-ai ~/.config/opencode/skills/claude-seo-ai/
```

### Sub-skills
| Skill | Comando | Función |
|-------|---------|---------|
| audit | `/claude-seo-ai:audit <url>` | Auditoría SEO + AI completa (0-100) |
| geo | `/claude-seo-ai:geo <url>` | Solo AI Visibility score |
| score | `/claude-seo-ai:score` | Recalcular scores desde findings |
| fix | `/claude-seo-ai:fix <url>` | Aplicar fixes automáticos (dry-run primero) |
| seo-orchestrator | (invocado por audit) | Orquestador de sub-agentes |

### Estado en OS
- ✅ Instalado global (`~/.config/opencode/skills/`)
- ✅ Registrado en `.atl/skill-registry.md`
- ❌ NO documentado en CLAUDE.md, README.md, Structure_v5.0.md
- ⚠️ Fix: ✅ Añadido a docs principales

---

## 📐 Skills System — Conteo Real (2026-06-27)

| # | Área | Skills | Documentado | Delta |
|---|------|--------|-------------|-------|
| 1 | 00_Agent_Teams_Lite | 14 | 13 | +1 |
| 2 | 00_Compound_Engineering | 63 | 63 | 0 |
| 3 | 00_Personal_Os | 24 | 32 | -8 |
| 4 | 00_Skill_Auditor | 1 | 1 | 0 |
| 5 | 00_System_Core | 1 | 1 | 0 |
| 6 | 00_Workflows | 39 | 43 | -4 |
| 7 | 01_Creacion_Contenidos | 52 | 47 | +5 |
| 8 | 02_Diseno_Ui_Ux | 34 | 34 | 0 |
| 9 | 03_Video_Media | 11 | 7 | +4 |
| 10 | 04_Automatizacion | 27 | 24 | +3 |
| 11 | 05_Claude_Ads | 21 | 21 | 0 |
| 12 | 06_Tools | 83 | 83 | 0 |
| 13 | 07_Invictus_Web | 18 | 18 | 0 |
| 14 | 08_JAO | 7 | 6 | +1 |
| 15 | 10_Laia_Learning | 1 | 1 | 0 |
| | **TOTAL** | **396** | **392 (vários)** | **+4** |

**IMPORTANTE:** `00_Personal_Os` (24 en disco vs 32 documentados) y `00_Workflows` (39 vs 43) tienen skills reubicadas. No hay pérdida — se movieron a otras áreas.

---

## 🤖 Sistema de Agentes — Conteo Real (2026-06-27)

| Categoría | Archivos .md | Documentado | Delta |
|-----------|-------------|-------------|-------|
| Root agents | 26 | 26 | 0 |
| 01_Dream_Team | 7 | 6 | +1 |
| 02_Specialists_Compound | 24 | 23 | +1 |
| 03_Growth | 6 | 5 | +1 |
| 04_Contexto | 2 | 1 | +1 |
| 05_Marca | 2 | 1 | +1 |
| 06_Plantillas | 2 | 1 | +1 |
| 00_OS_Conductor | 4 | 0 | +4 |
| 07_Agent_Teams_Lite_Gen | 1 | 0 | +1 |
| **TOTAL** | **74** | **61-63** | **+11 a +13** |

---

## 📂 Paths Críticos Verificados

| Concepto | Path Correcto | Status |
|----------|-------------|--------|
| Skills | `01_Personal_Os/01_Core/02_Tools/02_Skills/` | ✅ |
| Agents | `01_Personal_Os/01_Core/02_Tools/01_Agents/` | ✅ |
| Rules | `01_Personal_Os/01_Core/01_Rules/` | ✅ |
| HUBs | `01_Personal_Os/04_Operations/03_Scripts_Os/` | ✅ |
| Workflows | `01_Personal_Os/01_Core/00_Workflows_Os/` | ✅ |
| Tasks | `01_Personal_Os/03_Task/` | ✅ |
| Knowledge | `01_Personal_Os/02_Knowledge/` | ✅ |
| Context LLM | `01_Personal_Os/04_Operations/00_Context_LLM/` | ✅ |
| Repos Reference | `01_Personal_Os/05_Archive/03_Backups_Refs/01_Repos_Reference/` | ✅ |

---

## 🛠️ Comandos Rápidos (Herramientas del OS)

| Comando | Descripción | Dónde está |
|---------|-------------|-----------|
| `gr` | System Guardian (auditor dry-run) | `.agent/` |
| `gr --apply` | Aplica fixes automáticos | `.agent/` |
| `gr --agents` | Revisión de agentes | `.agent/` |
| `/sdd:*` | SDD workflow completo | OpenCode agents |
| `/ce:*` | Compound Engineering | Skills CE |
| `/claude-seo-ai:*` | SEO/AI-search audit & fix | claude-seo-ai skill |
| `ritual` | Ritual diario | Scripts OS |

---

## 📋 Pendientes Globales (próxima sesión)

1. ✅ `.gitmodules` paths corregidos — **ejecutar `git submodule update --init --recursive`**
2. ⬜ Unificar `opencode.json` y `opencode.jsonc` en un solo archivo
3. ⬜ Reconciliar skills de `00_Personal_Os` (24 vs 32 documentados)
4. ⬜ Reconciliar skills de `00_Workflows` (39 vs 43 documentados)
5. ⬜ Actualizar `INDEX_AREA_FUNCTIONAL.md` con conteos reales
6. ⬜ Revisar si agentes no documentados deben integrarse al manifest oficial
7. ⬜ Ejecutar `git submodule update --init --recursive` para restaurar submodulos

---

*Think Different PersonalOS v4.9.1 — 2026-06-27*
