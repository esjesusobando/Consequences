# RE: Playwright CLI — Browser Automation for AI Coding Agents

**Video ID:** dghyElh4EFw
**Title:** "Playwright: Ahora sí podemos automatizar TODO"
**Language:** Spanish
**Date:** 2026-06-01
**Source:** YouTube
**Topic:** Playwright CLI — Microsoft's new CLI tool for AI coding agents

---

## Context

Playwright CLI (`@playwright/cli`) is Microsoft's answer to the growing need for token-efficient browser automation in AI coding agents (Claude Code, GitHub Copilot, Cursor). Unlike the MCP (Model Context Protocol) approach, CLI-based automation avoids loading large tool schemas and verbose accessibility trees into the LLM context window.

---

## Key Insights

### 1. Token Efficiency is the Killer Feature

- **Playwright CLI**: ~27K tokens per task
- **Playwright MCP**: ~114K tokens per task
- **Savings**: ~4x reduction per task

The CLI approach keeps snapshots on disk as YAML files, NOT in the LLM context. The agent only sees concise element references (e.g., `e15`, `e21`) instead of full accessibility trees.

### 2. Architecture: Daemon-Based Browser Process

```
┌─────────────────────┐
│   AI Coding Agent   │
│  (Claude Code, etc) │
└────────┬────────────┘
         │ shell commands (playwright-cli open / click / snapshot)
         ▼
┌─────────────────────┐
│   playwright-cli    │  ← CLI process
└────────┬────────────┘
         │ IPC
         ▼
┌─────────────────────┐
│  Browser Process    │  ← Persistent daemon
│  (Chromium/Firefox) │     No startup cost per command
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Snapshot (YAML)    │  ← Written to disk, NOT in LLM context
│  ┌───────────────┐  │     Agent gets compact element refs
│  │ e15: <button> │  │
│  │ e16: <input>  │  │
│  └───────────────┘  │
└─────────────────────┘
```

### 3. Snapshot → Fill/Click Workflow

The agent workflow is a tight loop:
1. `playwright-cli snapshot` — capture page state, get element refs
2. `playwright-cli click e15` — interact using compact refs
3. `playwright-cli fill e16 "text"` — fill form fields
4. Repeat snapshot → inspect → interact

### 4. Skills System

Agents can install Playwright skills for richer context:
```bash
playwright-cli install --skills
```
This creates local skill files that the agent reads to understand available commands and patterns without loading MCP tool schemas.

---

## CLI vs MCP Comparison

| Aspect | Playwright CLI | Playwright MCP |
|--------|---------------|----------------|
| **Best for** | Coding agents with large codebases | Exploratory automation, self-healing tests |
| **Token cost** | ~27K per task | ~114K per task |
| **Snapshot storage** | YAML on disk (refs only) | In LLM context (full tree) |
| **Default mode** | Headless | Headed |
| **Setup** | `npm i -g @playwright/cli` | JSON config in MCP client |
| **State management** | In-memory by default, `--persistent` for disk | Session-managed |
| **Discovery** | `--help` or installed skills via `install --skills` | Tool schemas loaded in context |
| **Architecture** | CLI commands → daemon process | Structured tool calls |

---

## Complete Command Reference

### Page Navigation
```bash
playwright-cli open [url]        # Open browser, optionally navigate
playwright-cli goto <url>        # Navigate to a URL
playwright-cli close             # Close the page
playwright-cli go-back           # Go back in history
playwright-cli go-forward        # Go forward in history
playwright-cli reload            # Reload the page
```

### Element Interaction
```bash
playwright-cli click <ref>       # Click an element
playwright-cli dblclick <ref>    # Double-click an element
playwright-cli type <text>       # Type text into focused/editable element
playwright-cli fill <ref> <text> # Fill text (clear + type)
playwright-cli select <ref> <v>  # Select dropdown option
playwright-cli check <ref>       # Check checkbox/radio
playwright-cli uncheck <ref>     # Uncheck checkbox
playwright-cli hover <ref>       # Hover over element
playwright-cli drag <s> <e>      # Drag and drop
playwright-cli upload <file>     # Upload file(s)
```

### Extraction & Screenshots
```bash
playwright-cli snapshot          # Capture page snapshot (YAML)
playwright-cli snapshot --filename=f  # Save to specific file
playwright-cli snapshot --depth=N    # Limit depth
playwright-cli screenshot        # Screenshot page
playwright-cli screenshot [ref]  # Screenshot specific element
playwright-cli pdf               # Save page as PDF
```

### Page Info & Debugging
```bash
playwright-cli requests          # List network requests
playwright-cli request <num>     # Show request details
playwright-cli console           # Show console messages
playwright-cli eval <fn> [ref]  # Execute JavaScript
playwright-cli dialog-accept     # Accept dialog
playwright-cli dialog-dismiss    # Dismiss dialog
```

### Session & State
```bash
playwright-cli state-save [f]    # Save cookies + localStorage
playwright-cli state-load <f>    # Load storage state
playwright-cli cookie-list       # List cookies
playwright-cli cookie-get <n>    # Get cookie
playwright-cli cookie-set <n> <v> # Set cookie
playwright-cli tab               # Switch/create tabs
playwright-cli show              # Open visual dashboard
```

### Network Mocking
```bash
playwright-cli route <pattern> [opts]    # Mock network requests
playwright-cli route-list                 # List active routes
playwright-cli unroute [pattern]          # Remove routes
```

### Browser Options
```bash
playwright-cli open --headed              # Show browser UI
playwright-cli open --browser=chrome      # Specific browser
playwright-cli open --browser=firefox
playwright-cli open --browser=webkit
playwright-cli open --persistent          # Save profile to disk
playwright-cli open --profile=<path>      # Custom profile
playwright-cli attach --extension         # Connect via extension
playwright-cli attach --cdp=<url>         # Connect via CDP
```

---

## When to Use Each Approach

### Use Playwright CLI when:
- Working with Claude Code, Copilot, Cursor, or similar coding agents
- Context windows are tight and token efficiency matters
- Running automated tests in CI/CD
- Quick web scraping tasks
- Recording demo videos (`playwright-cli video`)
- Repetitive, deterministic workflows

### Use Playwright MCP when:
- Building specialized autonomous agent loops
- Exploratory automation where structure is unknown
- Self-healing tests that adapt to page changes
- Long-running workflows needing persistent context
- Rich introspection and iterative reasoning needed

---

## Setup

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills        # Optional: install skills for agents
```

### Configuration
The CLI reads `.playwright/cli.config.json` automatically. Supports:
- `browser.browserName`: chromium | firefox | webkit
- `browser.isolated`: keep profile in memory (default: true)
- `browser.launchOptions`: Playwright launch options
- `browser.contextOptions`: viewport, etc.
- `network`: timeout, interception rules

---

## Use Cases

1. **Automated Testing**: Snap + interact → assert without loading full DOM into LLM
2. **Web Scraping**: `snapshot` → extract YAML → parse → store
3. **Demo Recording**: `video` flag captures browser sessions
4. **Form Automation**: Fill/submit flows with deterministic refs
5. **Visual Regression**: Screenshot comparison with element-level refs
6. **Cookie/State Management**: Persistent sessions across agent runs

---

## Related

- [Playwright CLI GitHub](https://github.com/microsoft/playwright-cli)
- [Playwright CLI Docs](https://playwright.dev/agent-cli/introduction)
- [Playwright MCP](https://playwright.dev/docs/mcp)
