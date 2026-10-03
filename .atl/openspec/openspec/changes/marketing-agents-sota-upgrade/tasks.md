# Tasks: Marketing Agents SOTA Upgrade

## Dependency Graph

```
                  ┌─────────────────────────────────────────────────────┐
                  │  GROUP A — Parallel (no deps)                     │
                  │                                                    │
                  │  T1: 15_Estratega frontmatter                     │
                  │  T2: 16_Creador frontmatter                       │
                  │  T3: 17_Analista frontmatter   ─── all ──┐        │
                  │  T4: 06_Orchestrator (new)             parallel   │
                  │  T5: CLAUDE.marketing.md (new)                     │
                  │  T6: linkedin-content-flow skill (new)             │
                  └──────────────────────┬─────────────────────────────┘
                                         │
                    ┌────────────────────┴──────────────┐
                    ▼                                    ▼
         ┌──────────────────────┐          ┌──────────────────────┐
         │ T7: Mirror sync      │          │ T8: Skill registry   │
         │ (dep: T1,T2,T3,T4)   │          │ (dep: T6)            │
         └──────────────────────┘          └──────────────────────┘
```

## Task Map

| ID | Capability | File | Action | Deps |
|----|-----------|------|--------|------|
| T1 | C1 | `01_Personal_Os/01_Core/02_Tools/01_Agents/15_Marketing_Estratega.md` | Modify | — |
| T2 | C1 | `01_Personal_Os/01_Core/02_Tools/01_Agents/16_Marketing_Creador.md` | Modify | — |
| T3 | C1 | `01_Personal_Os/01_Core/02_Tools/01_Agents/17_Marketing_Analista.md` | Modify | — |
| T4 | C2 | `01_Personal_Os/01_Core/02_Tools/01_Agents/01_Dream_Team/06_Marketing_Orchestrator.md` | Create | — |
| T5 | C4 | `CLAUDE.marketing.md` | Create | — |
| T6 | C5 | `01_Personal_Os/01_Core/02_Tools/02_Skills/01_Creacion_Contenidos/14_Marketing_Tech/linkedin-content-flow/SKILL.md` | Create | — |
| T7 | Mirror | `.agent/01_Agents/15_Marketing_Estratega.md`, `16_Marketing_Creador.md`, `17_Marketing_Analista.md`, `01_Dream_Team/06_Marketing_Orchestrator.md` | Sync | T1, T2, T3, T4 |
| T8 | Registry | `.atl/skill-registry.md` | Modify | T6 |

---

## T1 — Add YAML frontmatter + skills table + MCPs to 15_Marketing_Estratega.md

**Capability:** C1 (Agent Format Upgrade)

**File:** `01_Personal_Os/01_Core/02_Tools/01_Agents/15_Marketing_Estratega.md` — **Modify**

**What to do:**

Prepended before line 1 (`# 🧠 Agente de Marketing: Estratega`), insert:

1. **YAML frontmatter** (between `---` fences):
   ```yaml
   ---
   name: Marketing Estratega
   description: Estratega de contenido y marketing — define qué, cuándo y por qué crear contenido
   trigger_keywords: [estrategia, brief, plan de contenido, calendario editorial, kpi, audiencia, propuesta de valor, research]
   auto_loads_skills: true
   version: 2.0
   sota_principles: [brief_generation, audience_research, editorial_planning, kpi_definition]
   ---
   ```

