---
name: consequences-ai-strong-design-system
description: Sistema de identidad visual para las marcas Consequences y AI Strong. Dos modos visuales: dark cyber (Consequences) y editorial print (AI Strong). Usar cuando se genere cualquier contenido visual, UI, slides, documentos o assets para estas marcas. Triggers: "diseño de marca", "design system", "Consequences", "AI Strong", "identidad visual", "tipografía de marca".
---

# Consequences × AI Strong — Design System

## Dos Modos. Una Arquitectura.

El sistema opera en dos lenguajes visuales distintos que pueden coexistir o alternarse según el canal, soporte y objetivo comunicativo.

---

## Modo 1 — CONSEQUENCES (Digital / Dark Cyber)

**Filosofía:** *Signals Over Shadows*. El color no es estético: es funcional. Halos lumínicos en lugar de sombras difusas. Interfaz de alta densidad informativa para entornos digitales.

### Paleta — Voids & Surfaces

| Token     | Hex       | Uso                                   |
|-----------|-----------|---------------------------------------|
| `void`    | `#04060A` | Fondo más profundo (body)             |
| `night`   | `#0B0F18` | Sidebar, paneles secundarios          |
| `carbon`  | `#131826` | Cards, formularios                    |
| `graphite`| `#1E2435` | Bordes, separadores                   |
| `steel`   | `#2A3148` | Barras de progreso inactivas          |
| `slate`   | `#4A5273` | Texto terciario, labels               |
| `ash`     | `#7A839E` | Texto secundario, body                |
| `bone`    | `#C7CCD8` | Texto principal                       |
| `paper`   | `#ECEEF5` | Texto de alto contraste               |
| `pure`    | `#FFFFFF` | Headlines, énfasis máximo             |

### Paleta — Signals (Acentos Reactivos)

| Signal    | Hex       | Semántica                             |
|-----------|-----------|---------------------------------------|
| Cyan      | `#00F0FF` | CTA, focus, validación, activo        |
| Magenta   | `#FF2E9A` | En vivo, alerta, urgencia             |
| Lime      | `#C6FF3D` | Éxito, handshake OK, futuro           |
| Amber     | `#FFB400` | Warning, on-air, precaución           |

**Regla de acento:** Solo un signal activo por pantalla. El resto permanece inactivo.

### Glow Effects

```css
--glow-cyan:    0 0 8px rgba(0,240,255,0.6), 0 0 24px rgba(0,240,255,0.2);
--glow-magenta: 0 0 8px rgba(255,46,154,0.6), 0 0 24px rgba(255,46,154,0.2);
--glow-lime:    0 0 8px rgba(198,255,61,0.6), 0 0 24px rgba(198,255,61,0.2);
--glow-amber:   0 0 8px rgba(255,180,0,0.6), 0 0 24px rgba(255,180,0,0.2);
```

### Tipografía Digital

| Rol          | Fuente             | Peso | Uso                                    |
|--------------|--------------------|------|----------------------------------------|
| Display / H1 | Space Grotesk      | 700  | Headlines de sección, títulos hero     |
| Body         | Inter Tight        | 400  | Cuerpo de texto, descripciones         |
| Técnico      | JetBrains Mono     | 400–700 | Labels, códigos, eyebrows, timestamps |

**Reglas de tracking:**
- Display: `letter-spacing: -0.03em` (bloque sólido)
- Eyebrows: `letter-spacing: 0.12em` + `text-transform: uppercase`
- Body: tracking neutro

---

## Modo 2 — AI STRONG (Editorial / Print)

**Filosofía:** *El sistema sobre la motivación*. Diseño de alto impacto que fuerza al cerebro a procesar la información en menos de 2 segundos. Contraste extremo. Sin puntos medios.

### Paleta Editorial

| Rol               | Color              | Uso                                              |
|-------------------|--------------------|--------------------------------------------------|
| Negro             | `#0A0A0A`          | Cuerpo, anclaje, control. Nunca un gris oscuro.  |
| Rojo intenso      | `#D92B2B`          | Energía, urgencia, decisión. Solo un uso por pieza. |
| Azul eléctrico    | `#1A3FD4`          | Base sólida. Profundidad, contraste.             |
| Blanco            | `#FFFFFF`          | Espacio de aire. Contrapeso visual.              |
| Gris claro        | `#F0F0F0`          | Respiro entre bloques de impacto.                |

**Dictadura de color:**
- 1 color dominante (Negro o Azul)
- 1 color de acento (Rojo)
- El resto como soporte neutro

**Errores a evitar:**
- ❌ Rojo y Azul con la misma jerarquía visual
- ❌ Todos los colores en el mismo plano de importancia
- ❌ Falta de contraste entre texto y fondo

