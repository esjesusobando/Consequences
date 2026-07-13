---
name: product-photography
version: "0.4.0"
description: Generates professional AI product photography and video from low-quality photos or a store URL. Use this skill WHENEVER the user runs /product-image, /product-video or /product-setup, or asks to improve product photos, create product images for ecommerce or social media, generate a product video, or mentions product photography, packshots, photos for their online store, or the minimalist, elegant or UGC styles. Also trigger it when the user shares a folder of product photos or a store URL and wants professional visual content, even if they never say the word "photography".
argument-hint: 'photo folder or store URL'
allowed-tools: Bash, Read, Write, Edit, AskUserQuestion, WebFetch, WebSearch
author: Lorena Bordonaba
homepage: https://github.com/lorena-bordonaba-pau/product-studio
repository: https://github.com/lorena-bordonaba-pau/product-studio
license: MIT
user-invocable: true
---

# Product Photography Studio

Skill for generating professional AI product photography and video of any product. The user provides real photos of their product (even low-quality ones) or a store URL, and the skill produces professional images and simple videos that are always faithful to the real product.

Always reply to the user in their own language — the language of these instructions does not define the conversation language.

## The non-negotiable principle: total product fidelity

This skill exists to sell REAL products. A beautiful image of a product that doesn't exist is worse than useless: it misleads the customer and causes returns. Therefore:

- **Never invent anything about the product.** If the original photo doesn't show the sole of the shoe, don't describe it in the prompt or let the model imagine it as a prominent detail.
- **Don't elaborate on what is unclear.** A blurry logo, a doubtful seam, illegible text: they do NOT go into the prompt and, where possible, stay out of frame or away from focal areas.
- **Emphasize what IS visible.** Exact colors, shape, materials, visible finishes: that is what the prompt must pin down precisely.
- **Verify before delivering.** Every generated image is compared with the original product attribute by attribute. If it isn't identical, it gets corrected. Never silently deliver something that doesn't match.

## Per-user configuration

Before generating anything, read `~/.claude/product-studio/config.json`. If it doesn't exist, tell the user to run `/product-setup` first (or walk them through configuration right then).

```json
{
  "provider": "higgsfield | fal | custom",
  "fal_api_key": "only if provider = fal",
  "custom": { "description": "...", "notes": "..." }
}
```

The details of how to call each provider are in [references/providers.md](references/providers.md) — read it before the first generation of the session.

## Local learnings

The file `~/.claude/product-studio/learnings.md` accumulates the corrections that have worked in the past (what tends to fail and how to fix it).

- **Before generating**: ALWAYS read it and apply the corrections relevant to the product type to the prompt.
- **After a successful correction**: record a new entry in this format:

```markdown
## [date] - [product type]
- **Failure**: the model shifted the leather tone from brown to cognac
- **Fix that worked**: specify the color with a concrete reference ("dark chocolate brown, identical to the reference image") and add "preserve the exact leather color from the reference image"
```

If the file doesn't exist, create it empty with a heading. These learnings are local to the user and are not shared.

## Workflow: images (/product-image)

### 1. Get the source images (and read the brand)

- **Local folder**: list the images (jpg, png, webp, heic) and group them by product if there are several.
- **Store URL**: follow [references/store-analysis.md](references/store-analysis.md) — extract the product images (Shopify `.js` endpoint, og:image, JSON-LD, galleries) into `sources/` (absolute paths), confirm the detected products with the user, and run the quick **brand analysis** (palette, positioning, current aesthetic, category) in the same pass. It feeds the session proposal in step 4.

### 2. Product inventory (critical)

Read EACH source image with the Read tool and write a strict inventory of what is visible:

- Shape and proportions
- Exact colors (be specific: "muted sage green", not "green")
- Visible materials and textures
- Logos, texts and their exact position (if illegible, note it as "illegible — do not reproduce")
- Distinctive details: stitching, buttons, closures, finishes

Hard rule: **what cannot be seen with certainty does NOT go into the inventory or the prompt**. The inventory is your fidelity contract: the final verification will be done against it.

### 3. Ask for style, quantity and destination

