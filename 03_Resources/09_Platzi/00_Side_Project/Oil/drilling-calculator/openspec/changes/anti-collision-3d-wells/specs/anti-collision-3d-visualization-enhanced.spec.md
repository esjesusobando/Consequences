# Spec: Anti-Collision 3D Visualization Enhancements

## Purpose

This spec enhances the existing AC3D-1 through AC3D-7 requirements with visual quality improvements, better trajectory rendering, and improved user experience for well visibility and legend interaction. It addresses user feedback that current views are "feas" and trajectories are not clearly visible simultaneously.

This spec extends the base requirements defined in `openspec/changes/anti-collision-3d-wells/specs/anti-collision-3d-visualization/spec.md` with additional visual enhancements.

## Enhancement E1: Improved Trajectory Rendering Quality

### E1.1: Line thickness and visibility

- Trajectory lines SHALL use a minimum stroke width of 2px for visibility at small viewport sizes
- Trajectory lines SHALL use `stroke-linecap: round` for smoother appearance at joints
- Adjacent well trajectories SHALL be rendered with 15% lower opacity than the primary well (0.85x) to de-emphasize while still showing relative position

#### Visual Impact

- Primary well trajectories are more prominent
- Adjacent wells remain visible but don't compete visually with the primary
- Improves legibility at small viewport widths (< 800px)

### E1.2: Ellipsoid transparency and detail

- Uncertainty ellipsoids SHALL use `opacity: 0.6` (vs default 1.0) for better overlap visibility
- Ellipsoid edge lines SHALL be `2px` width with `stroke-dasharray: 4 2` for distinction from trajectory lines
- Distance label font size SHALL be `10px` with `line-height: 1.2` for readability

#### Visual Impact

- Multiple ellipsoids can be seen overlapping without complete occlusion
- Distance labels are clearly readable even with multiple entries
- Improved visual hierarchy between trajectories and error regions

### E1.3: Camera minimum distance

- The camera SHALL maintain a minimum distance of `bounds.cameraDistance * 0.8` from the scene center to ensure all wells have margin
- Camera SHALL NOT zoom in beyond the point where well labels overlap

#### Visual Impact

- Prevents "too close" views where trajectories merge visually
- Ensures consistent minimum view quality across all wells configurations

## Enhancement E2: Legend Visual Improvements

### E2.1: Legend item padding and spacing

- Legend item rows SHALL have `padding: 8px 12px` (vs default tighter spacing)
- Inter-row spacing SHALL be `12px` (vs 8px default) for better touch target and visual separation
- Selected row SHALL have `background: rgba(255,255,255,0.1)` with `border-radius: 4px`

#### Visual Impact

- Legend is more scannable and easier to target with mouse clicks
- Better separation between entries reduces accidental selection
- Improved accessibility with larger hit areas

### E2.2: Risk badge color contrast

- Risk badges SHALL use `color: white` on `background-color` that matches the well's palette color at `0.2` opacity
- Minimum contrast ratio SHALL be 4.5:1 per WCAG AA for the risk level text

#### Visual Impact

- Risk levels (SAFE/MONITOR/PRECAUCIÓN/CRÍTICO) are immediately legible
- Color-blind friendly palettes are used (avoiding red-green only distinctions)
- Consistent visual language across all legend items

### E2.3: Eye toggle icon animation

- Eye toggle SHALL have a subtle scale animation (`scale: 1` to `1.1` on hover)
- Eye icon color SHALL invert when toggled (visible: `#ff6b6b`, hidden: `#aaa`)
- Hover tooltip SHALL show "Ocultar pozo" / "Mostrar pozo" with proper localization

#### Visual Impact

- Eye toggles are more noticeable and interactive-feeling
- Clear visual feedback when state changes
- Improved UX for hiding/showing wells

## Enhancement E3: Camera and Framing Improvements

### E3.1: Initial camera offset

- Initial camera distance SHALL be `bounds.cameraDistance * 1.15` (15% more margin) instead of the base value
- Camera SHALL initially pan to center on the geometric mean of all visible well positions

