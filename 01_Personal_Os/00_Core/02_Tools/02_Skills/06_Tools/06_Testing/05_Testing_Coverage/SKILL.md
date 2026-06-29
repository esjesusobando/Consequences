---
name: engram-testing-coverage
description: > Triggers on: testing, QA, quality, validation.
  TDD and coverage standards for Engram.
  Trigger: When implementing behavior changes in any package.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## When to Use

Use this skill when:
- Adding new behavior
- Fixing a bug
- Refactoring logic with branch complexity

---

## TDD Loop

1. Write a failing test for the target behavior.
2. Implement the smallest code to pass.
3. Refactor while keeping tests green.
4. Add edge/error-path tests before closing.

---

## Coverage Rules

- Cover happy path + error paths + edge cases.
- Prefer deterministic tests over flaky integration paths.
- Add seams only when branches are impossible to trigger naturally.
- Keep runtime behavior unchanged when adding seams.

---

## Validation Commands

Run:

```bash
go test ./...
go test -cover ./...
```

Report package coverage and total coverage in the PR.

## Esencia Original
> **Propósito:** 06_Testing_Coverage - propósito del skill
> **Flujo:** Pasos principales del flujo de trabajo

## ⚠️ Gotchas (Errores Comunes a Evitar)

- **[ERROR]**: Error común
  - **Por qué**: Explicación
  - **Solución**: Cómo evitar

## 📁 Progressive Disclosure

> Para información detallada:
- [references/guide.md](references/guide.md) — Guía completa

## 🛠️ Scripts

- [scripts/run.py](scripts/run.py) — Script principal

## 💾 State Persistence

Guardar en:
-  — Evaluaciones
-  — Documentación


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
