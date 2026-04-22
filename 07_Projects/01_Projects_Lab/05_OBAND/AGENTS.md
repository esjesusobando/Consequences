<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# OIM Website - Agent Rules

> **Project**: Office Installations Mayen (OIM)  
> **Sector**: Ingeniería de Gestión de Espacios Corporativos  
> **Tech Stack**: Next.js 16.2.2 + React 19.2.4 + Tailwind CSS 4 + Framer Motion

---

## Design System Rules

### Color Palette
- **Background**: `#0A0A0A` (never use any other dark variant — single source of truth)
- **Accent**: `#F97316` (industrial orange — singular accent, no secondary colors)
- **Foreground**: `#FFFFFF` for text, `#A3A3A3` for muted text
- **Glass Effects**: Use `rgba(255, 255, 255, 0.03)` for subtle backgrounds

### Typography
- **Primary Font**: Poppins (headings, UI elements)
- **Secondary Font**: DM Sans (body text, paragraphs)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Never use**: Inter, Roboto, or any other font not specified

### Motion (Framer Motion)
- Use **spring physics** for all animations — no linear or ease-out defaults
- **Stagger children**: `transitionDelay: index * 0.05` for sequential reveals
- **Easing**: `{ stiffness: 300, damping: 30 }` as default spring config
- **Never use**: CSS transitions, pure CSS animations, or `ease-in-out` defaults

### Mobile-First
- Use `min-h-[100dvh]` for full viewport height (accounts for mobile browsers)
- Base styles for mobile, `md:` and `lg:` prefixes for larger screens
- Test on 375px width minimum

---

## Code Standards

### Next.js 16.x Rules
- Use **App Router** exclusively (`src/app/` directory)
- **Server Components** by default — add `'use client'` only when needed
- Use **Server Actions** for form submissions (no API routes unless necessary)
- **React 19** features: `use` hook for promise handling, no `.then()` chains

### TypeScript
- **Never use `any`** — strict typing always
- Use **interfaces** for object structures (not types unless union types needed)
- **Never use `var`** — `const` or `let` only

### React Components
- **Functional components** exclusively (no class components)
- **Named exports** preferred over default exports
- Use **Lucide React** for icons (no emoji)
- Keep components under 200 lines — split if needed

---

## Copy Standards

- **No emojis** in any copy — use Phosphor icons instead
- **Professional tone**: Industrial engineering, corporate B2B
- **Spanish** for primary content, English labels only where necessary
- **Avoid**: Slang, casual language, contractions in formal content

---

## Testing Rules (Vitest + React Testing Library)

- Tests live alongside source: `src/components/Component.test.tsx`
- Run tests: `npm run test` (watch mode), `npm run test:run` (single run)
- Follow TDD: Red → Green → Refactor
- Minimum coverage: 70% on new code

---

## File Organization

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components (named exports)
├── hooks/            # Custom React hooks
├── lib/              # Utilities, configs, constants
├── styles/           # Additional CSS (if needed)
└── test/             # Test setup and utilities
```

---

## Key Commands

| Command            | Description              |
|--------------------|--------------------------|
| `npm run dev`      | Start development server |
| `npm run build`    | Production build         |
| `npm run test`     | Run tests in watch mode  |
| `npm run test:run` | Run tests once           |
| `npm run lint`     | Run ESLint               |