#### Visual Impact

- Wells are immediately visible without user intervention
- Camera respects the full spread of well positions from the start

### E3.2: Field of view adjustment

- Initial field of view SHALL be `fov: 50` (vs default) for slightly wider viewing angle
- This ensures more wells fit in the viewport without needing immediate panning

#### Visual Impact

- More wells visible on initial load
- Reduced need for user panning/zooming to see all wells

## Enhancement E4: Color Palette Enhancement

### E4.1: Extended palette for 8+ wells

- The palette SHALL support up to 8 wells with distinct colors
- Well 6 color: `#4ecdc4`
- Well 7 color: `#ffe66d`
- Well 8 color: `#fab1a0` (new addition for 8+ well scenarios)

#### Visual Impact

- Scenarios with 6-8 wells no longer share colors
- Clear differentiation even in dense well configurations

### E4.2: Primary well color emphasis

- Primary well SHALL use `color: #ff006e` (vs the standard palette first color) for immediate visual distinction
- This applies both in the 3D view and legend

#### Visual Impact

- Primary well is immediately identifiable even before reading labels
- Consistent visual hierarchy across all views

## Enhancement E5: Tooltip and Hover Enhancements

### E5.1: Sticky tooltip on hover

- Tooltips SHALL remain visible for `300ms` after mouse leaves the legend row
- Tooltip SHALL follow mouse position with `transform: translateY(-100%)` to appear above the legend
- Tooltip SHALL have a maximum width of `300px` and wrap text appropriately

#### Visual Impact

- Users can read tooltip details without having to precisely hover
- Information is accessible even on quick hovers

### E5.2: Tooltip content hierarchy

- Tooltip SHALL show: well name (bold, 14px) | risk level (12px, color-coded) | min distance (11px, "ft" suffix)
- Secondary info (ellipsoid details) SHALL be on a second line if space permits

#### Visual Impact

- Information is scannable at a glance
- Critical information (name, risk, distance) is immediately visible
- Secondary details are available but don't compete visually

## Implementation Notes

### Technical Requirements

1. **Palette extension**: The `wellColor()` function in `scene.ts` SHALL be extended to support wellId values beyond the original 8-index circular hash, using a deterministic but extended hash scheme.

2. **Shader/material updates**: `AntiCollision3D.tsx` SHALL update line thickness, ellipse opacity, and font sizes via the existing Three.js material properties without introducing new dependencies.

3. **Legend component updates**: `WellLegend.tsx` SHALL receive new props for `lineThickness`, `ellipseOpacity`, and `paletteSize` to propagate the enhanced visuals.

4. **Camera controller updates**: The `CameraController` SHALL accept optional `cameraDistanceMultiplier` and `fov` props to implement E3.1 and E3.2.

5. **No breaking changes**: All enhancements SHALL be backward-compatible - existing configurations with < 8 wells and default palette settings SHALL render identically to before.

### Test Coverage

New TDD tests SHALL be added to validate:
- E1.1-E1.3: Trajectory line thickness, ellipsoid opacity, camera minimum distance
- E2.1-E2.3: Legend spacing, risk badge contrast, eye toggle animation
- E3.1-E3.2: Camera initial distance and field of view
- E4.1-E4.2: Palette extension for 8 wells, primary well emphasis
- E5.1-E5.2: Tooltip sticky behavior, content hierarchy

All new tests SHALL pass alongside the existing 217 tests without modification to existing test assertions.

### Acceptance Criteria

- [ ] All existing 217 tests continue passing
- [ ] Visual enhancements render without JavaScript errors
- [ ] Backward compatibility: existing configurations render identically
- [ ] New palette supports up to 8 wells with distinct colors
- [ ] Camera initial view includes all wells with 15% margin
- [ ] Legend has improved spacing and risk badge contrast
- [ ] Eye toggle animation provides feedback on state change
- [ ] Tooltip stays visible 300ms after mouse leaves

## Revision History

| Version  | Date      | Author      | Changes  |
|---------|----------|------------|---------|
| 1.0.0    | 2026-08-16| Jesus_Obando|
