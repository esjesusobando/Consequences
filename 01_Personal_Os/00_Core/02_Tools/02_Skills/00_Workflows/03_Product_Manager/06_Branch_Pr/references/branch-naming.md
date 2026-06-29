# Branch Naming Conventions

## Regex Pattern
```
^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$
```

## Format
`type/description` — lowercase, no spaces, only `a-z0-9._-`

## Branch Types

| Type                                       | Pattern                                          | Example                                                 |
|-------------------------------------------|-------------------------------------------------|--------------------------------------------------------|
| Feature                                    | `feat/<desc>`                                    | `feat/user-login`                                       |
| Bug fix                                    | `fix/<desc>`                                     | `fix/zsh-glob-error`                                    |
| Chore                                      | `chore/<desc>`                                   | `chore/update-ci`                                       |
| Docs                                       | `docs/<desc>`                                    | `docs/installation`                                     |
| Style                                      | `style/<desc>`                                   | `style/format`                                          |
| Refactor                                   | `refactor/<desc>`                                | `refactor/extract-logic`                                |
| Performance                                | `perf/<desc>`                                    | `perf/reduce-time`                                      |
| Test                                       | `test/<desc>`                                    | `test/add-coverage`                                     |
| Build                                      | `build/<desc>`                                   | `build/update-deps`                                     |
| CI                                         | `ci/<desc>`                                      | `ci/add-validation`                                     |
| Revert                                     | `revert/<desc>`                                  | `revert/broken-change`                                  |

## Examples

✅ `feat/add-dark-mode`
✅ `fix/login-error`
✅ `docs/update-readme`

❌ `Feature/Add Dark Mode` (wrong case, spaces)
❌ `feat/add dark mode` (spaces)
❌ `feature/add-dark-mode` (wrong type)


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
