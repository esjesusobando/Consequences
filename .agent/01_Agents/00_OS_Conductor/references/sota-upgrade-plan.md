# 🏗️ Plan Maestro: Upgrade SOTA v5.1 para todo el OS

> **Propósito:** Llevar las 369 skills del PersonalOS a estándar SOTA v5.1 respetando la esencia de cada una.
> **Principio:** No es cookie-cutter. Cada skill preserva su identidad y propósito original.
> **OS Conductor está en:** 100% SOTA v5.1 + 100% Evals — sirve como modelo y blueprint.

---

## 📊 Estado Actual del OS

### Score general: 77.8% (promedio ponderado)

| Score | Áreas | Skills |
|-------|-------|--------|
| ✅ 100% | 10_Skill_Auditor, 03_Video_Media | ~8 skills |
| 👍 80-99% | 00_Compound_Engineering, 06_Tools, 01_Creacion_Contenidos | ~198 skills |
| 👍 70-79% | 04_Automatizacion, 05_Workflows, 07_Personal_Os, 09_Claude_Ads, 00_Agent_Teams_Lite, 02_Diseno_Ui_Ux | ~156 skills |
| ⚠️ < 70% | individual skills outliers (06_Design_Sota, 11_Premium_Image_Studio, 17_Compound_Engine, 06_Testing) | ~7 skills |

### Patrón encontrado en skills < 100%

```
❌ description sin triggers      → 70%+ de las skills (mayoría)
❌ Sin Gotchas section           → 70%+ de las skills
❌ Sin Esencia Original          → 70%+ de las skills
❌ State Persistence no doc      → 90%+ de las skills
❌ evals.json faltante           → 99% de las skills
❌ references/ faltante          → skills >200 líneas
❌ scripts/ faltante             → skills que tienen código repetitivo
```

---

## 🔄 Flujo de Upgrade por Skill

```
1. AUDITAR → python audit-skills.py <skill_dir>
2. DIAGNOSTICAR → ¿Qué checks fallaron? ¿Son relevantes para esta skill?
3. PRESERVAR ESENCIA → Antes de tocar, entender el propósito original
4. AGREGAR solo lo que aporta valor:
   ─ ¿Triggers en description? → SIEMPRE (es para el modelo, no marketing)
   ─ ¿Gotchas? → SOLO si hay errores documentables (mín 3)
   ─ ¿Esencia Original? → SIEMPRE (define propósito)
   ─ ¿references/? → SOLO si SKILL.md > 200 líneas
   ─ ¿scripts/? → SOLO si hay código reutilizable
   ─ ¿evals.json? → Skills críticas del sistema
5. VERIFICAR → Re-auditar hasta 100%
6. COMMIT → feat: upgrade <skill-name> to SOTA v5.1
```

---

## 🗂️ Priorización por Tracking

### 🟢 TRACK A — Skills Core del Sistema (CRÍTICO)

Skills que el OS necesita para funcionar. Si fallan, el sistema se rompe.

| # | Skill | Área | Score actual | Esfuerzo |
|---|-------|------|-------------|----------|
| 1 | **OS Conductor** | 01_Agents | 100% ✅ | **COMPLETADO** |
| 2 | **10_Skill_Auditor** | 10_Skill_Auditor | 100% ✅ | Ya está en estándar |
| 3 | **00_System_Core** | 00_System_Core | 90.9% | Bajo (solo Gotchas) |
| 4 | **00_Compound_Engineering** | 00_Compound_Engineering | 84.6% | Bajo (Gotchas + Esencia) |

**Acción:** Fix inmediato (misma sesión)
- 00_System_Core: Agregar 3 gotchas específicos + Esencia Original
- 00_Compound_Engineering: Agregar 3 gotchas específicos + Esencia Original

---

### 🔵 TRACK B — Skills de Alto Impacto (ALTA PRIORIDAD)

Skills que el Conductor rutea más frecuentemente. Afectan directamente la experiencia del usuario.

| # | Skill | Área | Score actual | Esfuerzo |
|---|-------|------|-------------|----------|
| 5 | **01_Brand_Voice** | 01_Creacion_Contenidos | 100% ✅ | Ya en estándar |
| 6 | **02_Content_Ideation** | 01_Creacion_Contenidos | ~85% | Medio (triggers + Gotchas + Esencia) |
| 7 | **04_Offer_And_Bio_Writer** | 01_Creacion_Contenidos | ~85% | Medio |
| 8 | **12_Carousel_Master** | 01_Creacion_Contenidos | 100% ✅ | Ya en estándar |
| 9 | **13_Seo_Sota_Master** | 01_Creacion_Contenidos | 92.9% | Bajo |
| 10 | **14_Remotion_Video_Creator** | 01_Creacion_Contenidos | 90% | Bajo |
| 11 | **02_James_Cameron** | 03_Video_Media | 100% ✅ | Ya en estándar |
| 12 | **11_Doc_Processing** | 06_Tools | 100% ✅ | Ya en estándar |
| 13 | **12_Qmd** | 06_Tools | 92.3% | Bajo |
| 14 | **13_System_Master** | 06_Tools | 100% ✅ | Ya en estándar |
| 15 | **14_Silicon_Valley_Data_Analyst** | 06_Tools | 92.9% | Bajo |

