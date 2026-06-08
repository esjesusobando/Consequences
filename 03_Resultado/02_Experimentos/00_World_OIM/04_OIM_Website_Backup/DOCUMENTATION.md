# OIM Website - Documentación de Cambios 2026

## Resumen Ejecutivo

| Fecha                                                             | Estado                                                                  | Notas                                                                                            |
|------------------------------------------------------------------|------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| 2026-04-22                                                        | ✅ Build OK                                                              | Web funcionando en localhost:3000                                                                |
| 2026-04-22                                                        | ❌ ChunkLoadError                                                        | Imágenes fallaron, revertimos cambios                                                            |
| 2026-04-22                                                        | ✅ Restaurado                                                            | git checkout -- . para volver al original                                                        |
| 2026-04-22                                                        | ✅ Taste Skills                                                          | Aplicado con fallback seguro a gradientes                                                        |
| 2026-05-03                                                        | ✅ Static Export                                                         | Convertido para Hostinger — output: 'export'                                                     |
| 2026-05-03                                                        | ✅ EmailJS                                                               | Formulario envía emails desde browser (sin servidor)                                             |

---

## Cronología de Errores

### Error 1: ChunkLoadError
- **Causa**: Imágenes agregadas sin verificar que existían en el build
- **Mensaje**: `Loading chunk _app-pages-browser_src_components_ServicesSection_tsx failed`
- **Solución**: `git checkout -- .` para restaurar archivos originales

### Error 2: serviceBgs is not defined
- **Causa**: Variable usada pero no definida (error de merge/manual)
- **Mensaje**: `serviceBgs is not defined`
- **Solución**: Restaurar con git

### Error 3: 404 / web rota
- **Causa**: Máscara de cambios conflictivos, rebuild fallido
- **Solución**: Abortar revert y empezar de cero

---

## Deploy a Hostinger (2026-05-03)

### Problema original
Hostinger usa LiteSpeed + static file serving. Next.js Server Actions + dynamic routes (`sitemap.ts`, `robots.ts`) requieren un proceso Node.js corriendo. **No es compatible con Vercel.**

### Solución: Static Export
Convertido el proyecto a **static export** (`output: 'export'`). Todo el HTML se genera en build time y se sirve como archivos estáticos.

### Cambios en next.config.ts
```typescript
output: 'export',           // genera HTML estático puro
images: { unoptimized: true }, // Image optimization desactivada (no hay servidor)
compress: false,            // compresión desactivada para static export
```

### dynamic routes eliminadas
- `src/app/sitemap.ts` → eliminada → `public/sitemap.xml` (static)
- `src/app/robots.ts` → eliminada → `public/robots.txt` (static)

### Server Actions removidas
`src/app/actions.ts` ya no tiene `'use server'`. Validación Zod extraída como utilCliente-side.

### EmailJS integrado
`@emailjs/browser` instalado. `ContactForm.tsx` ahora envía emails directo desde el browser. No requiere servidor.

---

## Backlog Actualizado (2026-05-03)

### Phase 5: Integraciones

- [x] **Static Export** — Convertido para Hostinger ✅
- [x] **EmailJS** — Integrado, esperando credenciales
- [ ] **3 fotos restantes** (About, Gallery, Service Area)
- [ ] **Deploy a Hostinger** — Subir out/ a public_html/

### Pendiente: EmailJS Setup

1. Crear cuenta en [emailjs.com](https://emailjs.com)
2. Obtener: Public Key, Template ID, Service ID
3. Reemplazar placeholders en `src/components/ContactForm.tsx`

### Fase 6: Seguridad (Futuro)

- [x] Sanitizar input ContactForm ✅ (2026-05-03, XSS prevention via sanitize())
- [ ] Agregar error messages específicos en UI
