# SDD Explore: Anti-Colisión 3D — Diagnóstico Competitivo vs Estado Actual

* *Fecha**: 2026-08-22
* *Change ID**: `surpass-competition-anti-collision-3d`
* *Commit Base**: 328116b9f (branch `fix/review-corrections`)
* *Tests**: 225/225 | **Build**: clean

- --

## 1. RESUMEN EJECUTIVO

El modulo **Anti-Colisión 3D (ISCWSA R-Type)** del Drilling Calculator ya tiene una base tecnica solida:
- Motor matematico ISCWSA completo (SF, elipsoides 95%, matriz multi-pozo)
- Vista 3D interactiva con 11+ trayectorias ("spaghetti pipes")
- Brand-kit visual completo (colores, tipografia, contraste, sombras)
- Legend interactiva (seleccion, toggle visibilidad, colores estables)
- Export CSV + Reporte narrativo markdown
- Auto-seed demo con 11 pozos MOCK_WELLS

* *PERO**: La competencia (Halliburton LOGIX, Innova VANTAGE, Baker Hughes WellArchitect) ya ofrece **visualizacion de incertidumbre 3D continua, traveling cylinder plots, alertas en tiempo real, y dashboards remotos** -- caracteristicas que **nos faltan completamente**.

- --

## 2. ANALISIS COMPETITIVO 2026

### 2.1 Halliburton LOGIX Collision Avoidance Service

| Feature              | Estado  | Detalle Clave                                                                                        |
|---------------------|--------|-----------------------------------------------------------------------------------------------------|
| 3D Web-based         | Si      | "Customizable 3D visualization and displays of multiple wells" -- cualquier dispositivo con navegador|
| Real-time alerts     | Si      | "On-screen pop-ups, email, or text" -- hardline alerts                                               |
| Traveling Cylinder 3D| Si      | "Manipulatable 3D plot of planned and offset wellbores"                                              |
| Project-ahead        | Si      | "Adjustable project-ahead features" -- proyeccion hacia adelante del bit                             |
| Dashboard remoto     | Si      | "Customizable dashboard with multiple viewing tools"                                                 |
| Multi-device         | Si      | "Compatible with any device with a web browser"                                                      |
| Error models         | Si      | ISCWSA MWD/Gyro completos + custom IPM                                                               |

* *Gap critico**: Nosotros **no tenemos** traveling cylinder, project-ahead, alertas en tiempo real, ni dashboard remoto.

- --

### 2.2 Innova VANTAGE (Well Seeker X + Cloud)

| Feature                    | Estado  | Detalle Clave                                                                                                                            |
|---------------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------|
| 3D Survey View             | Si      | "Fully interactive environment where you can explore your wellbore in true spatial context"                                              |
| Elipsoides 3D continuos    | Si      | "Ellipse of uncertainty... fully visualized and interactive... true 3D ellipsoid that reflects positional uncertainty in every direction"|
| Conos de incertidumbre     | Si      | "Transformed into cones, projecting that uncertainty outward and forward along the well path"                                            |
| Zonas depletadas           | Si      | "Depleted zones can be toggled on... highlighted in red"                                                                                 |
| Travelling Cylinder Plot   | Si      | "Specialised anti-collision plot... distance represents C2C, bearing from highside or true north"                                        |
| Ladder Plot + SF Plot      | Si      | "Advanced anti-collision visualization tools available"                                                                                  |
| Real-time AC dashboard     | Si      | "Office personnel remotely monitor anti-collision status of all active wells on one screen"                                              |
| Error models completos     | Si      | "Full range of ISCWSA MWD and Gyro error models... validated against ISCWSA standard well paths to < 0.1% error"                         |
| Casing/hole diameters en SF| Si      | "Included in separation factor calculation... especially important for top hole drilling"                                                |
| WPTS Separation Rule + MASD| Si      | "Implementation of latest anti-collision standards"                                                                                      |

* *Gap critico**: Nosotros **solo mostramos elipsoides en el punto de maximo acercamiento (1 par)**, no continuos a lo largo del wellbore. **No tenemos** conos de incertidumbre, traveling cylinder, ladder plot, zonas depletadas, ni dashboard multi-pozo remoto.

- --

### 2.3 Baker Hughes WellArchitect + CoViz 4D

