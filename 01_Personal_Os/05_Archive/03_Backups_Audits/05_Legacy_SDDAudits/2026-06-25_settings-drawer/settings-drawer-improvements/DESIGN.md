# Design: Settings Drawer Improvements

## Technical Approach

Five independent changes to the Zero_Consequences app:

1. **Collapsible sections**: Extract each SettingsDrawer section into a self-contained render function with collapsible wrapper. Store expanded-state as a `Set<string>` in component state, persisted to `localStorage('sota_drawer_sections')`. Reorder sections so Background Image is first.
2. **Theme mode bug fix**: Set `themeMode: 'dark'` in the default `PresentationConfig` in App.tsx. Ensure all 4 `ThemeMode` values (`dark`, `light_neocraft`, `craft`, `cyber`) are selectable without overlap.
3. **Light mode contrast**: Adjust `--color-ash` and `--color-slate` in `craft` and `light_neocraft` CSS variable blocks to meet WCAG AA contrast minimums.
4. **Focus mode**: Add `focusMode` state to App.tsx. Conditionally render/hide chrome elements (TopNavBar, SideNavBar, footer) and force dashboard view when active. Toggle included in SettingsDrawer.
5. **Default tab**: Change `activeTab` initial state from `'personal_os'` to `'dashboard'` in App.tsx.
6. **Playground Agent Configuration**: New collapsible section with 5 subsections (MCP, Skills, Commands, Hooks, Harness). Reads from filesystem at `~/.config/opencode/skills/`, `.agents/commands/`, `.agents/hooks/`, `~/.config/opencode/hooks/`. MCP stores connections in localStorage. Skills/hooks store enabled state in localStorage.

## Architecture Decisions

### Decision: Inline render functions vs separate components for sections

| Option | Tradeoff |
|--------|----------|
| Extract each section into own component file | Cleaner, testable, but more files |
| Keep in SettingsDrawer as inline render functions | Less churn, no new imports, matches current pattern |

**Choice**: Inline render functions wrapped in a `CollapsibleSection` helper component defined in the same file. Rationale: avoids 5 new component files and import refactors; the existing pattern is monolithic; the first improvement pass should reduce complexity before extracting.

### Decision: Focus mode state location

| Option | Tradeoff |
|--------|----------|
| New field in `PresentationConfig` | Persists to localStorage, restores on reload |
| Separate `useState` in App.tsx | Simpler, ephemeral — focus is session-only |

**Choice**: Separate `focusMode` boolean state in App.tsx (not persisted). Focus mode is a temporary distraction-free state, not a saved preference.

### Decision: Focus mode tab behavior

**Choice**: When focus mode activates, force `activeTab` to `'dashboard'`. On deactivation, restore the previous tab. Rationale: user said "shows only the countdown/dashboard" explicitly.

## Data Flow

```
SettingsDrawer toggle
  → App.tsx: setFocusMode(true)
  → App.tsx: setActiveTab('dashboard'), store prevTab ref
  → Layout: TopNavBar hidden, SideNavBar hidden, footer hidden
  → main: full viewport, no padding offsets
  → DashboardView fills 100vw/100vh

SettingsDrawer untoggle
  → App.tsx: setFocusMode(false)
  → App.tsx: setActiveTab(prevTab)
  → Layout: restore chrome
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/SettingsDrawer.tsx` | Modify | Add `CollapsibleSection` helper, wrap sections, reorder (Playground first, then Background Image), add focus mode toggle, fix theme selector labels, add Playground Agent Config section |
| `src/App.tsx` | Modify | Add `focusMode` state + `prevTab` ref, conditionally render chrome, change default `activeTab` to `'dashboard'`, add `themeMode: 'dark'` to default config |
| `src/types.ts` | No-change | (ThemeMode already added in previous session) |

## CSS Variable Changes (Contrast Fix)

```
// Craft mode — current → adjusted
--color-ash:   #6B7280 → #4B5563   (3:1 → 4.5:1 on #F4F5F8)
--color-slate: #9CA3AF → #6B7280   (2.2:1 → 3:1 on #F4F5F8)

// Light NeoCraft — current → adjusted
--color-slate: #6A768F → #4B5563   (3.5:1 → 5:1 on #E8EBF0)
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual | Theme selectors, contrast | Toggle each mode, verify distinct selection and readable text |
| Functional | Collapse/expand sections | Click each header, verify toggle animation and persistence |
| Functional | Focus mode | Toggle focus mode, verify chrome hidden, verify dashboard view, verify restore on exit |
| Functional | Default tab | Hard refresh, verify dashboard is active view |
| Visual | Light mode readability | Check text elements are legible across craft and light_neocraft |
