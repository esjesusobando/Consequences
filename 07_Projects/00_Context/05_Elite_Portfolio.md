# 08_Elite_Portfolio — Stack Final SOTA

**Proyecto:** Portafolio Personal Elite  
**Fecha:** 2026-04-11  
**Estado:** ✅ Listo para build

---

## ⚡ Stack Recomendado (Estable)

| Tecnología        | Versión    | Estado              | Uso               |
|-------------------|------------|---------------------|-------------------|
| **Next.js**       | **14.2.x** | ✅ Más Estable       | App Router        |
| **React**         | **18.3.x** | ✅ Máximo estável    | Server Components |
| **TypeScript**    | 5.4.x      | ✅ Estable           | Strict mode       |
| **Tailwind CSS**  | **3.4.x**  | ✅ Ecosistema maduro | Estilos           |
| **Framer Motion** | 11.x       | ✅ Estable           | Animaciones       |
| **Vercel**        | —          | ✅ Estable           | Deployment        |

> **Decisión:** Next.js 14 + React 18 = Máxima estabilidad. Next.js 15 tiene breaking changes documentados (caching, async APIs).

---

## 📦 dependencies Finales

```json
{
  "name": "elite-portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.25",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "framer-motion": "11.18.2",
    "@fontsource/playfair-display": "5.2.0",
    "@fontsource/inter": "5.2.0",
    "lucide-react": "0.468.0",
    "clsx": "2.1.1",
    "tailwind-merge": "2.6.0"
  },
  "devDependencies": {
    "typescript": "5.4.5",
    "@types/node": "22.10.5",
    "@types/react": "18.3.18",
    "@types/react-dom": "18.3.5",
    "tailwindcss": "3.4.17",
    "autoprefixer": "10.4.20",
    "postcss": "8.5.1",
    "eslint": "8.57.1",
    "eslint-config-next": "14.2.25"
  }
}
```

---

## 🛠 Tailwind 3.4 Config

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        gold: {
          50: "#FDF9E7",
          100: "#FAF0CC",
          200: "#F5E099",
          300: "#F0D066",
          400: "#EBC033",
          500: "#C9A227",
          600: "#9F7B1E",
          700: "#755915",
          800: "#4C370C",
          900: "#231603",
        },
        cream: "#FAF5F0",
        charcoal: "#1A1A1A",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 📁 Estructura Final

```
elite-portfolio/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── navigation.tsx
│   │   ├── hero.tsx
│   │   ├── projects.tsx
│   │   ├── about.tsx
│   │   ├── contact.tsx
│   │   ├── footer.tsx
│   │   └── theme-toggle.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── data.ts
│   │   └── motion.ts
│   └── types/
│       └── index.ts
├── public/
│   ├── favicon.ico
│   └── images/
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── postcss.config.js
├── .eslintrc.json
└── package.json
```

---

## 🚀 Setup commands

```bash
# 1. Create Next.js 14 app
npx create-next-app@14 elite-portfolio \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm \
  --no-turbopack

# 2. Install dependencies
npm install framer-motion@11 lucide-react clsx tailwind-merge
npm install @fontsource/playfair-display @fontsource/inter

# 3. Run dev
npm run dev
```

---

## 🎨 CSS Globals Base

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: oklch(0.98 0.02 250);
  --foreground: oklch(0.15 0.02 250);
  --gold: oklch(0.75 0.18 45);
}

.dark {
  --background: oklch(0.08 0.02 250);
  --foreground: oklch(0.98 0.02 250);
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: "Inter", sans-serif;
}

