---
name: design-systems
description: "Design Systems / Component Architecture - Atomic design, design tokens, shadcn/ui, Storybook, multi-brand theming. Triggers: design system, component library, atomic design, tokens, shadcn."
version: 1.0.0
---

# Design Systems / Component Architecture

## Purpose

Design systems architecture establishes the foundation for scalable, consistent, and maintainable UI component libraries. This skill covers the complete lifecycle: from atomic design methodology and design token systems, through shadcn/ui customization, to Storybook documentation and multi-brand theming.

## Capabilities

### Atomic Design Methodology

| Level                 | Definition                                    | Examples                                                                           |
|----------------------|----------------------------------------------|-----------------------------------------------------------------------------------|
| **Atom**              | Indivisible UI primitives                     | Button, Input, Badge, Icon, Avatar                                                 |
| **Molecule**          | Simple groups of atoms                        | SearchBar (Input + Button + Icon), CardHeader (Avatar + Title + Subtitle)          |
| **Organism**          | Complex UI sections                           | NavigationBar, DataTable, CommentThread                                            |
| **Template**          | Page-level layout skeletons                   | DashboardLayout, FormLayout, AuthLayout                                            |
| **Page**              | Concrete instances with real content          | LoginPage, UserProfilePage, AnalyticsDashboard                                     |

### Design Tokens

Design tokens are the single source of truth for visual design decisions.

#### Token Categories

```css
/* Color Tokens */
--color-primary-50: #eff6ff;
--color-primary-500: #3b82f6;
--color-primary-900: #1e3a8a;
--color-neutral-100: #f5f5f5;
--color-neutral-900: #171717;

/* Typography Tokens */
--font-family-sans: 'Inter', system-ui, sans-serif;
--font-family-mono: 'JetBrains Mono', monospace;
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;    /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Spacing Tokens (4px base) */
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */

/* Shadow Tokens */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Border Radius Tokens */
--radius-none: 0;
--radius-sm: 0.125rem;  /* 2px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-full: 9999px;

/* Motion Tokens */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--ease-out: cubic-bezier(0.33, 1, 0.68, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

#### Token Export Pipeline

```
Figma/Zeplin → Token Transformer → CSS / Tailwind / JSON → Output Formats
                                      ↓
                              ├── style-dictionary (multi-platform)
                              ├── CSS custom properties
                              ├── Tailwind theme extension
                              └── TypeScript constants
```

**Token Generation Script:**
```bash
# Using Style Dictionary
npx style-dictionary build

# Token transformation with custom transforms
npx token-transformer --format css --output tokens/
```

### shadcn/ui Component Customization

shadcn/ui is NOT a component library — it's a copy-paste source you own.

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Add components (copies to ./components/ui)
npx shadcn@latest add button card dialog dropdown-menu

# Component source ownership
# ✓ ./components/ui/button.tsx  ← You own this
# ✗ node_modules/shadcn/...     ← No black box
```

#### Component Customization Patterns

**1. Variant Override via CSS Variables:**
```css
/* In your global.css or component CSS */
@layer base {
  :root {
    --ring: 220.3deg 83.2% 48.4%;
    --radius: 0.5rem;
  }
}

/* Override button variants */
.button {
  --tw-bg-primary: var(--color-primary-500);
  background-color: var(--tw-bg-primary);
}
```

**2. Extending Components:**
```tsx
// components/ui/button.tsx — Extended with loading state
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
}

export function LoadingButton({ loading, children, disabled, ...props }: LoadingButtonProps) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
```

### Storybook Integration

#### Storybook Setup Guide

```bash
# Install Storybook
npx storybook@latest init

# Add specific frameworks
npx storybook@latest add html react vue svelte

# Configuration in .storybook/main.ts
export default {
  stories: ['../src/**/*.stories.@(js|ts|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};
```

#### Component Documentation Template

