# SDD Proposal: Superar a la Competencia en Anti-Colisión 3D

* *Change ID**: `surpass-competition-anti-collision-3d`
* *Fecha**: 2026-08-22
* *Autor**: SDD Orchestrator (basado en Explore phase)
* *Estado**: Proposed

- --

## 1. INTENT

Transformar el módulo Anti-Colisión 3D (ISCWSA R-Type) de "funcional y bonito" a **referencia open-source que supere a Halliburton LOGIX, Innova VANTAGE y Baker Hughes WellArchitect** en visualización de incertidumbre, usabilidad y velocidad de iteración — manteniendo nuestra ventaja: **matemáticas auditables, zero license, web-native**.

- --

## 2. PROBLEMA DE NEGOCIO

| Situación Actual                                           | Impacto                                                       |
|-----------------------------------------------------------|--------------------------------------------------------------|
| Solo mostramos elipsoides en **1 punto** (closest approach)| Ingenieros no ven evolución del riesgo a lo largo del wellbore|
| **No tenemos** traveling cylinder, ladder plot, SF plot    | Falta herramienta estándar de análisis anti-colisión          |
| **No hay** project-ahead ni alertas RT                     | No servimos operaciones en tiempo real (rig site)             |
| Panel Detail muestra **solo 1 pozo adyacente**             | Usuario no ve contexto multi-pozo en detalle                  |
| Código duplicado (WellborePath inline)                     | Mantenibilidad comprometida, inconsistencias visuales         |

* *Oportunidad**: La competencia cobra **$50k-200k/año** por licencias + soporte. Nosotros entregamos **gratis, open-source, auditable, con mejor UX** — y ganamos adopción por defecto en equipos que no pueden/justifican licencias enterprise.

- --

## 3. ALCANCE (SCOPE)

### 3.1 MVP — P0 ONLY (3-4 PRs chained, ~2-3 semanas)

| Slice                                                   | Descripción                                                                                          | Valor                                          | Esfuerzo            |
|--------------------------------------------------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------|--------------------|
| **S1: WellborePath Refactor**                           | Extraer componente compartido, eliminar duplicación, añadir `useSectionColors`                       | Habilitador técnico, limpieza                  | 1 PR, ~200 líneas   |
| **S2: Panel Detail Multi-Pozo**                         | Vista 3D embebida + lista completa en panel detail (reutiliza AntiCollision3D con `entries={matrix}`)| UX inmediato — usuario ve TODO                 | 1 PR, ~300 líneas   |
| **S3: UncertaintyEngine + Elipsoides Continuos + Conos**| Motor puro TS → geometrías Three.js; render tubo de elipsoides por estación + conos forward          | **KILLER FEATURE** — nadie open-source lo tiene| 1-2 PRs, ~600 líneas|
| **S4: Traveling Cylinder Plot**                         | Vista 2D/3D polar (C2C vs bearing), interactiva, zoom/pan, HS Ref toggle                             | Estándar industria, análisis rápido            | 1 PR, ~400 líneas   |

* *Total MVP**: ~1,500 líneas nuevas/modificadas | 4 PRs encadenados | < 400 líneas/PR (reviewable)

- --

### 3.2 FULL — P1+P2 (Post-MVP, backlog priorizado)

| Prioridad  | Iniciativa                          | Descripción                                                       |
|-----------|------------------------------------|------------------------------------------------------------------|
| **P1**     | Project-ahead Engine                | Proyección bit hacia adelante con elipsoides en estaciones futuras|
| **P1**     | Alertas RT + WebSocket Interface    | `subscribeToWellUpdates()` en store, UI para notificaciones       |
| **P1**     | A11y + Keyboard 3D                  | WASD/arrows, aria-labels, canvas role, screen reader support      |
| **P2**     | Custom IPM Editor                   | UI para crear/edit Instrument Performance Models                  |
| **P2**     | Ladder Plot + Separation Factor Plot| Vistas 2D sincronizadas con 3D                                    |
| **P2**     | MASD Overlay + Depleted Zones       | Visualización lease lines, zonas depletadas (toggle)              |
| **P2**     | Performance LOD                     | InstancedMesh, frustum culling, segments adaptativos              |
| **P3**     | Dashboard Remoto Multi-Pozo         | Vista office: todos los pozos activos, alerts aggregados          |

