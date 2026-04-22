# Seedance 2.0 — Webinar Freepik "Reach cinematic quality with Seedance 2.0"

> **Fecha:** 2026-04-13  
> **Fuente:** Freepik Webinar (YouTube Live)  
> **Duración:** 53:54  
> **Ponentes:** Jesús Terrada (Creative Strategist), Sofía López (Head of Social)  
> **Etiquetas:** #AIvideo #Seedance2 #Freepik #ByteDance #VideoGeneration #Multimodal

---

## 📌 Resumen Ejecutivo

Seedance 2.0 es el nuevo modelo de generación de video por IA de **ByteDance** (lanzado el 10 de febrero de 2026), que integra texto, imágenes, video y audio en un único pipeline. El webinar muestra workflows y prompting tips para crear videos cinematográficos.

---

## 🔑 Características Principales de Seedance 2.0

### 1. Sistema Multi-Referencia Multimodal
La feature más poderosa: permite subir hasta **12 archivos de referencia** (imágenes, videos, audio) y describir exactamente cómo cada uno debe influir en el output usando lenguaje natural con sintaxis `@`.

**Tipos de referencias:**
- `@Image` — Definir apariencia de personajes, escenarios, objetos
- `@Video` — Replicar movimiento de cámara, coreografía, timing
- `@Audio` — Definir tempo, ambiente, música de fondo
- `@Style` — Aplicar estilos visuales específicos

### 2. Multi-Shot Storytelling
No más clips aislados. El modelo puede:
- Dividir un concepto en múltiples tomas conectadas
- Determinar el framing y comportamiento de cámara para cada segmento
- Ensamblar con transiciones suaves
- Mantener consistencia de personajes y estilo a través de las tomas

### 3. Consistencia de Personajes
- Uso de imágenes de referencia combinadas con start/end frames
- Lock de composición y detalles del personaje
- Consistencia a través de tomas completamente diferentes y ángulos distintos

### 4. Control de Cámara Preciso
- Rotar un rostro, hacer pan desde un auto, orbitar alrededor de un producto
- Usar video referencias para replicar lenguaje de cámara complejo
- Simulación de movimientos cinematográficos (tracking shots, crane movements, handheld feel)

### 5. Audio Nativo Integrado
- El audio ya no es una capa separada
- Genera sonido sincronizado junto con el video
- Incluye diálogos, sound effects, música — todo en sync
- Lip-syncing en 8+ idiomas

### 6. Calidad Cinematográfica
- **1080p** (1920x1088) resolución nativa
- Up to **15 segundos** de duración continua
- Multiple aspect ratios
- Higher frame rates para motion más fluido

---

## 🧠 Anatomía del Prompt en Seedance 2.0

### Modo 1: First/Last Frame (Simple)
Cuando usás una imagen como referencia start/end:
```
[Start frame description] + [video prompt describing the action]
```

### Modo 2: Omni-Reference (Avanzado)
Para combinaciones multimodales:
1. **Vibe & Universe** — Definir lighting, pacing, camera movements, SFX, voiceover
2. **References** — Referenciar subjects: characters, settings, objects, movement references
3. **Shots** — Definir múltiples tomas

**Estructura:**
```
@Image1 as character appearance, @Video1 for camera movement, 
use @Audio1 for background music, [add additional description]
```

---

## 🔄 Flujo de Trabajo Demo del Webinar

```
Storyboard Tool → 15-second video → Full trailer
```

El proceso mostrado:
1. Definir el concepto completo (trailer de película fantasy)
2. Usar el storyboard tool para planificar tomas
3. Un solo prompt para múltiples shots
4. Output: trailer entero desde un solo prompt

---

## 📊 Comparación con Versión Anterior (Seedance 1.5)

| Aspecto          | 1.5                                      | 2.0                                                |
|------------------|------------------------------------------|----------------------------------------------------|
| **Motion**       | Movimientos podían verse artificiales    | Motion físicamente realista de alto rango dinámico |
| **Consistencia** | Inestable en escenas complejas           | Temporalmente consistente, sin jitter              |
| **Cámara**       | Pans y zooms básicos, ejecución mecánica | Movimientos cinematográficos intencionales         |
| **Luz**          | handling básico                          | Reflexiones, luz direccional, mood realista        |
| **Audio**        | Generado por separado                    | Nativo y sincronizado                              |

---

## 💡 Insights Clave del Webinar

1. **"No solo anima imágenes"** — Seedance 2.0 *entiende* las imágenes y referencias. Puede construir un mundo entero desde una sola imagen prompting.

2. **Prompting es diferente según el modo** — En omni-reference podés ser "poético" porque el modelo es extremadamente smart.

3. **El modelo es el "killer"** — La combinación de multi-reference + audio nativo + multi-shot es lo que lo diferencia.

4. **Workflow super corto** — De storyboard a trailer completo en un solo paso.

---

## 🎯 Aplicabilidad para Sistemas como Unicorn

### Analogías:
1. **Multi-reference = Context preservation** — Mantener consistencia similar a cómo mantenemos contexto en conversaciones de agentes
2. **Multi-shot = Multi-step workflows** — De un solo prompt, múltiples acciones coordinadas
3. **Audio sync = Tool calling** — Elementos trabajando en sync como tools llamadas en agentes
4. **4-modal workflow = Pipeline de agentes** — Text, images, video, audio como diferentes "agentes" especializados

### Oportunidades:
- Integrar Seedance como tool de generación de video en el sistema
- Usar el concepto de multi-reference para mantener consistencia en generated content
- El workflow "storyboard → video" es análogo a "PRD → implementation"

---

## 🔗 Recursos

- **Webinar original:** https://www.youtube.com/watch?v=IFLJ3qhljRI
- **Freepik AI Video Generator:** https://www.freepik.com/ai/video-generator
- **Seedance Blog Post:** https://www.freepik.com/blog/seedance-2-0/
- **MotionSeed:** https://seedance-2.video/

---

## 🏷️ Tags

`#seedance2` `#aivideo` `#bytedance` `#freepik` `#cinematic` `#multimodal` `#video generation` `#prompting` `#workflow` `#choreography`

---

*Documentado: 2026-04-14*
