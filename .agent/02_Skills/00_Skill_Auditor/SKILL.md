---
name: skill-auditor
description: Audit and validate skills against Anthropic SOTA standards. Triggers on: audit skills, validate skills, check skills quality, skill review, skill health check, skill compliance, audit skill structure.
---

# Skill Auditor

> **Level**: System Critical — Quality Guardian

Audita skills contra los estándares **Anthropic SOTA v5.1** + **Skill Creator v2.0** de PersonalOS.

---

## When to Use This Skill

- Después de crear/modificar una skill
- Revisión semanal de skills
- Antes de hacer commit
- Cuando una skill no funciona
- Para auditar skills antes de集成 al OS
- Verificar compliance con estándares PersonalOS

---

## Esencia Original

> **Metaskill**: La skill que audita otras skills para asegurar calidad, consistencia y estándares Anthropic.

Esta skill es el **guardián de calidad** del PersonalOS. Sin ella, skills de baja calidad degradan la experiencia del usuario y del agente.

---

## 📊 Criterios de Auditoría (SOTA v5.1)

### 1. YAML Frontmatter (REQUIRED)

| Campo                                          | Requisito                                                                  | Validación                                                                 |
|-----------------------------------------------|---------------------------------------------------------------------------|---------------------------------------------------------------------------|
| `name`                                         | Max 64 chars, lowercase, números, guiones                                  | Regex: `^[a-z0-9-]+$`                                                      |
| `name`                                         | Formato gerund (verb + -ing)                                               | Ej: `processing-pdfs`, `onboarding-agent`                                  |
| `name`                                         | PROHIBIDO: "claude", "anthropic"                                           | No puede contener estas palabras                                           |
| `description`                                  | Max 1024 caracteres                                                        | Longitud válida                                                            |
| `description`                                  | Debe incluir triggers semánticos                                           | "triggers on:" presente                                                    |

### 2. Progressive Disclosure

| Criterio                                            | Límite                                                              | Notas                                                       |
|----------------------------------------------------|--------------------------------------------------------------------|------------------------------------------------------------|
| SKILL.md líneas                                     | < 200 ideal, < 500 max                                              | Contar líneas reales                                        |
| 02_References/ existe                               | Requerido si SKILL.md > 200 líneas                                  | Para docs pesadas                                           |
| 01_Scripts/ existe                                  | Opcional                                                            | Si hay código reutilizable                                  |
| assets/ existe                                      | Opcional                                                            | Si hay templates                                            |

### 3. Gotchas Section (REQUIRED)

| Criterio                                          | Requisito                                                                 |
|--------------------------------------------------|--------------------------------------------------------------------------|
| Sección presente                                  | "## ⚠️ Gotchas" o "## Gotchas"                                            |
| Mínimo errors                                     | 3 errores documentados                                                    |
| Estructura                                        | Cada gotcha tiene "Por qué" + "Solución"                                  |
| Específicos                                       | No genéricos, específicos a esta skill                                    |

### 4. Esencia Original (REQUIRED)

| Criterio                                               | Requisito                                                                 |
|-------------------------------------------------------|--------------------------------------------------------------------------|
| Sección presente                                       | "## Esencia Original"                                                     |
| Propósito claro                                        | Define el propósito original de la skill                                  |
| Metaskill documentada                                  | Explica qué problema resuelve                                             |

### 5. State Persistence (RECOMMENDED)

| Criterio                                             | Requisito                                                              |
|-----------------------------------------------------|-----------------------------------------------------------------------|
| Mentioned                                            | Referencia a dónde guardar estado                                      |
| Location específica                                  | `${CLAUDE_PLUGIN_DATA}` o ruta válida                                  |

### 6. v2.0 Features (OPTIONAL para SOTA)

| Feature                                            | Cuando aplica                                                       |
|---------------------------------------------------|--------------------------------------------------------------------|
| evals.json                                         | Skills que usan Skill Creator v2.0                                  |
| Benchmark results                                  | Skills críticas del OS                                              |
| agents/ folder                                     | Si tiene subagentes                                                 |

---

## 🚨 Errores Comunes a Evitar

### ERROR 1: Description Marketing
- **Por qué**: No le dice al modelo cuándo activar la skill
- **Solución**: Incluir triggers semánticos: `triggers on: keyword1, keyword2`

