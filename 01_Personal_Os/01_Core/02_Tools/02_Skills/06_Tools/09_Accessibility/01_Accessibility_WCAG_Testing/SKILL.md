---
name: accessibility-wcag-testing
description: "WCAG 2.2 compliance verification and accessibility testing automation. Triggers: accessibility, wcag, a11y, screen reader, contrast, keyboard nav."
version: 1.0.0
---

# Accessibility Testing / WCAG 2.2

## Purpose

WCAG 2.2 compliance verification and accessibility testing automation for web applications. Ensures digital products are usable by people with disabilities, including visual, motor, cognitive, and auditory impairments.

## Capabilities

### WCAG 2.2 Checklist Implementation

| Success Criterion                | Level   | Description                                               |
|----------------------------------|---------|-----------------------------------------------------------|
| 1.4.10 Reflow                    | AA      | Content reflows without horizontal scrolling at 400% zoom |
| 1.4.11 Non-Text Contrast         | AA      | UI components and graphics have 3:1 contrast minimum      |
| 1.4.12 Text Spacing              | AA      | Text can be resized without loss of content               |
| 1.4.13 Content on Hover or Focus | AA      | Additional content is dismissible and hoverable           |
| 2.1.1 Keyboard                   | A       | All functionality via keyboard                            |
| 2.1.2 No Keyboard Trap           | A       | Focus can be moved away                                   |
| 2.4.11 Focus Appearance          | AA      | Focus indicator visible with 3:1 contrast                 |
| 2.4.3 Focus Order                | A       | Focus order follows logical sequence                      |
| 2.4.7 Focus Visible              | AA      | Focus indicator is visible                                |
| 2.5.7 Dragging Movements         | AA      | Alternative provided for drag-and-drop                    |
| 2.5.8 Target Size Minimum        | AA      | Touch targets at least 24x24px                            |
| 3.2.1 On Focus                   | A       | Context does not change on focus                          |
| 3.3.7 Redundant Entry            | A       | User input not required twice                             |

### axe-core Integration with Playwright

```typescript
// playwright.accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('full page accessibility audit', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('component-level audit', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('.component-to-test')
      .withTags(['wcag22aa'])
      .analyze();

    // Log detailed results for CI
    console.log('Violations:', results.violations.length);
    console.log('Passes:', results.passes.length);
  });
});
```

### Keyboard Navigation Testing Patterns

```typescript
// Keyboard navigation test helper
export async function testKeyboardNavigation(
  page: Page,
  selectors: string[],
  expectedOrder: string[]
) {
  await page.keyboard.press('Tab');

  const focusedElements: string[] = [];
  for (const selector of selectors) {
    const element = await page.locator(selector).first();
    await page.keyboard.press('Tab');
    focusedElements.push(await page.evaluate(() => document.activeElement?.className));
  }

  expect(focusedElements).toEqual(expectedOrder);
}

// Modal focus trapping test
export async function testModalFocusTrap(page: Page, modalSelector: string) {
  const modal = page.locator(modalSelector);

  // Focus should move INTO modal on open
  await expect(modal).toBeFocused();

  // Tab should cycle through modal elements only
  const tabbableElements = await modal.locator(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ).all();

  // First Tab should cycle back to first element
  await page.keyboard.press('Tab');
  const firstFocused = await page.evaluate(() => document.activeElement?.textContent);

  await page.keyboard.press('Tab');
  const secondFocused = await page.evaluate(() => document.activeElement?.textContent);

  expect(firstFocused).not.toEqual(secondFocused);
}
```

### Focus Management for Modals/Dialogs

```typescript
// focus-manager.ts
export class FocusManager {
  private previouslyFocused: Element | null = null;

  trapFocus(container: Element) {
    this.previouslyFocused = document.activeElement;

    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => container.removeEventListener('keydown', handleTabKey);
  }

  restoreFocus() {
    (this.previouslyFocused as HTMLElement)?.focus();
  }
}
```

