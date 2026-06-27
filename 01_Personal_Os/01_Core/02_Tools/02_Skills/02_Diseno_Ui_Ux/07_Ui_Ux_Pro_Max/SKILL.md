---
name: ui-ux-pro-max
description: "UI/UX design intelligence with searchable database. Triggers on: UI design, UX design, design system, color palette, typography, design search, UI recommendations, design workflow"
sota_upgraded: true
---
# ui-ux-pro-max

Comprehensive design guide for web and mobile applications. Contains 67 styles, 96 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 13 technology stacks. Searchable database with priority-based recommendations.

## Esencia Original

**Metaskill**: Base de datos de inteligencia de diseño consultable vía CLI. No es una skill generativa de UI — es un motor de búsqueda y recomendación que prioriza diseño basado en razonamiento contextual (industria, stack, keywords). Resuelve el problema de "no sé qué estilo/color/tipografía usar para este producto".

**Propósito original**: Proveer un sistema de recomendación de diseño completo y consultable que cubra estilos, paletas, tipografías, patrones UX y tipos de gráfico, todo desde una sola interfaz de búsqueda. Elimina la parálisis de decisión que ocurre al comenzar un nuevo proyecto de diseño sin referencias claras.

---

## Prerequisites

Check if Python is installed:

```bash
python3 --version || python --version
```

If Python is not installed, install it based on user's OS:

**macOS:**
```bash
brew install python3
```

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install python3
```

**Windows:**
```powershell
winget install Python.Python.3.12
```

---

## How to Use This Skill

When user requests UI/UX work (design, build, create, implement, review, fix, improve), follow this workflow:

### Step 1: Analyze User Requirements

Extract key information from user request:
- **Product type**: SaaS, e-commerce, portfolio, dashboard, landing page, etc.
- **Style keywords**: minimal, playful, professional, elegant, dark mode, etc.
- **Industry**: healthcare, fintech, gaming, education, etc.
- **Stack**: React, Vue, Next.js, or default to `html-tailwind`

### Step 2: Generate Design System (REQUIRED)

**Always start with `--design-system`** to get comprehensive recommendations with reasoning:

```bash
python3 01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

This command:
1. Searches 5 domains in parallel (product, style, color, landing, typography)
2. Applies reasoning rules from `ui-reasoning.csv` to select best matches
3. Returns complete design system: pattern, style, colors, typography, effects
4. Includes anti-patterns to avoid

**Example:**
```bash
python3 01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/scripts/search.py "beauty spa wellness service" --design-system -p "Serenity Spa"
```

### Step 2b: Persist Design System (Master + Overrides Pattern)

To save the design system for hierarchical retrieval across sessions, add `--persist`:

```bash
python3 01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

This creates:
- `design-system/MASTER.md` — Global Source of Truth with all design rules
- `design-system/pages/` — Folder for page-specific overrides

**With page-specific override:**
```bash
python3 01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"
```

This also creates:
- `design-system/pages/dashboard.md` — Page-specific deviations from Master

**How hierarchical retrieval works:**
1. When building a specific page (e.g., "Checkout"), first check `design-system/pages/checkout.md`
2. If the page file exists, its rules **override** the Master file
3. If not, use `design-system/MASTER.md` exclusively

### Step 3: Supplement with Detailed Searches (as needed)

After getting the design system, use domain searches to get additional details:

```bash
python3 01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

**When to use detailed searches:**

| Need                                               | Domain                                    | Example                                                              |
|---------------------------------------------------|------------------------------------------|---------------------------------------------------------------------|
| More style options                                 | `style`                                   | `--domain style "glassmorphism dark"`                                |
| Chart recommendations                              | `chart`                                   | `--domain chart "real-time dashboard"`                               |
| UX best practices                                  | `ux`                                      | `--domain ux "animation accessibility"`                              |
| Alternative fonts                                  | `typography`                              | `--domain typography "elegant luxury"`                               |
| Landing structure                                  | `landing`                                 | `--domain landing "hero social-proof"`                               |

### Step 4: Stack Guidelines (Default: html-tailwind)

Get implementation-specific best practices. If user doesn't specify a stack, **default to `html-tailwind`**.

```bash
python3 01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/scripts/search.py "<keyword>" --stack html-tailwind
```

Available stacks: `html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`

---

## Search Reference

### Available Domains

