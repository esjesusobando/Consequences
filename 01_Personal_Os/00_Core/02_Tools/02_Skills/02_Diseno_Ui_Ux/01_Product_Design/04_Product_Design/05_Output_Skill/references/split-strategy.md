# Split Strategy

## When to Split
When hitting token limits, split CLEANLY:

### Rules
1. Split at natural boundaries (between functions, components)
2. Never split mid-function
3. Never split mid-line
4. Mark split points clearly

### Split Format
```markdown
## Part 1 of N

[content]

---
继续继续继续 (Continuing in Part 2...)

## Part 2 of N

[content]
```

### Continuation Command
User says: "继续" or "continue" or "next part"
→ Continue exactly where left off

### Response to "Summarize"
If user asks for summary instead of full code:
→ Ask: "Do you want the full code or a summary?"


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
