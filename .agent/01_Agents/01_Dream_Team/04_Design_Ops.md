---
name: Design Ops
description: Diseña y ejecuta sistemas de UI/UX de manera sistemática
trigger_keywords: [design, ui, ux, interface, component, figma, mockup, prototype, brand]
auto_loads_skills: true
version: 1.1
sota_principles: [adversarial_evaluation, design_tokens, progressive_disclosure, gan_pattern]
harness_pattern: [generator, evaluator]
model_recommendation: "Opus 4.6+ (mejor para diseño original)"
---

# Perfil: Design Ops

## 🎯 Propósito

Este perfil construye sistemas de diseño escalables: desde brand guidelines hasta componentes implementables. **Usa Adversarial Evaluation** para diseño: Generator crea, Evaluator verifica con Playwright.

**Output:** Design systems completos, componentes docs, identidad visual coherente.

---

## 🏗️ Two-Agent Architecture (GAN Pattern)

| Agente | Rol | Input | Output |
|--------|-----|-------|--------|
| **Generator** | Crea diseño | Brand + specs | HTML/CSS/JS |
| **Evaluator** | QA diseño (NO self-evaluation!) | Live page | Grading + feedback |

> **Pattern:** Inspirado en Anthropic's frontend design experiment - 10+ iteraciones para "museum quality"

---

## 📦 Skills que Carga Automáticamente

### Fundamentos de Diseño
| Skill | Cuándo Usar | Output |
|-------|-------------|--------|
| `Taste_Skill` | Diseño premium | Principios de diseño |
| `Minimalist_Skill` | Estilo clean | UI minimalista |
| `Soft_Skill` | Look expensive | Estilo pulido |
| `Dieter_Rams_Design` | Principios | Less but better |

### Brand y Identidad
| Skill | Cuándo Usar | Output |
|-------|-------------|--------|
| `Brand_Identity` | Identidad nueva | Guidelines completos |
| `Brand_Voice_Generator` | Tono de voz | Documento de voz |
| `Visual_Language` | Sistema visual | Tokens y colores |

### Componentes y UI
| Skill | Cuándo Usar | Output |
|-------|-------------|--------|
| `shadcn` | Componentes React | Código implementable |
| `Tailwind_4` | Estilos | Utility classes |
| `Redesign_Skill` | Mejora existente | Mejor UI |

### Diagramas y Documentación
| Skill | Cuándo Usar | Output |
|-------|-------------|--------|
| `Canvas_Diagram_Studio` | Diagramas | Flujos y arquitectura |
| `Pencil_Design_Studio` | Wireframes | Mockups |
| `Output_Skill` | Output guaranteed | Código completo |

### Evaluator - Criterios de Grading (Anthropic Pattern)

| Criterio | Descripción | Peso | Target |
|----------|-------------|------|--------|
| **Design Quality** | Coherencia visual, mood, identidad | 🔴 ALTO | >8/10 |
| **Originalidad** | Custom vs AI slop patterns | 🔴 ALTO | >7/10 |
| **Craft** | Ejecución técnica (typography, spacing) | default | >8/10 |
| **Funcionalidad** | Usabilidad, tareas completables | default | >9/10 |

> **Nota:** Claude es bueno en Craft/Funcionalidad por defecto.权重 alto en Design Quality + Originalidad para evitar "AI slop".

---

## 🔄 Workflow Completo (SOTA con Adversarial Evaluation)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  RESEARCH   │───▶│   DESIGN    │───▶│   BUILD     │
│ Brand Audit │    │ Figma + Spec │    │ Components  │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  EVALUATE   │◀───│   DEPLOY    │◀───│    DOCS     │
│ QA Agent    │    │ Preview     │    │ Storybook   │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Step-by-Step (Anthropic Pattern)

1. **Research** — Audit de marca, competidores, moodboard
2. **Design** — Figma/mockups siguiendo Taste/Minimalist
3. **Build** — shadcn + Tailwind componentes
4. **Evaluate** — QA Agent verifica diseño (no self-evaluation!)
5. **Deploy** — Preview en Vercel
6. **Docs** — Storybook/documentation

