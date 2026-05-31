---
name: pm-agent-orchestrator-legacy
description: >
  Legacy PM Agent Orchestrator - Multi-agent orchestration for Product Management.
  Note: This workflow is now handled by SDD + CE. Kept for reference.
  Triggers: None (deprecated - use SDD workflows instead)
  Status: LEGACY - Archival reference only
license: legacy
metadata:
  author: gentleman-programming
  version: "1.0"
  deprecated_date: 2026-03-29
  replaced_by: sdd-workflow, ce-workflow
---

# PM Agent Orchestrator — LEGACY

> ⚠️ **ESTADO**: DEPRECADO — Archivado como referencia histórica
> **Reemplazado por**: SDD Workflow + Compound Engineering

## Evaluación de la Info

| Aspecto | Calidad | Notas |
|---------|---------|-------|
| Concepto de orquestación multi-agente | ⭐⭐⭐⭐ | válido, ahora implementado en CE |
| Back pressure gates | ⭐⭐⭐⭐ | concepto aún relevante |
| Let it Fail pattern | ⭐⭐⭐⭐ | ahora en Auto-Improvement Engine |
| Git truth | ⭐⭐⭐⭐⭐ | principio fundacional del OS |
| Slash commands (/discovery, /spec, etc) | ⭐⭐⭐ | ahora tenemos /sdd:* y /ce:* |
| Integraciones (yt-dlp, Figma MCP) | ⭐⭐⭐⭐ | algunas aún activas |

### Veredicto: INFO VALIOSA pero LEGACY

El concepto central es bueno, pero el formato y los triggers están desactualizados. Los patrones clave están ahora implementados de forma más robusta en el OS actual.

---

## Contenido Original (XML convertido)

### Nombre
```
EquipoAgentesPM_SOTA_ClaudeCode
```

### Descripción
```
Orquestación multi-agente SOTA para Product Management: discovery, tech, design, 
orchestrator + back pressure + Let it Fail + Git truth automática.
```

### Prompt Base
```
Actúa como PM SOTA + equipo de agentes. Carga SIEMPRE contexto completo de Git 
antes de responder. Aplica back pressure en cada gate. Usa Let it Fail para 
auto-mejorar skills.
```

### Pasos Originales

1. **Explorar**: Analiza problema + Git context completo.
2. **Planificar**: Genera spec con roles, dependencias y back pressure gates.
3. **Implementar**: Ejecuta sub-agentes en paralelo/secuencial.
4. **Iterar**: Aplica Let it Fail, agrega instrucción faltante y valida.
5. **Back Pressure**: Valida contra user needs, business goals y Git truth.
6. **Slash Commands**: /discovery, /spec, /prototype, /validate, /orchestrate, /data-csv.
7. **Git Truth**: Lee commits, PRs y carpetas automáticamente.
8. **Integraciones**: yt-dlp para URLs, Python para CSVs, graph viz.
9. **Self-Improvement**: Al final de cada run, pregunta "qué instrucción faltó" y actualiza skill.
10. **Modo ULTRATHINK**: Piensa paso a paso y consolida outputs.
11. **Para URLs YouTube**: Extrae metadata + resumen automático.
12. **Output**: Siempre Markdown estructurado + archivos Git-ready.

### Tools Originales
- Claude Code (deep dive)
- Git (single source of truth)
- yt-dlp + Python
- Figma MCP

### Uso Original
```
/use_skill EquipoAgentesPM_SOTA_ClaudeCode {tarea o URL}
```

---

## Mapping a OS Actual

| Concepto Legacy | Implementación Actual |
|-----------------|----------------------|
| Multi-agent orchestration | CE Workflows + SDD |
| Back pressure gates | SDD gates en specs |
| Let it Fail | 04_Operations/01_Auto_Improvement/ |
| Git truth | AGENTS.md - Git como fuente de verdad |
| /discovery, /spec | /sdd:explore, /sdd:spec |
| yt-dlp | 19_Video_Intel skill |
| Figma MCP | MCP activo en .mcp.json |

---

## Nota de Archivo

Este documento se archivó durante el **Invictus Workflow** (2026-04-14) como parte de la auditoría de 00_Winter_is_Coming/Skills/.

La información de valor se mapeó a las implementaciones actuales del OS.