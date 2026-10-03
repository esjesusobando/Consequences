# Anti-Colisión 3D - Pendientes para Próxima Sesión

* *Fecha**: 2026-08-22  
* *Commit Base**: 328116b9f (feat: integrate Platzi Context Engineering skill + update OS)  
* *Branch**: fix/review-corrections  
* *Base Commit**: 621592ed8 (estado original AntiCollision3D)

- --

## ✅ COMPLETADO EN SESIÓN ACTUAL

### Cambios Aplicados a AntiCollision3D.tsx (vs commit 621592ed8)

| Feature                   | Antes (621592ed8)                                  | Ahora (HEAD)                                                           | Estado  |
|--------------------------|---------------------------------------------------|-----------------------------------------------------------------------|--------|
| **Ambient Light**         | `0.5`                                              | `0.8`                                                                  | ✅       |
| **Fog**                   | NONE                                               | `<fogExp2 attach="fog" args={["#0a0a0f", 0.0004]} />`                  | ✅       |
| **Contact Shadows**       | NONE                                               | `ContactShadows` (opacity 0.45, scale 4000)                            | ✅       |
| **Wellbore Path Segments**| `12`                                               | `16`                                                                   | ✅       |
| **Emissive Intensity**    | `0.15`                                             | `0.6`                                                                  | ✅       |
| **Metalness**             | `0.8`                                              | `0.9`                                                                  | ✅       |
| **Roughness**             | `0.2`                                              | `0.15`                                                                 | ✅       |
| **Tone Mapped**           | `true` (default)                                   | `false`                                                                | ✅       |
| **Tube Radius**           | `2`                                                | `2` (sin cambio)                                                       | —       |
| **Labels Wellbore**       | `color: emissiveColor, size: 12px, textShadow: 4px`| `#fff, 14px, bg rgba(0,0,0,0.85), border 2px, multi-glow`              | ✅       |
| **Labels Axis**           | `color: #ff3e3e/#00ff00/#00b4d8, 14px, 4px shadow` | `#fff, 16px, bg rgba, border 2px, multi-glow`                          | ✅       |
| **Camera Bounds**         | Solo primary + adjacent                            | **ALL wells** (primary + entries.flatMap)                              | ✅       |
| **Auto-frame**            | Solo focusTrigger change                           | **Mount (focusTrigger=0) + focusTrigger change**                       | ✅       |
| **Props 3D**              | Básicas                                            | `entries, selectedWellId, wellColors, onSelectWell, onToggleVisibility`| ✅       |
| **Fog**                   | `<Fog>` (drei - CRASH)                             | `<fogExp2>` nativo THREE.FogExp2                                       | ✅       |
| **Contact Shadows**       | NONE                                               | ✅ Agregado                                                             | ✅       |

### Props Extendidas (AntiCollision3DProps)

```typescript
interface AntiCollision3DProps {
  // ... existing ...
  entries?: CollisionEntry[];
  selectedWellId?: string | null;
  wellColors?: Record<string, string>;
  onSelectWell?: (wellId: string) => void;
  onToggleVisibility?: (wellId: string) => void;
}
```

### Props Anticolision.tsx (línea 770-781)

```tsx
<AntiCollision3D
  primaryTrajectory={primaryTrajectoryToAnalyze}
  adjacentTrajectory={activeEntry?.trajectory ?? []}
  result={activeResult}
  wellData={wellData}
  onClose={() => setView("matrix")}
  entries={matrix}
  selectedWellId={effectiveSelectedWellId}
  hiddenWellIds={hiddenWellIds}
  wellColors={wellColors}
  onSelectWell={setSelectedWellId}
  onToggleVisibility={toggleWellVisibility}
/>
```

### Botón 3D Habilitado (línea 395)

```tsx
disabled={matrix.length === 0}  // Antes: disabled={!activeEntry}
```

### Props Anticolision.tsx → AdjacentWells

```typescript
const [adjacentWells, setAdjacentWells] = useState<AdjacentWellInput[]>(() => {
  return MOCK_WELLS.map(getPresetAsAdjacent);  // 11 pozos por defecto
});
```

### CSS Brand-Kit (Anticolision.css - 794 líneas)

- View switcher, export actions, matrix toolbar, matrix table
- Risk pills con gradientes brand-kit
- 3D view wrapper + header + well-legend-3d positioning
- Responsive breakpoints: 1024px, 768px
- WellLegend 3D styles completos

- --

## 📋 PENDIENTES PARA PRÓXIMA SESIÓN

### 🔴 PRIORIDAD ALTA

#### 1. Panel Detail View - Mostrar TODAS las trayectorias

* *Archivo**: `Anticolision.tsx` (líneas 539-742)
* *Problema**: Panel "Detalle" solo muestra trayectorias del `activeEntry` (1 pozo adyacente)
* *Solución**: Agregar mini-3D view o lista completa con todas las trayectorias de `matrix`
```tsx
// En panel view, agregar:
<AntiCollision3D
  primaryTrajectory={primaryTrajectoryToAnalyze}
  entries={matrix}  // TODAS las trayectorias
  // ...
/>
```

