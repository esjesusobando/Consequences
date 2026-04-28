# 📦 REPOS EXTERNOS CLONADOS

> **Lista de repos clonados que NO están en git (agregados a .gitignore)**
>
> Para clonar en otra máquina, ejecutar los comandos desde la raíz del proyecto.

---

## 1. Skill Creator Official (Anthropic)

| Dato                          | Valor                                                               |
|-------------------------------|---------------------------------------------------------------------|
| **URL**                       | `https://github.com/anthropics/claude-plugins-official`             |
| **Carpeta local**             | `claude-plugins-official/`                                          |
| **Propósito**                 | Skill Creator v2.0 con sistema de evaluación                        |
| **Fecha clonado**             | 2026-03-27                                                          |

### Para clonar en otra máquina:

```bash
# Desde la raíz del proyecto (Think_Different/)
git clone https://github.com/anthropics/claude-plugins-official
```

### Contenido:
- `plugins/skill-creator/` — Plugin principal
- `scripts/` — Scripts de evaluación y benchmarking
- `eval-viewer/` — Visor web de resultados

---

## 2. Sub-Agent Statusline (Joaquinvesapa)

| Dato                          | Valor                                                               |
|-------------------------------|---------------------------------------------------------------------|
| **URL**                       | `https://github.com/Joaquinvesapa/sub-agent-statusline`             |
| **Carpeta local**             | `sub-agent-statusline/`                                              |
| **Propósito**                 | Monitor Sidebar para OpenCode — tracking de subagentes en tiempo real |
| **npm**                       | `opencode-subagent-statusline` (instalado globalmente)              |
| **Fecha clonado**             | 2026-04-25                                                          |
| **Stars**                     | 32 ⭐ | **Forks** | 6 |

### Para clonar en otra máquina:

```bash
# Desde esta carpeta
git clone https://github.com/Joaquinvesapa/sub-agent-statusline
```

### Para instalar como plugin de OpenCode:

```bash
# Opción A: npm global
npm install -g opencode-subagent-statusline

# Configurar en ~/.config/opencode/tui.json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": ["opencode-subagent-statusline"]
}
```

### Funcionalidades:
- Sidebar TUI con subagentes running/done/failed
- Tiempo elapsed por subagente
- Token/context usage (cuando OpenCode lo expone)
- Runtime mode: file output para statuslines custom (`state.json`, `status.txt`)

---

## 4. Frontend Slides (zarazhangrui) ⭐ PREDETERMINADA PARA PRESENTACIONES

| Dato                          | Valor                                                               |
|-------------------------------|---------------------------------------------------------------------|
| **URL**                       | `https://github.com/zarazhangrui/frontend-slides`                   |
| **Carpeta local**             | `frontend-slides/`                                                  |
| **Propósito**                 | HTML Presentations — Skill para crear presentaciones web de alto impacto |
| **Stack**                     | Zero dependencies (HTML inline), CSS/JS embebido                   |
| **Fecha clonado**             | 2026-04-28                                                          |
| **Stars**                     | ⭐⭐⭐ Destacada                                                     |

### ¿Por qué esta es la predeterminada?

- **Zero dependencies** — Single HTML files que funcionan en 10 años
- **Visual Style Discovery** — "Show, don't tell" — generas preview, el usuario elige
- **Anti-AI-Slop** — 12 presets distintivos que evitan estética genérica
- **PPT Conversion** — Convierte .pptx preservando imágenes y contenido
- **Deploy to URL** — Vercel integration para compartir link permanente
- **Export to PDF** — Playwright screenshot a 1920x1080

### Estilos Disponibles:
- **Dark:** Bold Signal, Electric Studio, Creative Voltage, Dark Botanical
- **Light:** Notebook Tabs, Pastel Geometry, Split Pastel, Vintage Editorial
- **Specialty:** Neon Cyber, Terminal Green, Swiss Modern, Paper & Ink

### Para clonar en otra máquina:
```bash
git clone https://github.com/zarazhangrui/frontend-slides
```

### Archivos principales:
- `SKILL.md` — Workflow completo (~320 líneas)
- `STYLE_PRESETS.md` — 12 presets visuales con colores, fonts, elementos signature
- `viewport-base.css` — CSS responsive obligatorio para cada slide (100vh)
- `html-template.md` — Arquitectura HTML y features JS
- `animation-patterns.md` — Snippets de animación CSS/JS
- `scripts/extract-pptx.py` — Extracción de contenido desde PPT
- `scripts/deploy.sh` — Deploy a Vercel
- `scripts/export-pdf.sh` — Export a PDF

### Uso:
```
/frontend-slides
> "Create a pitch deck for my AI startup"
```

### Setup para PDF export:
```bash
pip install python-pptx  # Para conversión PPT
npx playwright install chromium  # Para PDF export
```

---

## 5. TubeMaster (Gentleman-Programming)

| Dato                          | Valor                                                               |
|-------------------------------|---------------------------------------------------------------------|
| **URL**                       | `https://github.com/Gentleman-Programming/tubemaster`               |
| **Carpeta local**             | `tubemaster/`                                                       |
| **Propósito**                 | YouTube Channel Operations Manager — Web UI, CLI, MCP, API         |
| **Stack**                     | TypeScript, Next.js 15, Tailwind CSS                                 |
| **Fecha clonado**             | 2026-04-25                                                          |
| **Stars**                     | 9 ⭐ | **Forks** | 2 |

### Funcionalidades:
- Auth once → operate end-to-end: videos, metadata, transcripts, playlists, rules
- 4 interfaces: Web UI, CLI, MCP Server (stdio), API Route Handlers
- Agent integrations via MCP
- Transcript compatibility contract
- Fail-closed write operations con expectedChannelId

### Para clonar en otra máquina:
```bash
git clone https://github.com/Gentleman-Programming/tubemaster
```

### Setup local:
```bash
cd tubemaster
npm install
npm run dev
# Seguir docs/getting-started.md para OAuth + YouTube API
```

---

## Notas

- Estos repos se clonan localmente para uso en el proyecto
- NO se commitean (están en .gitignore)
- Solo se guarda la URL para clonar después en otra máquina
- La estructura del proyecto es portable así

---

*Última actualización: 2026-04-28*
