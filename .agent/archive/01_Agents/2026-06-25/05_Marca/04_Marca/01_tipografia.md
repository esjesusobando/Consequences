# Tipografía — Think Different / Consequences Design System

> **Última actualización:** 2026-06-08
> **Versión:** 1.0
> **Referencia:** Consequences Design System v1.0

---

## 1. Font Stack

### Primary: Inter Tight
```html
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

| Weight | Usage |
|--------|-------|
| 300 | Body text ligero, captions |
| 400 | Body text default |
| 500 | Emphasis, subheadings |
| 600 | Section headers |
| 700 | Display, titles |

**Fallback:** `'Inter', system-ui, -apple-system, sans-serif`

### Secondary: Space Grotesk
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Weight | Usage |
|--------|-------|
| 400 | Subheadings, labels |
| 500 | Card titles |
| 600 | Section titles |
| 700 | Hero text, display |

**Fallback:** `'Space Grotesk', 'Inter Tight', sans-serif`

### Monospace: JetBrains Mono
```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

| Weight | Usage |
|--------|-------|
| 400 | Inline code |
| 500 | Code blocks |
| 700 | Terminal, special emphasis |

**Fallback:** `'JetBrains Mono', 'Fira Code', monospace`

---

## 2. Type Scale

### Desktop (base 16px)
| Token | Size | Line-height | Usage |
|-------|------|-------------|-------|
| `--text-xs` | 12px | 1.4 | Captions, labels |
| `--text-sm` | 14px | 1.5 | Secondary text |
| `--text-base` | 16px | 1.6 | Body text |
| `--text-lg` | 18px | 1.5 | Lead paragraphs |
| `--text-xl` | 20px | 1.4 | H4 |
| `--text-2xl` | 24px | 1.3 | H3 |
| `--text-3xl` | 30px | 1.2 | H2 |
| `--text-4xl` | 36px | 1.1 | H1 |
| `--text-5xl` | 48px | 1.0 | Display |

### Mobile (base 14px)
```css
@media (max-width: 768px) {
  :root {
    --text-base: 14px;
    --text-lg: 16px;
    /* Scale down proportionally */
  }
}
```

---

## 3. Typography Styles

### Display (Hero titles)
```css
.display {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: var(--text-5xl);
  line-height: 1.0;
  letter-spacing: -0.02em;
}
```

### Headings
```css
h1, .h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: var(--text-4xl);
  line-height: 1.1;
}

h2, .h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: var(--text-3xl);
  line-height: 1.2;
}

h3, .h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: var(--text-2xl);
  line-height: 1.3;
}

h4, .h4 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  font-size: var(--text-xl);
  line-height: 1.4;
}
```

### Body
```css
.body {
  font-family: 'Inter Tight', sans-serif;
  font-weight: 400;
  font-size: var(--text-base);
  line-height: 1.6;
}

.body-lead {
  font-size: var(--text-lg);
  line-height: 1.5;
  font-weight: 400;
}
```

### Code
```css
code, .code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
  font-weight: 400;
}

pre, .pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-sm);
  line-height: 1.5;
}
```

---

## 4. Utility Classes

```css
/* Weights */
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

/* Sizes */
.text-xs { font-size: var(--text-xs); }
.text-sm { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }
.text-lg { font-size: var(--text-lg); }
.text-xl { font-size: var(--text-xl); }
.text-2xl { font-size: var(--text-2xl); }
.text-3xl { font-size: var(--text-3xl); }
.text-4xl { font-size: var(--text-4xl); }

/* Colors */
.text-bone { color: var(--bone); }
.text-ash { color: var(--ash); }
.text-cyan { color: var(--cyan); }
.text-magenta { color: var(--magenta); }
.text-lime { color: var(--lime); }

/* Transform */
.uppercase { text-transform: uppercase; }
.tracking-wide { letter-spacing: 0.05em; }
.tracking-tight { letter-spacing: -0.02em; }
```

---

## 5. Content Examples

### YouTube Description
```markdown
## Título
[NUMERO] - [TOPIC] | [SUBTÍTULO HOOK]

## Descripción
INTRO:
Hook de 30 segundos

TIMESTAMPS:
0:00 - Intro
0:30 - Tema principal
...

LINKS:
- Repo: [URL]
- Doc: [URL]

#hashtags #relevantes
```

### LinkedIn Post
```markdown
[HEADER - Takeaway principal en una línea]

[CONTEXTO - 2-3 líneas]

[EJEMPLO - Caso concreto o story]

[TOMAWAY - Cierre memorable]

#Hashtag1 #Hashtag2
```

### Newsletter
```markdown
[HEADER]
Hola [nombre],

[INTRO - 1-2 líneas personales]

[CONTENIDO PRINCIPAL]
- Item 1
- Item 2
- Item 3

[LINKS]
→ [Link description](url)

[CIERRE]
Nos vemos,
[Nombre]
```

---

## 6. Spacing

### Line Height Rules
- **Display/Headings:** `line-height: 1.0-1.2` (tight for large text)
- **Body text:** `line-height: 1.6` (comfortable reading)
- **Lists:** `line-height: 1.5`
- **Code:** `line-height: 1.5`

### Paragraph Spacing
```css
p {
  margin-bottom: var(--s5); /* 24px */
}

p:last-child {
  margin-bottom: 0;
}
```

---

*Tipografía viva — actualizar cuando Consequences DS evolucione*