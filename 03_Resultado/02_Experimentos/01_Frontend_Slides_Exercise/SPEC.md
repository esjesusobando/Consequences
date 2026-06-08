# SPEC: IA Presentation — SOTA Slide Deck

## 1. Concept & Vision

Presentación de 25 slides sobre IA (Jornada 3/5) con diseño **SOTA dark theme** inspirado en referencias reales. El objetivo es impacto visual máximo: minimalismo oscuro, acentos vibrantes en naranja (#FF3D00), y tipografía bold. Debe verse como una presentación deTED o keynote de Apple.

## 2. Design Language

### Aesthetic Direction
Dark, sophisticated, high-contrast. Inspirado en:
- Referencias `07_Referencias_Pre/` (IMG_4703-4710)
- TED Talk slides aesthetic
- Apple Keynote dark mode

### Color Palette
| Token                      | Hex                                | Uso                                          |
|---------------------------|-----------------------------------|---------------------------------------------|
| `--bg`                     | `#0d0d0d`                          | Background principal                         |
| `--surface`                | `#151515`                          | Cards, containers                            |
| `--surface-2`              | `#1c1c1c`                          | Containers secundarios                       |
| `--text`                   | `#ffffff`                          | Texto principal                              |
| `--text-dim`               | `#888888`                          | Texto secundario                             |
| `--text-muted`             | `#444444`                          | Texto terciario                              |
| `--accent`                 | `#ff3d00`                          | Acento principal (naranja vibrante)          |
| `--accent-soft`            | `rgba(255,61,0,0.1)`               | Fondos accent                                |
| `--accent-border`          | `rgba(255,61,0,0.3)`               | Bordes accent                                |
| `--grid`                   | `rgba(255,255,255,0.025)`          | Grid overlay                                 |

### Typography
- **Display/H1**: Inter 900, `clamp(2.5rem, 7vw, 5.5rem)`, letter-spacing -0.03em
- **H2**: Inter 700, `clamp(1.6rem, 4vw, 3rem)`, letter-spacing -0.02em
- **H3**: Inter 600 uppercase, `clamp(0.6rem, 0.85vw, 0.75rem)`, letter-spacing 0.18em
- **Body**: Inter 400, `clamp(0.8rem, 1.2vw, 0.95rem)`, line-height 1.7
- **Mono**: SF Mono / Consolas para código

### Spatial System
- Slides: `padding: clamp(2rem, 5vw, 4.5rem)`
- Grid gap: `clamp(0.75rem, 1.8vw, 1.5rem)`
- Card padding: `clamp(0.9rem, 1.8vw, 1.3rem)`

### Motion Philosophy
- Scroll snap: `scroll-snap-type: y mandatory`
- Animaciones de entrada: fadeInUp suave (opacity 0→1, translateY 20px→0)
- Duración: 500ms ease-out
- Stagger: 100ms entre elementos hijos

## 3. Layout & Structure

### Slide Structure
```
.slide
├── .grid-overlay (z-index: 0)
├── .accent-bar (z-index: 2, left side, 3px width)
├── .slide-content (z-index: 1)
│   ├── .section-header
│   │   ├── .section-num (orange badge)
│   │   └── h3 (uppercase label)
│   ├── .divider (40px × 2px, orange)
│   ├── Content (h1, h2, p, cards, etc.)
│   └── ...
└── .badge (top-right, "01 / 25" format)
```

### Grid Layouts
- **2 columns**: `grid-template-columns: 1fr 1fr`
- **3 columns**: `repeat(3, 1fr)`
- **4 columns**: `repeat(4, 1fr)`

### Responsive Strategy
- Mobile: single column, nav dots hidden
- Tablet+: full grid layouts
- Font sizes: `clamp()` para escalado fluido

## 4. Features & Interactions

### Core Features
1. **Scroll Snap Navigation**: Cada slide ocupa 100vh, scroll suave con snap
2. **Keyboard Navigation**:
   - `ArrowDown/ArrowRight/Space`: siguiente slide
   - `ArrowUp/ArrowLeft`: slide anterior
   - `Home`: primer slide
   - `End`: último slide
3. **Nav Dots**: 25 puntos en lado derecho, clickeables, indican slide actual
4. **Active Slide Tracking**: IntersectionObserver detecta slide visible

### Interaction Details
- **Nav dots hover**: opacity 0.4 → 0.8, cursor pointer
- **Nav dots active**: scale 1.5, background accent
- **Keyboard**: preventDefault en keys para evitar scroll default
- **Smooth scroll**: `behavior: 'smooth'` en scrollIntoView

### Edge Cases
- Primera slide: ArrowUp no hace nada
- Última slide: ArrowDown no hace nada
- Nav dot click en slide actual: no hace scroll redundante

## 5. Component Inventory

### .slide
- States: default (sin .active), active (actual)
- Full viewport, min-height 100vh
- scroll-snap-align: start, scroll-snap-stop: always

### .card
- States: default, with-accent (border-top 2px solid accent)
- Background: var(--surface)
- Border: 1px solid rgba(255,255,255,0.05)
- Padding: clamp(0.9rem, 1.8vw, 1.3rem)
- Radius: 3px

### .card-simple
- Similar a .card pero sin borde accent
- Background: var(--surface)

### .prompt-box
- Background: #0c0c0c
- Border-left: 3px solid accent
- Font: monospace
- Color: #aaaaaa

### .section-num
- Background: accent
- Color: white
- Font-size: clamp(0.5rem, 0.7vw, 0.65rem)
- Font-weight: 700
- Padding: 0.2em 0.5em
- Border-radius: 2px

### .tag
- Background: accent-soft
- Color: accent
- Border: 1px solid accent-border
- Border-radius: 2px
- Font-size: clamp(0.55rem, 0.75vw, 0.65rem)

### .tag-solid
- Background: accent
- Color: white
- Border: none

### .stat-lg
- Font-size: clamp(3rem, 8vw, 6rem)
- Font-weight: 900
- Letter-spacing: -0.04em
- line-height: 1

### .quote
- Border-left: 3px solid accent
- Padding-left: clamp(1rem, 2vw, 1.5rem)
- Font-style: italic
- Font-weight: 600

### .quote-mark
- Position: absolute
- Font-size: clamp(5rem, 12vw, 9rem)
- Font-weight: 900
- Color: accent con opacity 0.15

### .nav span
- Width/height: 4px
- Border-radius: 50%
- Default: background text-muted, opacity 0.4
- Active: background accent, opacity 1, scale 1.5
- Hover: opacity 0.8

## 6. Technical Approach

### Architecture
- Single HTML file
- CSS inline en `<style>`
- JavaScript vanilla inline en `<script>`
- Google Fonts (Inter) via CDN

### Key Implementation
```javascript
// Scroll snap + keyboard navigation
html { scroll-snap-type: y mandatory; }
.slide { scroll-snap-align: start; scroll-snap-stop: always; }

// Active slide tracking
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Update active class
      // Update nav dots
    }
  });
}, { threshold: 0.5, rootMargin: '0px 0px -10% 0px' });

// Keyboard handler
document.addEventListener('keydown', (e) => {
  const current = document.querySelector('.slide.active') || slides[0];
  const num = parseInt(current.id.replace('s', ''));
  // Navigate based on key
});
```

### Content Structure (25 Slides)
1. Portada
2. Bienvenida
3. Ecosistema IA
4. Edgar Morin quote
5. Problema (90% stats)
6. Perplexity intro
7. Perplexity detalle
8. Modos Perplexity
9. Fin SEO
10. Anatomía Prompt
11. Tokens
12. Transformers
13. Modelo Atención
14. Temperatura
15. Alucinaciones
16. Copilot WhatsApp
17. NotebookLM
18. Plataformas IA
19. Generación Imágenes
20. Prompt Imagen
21. IA Medicina
22. IA Agricultura
23. Ahorro Tiempo
24. Creatividad
25. Cierre
