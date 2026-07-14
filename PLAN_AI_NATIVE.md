# 🧠 PLAN AI NATIVE — Think Different PersonalOS

> **Versión:** v1.0
> **Fecha:** 2026-07-14
> **Fuente:** Análisis del modelo "How to Become AI Native" — Theo Taba (LCA) + Greg Eisenberg
> **Objetivo:** Cerrar el gap entre "AI assisted" y "AI native" — que el OS no solo ejecute, sino que **escuche, aprenda y mejore solo**
> **Estado actual:** 9/10 componentes existentes, falta el **loop que cierra el sistema**

---

## 📊 DIAGNÓSTICO: Dónde Estamos vs Dónde Necesitamos Estar

```
MODELO AI NATIVE (Theo Taba):
┌─────────────────────────────────────────────────────────┐
│  People (estrategia, taste, judgment)                   │
│      ↓ gestionan                                        │
│  Agents (modelos + tools + loop)                        │
│      ↓ leen/escriben                                    │
│  Context (empresa readable para agentes)                │
│      ↓ alimenta                                         │
│  Speed → Signal → Feedback → Smart System               │
└─────────────────────────────────────────────────────────┘

NUESTRO OS ACTUAL:
┌─────────────────────────────────────────────────────────┐
│  ✅ People — Rituales, workflows, rules                 │
│  ✅ Agents — 67 agentes, 397 skills                     │
│  ✅ Context — Memory, Notas_de_Proceso, Context_LLM     │
│  ❌ LOOP — Capture → Curate → Execute → Ship → Signal   │
└─────────────────────────────────────────────────────────┘
```

| Capa | Theo Taba | PersonalOS | Gap |
|------|-----------|------------|-----|
| **Skills** | Markdown que suben capacidades | 397 skills | ✅ Tenemos 10x |
| **Agents** | Modelos usando tools en loop | 67 agentes | ✅ Tenemos |
| **Context** | Carpetas + markdown organizados | Memory + Context_LLM | 🟡 Tenemos, falta organización |
| **Skill Chains** | Macro skill → skills secuenciales | Workflows básicos | 🔴 Falta |
| **Capture** | Auto-ingest de Slack/meetings/email | Manual | 🔴 Falta |
| **Curation** | Librarian que filtra ruido | No existe | 🔴 Falta |
| **Signal Loop** | Customer experience → feedback → system | Feedback Loop creado hoy | 🟡 Sin integrar |
| **Labs** | Prototipos rapidos + usability test | No existe | 🔴 Falta |
| **Eval** | Visibility into agent output quality | Parallel Audit (general) | 🟡 No es por-output |

---

## 🎯 PLAN MAESTRO: 4 FASES

```
Fase 1 (Semana 1):  Skill Chains + Brain READMEs     → Agentes autónomos
Fase 2 (Semana 2):  Capture + Curation Pipeline       → OS que escucha
Fase 3 (Semana 3):  Labs Page + Eval System           → Validación rápida
Fase 4 (Semana 4):  Signal Loop Integration           → Sistema cerrado
```

---

## 📦 FASE 1: SKILL CHAINS + BRAIN READMEs (Semana 1)

**Objetivo:** Que los agentes puedan ejecutar flujos completos sin intervención humana.

### 1.1 Skill Chain Engine

**Qué es:** Un "macro skill" que dado un objetivo, descarga y ejecuta 3-5 skills en secuencia.

**Archivo:** `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/skill_chain.py`

**Arquitectura:**
```
User: "Crear propuesta para cliente X"
    → skill_chain.py
    → Parsea chain definition (YAML/JSON)
    → Ejecuta Step 1: market-proposal → output.json
    → Ejecuta Step 2: humanizador → output_humanized.json
    → Ejecuta Step 3: verificador-datos → output_verified.json
    → Ejecuta Step 4: deploy → proposal_url
    → Retorna: {chain_id, steps_completed, output_url, duration}
```

