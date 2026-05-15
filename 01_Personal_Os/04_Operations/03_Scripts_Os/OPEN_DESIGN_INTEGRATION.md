# Open Design — Integración PersonalOS

**Versión:** 1.0.0
**Fecha:** 2026-05-11
**Estado:** ✅ INTEGRADO

---

## 🎯 ¿Qué es Open Design?

**Open Design** es un framework multi-agente de diseño que funciona como un "sistema operativo de diseño". Provee:

- **62 skills** de diseño en HTML/prototyping
- **138 design systems** listos para usar
- **Daemon local** + Web UI para orquestar
- **13 coding agents** soportados (Claude Code, Codex, Cursor, etc.)

---

## 📁 Ubicación en PersonalOS

```
01_Personal_Os/05_Archive/07_Repos_Gentleman/open-design/
├── skills/                    # 62 skills de diseño
├── design-systems/             # 138 design systems
├── apps/
│   ├── web/                   # Next.js 16 Web UI
│   └── daemon/                 # Daemon local orchestrator
├── tools/pack/                # Package tools
└── AGENTS.md                  # Config de agentes
```

---

## 🚀 Quick Start — Levantar Open Design

```bash
# 1. Ir al directorio
cd 01_Personal_Os/05_Archive/07_Repos_Gentleman/open-design

# 2. Levantar daemon (backend)
pnpm tools-dev

# 3. En otra terminal, levantar web UI
pnpm web-dev

# 4. Abrir http://localhost:3000
```

---

## 🔗 Skills Disponibles en Open Design

### 🎴 Presentaciones HTML
| Skill                             | Descripción                         |
|-----------------------------------|-------------------------------------|
| `html-ppt`                        | Base de presentaciones HTML         |
| `html-ppt-pitch-deck`             | Pitch deck preset                   |
| `html-ppt-product-launch`         | Product launch deck                 |
| `html-ppt-tech-sharing`           | Tech sharing                        |
| `html-ppt-weekly-report`          | Weekly report                       |
| `guizang-ppt`                     | Magazine style                      |
| `simple-deck`                     | Simple deck builder                 |

### 🌐 Prototipado Web
| Skill                                   | Descripción                  |
|-----------------------------------------|------------------------------|
| `web-prototype`                         | Prototipado web base         |
| `web-prototype-taste-brutalist`         | Brutalist taste              |
| `web-prototype-taste-editorial`         | Editorial taste              |
| `saas-landing`                          | SaaS landing page            |
| `pricing-page`                          | Pricing page                 |
| `dashboard`                             | Dashboard layout             |
| `mobile-app`                            | Mobile app prototype         |

### 📝 Contenido & Docs
| Skill                     | Descripción                  |
|---------------------------|------------------------------|
| `blog-post`               | Blog post generator          |
| `docs-page`               | Documentation page           |
| `pm-spec`                 | PM specs / PRD               |
| `eng-runbook`             | Engineering runbooks         |
| `email-marketing`         | Email campaigns              |

### 🖼️ Imagen & Video
| Skill                      | Descripción               |
|----------------------------|---------------------------|
| `image-poster`             | Poster generation         |
| `motion-frames`            | Motion graphics           |
| `sprite-animation`         | Sprite animation          |

### 🔍 Review & Critique
| Skill                              | Descripción                     |
|------------------------------------|---------------------------------|
| `critique`                         | Design critique                 |
| `tweaks`                           | Design tweaks iteration         |
| `pptx-html-fidelity-audit`         | PPTX vs HTML audit              |

---

## 🎨 Los 138 Design Systems

