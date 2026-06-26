# 🔌 MCP CATALOG — Think Different PersonalOS v3.1

> **CATÁLOGO COMPLETO** de los 38 MCP servers activos en Claude Code
> **Para qué sirve cada uno** + **Cuándo usarlo**
> **Última actualización:** 2026-05-03

---

## 🎯 QUICK REFERENCE — ¿Qué necesito?

| Necesidad                                | MCP                              | Quick Use                                                        |
|-----------------------------------------|---------------------------------|-----------------------------------------------------------------|
| **Buscar en docs/code**                  | `context7`                       | `When I need to understand a codebase or docs`                   |
| **Leer mis notas**                       | `obsidian`                       | `When I need to search my personal notes`                        |
| **Buscar en web**                        | `exa`                            | `When I need fresh web search results`                           |
| **Scraping website**                     | `firecrawl-mcp`                  | `When I need to extract data from websites`                      |
| **Generar imágenes**                     | `nanobanana`                     | `When I need AI-generated images`                                |
| **Trabajar con GitHub**                  | `github`                         | `When I need to interact with repos, issues, PRs`                |
| **Navegar web/click**                    | `Playwright`                     | `When I need to interact with a browser`                         |
| **Base de datos**                        | `supabase`                       | `When I need database queries`                                   |
| **Crear diagramas**                      | `excalidraw`                     | `When I need visual diagrams`                                    |
| **Automatizar workflows**                | `n8n-mcp`                        | `When I need workflow automation`                                |
| **Gestión de tareas**                    | `Linear`                         | `When I need issue tracking`                                     |
| **E2E testing**                          | `TestSprite`                     | `When I need to run E2E tests`                                   |
| **Memoria persistente**                  | `engram`                         | `When I need persistent memory across sessions`                  |
| **Archivos locales**                     | `filesystem`                     | `When I need to read/write local files`                          |
| **Pensamiento encadenado**               | `sequential-thinking`            | `When I need structured problem solving`                         |

---

## 📋 CATÁLOGO COMPLETO (38 MCPs)

### 🧠 KNOWLEDGE (4)

| MCP                          | Transport                 | Para qué                                                                         | Env Vars                        |
|-----------------------------|--------------------------|---------------------------------------------------------------------------------|--------------------------------|
| **context7**                 | HTTP                      | Docs & codebase Q&A. Resume papers, docs, codebases entiendibles.                | CONTEXT7_API_KEY                |
| **obsidian**                 | stdio                     | Mi vault personal de notas. Notas, docs, knowledge personal.                     |--------------------------------|
| **eagle-mcp**                | HTTP                      | Eagle app integration. Asset management visual.                                  |--------------------------------|
| **supabase**                 | HTTP                      | Database queries. SQL + datos estructurados.                                     | SUPABASE_API_KEY                |

### 🔧 DEV (4)

| MCP                           | Transport                 | Para qué                                                         | Env Vars                    |
|------------------------------|--------------------------|-----------------------------------------------------------------|----------------------------|
| **github**                    | HTTP                      | Issues, PRs, repos. Automatización GitHub.                       | GITHUB_TOKEN                |
| **vercel**                    | HTTP                      | Deploys, serverless.部署 a producción.                             |----------------------------|
| **Playwright**                | stdio                     | Browser automation. Web scraping, testing, click.                |----------------------------|
| **filesystem**                | stdio                     | Read/write local files. Archivos del proyecto.                   |----------------------------|

### 🌐 SCRAPING (3)

| MCP                                | Transport                 | Para qué                                                       | Env Vars                         |
|-----------------------------------|--------------------------|---------------------------------------------------------------|---------------------------------|
| **exa**                            | stdio                     | Web search avanzado. Resultados más relevantes.                | EXA_API_KEY                      |
| **firecrawl-mcp**                  | stdio                     | Web scraping/Extraction. Extraer contenido web.                | FIRECRAWL_API_KEY                |
| **chrome-devtools**                | stdio                     | Chrome DevTools. Debug browser, network.                       |---------------------------------|

### 📝 NOTES/WIKI (2)

| MCP                             | Transport                 | Para qué                                                                               | Env Vars                      |
|--------------------------------|--------------------------|---------------------------------------------------------------------------------------|------------------------------|
| **obsidian-api**                | stdio                     | FAILOVER: Obsidian backup. Mismo vault, falla si principal no responde.                |------------------------------|
| **Notion**                      | stdio                     | Wiki + DB de Notion. Bases de datos, pages.                                            | NOTION_API_KEY                |

### ⚡ PRODUCTIVITY (4)

| MCP                                 | Transport                 | Para qué                                                     | Env Vars                          |
|------------------------------------|--------------------------|-------------------------------------------------------------|----------------------------------|
| **Linear**                          | HTTP                      | Issue tracking.Gestión de proyectos/tareas.                  | LINEAR_API_KEY                    |
| **n8n-mcp**                         | stdio                     | Workflow automation. Crear flujos de trabajo.                |----------------------------------|
| **google-workspace**                | stdio                     | Gmail, Drive, Calendar. Email + archivos.                    |----------------------------------|
| **task-master-ai**                  | stdio                     | AI task management. Tareas con AI.                           | OPENROUTER_API_KEY                |

### 🎨 MEDIA (3)

