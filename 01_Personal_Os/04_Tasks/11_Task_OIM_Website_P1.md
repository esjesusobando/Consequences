---
title: "OIM Website — Browser Verification"
category: technical
priority: P1
status: n
created_date: 2026-05-22
resource_refs:
  - 01_Personal_Os/06_Projects/01_Projects_Lab/07_OIM_Website/
---

# Task: OIM Website — Browser Verification

**Prioridad:** P1  
**Fecha creación:** 2026-05-22  
**Proyecto:** Think_Different  
**Origen:** Plan_Seguir_2026-05-22.md — Fase E

---

## 📍 Contexto

OIM Website es un proyecto activo en múltiples ubicaciones:

| Instancia  | Path                                               | Estado                |
|-----------|---------------------------------------------------|----------------------|
| **Primary**| `03_Resultado/09b_World_OIM/02_OIM_Website/`       | ✅ Activo — Next 16.2.2|
| **Backup** | `03_Resultado/09b_World_OIM/04_OIM_Website_Backup/`| ✅ Funcional           |
| **Legacy** | `03_Resultado/09b_World_OIM/03_OIM_Website_One/`   | ⚠️ Revisar            |

### Estado Primary (02_OIM_Website)

```json
{
  "next": "16.2.2",
  "react": "19.2.4",
  "react-dom": "19.2.4"
}
```

- **Stack:** Next.js 16 (canary!), React 19.2.4
- **Estructura:** `src/app/`, `src/components/`, `public/videos/`
- **Docs:** `README.md` existe (17891 bytes)
- **Deploy:** Configurado para Vercel (`vercel.json`)

### Componentes Verificados

| Componente           | Archivo                                 | Estado  |
|---------------------|----------------------------------------|--------|
| Home page            | `src/app/page.tsx`                      | ✅       |
| Hero Section         | `src/components/HeroSection.tsx`        | ✅       |
| Services             | `src/components/ServicesSection.tsx`    | ✅       |
| Scroll Video Services| `src/components/ScrollVideoServices.tsx`| ✅       |
| Project Gallery      | `src/components/ProjectGallery.tsx`     | ✅       |
| About Section        | `src/components/AboutSection.tsx`       | ✅       |
| Contact Form         | `src/components/ContactForm.tsx`        | ✅       |
| Service Area         | `src/components/ServiceArea.tsx`        | ✅       |

### Videos en Public

```
public/videos/
├── home-exploding.mp4
├── Interior_Design.mp4
└── Home_exploding_view.mp4
```

---

## 🎯 Definición de Terminado

1. **Browser verification completa** — Playwright o manual en múltiples browsers
2. **Responsive check** — mobile, tablet, desktop
3. **Video playback** — sin errors, LCP < 2.5s
4. **Build production** — `next build` pasa en primary y backup
5. **Link checking** — sin 404s

---

## ➡️ Siguiente Acción

**Verificar estado de build:**

```bash
cd 03_Resultado/09b_World_OIM/02_OIM_Website
npm run build  # producción
npm run dev    # desarrollo
```

**Luego browser verification con Playwright:**

```bash
# Si existe playwright
npx playwright test --project=chromium
# O manual: abrir http://localhost:3000 en Chrome, Firefox, Safari
```

---

## 📋 Metadata

- **Ubicación tarea:** `01_Personal_Os/04_Tasks/11_Task_OIM_Website_P1.md`
- **Keywords:** `oim website`, `browser verification`, `playwright`
- **Bloqueado por:** —
- **Related:** `03_Resultado/09b_World_OIM/` tiene 3 instancias
