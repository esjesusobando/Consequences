# Plan OS Bug Fix — 2026-04-27

**Objetivo:** Solventer todas las desviaciones y bugs pendientes del PersonalOS v3.1 Consequences.
**Estado del OS al iniciar:** Pure Green (docs) — bugs reales detectados en CHANGELOG v1.9.0 + backlog.
**Prioridad acordada:** Bugs del OS primero. OIM Website (P1) queda para el final.

---

## Bugs a Resolver (en orden de ejecución)

### 1. SubagentStop — NO configurado 🔴
- **Estado:** [x] ✅ RESUELTO 2026-04-27 — Wired en `.claude/settings.json`

### 2. Hooks sin wirear (5/8) 🔴
- **Estado:** [x] ✅ RESUELTO 2026-04-27
- Solo existen 4 hooks reales: PreToolUse, PostToolUse, Stop, SubagentStop — todos wired
- `04_Sound/notification.py` existe pero es un helper, no requiere wiring en settings.json

### 3. Skills sin frontmatter YAML (32 detectadas) 🟠
- **Estado:** [x] ✅ YA ESTABA RESUELTO — `22_Validate_Skill_Frontmatter.py` reporta 298 válidas / 0 inválidas

### 4. Pre-commit hook detectar API keys 🟡
- **Estado:** [x] ✅ YA EXISTÍA — `secret_scanner.py` activo en `.git/hooks/pre-commit` (verificado 2026-04-27)

### 5. GGA — Verificar instalación real 🟡
- **Estado:** [x] ✅ ACTIVO — `.git/hooks/pre-commit` instalado y funcional

### 6. Numeración HUBs duplicada 🔴 (nuevo — detectado en sesión)
- **Estado:** [x] ✅ RESUELTO 2026-04-27
- Renumerados: Agent_Sync→19, System_Mapper→20, Legacy_Cleanup→21, Validate_Frontmatter→22, Preview_Generator→23

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

| Área                 | Issue                                                                                                  | Estado                      |
|---------------------|-------------------------------------------------------------------------------------------------------|----------------------------|
| Hooks                | settings.json usa ` .agent/04_Extensions/01_Hooks/` vs docs `01_Personal_Os/01_Core/02_Tools/05_Hooks/`| 🔴 Analizar                  |
| Hooks                | SubagentStop documentado pero NO configurado                                                           | 🔴 Fix                       |
| Hooks                | 5/8 hooks sin wirear                                                                                   | 🟠 Fix                       |
| Agentes              | Contaje inconsistente: docs vs real                                                                    | 🟡 Verificar                 |
| MCPs                 | Drift: 16 faltantes en OpenCode vs Claude Code                                                         | 🟡 Monitorear                |
| Naming               | GGA/Gentleman/Guardian Angel sin estandarizar                                                          | 🟡 Bajo impacto              |

---

## Historial de Esta Sesión

- **Diagnóstico disco:** Agente lanzado para identificar qué ocupa los 238GB del C: (resultado pendiente)
- **Exploración OS:** Agente Explore corriendo sobre `01_Personal_Os` (resultado pendiente)
- **Plan creado:** Este documento

---

*Creado: 2026-04-27 | Versión: v1.0*
*Continuar en próxima sesión: leer este archivo primero, luego revisar resultados de los agentes*
