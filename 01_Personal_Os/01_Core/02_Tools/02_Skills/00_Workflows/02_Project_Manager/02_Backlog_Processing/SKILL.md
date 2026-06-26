---
name: backlog-processing
description: "Complete PersonalOS workflow — backlog triage, morning standup, content generation, weekly review. Triggers: process backlog, what should I work on today, write a blog post, weekly review, clear my backlog."
---

# PersonalOS Complete Workflow Skill

> Based on the original PersonalOS methodology (personal-os-main).  
> Turns messy notes into tasks, sets daily focus, generates content in your voice, and reviews weekly progress.

## 🎯 Esencia Original

El repo original de PersonalOS tiene 4 workflows fundamentales:
1. **Backlog Processing** — "Process my backlog" → tareas priorizadas
2. **Morning Standup** — "What should I work on today?" → foco del día
3. **Content Generation** — "Write a blog post" → contenido en tu voz
4. **Weekly Review** — "What did I accomplish this week?" → reflexión + planificación

Esta skill integra los 4 en un solo sistema operativo de productividad.

---

## 📋 Workflow 1: Backlog Processing

**Trigger:** "Process my backlog", "Clear my backlog", "Triage my notes"

### Flujo Completo

1. **Leer contexto estratégico**
   - `00_Winter_is_Coming/GOALS.md` → Objetivos actuales
   - `00_Winter_is_Coming/BACKLOG.md` → Items pendientes
   - `engram mem_context` → Contexto previo

2. **Extraer items del backlog**
   - Cada línea que empieza con `- ` es un item accionable
   - Ignorar líneas vacías, headers, comentarios

3. **Clasificar con inteligencia** (script: `backlog-triage.py`)
   - **Ready to create**: items claros con contexto suficiente
   - **Needs clarification**: items ambiguos (regex patterns detectan vaguedad)
   - **Potential duplicates**: SequenceMatcher con threshold 0.6

4. **Crear tareas con YAML frontmatter**
   - Categoría automática por keywords
   - Prioridad por keywords (P0: urgent/critical, P1: important/tomorrow, P2: plan/improve, P3: someday/maybe)
   - Goal alignment automático contra GOALS.md
   - Contenido enriquecido por categoría (next actions específicas)

5. **Limpiar BACKLOG.md**
   - Solo después de confirmar con usuario
   - Agregar fecha de limpieza

6. **Guardar en Engram**
   - `mem_save` con resumen de tareas creadas

### Template de Tarea

```yaml
---
title: [Nombre descriptivo]
category: [technical|outreach|research|writing|content|admin|personal|marketing|other]
priority: [P0|P1|P2|P3]
status: n  # n=not_started, s=started, b=blocked, d=done
created_date: [YYYY-MM-DD]
due_date: [YYYY-MM-DD]  # opcional
resource_refs:
  - 00_Winter_is_Coming/GOALS.md
---

# [Nombre]

## Context
Vinculado a: Meta "[nombre de meta]"

## Next Actions
- [ ] Acción específica 1
- [ ] Acción específica 2

## Progress Log
- YYYY-MM-DD: Notas, bloqueos, decisiones.
```

### Categorías

| Categoría | Descripción | Ejemplos |
|-----------|-------------|----------|
| technical | build, fix, configure | "Fix login bug", "Deploy API" |
| outreach | communicate, meet | "Email James", "1:1 with Mike" |
| research | learn, analyze | "Analyze competitor", "Study pricing" |
| writing | draft, document | "Write blog post", "Draft proposal" |
| content | social media, video | "LinkedIn post", "Newsletter" |
| admin | operations, finance | "Submit expense", "Update budget" |
| marketing | campaigns, growth | "Launch ad campaign", "SEO audit" |
| personal | health, routines | "Exercise", "Read 30 min" |

### Prioridades

| Priority | Significado | Límite |
|----------|-------------|--------|
| P0 | Esta semana, crítico | max 3 |
| P1 | Este mes, importante | max 7 |
| P2 | Programado | sin límite |
| P3 | Algún día | sin límite |

