# Product video: motion recipes

The video style is basic and simple ON PURPOSE: a single locked shot, subtle motion,
~5 seconds. It conveys calm and quality. Anything spectacular (flying cameras, cuts,
transitions, zooms) is out.

## Hard rules (ALWAYS go in the prompt)

- Locked camera: "static locked camera, fixed tripod shot, no camera movement"
- Subtle, slow motion: "subtle slow gentle motion"
- A single shot, no cuts, no effects, no text
- ~5 seconds long
- The product stays identical to the start image throughout the video

## Recipes by product category

Pick the recipe by category; if the product fits none, design an equally subtle movement in the
same spirit (something moves slowly, the camera never does).

### Footwear
Detail of a person's feet wearing the shoes, walking very slowly in place or swaying gently.
Tight framing on feet and ankles.
> "close-up of feet wearing the shoes, person walking slowly in place, subtle gentle movement, static camera"

### Fashion / textile
Fabric moving in a soft breeze, or the person turning very slowly in place.
> "fabric moving gently as if in a soft breeze, model turning very slowly, static camera"

### Cosmetics / fragrance
The bottle rotating slowly on its base, or a hand entering the frame and picking it up gently.
Glass highlights glide slowly.
> "product rotating slowly on its base, soft light reflections gliding across the glass, static camera"

### Jewelry / accessories
A slow glint of light traveling across the metal or stone; or the piece barely swaying
(an earring, a pendant).
> "slow light glint traveling across the metal, piece swaying almost imperceptibly, macro static shot"

### Food / drink
Steam rising slowly, a liquid pouring gently, a crumb or drop falling softly.
> "steam rising slowly / liquid pouring gently, warm ambient light, static camera"

### Home / decor
A scene alive but still: a curtain breathing, light shifting very slowly, a moving shadow.
> "curtain breathing softly in the background, light shifting very slowly, product perfectly still, static camera"

### Tech / objects
Slow product rotation or a subtle glow from the device's own light/screen.
> "product rotating slowly on a turntable, subtle screen glow, static camera"

## Flow

1. Start from an image approved by /product-image (preferred) or the original photo if the user asks.
2. Detect the category and build the prompt: recipe + hard rules + product preservation
   ("the product must remain exactly identical to the input image throughout the video").
3. Generate in image-to-video mode with the configured provider (see providers.md).
4. Review the video before delivering: inspect several frames and verify the product doesn't
   warp, doesn't change color, and the camera doesn't move. If it fails, regenerate with a
   specific correction (max 2 attempts) and record the learning in learnings.md.
5. Deliver to `output/<product-name>/video-01.mp4`.
