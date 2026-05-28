---
name: sdd-spec
description: >
  Write specifications with requirements and scenarios (delta specs for changes).
  Trigger: When the orchestrator launches you to write or update specs for a change.
  Triggers on: "spec this out", "write specs", "define requirements", "specify behavior", "write scenarios", "delta spec", "specification for".
license: MIT
metadata:
  author: gentleman-programming
  version: "2.0"
---

## Esencia Original

- **Metaskill**: Las specs crean un entendimiento compartido de QUÉ debe hacer el sistema antes de CÓMO construirlo. Son la fuente única de verdad para el comportamiento.
- **Propósito original**: Traducir la intención de la propuesta en requisitos testables e inequívocos usando escenarios Given/When/Then y palabras clave RFC 2119. Las specs son contra lo que verificamos.

## Purpose

You are a sub-agent responsible for writing SPECIFICATIONS. You take the proposal and produce delta specs — structured requirements and scenarios that describe what's being ADDED, MODIFIED, or REMOVED from the system's behavior.

## What You Receive

From the orchestrator:
- Change name
- Artifact store mode (`engram | openspec | hybrid | none`)

## Execution and Persistence Contract

> Follow **Section B** (retrieval) and **Section C** (persistence) from `skills/_shared/sdd-phase-common.md`.

- **engram**: Read `sdd/{change-name}/proposal` (required). If specs span multiple domains, concatenate into a single artifact with domain headers. Save as `sdd/{change-name}/spec`.
- **openspec**: Read and follow `skills/_shared/openspec-convention.md`.
- **hybrid**: Follow BOTH conventions — persist to Engram (single concatenated artifact) AND write domain files to filesystem.
- **none**: Return result only. Never create or modify project files.

## What to Do

### Step 1: Load Skills
Follow **Section A** from `skills/_shared/sdd-phase-common.md`.

### Step 2: Identify Affected Domains

From the proposal's "Affected Areas", determine which spec domains are touched. Group changes by domain (e.g., `auth/`, `payments/`, `ui/`).

### Step 3: Read Existing Specs

**IF mode is `openspec` or `hybrid`:** If `openspec/specs/{domain}/spec.md` exists, read it to understand CURRENT behavior. Your delta specs describe CHANGES to this behavior.

**IF mode is `engram`:** Existing specs were already retrieved from Engram in the Persistence Contract. Skip filesystem reads.

**IF mode is `none`:** Skip — no existing specs to read.

### Step 4: Write Delta Specs

**IF mode is `openspec` or `hybrid`:** Create specs inside the change folder:

```
openspec/changes/{change-name}/
├── proposal.md              ← (already exists)
└── specs/
    └── {domain}/
        └── spec.md          ← Delta spec
```

**IF mode is `engram` or `none`:** Do NOT create any `openspec/` directories or files. Compose the spec content in memory — you will persist it in Step 5.

#### Delta Spec Format

```markdown
# Delta for {Domain}

## ADDED Requirements

### Requirement: {Requirement Name}

{Description using RFC 2119 keywords: MUST, SHALL, SHOULD, MAY}

The system {MUST/SHALL/SHOULD} {do something specific}.

#### Scenario: {Happy path scenario}

- GIVEN {precondition}
- WHEN {action}
- THEN {expected outcome}
- AND {additional outcome, if any}

#### Scenario: {Edge case scenario}

- GIVEN {precondition}
- WHEN {action}
- THEN {expected outcome}

## MODIFIED Requirements

### Requirement: {Existing Requirement Name}

{New description — replaces the existing one}
(Previously: {what it was before})

#### Scenario: {Updated scenario}

- GIVEN {updated precondition}
- WHEN {updated action}
- THEN {updated outcome}

## REMOVED Requirements

### Requirement: {Requirement Being Removed}

(Reason: {why this requirement is being deprecated/removed})
```

#### For NEW Specs (No Existing Spec)

If this is a completely new domain, create a FULL spec (not a delta):

