---
source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\01_Memory\00_Context_LLM\06_Solutions\system-maintenance\nextjs-regex-build-break.md"
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\01_Research\system-maintenance\nextjs-regex-build-break.md"
sync_date: "2026-08-01T00:55:44.342695"
sync_updated: true
title: "Next.js build roto por regex con capture group en headers config"
---

# Next.js build roto por regex con capture group en headers config

## Síntoma

```
Error: Invalid source "/(.*\\.(png|jpg|svg|ico|webp))"
Reason: Capture groups are not allowed in source patterns
```

Build falla completamente. `npm run build` y `npm run dev` no arrancan.

## Causa Raíz

Next.js no permite grupos de captura `(...)` en los patterns `source` de `headers()`. La sintaxis `/(.*\\.(ext|ext2))` usa un capture group implícito alrededor de las extensiones.

## Solución

```typescript
// ❌ ROTO — capture group inválido
{
  source: "/(.*\\.(png|jpg|svg|ico|webp))",
  headers: [...]
}

// ✅ CORRECTO — :path* sin capture group
{
  source: "/:path*\\.(png|jpg|svg|ico|webp)",
  headers: [...]
}
```

## Prevención

- Al escribir `source` en `headers()`, `redirects()`, o `rewrites()` de Next.js: NUNCA usar `(...)` capture groups
- Usar `:param*` para wildcards, no `(.*)`
- Testear siempre con `npm run build` después de tocar `next.config.ts`

## Archivos Afectados

- `Now/oim-website/next.config.ts`


> 🔗 Zona: [[03_Reference/01_Knowledge/Aprendizajes/README]]
