---
name: workflows-area
description: >
  Área de WORKFLOWS — Agent Teams, PM, Orchestrator.
  Skills para gestión de workflows, orchestration, y coordinación multi-agente.
  Triggers on: workflows, agent teams, orchestrator, multi-agente, project management, product management, supercampeones
sota_upgraded: true
---

# 🔄 WORKFLOWS — Agent Teams, PM, Orchestrator

## Esencia Original

Workflows es la capa de orquestación del sistema — donde los agentes dejan de ser islas y se convierten en equipos. No se trata de tener muchos agentes, sino de que sepan cuándo hablar, cuándo escuchar y cuándo pasar la posta. Cada patrón aquí (Supercampeones, Marvel, Octopus) resuelve un problema de coordinación real que apareció en producción. La diferencia entre un swarm que funciona y uno que no es saber quién tiene el contexto en cada momento.

**Área Funcional:** 00_Workflows
**Versión:** 1.0 | **Última actualización:** 2026-05-19

---

## Sub-áreas y Contenido

| Sub-área              | Descripción                  |
|----------------------|-----------------------------|
| `01_Agent_Teams_Lite/`| Sistema de equipos de agentes|
| `02_Project_Manager/` | Gestión de proyectos         |
| `03_Product_Manager/` | Gestión de producto          |
| `04_PM_Orchestrator/` | Orquestador PM               |

## Skills Principales

| Skill               | Trigger               | Descripción         |
|--------------------|----------------------|--------------------|
| **Super_Campeones** | `03_Super_Campeones/` | Agent Teams Protocol|
| **Agent Teams Lite**| `01_Agent_Teams_Lite/`| Sistema legacy      |

## Metodologías Integradas

1. **Supercampeones** — Director + Jugadores + Árbitro
2. **Marvel/Avengers** — Workflow team de 8 héroes
3. **Octopus** — Ejecución paralela multi-brazos
4. **4 Fantásticos** — Swarm + Auditor + Engram + Docs

## Orchestrator Base

```
Usuario → Director → Jugadores → Árbitro → Director → Usuario
```

## Workflows Disponibles

| Workflow    | Ubicación                                 | Héroes  |
|------------|------------------------------------------|--------|
| Marvel      | `00_Workflows_Os/02_Marvel/`              | 8       |
| Personal OS | `00_Workflows_Os/01_Personal_Os/`         | 11      |
| Compound Eng| `00_Workflows_Os/05_Compound_Engineering/`| 4       |

## ⚠️ Gotchas

### Deadlock multi-agente
> Dos agentes se esperan mutuamente y el workflow nunca termina.

- **Por qué**: Los patrones de orquestación (Supercampeones, Marvel) asumen que cada agente devuelve control. Si un agente entra en un loop o espera respuesta de otro sin timeout, todo el pipeline se congela.
- **Solución**: Todo paso de agente debe tener timeout explícito (recomendado: 30s). Implementar circuit breaker: si un agente no responde en el tiempo esperado, el Director lo saltea y reporta.

### Árbitro sin criterio
> El rol de Árbitro no tiene reglas claras para resolver conflictos.

- **Por qué**: El Árbitro está diseñado para mediar entre opiniones de agentes, pero sin criterios definidos termina siempre favoreciendo al último que habló o al que argumentó con más texto.
- **Solución**: Definir rúbrica de arbitraje por workflow: (1) datos objetivos sobre opiniones, (2) priorizar fuente más cercana al dominio, (3) en empate gana la opción más segura.

### Contexto de jugadores stale
> Un jugador ejecuta con información desactualizada porque otro jugador ya la modificó.

- **Por qué**: Los jugadores reciben contexto al iniciar pero no se re-sincronizan si otro agente modifica el estado compartido durante la ejecución paralela.
- **Solución**: Implementar checkpoint de estado antes de cada fase. Los jugadores leen el contexto fresco del checkpoint, no del mensaje inicial. Usar Octopus para fases paralelas con estado inmutable.

## 💾 State Persistence

| Componente              | Persistencia | Mecanismo                                                  |
|------------------------|-------------|-----------------------------------------------------------|
| Workflow activo         | ⚠️ Por sesión| Estado en memoria — se pierde al cerrar sesión             |
| Resultados de fase      | ✅ Archivo    | Checkpoints en `00_Workflows/00_Workflows_Os/.checkpoints/`|
| Config de equipos       | ✅ Permanente | SKILL.md de cada equipo en su directorio                   |
| Historial de ejecuciones| ❌ No persiste| Cada ejecución empieza fresh                               |

---

*Área Workflows v1.0 — 2026-05-19*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
