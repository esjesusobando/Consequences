# Plan OS Bug Fix — 2026-04-27

**Objetivo:** Solventer todas las desviaciones y bugs pendientes del PersonalOS v3.1 Consequences.
**Estado del OS al iniciar:** Pure Green (docs) — bugs reales detectados en CHANGELOG v1.9.0 + backlog.
**Prioridad acordada:** Bugs del OS primero. OIM Website (P1) queda para el final.

---

## Bugs a Resolver (en orden de ejecución)

### 1. SubagentStop — NO configurado 🔴
- **Qué:** `SubagentStop` está documentado en el sistema pero no está wired en `.claude/settings.json`
- **Dónde:** `.claude/settings.json` → sección `hooks`
- **Fix:** Verificar si existe script en `.agent/04_Extensions/hooks/03_Lifecycle/subagent_stop.py` y agregar la entrada en settings.json
- **Estado:** [ ] Pendiente

### 2. Hooks sin wirear (5/8) 🔴
- **Qué:** Los hooks `04_Sound`, `05_Harness`, `06_Post_Hulk_Compound` están documentados pero no configurados en settings.json
- **Dónde:** `.agent/04_Extensions/hooks/` + `.claude/settings.json`
- **Fix:** Auditar qué scripts existen, cuáles están wired, cuáles faltan → wirear los faltantes
- **Estado:** [ ] Pendiente

### 3. Skills sin frontmatter YAML (32 detectadas) 🟠
- **Qué:** 32 archivos SKILL.md sin bloque frontmatter YAML válido — el `18_Validate_Skill_Frontmatter.py` los detectó
- **Dónde:** `01_Personal_Os/01_Core/02_Tools/02_Skills/` (13 áreas)
- **Fix:** Correr `18_Validate_Skill_Frontmatter.py` para obtener lista exacta → agregar frontmatter a cada SKILL.md
- **Estado:** [ ] Pendiente

### 4. Pre-commit hook detectar API keys 🟡
- **Qué:** Hook de pre-commit que detecte API keys hardcodeadas en archivos staged antes de commitear
- **Dónde:** `.git/hooks/pre-commit` o via GGA
- **Fix:** Crear script de detección + instalar como pre-commit hook via GGA
- **Estado:** [ ] Pendiente

### 5. GGA — Verificar instalación real 🟡
- **Qué:** Confirmar que GGA está instalado como git hook real (no solo documentado)
- **Dónde:** `.agent/05_GGA/` + `.git/hooks/pre-commit`
- **Fix:** Correr `.agent/05_GGA/bin/gga install` si no está activo
- **Estado:** [ ] Pendiente

---

## Pendientes del Backlog (después de bugs)

### 6. OIM Website — Verificación visual 🟡 ← ÚLTIMA PRIORIDAD
- **Qué:** Levantar servidor y verificar el sitio en browser
- **Estado:** [ ] Pendiente

---

## Pendientes Fríos (P3 — post bugs)

- [ ] Automatizar generación de `04_Operations/10_Reports/` con `01_Auditor_Hub.py`
- [ ] Revisar y ejecutar Workflows Marvel (Iron Man, Vision, Thor, Hulk)
- [ ] Revisar Ritual de Cierre (`04_Ritual_Hub.py`)
- [ ] Evaluar Avengers Plan — ejecutar, actualizar o archivar
- [ ] Scripts 21, 41, 42, 62, 70 — decidir si reserva o permitir gaps
- [ ] Push a Invictus (reintentar)
- [ ] Implementar Gotchas en top 10 skills

---

## Contexto de Diagnóstico

Al iniciar esta sesión se lanzó un agente Explore sobre `01_Personal_Os` para obtener el estado REAL del filesystem (no el documentado). Los hallazgos del agente alimentarán los fixes de los ítems 1-5 anteriores.

### Issues detectados en CHANGELOG v1.9.0 (2026-04-21)

| Área | Issue | Estado |
|------|-------|--------|
| Hooks | settings.json usa `.agent/04_Extensions/hooks/` vs docs `01_Core/07_Hooks/` | 🔴 Analizar |
| Hooks | SubagentStop documentado pero NO configurado | 🔴 Fix |
| Hooks | 5/8 hooks sin wirear | 🟠 Fix |
| Agentes | Contaje inconsistente: docs vs real | 🟡 Verificar |
| MCPs | Drift: 16 faltantes en OpenCode vs Claude Code | 🟡 Monitorear |
| Naming | GGA/Gentleman/Guardian Angel sin estandarizar | 🟡 Bajo impacto |

---

## Historial de Esta Sesión

- **Diagnóstico disco:** Agente lanzado para identificar qué ocupa los 238GB del C: (resultado pendiente)
- **Exploración OS:** Agente Explore corriendo sobre `01_Personal_Os` (resultado pendiente)
- **Plan creado:** Este documento

---

*Creado: 2026-04-27 | Versión: v1.0*
*Continuar en próxima sesión: leer este archivo primero, luego revisar resultados de los agentes*
