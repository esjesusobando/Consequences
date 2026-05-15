# Huashu Design · AI Workflows Presentation

## Concept & Vision

Presentación de 6 slides sobre cómo integrar IA en workflows diarios. Sigue la filosofía **Kenya Hara式东方极简** — orden,留白,克制. No es una презентация de features, es una guía práctica con carácter.

> "Diseñar con IA no es usar IA — es iterar con IA como partner."

## Design Language

### Aesthetic Direction
**Kenya Hara + Japanese Editorial**: Tono cálido (paper white), tipografía serif para display + sans-serif para body, detalles en terracota. La克制 transmite profesionalismo sin frialdad.

### Color Palette
| Token              | Hex                           | Usage                           |
|--------------------|-------------------------------|---------------------------------|
| ink                | `#1A1A1A`                     | Text principal                  |
| paper              | `#FAF8F5`                     | Fondo                           |
| paper-warm         | `#F5F0E8`                     | Cards, containers               |
| accent             | `#C4563A`                     | Énfasis, números, rules         |
| muted              | `#6B6560`                     | Text secundario                 |
| line               | `rgba(26,26,26,0.12)`         | Borders, dividers               |

### Typography
- **Display**: Cormorant Garamond (serif, 400/600) — títulos y citas
- **Body**: Inter (300/400/500/600) — texto y labels
- **Scale**: 88px display → 56px subheads → 20px body → 14px captions

### Spatial System
- Padding: 64px / 80px (slide edges)
- Gap: 48px (grid items)
- Margins: 32px-48px (section spacing)
- Baseline: 8px grid

### Motion Philosophy
- **Fade up**: opacity 0→1, translateY 20px→0, 0.6s ease-out
- **Stagger**: 100ms delay between children
- **Transitions**: 0.3s ease para hover/interactive
- Sin motion excesiva — lapaz es parte del character

### Visual Assets
- No icons decorativos — solo tipografía y geometría
- Un emoji (⟳) para representar el loop
- Line dividers en lugar de boxes

## Layout & Structure

### Page Structure
1. **Title (01)**: Centered, display XL, concepto central
2. **Paradigm shift (02)**: Grid 2-col antes/ahora
3. **The Loop (03)**: Split layout con visual box
4. **Workflow templates (04)**: 4 cards en grid
5. **Context principle (05)**: Centered, quote grande
6. **Closing (06)**: CTA + closing thought

### Responsive Strategy
- Mobile: Stack columns, hide visual boxes
- Desktop: Full grid layouts preserved

### Navigation
- Flechas laterales (← →)
- Dots de progreso (bottom right)
- Teclado: Space/→ siguiente, ← anterior
- Touch: Swipe izquierda/derecha

## Features & Interactions

### Core Features
- 6 slides con scroll-snap natural
- Navegación por teclado y touch
- Progress indicator visual
- Animaciones de entrada staggered

### Interaction Details
- **Arrow buttons**: hover = inverted colors
- **Dots**: click = jump to slide, scale on active
- **Keyboard**: Space/→ = next, ← = prev

### States
- Active slide: opacity 1, display flex
- Inactive: opacity 0, display none

## Component Inventory

### Slide Container
- Full viewport (100vw × 100vh)
- Padding: 64px 80px
- Fade transition between slides

### Display Typography
- `.display-xl`: 88px Cormorant, weight 400
- `.display-lg`: 56px Cormorant
- `.display-md`: 36px Cormorant italic

### Body Typography
- `.body-lg`: 20px Inter 300
- `.body-sm`: 14px Inter 400
- `.label`: 11px Inter 500 uppercase + accent color

### Components
- `.info-card`: warm paper bg, 1px line border, 4px radius
- `.workflow-list`: numbered items with accent numbers
- `.rule`: 48px × 1px accent line
- `.quote-block`: 2px left border accent + 24px padding
- `.visual-box`: 320×320, centered content, subtle border
- `.nav-arrow`: 44px circle, arrow icon

## Technical Approach

- **Single HTML file**: Self-contained, no build step
- **No frameworks**: Vanilla HTML/CSS/JS
- **Google Fonts CDN**: Cormorant Garamond + Inter
- **Aspect ratio**: 1920×1080 target, scales via vw/vh
- **Browser-native**: Opens directly via file://

## Slides Content

| #           | Título                             | Tipo             | Contenido                                              |
|-------------|------------------------------------|------------------|--------------------------------------------------------|
| 01          | De la Herramienta al Flujo         | Title            | Subtítulo sobre integrar IA sin perder control         |
| 02          | Diseñar con IA                     | Grid             | Antes/ahora对比                                          |
| 03          | El Ciclo                           | Split            | Input → Contexto → Output → Feedback                   |
| 04          | 3 Workflows                        | Cards            | Research, Writing, Learning, Creation                  |
| 05          | Contexto = Calidad                 | Centered         | Quote sobre specificity                                |
| 06          | Empezá Mañana                      | CTA              | Próximo paso concreto                                  |

## Assumptions

1. audiencia: Profesionales que ya usan IA pero quieren systematic approach
2. tono: Práctico pero no técnico, cercano
3. extensión: 6 slides es suficiente para workshop de 20 min
4. output: HTML directamente usable, no se necesita PPTX

## Verification

- [x] Browser opens via file://
- [x] Keyboard navigation works
- [x] Touch swipe works
- [x] Progress dots sync with current slide
- [x] Fonts load from Google CDN
- [x] No console errors
- [x] Responsive at 768px breakpoint
