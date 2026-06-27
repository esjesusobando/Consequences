# Audit Criteria Checklist

## Skill Quality Standards

### 1. Description & Triggers

- [ ] Description has semantic triggers (not marketing text)
- [ ] Triggers match user's actual phrases
- [ ] Example GOOD: "weekly planning, weekly review, reflect on progress"
- [ ] Example BAD: "A comprehensive tool for monitoring..."

### 2. Gotchas Section

- [ ] Has Gotchas section
- [ ] Minimum 3 common errors documented
- [ ] Each gotcha has "Por qué" and "Solución"
- [ ] Gotchas are specific to this skill

### 3. Progressive Disclosure

- [ ] SKILL.md < 200 lines
- [ ] Has references/ folder
- [ ] References point to detailed docs
- [ ] Scripts are in scripts/ folder

### 4. YAML Frontmatter

- [ ] Valid YAML frontmatter (---)
- [ ] Has name field
- [ ] Has description field

### 5. Workflow

- [ ] Has "When to Use" section
- [ ] Has clear workflow steps
- [ ] Output format documented

### 6. Scripts

- [ ] Scripts folder exists
- [ ] Scripts are executable
- [ ] Scripts handle errors gracefully

### 7. State Persistence

- [ ] Mentions state persistence
- [ ] Specifies storage location

### 8. Esencia Original

- [ ] Has "Esencia Original" section
- [ ] Documents original workflow/purpose
- [ ] Doesn't deviate from original intent

## Scoring

| Score                                    | Criteria                                           |
|-----------------------------------------|---------------------------------------------------|
| 90-100%                                  | Excellent                                          |
| 70-89%                                   | Good                                               |
| 50-69%                                   | Needs Improvement                                  |
| < 50%                                    | Failed                                             |

## Audit Process

1. Run `audit-skills.py`
2. Review PASS/FAIL for each criteria
3. Run `validate-essence.py`
4. Run `fix-missing.py` if needed
5. Re-audit after fixes


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
