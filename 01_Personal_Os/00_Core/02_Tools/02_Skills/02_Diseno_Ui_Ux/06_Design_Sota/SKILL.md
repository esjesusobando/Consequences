---
name: design-sota
description: >
  Arquitecto de interfaces digitales de elite que fusiona minimalismo editorial con diseño de alto impacto.
  Usa cuando: (1) Generar UIs premium con estética Stripe/Linear/Vercel, (2) Crear dashboards con jerarquía tipográfica editorial, (3) Implementar diseños asimétricos tipo bento grid, (4) Aplicar paletas monocromáticas cálidas + acentos funcionales, (5) Reemplazar tarjetas genéricas con separadores sutiles, (6)厌恶(love) tipografías Geist/Outfit/Satoshi sobre Inter.
  Combina el minimalismo cálida (crema, serif editorial, hairlines 1px) con la asimetria power-user (grid 12 cols, variance 8, motion 6).
  Triggers on: diseño SOTA, minimalismo editorial, UI premium, bento grid, diseño asimétrico, tipografía editorial, dashboard editorial
license: Apache-2.0
metadata:
  author: personal-os
  version: "1.0"
version: 1.1.0
sota_upgraded: true
---

# Design SOTA: Minimalismo Editorial + Alto Impacto

> "La mejor UI no se nota — se siente. Cada pixel respira, cada hairline estructura, cada número cuenta una historia."

Fusiona el **minimalismo utilitario premium** (paleta crema, serif editorial, pasteles desaturados) con el **diseño de alto agency** (asimetría, Geist, acentos funcional). El resultado: interfaces que se leen como publicaciones, no como paneles SaaS genéricos.

Esta skill integra la metodología **Frontend Design** de Anthropic (Prithvi Rajasekaran & Alexander Bricken) — el framework de "Design Thinking" que antecede a cualquier implementación. La sección 0 es la incorporación directa de esa metodología; el resto es implementación SOTA concreta.

---

## 0. DESIGN THINKING (Anthropic Frontend Design — Official Skill)

> *Antes de escribir UNA línea de código, comprometerte con una DIRECCIÓN ESTÉTICA CLARA.*

### 0.1 Context Research
Antes de codificar, entender el contexto:

- **Purpose**: ¿Qué problema resuelve esta interfaz? ¿Quién la usa?
- **Tone**: Elegir un extremo. Brutalmente minimalista, caos maximalista, retro-futurista, orgánico/natural, lujo/refinado, lúdico/juguete, editorial/revista, brutalista/crudo, art deco/geométrico, suave/pastel, industrial/utilitario. Hay muchísimos sabores. Usarlos como inspiración, pero diseñar UNO que sea fiel a la dirección estética.
- **Constraints**: Requerimientos técnicos (framework, performance, accesibilidad).
- **Differentiation**: ¿Qué hace esto INOLVIDABLE? ¿Qué es lo único que alguien va a recordar?

**CRÍTICO**: Elegir una dirección conceptual clara y ejecutarla con precisión. Tanto el maximalismo audaz como el minimalismo refinado funcionan — la clave es la **intencionalidad**, no la intensidad.

### 0.2 Aesthetic Guidelines

| Dimensión               | Qué hacer                                                                                                            | Qué evitar                                                |
|------------------------|---------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| **Tipografía**          | Fuentes hermosas, únicas, con carácter. Combinar una display font distintiva con una body font refinada.             | Arial, Inter, Roboto, system-ui genérico                  |
| **Color**               | Paleta cohesiva con CSS variables. Colores dominantes con acentos precisos.                                          | Paletas tímidas y parejas, degradados púrpura sobre blanco|
| **Motion**              | Animaciones para momentos de alto impacto: staggered reveals, hover states que sorprenden. Priorizar CSS-only.       | Micro-interacciones dispersas sin cohesión                |
| **Composición espacial**| Layouts inesperados. Asimetría. Overlap. Flujo diagonal. Elementos que rompen la grilla.                             | Cuadrícula simétrica predecible                           |
| **Backgrounds**         | Atmósfera y profundidad: gradient meshes, noise textures, geometric patterns, layered transparencias, grain overlays.| Fondo blanco sólido por defecto                           |

