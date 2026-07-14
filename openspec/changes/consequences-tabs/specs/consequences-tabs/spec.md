# Consequences Tabs — Specification

## Purpose

Spec for the Consequences Tabs module: capture, organize, visualize, and manage URLs within Zero Consequences. Covers v0.1 MVP (list view, capture, persistence) and v0.2 additions (dashboard, AI grouping, popover, export).

---

## TAB-CAPTURE — URL Capture

**Purpose**: Accept URLs via paste and bookmark HTML import into the tab system.

| # | Requirement |
|---|-------------|
| 1 | The system SHALL parse URLs from pasted text, splitting on newlines, spaces, and commas. |
| 2 | The system SHALL validate each extracted URL (must match `http://` or `https://` scheme). |
| 3 | The system SHALL detect duplicate URLs on paste and present a dedup choice (skip/duplicate). |
| 4 | The system SHALL import Netscape-format bookmark HTML files, preserving folder hierarchy as sessions. |
| 5 | Each captured URL SHALL produce a TabItem with auto-derived favicon via Google favicon service. |
| 6 | The system SHALL display a capture textarea with paste/import controls in the module header. |

**Scenarios**:

- GIVEN a user pastes `"https://a.com https://b.com"` into the capture textarea
- WHEN the paste is processed
- THEN two TabItems are created in the active session, each with a derived favicon URL

- GIVEN a user pastes `"https://dup.com https://dup.com"` (duplicate URLs)
- WHEN the paste is processed
- THEN the system presents a dedup prompt asking to skip or duplicate

- GIVEN a user imports a Netscape bookmark HTML file with `<H3>` folder headers
- WHEN the import completes
- THEN each folder becomes a TabSession and bookmarks within become TabItems preserving order

**Constraints**: No browser extension; web-only capture via paste/import. Favicon service: `google.com/s2/favicons`.

**Dependencies**: None.

**Out of Scope**: Browser extension "close all tabs" capture; screenshot thumbnails (v0.2).

---

## TAB-LIST-VIEW — List Display

**Purpose**: Display saved tabs in a collapsible, searchable list organized by sessions.

| # | Requirement |
|---|-------------|
| 1 | The system SHALL render sessions as collapsible sections, each showing name, item count, and emoji. |
| 2 | Each tab item SHALL display favicon, title (or URL if no title), domain, and capture date. |
| 3 | The system SHALL provide a search input that filters tabs by title, URL, or tag in real-time. |
| 4 | The system SHALL support Lock (prevents cleanup) and Star (highlights) per session and per item. |
| 5 | The system SHALL allow "Restore All" per session — opens all session URLs via `window.open`. |
| 6 | The system SHALL support session rename and emoji assignment. |

**Scenarios**:

- GIVEN a session with 5 tab items
- WHEN the user collapses the session section
- THEN only the session header (name, count, emoji) is visible

- GIVEN 10 tabs across 2 sessions
- WHEN the user types "github" in the search input
- THEN only tabs whose title, URL, or tag contains "github" are shown

- GIVEN a starred session
- WHEN the list renders
- THEN the starred session appears before non-starred sessions

**Constraints**: Max 500 items per session before performance degrades (soft limit, no hard cap).

**Out of Scope**: Dashboard/kanban rendering (TAB-DASHBOARD-VIEW).

---

## TAB-DASHBOARD-VIEW — Dashboard Grid

**Purpose**: Visual grid view of tabs as preview cards with session columns.

| # | Requirement |
|---|-------------|
| 1 | The system SHALL render sessions as columns and TabItems as cards within each column. |
| 2 | Each card SHALL display favicon, title (truncated), domain, and lock/star indicators. |
| 3 | The system SHALL allow switching between list view and dashboard view via a toggle control. |
| 4 | The system SHALL persist the user's active view preference across sessions. |

**Scenarios**:

- GIVEN the user switches to dashboard view
- WHEN the view renders
- THEN sessions appear as vertical columns with card-based items

- GIVEN a user is in dashboard view and closes the app
- WHEN the user reopens the app
- THEN the dashboard view is restored (TabsState.activeView = 'dashboard')

