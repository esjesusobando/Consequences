---
name: skill-creator
description: "Crea nuevas skills para el agente siguiendo estándares Anthropic. Triggers: create skill, nueva skill, skill creator, hacer skill."
version: 1.0.0
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