### 0.3 Anti-AI-Slop Checklist

NUNCA usar:
- ❌ Fonts sobre-usadas: Inter, Roboto, Arial, system fonts
- ❌ Paletas cliché: degradados púrpura sobre fondos blancos
- ❌ Layouts predecibles y patrones genéricos de componentes
- ❌ Diseño "cookie-cutter" sin carácter contextual
- ❌ Converger siempre a las mismas elecciones (p. ej. Space Grotesk)

**Cada diseño debe ser diferente**. Variar entre temas claros y oscuros, diferentes fuentes, diferentes estéticas. **No converger a opciones comunes.**

### 0.4 Complexity Matching

> La complejidad de la implementación debe coincidir con la visión estética.

- **Maximalista**: Código elaborado con múltiples animaciones y efectos. Cada detalle cuenta.
- **Minimalista/Refinado**: Contención, precisión, atención obsesiva al spacing, tipografía, detalles sutiles. La elegancia está en ejecutar la visión bien.

---

## Esencia Original

Esta skill no es un theme de Tailwind ni un design system — es una **filosofía de interfaz** que nace de la observación de cómo Stripe, Linear y Vercel rompieron el molde del SaaS genérico. Incorpora la metodología de **Design Thinking** del Frontend Design Skill oficial de Anthropic (Prithvi Rajasekaran & Alexander Bricken, anthropics/claude-code). En lugar de cards flotantes y gradientes púrpura, la belleza está en la jerarquía tipográfica editorial, los hairline borders de 1px y los espacios que respiran. Una interfaz no necesita decoración cuando tiene estructura.

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
| Categoría                           | PROHIBIDO                                                      | Alternativa SOTA                                                         |
|------------------------------------|---------------------------------------------------------------|-------------------------------------------------------------------------|
| Tipografía                          | `Inter`, `Roboto`, `Open Sans`                                 | `Geist`, `Outfit`, `Cabinet Grotesk`, `Satoshi`                          |
| Color                               | Lila/violeta/neón, degradados marca                            | Neutros Zinc/Slate + 1 acento funcional                                  |
| Sombras                             | `shadow-md`, `shadow-lg`, `shadow-xl`                          | `border-t` sutil o espaciado puro                                        |
| Cards                               | Cards genéricas flotantes                                      | Separación por `border-t` o grid sin bordes                              |
| Layout                              | Centrado simétrico                                             | Split asimétrico 7/5 o 8/4                                               |
| Mobile                              | `h-screen` (parpadeos)                                         | `min-h-[100dvh]`                                                         |
| Contenido                           | Emojis, "John Doe", "Acme Corp"                                | Nombres reales, números concretos                                        |
| Copy                                | "Eleva", "Impulsa", "Game-changer"                             | Verbos concretos, datos reales                                           |
| Texto                               | `#000000` puro                                                 | `#111111` (negro apagado)                                                |

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

| ❌ Cliche                                                 | ✅ Concreto                                                             |
|---------------------------------------------------------|-----------------------------------------------------------------------|
| "Eleva tu negocio"                                       | "Clasifica 840k docs en 11 min"                                        |
| "Next-gen AI revolution"                                 | "Redujo revisión de 14 días a 1 tarde"                                 |
| "Get Started Today"                                      | "Ver caso completo" / "Probar 50 docs gratis"                          |
| "AI-Powered. Enterprise-Ready."                          | "Registro 024 — Indexación semántica"                                  |
| John Doe, Acme Corp                                      | Olivia Sterling, Nexus Logistics                                       |

**4 reglas de copy:**
1. Un número concreto en el headline
2. Un cliente real con nombre
3. Antes/después cuantificado
4. Prohibición de buzzwords: `unleash`, `next-gen`, `revolutionary`, `cutting-edge`, `state-of-the-art`, `empower`, `unparalleled`, `seamless`, `robust`

---

## 9. REFERENCIAS