- GIVEN a session with 20 items
- WHEN the dashboard view renders
- THEN items scroll within their column without breaking the layout

**Constraints**: v0.2 MVP; drag-drop reordering is deferred to v0.2 implementation.

**Out of Scope**: Kanban cross-column drag-drop (v0.2); thumbnail previews (v0.2).

---

## TAB-PERSISTENCE — localStorage Persistence

**Purpose**: Auto-save all TabsState to localStorage and restore on app load.

| # | Requirement |
|---|-------------|
| 1 | The system SHALL persist the full TabsState to `localStorage` key `consequences-tabs` on every state change. |
| 2 | The system SHALL restore TabsState from localStorage on app mount. |
| 3 | The system SHALL handle localStorage quota exceeded gracefully (show warning, do not crash). |
| 4 | The system SHALL support a manual "Export JSON" action that downloads the current TabsState as a `.json` file. |

**Scenarios**:

- GIVEN a user adds 3 tabs to a session
- WHEN the state changes
- THEN localStorage contains the updated TabsState with all 3 items

- GIVEN localStorage has a saved TabsState
- WHEN the app loads
- THEN the sessions, bin, and activeView are restored from localStorage

- GIVEN localStorage quota is exceeded
- WHEN a save is attempted
- THEN the system displays a non-blocking warning and retains the in-memory state

**Constraints**: ~5MB localStorage limit acceptable for v0.1. No server-side persistence until v0.3.

**Out of Scope**: Firebase sync (v0.3); conflict resolution for cross-device sync.

---

## TAB-ORGANIZATION — Manual Reordering, Tagging, Grouping

**Purpose**: Let users organize tabs through manual reorder, tags, and session grouping.

| # | Requirement |
|---|-------------|
| 1 | The system SHALL allow manual reordering of TabItems within a session via drag interaction. |
| 2 | The system SHALL allow adding, removing, and filtering by tags on TabItems. |
| 3 | The system SHALL support moving TabItems between sessions. |
| 4 | The system SHALL auto-generate a tag suggestion list from existing tags across all sessions. |
| 5 | The system SHALL support session-level operations: rename, delete, merge, and archive to bin. |

**Scenarios**:

- GIVEN a session with items A (order 0), B (order 1), C (order 2)
- WHEN the user drags C above A
- THEN C becomes order 0, A becomes order 1, B remains order 2

- GIVEN a TabItem with tags `["react", "frontend"]`
- WHEN the user filters by tag "react"
- THEN only items tagged "react" are displayed

- GIVEN a TabItem in Session X
- WHEN the user drags it to Session Y
- THEN the item is removed from X and appended to Y

**Constraints**: Drag-drop implementation deferred to v0.2 if HTML5 DnD insufficient.

**Out of Scope**: AI-powered automatic grouping (TAB-AI-GROUPING).

---

## TAB-AI-GROUPING — AI-Powered Automatic Grouping

**Purpose**: Use Gemini to automatically group ungrouped URLs by domain or semantic topic.

| # | Requirement |
|---|-------------|
| 1 | The system SHALL provide a "Group with AI" action that sends ungrouped URLs to Gemini. |
| 2 | The system SHALL support domain-based grouping (urls sharing a domain → same group). |
| 3 | The system SHALL support semantic grouping (urls on related topics → same group via LLM). |
| 4 | The system SHALL display a preview of proposed groups before applying. |
| 5 | The system SHALL require user confirmation before creating groups from AI suggestions. |

**Scenarios**:

- GIVEN 10 ungrouped URLs across 3 domains
- WHEN the user triggers domain-based grouping
- THEN 3 groups are proposed, each containing URLs from one domain

- GIVEN 10 ungrouped URLs on varied topics
- WHEN the user triggers semantic grouping
- THEN Gemini returns topic-based groups with a preview UI for confirmation

- GIVEN AI grouping fails (API error or timeout)
- WHEN the error occurs
- THEN the system shows a non-blocking error toast and retains all items in their current state

**Constraints**: v2 scope; requires `@google/genai` (already a dependency). Graceful fallback if API unavailable.

**Out of Scope**: Stale URL detection; real-time collaboration on groups.

---

## TAB-POPOVER — Quick Preview Popover