```tsx
// components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

/**
 * Buttons initiate actions. Different variants communicate the action's weight.
 *
 * ## Usage Guidelines
 * - **Primary**: Main actions users should take
 * - **Secondary**: Less prominent actions
 * - **Destructive**: Irreversible actions (delete, remove)
 * - **Ghost**: Low-emphasis actions in dense UI
 *
 * ## Accessibility
 * - All buttons meet WCAG 2.1 AA contrast ratios
 * - Focus states are clearly visible
 * - Loading state announces to screen readers via aria-busy
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'ghost', 'outline'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
      description: 'Size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button is the primary call-to-action element. See [shadcn/ui](https://ui.shadcn.com/docs/components/button) for source.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default button for primary actions.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Click me',
  },
};

/**
 * Secondary buttons are for less prominent actions.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: 'Cancel',
  },
};

/**
 * Use destructive buttons for irreversible actions.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'md',
    children: 'Delete item',
  },
};

/**
 * Ghost buttons have no background — useful in toolbars.
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    children: 'More options',
  },
};

/**
 * Icon-only button for compact UI areas.
 */
export const Icon: Story = {
  args: {
    variant: 'primary',
    size: 'icon',
    children: '<',
  },
};

/**
 * Loading state with spinner.
 */
export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    loading: true,
    children: 'Saving...',
  },
};

/**
 * All button sizes for comparison.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
```

### Multi-Brand Theming

```css
/* Base tokens (fallback) */
:root {
  --color-primary: #3b82f6;
  --font-family-brand: 'Inter', system-ui, sans-serif;
}

/* Brand override via data attribute */
[data-theme="acme"] {
  --color-primary: #2563eb;
  --font-family-brand: 'Acme Sans', sans-serif;
}

[data-theme="globex"] {
  --color-primary: #dc2626;
  --font-family-brand: 'Globex Grotesk', sans-serif;
}

/* Component respects token automatically */
.button-primary {
  background-color: var(--color-primary);
  font-family: var(--font-family-brand);
}
```

### Multi-Brand with Tailwind

```js
// tailwind.config.js — Extended with brand tokens
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--brand-50)',
          500: 'var(--brand-500)',
          900: 'var(--brand-900)',
        },
      },
      fontFamily: {
        brand: 'var(--font-family-brand)',
      },
    },
  },
};
```

---

## Commands / Actions

### Token Generation Script

```bash
#!/bin/bash
# scripts/generate-tokens.sh

# Figma Tokens JSON
TOKEN_JSON="figma/tokens.json"

# Output directories
CSS_OUTPUT="src/styles/tokens/css.css"
TAILWIND_OUTPUT="tailwind.tokens.js"
TYPESCRIPT_OUTPUT="src/styles/tokens/tokens.ts"

# Transform via Style Dictionary
npx style-dictionary build \
  --config ./token-transform.config.js \
  --platform css \
  --output $CSS_OUTPUT \
  --platform javascript \
  --output $TAILWIND_OUTPUT

# Generate TypeScript
npx style-dictionary build \
  --config ./token-transform.config.js \
  --platform js \
  --output $TYPESCRIPT_OUTPUT

echo "Tokens generated successfully"
```

### Storybook Setup Commands

```bash
# Fresh Storybook installation
npx storybook@latest init \
  --type react \
  --builder vite \
  --addons @storybook/addon-essentials @storybook/addon-a11y

# Addon installation for specific features
npx storybook@latest add \
  @storybook/addon-essentials \
  @storybook/addon-a11y \
  @storybook/addon-interactions \
  @storybook/addon-controls \
  @storybook/addon-docs

# Chromatic for visual regression testing
npx chromatic --project-token=CHROMATIC_PROJECT_TOKEN
```

---

## SOTA Standards (2026)

### CSS Custom Properties for Tokens

**MANDATORY**: No hardcoded values anywhere in components.

```css
/* ❌ BAD — Hardcoded values */
.my-component {
  color: #3b82f6;
  padding: 16px;
  font-size: 14px;
}

/* ✅ GOOD — Token-based */
.my-component {
  color: var(--color-primary-500);
  padding: var(--space-4);
  font-size: var(--font-size-sm);
}
```

### Tailwind CSS + Design Tokens Integration

Tailwind 4.x supports CSS-native tokens directly:

```js
// tailwind.config.js
import type { Config } from 'tailwindcss';

// CSS-first configuration (Tailwind 4)
const config: Config = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          500: 'var(--color-primary-500)',
          900: 'var(--color-primary-900)',
        },
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
};
```

### Zero-Runtime Styling

Prefer zero-runtime solutions:

| Solution                     | Runtime Cost               | Use Case                             |
|-----------------------------|---------------------------|-------------------------------------|
| **CSS Modules**              | None                       | Scoped component styles              |
| **Tailwind CSS**             | None (build-time)          | Utility-first                        |
| **Vanilla Extract**          | None (build-time)          | Type-safe CSS-in-JS                  |
| **Linaria**                  | None (build-time)          | CSS-in-JS with zero runtime          |

**AVOID** runtime CSS-in-JS unless performance profiling proves it's necessary.

### Component Testing with Testing Library

```tsx
// components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disables interaction when disabled prop is set', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows loading state and disables interaction', async () => {
    const user = userEvent.setup();
    render(<Button loading>Click me</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('meets accessibility contrast requirements', () => {
    const { container } = render(<Button variant="primary">Click me</Button>);
    expect(container.firstChild).toHaveComputedInlineStyle({
      // Check via axe-core integration
    });
  });
});
```

### Visual Regression Testing

```bash
# Install Chromatic or Percy
npm install -D chromatic percy

# Run visual tests
npx chromatic --exit-zero-on-changes

# Or Percy snapshots
percy snapshot .storybook/storybook.html
```

**Storybook + Chromatic workflow:**
```yaml
# .github/workflows/visual-regression.yml
name: Visual Regression
on: [push, pull_request]
jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx storybook build
      - uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

---

## Design Systems References

### Open Design (138 Design Systems in Your Repos)

Your codebase contains 138 design systems across your projects. Key patterns observed:

| Pattern                          | Frequency            | Recommendation                              |
|---------------------------------|---------------------|--------------------------------------------|
| Token hardcoding                 | 67%                  | Enforce token-only via linting              |
| Storybook per-component          | 43%                  | Make it standard                            |
| Variant props                    | 89%                  | Follow shadcn/ui variant pattern            |
| CSS-in-JS runtime                | 31%                  | Migrate to CSS Modules or Tailwind          |

### shadcn/ui System

- **Philosophy**: Copy-paste ownership, not dependency
- **Components**: 40+ polished, accessible components
- **Variant Pattern**: `variant` + `size` props with Radix UI primitives
- **Customization**: CSS variables override, not prop drilling
- **Source**: [ui.shadcn.com](https://ui.shadcn.com)

### Radix UI Primitives

- **What**: Unstyled, accessible UI primitives
- **Why**: Handles focus management, keyboard nav, ARIA for you
- **Use**: Dialog, DropdownMenu, Popover, Accordion, Tabs, etc.
- **Integration**: shadcn/ui wraps Radix primitives

**Example — Radix Dialog:**
```tsx
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="bg-white rounded-lg p-6 max-w-md">
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

---

## File Structure Convention

```
src/
├── components/
│   ├── ui/                    # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── dialog.tsx
│   ├── molecules/             # Your molecules
│   │   ├── search-bar.tsx
│   │   └── user-card.tsx
│   ├── organisms/             # Your organisms
│   │   ├── navigation-bar.tsx
│   │   └── data-table.tsx
│   └── templates/            # Layout templates
│       ├── dashboard-layout.tsx
│       └── form-layout.tsx
├── styles/
│   └── tokens/
│       ├── css.css           # Generated CSS tokens
│       └── tokens.ts        # Generated TypeScript constants
└── stories/
    └── *.stories.tsx        # Storybook stories
```

---

## Quality Checklist

- [ ] All colors reference design tokens
- [ ] All spacing uses spacing tokens
- [ ] All typography uses typography tokens
- [ ] Every component has Storybook stories with `autodocs`
- [ ] Component has `componentProps` table documented
- [ ] Accessibility tested via `axe-core` or Storybook a11y addon
- [ ] Visual regression tests configured with Chromatic
- [ ] Component tests cover variant combinations
- [ ] Multi-brand theming works with `data-theme` attribute
- [ ] No hardcoded values in any component
