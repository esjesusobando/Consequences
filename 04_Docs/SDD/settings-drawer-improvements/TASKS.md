# Tasks: Settings Drawer Improvements

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~450-550 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Delivery strategy | single-pr |
| Decision needed before apply | No |

## Phase 1: Theme Bug & Default Tab Fix (Foundation)

- [ ] 1.1 **Add `themeMode: 'dark'` to default config** — `src/App.tsx` line 82-96, add `themeMode: 'dark'` to the default `PresentationConfig` object
- [ ] 1.2 **Change default activeTab** — `src/App.tsx` line 61, change `useState<'...'>('personal_os')` to `useState<'...'>('dashboard')`
- [ ] 1.3 **Verify 4 distinct theme buttons work** — ensure `config.themeMode ?? 'dark'` fallback is no longer needed; buttons 1-4 each map correctly (dark, light_neocraft, craft, cyber)

## Phase 2: Light Mode Contrast Fix (CSS Only)

- [ ] 2.1 **Fix craft mode contrast** — `src/App.tsx` in craft CSS block: darken `--color-ash` to `#4B5563`, darken `--color-slate` to `#6B7280`
- [ ] 2.2 **Fix light_neocraft mode contrast** — `src/App.tsx` in light_neocraft CSS block: darken `--color-slate` to `#4B5563`
- [ ] 2.3 **Verify readability** — inspect text elements in both light themes ensure ≥4.5:1 body text contrast and ≥3:1 UI element contrast

## Phase 3: Collapsible Sections (SettingsDrawer Refactor)

- [ ] 3.1 **Create `CollapsibleSection` helper** — `src/components/SettingsDrawer.tsx`, add a small render-prop or children-based component that wraps content with a clickable header + chevron icon and `overflow-hidden` animation
- [ ] 3.2 **Wrap existing 4 sections** — apply `CollapsibleSection` to: Background Image, Theme Mode, Accent Colors, Audio, Workspace Layout
- [ ] 3.3 **Reorder: Image section FIRST** — move Background Image section block before Theme Mode section in the render tree
- [ ] 3.4 **Persist collapse state** — store expanded sections as JSON array in `localStorage('sota_drawer_sections')`

## Phase 4: Focus Mode

- [ ] 4.1 **Add focusMode state to App.tsx** — `const [focusMode, setFocusMode] = useState(false)` and `const [prevTab, setPrevTab] = useState(activeTab)` ref
- [ ] 4.2 **Pass focusMode + onToggleFocus to SettingsDrawer** — add props to `SettingsDrawerProps`, wire toggle button in a new section or as a standalone button
- [ ] 4.3 **Hide chrome when focus mode active** — `src/App.tsx`: conditional render `TopNavBar`, `SideNavBar`, and footer based on `!focusMode`; adjust main container padding to full viewport
- [ ] 4.4 **Force dashboard tab on focus** — when `focusMode` activates, store `activeTab` in `prevTab`, set to `'dashboard'`; on deactivation, restore `prevTab`
- [ ] 4.5 **Pass focusMode to nav bars** — `TopNavBar.tsx` and `SideNavBar.tsx`: accept optional `focusMode` prop, return `null` when true
- [ ] 4.6 **Add focus mode toggle UI** — `SettingsDrawer`: add a subtle button with a "Focus Mode" label and an eye/focus icon, wired to `onToggleFocus`

## Phase 5: Verification

- [ ] 5.1 **Test all 4 theme modes** — open drawer, click each theme button, verify distinct selection highlight and CSS variable application
- [ ] 5.2 **Test collapsible sections** — click each header, verify collapse/expand, close/reopen drawer, verify persistence
- [ ] 5.3 **Test focus mode** — toggle on, verify chrome hidden + dashboard full-screen, toggle off, verify restoration
- [ ] 5.4 **Test default tab** — hard refresh with cleared localStorage, verify dashboard is the initial view
- [ ] 5.5 **Test light mode contrast** — switch to craft and light_neocraft, verify text is readable against backgrounds

## Phase 6: Playground Agent Configuration Section

- [ ] 6.1 **Create PlaygroundSection component** — add to SettingsDrawer, collapsible wrapper with "Playground" header, icon (Wrench or Settings2), indigo accent color
- [ ] 6.2 **Add MCP Server subsection** — list of MCP connections (name, URL, status dot), add/remove form inline, status colors: green/yellow/red/gray
- [ ] 6.3 **Add Skills Browser subsection** — read skill names from `~/.config/opencode/skills/`, list with name + description + enabled toggle (localStorage)
- [ ] 6.4 **Add Commands subsection** — read `.agents/commands/` directory, list commands with name + keybinding in monospace style
- [ ] 6.5 **Add Hooks Manager subsection** — read `.agents/hooks/` and `~/.config/opencode/hooks/`, list with name + trigger event + enabled toggle
- [ ] 6.6 **Add Harness Active List subsection** — display active harnesses with running/idle/error status badges, "Run All" button at top
- [ ] 6.7 **Integrate Playground section into drawer** — insert as the FIRST section (above Background Image), wrapped in CollapsibleSection
