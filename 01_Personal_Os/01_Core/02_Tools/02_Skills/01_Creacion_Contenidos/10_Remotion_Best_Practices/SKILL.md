---
name: remotion-best-practices
description: "Best practices for Remotion - Video creation in React. Triggers: Remotion, video, animación, composición, render, React animation, video editing, performance Remotion."
metadata:
  tags: remotion, video, react, animation, composition
---

## Esencia Original
> **Propósito:** Aplicar best practices de Remotion para videos eficientes en React
> **Flujo:** Auditar código → Cargar reglas → Optimizar patterns → Medir performance


## When to use

Use this skills whenever you are dealing with Remotion code to obtain the domain-specific knowledge.

## Captions

When dealing with captions or subtitles, load the [./rules/subtitles.md](./rules/subtitles.md) file for more information.

## Using FFmpeg

For some video operations, such as trimming videos or detecting silence, FFmpeg should be used. Load the [./rules/ffmpeg.md](./rules/ffmpeg.md) file for more information.

## Audio visualization

When needing to visualize audio (spectrum bars, waveforms, bass-reactive effects), load the [./rules/audio-visualization.md](./rules/audio-visualization.md) file for more information.

## How to use

Read individual rule files for detailed explanations and code examples:

- [rules/3d.md](rules/3d.md) - 3D content in Remotion using Three.js and React Three Fiber
- [rules/animations.md](rules/animations.md) - Fundamental animation skills for Remotion
- [rules/assets.md](rules/assets.md) - Importing images, videos, audio, and fonts into Remotion
- [rules/audio.md](rules/audio.md) - Using audio and sound in Remotion - importing, trimming, volume, speed, pitch
- [rules/calculate-metadata.md](rules/calculate-metadata.md) - Dynamically set composition duration, dimensions, and props
- [rules/can-decode.md](rules/can-decode.md) - Check if a video can be decoded by the browser using Mediabunny
- [rules/charts.md](rules/charts.md) - Chart and data visualization patterns for Remotion (bar, pie, line, stock charts)
- [rules/compositions.md](rules/compositions.md) - Defining compositions, stills, folders, default props and dynamic metadata
- [rules/extract-frames.md](rules/extract-frames.md) - Extract frames from videos at specific timestamps using Mediabunny
- [rules/fonts.md](rules/fonts.md) - Loading Google Fonts and local fonts in Remotion
- [rules/get-audio-duration.md](rules/get-audio-duration.md) - Getting the duration of an audio file in seconds with Mediabunny
- [rules/get-video-dimensions.md](rules/get-video-dimensions.md) - Getting the width and height of a video file with Mediabunny
- [rules/get-video-duration.md](rules/get-video-duration.md) - Getting the duration of a video file in seconds with Mediabunny
- [rules/gifs.md](rules/gifs.md) - Displaying GIFs synchronized with Remotion's timeline
- [rules/images.md](rules/images.md) - Embedding images in Remotion using the Img component
- [rules/light-leaks.md](rules/light-leaks.md) - Light leak overlay effects using @remotion/light-leaks
- [rules/lottie.md](rules/lottie.md) - Embedding Lottie animations in Remotion
- [rules/measuring-dom-nodes.md](rules/measuring-dom-nodes.md) - Measuring DOM element dimensions in Remotion
- [rules/measuring-text.md](rules/measuring-text.md) - Measuring text dimensions, fitting text to containers, and checking overflow
- [rules/sequencing.md](rules/sequencing.md) - Sequencing patterns for Remotion - delay, trim, limit duration of items
- [rules/tailwind.md](rules/tailwind.md) - Using TailwindCSS in Remotion
- [rules/text-animations.md](rules/text-animations.md) - Typography and text animation patterns for Remotion
- [rules/timing.md](rules/timing.md) - Interpolation curves in Remotion - linear, easing, spring animations
- [rules/transitions.md](rules/transitions.md) - Scene transition patterns for Remotion
- [rules/transparent-videos.md](rules/transparent-videos.md) - Rendering out a video with transparency
- [rules/trimming.md](rules/trimming.md) - Trimming patterns for Remotion - cut the beginning or end of animations
- [rules/videos.md](rules/videos.md) - Embedding videos in Remotion - trimming, volume, speed, looping, pitch
- [rules/parameters.md](rules/parameters.md) - Make a video parametrizable by adding a Zod schema
- [rules/maps.md](rules/maps.md) - Add a map using Mapbox and animate it

## ⚠️ Gotchas

### No auditar performance antes de render final
> Escribir animaciones complejas sin verificar el tiempo de render por frame.

- **Por qué**: Una animación que corre a 60fps en desarrollo puede tardar 5+ segundos por frame en render final si tiene cálculos pesados, imágenes grandes o muchos elementos DOM. El tiempo de render total se vuelve inviable.
- **Solución**: Usar `npx remotion benchmark` y la solapa "Performance" del Studio. Identificar frames lentos con `<Timeline>`. Aplicar `useMemo()`, `<Freeze>`, y evitar re-renders innecesarios.

### Ignorar el bundler (Webpack/Vite) para optimización de assets
> Usar imágenes de 4000x4000px sin optimizar o videos en formatos no soportados por el navegador.

- **Por qué**: Remotion incluye cada asset importado en el bundle. Una imagen de 12MB se convierte en 12MB dentro del bundle de render. Videos sin comprimir aumentan drásticamente el memory usage.
- **Solución**: Pre-optimizar imágenes a la resolución máxima de despliegue (1920x1080). Usar WebM para videos. Comprimir assets antes de importarlos. Para imágenes, usar formatos modernos (WebP).

### No separar lógica por composiciones (monolito)
> Poner toda la animación en una sola composición de 10,000 frames con todo el código en un solo archivo.

- **Por qué**: Una composición monolítica es imposible de debuggear, testear, o reusar. Si falla en el frame 8,000, hay que re-renderizar desde el frame 1. Además, `useCurrentFrame()` se vuelve inmanejable con lógica condicional anidada.
- **Solución**: Dividir en composiciones pequeñas (< 500 frames cada una) y orquestar con `<Sequence>`. Cada escena es su propia composición. Usar `interpolate()` por escena, no global.

## 💾 State Persistence

> **Qué persists**: Reglas de best practices cargadas, configuraciones de auditoría, benchmarks de performance.
> **Dónde**: Repositorio del proyecto y archivos de reglas (`rules/*.md`).
> **Cuándo restore**: Al iniciar un nuevo proyecto o retomar uno existente, restaurar las reglas de best practices relevantes.
> **Formato**: Archivos markdown con reglas + configuración de proyecto.

### Estado que se preserva entre sesiones:
1. **Reglas activas**: Best practices cargadas según el tipo de proyecto (3D, captions, charts, etc.).
2. **Benchmarks de performance**: Tiempos de render por composición registrados.
3. **Configuración de FFmpeg**: Parámetros de encoding, codecs y formatos.
4. **Patrones de animación**: Timing curves exitsosas y spring configurations probadas.
