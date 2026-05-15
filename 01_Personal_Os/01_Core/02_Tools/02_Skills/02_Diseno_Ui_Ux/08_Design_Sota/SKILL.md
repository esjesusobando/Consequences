---
name: design-sota
description: >
  Arquitecto de interfaces digitales de elite que fusiona minimalismo editorial con diseño de alto impacto.
  Usa cuando: (1) Generar UIs premium con estética Stripe/Linear/Vercel, (2) Crear dashboards con jerarquía tipográfica editorial, (3) Implementar diseños asimétricos tipo bento grid, (4) Aplicar paletas monocromáticas cálidas + acentos funcionales, (5) Reemplazar tarjetas genéricas con separadores sutiles, (6)厌恶(love) tipografías Geist/Outfit/Satoshi sobre Inter.
  Combina el minimalismo cálida (crema, serif editorial, hairlines 1px) con la asimetria power-user (grid 12 cols, variance 8, motion 6).
license: Apache-2.0
metadata:
  author: personal-os
  version: "1.0"
---

# Design SOTA: Minimalismo Editorial + Alto Impacto

> "La mejor UI no se nota — se siente. Cada pixel respira, cada hairline estructura, cada número cuenta una historia."

Fusiona el **minimalismo utilitario premium** (paleta crema, serif editorial, pasteles desaturados) con el **diseño de alto agency** (asimetría, Geist, acentos funcional). El resultado: interfaces que se leen como publicaciones, no como paneles SaaS genéricos.

---

## 1. CONFIGURACIÓN BASE ACTIVA

```
DESIGN_VARIANCE   [========--]  8/10   (1=simetría perfecta, 10=caos artístico)
MOTION_INTENSITY  [======----]  6/10   (1=estático, 10=cinematográfico)
VISUAL_DENSITY    [====------]  4/10   (1=galería de arte, 10=panel de avión)
```

> Adaptable dinámicamente por chat. Si el usuario pide "dashboard denso tipo Bloomberg", subir `VISUAL_DENSITY` a 8-9.

---

## 2. ARQUITECTURA Y CONVENCIONES

### Stack por defecto
- **Framework:** React / Next.js (Server Components)
- **Estilos:** Tailwind CSS puro
- **Tipografía:** `Geist` (sans), `Satoshi` (alternativa), `Newsreader` (serif editorial), `Geist Mono` (mono)
- **Iconos:** Phosphor (thin) — NUNCA Lucide/Heroicons por defecto

### Prohibiciones absolutas
| Categoría                          | PROHIBIDO                                                     | Alternativa SOTA                                                        |
|------------------------------------|---------------------------------------------------------------|-------------------------------------------------------------------------|
| Tipografía                         | `Inter`, `Roboto`, `Open Sans`                                | `Geist`, `Outfit`, `Cabinet Grotesk`, `Satoshi`                         |
| Color                              | Lila/violeta/neón, degradados marca                           | Neutros Zinc/Slate + 1 acento funcional                                 |
| Sombras                            | `shadow-md`, `shadow-lg`, `shadow-xl`                         | `border-t` sutil o espaciado puro                                       |
| Cards                              | Cards genéricas flotantes                                     | Separación por `border-t` o grid sin bordes                             |
| Layout                             | Centrado simétrico                                            | Split asimétrico 7/5 o 8/4                                              |
| Mobile                             | `h-screen` (parpadeos)                                        | `min-h-[100dvh]`                                                        |
| Contenido                          | Emojis, "John Doe", "Acme Corp"                               | Nombres reales, números concretos                                       |
| Copy                               | "Eleva", "Impulsa", "Game-changer"                            | Verbos concretos, datos reales                                          |
| Texto                              | `#000000` puro                                                | `#111111` (negro apagado)                                               |

---

## 3. PALETA DE COLORES

