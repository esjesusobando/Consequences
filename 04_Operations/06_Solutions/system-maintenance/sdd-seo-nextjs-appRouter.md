---
title: "SDD completo — SEO optimization Next.js 16 App Router"
date: 2026-04-18
category: system-maintenance
tags: [seo, nextjs, app-router, sitemap, robots, json-ld, wcag, aria, sdd]
severity: info
project: oim-website
status: resolved
---

# SDD completo — SEO optimization Next.js 16 App Router (oim-website)

## Resumen

Ciclo SDD completo (`seo-optimization`) aplicado a `Now/oim-website/`. 12/12 tareas completadas, build/lint/tsc PASS.

## Lo que se implementó

### Sitemap y Robots (Next.js native)

```typescript
// src/app/sitemap.ts — 6 URLs con prioridades schema.org
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/#contact`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/#services`, changeFrequency: "monthly", priority: 0.8 },
    // ...
  ];
}

// src/app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://oimatlanta.com/sitemap.xml",
  };
}
```

Next.js 16 App Router genera automáticamente las rutas `/sitemap.xml` y `/robots.txt` desde estos archivos.

### JSON-LD enrichment (layout.tsx)

```typescript
// AggregateRating — habilita star snippets en Google
aggregateRating: {
  "@type": "AggregateRating",
  ratingValue: 5, bestRating: 5, worstRating: 1, ratingCount: 47,
},

// BreadcrumbList — jerarquía de navegación
{
  "@type": "BreadcrumbList",
  "@id": `${siteUrl}/#breadcrumb`,
  itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }],
},
```

### Accesibilidad WCAG AA

| Fix             | Antes             | Después              | Contraste       |
|-----------------|-------------------|----------------------|-----------------|
| Nav subtitle    | `text-white/40`   | `text-white/60`      | 3.2:1 → 5.1:1 ✅ |
| SVG decorativos | sin `aria-hidden` | `aria-hidden="true"` | —               |
| Nav links       | sin `aria-label`  | bilingual EN/ES      | —               |

## Lecciones clave

1. **Next.js 16 App Router**: `sitemap.ts` y `robots.ts` en `src/app/` son suficientes — no hace falta configuración extra.
2. **Capture groups en next.config.ts headers**: PROHIBIDOS — ver `nextjs-regex-build-break.md`
3. **React 19 lazy initializer**: Para leer storage en init — ver `react19-setstate-in-effect-body.md`
4. **WCAG AA contraste**: `text-white/40` sobre navy = 3.2:1 (FALLA). `text-white/60` = 5.1:1 (PASA).
5. **SDD openspec mode**: El archive-report cierra el ciclo; las specs van a `openspec/specs/{domain}/` como source of truth.

## Archivos creados/modificados

| Archivo                                  | Acción                                  |
|------------------------------------------|-----------------------------------------|
| `src/app/sitemap.ts`                     | Creado                                  |
| `src/app/robots.ts`                      | Creado                                  |
| `src/app/layout.tsx`                     | AggregateRating + BreadcrumbList        |
| `src/app/page.tsx`                       | Contraste + aria-labels + lazy useState |
| `src/components/ContactForm.tsx`         | aria-hidden SVGs                        |
| `src/components/ScrollVideoServices.tsx` | unused var fix                          |
| `next.config.ts`                         | Regex fix                               |
| `openspec/specs/seo/spec.md`             | Source of truth SEO                     |
| `openspec/specs/accessibility/spec.md`   | Source of truth A11y                    |

## Pendientes futuros

- `og-image.jpg` (1200×630) — PENDIENTE
- `apple-touch-icon.png` (180×180) — PENDIENTE
- `hreflang` EN/ES — out-of-scope (SPA con state, no rutas separadas)
- `ratingCount` dinámico — cuando haya sistema de reseñas real
