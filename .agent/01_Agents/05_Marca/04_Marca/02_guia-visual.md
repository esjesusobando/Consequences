# Guía Visual — Think Different / Consequences Design System

> **Última actualización:** 2026-06-08
> **Versión:** 1.0
> **Referencia:** Consequences Design System v1.0

---

## 1. Principios de Diseño

### Signal Over Shadows
La filosofía central de Consequences: **las señales importan más que las sombras**.

- Darkness como canvas, no como feature
- Accent colors para guiar atención
- Glow effects para estados interactivos
- Minimal decoration, máximo propósito

### Regla 80/20 Visual
- 80% del diseño: espacios vacíos, tipografía, jerarquía
- 20% del diseño: color, efectos, elementos decorativos

### Consistencia sobre Creatividad
- Usar los tokens definidos siempre
- No inventar colores fuera de la paleta
- Componentes predecibles = menor cognitive load

---

## 2. Layout System

### Grid
```css
.grid {
  display: grid;
  grid-template-columns: 220px 1fr; /* Sidebar + Content */
  min-height: 100vh;
}

/* Mobile */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

### Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--s1` | 4px | Micro spacing |
| `--s2` | 8px | Tight spacing |
| `--s3` | 12px | Component internal |
| `--s4` | 16px | Default gap |
| `--s5` | 24px | Section spacing |
| `--s6` | 32px | Large gaps |
| `--s7` | 48px | Section dividers |
| `--s8` | 64px | Major sections |
| `--s9` | 96px | Page margins |

### Responsive Breakpoints
```css
/* Mobile first */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Wide */ }
```

---

## 3. Components Guidelines

### Buttons

```css
.btn {
  /* Default */
  background: transparent;
  border: 1px solid var(--graphite);
  color: var(--bone);
  padding: var(--s3) var(--s5);
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  border-color: var(--accent);
  box-shadow: var(--glow-accent);
}

.btn-primary {
  background: var(--cyan);
  color: var(--void);
  border-color: var(--cyan);
}

.btn-primary:hover {
  background: var(--lime);
  border-color: var(--lime);
}
```

### Cards
```css
.card {
  background: var(--night);
  border: 1px solid var(--graphite);
  border-radius: 8px;
  padding: var(--s5);
}

.card-elevated {
  background: var(--carbon);
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
}
```

### Inputs
```css
.input {
  background: var(--void);
  border: 1px solid var(--graphite);
  color: var(--bone);
  padding: var(--s3) var(--s4);
  border-radius: 4px;
  font-family: inherit;
  font-size: var(--text-base);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--cyan);
  box-shadow: var(--glow-cyan);
}

.input::placeholder {
  color: var(--slate);
}
```

### Navigation
```css
.nav-item {
  color: var(--ash);
  padding: var(--s3) var(--s4);
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-item:hover {
  color: var(--bone);
  background: var(--carbon);
}

.nav-item.active {
  color: var(--cyan);
  background: rgba(0, 240, 255, 0.1);
}
```

---

## 4. Visual Assets

### Icon Library
- **Primary:** Lucide Icons (MIT, consistent, tree-shakeable)
- **Fallback:** Inline SVG para casos específicos
- **Size standard:** 20px (nav), 24px (content), 16px (inline)

### Image Strategy
- **Photos:** Real screenshots, no stock photos
- **Diagrams:** Excalidraw-style (hand-drawn feel)
- **Code:** JetBrains Mono con syntax highlighting
- **Mockups:** Minimal, functional

### Decorative Elements
- **Gradients:** Solo cuando necesario para depth
- **Borders:** 1px solid var(--graphite) default
- **Shadows:** Usar solo en elementos elevados
- **Glows:** Solo en estados interactivos (hover, focus)

---

## 5. Motion Guidelines

### Durations
| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Micro-interactions (hover, click) |
| `--duration-normal` | 200ms | State changes |
| `--duration-slow` | 300ms | Page transitions |
| `--duration-slower` | 500ms | Complex animations |

### Easing
```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Animation Patterns
```css
/* Hover lift */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

/* Glow pulse (para elementos activos) */
@keyframes glow-pulse {
  0%, 100% { box-shadow: var(--glow-cyan); }
  50% { box-shadow: 0 0 16px rgba(0,240,255,0.8); }
}

/* Fade in */
.fade-in {
  animation: fade-in 0.3s var(--ease-out);
}
```

---

## 6. Dark Mode Adaptations

### Transiciones
```css
body {
  transition: background 0.3s, color 0.3s;
}
```

### Light Mode Overrides
- **Cards:** `--night` → `#ECEEF5` (más claro)
- **Borders:** `--graphite` → `#C7CCD8` (más visible)
- **Text:** mantener `--bone` y `--ash` pero con valores más oscuros
- **Glows:** reducir opacity un 40% para no ser aggressivos

---

## 7. Content Formatting

### Code Blocks
```css
pre {
  background: var(--void);
  border: 1px solid var(--graphite);
  border-radius: 8px;
  padding: var(--s4);
  overflow-x: auto;
}

code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
  color: var(--lime);
}
```

### Callouts
```css
.callout {
  background: rgba(0, 240, 255, 0.1);
  border-left: 3px solid var(--cyan);
  padding: var(--s4);
  border-radius: 0 4px 4px 0;
}

.callout-warning {
  background: rgba(255, 180, 0, 0.1);
  border-color: var(--amber);
}

.callout-error {
  background: rgba(255, 46, 154, 0.1);
  border-color: var(--magenta);
}
```

---

## 8. Photo/Video Guidelines

### YouTube Thumbnails
- **Ratio:** 16:9
- **Text:** Space Grotesk Bold, blanco sobre oscuro
- **Colors:** Usar accent colors para highlights
- **Style:** Minimal, no clutter, readable en small

### LinkedIn Images
- **Ratio:** 1.91:1 (landscape) o 1:1 (square)
- **Text:** Mínimo, solo si necesario
- **Branding:** Logo sutil en corner

### Screenshots
- **Style:** Dark mode, con window decorations
- **Annotations:** Cyan para highlights, magenta para warnings
- **Crop:** Solo mostrar lo relevante

---

*Guía viva — actualizar cuando Consequences DS evolucione*