| Feature                                      | Estado                                          |
|---------------------------------------------|------------------------------------------------|
| MASD (Minimum Allowable Separation Distance) | Si - Visualizado en 3D                          |
| Collision-avoidance symbols                  | Si - Espacio disponible para steer away         |
| Real-time WITSML updates                     | Si - 3D visualization updated from WITSML server|
| Automated clearance calculations ahead-of-bit| Si                                              |
| Integration seismic/geologic/reservoir       | Si - CoViz 4D                                   |
| Cross-section slicing along wellpath         | Si - Para geosteering                           |

* *Gap critico**: Integracion subsuelo (sismica, geologia), MASD visual, symbols de steer-away, real-time WITSML.

- --

## 3. DIAGNOSTICO ESTADO ACTUAL (NUESTRO CODIGO)

### 3.1 Fortalezas (Lo que YA supera a competencia)

| Area                         | Evidencia en Codigo                                                                           | Ventaja                                          |
|-----------------------------|----------------------------------------------------------------------------------------------|-------------------------------------------------|
| Open Source / Zero License   | Todo el codigo en repo, sin vendor lock-in                                                    | Cero costo licenciamiento                        |
| Matematicas ISCWSA auditables| anti-collision.ts: stationCovariance, eigenSym3, SF R-type                                    | Caja de cristal vs black box propietario         |
| Brand-kit visual superior    | Anticolision.css 794 lineas, AntiCollision3D.tsx fogExp2, ContactShadows, labels high-contrast| Estetica "Silicon Valley" vs UI legacy enterprise|
| React/Web-native             | @react-three/fiber, @react-three/drei, Vite                                                   | Sin instalacion, corre en navegador              |
| Color stability (D6)         | scene.ts:wellColor() -- hash determinista por wellId                                          | Colores no cambian al re-ordenar por riesgo      |
| Multi-well matrix real-time  | analyzeCollisionMatrix() -- 11 pozos, sort por riesgo                                         | Matriz completa vs single-pair tables            |
| AI Risk Narrative            | riskNarrative() -- texto ejecutivo en espanol                                                 | Comunicacion a management sin ingeniero          |
| Export HSE-compliant         | CSV + Markdown narrative                                                                      | Listo para auditoria                             |

- --

### 3.2 Debilidades Criticas (Gaps vs Competencia)

| Gap                                        | Competencia                                            | Nuestro Estado                                  | Archivo Afectado                                 |
|-------------------------------------------|-------------------------------------------------------|------------------------------------------------|-------------------------------------------------|
| Elipsoides de incertidumbre CONTINUOS      | Innova: "along the wellbore... true 3D ellipsoid"      | Solo en closest-approach (1 par)                | AntiCollision3D.tsx:688 -- entry === entries?.[0]|
| Conos de incertidumbre (proyeccion forward)| Innova: "transformed into cones... outward and forward"| Ausente                                         | Nuevo componente                                 |
| Traveling Cylinder Plot (2D/3D)            | Halliburton, Innova, Baker Hughes                      | Ausente                                         | Nuevo componente + vista                         |
| Ladder Plot + Separation Factor Plot       | Innova: "Ladder Plot, Separation Factor Plot"          | Ausente                                         | Nuevo componente                                 |
| Project-ahead (proyeccion bit)             | Halliburton: "adjustable project-ahead"                | Ausente                                         | Nuevo motor                                      |
| Alertas en tiempo real                     | Halliburton: "pop-ups, email, text"                    | Ausente                                         | Nuevo sistema                                    |
| Dashboard multi-pozo remoto                | Innova: "monitor all active wells on one screen"       | Ausente                                         | Nueva vista                                      |
| Zonas depletadas / lease lines             | Innova: "depleted zones toggled... highlighted red"    | Ausente                                         | Nuevo overlay                                    |
| MASD visual                                | Baker Hughes: "show MASD from reference wellpath"      | Ausente                                         | Nuevo overlay                                    |
| Casing/hole diameters en SF                | Innova: "included in SF calculation"                   | Solo center-to-center                           | anti-collision.ts                                |
| Custom IPM (Instrument Performance Models) | Innova: "Ability to create custom IPM"                 | Solo MWD/GYRO/SENSOR hardcoded                  | anti-collision.ts:ISCWSA_ERRORS                  |
| WPTS Separation Rule (k=3.5 HSE)           | Innova: "Implementation of latest standards"           | Solo k=2.0 y 3.5 en dropdown, sin regla completa| Anticolision.tsx:sfK                             |
| Keyboard navigation 3D                     | Estandar web a11y                                      | Solo OrbitControls mouse                        | AntiCollision3D.tsx                              |
| Accessibility (aria-labels, screen reader) | WCAG 2.1 AA                                            | Canvas sin role/aria                            | AntiCollision3D.tsx                              |