2. **`## Skills que carga automáticamente`** section — insert after the YAML frontmatter block (before the `# 🧠` header). Reference skills from `13_Marketing_Strategy/` and any applicable from `14_Marketing_Tech/`:

   ```markdown
   ## 📦 Skills que carga automáticamente

   ### Estrategia e Investigación
   | Skill | Cuándo Usar | Output |
   |-------|-------------|--------|
   | `content-strategy` | Definir plan de contenido | Estrategia editorial |
   | `marketing-ideas` | Generar concepts y ángulos | Ideas priorizadas |
   | `marketing-psychology` | Definir ángulo psicológico | Framework de persuasión |
   | `launch-strategy` | Planificar lanzamiento | Timeline + tácticas |
   | `pricing-strategy` | Definir precios | Estructura de pricing |

   ### Technical Marketing (Investigación)
   | Skill | Cuándo Usar | Output |
   |-------|-------------|--------|
   | `competitor-alternatives` | Analizar competencia | Comparativa competitiva |
   | `seo-audit` | Diagnosticar SEO actual | Reporte de issues |
   ```

3. **`## 🛠️ MCPs usados`** section — insert before existing `## 🔗 Referencias` section (or at end before footer):

   ```markdown
   ## 🛠️ MCPs usados

   | MCP | Propósito | Pipeline Stage |
   |-----|-----------|----------------|
   | `google-workspace` | Brief docs en Google Docs, competitive research en Sheets | Research |
   ```
   
   The MCP `google-workspace` key must match `.mcp.json` exactly: `"google-workspace"`.

**Preservation rules:**
- Lines 1-79 (original content) must remain EXACTLY as-is after the frontmatter block.
- The `# 🧠 Agente de Marketing: Estratega` header must be the first line after the closing `---`.
- Existing content sections (`Propósito`, `Protocolo de Blindaje`, `Responsabilidades`, `Input / Output`, `Formato de Brief`, `Referencias`) must NOT be modified.
- The footer `*Marketing Agents v1.0 — PersonalOS v4.9 Consequences*` must remain.

**Verification:**
- `python -c "import yaml; yaml.safe_load(open('15_Marketing_Estratega.md'))"` exits 0
- `grep -c 'auto_loads_skills: true'` = 1
- `grep -c 'google-workspace'` = 1
- `grep -c 'content-strategy'` = 1
- `grep -c 'competitor-alternatives'` = 1
- All existing 79 lines preserved (check via `git diff --stat`: only additions)
- Each skill path resolves: `ls 01_Personal_Os/01_Core/02_Tools/02_Skills/01_Creacion_Contenidos/13_Marketing_Strategy/<skill>/` exits 0

---

## T2 — Add YAML frontmatter + skills table + MCPs to 16_Marketing_Creador.md

**Capability:** C1 (Agent Format Upgrade)

**File:** `01_Personal_Os/01_Core/02_Tools/01_Agents/16_Marketing_Creador.md` — **Modify**

**What to do:**

Prepended before line 1 (`# ✍️ Agente de Marketing: Creador de Contenido`), insert:

1. **YAML frontmatter**:
   ```yaml
   ---
   name: Marketing Creador
   description: Productor de contenido multicanal — YouTube, LinkedIn, Newsletter, y otros formatos
   trigger_keywords: [crear, escribir, producir, post, linkedin, youtube, newsletter, copy, contenido, guion, script]
   auto_loads_skills: true
   version: 2.0
   sota_principles: [content_production, multichannel_adaptation, brand_fidelity, seo_optimization]
   ---
   ```

2. **`## 📦 Skills que carga automáticamente`** section (insert before the `# ✍️` header):

   ```markdown
   ## 📦 Skills que carga automáticamente

   ### Producción de Contenido
   | Skill | Cuándo Usar | Output |
   |-------|-------------|--------|
   | `content-creation` | Redactar contenido estratégico | Artículos, posts, hilos |
   | `social-content` | Crear contenido para redes | LinkedIn, Twitter, Instagram |
   | `copy-editing` | Pulir y editar copy | Texto final pulido |
   | `copywriting` | Escribir copy persuasivo | Copy optimizado para conversión |
   | `email-sequence` | Redactar secuencia de emails | Email marketing sequence |

   ### Visual y Video
   | Skill | Cuándo Usar | Output |
   |-------|-------------|--------|
   | `paid-ads` | Crear creatives para ads | Copy + visuales para campañas |
   | `free-tool-strategy` | Crear lead magnets | Herramienta gratuita + copy |
   ```

