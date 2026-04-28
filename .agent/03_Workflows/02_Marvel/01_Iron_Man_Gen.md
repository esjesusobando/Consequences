---
name: genesis
description: Workflow de inicio de sesión — carga reglas, memoria y notas de proceso del PersonalOS.
argument-hint: "[opcional: tarea específica del día o contexto a priorizar]"
---

# 🧬 Workflow: Génesis (Iron Man Boot)

Ejecutar al inicio de cada sesión para cargar el contexto completo del sistema: reglas vigentes, memoria de largo plazo y estado actual de tareas.

## Pasos

1. **Leer Reglas de Sesión**:
   - Leer `01_Personal_Os/01_Core/01_Rules/` — revisar cualquier regla con `alwaysApply: true`.

2. **Cargar Memoria de Largo Plazo (AGENTE)**:
   - Ejecutar `engram_mem_context()` con project="Think_Different_AI" para recuperar contexto previo.
   - Leer `01_Personal_Os/04_Operations/00_Context_LLM/00_Context_Memory/` — mapa del sistema actualizado.

3. **Revisar Notas de Proceso (USUARIO)**:
   - Leer los archivos más recientes en `01_Personal_Os/04_Operations/00_Context_LLM/01_Process_Notes/`.
   - Ejecutar `engram_mem_session_summary()` para guardar aprendizajes clave de cada sesión.

4. **Sincronizar Estado de Tareas**:
   - Leer `01_Personal_Os/03_Task/` — identificar tareas `status: s` (en progreso) y `status: b` (bloqueadas).
   - Leer `00_Winter_is_Coming/GOALS.md` para alinear foco del día.

5. **Verificar MCPs disponibles** (opcional):
   - Eagle MCP: disponible para gestión de assets
   - Context7 MCP: disponible para investigación de docs
   - Playwright MCP: disponible para navegación web y screenshots

6. **Resumen de Contexto al Chat**:
   - Reportar en bullet points:
     - Estado actual del proyecto (último commit, cambios recientes).
     - Reglas críticas de esta sesión.
     - Tareas en progreso / bloqueadas inmediatas.
     - Agentes y herramientas disponibles.

// turbo-all