- --

### 3.3 Deuda Tecnica Identificada (Pendientes previos + nueva)

| #  | Item                                             | Severidad  | Archivo/Linea                                  |

|---|-------------------------------------------------|-----------|-----------------------------------------------|
| 1  | Panel Detail solo muestra 1 pozo                 | Alta       | Anticolision.tsx:539-742                       |
| 2  | WellborePath inline duplicado                    | Alta       | AntiCollision3D.tsx:194-247 vs WellborePath.tsx|
| 3  | Elipsoides solo 1ra entrada                      | Alta       | AntiCollision3D.tsx:688                        |
| 4  | Legend 3D positioning responsive                 | Media      | Anticolision.css:.well-legend-3d               |
| 5  | Color palette 11 colores - verificar distribucion| Media      | scene.ts:SCENE_COLORS                          |
| 6  | Tests visuales 3D (Playwright + Firefox)         | Media      | Anticolision.test.tsx                          |
| 7  | Performance 11+ pozos (FPS bajo)                 | Baja       | Profile needed                                 |
| 8  | A11y: labels 3D sin aria, canvas sin role        | Baja       | AntiCollision3D.tsx                            |
| 9  | Keyboard nav 3D (WASD/arrows)                    | Baja       | OrbitControls                                  |

- --

## 4. ANALISIS UX/UI -- BRAND KIT Y CONTRASTE

### 4.1 Brand Kit Actual (Bien Implementado)

```css
/* Anticolision.css -- tokens usados correctamente */
- -sh-lima: #cbff6a           /* Accent principal */
- -color-azure: #00b4d8       /* Pozo principal */
- -color-critical: #ef4444    /* Risk CRITICAL */
- -color-coral: #f43f5e       /* Risk CAUTION */
- -color-warning: #f59e0b     /* Risk MONITOR */
- -color-safe: #22c55e        /* Risk SAFE */
- -sh-grey-50 a --sh-grey-900 /* Escala neutra completa */
- -radius-pill, --radius-control, --radius-card /* Radius system */
- -shadow-premium             /* Sombras elevadas */
```

* *Contraste verificado**:
- Labels 3D: #fff sobre rgba(0,0,0,0.85) + border 2px solid currentColor + multi-layer text-shadow --> WCAG AAA
- Axis labels: #fff 16px, bg rgba, border 2px, multi-glow --> WCAG AAA
- Risk pills: Gradientes + bordes + white text en CRITICAL --> WCAG AA+
- Matrix rows: border-left 3px colored + gradient bg --> Diferenciacion clara sin solo color

### 4.2 Oportunidades de Mejora UX

| Area                    | Problema                                        | Solucion Competitiva                                       |
|------------------------|------------------------------------------------|-----------------------------------------------------------|
| Information density     | Matrix table requiere scroll horizontal en movil| Innova: responsive cards + progressive disclosure          |
| Cognitive load          | Demasiados numeros en critical-table            | Innova: visual ellipsoids + cones "intuitive understanding"|
| Context switching       | 3 vistas separadas (Matrix/Panel/3D)            | Halliburton: unified dashboard con panels colapsables      |
| Empty states            | "Carga datos" generico                          | Innova: guided onboarding + demo data auto-load            |
| Tooltips/contextual help| Solo title attributes                           | Innova: hover icons con explicaciones contextuales         |

- --

## 5. MAPA DE FUNCIONALIDADES -- ESTADO vs OBJETIVO

