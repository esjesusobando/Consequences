# OIM Website Redesign - Content Strategy & Implementation Plan

> **Project**: Office Installations Mayen (OIM)  
> **Location**: Atlanta, GA  
> **Since**: 2018  
> **Last Updated**: April 2026

---

## 1. Brand Overview

### Tagline
> "Professional Office Furniture Installation in Atlanta"

### Sub-headline
> "Since 2018, providing reliable, high-quality furniture assembly and relocation services for corporate and residential spaces."

### Value Proposition
- 8+ Years Experience
- Bilingual Service (English & Español)
- Licensed & Insured
- Serving Atlanta & Surrounding Areas

---

## 2. Contact Information

| Field            | Value                                                             |
|------------------|-------------------------------------------------------------------|
| **Address**      | 3715 NORTHCREST RD SUITE 19, ATLANTA, GA 30340                    |
| **Phone**        | [To be added]                                                     |
| **Email**        | [To be added]                                                     |
| **Service Area** | Atlanta, Marietta, Alpharetta, Lawrenceville, Surrounding Suburbs |
| **Hours**        | Monday - Saturday [Hours TBD]                                     |
| **WhatsApp**     | CTA Secondary                                                     |

---

## 3. Page Sections

### 3.1 Home (Hero Section)

```
┌─────────────────────────────────────────────────────┐
│  🎬 VIDEO BACKGROUND (Interior_Design.mp4)          │
│  - Loop: true                                       │
│  - Muted: true                                      │
│  - Autoplay: true                                   │
│                                                     │
│  "Professional Office Furniture Installation      │
│   in Atlanta"                                       │
│                                                     │
│  "Since 2018, providing reliable, high-quality     │
│   furniture assembly and relocation services      │
│   for corporate and residential spaces."          │
│                                                     │
│  [Get a Free Quote]  ← Primary CTA                 │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ ✓ 8+ Years  │ Bilingual  │ Licensed  │ ATL  │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 3.2 Services

Presented as icon grid:

| Service                           | Description                                                                    |
|-----------------------------------|--------------------------------------------------------------------------------|
| **Cubicle Installation**          | Expert assembly of modular office systems and workstations                     |
| **Office Relocation**             | Seamless disassembly, transport, and reinstallation of your existing furniture |
| **Executive Suites & Desks**      | Precision setup for high-end office furniture and conference rooms             |
| **Delivery & Assembly**           | White-glove service from the warehouse to your final floor plan                |
| **Decommissioning & Liquidation** | Professional removal and disposal of old office assets                         |

### 3.3 About Us

> **"Experience You Can Trust"**
>
> Since 2018, Office Installations Mayen has been a cornerstone for businesses in Atlanta looking to optimize their workspace. Our team combines technical expertise with a commitment to punctuality and quality. We bridge the gap with bilingual communication, ensuring every project—from small startups to large corporate offices—is executed with 100% satisfaction.

### 3.4 Project Gallery

Organized by category:

- **Corporate**: Large-scale cubicle installations
- **Executive**: Private offices and conference rooms
- **Before & After**: Visual proof of transformation value

### 3.5 Contact Section

- Direct contact (Phone + Email)
- Service area map
- Working hours
- Secondary CTA: [Chat on WhatsApp]

---

## 4. Design Requirements

### 4.1 Color Scheme

> **⚠️ IMPORTANT**: Dark theme is **DISCARDED** for this client.

Based on the current production site (Guia_Design.png) and client preferences:
- Primary: [Client preference - NOT dark/orange]
- Use reference colors from current site
- Professional, corporate aesthetic suitable for B2B

### 4.2 Video Assets

| Video                                  | Location        | Settings              |
|----------------------------------------|-----------------|-----------------------|
| `Interior_Design.mp4`                  | Hero Background | loop, muted, autoplay |
| `Home_exploding_view_202604041752.mp4` | Scroll Effect   | Triggered on scroll   |

### 4.3 Effects (Cinematic)

Reference: [YouTube - Effect Reference](https://youtu.be/ZfYvv-0l9NA)

Implemented with Framer Motion (already in project):
- Parallax scrolling
- Smooth section transitions
- Text reveal with stagger
- Scroll-triggered animations

### 4.4 Taste-Skill Principles

From `leonxlnx/taste-skill` (6.8K stars):

- ❌ **NO** centered heroes
- ❌ **NO** 4-column generic cards
- ❌ **NO** typical gradients
- ✅ Use unique spacing
- ✅ Controlled asymmetry
- ✅ Typography with personality
- ✅ High-agency frontend design

---

## 5. Industry Research (2025 Trends)

### Top Office Furniture Brands

| Brand             | Key Strengths                               |
|-------------------|---------------------------------------------|
| **Steelcase**     | Smart ergonomics, sustainability            |
| **Herman Miller** | Premium design, integrated technology       |
| **Vitra**         | European design, designer collaborations    |
| **Knoll**         | Art furniture, timeless design              |
| **Buro**          | Educational ergonomics, modular flexibility |

### Key Trends 2025

1. **Smart Ergonomics** - Chairs that adapt to user
2. **Sustainability** - Recycled materials, eco-friendly
3. **Modularity** - Flexible workspace layouts
4. **Resimercial** - Home + office aesthetic blend
5. **Biophilic Design** - Natural elements, plants

---

## 6. Implementation Plan

### Phase 1: Content Setup
- [ ] Update all text content in components
- [ ] Add contact information
- [ ] Configure service descriptions

### Phase 2: Visual Elements
- [ ] Integrate Hero video (Interior_Design.mp4)
- [ ] Add scroll effect video
- [ ] Apply color scheme (client preference)
- [ ] Implement Taste-Skill principles

### Phase 3: Effects & Animation
- [ ] Framer Motion animations
- [ ] Parallax scrolling
- [ ] Text reveal stagger effects
- [ ] Smooth transitions

### Phase 4: Testing & Deploy
- [ ] Local testing
- [ ] Build verification
- [ ] Deploy to production

---

## 7. Technical Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4
- **Animation**: Motion (Framer Motion)
- **Language**: TypeScript
- **Deployment**: Vercel/Netlify ready

---

## 8. SEO Recommendations

| Element           | Recommendation                                   |
|-------------------|--------------------------------------------------|
| Page Title        | Office Furniture Installation Atlanta            |
| Language Selector | ES/EN toggle (competitive advantage in Atlanta)  |
| Images            | Real photos of team and work (no stock)          |
| Form Fields       | Keep minimal: Name, Company, Phone, Service Type |

---

## References

- Current site: `Guia_Design.png`
- Video assets: `05_OBAND/00_Recursos_Varios/`
- Taste-Skill: `leonxlnx/taste-skill` on GitHub
- Design trends: Buro Seating 2025 Report

---

*Document generated for SDD workflow - OIM Website Redesign*