### Tipografía Editorial

| Rol               | Fuente             | Peso     | Uso                                             |
|-------------------|--------------------|----------|-------------------------------------------------|
| Headline / Display| Anton (≈ Knockout HTF) | 400 | Títulos principales. 2–5 palabras. Mayúsculas. Tracking cerrado. |
| Statement / H2    | DM Sans            | 900 Black | Subtítulos. Contexto sin robar protagonismo.   |
| Body / Detalles   | DM Sans            | 300 Light | Cuerpos, bajadas, detalles editoriales.        |

**Sistema de castas (3 niveles):**
1. **Impacto Brutal (L1):** Anton + tracking cerrado → bloque sólido que se lee como imagen
2. **Anclaje (L2):** DM Sans Black → contexto sin competir con el headline
3. **Refinamiento (L3):** DM Sans Light → elegancia, ritmo, respiro visual

**Regla clave:** Contraste extremo entre pesos. Black vs Light crea tensión visual. No usar pesos medios.

---

## Principios Compartidos

### Escala Métrica 4px

```
s1: 4px   s2: 8px   s3: 12px  s4: 16px
s5: 24px  s6: 32px  s7: 48px  s8: 64px  s9: 96px
```

### Regla de Tensión por Contraste

Ambos sistemas rechazan los puntos medios:
- **Consecuences:** O es un color vibrante (signal) o es un neutro (void/surface)
- **AI Strong:** O es un peso extremo (Black) o es ligero (Light). Nunca Medium.

En ambos casos: la ambigüedad es el enemigo. El contraste proyecta autoridad.

### Jerarquía Visual (Válida en ambos modos)

El ojo procesa la información en este orden:
1. Color de mayor contraste y masa visual → primera captura de atención
2. Segundo elemento de peso (statement / eyebrow) → contexto
3. Cuerpo de texto → profundidad

---

## Cuándo Usar Cada Modo

| Canal / Soporte            | Modo recomendado     |
|----------------------------|----------------------|
| Interfaz digital, app, web | Consequences (Dark)  |
| Podcasts, newsletters digitales | Consequences (Dark) |
| Presentaciones corporativas | AI Strong (Editorial) |
| Pósters, flyers impresos   | AI Strong (Editorial) |
| Social media (IG, LinkedIn) | AI Strong (Editorial) |
| Documentación técnica      | Consequences (Dark)  |
| Thumbnails YouTube         | AI Strong (Editorial) |
| Landing pages              | Ambos (hero editorial, UI dark) |

---

## Errores Globales a Evitar

- ❌ Usar más de 1 color de acento activo simultáneamente
- ❌ Pesos tipográficos intermedios sin justificación jerárquica
- ❌ Decoración sin función (no borders por estética, no shadows difusas)
- ❌ Mezclar los dos modos en el mismo plano de comunicación
- ❌ Fondo con color en modo editorial (siempre blanco, negro o azul puro)
- ❌ Más de 3 tamaños de fuente distintos en una misma pieza

---

## Tokens CSS Globales

```css
/* CONSEQUENCES MODE */
:root[data-mode="consequences"] {
  --surface-0: #04060A;
  --surface-1: #0B0F18;
  --surface-2: #131826;
  --border: #1E2435;
  --text-primary: #FFFFFF;
  --text-secondary: #C7CCD8;
  --text-tertiary: #7A839E;
  --accent: #00F0FF; /* dynamic */
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter Tight', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

/* AI STRONG MODE */
:root[data-mode="editorial"] {
  --surface-0: #FFFFFF;
  --surface-1: #F0F0F0;
  --surface-2: #E5E5E5;
  --border: #0A0A0A;
  --text-primary: #0A0A0A;
  --text-secondary: #1A3FD4;
  --text-tertiary: #D92B2B;
  --accent: #D92B2B; /* rojo de acento */
  --font-display: 'Anton', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## Referencia Rápida

Para aplicar el sistema correctamente en cualquier pieza:

1. **Define el canal** → elige el modo
2. **Define el color dominante** → uno solo, máxima jerarquía
3. **Construye el título** → fuente Display, máximo 5 palabras
4. **Añade el anclaje** → fuente Statement, da contexto
5. **Completa con cuerpo** → fuente Light/Body, ritmo y legibilidad
6. **Aplica acento** → un solo color de señal o rojo, en el punto más importante
7. **Revisa**: ¿hay ambigüedad jerárquica? Si la hay, elimínala.

---

*Consequences × AI Strong — Design System v1.0*
*Jesús Obando — AI Strong Program*
