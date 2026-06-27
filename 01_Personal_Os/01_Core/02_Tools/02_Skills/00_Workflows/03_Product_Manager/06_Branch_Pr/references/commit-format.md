# Conventional Commits Format

## Regex Pattern
```
^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z0-9\._-]+\))?!?: .+
```

## Format
`type(scope): description` or `type: description`

## Types

| Type                                          | Use For                                         | PR Label                                              |
|----------------------------------------------|------------------------------------------------|------------------------------------------------------|
| `feat`                                        | New feature                                     | `type:feature`                                        |
| `fix`                                         | Bug fix                                         | `type:bug`                                            |
| `docs`                                        | Documentation                                   | `type:docs`                                           |
| `refactor`                                    | Code restructure                                | `type:refactor`                                       |
| `chore`                                       | Maintenance                                     | `type:chore`                                          |
| `style`                                       | Formatting                                      | `type:chore`                                          |
| `perf`                                        | Performance                                     | `type:feature`                                        |
| `test`                                        | Tests                                           | `type:chore`                                          |
| `build`                                       | Build system                                    | `type:chore`                                          |
| `ci`                                          | CI/CD                                           | `type:chore`                                          |
| `revert`                                      | Undo change                                     | `type:bug`                                            |
| `feat!`/`fix!`                                | Breaking                                        | `type:breaking-change`                                |

## Examples

```
feat(scripts): add Codex support to setup.sh
fix(skills): correct topic key format
docs(readme): update configuration guide
refactor(skills): extract shared logic
chore(ci): add shellcheck validation
perf(scripts): reduce execution time
style(skills): fix markdown formatting
test(scripts): add integration tests
ci(workflows): add branch validation
revert: undo broken change
feat!: redesign skill loading
```

## Rules

1. Lowercase after colon
2. No period at end
50 chars max for subject
4. Blank line between subject and body
5. Body explains WHAT and WHY, not HOW


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