3. **`## 🛠️ MCPs usados`** section (before existing `## 🔗 Referencias`):

   ```markdown
   ## 🛠️ MCPs usados

   | MCP | Propósito | Pipeline Stage |
   |-----|-----------|----------------|
   | `higgsfield` | Generar imágenes para acompañar contenido | Content |
   | `heygen` | Producir videos con avatar para contenido | Content |
   | `google-workspace` | Redactar borradores en Google Docs | Content |
   ```

**Preservation rules:**
- Lines 1-75 (original content) must remain EXACTLY as-is.
- The `# ✍️` header must be immediately after closing `---`.
- Existing sections, emojis, and references unchanged.
- The footer `*Marketing Agents v1.0 — PersonalOS v4.9 Consequences*` must remain.

**Verification:**
- YAML parses cleanly
- `trigger_keywords` array validated (no trailing comma in YAML)
- All skill paths resolve under `13_Marketing_Strategy/` or `14_Marketing_Tech/`
- MCP keys `higgsfield`, `heygen`, `google-workspace` exist in `.mcp.json`
- Zero deletions in `git diff --stat`

---

## T3 — Add YAML frontmatter + skills table + MCPs to 17_Marketing_Analista.md

**Capability:** C1 (Agent Format Upgrade)

**File:** `01_Personal_Os/01_Core/02_Tools/01_Agents/17_Marketing_Analista.md` — **Modify**

**What to do:**

Prepended before line 1 (`# 📊 Agente de Marketing: Analista`), insert:

1. **YAML frontmatter**:
   ```yaml
   ---
   name: Marketing Analista
   description: Analista de métricas y optimización — mide rendimiento, extrae insights, cierra feedback loop
   trigger_keywords: [analizar, métricas, reporte, rendimiento, optimizar, kpi, insights, performance, analytics]
   auto_loads_skills: true
   version: 2.0
   sota_principles: [performance_analysis, insight_extraction, feedback_loop, ab_testing]
   ---
   ```

2. **`## 📦 Skills que carga automáticamente`** section (insert before the `# 📊` header):

   ```markdown
   ## 📦 Skills que carga automáticamente

   ### Análisis y Optimización
   | Skill | Cuándo Usar | Output |
   |-------|-------------|--------|
   | `analytics-tracking` | Revisar tracking implementado | Reporte de calidad de datos |
   | `ab-test-setup` | Analizar resultados de test | Insights + recomendaciones |
   | `seo-audit` | Medir impacto SEO de contenido | Reporte de ranking y tráfico |
   | `referral-program` | Analizar rendimiento de referidos | Optimización de programa |

   ### Estrategia (Recomendaciones)
   | Skill | Cuándo Usar | Output |
   |-------|-------------|--------|
   | `content-strategy` | Recomendar ajustes estratégicos | Brief actualizado |
   | `marketing-ideas` | Sugerir nuevos ángulos basados en datos | Ideas validadas por datos |
   ```

3. **`## 🛠️ MCPs usados`** section (before existing `## 🔗 Referencias`):

   ```markdown
   ## 🛠️ MCPs usados

   | MCP | Propósito | Pipeline Stage |
   |-----|-----------|----------------|
   | `google-workspace` | Métricas en Sheets, reportes en Docs | Analysis |
   ```

**Preservation rules:**
- Lines 1-88 (original content) must remain EXACTLY as-is.
- The `# 📊` header must be immediately after closing `---`.
- The existing `## 🔗 Referencias` section must remain unchanged (its `analytics-tracking` reference to `14_Marketing_Tech/` stays).

**Verification:**
- YAML parses cleanly
- `auto_loads_skills: true` present
- All skill paths resolve
- Note: agent 17 references `01_Creacion_Contenidos/14_Marketing_Tech/analytics-tracking/` in its existing `## 🔗 Referencias`. The new skills table's `analytics-tracking` entry is consistent.
- Zero deletions

