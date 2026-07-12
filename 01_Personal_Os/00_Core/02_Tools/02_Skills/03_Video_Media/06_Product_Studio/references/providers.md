# Generation providers

Read `~/.claude/product-studio/config.json` to know which provider this user works with.
Whatever the provider, the rule is the same: **always image-to-image with the product photo
as the reference**, never pure text-to-image.

## Higgsfield (MCP)

Requires the user to have the Higgsfield MCP connector enabled (the `generate_image`,
`generate_video`, `models_explore`… tools appear in the session). If they don't, tell the
user to connect the Higgsfield MCP in their connector settings.

- **Images**: use `generate_image` passing the product photo as the input/reference image.
  If unsure about the right model, first call `models_explore` with `action: 'recommend'`
  explaining you need faithful reference-based editing (product photography).
- **Video**: use `generate_video` in image-to-video mode with the approved image as the start frame.
- **User's local image**: on Apps UI-capable clients, use `media_upload_widget` so the user can
  upload their photo; remote MCP tools cannot read local chat attachments.
- **Useful extras**: `upscale_image` (final image to 2K/4K), `remove_background` (cutouts).
- **Recommended model for product work**: `marketing_studio_image` (2 credits/image at 1k,
  accepts a reference image and 4:5, 1:1, 9:16… ratios). Import web photos with
  `media_import_url` and pass the `media_id` in `medias`.
- **Concurrency limit**: the starter plan allows max 4 simultaneous generations — launch in
  batches of 3-4 and retry rejected jobs once the first ones finish.
- **Checking results**: `marketing_studio_image` jobs appear in
  `show_marketing_studio_generations` (NOT in `show_generations`). Poll every ~45-60 s; jobs
  take ~1-2 min. Download each result's `rawUrl` with `curl` using **absolute paths** into
  `output/<product>/`.
- **Silent failures**: a job can end as `failed` with no error message (server-side hiccup,
  not a prompt problem). Relaunch the identical prompt once before treating it as a real
  failure; check a missing job with `job_display` before giving it up.
- **Stuck in `queued`**: the 4-job concurrency limit is PER ACCOUNT — another session
  generating at the same time consumes the slots and jobs wait in `queued` for minutes. Don't
  relaunch (it only queues more); poll with spaced checks (~2-3 min) until slots free up. A
  "Rate limit reached" error on a new launch confirms this situation.
- **Video**: `seedance_2_0` (ideal for product) requires the Pro/Ultimate plan and returns 403
  on starter; the working plan B is `kling3_0_turbo` (7.5 credits, 5s, `start_image`). Always
  preflight with `get_cost:true` — video costs ~4-10× more than an image.

## Fal.ai (REST API)

Requires `fal_api_key` in the config (created at https://fal.ai/dashboard/keys).
Use the **queue API** with `curl`. General pattern:

```bash
# 1. Enqueue the generation
curl -s -X POST "https://queue.fal.run/<MODEL_ID>" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "...", "image_urls": ["<reference-image-url>"]}'
# → returns request_id + status_url + response_url

# 2. Poll status until COMPLETED
curl -s "<status_url>" -H "Authorization: Key $FAL_KEY"

# 3. Fetch the result and download the image/video
curl -s "<response_url>" -H "Authorization: Key $FAL_KEY"
```

To pass the reference image: either a public URL, or upload it to fal storage
(`POST https://rest.fal.run/storage/upload` with the key) and use the returned URL. Some
models also accept a base64 data-URI in `image_url`.

### Recommended models (verified July 2026)

**Reference-based image editing** (for /product-image):

| Model | Endpoint | When to use it |
|-------|----------|----------------|
| Nano Banana 2 Edit (Google) | search "nano-banana" at fal.ai/explore/models | Default: strong semantic understanding, changes the scene without touching the product |
| FLUX.2 [flex] / FLUX.2 [pro] Edit | see fal.ai/explore/models | High-resolution product mockups, accepts several reference images |
| FLUX.1 Kontext [pro] | `fal-ai/flux-pro/kontext` | Precise local edits keeping everything else intact |
| Seedream 5 Lite Edit | `fal-ai/bytedance/seedream/v5/lite/edit` | Budget alternative |
| GPT Image 2 Edit | `openai/gpt-image-2/edit` | Mask-constrained edits to limit the editable area |

**Image-to-video** (for /product-video):

| Model | Endpoint | When to use it |
|-------|----------|----------------|
| Kling Video 3.0 Pro | `fal-ai/kling-video/v3/pro/image-to-video` | Default: fluid, natural motion |
| Veo 3.1 (image-to-video) | search "veo" at fal.ai/explore/models | Highest resolution (up to 4K) |
| Kling 2.6 Pro | `fal-ai/kling-video/v2.6/pro/image-to-video` | Cheaper alternative |

> Fal.ai models evolve fast. If an endpoint returns 404 or you're unsure, check the current
> catalog at https://fal.ai/explore/models (or web-search "fal.ai <type> API") and use the most
> recent equivalent. Update this table if you detect changes.

**Security**: the API key lives only in the user's local config. Don't print it on screen,
don't include it in logs, and don't write it into project files.

## Custom tool

If the user configured `provider: "custom"`, their config includes a description of their tool
(endpoint, auth, format). Follow those notes. If it's the first time and the notes are
insufficient, ask the user for their API documentation and update the config's `custom.notes`
field for next time. Keep the same contract: input = reference image + prompt; output = image or
video downloaded locally so QA can run.