```
FUNCIONALIDAD ANTI-COLISION 3D

CATEGORIA        | ESTADO ACTUAL | COMPETENCIA  | ACCION REQUERIDA
- ----------------|---------------|--------------|------------------
MATEMATICAS      |               |              |
ISCWSA R-Type SF | Completo      | Estandar     | Mantener + validar <0.1%
Elipsoides 95%   | En closest    | Continuos    | EXTENDER a todo wellbore
Error models     | 3 fijos       | Custom IPM   | AGREGAR IPM editor
Casing en SF     | No            | Si           | AGREGAR diametros
WPTS k=3.5 rule  | Solo k        | Regla        | IMPLEMENTAR regla completa
3D VISUALIZACION |               |              |
Spaghetti pipes  | 11 pozos      | Estandar     | Mantener + LOD
Elipsoides cont. | Solo 1 par    | Continuos    | NUEVO: UncertaintyTube
Conos forward    | No            | Innova       | NUEVO: UncertaintyCone
Traveling Cylinder| No           | Todos        | NUEVA VISTA 2D/3D
Ladder Plot      | No            | Innova       | NUEVA VISTA
Separation Plot  | No            | Innova       | NUEVA VISTA
MASD visual      | No            | Baker H.     | NUEVO OVERLAY
Zonas depletadas | No            | Innova       | NUEVO OVERLAY
REAL-TIME / OPS  |               |              |
Alertas RT       | No            | Halliburton  | NUEVO: WebSocket + notify
Project-ahead    | No            | Halliburton  | NUEVO: Projection engine
Dashboard remoto | No            | Innova       | NUEVA: Multi-well dashboard
WITSML ingest    | No            | Baker H.     | FUTURO: Integracion
UX / A11Y        |               |              |
Keyboard 3D      | No            | Estandar web | AGREGAR WASD/arrows
Screen reader    | No            | WCAG 2.1 AA  | AGREGAR aria + role
Responsive 3D    | Parcial       | Mobile-first | MEJORAR legend positioning
Color blind safe | Palette       | Estandar     | Verificar 11 colores
```

- --

## 6. PRIORIZACION ESTRATEGICA (RICE + Diferenciacion)

| Iniciativa                  | Reach  | Impact  | Confidence  | Effort  | RICE  | Diferenciacion                              | Prioridad  |
|----------------------------|-------|--------|------------|--------|------|--------------------------------------------|-----------|
| Elipsoides continuos + Conos| 100%   | 10      | 0.9         | 3       | 300   | KILLER FEATURE -- nadie open-source lo tiene| P0         |
| Traveling Cylinder Plot     | 90%    | 9       | 0.8         | 4       | 162   | Visual estandar industria                   | P0         |
| Panel Detail multi-pozo     | 100%   | 8       | 0.95        | 2       | 380   | UX inmediato -- usuario ve TODO             | P0         |
| WellborePath refactor       | 100%   | 7       | 1.0         | 1       | 700   | Limpieza tecnica habilitadora               | P0         |
| Project-ahead engine        | 70%    | 9       | 0.7         | 5       | 88    | Real-time ops parity                        | P1         |
| Alertas RT (WebSocket)      | 60%    | 8       | 0.6         | 6       | 48    | Enterprise parity                           | P1         |
| Custom IPM Editor           | 40%    | 7       | 0.8         | 4       | 56    | Power user differentiation                  | P2         |
| Ladder Plot + SF Plot       | 50%    | 6       | 0.8         | 3       | 80    | Analysis depth                              | P2         |
| MASD / Depleted zones       | 40%    | 7       | 0.7         | 4       | 49    | Geosteering integration                     | P2         |
| A11y + Keyboard 3D          | 100%   | 5       | 1.0         | 2       | 250   | Compliance + inclusividad                   | P1         |
| Performance LOD             | 100%   | 6       | 0.7         | 3       | 140   | Escalabilidad                               | P2         |
| Dashboard remoto multi-pozo | 30%    | 8       | 0.5         | 8       | 15    | Enterprise saleable                         | P3         |

- --

## 7. DECISIONES ARQUITECTONICAS CLAVE

### 7.1 Motor de Incertidumbre Continuo

* *Decision**: Crear `UncertaintyEngine` puro (sin React/Three) que calcule elipsoides por estacion y genere geometrias para Three.js.

```typescript
// Nueva API pura
interface UncertaintyStation {
  md: number;
  center: Vec3;
  axes: [number, number, number];  // semi-ejes ordenados
  rotation: number[];               // matriz 3x3 row-major
}

function computeUncertaintyProfile(
  trajectory: TrajectoryPoint[],
  tool: SurveyTool,
  k: number = DEFAULT_ELLIPSE_K
): UncertaintyStation[]
```

* *Por que**: Separacion de responsabilidades (Ponytail: "stdlib does it"), testable sin Three.js, reutilizable para Traveling Cylinder + Ladder Plot.

- --

### 7.2 Componente Shared WellborePath

* *Decision**: Extraer `WellborePath` de `AntiCollision3D.tsx:194-247` a `src/components/visuals/WellborePath.tsx` existente, anadir prop `useSectionColors` para colorear por seccion MD (DLS, formacion, riesgo).

