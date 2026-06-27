# Products

Two ways to register a product: URL fetch (auto-imports title, description, images) or manual (provide your own).

## URL fetch (default)

```bash
ID=$(higgsfield marketing-studio products fetch --url https://shop.example.com/sneakers --wait --json | jq -r .id)
```

`--wait` polls until `status` is `completed` or `failed`. Default timeout 90s.

If `failed`, check `fail_reason` — usually invalid URL or scrape blocked.

App Store URLs auto-route to `webproducts` (different endpoint). Use:

```bash
higgsfield marketing-studio webproducts fetch --url https://apps.apple.com/... --wait
```

## Manual

When the user has product photos and details:

```bash
A=$(higgsfield upload create shoe1.png)
B=$(higgsfield upload create shoe2.png)
higgsfield marketing-studio products create \
  --title "AeroRun Pro" \
  --description "Lightweight running shoe" \
  --image $A --image $B
```

Returns the product entity directly (no polling needed).

## Manual webproduct

For App Store / web pages without URL fetch:

```bash
higgsfield marketing-studio webproducts create \
  --url "https://example.com" \
  --title "MyApp" \
  --subtitle "Productivity for teams" \
  --description "..." \
  --favicon-url "https://example.com/favicon.png" \
  --desktop "https://cdn/screenshot1.png" \
  --mobile "https://cdn/mobile-screenshot.png"
```

## Listing

```bash
higgsfield marketing-studio products list
higgsfield marketing-studio products list --json
higgsfield marketing-studio webproducts list
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
