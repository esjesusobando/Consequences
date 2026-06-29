---
name: content-transformer
description: "Transforma material bruto en piezas reutilizables para múltiples canales antes de producción final. Triggers on: content transformation, repurposing content, multi-channel adaptation, content remixing, raw-to-structured content"
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

# Content Transformer

> Transforma contenido raw en contenido estructurado para múltiples canales.

## Esencia Original

- **Metaskill**: Transformar materia prima desordenada (notas, research, entrevistas) en piezas de contenido pulidas y listas para múltiples canales, operando como un adaptador universal entre ideas crudas y formatos de publicación.
- **Propósito original**: Eliminar el cuello de botella de crear contenido desde cero para cada canal, permitiendo que un solo esfuerzo de investigación se multiplique en 5+ piezas publicables sin perder calidad ni coherencia.

## Propósito

Toma contenido bruto (notas, artículos, research, entrevistas) y lo transforma en contenido estructurado y optimizado para diferentes plataformas y formatos.

## Cuándo Usar

- Cuando tienes materia prima (notas, research, artículos) y necesitas transformarla
- Para repurposing de contenido existente
- Antes de enviar a otros agentes especializados

## Input

- **Content raw**: Texto, notas, research, o documento
- **Canal objetivo**: LinkedIn, Twitter, Blog, Email, YouTube
- **Tono**: Profesional, casual, educativo, viral

## Proceso

1. **Analizar** el contenido raw → extraer puntos clave
2. **Estructurar** según el canal objetivo
3. **Adaptar** tono y formato
4. **Optimizar** para engagement del canal

## Output

```markdown
## [Título optimizado para el canal]

[Párrafo de apertura - hook]

[Contenido principal estructurado]

[CTA si aplica]

---
Tags: #[tema] ##[subtema]
```

## Ejemplo

**Input:** Notas de una reunión sobre "AI en Marketing"
**Output:** Post de LinkedIn + Tweet thread + Newsletter summary

---

## ⚠️ Gotchas

1. **Pérdida de contexto al transformar formatos**
   - **Por qué**: Al convertir un artículo largo a un hilo de Twitter, los matices y la profundidad se pierden fácilmente, resultando en contenido superficial que no aporta valor diferencial.
   - **Solución**: Incluir siempre una sección de "Contexto irrenunciable" en el brief original que el transformer debe preservar sin importar el formato de salida.

2. **Tono inconsistente entre canales**
   - **Por qué**: El mismo contenido transformado a LinkedIn vs TikTok puede sonar como si vinieran de marcas diferentes si no hay reglas de tono explícitas por plataforma.
   - **Solución**: Exigir que el input incluya "Voice Rules" por canal antes de transformar, o usar la skill Brand Voice Guardian como prevalidación.

3. **Estructura genérica sin adaptación real al canal**
   - **Por qué**: El transformer puede caer en la trampa de aplicar la misma plantilla (hook → body → CTA) a todos los canales, ignorando que cada plataforma tiene convenciones únicas de formato y engagement.
   - **Solución**: Mantener un mapa actualizado de "Patterns por plataforma" (LinkedIn = story + insight, Twitter = hot take + thread, etc.) y aplicarlo explícitamente en cada transformación.

## 💾 State Persistence

Esta skill no mantiene estado entre invocaciones. Cada transformación es stateless: recibe input raw + parámetros de canal y produce output estructurado. Para flujos multi-pieza, el orquestador debe gestionar el estado del brief original y las piezas generadas.

---

*Agent 13 de Marketing Team*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
