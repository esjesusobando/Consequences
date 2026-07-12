---
description: Generates professional product photos (3 or 5 shots) from a photo folder or a store URL, in minimalist, elegant or UGC style, with product-fidelity verification
argument-hint: [photo folder or store URL]
---

# /product-image — Professional product photography

Generates a set of professional product photos from the user's real photos.
Always reply in the user's language.

**Source provided by the user**: $ARGUMENTS
(If empty, ask whether they have a photo folder or their store's URL.)

## Instructions

Follow the full flow defined in the `product-photography` skill (the product-studio plugin's
SKILL.md), section "Workflow: images". In short, skipping none:

1. Check the user's config (`~/.claude/product-studio/config.json`); if missing, walk them through /product-setup first.
2. Get the source images (local folder, or URL extraction + quick **brand analysis** — see `references/store-analysis.md`) and confirm the detected products.
3. Build the **strict inventory** of each product by reading its photos — only what is clearly visible.
4. Ask in ONE AskUserQuestion: **style** (minimalist / elegant / UGC — see `references/styles.md`), **quantity** (3 or 5) and **destination/format** (ecommerce, feed, stories, web — see `references/shot-plans.md`).
5. Load the company's **session template** (`sessions/<company>.md`) or draft one brand-matched to the client and **confirm it with the user** before generating — all photos for one brand share per-shot settings, light, palette and format.
6. Check the category-adaptive shot plan (`references/shot-plans.md`) and the local learnings (`~/.claude/product-studio/learnings.md`).
7. Generate image-to-image with the configured provider (`references/providers.md`), always using the original photo as reference (the one whose angle best matches the shot), with realistic photographic prompts (`references/styles.md`).
8. Run the **consistency QA** on every image against the inventory, the session template AND the AI-artifact checklist; fix mismatches (max 3 attempts) and record the learnings.
9. Deliver to `output/<product>/` with a final summary of what was generated and verified.

Remember the non-negotiable principle: total product fidelity. Never invent or elaborate on
what can't be seen; never silently deliver an image that isn't identical to the real product.
