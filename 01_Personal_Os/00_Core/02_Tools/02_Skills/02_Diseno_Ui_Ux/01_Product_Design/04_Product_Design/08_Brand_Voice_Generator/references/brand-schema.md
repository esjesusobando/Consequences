# Brand.json Schema

```json
{
  "name": "Brand Name",
  "tagline": "Brand tagline",
  "colors": {
    "primary": "#XXXXXX",
    "secondary": "#XXXXXX",
    "accent": "#XXXXXX",
    "background": "#XXXXXX",
    "text": "#XXXXXX"
  },
  "fonts": {
    "heading": "Font Name",
    "body": "Font Name",
    "mono": "Font Name"
  },
  "logo": {
    "main": "path/to/logo.svg",
    "icon": "path/to/icon.svg"
  },
  "audience": {
    "primary": "Description of primary audience",
    "pain_points": ["pain1", "pain2"],
    "goals": ["goal1", "goal2"]
  },
  "values": ["value1", "value2", "value3"]
}
```

## Required Fields
- name
- colors.primary
- fonts.heading
- fonts.body
- audience.primary

## Optional Fields
- tagline
- logo
- values


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
