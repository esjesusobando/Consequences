# 📡 MCP_CATALOG — PersonalOS v1.0

**Versión:** 1.0
**Última actualización:** 2026-04-18
**Config activa (Claude Code):** `.mcp.json` (raíz del proyecto)
**Config activa (OpenCode):** `~/.config/opencode/opencode.json`
**Source (backup):** `01_Core/05_Mcp/01_Claude_Code/mcp.json`

> ⚠️ Al modificar MCPs: actualizar SIEMPRE el source Y el config activo correspondiente.

---

## 🗺️ Catálogo Completo (36 MCPs)

### 🔍 Search & Research

| MCP | Estado | Agente que lo usa | Skill que lo necesita | Notas |
|-----|--------|-------------------|----------------------|-------|
| **exa** | ✅ Activo | Orquestador, Researchers | 02_Project_Manager, 17_SEO | Búsqueda semántica premium |
| **brave-search** | ⚠️ Placeholder | Orquestador | Research workflows | Requiere `BRAVE_API_KEY` |
| **stackoverflow** | ✅ Activo | Platform Engineer | 05_Vibe_Coding, 07_DevOps | Búsqueda técnica |
| **firecrawl-mcp** | ✅ Activo | Researchers | 11_Doc_Processing | Web scraping + parsing |

### 🧠 Memory & Knowledge

| MCP | Estado | Agente que lo usa | Skill que lo necesita | Notas |
|-----|--------|-------------------|----------------------|-------|
| **engram** | ✅ CRÍTICO | Todos los agentes | Todos | Memoria persistente cross-session |
| **aim-memory-bank** | ✅ Activo | Orquestador | 08_Personal_Os | Knowledge graph local |
| **notebooklm** | ✅ Activo | Data Engineer | 16_Data_Analyst | Análisis de documentos |

### 📝 Notes & Documentation

| MCP | Estado | Agente que lo usa | Skill que lo necesita | Notas |
|-----|--------|-------------------|----------------------|-------|
| **Notion** | ✅ Activo | Orquestador, PM | 02_Project_Manager | Base de conocimiento |
| **mcp-obsidian** | ✅ Activo | Orquestador | 08_Personal_Os | Vault local |
| **obsidian-api** | ✅ Activo | Orquestador | 08_Personal_Os | Failover de mcp-obsidian |

### 🌐 Browser & DevTools

| MCP | Estado | Agente que lo usa | Skill que lo necesita | Notas |
|-----|--------|-------------------|----------------------|-------|
| **Playwright** | ✅ Activo | Platform Engineer | 06_Testing | E2E testing automation |
| **chrome-devtools** | ✅ Activo | Platform Engineer | 06_Testing, 07_DevOps | Debug en browser |
| **eagle-mcp** | ✅ Activo | Design Ops | 04_Product_Design | Gestión de assets visuales |

### 🤖 AI & Code

| MCP | Estado | Agente que lo usa | Skill que lo necesita | Notas |
|-----|--------|-------------------|----------------------|-------|
| **context7** | ✅ CRÍTICO | Todos los agentes | Todos | Docs de librerías en contexto |
| **zai-mcp-server** | ✅ Activo | Orquestador | 13_System_Master | AI utilitario |
| **github** | ✅ Activo | Platform Engineer | 07_DevOps, CE | GitHub API (PRs, issues, repos) |
| **task-master-ai** | ✅ Activo | Orquestador | 02_Project_Manager | Gestión de tareas IA |
| **mcp-server-anthropic** | ✅ Activo | Orquestador | 14_Anthropic_Harness | APIs Anthropic directas |

### 📊 Data & Analytics

| MCP | Estado | Agente que lo usa | Skill que lo necesita | Notas |
|-----|--------|-------------------|----------------------|-------|
| **supabase** | ✅ Activo | Data Engineer | 16_Data_Analyst | DB + Auth + Storage |
| **postgres** | ⚠️ Placeholder | Data Engineer | 16_Data_Analyst | Requiere config local |
| **sqlite** | ⚠️ Placeholder | Data Engineer | 16_Data_Analyst | Requiere config local |
| **Amplitude** | ⚠️ Sin headers | Data Engineer | 16_Data_Analyst | Requiere `AMPLITUDE_API_KEY` |
| **supadata** | ✅ Activo | Data Engineer | 16_Data_Analyst | Data pipeline |

### 🔄 Workflow & Project Management

