# Skill Demo 05 — Minimalismo Utilitario Premium

> Filosofía "document-like UI": la interfaz debe leerse como un documento editorial bien compuesto, no como un panel de control con chispitas. Cada pixel vacío es decisión. Cada hairline de 1px es estructura. La tipografía hace el trabajo que otros delegan al color.

**Ubicación del skill:** `/Users/agustinmedina/Claude/minimalist-skill/SKILL.md`
**Demo HTML de referencia:** `/Users/agustinmedina/Claude/minimalist-skill/demo_dashboard.html`

---

## 1. Lo que este skill NO hace (tabla de prohibiciones)

| Categoria                  | Prohibido                                                        | Razón                                                 |
|----------------------------|------------------------------------------------------------------|-------------------------------------------------------|
| Tipografía                 | Inter, Roboto, Open Sans                                         | Identidad SaaS genérica, ya quemadas                  |
| Sombras                    | `shadow-md`, `shadow-lg`, `shadow-xl`                            | Ruido visual, estética "bootstrap 2016"               |
| Color de fondo             | Hero azul, verde o rojo saturado                                 | Estampa de plantilla de Webflow                       |
| Gradientes                 | Neón, glassmorphism fuerte, degradados marca                     | Tendencia corto-placista                              |
| Radios                     | `rounded-full` en cards y contenedores grandes                   | Lee como "pastilla de farmacia"                       |
| Iconografía                | Lucide / Feather / Heroicons por defecto                         | Demasiado vistos, restan carácter                     |
| Contenido                  | Emojis, lorem ipsum, "John Doe", "Acme Corp"                     | Maqueta sin contexto, descartable                     |
| Copywriting                | "Eleva", "Impulsa", "Desata", "Game-changer"                     | Clichés IA, lenguaje de landing mediocre              |
| Negros                     | `#000000` puro en texto                                          | Corta los ojos, rompe la calidez del lienzo           |

---

## 2. Paleta cálida (swatches)

```text
  Lienzo principal      #F7F6F3    crema tibia, base de página
  Lienzo alterno        #FBFBFA    off-white para secciones contiguas
  Card / panel          #FFFFFF    o #F9F9F8 para variación
  Hairline (borde)      #EAEAEA    la única "estructura" visible
  Texto principal       #111111    negro apagado, nunca #000
  Texto secundario      #6B6B6B    gris medio templado
```

**Acentos pastel ultra-desaturados (solo para pills / tags / estados):**

```text
  Rojo pálido           #FDEBEC    error / eliminado
  Azul pálido           #E1F3FE    info / nuevo
  Verde pálido          #EDF3EC    éxito / activo
  Amarillo pálido       #FBF3DB    pendiente / review
```

Regla de oro: **nunca más del 5% de la pantalla cubierta por acento**. El acento se reserva para un badge, una celda de tabla, una etiqueta. El resto respira en crema.

---

## 3. Stack tipográfico

```css
/* Serif editorial — titulares, citas, números grandes */
font-family: 'Lyon Text', 'Newsreader', 'Playfair Display', serif;
letter-spacing: -0.02em;
line-height: 1.05;

/* Sans-serif — cuerpo, UI, botones */
font-family: 'SF Pro Display', 'Geist Sans', 'Switzer', 'Helvetica Neue', sans-serif;
line-height: 1.6;

/* Mono — metadatos, códigos, timestamps, keyboard hints */
font-family: 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;
letter-spacing: 0;
```

### Ejemplo de contraste editorial

```html
<article class="max-w-4xl py-24">
  <p class="font-mono text-xs tracking-widest uppercase text-neutral-500">
    ISSUE 04 · ABR 2026
  </p>
  <h1 class="font-serif text-6xl leading-[1.02] tracking-tight text-neutral-900 mt-6">
    El trabajo tranquilo produce código mejor que el trabajo frenético.
  </h1>
  <p class="font-sans text-lg leading-[1.7] text-neutral-700 mt-8 max-w-2xl">
    Escribimos esta nota después de revisar 140 pull requests
    del último trimestre. Los patrones son claros y, en casi todos
    los casos, contraintuitivos.
  </p>
</article>
```

