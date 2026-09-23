# _visuals_archive

Componentes 3D huérfanos y rotos del diseño previo de la vista 3D anti-colisión.
INFORMACIÓN CONSERVADA, NO COMPILAN (imports a módulos inexistentes: uncertainty-tube, etc.).

Todos estos componentes ya existen en versión funcional dentro de:
`src/components/sections/AntiCollision3D.tsx` (WellborePath, UncertaintyEllipsoid,
ClosestApproachMarker, SurveyStationMarkers, SurfaceMarker, DepthScale, RiskMatrixPanel).

- WellRenderer.tsx — master renderer 3D antiguo (roto)
- GlowEffect.tsx — post-procesado glow (roto)
- CompassRose.tsx — brújula 3D (roto)
- RiskOverlay.tsx — overlay de riesgo (roto)
- DepthGrid.tsx — grid de profundidad (roto)
- CameraController.tsx — control de cámara antiguo (roto; el actual vive en AntiCollision3D)
- WellheadMarkers.tsx — marcadores de cabezal (roto)
- MASDTube.tsx — tubo MASD (roto, importado solo por WellRenderer)
- GlassmorphismPanel.tsx — panel glassmorphism (roto)
- ParticleTrail.tsx — estela de partículas (roto)
- UncertaintyCone.tsx — cono de incertidumbre (roto)
- UncertaintyTube.tsx — tubo de incertidumbre (roto, importado por WellRenderer)

Motivo: restaurar el proyecto a compilación limpia sin perder el conocimiento.
Reintroducir solo si se va a re-implementar el renderer 3D completo como pieza separada.
