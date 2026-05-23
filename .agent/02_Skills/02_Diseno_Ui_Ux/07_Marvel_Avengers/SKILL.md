---
name: marvel-avengers
description: >
  Metodología MARVEL/AVENGERS — Workflow de equipo multi-agente inspirado en los Vengadores.
  Cada workflow es un "héroe" con poderes únicos. Integración con Compound Engineering.
  Activa cuando: "Iron Man esto", "Spider brainstorm", "Thor work", "Hulk compound", "Avengers",
  "ejecutá el plan", "compound esto".
---

# 🦸 MARVEL/AVENGERS — Workflow Team de Agentes

## Concepto

Workflow de equipo multi-agente donde cada "héroe" tiene un rol específico y poderes únicos. Inspirado en los Vengadores de Marvel — el equipo más poderoso no es el que tiene más fuerza, sino el que sabe cuándo actuar juntos y cuándo por separado.

## Los 8 Héroes

| Héroe | Workflow | Rol | Integración SDD |
|--------|----------|-----|-----------------|
| **Iron Man** | `01_Iron_Man_Gen.md` | Generación inicial de código | — |
| **Spider-Man** | `02_Spider_Brainstorm.md` | Exploración e ideas | Brainstorm |
| **Professor X** | `03_Professor_X_Plan.md` | Planificación detallada | Plan |
| **Vision** | `04_Vision_Review.md` | Revisión de arquitectura | Review |
| **Thor** | `05_Thor_Work.md` | Ejecución de trabajo | Work |
| **Hulk** | `06_Hulk_Compound.md` | Compounding de conocimiento | Compound |
| **Ant-Man** | `07_AntMan_Lfg_Lite.md` | Autonomous Lite | Auto-Execute |
| **Dr. Strange** | `08_Doc_Strange_Lfg.md` | Documentación | Docs |

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

| Fase CE | Héroe |
|---------|-------|
| Ideate | Spider |
| Plan | Professor X |
| Work | Thor |
| Review | Vision |
| Compound | Hulk |

## Gotchas

- ❌ NO usar pipeline completo para tareas simples → usar héroe individual
- ❌ Thor NO debe compound → eso es trabajo de Hulk
- ✅ SIEMPRE pasar output de un héroe al siguiente
- ✅ VISION debe verificar que Thor siguió el plan

## Ubicación

```
01_Core/00_Workflows_Os/02_Marvel/
```

---

*Skill Marvel/Avengers — v1.0 | Activated 2026-04-25*
