---
name: google-stitch-mcp
description: >
  Google Stitch MCP integration for AI coding agents. Trigger: When user wants to generate UI designs 
  from text prompts, set up Stitch MCP in Cursor/Claude Code, or build websites with AI design automation.
  Category: Infrastructure Ops (MCP servers).
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Google Stitch MCP Skill

## When to Use

- **Setup**: Installing Stitch MCP in Cursor, Claude Code, or other AI coding tools
- **UI Generation**: Creating websites/apps from text prompts via AI agent
- **Design Consistency**: Maintaining design DNA across multiple screens
- **Automation**: Building production-ready sites from Stitch designs

---

## What is Stitch MCP

**Stitch** is Google's AI design tool (Google Labs) powered by Gemini 2.5 Pro. It takes text prompts and generates UI designs + HTML/CSS code.

**Stitch MCP** wraps the Stitch API as an MCP server, enabling AI coding agents (Cursor, Claude Code, etc.) to call Stitch as a tool.

### Workflow

```
User → AI Agent → Stitch MCP → Stitch API → Design + Code → AI Agent → Your Project
```

---

## Prerequisites

| Requirement          | Description                      |
|----------------------|----------------------------------|
| Node.js 18+          | Runtime for npx                  |
| Google Cloud Project | With billing enabled             |
| gcloud CLI           | Google Cloud command line tool   |
| Stitch Project       | Created at stitch.withgoogle.com |

---

## Installation (Step by Step)

### Step 1: Install gcloud CLI

Download from: https://cloud.google.com/sdk/docs/install

```bash
# Verify installation
gcloud --version
```

### Step 2: Authenticate with Google

```bash
gcloud auth login
gcloud auth application-default login
```

### Step 3: Set Project ID

```bash
gcloud config set project YOUR_PROJECT_ID
gcloud auth application-default set-quota-project YOUR_PROJECT_ID
```

### Step 4: Enable Stitch API

```bash
gcloud beta services mcp enable stitch.googleapis.com --project=YOUR_PROJECT_ID
```

### Step 5: Initialize Stitch MCP (Recommended)

```bash
npx @_davideast/stitch-mcp init
```

This interactive wizard handles:
- gcloud CLI check/install
- Google login
- Project setup
- Stitch API activation
- MCP client configuration

### Step 6: Health Check

```bash
npx @_davideast/stitch-mcp doctor --verbose
```

---

## Platform Configuration

### Cursor / VS Code / Windsurf

Add to **Cursor Settings → MCP** (JSON config):

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "@_davideast/stitch-mcp", "proxy"],
      "env": {
        "GOOGLE_CLOUD_PROJECT": "YOUR_PROJECT_ID"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add -e GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID -s user stitch -- npx -y @_davideast/stitch-mcp proxy
```

Verify:
```bash
claude mcp list | grep stitch
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["@_davideast/stitch-mcp", "proxy"]
    }
  }
}
```

---

## Available Tools

| Tool                        | Description                                |
|-----------------------------|--------------------------------------------|
| `build_site`                | Map screens to routes, get per-page HTML   |
| `get_screen_code`           | Fetch raw HTML/CSS of a specific screen    |
| `get_screen_image`          | Get screen screenshot (base64)             |
| `generate_screen_from_text` | Generate a new screen from a text prompt   |
| `list_projects`             | List Stitch projects                       |
| `list_screens`              | List screens in a project                  |
| `extract_design_context`    | Extract design DNA (colors, fonts, layout) |

---

## Practical Usage Patterns

### 1. Generate UI with Single Prompt

Tell your AI agent:
```
Use Stitch to build a dark mode dashboard. Card-based layout with stats summary on top, charts below.
```

The agent calls:
1. `generate_screen_from_text` - Creates the UI
2. `get_screen_code` - Fetches the HTML/CSS

### 2. Multiple Screens with Design Consistency

**Problem**: Each screen looks different because Stitch has no memory.

**Solution**: Extract design DNA first:
```
Extract the design DNA from the existing dashboard screen. Generate a new settings page matching that same style.
```

`extract_design_context` captures:
- Color palettes
- Typography
- Layout patterns

### 3. Auto-Generate Astro Sites

```bash
# Preview screens locally
npx @_davideast/stitch-mcp serve -p PROJECT_ID

