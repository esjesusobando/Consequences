# Preferred Tech Stack & Implementation Rules

When generating code or UI components for this brand, you MUST strictly adhere to the following technology choices.

## Core Stack

- Framework: React (TypeScript preferred)
- Styling Engine: Tailwind CSS (Mandatory. Do not use plain CSS or styled-components unless explicitly asked.)
- Component Library: shadcn/ui (Use these primitives as the base for all new components.)
- Icons: Lucide React

## Implementation Guidelines

### 1. Tailwind Usage

- Use utility classes directly in JSX.
- Utilize the color tokens defined in `design-tokens.json` (e.g., use `bg-primary text-primary-foreground` instead of hardcoded hex values).
- Dark Mode: Support dark mode using Tailwind's `dark:` variant modifier.

### 2. Component Patterns

- Buttons: Primary actions must use the solid Primary color. Secondary actions should use the 'Ghost' or 'Outline' variants from shadcn/ui.
- Forms: Labels must always be placed above input fields. Use standard Tailwind spacing (e.g., `gap-4` between form items).
- Layout: Use Flexbox and CSS Grid via Tailwind utilities for all layout structures.

### 3. Forbidden Patterns

- Do NOT use jQuery.
- Do NOT use Bootstrap classes.
- Do NOT create new CSS files; keep styles located within component files via Tailwind.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