**Acción:** Una sesión por skill, batch de 3-5 skills por hora
- Priorizar skills con score 100% ya hechas (no tocarlas)
- Skills 90%+ solo necesitan triggers + un par de ajustes

---

### 🟡 TRACK C — Skills con Patrón Repetitivo (MEDIA PRIORIDAD)

Skills en áreas como N8N (24 skills), SDD (13 skills), Ads (20 skills) que comparten estructura similar.

| Área | Skills | Score típico | Patrón de fix |
|------|--------|-------------|---------------|
| **00_Agent_Teams_Lite** (13) | SDD Init, Explore, Propose, Spec, Design, Tasks... | ~70% | Mismo fix para todas: triggers + Gotchas + Esencia |
| **04_Automatizacion** (24) | N8N_JS, N8N_Python, N8N_Expressions, Firecrawl... | ~72.7% | Idem + algunas necesitan references/ (>200 líneas) |
| **05_Workflows** (35) | Super_Campeones, etc. | ~72.7% | Idem |
| **09_Claude_Ads** (20) | Ads | ~72.7% | Idem |
| **02_Diseno_Ui_Ux** (23) | Design_Sota (63.6%), Ui_Ux_Pro_Max (69.2%) | ~71.4% | Atención a las que están <70% |
| **07_Personal_Os** (32) | Hillary, Life OS | ~70% | Idem |
| **08_Invictus_Web** (15) | Playwright, Superpowers | 0% (error) | Requiere diagnóstico |

**Acción:** Batch processing — mismo fix para todas las skills del mismo tipo:
1. Agregar triggers semánticos en description
2. Agregar 3 gotchas específicos del dominio (N8N, SDD, Ads, etc.)
3. Agregar Esencia Original
4. Si SKILL.md > 200 líneas → crear references/ y mover contenido pesado
5. Si hay código repetitivo → crear scripts/

---

### 🔴 TRACK D — Skills Outlier < 70% (ALERTA)

Skills que no cumplen el mínimo.

| Skill | Área | Score | Riesgo |
|-------|------|-------|--------|
| **06_Design_Sota** | 02_Diseno_Ui_Ux | 63.6% | ⚠️ Sin triggers, sin Gotchas, sin Esencia, >200 líneas sin references/ |
| **11_Premium_Image_Studio** | 01_Creacion_Contenidos | 60.0% | ⚠️ name con espacios, sin triggers, sin Gotchas |
| **17_Compound_Engine** | 01_Creacion_Contenidos | 62.5% | ❌ Sin name field en YAML — error estructural |
| **06_Testing** | 06_Tools | 60.0% | ❌ Sin name field + sin triggers + sin Gotchas |

**Acción:** Fix inmediato, una por una. Estas skills están rotas estructuralmente.

---

## 📋 Template de Fix por Tipo de Check

Para mantener consistencia pero preservar esencia, estos son los templates de cada fix:

### 1. Agregar triggers a description
```yaml
# ANTES
description: A comprehensive tool for managing content...

# DESPUÉS
description: >-
  [Qué hace exactamente la skill].
  Triggers on: [keyword1], [keyword2], [keyword3], [frase exacta que dice el usuario].
```
> **Preservar esencia:** Los triggers deben reflejar lo que el usuario REALMENTE dice, no keywords genéricas.

### 2. Agregar Esencia Original
```markdown
## Esencia Original

> **Metaskill:** [Una línea: qué problema resuelve esta skill que ninguna otra resuelve]

[2-3 párrafos: por qué nació esta skill, qué necesidad cubre, por qué no puede 
simplemente desaparecer o ser reemplazada por otra skill]

**Propósito original:** [Una frase que capture la razón de ser de la skill]
```

### 3. Agregar Gotchas (mínimo 3)
```markdown
## ⚠️ Gotchas

### ERROR 1: [Error específico de esta skill]
- **Por qué**: [Por qué ocurre este error]
- **Solución**: [Cómo evitarlo]

### ERROR 2: ...
- **Por qué**: ...
- **Solución**: ...

### ERROR 3: ...
- **Por qué**: ...
- **Solución**: ...
```
> **Preservar esencia:** Los gotchas deben venir de ERRORES REALES que ocurrieron usando la skill, no inventados genéricamente.