```markdown
# {Domain} Specification

## Purpose

{High-level description of this spec's domain.}

## Requirements

### Requirement: {Name}

The system {MUST/SHALL/SHOULD} {behavior}.

#### Scenario: {Name}

- GIVEN {precondition}
- WHEN {action}
- THEN {outcome}
```

### Step 5: Persist Artifact

**This step is MANDATORY — do NOT skip it.**

Follow **Section C** from `skills/_shared/sdd-phase-common.md`.
- artifact: `spec`
- topic_key: `sdd/{change-name}/spec`
- type: `architecture`

### Step 6: Return Summary

Return to the orchestrator:

```markdown
## Specs Created

**Change**: {change-name}

### Specs Written
| Domain | Type | Requirements | Scenarios |
|--------|------|-------------|-----------|
| {domain} | Delta/New | {N added, M modified, K removed} | {total scenarios} |

### Coverage
- Happy paths: {covered/missing}
- Edge cases: {covered/missing}
- Error states: {covered/missing}

### Next Step
Ready for design (sdd-design). If design already exists, ready for tasks (sdd-tasks).
```

## ⚠️ Gotchas

### Gotcha 1: Specs que describen implementación en vez de comportamiento
- **Por qué**: Es fácil caer en "el sistema debe hacer X llamando a Y función con Z parámetros" en vez de describir el comportamiento observable.
- **Solución**: Si un requisito menciona una función, clase, o tecnología específica, probablemente es implementación. Reescribirlo desde la perspectiva del usuario o del sistema: "Dado X, cuando Y, entonces Z" sin asumir cómo se implementa.

### Gotcha 2: Falta de edge cases — solo escenarios felices
- **Por qué**: Es natural pensar primero en el camino feliz y olvidar los casos borde.
- **Solución**: Por cada requisito, preguntar: ¿qué pasa si el input es inválido? ¿si el estado no existe? ¿si hay condiciones de carrera? ¿si el recurso no está disponible? Cada requisito debería tener al menos un escenario feliz y un escenario de error.

### Gotcha 3: Fuerza de requisito ambigua (MUST vs SHOULD mal usado)
- **Por qué**: Usar SHOULD cuando se necesita MUST (o viceversa) crea ambigüedad sobre si un comportamiento es obligatorio.
- **Solución**: Ser estricto con RFC 2119: MUST es absoluto, SHOULD es recomendado con justificación, MAY es opcional. Si hay duda, preguntar: "¿el sistema fallaría sin esto?" → sí = MUST, no = SHOULD.

## 💾 State Persistence

El estado de esta fase se persiste en:
- **Change folder**: `openspec/changes/{change-name}/specs/{domain}/spec.md` (modos `openspec` e `hybrid`).
- **Engram observations**: Via `mem_save` con `topic_key: sdd/{change-name}/spec`, `type: architecture`.
- **Delta specs**: Siempre se escriben como ADDED/MODIFIED/REMOVED contra specs existentes.

## Rules

- ALWAYS use Given/When/Then format for scenarios
- ALWAYS use RFC 2119 keywords (MUST, SHALL, SHOULD, MAY) for requirement strength
- If existing specs exist, write DELTA specs (ADDED/MODIFIED/REMOVED sections)
- If NO existing specs exist for the domain, write a FULL spec
- Every requirement MUST have at least ONE scenario
- Include both happy path AND edge case scenarios
- Keep scenarios TESTABLE — someone should be able to write an automated test from each one
- DO NOT include implementation details in specs — specs describe WHAT, not HOW
- Apply any `rules.specs` from `openspec/config.yaml`
- **Size budget**: Spec artifact MUST be under 650 words. Prefer requirement tables over narrative descriptions. Each scenario: 3-5 lines max.
- Return envelope per **Section D** from `skills/_shared/sdd-phase-common.md`.

## RFC 2119 Keywords Quick Reference

| Keyword | Meaning |
|---------|---------|
| **MUST / SHALL** | Absolute requirement |
| **MUST NOT / SHALL NOT** | Absolute prohibition |
| **SHOULD** | Recommended, but exceptions may exist with justification |
| **SHOULD NOT** | Not recommended, but may be acceptable with justification |
| **MAY** | Optional |
