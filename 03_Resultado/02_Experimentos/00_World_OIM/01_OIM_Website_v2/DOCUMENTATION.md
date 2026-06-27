> ⚠️ DOCUMENTO HISTÓRICO — fecha desconocida
> Este documento es un registro histórico del sistema. Los conteos y métricas pueden estar desactualizados.
> Para el estado actual del sistema, ver Structure_v5.0.md o README.md.

---

# OIM Website - Documentación de Cambios 2026

## Resumen Ejecutivo

| Fecha                                                     | Estado                                                          | Notas                                                                                    |
|----------------------------------------------------------|----------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| 2026-04-22                                                | ✅ Build OK                                                      | Web funcionando en localhost:3000                                                        |
| 2026-04-22                                                | ❌ ChunkLoadError                                                | Imágenes fallaron, revertimos cambios                                                    |
| 2026-04-22                                                | ✅ Restaurado                                                    | git checkout -- . para volver al original                                                |
| 2026-04-22                                                | ✅ Taste Skills                                                  | Aplicado con fallback seguro a gradientes                                                |

---

## Cronología de Errores

###Error 1: ChunkLoadError
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

## Cambios Aplicados (Taste Skills)

### 1. page.tsx - Imports añadidos
```typescript
import { motion, type Transition } from 'framer-motion';
import { MessageCircle, MapPin, Shield, Clock, Award } from 'lucide-react';

const spring: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
};
```

### 2. Badges - SVG → Lucide
```tsx
// Antes (SVG inline)
<svg width="9" height="11" viewBox="0 0 9 11" fill="none">...</svg>

// Después (Lucide)
<MapPin className="w-3 h-3" />
```

### 3. WhatsApp - SVG → Lucide
```tsx
// Antes (SVG huge de 30 líneas)
<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">...</svg>

// Después
<MessageCircle className="w-[15px] h-[15px]" />
```

### 4. Stats Grid - 4 columnas → asimétrico 7/5
```tsx
// Antes (grid 4 cols symmetric)
grid grid-cols-2 sm:grid-cols-4

// Después (grid 12 cols asimétrico)
grid grid-cols-12 gap-6
col-span-7 (izquierda)
col-span-5 (derecha)
```

### 5. ServicesSection.tsx - Imágenes con fallback
```typescript
// Imágenes con fallback a gradiente
const serviceImages = [
  '/service1.jpg', // Office Furniture Installation
  '/service2.jpg', // Office Setup & Reconfiguration  
  '/service4.jpg', // Disassembly & Moving (reinstalación)
  '/service3.jpg', // Commercial Projects
];

// Fallback gradients
const serviceBgs = [
  'linear-gradient(135deg, #2d3a4a 0%, #1a2535 40%, #0d1b2a 100%)',
  // ...etc
];
```

---

## Imágenes en public/ (pendientes de verificar)

```
public/
├── service1.jpg  (Installation)
├── service2.jpg  (Setup & Reconfiguration)
├── service3.jpg  (Commercial Projects)
├── service4.jpg  (Disassembly & Moving)
├── expertise-display.jpg
├── og-image.jpg
├── apple-touch-icon.png
├── favicon-drill.png
└── videos/
    ├── Interior_Design.mp4
    ├── Home_exploding_view.mp4
    └── home-exploding.mp4
```

---

## Dependencias Instaladas

```json
{
  "lucide-react": "latest",
  "framer-motion": "latest"
}
```

---

## siguiente paso

1. Verificar que cada imagen `service1.jpg` - `service4.jpg` sea correcta
2. Agregar imágenes una por una a ServicesSection
3. Commitear cambios

---

*Documentado: 2026-04-22*

---

## Próximos Pasos (Backlog)

### Phase 5: Integraciones (Pendiente)

- [ ] **Agregar 3 fotos restantes** (About, Gallery, Service Area)
- [ ] **Configurar formulario con Resend** (send emails)
- [ ] **Deploy a Vercel/Netlify**

---

## Resend + Next.js (Investigación 2026)

### Stack recomendado:
```bash
npm install resend @react-email/components
```

### Configuración:
1. Crear cuenta en resend.com
2. Agregar `RESEND_API_KEY=re_...` a .env.local
3. Crear email component con React Email
4. Conectar al ContactForm existente

### Recursos:
- https://resend.com/docs/send-with-nextjs
- https://dev.to/.../resend-react-email

### Phase 6: Seguridad (Futuro - no crítico)

- [ ] Sanitizar input ContactForm
- [ ] Agregar error messages específicos
