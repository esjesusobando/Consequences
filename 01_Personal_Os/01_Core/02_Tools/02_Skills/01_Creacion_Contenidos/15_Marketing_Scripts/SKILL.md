---
name: marketing-scripts
description: >
  Scripts de automatización para marketing — generación de contenido,
  distribución, análisis. Herramientas ejecutables del stack de marketing.
  Triggers: marketing script, automatización marketing, distribución contenido,
  generación contenido, ejecutar script, marketing automation, ContentOps.
sota_upgraded: true
---

# Marketing Scripts

> **Level**: Automation — Execution

## Scripts Disponibles

| Script                          | Descripción                                       |
|--------------------------------|--------------------------------------------------|
| `18_Generacion_Contenido.py`    | Generación automatizada de contenido en voz marca |

## Esencia Original
> **Propósito:** Automatizar tareas repetitivas de marketing mediante scripts ejecutables integrados
> **Flujo:** Identificar tarea → Seleccionar script → Ejecutar → Distribuir → Medir

## Propósito

Scripts ejecutables que automatizan tareas repetitivas de marketing. Se integran con los HUBs del sistema (`03_Scripts_Os/`) y pueden ser invocados desde workflows o directamente por el orquestador.

## ⚠️ Gotchas

### Ejecutar script sin verificar entorno
> Lanzar un script de marketing sin verificar que las dependencias y el entorno estén configurados.

- **Por qué**: Los scripts dependen de Python, APIs keys, y rutas del sistema. Un script que falla a mitad de ejecución puede dejar datos inconsistentes o enviar contenido incompleto.
- **Solución**: Siempre verificar `pip list | grep <dependency>` y validar que las variables de entorno (`API_KEY`, `BRAND_VOICE_PATH`, etc.) estén seteadas antes de ejecutar.

### No revisar el output antes de distribución
> Programar distribución automática sin revisar el contenido generado.

- **Por qué**: Un script de generación puede producir contenido con errores, tono incorrecto, o datos sensibles. La automatización no reemplaza el review humano.
- **Solución**: Siempre configurar los scripts en modo "draft/preview" primero. Revisar el output antes de habilitar el modo "publish". Usar el Brand Voice como validador pre-publish.

### Ignorar el logging y monitoreo
> Ejecutar scripts sin logs ni métricas de resultado.

- **Por qué**: Sin logs, cuando un script falla no hay forma de saber dónde. Sin métricas, no se sabe si la automatización está generando valor o ruido.
- **Solución**: Todos los scripts deben tener logging estructurado (`logging.{info,error,warning}`) y reportar métricas mínimas (ej: contenido generado, tasa de éxito, tiempo de ejecución).

## 💾 State Persistence

> **Qué persists**: Scripts ejecutables, configuraciones por plataforma, logs de ejecución, outputs generados.
> **Dónde**: `01_Personal_Os/04_Operations/03_Scripts_Os/`, `assets/`, `output/`.
> **Cuándo restore**: Al retomar una tarea de automatización, restaurar la configuración del script y verificar outputs previos.
> **Formato**: Archivos Python/shell + config YAML + logs estructurados.

### Estado que se preserva entre sesiones:
1. **Scripts disponibles**: Lista de scripts cargados con su descripción y dependencias.
2. **Configuración por plataforma**: API keys, endpoints, brand voice path, templates.
3. **Historial de ejecuciones**: Logs de últimas ejecuciones con timestamps y resultados.
4. **Outputs generados**: Contenido producido, estado de distribución, métricas de performance.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
