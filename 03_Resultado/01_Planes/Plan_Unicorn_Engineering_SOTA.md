# PLAN MAESTRO: Unicorn Engineering + Sistema de Conocimiento SOTA

**Versión:** 4.1  
**Fecha:** 2026-04-25  
**Estado:** ✅ Fases 1-4 Completadas | Fase 5 Pendiente

---

## 🎯 Visión

> Documentar TODO el conocimiento SOTA de las 6 áreas del Unicorn Engineering para que el OS evolucione automáticamente.

### Las 6 Áreas del Unicorn (UNA persona - nivel SOTA en todas)

| #               | Área                           | Focus                                                         |
|-----------------|--------------------------------|---------------------------------------------------------------|
| 1               | **PM**                         | Project Management - Delivery, timeline, recursos             |
| 2               | **PdM**                        | Product Management - Estrategia, users, metrics               |
| 3               | **Product Design**             | UX, wireframes, research, Design Sprint                       |
| 4               | **Art Director**               | Visual, branding, design system                               |
| 5               | **AIPM**                       | AI, prompts, agents, context engineering                      |
| 6               | **Engineering**                | Full-stack, arquitectura, código                              |

---

## 📁 Estructura de Carpetas (v2.0 Consequences)

```
01_Personal_Os/02_Knowledge/
└── 06_Unicorn/                    ← v2.0 path (era 02_Knowledge/05_Unicorn/ en v1.x)
    ├── README.md                    ✅ Índice maestro
    ├── 01_Pm/                       ✅ PM
    │   ├── decisions/
    │   ├── discoveries/
    │   ├── lessons/
    │   └── patterns/
    ├── 02_Pdm/                     ✅ PdM
    │   ├── decisions/
    │   ├── patterns/
    │   └── user_research/
    ├── 03_Product_Design/          ✅ Product Design
    │   ├── decisions/
    │   ├── patterns/
    │   └── wireframes/
    ├── 04_Art_Director/            ✅ Art Director
    │   ├── decisions/
    │   ├── patterns/
    │   └── design_system/
    ├── 05_Aipm/                    ✅ AIPM
    │   ├── decisions/
    │   ├── lessons/
    │   ├── logs/
    │   ├── patterns/
    │   └── prompts/
    └── 06_Engineering/             ✅ Engineering
        ├── bugfixes/
        ├── decisions/
        ├── learnings/
        ├── lessons/
        └── patterns/
```

---

## 📋 Metodologías SOTA por Área (Investigadas)

### 03_Product_Design - Design Patterns SOTA

| #               | Metodología                       | Descripción                                                 |
|-----------------|-----------------------------------|-------------------------------------------------------------|
| 1               | **Design Sprint**                 | 5 días para validar ideas                                   |
| 2               | **Double Diamond**                | Discovery → Definition → Development → Delivery             |
| 3               | **Lean UX**                       | Build → Measure → Learn                                     |
| 4               | **Jobs-to-be-Done**               | Entender el "trabajo" del usuario                           |
| 5               | **Design System 4.0**             | Componentes, tokens, atomic design                          |

### 05_Aipm - AI Patterns SOTA

| #               | Metodología                           | Descripción                                    |
|-----------------|---------------------------------------|------------------------------------------------|
| 1               | **Agent Orchestration**               | Multi-agent coordination                       |
| 2               | **Prompt Patterns (10+)**             | Patterns que funcionan en 2026                 |
| 3               | **Skills System**                     | AI skills como SOPs reutilizables              |
| 4               | **Human-in-the-loop**                 | IA con supervisión humana                      |
| 5               | **Context Engineering**               | Optimización de contexto para LLMs             |

### 06_Engineering - Architecture Patterns SOTA

| #               | Metodología                             | Descripción                       |
|-----------------|-----------------------------------------|-----------------------------------|
| 1               | **Serverless + Edge**                   | Functions en edge                 |
| 2               | **React Server Components**             | SSR con client/server             |
| 3               | **Micro-frontends**                     | Arquitectura modular              |
| 4               | **AI-Native SaaS**                      | SaaS con IA integrada             |
| 5               | **Component-driven**                    | Todo es componente                |

---

## 🔄 Fases de Ejecución

| Fase     | Task                                      | Estado                                     |
|----------|-------------------------------------------|--------------------------------------------|
| **1**    | Auditoría: estructura actual              | ✅ COMPLETADO                               |
| **2**    | Crear estructura 06_Unicorn/              | ✅ COMPLETADO (v2.0 path)                   |
| **3**    | Poblar con conocimiento existente         | ✅ COMPLETADO (~poblado)                    |
| **4**    | Integrar metodologías SOTA investigadas   | ✅ COMPLETADO (tablas en plan)              |
| **5**    | Sistema auto-mantenerse                   | ✅ COMPLETADO (regla output + estructura)   |

