---
name: minimal-ii-dashboard
description: Ingeniero de Staff en UI/UX enfocado en la reducción cognitiva y la jerarquía visual extrema. Arquitecto de cuadros de mando financieros (dashboards) que prioriza la legibilidad de datos macro, el uso de tipografía editorial para estados narrativos, y una paleta de colores suiza (minimalista y funcional) con gráficos de precisión clínica.
sota_upgraded: true
---

# Skill Minimal II — Dashboard de Precisión

> Filosofía "document-like UI": la interfaz debe leerse como un documento editorial bien compuesto, no como un panel de control con chispitas. Cada pixel vacío es decisión. Cada hairline de 1px es estructura. La tipografía hace el trabajo que otros delegan al color.

---

## 0. Configuración Base Activa

```
DESIGN_VARIANCE  [==--------]  2/10    (1=simetría perfecta, 10=caos artístico)
MOTION_INTENSITY [=---------]  1/10    (1=estático, 10=cinematográfico)
VISUAL_DENSITY [===-------]  3/10    (1=galería de arte, 10=panel de avión)
```

**Traducción práctica:**
- Variance 2: orden casi absoluto, cuadrículas invisibles
- Motion 1: solo micro-interacciones funcionales al hover, sin animaciones globales
- Density 3: mucho whitespace para enmarcar datos clave

> Cambio dinámico: si el usuario pide "dashboard denso tipo Bloomberg", la skill sube `VISUAL_DENSITY` a 8-9 en esa conversación sin modificar el archivo.

---

## 1. Tres Variantes de Paleta (Usuario Elige)

> **Nota:** El usuario puede elegir una variante. Por defecto se aplica la **Variante A (Editorial Cálida)**. Si el usuario no especifica, preguntar cuál prefiere.

### Variante A: Editorial Cálida (Default) 🍎

| Elemento                                         | Valor                                             | Uso                                                                  |
|-------------------------------------------------|--------------------------------------------------|---------------------------------------------------------------------|
| Bg principal                                     | `#F7F6F3`                                         | crema tibia, base de página                                          |
| Bg alterno                                       | `#FBFBFA`                                         | off-white para secciones contiguas                                   |
| Card/panel                                       | `#FFFFFF`                                         | o `#F9F9F8` para variación                                           |
| Hairline                                         | `#EAEAEA`                                         | la única estructura visible                                          |
| Texto principal                                  | `#111111`                                         | negro apagado, nunca #000                                            |
| Texto sec.                                       | `#6B6B6B`                                         | gris medio templado                                                  |

**Acentos pastel ultra-desaturados:**

| Estado                                       | Fondo                                      | Texto                                       |
|---------------------------------------------|-------------------------------------------|--------------------------------------------|
| Error                                        | `#FDEBEC`                                  | `#D32F2F`                                   |
| Info                                         | `#E1F3FE`                                  | `#1976D2`                                   |
| Éxito                                        | `#EDF3EC`                                  | `#388E3C`                                   |
| Pending                                      | `#FBF3DB`                                  | `#F57C00`                                   |

---

### Variante B: Zinc Frío (SaaS / Framer)

| Elemento                                         | Valor Light                                        | Valor Dark                                         |
|-------------------------------------------------|---------------------------------------------------|---------------------------------------------------|
| Bg principal                                     | `bg-zinc-50`                                       | `bg-zinc-950`                                      |
| Bg alterno                                       | `bg-zinc-100`                                      | `bg-zinc-900`                                      |
| Card/panel                                       | `bg-white`                                         | `bg-zinc-900`                                      |
| Hairline                                         | `border-zinc-200`                                  | `border-zinc-800`                                  |
| Texto principal                                  | `text-zinc-900`                                    | `text-zinc-100`                                    |
| Texto sec.                                       | `text-zinc-500`                                    | `text-zinc-400`                                    |

**Acentos:**

| Estado                                       | Light                                        | Dark                                         |
|---------------------------------------------|---------------------------------------------|---------------------------------------------|
| Éxito                                        | `emerald-500`                                | `emerald-400`                                |
| Error                                        | `rose-500`                                   | `rose-400`                                   |
| Info                                         | `sky-500`                                    | `sky-400`                                    |

