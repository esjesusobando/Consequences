# OIM Website — Deployment Session Summary

**Fecha:** 2026-05-03
**Session:** Deploy OIM Website to Hostinger — Static Export Preparation

---

## 🎯 Objetivo

Preparar el sitio web de OIM (Office Installations Mayen) para deploy en Hostinger, convirtiendo el proyecto Next.js existente en un **static export** que no requiera servidor Node.js.

---

## 📋 Diagnóstico Inicial

| Aspecto                                 | Estado                                                           |
|----------------------------------------|-----------------------------------------------------------------|
| **Stack**                               | Next.js 16.2.2 + React 19.2.4 + Tailwind CSS 4                   |
| **Rendering original**                  | Server-side (sitemaps dinámicos, Server Actions)                 |
| **Deploy target original**              | Vercel (`.vercel/` presente)                                     |
| **Hostinger**                           | No tiene soporte nativo para Next.js Server Actions              |

### Problema identificado

Hostinger usa LiteSpeed + static file serving. Next.js con `output: 'standalone'` requiere un proceso Node.js corriendo. **No es Vercel.**

**Dos paths:**
- Opción A: Node.js App (técnicamente complejo en Hostinger)
- Opción B: Static Export (simple, performant, económico) ← **ELEGIDA**

---

## 🔧 Cambios Realizados

### 1. `next.config.ts` — Static Export

```typescript
output: 'export',
images: { unoptimized: true },
compress: false,
// Security headers removidos (Hostinger sirve archivos estáticos)
```

### 2. `src/app/sitemap.ts` → `public/sitemap.xml`

Dynamic route eliminada. Generado XML estático:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://oimatlanta.com/</loc>
    <lastmod>2026-05-03</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### 3. `src/app/robots.ts` → `public/robots.txt`

Dynamic route eliminada. Generada versión estática:

```
User-agent: *
Allow: /

Sitemap: https://oimatlanta.com/sitemap.xml
```

### 4. `src/app/actions.ts` — Server Action removida

- `'use server'` eliminado
- Zod validation extraída como utilidades cliente-side
- Nuevo: `validateContactForm()`, `sanitize()`, `ContactFormData` type

### 5. `src/components/ContactForm.tsx` — EmailJS integrado

- Importadded: `import emailjs from '@emailjs/browser'`
- `handleSubmit` ahora usa EmailJS SDK
- Placeholders listos para credentials reales

**Credenciales a configurar:**
```typescript
const SERVICE_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';
const SERVICE_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';
const SERVICE_SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID';
```

### 6. `package.json` — Dependencia agregada

```json
"dependencies": {
  "@emailjs/browser": "^4.4.1",
  ...
}
```

---

## ✅ Build Verification

```bash
npm install
npm run build
```

**Output:** `out/` (static export, ~80MB total)

```
out/
├── index.html              ← principal
├── 404.html
├── _next/                 ← JS bundles (~65MB)
├── videos/                ← 3 videos (~9MB)
├── sitemap.xml
├── robots.txt
└── (imágenes + assets)
```

---

## 📁 Archivos Creados/Modificados

| Archivo                                       | Cambio                                                         |
|----------------------------------------------|---------------------------------------------------------------|
| `next.config.ts`                              | `output: 'export'` + `images.unoptimized: true`                |
| `src/app/actions.ts`                          | Removido `'use server'`, validación Zod como util              |
| `src/app/sitemap.ts`                          | ELIMINADO → `public/sitemap.xml`                               |
| `src/app/robots.ts`                           | ELIMINADO → `public/robots.txt`                                |
| `src/components/ContactForm.tsx`              | EmailJS integration                                            |
| `package.json`                                | `@emailjs/browser` agregado                                    |
| `public/sitemap.xml`                          | NUEVO (static)                                                 |
| `public/robots.txt`                           | NUEVO (static)                                                 |
| `HOSTING_DEPLOY_GUIDE.md`                     | NUEVO (deployment guide completo)                              |

---

## 📌 Pendientes para Production

| #                | Tarea                              | Prioridad               | Notas                                                    |
|-----------------|-----------------------------------|------------------------|---------------------------------------------------------|
| 1                | Configurar EmailJS                 | 🔴 Alta                  | Crear cuenta en emailjs.com, obtener 3 keys              |
| 2                | Dominio                            | 🔴 Alta                  | ¿Comprado en Hostinger o existente?                      |
| 3                | 3 fotos faltantes                  | 🟡 Media                 | About, Gallery, Service Area sections                    |
| 4                | Google Maps verificar              | 🟡 Media                 | Embed URL correcta en ContactForm.tsx                    |
| 5                | Google Search Console              | 🟢 Baja                  | Post-deploy: agregar sitemap                             |

---

## 🚀 Paso a Paso — Deploy en Hostinger

1. **Subir contenido de `out/`** → `public_html/` (File Manager o FTP)
2. **Activar SSL** → hPanel → Dominios → SSL → Let's Encrypt
3. **Configurar dominio** → DNS pointing a Hostinger
4. **Configurar EmailJS** → Reemplazar placeholders en `ContactForm.tsx`
5. **Probar** → Verificar homepage, form, videos, sitemap, SSL

---

## 📝 Commits Realizados

```
8985550 docs: apply beautify-tables formatting to documentation
b7d6258 docs: add HOSTING_DEPLOY_GUIDE.md with step-by-step Hostinger deployment steps
72b846a feat(deploy): convert to static export for Hostinger deployment
3638b9c chore: update documentation files
26be0af docs: update README and DOCUMENTATION with latest changes
```

**Branch:** `feature/improve-design-add-images`

---

## 🔑 Decisiones de Arquitectura

| Decisión                                         | Razón                                                                     |
|-------------------------------------------------|--------------------------------------------------------------------------|
| Static Export en vez de Node.js App              | Hostinger LiteSpeed no soporta bien Next.js server                        |
| EmailJS en vez de server-side email              | Elimina necesidad de servidor para form                                   |
| Static sitemap/robots.txt                        | Next.js genera estos dinámicamente — incompatible con static              |
| `images: { unoptimized: true }`                  | Next.js Image optimization requiere servidor                              |

---

## 📚 Recursos

- [EmailJS Setup](https://emailjs.com)
- [Next.js Static Export](https://nextjs.org/docs/app/guides/static-export)
- [Hostinger Node.js Hosting](https://www.hostinger.com/web-apps-hosting)
- [Static Sites on Hostinger](https://support.hostinger.com)

---

*Documentado: 2026-05-03*
