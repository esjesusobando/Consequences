# Critical Pattern Template

Use this template when adding a pattern to `05_Scripts/06_Solutions/patterns/critical-patterns.md`:

---

## N. [Pattern Name] (ALWAYS REQUIRED)

### ❌ WRONG ([Will cause X error])
```[language]
[code showing wrong approach]
```

### ✅ CORRECT
```[language]
[code showing correct approach]
```

**Why:** [Technical explanation of why this is required]

**Placement/Context:** [When this applies]

**Documented in:** `05_Scripts/06_Solutions/[category]/[filename].md`

---

**Instructions:**
1. Replace N with the next pattern number
2. Replace [Pattern Name] with descriptive title
3. Fill in WRONG example with code that causes the problem
4. Fill in CORRECT example with the solution
5. Explain the technical reason in "Why"
6. Clarify when this pattern applies in "Placement/Context"
7. Link to the full troubleshooting doc where this was originally solved


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