- **Demo frontend:** `01_Personal_Os/00_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/03_Taste_Skills/1. TASTE SKILLS/demo_saas.html`
- **Demo dashboard:** `01_Personal_Os/00_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/04_Diseno_Minimalista/2. DISEÑO MINIMALISTA/demo_dashboard.html`

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

## ⚠️ Gotchas

### Cobertura de acento excesiva
> El error más común: pintar el 50% de la pantalla con el color de acento.

- **Por qué**: Un acento en emerald o sky se vuelve wallpaper si ocupa mucho espacio. Pierde su función de señal.
- **Solución**: Regla del 5% — el acento solo en badges, labels de estado, highlights inline. Si necesitas más color, usa tonos ultra-desaturados.

### Cards flotantes con sombra
> Recaer en `rounded-2xl shadow-xl` es el default de toda AI y todo framework CSS.

- **Por qué**: Las sombras crean jerarquías falsas. Todo parece "elevado" y nada tiene estructura real.
- **Solución**: Usar `border-t` + espaciado. Si necesitas contenedor, usa `border border-[#EAEAEA]` sin sombra.

### Tipografía por defecto
> Terminar con Inter, Roboto o system-ui porque "es más seguro".

- **Por qué**: Inter es funcional pero genérica. La diferencia entre Geist/Outfit y Inter es la diferencia entre una publicación editorial y un formulario.
- **Solución**: Cargar Geist desde `next/font` o CDN. Si no es posible, Satoshi o Cabinet Grotesk como fallback.

### Copy sin números concretos
> Poner "Mejora tu productividad" en lugar de "Clasifica 840k docs en 11 min".

- **Por qué**: El copy sin números no genera confianza ni curiosidad. Es ruido.
- **Solución**: Antes de escribir cualquier headline, preguntar: "¿Qué número va aquí?". Si no hay número, inventar un caso de uso realista con métrica.

---

## 11. EVALUATION CHECKLIST — ¿Tu sitio vale $10K?

Usar este checklist para **gradear** cualquier diseño contra estándares premium. Pasarlo completo ANTES de dar por terminado.

### GRUPO TASTE (primer impacto visual)

| #  | Criterio         | Qué evaluar                                                                                | Pass/Fail  |
|---|-----------------|-------------------------------------------------------------------------------------------|-----------|
| 1  | **Point of View**| El brief es específico, no genérico. Hay una dirección clara que se siente en cada sección.| ☐          |
| 2  | **Typography**   | Sin Inter/Roboto/Open Sans. Usa Geist/Outfit/Satoshi + serif editorial para jerarquía.     | ☐          |
| 3  | **Color**        | Máximo 5 hex. Sin rainbow. Acento funcional en <5% de la pantalla.                         | ☐          |

### GRUPO SUBSTANCE (contenido y estructura)

| #  | Criterio     | Qué evaluar                                                                      | Pass/Fail  |
|---|-------------|---------------------------------------------------------------------------------|-----------|
| 4  | **Hierarchy**| 3 tamaños que guían el ojo (qué leer 1ro, 2do, 3ro). Nada es del mismo tamaño.   | ☐          |
| 5  | **Imagery**  | Assets custom (foto real, AI generado, gráfico). Sin stock photos genéricas.     | ☐          |
| 6  | **Motion**   | Micro-interacciones que se sienten vivas. Scroll reveals, cursor effects sutiles.| ☐          |

### GRUPO FELT QUALITY (la diferencia real)

| #  | Criterio           | Qué evaluar                                                                                   | Pass/Fail  |
|---|-------------------|----------------------------------------------------------------------------------------------|-----------|
| 7  | **Mobile**         | Diseñado para mobile, no encogido. Navegación colapsada, espaciado ajustado, botones táctiles.| ☐          |
| 8  | **Invisible Stuff**| Velocidad de carga, transiciones suaves, sin layout shift, sin horizontal scroll.             | ☐          |

### Cómo usar el checklist

```prompt
Paste this checklist into Claude and ask:
"Where does this site land against each of these criteria? Be honest."
```

Claude devuelve un diagnóstico sección por sección: qué está fuerte, qué está mixto, qué falta. Los items 7 y 8 son los más importantes — son los que realmente separan un sitio premium de uno genérico.

