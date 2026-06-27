# Task Template

## Bug Template (Sibling Tasks)

```markdown
## Description

**Current State:**
- What's broken
- Impact on users

**Expected State:**
- What should happen

## Acceptance Criteria
- [ ] Fix bug X
- [ ] Add regression test

## Technical Notes
- Affected files: `path/to/file`

## Testing
- [ ] Reproduce bug
- [ ] Verify fix
- [ ] Run regression tests
```

## Feature Template (Parent + Children)

### Parent (User-facing)
```markdown
## Description
{User-facing description}

## User Story
As a {user}, I want to {action} so that {benefit}.

## Acceptance Criteria
- [ ] User can {do something}

## Child Tasks
- [ ] [FEATURE] {Name} (API)
- [ ] [FEATURE] {Name} (UI)
```

### Child (Technical)
```markdown
## Description
Technical implementation for {component}.

## Parent Task
[FEATURE] {Name}

## Acceptance Criteria (Technical)
- [ ] {Technical requirement}

## Related Tasks
- Parent: {link}
- Blocked by: {link}
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