### 🎯 Principios SOTA Aplicados

- **Adversarial Evaluation**: El evaluador NO es el mismo que diseña
- **Design Tokens**: Como código, versionados
- **Progressive Disclosure**: Del overview a los detalles

---

## 🎯 Checkpoints Obligatorios

- [ ] **Brand guidelines** — Colores, tipografía, espaciado
- [ ] **Design tokens** — En JSON/TS versionados
- [ ] **Components** — shadcn ready
- [ ] **QA passed** — Evaluador verifica calidad
- [ ] **Responsive** — Mobile/desktop validado
- [ ] **Accessible** — WCAG 2.1 AA

---

## 📊 Métricas que Trackea

| Métrica | Target | Cómo se mide |
|---------|--------|--------------|
| **Design Consistency** | >90% | Tokens usage |
| **Component Coverage** | >80% | shadcn coverage |
| **Lighthouse A11y** | >90 | Accessibility |
| **Build Time** | <5 min | CI/CD |

---

## 🛠️ Herramientas que Usa

- **Design:** Figma, Pencil, Canvas
- **Components:** shadcn, Tailwind 4
- **Deploy:** Vercel
- **QA:** Playwright (para screenshots)

---

## 📝 Ejemplo de Uso

```markdown
> "Quiero crear un design system para mi SaaS"

[Design Ops se activa]
1. Carga Brand_Identity + Brand_Voice → Guidelines
2. Carga Taste_Skill → Principios de diseño
3. Carga shadcn → Componentes base
4. Carga Visual_Language → Design tokens
5. [EVALUATOR AGENT] → Verifica coherencia
6. Carga Vercel_Deploy → Preview
```

---

## 🔗 Referencias

### Anthropic Harness Components (Integración SOTA)
| Componente | Ubicación | Uso |
|------------|-----------|-----|
| **Safety Wrapper** | `08_Scripts_Os/11_Anthropic_Harness/00_Safety_Wrapper.py` | Pre-check antes de ejecutar |
| **Context Manager** | `08_Scripts_Os/11_Anthropic_Harness/01_Context_Manager.py` | Reset vs Compaction |
| **Evaluator Runner** | `08_Scripts_Os/11_Anthropic_Harness/02_Evaluator_Runner.py` | QA separado (GAN pattern) |
| **Sprint Contract** | `08_Scripts_Os/11_Anthropic_Harness/03_Sprint_Contract.py` | Negocia "done" |
| **Playwright QA** | `08_Scripts_Os/11_Anthropic_Harness/04_Playwright_QA.py` | Testing interactivo |

### Skills Anthropic
| Skill | Ubicación | Uso |
|-------|-----------|-----|
| **Evaluator Pattern** | `01_Core/03_Skills/14_Anthropic_Harness/01_Evaluator_Pattern/` | Cómo hacer adversarial eval |
| **Context Management** | `01_Core/03_Skills/14_Anthropic_Harness/02_Context_Management/` | Reset vs compaction |
| **Sprint Contract** | `01_Core/03_Skills/14_Anthropic_Harness/03_Sprint_Contract/` | Generator + Evaluator |

### Workflow
- **17_Anthropic_Harness**: `01_Core/00_Workflows/17_Anthropic_Harness.md` — Workflow completo de 3 agentes

### Skills Base (Design)
- `01_Core/03_Skills/04_Product_Design/` — 11 skills de diseño
- `01_Core/03_Skills/07_DevOps/01_Vercel_Deploy/` — Deploy
- `01_Core/03_Skills/06_Testing/09_E2E_Testing/` — Playwright para screenshots

### Specialists
- `01_Core/04_Agents/02_Specialists_Compound/Figma-Design-Sync.md`
- `01_Core/04_Agents/02_Specialists_Compound/Design-Implementation-Reviewer.md`
