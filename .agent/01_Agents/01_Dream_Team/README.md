# Dream Team — Super Campeones

**Version:** 3.1 | **Date:** 2026-06-25

---

## Que es?

El Dream Team son los 6 agentes especializados que trabajan juntos como un equipo de futbol. Cada uno tiene un rol especifico y se complementan.

---

## Los 6 Jugadores

| #                      | Agente                                   | Rol                           | Especialidad                                               |
|-----------------------|-----------------------------------------|------------------------------|-----------------------------------------------------------|
| 01                     | **Product_Builder**                      | DELANTERO                     | Construye features completos PRD→deploy                    |
| 02                     | **Data_Engineer**                        | MEDIO                         | ETL, pipelines, analytics                                  |
| 03                     | **Marketing_Tech**                       | EXTREMO                       | Growth, SEO, contenido                                     |
| 04                     | **Design_Ops**                           | DEFENSA                       | UI/UX, design system                                       |
| 05                     | **Platform_Engineer**                    | ARQUITECTO                    | Infra, MCPs, DevOps                                        |
| 06                     | **Marketing_Orchestrator** 🆕            | DIRECTOR TÉCNICO              | Coordina el pipeline de marketing agents (15→16→17)        |

---

## Workflow Principal

```
Product_Builder → (PRD + implementacion)
    ↓
Data_Engineer → (analytics si necesita data)
    ↓
Marketing_Tech → (si necesita growth)
    ↓
Design_Ops → (si UI/UX)
    ↓
Platform_Engineer → (deploy final)
```

### Marketing Orchestrator — Pipeline Específico

El agente 06 no sigue el flujo principal del Dream Team. Es un **director técnico** para el pipeline de marketing:

```
User Input → 06 Orchestrator (parse intent)
    ├── Strategy only → 15 Estratega → done
    ├── Content       → 15 → 16 Creador → done
    └── Full campaign → 15 → 16 → 17 Analista → feedback loop
```

> 📖 Ver [MARKETING_PIPELINE.md](../MARKETING_PIPELINE.md) para guía detallada.

---

## Integración

- **Skills:** 01_Creacion_Contenidos/*, 04_Automatizacion/*
- **MCPs:** Linear, Notion, Vercel, Supabase, github
- **HUBs:** 03_AI_Task_Planner, 11_Auto_Learn_Hub

---

*Think Different PersonalOS v4.9 Consequences — 2026-06-25*
