---
name: marvel-avengers
description: >
  Metodología MARVEL/AVENGERS — Workflow de equipo multi-agente inspirado en los Vengadores.
  Cada workflow es un "héroe" con poderes únicos. Integración con Compound Engineering.
  Activa cuando: "Iron Man esto", "Spider brainstorm", "Thor work", "Hulk compound", "Avengers",
  "ejecutá el plan", "compound esto".
sota_upgraded: true
---

# 🦸 MARVEL/AVENGERS — Workflow Team de Agentes

## Esencia Original

**Metaskill**: Framework de orquestación multi-agente inspirado en el equipo de los Vengadores. No es un workflow de codificación ni un skill de diseño — es una **metodología de equipo** que asigna roles de Compound Engineering (Ideate → Plan → Work → Review → Compound) a personajes arquetípicos para hacer el pipeline más memorable y fácil de ejecutar.

**Propósito original**: Hacer accesible el pipeline de Compound Engineering (SDD) a través de una metáfora narrativa. Cada héroe representa una fase del ciclo de desarrollo: Spider-Man (brainstorm divergente), Professor X (plan convergente), Thor (ejecución), Hulk (documentación de conocimiento), Vision (revisión). Resuelve el problema de que los equipos multi-agente tienden a saltarse fases o mezclar roles sin una estructura clara.

## Concepto

Workflow de equipo multi-agente donde cada "héroe" tiene un rol específico y poderes únicos. Inspirado en los Vengadores de Marvel — el equipo más poderoso no es el que tiene más fuerza, sino el que sabe cuándo actuar juntos y cuándo por separado.

## Los 8 Héroes

| Héroe          | Workflow                 | Rol                         | Integración SDD  |
|---------------|-------------------------|----------------------------|-----------------|
| **Iron Man**   | `01_Iron_Man_Gen.md`     | Generación inicial de código| —                |
| **Spider-Man** | `02_Spider_Brainstorm.md`| Exploración e ideas         | Brainstorm       |
| **Professor X**| `03_Professor_X_Plan.md` | Planificación detallada     | Plan             |
| **Vision**     | `04_Vision_Review.md`    | Revisión de arquitectura    | Review           |
| **Thor**       | `05_Thor_Work.md`        | Ejecución de trabajo        | Work             |
| **Hulk**       | `06_Hulk_Compound.md`    | Compounding de conocimiento | Compound         |
| **Ant-Man**    | `07_AntMan_Lfg_Lite.md`  | Autonomous Lite             | Auto-Execute     |
| **Dr. Strange**| `08_Doc_Strange_Lfg.md`  | Documentación               | Docs             |

## Pipeline de Avengers

```
    IDEA
      │
      ▼
┌───────────┐
│  SPIDER   │ ← Brainstorm (divergencia)
└─────┬─────┘
      │
      ▼
┌───────────┐
│PROFESSOR X│ ← Plan (convergencia)
└─────┬─────┘
      │
      ▼
┌───────────┐
│   THOR    │ ← Work (ejecución)
└─────┬─────┘
      │
      ▼
┌───────────┐
│   HULK    │ ← Compound (documenta)
└─────┬─────┘
      │
      ▼
┌───────────┐
│  VISION   │ ← Review (verificación)
└───────────┘
```

## Runbook

### Pipeline Completo
```bash
# 1. Spider Brainstorm
Usar 02_Spider_Brainstorm.md → ideas divergentes

# 2. Professor X Plan
Usar 03_Professor_X_Plan.md → plan convergente

# 3. Thor Work
Usar 05_Thor_Work.md → ejecución

# 4. Hulk Compound
Usar 06_Hulk_Compound.md → documentación

# 5. Vision Review
Usar 04_Vision_Review.md → verificación
```

### Uso Individual
Cada héroe puede usarse de forma independiente:
```
"Spider brainstorm sobre [tema]" → solo Spider
"Thor work en [plan]" → solo Thor
```

### Iron Man (Generación)
```bash
# Generación inicial cuando no hay plan
Usar 01_Iron_Man_Gen.md
```

### Ant-Man (Autonomous Lite)
```bash
# Ejecución autónoma de tareas simples
Usar 07_AntMan_Lfg_Lite.md
```

### Dr. Strange (Docs)
```bash
# Documentación de metodologías y decisiones
Usar 08_Doc_Strange_Lfg.md
```

## Estándares

