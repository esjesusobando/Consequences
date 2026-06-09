---
description: Pipeline de generación de imágenes con consistencia de personajes usando Magnific AI. Cuatro métodos para lograr visuales consistentes en personajes realistas, animados y productos.
trigger: "magnific", "generar imagen", "consistencia personaje", "character consistency", "reframe variations", "hoja personaje", "ficha cinematica", "upscale imagen", "ia image generation"
agent: Marketing Tech
category: content-creation
subcategory: image-generation
tags: [magnific, image-generation, character-consistency, ai, mcp, reframe, variations, character-sheet, cinematic-card]
version: 1.0.0
created: 2026-06-09
owner: Sebas / Gentleman Programming
status: active
---

# 🖼️ Magnific Image Pipeline

Pipeline de generación de imágenes con consistencia de personajes usando Magnific AI. Incluye 4 métodos probados para lograr visuales consistentes en cualquier estilo.

---

## Arquitectura

```
[REFERENCIA] → Magnific MCP
                    ↓
    ┌─────────────────────────────────────┐
    │  MÉTODO 1: Variations (Reframe)      │
    │  → 18 ángulos del mismo personaje   │
    └─────────────────────────────────────┘
                    ↓
    ┌─────────────────────────────────────┐
    │  MÉTODO 2: Character Exploration   │
    │  → Hoja de desarrollo completo     │
    └─────────────────────────────────────┘
                    ↓
    ┌─────────────────────────────────────┐
    │  MÉTODO 3: AI Prompt List          │
    │  → Generación automatizada prompts │
    └─────────────────────────────────────┘
                    ↓
    ┌─────────────────────────────────────┐
    │  MÉTODO 4: Ficha Cinematográfica    │
    │  → Biblia visual completa          │
    └─────────────────────────────────────┘
                    ↓
              [OUTPUT]
    → LinkedIn posts
    → Carousel Instagram
    → Contenido audio pipeline
```

---

## Herramientas

| Herramienta | Uso | Config |
|---|---|---|
| **Magnific MCP** | Generación imágenes AI | OAuth `https://mcp.magnific.com` |
| **Reframe Variations** | 18 ángulos rápidos | Sin prompt escrito |
| **Character Exploration** | Hoja de desarrollo | Prompt específico |
| **AI Prompt List** | Generación prompts | Asistente Magnific |
| **Ficha Cinematográfica** | Biblia completa | GPT Image 2.0 |

---

## Los 4 Métodos de Consistencia

### MÉTODO 1: Variations (Reframe)

**Para qué sirve:** Sacar hasta 18 ángulos distintos del mismo personaje en dos clicks. Es la forma más rápida de conseguir una biblioteca de imágenes consistentes.

**Proceso:**
1. Sube o genera tu imagen base del personaje
2. Dale click a **Reframe → Variations**
3. Selecciona los ángulos que necesitas
4. Marca **Split Image** para que te los separe en lista
5. Genera en **2K** para mejor calidad

**Protip:** Saca primero los 9 primeros ángulos, luego los 9 restantes. Así tienes todos y eliges los que funcionan mejor para tu pieza final.

```
╔══════════════════════════════════════════════════════════╗
║  WORKFLOW: Reframe Variations                             ║
╠══════════════════════════════════════════════════════════╣
║  1. Upload reference image                               ║
║  2. /mcp magnific tools_show → seleccionar Reframe       ║
║  3. Seleccionar Variations                               ║
║  4. Marcar Split Image ON                                ║
║  5. Generar 2K                                           ║
║  6. /mcp magnific creations_search para ver resultados  ║
╚══════════════════════════════════════════════════════════╝
```

---

### MÉTODO 2: Character Exploration Sheet

**Para qué sirve:** Crear una hoja de desarrollo del personaje con cuerpo entero y primeros planos. Ideal para tener todas las referencias visuales reunidas en una sola pieza.

**Prompt:**
```
Hoja de desarrollo del personaje [nombre del personaje].
Muestra imágenes de cuerpo entero y primeros planos
del personaje sobre un fondo de color neutro.
Mantén la coherencia [realista / animada / estilo cartoon]
del personaje al 100%.
```

**Clave:** El fondo neutro es crítico para que la IA no invente contexto y se enfoque solo en el personaje.

---

### MÉTODO 3: AI Prompt List

**Para qué sirve:** En lugar de escribir un prompt por cada imagen, le pides al asistente que los genere todos por ti. El resultado: una lista de prompts individuales que Magnific ejecuta de golpe.

**Importante:** Cambia el modo de exportación de "texto" a "lista" antes de darle generar. Así Magnific crea cada prompt como un nodo independiente y los ejecuta todos a la vez.

**Prompt para el Asistente:**
```
Ayúdame a generar una lista de prompts para crear
diferentes imágenes de mi personaje.
Dame un prompt individual para cada una de estas tomas:
— Imagen de lado derecho del personaje
— Imagen de lado izquierdo del personaje
— Imagen de espaldas del personaje
— El personaje con [tipo de ropa alternativa]
— El personaje con otra ropa del mismo estilo
— Primer plano con expresión feliz
— Primer plano con expresión triste
— Primer plano con expresión asombrada
— Primer plano con expresión risueña
— El personaje en una pose divertida
— El personaje sosteniendo [objeto o producto]
Genera un prompt para cada toma basándote en la
referencia visual conectada. Siempre fondo blanco
y manteniendo la consistencia del personaje al 100%.
No inventes nada que no esté en la referencia.
```