| MCP                                    | Transport                 | Para qué                                                        | Env Vars                             |
|---------------------------------------|--------------------------|----------------------------------------------------------------|-------------------------------------|
| **nanobanana**                         | stdio                     | AI Image Gen (Gemini). Generar/editar imágenes.                 | GEMINI_API_KEY                       |
| **excalidraw-yctimlin**                | stdio                     | Diagramas visuales. Draws, diagrams, flowcharts.                | EXCALIDRAW_VAULT_PATH                |
| **fireflies**                          | stdio                     | Meeting transcription. Audio → notas.                           | FIREFLIES_API_KEY                    |

### 📊 DATA (3)

| MCP                           | Transport                 | Para qué                                                | Env Vars                        |
|------------------------------|--------------------------|--------------------------------------------------------|--------------------------------|
| **Amplitude**                 | HTTP                      | Product analytics. Métricas de producto.                |--------------------------------|
| **supadata**                  | stdio                     | Public data. APIs públicas, research.                   | SUPADATA_API_KEY                |
| **notebooklm**                | stdio                     | NotebookLM audio. Audio → insights.                     |--------------------------------|

### 🔒 SECURITY (2)

| MCP                       | Transport                 | Para qué                                                 | Env Vars                      |
|--------------------------|--------------------------|---------------------------------------------------------|------------------------------|
| **engram**                | stdio                     | Persistent memory. Memoria cross-session.                |------------------------------|
| **recall**                | HTTP                      | AI memory. Memoria con features extra.                   | RECALL_API_KEY                |

### 🧪 TESTING (2)

| MCP                           | Transport                 | Para qué                                                | Env Vars                          |
|------------------------------|--------------------------|--------------------------------------------------------|----------------------------------|
| **TestSprite**                | stdio                     | E2E testing. Tests con failover.                        | TESTSPRITE_PRIMARY                |
| **docker**                    | stdio                     | Container management.Builds, containers.                |----------------------------------|

### 🛠️ TOOLS (6)

| MCP                                   | Transport                 | Para qué                                             | Env Vars                    |
|--------------------------------------|--------------------------|-----------------------------------------------------|----------------------------|
| **aim-memory-bank**                   | stdio                     | Knowledge graphs. Graph-based memory.                |----------------------------|
| **qmd**                               | stdio                     | Quick notes. Notas rápidas desde CLI.                |----------------------------|
| **pencil**                            | stdio                     | Diagram gen. Pencil tool integration.                |----------------------------|
| **stackoverflow**                     | stdio                     | Stack Overflow search. Q&A from SO.                  |----------------------------|
| **zai-mcp-server**                    | stdio                     | Z-AI services. Miscellaneous AI.                     | Z_AI_API_KEY                |
| **@magicuidesign/mcp**                | stdio                     | UI generation. Figma → code.                         |----------------------------|

---

## 🎯 CUANDO USAR QUÉ — DECISION TREE

```
¿ Necesito buscar información ?
├── 📖 En mis notas personales
│   └── → obsidian (o obsidian-api si falla)
├── 📚 En docs técnicos
│   └── → context7
├── 🌐 En la web
│   └── → exa (búsqueda) o firecrawl-mcp (extracción)

¿ Necesito hacer algo ?
├── 🖥️ En un browser
│   └── → Playwright (click/interact) o chrome-devtools (debug)
├── 💻 En código
│   └── → github (issues/PRs) o filesystem (archivos)
├── 🎨 Generar algo visual
│   ├── 🖼️ Imagen
│   │   └── → nanobanana
│   └── 📊 Diagrama
│       └── → excalidraw o pencil
├── 📊 Datos
│   ├── 🐘 Database
│   │   └── → supabase
│   ├── 📈 Analytics
│   │   └── → Amplitude
│   └── 🔬 Research público
│       └── → supadata
├── ⚡ Automation
│   ├── 🔄 Workflow
│   │   └── → n8n-mcp
│   └── 📋 Tareas
│       └── → Linear o task-master-ai
├── 🧪 Testing
│   └── → TestSprite o docker
└── 🧠 Memoria
    ├── 💾 Persistent
    │   └── → engram
    └── 📝 Notes
        └── → qmd
```

---

## 🔧 SETUP REQUIREMENTS

### API Keys necesarios (configurar en .env):

```bash
# Required
CONTEXT7_API_KEY=           # context7.io
GITHUB_TOKEN=              # github.com/settings/tokens
NOTION_API_KEY=           # notion.so/integrations
LINEAR_API_KEY=           # linear.app/settings/api
GEMINI_API_KEY=            # aistudio.google.com

# Optional (para features extra)
FIRECRAWL_API_KEY=        # firecrawl.ai
EXA_API_KEY=              # exa.ai
SUPABASE_API_KEY=          # supabase.com/dashboard
SUPADATA_API_KEY=          # supadata.com
OPENROUTER_API_KEY=       # openrouter.ai
FIREFLIES_API_KEY=        # fireflies.ai
RECALL_API_KEY=           # getrecall.ai
Z_AI_API_KEY=            # z-ai.com
TESTSPRITE_PRIMARY=       # testsprite.com
```

---

## 🚨 TROUBLESHOOTING

| Problema                            | Solución                                                |
|------------------------------------|--------------------------------------------------------|
| MCP no connecta                     | Verificar que el server está corriendo                  |
| Token error                         | Revisar .env tiene el API key correcto                  |
| Obsidian no responds                | Usar `obsidian-api` como failover                       |
| Timeout                             | Muchos MCPs usan stdio → puede ser lento                |

---

> **Mantainer:** OS Owner  
> **Última actualización:** 2026-04-24
