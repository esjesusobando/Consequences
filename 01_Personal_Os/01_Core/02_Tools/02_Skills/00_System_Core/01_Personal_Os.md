---
name: "personal-os"
description: "Activar el modo Think Different PersonalOS - Sistema completo de productividad con goals, backlog, tareas y workflows"
sota_upgraded: true
---

# Think Different PersonalOS

Este es el sistema de productividad personal Think Different. Cuando actives esta skill, operás con la metodología del PersonalOS.

## Estructura del Sistema

El PersonalOS tiene la siguiente estructura:

```
├── 00_Winter_is_Coming/    # Goals, Backlog, Agentes
├── 01_Core/               # Skills, Agents, Evals, MCP, Server
├── 02_Knowledge/          # Base de conocimiento
├── 03_Tasks/              # Tareas activas (YAML frontmatter)
├── 04_Operations/         # Memoria, Brain, Notas
├── 05_Archive/           # Archive: Repos, legacy
├── 03_Resultado/          # Outputs: Learning Always, OIM, Projects
└── 01_Personal_Os/04_Operations/03_Scripts_Os/        # HUBs: Auditor, Git, AIPM, Ritual
```

## Comandos Principales

### Gestión de Tareas

- **"Clear my backlog"** → Procesa el backlog y crea tareas
- **"What should I work on today?"** → Muestra prioridades del día
- **"Show tasks supporting goal [nombre]"** → Lista tareas de una meta

### Workflows SDD

- `/sdd:init` → Inicializar contexto SDD
- `/sdd:new [nombre]` → Crear nueva propuesta
- `/sdd:apply` → Implementar tareas

### Compound Engineering

- `/ce:ideate` → Descubrir mejoras
- `/ce:brainstorm` → Explorar requisitos
- `/ce:plan` → Planes detallados
- `/ce:work` → Ejecutar con worktrees

### System Guardian

- `gr` → Validación dry-run
- `gr --apply` → Aplicar fixes automáticos

## Categorías de Tareas

- **technical**: build, fix, configure
- **outreach**: communicate, meet
- **research**: learn, analyze
- **writing**: draft, document
- **content**: blog posts, social media
- **admin**: operations, finance
- **personal**: health, routines

## Protocolo de Sesión

Al iniciar una nueva sesión:

1. Leer `00_Winter_is_Coming/GOALS.md` → Objetivos
2. Leer `00_Winter_is_Coming/BACKLOG.md` → Tareas pendientes
3. Usar `engram mem_context` → Recuperar contexto previo
4. Reportar resumen antes de actuar

##记忆 (Memoria)

- **engram** → Persistencia entre sesiones
- Guardar decisiones importantes con `engram mem_save`
- Buscar contexto con `engram mem_search`

## metallic (Reglas)

1. NO actuar sin plan aprobado
2. Enumeración correcta de archivos (XX_Nombre.ext)
3. Corrección de errores - documentar antes de actuar


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