Use ONE AskUserQuestion call with three questions:
- **Style**: minimalist / elegant / UGC — with a short description of each (full definitions are in [references/styles.md](references/styles.md); read it before asking so you describe the options well). If the brand analysis suggests one, recommend it and say why.
- **Quantity**: 3 or 5 images per product.
- **Destination/format**: where the images will live — ecommerce (1:1 or 4:5), Instagram feed (4:5), stories/reels (9:16), web/banner (16:9). See "Channel & format" in [references/shot-plans.md](references/shot-plans.md).

### 4. Shot plan and session template (brand consistency)

Check [references/shot-plans.md](references/shot-plans.md):
- **3 images**: main (hero) + another angle + detail
- **5 images**: the above + wide/context shot + lifestyle/in use

All photos for the same company must look like the **same photo session**: same order and role for each shot, and same visual world (setting, props, light, palette). Before generating anything, check whether `sessions/<company>.md` exists in the working directory:

- **If it exists**: it is that brand's visual contract — apply it as-is to the new products.
- **If it doesn't**: draft it BEFORE the first generation. For each shot number, fix its concrete setting (example with the elegant style: shot 1 = beige stone podium against a sand wall with diagonal sunlight; shot 2 = top-down on crumpled natural linen; shot 3 = macro on sand-colored stone) plus the shared palette, light and format. When there is a brand analysis (step 1), adapt the style to the client — brand-match mode in [references/styles.md](references/styles.md) — and **present the proposal to the user for confirmation** (accept / adjust) before saving it and generating. Then follow it for ALL products.

Consistency means resemblance, not cloning: between products you can vary the arrangement of the stones, the folds of the linen or the angle of the shadow — but shot N's setting must be recognizably the same across all products. Never switch settings for a single product (e.g. the top-down-on-linen shot 2 cannot become a front view on a podium for one of them).

### 5. Generate

- Read the local learnings and apply them.
- ALWAYS generate with the original photo as the reference image (image-to-image / editing). Never pure text-to-image: without a visual reference there is no possible fidelity.
- When the product has several source photos, use as reference the one whose angle most resembles the requested shot.
- Build the prompt by combining: product inventory + chosen style definition + shot specification + learned corrections.
- Follow the configured provider's instructions in [references/providers.md](references/providers.md).

### 6. Quality control (consistency QA)

For each generated image:

1. Read it with Read and compare it against the step-2 inventory, attribute by attribute: shape, colors, materials, logos, texts, proportions, details.
   Also verify **session consistency**: the shot must respect the setting, light, palette and format fixed in `sessions/<company>.md` — an image faithful to the product but outside the brand's visual world is also a failure.
   Then run the **AI-artifact checklist** (strictest on the detail shot, where models invent most):
   - logos or texts warped, melted or replaced by generic marks
   - duplicated or missing parts (straps, buttons, handles); wrong product count
   - impossible shadows or reflections; more than one light logic in the scene
   - waxy/plastic textures, oversaturated colors, halos around edges
   - altered proportions vs. the reference photo
2. **If everything matches**: approved.
3. **If something doesn't match**: identify exactly what changed, regenerate with a specific corrective prompt that pins that attribute down (maximum 3 attempts per shot), and when the correction works, record it in learnings.md.
4. **If it still fails after 3 attempts**: deliver the best version clearly marked "⚠️ not verified" and explain the concrete discrepancy to the user. Never silently deliver an image that isn't identical to the product.

### 7. Delivery

Save the results to `output/<product-name>/` with descriptive names (`01-hero.jpg`, `02-angle.jpg`, `03-detail.jpg`, `04-context.jpg`, `05-lifestyle.jpg`). Finish with a summary: what was generated, what was verified, and which new learnings were saved.

## Workflow: video (/product-video)

Read [references/video.md](references/video.md) for the motion recipes by category. Hard rules that define the video style:

- **Camera ALWAYS locked.** No dolly moves, no zooms, no pans.
- **Subtle, slow motion.** The product or person moves gently; the video must convey calm and quality.
- **No cuts, no effects, no text.** A single ~5 second shot.
- **Same fidelity as the images**: the product in the video must be identical to the real one. Preferably start from an image already generated and verified by /product-image, and review the result before delivering.

## Common mistakes to avoid

- Generating without reading the source image first (the inventory is not optional).
- Describing parts of the product in the prompt that don't appear in the original photo.
- Accepting an "almost identical" image: a different color tone or a warped logo is a failure, not a detail.
- Forgetting to check or update learnings.md: it's what makes the skill improve with use.