**Chain definitions:** `01_Personal_Os/00_Core/02_Tools/02_Skills/00_System_Core/05_Skill_Chains/`

```yaml
# example: proposal_chain.yaml
name: "Proposal Generation"
description: "Genera propuesta profesional completa"
trigger: "nueva propuesta para cliente"
steps:
  - skill: "market-proposal"
    input: "{client_name}, {context}"
    output: "proposal_draft.json"
  - skill: "humanizador"
    input: "{proposal_draft.json}"
    output: "proposal_humanized.json"
  - skill: "verificador-datos"
    input: "{proposal_humanized.json}"
    output: "proposal_verified.json"
    required: true  # Si falla, para la chain
  - skill: "deploy-proposal"
    input: "{proposal_verified.json}"
    output: "proposal_url"
```

**Pre-built chains:**
| Chain | Steps | Trigger |
|-------|-------|---------|
| `proposal_chain.yaml` | market-proposal → humanizador → verificador → deploy | "propuesta para [cliente]" |
| `content_chain.yaml` | market-copy → humanizador → dieter-rams → publish | "crear contenido sobre [tema]" |
| `audit_chain.yaml` | seo-audit → verificador → humanizador → report | "auditar [sitio]" |
| `feedback_chain.yaml` | capture_signals → normalize → dashboard → review | "revisar feedback" |

**CLI:**
```bash
python skill_chain.py run proposal_chain --client "Spotify" --context "retention sprint"
python skill_chain.py list                        # Show all chains
python skill_chain.py validate proposal_chain     # Dry-run, check all skills exist
python skill_chain.py --test                      # Smoke test
```

**Edge Cases:**
| Caso | Fix |
|------|-----|
| Skill en chain no existe | `required: true` → abort + error claro. `required: false` → skip + warning |
| Step tarda >60s | Timeout configurable por step |
| Step produce output inválido | Validator antes de pasar al siguiente step |
| Chain se corta a mitad | Estado persistido en `chain_state_{id}.json` → reanudable |
| Windows encoding | UTF-8 fix + `errors="replace"` en cada step |

---

### 1.2 Brain READMEs — Context Organization

**Qué es:** Agregar `README.md` en cada carpeta de contexto que guíe a los agentes sobre qué hay ahí y cuándo usarlo.

**Archivos a crear/modificar:**

| Carpeta | README contenido |
|---------|-----------------|
| `01_Memory/` | "Aquí está la memoria persistente del OS. Usa `engram search` para encontrar contexto de sesiones anteriores." |
| `01_Memory/00_Context_LLM/` | "Contexto para LLMs: soluciones, scripts, referencias. Lee `index.md` primero." |
| `02_Knowledge/` | "Base de conocimiento: templates, docs, configs. Usa `04_Config/` para settings." |
| `03_Learning/` | "Aprendizaje auto-generado: patterns, metrics, telemetry. No editar manualmente." |
| `05_Scripts/` | "Scripts del OS. Siempre importar desde `config_paths.py`. Nunca hardcodear paths." |
| `00_Core/` | "Núcleo del OS: rules, workflows, skills. Archivos críticos — no modificar sin validación." |

**Regla:** Cada README tiene:
1. **Qué hay aquí** (1 línea)
2. **Cuándo usarlo** (agente decision tree)
3. **Cómo acceder** (comando o path)
4. ** qué NO hacer** (guardrails)

---

### 1.3 Integración Skill Chains en Ritual Hub

**Modificar:** `04_Ritual_Hub.py`

Agregar modo `--chain`:
```bash
python 04_Ritual_Hub.py --chain proposal_chain --client "Spotify"
python 04_Ritual_Hub.py --chain content_chain --topic "AI trends"
```

---

## 📦 FASE 2: CAPTURE + CURATION PIPELINE (Semana 2)

**Objetivo:** El OS escucha el mundo externo automáticamente y alimenta el brain.

### 2.1 Capture Engine