---

## T4 — Create 06_Marketing_Orchestrator.md

**Capability:** C2 (Marketing Orchestrator)

**File:** `01_Personal_Os/01_Core/02_Tools/01_Agents/01_Dream_Team/06_Marketing_Orchestrator.md` — **Create**

**What to do:**

Create a new Dream Team agent file. Slot **06** is confirmed available (existing: 01-05 + README).

The file must follow the `04_Design_Ops.md` format convention (YAML frontmatter, skills tables by category, MCP section, workflow diagram, references).

Full content structure:

### YAML frontmatter
```yaml
---
name: Marketing Orchestrator
description: Coordina el pipeline de marketing — Estratega → Creador → Analista — con skills auto-loading y MCP dispatch
trigger_keywords: [campaña, marketing, lanzamiento, contenido, brief, pipeline, orquestar, marketing campaign, content pipeline]
auto_loads_skills: true
version: 1.0
sota_principles: [pipeline_orchestration, skill_auto_loading, mcp_integration, feedback_loop]
harness_pattern: [generator, evaluator]
model_recommendation: "Claude Sonnet 4 (mejor equilibrio velocidad-calidad para pipeline multi-agente)"
---
```

### Required sections (in this order):

1. **`# Perfil: Marketing Orchestrator`** — header matching Dream Team convention (see 03_Marketing_Tech.md `# Perfil:` pattern)

2. **`## 🎯 Propósito`** — role description: coordinator, not executor. Routes requests to specialist agents.

3. **Pipeline flow diagram** — ASCII art showing:
   ```
   User Input → Orchestrator (parse intent)
     ├─ Strategy only → Estratega (15) → done (short-circuit)
     ├─ Content → Estratega (15) → Creador (16) → done
     └─ Full campaign → Estratega (15) → Creador (16) → Analista (17) → feedback loop
   ```

4. **`## 📦 Skills que carga automáticamente`** — grouped tables:
   - **Strategy** (from `13_Marketing_Strategy/`)
   - **Content Production** (from `14_Marketing_Tech/`)
   - **Analysis** (from `14_Marketing_Tech/`)
   - **MCP Tools** (placeholder category — "None yet")
   
   Each skill row: `| Skill | Cuándo Usar | Output |`

5. **`## 🛠️ MCPs usados`** — aggregated pipeline MCP mapping table:
   
   | Pipeline Stage | Agent | MCP(s) | Purpose |
   |---|---|---|---|
   | Research | 15 Estratega | `google-workspace` | Brief docs, competitive spreadsheets |
   | Content | 16 Creador | `higgsfield`, `heygen` | Image generation, video avatar production |
   | Analysis | 17 Analista | `google-workspace` | Metrics in Sheets, report docs |

6. **`## 🔄 Agent-to-Agent Contract`** — defines the pipeline handoff contract (from design.md):
   - Input → Orchestrator parses intent
   - Stage 1→2: Estratega brief → Creador (objectivo, audiencia, tono, CTA, KPIs)
   - Stage 2→3: Creador content → Analista (piece + original KPIs)
   - Stage 3→feedback: Analista recommendations → Estratega (closes loop)
   - Short-circuit: strategy-only skips Creador/Analista

7. **`## 🔗 Referencias`** — must include:
   - Cross-reference to `03_Marketing_Tech.md` explaining role differentiation:
     > **03_Marketing_Tech** carga todas las skills de marketing técnico como un perfil generalista. **06_Marketing_Orchestrator** coordina el pipeline específico de 3 agentes especializados (Estratega → Creador → Analista) para campañas completas.
   - Relative paths to: `../15_Marketing_Estratega.md`, `../16_Marketing_Creador.md`, `../17_Marketing_Analista.md`
   - Paths to `13_Marketing_Strategy/` and `14_Marketing_Tech/` skill directories

