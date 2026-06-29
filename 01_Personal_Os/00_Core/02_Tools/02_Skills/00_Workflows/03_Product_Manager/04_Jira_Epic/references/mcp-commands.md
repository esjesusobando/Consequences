# Jira MCP Commands

## Create Epic

```json
{
  "project_key": "PROWLER",
  "summary": "[EPIC] Feature name",
  "issue_type": "Epic",
  "additional_fields": {
    "customfield_10359": {"value": "UI"}
  }
}
```

## Update Work Item Description (Wiki Markup)

```json
{
  "customfield_10363": "h2. Feature Overview\n\nOverview text\n\nh2. Requirements\n\n*Section*\n* Item 1\n* Item 2"
}
```

## Create Child Task

```json
{
  "project_key": "PROWLER",
  "summary": "[FEATURE] Task name",
  "issue_type": "Task",
  "additional_fields": {
    "parent": "PROWLER-XXX",
    "customfield_10359": {"value": "UI"}
  }
}
```

## Workflow Transitions

```
Backlog (10037) → To Do (14) → In Progress (11) → Done (21)
                → Blocked (10)
```

## Wiki Markup Cheat Sheet

| Markdown                                    | Jira Wiki                                   |
|--------------------------------------------|--------------------------------------------|
| `## Header`                                 | `h2. Header`                                |
| `**bold**`                                  | `*bold*`                                    |
| `- item`                                    | `* item`                                    |
| `- [ ] task`                                | `* [ ] task`                                |


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