- --

### 7.3 Vista Unificada (Dashboard Style)

* *Decision**: Mantener 3 vistas (Matrix/Panel/3D) pero agregar **Split View** -- 3D a la izquierda, Matrix/Panel a la derecha, sincronizados por `selectedWellId`. Estilo Halliburton/Innova dashboard.

- --

### 7.4 State Management para Real-Time

* *Decision**: Preparar `drilling-store` con `subscribeToWellUpdates(wellId, callback)` para futuro WebSocket/WITSML. No implementar backend ahora -- solo interfaz.

- --

## 8. RIESGOS Y MITIGACIONES

| Riesgo                               | Probabilidad  | Impacto  | Mitigacion                                                                          |
|-------------------------------------|--------------|---------|------------------------------------------------------------------------------------|
| Scope creep -- intentar todo a la vez| Alta          | Critico  | SDD phases estrictas: Explore->Propose->Spec->Design->Tasks->Apply. Un slice por PR.|
| Performance 11+ elipsoides continuos | Media         | Alto     | LOD: segments 16->8 para pozos lejanos, frustum culling, instanced mesh             |
| Three.js r3f version drift           | Baja          | Medio    | Lock @react-three/fiber @react-three/drei versions en package.json                  |
| ISCWSA validation <0.1% error        | Media         | Alto     | Golden master tests vs well paths estandar (ISCWSA test cases)                      |
| Browser WebGL limits (mobile)        | Media         | Medio    | Fallback a 2D plots (Traveling Cylinder + Ladder) en mobile                         |
| Competencia lanza feature nueva      | Baja          | Medio    | Open-source velocity: ship slices mensuales, no anuales                             |

- --

## 9. PROXIMOS PASOS SDD

1. **Proposal** (`surpass-competition-anti-collision-3d`): Definir scope MVP (P0 only) vs Full
2. **Spec**: Requirements funcionales detallados + acceptance criteria por feature
3. **Design**: Arquitectura `UncertaintyEngine`, componentes 3D, state sync, API types
4. **Tasks**: Breakdown en work units <= 400 lineas c/u (chained PRs si > 400)
5. **Apply**: Implementar por prioridad RICE
6. **Verify**: Visual regression (Playwright) + ISCWSA golden tests + a11y audit

- --

## 10. ARTEFACTOS DE REFERENCIA

| Archivo                                      | Rol                                                           |
|---------------------------------------------|--------------------------------------------------------------|
| src/components/sections/AntiCollision3D.tsx  | Vista 3D principal (764 lineas)                               |
| src/components/sections/Anticolision.tsx     | Contenedor + Matrix + Panel + 3D (787 lineas)                 |
| src/components/sections/Anticolision.css     | Brand-kit completo (794 lineas)                               |
| src/components/sections/WellLegend.tsx       | Legend interactiva (jsdom-testable)                           |
| src/components/visuals/WellborePath.tsx      | Componente compartido (398 lineas) -- REFERENCIA PARA REFACTOR|
| src/engine/anti-collision.ts                 | Motor ISCWSA Phase I (matematicas puras)                      |
| src/engine/scene.ts                          | Colores estables, frame comun, bounds visibles                |
| src/engine/mock-wells.ts                     | 11 presets para demo/testing                                  |
| src/store/drilling-types.ts                  | Types: TrajectoryPoint, CollisionResult, Ellipsoid3D, etc.    |
| src/components/sections/Anticolision.test.tsx| 225 tests (unit + integration)                                |

- --

## 11. CONCLUSION

* *Tenemos la matematica correcta (ISCWSA R-Type) y una base visual superior (brand-kit, React/Web-native, open source).**

* *Nos faltan las visualizaciones que convierten la matematica en "comprension intuitiva" (Innova): elipsoides continuos, conos forward, traveling cylinder, ladder plot.**

* *La estrategia ganadora**: **Entregar lo que la competencia cobra $50k+/ano, gratis y open-source, con mejor UX y matematicas auditables.**

* *MVP recomendado (P0 only, ~3-4 PRs chained)**:
1. Refactor WellborePath (habilitador)
2. Panel Detail multi-pozo (valor inmediato)
3. UncertaintyEngine + Elipsoides continuos + Conos (killer feature)
4. Traveling Cylinder Plot (estandar industria)

- --

* *Proximo paso**: `/sdd-new surpass-competition-anti-collision-3d` para crear la propuesta formal.
