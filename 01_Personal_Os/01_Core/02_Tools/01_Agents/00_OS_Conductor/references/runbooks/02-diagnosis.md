# 🩺 Runbook: Diagnóstico del OS

> **Propósito:** Evaluar la salud general del PersonalOS a través del Conductor.
> **Cuándo ejecutar:** Cuando el usuario pide "diagnóstico del OS", "qué tan sano está el sistema", "auditar skills", o ante comportamientos erráticos.

---

## 📊 Checklist de Diagnóstico

### 1. Registry Health
- [ ] `registry.md` existe y está actualizado
- [ ] Todas las skills referenciadas existen en disco
- [ ] Correr: `python scripts/validate-registry.py`
- [ ] NO hay skills huérfanas (referenciadas pero no existentes)

### 2. Skills Sanity
- [ ] Skills críticas tienen SKILL.md (`00_System_Core`, `10_Skill_Auditor`)
- [ ] Skills > 500 líneas tienen `references/` folder
- [ ] No hay skills duplicadas (mismo nombre en paths diferentes)

### 3. Auditoría SOTA v5.1
- [ ] Skills core pasan auditoría con score >70%
- [ ] Skills críticas tienen Gotchas section
- [ ] Skills críticas tienen Esencia Original
- [ ] Skills nuevas cumplen estándar Anthropic

### 4. OS Structure
- [ ] `01_Core/02_Tools/01_Agents/` tiene README actualizado
- [ ] `01_Core/02_Tools/02_Skills/` no tiene directorios rotos
- [ ] Archivos legacy (v4.0) están marcados como históricos

---

## 🔬 Procedimiento de Diagnosis

```
1. Registry check
   ─ python scripts/validate-registry.py
   ─ ¿Errores? → Skills faltantes → listar para recrear

2. Skills core check
   ─ Leer SKILL.md de 00_System_Core
   ─ Leer SKILL.md de 10_Skill_Auditor
   ─ Ambos deben existir y tener version explícita

3. Meta-check: auditoría de skills
   ─ Invocar 10_Skill_Auditor sobre skills core
   ─ Score < 70% → requiere fixes

4. Histórico check
   ─ ¿Hay archivos de Orchestrator v4.0?
   ─ Deben estar marcados como [LEGACY v4.0]
   ─ No deben tener rutas activas desde ningún flujo
```

---

## 📋 Report Template

```
🩺 OS DIAGNOSIS REPORT
=======================
Date: [fecha]
Registry health: ✅ / ⚠️ / ❌
Skills validated: [N] / [N]
Core skills audit: [score]%
Legacy artifacts: [N] found
Overall health: [GREEN / YELLOW / RED]

Issues found:
- [issue 1]
- [issue 2]

Recommended actions:
- [action 1]
- [action 2]
```

---

## 🚨 Escalation Thresholds

| Health  | Score                    | Action                           |
|--------|-------------------------|---------------------------------|
| 🟢 GREEN | Todo OK                  | Report and continue              |
| 🟡 YELLOW| 1-2 issues non-critical  | Report, suggest fixes            |
| 🔴 RED   | 3+ issues or any critical| Escalate to user, stop automation|

---

## 📚 Referencias

- Registry validator: `scripts/validate-registry.py`
- Skill auditor: `10_Skill_Auditor` (in `02_Skills/`)
- SOTA v5.1 standards: `02_Skills/10_Skill_Auditor/SKILL.md`

---

*OS Conductor v2.0 — PersonalOS v4.9 — 2026-05-28*