**Purpose**: Show a preview popover on hover/click with URL details and optional note editing.

| # | Requirement |
|---|-------------|
| 1 | The system SHALL show a popover on hover over a TabItem displaying URL, title, tags, and note. |
| 2 | The system SHALL allow inline editing of the note field within the popover. |
| 3 | The system SHALL display the favicon and domain prominently in the popover header. |
| 4 | The popover SHALL close when the user clicks outside or presses Escape. |

**Scenarios**:

- GIVEN a TabItem with title "GitHub" and note "Review PR #123"
- WHEN the user hovers over the item
- THEN a popover shows "GitHub", the URL, tags, and "Review PR #123"

- GIVEN an open popover with an empty note field
- WHEN the user types a note and clicks outside
- THEN the note is saved to the TabItem and the popover closes

- GIVEN the user presses Escape while a popover is open
- WHEN Escape is processed
- THEN the popover closes without saving changes

**Constraints**: Popover must not overflow viewport; reposition if near edge.

**Out of Scope**: Thumbnail/screenshot previews (v0.2+); rich text notes.

---

## TAB-EXPORT — Export/Import JSON and HTML Bookmarks

**Purpose**: Export tabs as JSON or Netscape HTML bookmarks; import both formats.

| # | Requirement |
|---|-------------|
| 1 | The system SHALL export all sessions as a downloadable `.json` file containing the full TabsState. |
| 2 | The system SHALL export sessions as Netscape bookmark HTML with folder hierarchy preserved. |
| 3 | The system SHALL import Netscape bookmark HTML files (shared spec with TAB-CAPTURE). |
| 4 | The system SHALL import `.json` TabsState files, merging into existing state or replacing. |
| 5 | The system SHALL offer "Merge" vs "Replace" choice when importing JSON into non-empty state. |

**Scenarios**:

- GIVEN 3 sessions with 15 total items
- WHEN the user exports as HTML bookmarks
- THEN a Netscape-format HTML file downloads with 3 `<H3>` folders and 15 `<DT><A>` entries

- GIVEN the user imports a JSON TabsState into an app with existing sessions
- WHEN the import dialog offers "Merge" or "Replace"
- AND the user selects "Merge"
- THEN imported sessions are appended to existing sessions without dedup

- GIVEN an empty app state
- WHEN the user imports a `.json` TabsState file
- THEN the full state is loaded and displayed

**Constraints**: JSON import must validate schema before applying. Max import size: 5MB.

**Out of Scope**: Obsidian markdown export (v2); sync/share links (v0.3).

---

## APP-TOOLS-VIEW — Modified: ToolsView Integration

**Purpose**: The existing ToolsView gains a new sub-tab entry for Consequences Tabs.

| # | Requirement |
|---|-------------|
| 1 | The system SHALL add "Consequences Tabs" as a tool option in the ToolsView tool selector. |
| 2 | Selecting "Consequences Tabs" SHALL render the ConsequenceTabs module component. |
| 3 | The tool SHALL inherit the app's existing accent color system. |
| 4 | The tool registration SHALL appear in the CommandPalette (⌘K) for session navigation. |

**Scenarios**:

- GIVEN the user opens the Tools tab
- WHEN the tool selector renders
- THEN "Consequences Tabs" appears as a selectable option alongside existing tools

- GIVEN the user selects "Consequences Tabs" from the tool selector
- WHEN the selection is processed
- THEN the ConsequenceTabs module renders with the app's current accent color

- GIVEN the user opens CommandPalette (⌘K)
- WHEN they type a session name
- THEN matching sessions appear as navigation targets

**Constraints**: Must not break existing tool rendering or selection behavior.

**Out of Scope**: Changes to other tools in ToolsView; new tool infrastructure.

---

## Cross-Cutting Constraints

- **Performance**: Tab list must render 500 items in < 200ms. Search filter must respond in < 50ms.
- **Accessibility**: All interactive elements must be keyboard-navigable (Tab, Enter, Escape).
- **Responsive**: Layouts must work at 320px min-width (mobile) through 2560px (ultrawide).
- **Data safety**: No data leaves the device without explicit user action (export/sync).
