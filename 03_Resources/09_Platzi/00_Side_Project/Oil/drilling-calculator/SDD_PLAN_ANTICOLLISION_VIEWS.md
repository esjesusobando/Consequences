# SDD Plan: Anti-Colisión 3D — Views Integration & Camera Fix

* *Change ID**: `anti-collision-3d-views-integration`
* *Fecha**: 2026-08-23
* *Baseline**: Commit actual (build passing, 3 vistas core funcionando)
* *Objetivo**: Integración correcta Matrix ↔ Panel ↔ 3D con cámara que encuadre 11 trayectorias

- --

## 1. PROBLEMA ACTUAL (Diagnóstico)

| Síntoma                                       | Causa Raíz                                                                                                                                               |
|----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| "Las vistas en 3D no van con las vistas"      | `CameraController` usa `primaryTrajectory` + `entries` para bounds, pero `focusTrigger` solo dispara en mount y cambios de vista, no en selección de pozo|
| Selección en Matrix/Panel no enfoca pozo en 3D| `effectiveSelectedWellId` existe pero `CameraController` no reacciona a su cambio                                                                        |
| WellLegend (light theme) se ve mal en 3D      | CSS conflict resuelto, pero `well-legend-3d` posicionamiento absolute puede tapar canvas en móvil                                                        |
| Split view y Cylinder view rotas/eliminadas   | Correcto — solo 3 vistas core: Matrix, Panel, 3D                                                                                                         |

- --

## 2. PLAN SDD — 3 WORK UNITS ORDENADOS

### **WU-1: CameraController — Sync con Selección de Pozo** (Prioridad: CRÍTICA)

* *Archivo**: `src/components/sections/AntiCollision3D.tsx`

* *Cambios**:
1. Agregar `selectedWellId` y `effectiveSelectedEntry` a props de `CameraController`
2. En `useEffect` de `CameraController`: agregar `selectedWellId` a dependency array
3. Cuando `selectedWellId` cambie: recalcular bounds **solo del pozo seleccionado** (primary + ese adyacente) y enfocar cámara ahí
4. Mantener comportamiento actual para `focusTrigger` (botón "Centrar" = todos los pozos)

* *Acceptance Criteria**:
- [ ] Click en fila Matrix → 3D enfoca ese pozo (zoom centrado en primary + ese adyacente)
- [ ] Click en WellLegend → 3D enfoca ese pozo
- [ ] Botón "Centrar" (Focus) → muestra todos los 11 pozos (comportamiento actual)
- [ ] Cambio de vista Panel → 3D enfoca pozo activo

- --

### **WU-2: Matrix ↔ Panel ↔ 3D State Sync** (Prioridad: ALTA)

* *Archivo**: `src/components/sections/Anticolision.tsx`

* *Cambios**:
1. `setView("3d")` en Matrix action button ya existe ✅
2. En Panel view: botón "Ver en 3D" que haga `setView("3d")` + `setActiveWellId`
3. En 3D view: botón "← Detalle" ya existe, verificar que `setView("panel")` preserve `activeWellId`
4. WellLegend `onSelect` ya llama `setSelectedWellId` → debe disparar camera sync (WU-1)

* *Acceptance Criteria**:
- [ ] Matrix row click → Panel → 3D = mismo pozo seleccionado en los 3
- [ ] Panel "Ver en 3D" → 3D enfoca ese pozo
- [ ] 3D "← Detalle" → Panel muestra mismo pozo
- [ ] WellLegend click → 3D enfoca + Matrix/Panel sync

- --

### **WU-3: WellLegend Light Theme + Responsive Positioning** (Prioridad: MEDIA)

* *Archivos**: `src/components/sections/WellLegend.tsx`, `src/components/sections/Anticolision.css`

* *Cambios**:
1. Verificar que `WellLegend` usa tema light (ya usa `WellLegend.css` — correcto)
2. En `Anticolision.css`: `.well-legend-3d` responsive — en móvil (`<768px`) pasar a `position: static` + `margin-top: 1rem` (ya existe en media query)
3. Agregar `max-width: 280px` para que no tape canvas en desktop
4. Agregar `z-index: 30` para estar sobre canvas pero bajo header 3D

* *Acceptance Criteria**:
- [ ] WellLegend se ve light/brand-kit en 3D view
- [ ] En móvil: legend abajo del canvas, no absolute
- [ ] En desktop: right side, no tapa canvas, scroll si muchos pozos

- --

## 3. SECUENCIA DE EJECUCIÓN (Orden Obligatorio)

```
WU-1 (CameraController) → WU-2 (State Sync) → WU-3 (WellLegend CSS)
     ↓                        ↓                      ↓
  Core fix              Connect views           Polish UI
```

* *Cada WU**: Implement → Build → Test manual → Commit

- --

## 4. CRITERIOS DE ACEPTACIÓN GLOBAL (Definition of Done)

| Check               | Target                                     |
|--------------------|-------------------------------------------|
| **Build**           | `npm run build` ✅ sin errores TS           |
| **Tests**           | `npm test` ✅ 10/10 passing                 |
| **Matrix → 3D**     | Click fila → 3D enfoca pozo                |
| **Panel → 3D**      | Botón "Ver en 3D" enfoca pozo activo       |
| **3D → Panel**      | Botón "← Detalle" abre Panel con mismo pozo|
| **WellLegend click**| 3D enfoca pozo + sync Matrix/Panel         |
| **Botón "Centrar"** | Muestra todos los 11 pozos                 |
| **WellLegend theme**| Light/brand-kit en 3D, responsive móvil    |
| **Build + Tests**   | ✅ PASS                                     |

- --

## 5. RIESGOS Y MITIGACIONES

| Riesgo                               | Mitigación                                                |
|-------------------------------------|----------------------------------------------------------|
| `CameraController` re-render infinito| `useMemo` para bounds, `useRef` para `prevSelectedWellId` |
| State sync loop (3D → Panel → 3D)    | `useRef` guard: solo sync si `wellId` cambió realmente    |
| Mobile legend tapa canvas            | Media query existente + test real en 375px                |
| Performance 11 pozos                 | `CameraController` solo recalcula bounds en cambios reales|

- --

## 6. PRÓXIMO PASO INMEDIATO

* *Ejecutar WU-1**: Modificar `CameraController` en `AntiCollision3D.tsx` para aceptar `selectedWellId` y `effectiveSelectedEntry`, y enfocar cámara cuando cambie.

¿Aprobado para proceder con **WU-1**?
