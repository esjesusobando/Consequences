---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\05_Frameworks\13_Engineering_Principles\00_Agentic_Coding_Harness_Principles.md'
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\05_Frameworks\13_Engineering_Principles\00_Agentic_Coding_Harness_Principles.md"
sync_date: "2026-08-01T00:55:48.971577"
sync_updated: true---

# 🏗️ Principios de Ingeniería para Sistemas Agenticos — SOTA 2026

**Fuentes:**
- Karpathy AutoResearch (autonomous AI research)
- OpenAI Codex Harness Engineering (0 lines human-written code)
- Anthropic Harness Design for Long-Running Apps

**Tipo:** INVESTIGACIÓN SOTA + LEARNING ALWAYS (207)
**Fecha:** 2026-07-25

---

## 📂 Fuente 1: Karpathy AutoResearch — Autonomous AI Research

**Repo:** github.com/karpathy/autoresearch
**Idea:** AI agent que modifica código, entrena redes, evalúa resultados, y repite autónomamente.

### Principios Clave

| Principio | Aplicación al OS |
|-----------|-----------------|
| **Single file to modify** — agent solo toca `train.py`. Scope manejable, diffs revisables | **Aplicado:** Cada skill toca un área específica, no todo el OS |
| **Fixed time budget** — 5 min wall-clock. Experimentos comparables sin importar cambios | **Aplicado:** Time-box sessions de mejora de skills (20 min por skill) |
| **Self-contained** — Sin dependencias externas complejas. 1 GPU, 1 file, 1 metric | **Aplicado:** Skills autocontenidas con dependencies claras |
| **program.md = lightweight skill** — Humano programa contexto/instrucciones, agente ejecuta | **Aplicado:** SKILL.md como "program.md" del OS |
| **Minimal surface area** — Solo 3 files importan: fixed, agent-edits, human-edits | **Aplicado:** Separar fixed configs de agent-code de human-instructions |
| **Autonomous overnight experiments** — Modifica, entrena, verifica, keep/discard, repite | **Aplicado:** Background agent que prueba mejoras de skills auto |

---

## 📂 Fuente 2: OpenAI Codex Harness Engineering — 0 Líneas Humanas

**Artículo:** openai.com/engineering/harness-engineering/
**Idea:** Producto completo de 1M líneas con 0 código escrito por humanos. Solo 3 ingenieros.

### Principios Clave

### 1. Humans Guide, Agents Execute
La ingeniería pasa de escribir código a diseñar entornos. Si algo falla, la pregunta no es "esfuérzate más" sino **"¿qué capacidad falta y cómo la hacemos legible y aplicable para el agente?"**

### 2. Knowledge como System of Record
- `AGENTS.md` = **índice**, no enciclopedia (~100 líneas)
- `docs/` = sistema de registro estructurado con diseño, planes, calidad
- **Progressive disclosure:** agente empieza pequeño, se le enseña dónde mirar
- **Verificación mecánica:** linters que verifican que docs estén actualizados

### 3. Agent Clarity is the Goal
Código optimizado para **legibilidad del agente primero**. Si el agente no puede accederlo en contexto, no existe. Conocimiento en Google Docs, Slack o mentes humanas = invisible.

### 4. Enforce Architecture Mechanically
- **Parse, don't validate** — parsea datos en los límites
- Capas fijas con direcciones de dependencia validadas por linters
- Errores de lint incluyen instrucciones de remediación para el agente
- **Constraints permiten velocidad sin decay**

### 5. Performance Changes Integration Philosophy
Cuando throughput del agente > atención humana:
- Las correcciones son económicas, esperar es costoso
- PRs de corta duración, gates mínimos
- Tests flaky → re-run, no bloquear

### 6. AI Garbage Collection (Entropy Management)
- La autonomía total del agente genera desviación ("AI garbage")
- **Golden principles** codificados en el repo
- Background agent recurrente de "doc-gardening" y cleanup
- La deuda técnica es como un préstamo de alto interés — págala continuamente

### 7. Escalando Autonomía
Un solo prompt puede: validar estado → reproducir bug → grabar video → implementar fix → validar → abrir PR → responder comentarios → mergear. **Esto depende de la estructura, no del modelo.**

---

## 📂 Fuente 3: Anthropic Harness Design — Multi-Agent Architecture

**Artículo:** anthropic.com/engineering/harness-design-long-running-apps
**Idea:** Arquitectura multi-agente GAN-style (generator + evaluator) para coding sessions de horas.

### Principios Clave

### 1. GAN-Inspired Multi-Agent Architecture
- **Generator** → produce código
- **Evaluator** → crítica, testea, devuelve feedback
- Loop: generate → evaluate → iterate (5-15 iteraciones)
- Evaluator usa Playwright MCP para navegar la app viva y testear

### 2. Separate Evaluation from Generation
Los agentes son optimistas con su propio trabajo. Un evaluador separado es más fácil de tunear para ser escéptico. El evaluador necesita:
- Criterios GRADABLES (no "es bonito?" sino "sigue nuestros principios de diseño?")
- Few-shot examples con score breakdowns
- Tuning loop: leer logs → encontrar divergencia con juicio humano → actualizar prompt