- --

### 3.3 FUERA DE ALCANCE (Explicit Non-Goals)

- ❌ Backend WebSocket/WITSML server (solo interfaz en store)
- ❌ Integración sísmica/geológica/reservoir (CoViz 4D territory)
- ❌ Geosteering automation (RSS integration)
- ❌ Mobile app nativa (web responsive es suficiente)
- ❌ Multi-usuario / colaborativo en tiempo real (fase futura)
- ❌ Cambio de motor matemático (ISCWSA R-Type ya es correcto)

- --

## 4. ENFOQUE TÉCNICO (APPROACH)

### 4.1 Principios Rectores

1. **Ponytail/Lazy**: Reutilizar lo que existe (`WellborePath.tsx`, `scene.ts`, `drilling-store`), no reinventar
2. **Separación pura**: `UncertaintyEngine` sin React/Three → testable, reutilizable
3. **Brand-kit first**: Todo nuevo componente usa tokens CSS existentes, contraste WCAG AAA
4. **Slice ≤ 400 líneas**: PRs reviewables, chained si necesario
5. **Tests visuales obligatorios**: Playwright + Firefox para cada slice 3D

### 4.2 Arquitectura Objetivo

```
src/
├── engine/
│   ├── anti-collision.ts          # Existente: ISCWSA R-Type math (NO TOCAR)

│   ├── uncertainty-engine.ts      # NUEVO: computeUncertaintyProfile() puro

│   └── traveling-cylinder.ts      # NUEVO: C2C vs bearing calculations

├── components/
│   ├── visuals/
│   │   ├── WellborePath.tsx       # EXISTENTE — refactor target

│   │   ├── UncertaintyTube.tsx    # NUEVO: elipsoides continuos (InstancedMesh)

│   │   ├── UncertaintyCone.tsx    # NUEVO: conos forward projection

│   │   └── TravelingCylinder.tsx  # NUEVO: vista 2D/3D polar

│   ├── sections/
│   │   ├── AntiCollision3D.tsx    # MODIFICAR: integrar UncertaintyTube/Cone

│   │   ├── Anticolision.tsx       # MODIFICAR: Panel Detail multi-pozo + Split View

│   │   └── TravelingCylinderView.tsx # NUEVO: vista dedicada

│   └── ui/
│       └── ... (existente)
├── store/
│   └── drilling-store.ts          # EXTENDER: subscribeToWellUpdates()

└── styles/
    └── anticollision-extensions.css # NUEVO: tokens para nuevos componentes

```

### 4.3 Decisiones Técnicas Clave (Ya Tomadas en Explore)

| Decisión                                        | Rationale                                                      |
|------------------------------------------------|---------------------------------------------------------------|
| `UncertaintyEngine` puro TS                     | Testable sin Three.js, reutilizable para Ladder Plot + TC      |
| `InstancedMesh` para elipsoides continuos       | Performance: 1 draw call vs 11+ meshes                         |
| `WellborePath` compartido con `useSectionColors`| Elimina duplicación, habilita coloring por DLS/riesgo          |
| Split View (3D + Matrix/Panel)                  | UX estilo Halliburton/Innova, sincronizado por `selectedWellId`|
| Traveling Cylinder como vista aparte            | No contamina 3D view, responsive en mobile                     |

- --

## 5. RIESGOS Y MITIGACIONES