### Deduplicación

Antes de crear tarea:
1. Buscar en `01_Personal_Os/03_Task/` por título similar
2. SequenceMatcher con threshold 0.6
3. Si similarity > 0.8 → merge (actualizar existente)
4. Si similarity 0.6-0.8 → revisar con usuario

### Errores Comunes

- ❌ Crear tarea sin vincular a GOALS
- ❌ No preguntar cuando falta contexto
- ❌ Olvidar actualizar BACKLOG.md
- ❌ No guardar en Engram
- ❌ Crear tareas duplicadas

---

## ☀️ Workflow 2: Morning Standup

**Trigger:** "What should I work on today?", "Plan my day", "Qué hago hoy"

### Flujo

1. **Leer tareas activas**
   - `01_Personal_Os/03_Task/*.md` (status: n o s)
   - Filtrar por prioridad (P0 > P1 > P2)

2. **Verificar goal alignment**
   - Cada tarea debe vincular a un goal en GOALS.md
   - Si no tiene goal → preguntar si crear uno

3. **Sugerir top 3 prioridades**
   - Máximo 3 tareas para el día
   - Estimar tiempo por tarea
   - Incluir tareas bloqueadas como nota

4. **Identificar blockers**
   - Tareas con status: b
   - Sugerir acciones para desbloquear

### Output Esperado

```
## Top 3 Prioridades Hoy

1. [P0] Fix login bug (est: 2h) — bloquea usuarios
2. [P1] Email James about API (est: 30min) — relacionado con goal Q1
3. [P1] Write blog post draft (est: 1h) — publicar viernes

## Blockers
- "API integration spec" — esperando estimados de engineering (5 días)
  → Sugerencia: follow up con James lunes AM

## Tareas disponibles si hay tiempo
- [P2] Research AI search feature
- [P2] Update documentation
```

### Variaciones

- **"I'm overwhelmed"** → "What's the ONE thing I should focus on?"
- **"I only have 2 hours"** → "What can I realistically finish?"
- **"Remind me what I was doing"** → "What did I work on yesterday and what's next?"

---

## ✍️ Workflow 3: Content Generation

**Trigger:** "Write a blog post", "Draft an email", "Create LinkedIn post", "Write content"

### Flujo

1. **Buscar voice samples**
   - `01_Personal_Os/02_Knowledge/voice-samples/` → muestras de escritura
   - Si no existen → preguntar preferencias de tono

2. **Buscar voice guide**
   - `01_Personal_Os/02_Knowledge/voice-guide.md` → guía de voz
   - Si no existe → crear con muestras o usar defaults

3. **Gather context**
   - Blog → Knowledge docs + GOALS.md para positioning
   - Email → Task file para contexto del destinatario
   - Social → Posts recientes + GOALS.md para temas

4. **Draft con voice principles**
   - Lead con el punto más interesante (no throat-clearing)
   - Párrafos cortos (2-3 oraciones max)
   - Tono conversacional pero profesional
   - Evitar clichés de AI ("Key insight", "Here's the thing")

5. **Presentar draft con opciones**
   - Ajustar tono (más casual / más formal)
   - Acortar o expandir secciones
   - Cambiar estructura o énfasis

### Voice Principles

**Structure:**
- Lead with the most interesting point
- Short paragraphs (2-3 sentences max)
- Clear, direct sentences

**Tone:**
- Conversational but professional
- Confident without being salesy
- Specific over vague

**Avoid:**
- "Key insight" / "Here's the thing" / "Let's be real"
- "I hope this email finds you well"
- Em dashes (use commas or periods)
- Excessive emojis or bullet points
- Rhetorical questions followed by answers

### Crear Voice Guide (sub-workflow)

1. Pedir 5-10 muestras de escritura
2. Guardar en `Knowledge/voice-samples/`
3. Analizar patrones → crear `Knowledge/voice-guide.md`

---

## 📊 Workflow 4: Weekly Review

**Trigger:** "Weekly review", "What did I accomplish this week?", "Plan next week"

### Flujo (15-30 minutos)