.font-serif {
  font-family: "Playfair Display", serif;
}
```

---

## ✅ Checklist Implementación

```
[ ] 01_Setup    — Next.js 14 + Tailwind 3.4
[ ] 02_Fonts   — Playfair Display + Inter  
[ ] 03_Config — tailwind.config.ts + colors
[ ] 04_Hero   — Foto + tagline + CTA
[ ] 05_Nav   — Sticky minimal
[ ] 06_Projects — Bento grid
[ ] 07_About  — Story edit
[ ] 08_Contact — Form
[ ] 09_Animations — Framer Motion
[ ] 10_Theme  — Dark/Light toggle
[ ] 11_Mobile — Responsive
[ ] 12_Deploy — Vercel
```

---

---

## 🎬 Video Hero — Investigación Completa

### ¿Por qué video en hero?

** Beneficios:**
- Impacto emocional inmediato
- Diferenciación visual
- Engagement +20-30%
- Storytelling en 3 segundos

**Consideraciones:**
- LCP (Largest Contentful Paint) puede affected
- Requiere optimización estricta
- Mobile tiene restricciones

---

### 📊 Especificaciones Técnicas SOTA

#### Formato y Tamaño

| Formato   | Resolución      | Duración  | Tamaño   | Bitrate    |
|-----------|-----------------|-----------|----------|------------|
| **WebM**  | 720p (1280×720) | 10-15s    | < 500 KB | < 1 Mbps   |
| **MP4**   | 720p fallback   | 10-15s    | < 1 MB   | < 1.5 Mbps |

> **Meta:** LCP < 2.5s en 3G

#### Atributos Obligatorios (Autoplay Works)

```tsx
<video
  autoPlay        // Inicia automáticamente
  muted          // 🔑 CRÍTICO - browsers bloquean sin mute
  loop          // Repite infinitamente
  playsInline   // 🔑 iOS requiere esto
  preload="metadata"
  poster="/hero-poster.jpg"
/>
```

#### HTML Structure

```tsx
<section className="relative h-[90vh] w-full overflow-hidden">
  {/* Video Background */}
  <video
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
    poster="/images/hero-poster.jpg"
    className="absolute inset-0 h-full w-full object-cover"
  >
    <source src="/videos/hero.webm" type="video/webm" />
    <source src="/videos/hero.mp4" type="video/mp4" />
  </video>
  
  {/* Overlay - contraste WCAG 4.5:1 */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
  
  {/* Content */}
  <div className="relative z-10 flex h-full items-center justify-center">
    {children}
  </div>
</section>
```

---

### ✅ Checklist Video Hero SOTA

**Performance:**
- [ ] WebM + MP4 dual formato
- [ ] Archivo < 1 MB total
- [ ] Resolución 720p (no 4K!)
- [ ] Audio strip (no tiene audio track)
- [ ] Loop seamless (inicio = fin)
- [ ] Poster image (fallback LCP)

**Accessibility:**
- [ ] `muted` attribute
- [ ] `playsInline` attribute
- [ ] WCAG contraste 4.5:1
- [ ] Respetar `prefers-reduced-motion`

**Mobile:**
- [ ] Media query disable < 768px
- [ ] `object-fit: cover`
- [ ] Fallback image

---

### 🎯 Componente VideoHero.tsx

```tsx
// src/components/video-hero.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface VideoHeroProps {
  videoSrc?: { webm: string; mp4: string };
  posterSrc: string;
  children: React.ReactNode;
}