---

## ⏱️ Estimación de Esfuerzo

| Track | Skills | Tiempo por skill | Total estimado |
|-------|--------|-----------------|----------------|
| 🟢 A — Core | 2 | 5 min | 10 min |
| 🔵 B — Alto impacto | 11 | 5-10 min | 45-60 min |
| 🟡 C — Patrón repetitivo | ~160 | 3-5 min | 8-13 horas |
| 🔴 D — Outliers | 4 | 10-15 min | 40-60 min |
| **Total** | **~177 skills prioritarias** | | **~10-15 horas** |

> Las ~192 skills restantes están en áreas que ya tienen score 100% o que no se usan activamente.

---

## 🚀 Fases de Ejecución

### Fase 0: Conductor + Auditor (✅ COMPLETADO)
- [x] OS Conductor 100% SOTA + evals
- [x] Skill Auditor 100% SOTA
- [x] Scripts de validación y benchmark

### Fase 1: TRACK A — Core (SIGUIENTE)
- [ ] Fix 00_System_Core (Gotchas + Esencia)
- [ ] Fix 00_Compound_Engineering (Gotchas + Esencia)

### Fase 2: TRACK D — Outliers
- [ ] Fix 06_Design_Sota
- [ ] Fix 11_Premium_Image_Studio
- [ ] Fix 17_Compound_Engine
- [ ] Fix 06_Testing

### Fase 3: TRACK B — Alto Impacto
- [ ] Batch 1: Content_Ideation, Offer_And_Bio_Writer, Remotion
- [ ] Batch 2: SEO_Sota_Master, Qmd, Silicon_Valley_Data_Analyst

### Fase 4: TRACK C — Patrón Repetitivo
- [ ] Batch: Agent_Teams_Lite (13 skills) — mismo fix batch
- [ ] Batch: N8N (24 skills) — mismo fix batch
- [ ] Batch: Ads (20 skills) — mismo fix batch
- [ ] Batch: Diseno_Ui_Ux (23 skills)
- [ ] Batch: Workflows (35 skills)
- [ ] Batch: Personal_Os (32 skills)

### Fase 5: Validación Global
- [ ] Re-correr auditoría completa
- [ ] Score target: >90% overall
- [ ] Remediar outliers que hayan quedado

---

## 📐 Reglas de Preservación de Esencia

### ⛔ Regla Cardinal: MEJORAR, NO REEMPLAZAR
**Nunca se borra contenido existente de una skill.** Siempre se agrega, complementa o extiende.
Si una skill ya tiene description, se AGREGAN triggers al final — no se reescribe.
Si una skill ya tiene workflow, se COMPLEMENTA con Gotchas — no se reemplaza el workflow.

```
❌ BORRAR: "description muy corta, la reescribo completa"
✅ AGREGAR: "descripción existente se conserva, agrego 'Triggers on: ...' al final"

❌ BORRAR: "workflow desactualizado, pongo el mío"
✅ AGREGAR: "workflow existente se conserva, agrego sección Gotchas al final"

❌ REEMPLAZAR: "cambio todo el archivo por mi template SOTA"
✅ EXTENDER: "preservo estructura original, agrego las secciones faltantes"
```

| No hacer | Hacer |
|----------|-------|
| Agregar scripts/ a skills que no tienen código | Dejar sin scripts/ si no hay código reutilizable |
| Agregar references/ a skills de <100 líneas | Crear solo si SKILL.md > 200 líneas |
| Gotchas genéricos copiados de otra skill | Gotchas basados en errores reales de ESTA skill |
| Esencia Original inventada | Esencia que describe el propósito REAL |
| Forzar evals.json en skills no críticas | evals.json solo para skills core del sistema |
| Renombrar skills que funcionan bien | Tocar solo los campos que fallan en la auditoría |

---

## 📊 Métricas de Éxito

| Métrica | Target actual | Target post-upgrade |
|---------|--------------|-------------------|
| OS Score general | 77.8% | >90% |
| Skills en 100% | ~8 | >100 |
| Skills < 70% | ~7 | 0 |
| Skills con triggers | ~30% | 100% |
| Skills con Gotchas | ~30% | 100% |
| Skills con Esencia Original | ~20% | 100% |

---

## 🔗 Referencias

- **Auditor SOTA v5.1:** `10_Skill_Auditor/SKILL.md`
- **Estandar completo:** `04_Operations/00_Context_LLM/02_Knowledge_Brain/08_Skill_Creation_SOTA.md`
- **Blueprint (modelo):** `00_OS_Conductor/SKILL.md` (100% SOTA)
- **Conductor evals:** `00_OS_Conductor/evals.json`

---

*OS Conductor v2.0 — Plan generado 2026-05-28 — Auditoría real contra 369 skills del PersonalOS*