### Formato de Archivo
```
02_Marvel/
├── 01_Iron_Man_Gen.md
├── 02_Spider_Brainstorm.md
├── 03_Professor_X_Plan.md
├── 04_Vision_Review.md
├── 05_Thor_Work.md
├── 06_Hulk_Compound.md
├── 07_AntMan_Lfg_Lite.md
└── 08_Doc_Strange_Lfg.md
```

### Nomenclatura
- `[N0]_[Hero_Name]_[action].md`
- `[N0]_[N1]_[Hero_Name]_[action].md` para sub-workflows

### Metadata
```yaml
---
name: spider-brainstorm
description: >
argument-hint: "[feature idea or problem]"
---
```

## Integración Compound Engineering

| Fase CE  | Héroe      |
|---------|-----------|
| Ideate   | Spider     |
| Plan     | Professor X|
| Work     | Thor       |
| Review   | Vision     |
| Compound | Hulk       |

## ⚠️ Gotchas

### Usar el pipeline completo para todo
> Ejecutar Spider → Professor X → Thor → Hulk → Vision incluso para corregir un typo.

- **Por qué**: El pipeline completo es para features complejas. Para tareas simples (typo, refactor menor, cambio de config) el overhead del pipeline es mayor que el beneficio. Terminas con 5 mensajes de agente para cambiar 1 línea.
- **Solución**: Tareas simples → usar 1 héroe directamente. Bugs → Thor directo. Typos → Iron Man directo. El pipeline completo solo para features que requieren brainstrom + plan + work.

### Thor haciendo trabajo de Hulk
> El héroe de ejecución también documenta el conocimiento al final.

- **Por qué**: Cada rol tiene un skill específico. Thor ejecuta, Hulk compound. Si Thor hace ambos, el compounding se vuelve superficial (Thor se enfoca en "cómo" no en "por qué"). Además viola la separación de concerns.
- **Solución**: Thor pasa su output a Hulk. Hulk es quien decide qué vale la pena documentar y escribe el compound. Si Hulk no está disponible, anotar findings y documentar después.

### No pasar output entre héroes
> Cada héroe empieza desde cero sin el contexto del anterior.

- **Por qué**: El pipeline es secuencial por diseño. Spider produce ideas divergentes → Professor X necesita esas ideas para converger. Thor necesita el plan de Professor X para ejecutar. Romper la cadena = cada fase reinventa la rueda.
- **Solución**: Structurar el output de cada héroe como un artefacto markdown que el siguiente héroe lee como input. El plan de Professor X es el contrato que Thor debe cumplir.

### Vision sin plan de referencia
> Vision revisa sin tener el plan original de Professor X.

- **Por qué**: Vision no puede verificar que el plan se ejecutó correctamente si no sabe cuál era el plan. La revisión se vuelve subjetiva ("esto se ve bien") en lugar de objetiva ("esto cumple el plan").
- **Solución**: Vision lee el plan de Professor X primero. Checklist de verificación: "¿Se implementaron todos los puntos del plan? ¿Hay desviaciones no documentadas?"

## Ubicación

```
01_Core/00_Workflows_Os/02_Marvel/
```

---

## 💾 State Persistence

### What to persist between sessions

| Dato                                   | Cómo se persiste                                                                | Cuándo restaurar                                     |
|---------------------------------------|--------------------------------------------------------------------------------|-----------------------------------------------------|
| **Pipeline stage actual**              | Artefacto markdown en el directorio del proyecto                                | Al retomar un pipeline multi-agente a medio ejecutar |
| **Output de cada héroe**               | Archivos markdown independientes (`spider-output.md`, `professor-plan.md`, etc.)| Como input para el siguiente héroe en el pipeline    |
| **Heroes disponibles y workflow files**| Verificación de archivos existentes en `02_Marvel/`                             | Al iniciar cualquier llamado a héroe individual      |
| **Integración CE phases**              | `mem_save` con el mapping héroe → fase CE                                       | Al configurar un nuevo proyecto para usar el pipeline|

### Reglas de persistencia
- **NO** guardar el estado de héroes individuales — son invocados bajo demanda
- **SÍ** persistir los artefactos de output de cada fase para que el siguiente héroe los consuma
- El pipeline se reinicia por proyecto: nuevo feature → nuevo ciclo de héroes
- La integración con Compound Engineering se verifica al inicio de cada sesión

---

*Skill Marvel/Avengers — v1.0 | Activated 2026-04-25*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