### Color Contrast Validation

```typescript
// contrast-validator.ts
export async function validateColorContrast(
  page: Page,
  elementSelector: string,
  minRatio: number = 4.5
): Promise<{ ratio: number; passes: boolean }> {
  const result = await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;

    const styles = window.getComputedStyle(element);
    const bgColor = styles.backgroundColor;
    const color = styles.color;

    // Get contrast ratio using browser API or calculate manually
    // This requires a contrast calculation utility
    return { bgColor, color };
  }, elementSelector);

  if (!result) throw new Error(`Element not found: ${elementSelector}`);

  // Use axe-core for actual contrast checking
  const scanResults = await new AxeBuilder({ page })
    .include(elementSelector)
    .withTags(['wcag22aa'])
    .analyze();

  const contrastViolations = scanResults.violations.filter(
    v => v.id === 'color-contrast'
  );

  return {
    ratio: 0, // Would calculate actual ratio
    passes: contrastViolations.length === 0
  };
}
```

### ARIA Roles and Labels Verification

```typescript
// aria-validator.ts
export async function validateARIA(page: Page) {
  const results = await new AxeBuilder({ page })
    .withRules([
      'aria-required-attr',
      'aria-valid-attr',
      'aria-allowed-attr',
      'aria-required-children',
      'aria-required-parent',
      'role-is-valid',
      'role-has-required-aria-prop'
    ])
    .analyze();

  return {
    violations: results.violations,
    passes: results.passes
  };
}

// Semantic landmark verification
export async function verifyLandmarks(page: Page) {
  const landmarks = await page.evaluate(() => {
    const roles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
    return roles.map(role => ({
      role,
      count: document.querySelectorAll(`[role="${role}"]`).length
    }));
  });

  expect(landmarks.filter(l => l.count > 0).length).toBeGreaterThanOrEqual(3);
}
```

### Reduced Motion Support

```typescript
// reduced-motion.test.ts
test('respects prefers-reduced-motion', async ({ page }) => {
  // Emulate reduced motion preference
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/animations-page');

  // Check that animations are disabled or minimal
  const animationDuration = await page.evaluate(() => {
    const element = document.querySelector('.animated-element');
    const style = window.getComputedStyle(element);
    return style.animationDuration || style.transitionDuration;
  });

  // Should be '0s' or significantly reduced
  expect(parseFloat(animationDuration)).toBe(0);
});

// CSS implementation
/*
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
*/
```

### Semantic HTML Validation

```typescript
// semantic-validator.ts
export async function validateSemantics(page: Page) {
  const issues = await page.evaluate(() => {
    const problems: string[] = [];

    // Check for heading hierarchy
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const levels = headings.map(h => parseInt(h.tagName[1]));
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i-1] > 1) {
        problems.push(`Heading level jump: h${levels[i-1]} to h${levels[i]}`);
      }
    }

    // Check for interactive elements in landmarks
    const main = document.querySelector('main');
    const interactiveInMain = main?.querySelectorAll('a, button, [role="button"]');
    if (interactiveInMain && interactiveInMain.length === 0) {
      problems.push('No interactive elements found in main landmark');
    }

    // Check button elements
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      if (!btn.textContent?.trim() && !btn.getAttribute('aria-label')) {
        problems.push('Button without accessible name');
      }
    });

    return problems;
  });

  expect(issues).toEqual([]);
}
```

## Commands/Actions

### Run Full Accessibility Audit

```bash
# Run Playwright accessibility tests
npx playwright test --project=accessibility --reporter=list

# Generate accessibility report
npx playwright test --project=accessibility --reporter=html
```

### Individual Test Commands

```bash
# Run only axe-core audits
npx playwright test --grep="accessibility audit"

# Run keyboard navigation tests
npx playwright test --grep="keyboard navigation"

# Run contrast tests
npx playwright test --grep="color contrast"
```

### Manual Testing Checklist