**Archivo:** `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/capture_pipeline.py`

**Fuentes de capture:**
| Fuente | Método | Frecuencia |
|--------|--------|------------|
| Email inbox | IMAP/POP3 | Cada 2h |
| Slack messages | Slack API / webhook | Cada 1h |
| Meeting transcripts | Zoom/Meet API | Post-reunión |
| GitHub issues/PRs | GitHub API | Cada 4h |
| Social media mentions | Twitter/LinkedIn API | Cada 6h |
| RSS feeds | Feedparser | Cada 4h |

**Output:** `03_Learning/04_Telemetry/capture_inbox/` — archivos crudos por fuente

**Pipeline:**
```
Source API → capture_pipeline.py → raw_{source}_{timestamp}.json → curation_filter.py → brain/
```

### 2.2 Curation Filter

**Archivo:** `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/curation_filter.py`

**Lógica:**
1. Lee archivos del inbox
2. Para cada item, clasifica: `actionable` | `reference` | `noise`
3. `actionable` → extrae: qué hacer, para cuándo, prioridad → mete en `04_Tasks/`
4. `reference` → extrae: knowledge relevante → mete en brain folder apropiado
5. `noise` → log + archiva en `03_Learning/04_Telemetry/capture_archive/`

**Criterios de clasificación (configurable en YAML):**
```yaml
# curation_rules.yaml
actionable_keywords: ["action required", "deadline", "please review", "urgent", "TODO"]
reference_keywords: ["for your reference", "FYI", "background", "context"]
noise_patterns: ["unsubscribe", "newsletter", "marketing", "no-reply"]
```

### 2.3 Cron Setup

**Task Scheduler:** `CapturePipeline` — cada 2 horas
```bash
python capture_pipeline.py --sources email,slack,github
python curation_filter.py --inbox 03_Learning/04_Telemetry/capture_inbox/
```

---

## 📦 FASE 3: LABS PAGE + EVAL SYSTEM (Semana 3)

**Objetivo:** Prototipos en minutos + calidad medible por output.

### 3.1 Labs Page

**Archivo:** `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/labs_page.py`

**Qué hace:**
1. Toma un input (idea, feature, producto)
2. Ejecuta skill chain de prototipado
3. Genera HTML interactivo (como el demo de Spotify del transcript)
4. Genera link de feedback (usando `show_feedback_dashboard.py`)
5. Colecta respuestas
6. Sintetiza → genera V2

**Flujo:**
```
labs_page.py create --idea "daily playlist para Spotify" --brand spotify
    → genera prototipo HTML en 06_Projects/01_Content/Labs/
    → genera link de feedback
    →_Returns: {prototype_url, feedback_url}

labs_page.py collect --prototype-id "xyz" --min-responses 5
    → colecta respuestas

labs_page.py synthesize --prototype-id "xyz"
    → genera reporte + plan V2
```

### 3.2 Eval System

**Archivo:** `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/output_eval.py`

**Qué hace:** Evalúa la calidad de cada output de agente.

**Criterios de eval:**
```python
EVAL_CRITERIA = {
    "completeness": {"weight": 0.3, "check": "all_required_fields_present"},
    "accuracy": {"weight": 0.25, "check": "facts_match_source"},
    "tone": {"weight": 0.2, "check": "matches_brand_voice"},
    "clarity": {"weight": 0.15, "check": "readability_score"},
    "actionability": {"weight": 0.1, "check": "clear_next_steps"},
}
```

**Output:** Score 0-100 + sugerencias de mejora

**Integración:** Después de cada skill chain step, auto-eval → si score < 70 → retry con feedback

---

## 📦 FASE 4: SIGNAL LOOP INTEGRATION (Semana 4)

**Objetivo:** Cerrar el ciclo — experiencia del customer → feedback → sistema se vuelve más inteligente.

### 4.1 Signal Aggregator

**Archivo:** `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/signal_aggregator.py`