**Verification:**
- File exists at `01_Dream_Team/06_Marketing_Orchestrator.md`
- `python -c "import yaml; yaml.safe_load(open('file'))"` exits 0
- `grep '03_Marketing_Tech'` shows cross-reference
- `grep -c 'google-workspace'` >= 1
- `grep -c 'higgsfield'` >= 1
- `grep -c 'heygen'` >= 1
- Pipeline diagram shows 3-stage flow
- No file collision in `01_Dream_Team/` — confirm `06_` is unique

---

## T5 — Create CLAUDE.marketing.md template

**Capability:** C4 (Marketing CLAUDE.md Template)

**File:** `CLAUDE.marketing.md` (project root) — **Create**

**What to do:**

Create a standalone markdown template file. Must NOT modify existing `CLAUDE.md` (PersonalOS root).

Required sections (in order):

1. **`# CLAUDE.marketing.md — Marketing Content Project`** — title

2. **`## Project Description`** — placeholder template:
   ```markdown
   ## Project Description

   **Project:** {project-name}
   **Goal:** {what we want to achieve with this content}
   **Target Audience:** {who we are speaking to}
   **Content Type(s):** {YouTube / LinkedIn / Newsletter / Blog / etc.}
   ```

3. **`## Brand Voice`** — tone specification:
   ```markdown
   ## Brand Voice

   **Language:** Rioplatense Spanish (voseo) by default
   **Tone:** {warm, professional, direct, playful, authoritative — pick one}

   **Do:**
   - {example of correct tone}
   - {example of correct tone}

   **Don't:**
   - {example of wrong tone}
   - {example of wrong tone}

   **Messaging Pillars:**
   1. {pillar 1}
   2. {pillar 2}
   3. {pillar 3}
   ```

4. **`## Content Rules`** — quality gates (minimum 2):
   ```markdown
   ## Content Rules

   ### Quality Gates
   - [ ] **Hook exists**: LinkedIn posts MUST have a hook in the first 2 lines
   - [ ] **CTA present**: Every piece MUST include a clear call-to-action
   - [ ] **Brand voice check**: Tone matches brand voice specification
   - [ ] **Brief alignment**: Content matches objective, audience, and KPIs from brief

   ### Review Workflow
   1. Creador produces draft
   2. Analista reviews against quality gates
   3. If revisions needed → loop back to Creador
   4. If approved → format for platform and deliver
   ```

5. **`## Tools & MCPs`** — reference the 3 strategic MCPs:
   ```markdown
   ## Tools & MCPs

   | Tool | Purpose | When to use |
   |------|---------|-------------|
   | `google-workspace` (MCP) | Docs/Sheets automation | Research briefs, metrics tracking |
   | `higgsfield` (MCP) | AI image generation | Visual assets for content |
   | `heygen` (MCP) | AI video avatar | Video content production |

   **Skills that auto-load:** from `01_Creacion_Contenidos/13_Marketing_Strategy/` and `14_Marketing_Tech/`.
   ```

6. **`## Commands`** — shortcut commands:
   ```markdown
   ## Commands

   - `publish` → Review draft → Check quality gates → Format → Present with scheduling recommendations
   - `brief` → Estratega generates a full brief for a given topic
   - `campaign` → Full pipeline: research → create → review → deliver
   ```

7. **Optional sections** (commented as `<!-- Optional: remove if not needed -->`):
   - `## Analytics Tracking`
   - `## A/B Test Configuration`
   - `## SEO Keywords`

**Verification:**
- File exists at root as `CLAUDE.marketing.md`
- 5 required `##` section headers present
- `grep 'higgsfield'` found
- `grep 'heygen'` found
- `grep 'google-workspace'` found
- `grep 'Rioplatense'` found (brand voice)
- At least 2 quality gates in Content Rules
- `grep -c 'placeholder'` >= 2 (bracketed or `{...}` placeholders)

