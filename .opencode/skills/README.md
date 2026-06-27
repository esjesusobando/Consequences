# .opencode/skills — Skills Locales del Proyecto

> **Versión:** 1.0
> **Fecha:** 2026-04-29
> **Estado:** ✅ Activo
> **Proyecto:** Think Different PersonalOS v4.7 Consequences

---

## 📁 Propósito

Este directorio contiene **skills locales** específicas del proyecto Think Different que no están disponibles globalmente en `~/.config/opencode/skills/`.

---

## 🧠 Skills Disponibles

| Skill             | Descripción                                       | Estado   | Ubicación                         |
| ----------------- | ------------------------------------------------- | -------- | --------------------------------- |
| **ui-ux-pro-max** | UI/UX design intelligence con searchable database | ✅ Activo | `.opencode/skills/ui-ux-pro-max/` |

---

## 🔗 Skills Globales vs Locales vs Sistema

| Tipo                   | Ubicación                                    | Uso                                            | Cantidad |
| ---------------------- | -------------------------------------------- | ---------------------------------------------- | -------- |
| **Skills del Sistema** | `01_Personal_Os/01_Core/02_Tools/02_Skills/` | FUENTE DE VERDAD - 392 skills en 15 áreas      | 392      |
| **Skills Globales**    | `~/.config/opencode/skills/`                 | Skills instaladas globalmente (gentleman, etc) | Variable |
| **Skills Locales**     | `.opencode/skills/`                          | Skills específicas del proyecto                | 1        |

---

## 📋 Integración con el Sistema

Las skills del sistema en `01_Personal_Os/01_Core/02_Tools/02_Skills/` están organizadas en 12 Áreas Funcionales:

| Área                    | Descripción                                  |
| ----------------------- | -------------------------------------------- |
| 00_Compound_Engineering | Core CE — SDD + Reviews                      |
| 00_System_Core          | Stack base del OS + Gcierr                   |
| 10_Skill_Auditor        | Auditoría de skills                          |
| 01_Creacion_Contenidos  | Brand, YouTube, SEO, Carruseles              |
| 02_Diseno_Ui_Ux         | Product Design, UI/UX, Taste, Minimal        |
| 03_Video_Media          | Video Intel, James Cameron, Remotion, Audio  |
| 04_Automatizacion       | N8N, Firecrawl                               |
| 05_Workflows            | Agent Teams, PM, Orchestrator                |
| 06_Tools                | Skill Creator, Testing, DevOps, Data Analyst |
| 07_Personal_Os          | Life OS, Hillary, Rituales                   |
| 08_Invictus_Web         | Playwright, Superpowers, Browser Automation  |
| 09_Claude_Ads           | Ads, Evals, Agents, Assets, Research         |

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

_Actualizado: 2026-05-24 (Docs Consistency Audit v4.7 Consequences)_