```
agentic, airbnb, airtable, ant, apple, application, arc,
artistic, bento, binance, bmw, bold, brutalism, bugatti,
cafe, cal, canva, claude, clay, claymorphism, clean,
clickhouse, cohere, coinbase, colorful, composio, contemporary,
corporate, cosmic, creative, cursor, dashboard, default,
discord, dithered, doodle, dramatic, duolingo, editorial,
elegant, elevenlabs, energetic, enterprise, expo, expressive,
fantasy, ferrari, figma, flat, framer, fun, futuristic,
gentleman, github, glassmorphism, gmail, golden, google,
gradient, grand, gravity, helpdesks, heroicons, hilma,
hyper, hyperui, inbox, instagram, linear, lo-fi, mailchimp,
meta, midnight, minimal, mollie, monroe, nike, notion, nuxt,
openai, orb, organic, oshat, outfit, paper, paypal, phlox,
pingcdn, planning, pml, polygon, porsche, precedent, r-notch,
raycast, ripple, robustness, saas, safari, saleor, sampler,
sanct, sendgrid, sentinel, shopify, simple, skapa, slack,
smacss, spectrum, spotify, standard, stripe, sublime, superprops,
tailbits, tailwindui, team, themeg, tiptap, torq, trips, twilio,
twitter, un分层, unsplash, upmost, vance, vertex, volta, wepik,
wix, world, youtube, zapier, zeego, zen, zest, zova, stripe-payment-ui
```

---

## 🔄 Flujo Integrado PersonalOS ↔ Open Design

```
┌─────────────────────────────────────────────────────────┐
│                    PERSONAL OS                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │              OPEN DESIGN                         │   │
│  │  skills/ → 62 skills de diseño                  │   │
│  │  design-systems/ → 138 design systems          │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│          ┌──────────────┼──────────────┐               │
│          ▼              ▼              ▼               │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│    │ Tus Skills│  │ Tus Design │  │ Tu Agent │         │
│    │ (300+)   │  │ Systems   │  │ (Claude) │         │
│    └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

### Cómo Usar Open Design desde PersonalOS:

1. **Diseña con Open Design** → usa sus 62 skills como referencia
2. **Consume sus 138 design systems** → copia el que necesites
3. **Mejora tus skills** → studia los patrones de Open Design
4. **Orquesta con tu OS** → PersonalOS usa Claude, Open Design puede usar 13 agentes

---

## 📋 Comandos Útiles

```bash
# Ver skills disponibles
ls open-design/skills/

# Ver design systems
ls open-design/design-systems/

# Levantar web UI
cd open-design && pnpm web-dev

# Levantar daemon
cd open-design && pnpm tools-dev

# Crear nuevo design system
cd open-design && pnpm new-system

# Build para producción
cd open-design && pnpm build
```

---

## 🔗 Integración con Tus Skills Existentes

| Tu Skill                     | Se Complementa Con Open Design                |
|------------------------------|-----------------------------------------------|
| **Huashu Design**            | `web-prototype-*` para más prototipos         |
| **Dumbledor Design**         | `critique`, `tweaks` para validación          |
| **Frontend Slides**          | `html-ppt-*` para más presets                 |
| **Ui Ux Pro Max**            | `design-brief` para nuevos proyectos          |
| **Taste Skill**              | `critique` para validación de diseño          |

---

## 📊 Estado de Integración

| Componente                      | Estado           | Notas                                     |
|---------------------------------|------------------|-------------------------------------------|
| Submodule clonado               | ✅                | 2026-05-03                                |
| Skills disponibles              | ✅                | 62 skills                                 |
| Design systems                  | ✅                | 138 sistemas                              |
| Daemon configurado              | ⏳                | Requiere `pnpm tools-dev`                 |
| Web UI deployada                | ⏳                | Requiere `pnpm web-dev`                   |
| Skills integradas al OS         | ✅                | Ahora disponibles como referencia         |

---

## 🚀 Próximos Pasos

1. [ ] Levantar daemon: `cd open-design && pnpm tools-dev`
2. [ ] Explorar web UI: `cd open-design && pnpm web-dev`
3. [ ] Integrar skills específicas como referencia
4. [ ] Importar design systems que no tengas

---

**Versión:** 1.0.0 — 2026-05-11
**Integrado por:** Claude (PersonalOS)
