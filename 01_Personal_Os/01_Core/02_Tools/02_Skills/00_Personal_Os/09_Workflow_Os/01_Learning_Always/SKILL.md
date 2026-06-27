---
name: "learning-always"
description: >
  LA (Learning Always) — Metodología de aprendizaje continuo con IA.
  Ciclo AI → Understand → Validate → Compound.
  Activa cuando el orquestador detecta necesidad de aprender antes de construir,
  investigar antes de implementar, o compundear conocimiento después de resolver.
triggers:
  [
    "learn this",
    "investiga",
    "research",
    "entiendo",
    "aprender",
    "learning",
    "LA mode",
    "compound knowledge",
    "entiende esto primero",
    "explain this",
    "break this down",
    "quiero entender",
    "como funciona",
    "walk me through",
  ]
version: 1.0.0
area: "00_Personal_Os > 09_Workflow_Os"
workflow: "01_Workflows/01_LA_Master_Flow.md"
sota_upgraded: true
---

# 🧠 Learning Always (LA) — Metodología de Aprendizaje Continuo

> **Ciclo**: `AI → Understand → Validate → Compound → Repeat`
> **Frase clave**: *"Cada interacción con IA debe dejarte más inteligente de lo que empezaste."*

## 📖 Filosofía

Learning Always no es un skill más — es el **ADN del orquestador**. En lugar de tratar a la IA como una caja negra que produce respuestas, LA convierte cada interacción en una oportunidad de aprendizaje que **compounds** para la próxima.

### Principios Fundamentales

| #  | Principio              | Descripción                                                                            |
|---|-----------------------|---------------------------------------------------------------------------------------|
| 1  | **Context-First**      | Nunca pidas una respuesta sin dar contexto primero. Describe proyecto, stack, objetivo.|
| 2  | **Learn Before Build** | Entiende antes de implementar. Pide explicación, no código.                            |
| 3  | **Validate Everything**| Nunca confíes ciegamente. Pide razonamiento, verifica fuentes, crítica el output.      |
| 4  | **Compound Knowledge** | Documenta lo que aprendiste. Cada sesión alimenta la siguiente.                        |
| 5  | **Phase-Driven**       | Separa en fases: Investigar → Planificar → Implementar → Revisar → Documentar.         |
| 6  | **Scope Discipline**   | Una sesión = un problema. Prompt único no es workflow.                                 |

## 🔄 Ciclo LA (5 Fases)

```
┌─────────────────────────────────────────────────────────────┐
│                    LEARNING ALWAYS CYCLE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [INPUT] ──→ 1. ENTENDER ──→ 2. VALIDAR ──→ 3. APLICAR     │
│    │                                                       │
│    └────────────── 4. COMPUNDEAR ──→ 5. REPETIR ──────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Fase 1: Context + Understand
```
Input: Pregunta / Tópico / Código
Acción: 
  1. "Explícame X como si fuera la primera vez"
  2. "Walk me through the reasoning"
  3. "What are the trade-offs?"
Output: Explicación estructurada con razonamiento
```

### Fase 2: Validate
```
Input: Explicación del AI
Acción:
  1. Preguntar "¿Cómo sé que esto es correcto?"
  2. Pedir fuentes, referencias, evidencia
  3. Pensamiento crítico: ¿tiene sentido?
Output: Validación o refutación + comprensión real
```

### Fase 3: Apply / Build
```
Input: Comprensión validada
Acción:
  1. Planificar implementación
  2. Codificar con scope preciso
  3. Cada archivo = una intención clara
Output: Código / Documentación / Decisión
```

### Fase 4: Compound
```
Input: Resultado de la fase 3
Acción:
  1. Documentar qué aprendiste
  2. Guardar patrones que funcionaron
  3. Registrar gotchas y edge cases
Output: Documento de aprendizaje / Engram save
```

### Fase 5: Seed Next Session
```
Input: Documento de aprendizaje
Acción:
  1. El aprendizaje se vuelve contexto para la próxima sesión
  2. El orquestador lo carga automáticamente
  3. No empezar desde cero nunca más
Output: Contexto persistente entre sesiones
```

## 🎯 Triggers de Activación

| Señal                              | Acción LA                                          |
|-----------------------------------|---------------------------------------------------|
| Usuario pregunta "cómo funciona X" | Activar LA Mode → entender antes de proponer       |
| Usuario pide implementar algo nuevo| Activar Fase 1-2 antes de escribir código          |
| Se resolvió un bug complejo        | Activar Fase 4 → compound learnings                |
| Nueva sesión empieza               | Cargar learnings de sesiones previas (Fase 5)      |
| Usuario dice "no entiendo"         | Deep LA → explicación estructurada + analogías     |
| Usuario dice "investiga X"         | LA Research → buscar + analizar + sintetizar       |
| Después de un error del AI         | Validar → corregir → compound (no solo re-intentar)|

## 🔗 Integración con el OS

| Componente                       | Integración                                                   |
|---------------------------------|--------------------------------------------------------------|
| **Orquestador**                  | Carga LA context al iniciar sesión (Fase 5)                   |
| **SDD Workflow**                 | LA alimenta la fase `explore` con contexto investigado        |
| **Compound Engineering**         | LA es el pipeline de `ce:compound` + `ce:brainstorm`          |
| **Engram Memory**                | Todos los learnings se guardan con `mem_save`                 |
| **Hillary**                      | LA captura learning personal y lo compuende                   |
| **OpenCode / Claude Code / Warp**| Invocable via `skill("learning-always")` desde cualquier shell|

## 📁 Estructura

| Recurso           | Ubicación                                                            |
|------------------|---------------------------------------------------------------------|
| SKILL.md (este)   | `09_Workflow_Os/01_Learning_Always/SKILL.md`                         |
| Master Workflow   | `09_Workflow_Os/01_Learning_Always/01_Workflows/01_LA_Master_Flow.md`|
| Workflow: Compound| `09_Workflow_Os/01_Learning_Always/01_Workflows/02_LA_Compound.md`   |
| Workflow: Research| `09_Workflow_Os/01_Learning_Always/01_Workflows/03_LA_Research.md`   |
| Referencias       | `09_Workflow_Os/01_Learning_Always/02_References/`                   |

## 💾 Persistencia

| Dato                | Dónde se guarda                    | Formato                              |
|--------------------|-----------------------------------|-------------------------------------|
| Learning de sesión  | Engram Memory                      | `mem_save(type: "discovery/pattern")`|
| Patrones reusables  | `02_Knowledge/` o `docs/solutions/`| Markdown                             |
| Contexto de proyecto| `00_Context_LLM/`                  | Markdown con YAML                    |
| Compound docs       | `02_References/`                   | Markdown                             |

---
*Learning Always v1.0 — 2026-05-30 — "Cada interacción te deja más inteligente"*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
