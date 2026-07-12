# Backlog Deduplication Guide

## Why Deduplication Matters

Duplicate tasks waste time, create confusion, and dilute focus. Every task should exist exactly once.

## How to Deduplicate

### Step 1: Check Existing Tasks

Before creating a new task, search `04_Tasks/` for:

1. **Similar titles** - Check if the new task already exists
2. **Same goal** - Multiple tasks pointing to the same objective
3. **Sub-task** - Whether the new item is a sub-task of an existing one

### Step 2: Calculate Similarity

| Similarity                                  | Action                                                        |
|--------------------------------------------|--------------------------------------------------------------|
| >80%                                        | Merge as sub-task                                             |
| 50-80%                                      | Add reference to existing task                                |
| <50%                                        | Create as new task                                            |

### Step 3: Mark Duplicates

If duplicate found:
- Add `duplicate_of: filename.md` in metadata
- Link from new item to existing task
- Suggest merging to user

## Common Duplicate Patterns

1. **Same task, different wording**
   - "Follow up with James" vs "Message James about API"

2. **Parent task and sub-task**
   - "Build login" vs "Create login form UI"

3. **Research vs Action**
   - "Research AI search" vs "Add AI to search feature"

---

*Part of Backlog Processing Skill - Progressive Disclosure*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
