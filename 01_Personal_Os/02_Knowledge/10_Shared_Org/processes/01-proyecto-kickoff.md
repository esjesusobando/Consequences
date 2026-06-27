---
title: "Proyecto Kickoff — Configuración Inicial"
version: 1.0
owner: "Estratega Principal"
frequency: "adhoc"
last_reviewed: "2026-06-27"
tags: [kickoff, proyecto, inicio, configuracion]
---

# SOP: Proyecto Kickoff — Configuración Inicial

## Propósito
Configurar un nuevo proyecto desde cero en el ecosistema Think_Different, asegurando que todas las herramientas, contextos y agentes estén listos antes de empezar a trabajar.

## Alcance
Lo ejecuta el Estratega Principal (o un agente Admin delegado) cada vez que arranca un proyecto nuevo — sea un cliente externo, un proyecto interno o una iniciativa nueva. Aplica solo a proyectos que requieren infraestructura del Personal OS.

## Diagrama de Flujo

```
[Inicio] → [1. Brief y Alcance] → [Completos?]
                                            ↓
                                      [Sí] → [2. Crear estructura] → [3. Configurar agentes]
                                            ↓
                                      [No] → [1b. Solicitar info faltante] → [1]
                                            
[3] → [4. Setup herramientas] → [5. Quality Gates] → [Fin]
```

## Procedimiento

### 1. Brief y Definición de Alcance
**Quién:** Estratega Principal
**Qué:** Recibir y validar el brief del proyecto. Documentar objetivos, stakeholders, timeline tentativo y criterios de éxito.
**Herramienta:** Template de brief (si existe) o documento markdown nuevo
**Tiempo estimado:** 30 min

**Check:**
- [ ] Objetivos definidos (SMART)
- [ ] Stakeholders identificados con roles
- [ ] Timeline tentativo con hitos
- [ ] Criterios de éxito documentados

### 2. Crear Estructura de Proyecto
**Quién:** Admin Agent
**Qué:** Crear la carpeta del proyecto en `01_Personal_Os/05_Projects/{proyecto}/` con la estructura estándar:
- `README.md` — descripción del proyecto
- `brief.md` — brief completo
- `activos/` — assets del proyecto
- `notas/` — notas de reuniones y decisiones

**Herramienta:** Terminal / filesystem
**Tiempo estimado:** 10 min

### 3. Configurar Agentes y Contexto
**Quién:** Admin Agent
**Qué:** Configurar el contexto del proyecto para los agentes que van a trabajar:
1. Crear `CLAUDE.{proyecto}.md` con el contexto específico del proyecto
2. Configurar Engram project context apuntando a la carpeta del proyecto
3. Si aplica, crear templates de agente por rol (Estratega, Creador, Analista)
4. Vincular playbooks relevantes de `10_Shared_Org/playbooks/`

**Herramienta:** OpenCode / Engram MCP
**Tiempo estimado:** 20 min

### 4. Setup de Herramientas y Accesos
**Quién:** Estratega Principal
**Qué:** Asegurar que todas las herramientas necesarias estén configuradas:
1. Repositorio Git (si aplica)
2. Accesos a APIs externas (Google, LinkedIn, etc.)
3. Integraciones MCP necesarias
4. Calendario y sistema de tareas

**Herramienta:** Según proyecto
**Tiempo estimado:** 15 min

### 5. Quality Gates y Kickoff
**Quién:** Estratega Principal + Admin Agent
**Qué:** Validar que todo está listo antes de arrancar:
1. Revisar checklist de calidad
2. Confirmar con stakeholders que el setup está completo
3. Marcar proyecto como "activo" en el dashboard

**Tiempo estimado:** 10 min

## Excepciones

| Situación | Acción |
|-----------|--------|
| Brief incompleto | Pausar kickoff, devolver brief con preguntas específicas |
| Cliente existente reciclado | Saltar paso 2, solo actualizar configuración de agentes |
| Proyecto interno chico (< 1 día) | Saltar pasos 2-4, solo crear brief y carpeta mínima |
| API key faltante | Documentar dependencia, arrancar con lo que está disponible |

## Checklist de Ejecución

- [ ] Brief completo con objetivos SMART
- [ ] Carpeta de proyecto creada en `05_Projects/`
- [ ] Contexto de agente configurado (CLAUDE.{proyecto}.md)
- [ ] Engram context apuntando al proyecto
- [ ] Herramientas configuradas y accesos verificados
- [ ] Playbooks relevantes vinculados
- [ ] Stakeholders notificados que el proyecto está activo
- [ ] Dashboard de métricas actualizado