### 3. Context Resets > Compaction (para tareas largas)
- **Context reset:** limpia contexto completamente + structured handoff (cuesta más pero elimina "context anxiety")
- **Compaction:** resume en el mismo contexto (preserva continuidad pero mantiene ansiedad)
- En Opus 4.5 era necesario el reset. En 4.6+ el modelo puede manejar sesiones continuas.

### 4. Sprint Contracts
Antes de cada sprint, generator y evaluador negocian qué significa "done". Contrato escrito con criterios testables. El evaluador verifica cada criterio.

### 5. Test Load-Bearing Assumptions
Cada componente del harness codifica una asunción sobre lo que el modelo NO puede hacer solo. Cuando el modelo mejora, esas asunciones cambian. **"Find the simplest solution possible, only increase complexity when needed."**

### 6. Structured Artifacts for Handoff
Comunicación entre agentes via archivos. Un agente escribe, otro lee, responde en el mismo archivo o crea uno nuevo.

### 7. Decomposition into Tractable Chunks
- Planner → expande 1-4 sentences en full spec
- Generator → implementa un feature a la vez
- Evaluator → QA con Playwright, gradúa cada sprint

---

## 🎯 Aplicación Directa al Personal OS

| Principio SOTA | Cómo lo aplicamos |
|----------------|-------------------|
| Humans guide, agents execute | Regla 16: Meta-Skill Improvement Loop |
| Knowledge = system of record | `02_Knowledge/` + Engram como segundo cerebro |
| Progressive disclosure | AGENTS.md = índice, Knowledge = profundidad |
| Agent clarity is the goal | Skills optimizadas para lectura del agente |
| Enforce architecture mechanically | Linters + validaciones en HUBs |
| AI garbage collection | Background cleanup tasks |
| Generator + Evaluator | Meta-skill + Skill Auditor |
| Sprint contracts | SDD apply → verify cycle |
| Structured handoff artifacts | Engram topic_keys |
| Test load-bearing assumptions | Revisar reglas cuando el modelo mejora |

---

## 📺 Fuente 4: Harness Engineering Video — 3 Levers + Agent Empathy

**Video:** www.youtube.com/watch?v=UmZytjgs2eo (Sha, 22 min)
**Enfoque:** Práctico — cómo customizar harnesses existentes (Claude Co-work, Claude Code)

### Tres Niveles de Harness

| Nivel | Analogía | Ejemplos | Expertise Requerido |
|-------|----------|----------|-------------------|
| **Off-the-shelf** | Comprar un auto | Claude Co-work, ChatGPT Work | Bajo |
| **Customizable** | Auto de F1 | Claude Code, Cursor, Codex | Medio |
| **Build your own** | Construir desde cero | APIs + custom code | Alto |

### Tres Levers (Palancas de Optimización)

#### 1. CONTEXT — Instrucciones, conocimiento y datos

- **Built-in:** system instructions, metadata (date/location/name), memories
- **claude.md / AGENTS.md:** contexto que se carga SIEMPRE en toda sesión
- **Skills:** progressive disclosure — name + description siempre visible; contenido completo se carga solo al activarse
- **External sources (mejor práctica):** Notion, Obsidian, Google Drive, DBs, Confluence — portables entre AI tools

#### 2. TOOLS — Acciones que el agente puede ejecutar

- **Built-in:** web search, code interpreter
- **MCP Connectors:** Gmail, Notion, Google Drive, Slack, HubSpot, Jira, Canva
- **Skills as tools (scripts dentro de skills):** Keynote CLI, video editing, Railway deploy, YouTube analytics, ConvertKit, MUX, AssemblyAI
- Regla: **Connectors > Skills for tools** si no eres técnico

#### 3. AUTOMATIONS — Cosas que corren automáticamente

- **Built-in:** content screening, file preprocessing, content moderation
- **Scheduled tasks** (`/schedule`): daily call prep, nightly code review
- **Hooks:**
  - Post-session config backup to GitHub
  - Auto-delete screenshots (Playwright MCP)
  - Pre-push review via git hooks gatillando Claude CLI

#### Bonus: EVALS

- **Sin evals:** Human-in-the-loop — tú revisas cada output
- **Con evals:** Agent-in-the-loop — genera → evalúa → itera → presenta
- **Ejemplo Karpathy:** `program.md` en vez de `train.py` escrito a mano; loop overnight

### Mindset Shift: Agent Empathy

> **NO:** "¿Cómo hago esta tarea?"
> **SÍ:** "¿Cómo construyo el harness para que el agente haga esta tarea reliablemente?"

**Pregunta clave:** "Si yo tuviera este context + tools, ¿podría completar la tarea?"
- Si SÍ → buen harness
- Si NO → mejora el harness, no le pidas al agente que se esfuerce más

---

## 📚 Documentos Relacionados

| Doc | Path |
|-----|------|
| Agent Skills Architecture | `02_Knowledge/10_Engineering_Principles/01_Agent_Skills_Architecture.md` |
| AI Agent Evals Framework | `02_Knowledge/10_Engineering_Principles/02_AI_Agent_Evals_Lyft.md` |

---

**Regla asociada:** `00_Core/01_Rules/16_Meta_Skill_Improvement.mdc`
**Knowledge path:** `02_Knowledge/10_Engineering_Principles/00_Agentic_Coding_Harness_Principles.md`
