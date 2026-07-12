# Reading the client's store

When the source is a store URL there are two jobs: extract the product photos, and understand
the brand so the photo session can match it. Both start from the same page fetches — do them
together, in one pass.

## 1. Extracting the products

Download the collection/catalog page with `curl -sL` and detect the platform:

- **Shopify** (very common): every product has a JSON endpoint at
  `https://<store>/products/<handle>.js` returning title, images and variants. Get the handles
  from the collection HTML (`grep -oE '/products/[a-z0-9-]+'`, deduplicated preserving order —
  the page order reflects the requested sorting, e.g. newest first).
- **Other platforms / unknown**: use the `og:image` meta on each product page, JSON-LD blocks
  (`"@type": "Product"` with an `image` array), and large gallery images in the DOM. Ignore
  logos, banners, icons and small thumbnails.
- Download every source image to `sources/` using **absolute paths** (relative paths break
  when the working directory changes between steps).
- Show the user the detected products (name + number of photos) and confirm the selection
  before continuing.

## 2. Brand analysis (for brand-match and the session proposal)

From the pages already fetched (home + collection + one product page), extract:

- **Palette**: the site's dominant colors (CSS variables, backgrounds, buttons) and the look
  of their current product photography (read 2-3 of their images with the Read tool). Reduce
  it to: base neutrals + 1-2 accent colors.
- **Positioning**: price range, copy tone (playful vs. sober, technical vs. emotional),
  claims (luxury, eco, handmade, tech, family).
- **Current aesthetic**: what their existing photos look like (white studio packshots?
  lifestyle? colorful?). The goal is an upgrade that still feels like the same brand.
- **Category**: what they sell — it selects the category-adaptive shots (shot-plans.md).

Keep it quick: this analysis is 3-4 observations, not a report. Its only purpose is a better
session proposal.

## 3. The session proposal (always confirm)

With the chosen style and the brand analysis, draft the session template (format in
shot-plans.md) and present it to the user with AskUserQuestion BEFORE generating anything:

- proposed style (with brand-match adjustments and why),
- palette,
- setting of each shot,
- format/ratio (see "Channel & format" in shot-plans.md).

Options: **accept** / **adjust** (let them say what to change). Only after confirmation, save
`sessions/<company>.md` and start generating. If a session template already exists for the
company, skip the proposal and apply it as-is.

If there is no URL (local photo folder), skip the store analysis: ask for the style directly
and, optionally, for a brand color or reference image to inform the template.
