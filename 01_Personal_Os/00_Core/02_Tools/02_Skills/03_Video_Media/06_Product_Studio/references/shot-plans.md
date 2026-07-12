# Shot plans

The goal of the image set is to tell the complete product story: what it is, what it looks like
up close, and how it lives in the world. Each shot has a different job; don't generate 5
variations of the same photo.

## The session template (consistency across a company's products)

The shot plan is not decided product by product: it is fixed ONCE per company in
`sessions/<company>.md` and applied to their entire catalog. The template pins down, for each
shot number, the exact setting (surface, background, props), the light, the palette and the
format. When the source is a store URL, the template is drafted from the brand analysis
(see [store-analysis.md](store-analysis.md)) and **confirmed with the user before the first
generation**. Example:

```markdown
# Session: <company> — elegant style
- Palette: sand, beige, earth tones; warm directional sunlight with sculptural shadows
- Shot 1 (hero): pair at 3/4 angle on a beige stone podium/block, sand wall background
- Shot 2 (other angle): top-down on crumpled natural linen
- Shot 3 (detail): macro of the distinctive feature on a sand-colored stone surface
- Format: vertical 4:5 (Instagram feed + ecommerce), 1k resolution
```

Resemblance, not cloning: vary the accidental (linen folds, shadow position, prop arrangement)
and keep the structural (setting, light type, palette, each shot's role). That way the whole
catalog reads as one photo session without the images being identical.

## Category-adaptive shots

"Hero / another angle / detail / context / lifestyle" mean different things per category. Pick
the interpretation from this table; if the category is missing, reason by analogy:

| Category | Hero | Detail | Context / lifestyle |
|---|---|---|---|
| Footwear | pair at 3/4, eye level | stitching, buckle, sole texture | worn on feet, walking or standing |
| Fashion / textile | garment folded, on hanger or on partial model | weave, seam, button, label | worn, partial body, no face |
| Cosmetics / skincare | container upright, label readable | texture swatch, dropper, open cap | in-hand application, shelf scene |
| Food & drink | packaging or plated product | cut, crumb, pour, condensation | table scene, being served or tasted |
| Tech / gadgets | 3/4 showing front and one side | ports, materials, controls | in use on a desk or in hand |
| Home / furniture | full piece at a slight angle | material joint, fabric, finish | staged in a believable real room |
| Jewelry / accessories | full piece close, macro world | stone, clasp, engraving | worn close-up (ear, wrist, neck) |

Two hard rules stay: only zoom into what the source photo shows sharply, and any person in a
lifestyle shot is a prop, never the subject.

## Channel & format

Ask where the images will live (in the same AskUserQuestion as style and quantity):

| Destination | Ratio |
|---|---|
| Ecommerce product page | 1:1 or 4:5 |
| Instagram feed | 4:5 |
| Stories / Reels / TikTok | 9:16 |
| Web hero / banner | 16:9 |

The chosen ratio is written into the session template's `Format` line and applies to the whole
catalog, so the set stays coherent. Mixed sets are possible if the user asks (e.g. the hero
also in 16:9 for the website).

## Choosing the reference photo per shot

If the product has several source photos, use as the reference for each generation **the photo
whose angle most resembles the shot you are requesting** (for a top-down shot, the original
top-down photo; for a detail, the photo where that detail is sharpest). The model copies far
better what it sees from the same viewpoint — this is the most effective correction when a
detail (embossed logo, texture) comes out invented.

## 3-image set

| # | Shot | The job it does |
|---|------|-----------------|
| 1 | **Hero** | The product-page photo. Full product, most flattering angle (usually 3/4), total prominence. |
| 2 | **Another angle** | Shows what the hero doesn't: back, side, top-down. Choose the angle that adds the most REAL information based on what's visible in the source photos. |
| 3 | **Detail** | Close-up of a distinctive element VISIBLE in the original photo: material texture, stitching, closure, logo (only if sharp in the source). |

## 5-image set

The 3 above plus:

| # | Shot | The job it does |
|---|------|-----------------|
| 4 | **Wide / context** | The product smaller in the frame, integrated into a setting consistent with the chosen style. Adds air and a sense of scale. |
| 5 | **Lifestyle / in use** | The product being used: shoes worn, bag carried, cream on a hand, cup being poured. The person is a prop — never the subject — and the product stays identical. |

## Per-shot rules

- **Detail**: you can only zoom into what the source photo shows sharply. If the source is blurry
  in that area, pick another detail. A close-up is where the model most easily invents — be
  especially strict in this shot's QA.
- **Lifestyle**: any hands, feet or bodies must be generic and natural; verify the model didn't
  warp the product when putting it "in use" (this shot's most common failure).
- **Set coherence**: the 3-5 images share style, palette and light mood. They must look like they
  come from the same photo session.

## Framing specification for the prompt (per shot)

- Hero: "hero shot, full product visible, three-quarter angle, eye level"
- Another angle: "same product from [back/side/top-down] view"
- Detail: "extreme close-up macro shot of [concrete detail from the inventory]"
- Wide: "wide shot, product placed within the scene, environmental context"
- Lifestyle: "product in natural use, [concrete use], candid framing"