El mono hace de "kicker" editorial, el serif carga el drama, el sans acompaña sin competir.

---

## 4. Tres transformaciones ANTES / DESPUÉS

### Ejemplo 1 — Dashboard SaaS genérico → editorial premium

**Antes (dashboard tipo plantilla moradita):**

```html
<!-- Inter, fondo morado, shadow-xl, rounded-3xl, emoji, cliché -->
<div class="bg-gradient-to-br from-purple-600 to-indigo-500 p-8 rounded-3xl shadow-xl">
  <h2 class="font-[Inter] text-white text-3xl font-bold">
    Eleva tus ventas
  </h2>
  <p class="text-purple-100 mt-2">
    Panel de control de nueva generación para impulsar tu negocio
  </p>
  <div class="mt-6 bg-white/20 backdrop-blur rounded-2xl p-4 shadow-lg">
    <p class="text-white text-4xl font-black">$128,430</p>
    <p class="text-green-300">+24% este mes</p>
  </div>
</div>
```

**Después (panel editorial calmo):**

```html
<!-- Crema cálida, hairline 1px, serif editorial, mono en metadata -->
<section class="bg-[#F7F6F3] px-10 py-24">
  <div class="max-w-4xl">
    <p class="font-mono text-[11px] tracking-[0.18em] uppercase text-neutral-500">
      Panel · Abril 2026
    </p>
    <h2 class="font-serif text-5xl leading-[1.04] tracking-tight text-neutral-900 mt-5">
      Ingresos recurrentes del trimestre.
    </h2>

    <div class="mt-14 grid grid-cols-3 border border-[#EAEAEA] bg-white">
      <div class="p-8 border-r border-[#EAEAEA]">
        <p class="font-mono text-[11px] uppercase tracking-widest text-neutral-500">MRR</p>
        <p class="font-serif text-4xl mt-4 text-neutral-900">128,430</p>
        <p class="font-sans text-sm text-neutral-600 mt-2">USD · netos de reembolsos</p>
      </div>
      <div class="p-8 border-r border-[#EAEAEA]">
        <p class="font-mono text-[11px] uppercase tracking-widest text-neutral-500">Churn</p>
        <p class="font-serif text-4xl mt-4 text-neutral-900">2.1<span class="text-neutral-400">%</span></p>
        <p class="font-sans text-sm text-neutral-600 mt-2">Promedio trimestral</p>
      </div>
      <div class="p-8">
        <p class="font-mono text-[11px] uppercase tracking-widest text-neutral-500">Nuevos</p>
        <p class="font-serif text-4xl mt-4 text-neutral-900">48</p>
        <span class="inline-block mt-3 px-2 py-0.5 bg-[#EDF3EC] font-mono text-[10px] uppercase tracking-wider text-neutral-700">
          Activos
        </span>
      </div>
    </div>
  </div>
</section>
```

Cambios clave: fondo crema, serif para el número, mono en labels con `tracking-widest`, sin radios, sin sombras, una sola pill pastel desaturada.

---

### Ejemplo 2 — Landing de producto: hero colorido → minimalista tipográfico

**Antes (hero genérico AI SaaS):**

```html
<section class="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 py-32 text-center">
  <h1 class="text-white text-7xl font-black font-[Inter] drop-shadow-xl">
    Impulsa tu negocio con IA de nueva generación
  </h1>
  <p class="text-white/90 text-xl mt-6 font-[Inter]">
    La plataforma que eleva cada decisión
  </p>
  <button class="mt-10 bg-white text-purple-600 rounded-full px-10 py-4 font-bold shadow-2xl">
    Prueba gratis
  </button>
</section>
```

**Después (hero document-like):**