| Riesgo                                  | Probabilidad  | Impacto  | Mitigación                                                           |
|----------------------------------------|--------------|---------|---------------------------------------------------------------------|
| **Scope creep** — intentar P1/P2 en MVP | Alta          | Crítico  | **Hard gate**: Solo P0 en proposal. P1+ van a backlog con labels.    |
| **Performance 11+ elipsoides continuos**| Media         | Alto     | LOD strategy en Design: segments 8/16, InstancedMesh, frustum culling|
| **Three.js/r3f version drift**          | Baja          | Medio    | Lock versions en `package.json` + `pnpm-lock.yaml`                   |
| **ISCWSA validation <0.1% error**       | Media         | Alto     | Golden master tests vs ISCWSA standard well paths (Design phase)     |
| **Mobile WebGL limits**                 | Media         | Medio    | Fallback 2D: Traveling Cylinder + Ladder Plot en < 768px             |
| **Competencia lanza feature nueva**     | Baja          | Medio    | Velocidad open-source: slices mensuales, no anuales                  |

- --

## 6. MÉTRICAS DE ÉXITO (SUCCESS METRICS)

| Métrica                    | Baseline   | Target MVP                            | Target Full    |
|---------------------------|-----------|--------------------------------------|---------------|
| **Features vs Competencia**| ~40% parity| **85% parity** (P0 covers killer gaps)| **95%+ parity**|
| **Visual regression tests**| 0          | 4 (1 por slice 3D)                    | 10+            |
| **ISCWSA golden tests**    | 0          | 5 well paths                          | 15 well paths  |
| **A11y score (axe-core)**  | ~60%       | **95%+** (WCAG 2.1 AA)                | 100%           |
| **Bundle size increase**   | 0          | < 50KB gzipped                        | < 100KB        |
| **FPS 11 pozos (mobile)**  | N/A        | **> 30 FPS**                          | > 60 FPS       |
| **PR review time**         | N/A        | **< 30 min** (≤400 líneas)            | < 30 min       |

- --

## 7. ENTREGABLES SDD

| Fase        | Artefacto                                     | Ubicación                                                       |
|------------|----------------------------------------------|----------------------------------------------------------------|
| **Proposal**| Este documento                                | `SDD_PROPOSAL_ANTICOLLISION.md`                                 |
| **Spec**    | Requirements + Scenarios + Acceptance Criteria| `openspec/changes/surpass-competition-anti-collision-3d/spec.md`|
| **Design**  | Arquitectura, APIs, Data Flow, Component Tree | `openspec/changes/.../design.md`                                |
| **Tasks**   | Work units ≤ 400 líneas, dependency graph     | `openspec/changes/.../tasks.md`                                 |
| **Apply**   | Implementación por slices (PRs)               | GitHub PRs chained                                              |
| **Verify**  | Test reports, visual regression, a11y audit   | `verify-report.md`                                              |
| **Archive** | Delta specs sincronizados                     | `archive-report.md`                                             |

- --

## 8. PRÓXIMOS PASOS

1. **Aprobación de scope**: Confirmar MVP P0-only vs incluir P1
2. **`/sdd-spec`**: Especificar requirements detallados por slice
3. **`/sdd-design`**: Definir `UncertaintyEngine` API, component props, store extensions
4. **`/sdd-tasks`**: Breakdown en work units con dependencies
5. **`/sdd-apply`**: Ejecutar S1→S2→S3→S4 en orden

- --

## 9. PREGUNTAS PARA ALINEACIÓN (Decisiones Pendientes)

| Pregunta                                                | Opciones                                                   | Recomendación                                    |
|--------------------------------------------------------|-----------------------------------------------------------|-------------------------------------------------|
| **¿Confirmar MVP P0-only (S1-S4)?**                     | Sí / Añadir P1 (Project-ahead + Alertas + A11y)            | **Sí** — mantener foco, ship rápido              |
| **¿Traveling Cylinder: 2D canvas o 3D Three.js?**       | 2D Canvas (performance mobile) / 3D Three.js (consistencia)| **2D Canvas** — responsive,轻量, estándar industria|
| **¿Split View en MVP o post-MVP?**                      | En MVP (S2) / Post-MVP (P1)                                | **En MVP** — diferencia UX inmediata             |
| ¿Testing visual: Playwright + Firefox only o + Chromium?| Firefox only (headless CI) / Multi-browser                 | **Firefox only** para MVP — CI más rápido        |

- --

* *Decisión**: Si apruebas MVP P0-only con las 4 preguntas arriba → procedo a **Spec Phase**.