---

## T6 — Create linkedin-content-flow skill YAML

**Capability:** C5 (LinkedIn Content Flow Skill)

**File:** `01_Personal_Os/01_Core/02_Tools/02_Skills/01_Creacion_Contenidos/14_Marketing_Tech/linkedin-content-flow/SKILL.md` — **Create**

**What to do:**

Based on the design decision: the skill goes under `14_Marketing_Tech/linkedin-content-flow/` (not a new `15_Marketing_Workflows/` directory, to avoid collision with existing `15_Marketing_Scripts/`).

Create the directory path and `SKILL.md` file:

```markdown
---
name: linkedin-content-flow
description: Pipeline completo de contenido para LinkedIn — research, creación, revisión y publicación
trigger_keywords: [linkedin, post linkedin, linkedin post, contenido linkedin, linkedin content, crear post]
auto_loads_skills: true
version: 1.0
type: skill
pipeline:
  stages:
    - phase: research
      agent: 15_Marketing_Estratega.md
      input: topic, target_audience, angle, key_messages
      output: brief with objective, audience, tone, CTA, success_metric
      fallback: prompt-user
    - phase: create
      agent: 16_Marketing_Creador.md
      input: brief from stage 1
      output: complete LinkedIn post (hook → story → insight → CTA)
      fallback: retry
    - phase: review
      agent: 17_Marketing_Analista.md
      input: published piece + original brief KPIs
      output: validation report, quality gate pass/fail, revision instructions
      fallback: skip
    - phase: publish
      agent: null
      input: approved post
      output: formatted post with scheduling recommendations
      fallback: prompt-user
---
```

After the YAML frontmatter, add markdown content:

```markdown
# LinkedIn Content Flow

Pipeline completo para producir contenido optimizado para LinkedIn, desde el brief hasta el post listo para publicar.

## Pipeline

| Stage | Agent | Input | Output |
|-------|-------|-------|--------|
| 1. Research | `15_Marketing_Estratega.md` | Topic + audiencia | Brief completo |
| 2. Create | `16_Marketing_Creador.md` | Brief | Post LinkedIn (hook → story → insight → CTA) |
| 3. Review | `17_Marketing_Analista.md` | Post + KPIs | Validación o revisiones |
| 4. Publish | — | Post aprobado | Formateado + recomendaciones |

## Quality Gates

- ✅ Hook in first 2 lines
- ✅ CTA presente
- ✅ Brand voice match
- ✅ Brief alignment (objective, audience, KPIs)

## Fallback Rules

| Stage | If fails |
|-------|----------|
| Research | Preguntar al usuario por clarificación |
| Create | Reintentar con brief corregido |
| Review | No publicar — devolver instrucciones de revisión |
| Publish | Preguntar al usuario por plataforma/horario |

## Output Format

```markdown
## Post: [Title]

{hook}

{story / insight}

{CTA}

---
**Scheduling recommendation:** {best time/day}
```
```

**Verification:**
- File exists at specified path
- Directory `14_Marketing_Tech/linkedin-content-flow/` created
- `python -c "import yaml; yaml.safe_load(open('SKILL.md'))"` exits 0
- `pipeline.stages` has exactly 4 entries
- Each stage has all 5 fields: `agent`, `phase`, `input`, `output`, `fallback`
- Agent references resolve: `../15_Marketing_Estratega.md`, `../16_Marketing_Creador.md`, `../17_Marketing_Analista.md`
- `type: skill` present in frontmatter
- No collision with existing files in `14_Marketing_Tech/` directory

---

## T7 — Mirror sync via Agent Sync Hub

**Capability:** Mirror (backup sync)

**Files:** (synced by script, not manually edited):
- `.agent/01_Agents/15_Marketing_Estratega.md` (sync)
- `.agent/01_Agents/16_Marketing_Creador.md` (sync)
- `.agent/01_Agents/17_Marketing_Analista.md` (sync)
- `.agent/01_Agents/01_Dream_Team/06_Marketing_Orchestrator.md` (sync)

