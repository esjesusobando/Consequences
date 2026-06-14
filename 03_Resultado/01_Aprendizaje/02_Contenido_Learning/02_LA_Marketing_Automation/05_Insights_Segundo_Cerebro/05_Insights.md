# Insights — Marketing Automation con Claude Code

## 1. Review Gate Pattern (Alta prioridad)
**Insight:** Nunca publicar contenido sin que un agente revisor dedicado lo evalúe contra la brand voice.
- El revisor devuelve `aprobado_global: true/false` como JSON estructurado
- Si falla, el pipeline se detiene y muestra qué piezas no pasaron
- Esto evita contenido fuera de tono, errores de datos, o alucinaciones publicadas
- **Aplicar a:** Cualquier pipeline que genere contenido público

## 2. Brand Voice como Single Source of Truth
**Insight:** Un solo archivo `brand_voice.md` contiene toda la voz de marca.
- Todos los agentes lo leen antes de redactar
- Se actualiza manualmente con ejemplos reales que funcionan
- Más confiable que la memoria del agente (evita mezclar contextos)
- **Aplicar a:** Skills de contenido existentes (content-creation, social-content)

## 3. MCP como Herramienta de Agente, No Solo de Chat
**Insight:** En Claude Code, los MCPs se pueden instalar como herramientas que los agentes usan directamente.
- El agente `publicador` tiene acceso al MCP de Metricool
- El agente `carrusel-designer` tiene acceso al MCP de Higgsfield
- Esto permite que el agente ejecute acciones sin intervención humana
- **Patrón:** tool-attachment via .claude/agents/ → referencia al MCP

## 4. Pipeline Orchestration via Skills
**Insight:** Las skills en `.claude/skills/` actúan como orquestadores de pipelines multi-agente.
- La skill `publica-esto` secuencia: transcribe → redactor → revisor → publicador
- Cada paso invoca al agente correspondiente y espera su output
- La skill define el flujo, no la lógica — eso es responsabilidad de cada agente
- **Aplicar a:** Skills existentes que necesiten pipelines multi-paso

## 5. Separación de Concerns en Brand Files
**Insight:** `brand_voice.md` (tono/texto) y `brand_design.md` (visual) son archivos separados.
- Cada agente carga solo el contexto que necesita
- El redactor solo lee brand_voice, no necesita diseño
- El carrusel-designer solo lee brand_design, no necesita voz
- **Aplicar a:** Separar brand voice de brand design en skills existentes

## 6. Procesamiento Local para Costos
**Insight:** Whisper corre en local, ahorra tokens de API.
- Transcripción de audios largos (30+ min) sin costo
- El modelo faster-whisper ocupa ~3GB, corre en CPU
- **Aplicar a:** Skills de audio pipeline — mantener whisper como default

## 7. Archivos como Estado Compartido
**Insight:** Cada paso escribe archivos que el siguiente paso lee.
- No hay estado en memoria entre agentes
- Los archivos son el contrato entre pasos del pipeline
- Esto permite debug, re-ejecución parcial, y trazabilidad
- **Aplicar a:** Diseñar pipelines como DAG de archivos, no como flujo de memoria

## 8. Estructura de Proyecto Clara
**Insight:** El proyecto tiene una estructura predecible y documentada.
- `CLAUDE.md` da contexto global
- `.claude/agents/` contiene agentes especializados
- `.claude/skills/` contiene skills orquestadoras
- `brand_voice.md` y `brand_design.md` son configuración viva
- `output/` contiene todo el contenido generado
- **Aplicar a:** Skills del OS — estandarizar convención de carpetas
