# Brand Guidelines Skill — Demo Excelso

> **Dale a cualquier artefacto la piel oficial de Anthropic en segundos.**
> Colores, tipografías, jerarquía visual y tono de marca aplicados de forma inteligente sobre landings, decks, dashboards, PDFs, emails o cualquier output visual.

---

## 1. Qué hace la skill

La skill `brand-guidelines` toma **cualquier artefacto visual** que generes con Claude y le aplica la **identidad de marca oficial de Anthropic**:

- Paleta cromática canónica (primarios, neutros y acentos)
- Sistema tipográfico dual: **Poppins** (display) + **Lora** (cuerpo)
- Jerarquía consistente, espaciados y tratamiento de acentos
- Fallbacks automáticos a **Arial/Georgia** cuando las fuentes no están instaladas
- Respeta el contenido: solo re-skina, nunca reescribe la información

**Úsala cuando escuches**: branding, identidad corporativa, "dale estilo Anthropic", "hazlo look-and-feel Claude", investor deck, landing corporativa, dashboard ejecutivo.

---

## 2. Paleta oficial — Swatches

### Primarios

```
 #141413  DARK         ████████████████████  Texto principal, fondos oscuros
 #faf9f5  LIGHT        ░░░░░░░░░░░░░░░░░░░░  Fondos claros, texto invertido
 #b0aea5  MID GREY     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  Elementos secundarios
 #e8e6dc  SOFT GREY    ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  Fondos sutiles, dividers
```

### Acentos

```
 #d97757  ORANGE       ████████████████████  Acento principal — CTAs, highlights
 #6a9bcc  BLUE         ████████████████████  Acento secundario — links, info
 #788c5d  GREEN        ████████████████████  Acento terciario — success, métricas OK
```

### Visualización en bloques markdown

| Token                                      | Hex                                 | Swatch                                                                                                             | Rol                                    |
|--------------------------------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| `--brand-dark`                             | `#141413`                           | <span style="background:#141413">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>                           | Base oscura                            |
| `--brand-light`                            | `#faf9f5`                           | <span style="background:#faf9f5">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>                           | Base clara                             |
| `--brand-orange`                           | `#d97757`                           | <span style="background:#d97757">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>                           | CTA / acento                           |
| `--brand-blue`                             | `#6a9bcc`                           | <span style="background:#6a9bcc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>                           | Info / links                           |
| `--brand-green`                            | `#788c5d`                           | <span style="background:#788c5d">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>                           | Success                                |
| `--brand-mid`                              | `#b0aea5`                           | <span style="background:#b0aea5">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>                           | Secundario                             |
| `--brand-soft`                             | `#e8e6dc`                           | <span style="background:#e8e6dc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>                           | Fondo sutil                            |

---

## 3. Tres ejemplos ANTES / DESPUÉS

### Ejemplo 1 — Landing page genérica

#### ANTES (Bootstrap default, sin identidad)

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <nav class="navbar navbar-dark bg-primary">
    <a class="navbar-brand" href="#">MyStartup</a>
  </nav>
  <section class="py-5 text-center bg-light">
    <h1 class="display-4">Build the future</h1>
    <p class="lead">The #1 platform for teams that ship.</p>
    <button class="btn btn-primary btn-lg">Get started</button>
  </section>
</body>
</html>
```

Resultado: azul genérico `#0d6efd`, tipografía del sistema, cero personalidad.

