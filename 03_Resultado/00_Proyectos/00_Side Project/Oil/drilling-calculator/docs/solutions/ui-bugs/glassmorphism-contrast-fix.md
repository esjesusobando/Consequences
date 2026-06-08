---
title: "CSS Contrast Fix: Invisible Text on Glassmorphism Backgrounds"
category: ui-bugs
date: 2026-02-11
tags: [css, glassmorphism, contrast, accessibility, react]
components: [WellboreSchematic]
severity: high
status: resolved
---

# CSS Contrast Fix: Invisible Text on Glassmorphism Backgrounds

## Problem Symptom

**Observable Behavior:**

- Text labels ("Annular DP:", "Annular DC:", "Vol. Total:") were completely invisible in the metrics section
- User reported "letras blancas que no se ven" (white letters that can't be seen)
- Values were also barely visible despite being critical engineering data

**Visual Context:**

- Component: `WellboreSchematic` metrics panel
- Background: Light blue glassmorphism `rgba(95, 166, 221, 0.25)`
- Text: White/light colors with insufficient contrast

## Root Cause Analysis

### Technical Explanation

The issue was caused by **CSS specificity conflicts** and **incorrect color choices for glassmorphism backgrounds**:

1. **Specificity Problem:**
   - Original selectors (`.m-label`, `.m-val`) had low specificity
   - Global styles or inherited rules were overriding component-specific styles
   - No `!important` flags to enforce critical accessibility styles

2. **Color Theory Violation:**
   - Light/semi-transparent backgrounds require **dark text** for contrast
   - Original implementation used light/white text colors
   - Violated WCAG AA contrast ratio requirements

3. **Missing Scoping:**
   - Selectors weren't scoped to parent container (`.metrics`)
   - Made styles vulnerable to global CSS interference

## Investigation Steps Tried

### ❌ Attempts That Didn't Work

1. **Simple color change without `!important`:**

   ```css
   .m-label {
     color: #1a1a1a;
   }
   ```

   - **Why it failed:** Global styles still overrode this

2. **Using rgba() with high opacity:**

   ```css
   .m-label {
     color: rgba(0, 0, 0, 0.9);
   }
   ```

   - **Why it failed:** Still being overridden by more specific selectors

3. **Inline styles in TSX:**
   - **Why avoided:** Would break separation of concerns and make maintenance harder

### ✅ Working Solution

**Final implementation:**

```css
/* Scoped selectors with high specificity */
.metrics .m-label {
  color: #342a2a !important;
  font-weight: 700 !important;
  text-shadow: none !important;
}

.metrics .m-val {
  font-family: "JetBrains Mono", monospace !important;
  font-weight: 800 !important;
  color: #000000 !important;
  text-shadow: none !important;
}
```

**Key elements:**

1. **Scoped selectors:** `.metrics .m-label` instead of `.m-label`
2. **`!important` flags:** Force application over global styles
3. **Dark color:** `#342a2a` (dark brown-grey) for optimal contrast
4. **Remove text-shadow:** Prevents any visual interference
5. **High font-weight:** Improves legibility (700-800)

## Step-by-Step Fix

### 1. Identify the Problem Scope

```bash
# Search for the affected labels in TSX
grep -r "Annular DP" src/components/visuals/
```

### 2. Analyze Current CSS

```css
/* BEFORE - Low specificity, wrong colors */
.m-label {
  color: rgba(255, 255, 255, 0.45); /* Too light! */
  font-weight: 400;
}
```

### 3. Apply Scoped, High-Contrast Solution

```css
/* AFTER - High specificity, dark colors */
.metrics .m-label {
  color: #342a2a !important; /* Dark for contrast */
  font-weight: 700 !important;
  text-shadow: none !important;
}
```

### 4. Verify in Browser

```bash
npm run dev
# Navigate to http://localhost:5173/
# Verify labels are clearly visible
```

## Prevention Strategies

### 1. CSS Contrast Checklist

Before implementing glassmorphism or semi-transparent backgrounds:

- [ ] Check background color/opacity
- [ ] Calculate contrast ratio (use WebAIM Contrast Checker)
- [ ] Use **dark text** for light backgrounds
- [ ] Use **light text** for dark backgrounds
- [ ] Test with actual content, not lorem ipsum

### 2. Specificity Best Practices

```css
/* ❌ BAD - Low specificity */
.label {
  color: #000;
}

/* ✅ GOOD - Scoped to component */
.metrics .label {
  color: #000;
}

/* ✅ BETTER - With !important for critical styles */
.metrics .label {
  color: #000 !important;
}
```

### 3. Accessibility Testing

Add to your testing workflow:

```javascript
// Example: Automated contrast testing
import { checkContrast } from "accessibility-checker";

test("metrics labels have sufficient contrast", () => {
  const bgColor = "rgba(95, 166, 221, 0.25)";
  const textColor = "#342a2a";
  expect(checkContrast(bgColor, textColor)).toBeGreaterThan(4.5); // WCAG AA
});
```

### 4. Design System Rule

**Add to style guide:**

> **Glassmorphism Text Rule:**
>
> - Background opacity < 0.5 → Use dark text (#000 - #444)
> - Background opacity ≥ 0.5 → Match text to background tone
> - Always use `!important` for contrast-critical styles
> - Always scope selectors to component container

## Related Issues

- Similar contrast issues may exist in other glassmorphism components
- Check: `ZenOverlay.css`, `OperatingWindow.css` for similar patterns

## Files Modified

- `src/components/visuals/WellboreSchematic.css` (lines 185-230)
- `src/components/visuals/WellboreSchematic.tsx` (verified correct class usage)

## Testing Verification

✅ **Manual Testing:**

- Labels "Annular DP:", "Annular DC:", "Vol. Total:" clearly visible
- Values displayed in black with high contrast
- Glassmorphism effect preserved

✅ **Build Verification:**

```bash
npm run build
# ✅ No errors, successful compilation
```

✅ **Dev Server:**

```bash
npm run dev
# ✅ Hot-reload working, changes applied immediately
```

## Lessons Learned

1. **Glassmorphism requires careful contrast planning** - Semi-transparent backgrounds are beautiful but demand rigorous color testing

2. **`!important` is acceptable for accessibility** - When contrast is critical for usability, use `!important` without hesitation

3. **Scope CSS to components** - Always use parent container selectors to prevent global style conflicts

4. **Test with real content** - Placeholder text doesn't reveal contrast issues like real engineering data does

## Cross-References

- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- CSS Specificity: [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
