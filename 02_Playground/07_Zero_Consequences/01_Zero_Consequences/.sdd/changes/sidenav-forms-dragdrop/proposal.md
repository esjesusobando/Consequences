# Proposal: SideNavBar hamburger menu, form selectors, and drag-and-drop reordering

## Intent

Three UX pain points in the Zero Consequences dashboard: (1) the SideNavBar shows 6 incomplete views alongside the only working one (Dashboard), cluttering the nav; (2) three time inputs use `type="text"` instead of native `type="time"`, which means no native picker and no mobile-friendly input; (3) meetings, tasks, and calendar events lack drag-and-drop reordering, making prioritization manual and slow.

## Scope

### In Scope
- Hamburger toggle on SideNavBar that hides incomplete tabs (personal_os, linear, operations, analytics, specs, terminal) behind a collapsible menu; only "dashboard" visible by default.
- Change `type="text"` to `type="time"` on 3 time inputs in DashboardView.tsx (edit meeting form, add task form, edit task inline form).
- Native HTML5 drag-and-drop (dragstart / dragover / drop) on the signals list in the meeting queue, the tasks list, and the calendar timeline, with order persisted to signals state and optionally synced to Google Calendar.

### Out of Scope
- No external drag library (vanilla HTML5 DnD API — no `@dnd-kit` or similar).
- No drag affordance animations beyond standard cursor/opacity feedback.
- No reorder persistence across sessions beyond the existing localStorage signals save.
- No completion of the actual views behind the hidden tabs (they remain stubs).

## Capabilities

### New Capabilities
- `sidenav-hamburger`: Collapsible hamburger menu for incomplete view tabs, with visibility gating per tab.
- `drag-reorder`: Native HTML5 drag-and-drop reordering for signals (meetings, tasks, calendar items) with Google Calendar sync on drop.
- `time-picker-form`: Native `type="time"` inputs on all meeting/task time fields.

### Modified Capabilities
- None — all changed behavior is additive to existing components.

## Approach

### 1. SideNavBar hamburger
Add a `hamburgerOpen` state and a `completedTabs` set prop (or derive from a config). Render a hamburger button at the top of the nav. When open, show hidden tabs in a compact dropdown panel below the always-visible dashboard button.

### 2. Form time selectors
Replace `type="text"` with `type="time"` and adjust placeholder/format expectations on the 3 inputs. No state changes needed — value format is already `HH:MM`.

### 3. Drag-and-drop
Use `onDragStart`, `onDragOver`, `onDrop` on signal list items and containers. On drop, reorder the `signals` array via `setSignals`. If `googleToken` exists, call `updateCalendarEvent` for the moved item with updated sequence metadata.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/SideNavBar.tsx` | Modified | Add hamburger toggle, completedTabs prop, collapsible menu |
| `src/components/DashboardView.tsx` | Modified | Fix 3 time inputs (type="time"), add drag handlers to meeting/task/calendar lists |
| `src/App.tsx` | Modified | Pass completedTabs config or signal reorder handlers to children |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking existing keyboard navigation on signal list items | Low | Keep drag as additive — existing onClick/onFocus unchanged |
| Google Calendar update on reorder mismatches event identity | Low | Use existing `googleEventId` field; only call API if `syncedToGoogleCalendar` is true |
| Hamburger menu clips on narrow viewports | Med | Use `position: absolute` with `z-50` above nav; test at 768px breakpoint |

## Rollback Plan

Revert `SideNavBar.tsx`, `DashboardView.tsx`, and `App.tsx` to HEAD. No migration needed — all state is ephemeral/localStorage.

## Dependencies

- None. Uses only built-in HTML5 Drag and Drop API and existing Google Calendar integration.

## Success Criteria

- [ ] Hamburger button toggles the 6 incomplete tabs; only "dashboard" visible when collapsed.
- [ ] Clicking a hidden tab in the hamburger menu navigates to that view.
- [ ] All 3 time inputs open native browser time picker on focus.
- [ ] Meetings in the signals list reorder via drag-and-drop.
- [ ] Tasks list items reorder via drag-and-drop.
- [ ] Calendar timeline events reorder via drag-and-drop.
- [ ] Reordered meetings sync to Google Calendar if `googleToken` exists.
