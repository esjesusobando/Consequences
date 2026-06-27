# Document Review Output Template

Use this **exact format** when presenting synthesized review findings. Findings are grouped by severity, not by reviewer.

**IMPORTANT:** Use pipe-delimited markdown tables (`| col | col |`). Do NOT use ASCII box-drawing characters.

## Example

```markdown
## Document Review Results

**Document:** 04_Operations/05_Plans/2026-03-15-feat-user-auth-plan.md
**Type:** plan
**Reviewers:** coherence, feasibility, security-lens, scope-guardian
- security-lens -- plan adds public API endpoint with auth flow
- scope-guardian -- plan has 15 requirements across 3 priority levels

### Auto-fixes Applied

- Standardized "pipeline"/"workflow" terminology to "pipeline" throughout (coherence, auto)
- Fixed cross-reference: Section 4 referenced "Section 3.2" which is actually "Section 3.1" (coherence, auto)

### P0 -- Must Fix

| #                                    | Section                                             | Issue                                                                                                                 | Reviewer                                    | Confidence                                    | Route                                      |
|-------------------------------------|----------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|--------------------------------------------|----------------------------------------------|-------------------------------------------|
| 1                                    | Requirements Trace                                  | Goal states "offline support" but technical approach assumes persistent connectivity                                  | coherence                                   | 0.92                                          | `present`                                  |

### P1 -- Should Fix

| #                                    | Section                                                | Issue                                                                                               | Reviewer                                        | Confidence                                    | Route                                      |
|-------------------------------------|-------------------------------------------------------|----------------------------------------------------------------------------------------------------|------------------------------------------------|----------------------------------------------|-------------------------------------------|
| 2                                    | Implementation Unit 3                                  | Plan proposes custom auth when codebase already uses Devise                                         | feasibility                                     | 0.85                                          | `present`                                  |
| 3                                    | Scope Boundaries                                       | 8 of 12 units build admin infrastructure; only 2 touch stated goal                                  | scope-guardian                                  | 0.80                                          | `present`                                  |

### P2 -- Consider Fixing

| #                                    | Section                                     | Issue                                                                                   | Reviewer                                       | Confidence                                    | Route                                      |
|-------------------------------------|--------------------------------------------|----------------------------------------------------------------------------------------|-----------------------------------------------|----------------------------------------------|-------------------------------------------|
| 4                                    | API Design                                  | Public webhook endpoint has no rate limiting mentioned                                  | security-lens                                  | 0.75                                          | `present`                                  |

### P3 -- Minor

| #                                    | Section                                    | Issue                                                                                        | Reviewer                                    | Confidence                                    | Route                                    |
|-------------------------------------|-------------------------------------------|---------------------------------------------------------------------------------------------|--------------------------------------------|----------------------------------------------|-----------------------------------------|
| 5                                    | Overview                                   | "Service" used to mean both microservice and business class                                  | coherence                                   | 0.65                                          | `auto`                                   |

### Residual Concerns

| #                                    | Concern                                                                                             | Source                                       |
|-------------------------------------|----------------------------------------------------------------------------------------------------|---------------------------------------------|
| 1                                    | Migration rollback strategy not addressed for Phase 2 data changes                                  | feasibility                                  |

### Deferred Questions

| #                                    | Question                                                                             | Source                                                      |
|-------------------------------------|-------------------------------------------------------------------------------------|------------------------------------------------------------|
| 1                                    | Should the API use versioned endpoints from launch?                                  | feasibility, security-lens                                  |

### Coverage

| Persona                                         | Status                                         | Findings                                    | Residual                                    |
|------------------------------------------------|-----------------------------------------------|--------------------------------------------|--------------------------------------------|
| coherence                                       | completed                                      | 2                                           | 0                                           |
| feasibility                                     | completed                                      | 1                                           | 1                                           |
| security-lens                                   | completed                                      | 1                                           | 0                                           |
| scope-guardian                                  | completed                                      | 1                                           | 0                                           |
| product-lens                                    | not activated                                  |--------------------------------------------|--------------------------------------------|
| design-lens                                     | not activated                                  |--------------------------------------------|--------------------------------------------|
```

## Section Rules

- **Auto-fixes Applied**: List fixes that were applied automatically (auto class). Omit section if none.
- **P0-P3 sections**: Only include sections that have findings. Omit empty severity levels.
- **Residual Concerns**: Findings below confidence threshold that were promoted by cross-persona corroboration, plus unpromoted residual risks. Omit if none.
- **Deferred Questions**: Questions for later workflow stages. Omit if none.
- **Coverage**: Always include. Shows which personas ran and their output counts.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
