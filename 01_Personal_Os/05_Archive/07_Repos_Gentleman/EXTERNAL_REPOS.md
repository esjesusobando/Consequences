# 📦 REPOS EXTERNOS CLONADOS

> **Lista de repos clonados localmente (no son parte del git principal)**
>
> Para clonar en otra máquina, ejecutar los comandos desde la raíz del proyecto.
>
> **Última actualización:** 2026-05-14 · **v4.1**

---

## 01 — Skill Creator Official (Anthropic)

| Dato           | Valor                                               |
|:---------------|:----------------------------------------------------|
| **URL**        | `https://github.com/anthropics/claude-plugins-official` |
| **Carpeta**    | `01_Claude_Ads/` (referencia)                      |
| **Propósito**  | Skill Creator v2.0 con sistema de evaluación         |
| **Fecha**      | 2026-03-27                                          |

```bash
git clone https://github.com/anthropics/claude-plugins-official
```

**Contenido:** `plugins/skill-creator/`, `scripts/`, `eval-viewer/`

---

## 02 — Sub-Agent Statusline

| Dato           | Valor                                               |
|:---------------|:----------------------------------------------------|
| **URL**        | `https://github.com/Joaquinvesapa/sub-agent-statusline` |
| **Carpeta**    | `21_Sub_Agent_Statusline/`                          |
| **npm**        | `opencode-subagent-statusline` (instalado globalmente) |
| **Stars**      | 32 ⭐ · **Forks:** 6                                |
| **Fecha**      | 2026-04-25                                          |

```bash
# Instalación
npm install -g opencode-subagent-statusline

# Configuración ~/.config/opencode/tui.json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": ["opencode-subagent-statusline"]
}
```

**Funcionalidades:** Sidebar TUI con subagentes, tiempo elapsed, token/context usage

---

## 03 — Frontend Slides ⭐ PREDETERMINADA

| Dato           | Valor                                               |
|:---------------|:----------------------------------------------------|
| **URL**        | `https://github.com/zarazhangrui/frontend-slides`   |
| **Carpeta**    | `09_Frontend_Slides/` **(Submodule)**              |
| **Propósito**  | HTML Presentations — Presentaciones web de alto impacto |
| **Stars**      | ⭐⭐⭐ Destacada                                      |
| **Fecha**      | 2026-04-28                                          |

```bash
git clone https://github.com/zarazhangrui/frontend-slides
```

**Stack:** Zero dependencies (HTML inline), CSS/JS embebido

### Estilos Disponibles:
| Categoría  | Presets                                                   |
|:-----------|:----------------------------------------------------------|
| **Dark**   | Bold Signal, Electric Studio, Creative Voltage, Dark Botanical |
| **Light**  | Notebook Tabs, Pastel Geometry, Split Pastel, Vintage Editorial |
| **Special**| Neon Cyber, Terminal Green, Swiss Modern, Paper & Ink    |

### Archivos principales:
| Archivo                    | Descripción                        |
|:---------------------------|:-----------------------------------|
| `SKILL.md`                 | Workflow completo (~320 líneas)    |
| `STYLE_PRESETS.md`         | 12 presets visuales                |
| `viewport-base.css`       | CSS responsive (100vh/slide)        |
| `html-template.md`        | Arquitectura HTML + features JS     |
| `animation-patterns.md`   | Snippets animación CSS/JS          |
| `scripts/extract-pptx.py` | Extracción contenido PPT           |
| `scripts/deploy.sh`       | Deploy a Vercel                    |
| `scripts/export-pdf.sh`   | Export a PDF (Playwright)           |

### Uso:
```
/frontend-slides
> "Create a pitch deck for my AI startup"
```

---

## 04 — TubeMaster

| Dato           | Valor                                               |
|:---------------|:----------------------------------------------------|
| **URL**        | `https://github.com/Gentleman-Programming/tubemaster` |
| **Carpeta**    | `23_Tubemaster/`                                   |
| **Propósito**  | YouTube Channel Operations Manager                   |
| **Stars**      | 9 ⭐ · **Forks:** 2                                 |
| **Fecha**      | 2026-04-25                                          |

```bash
git clone https://github.com/Gentleman-Programming/tubemaster
cd tubemaster && npm install && npm run dev
```

**Funcionalidades:** Auth once → operate end-to-end, 4 interfaces (Web UI, CLI, MCP, API), Agent integrations via MCP

---

## 05 — Personal OS Main

| Dato           | Valor                                               |
|:---------------|:----------------------------------------------------|
| **URL**        | `https://github.com/Gentleman-Programming/personal-os-main` |
| **Carpeta**    | `18_Personal_Os_Main/`                               |
| **Propósito**  | Reference PersonalOS (base para el OS)               |
| **Fecha**      | 2026-04-25                                          |

```bash
git clone https://github.com/Gentleman-Programming/personal-os-main
```

---

## 06 — Open Design

| Dato           | Valor                                               |
|:---------------|:----------------------------------------------------|
| **URL**        | `https://github.com/nexu-io/open-design`            |
| **Carpeta**    | `17_Open_Design/` **(Submodule)**                   |
| **Propósito**  | Open design system collaboratively                  |
| **Fecha**      | 2026-04-28                                          |

```bash
git clone https://github.com/nexu-io/open-design
```

---

## 07 — QMD (No clonado)

| Dato           | Valor                                               |
|:---------------|:----------------------------------------------------|
| **URL**        | `https://github.com/qmd/qmd`                         |
| **Propósito**  | Quick notes from terminal                           |
| **Instalación**| `bun add -g @tobilu/qmd`                           |

```bash
bun add -g @tobilu/qmd
```

---

## 08 — Taste-Skill

| Dato           | Valor                                               |
|:---------------|:----------------------------------------------------|
| **URL**        | `https://github.com/Leonxlnx/taste-skill`          |
| **Carpeta**    | `22_Taste_Skill/`                                  |
| **Stars**      | **3.9k ⭐** · **Forks:** 314 — Más popular         |
| **Propósito**  | **Diseño premium** UI/UX                            |

```bash
git clone https://github.com/Leonxlnx/taste-skill
```

### Skills incluidas:
| Skill              | Propósito                    |
|:-------------------|:-----------------------------|
| `taste-skill`      | Diseño premium desde cero    |
| `soft-skill`       | Look expensive               |
| `minimalist-skill` | Estilo Notion/Linear        |
| `redesign-skill`   | Mejorar proyectos existentes |
| `output-skill`     | Evita código incompleto      |

### Configuración:
```markdown
DESIGN_VARIANCE (1-10)
├── 1-3: Clean, centered, standard grids
├── 4-7: Overlapping elements, varied sizes
└── 8-10: Asymmetric, lots of whitespace

MOTION_INTENSITY (1-10)
├── 1-3: Almost none, simple hover
├── 4-7: Fade-ins, smooth scrolling
└── 8-10: Magnetic effects, spring physics

VISUAL_DENSITY (1-10)
├── 1-3: Big and spacious, luxury feel
├── 4-7: Normal spacing, typical app
└── 8-10: Dense and compact, dashboards
```

---

## 📝 NOTAS

- Estos repos se clonan localmente para uso en el proyecto
- NO se commitean (están en `.gitignore`)
- Solo se guarda la URL para clonar en otra máquina
- La estructura del proyecto es portable así

---

*Última actualización: 2026-05-14 — v4.1*