#### DESPUÉS (Anthropic brand aplicada)

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Lora:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --brand-dark: #141413;
      --brand-light: #faf9f5;
      --brand-orange: #d97757;
      --brand-soft: #e8e6dc;
    }
    body { background: var(--brand-light); color: var(--brand-dark); font-family: 'Lora', Georgia, serif; }
    nav { background: var(--brand-dark); color: var(--brand-light); padding: 1.25rem 2rem; }
    nav .brand { font-family: 'Poppins', Arial, sans-serif; font-weight: 700; letter-spacing: -0.01em; }
    h1 { font-family: 'Poppins', Arial, sans-serif; font-weight: 700; font-size: 4rem; letter-spacing: -0.02em; }
    .cta { background: var(--brand-orange); color: var(--brand-light); border: none; padding: 1rem 2rem; font-family: 'Poppins', Arial, sans-serif; font-weight: 600; border-radius: 8px; }
    .cta:hover { background: #c4633f; }
  </style>
</head>
<body>
  <nav><span class="brand">MyStartup</span></nav>
  <section style="padding: 6rem 2rem; text-align: center;">
    <h1>Build the future</h1>
    <p style="font-size: 1.25rem; max-width: 540px; margin: 1rem auto 2rem;">
      The #1 platform for teams that ship.
    </p>
    <button class="cta">Get started</button>
  </section>
</body>
</html>
```

Resultado: warmth beige `#faf9f5`, título Poppins editorial, CTA naranja Anthropic `#d97757`, cuerpo Lora. Se siente como producto de Anthropic, no como template Bootstrap.

---

### Ejemplo 2 — Slide de pitch deck

#### ANTES (PowerPoint default)

```
+----------------------------------------------------+
|  [Calibri 44pt, negro]                             |
|                                                    |
|  Market Opportunity                                |
|                                                    |
|  • TAM: $47B                                       |
|  • Growing 23% YoY                                 |
|  • 3M potential customers                          |
|                                                    |
|  [fondo blanco, bullets azul office]               |
+----------------------------------------------------+
```

#### DESPUÉS (brand Anthropic)

```
+====================================================+
|  background: #faf9f5                               |
|                                                    |
|  [Poppins 44pt, #141413, tracking -0.02em]         |
|  Market Opportunity                                |
|  ──────  [barra de acento 80px #d97757]            |
|                                                    |
|  [Lora 20pt, #141413]                              |
|  ● TAM             $47B         [● naranja]        |
|  ● Growth YoY      23%          [● azul]           |
|  ● Customers       3M           [● verde]          |
|                                                    |
|  footer: Anthropic — Confidential  [Poppins 10pt]  |
+====================================================+
```

Código Python (python-pptx) equivalente:

```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

BRAND = {
    "dark":   RGBColor(0x14, 0x14, 0x13),
    "light":  RGBColor(0xfa, 0xf9, 0xf5),
    "orange": RGBColor(0xd9, 0x77, 0x57),
    "blue":   RGBColor(0x6a, 0x9b, 0xcc),
    "green":  RGBColor(0x78, 0x8c, 0x5d),
}

prs = Presentation()
slide = prs.slides.add_slide(prs.slide_layouts[6])
slide.background.fill.solid()
slide.background.fill.fore_color.rgb = BRAND["light"]

title = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(8), Inches(1)).text_frame
title.text = "Market Opportunity"
p = title.paragraphs[0]
p.font.name = "Poppins"
p.font.size = Pt(44)
p.font.bold = True
p.font.color.rgb = BRAND["dark"]

# barra de acento naranja
bar = slide.shapes.add_shape(1, Inches(0.8), Inches(1.9), Inches(1.1), Inches(0.08))
bar.fill.solid(); bar.fill.fore_color.rgb = BRAND["orange"]
bar.line.fill.background()
```

---

### Ejemplo 3 — Dashboard admin

#### ANTES (colores random de Tailwind sin criterio)

```html
<div class="dashboard">
  <div class="card" style="background:#3b82f6">Users: 12,480</div>
  <div class="card" style="background:#a855f7">Revenue: $84k</div>
  <div class="card" style="background:#ec4899">Churn: 2.1%</div>
  <div class="card" style="background:#f59e0b">NPS: 62</div>
  <div class="card" style="background:#10b981">Uptime: 99.9%</div>
</div>
```

Cinco colores saturados peleándose por la atención. Zero jerarquía.

#### DESPUÉS (armonizado con sistema Anthropic)

```html
<style>
  :root {
    --brand-dark: #141413;
    --brand-light: #faf9f5;
    --brand-soft: #e8e6dc;
    --brand-mid: #b0aea5;
    --brand-orange: #d97757;
    --brand-blue: #6a9bcc;
    --brand-green: #788c5d;
  }
  .dashboard {
    background: var(--brand-light);
    font-family: 'Lora', Georgia, serif;
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.25rem;
  }
  .card {
    background: var(--brand-light);
    border: 1px solid var(--brand-soft);
    border-radius: 12px;
    padding: 1.5rem;
  }
  .card .label {
    font-family: 'Poppins', Arial, sans-serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--brand-mid);
  }
  .card .value {
    font-family: 'Poppins', Arial, sans-serif;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--brand-dark);
    margin: 0.5rem 0;
  }
  .card.accent-orange { border-top: 4px solid var(--brand-orange); }
  .card.accent-blue   { border-top: 4px solid var(--brand-blue); }
  .card.accent-green  { border-top: 4px solid var(--brand-green); }
</style>

<div class="dashboard">
  <div class="card accent-orange"><div class="label">Revenue</div><div class="value">$84k</div></div>
  <div class="card accent-blue"><div class="label">Users</div><div class="value">12,480</div></div>
  <div class="card accent-green"><div class="label">Uptime</div><div class="value">99.9%</div></div>
  <div class="card"><div class="label">Churn</div><div class="value">2.1%</div></div>
  <div class="card"><div class="label">NPS</div><div class="value">62</div></div>
</div>
```

Ahora hay **jerarquía**: solo las 3 métricas que importan llevan color; las demás quedan neutras. El dashboard se lee en 2 segundos.

---

## 4. Snippets CSS reutilizables con variables de marca

### Snippet A — Design tokens base

```css
/* Anthropic brand tokens — drop into any project */
:root {
  /* Primaries */
  --brand-dark:   #141413;
  --brand-light:  #faf9f5;
  --brand-mid:    #b0aea5;
  --brand-soft:   #e8e6dc;

  /* Accents */
  --brand-orange: #d97757;
  --brand-blue:   #6a9bcc;
  --brand-green:  #788c5d;

  /* Typography */
  --font-display: 'Poppins', Arial, sans-serif;
  --font-body:    'Lora', Georgia, serif;

  /* Spacing rhythm */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 4rem;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 12px;
}
```

### Snippet B — Tipografía con escala responsive

```css
body {
  font-family: var(--font-body);
  color: var(--brand-dark);
  background: var(--brand-light);
  line-height: 1.6;
}
h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--brand-dark);
}
h1 { font-size: clamp(2.5rem, 5vw, 4rem); }
h2 { font-size: clamp(2rem, 3.5vw, 2.75rem); }
h3 { font-size: 1.5rem; }
small, .caption {
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  color: var(--brand-mid);
}
```

### Snippet C — Componentes básicos on-brand

```css
.btn-primary {
  background: var(--brand-orange);
  color: var(--brand-light);
  font-family: var(--font-display);
  font-weight: 600;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: var(--radius-sm);
  transition: background 160ms ease;
}
.btn-primary:hover { background: #c4633f; }

.card {
  background: var(--brand-light);
  border: 1px solid var(--brand-soft);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.accent-bar {
  display: inline-block;
  width: 80px;
  height: 4px;
  background: var(--brand-orange);
  margin: var(--space-sm) 0;
}

a { color: var(--brand-blue); text-decoration: underline; text-underline-offset: 3px; }
a:hover { color: var(--brand-dark); }
```

---

## 5. Demo en vivo

Hay una implementación completa navegable en:

**`/Users/agustinmedina/Claude/brand-guidelines/demo_anthropic_landing.html`**

Abrila en el navegador para ver la identidad aplicada end-to-end: navbar, hero, tipografía Poppins + Lora cargadas desde Google Fonts, botones naranja Anthropic, secciones con fondo beige `#faf9f5` y bloques oscuros `#141413` alternados.

---

## 6. Caso de uso estrella — Storytelling

### "El investor deck de las 2 AM"

**Cliente**: Valentina, CEO de una Series A de 18 personas.
**Contexto**: Mañana a las 9 AM tiene reunión con Sequoia. El deck que preparó su equipo usa la plantilla genérica de Google Slides: azules corporativos tristes, Calibri, bullets pesados, tres tipografías distintas entre slides.

Son las 2:07 AM. Valentina abre Claude.

> "Tengo este deck de 18 slides en PPTX. Necesito que se vea premium, sobrio, con una identidad que transmita que somos un equipo serio de infra AI. Puede ser look-and-feel Anthropic. Tenes 10 minutos."

Claude activa la skill `brand-guidelines` y:

1. **Lee** el PPTX existente con `python-pptx`.
2. **Preserva** todo el contenido textual y la estructura de bullets.
3. **Aplica** el sistema de marca:
   - Todos los fondos pasan a `#faf9f5` (o `#141413` en slides de apertura/cierre).
   - Títulos → Poppins 40pt, weight 700, tracking negativo, color `#141413`.
   - Body → Lora 18pt, color `#141413`, line-height 1.5.
   - Bullets decorativos reemplazados por cuadrados de 8px en los tres acentos rotando: naranja, azul, verde.
   - Barra de acento naranja `#d97757` de 80px debajo de cada título de slide.
   - Números grandes (TAM, ARR, runway) → Poppins 72pt en `#d97757`.
4. **Genera** un nuevo `deck_branded.pptx` listo para exportar a PDF.

**2:19 AM**: Valentina abre el archivo. Se le escapa un "uf". Las 18 slides se ven como si las hubiera diseñado un estudio de branding de San Francisco. No hay un solo elemento fuera de sistema.

**9:14 AM**: El partner de Sequoia detiene el pitch en la slide 3 y dice: *"Who designed this deck? It's beautiful."*

Valentina sonríe. No dice que fue Claude a las 2 AM.

**Moraleja**: la skill no te reemplaza el contenido, te regala la capa de dignidad visual que hace que la gente te tome en serio cuando importa.

---

## 7. Cuándo activarla

| Situación                                                                 | Activar skill                                 | Por qué                                                                         |
|---------------------------------------------------------------------------|-----------------------------------------------|---------------------------------------------------------------------------------|
| Usuario pide "landing page"                                               | Opcional                                      | A menos que pida estilo Anthropic o corporativo serio                           |
| Usuario dice "investor deck" / "pitch deck"                               | **Sí**                                        | El branding sobrio diferencia en minutos                                        |
| Usuario muestra PPTX/HTML feo y pide mejorarlo                            | **Sí**                                        | Post-procesamiento clásico                                                      |
| Usuario pide "dashboard ejecutivo"                                        | **Sí**                                        | Armonía cromática > Tailwind random                                             |
| Usuario pide wireframe rápido                                             | No                                            | El estilo final puede distraer                                                  |
| Usuario pide "estilo Claude" o "look Anthropic"                           | **Sí, con énfasis**                           | Pedido explícito                                                                |

---

## Cierre

Una skill que parece cosmética pero en realidad es **velocidad percibida**: la diferencia entre un artefacto que parece hecho por un becario y uno que parece hecho por un estudio. Misma información, 10× más confianza.

**Ruta de la skill**: `/Users/agustinmedina/Claude/brand-guidelines/SKILL.md`
**Demo HTML navegable**: `/Users/agustinmedina/Claude/brand-guidelines/demo_anthropic_landing.html`