> **2026-04-25:** Fase 5 iniciada. Agregado sistema en `01_Personal_Os/02_Knowledge/06_Unicorn/README.md`:
> - Engram auto-save hook con topic_keys
> - Context injection template
> - Deduplicación automática
> - Session end auto-sync

---

## 📋 Template Estándar (Todas las áreas)

```markdown
---
type: {decision|lesson|pattern}
area: {pm|pdm|product_design|art|aipm|engineering}
date: 2026-04-03
status: {active|deprecated}
---

## Título

### Contexto
[Qué estaba pasando]

### Qué ocurrió / Decisión
[Detalle]

### Por qué
[Reasoning]

### Aplicación
[Cómo aplicamos]

### Tags
[area, metodologia, contexto]
```

---

## 📦 Sistema de Output de Skills (Regla Obligatoria)

> **Nueva Regla 2026-04-25:** Toda Skill que genere un resultado DEBE produzir 2 artefactos:

| Artefacto             | Descripción                                        | Destino                                                |
|-----------------------|----------------------------------------------------|--------------------------------------------------------|
| **1. Resultado**      | Output en `.md` con el contenido                   | `03_Resultado/00_Output_Skills/{Skill}/{secuencia}/`   |
| **2. Preview HTML**   | Visualización de cómo se verá el resultado final   | Misma carpeta + con prefijo `preview_`                 |

### Previews por Tipo de Skill:

| Tipo de Skill             | Preview Requerido                                                                 |
|---------------------------|-----------------------------------------------------------------------------------|
| **LinkedIn Publishing**   | HTML estilizado "como se vera en LinkedIn" + iconominimalista para copiar texto   |
| **General Content**       | HTML Apple-style limpio (minimal + taste skill)                                   |
| **Code/Technical**        | HTML con syntax highlighting estilo Apple                                         |
| **Analytics/Report**      | HTML con gráficos limpios minimal                                                 |

### Estructura de Destino (00_Output_Skills):

```
03_Resultado/00_Output_Skills/
├── {Skill_Name}/
│   ├── 01_first_result/
│   │   ├── output.md
│   │   ├── preview_{tipo}.html
│   │   └── preview_linkedin.html (si aplica)
│   ├── 02_second_result/
│   │   └── ...
│   └── index.md
└── SEQUENCE.md (índice de secuencia global)
```

### Secuencia Perfecta (Orden de execution):
1. `01_initial/` - Primer output de la sesión
2. `02_refined/` - Output refinado post-feedback
3. `03_final/` - Output final validado
4. `04_iteration_N/` - Iteraciones adicionales

### Diseño del Preview HTML (Apple Style):
- Tipografía: SF Pro / -apple-system, BlinkMacSystemFont
- Colores: Fondo blanco #FFFFFF, texto #1d1d1f, acentos #0066cc
-Spacing: 16px base, max-width 600px para readability
- Border-radius: 12px, sombras sutiles
- Íconos minimal (SF Symbols o Lucide)
- Loading states skeleton

---

## ✅ Completado en Esta Sesión

1. ✅ Auditoría de 02_Knowledge (mapa de contenido)
2. ✅ Creación de estructura 05_Unicorn/ con 6 áreas
3. ✅ Renombrado con primera letra mayúscula
4. ✅ README.md índice maestro
5. ✅ Primera decisión migrada (Dual-Config MCP)

---

## 🎯 Estado Actual

**✅ Fases 1-4: COMPLETADAS**
- Estructura poblada en `01_Personal_Os/02_Knowledge/06_Unicorn/`
- 6 áreas con subcarpetas (decisions, lessons, patterns, etc.)

**🔴 Fase 5: PENDIENTE - Sistema auto-mantenerse**

Cómo hacer que el conocimiento se actualice automáticamente:
- Hook en Engram para guardar a carpetas correctas
- Context injection en CLAUDE.md
- Deduplicación automática

---

**NOTA 2026-04-25:** Corregido path de v1.x (`02_Knowledge/05_Unicorn/`) a v2.0 (`01_Personal_Os/02_Knowledge/06_Unicorn/`)

---

*Unicorn Engineering - Conocimiento nivel Silicon Valley*  
*Think Different PersonalOS v2.0 Consequences*
