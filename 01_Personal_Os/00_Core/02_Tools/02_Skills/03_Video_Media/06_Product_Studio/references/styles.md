# The 3 product photography styles

Three generic aesthetics that work for ANY product — footwear, cosmetics, food, tech,
furniture, jewelry, packaged goods. This document is the source of truth for each aesthetic:
the "example scenes" describe the kind of image each style produces — use them as your mental
pattern when building the prompt, adapting them to the product's category and scale.

Each style defines the ATMOSPHERE of the image, never the product. The product is always
identical to the reference photo; the style only changes the setting, light, props and mood.

## The shared base: the product first

Whatever the style, a good product image always respects this:

- **The product is the only protagonist.** Everything else — background, props, light,
  palette — exists to flatter it, never to compete with it.
- **Palette that serves the product**: neutral base tones (off-white, greige, beige, warm or
  cool grays) chosen to complement the product's own colors, so the product is the chromatic
  focus of the frame.
- **Natural, believable light** — never harsh studio flash or artificially saturated colors.
- **Calm and order**: serene compositions, no visual noise, no jarring elements.
- **Photographic quality**: sharp focus on the product, realistic materials and textures,
  professional composition.

## Realism: avoiding the AI look

The image must read as a photograph, not as a render. This applies to every style:

- **Speak photography, not rendering.** Describe the shot the way a photographer would:
  framing and optics ("macro close-up", "85mm lens look", "eye-level medium shot"), depth of
  field ("shallow depth of field, background softly out of focus"), and light quality ("soft
  window light", "hard direct sunlight"). Concrete photographic language steers the model
  toward photographic rendering.
- **Physical materials.** Name how the product's real materials behave so they render
  physically: "visible leather grain", "matte cotton weave", "brushed metal with soft
  reflections", "glass with natural refraction". Generic praise ("beautiful", "high quality")
  does nothing.
- **Natural imperfection.** Perfectly uniform surfaces and perfectly symmetric compositions
  scream AI. Ask for the small accidents of reality: creased linen, natural stone variation,
  a slightly asymmetric arrangement, fabric with a little slack.
- **Honest light and optics.** One light logic per scene: all shadows fall the same way,
  reflections match the environment, highlights sit where the light source puts them. If
  results come out too clean or plastic, add "soft film-like grain".
- **What NOT to write.** Incantations like "8k, ultra-realistic, masterpiece, award-winning,
  hyperdetailed, HDR, cinematic" add noise and push toward the over-processed AI aesthetic.
  Don't say how good the photo is — say how it is MADE (light, optics, materials).
- **QA eye.** Waxy or plastic textures, oversaturated colors, halos around edges, and
  physically impossible shadows or reflections are failures, not details — regenerate (see the
  QA checklist in SKILL.md).

## Minimalist

**Mood**: serene premium catalog. Absolute cleanliness, the product breathes, "quiet ecommerce".

**Example scenes** (adapt to the product): a ghost packshot of a garment on a plain light
background; a skincare jar centered on a seamless backdrop with a delicate shadow; folded
textiles in a staggered tone-on-tone stack; a knolling flat-lay of a gadget and its accessories;
a macro detail of a finish, seam or texture; a bottle on a subtle stone surface.

- **Background**: plain and light — off-white, greige, very soft neutral. Seamless backdrop or a
  surface with very subtle texture (light polished concrete, plain fabric). Tone on tone: the
  background shares or complements the product's color family.
- **Lighting**: diffused and even, or soft natural light; delicate shadows. A faint sun shadow
  (branches, a window) is allowed as the only adornment.
- **Props**: none. At most, the surface the product rests on. Perfectly ordered arrangements
  (alone or in a diagonal knolling composition), frontal packshot, or a macro detail of a finish.
- **Framing**: frontal or top-down, orderly, generous negative space. A hand may appear only as
  a momentary support for the product, never as a subject.
- **Palette**: 2-3 neutral tones maximum, chosen around the product's own colors.

**Prompt fragment (base)**: "clean minimalist product photography, seamless soft neutral background in a tone that complements the product, soft diffused natural window light, delicate soft shadows, generous negative space, perfectly ordered composition, realistic material textures, premium quiet e-commerce catalog style, sharp focus on the product"

## Elegant

**Mood**: warm editorial, quiet luxury. Looks like a sophisticated high-end campaign: deliberate
composition, sunlight drawing shadows, noble natural materials.

**Example scenes** (adapt to the product): a still life of the product on crumpled linen with
hard diagonal sunlight; containers or bottles balanced on flat stones against a textured wall;
the product resting on geometric podiums with sculptural shadows; the product in its box with
tissue paper or a cotton dust bag; a partial model (no face) holding or wearing the product,
dressed in neutrals; a macro of the product's noblest detail on marble or stone.

- **Background/setting**: natural surfaces and textures — crumpled linen, stone, geometric
  podiums and blocks, textured walls, noble cardboard boxes. Also neutral architectural
  exteriors/interiors (stairs, textured wall) for shots with a model.
- **Lighting**: the protagonist. Warm directional sunlight casting **hard, sculptural shadows**
  (the diagonal of a window, the product's own shadow). Soft but present contrast.
- **Props**: curated and natural — stones, linen fabric, podiums, noble boxes. Products may be
  stacked or balanced sculpturally (asymmetric composition). Props never touch or hide the
  product's distinctive features.
- **Model**: allowed but cropped — partial body, no prominent face, dressed in neutrals; the
  product is always the center.
- **Palette**: earthy or mineral neutrals that flatter the product — sand, beige, camel, gray,
  off-white; dark tones as an elegant accent.

**Prompt fragment (base)**: "warm editorial product photography, quiet luxury campaign style, hard directional golden sunlight casting sculptural shadows, natural textured props (crumpled linen with soft creases, natural stone with mineral variation, geometric podiums), neutral palette that complements the product, asymmetric curated composition, realistic physical materials, soft film-like grain, sophisticated atmosphere, sharp focus on the product"

## UGC

**Mood**: a real person with good taste showing a product they genuinely like. An authentic yet
aesthetic phone photo — a believable recommendation. NOT a messy home snapshot and NOT a studio.

**Example scenes** (adapt to the product): a hand holding the product toward the camera against
a plain wall; a person using or wearing the product in their living room or kitchen, face hidden
or out of frame; the product freshly unboxed on a table, packaging casually beside it; a
close-up of the product in use on the body or in the hand; a full-body shot in a real interior
with lived-in context (a lamp, a leaning picture frame) in the background.

- **Setting**: real, tidy environments — living room, kitchen, desk, plain home wall, outdoors
  if it suits the product. Real objects in the background give lived-in context without clutter.
- **Lighting**: natural indoor light (window), no setup. Realistic phone exposure with its
  slight imperfection; nothing that looks like a studio.
- **Subject**: a real person showing the product — using it, wearing it, holding it toward the
  camera, or in detail on the body or in the hand. The face is usually hidden or de-emphasized
  (cropped framing, camera in front, casual gaze).
- **Framing**: vertical phone format (4:5 or 9:16), handheld, frontal and direct; slight
  smartphone grain or softness.
- **Palette**: muted natural tones consistent with a real scene, no flashy filters.

**Prompt fragment (base)**: "authentic UGC-style smartphone photo, real person casually showing/using the product, face subtly hidden or cropped, real tidy interior or plain wall, natural window light with realistic exposure, handheld vertical framing, muted natural tones, believable recommendation aesthetic, slight phone-camera softness and grain, no studio look"

## Brand-match mode: adapting the style to the client

The three styles are the structure; the client's brand is the finish. When the source is a
store URL (or the user can point you at their brand), run the brand analysis in
[store-analysis.md](store-analysis.md) and adapt the chosen style to the client:

- **Palette**: replace the default neutral backdrop tones with neutrals derived from the
  client's brand palette (their web colors, packaging, current photography). The product stays
  the chromatic protagonist — brand colors tint the WORLD (surfaces, walls, props, light
  warmth), never the product.
- **Positioning**: premium brands → more negative space, stricter compositions, quieter light;
  accessible or young brands → tighter framing, livelier light, more lived-in UGC settings.
- **Props and settings**: choose them from the client's world (a coffee brand lives in
  kitchens and cafés; a yoga brand in calm bright rooms; a tool brand in workshops).
- **What never changes**: the style's structure (its light logic, its composition rules),
  total product fidelity, and the calm ordered base. Brand-match adjusts the atmosphere's
  ingredients, not the recipe.

The adapted palette and settings are written into the session template (see shot-plans.md)
and confirmed with the user before the first generation.

## How to use the styles in the prompt

1. ALWAYS start with the product inventory (fidelity) — the style comes after. The prompt is
   built around the product: its exact colors, materials and details come first, and the scene
   adapts to the product's category, size and character (a sofa doesn't sit on a podium; a ring
   needs a macro world).
2. Add the chosen style's prompt fragment, adapted to the specific shot (see shot-plans.md)
   and to the client when brand-match applies (palette and settings from the session template).
   If unsure about the atmosphere, lean on the style's example scenes.
3. Apply the realism rules above: photographic language, physical materials, natural
   imperfection — and none of the forbidden incantations.
4. Always close with the preservation instruction: "preserve the exact product from the
   reference image: identical shape, colors, materials, logos and proportions. Do not alter,
   add or invent any product detail."