```html
<section class="bg-[#FBFBFA] px-10 py-40 border-b border-[#EAEAEA]">
  <div class="max-w-4xl mx-auto">
    <p class="font-mono text-[11px] tracking-[0.22em] uppercase text-neutral-500">
      Plataforma · v4.2
    </p>
    <h1 class="font-serif text-7xl leading-[1.02] tracking-[-0.025em] text-neutral-900 mt-8">
      Un expediente vivo
      <span class="italic text-neutral-600">para cada cliente</span>
      de tu estudio.
    </h1>
    <p class="font-sans text-lg leading-[1.7] text-neutral-600 mt-10 max-w-2xl">
      Harbor organiza correos, llamadas y documentos en un hilo
      único por caso. Pensado para despachos legales de entre
      10 y 40 abogados.
    </p>
    <div class="flex items-center gap-6 mt-14">
      <a href="#demo"
         class="bg-[#111111] text-white px-6 py-3 font-sans text-sm tracking-tight
                transition-transform hover:scale-[0.98]">
        Solicitar demo
      </a>
      <a href="#docs" class="font-sans text-sm text-neutral-700 underline underline-offset-4">
        Leer documentación técnica
      </a>
    </div>
  </div>
</section>
```

Cambios clave: fondo crema, serif con *italic* interno como recurso editorial, copy específico (no "eleva", no "nueva generación"), CTA plano sin sombra con `scale(0.98)` al hover.

---

### Ejemplo 3 — Card componente genérica → card editorial

**Antes (card tipo Bootstrap moderno):**

```html
<div class="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition">
  <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
    <span class="text-2xl">🚀</span>
  </div>
  <h3 class="font-[Inter] text-xl font-bold mt-4">Performance turbo</h3>
  <p class="text-gray-500 mt-2">Eleva la velocidad de tu stack al siguiente nivel</p>
  <button class="mt-4 bg-blue-500 text-white rounded-full px-4 py-2">
    Saber más →
  </button>
</div>
```

**Después (card editorial con hairline):**

```html
<article class="bg-white border border-[#EAEAEA] p-10">
  <div class="flex items-start justify-between">
    <p class="font-mono text-[11px] tracking-[0.2em] uppercase text-neutral-500">
      01 · Latencia
    </p>
    <span class="font-mono text-[10px] px-2 py-0.5 bg-[#E1F3FE] text-neutral-700 uppercase tracking-wider">
      Release
    </span>
  </div>

  <h3 class="font-serif text-3xl leading-[1.1] tracking-tight text-neutral-900 mt-8">
    Respuesta media
    <span class="italic text-neutral-600">bajo 90ms</span>
    en 12 regiones.
  </h3>

  <p class="font-sans text-[15px] leading-[1.65] text-neutral-600 mt-5 max-w-md">
    La nueva capa de caché reemplaza los workers de 2024.
    Medido sobre 14 días de tráfico de producción, percentil 95.
  </p>

  <div class="mt-10 pt-6 border-t border-[#EAEAEA] flex items-center justify-between">
    <span class="font-mono text-xs text-neutral-500">Nota técnica 04</span>
    <a href="#" class="font-sans text-sm text-neutral-900 underline underline-offset-4">
      Leer el análisis
    </a>
  </div>
</article>
```

Cambios clave: borde hairline en lugar de sombra, numeración editorial ("01 ·"), pill pastel desaturada reducida a 10px mono, separador inferior de 1px, CTA textual en vez de botón coloreado.

---

## 5. Caso de uso estrella — Rebrand de SaaS "Stripe / Linear / Vercel"

**Contexto:** Un SaaS B2B con 18 meses de vida, estética heredada de plantilla Tailwind UI (fondo violeta, cards redondeadas, Inter, emojis). El equipo quiere reposicionarse en el segmento premium donde compiten Stripe, Linear, Vercel, Mercury, Arc.

**Qué produce este skill en ese encargo:**

1. **Landing reescrita entera**
   - Hero con serif editorial + kicker mono + párrafo sans concreto.
   - Sin imagen de héroe. El tipo *es* el héroe.
   - Secciones separadas por hairline `#EAEAEA`, no por colores de fondo distintos.

