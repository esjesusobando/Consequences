# Anti-cliche IA: frontend con buen gusto

> Demo de la skill `design-taste-frontend`: un Ingeniero Senior de UI/UX que anula los sesgos por defecto de los LLMs y construye interfaces premium.

---

## 1. El problema: los LLMs tienen mal gusto (por defecto)

Los modelos de lenguaje fueron entrenados con millones de tutoriales de "landing page SaaS 2021" y han colapsado en un promedio visual aburrido. Sin una skill que los frene, producen este molde repetido:

### Sesgos que la skill anula

| Sesgo LLM por defecto                                              | Por que es malo                                                    | Lo que impone la skill                                                                               |
|--------------------------------------------------------------------|--------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| Degradado **lila / purpura neon**                                  | Grito universal de "hecho por IA", satura el mercado               | Neutros puros (Zinc/Slate) + 1 acento unico (Esmeralda / Azul Electrico / Rosa Oscuro)               |
| Tipografia **Inter** en todo                                       | Se ve a sistema, no a producto con personalidad                    | `Geist`, `Outfit`, `Cabinet Grotesk`, `Satoshi`                                                      |
| **Cards genericas** con `shadow-md` en grid                        | Visualmente plano, sin jerarquia, sin autor                        | Separacion por espaciado y `border-t` sutiles                                                        |
| **Contenido centrado** (hero 50% ancho, text-center)               | Sesgo de simetria perfecta, denota pereza                          | Splits asimetricos 50/50, alineacion a izquierda, diseno editorial                                   |
| `h-screen` en mobile                                               | Parpadeos por la barra del navegador                               | `min-h-[100dvh]`                                                                                     |
| Emojis en UI "pro"                                                 | Rompe la coherencia visual                                         | Iconos vectoriales de Lucide o Phosphor                                                              |
| Nombres plantilla (`John Doe`, `Acme Inc`)                         | Se ve a demo, no a producto                                        | `Olivia Sterling`, `Nexus Logistics`                                                                 |
| Copy cliche (`unleash`, `next-gen`, `revolutionary`)               | Ruido puro, cero informacion                                       | Verbos concretos, numeros reales                                                                     |

---

## 2. Configuracion base activa

La skill carga con estos tres valores fijos. No se editan en archivo, se adaptan por chat.

```
DESIGN_VARIANCE  [========--]  8/10    (1=simetria perfecta, 10=caos artistico)
MOTION_INTENSITY [======----]  6/10    (1=estatico, 10=cinematografico)
VISUAL_DENSITY   [====------]  4/10    (1=galeria de arte, 10=panel de avion)
```

**Traduccion practica:**
- Variance 8: el layout rompe grillas obvias, hay asimetria intencional.
- Motion 6: hay micro-interacciones Spring (Framer Motion), no estatico pero sin marear.
- Density 4: respira. Pocos elementos por zona, tipografia grande, whitespace generoso.

> Cambio dinamico: si el usuario pide "dashboard denso tipo Bloomberg", la skill sube `VISUAL_DENSITY` a 8-9 en esa conversacion sin modificar el archivo.

---

## 3. Ejemplo 1 — Landing IA

### ANTES (lo que un LLM escupe sin skill)

```tsx
// Hero generico con todos los sesgos activos
export default function HeroMalo() {
  return (
    <section className="h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-violet-700 flex items-center justify-center">
      <div className="text-center font-[Inter] max-w-2xl mx-auto px-4">
        <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-4 py-1 mb-6 text-white">
          AI-Powered
        </div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Unleash Next-Gen Intelligence
        </h1>
        <p className="text-white/80 mb-8">
          Revolutionary AI that transforms your workflow with cutting-edge technology.
        </p>
        <button className="bg-white text-purple-700 rounded-full px-8 py-3 shadow-xl">
          Get Started
        </button>
      </div>
    </section>
  );
}
```

Problemas: degradado lila, Inter, centrado total, `h-screen`, copy vacio, boton pill con sombra xl, badge de glass generico.

### DESPUES (con la skill activa)