---

### Variante C: Apple Pure (Minimalismo Absoluto)

> **Regla especial:** No usar Serif. 100% San Francisco. Solo Serif permitted en **hero/headlines** si el usuario lo pide explícitamente.

| Elemento                                         | Valor Light                                        | Valor Dark                                         |
|-------------------------------------------------|---------------------------------------------------|---------------------------------------------------|
| Bg principal                                     | `#FFFFFF`                                          | `#000000`                                          |
| Bg alterno                                       | `#F5F5F5`                                          | `#0A0A0A`                                          |
| Card/panel                                       | `#FFFFFF`                                          | `#1A1A1A`                                          |
| Hairline                                         | `#E5E5E5`                                          | `#333333`                                          |
| Texto principal                                  | `#000000`                                          | `#FFFFFF`                                          |
| Texto sec.                                       | `#6E6E6E`                                          | `#8E8E8E`                                          |

**Acentos Apple:**

| Estado                                       | Light                                     | Dark                                      |
|---------------------------------------------|------------------------------------------|------------------------------------------|
| Éxito                                        | `#34C759`                                 | `#30D158`                                 |
| Error                                        | `#FF3B30`                                 | `#FF453A`                                 |
| Info                                         | `#007AFF`                                 | `#0A84FF`                                 |

---

## 2. Tipografía por Variante

> La tipografía debe adaptarse a la variante de paleta elegida. Por defecto: **Variante A (Editorial Cálida)**.

### Variante A: Editorial Cálida (Serif + Sans + Mono)

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

### Variante B: Zinc Frío (Sin Serif, solo Geist)

```css
/* Sans — 100% Geist/Satoshi */
font-family: 'Geist Sans', 'Switzer', 'Satoshi', sans-serif;
line-height: 1.5;

/* Mono */
font-family: 'Geist Mono', 'JetBrains Mono', monospace;
```

### Variante C: Apple Pure (100% San Francisco)

> **Regla Apple:** No usar Serif en UI. **Solo usar Serif en headlines/hero** si el usuario lo pide explícitamente.

```css
/* San Francisco — 100% sans, peso variable */
font-family: -apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;
font-weight: 100 900; /* Weight API */

/* Mono — SF Mono */
font-family: 'SF Mono', 'Menlo', monospace;
font-feature-settings: 'ss04' on; /* Tabular nums */
```

> **Nota:** Apple Pure usa exclusivamente una familia tipográfica. La jerarquía se define solo por **peso** (100-900), nunca cambiando de familia.

---

### Ejemplo de contraste editorial (Variante A)

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

## 3. Prohibidos (14 items)

> Esta tabla consolida todos los elementos prohibited. **Variante A (Editorial)** aplica por defecto. Las variantes B y C tienen reglas adicionales.