**Fuentes de signal:**
| Signal | Fuente | Métrica |
|--------|--------|---------|
| Content engagement | Analytics APIs | views, likes, shares |
| Proposal conversion | CRM / email | sent → accepted rate |
| Prototype feedback | Labs page | satisfaction score |
| Support tickets | Help desk | volume, resolution time |
| Feature usage | Product analytics | DAU, retention |
| Social mentions | Social APIs | sentiment, volume |

### 4.2 Auto-Learning from Signal

**Modificar:** `learner.py` en Auto-Improvement Engine

Cuando signal es negativo (ej: proposal rechazada):
1. Detectar: `signal_type=rejection, content_id=proposal_123`
2. Auto-analyze: ¿por qué? (pull context del brain)
3. Auto-learn: agregar pattern a `learnings.json`
4. Auto-adjust: actualizar skill relevante con fix

### 4.3 Dashboard Unificado

**Modificar:** `18_Telemetry_Hub.py`

Agregar pestaña "Signal" que muestre:
- Top 5 señales positivas
- Bottom 5 señales negativas
- Tendencia 7d vs 30d
- Action items generados automáticamente

---

## 📋 CHECKLIST MAESTRO

### Fase 1: Skill Chains + Brain
- [ ] 1.1 `skill_chain.py` — engine de chains secuenciales
- [ ] 1.2 Chain definitions YAML (4 chains pre-built)
- [ ] 1.3 Brain READMEs (6 carpetas)
- [ ] 1.4 Integración en `04_Ritual_Hub.py`

### Fase 2: Capture + Curation
- [ ] 2.1 `capture_pipeline.py` — multi-source capture
- [ ] 2.2 `curation_filter.py` — classification + routing
- [ ] 2.3 `curation_rules.yaml` — configurable rules
- [ ] 2.4 Cron setup (Task Scheduler)

### Fase 3: Labs + Eval
- [ ] 3.1 `labs_page.py` — prototipos rapidos + feedback
- [ ] 3.2 `output_eval.py` — quality scoring per output
- [ ] 3.3 Integración eval en skill chains

### Fase 4: Signal Loop
- [ ] 4.1 `signal_aggregator.py` — multi-source signals
- [ ] 4.2 Auto-learning from negative signals
- [ ] 4.3 Dashboard unificado con pestaña Signal

---

## 🔗 CÓMO SE CONECTA CON EL PLAN 10/10

Este plan **extiende** `PLAN_OS_10_10.md` — no lo reemplaza. Los sprints del 10/10 siguen válidos. Este plan agrega la capa de "AI native" que falta.

| Plan 10/10 | Plan AI Native | Relación |
|------------|---------------|----------|
| Sprint 1: Foundation | Fase 1: Skill Chains | Chains usan los paths validados |
| Sprint 2: Intelligence | Fase 2: Capture + Fase 4: Signal | Feedback Loop se integra con Signal Aggregator |
| Sprint 3: Resilience | — | Independiente |
| Sprint 4: UX | Fase 3: Labs Page | Labs es UX para prototipado |
| Sprint 5: Certification | — | Independiente |

---

## 🎯 DEFINICIÓN DE "AI NATIVE" PARA NUESTRO OS

El OS es **AI Native** cuando:

1. ✅ Un agente puede ejecutar un flujo completo (skill chain) sin intervención humana
2. ✅ El OS escucha fuentes externas automáticamente (capture pipeline)
3. ✅ Solo la información relevante entra al brain (curation filter)
4. ✅ Cada output tiene un score de calidad medible (eval system)
5. ✅ Las señales del mercado alimentan mejoras automáticas (signal loop)
6. ✅ Un prototipo se puede crear y validar en < 10 minutos (labs page)

**Test de fuego:** `python skill_chain.py run proposal_chain --client "Test Corp" --context "test"` debe ejecutar 4 steps completos sin intervención y generar una propuesta válida.

---

*Think Different PersonalOS — Plan AI Native v1.0 — 2026-07-14*
