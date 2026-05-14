# 🚀 MCP QUICK START — 2026-04-24

> **GUÍA RÁPIDA** para usar los MCPs más útiles  
> **Copiá y usá** cuando necesites

---

## 🎯 LOS 5 MCPs QUE USÁS 80% DEL TIEMPO

### 1️⃣ context7 — Buscá en docs/code

```
trigger: "buscar en docs", "cómo funciona X", "entender codebase"
use: Ask questions about any library or codebase
```

### 2️⃣ obsidian — Tu knowledge personal

```
trigger: "mis notas", "mi vault", "buscar en mis docs"
use: Search your personal notes and knowledge base
```

### 3️⃣ exa / firecrawl — Web search & scraping

```
trigger: "buscar en web", "qué dice X hoy", "extraer datos"
use: exa = search, firecrawl = extract structured data
```

### 4️⃣ github — Code & repos

```
trigger: "GitHub", "issues", "PRs", "repo"
use: Create issues, PRs, search code
```

### 5️⃣ filesystem — Archivos locales

```
trigger: "archivo", "leer X", "escribir"
use: Read/write files in your project
```

---

## 📋 COMMANDS RÁPIDOS

| Para...                | Usá...                | Ejemplo                               |
|------------------------|-----------------------|---------------------------------------|
| Leer docs de lib       | `context7`            | "How does langgraph work?"            |
| Buscar mis notas       | `obsidian`            | "What did I learn about X?"           |
| Buscar en web          | `exa`                 | "Latest news about AI agents"         |
| Scraping               | `firecrawl-mcp`       | "Extract all Blog posts from X"       |
| Imágenes IA            | `nanobanana`          | "Generate a logo for X"               |
| Diagramas              | `excalidraw`          | "Create flow diagram for X"           |
| Issues/PRs             | `github`              | "Create issue about X"                |
| Browser                | `Playwright`          | "Click button on X"                   |
| Database               | `supabase`            | "Query table X"                       |
| Workflows              | `n8n-mcp`             | "Run workflow X"                      |
| Testing                | `TestSprite`          | "Run E2E test for X"                  |
| Notes rápido           | `qmd`                 | "Save quick note X"                   |

---

## 🔧 SETUP EN 5 MIN

```bash
# 1. Copiá tu API keys en .env
CONTEXT7_API_KEY=your_key_here
GITHUB_TOKEN=your_token_here
NOTION_API_KEY=your_key_here

# 2. Restart tu AI tool
# Los MCPs se cargan solos

# 3. Listo! Ya podés usar
```

---

## ⚡ QUICK EXAMPLES

### Buscar en docs (context7)
```
"How do I use LangGraph in Python?"
"What's the API for supabase-js?"
"Explain the Claude Code setup"

```

### Buscar en web (exa)
```
"Latest React 19 features 2026"
"Best AI agent frameworks comparison"
"Python async best practices 2026"
```

### Extraer datos (firecrawl)
```
"Extract all pricing from https://example.com"
"Get all blog posts from X"
"Scrap product info from Y"
```

### Generar imágenes (nanobanana)
```
"Generate a minimalist logo for a tech startup"
"Create abstract art with blue and orange"
"Edit: Add a sunset to this image"
```

---

## 🎯 ERROR COMMONES

| Error                     | Fix                                    |
|---------------------------|----------------------------------------|
| "MCP not found"           | Restart AI tool, check .mcp.json       |
| "API key missing"         | Check .env file                        |
| "Timeout"                 | Some MCPs are slow, be patient         |
| "Permission denied"       | Check token permissions                |

---

> **Recordá:** Los MCPs están listados en `.mcp.json`  
> **Para usar:** Solo pedilo en natural language!  
> **Más info:** `04_MCP_CATALOG.md`