| #                                  | Categoría                                        | Prohibido                                                                                    | Razón                                                                      | Variante affected                                |
|-----------------------------------|-------------------------------------------------|---------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|-------------------------------------------------|
| 1                                  | Tipografía                                       | Inter, Roboto, Open Sans                                                                     | Identidad SaaS genérica, ya quemadas                                       | A, B                                             |
| 2                                  | Sombras                                          | `shadow-md`, `shadow-lg`, `shadow-xl`                                                        | Ruido visual, estética "bootstrap 2016"                                    | Todas                                            |
| 3                                  | Color de fondo                                   | Hero azul, verde o rojo saturado                                                             | Estampa de plantilla de Webflow                                            | A                                                |
| 4                                  | Gradientes                                       | Neón, glassmorphism fuerte, degradados marca                                                 | Tendencia corto-placista                                                   | Todas                                            |
| 5                                  | Radios                                           | `rounded-full` en cards y contenedores grandes                                               | Lee como "pastilla de farmacia"                                            | A, B                                             |
| 6                                  | Iconografía                                      | Lucide / Feather / Heroicons por defecto                                                     | Demasiado vistos, restan carácter                                          | A                                                |
| 7                                  | Contenido                                        | Emojis, lorem ipsum, "John Doe", "Acme Corp"                                                 | Maqueta sin contexto, descartable                                          | Todas                                            |
| 8                                  | Copywriting                                      | "Eleva", "Impulsa", "Desata", "Game-changer"                                                 | Clichés IA, lenguaje de landing mediocre                                   | Todas                                            |
| 9                                  | Negros                                           | `#000000` puro en texto                                                                      | Corta los ojos, rompe la calidez del lienzo                                | A                                                |
| 10                                 | Frivolar                                         | Sombras proyectadas, degradados, bordes redondeados excesivos                                | UI plana/neo-flat                                                          | B, C                                             |
| 11                                 | Colores vibrantes                                | Botones coloridos, elementos de UI saturados                                                 | Botones deben ser negros o grises neutros                                  | B, C                                             |
| 12                                 | Serif en UI                                      | Cualquier uso de Serif fuera del hero/headlines                                              | Apple Pure no permite Serif                                                | C                                                |
| 13                                 | Decoración                                       | Iconos decorativos, solo wireframe para acciones esenciales                                  | Solo iconos de trazo fino                                                  | B, C                                             |
| 14                                 | Varianza alta                                    | Bordes complejos, backgrounds múltiples                                                      | Orden casi absoluto                                                        | C                                                |

**Regla de oro (Variante A):** nunca más del 5% de la pantalla cubierta por acento. El acento se reserva para un badge, una celda de tabla, una etiqueta. El resto respira en crema.

---

## 4. Directivas de Diseño: Gráficos de Precisión

> El objetivo es una interfaz que parezca un informe impreso de alta calidad, no una aplicación web ruidosa.

### 4.1 Visualización de Datos de Precisión

**Gráficos de Barras:**
- Barras planas, sin bordes, con esquinas cuadradas o apenas redondeadas.
- Usar un solo color oscuro para las barras (negro o gris muy oscuro).
- Fondo de la barra en gris muy claro.
- Eliminar líneas de cuadrícula y ejes innecesarios.

**Gráficos de Línea/Área:**
- Líneas finas y precisas.
- El área bajo la línea debe tener un relleno gris muy claro y plano, sin degradados.
- Usar puntos de datos pequeños y sutiles solo para hitos clave.
- Etiquetas de eje (meses, fechas) en gris claro y fuente pequeña.

### 4.2 Foco en Datos Macro

> Diseñar la interfaz para que los **tres o cuatro números más importantes** (Balance, Ingresos, Egresos) dominen la vista.

- **KPIs masivos:**-los números macro deben tener un tamaño de fuente masivo y un peso medio/negrita para una lectura instantánea.
- Detalles micro (listas de facturas, desglose de nómina) relegar a textos pequeños y secundarios debajo de los KPIs.

### 4.3 UI Patterns Minimalistas

**Botones de Acción Única:**
- Botones principales con fondo negro y texto blanco.
- Tipografía pequeña y peso medio.

**Selectores de Rango Silenciosos:**
- Selectores de tiempo (Hoy, Mes, Año) planos.
- El estado activo se indica simplemente con un fondo gris ligeramente más oscuro, sin bordes ni animaciones.

**Metadatos de Contexto:**
- Información como "Última sincronización" o responsable, colócala en una esquina.
- Fuente muy pequeña y gris claro, para que no distraiga del flujo principal de datos.

---

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

> **Minimal II** es la evolución del minimalismo utilitario con **3 variantes de paleta** para que el usuario elija.

Este skill convierte cualquier brief SaaS en una pieza editorial. Su poder no está en añadir, sino en **quitar** sistemáticamente: color saturado, sombras, emojis, redondeos, clichés.

**Las 3 variantes:**
- **A (Editorial Cálida):** Fondo crema `#F7F6F3`, Serif + Sans + Mono
- **B (Zinc Frío):** Fondo zinc, solo Geist + Mono  
- **C (Apple Pure):** 100% San Francisco, sin Serif

El usuario elige. Por defecto: **Editorial Cálida**.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