### Modo Claro (Editorial Cálido)
```css
/* Fondos — crema tibia */
bg-[#F7F6F3]  /* lienzo principal */
bg-[#FBFBFA]  /* alterno */
bg-[#FFFFFF] /* cards */

/* Textos */
text-[#111111] /* principal — nunca puro negro */
text-[#6B6B6B] /* secundario */

/* Bordes — hairline 1px */
border-[#EAEAEA]

/* Acentos — pasteles ultra desaturados (máx 5% pantalla) */
bg-[#FDEBEC] text-[#991B1B] /* error/negativo */
bg-[#E1F3FE] text-[#0369A1] /* info/nuevo */
bg-[#EDF3EC] text-[#166534]  /* éxito/positivo */
bg-[#FBF3DB] text-[#854D0E]  /* pendiente */
```

### Modo Oscuro (Zinc Premium)
```css
bg-zinc-950 text-zinc-100 border-zinc-800 /* base */
accent: emerald-400 | sky-500 | rose-600 /* 1 SOLO acento */
```

### Regla áurea
**Nunca más del 5% de la pantalla cubierta por acento.** El acento se reserva para un badge, una etiqueta, un estado. El resto respira.

---

## 4. TIPOGRAFÍA EDITORIAL

### Stack completo
```css
/* Serif editorial — titulares, citas, números macro */
font-family: 'Newsreader', 'Playfair Display', serif;
letter-spacing: -0.02em;
line-height: 1.05;

/* Sans principal — cuerpo, UI, botones */
font-family: 'Geist Sans', 'Satoshi', 'SF Pro Display', sans-serif;
line-height: 1.6;

/* Mono — metadatos, IDs, timestamps */
font-family: 'Geist Mono', 'JetBrains Mono', monospace;
letter-spacing: 0;
```

### Jerarquía editorial
- **Kicker mono:** `text-[11px] uppercase tracking-[0.18em] text-neutral-500`
- **Título serif:** `text-5xl leading-[1.02] tracking-tight font-medium`
- **Subtítulo sans:** `text-lg leading-[1.7] text-neutral-600`
- **Badge pastel:** `px-2 py-0.5 bg-[#EDF3EC] text-[10px] uppercase tracking-wider`

---

## 5. COMPONENTES SOTA

### 5.1 Hero Asimétrico (split 7/5)
```tsx
<section className="min-h-[100dvh] bg-zinc-950 text-zinc-100 font-[Geist]">
  <div className="grid grid-cols-12 gap-6 px-8 pt-24 max-w-[1400px]">
    {/* Columna 7/12 — izquierda, alineada a izquierda */}
    <div className="col-span-12 lg:col-span-7">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-10">
        <span className="h-px w-8 bg-emerald-400 inline-block mr-3" />
        Registro 024 — Indexación semántica
      </p>
      <h1 className="text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-tight font-medium">
        Clasifica 840k documentos legales
        <span className="text-emerald-400"> en 11 minutos</span>.
      </h1>
      <p className="mt-8 text-zinc-400 text-lg max-w-xl">
        Nexus Logistics redujo revisión de contratos de 14 días a una tarde.
      </p>
      <button className="mt-12 inline-flex items-center gap-2 bg-emerald-400 text-zinc-950 px-6 py-3 font-medium transition-transform active:scale-[0.98]">
        Ver caso completo
      </button>
    </div>

    {/* Columna 5/12 — derecha, sube -mt-8 para romper línea base */}
    <aside className="col-span-12 lg:col-span-5 lg:-mt-8 border-t border-zinc-800 pt-8">
      <div className="grid grid-cols-2 gap-y-10">
        <div>
          <div className="text-5xl font-medium tracking-tight">11m</div>
          <div className="text-xs text-zinc-500 uppercase tracking-widest">Tiempo p95</div>
        </div>
        <div>
          <div className="text-5xl font-medium tracking-tight">99.4<span className="text-zinc-600">%</span></div>
          <div className="text-xs text-zinc-500 uppercase tracking-widest">Precisión</div>
        </div>
      </div>
    </aside>
  </div>
</section>
```

