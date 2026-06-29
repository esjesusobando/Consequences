---
name: sdd-design
description: >
  Create technical design document with architecture decisions and approach.
  Trigger: When the orchestrator launches you to write or update the technical design for a change.
  Triggers on: "design this change", "write design doc", "technical design for", "architecture decisions", "how to implement", "design approach".
license: MIT
metadata:
  author: gentleman-programming
  version: "2.0"
sota_upgraded: true
---

## Esencia Original

- **Metaskill**: El diseño puentea QUÉ (specs) y CÓMO (código). Captura decisiones de arquitectura con fundamento para que equipos futuros entiendan POR QUÉ el sistema funciona así.
- **Propósito original**: Hacer explícitas y documentadas las decisiones arquitectónicas. Cada elección de diseño debe incluir alternativas consideradas y el fundamento de la selección — para que futuros desarrolladores no repitan el mismo análisis.

## Purpose

You are a sub-agent responsible for TECHNICAL DESIGN. You take the proposal and specs, then produce a `design.md` that captures HOW the change will be implemented — architecture decisions, data flow, file changes, and technical rationale.

## What You Receive

From the orchestrator:
- Change name
- Artifact store mode (`engram | openspec | hybrid | none`)

## Execution and Persistence Contract

> Follow **Section B** (retrieval) and **Section C** (persistence) from `skills/_shared/sdd-phase-common.md`.

- **engram**: Read `sdd/{change-name}/proposal` (required) and `sdd/{change-name}/spec` (optional — may not exist if running in parallel with sdd-spec). Save as `sdd/{change-name}/design`.
- **openspec**: Read and follow `skills/_shared/openspec-convention.md`.
- **hybrid**: Follow BOTH conventions — persist to Engram AND write `design.md` to filesystem. Retrieve dependencies from Engram (primary) with filesystem fallback.
- **none**: Return result only. Never create or modify project files.

## What to Do

### Step 1: Load Skills
Follow **Section A** from `skills/_shared/sdd-phase-common.md`.

### Step 2: Read the Codebase

Before designing, read the actual code that will be affected:
- Entry points and module structure
- Existing patterns and conventions
- Dependencies and interfaces
- Test infrastructure (if any)

### Step 3: Write design.md

**IF mode is `openspec` or `hybrid`:** Create the design document:

```
openspec/changes/{change-name}/
├── proposal.md
├── specs/
└── design.md              ← You create this
```

**IF mode is `engram` or `none`:** Do NOT create any `openspec/` directories or files. Compose the design content in memory — you will persist it in Step 4.

#### Design Document Format

```markdown
# Design: {Change Title}

## Technical Approach

{Concise description of the overall technical strategy.
How does this map to the proposal's approach? Reference specs.}

## Architecture Decisions

### Decision: {Decision Title}

**Choice**: {What we chose}
**Alternatives considered**: {What we rejected}
**Rationale**: {Why this choice over alternatives}

### Decision: {Decision Title}

**Choice**: {What we chose}
**Alternatives considered**: {What we rejected}
**Rationale**: {Why this choice over alternatives}

## Data Flow

{Describe how data moves through the system for this change.
Use ASCII diagrams when helpful.}

    Component A ──→ Component B ──→ Component C
         │                              │
         └──────── Store ───────────────┘

## File Changes

| File                  | Action  | Description             |
|----------------------|--------|------------------------|
| `path/to/new-file.ext`| Create  | {What this file does}   |
| `path/to/existing.ext`| Modify  | {What changes and why}  |
| `path/to/old-file.ext`| Delete  | {Why it's being removed}|

## Interfaces / Contracts

{Define any new interfaces, API contracts, type definitions, or data structures.
Use code blocks with the project's language.}

## Testing Strategy

| Layer      | What to Test | Approach  |
|-----------|-------------|----------|
| Unit       | {What}       | {How}     |
| Integration| {What}       | {How}     |
| E2E        | {What}       | {How}     |

## Migration / Rollout

{If this change requires data migration, feature flags, or phased rollout, describe the plan.
If not applicable, state "No migration required."}

## Open Questions

- [ ] {Any unresolved technical question}
- [ ] {Any decision that needs team input}
```

### Step 4: Persist Artifact

**This step is MANDATORY — do NOT skip it.**

Follow **Section C** from `skills/_shared/sdd-phase-common.md`.
- artifact: `design`
- topic_key: `sdd/{change-name}/design`
- type: `architecture`

### Step 5: Return Summary

Return to the orchestrator:

```markdown
## Design Created

**Change**: {change-name}
**Location**: `openspec/changes/{change-name}/design.md` (openspec/hybrid) | Engram `sdd/{change-name}/design` (engram) | inline (none)

### Summary
- **Approach**: {one-line technical approach}
- **Key Decisions**: {N decisions documented}
- **Files Affected**: {N new, M modified, K deleted}
- **Testing Strategy**: {unit/integration/e2e coverage planned}

### Open Questions
{List any unresolved questions, or "None"}

### Next Step
Ready for tasks (sdd-tasks).
```

## ⚠️ Gotchas

### Gotcha 1: Diseñar sin leer el codebase primero
- **Por qué**: Es tentador proponer una solución "ideal" genérica sin conocer las estructuras y patrones existentes.
- **Solución**: Leer los archivos reales que serán afectados antes de escribir el diseño. El diseño debe reflejar los patrones del proyecto, no patrones genéricos. Si el proyecto usa repositorios, el diseño debe usar repositorios.

### Gotcha 2: Sobre-ingeniería — diseñar para escenarios futuros fuera del alcance
- **Por qué**: "Podríamos necesitar esto después" lleva a abstracciones prematuras y complejidad innecesaria.
- **Solución**: El diseño debe resolver el problema actual, no adivinar el futuro. YAGNI (You Ain't Gonna Need It). Si un escenario futuro es probable, documentarlo como "consideración futura" pero no diseñar para él hoy.

### Gotcha 3: Omisión de estrategia de migración/rollout
- **Por qué**: Los cambios que requieren migración de datos, feature flags o despliegue gradual a menudo asumen que "todo se actualiza a la vez".
- **Solución**: Siempre incluir una sección de "Migration / Rollout". Preguntar: ¿hay datos existentes que migrar? ¿podemos desplegar en fases? ¿cómo detectamos problemas en producción? Si no aplica, decirlo explícitamente.

## 💾 State Persistence

El estado de esta fase se persiste en:
- **Change folder**: `openspec/changes/{change-name}/design.md` (modos `openspec` e `hybrid`).
- **Engram observations**: Via `mem_save` con `topic_key: sdd/{change-name}/design`, `type: architecture`.
- **Modo `none`**: Solo retorno inline, sin persistencia en disco.

## Rules

- ALWAYS read the actual codebase before designing — never guess
- Every decision MUST have a rationale (the "why")
- Include concrete file paths, not abstract descriptions
- Use the project's ACTUAL patterns and conventions, not generic best practices
- If you find the codebase uses a pattern different from what you'd recommend, note it but FOLLOW the existing pattern unless the change specifically addresses it
- Keep ASCII diagrams simple — clarity over beauty
- Apply any `rules.design` from `openspec/config.yaml`
- If you have open questions that BLOCK the design, say so clearly — don't guess
- **Size budget**: Design artifact MUST be under 800 words. Architecture decisions as tables (option | tradeoff | decision). Code snippets only for non-obvious patterns.
- Return envelope per **Section D** from `skills/_shared/sdd-phase-common.md`.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
