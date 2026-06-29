# Soul Troubleshooting

## `Minimum Basic plan required`

Soul training needs a paid plan. Tell the user to upgrade.

## `Training failed`

Common causes:

- Too few photos (<5) or too uniform.
- Heavy occlusion (sunglasses, hats).
- Group photos confusing identity.
- Upload type mismatch (must be image uploads, not video).

Action: ask user to swap in better photos, retrain.

## `Session expired`

`higgsfield auth login`.

## Slow training

Default timeout is 30m. If still in progress: `higgsfield soul-id wait <id> --timeout 60m`.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