#### Paso 1: Revisar trabajo completado
```
What did I accomplish this week?
```
- Listar tareas completadas (status: d)
- Agrupar por goal alignment
- Calcular tiempo invertido

#### Paso 2: Check goal progress
```
How am I tracking against my quarterly goals?
```
- Para cada goal en GOALS.md:
  - ¿Cuántas tareas completadas lo apoyan?
  - ¿Está on track, needs attention, o at risk?
  - ¿Qué falta para completarlo?

#### Paso 3: Identificar blockers
```
What's blocked or stalled?
```
- Tareas con status: b (blocked)
- Tareas started pero sin progreso esta semana
- Sugerir acciones para desbloquear

#### Paso 4: Planificar próxima semana
```
Help me plan next week. What should my top priorities be?
```
- Must do (P0/P1)
- Should do (P2)
- If time allows (P3)
- Time budget: deep work vs meetings vs buffer

### Output Esperado

```
## Weekly Review — Week 3 of Q1

### Completed (12 tasks)
- "Ship Q1 roadmap": 4 tasks (roadmap, 2 specs, stakeholder review)
- "Improve activation": 2 tasks (checkout analysis, interviews)
- "Build thought leadership": 1 task (blog post published)
- Maintenance: 5 tasks

### Goal Progress
| Goal | Status | Notes |
|------|--------|-------|
| Ship Q1 roadmap | 🟢 On track | Presentation done, specs 60% |
| Improve activation | 🟡 Needs attention | Research done, no implementation |
| Build thought leadership | 🟢 On track | 1 of 4 posts published |

### Blockers (3)
1. "API integration spec" — waiting 5 days → follow up Monday
2. "User research synthesis" — waiting transcripts → check with team
3. "Mobile prototype review" — waiting 7 days → escalate

### Next Week Focus
1. Unblock API integration
2. Start checkout flow implementation
3. Write next blog post (due Friday)
```

---

## 🔧 Scripts Disponibles

### backlog-triage.py
```bash
# Analizar backlog
python backlog-triage.py

# Crear tareas
python backlog-triage.py --create-tasks

# Auto-crear (sin duplicates)
python backlog-triage.py --auto-create

# Full pipeline (analyze + create + clear)
python backlog-triage.py --full-process

# Output JSON
python backlog-triage.py --json
```

**Features:**
- SequenceMatcher dedup (threshold 0.6)
- Ambiguity detection (regex patterns)
- Clarification question generation
- Category guess por keywords
- Priority suggestion por type + keywords
- Goal alignment automático
- Rich task content generation by category

---

## 📁 Progressive Disclosure

Para información detallada de cada workflow:
- [references/dedup-guide.md](references/dedup-guide.md) — Guía de deduplicación
- [references/priority-matrix.md](references/priority-matrix.md) — Matriz de prioridades

---

## 🛠️ Integración con Skills

Esta skill funciona con:
- **personal-os**: Skill principal del sistema
- **sdd-workflow**: Para tareas que necesitan specs
- **system-guardian**: Para validar estructura después de cambios
- **engram**: Para persistencia de memoria entre sesiones

---

## 📋 Errores Comunes a Evitar

1. ❌ Crear tarea sin vincular a GOALS
2. ❌ No preguntar cuando falta contexto
3. ❌ Olvidar actualizar BACKLOG.md
4. ❌ No guardar en Engram
5. ❌ Mezclar templates (usar el correcto según complejidad)
6. ❌ No hacer weekly review (el backlog crece sin control)
7. ❌ Crear tareas sin validar con usuario

---

## 💡 Tips

- **Backlog**: Dump todo durante el día, procesa una vez al día
- **Morning**: Hacer ANTES de revisar email/Slack
- **Content**: Siempre buscar voice samples primero
- **Weekly**: Bloquear 30 min en calendario, hacer en espacio tranquilo
- **Dedup**: SIEMPRE verificar antes de crear tareas nuevas

---

*Based on: personal-os-main/examples/workflows/ | Enhanced for: Think Different PersonalOS v4.9.1*
