---
name: engram-tui-quality
description: > Triggers on: testing, QA, quality, validation.
  Bubbletea/Lipgloss quality rules for Engram TUI.
  Trigger: Changes in model, update, view, navigation, or rendering.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## When to Use

Use this skill when:
- Adding screens or menu options
- Changing key bindings or navigation flows
- Updating list rendering and detail views

---

## UX Rules

1. Keyboard behavior must be consistent across screens.
2. Empty/loading/error states must be explicit and readable.
3. Long lists require clear truncation/scroll cues.
4. Back navigation should preserve context predictably.

---

## Test Rules

- Add `update` tests for new key transitions.
- Add `view` tests for new rendering branches.
- Add `model` tests for async commands/data-loading paths.

No TUI behavior change ships without deterministic tests.

## Esencia Original
> **Propósito:** 08_Tui_Quality - propósito del skill
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
