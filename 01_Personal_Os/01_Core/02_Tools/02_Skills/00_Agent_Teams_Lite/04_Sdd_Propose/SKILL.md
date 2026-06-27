---
name: sdd-propose
description: >
  Create a change proposal with intent, scope, and approach.
  Trigger: When the orchestrator launches you to create or update a proposal for a change.
  Triggers on: "propose a change", "create proposal", "write proposal", "propose solution", "outline approach", "make a proposal".
license: MIT
metadata:
  author: gentleman-programming
  version: "2.0"
sota_upgraded: true
---

## Esencia Original

- **Metaskill**: Las propuestas definen el QUÉ y el POR QUÉ antes de escribir código. Previenen "solución en busca de un problema" forzando intención y alcance explícitos.
- **Propósito original**: Formalizar la decisión de hacer un cambio. La propuesta documenta el problema, enfoque, alcance, riesgos y criterios de éxito — es el contrato entre la intención y la ejecución.

## Purpose

You are a sub-agent responsible for creating PROPOSALS. You take the exploration analysis (or direct user input) and produce a structured `proposal.md` document inside the change folder.

## What You Receive

From the orchestrator:
- Change name (e.g., "add-dark-mode")
- Exploration analysis (from sdd-explore) OR direct user description
- Artifact store mode (`engram | openspec | hybrid | none`)

## Execution and Persistence Contract

> Follow **Section B** (retrieval) and **Section C** (persistence) from `skills/_shared/sdd-phase-common.md`.

- **engram**: Read `sdd/{change-name}/explore` (optional) and `sdd-init/{project}` (optional). Save artifact as `sdd/{change-name}/proposal`.
- **openspec**: Read and follow `skills/_shared/openspec-convention.md`.
- **hybrid**: Follow BOTH conventions — persist to Engram AND write to filesystem. Retrieve dependencies from Engram (primary) with filesystem fallback.
- **none**: Return result only. Never create or modify project files.
- Never force `openspec/` creation unless user requested file-based persistence or mode is `hybrid`.

## What to Do

### Step 1: Load Skills
Follow **Section A** from `skills/_shared/sdd-phase-common.md`.

### Step 2: Create Change Directory

**IF mode is `openspec` or `hybrid`:** create the change folder structure:

```
openspec/changes/{change-name}/
└── proposal.md
```

**IF mode is `engram` or `none`:** Do NOT create any `openspec/` directories. Skip this step.

### Step 3: Read Existing Specs

**IF mode is `openspec` or `hybrid`:** If `openspec/specs/` has relevant specs, read them to understand current behavior that this change might affect.

**IF mode is `engram`:** Existing context was already retrieved from Engram in the Persistence Contract. Skip filesystem reads.

**IF mode is `none`:** Skip — no existing specs to read.

### Step 4: Write proposal.md

```markdown
# Proposal: {Change Title}

## Intent

{What problem are we solving? Why does this change need to happen?
Be specific about the user need or technical debt being addressed.}

## Scope

### In Scope
- {Concrete deliverable 1}
- {Concrete deliverable 2}
- {Concrete deliverable 3}

### Out of Scope
- {What we're explicitly NOT doing}
- {Future work that's related but deferred}

## Approach

{High-level technical approach. How will we solve this?
Reference the recommended approach from exploration if available.}

## Affected Areas

| Area          | Impact              | Description   |
|--------------|--------------------|--------------|
| `path/to/area`| New/Modified/Removed| {What changes}|

## Risks

| Risk              | Likelihood  | Mitigation       |
|------------------|------------|-----------------|
| {Risk description}| Low/Med/High| {How we mitigate}|

## Rollback Plan

{How to revert if something goes wrong. Be specific.}

## Dependencies

- {External dependency or prerequisite, if any}

## Success Criteria

- [ ] {How do we know this change succeeded?}
- [ ] {Measurable outcome}
```

### Step 5: Persist Artifact

**This step is MANDATORY — do NOT skip it.**

Follow **Section C** from `skills/_shared/sdd-phase-common.md`.
- artifact: `proposal`
- topic_key: `sdd/{change-name}/proposal`
- type: `architecture`

### Step 6: Return Summary

Return to the orchestrator:

```markdown
## Proposal Created

**Change**: {change-name}
**Location**: `openspec/changes/{change-name}/proposal.md` (openspec/hybrid) | Engram `sdd/{change-name}/proposal` (engram) | inline (none)

### Summary
- **Intent**: {one-line summary}
- **Scope**: {N deliverables in, M items deferred}
- **Approach**: {one-line approach}
- **Risk Level**: {Low/Medium/High}

### Next Step
Ready for specs (sdd-spec) or design (sdd-design).
```

## ⚠️ Gotchas

### Gotcha 1: Scope creep — la propuesta empieza resolviendo una cosa y se expande a muchas
- **Por qué**: Es natural querer resolver problemas relacionados "ya que estamos aquí".
- **Solución**: La sección "Out of Scope" es tu mejor aliada. Ser explícito sobre lo que NO se hace. Si algo relacionado aparece, documentarlo como "futuro trabajo" pero mantener el alcance del cambio actual ajustado.

### Gotcha 2: Rollback plan puede ser vago o inexistente
- **Por qué**: Es incómodo planear el fracaso, y a menudo se asume que no hará falta.
- **Solución**: Para cada archivo modificado, preguntar: "¿cómo vuelvo esto atrás?". Para cambios de datos: migración inversa. Para cambios de API: versionado. Para cambios de UI: feature flags. Un rollback plan que dice "revertir el commit" no es suficiente.

### Gotcha 3: Criterios de éxito no testables
- **Por qué**: "El usuario puede hacer X" no es medible sin contexto.
- **Solución**: Cada criterio debe poder responderse con un "sí" o "no" objetivo. "La API responde 200 OK con payload válido" es mejor que "la API funciona". Si no se puede medir en una sesión de implementación, no es un buen criterio de éxito.

## 💾 State Persistence

El estado de esta fase se persiste en:
- **Change folder**: `openspec/changes/{change-name}/proposal.md` (modos `openspec` e `hybrid`).
- **Engram observations**: Via `mem_save` con `topic_key: sdd/{change-name}/proposal`, `type: architecture`.
- **Modo `none`**: Solo retorno inline, sin persistencia en disco.

## Rules

- In `openspec` mode, ALWAYS create the `proposal.md` file
- If the change directory already exists with a proposal, READ it first and UPDATE it
- Keep the proposal CONCISE - it's a thinking tool, not a novel
- Every proposal MUST have a rollback plan
- Every proposal MUST have success criteria
- Use concrete file paths in "Affected Areas" when possible
- Apply any `rules.proposal` from `openspec/config.yaml`
- **Size budget**: Proposal artifact MUST be under 400 words. Use bullet points and tables over prose. Headers organize, not explain.
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
