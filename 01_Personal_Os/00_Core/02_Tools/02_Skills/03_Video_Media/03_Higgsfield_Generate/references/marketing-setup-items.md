# Marketing Studio Hooks And Settings

Marketing Studio setup items are optional reusable context for `marketing_studio_video`.

- **Hook** (`--hook_id`) sets the opening angle / ad hook. The hook prompt is prepended to the user prompt; it does not replace `--prompt`.
- **Setting** (`--setting_id`) sets the scene or environment context.
- Supported by `marketing_studio_video` only. Do not pass setup items to `marketing_studio_image`.
- **Mode whitelist.** Setup items are valid only for these `--mode` values: `ugc`, `ugc_how_to`, `ugc_unboxing`, `product_review`, `ugc_virtual_try_on`. For `product_showcase`, `tv_spot`, `wild_card`, `virtual_try_on` — do not pass `--hook_id` / `--setting_id`. See `marketing-modes.md` for the full table.
- **Mutually exclusive with ad references.** If the user is generating from an ad reference video, do **not** also pass `--hook_id` / `--setting_id`. The two paths (reference-driven vs composed-from-blocks) cannot be combined.

## Discover Items

```bash
higgsfield marketing-studio hooks list
higgsfield marketing-studio settings list
```

Use `--json` when the agent needs IDs:

```bash
higgsfield marketing-studio hooks list --json
higgsfield marketing-studio settings list --json
```

Filter large lists with search:

```bash
higgsfield marketing-studio hooks list --search sale --json
higgsfield marketing-studio settings list --search office --json
```

The response shape is:

- `items`: setup items with `id`, `name`, `prompt`, `source`, optional `type`, optional media URLs, and pin/status metadata.
- `cursor`: cursor for the next page.
- `has_more`: whether another page exists.

## Generate With Setup Items

Pass one or both IDs:

```bash
PRODUCT_IDS_JSON=$(mktemp)
printf '["<product_id>"]' > "$PRODUCT_IDS_JSON"

higgsfield generate create marketing_studio_video \
  --prompt "..." \
  --mode ugc \
  --product_ids @"$PRODUCT_IDS_JSON" \
  --hook_id <hook_id> \
  --setting_id <setting_id> \
  --duration 15 \
  --aspect_ratio 9:16 \
  --wait
```

When using `--hook_id`, pass product context whenever possible. Hooks are designed to transition into a product pitch and are weak without `product_ids`.

`--mode` is optional; it defaults to `ugc`. Pass it only when the user wants a specific non-default style.

For UGC modes, `--avatars` is optional if the brief clearly mentions a person; the backend can synthesize a Soul Character. Pass `--avatars` when the user selected a specific presenter.

If the CLI returns `Unknown params: hook_id` or `Unknown params: setting_id`, do not retry with that flag for the selected `job_set_type`; its schema does not support setup items.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