export function VideoHero({
  videoSrc = { webm: "/videos/hero.webm", mp4: "/videos/hero.mp4" },
  posterSrc,
  children,
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Respetar prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterSrc}
        onCanPlay={() => setIsLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <source src={videoSrc.webm} type="video/webm" />
        <source src={videoSrc.mp4} type="video/mp4" />
      </video>

      {/* Overlay gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        {children}
      </div>
    </section>
  );
}
```

---

### 🔧 Optimización FFmpeg

```bash
# WebM optimizado
ffmpeg -i original.mp4 -c:v libvpx-vp9 -b:v 0 -crf 30 -an -vf scale=1280:-2 hero.webm

# MP4 optimizado
ffmpeg -i original.mp4 -c:v libx264 -b:v 1M -crf 28 -an -vf scale=1280:-2 hero.mp4

# Generar poster
ffmpeg -i hero.mp4 -vframes 1 -q:v 2 hero-poster.jpg
```

---

### 📁 Recursos Stock Video Gratuitos

| Fuente   | URL                | Calidad   |
|----------|--------------------|-----------|
| Pexels   | pexels.com         | ⭐⭐⭐       |
| Coverr   | coverr.co          | ⭐⭐⭐⭐      |
| Mixkit   | mixkit.co          | ⭐⭐⭐       |
| Pixabay  | pixabay.com/videos | ⭐⭐⭐       |

---

### References

- [Autoplay Policy Chrome](https://www.chromium.org/audio-video/)
- [WebKit Video](https://webkit.org/blog/9734/)
- [HostArmada Video Hero](https://www.hostarmada.com/blog/video-hero-section/)
- [Swarmify Autoplay Guide](https://swarmify.com/blog/how-to-make-an-autoplaying-background-video/)
- [ImageKit Video Optimization](https://imagekit.io/blog/nextjs-video-autoplay/)

---

---

# 📋 PLAN DE IMPLEMENTACIÓN — Paso a Paso

## 🎯 Filosofía

> **"Nada falla, todo sale según plan"**
> - Build local = Producción
> - Testear antes decommit
> - Deploy confirmado

---

## 📅 FASE 1: Setup (Día 1)

### 1.1 Crear Proyecto

```bash
# 1. Crear Next.js 14 app
npx create-next-app@14 elite-portfolio \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm \
  --no-turbopack

# 2. Entrar al proyecto
cd elite-portfolio

# 3. Instalar dependencias
npm install framer-motion@11 lucide-react clsx tailwind-merge
npm install @fontsource/playfair-display @fontsource/inter
```

### 1.2 Configurar Tailwind

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        gold: { 50: "#FDF9E7", /* ... */ },
        cream: "#FAF5F0",
        charcoal: "#1A1A1A",
      },
    },
  },
  plugins: [],
};
export default config;
```

### 1.3 Configurar Fuentes

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import "@fontsource/playfair-display";
@import "@fontsource/inter";

:root {
  --background: #FAF5F0;
  --foreground: #1A1A1A;
}

.dark {
  --background: #1A1A1A;
  --foreground: #FAF5F0;
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

---

## 📅 FASE 2: Componentes Core (Día 2-3)

### Checklist Componentes

| #   | Componente    | Archivo                           | Prioridad  |
|-----|---------------|-----------------------------------|------------|
| 01  | Root Layout   | `src/app/layout.tsx`              | 🔴 Alta     |
| 02  | Navigation    | `src/components/navigation.tsx`   | 🔴 Alta     |
| 03  | Hero (Texto)  | `src/components/hero.tsx`         | 🔴 Alta     |
| 04  | Projects Grid | `src/components/projects.tsx`     | 🔴 Alta     |
| 05  | About         | `src/components/about.tsx`        | 🟡 Media    |
| 06  | Contact       | `src/components/contact.tsx`      | 🟡 Media    |
| 07  | Footer        | `src/components/footer.tsx`       | 🟡 Media    |
| 08  | Theme Toggle  | `src/components/theme-toggle.tsx` | 🟢 Baja     |

---

## 📅 FASE 3: Video Hero (Día 4)

### Checklist Video

- [ ] Obtener video stock (< 1MB, 720p)
- [ ] Optimizar con FFmpeg
- [ ] Generar poster image
- [ ] Crear componente VideoHero.tsx
- [ ] Implementar overlay contrast
- [ ] Añadir prefers-reduced-motion

```tsx
// src/components/video-hero.tsx
"use client";
import { useState, useRef, useEffect } from "react";