### 5.2 Dashboard Editorial (sin cards flotantes)
```tsx
<div className="min-h-[100dvh] bg-zinc-50 font-[Outfit] px-10 py-12">
  <header className="flex items-baseline justify-between border-b border-zinc-200 pb-6">
    <h1 className="text-2xl tracking-tight text-zinc-900">Abril 2026 — semana 16</h1>
    <span className="text-xs uppercase tracking-widest text-zinc-500">Actualizado hace 2 min</span>
  </header>

  {/* Bento asimétrico 12 cols */}
  <div className="mt-10 grid grid-cols-12 gap-10">
    {/* Métrica estrella: 7 columnas */}
    <section className="col-span-12 lg:col-span-7">
      <div className="text-xs uppercase tracking-widest text-zinc-500">MRR consolidado</div>
      <div className="mt-3 text-[7rem] leading-none font-medium tracking-tight text-zinc-900">$8,120</div>
      <div className="mt-4 inline-flex items-center gap-2 text-emerald-600 text-sm">
        <TrendingUp className="h-4 w-4" />
        +18.4% vs marzo — Olivia cerró Nexus Logistics el martes.
      </div>
    </section>

    {/* Stack de métricas: 5 columnas, separadores border-t */}
    <section className="col-span-12 lg:col-span-5 space-y-6">
      <div className="border-t border-zinc-200 pt-5 flex items-baseline justify-between">
        <span className="text-sm text-zinc-500">Revenue YTD</span>
        <span className="text-2xl tracking-tight">$24,532</span>
      </div>
      <div className="border-t border-zinc-200 pt-5 flex items-baseline justify-between">
        <span className="text-sm text-zinc-500">Usuarios activos</span>
        <span className="text-2xl tracking-tight">1,240</span>
      </div>
      <div className="border-t border-zinc-200 pt-5 flex items-baseline justify-between">
        <span className="text-sm text-zinc-500">Churn 30d</span>
        <span className="text-2xl tracking-tight inline-flex items-center gap-2">
          2.3% <TrendingDown className="h-4 w-4 text-rose-500" />
        </span>
      </div>
    </section>

    {/* Nota editorial con offset */}
    <aside className="col-span-12 lg:col-start-5 lg:col-span-8 border-t border-zinc-900 pt-6">
      <p className="text-lg text-zinc-700 leading-relaxed max-w-2xl">
        LTV subió a <span className="text-zinc-900 font-medium">$1,430</span> gracias a
        que el plan Teams retuvo 9 de 10 cuentas nuevas del Q1.
      </p>
    </aside>
  </div>
</div>
```

### 5.3 Card Editorial (sin sombra, con hairline)
```tsx
<article className="bg-white border border-[#EAEAEA] p-10">
  <div className="flex items-start justify-between">
    <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-neutral-500">
      01 · Latencia
    </p>
    <span className="font-mono text-[10px] px-2 py-0.5 bg-[#E1F3FE] text-neutral-700 uppercase tracking-wider">
      Release
    </span>
  </div>

  <h3 className="font-serif text-3xl leading-[1.1] tracking-tight text-neutral-900 mt-8">
    Respuesta media <span className="italic text-neutral-600">bajo 90ms</span> en 12 regiones.
  </h3>

  <p className="font-sans text-[15px] leading-[1.65] text-neutral-600 mt-5 max-w-md">
    La nueva capa de caché reemplaza los workers de 2024. Medido sobre 14 días.
  </p>

  <div className="mt-10 pt-6 border-t border-[#EAEAEA] flex items-center justify-between">
    <span className="font-mono text-xs text-neutral-500">Nota técnica 04</span>
    <a href="#" className="font-sans text-sm text-neutral-900 underline underline-offset-4">
      Leer análisis
    </a>
  </div>
</article>
```

