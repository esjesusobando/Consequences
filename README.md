# 🧠 Think Different PersonalOS v5.1.0

> **Tu sistema operativo personal para la productividad con IA.**
> No es una app — es un ecosistema completo donde agentes, skills, workflows y memoria persistente trabajan juntos para que tú solo tengas que pensar y crear.

---

## 📋 Tabla de Contenidos

- [Qué es](#qué-es)
- [Qué hace por ti](#qué-hace-por-ti)
- [Arquitectura del sistema](#arquitectura-del-sistema)
- [Componentes principales](#componentes-principales)
- [Cómo funciona el loop AI Native](#cómo-funciona-el-loop-ai-native)
- [Comandos rápidos](#comandos-rápidos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo empezar](#cómo-empezar)

---

## Qué es

PersonalOS es un **sistema operativo personal** construido sobre Python, Engram (memoria persistente) y agentes de IA. Funciona como el "cerebro" de tu productividad:

- **Tú defines** qué quieres lograr (estrategia, gustos, contexto)
- **Los agentes ejecutan** tareas reales (contenido, análisis, prototipos, propuestas)
- **El sistema aprende** de cada resultado para mejorar automáticamente

No es un chatbot. Es un **sistema cerrado** que escucha, decide, ejecuta, mide y mejora.

---

## Qué hace por ti

### 🎯 Antes (sin el OS)
```
Tienes una idea → Buscas herramientas → Copias/pegas entre apps → 
Revisas manualmente → Publicas → No sabes si funcionó → Repites
```

### ⚡ Después (con el OS)
```
Tienes una idea → Dile al OS → El ejecuta todo → Te entrega el resultado →
Mide resultados → Aprende → La próxima vez es mejor
```

### Ejemplos reales

| Quiero... | El OS hace... |
|-----------|---------------|
| "Crear un post para LinkedIn" | Genera draft → lo humaniza → verifica datos → publica → mide engagement |
| "Auditar mi sitio SEO" | Ejecuta auditoría completa → genera reporte con scores → sugiere fixes |
| "Hacer un prototipo de mi app" | Genera HTML interactivo → crea test de usability → colecta feedback → plan V2 |
| "Propuesta para cliente X" | Genera propuesta → la humaniza → verifica → publica → trackea conversión |
| "¿Qué está pasando con mis redes?" | Captura señales de LinkedIn/Twitter/YouTube → clasifica → agrega tendencias → dashboard |
| "¿Qué skill uso para X?" | Analiza tu pregunta → recomienda el skill/agente/workflow correcto con confidence score |

---

## Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERSONALOS v5.1.0                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  PEOPLE  │───▶│  AGENTS  │───▶│ CONTEXT  │───▶│  SPEED   │  │
│  │ (tú)    │    │ (67)     │    │ (memory) │    │ (ejecuta)│  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │                                              │          │
│       │              ┌───────────────────────────────┘          │
│       │              ▼                                          │
│       │         ┌──────────┐    ┌──────────┐                   │
│       │         │ SIGNAL   │───▶│ FEEDBACK │                   │
│       │         │ (mide)   │    │ (aprende)│                   │
│       │         └──────────┘    └──────────┘                   │
│       │              │                                          │
│       │              ▼                                          │
│       │         ┌──────────┐                                   │
│       └────────▶│ SMART    │───▶ Mejora automática             │
│                 │ SYSTEM   │                                   │
│                 └──────────┘                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  397 SKILLS │ 67 AGENTS │ 22 HUBS │ 31 WORKFLOWS │ 16 RULES   │
└─────────────────────────────────────────────────────────────────┘
```

### El Loop AI Native (Modelo Theo Taba)

El OS no solo ejecuta — **aprende y mejora solo**:

```
1. CAPTURE  → Captura señales del mundo (redes, email, GitHub, RSS)
2. CURATE   → Filtra: ¿qué es importante? ¿qué es ruido?
3. EXECUTE  → Ejecuta tareas con agentes y skills
4. SHIP     → Publica contenido, propuestas, prototipos
5. SIGNAL   → Mide resultados (engagement, conversiones, feedback)
6. LEARN    → Auto-mejora: si algo falla 3+ veces, aprende el patrón
7. REPEAT   → La próxima ejecución es mejor
```

---

## Componentes principales

### 🔗 1. Skill Chain Engine (`skill_chain.py`)

**Qué hace:** Ejecuta una secuencia de skills automáticamente sin intervención humana.

**Cómo funciona:**
```
Tú dices: "Crear propuesta para Spotify"
    ↓
skill_chain.py parsea la chain definition (YAML)
    ↓
Step 1: market-proposal → genera propuesta cruda
Step 2: humanizador → hace que suene natural
Step 3: verificador-datos → confirma que todo sea correcto
Step 4: content_analytics → registra para métricas
    ↓
Resultado: propuesta lista + analytics
```

**Chains pre-definidas:**

| Chain | Qué hace | Pasos |
|-------|----------|-------|
| `proposal_chain` | Genera propuesta profesional | market-proposal → humanizador → verificador → analytics |
| `content_chain` | Crea contenido completo | draft → humanizador → review → publish |
| `audit_chain` | Auditoría SEO completa | seo-audit → verificador → humanizador |
| `prototype_chain` | Crea prototipo funcional | hypothesis → build → test → labs |

**Uso:**
```bash
python skill_chain.py run proposal_chain --client "Spotify" --context "retention"
python skill_chain.py run content_chain --topic "AI trends" --platform linkedin
python skill_chain.py list
python skill_chain.py validate proposal_chain
```

---

### 🧪 2. Prototype Studio (`prototype_studio.py`)

**Qué hace:** Crea prototipos funcionales en minutos, no en días.

**Flujo (Modelo Labs Page de Theo Taba):**
```
IDEA → Hipótesis → Prototipo HTML → Test de Usability → Feedback → Síntesis → Plan V2
```

**Qué genera:**
1. **Hipótesis** — Problema, usuario target, métricas de éxito, criterios de aceptación
2. **Prototipo HTML** — Interactivo, autocontenido, con diseño profesional
3. **Test de usability** — 5-8 preguntas (multiple choice + abiertas)
4. **Página de feedback** — Compartible, colecta respuestas automáticamente
5. **Síntesis** — Top 3 fortalezas, top 3 debilidades, lessons learned
6. **Plan V2** — Fixes priorizados (must-have, should-have, nice-to-have)

**Diseños disponibles:**
- **Spotify** — Tema oscuro, acento verde (#1DB954)
- **Minimalist** — Limpio, font del sistema
- **Corporate** — Azul profesional, Inter font
- **Playful** — Naranja cálido, Nunito font

**Uso:**
```bash
python prototype_studio.py run --idea "daily playlist for Spotify" --brand spotify
python prototype_studio.py hypothesis --idea "daily playlist"
python prototype_studio.py build --hypothesis-id "hyp_xxx" --brand spotify
python prototype_studio.py test --prototype-id "proto_xxx"
python prototype_studio.py labs --prototype-id "proto_xxx"
python prototype_studio.py list
```

---

### 📥 3. Curation Filter (`curation_filter.py`)

**Qué hace:** Clasifica señales del mundo exterior y las rutea automáticamente.

**Cómo funciona:**
```
Señal cruda (email, tweet, issue de GitHub)
    ↓
Clasificación por keywords:
    - "action required", "deadline", "urgent" → ACTIONABLE
    - "FYI", "background", "informational" → REFERENCE
    - "unsubscribe", "newsletter", "marketing" → NOISE
    ↓
Deduplicación (SHA-256 fingerprint, ventana 24h)
    ↓
Routing:
    - actionable → daily_inbox/actionable_YYYY-MM-DD.json
    - reference → brain folder (02_Knowledge/ o 01_Memory/)
    - noise → archive/noise_log.json
```

**Reglas configurables** en `curation_rules.yaml`:
```yaml
classification:
  actionable_keywords: ["action required", "deadline", "urgent", "TODO"]
  reference_keywords: ["FYI", "background", "informational"]
  noise_patterns: ["unsubscribe", "newsletter", "marketing"]
deduplication:
  window_hours: 24
priority_weights:
  actionable: 1.0
  reference: 0.5
  noise: 0.0
```

**Uso:**
```bash
python curation_filter.py --inbox-dir capture_inbox/ --verbose
python curation_filter.py --inbox-dir capture_inbox/ --dry-run
python curation_filter.py --test
```

---

### 📊 4. Signal Aggregator (`signal_aggregator.py`)

**Qué hace:** Agrega señales de múltiples fuentes y calcula un score compuesto.

**Fuentes:**
| Fuente | Qué mide | Dónde lee |
|--------|----------|-----------|
| Content Analytics | Views, likes, shares | `content_analytics_*.json` |
| Proposal Conversion | Enviadas → aceptadas | `proposal_*.json` (mock V1) |
| Prototype Feedback | Satisfaction score | `prototype_feedback_*.json` |
| Social Mentions | Sentimiento, volumen | `capture_external_signals` output |

**Score compuesto:**
```
composite = (content × 0.30) + (proposal × 0.25) + (prototype × 0.20) + (social × 0.25)
```

**Tendencias:** Compara últimos 7d vs 30d anteriores. Delta positivo = mejorando.

**Uso:**
```bash
python signal_aggregator.py --once --verbose
python signal_aggregator.py --once --dry-run
python signal_aggregator.py --test
```

---

### 🎯 5. Output Evaluator (`output_eval.py`)

**Qué hace:** Evalúa la calidad de cada output de agente con un score 0-100.

**5 criterios ponderados:**

| Criterio | Peso | Qué verifica |
|----------|------|-------------|
| **Completitud** | 30% | ¿Todos los campos requeridos están presentes? |
| **Precisión** | 25% | ¿Hay números, fuentes, citas? |
| **Tono** | 20% | ¿Es legible, sin jerga excesiva? |
| **Claridad** | 15% | ¿Oraciones cortas, párrafos digestibles? |
| **Accionabilidad** | 10% | ¿Hay next steps, owners, CTAs? |

**Tipos de output:**
- **proposal**: requiere problem, solution, timeline, budget, team
- **content**: requiere headline, body, cta, target_audience
- **report**: requiere summary, findings, recommendations, next_steps

**Integración con Skill Chains:**
```bash
python skill_chain.py run proposal_chain --client "Spotify" --eval
# Cada paso se evalúa automáticamente
# Score < 70 → warning con sugerencias
```

**Uso:**
```bash
python output_eval.py evaluate --input proposal.md --type proposal
python output_eval.py evaluate --input "mi texto" --type content
python output_eval.py batch --input-dir drafts/ --type content
python output_eval.py --test
```

---

### 🔄 6. Learner with Negative Signal Learning (`learner.py`)

**Qué hace:** Aprende AUTOMÁTICAMENTE cuando algo falla.

**Cómo funciona:**
```
Señal negativa detectada (score < 40)
    ↓
¿3+ señales negativas de la misma fuente?
    ↓ SÍ
Extrae pattern: fuente, tipo de problema, count, fechas
    ↓
Sugiere fix: "Considerar mejorar X en Y"
    ↓
Guarda en learnings.json (nunca auto-aplica)
```

**Uso:**
```bash
python learner.py learn-from-signal --signal signal_report.json
```

---

### 💾 7. Disaster Recovery (`engram_snapshot.py`, `engram_restore.py`, `engram_verify.py`)

**Qué hace:** Protege tu memoria persistente contra desastres.

**RTO/RPO:**
- **RPO** (Recovery Point Objective): 24h — snapshot diario
- **RTO** (Recovery Time Objective): < 15 min — restore + verify

**Flujo:**
```bash
# 1. Crear snapshot
python engram_snapshot.py
# → Guarda en 07_Archive/04_Engram_Snapshots/snapshot_YYYY-MM-DD.json.gz
# → Genera checksum SHA-256

# 2. Verificar integridad
python engram_verify.py --latest
# → {valid: true, checksum_ok: true, observation_count: 7800}

# 3. Restaurar (si algo falla)
python engram_restore.py --snapshot snapshot.json.gz --strategy merge
# → merge: agrega nuevos, no sobrescribe existentes
# → replace: sobrescribe todo (cuidado)
```

---

### 📈 8. Benchmarks & Drift Detection (`benchmark_baseline.py`)

**Qué hace:** Calcula baseline de performance y detecta degradación.

**Métricas tracked:**
- Duración de sesiones
- Tokens usados
- Herramientas llamadas
- Skills invocados
- Validators pasados/fallidos

**Drift detection:**
- Compara últimos 7d vs baseline 30d
- Si alguna métrica cambia > 20% → alerta

**Uso:**
```bash
python benchmark_baseline.py --compute
python benchmark_baseline.py --verify
python benchmark_baseline.py --drift
```

---

### 🧪 9. Session Init Test (`session_init_test.py`)

**Qué hace:** Verifica que TODO funcione antes de empezar una sesión.

**Checks:**
1. config_paths — ¿82/82 paths válidos?
2. sync_copies — ¿Archivos sincronizados?
3. structure — ¿Estructura del OS intacta?
4. git — ¿Repo limpio?
5. engram — ¿Memoria persistente accesible?

**Uso:**
```bash
python session_init_test.py --verbose
python session_init_test.py --test
```

---

### 🏆 10. Certification Suite (`certify_10_10.py`)

**Qué hace:** Ejecuta TODOS los validadores y genera reporte de certificación.

**Validadores ejecutados:**
1. config_paths (82/82 paths)
2. sync_copies (archivos sincronizados)
3. system_mapper (estructura)
4. sota_integrity (9/9 checks)
5. parallel_audit (purity score)
6. session_init (health checks)
7. telemetry (dashboard)
8. skill_chain (chains válidos)
9. output_eval (evaluator funcional)
10. curation_filter (classifier funcional)
11. signal_aggregator (aggregator funcional)
12. prototype_studio (studio funcional)

**Uso:**
```bash
python certify_10_10.py --verbose
python certify_10_10.py --json
```

---

### 🚀 11. Onboarding System

**Archivos:**
- `quick_start_guide.md` — Guía de 5 minutos
- `onboarding_checklist.py` — Wizard paso a paso
- `no_se_por_donde_empezar.py` — "No sé por dónde empezar" → recomendación
- `guia_inicio.md` — Quickstart en español

**Uso:**
```bash
# Si no sabes qué hacer
python no_se_por_donde_empezar.py --question "quiero crear un post"
# → Recomienda: content_pipeline.py (90% confidence)

# Primeros pasos
python onboarding_checklist.py --start
# → 6 pasos: config, git, engram, ritual, skills, primer contenido

# Modo simplificado
python 04_Ritual_Hub.py --simple
# → Solo 3 comandos esenciales + tarea del día
```

---

## Cómo funciona el loop AI Native

El sistema se cierra solo. Cada ejecución alimenta la siguiente:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. CAPTURE                                                     │
│     capture_external_signals.py                                 │
│     LinkedIn, Twitter, YouTube, Blog, Newsletter               │
│     → capture_inbox/raw_*.json                                  │
│                                                                 │
│  2. CURATE                                                      │
│     curation_filter.py                                          │
│     Clasifica: actionable / reference / noise                   │
│     → daily_inbox/actionable_*.json                             │
│                                                                 │
│  3. EXECUTE                                                     │
│     skill_chain.py                                              │
│     Ejecuta skills en secuencia                                 │
│     → output.json                                               │
│                                                                 │
│  4. EVAL                                                        │
│     output_eval.py                                              │
│     Score 0-100 + sugerencias                                   │
│     → eval_result.json                                          │
│                                                                 │
│  5. SHIP                                                        │
│     content_pipeline.py / prototype_studio.py                   │
│     Publica contenido o prototipos                              │
│     → published_content.json                                    │
│                                                                 │
│  6. SIGNAL                                                      │
│     signal_aggregator.py                                        │
│     Mide resultados: engagement, conversiones, feedback         │
│     → signal_report.json                                        │
│                                                                 │
│  7. LEARN                                                       │
│     learner.py                                                  │
│     Si score < 40 y 3+ ocurrencias → extrae pattern            │
│     → learnings.json                                            │
│                                                                 │
│  8. REPEAT (mejor)                                              │
│     La próxima ejecución usa los learnings                      │
│     → El OS mejora solo                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Comandos rápidos

### Lo más usado
```bash
# Ritual matutino (tu día en 30 segundos)
python 04_Ritual_Hub.py

# Modo simple (solo lo esencial)
python 04_Ritual_Hub.py --simple

# ¿Qué skill uso para esto?
python skill_discovery.py --interactive

# Crear contenido completo
python content_pipeline.py run --topic "AI trends" --platform linkedin,twitter

# Crear prototipo
python prototype_studio.py run --idea "mi app" --brand spotify

# Ejecutar cadena de skills
python skill_chain.py run content_chain --topic "weekly update"

# Evaluar calidad de output
python output_eval.py evaluate --input mi_post.md --type content

# Ver tendencias de señales
python signal_aggregator.py --once --verbose

# Verificar que todo funcione
python certify_10_10.py --verbose

# Si no sabes qué hacer
python no_se_por_donde_empezar.py --question "tu pregunta aquí"
```

### Emergencias
```bash
# Backup de Engram
python engram_snapshot.py

# Restaurar Engram
python engram_restore.py --snapshot snapshot.json.gz

# Verificar integridad
python engram_verify.py --latest

# Detectar degradación
python benchmark_baseline.py --drift
```

---

## Estructura del proyecto

```
Think_Different/
├── README.md                          # Este archivo
├── PLAN_OS_10_10.md                   # Plan maestro 5 sprints
├── PLAN_AI_NATIVE.md                  # Plan AI Native 4 fases
├── PLAN_SOTA_GAPS.md                  # 10 gaps SOTA
│
├── 01_Personal_Os/
│   ├── 00_Core/
│   │   ├── 00_Workflows/             # Workflows y rituales
│   │   ├── 01_Rules/                 # Reglas del sistema (.mdc)
│   │   └── 02_Tools/
│   │       ├── 01_Agents/            # 67 agentes
│   │       └── 02_Skills/            # 397 skills
│   │
│   ├── 01_Memory/                    # Memoria persistente
│   ├── 02_Knowledge/                 # Base de conocimiento
│   │   ├── 04_Config/               # Configs (curation_rules.yaml)
│   │   └── 04_Docs/Runbooks/        # 7 runbooks operacionales
│   │
│   ├── 03_Learning/                  # Aprendizaje auto-generado
│   │   ├── 01_Auto_Improvement/     # Engine de mejora
│   │   └── 04_Telemetry/            # Métricas y dashboards
│   │
│   ├── 05_Scripts/
│   │   └── 00_HUBs/03_Scripts_Os/   # Scripts principales
│   │       ├── skill_chain.py         # Motor de cadenas
│   │       ├── prototype_studio.py    # Prototipado rápido
│   │       ├── curation_filter.py     # Clasificación señales
│   │       ├── signal_aggregator.py   # Agregación señales
│   │       ├── output_eval.py         # Evaluación calidad
│   │       ├── learner.py             # Auto-mejora
│   │       ├── engram_snapshot.py     # DR backup
│   │       ├── engram_restore.py      # DR restore
│   │       ├── engram_verify.py       # DR verify
│   │       ├── benchmark_baseline.py  # Performance baselines
│   │       ├── session_init_test.py   # Pre-session tests
│   │       ├── certify_10_10.py       # Certificador maestro
│   │       ├── onboarding_checklist.py # TUI onboarding
│   │       ├── no_se_por_donde_empezar.py # NL recommendation
│   │       └── ... (50+ scripts más)
│   │
│   └── 07_Archive/                   # Archivos históricos
│
├── 02_Playground/                    # Experimentos
└── 03_Equipos/                       # Equipos de trabajo
```

---

## Cómo empezar

### Si eres nuevo (5 minutos)

1. **Lee la guía rápida:**
   ```bash
   cat quick_start_guide.md
   ```

2. **Ejecuta el onboarding:**
   ```bash
   python onboarding_checklist.py --start
   ```

3. **Primer comando:**
   ```bash
   python 04_Ritual_Hub.py --simple
   ```

### Si ya sabes qué quieres

1. **Descubre el skill correcto:**
   ```bash
   python skill_discovery.py --interactive
   ```

2. **Ejecuta una cadena:**
   ```bash
   python skill_chain.py list
   python skill_chain.py run <chain_name> --param value
   ```

3. **Crea contenido:**
   ```bash
   python content_pipeline.py run --topic "tu tema" --platform linkedin
   ```

### Si algo falla

1. **Verifica el sistema:**
   ```bash
   python certify_10_10.py --verbose
   ```

2. **Lee el runbook de incidentes:**
   ```bash
   cat 02_Knowledge/04_Docs/Runbooks/INCIDENT_RESPONSE.md
   ```

3. **Restaura desde backup:**
   ```bash
   python engram_snapshot.py  # Crear backup primero
   python engram_restore.py --snapshot <latest>
   ```

---

## Estadísticas del sistema

| Métrica | Valor |
|---------|-------|
| Skills | 397 |
| Agentes | 67 |
| HUBs | 22 |
| Workflows | 31 |
| Rules | 16 |
| Scripts nuevos (esta sesión) | 25+ |
| Líneas de código (esta sesión) | 10,000+ |
| Tests (esta sesión) | 100+ |
| Runbooks | 7 |

---

## Tecnologías

- **Python 3.14** — Lenguaje principal
- **Engram** — Memoria persistente (MCP server)
- **OpenCode** — Orquestación de agentes
- **SQLite** — Almacenamiento local
- **YAML** — Configuraciones
- **JSON** — Intercambio de datos
- **HTML** — Prototipos autocontenidos

---

## Licencia

Proyecto personal — Think Different PersonalOS v5.1.0

---

*Creado con ❤️ por Think Different — 2026*
