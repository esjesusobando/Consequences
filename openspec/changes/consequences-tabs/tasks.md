---
change: consequences-tabs
status: tasks
created: 2026-07-13
author: sebas
---

# Consequences Tabs — Implementation Tasks

## Task Overview

| Batch | Tasks | Estimated Lines | Scope |
|-------|-------|----------------|-------|
| 1 (Core) | T1–T5 | ~520 | Capture, list view, persistence, integration |
| 2 (Dashboard + Popover) | T6–T8 | ~310 | Dashboard grid, popover, session enhancements |
| 3 (Polish) | T9 | ~50 | AI stubs, edge cases, accessibility |
| **Total** | **9** | **~880** | |

---

## BATCH 1: Core Container + Capture + List View + Persistence

---

### T1 — Create tabsUtils.ts (Pure Utility Functions)

**Batch**: 1
**Estimated Complexity**: Medium
**Dependencies**: None

**Description**:
Create `src/components/tabs/tabsUtils.ts` containing all pure functions for the tabs module. This includes URL parsing and validation, deduplication, favicon URL derivation, Netscape bookmark HTML parsing and export, JSON export/import, file download helper, and factory functions for creating TabItem and TabSession objects. This file has zero React imports and is fully unit-testable.

**Files to Create/Modify**:
- `src/components/tabs/tabsUtils.ts` (new, ~120 lines)

**Acceptance Criteria**:
- [x] `parseUrls(raw)` splits input on newlines, spaces, and commas, returning `string[]`
- [x] `isValidUrl(url)` returns `true` only for strings matching `^https?://`
- [x] `deduplicateUrls(urls)` returns `{ unique: string[], duplicates: string[] }`
- [x] `faviconUrl(url)` returns a valid Google S2 favicons URL with the extracted hostname
- [x] `extractDomain(url)` returns the hostname string from a URL
- [x] `parseBookmarks(html)` uses DOMParser to extract Netscape `<DL><DT><A>` entries + `<H3>` folders, returning `TabSession[]` with items preserving order
- [x] `exportToBookmarksHtml(sessions)` generates valid Netscape bookmark HTML with `<H3>` folders and `<DT><A>` entries
- [x] `exportToJson(state)` serializes `TabsState` to formatted JSON string
- [x] `importFromJson(json)` validates and parses JSON into `TabsState`, returning `null` on invalid input
- [x] `downloadFile(content, filename, mimeType)` creates a Blob, generates an object URL, triggers download via a temporary anchor click, and revokes the URL
- [x] `createSession(name?)` returns a new `TabSession` with `nanoid(8)` ID, provided or default name, and `Date.now()` timestamp
- [x] `createTabItem(url, title?)` returns a new `TabItem` with `nanoid(8)` ID, provided URL, derived favicon, empty tags array, and `order: 0`

