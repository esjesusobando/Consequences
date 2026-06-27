# Batch Execution Guide

## Why Batches?

- Smaller scope = easier to debug
- Regular checkpoints = early error detection
- Architect review = quality control

## Default Batch Size

**3 tasks per batch**

Adjust based on:
- Task complexity (complex = 2, simple = 5)
- Risk level (high risk = 1-2)
- Time available

## Execution Flow

```
[Batch 1] → Checkpoint → [Batch 2] → Checkpoint → [Batch 3] → Final Review
    ↑                         ↑                         ↑
 Task 1                    Task 4                    Task 7
 Task 2                    Task 5                    Task 8
 Task 3                    Task 6                    Task 9
```

## Checkpoint Report Format

```markdown
## Checkpoint: Batch N Complete

### Completed
- [x] Task N: Description
- [x] Task N+1: Description

### Verification Output
[paste test results]

### Issues Found
- [Any issues]

### Ready for feedback.
```


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