export function VideoHero({ videoSrc, posterSrc, children }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches && videoRef.current) videoRef.current.pause();
  }, []);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterSrc}
        onCanPlay={() => setIsLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <source src={videoSrc.webm} type="video/webm" />
        <source src={videoSrc.mp4} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      <div className="relative z-10 flex h-full items-center justify-center text-white">
        {children}
      </div>
    </section>
  );
}
```

---

## 📅 FASE 4: SEO & Metadata (Día 5)

### Checklist SEO

- [ ] Metadata global (`layout.tsx`)
- [ ] Metadata por página (`page.tsx`)
- [ ] OpenGraph + Twitter cards
- [ ] Sitemap (`app/sitemap.ts`)
- [ ] Robots.txt (`app/robots.ts`)
- [ ] Structured Data (JSON-LD)

```typescript
// src/app/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Tu Nombre",
    default: "Tu Nombre - Portafolio Personal",
  },
  description: "Descripción de tu trabajo",
  metadataBase: new URL("https://tusitio.com"),
  openGraph: {
    title: "Tu Nombre",
    description: "Descripción",
    url: "https://tusitio.com",
    siteName: "Tu Nombre",
    locale: "es_ES",
    type: "website",
  },
};
```

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://tusitio.com", lastModified: new Date() },
    { url: "https://tusitio.com/about", lastModified: new Date() },
    { url: "https://tusitio.com/work", lastModified: new Date() },
  ];
}
```

---

## 📅 FASE 5: Testing Local (Día 6)

### Checklist Pre-Deploy

```bash
# 1. Build sin errores
npm run build

# 2. Start local (production-like)
npm run start

# 3. Lighthouse en incognito
# Abrir Chrome DevTools > Lighthouse
# Auditar: Performance, SEO, Accessibility
```

### Objetivos Lighthouse

| Métrica        | Target  | Mínimo   |
|----------------|---------|----------|
| Performance    | 90+     | 80+      |
| SEO            | 100     | 95+      |
| Accessibility  | 100     | 90+      |
| Best Practices | 100     | 95+      |

### Checklist Pre-Launch

- [ ] `next build` exitosa (sin errores TypeScript)
- [ ] Lighthouse score ≥ 80 en Performance
- [ ] Imágenes con `next/image` optimizadas
- [ ] No hay console errors
- [ ] Dark/Light mode funciona
- [ ] Mobile responsive
- [ ] Videos cargan correctamente
- [ ] Links funcionan

---

## 📅 FASE 6: Deploy (Día 7)

### Checklist Vercel

- [ ] Cuenta Vercel conectada a GitHub
- [ ] Repository vinculaddo
- [ ] Environment vars configuradas (si aplica)
- [ ] Build command: `next build`
- [ ] Output directory: `.next`
- [ ] Install command: `npm install`

### Post-Deploy

- [ ] Verificar producción carga
- [ ] Probar Lighthouse Production
- [ ] Verificar sitemap indexed
- [ ] Probar mobile (diferentes dispositivos)
- [ ] Monitorizar errores (Sentry opciónal)

---

## ✅ VERIFICACIÓN INTEGRAL

| Categoría      | Checkpoint                          | Estado   |
|----------------|-------------------------------------|----------|
| **Setup**      | Proyecto creado + dependencias      | ⬜        |
| **Config**     | Tailwind + Fuentes working          | ⬜        |
| **Components** | Todos los componentes implementados | ⬜        |
| **Video**      | Video Hero optimizado               | ⬜        |
| **SEO**        | Metadata + Sitemap + Robots         | ⬜        |
| **Testing**    | Lighthouse ≥ 80                     | ⬜        |
| **Deploy**     | Production live                     | ⬜        |
| **Post**       | Verificación final                  | ⬜        |

---

## 🛠Comandos Resumen

```bash
# Desarrollo
npm run dev

# Build producción local
npm run build
npm run start

# Deploy (desde GitHub)
# Ir a Vercel dashboard > Deployments
```

---

## 📚 Referencias

- [Next.js Production Checklist](https://nextjs.org/docs/pages/guides/production-checklist)
- [Next.js SEO Checklist](https://www.tusharbuilds.com/blog/nextjs-seo-checklist)
- [WebDevUltra Next.js Checklist](https://www.webdevultra.com/articles/nextjs-production-checklist)
- [Next.js Performance Guide](https://karangoyal.cc/blog/nextjs-14-performance-optimization)

---

*Plan documentado — Nada falla, todo sale según plan*