**Dependencies:** T1, T2, T3, T4 complete

**What to do:**

1. Run the Agent Sync Hub in dry-run mode first:
   ```bash
   python 01_Personal_Os/04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py
   ```

2. Review output — confirm that changes to 15, 16, 17 (modified) and 06 (new) are detected.

3. Run with apply to sync:
   ```bash
   python 01_Personal_Os/04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py --apply
   ```

4. If the script does not automatically detect the new orchestrator file (06), manually copy:
   ```bash
   cp 01_Personal_Os/01_Core/02_Tools/01_Agents/01_Dream_Team/06_Marketing_Orchestrator.md .agent/01_Agents/01_Dream_Team/06_Marketing_Orchestrator.md
   ```

5. Verify with diff for all 4 files:
   ```bash
   diff 01_Personal_Os/01_Core/02_Tools/01_Agents/15_Marketing_Estratega.md .agent/01_Agents/15_Marketing_Estratega.md
   diff 01_Personal_Os/01_Core/02_Tools/01_Agents/16_Marketing_Creador.md .agent/01_Agents/16_Marketing_Creador.md
   diff 01_Personal_Os/01_Core/02_Tools/01_Agents/17_Marketing_Analista.md .agent/01_Agents/17_Marketing_Analista.md
   diff 01_Personal_Os/01_Core/02_Tools/01_Agents/01_Dream_Team/06_Marketing_Orchestrator.md .agent/01_Agents/01_Dream_Team/06_Marketing_Orchestrator.md
   ```

**Verification:**
- Exit code 0 from sync script
- Zero diffs between source and mirror for all 4 files
- `.agent/01_Agents/01_Dream_Team/06_Marketing_Orchestrator.md` exists

---

## T8 — Update skill registry

**Capability:** Registry

**File:** `.atl/skill-registry.md` — **Modify**

**Dependencies:** T6 complete

**What to do:**

Add an entry to the registry table for the new `linkedin-content-flow` skill:

```markdown
| `linkedin-content-flow` | Pipeline completo de contenido para LinkedIn — research, creación, revisión y publicación | user | `<absolute-path-to-SKILL.md>` |
```

Replace `<absolute-path-to-SKILL.md>` with the resolved absolute path:
`C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\01_Core\02_Tools\02_Skills\01_Creacion_Contenidos\14_Marketing_Tech\linkedin-content-flow\SKILL.md`

The entry must be inserted alphabetically among existing skills in the table (between `judgment-day` and `marketing-tech`).

Preserve the exact table format: `| Skill | Trigger / description | Scope | Path |` with `---` separator row.

**Verification:**
- `grep 'linkedin-content-flow' .atl/skill-registry.md` returns exactly 1 line
- The Path column is the absolute path to the SKILL.md file
- Table alignment preserved (no broken pipe characters)
- No duplicate entries

---

## Verification Checklist (Post-All Tasks)

| Check | Command / Method |
|-------|-----------------|
| YAML frontmatter valid (4 files) | `for f in 15 16 17; do python -c "import yaml; yaml.safe_load(open('01_Personal_Os/01_Core/02_Tools/01_Agents/${f}_Marketing_*.md'))"; done` + orchestrator |
| Content preserved (3 agents) | `git diff --stat` — zero deletions |
| All skill paths resolve | For each skill in every skills table, `ls <path>` exits 0 |
| MCP keys valid | Cross-reference each MCP name against `.mcp.json` keys |
| Agent Sync Hub passes | `python 19_Agent_Sync_Hub.py` exits 0 |
| Mirror in sync | `diff source .agent/mirror` for all 4 agent files |
| Skill registry updated | `grep 'linkedin-content-flow' .atl/skill-registry.md` |
| No broken cross-refs | `grep -r '\.\./' in new files` — all paths resolve |
