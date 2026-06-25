# Colores — Think Different / Consequences Design System

> **Última actualización:** 2026-06-08
> **Versión:** 1.0
> **Referencia:** Consequences Design System v1.0

---

## 1. Paleta Principal

### Voids (Backgrounds)
| Token | Hex | Uso |
|-------|-----|-----|
| `--void` | `#04060A` | Background principal, deepest level |
| `--night` | `#0B0F18` | Sidebar, cards, elevated surfaces |
| `--carbon` | `#131826` | Secondary backgrounds |
| `--graphite` | `#1E2435` | Borders, dividers |
| `--steel` | `#2A3148` | Disabled states, subtle borders |

### Surfaces (Text/Borders)
| Token | Hex | Uso |
|-------|-----|-----|
| `--slate` | `#4A5273` | Placeholder text |
| `--ash` | `#7A839E` | Secondary text |
| `--bone` | `#C7CCD8` | Primary text |
| `--paper` | `#ECEEF5` | Emphasis text |
| `--pure` | `#FFFFFF` | Maximum contrast |

### Signals (Accents)
| Token | Hex | Uso |
|-------|-----|-----|
| `--cyan` | `#00F0FF` | Primary accent, links, active states |
| `--magenta` | `#FF2E9A` | Error, alerts, critical actions |
| `--lime` | `#C6FF3D` | Success, positive feedback |
| `--amber` | `#FFB400` | Warning, caution, pending |

---

## 2. Dark Mode (Default)

```css
--void: #04060A;
--night: #0B0F18;
--carbon: #131826;
--graphite: #1E2435;
--steel: #2A3148;
--slate: #4A5273;
--ash: #7A839E;
--bone: #C7CCD8;
--paper: #ECEEF5;
--pure: #FFFFFF;
```

### Aplicaciones Dark Mode
- **Background principal:** `var(--void)`
- **Cards/sidebar:** `var(--night)`
- **Text principal:** `var(--bone)`
- **Text secundario:** `var(--ash)`
- **Accent principal:** `var(--cyan)`
- **Links:** `var(--cyan)` con `text-decoration: underline`
- **Errores:** `var(--magenta)`
- **Éxito:** `var(--lime)`

---

## 3. Light Mode

```css
--void: #FFFFFF;
--night: #ECEEF5;
--carbon: #C7CCD8;
--graphite: #7A839E;
--steel: #4A5273;
--slate: #2A3148;
--ash: #1E2435;
--bone: #131826;
--paper: #0B0F18;
--pure: #04060A;
```

### Aplicaciones Light Mode
- **Background principal:** `var(--void)` (white)
- **Cards/sidebar:** `var(--night)` (off-white)
- **Text principal:** `var(--bone)` (dark)
- **Text secundario:** `var(--ash)` (medium)
- **Accent principal:** `var(--cyan)` (mantiene contraste)

---

## 4. Glow Effects

```css
--glow-cyan: 0 0 8px rgba(0,240,255,0.6), 0 0 24px rgba(0,240,255,0.2);
--glow-magenta: 0 0 8px rgba(255,46,154,0.6), 0 0 24px rgba(255,46,154,0.2);
--glow-lime: 0 0 8px rgba(198,255,61,0.6), 0 0 24px rgba(198,255,61,0.2);
--glow-amber: 0 0 8px rgba(255,180,0,0.6), 0 0 24px rgba(255,180,0,0.2);
```

### Uso de Glows
- **Focus rings:** `box-shadow: var(--glow-cyan)`
- **Hover effects:** `box-shadow: var(--glow-accent)`
- **Active indicators:** `box-shadow: var(--glow-lime)`
- **Error highlights:** `box-shadow: var(--glow-magenta)`

---

## 5. Semantic Tokens

```css
/* Status */
--success: var(--lime);
--warning: var(--amber);
--error: var(--magenta);
--info: var(--cyan);

/* Interactive */
--accent: var(--cyan);        /* Primary action */
--accent-hover: #33F5FF;      /* Hover state */
--accent-active: #00C4CC;     /* Active/pressed */
--accent-glow: var(--glow-cyan);

/* Surfaces */
--surface-elevated: var(--night);
--surface-raised: var(--carbon);
--border-default: var(--graphite);
--border-strong: var(--steel);
```

---

## 6. Accesibilidad

### Contraste Mínimo (WCAG AA)
- **Texto sobre void:** `--bone` (#C7CCD8) sobre `--void` (#04060A) = 13.5:1 ✅
- **Texto sobre night:** `--bone` (#C7CCD8) sobre `--night` (#0B0F18) = 11:1 ✅
- **Accent sobre void:** `--cyan` (#00F0FF) sobre `--void` (#04060A) = 10:1 ✅

### Focus States
Siempre usar glow además de color para indicar focus:
```css
button:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: 2px;
  box-shadow: var(--glow-cyan);
}
```

---

## 7. CSS Variables Usage

```css
/* En componentes */
.component {
  background: var(--night);
  color: var(--bone);
  border: 1px solid var(--graphite);
}

.component--accent {
  background: var(--cyan);
  color: var(--void);
}

/* Con transición para theme switching */
body {
  transition: background 0.3s, color 0.3s;
}
```

---

*Tokens vivos — actualizar cuando Consequences DS evolucione*