### ERROR 2: SKILL.md Excesivo
- **Por qué**: Satura el context window, peor rendimiento
- **Solución**: Usar `references/` para docs > 200 líneas

### ERROR 3: Sin Gotchas
- **Por qué**: La skill no aprende de errores previos
- **Solución**: Documentar mínimo 3 errores con "Por qué" y "Solución"

### ERROR 4: Gotchas Genéricas
- **Por qué**: Errores como "don't make mistakes" no aportan valor
- **Solución**: Ser específico: "Don't skip error handling in API calls"

### ERROR 5: name con Mayúsculas
- **Por qué**: Rompe YAML parsing en algunos sistemas
- **Solución**: Usar siempre lowercase: `skill-name`, no `SkillName`

### ERROR 6: Sin Esencia Original
- **Por qué**: Sin ella, la skill pierde su propósito original
- **Solución**: Documentar "## Esencia Original" al inicio

---

## 📁 Progressive Disclosure

> Para información detallada:

- [02_References/audit-criteria.md](02_References/audit-criteria.md) — Checklist completo de auditoría
- [02_References/anthropic-standards.md](02_References/anthropic-standards.md) — Estándares Anthropic originales
- [SOTA v5.1 — Skill Creator](../06_Tools/03_Skill_Creator/01_References/anthropic-standards.md) — Documento SOTA v5.1

---

## 🛠️ Scripts de Auditoría

| Script                                                                                      | Propósito                                                                   |
|--------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| [01_Scripts/audit-skills.py](01_Scripts/audit-skills.py)                                    | Analiza todas las skills en un directorio                                   |
| [01_Scripts/validate-essence.py](01_Scripts/validate-essence.py)                            | Verifica esencia original preservada                                        |
| [01_Scripts/fix-missing.py](01_Scripts/fix-missing.py)                                      | Corrige archivos faltantes automáticamente                                  |

---

## Flujo de Auditoría

```
1. EJECUTAR: audit-skills.py → Analizar todas las skills
2. REVISAR: Ver PASS/FAIL de cada criterio
3. VALIDAR: validate-essence.py → Verificar esencia preservada
4. CORREGIR: fix-missing.py → Crear archivos faltantes
5. VERIFICAR: Probar scripts y evals
6. SCORE: Calcular rating final (90%+ = Excellent)
```

---

## 📊 Output Format

```
📋 AUDIT REPORT: [skill-name]

✅ PASS (8):
- YAML frontmatter (name, description, triggers)
- Gotchas section (3+ errors)
- Progressive disclosure (< 200 líneas)
- References folder exists
- Scripts folder exists
- Esencia Original section
- State Persistence mentioned

❌ FAIL (2):
- evals.json missing (v2.0 recommendation)

📊 SUMMARY:
Total checks: 10
Passed: 8
Failed: 2
Score: 80% — Good (Needs minor improvements)
```

---

## State Persistence

Reportes de auditoría se guardan en:
- `${CLAUDE_PLUGIN_DATA}/skill-auditor/reports/`
- O en `reports/` local de la skill

---

## Scoring

| Score                                    | Rating                                         | Acción                                                      |
|-----------------------------------------|-----------------------------------------------|------------------------------------------------------------|
| 90-100%                                  | ✅ Excellent                                    | Ready for production                                        |
| 70-89%                                   | 👍 Good                                         | Minor improvements needed                                   |
| 50-69%                                   | ⚠️ Needs Work                                  | Significant fixes required                                  |
| <50%                                     | ❌ Failed                                       | Do not integrate                                            |

## ⚠️ Gotchas

- **Auditoría falsa**: Si ejecutas el audit sin haber hecho cambios reales, el score no refleja nada. Solución: Solo auditar después de crear/modificar skills
- **Skills sin ejecutar**: El auditor no puede validar habilidades que nunca fueron probadas. Solución: Ejecutar la skill al menos una vez antes de auditar
- **Score subjetivo**: El rating depende de los criterios que uses. Solución: Mantener consistencia en los criterios entre auditorías
- **Archivo references/ vacío**: Si SKILL.md >400 líneas pero references/ está vacío, no cumple progressive disclosure. Solución: Mover documentación pesada a references/

---

## 🔄 Anthropic Find-and-Fix Loop Integration