| Domain                                    | Use For                                                           | Example Keywords                                                                      |
|------------------------------------------|------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| `product`                                 | Product type recommendations                                      | SaaS, e-commerce, portfolio, healthcare, beauty, service                              |
| `style`                                   | UI styles, colors, effects                                        | glassmorphism, minimalism, dark mode, brutalism                                       |
| `typography`                              | Font pairings, Google Fonts                                       | elegant, playful, professional, modern                                                |
| `color`                                   | Color palettes by product type                                    | saas, ecommerce, healthcare, beauty, fintech, service                                 |
| `landing`                                 | Page structure, CTA strategies                                    | hero, hero-centric, testimonial, pricing, social-proof                                |
| `chart`                                   | Chart types, library recommendations                              | trend, comparison, timeline, funnel, pie                                              |
| `ux`                                      | Best practices, anti-patterns                                     | animation, accessibility, z-index, loading                                            |
| `react`                                   | React/Next.js performance                                         | waterfall, bundle, suspense, memo, rerender, cache                                    |
| `web`                                     | Web interface guidelines                                          | aria, focus, keyboard, semantic, virtualize                                           |
| `prompt`                                  | AI prompts, CSS keywords                                          | (style name)                                                                          |

### Available Stacks

| Stack                                          | Focus                                                                              |
|-----------------------------------------------|-----------------------------------------------------------------------------------|
| `html-tailwind`                                | Tailwind utilities, responsive, a11y (DEFAULT)                                     |
| `react`                                        | State, hooks, performance, patterns                                                |
| `nextjs`                                       | SSR, routing, images, API routes                                                   |
| `vue`                                          | Composition API, Pinia, Vue Router                                                 |
| `svelte`                                       | Runes, stores, SvelteKit                                                           |
| `swiftui`                                      | Views, State, Navigation, Animation                                                |
| `react-native`                                 | Components, Navigation, Lists                                                      |
| `flutter`                                      | Widgets, State, Layout, Theming                                                    |
| `shadcn`                                       | shadcn/ui components, theming, forms, patterns                                     |
| `jetpack-compose`                              | Composables, Modifiers, State Hoisting, Recomposition                              |

---

## Example Workflow

**User request:** "Làm landing page cho dịch vụ chăm sóc da chuyên nghiệp"

### Step 1: Analyze Requirements
- Product type: Beauty/Spa service
- Style keywords: elegant, professional, soft
- Industry: Beauty/Wellness
- Stack: html-tailwind (default)

### Step 2: Generate Design System (REQUIRED)

```bash
python3 01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/scripts/search.py "beauty spa wellness service elegant" --design-system -p "Serenity Spa"
```

**Output:** Complete design system with pattern, style, colors, typography, effects, and anti-patterns.

### Step 3: Supplement with Detailed Searches (as needed)

```bash
# Get UX guidelines for animation and accessibility
python3 01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/scripts/search.py "animation accessibility" --domain ux

# Get alternative typography options if needed
python3 01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/scripts/search.py "elegant luxury serif" --domain typography
```

### Step 4: Stack Guidelines

```bash
python3 01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/scripts/search.py "layout responsive form" --stack html-tailwind
```

**Then:** Synthesize design system + detailed searches and implement the design.

---

## Output Formats

The `--design-system` flag supports two output formats:

```bash
# ASCII box (default) - best for terminal display
python3 01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/scripts/search.py "fintech crypto" --design-system

# Markdown - best for documentation
python3 01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/scripts/search.py "fintech crypto" --design-system -f markdown
```

---

## Tips for Better Results

1. **Be specific with keywords** - "healthcare SaaS dashboard" > "app"
2. **Search multiple times** - Different keywords reveal different insights
3. **Combine domains** - Style + Typography + Color = Complete design system
4. **Always check UX** - Search "animation", "z-index", "accessibility" for common issues
5. **Use stack flag** - Get implementation-specific best practices
6. **Iterate** - If first search doesn't match, try different keywords

---

## ⚠️ Gotchas

### Confiar en un solo dominio de búsqueda
> Buscar solo `style` y perderse las reglas UX o los anti-patrones del stack.

- **Por qué**: El diseño system completo requiere 5 dominios (product, style, color, landing, typography) + stack + UX. Saltarse uno produce recomendaciones incompletas.
- **Solución**: Siempre empezar con `--design-system` que ejecuta los 5 dominios en paralelo. Luego complementar con `--domain ux` y `--stack <tecnología>`.

### Olvidar persistir el design system
> Generar un design system perfecto pero no guardarlo con `--persist`.

- **Por qué**: Sin persistencia, cada sesión empieza desde cero. No hay MASTER.md ni jerarquía page-specific.
- **Solución**: Usar `--persist -p "Project Name"` siempre. Para proyectos multi-página, agregar `--page "page-name"` para overrides específicos.

### No especificar el stack
> Usar el default `html-tailwind` cuando el proyecto es React o Next.js.

- **Por qué**: Las reglas de performance, estado y patrones cambian radicalmente entre stacks. `html-tailwind` no cubre Server Components, Suspense, o hydration.
- **Solución**: Siempre preguntar el stack primero. Si el usuario no sabe, Next.js es el default más seguro para apps modernas.

### Ignorar la pre-delivery checklist
> Entregar código sin verificar contraste, modo oscuro, o cursor-pointer.

