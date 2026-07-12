---
description: Product Studio initial setup — pick your generation provider (Higgsfield, Fal.ai or another tool) and get ready to use /product-image and /product-video
---

# /product-setup — Product Studio initial setup

Guide the user through Product Studio's initial setup. It's a short, friendly process:
each team member runs it once. Always reply in the user's language.

## Steps

1. **Greet briefly** and explain you're going to configure their image/video generation provider.

2. **Detect Higgsfield**: check whether the Higgsfield MCP tools (`generate_image`,
   `generate_video`) are available in the session. Mention it when asking ("I can see you have
   Higgsfield connected" / "I don't see Higgsfield connected in this session").

3. **Ask for the provider** with AskUserQuestion:
   - **Higgsfield (MCP)** — recommended if already connected; no API key needed.
   - **Fal.ai** — needs an API key (created free at https://fal.ai/dashboard/keys); pay per use.
   - **Another tool with an API** — for anyone already using a different generation platform.

4. **Depending on the answer**:
   - *Higgsfield*: if not connected, explain how to connect it (Higgsfield MCP connector in
     Claude's connector settings) and wait until they do.
   - *Fal.ai*: ask for the API key. Validate it with a cheap test call:
     `curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Key <KEY>" https://fal.ai/api/models` —
     a 401 means the key is invalid; ask again. Don't print the key on screen and don't write it
     into any project file.
   - *Another tool*: ask which tool it is, its endpoint, auth type and how it receives a
     reference image. Save those notes in the config.

5. **Save the configuration** to `~/.claude/product-studio/config.json` (create the folder if needed):

```json
{
  "provider": "higgsfield | fal | custom",
  "fal_api_key": "...only if applicable...",
  "custom": { "description": "...", "notes": "..." },
  "configured": "2026-07-09"
}
```

6. **Create the learnings file** `~/.claude/product-studio/learnings.md` if it doesn't exist:

```markdown
# Product Studio learnings
Corrections that worked, to be applied automatically in future generations.
```

7. **Sign off confirming**: "Done ✅ — you can now use `/product-image` with a photo folder or
   your store URL, and `/product-video` for videos."