2. **Dashboard app-side**
   - Bento grid asimétrico de CSS Grid con `border: 1px solid #EAEAEA`.
   - Métricas en serif grande, labels en mono micro, estados en pills pastel.
   - Mac-window wrapper (3 puntitos) para screenshots de marketing.

3. **Sistema de componentes**
   - Botón primario negro `#111111`, `scale(0.98)` al hover, cero sombra.
   - Acordeón FAQ con `border-bottom` y `+` / `−` en Phosphor.
   - Tabla estilo periódico: filas con hairline, mono para IDs y timestamps.

4. **Documentación interna**
   - Página tipo "changelog" Linear-style: fecha en mono, versión en serif, cuerpo sans.
   - Sin iconos de colores. Si hay icono, es Phosphor thin weight.

5. **Microanimaciones**
   - `IntersectionObserver` con fade-up de `600ms`.
   - Bento entra en cascada, nunca todo a la vez.
   - Botones achican, no crecen.

**Resultado medible:** la marca pasa de "una plantilla más" a leerse como una publicación. El visitante pasa más tiempo en la home porque hay algo que *leer*. El equipo comercial reporta que los prospectos del tier enterprise dejan de preguntar "¿sois una startup pequeña?".

---

## 6. Archivo de referencia en el repo

`/Users/agustinmedina/Claude/minimalist-skill/demo_dashboard.html` contiene un dashboard completo aplicando todas las reglas: mac-window wrapper, bento grid, métricas en serif, pills pastel, mono en metadata, hairlines de 1px, cero sombras. Úsalo como plantilla base al aplicar el skill.

---

## 7. Guion de video (markdown)

```markdown
# Video — Skill "Minimalismo Utilitario Premium"
Duración objetivo: 90 segundos. Tono: calmo, editorial, pausado.

## 00:00 — 00:08 · Gancho
Pantalla dividida.
Izquierda: dashboard morado con Inter, sombras, emojis, "Eleva tu negocio".
Derecha: misma data, pero en crema, serif editorial, hairlines, mono.
Voz: "La misma información. Dos productos distintos."

## 00:08 — 00:22 · Problema
B-roll de 4 landings SaaS genéricas reales (blur).
Voz: "Cuando todo el mundo usa Inter, sombras moradas y rounded-full,
la UI deja de comunicar calidad. Comunica plantilla."

## 00:22 — 00:45 · El skill
Cámara enfoca el SKILL.md abierto.
Scroll lento por la lista de prohibiciones.
Voz: "Este skill codifica un estilo concreto: document-like UI.
Paleta crema, serif editorial, mono en metadata, hairlines de 1px.
Sin emojis, sin lorem, sin clichés."

## 00:45 — 01:10 · Demo vivo
Pantalla: aplicar el skill a una card genérica en vivo.
Mostrar el antes / después del Ejemplo 3 del demo.
Voz: "Una card. Mismas palabras clave. El skill cambia tipos,
quita sombras, añade un hairline, reordena jerarquía.
Lee como una página de un periódico económico."

## 01:10 — 01:25 · Caso de uso
Mostrar el dashboard editorial final con animación fade-up en cascada.
Voz: "Caso estrella: rebrand de un SaaS que quiere jugar en la liga
de Stripe, Linear y Vercel. El skill entrega el frontend listo."

## 01:25 — 01:30 · Cierre
Logo + ruta del skill.
Voz: "Minimalismo Utilitario Premium. Un archivo. Una estética entera."

## Notas de rodaje
- Fondos en grabación: crema cálida real (papel o cartulina).
- Sonido: máquina de escribir muy lejana, 12% volumen.
- Cero motion graphics coloridas. Fade simple, 600ms.
- Tipografía en títulos del video: Newsreader Italic sobre crema.
```

---

## Resumen operativo

Este skill convierte cualquier brief SaaS en una pieza editorial. Su poder no está en añadir, sino en **quitar** sistemáticamente: color saturado, sombras, emojis, redondeos, clichés. Lo que queda es tipografía contrastada, hairlines estructurales y pasteles que casi no se ven pero organizan la información. Es el equivalente digital de un buen periódico impreso.
