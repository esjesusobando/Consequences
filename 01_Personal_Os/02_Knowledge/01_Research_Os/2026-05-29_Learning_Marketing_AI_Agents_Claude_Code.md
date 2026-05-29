---
title: "Creé un equipo de Marketing con Agentes de IA: Claude Code"
source: YouTube (Lorena Bordonaba)
url: (local .vtt file)
author: Lorena Bordonaba
date: 2026-05-29
type: learning
tags: [marketing, ai-agents, claude-code, mcp, automation, content-creation, workflow]
status: active
---

# Learning Always: Equipo de Marketing con Agentes de IA (Claude Code)

## Metadata
- **Video**: Creé un equipo de Marketing con Agentes de IA: Claude Code
- **Channel**: Lorena Bordonaba
- **Duration**: ~22 min
- **Language**: Spanish
- **Extracted**: 2026-05-29

---

## 1. Resumen Estructurado

Lorena muestra cómo construir un **equipo de marketing completo usando Claude Code** — sin saber programar. Desde la instalación hasta la automatización de flujos completos con agentes que trabajan en cadena.

### Timeline del video

| Sección | Timestamp | Contenido |
|---------|-----------|-----------|
| Instalación y accesos | 0:00 - 4:00 | Claude Code vía app desktop, IDE (Cursor/Windsurf), o terminal |
| Estructura del proyecto | 4:00 - 10:00 | Crear carpetas: contexto, marca, plantillas |
| Creación de agentes | 10:00 - 15:00 | Agentes especializados (estrategia, contenido, análisis) |
| MCPs y conexiones | 15:00 - 18:00 | Conectar herramientas externas (Make, APIs) |
| Automatización de flujos | 18:00 - 22:00 | Flujos encadenados entre agentes |

---

## 2. Framework Extraído: Marketing Agent System

### Arquitectura del Sistema

```
PROYECTO/
├── .claude/
│   ├── agents/          ← Agentes especializados por rol
│   └── commands/        ← Comandos personalizados (flujos MD)
├── contexto/            ← Documentación base de marca, estrategia, conocimiento
├── marca/               ← Colores, tipografía, identidad visual, tono de voz
└── plantillas/          ← Templates de posts, presentaciones, thumbnails
```

### Los 3 Roles de Agentes de Marketing

| Rol | Función | Input | Output |
|-----|---------|-------|--------|
| **Estratega** | Define qué contenido crear, cuándo, y por qué | Objetivos de marketing, buyer persona, calendario editorial | Briefs, estrategia de contenido, planificación |
| **Creador de Contenido** | Produce el contenido en múltiples formatos | Brief del estratega + documentación de marca | Posts, scripts, newsletters, thumbnails |
| **Analista** | Mide resultados, extrae insights, sugiere optimización | Datos de publicación, métricas, engagement | Reportes, recomendaciones, ajustes de estrategia |

### Flujo de Trabajo (Workflow Automatizado)

```
IDEA → ESTRATEGA (brief) → CREADOR (contenido) → REVISIÓN → PUBLICACIÓN → ANALISTA (métricas)
```

---

## 3. Herramientas y MCPs

| Herramienta | Uso en el sistema |
|-------------|------------------|
| **Claude Code** (app desktop) | Orquestador principal, acceso a chat + cowork + código |
| **Claude Code** (IDE) | Integración con Cursor/Windsurf para desarrollo |
| **Claude Code** (terminal) | Control vía línea de comandos |
| **MCPs** | Conexión con APIs externas (Make, redes sociales, analytics) |
| **Make (Integromat)** | Automatización de flujos entre agentes y plataformas |
| **Archivos .md** | Documentación de contexto, marca, y plantillas |

### Tips clave sobre MCPs
- Los MCPs permiten conectar Claude Code con APIs externas
- Se configuran dentro de la carpeta del proyecto
- Permiten acciones como: publicar en redes, consultar analytics, enviar emails
- Make + Claude Code = flujos sin código entre agentes y plataformas

---

## 4. Prompts y Patrones Reutilizables

### Estructura de Contexto (archivos .md)
```
contexto/
├── estrategia.md        ← Objetivos, KPIs, buyer persona
├── conocimiento.md      ← Conocimiento del negocio/industria
└── tono-de-voz.md       ← Guía de tono y estilo
```

### Estructura de Marca (archivos .md)
```
marca/
├── colores.md           ← Paleta de colores
├── tipografia.md        ← Fuentes y jerarquía
└── guia-visual.md       ← Elementos visuales, logo, etc.
```

### Estructura de Plantillas (archivos .md)
```
plantillas/
├── youtube-script.md     ← Template de guión
├── linkedin-post.md      ← Template de post
└── newsletter.md         ← Template de newsletter
```

### Comando Personalizado (flujo .md)
```
# youtube-workflow.md
Descripción: Flujo completo YouTube: idea → publicación

1. @estratega "Analiza esta idea y genera un brief para YouTube"
2. @creador "Toma el brief y genera script + thumbnail description"
3. @analista "Revisa el contenido y sugiere optimizaciones SEO"
```

---

## 5. Conexiones al Personal OS

### Mapeo Directo con el OS

| Elemento del video | Equivalente en el OS |
|--------------------|----------------------|
| Carpeta `contexto/` | `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Personal_Os/04_Contexto/` |
| Carpeta `marca/` | `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Personal_Os/05_Marca/` |
| Carpeta `plantillas/` | `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Personal_Os/06_Plantillas/` |
| Agentes especializados | `01_Personal_Os/01_Core/02_Tools/01_Agents/` (definiciones de agentes) |
| MCPs | `01_Personal_Os/01_Core/02_Tools/03_MCPs/` (configuraciones MCP) |
| Flujos automatizados | `01_Personal_Os/01_Core/02_Tools/02_Skills/` (skills + workflows) |

### Lo que el OS ya tiene y el video recomienda

✅ **Contexto** — Ya existe como `04_Contexto/`
✅ **Marca** — Ya existe como `05_Marca/`, pero falta contenido
✅ **Plantillas** — Ya existe como `06_Plantillas/`
⚠️ **Agentes de Marketing** — No hay agentes especializados para marketing aún
⚠️ **Flujos automatizados** — No hay workflows de marketing definidos
❌ **MCPs de marketing** — No hay conexiones MCP para herramientas de marketing

---

## 6. Insights y Aprendizajes Clave

### Lo que hace efectivo este sistema
1. **Contexto primero**: La calidad del agente depende de la calidad del contexto que le das. Si tu documentación de marca es pobre, el output será genérico.
2. **Separación de roles**: Tener agentes separados para estrategia, creación y análisis evita que un solo agente haga todo mal.
3. **Flujos > Agentes individuales**: El poder real está en encadenar agentes, no en usarlos uno por uno.
4. **Sin código**: Todo se hace con archivos .md y configuraciones — no se necesita saber programar.
5. **MCPs como puente**: La conexión con herramientas externas (Make, APIs) es lo que transforma un asistente en un equipo de marketing real.

### Diferencia clave con el enfoque actual del OS
El OS tiene la infraestructura (contexto, marca, plantillas, agentes) pero **no tiene agentes especializados de marketing ni flujos automatizados**. El video muestra exactamente cómo implementar esos agentes y flujos usando la infraestructura que ya tenemos.

---
*Integrado al PersonalOS v4.9 Consequences — 2026-05-29*
