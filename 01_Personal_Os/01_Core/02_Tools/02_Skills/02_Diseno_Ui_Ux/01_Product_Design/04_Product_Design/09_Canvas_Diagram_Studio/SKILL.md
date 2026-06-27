---
name: canvas-diagram-studio
description: Crea diagramas visuales premium usando Excalidraw. Triggers on: diagrama, esquema, excalidraw, mindmap, flujo, flowchart, arquitectura, wireframe.
sota_upgraded: true
---

# Canvas Diagram Studio 🎨

## Esencia Original
> **Propósito:** Generar diagramas visuales de alta fidelidad (arquitectura, mind maps, wireframes, esquemas) usando Excalidraw vía MCP.
> **Flujo:** Definir entidades → Esquematizar layout → Refinar estilos → Exportar

## ⚠️ Gotchas (Errores Comunes a Evitar)

- **[ERROR]**: Diagramas sin jerarquía visual
  - **Por qué**: Difícil de leer, no comunica
  - **Solución**: Usar tamaños y colores para destacar importancia

- **[ERROR]**: Too many elements
  - **Por qué**: Overwhelms al viewer
  - **Solución**: Max 7-10 elementos por diagrama, agrupar relacionados

- **[ERROR]**: Colores inconsistentes con PersonalOS
  - **Por qué**: Se ve amateur, pierde coherencia
  - **Solución**: Usar HSL values del sistema de diseño

- **[ERROR]**: No exportar en formato útil
  - **Por qué**: Usuario no puede usar el diagrama
  - **Solución**: Exportar PNG + SVG, guardar .excalidraw source

## 📁 Progressive Disclosure

> Para información detallada:
- [references/diagram-types.md](references/diagram-types.md) — Tipos de diagramas
- [references/excalidraw-tips.md](references/excalidraw-tips.md) — Tips de Excalidraw

## 🛠️ Scripts

- [scripts/create-diagram.py](scripts/create-diagram.py) — Genera estructura de diagrama

## 💾 State Persistence

Guardar diagramas en:
- `04_Docs/diagrams/YYYY-MM-DD-<name>.excalidraw`
- Exportar PNG a `04_Docs/diagrams/exports/`

Esta Skill permite la generación y gestión de diagramas visuales premium utilizando el motor de **Excalidraw** vía MCP. Enfocada en la claridad conceptual y estética "sketch" de alta fidelidad.

## 🛠️ Triggers y Uso
- **Diagramas de Arquitectura**: Visualización de componentes y flujos de datos.
- **Mapas Mentales**: Estructuración de ideas y brainstorming visual.
- **Wireframes Rápidos**: Prototipado de interfaces con estética minimalista.
- **Esquemas Conceptuales**: Explicación de lógica compleja mediante formas y flechas.

## ⚙️ Integración MCP
La Skill utiliza el servidor `excalidraw-yctimlin`.
- **Vault Path**: `C:\Users\sebas\Documents\Diagramas Excalidraw`
- **Operaciones**: Creación de archivos `.excalidraw`, inserción de elementos, y exportación (si el MCP lo permite).

## 🚀 Workflow Elite
1. **Definición**: Identificar las entidades y relaciones clave del concepto.
2. **Esquematización**: Utilizar el MCP para generar el layout base.
3. **Refinamiento**: Ajustar colores (HSL) y estilos para mantener el estándar PersonalOS.
4. **Exportación**: Entregar el asset visual al usuario.

---
*"Un buen diagrama ahorra mil líneas de documentación."*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
