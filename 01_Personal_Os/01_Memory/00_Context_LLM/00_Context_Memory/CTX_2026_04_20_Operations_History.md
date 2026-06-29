# 🧠 03_CTX_Operations_and_Project_History

**Estatus**: DOCUMENTO MAESTRO (Compactación v6.1)  
**Historial**: Sesiones 001 a 029 (Integrado)

---

## 🏆 Hitos de Proyectos (Timeline)

### 🔴 v6.1 Refactor (Marzo - Abril 2026)
- **Logro**: Migración total a la estructura `01_Core` liderada por Gentleman.
- **Resultado**: Sistema SSOT funcional en `03_Tasks`. Limpieza masiva de legacy files.

### 🔵 OIM Website Build — SOTA v2 (Abril 2026)
- **Logro**: Reconstrucción COMPLETA de la web OIM usando Next.js 16.2.2 (Turbopack), Tailwind v4, React 19.
- **Stack**: App Router + named/default exports por convención, `min-h-[100dvh]` (nunca `h-screen`).
- **Paleta**: Navy `#0d1b2a` + Yellow `#F5C518` + Surface `#f4f6f8`. Aplicada por ingeniería inversa del sitio live en Vercel.
- **Skills aplicadas**: taste-skill (DESIGN_VARIANCE:8, MOTION_INTENSITY:6) + ui-ux-pro-max + Apple HIG typography.
- **Componentes**:
  - `HeroSection.tsx` — named export, video bg con hydration fix (ref.style vs state), `preload="metadata"`, `suppressHydrationWarning`.
  - `ScrollVideoServices.tsx` — named export, RAF frame-by-frame INTACTO, glassmorphism card, copy actualizado al cliente.
  - `AboutSection.tsx` — default, split 2-col, IntersectionObserver stagger animations.
  - `ProjectGallery.tsx` — default, grid asimétrico (1 large + 2 stacked), yellow CTA strip.
  - `ContactForm.tsx` — default, split light/dark, SVG icons (no emojis), Google Maps embed dark filter.
  - `ServiceArea.tsx` — default, full dark navy, Google Maps Georgia area, pulsing dot social proof.
  - `ServicesSection.tsx` — default, 2×2 grid cards.
- **SEO**: LocalBusiness JSON-LD, metadata SOTA, og-image, favicon drill icon (`/favicon-drill.png`).
- **Fixes críticos**:
  - Hydration error `<video>`: eliminado `videoReady` state, uso de `ref.style.opacity` + `suppressHydrationWarning`.
  - Hydration error `<html>`: `suppressHydrationWarning` en el elemento raíz (next/font hash diff en Windows).
  - Dev indicator Next.js: `devIndicators: false` en `next.config.ts`.
  - Copy exacto del cliente: phone `+1 (470) 595-0121`, email `oiminstallllc@gmail.com`, address `3715 Northcrest Rd Suite 19, Atlanta GA 30340`.
- **Resultado**: Aplicación 100% SOTA, sin errores de hidratación, copy exacto, frame-by-frame intacto.
- **Sesión**: 030–031 (2026-04-16)

### 🟢 Hillary & QMD Integration (Abril 2026)
- **Logro**: Hillary integrada como Agente #13. Sub-módulos reparados tras compactación masiva.
- **QMD Status**: Indexación completa con embeddings vectoriales activos (Hybrid).
- **Resultado**: Búsqueda semántica disponible para todos los agentes. Ecosistema Git libre de errores fatal.

## 📝 Resumen de Sesiones Recientes
- **Sesión 018**: Finalización de la UI de OIM y SEO SOTA.
- **Sesión 025-029**: Integración Hillary, auditoría de regresión 3x y resolución de colisión de numeración con AIPM Judge.

---
*Compactado de archivos CTX 12 al 19 y registros de sesiones tácticas | Sincronizado 2026-04-14*