### 5.4 Botón Primary (sin sombra, con micro-scale)
```tsx
<button className="
  bg-[#111111] text-white px-6 py-3 font-sans text-sm
  transition-transform hover:scale-[0.98] active:scale-[0.96]
">
  Solicitar demo
</button>
```

---

## 6. MICROANIMACIONES (Motion 6)

```tsx
// Botón: micro-scale al click
<button className="transition-transform active:scale-[0.98]">

// Entrada en scroll: IntersectionObserver + fade 600ms
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('opacity-100', 'translate-y-0');
        e.target.classList.remove('opacity-0', 'translate-y-4');
      }
    }),
    { threshold: 0.1 }
  );
  // Animación base: opacity-0 translate-y-4 → opacity-100 translate-y-0
}, []);

// Bento: entrada en cascada (stagger 100ms por item)
```

---

## 7. SNIPPETS TAILWIND ANTI-PATTERN

```diff
# NO h-screen
- <div className="h-screen bg-gradient-to-br from-purple-600 to-indigo-500">
+ <div className="min-h-[100dvh] bg-zinc-950 [will-change:transform]">

# NO Inter
- <h1 className="font-[Inter] text-center text-5xl">
+ <h1 className="font-[Geist] text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-tight">

# NO cards con shadow
- <div className="bg-white rounded-2xl shadow-xl p-6">
+ <section className="border-t border-zinc-200 pt-6">

# NO botón púrpura
- <button className="bg-purple-600 rounded-full px-8 py-3 shadow-lg">
+ <button className="bg-emerald-400 text-zinc-950 px-6 py-3 transition-transform active:scale-[0.98]">

# NO glass genérico
- <div className="backdrop-blur-md bg-white/20 rounded-xl">
+ <div className="backdrop-blur-xl bg-white/5 border border-white/10">

# NO grid simétrico
- <div className="grid grid-cols-3 gap-4">
+ <div className="grid grid-cols-12 gap-6">
```

---

## 8. COPY EDITORIAL (Reglas)

| ❌ Cliche                                                | ✅ Concreto                                                            |
|---------------------------------------------------------|-----------------------------------------------------------------------|
| "Eleva tu negocio"                                      | "Clasifica 840k docs en 11 min"                                       |
| "Next-gen AI revolution"                                | "Redujo revisión de 14 días a 1 tarde"                                |
| "Get Started Today"                                     | "Ver caso completo" / "Probar 50 docs gratis"                         |
| "AI-Powered. Enterprise-Ready."                         | "Registro 024 — Indexación semántica"                                 |
| John Doe, Acme Corp                                     | Olivia Sterling, Nexus Logistics                                      |

**4 reglas de copy:**
1. Un número concreto en el headline
2. Un cliente real con nombre
3. Antes/después cuantificado
4. Prohibición de buzzwords: `unleash`, `next-gen`, `revolutionary`, `cutting-edge`, `state-of-the-art`, `empower`, `unparalleled`, `seamless`, `robust`

---

## 9. REFERENCIAS

- **Demo frontend:** `01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/03_Taste_Skills/1. TASTE SKILLS/demo_saas.html`
- **Demo dashboard:** `01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/04_Diseno_Minimalista/2. DISEÑO MINIMALISTA/demo_dashboard.html`

---

## 10. RESUMEN DE REGLAS SOTA

```
1. TIPO: Geist > Inter > Roboto
2. COLOR: Zinc/Slate + 1 acento (Emerald/Sky/Rose) — NUNCA lila
3. LAYOUT: 12 cols, split 7/5, offset con col-start
4. SEPARACIÓN: border-t o espaciado — NUNCA shadow-*
5. BOTÓN: negro sólido, scale(0.98) al hover/click
6. MOBILE: min-h-[100dvh] — NUNCA h-screen
7. ICONOS: Phosphor thin — NUNCA emoji
8. COPY: números concretos, nombres reales, 0 buzzwords
9. MOTION: fade 600ms + micro-scale — nunca todo a la vez
10. HIERARCHY: serif para números macro, mono para labels
```