> **Source:** Anthropic Security Find-and-Fix Loop (May 27, 2026) — [Knowledge Base](../../../../02_Knowledge/09_Anthropic/01_Security_Find_Fix_Loop.md)

The Skill Auditor now incorporates Anthropic's 6-step find-and-fix methodology to transform audits from static checks into a complete discovery→verification→patching pipeline.

### How the 6 Steps Map

#### Step 1: 🔍 Threat Model — Define Audit Criteria
- **Before:** Static checklist from SOTA v5.1
- **After:** Dynamic threat model per skill being audited
- **Implementation:** The audit criteria in `02_References/audit-criteria.md` act as the threat model. Each criteria defines what "counts as a violation" (severity thresholds, must-pass vs. nice-to-have rules).
- **New:** Every audit session starts by defining the audit scope: what skill areas are in scope, what severity counts as FAIL, and what's out of scope.

#### Step 2: 📦 Sandbox — Skills Directory as Sandbox
- **Before:** Audit runs directly on the skill files
- **After:** Explicitly treat the skills directory as a read-only sandbox
- **Implementation:** Audit scripts mount the skills tree as read-only reference. No modifications during discovery. The sandbox guarantees the audit doesn't accidentally mutate what it's auditing.
- **Script:** `audit-skills.py` already operates in read-only mode — this is just making it explicit.

#### Step 3: 🚀 Discovery — Parallel Audit Agents
- **Before:** Sequential audit (one skill at a time)
- **After:** Parallel discovery using subagents or batched processing
- **Implementation:** Split the skills directory into batches, run `audit-skills.py` across each batch in parallel, collect all raw findings.
- **Script enhancement:** `audit-skills.py` should support a `--batch` flag for parallel execution.

#### Step 4: ✅ Verification — Cross-Validate Findings
- **Before:** A single pass generates the audit report
- **After:** Every finding goes through adversarial verification
- **Implementation:** After raw findings are collected, run `validate-essence.py` as an independent verification pass. Then run a **cross-validation** step: one script audits, another verifies the audit. Findings that can't be independently confirmed get downgraded.
- **Script enhancement:** New `cross-validate.py` script that compares audit results between two independent runs and highlights discrepancies.

#### Step 5: 📊 Triage — Deduplicate by Root Cause
- **Before:** Each skill gets its own audit report
- **After:** Findings are deduplicated by root cause across all skills
- **Implementation:** `audit-loop.py` can be extended to group findings by root cause pattern. Example: 5 skills all missing gotchas → one root cause ("missing gotchas pattern"), not 5 separate issues.
- **Rank by severity:** Classify each finding as Critical (blocks integration), Major (needs fix before next audit), Minor (nice-to-have).

#### Step 6: 🔧 Patching — Auto-Fix with Verification
- **Before:** `fix-missing.py` creates missing files
- **After:** TDD approach: verify → generate fix → verify fix → commit
- **Implementation:** Extend `fix-missing.py` with a verification step:
  1. Identify what's missing (e.g., no gotchas section)
  2. Generate the fix (e.g., add gotchas template)
  3. Re-run audit on the fixed skill to verify it now PASSES
  4. Only commit if verification succeeds
- **Adversarial check:** After fixing, run `validate-essence.py` to ensure the fix didn't break the skill's original purpose.

### Complete Find-and-Fix Audit Flow

```
1. THREAT MODEL → Define criteria + scope thresholds
2. SANDBOX → Mount skills directory as read-only
3. DISCOVERY → audit-skills.py --parallel (batched)
4. VERIFICATION → validate-essence.py + cross-validate.py
5. TRIAGE → audit-loop.py --dedup --rank
6. PATCHING → fix-missing.py --verify --adversarial-check
```

### New Scripts Needed

| Script                                       | Purpose                                   | Status     |
|---------------------------------------------|------------------------------------------|-----------|
| `audit-skills.py --parallel --batch N`       | Parallel discovery                        | Enhancement|
| `cross-validate.py`                          | Independent verification of audit findings| New        |
| `audit-loop.py --dedup --rank`               | Root-cause dedup + severity ranking       | Enhancement|
| `fix-missing.py --verify --adversarial-check`| Fix + verify fix passes audit             | Enhancement|

---

*Skill Version: 2.1*
*Framework: Anthropic Skill Creator v2.0 + PersonalOS SOTA v5.1 + Find-and-Fix Loop*
*Last Updated: 2026-05-28*