#### 2. Refactor WellborePath Inline → Componente Compartido

* *Archivo**: `AntiCollision3D.tsx` líneas 194-247
* *Problema**: WellborePath inline duplica lógica de `WellborePath.tsx` compartido
* *Solución**: Importar `WellborePath` de `../visuals/WellborePath` y usar `useSectionColors` prop

#### 3. Elipsoides Solo Para Primera Entrada

* *Línea 688**: `{entry === entries?.[0] && !isHidden && (`
* *Problema**: Solo primera entrada (highest risk) muestra elipsoides
* *Opciones**: 
- Mostrar para todas con `riskLevel >= CAUTION`
- O agregar toggle en legend para mostrar/ocultar elipsoides

- --

### 🟡 PRIORIDAD MEDIA

#### 4. Legend 3D Positioning - Responsive

* *CSS**: `.well-legend-3d { position: absolute; top: 80px; right: 16px; }`
* *Problema**: Posición absoluta fija puede solapar canvas en móviles
* *Verificar**: 
- Media query 768px: `.well-legend-3d { position: static; margin-top: 1rem; }`
- Verificar z-index no solape canvas

#### 5. Color Palette 11 Colores - Distribución

* *scene.ts**: `SCENE_COLORS` expandido a 11 colores
* *wellColor()**: Usa `stableHash % SCENE_COLORS.length`
* *Verificar**: 11 pozos → 11 colores únicos (sin duplicados)

#### 6. Tests 3D con Playwright + Firefox

* *Estado**: 225/225 tests pasan (unit/integration)
* *Falta**: Tests visuales 3D con Playwright + Firefox
```bash
npx playwright install firefox
# Agregar tests en Anticolision.test.tsx para vista 3D

```

- --

### 🟢 PRIORIDAD BAJA / NICE TO HAVE

#### 7. Performance 10+ Pozos

- 11 tube geometries + 11 labels + 11 ellipsoids (potencial)
- Verificar FPS en dispositivos bajos
- Considerar LOD (level of detail) para pozos lejanos

#### 8. Accessibility (a11y)

- Labels 3D sin `aria-labels`
- Canvas sin `role="img"` + `aria-label`
- Keyboard navigation para 3D

#### 8. Keyboard Navigation 3D

- OrbitControls sin keyboard shortcuts
- Agregar WASD/arrows para navegación teclado
- `OrbitControls.enableKeys = true` + custom keydown handler

#### 9. LOD (Level of Detail)

- Pozos lejanos: reducir segments, simplificar material
- Frustum culling para pozos fuera de vista

#### 10. Ellipsoids Toggle en Legend

- Agregar checkbox en WellLegend 3D para mostrar/ocultar elipsoides
- Solo mostrar para `riskLevel >= CAUTION` por defecto

- --

## 📁 ARCHIVOS CLAVE PARA PRÓXIMA SESIÓN

| Archivo                                        | Líneas  | Prioridad        |
|-----------------------------------------------|--------|-----------------|
| `src/components/sections/AntiCollision3D.tsx`  | 764     | 🔴 ALTA           |
| `src/components/sections/Anticolision.tsx`     | 787     | 🔴 ALTA           |
| `src/components/sections/Anticolision.css`     | 794     | 🟡 MEDIA          |
| `src/components/sections/Anticolision.test.tsx`| 216     | 🟡 MEDIA          |
| `src/engine/scene.ts`                          | ~140    | 🟡 MEDIA          |
| `src/components/visuals/WellborePath.tsx`      | 398     | 🔴 ALTA (refactor)|

- --

## 📦 COMANDOS ÚTILES PARA PRÓXIMA SESIÓN

```bash
# Tests

cd /c/Users/sebas/Desktop/Think_Different/01_Personal_Os/06_Projects/00_Projects_Lab/00_Side_Project/Oil/drilling-calculator
npm test

# Build

npm run build

# Dev server

npm run dev  # → http://localhost:5173+

# Tests visuales (Firefox)

npx playwright install firefox
npx playwright test tests/visual/3d-view.spec.ts

# Lint/Typecheck

npm run lint
npx tsc --noEmit
```

- --

## 📌 NOTAS PARA PRÓXIMA SESIÓN

1. **Empezar por**: Panel Detail View (tarea 1) - mayor impacto visual/UX
2. **Luego**: Refactor WellborePath inline (tarea 2) - limpieza técnica
3. **Luego**: Elipsoides para todas las entradas (tarea 3)
4. **Testing**: Playwright + Firefox para validación visual
5. **Performance**: Profile con 11 pozos antes de optimizar

* *Commit base**: `328116b9f` - Todo funcional, tests passing, build clean