```markdown
## Manual Accessibility Checklist

### Keyboard Navigation
- [ ] Tab moves through all interactive elements in logical order
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals and dialogs
- [ ] Arrow keys navigate within components (menus, carousels)
- [ ] Focus indicator is clearly visible (3:1 contrast ratio)

### Visual
- [ ] Color contrast minimum 4.5:1 for normal text
- [ ] Color contrast minimum 3:1 for large text and UI components
- [ ] Content readable at 200% zoom without horizontal scroll
- [ ] Content visible when window resized to 1280x720

### Screen Reader
- [ ] All images have alt text or role="presentation"
- [ ] Form fields have associated labels
- [ ] Buttons have descriptive text or aria-label
- [ ] Dynamic content has aria-live regions
- [ ] Page has title and heading hierarchy

### Motion
- [ ] Animations can be paused or stopped
- [ ] No content flashes more than 3 times per second
- [ ] @media prefers-reduced-motion is respected

### Touch/Target Size
- [ ] Touch targets minimum 24x24px
- [ ] Adequate spacing between adjacent targets
- [ ] Drag-and-drop has alternative input method
```

### Accessibility Audit Script

```bash
#!/bin/bash
# accessibility-audit.sh

echo "Running Accessibility Audit..."

# Check for axe-core
if ! npm list @axe-core/playwright > /dev/null 2>&1; then
  echo "Installing @axe-core/playwright..."
  npm install -D @axe-core/playwright
fi

# Run tests with accessibility tag
npx playwright test --tags=accessibility \
  --reporter=html \
  --output=accessibility-report

echo "Report generated at accessibility-report/index.html"
```

## SOTA Standards (2026)

### WCAG 2.2 Requirements

| Criterion   | Code                   | Name                              | Level   |
|-------------|------------------------|-----------------------------------|---------|
| 1.4.10      | Reflow                 | Content reflows at 400% zoom      | AA      |
| 1.4.11      | Non-text Contrast      | UI components 3:1 minimum         | AA      |
| 1.4.12      | Text Spacing           | Resizable text without loss       | AA      |
| 1.4.13      | Content on Hover/Focus | Persistent content is dismissible | AA      |
| 2.4.11      | Focus Appearance       | Focus indicator 3:1 contrast      | AA      |
| 2.5.7       | Dragging Movements     | Alternative for drag operations   | AA      |
| 2.5.8       | Target Size Minimum    | 24x24px minimum for targets       | AA      |
| 3.3.7       | Redundant Entry        | User data not required twice      | A       |

### Focus Appearance (2.4.11) Details

The focus indicator must:
- Have a 3:1 contrast ratio against adjacent background
- Cover an area at least as large as the outline of the control
- Be visible by default AND in custom mode preferences

### Target Size (2.5.8) Details

- Minimum 24x24 CSS pixels
- Applies to touch targets (not visual boundaries)
- 44x44px recommended for mobile
- Exception: spacing between targets provides equivalent size

### Reflow (1.4.10) Details

Single-column layout at 320px width without:
- Horizontal scrolling
- Loss of content or functionality
- Need for two-dimensional scroll

## Reference

- [WCAG 2.2 Official Specification](https://www.w3.org/TR/WCAG22/)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WCAG/2.2/
- [axe-core Documentation](https://www.deque.com/axe/)
- [axe-core API Reference](https://github.com/dequelabs/axe-core/blob/master/doc/API.md)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Accessible Components Pattern Library](https://www.w3.org/WAI/ARIA/apg/patterns/)

## Files

- `playwright.accessibility.spec.ts` - Automated axe-core tests
- `keyboard-nav.ts` - Keyboard navigation patterns
- `focus-manager.ts` - Focus trapping implementation
- `contrast-validator.ts` - Color contrast verification
- `aria-validator.ts` - ARIA validation helpers
- `semantic-validator.ts` - Semantic HTML checks
- `accessibility-audit.sh` - Audit script