**Spec Coverage**: TAB-CAPTURE (#1, #2, #4, #5), TAB-EXPORT (#1, #2, #3, #4), TAB-PERSISTENCE (#4)

---

### T2 — Create Presentational Components (Capture, ItemCard, SessionHeader, Toolbar)

**Batch**: 1
**Estimated Complexity**: Medium
**Dependencies**: T1

**Description**:
Create four small, dumb presentational components in `src/components/tabs/`. Each receives data via props and forwards events via callbacks. No state management — all state lives in the smart container (T4). TabsCapture renders the URL paste textarea and bookmark file import. TabsItemCard renders a single tab item with favicon, title, domain, tags, and action icons. TabsSessionHeader renders a collapsible session row with name, emoji, count, and action buttons. TabsToolbar renders the view toggle, tag filter chips, export dropdown, and import button.

**Files to Create/Modify**:
- `src/components/tabs/TabsCapture.tsx` (new, ~50 lines)
- `src/components/tabs/TabsItemCard.tsx` (new, ~55 lines)
- `src/components/tabs/TabsSessionHeader.tsx` (new, ~60 lines)
- `src/components/tabs/TabsToolbar.tsx` (new, ~65 lines)

**Acceptance Criteria**:

**TabsCapture**:
- [x] Renders a `<textarea>` with placeholder text for URL paste
- [x] Has a "Parse" button that calls `onParseUrls` with the textarea value
- [x] Supports Ctrl+Enter keyboard shortcut to trigger parse
- [x] Has a hidden `<input type="file" accept=".html,.htm">` for bookmark import
- [x] Has an "Import" button that triggers the file picker
- [x] Reads the selected file as text and calls `onImportBookmarks` with the content
- [x] Clears the textarea after successful parse

**TabsItemCard**:
- [x] Displays favicon via `<img>` from Google favicon service with `alt` fallback
- [x] Shows title (or extracted domain if no title)
- [x] Shows full URL as muted secondary text
- [x] Renders tags as small chips with an `×` remove button
- [x] Shows star icon (filled when `item.starred`, outline when not)
- [x] Shows lock icon (filled when `item.locked`, outline when not)
- [x] Shows delete icon (trash)
- [x] All icons call their respective `onToggle*` / `onDelete` callbacks
- [x] `compact` prop reduces padding and hides URL line (for dashboard view)

**TabsSessionHeader**:
- [x] Shows collapse chevron (rotated when expanded, points right when collapsed)
- [x] Shows emoji (if set) and session name
- [x] Shows item count badge
- [x] Double-click on name triggers inline rename (input field)
- [x] Star icon toggles `onToggleStar`
- [x] Lock icon toggles `onToggleLock`
- [x] "Restore All" button calls `onRestoreAll`
- [x] Delete icon calls `onDelete`

**TabsToolbar**:
- [x] View toggle: two buttons (list icon, grid icon) that call `onViewChange`
- [x] Tag filter chips: renders `allTags` as clickable chips, highlighted when active, "All" chip to clear filter
- [x] Export dropdown: click toggles a small menu with "Export JSON" and "Export HTML Bookmarks" options
- [x] Import button: calls `onImportClick`
- [x] Stats display: shows session count and total item count
- [x] Search input: filters tabs in real-time

**Spec Coverage**: TAB-CAPTURE (#6), TAB-LIST-VIEW (#1, #2, #4, #5, #6), TAB-EXPORT (#1, #2), TAB-ORGANIZATION (#2), APP-TOOLS-VIEW (#1)

---

### T3 — Create TabsListView (Collapsible Session List)

**Batch**: 1
**Estimated Complexity**: Medium
**Dependencies**: T2

**Description**:
Create `src/components/tabs/TabsListView.tsx` — the main list view component. Renders sessions as collapsible sections, each containing a `TabsSessionHeader` and a list of `TabsItemCard` components. Applies real-time search filtering (by title, URL, tag) and tag-based filtering. Starred sessions sort to the top. Uses `useMemo` for filtering performance.

**Files to Create/Modify**:
- `src/components/tabs/TabsListView.tsx` (new, ~100 lines)

**Acceptance Criteria**:
- [x] Renders each session as a collapsible section
- [x] Collapsed sessions show only the `TabsSessionHeader` (no items rendered)
- [x] Expanded sessions show `TabsSessionHeader` followed by all `TabsItemCard` components
- [x] Search filtering: only sessions/items matching `searchQuery` (case-insensitive match on title, URL, or tag) are shown
- [x] Tag filtering: when `activeTagFilter` is set, only items containing that tag are shown
- [x] Combined filtering: both search and tag filter apply simultaneously (AND logic)
- [x] Starred sessions appear before non-starred sessions in the list
- [x] Empty state message when no sessions exist: "Paste URLs or import bookmarks to get started"
- [x] Empty search state: "No tabs match your search"
- [x] All interactive elements are keyboard-navigable (Tab, Enter)

**Spec Coverage**: TAB-LIST-VIEW (#1, #2, #3, #4)

---

### T4 — Create ConsequenceTabs (Smart Container)

**Batch**: 1
**Estimated Complexity**: Complex
**Dependencies**: T1, T2, T3

**Description**:
Create `src/components/tabs/ConsequenceTabs.tsx` — the smart container that owns all state and orchestration. Initializes `TabsState` from localStorage, persists on every change via debounced useEffect, and dispatches all mutations. Handles URL parsing/merging, bookmark import, export, search, tag filtering, and all item/session CRUD operations. Wires up TabsCapture, TabsListView, TabsToolbar, and passes appropriate props to each child.

**Files to Create/Modify**:
- `src/components/tabs/ConsequenceTabs.tsx` (new, ~200 lines)

**Acceptance Criteria**:
- [x] Accepts `accent: AccentColor` and `onLogMessage` props (matching `ToolsView` pattern)
- [x] On mount, loads `TabsState` from `localStorage` key `consequences-tabs` via `loadFromStorage()` initializer
- [x] On every `state` change, persists to `localStorage` via debounced `useEffect` (300ms debounce)
- [x] `loadFromStorage()` handles: missing key (returns default empty state), corrupted JSON (catches error, returns default, logs warning), valid JSON (returns parsed state)
- [x] `persistToStorage()` wraps `localStorage.setItem` in try/catch — on `QuotaExceededError`, shows toast warning and retains in-memory state
- [x] Maintains `searchQuery` state, passed to TabsListView
- [x] Maintains `activeTagFilter` state, passed to TabsListView and TabsToolbar
- [x] Derives `allTags` (unique tag set across all sessions/items) via `useMemo`
- [x] `handleParseUrls(raw)`: calls `parseUrls`, checks dedup against active session, creates `TabItem[]`, merges into active session (or creates "Imported" session if none), shows toast with count
- [x] `handleImportBookmarks(html)`: calls `parseBookmarks`, appends new sessions to state, shows toast with session/item count
- [x] `handleExportJSON()`: serializes state, calls `downloadFile` with `.json` extension
- [x] `handleExportHTML()`: calls `exportToBookmarksHtml`, calls `downloadFile` with `.html` extension
- [x] Session mutation handlers: `handleToggleCollapse`, `handleRenameSession`, `handleUpdateEmoji`, `handleToggleStarSession`, `handleToggleLockSession`, `handleDeleteSession`
- [x] Item mutation handlers: `handleUpdateItem`, `handleDeleteItem`, `handleToggleStarItem`, `handleToggleLockItem`, `handleAddTag`, `handleRemoveTag`
- [x] `handleRestoreAll(sessionId)`: opens each item URL via `window.open` in new tabs
- [x] Renders: TabsCapture (top), TabsToolbar (below capture), TabsListView (main area)
- [x] Uses `useCallback` for all handlers passed to children to prevent re-render cascades
- [x] Shows toast notifications for key actions (parse success, import success, export success, errors)

**Spec Coverage**: TAB-CAPTURE (#1–#6), TAB-PERSISTENCE (#1–#4), TAB-LIST-VIEW (#3–#6), TAB-ORGANIZATION (#2–#5), TAB-EXPORT (#1–#5)

---

### T5 — Integrate into ToolsView + CommandPalette

**Batch**: 1
**Estimated Complexity**: Simple
**Dependencies**: T4

**Description**:
Wire the ConsequenceTabs module into the existing app infrastructure. Add the tool definition to the TOOLS array in ToolsView.tsx, add the import statement, add the conditional render, and register the command in CommandPalette.tsx for ⌘K navigation. This is a surgical integration — minimal changes to existing files.

**Files to Create/Modify**:
- `src/components/ToolsView.tsx` (modify: add import + tool def + conditional render)
- `src/components/CommandPalette.tsx` (modify: add command entry)

**Acceptance Criteria**:
- [x] ToolsView.tsx: `import ConsequenceTabs from './tabs/ConsequenceTabs'` added at top
- [x] ToolsView.tsx: `{ id: 'tabs', label: 'Consequences Tabs', icon: Bookmark, desc: 'Capturar y organizar URLs' }` added to TOOLS array (Bookmark icon imported from lucide-react)
- [x] ToolsView.tsx: `{activeTool === 'tabs' && <ConsequenceTabs accent={accent} onLogMessage={onLogMessage} />}` added to the tool content render section
- [x] CommandPalette.tsx: `{ id: 'tabs', label: 'CONSEQUENCES TABS', description: 'Capturar y organizar URLs guardadas', category: 'Navegación' }` added to allCommands array
- [x] Selecting "Consequences Tabs" in the tool sidebar renders the module with the current accent color
- [x] Pressing ⌘K and typing "tabs" or "consequences" shows the navigation entry
- [x] Selecting the entry from palette navigates to the tabs tool
- [x] Existing tools are not broken (regression check: all existing tools still render)

**Spec Coverage**: APP-TOOLS-VIEW (#1, #2, #3, #4)

---

## BATCH 2: Dashboard View + Popover + Session Enhancements

---

### T6 — Create TabsDashboardView (Card Grid)

**Batch**: 2
**Estimated Complexity**: Medium
**Dependencies**: T2 (TabsItemCard with `compact` prop)

**Description**:
Create `src/components/tabs/TabsDashboardView.tsx` — a grid/card view of tabs organized by session columns. Each session renders as a vertical column with session name as header and `TabsItemCard` components (in compact mode) as cards within. Items scroll within their column. Drag-drop reordering is explicitly deferred to v0.2.

**Files to Create/Modify**:
- `src/components/tabs/TabsDashboardView.tsx` (new, ~110 lines)

**Acceptance Criteria**:
- [ ] Renders sessions as horizontal columns (CSS grid or flexbox)
- [ ] Each column has a sticky header with session name and item count
- [ ] Each item renders as a `TabsItemCard` with `compact={true}`
- [ ] Compact cards show favicon, truncated title, domain, and lock/star indicators (no full URL)
- [ ] Items scroll vertically within their column when overflow occurs (`overflow-y-auto`)
- [ ] Columns are equal-width and responsive (wrap to new rows on narrow viewports)
- [ ] Search and tag filtering apply (same logic as list view)
- [ ] Empty state message: "No tabs to display"
- [ ] Starred sessions appear first (leftmost columns)
- [ ] All interactive elements (star, lock, delete on cards) call the correct handlers passed from ConsequenceTabs

**Spec Coverage**: TAB-DASHBOARD-VIEW (#1, #2, #4)

---

### T7 — Create TabsPopover (Hover Preview + Note Editor)

**Batch**: 2
**Estimated Complexity**: Medium
**Dependencies**: T4

**Description**:
Create `src/components/tabs/TabsPopover.tsx` — a floating popover that appears on hover/click over a TabItem, showing full details and enabling inline note editing. Uses React Portal to render into `document.body` to avoid clipping from `overflow-hidden` parent containers. Closes on outside click or Escape key.

**Files to Create/Modify**:
- `src/components/tabs/TabsPopover.tsx` (new, ~100 lines)

**Acceptance Criteria**:
- [ ] Uses `ReactDOM.createPortal` to render into `document.body`
- [ ] Positioned absolutely relative to the anchor `rect` (passed as prop)
- [ ] Repositions if near viewport edges (flip logic: if too close to bottom, show above; if too close to right, shift left)
- [ ] Shows favicon prominently in the header
- [ ] Shows full title and full URL
- [ ] Shows tags as editable chips (add new tag via input, remove via ×)
- [ ] Shows note as a `<textarea>` — editable inline
- [ ] Note saves on blur (calls `onUpdateNote` with current value)
- [ ] Note saves on Escape key press (same as blur behavior)
- [ ] Closing: clicking outside the popover triggers `onClose`
- [ ] Closing: pressing Escape triggers `onClose`
- [ ] Smooth enter/exit animation using `motion` (fade + slight scale)
- [ ] Popover does not overflow viewport — repositioning logic handles edge cases

**Spec Coverage**: TAB-POPOVER (#1, #2, #3, #4)

---

### T8 — Enhance ConsequenceTabs (Dedup, Session Management, Toast, View Persistence)

**Batch**: 2
**Estimated Complexity**: Medium
**Dependencies**: T4, T6, T7

**Description**:
Enhance the ConsequenceTabs smart container and TabsListView to support the full feature set: dedup detection on paste/import with user choice, session rename and emoji assignment, "Restore All" per session, toast notification system, dashboard view toggle with persistence, and wiring the popover. This task integrates T6 (DashboardView) and T7 (Popover) into the container, and adds the remaining session management UX.

**Files to Create/Modify**:
- `src/components/tabs/ConsequenceTabs.tsx` (modify: add dedup logic, wire DashboardView + Popover, view persistence)
- `src/components/tabs/TabsListView.tsx` (modify: add popover trigger on hover/click, session rename/emoji UI)

**Acceptance Criteria**:

**Dedup detection**:
- [ ] When parsing URLs, if duplicates are found against existing items in the active session, a dedup toast appears with "Skip duplicates" and "Add all" options
- [ ] "Skip duplicates" removes duplicates and adds only unique URLs
- [ ] "Add all" adds all URLs including duplicates
- [ ] Same dedup behavior applies to bookmark import

**Session management**:
- [ ] Session rename: double-click on session name in TabsSessionHeader opens inline input, Enter saves, Escape cancels
- [ ] Emoji assignment: clicking the emoji area in TabsSessionHeader opens a simple emoji picker (common emojis grid or text input), selection updates the session
- [ ] "Restore All" per session: calls `window.open` for each URL in the session (with safety check for popup blocker)

**View persistence**:
- [ ] View toggle switches between TabsListView and TabsDashboardView
- [ ] `activeView` in TabsState is updated on toggle and persisted to localStorage
- [ ] On app load, the persisted view preference is restored

**Popover integration**:
- [ ] Clicking on a TabItem (or hover, configurable) opens TabsPopover anchored to the item
- [ ] Popover note edits propagate back to the item via `handleUpdateItem`
- [ ] Popover tag edits propagate back via `handleAddTag` / `handleRemoveTag`
- [ ] Only one popover open at a time (opening new one closes previous)

**Toast system**:
- [ ] Toast notifications appear for: parse success (count), import success (session count), export success, dedup prompt, errors
- [ ] Toast auto-dismisses after 3 seconds
- [ ] Toast supports types: 'ok' (green), 'warn' (amber), 'err' (magenta)

**Spec Coverage**: TAB-CAPTURE (#3), TAB-LIST-VIEW (#5, #6), TAB-DASHBOARD-VIEW (#3), TAB-POPOVER (#1–#4), TAB-ORGANIZATION (#3, #5)

---

## BATCH 3: AI Stubs + Edge Cases + Accessibility

---

### T9 — AI Grouping Stub, Edge Cases, and Accessibility Polish

**Batch**: 3
**Estimated Complexity**: Simple
**Dependencies**: T8

**Description**:
Add the AI grouping placeholder (button that shows "Coming in v2" toast), handle edge cases (empty state messages, corrupt localStorage recovery, quota exceeded graceful degradation), and perform an accessibility pass ensuring all interactive elements are keyboard-navigable and have appropriate ARIA attributes. This is the final polish pass before the module is production-ready for v0.1.

**Files to Create/Modify**:
- `src/components/tabs/ConsequenceTabs.tsx` (modify: add AI stub handler)
- `src/components/tabs/TabsToolbar.tsx` (modify: add "Group with AI" button, disabled state)
- `src/components/tabs/TabsListView.tsx` (modify: ARIA attributes)
- `src/components/tabs/TabsItemCard.tsx` (modify: ARIA attributes)
- `src/components/tabs/TabsSessionHeader.tsx` (modify: ARIA attributes for collapse toggle)

**Acceptance Criteria**:

**AI grouping stub**:
- [x] "Group with AI" button exists in TabsToolbar (visible but disabled or shows tooltip "Coming in v2")
- [x] Clicking the button shows a toast: "AI auto-grouping coming in v2"
- [x] No actual Gemini API call is made in v0.1

**Edge cases**:
- [x] Empty state: when no sessions exist and no items, shows a helpful message guiding the user to paste URLs or import bookmarks
- [x] Corrupt localStorage: if saved JSON is invalid, the module loads with empty default state and shows a warning toast "Previous data was corrupted — starting fresh"
- [x] Quota exceeded: already handled in T4 — verify it shows toast and doesn't crash
- [x] Very long URLs: truncated display in cards with `...` ellipsis, full URL visible in popover
- [x] Session with 0 items after delete: session remains visible but shows "Empty" state, can be deleted

**Accessibility**:
- [x] All buttons have descriptive `aria-label` attributes
- [x] Collapse toggle has `aria-expanded` attribute
- [x] Star/lock toggles have `aria-pressed` attribute
- [x] Search input has `aria-label="Search tabs"`
- [x] Popover has `role="dialog"` and `aria-label`
- [x] Keyboard navigation: Tab moves between interactive elements, Enter activates buttons, Escape closes popover/ menus
- [x] Tag chips are keyboard-focusable and activatable with Enter

**Spec Coverage**: TAB-AI-GROUPING (#1 — stub), cross-cutting accessibility, cross-cutting edge cases

---

## Review Workload Forecast

| Metric | Value |
|--------|-------|
| **Total tasks** | 9 |
| **Total estimated changed lines** | ~880 |
| **Batch 1 lines** | ~520 |
| **Batch 2 lines** | ~310 |
| **Batch 3 lines** | ~50 |
| **New files** | 10 (9 components + 1 utils) |
| **Modified files** | 5 (ToolsView, CommandPalette, ConsequenceTabs, TabsListView, TabsSessionHeader/ItemCard/Toolbar) |

### Chained PRs Recommended: **Yes**

Total estimated lines (~880) exceed the 400-line single-PR budget. The design was built with 3 natural batch boundaries that map cleanly to 3 PRs.

### Decision Needed Before Apply: **No**

The task breakdown is fully specified. The 3-batch structure was pre-approved in the design phase.

### Suggested PR Boundaries

| PR | Tasks | Description | Est. Lines |
|----|-------|-------------|-----------|
| **PR 1** | T1–T5 | Core: utils, components, list view, container, integration | ~520 |
| **PR 2** | T6–T8 | Dashboard, popover, session enhancements, dedup, toasts | ~310 |
| **PR 3** | T9 | AI stubs, edge cases, accessibility polish | ~50 |

> **Note**: PR 1 is slightly over the 400-line budget (~520). This is acceptable because the 10 new files are independent modules with clear boundaries. If stricter budgeting is desired, T1 (tabsUtils) could be extracted to its own PR, but this adds overhead for a single utility file.

---

## Dependency Graph

```
T1 (tabsUtils)
 └── T2 (Presentational Components)
      ├── T3 (TabsListView)
      └── T4 (ConsequenceTabs) ← also depends on T1, T3
           └── T5 (Integration)
                └── T6 (DashboardView) ← also depends on T2
                └── T7 (Popover)
                     └── T8 (Enhancements) ← also depends on T4, T6
                          └── T9 (Polish)
```

**Critical path**: T1 → T2 → T3 → T4 → T5 → T6/T7 → T8 → T9

**Parallelizable**: T6 and T7 can be developed in parallel after T5 completes.
