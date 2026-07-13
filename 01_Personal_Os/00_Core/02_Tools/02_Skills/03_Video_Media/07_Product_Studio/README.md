# Product Studio 📸

Claude Code plugin that turns low-quality product photos (or the products on any store URL) into
**professional product photography and video with AI** — always 100% faithful to the real
product. Built to be shared with a team.

## What's included

| Command | What it does |
|---------|--------------|
| `/product-setup` | One-time setup per person: choose your generation provider |
| `/product-image` | Generates 3 or 5 professional photos per product in minimalist, elegant or UGC style |
| `/product-video` | Generates a subtle product video (locked camera, slow motion, ~5s) |

Works in any language — the skill replies in whatever language you speak to it.

## The three pillars

1. **Total product fidelity.** The skill builds a strict inventory of what's visible in your
   photos (exact colors, materials, logos, texts), always generates with the real photo as
   reference, and verifies every result attribute by attribute before delivering. If something
   doesn't match, it corrects it (up to 3 attempts) — and never silently delivers an image that
   isn't identical to the product.
2. **Brand consistency.** All photos for the same company follow a session template
   (`sessions/<company>.md`): same settings, light and palette per shot across the whole catalog.
   Recognizable resemblance, not cloning.
3. **Continuous learning.** Every correction that works is saved to
   `~/.claude/product-studio/learnings.md` and applied automatically in future generations.

## Requirements

- Claude Code with plugin support.
- A generation provider (chosen in `/product-setup`):
  - **Higgsfield** — official MCP connector (no API key needed; on the starter plan: max 4
    concurrent generations, images ~2 credits, video ~7.5 credits with Kling 3.0 Turbo).
  - **Fal.ai** — your own API key ([fal.ai/dashboard/keys](https://fal.ai/dashboard/keys)), pay per use.
  - **Any other tool** — any generation API that accepts a reference image.

## Installation

**Option A — from the git repository (recommended for teams):**

```
/plugin marketplace add lorena-bordonaba-pau/product-studio
/plugin install product-studio
```

**Option B — local copy:** copy this folder to your machine and add it as a local marketplace:

```
/plugin marketplace add /path/to/the/folder
/plugin install product-studio
```

## Getting started (each team member)

1. Run `/product-setup` and choose your provider.
2. Run `/product-image` with a photo folder or your store URL:
   ```
   /product-image ./product-photos
   /product-image https://mystore.com/collections/new
   ```
   The skill will ask for a style (minimalist / elegant / UGC) and quantity (3 or 5 per
   product), and deliver the verified results to `output/<product>/`.
3. Once you have approved images, `/product-video` generates the video from the hero shot.

Your configuration and learnings are stored locally (`~/.claude/product-studio/`), not in the plugin.

## The three styles

Three generic aesthetics that work for any product (see
[styles.md](skills/product-photography/references/styles.md)). All three share the same base:
the product as the only protagonist, a neutral palette that complements it, natural light,
serene composition and realism rules that avoid the "AI look".

- **Minimalist** — serene premium catalog: plain light tone-on-tone backgrounds, perfectly
  ordered packshots and flat-lays, generous negative space.
- **Elegant** — warm quiet-luxury editorial: directional sunlight with sculptural shadows,
  linen, stones, geometric podiums, curated natural props.
- **UGC** — a real person with good taste showing the product: authentic phone photo in tidy
  real settings, face hidden or de-emphasized, spontaneous vertical framing.

With a store URL, the skill also runs **brand-match**: it analyzes the client's brand (palette,
positioning, current aesthetic) and adapts the chosen style to it, proposing the photo-session
template for confirmation before generating. Images target a chosen destination — ecommerce
(1:1 or 4:5), Instagram feed (4:5), stories/reels (9:16) or web (16:9).

## Known issues

- **"Rate limit reached: max 4 concurrent jobs"** (Higgsfield starter): the skill automatically
  generates in batches of 3-4; large catalogs just take a bit longer — it retries on its own.
- **Plan-gated video models**: `seedance_2_0` requires Higgsfield's Pro/Ultimate plan; on
  starter the skill automatically falls back to `kling3_0_turbo`.
- **Logos and small text**: where AI fails most. The skill mitigates it by using the source
  photo that matches the shot's angle and naming the logo in the prompt; if it still fails, it
  delivers the image marked "⚠️ not verified" with the discrepancy explained.

## Structure

```
.claude-plugin/
├── plugin.json                      # plugin metadata
└── marketplace.json                 # to install it as a marketplace
commands/
├── product-setup.md                 # /product-setup
├── product-image.md                 # /product-image
└── product-video.md                 # /product-video
skills/product-photography/
├── SKILL.md                         # workflow and fidelity rules
└── references/
    ├── styles.md                    # minimalist / elegant / UGC + realism + brand-match
    ├── shot-plans.md                # shot plans by category + formats + session templates
    ├── store-analysis.md            # store extraction + brand analysis
    ├── providers.md                 # Higgsfield / Fal.ai / custom API
    └── video.md                     # motion recipes by category
sessions/                            # per-company session templates (created locally, not versioned)
```

## License

MIT — see [LICENSE](LICENSE).