# Generate Astro project
npx @_davideast/stitch-mcp site -p PROJECT_ID
```

### 4. Interactive Browser

```bash
npx @_davideast/stitch-mcp view --projects
```

- `c` to copy
- `s` to preview HTML
- `o` to open in Stitch

---

## Prompt Best Practices

| ❌ Bad               | ✅ Good                                                         |
|---------------------|----------------------------------------------------------------|
| "make it look good" | "Dark mode, card-based, minimal"                               |
| "modern website"    | "SaaS landing page with hero, features, pricing, CTA sections" |
| "nice colors"       | "Orange (#F97316) accent on dark (#0A0A0A) background"         |

**Tips**:
- Be specific with prompts
- Mobile UIs tend to produce higher quality
- Currently free during preview period
- Pin versions in production: `@_davideast/stitch-mcp@0.0.5`

---

## Common Issues & Solutions

### Issue: API Keys Don't Work

**Error**: `"API keys are not supported by this API. Expected OAuth2 access token"`

**Cause**: Setting `STITCH_API_KEY` doesn't work with MCP proxy.

**Solution**: Use OAuth authentication:
```bash
gcloud auth application-default login
```

### Issue: .env File Conflicts

**Error**: `invalid character 'd'` errors

**Cause**: A `.env` file in your project directory breaks the proxy.

**Solution**: Move or rename the `.env` file.

### Issue: Permission Errors

**Check**:
- Billing enabled on Google Cloud project
- Stitch API enabled: `gcloud beta services mcp enable stitch.googleapis.com`
- Owner or Editor role on your account

### Full Reset

```bash
npx @_davideast/stitch-mcp logout --force --clear-config
npx @_davideast/stitch-mcp init
```

---

## Workflow Integration

### Design-to-Code Pipeline

```
1. IDEATION (Stitch)
   └─ Research competitors, generate design options

2. DESIGN (Stitch Canvas)
   └─ Refine visuals, add sections, edit text

3. DESIGN MD (Stitch MCP)
   └─ Extract design tokens, colors, typography

4. BUILD (AI Agent)
   └─ Generate code, implement in project

5. DEPLOY
   └─ Push to Vercel/Netlify
```

### Using with Claude Code / Cursor

1. **Install MCP** (per platform config above)
2. **Create design in Stitch** (stitch.withgoogle.com)
3. **Ask AI agent**:
   ```
   Build me a landing page based on my Stitch design. 
   Use the design DNA from the extracted context.
   ```
4. **Agent calls Stitch MCP** → gets HTML/CSS
5. **Agent implements** in your project

---

## Resources

- **Stitch Official**: https://stitch.withgoogle.com/
- **Stitch Docs**: https://stitch.withgoogle.com/docs/
- **MCP Setup Docs**: https://stitch.withgoogle.com/docs/mcp/setup/
- **stitch-mcp GitHub**: https://github.com/davideast/stitch-mcp

---

## Commands Summary

```bash
# Install & Initialize
npx @_davideast/stitch-mcp init

# Health Check
npx @_davideast/stitch-mcp doctor --verbose

# Authenticate
gcloud auth login
gcloud auth application-default login

# Enable API
gcloud beta services mcp enable stitch.googleapis.com --project=YOUR_PROJECT_ID

# List Projects
npx @_davideast/stitch-mcp view --projects

# Generate Astro Site
npx @_davideast/stitch-mcp site -p PROJECT_ID

# Reset
npx @_davideast/stitch-mcp logout --force --clear-config
```

---

## Key Insights (Lessons Learned)

1. **OAuth > API Keys**: MCP proxy requires OAuth, not API keys
2. **Design DNA is Essential**: Use `extract_design_context` for multi-screen consistency
3. **Be Specific with Prompts**: Vague prompts = generic output
4. **Mobile First**: Mobile UIs tend to have higher quality output
5. **.env Conflict**: Keep .env files away from stitch-mcp working directory
6. **Pin Versions**: Use `@_davideast/stitch-mcp@0.0.5` in production
7. **Three MCP Implementations**: `@_davideast/stitch-mcp` is the most stable