| MCP | Estado | Agente que lo usa | Skill que lo necesita | Notas |
|-----|--------|-------------------|----------------------|-------|
| **n8n-mcp** | ✅ Activo | Orquestador | 12_N8N | Automatizaciones n8n |
| **Linear** | ✅ Activo | Orquestador, PM | 02_Project_Manager | Issue tracking |
| **atlassian** | ⚠️ Placeholder | PM | 02_Project_Manager | Requiere `ATLASSIAN_TOKEN` |
| **jira-extended** | ⚠️ Placeholder | PM | 02_Project_Manager | Requiere config Jira |

### 💬 Communication

| MCP | Estado | Agente que lo usa | Skill que lo necesita | Notas |
|-----|--------|-------------------|----------------------|-------|
| **fireflies** | ✅ Activo | Marketing Tech | 09_Marketing | Transcripción de reuniones |
| **slack** | ⚠️ Placeholder | Orquestador | 09_Marketing | Requiere `SLACK_BOT_TOKEN` |
| **google-workspace** | ✅ Activo | Orquestador | 08_Personal_Os | Gmail, Calendar, Drive |

### 📐 Design

| MCP | Estado | Agente que lo usa | Skill que lo necesita | Notas |
|-----|--------|-------------------|----------------------|-------|
| **excalidraw-yctimlin** | ✅ Activo | Design Ops | 04_Product_Design | Diagramas colaborativos |
| **pencil** | ✅ Activo | Design Ops | 04_Product_Design | Design system |

### 🛠️ DevOps & Infrastructure

| MCP | Estado | Agente que lo usa | Skill que lo necesita | Notas |
|-----|--------|-------------------|----------------------|-------|
| **docker** | ✅ Activo | Platform Engineer | 07_DevOps | Contenedores |
| **sentry** | ⚠️ Placeholder | Platform Engineer | 07_DevOps | Requiere `SENTRY_AUTH_TOKEN` |
| **filesystem** | ✅ Activo | Orquestador | Todos | Acceso a sistema de archivos |
| **vercel** | ✅ Activo | Platform Engineer | 07_DevOps | Deploy frontend |
| **TestSprite** | ✅ Activo | Platform Engineer | 06_Testing | Test automation |

### 🎨 Others

| MCP | Estado | Agente que lo usa | Skill que lo necesita | Notas |
|-----|--------|-------------------|----------------------|-------|
| **@magicuidesign/mcp** | ✅ Activo | Design Ops | 04_Product_Design | UI components premium |
| **recall** | ✅ Activo | Orquestador | 08_Personal_Os | Recall de info personal |

---

## ⚡ MCPs Críticos para el Orquestador

Estos MCPs deben estar siempre activos para que el orquestador funcione:

| Prioridad | MCP | Por qué es crítico |
|-----------|-----|--------------------|
| **P0** | **engram** | Sin memoria persistente, cada sesión empieza ciega |
| **P0** | **context7** | Sin docs de librerías, el código es guessing |
| **P0** | **github** | Sin acceso a repos, no hay CI/CD ni PRs |
| **P1** | **filesystem** | Acceso a archivos locales del OS |
| **P1** | **Notion** | Base de conocimiento del proyecto |
| **P1** | **Linear** | Tracking de issues y tareas |
| **P2** | **supabase** | Data persistence para proyectos |
| **P2** | **Playwright** | Testing automatizado |

---

## 🔧 MCPs Pendientes de Configurar

Para activar estos MCPs, agregar las credenciales reales:

| MCP | Variable requerida | Dónde conseguirla |
|-----|--------------------|-------------------|
| brave-search | `BRAVE_API_KEY` | https://brave.com/search/api/ |
| slack | `SLACK_BOT_TOKEN` | https://api.slack.com/apps |
| sentry | `SENTRY_AUTH_TOKEN` | https://sentry.io/settings/account/api/auth-tokens/ |
| atlassian | `ATLASSIAN_TOKEN` | https://id.atlassian.com/manage-profile/security/api-tokens |
| Amplitude | `AMPLITUDE_API_KEY` | https://analytics.amplitude.com/settings/projects |

---

## 📋 Resumen de Estado

| Estado | Cantidad | Descripción |
|--------|----------|-------------|
| ✅ Activo | 27 | Funcionales y configurados |
| ⚠️ Placeholder | 7 | Necesitan credenciales reales |
| ❌ Sin config | 2 | postgres, sqlite — requieren setup local |

**Total: 36 MCPs configurados**
