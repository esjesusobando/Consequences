---
description: Generates a simple, elegant product video (locked camera, subtle motion, ~5s) from an image generated with /product-image or a product photo
argument-hint: [start image (path) — optional]
---

# /product-video — Product video

Generates a short product video: a single locked shot with subtle, slow motion.
Always reply in the user's language.

**Start image provided by the user**: $ARGUMENTS
(If empty: look for approved images in `output/` from a previous /product-image run and suggest
using the hero; if there are none, ask the user for a product photo.)

## Instructions

Follow the flow defined in the `product-photography` skill (product-studio plugin), section
"Workflow: video", and read `references/video.md` to pick the motion recipe for the product's
category (footwear → feet in close-up moving slowly; cosmetics → slow rotation; textile →
fabric in a soft breeze; etc.).

Hard rules, no exceptions:
- Camera ALWAYS locked (no zooms, pans or dolly moves).
- Subtle, fine, slow motion. A single ~5 second shot, no cuts, effects or text.
- The product must remain identical to the start image for the whole video.

Before generating, check the config (`~/.claude/product-studio/config.json`) and the local
learnings. Preflight the cost when the provider supports it — video is far more expensive than
images. After generating, review several frames of the video: if the product warps or changes
color, regenerate with a specific correction (max 2 attempts) and record the learning.
Deliver to `output/<product>/video-01.mp4`.
