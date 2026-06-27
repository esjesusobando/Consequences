# MCP Tools

## Server
- Name: `@open-pencil/mcp`
- Install: `npm install -g @open-pencil/mcp`

## Tools

### generate_screen
Creates complete screens from prompts.

```json
{
  "tool": "generate_screen",
  "params": {
    "prompt": "A modern dashboard with sidebar navigation",
    "style": "premium",
    "output": "dashboard.pen"
  }
}
```

### modify_component
Adjusts styles and properties of existing components.

```json
{
  "tool": "modify_component",
  "params": {
    "component": "button-primary",
    "changes": {
      "color": "#3B82F6",
      "borderRadius": "8px"
    }
  }
}
```

### export_to_code
Generates code snippets from designs.

```json
{
  "tool": "export_to_code",
  "params": {
    "design": "dashboard.pen",
    "framework": "react-tailwind"
  }
}
```

## Output Formats
- `.pen`: Pencil source file
- `.tsx`: React component
- `.css`: Pure CSS
- `.svg`: Vector export


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