- **Por qué**: La diferencia entre diseño "profesional" y "amateur" está en los detalles: contraste 4.5:1, hover states, transiciones suaves, focus visible.
- **Solución**: Correr la checklist completa antes de entregar. Son 5 minutos que ahorran 3 rondas de feedback.

---

## Common Rules for Professional UI

These are frequently overlooked issues that make UI look unprofessional:

### Icons & Visual Elements

| Rule                                                    | Do                                                                           | Don't                                                               |
|--------------------------------------------------------|-----------------------------------------------------------------------------|--------------------------------------------------------------------|
| **No emoji icons**                                      | Use SVG icons (Heroicons, Lucide, Simple Icons)                              | Use emojis like 🎨 🚀 ⚙️ as UI icons                                  |
| **Stable hover states**                                 | Use color/opacity transitions on hover                                       | Use scale transforms that shift layout                              |
| **Correct brand logos**                                 | Research official SVG from Simple Icons                                      | Guess or use incorrect logo paths                                   |
| **Consistent icon sizing**                              | Use fixed viewBox (24x24) with w-6 h-6                                       | Mix different icon sizes randomly                                   |

### Interaction & Cursor

| Rule                                                | Do                                                                                 | Don't                                                                     |
|----------------------------------------------------|-----------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| **Cursor pointer**                                  | Add `cursor-pointer` to all clickable/hoverable cards                              | Leave default cursor on interactive elements                              |
| **Hover feedback**                                  | Provide visual feedback (color, shadow, border)                                    | No indication element is interactive                                      |
| **Smooth transitions**                              | Use `transition-colors duration-200`                                               | Instant state changes or too slow (>500ms)                                |

### Light/Dark Mode Contrast

| Rule                                                   | Do                                                               | Don't                                                                |
|-------------------------------------------------------|-----------------------------------------------------------------|---------------------------------------------------------------------|
| **Glass card light mode**                              | Use `bg-white/80` or higher opacity                              | Use `bg-white/10` (too transparent)                                  |
| **Text contrast light**                                | Use `#0F172A` (slate-900) for text                               | Use `#94A3B8` (slate-400) for body text                              |
| **Muted text light**                                   | Use `#475569` (slate-600) minimum                                | Use gray-400 or lighter                                              |
| **Border visibility**                                  | Use `border-gray-200` in light mode                              | Use `border-white/10` (invisible)                                    |

### Layout & Spacing

| Rule                                                  | Do                                                               | Don't                                                               |
|------------------------------------------------------|-----------------------------------------------------------------|--------------------------------------------------------------------|
| **Floating navbar**                                   | Add `top-4 left-4 right-4` spacing                               | Stick navbar to `top-0 left-0 right-0`                              |
| **Content padding**                                   | Account for fixed navbar height                                  | Let content hide behind fixed elements                              |
| **Consistent max-width**                              | Use same `max-w-6xl` or `max-w-7xl`                              | Mix different container widths                                      |

---

## Pre-Delivery Checklist

Before delivering UI code, verify these items:

### Visual Quality
- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] Brand logos are correct (verified from Simple Icons)
- [ ] Hover states don't cause layout shift
- [ ] Use theme colors directly (bg-primary) not var() wrapper

### Interaction
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states provide clear visual feedback
- [ ] Transitions are smooth (150-300ms)
- [ ] Focus states visible for keyboard navigation

### Light/Dark Mode
- [ ] Light mode text has sufficient contrast (4.5:1 minimum)
- [ ] Glass/transparent elements visible in light mode
- [ ] Borders visible in both modes
- [ ] Test both modes before delivery

### Layout
- [ ] Floating elements have proper spacing from edges
- [ ] No content hidden behind fixed navbars
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile

### Accessibility
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color is not the only indicator
- [ ] `prefers-reduced-motion` respected

---

## 💾 State Persistence

### What to persist between sessions

| Dato                                           | Cómo se persiste                                                       | Cuándo restaurar                         |
|-----------------------------------------------|-----------------------------------------------------------------------|-----------------------------------------|
| **Design system generado**                     | `--persist` crea `design-system/MASTER.md` + `design-system/pages/*.md`| Al retomar un proyecto                   |
| **Último stack usado**                         | Variable de entorno o config local                                     | Si el usuario no especifica stack        |
| **Preferencias de formato** (ASCII vs Markdown)| Preferencia de sesión vía `-f` flag                                    | Cada nueva búsqueda                      |
| **Proyectos activos**                          | Sistema de archivos en `design-system/`                                | Al listar proyectos con `--list-projects`|

### Reglas de persistencia
- **NO** guardar resultados de búsqueda individuales — son transitorios
- **SÍ** persistir design systems completos con `--persist`
- La estructura MASTER.md + pages/ permite herencia jerárquica sin duplicación


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