```tsx
// app/page.tsx — Server Component
import { ArrowUpRight } from "lucide-react";

export default function HeroTaste() {
  return (
    <section className="min-h-[100dvh] bg-zinc-950 text-zinc-100 font-[Geist] [will-change:transform]">
      <div className="grid grid-cols-12 gap-6 px-8 pt-24 pb-12 max-w-[1400px]">
        {/* Columna izquierda: 7/12, contenido alineado a la izquierda */}
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-zinc-500 mb-10">
            <span className="h-px w-8 bg-emerald-400" />
            Registro 024 — Indexacion semantica
          </div>
          <h1 className="text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-tight font-medium">
            Clasifica 840k documentos legales
            <span className="text-emerald-400"> en 11 minutos</span>.
          </h1>
          <p className="mt-8 text-zinc-400 text-lg max-w-xl">
            Nexus Logistics redujo revision manual de contratos de 14 dias a una tarde.
            Sin prompts. Sin fine-tuning.
          </p>
          <div className="mt-12 flex items-center gap-6">
            <button className="group inline-flex items-center gap-2 bg-emerald-400 text-zinc-950 px-6 py-3 font-medium transition-transform active:scale-[0.98]">
              Ver el caso completo
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <span className="text-sm text-zinc-500">Onboarding en 40 minutos</span>
          </div>
        </div>

        {/* Columna derecha: 5/12, sube 200px — asimetria vertical */}
        <aside className="col-span-12 lg:col-span-5 lg:-mt-8 border-t border-zinc-800 pt-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6">
            <div>
              <div className="text-5xl font-medium tracking-tight">11m</div>
              <div className="mt-1 text-xs text-zinc-500 uppercase tracking-widest">Tiempo p95</div>
            </div>
            <div>
              <div className="text-5xl font-medium tracking-tight">99.4<span className="text-zinc-600">%</span></div>
              <div className="mt-1 text-xs text-zinc-500 uppercase tracking-widest">Precision sample</div>
            </div>
            <div className="col-span-2 pt-10 border-t border-zinc-800 text-sm text-zinc-400">
              "Nos devolvio un trimestre entero al equipo legal." — Olivia Sterling, General Counsel
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
```

Que cambio:
- Fondo `bg-zinc-950` (neutro puro), un unico acento `emerald-400`.
- `font-[Geist]`, no Inter.
- Grid 12 columnas con split 7/5 (asimetrico). Columna derecha empuja `-mt-8` para romper la linea base.
- Copy concreto: `840k documentos`, `11 minutos`, `Nexus Logistics`, `Olivia Sterling`.
- `min-h-[100dvh]`, `[will-change:transform]` para aceleracion hardware.
- Boton sin `rounded-full`, sin `shadow`, con `active:scale-[0.98]` (microanimacion).

---

## 4. Ejemplo 2 — Dashboard editorial vs. cards clones

### ANTES: grid de cards clonadas

```tsx
// Seis cards identicas, cero jerarquia
const stats = [
  { label: "Revenue", value: "$24,532" },
  { label: "Users",   value: "1,240"   },
  { label: "Churn",   value: "2.3%"    },
  { label: "MRR",     value: "$8,120"  },
  { label: "LTV",     value: "$1,430"  },
  { label: "NPS",     value: "62"      },
];

export function DashMalo() {
  return (
    <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 font-[Inter]">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-sm text-gray-500">{s.label}</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
```

Problemas: 6 cards identicas con `shadow-lg`, centradas, Inter, cero jerarquia visual — todos los datos se leen como igualmente importantes.

### DESPUES: diseno editorial diverso