---

### MÉTODO 4: Ficha Cinematográfica Premium

**Para qué sirve:** El método más completo. Genera una ficha profesional con turnaround, expresiones, vestuario, perfil psicológico y paleta de color. Ideal para proyectos que necesitan consistencia total entre muchas piezas.

**Nota:** Usa GPT Image 2.0 para este método. Es el que mejor resultado da para fichas tan complejas.

**Prompt:**
```
Crea una ficha de personaje cinematográfica premium
basada en la imagen de referencia.
Debe parecer una hoja de diseño de personaje de estudio
de animación de alto presupuesto, similar a una
biblia visual de producción.
Nombre del personaje: [nombre]
Edad aproximada: [edad]
Estilo visual: [realismo estilizado / cartoon / 3D]
Incluye estas secciones:
— Título con nombre del personaje y datos básicos:
  alias, edad, altura, constitución y estilo étnico
— Retrato principal con pose carismática
— Turnaround completo: frontal, 3/4 frontal, lateral,
  espalda y 3/4 trasera. Rostro, proporciones, peinado,
  ropa y accesorios idénticos en todos los ángulos
— Head study con 6 expresiones: frontal neutro,
  3/4 natural, perfil, mirando abajo, mirando arriba
  y ángulo dinámico. Deben sentirse vivas, no posadas
— Perfil psicológico: rasgos principales, conflicto
  interno y línea emocional base
— Desglose de vestuario con acercamientos de prendas,
  calzado y accesorios. Materiales y desgaste realista
— Retrato del personaje en un entorno relacionado
  con su personalidad
— Paleta de color y muestras de materiales
El personaje debe sentirse como un actor animado real.
Nada de simetría artificial. Nada de aspecto plástico.
La identidad visual debe ser totalmente consistente
en todas las vistas.
```

---

## BONUS: Crear Personaje desde Cero

Si todavía no tienes un personaje de partida, usa este prompt para crearlo antes de empezar con los cuatro métodos anteriores:

```
ROL: Director de arte con [X] años de experiencia
en [sector: branding urbano / moda / animación]
CONTEXTO: Personaje ficticio para [tipo de proyecto].
Estética [estilo visual]. Universo visual
[urbano / fantástico / minimalista].
ATRIBUTOS: [género y edad] con actitud [describe].
Ropa estilo [describe]. Elementos alrededor:
[describe]. Paleta: [base + acento].
ANTI-REFERENCIAS: Sin estética [lo que NO quieres].
Sin [cliché 1]. Sin [cliché 2].
TÉCNICO: Formato [9:16 / 16:9 / 1:1].
```

---

## Regla Universal

```
╔══════════════════════════════════════════════════════════╗
║  MENOS CREATIVIDAD. MÁS RESTRICCIONES.                   ║
║                                                          ║
║  La IA no falla por falta de creatividad.                ║
║  Falla por falta de restricciones.                       ║
║  Cuanto más le dices lo que NO quieres,                  ║
║  mejor sale lo que SÍ quieres.                           ║
╚══════════════════════════════════════════════════════════╝
```

---

## Uso con Audio Pipeline

El Magnific skill se integra con el Audio Pipeline para generar visuales automáticamente:

```
[AUDIO] → Whisper → CLAUDE → 3 LinkedIn + 1 Twitter + 1 Newsletter
                                              ↓
                         Magnific (generar imágenes)
                                              ↓
                         Carousel Instagram
                         + Assets LinkedIn
                         + Newsletter header
```

---

## MCP Tools Disponibles

### Cuenta
- `account_balance` — balance actual de créditos
- `project_report` — overview de uso del proyecto

### Creations
- `creations_search` — buscar creaciones por query
- `creations_get` — obtener una creación por ID
- `creations_show` — renderizar inline en clientes soportados
- `creations_wait` — esperar que termine una creación

### Imagen
- `images_generate` — generar imágenes desde texto + referencias
- `images_generate_svg` — generar SVG
- `images_upscale` — upscaler Magnific
- `images_crop` — smart crop
- `images_resize` — resize
- `images_remove_background` — alpha cutout
- `images_models_list` / `images_models_show` — catálogo de modelos

### Video
- `video_generate` — generar video
- `video_models_list` / `video_models_show` — catálogo de modelos video

### Personal References
- `custom_references_create` — entrenar Soul character o style
- `custom_references_list` — listar referencias entrenadas

---

## Configuración MCP

Agregar a `.mcp.json`:

```json
{
  "mcpServers": {
    "magnific": {
      "transport": "streamableHttp",
      "url": "https://mcp.magnific.com"
    }
  }
}
```

La primera conexión abrirá OAuth en el navegador. Una vez aprobado, la sesión se mantiene.

---

## Recursos

- PDF Guía: `02_Playground/11_Zero_Consequences/4 Metodos Consistencia Magnific 2.pdf`
- Magnific MCP Docs: `https://docs.magnific.com/modelcontextprotocol`
- Ficha técnica: `02_Playground/11_Zero_Consequences/IMPLEMENTATION_GUIDE.md`

---

*Sistema activo — Aprende de cada generación y refina los prompts*