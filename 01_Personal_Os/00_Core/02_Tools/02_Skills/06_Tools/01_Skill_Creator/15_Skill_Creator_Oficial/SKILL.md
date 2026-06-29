---
name: skill-creator
description: "Crea nuevas skills para el agente siguiendo estándares Anthropic. Triggers: create skill, nueva skill, skill creator, hacer skill."
version: 1.0.0
sota_upgraded: true
---

# Skill Creator

## Propósito

Crear nuevas skills para el ecosistema PersonalOS siguiendo estándares Anthropic SOTA.

## Cuándo Usar

- "create skill"
- "nueva skill"
- "skill creator"
- Al necesitar una nueva habilidad para el agente

## Estándares

### YAML Frontmatter
```yaml
---
name: skill-name
description: "Descripcion con triggers"
version: 1.0.0
---
```

### Estructura Requerida
- name: lowercase, gerund
- description: triggers semánticos
- Gotchas: 3+ errores comunes
- Esencia Original: propósito de la skill

## Estructura de Skill

```
skill-folder/
├── SKILL.md           # Required
├── references/        # Optional (docs > 200 líneas)
├── scripts/          # Optional
└── assets/          # Optional
```

---

*Skill Version: 1.0.0*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
