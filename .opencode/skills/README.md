# .opencode/skills — Skills Locales del Proyecto

> **Versión:** 1.1
> **Fecha:** 2026-06-07
> **Estado:** ✅ Activo
> **Proyecto:** Think Different PersonalOS v4.9 Consequences

---

## 📁 Propósito

Este directorio contiene **skills locales** específicas del proyecto Think Different que no están disponibles globalmente en `~/.config/opencode/skills/`.

---

## 🧠 Skills Disponibles

| Skill | Descripción | Estado | Ubicación |
|-------|-------------|--------|-----------|
| **ui-ux-pro-max** | UI/UX design intelligence con searchable database | ✅ Activo | `.opencode/skills/ui-ux-pro-max/` |

---

## 🔗 Skills Globales vs Locales vs Sistema

| Tipo | Ubicación | Uso | Cantidad |
|------|-----------|-----|----------|
| **Skills del Sistema** | `01_Personal_Os/01_Core/02_Tools/02_Skills/` | FUENTE DE VERDAD - 392 skills en 15 áreas | 392 |
| **Skills Globales** | `~/.config/opencode/skills/` | Skills instaladas globalmente (gentleman, etc) | Variable |
| **Skills Locales** | `.opencode/skills/` | Skills específicas del proyecto | 1 |

---

## 📋 Integración con el Sistema

Las skills del sistema en `01_Personal_Os/01_Core/02_Tools/02_Skills/` están organizadas en **15 Áreas Funcionales**:

| Área (Directorio) | Skills | Descripción |
|------|-------|-------------|
| 00_Agent_Teams_Lite | 14 | SDD sub-agentes, registry, JARVIS agent configs |
| 00_Compound_Engineering | 63 | Core CE — SDD + Compound Engineering |
| 00_Personal_Os | 24 | Life OS, Hillary, Rituales, Fantásticos |
| 00_Skill_Auditor | 1 | Auditoría de skills |
| 00_System_Core | 1 | Stack base del OS |
| 00_Workflows | 43 | Agent Teams, PM, Orchestrator, Workflows del OS |
| 01_Creacion_Contenidos | 49 | Brand, YouTube, SEO, Carruseles, Contenido |
| 02_Diseno_Ui_Ux | 34 | Product Design, UI/UX, Taste, Minimal, Frontend |
| 03_Video_Media | 7 | Video Intel, James Cameron, Remotion, Audio |
| 04_Automatizacion | 27 | N8N, Firecrawl, GWS Client, Automations |
| 05_Claude_Ads | 21 | Claude Ads, Promoted Content, Agents, Research |
| 06_Tools | 83 | Skill Creator, Testing, DevOps, Data, Utilities |
| 07_Invictus_Web | 18 | Playwright, Superpowers, Browser Automation |
| 08_JAO | 6 | Entrevistador, Humanizador, Superpowers JAO |
| 10_Laia_Learning | 1 | Sistema de aprendizaje personal |

Accesibles vía:
- Commands SDD: `/sdd-init`, `/sdd-spec`, etc.
- Commands CE: `/ce:ideate`, `/ce:plan`, etc.
- Skills globales instaladas en `~/.config/opencode/skills/gentleman/`

---

## 🔧 Agregar una Skill Local

Para agregar una skill local:

1. Crear carpeta con nombre: `skill-name/SKILL.md`
2. Definir triggers y funcionalidad
3. La skill estará disponible en el proyecto

---

## 📌 Nota sobre Paths

> **⚠️ PATH CRITICAL:** Skills del sistema en `01_Personal_Os/01_Core/02_Tools/02_Skills/` — NO usar paths antiguos como `01_Core/03_Skills/` o `.agent/02_Skills/`

---

_Actualizado: 2026-06-07 (Comprehensive Review — v4.9 Consequences)_
