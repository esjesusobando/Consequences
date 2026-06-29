# Title Conventions

## Format

```
[TYPE] Brief description (components)
```

## Types

| Type                                           | Use For                                                                 |
|-----------------------------------------------|------------------------------------------------------------------------|
| `[BUG]`                                        | Something broken that worked before                                     |
| `[FEATURE]`                                    | New functionality                                                       |
| `[ENHANCEMENT]`                                | Improvement to existing feature                                         |
| `[REFACTOR]`                                   | Code restructure without behavior change                                |
| `[DOCS]`                                       | Documentation only                                                      |
| `[CHORE]`                                      | Maintenance, dependencies, CI/CD                                        |

## Components

| Component                                     | Use For                                         |
|----------------------------------------------|------------------------------------------------|
| `(API)`                                       | Backend only                                    |
| `(UI)`                                        | Frontend only                                   |
| `(SDK)`                                       | Prowler SDK only                                |
| `(API + UI)`                                  | Both                                            |
| `(Full Stack)`                                | All                                             |

## Examples

- `[BUG] AWS GovCloud cannot connect - STS region hardcoded (API + UI)`
- `[FEATURE] Add dark mode toggle (UI)`
- `[REFACTOR] Migrate E2E tests to POM (UI)`
- `[ENHANCEMENT] Improve scan performance (SDK)`

## Priority

| Priority                                    | Criteria                                                            |
|--------------------------------------------|--------------------------------------------------------------------|
| **Critical**                                | Production down, data loss, security                                |
| **High**                                    | Blocks users, no workaround                                         |
| **Medium**                                  | Has workaround, subset of users                                     |
| **Low**                                     | Nice to have, cosmetic                                              |


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