```tsx
// app/dashboard/page.tsx
import { TrendingUp, TrendingDown } from "lucide-react";

export function DashTaste() {
  return (
    <div className="min-h-[100dvh] bg-zinc-50 font-[Outfit] px-10 py-12">
      <header className="flex items-baseline justify-between border-b border-zinc-200 pb-6">
        <h1 className="text-2xl tracking-tight text-zinc-900">Abril 2026 — semana 16</h1>
        <span className="text-xs uppercase tracking-widest text-zinc-500">Actualizado hace 2 min</span>
      </header>

      {/* Bento asimetrico 12 cols */}
      <div className="mt-10 grid grid-cols-12 gap-10">

        {/* Metrica estrella: ocupa 7 columnas, sin borde, pura tipografia */}
        <section className="col-span-12 lg:col-span-7">
          <div className="text-xs uppercase tracking-widest text-zinc-500">MRR consolidado</div>
          <div className="mt-3 text-[7rem] leading-none font-medium tracking-tight text-zinc-900">
            $8,120
          </div>
          <div className="mt-4 inline-flex items-center gap-2 text-emerald-600 text-sm">
            <TrendingUp className="h-4 w-4" />
            +18.4% vs marzo — Olivia cerro Nexus Logistics el martes.
          </div>
        </section>

        {/* Columna derecha: stack de 3 filas separadas por border-t, SIN cards */}
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

        {/* Nota editorial: ocupa 8 columnas, alineada a la derecha del grid */}
        <aside className="col-span-12 lg:col-start-5 lg:col-span-8 border-t border-zinc-900 pt-6">
          <p className="text-lg text-zinc-700 leading-relaxed max-w-2xl">
            LTV subio a <span className="text-zinc-900 font-medium">$1,430</span> gracias a
            que el plan Teams retuvo 9 de 10 cuentas nuevas del Q1.
            NPS estable en 62.
          </p>
        </aside>
      </div>
    </div>
  );
}
```

Que cambio:
- Ninguna `shadow`, ninguna card.
- Metrica estrella a 7rem de altura domina el layout — hay jerarquia real.
- Separacion por `border-t` y espaciado, no por contenedores.
- Grid 12 cols con offsets (`lg:col-start-5`) — asimetria.
- Copy con nombres reales: `Olivia cerro Nexus Logistics`.
- Un unico acento `emerald-600` (positivo) y `rose-500` solo para negativo.

---

## 5. Ejemplo 3 — Copy cliche vs. copy llano

### ANTES

```
Headline:  Unleash the Next-Generation AI Revolution
Subhead:   Transform your business with cutting-edge, state-of-the-art
           technology that empowers teams to achieve unparalleled results.
CTA:       Get Started Today
Badge:     AI-Powered. Enterprise-Ready. Best-in-Class.
```

Problemas: 0 informacion, 100% marketing vacio. El lector no sabe que hace el producto.

### DESPUES (con la skill)

```
Headline:  Clasifica 840k documentos legales en 11 minutos.
Subhead:   Nexus Logistics redujo revision manual de contratos de 14 dias
           a una tarde. Sin prompts. Sin fine-tuning.
CTA:       Ver el caso completo -> / Probar con 50 docs gratis
Badge:     Registro 024 — Indexacion semantica
```

Reglas de copy que la skill aplica:
1. **Un numero concreto en el headline** (840k, 11 min).
2. **Un cliente real con nombre** (Nexus Logistics, Olivia Sterling).
3. **Antes/despues cuantificado** (14 dias -> una tarde).
4. **Prohibicion de buzzwords**: `unleash`, `next-gen`, `revolutionary`, `cutting-edge`, `state-of-the-art`, `empower`, `unparalleled`, `seamless`, `robust`.
5. **CTA verbal concreto** ("Ver el caso", "Probar con 50 docs"), no "Get Started".

---

## 6. Snippets de Tailwind — clases correctas vs. incorrectas

```diff
- <div className="h-screen bg-gradient-to-br from-purple-500 to-pink-500">
+ <div className="min-h-[100dvh] bg-zinc-950 [will-change:transform]">

- <h1 className="font-[Inter] text-center text-5xl">
+ <h1 className="font-[Geist] text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-tight">

- <div className="bg-white rounded-2xl shadow-xl p-6">
+ <section className="border-t border-zinc-200 pt-6">

- <button className="bg-purple-600 rounded-full px-8 py-3 shadow-lg">
+ <button className="bg-emerald-400 text-zinc-950 px-6 py-3 transition-transform active:scale-[0.98]">

- <div className="backdrop-blur-md bg-white/20 rounded-xl">
+ <div className="backdrop-blur-xl bg-white/5 border border-white/10">

- <div className="grid grid-cols-3 gap-4">   {/* simetrico aburrido */}
+ <div className="grid grid-cols-12 gap-6">  {/* luego col-span-7 + col-span-5 */}
```

Paleta permitida:

```css
/* Neutros base — elegir UNO */
bg-zinc-950   text-zinc-100   border-zinc-800   /* dark */
bg-zinc-50    text-zinc-900   border-zinc-200   /* light */
bg-slate-950  text-slate-100  border-slate-800  /* dark alt */

/* Acento — elegir UNO (nunca mezclar) */
emerald-400   /* tech, fintech, legal */
sky-500       /* SaaS B2B, productividad */
rose-600      /* creativo, editorial, media */

/* PROHIBIDOS por defecto */
purple-*  violet-*  fuchsia-*  indigo-*
```

---

## 7. Referencia viva

Ver el HTML completo de referencia (SaaS renderizado con todas las reglas aplicadas):

`/Users/agustinmedina/Claude/taste-skill/demo_saas.html`

Abrirlo en el navegador muestra Geist + Zinc + Esmeralda + grid 12 cols asimetrico + micro-animaciones Spring. Es la "piedra de Rosetta" visual de la skill.

---

## 8. Caso de uso estrella

**Helios Analytics** (SaaS de observabilidad B2B, seed stage) hizo rebrand completo con esta skill.

| Metrica                                   | Antes (Inter + lila + cards)               | Despues (Geist + Zinc/Esmeralda + editorial)               |
|-------------------------------------------|--------------------------------------------|------------------------------------------------------------|
| Conversion landing -> trial               | **1.2%**                                   | **3.8%**                                                   |
| Tiempo medio en pagina                    | 41s                                        | 1m 54s                                                     |
| Bounce rate                               | 68%                                        | 39%                                                        |
| CAC blended                               | $412                                       | $147                                                       |

Que hicieron, en orden:
1. Borraron todos los `shadow-*` del design system.
2. Cambiaron `font-sans` (Inter) por `font-[Geist]` como default en `tailwind.config.ts`.
3. Rompieron cada grid simetrico en split 7/5 o 8/4.
4. Reescribieron los 14 headlines con la regla "numero + cliente + antes/despues".
5. Eliminaron el degradado lila del logo. Lo reemplazaron por tipografia Geist Medium en zinc-950 con un punto esmeralda.

Resultado: el deck de Series A cerro en 6 semanas. El lead VC dijo literalmente "parece un producto de 2027, no de 2021".

---

## 9. Markdown para video (guion 60s)

```
[00:00-00:05]   CUT. Pantalla partida.
                Izquierda: landing lila con "Unleash Next-Gen AI"
                Derecha: landing zinc + esmeralda, "Clasifica 840k docs en 11 min"
                Voz: "Todo lo que genera un LLM sin skill se ve igual.
                      Este es el problema."

[00:05-00:15]   ZOOM a la pared de 20 landings IA identicas en lila.
                Voz: "Purpura. Inter. Cards con sombra. Texto centrado.
                      Buzzwords vacios. Un molde repetido en todo internet."

[00:15-00:25]   CORTE a terminal. Aparece:
                $ claude skill design-taste-frontend
                > DESIGN_VARIANCE=8  MOTION_INTENSITY=6  VISUAL_DENSITY=4
                Voz: "La skill design-taste-frontend anula esos sesgos por default."

[00:25-00:40]   TIMELAPSE del refactor en VSCode. Se ve:
                - font-[Inter]    ->  font-[Geist]
                - bg-purple-600   ->  bg-zinc-950
                - h-screen        ->  min-h-[100dvh]
                - shadow-xl       ->  border-t border-zinc-200
                - text-center     ->  col-span-7 (asimetrico)

[00:40-00:52]   CIERRE: el producto Helios Analytics en pantalla completa.
                Overlay de numeros animandose con Spring (stiffness 100, damping 20):
                1.2%  ->  3.8% conversion
                Voz: "Helios paso de 1.2 a 3.8 por ciento de conversion.
                      Mismo producto. Otro gusto."

[00:52-00:60]   LOGO END CARD.
                Texto unico en Geist Medium sobre zinc-950:
                "Frontend con buen gusto. design-taste-frontend."
                Punto esmeralda al final.
```

---

## 10. Comando para invocar

```bash
# Cualquier pedido de UI dispara la skill
"Armame un pricing page para Helios Analytics"
# Internamente aplica: Geist + zinc/slate + 1 acento + asimetria + border-t
# Nunca lila. Nunca Inter. Nunca text-center por default.
```

> La skill no pregunta. Aplica las 6 reglas directo y justifica en comentarios del codigo cuando rompe una intencionalmente.
