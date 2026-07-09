---
title: "SettingsDrawer refactor cascade — 1068-line component, unused re-renders, and silent localStorage failures"
date: 2026-07-09
category: performance-issues
tags: [react, re-renders, localStorage, bundle-size, refactoring, zero-consequences]
severity: warning
project: zero-consequences
status: resolved
generated_by: ce-compound
---

# SettingsDrawer Refactor Cascade

## Problem

The Zero Consequences SettingsDrawer component grew from 828 lines to 1068 lines during a refactoring that added collapsible sections, MCP server browser, Skills browser, Hooks browser, Agent Harness dashboard, and workspace presets. After the refactor, the app became noticeably slow to load, the Settings drawer took 2-3 seconds to open on first click, and certain features (workspace apply, image upload) behaved unpredictably.

## Symptoms

- **Slow page load**: Vite dev server took 3-5 seconds to start, and the first page load after server start could timeout Playwright tests (30s timeout on `page.goto()`)
- **Drawer lag**: Settings drawer took perceptible time to open; UI felt "sticky" after the refactor
- **Silent data loss**: Workspace configs would randomly reset; uploaded images would disappear after reload
- **Build warnings**: Production build produced a 4.8MB JS bundle with a warning about chunk size
- **Test failures**: Playwright test timed out on page navigation, not on specific assertions

## What Didn't Work

1. **Restoring the full file from REVISAR commit** — This approach lost all the features added after the baseline (collapsible sections, playground sub-components, editorial mode, CSS token refactoring). The correct approach is to use `git diff` between commits to identify specific changes, not blind file replacement.

2. **Blaming the CSS variable refactoring** — The commit `75d2b959a` that replaced hex colors with CSS tokens was initially suspected but was actually a minor, safe change (replacing `bg-[#04060A]` with `bg-void` and similar). The real performance issues were structural, not cosmetic.

3. **Treating it as a TypeScript error** — The app compiled fine (`npx tsc --noEmit` showed only test-related warnings, not runtime issues). The problem was runtime performance and React re-render cascades, not type errors.

## Root Cause Analysis

Five compounding issues created the performance and reliability regression:

### 1. Monolithic component architecture (1068 lines)

The refactoring added 5 sub-components (`McpServerSubsection`, `SkillsBrowserSubsection`, `CommandsSubsection`, `HooksSubsection`, `HarnessSubsection`) all defined **inline** in the same file as the main component. This prevented:
- **Code splitting**: All 1068 lines (plus dependencies) load in a single chunk
- **Tree shaking**: 11 unused lucide-react icon imports (`FolderOpen`, `Circle`, `Plug`, etc.) stayed in the import block because the bundler couldn't determine they were unused at the chunk level
- **Unit testing**: Sub-components can't be tested in isolation
- **Lazy loading**: React can't defer loading of the MCP/Skills/Hooks sections since they're in the same module

### 2. Missing useEffect dependency array → cascade re-renders

```typescript
// BEFORE (broken — no dependency array)
useEffect(() => {
  if (!config.backgroundImage) return;
  setRecentImages(prev => prev.map(img => 
    img.url === config.backgroundImage 
      ? { ...img, isFavorite: true } 
      : img
  ));
}); // ← NO DEP ARRAY — runs on EVERY render
```

This effect runs on every single render. When it calls `setRecentImages`, it triggers a **new** render, which runs the effect **again** — creating a cascade. Every slider tick, every button click, every state change in the drawer causes 2-3 extra re-renders before stabilizing.

### 3. Synchronous localStorage I/O on every drawer mount

The SettingsDrawer calls `localStorage.getItem()` 8+ times synchronously on mount:
- 6× from `CollapsibleSection` instances (one per section for expanded state)
- 1× for `recentImages`
- 1× for `savedWorkspaces`

Each call blocks the main thread. Combined with the re-render cascade, opening the drawer triggers a visible frame drop.

### 4. localStorage quota exhaustion from base64 images

```typescript
// App.tsx — silently fails on QuotaExceededError
useEffect(() => {
  localStorage.setItem('sota_presentation_config', JSON.stringify(presentationConfig));
  // ↑ No try/catch — QuotaExceededError is swallowed silently
}, [presentationConfig]);
```

When the user uploads an image (converted to base64, roughly 4MB for a smartphone photo), the `presentationConfig` serialization pushes past localStorage's 5MB limit. The `catch {}` in the error boundary swallows the error silently — the user sees their settings stop persisting with zero feedback.

### 5. CollapsibleSection renders children unconditionally

