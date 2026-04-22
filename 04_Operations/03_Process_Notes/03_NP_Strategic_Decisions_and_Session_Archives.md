# 📓 03_NP_Strategic_Decisions_and_Session_Archives

**Estatus**: DOCUMENTO MAESTRO (Compactación v6.1)  
**Contexto**: Log de decisiones tácticas y sesiones estratégicas

---

## 🧠 Registro de Decisiones de Alto Impacto

### Integración Hillary (Abril 2026)
- **Decisión**: Hillary reportará a Gentleman pero tendrá autonomía total sobre el backlog personal.
- **Por qué**: Para reducir el "Context Switching" del arquitecto humano.

### Stack OIM (Abril 2026)
- **Decisión**: Uso de Tailwind v4 en lugar de v3 para aprovechar tokens de tema dinámicos.
- **Por qué**: Alineación con el estado del arte de herramientas de frontend.

### Política "No-Delete Legacy"
- **Decisión**: Mantener carpetas vacías pero funcionales en skills antiguas.
- **Por qué**: Evitar romper scripts de terceros que dependen de esas rutas, forzando la lógica de IA a usar `03_Tasks`.

## 📂 Archivo de Sesiones
Este volumen resume las 29 sesiones tácticas donde se construyó el ecosistema Hillary, la web de OIM y la base de PersonalOS v6.1.

---

## 🏗️ Sesión 030–031: OIM Website SOTA v2 (2026-04-16)

### Objetivo
Rediseño completo SOTA del sitio OIM con paleta navy+yellow, copy exacto del cliente, Apple HIG, y corrección de errores de hidratación.

### Decisiones Técnicas Clave

#### 1. Hydration Fix — Patrón ref.style vs state
- **Problema**: `videoReady` state en `HeroSection` cambiaba className entre SSR y cliente → React hydration mismatch.
- **Solución**: Eliminado el state. Opacity controlada EXCLUSIVAMENTE vía `videoRef.current.style.opacity = '1'` dentro de `useEffect`. Agregado `suppressHydrationWarning` en `<video>`.
- **Regla establecida**: Para cualquier mutación visual que ocurra solo en el cliente sobre un elemento del servidor, usar `ref.style` + `suppressHydrationWarning`, NUNCA state-driven className.

#### 2. Hydration Fix — `<html>` con next/font en Windows
- **Problema**: Hash de clase CSS module de Geist difiere entre SSR y cliente en Windows (paths con espacios/caracteres especiales).
- **Solución**: `suppressHydrationWarning` en el `<html>` root en `layout.tsx`.
- **Es safe**: Solo suprime la advertencia del hash de fuente, no afecta funcionalidad.

#### 3. Video performance — `preload="metadata"`
- **Decisión**: Cambiar `preload="auto"` a `preload="metadata"` en ambos videos (HeroSection + ScrollVideoServices).
- **Por qué**: El browser carga solo duration/dimensions primero → perceived load dramáticamente más rápido. El video completo se carga lazy mientras el usuario scrollea.

#### 4. ScrollVideoServices — INTACTO
- **Regla de oro**: NUNCA tocar la lógica RAF frame-by-frame. Solo cambios permitidos: colores de acento y copy de servicios.
- **Patrón**: `requestAnimationFrame` → `video.currentTime = progress * duration` → setActiveIndex basado en el 25% de cada servicio.

#### 5. Dev Indicator eliminado
- **Problema**: El ícono de Next.js aparecía en producción visual, interfería con el diseño.
- **Solución**: `devIndicators: false` en `next.config.ts`.

#### 6. Copy exacto del cliente — Datos reales OIM
| Campo      | Valor                                         |
|------------|-----------------------------------------------|
| Phone      | +1 (470) 595-0121                             |
| Email      | oiminstallllc@gmail.com                       |
| Address    | 3715 Northcrest Rd Suite 19, Atlanta GA 30340 |
| Instagram  | @oimayen                                      |
| Founded    | 2018                                          |
| Experience | 15 years                                      |

#### 7. ScrollVideoServices — Copy de servicios actualizado
| Servicio                       | Items EN                                                                       |
|--------------------------------|--------------------------------------------------------------------------------|
| Office Furniture Installation  | Desks & workstations / Cubicles / Conference tables / Chairs & storage units   |
| Office Setup & Reconfiguration | New Office Set up / Workstation Reconfiguration / Full furniture rearrangement |
| Disassembly & Moving           | Safe disassembly / Relocation / Reinstallation                                 |
| Commercial Projects            | Small & large offices / Corporate environments / Fast turnaround projects      |

### Skills aplicadas
- **taste-skill**: DESIGN_VARIANCE:8, glassmorphism cards, gradientes cinematográficos, grid asimétrico.
- **ui-ux-pro-max**: Enterprise Gateway + Social Proof pattern, pulsing dot, star review.
- **Apple HIG**: H1 58px/-0.022em, body 17px/1.47, labels 11px/0.08em tracking, min 44px touch targets.

### Archivos clave
| Archivo                                  | Estado                                                    |
|------------------------------------------|-----------------------------------------------------------|
| `src/app/layout.tsx`                     | suppressHydrationWarning en html, favicon drill, SEO SOTA |
| `src/app/page.tsx`                       | Secciones completas, nav glass, footer 4-col              |
| `src/components/HeroSection.tsx`         | Hydration fix via ref.style                               |
| `src/components/ScrollVideoServices.tsx` | Copy actualizado, RAF intacto                             |
| `src/components/AboutSection.tsx`        | Copy exacto, IntersectionObserver                         |
| `src/components/ProjectGallery.tsx`      | Grid asimétrico, yellow CTA                               |
| `src/components/ContactForm.tsx`         | Split layout, SVG icons, Maps embed                       |
| `src/components/ServiceArea.tsx`         | Dark navy, Maps Georgia, pulsing dot                      |
| `src/components/ServicesSection.tsx`     | 2x2 grid cards                                            |
| `public/favicon-drill.png`               | Ícono del taladro en pestaña                              |
| `next.config.ts`                         | devIndicators: false                                      |
| `Now/oim-website/CLAUDE.md`              | Documentación del sub-proyecto                            |

---
*Sesión 030–031 | OIM Website SOTA v2 | 2026-04-16*

---
*Compactado de archivos NP 21 al 29 y Decisiones Estratégicas | Sincronizado 2026-04-14*