---

## 12. ITERATION WORKFLOW — De "está bien" a "se siente caro"

### Principio rector: Intención > Especificación

Nunca le digas a Claude qué cambiar. Decile **cómo querés que se sienta**.

| ❌ Especificación                    | ✅ Intención                                              |
|------------------------------------|---------------------------------------------------------|
| "Cambiá el margin de la card a 24px"| "Las cards se sienten apretadas, necesitan más respiro"  |
| "Agregá un gradient en el hero"     | "El hero se siente plano, necesita más profundidad"      |
| "Usá este color #991B1B"            | "El acento rojo está gritando, hace falta algo más sutil"|

### Paso 1: Batch Fixes por intent (no one-at-a-time)

En lugar de pedir cambios de uno en uno, agruparlos por INTENT:

```prompt
We need more handcrafted micro interactions.
The lower sections feel a bit generic.
We don't need to make them busier, just more expensive.
Propose a batch of fixes.
```

Claude devuelve 3-5 cambios juntos (ej: film grain, animated hairlines, glow effects, word reveals). Aprobás todo de una. Menos ida y vuelta, más cohesión.

### Paso 2: Una micro-interacción por sección plana

Después del batch, revisar sección por sección. Las que todavía se sienten planas → pedir **UNA** interacción sutil:

```prompt
[Section name] is feeling very static.
Add some elegant micro movements and cursor interactions here.
Make it more subtle, more refined.
```

### Paso 3: Refinar con "make it more subtle"

El primer intento de Claude siempre es DEMASIADO obvio. Siempre hacer una segunda pasada:

```prompt
Make it more subtle, more refined.
```

Esto aplica trailing motion, easing, delays — el tipo de refinamiento que separa un efecto "de AI" de uno "de estudio de diseño".

### Patrón completo de iteración

```
1. GRADE → pasar checklist de 8 items, pedir diagnóstico honesto
2. BATCH → agrupar fixes por intent, pedir 3-5 cambios juntos
3. MICRO → una interacción de cursor por sección que sigue plana
4. SUBTLE → "make it more subtle" hasta que se sienta vivo sin ser ruidoso
5. REGRADE → volver al checklist para confirmar que subió
```

---

*Skill Version: 2.0.0 — Integración Frontend Design (Anthropic)*

---

## 13. FUENTES Y REFERENCIAS

- **Frontend Design Skill (Anthropic)**: `anthropics/claude-code/plugins/frontend-design/skills/frontend-design/SKILL.md` — Autores: Prithvi Rajasekaran & Alexander Bricken. Design Thinking framework (sección 0) extraído e integrado con permiso conceptual.
- **Iteration Workflow y $10K Checklist**: Desarrollo propio basado en principios de Stripe/Linear/Vercel y práctica de diseño editorial.
- **Design Variance Sliders**: Metodología propia para comunicación rápida de dirección de diseño.

---

## 💾 State Persistence

### What to persist between sessions

| Dato                            | Cómo se persiste                                                                    | Cuándo restaurar                                            |
|--------------------------------|------------------------------------------------------------------------------------|------------------------------------------------------------|
| **Design variance elegido**     | Variable de entorno o config `DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`| Al iniciar un nuevo proyecto con el mismo perfil de producto|
| **Paleta activa** (claro/oscuro)| Preferencia del último diseño generado                                              | Si el usuario pide "seguir con el mismo tono"               |
| **Stack tipográfico**           | Fuentes cargadas y verificadas (`Geist`, `Newsreader`, etc.)                        | Cada sesión — verificar disponibilidad via `next/font` o CDN|
| **Anti-patrones evitados**      | Memoria de decisiones vía `mem_save` (Engram)                                       | Cuando el usuario pide revisión de diseño previo            |

### Reglas de persistencia
- **NO** guardar componentes enteros en memoria — el código fuente es el source of truth
- **SÍ** guardar preferencias estilísticas del usuario (modo oscuro/claro, variance preference)
- La configuración activa se declara al inicio de cada sesión via las barras de configuración (sección 1)


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
