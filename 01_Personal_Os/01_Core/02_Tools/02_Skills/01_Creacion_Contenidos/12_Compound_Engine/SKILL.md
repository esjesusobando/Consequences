---
name: compound-engine
description: "Orquestación del Motor de Compuesto — filosofía EveryInc de compounding engineering. Triggers: compound engine, motor de compuesto, especialistas, compounding, cycle."
version: 1.0.0
sota_upgraded: true
---

# Compound Engine Integration

## Esencia Original
> **Propósito:** Orquestar el Motor de Compuesto para aplicar filosofía de Compounding Engineering
> **Flujo:** Plan → Review → Execute → Compound capabilities


## Overview

Esta Skill otorga al asistente la capacidad de orquestar el **Motor de Compuesto**. Permite elevar el nivel de ingeniería del sistema aplicando la filosofía de EveryInc: "Hacer que cada tarea haga la siguiente más fácil" (Compounding Engineering).

## Capacidades Especiales

- **Legión de Especialistas**: Invoque a los expertos en `.agent/01_Agents/Specialists/` para tareas críticas de auditoría, diseño y arquitectura.
- **Especialistas Disponibles**: `security-sentinel`, `performance-oracle`, `architecture-strategist`, `kieran-typescript-reviewer`, etc. (Total: 23 Agentes).
- **Gestión de Plugins**: Administre y convierta herramientas en el marketplace del motor.
- **Ciclos de Compuesto**: Implementar el ciclo `Plan → Review → Execution → Compound`.
- **Nuevas Capacidades Elite (3.0)**:
  - **Image Studio**: Generación estética Apple Standard.
  - **Elite Auditor**: Auditoría industrial de agentes.
  - **Silicon Valley Performance**: Reporting estratégico C-Level.
  - **Canvas Diagram Studio**: Diagramación premium Excalidraw.
  - **Video Visuals Producer**: Producción programática de video.

## Instrucciones de Uso (Cerebro Compartido)

1. **Auditoría Profunda**: Ante código sensible, convoque al `Security Sentinel` o al `Performance Oracle`.
2. **Sincronización de Diseño**: Use `Figma Design Sync` para alinear el código con el mockup.
3. **Conversión de Herramientas**: El CLI de Compound (`bun run src/index.ts`) permite portar herramientas entre plataformas (Claude Code, OpenCode, Codex).

## ⚠️ Gotchas

### Especialista equivocado para la tarea
> Invocar a un revisor de TypeScript para un problema de seguridad.

- **Por qué**: Cada especialista tiene un dominio específico. El `security-sentinel` no revisa tipos, y `kieran-typescript-reviewer` no encuentra vulnerabilidades.
- **Solución**: Mapear el problema al especialista correcto antes de invocar. Si hay duda, empezar con `architecture-strategist` para diagnóstico.

### Ciclo de compounding incompleto
> Ejecutar Plan → Review sin llegar a Compound (la capitalización).

- **Por qué**: El valor real del sistema está en el paso 4 (Compound). Si te detenés en Review, estás haciendo calidad, no compounding.
- **Solución**: Cada tarea debe terminar con "¿Qué aprendimos que haga la próxima tarea más fácil?". Documentar eso es el Compound.

### Plugin desactualizado
> Usar una herramienta convertida con versión vieja del CLI.

- **Por qué**: El CLI de Compound evolve rápido. Una herramienta convertida con versión vieja puede tener breaking changes en la plataforma destino.
- **Solución**: Correr `bun run src/index.ts --version` antes de convertir. Si la version es < 3.0, actualizar primero.

---

## 💾 State Persistence

> **Qué persists**: Especialistas activos, ciclos de compounding en progreso, plugins convertidos, estado del motor.
> **Dónde**: `.agent/01_Agents/Specialists/`, `04_Docs/solutions/`, CLI de Compound.
> **Cuándo restore**: Al retomar una sesión de ingeniería, restaurar qué especialistas están disponibles y qué ciclos de compounding están en progreso.
> **Formato**: Archivos de agente (YAML/MD), documentación de soluciones, configuración CLI.

### Estado que se preserva entre sesiones:
1. **Especialistas disponibles**: Lista de agentes cargados y su dominio específico.
2. **Ciclos de compounding activos**: Qué tareas están en Plan → Review → Execute → Compound.
3. **Plugins convertidos**: Herramientas portadas entre plataformas y su versión.
4. **Documentación generada**: Learnings y patterns compuestos en `docs/solutions/`.

---

*Skill Version: 1.0.0*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
