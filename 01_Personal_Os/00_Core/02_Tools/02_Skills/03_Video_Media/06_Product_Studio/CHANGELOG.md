# Changelog

## 0.4.0 — 2026-07-10

- **Brand-match mode**: when the source is a store URL, the skill analyzes the client's brand
  (palette, positioning, current aesthetic) and adapts the chosen style to it; the session
  template proposal is always confirmed with the user before generating. New reference
  `store-analysis.md` (robust product extraction — Shopify `.js` endpoint, og:image, JSON-LD —
  plus the brand analysis).
- **Realism rules** in `styles.md`: photographic language (optics, depth of field, light
  quality), physical materials, natural imperfection, no "8k/masterpiece" incantations; the
  three style prompt fragments enriched accordingly.
- **Category-adaptive shots** in `shot-plans.md`: what hero/detail/context mean per category
  (footwear, fashion, cosmetics, food, tech, home, jewelry).
- **Channel & format choice**: images target a destination (ecommerce 1:1/4:5, feed 4:5,
  stories 9:16, web 16:9) fixed in the session template.
- **QA hardened**: explicit AI-artifact checklist (warped logos/text, duplicated parts,
  impossible shadows/reflections, waxy textures, altered proportions).
- Higgsfield ops notes from real runs: where results appear, polling cadence, silent-failure
  retry, absolute download paths.

## 0.3.0 — 2026-07-10

- The skill is now fully generic: all references to specific brands, companies or "the team"
  removed. Styles apply to any product in the world.
- `styles.md` rewritten: "house signature" replaced by a product-first shared base (the product
  is the only protagonist; the palette complements the product's own colors), and the canonical
  scenes replaced by multi-category example scenes (fashion, cosmetics, food, tech, home,
  jewelry) to adapt to each product.
- Prompt building emphasizes the product and image quality: scene adapted to the product's
  category and scale, sharp focus on the product in every style fragment.
- Session templates (`sessions/`) are now local working data, excluded from the repository.

## 0.2.0 — 2026-07-09

- Full translation of the plugin to English (README, skill, references, commands, metadata).
  The skill always replies in the user's language regardless.
- Internal files renamed: `estilos.md` → `styles.md`, `planos.md` → `shot-plans.md`,
  `proveedores.md` → `providers.md`, `sesiones/` → `sessions/`, learnings file
  `aprendizajes.md` → `learnings.md`, config keys in English.

## 0.1.0 — 2026-07-09

First version.

- `/product-setup`, `/product-image` and `/product-video` commands.
- Three house styles defined from the team's real references: minimalist,
  elegant (warm quiet-luxury editorial) and UGC (outfit-check aesthetic).
- Total product fidelity: strict inventory of what's visible, generation always
  image-to-image with a reference, attribute-by-attribute QA and a correction loop (max 3 attempts).
- Per-company session templates (`sessions/<company>.md`): a brand's whole catalog
  shares per-shot settings, light and palette.
- Per-user local learnings in `~/.claude/product-studio/learnings.md`.
- Providers: Higgsfield (MCP), Fal.ai (REST API) or a custom tool.
- Tested end-to-end with real products: 3 sandals (10 images, 1 logo-correction
  cycle) and 1 cosmetic with text-dense packaging (image + 5s locked-camera video).