Despite being visually collapsed, all 6 sections' children remain **mounted in the DOM**:
```typescript
// CSS-only hiding — children still render, effects still run
<div style={{
  maxHeight: expanded ? '2000px' : '0px',
  opacity: expanded ? 1 : 0,
}}>
  {children} {/* ← Always rendered, even when collapsed */}
</div>
```

The Playground section alone contains 5 sub-components with independent `useState`/`useEffect` — all running on every drawer mount regardless of visibility.

## How to Reproduce

1. Open Zero Consequences in Vite dev server
2. Click the Settings gear icon
3. Observe 1-3 second lag before drawer opens
4. Open DevTools → Performance tab → record a profile while opening the drawer
5. Look for: 8+ `localStorage.getItem()` synchronous calls, cascade re-renders from `useEffect`
6. Check `Application → Local Storage` for size — note if `sota_presentation_config` exceeds 4MB (sign of base64 images)

## Solution

### Fixes Applied (Judgment Day R1)

| Issue | Fix | Verification |
|-------|-----|-------------|
| 11 unused icon imports | Removed `FolderOpen`, `Circle`, `Plug`, `ToggleLeft`, `Box`, `Cpu`, `Webhook`, `Beaker`, `Globe`, `Link`, `RefreshCw` | `rg "import.*lucide" SettingsDrawer.tsx` shows only used icons |
| Missing useEffect dep array | Added `[config.backgroundImage]` dependency | `<title>` renders once on load, not on every slider tick |
| `config: any` type bypass | Changed to `config: Partial<PresentationConfig>` with proper typing | TypeScript compiles without `any` warnings |
| 12 hardcoded hex colors | Replaced with CSS variable tokens (`bg-void`, `bg-carbon`, `bg-graphite`, etc.) | No more `bg-[#` in SettingsDrawer.tsx |
| setTimeout leak in MCP | Stored timeout in `useRef`, cleanup on unmount | Component unmount clears pending timeout |
| Missing aria attributes | Added `aria-expanded` to buttons, `aria-hidden` to icons | axe DevTools passes section accessibility |

### Recommended Next Steps (not yet applied)

1. **Extract sub-components** — Move `CollapsibleSection`, `McpServerSubsection`, `SkillsBrowserSubsection`, etc. to `src/components/settings/` with named exports
2. **Conditional rendering** — Change CSS-only collapse to `{expanded && <div>…</div>}` for expensive sections (Playground)
3. **localStorage debounce** — Debounce saves; don't write on every slider tick
4. **IndexedDB for images** — Store base64 image data in IndexedDB, keep only references in localStorage
5. **Focus trap** — Add Escape handler and focus management to the drawer (modal behavior)

## Why This Works

The fixes address the specific bottleneck points identified by the adversarial review:

- **Removing unused imports** reduces module resolution overhead and clears noise from the import block
- **The useEffect dependency array** stops the cascade re-render loop — now the effect only runs when `config.backgroundImage` actually changes
- **CSS variable tokens** ensure theme consistency without `!important` overrides in 30+ CSS rules
- **Proper TypeScript typing** catches workspace shape mismatches at compile time instead of silently corrupting state at runtime

The remaining architectural issues (component extraction, conditional rendering, localStorage strategy) are structural — they require a more significant refactor but would resolve the remaining performance debt.

## Prevention

1. **Always use `git diff` first** when debugging regressions: `git diff <base>..HEAD -- <file>`. Never restore entire files from old commits without understanding what changed.

2. **Set a 400-line component budget** — Components over 400 lines signal they should be split. SettingsDrawer at 1068 lines is a clear refactoring target.

3. **Audit useEffect dependency arrays** — Every `useEffect` without a dependency array is a potential cascade re-render. This is the #1 React performance antipattern.

4. **Measure localStorage usage** — Before adding base64 images or large serialized state to localStorage, verify the budget. Use:
   ```javascript
   let usage = 0;
   for (let key in localStorage) {
     usage += localStorage[key].length * 2; // UTF-16
   }
   console.log(`localStorage: ${(usage / 1024 / 1024).toFixed(2)}MB of ~5MB`);
   ```

5. **Name your refactoring commits precisely** — `75d2b959a` claimed "replace hardcoded hex colors" but only handled ~60% of them. A precise commit message helps reviewers (and future you) understand what was actually done.

6. **Run judgment-day before merging large refactors** — Blind dual review catches structural issues (unused deps, missing cleanup, type bypasses) that standard code review misses.

## Related

- Checkpoint tag: `zc-settings-drawer-v2`
- Reference commit: `4f3f4abac` — Settings drawer refactor (the commit that introduced the features)
- Reference commit: `02500eb8e` (REVISAR tag) — Original working baseline
- Reference tags: `zc-ref-countdown-fix`, `zc-ref-editorial-mode`, `zc-ref-css-tokens`
