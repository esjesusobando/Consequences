---
change: consequences-tabs
status: design
created: 2026-07-13
author: sebas
---

# Consequences Tabs — Technical Design

## Overview

Consequences Tabs is a self-contained URL organization module embedded inside the existing `ToolsView` component. It follows the same architectural pattern as `PromptLibrary`: a single smart container component manages all state and localStorage persistence, rendering child presentational components for each view. The module introduces no new npm dependencies and reuses the project's existing design tokens, icon library (`lucide-react`), animation library (`motion`), and nanoid for ID generation.

---

## 1. Component Architecture

### Component Tree

```
ToolsView (existing — TOOLS array addition + conditional render)
  └── ConsequenceTabs (smart container — state, persistence, orchestration)
        ├── TabsCapture (textarea + file import UI)
        ├── TabsListView (collapsible sessions, search, inline actions)
        ├── TabsDashboardView (grid/card layout, v0.1 placeholder)
        ├── TabsItemCard (individual tab item — favicon, title, tags, actions)
        ├── TabsSessionHeader (session row — emoji, name, count, lock/star, rename)
        ├── TabsPopover (hover/click preview + note editing)
        └── TabsToolbar (view toggle, export dropdown, import button, tag filter)
```

### Component Details

#### `ConsequenceTabs` — Smart Container (state owner)

The single source of truth. Holds `TabsState`, dispatches all mutations, orchestrates persistence.

```tsx
interface ConsequenceTabsProps {
  accent: AccentColor;
  onLogMessage: (type: 'info' | 'ok' | 'warn' | 'err', text: string) => void;
}

// Internal state (NOT exposed as props — this is the state owner)
// TabsState is loaded from localStorage on mount, persisted on every change
```

**Responsibilities:**
- Initialize `TabsState` from `localStorage` key `consequences-tabs`
- Persist `TabsState` to `localStorage` on every mutation (via `useEffect` + debounced write)
- Parse pasted text into `TabItem[]` and merge into active session
- Import Netscape bookmark HTML → `TabSession[]` with items
- Export `TabsState` as JSON or Netscape bookmark HTML
- Dispatch all item/session mutations (add, remove, reorder, tag, star, lock, rename)
- Maintain derived state: `allTags` (unique tag list across sessions), `searchQuery`, `activeView`

**State Management:**
```tsx
// Local state — no Context, no external store
const [state, setState] = useState<TabsState>(() => loadFromStorage());
const [searchQuery, setSearchQuery] = useState('');
const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
const [popoverTarget, setPopoverTarget] = useState<{ itemId: string; sessionId: string; rect: DOMRect } | null>(null);
const [toast, setToast] = useState<{ message: string; type: 'ok' | 'warn' | 'err' } | null>(null);

// Persist on every state change (debounced)
useEffect(() => { persistToStorage(state); }, [state]);
```

#### `TabsCapture` — URL Input

```tsx
interface TabsCaptureProps {
  onParseUrls: (urls: string[]) => void;
  onImportBookmarks: (html: string) => void;
  sessionCount: number;
}
```

Renders:
- `<textarea>` for URL paste (newline/space/comma delimited)
- "Parse" button → calls `onParseUrls`
- Hidden `<input type="file" accept=".html,.htm">` for bookmark import
- Import button → triggers file picker → reads file → calls `onImportBookmarks`

#### `TabsListView` — Collapsible Session List

```tsx
interface TabsListViewProps {
  sessions: TabSession[];
  searchQuery: string;
  activeTagFilter: string | null;
  allTags: string[];
  accent: AccentColor;
  onToggleCollapse: (sessionId: string) => void;
  onRenameSession: (sessionId: string, name: string) => void;
  onUpdateEmoji: (sessionId: string, emoji: string) => void;
  onToggleStarSession: (sessionId: string) => void;
  onToggleLockSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRestoreAll: (sessionId: string) => void;
  onUpdateItem: (sessionId: string, itemId: string, patch: Partial<TabItem>) => void;
  onDeleteItem: (sessionId: string, itemId: string) => void;
  onToggleStarItem: (sessionId: string, itemId: string) => void;
  onToggleLockItem: (sessionId: string, itemId: string) => void;
  onAddTag: (sessionId: string, itemId: string, tag: string) => void;
  onRemoveTag: (sessionId: string, itemId: string, tag: string) => void;
  onShowPopover: (itemId: string, sessionId: string, rect: DOMRect) => void;
}
```

Filters sessions/items by `searchQuery` and `activeTagFilter`. Starred sessions sort first. Renders `TabsSessionHeader` + `TabsItemCard` for each item within collapsible sections.

#### `TabsDashboardView` — Card Grid (v0.1 placeholder)

```tsx
interface TabsDashboardViewProps {
  sessions: TabSession[];
  searchQuery: string;
  activeTagFilter: string | null;
  accent: AccentColor;
  onToggleStarItem: (sessionId: string, itemId: string) => void;
  onToggleLockItem: (sessionId: string, itemId: string) => void;
  onDeleteItem: (sessionId: string, itemId: string) => void;
  onShowPopover: (itemId: string, sessionId: string, rect: DOMRect) => void;
}
```

Renders sessions as vertical columns with card items. In v0.1, this is a static grid (no drag-drop). Each card shows favicon, truncated title, domain, lock/star indicators.

#### `TabsItemCard` — Single Tab Item

```tsx
interface TabsItemCardProps {
  item: TabItem;
  compact?: boolean;  // true in dashboard view
  onToggleStar: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
  onShowPopover: (rect: DOMRect) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}
```

Renders: favicon (via Google service), title (or domain fallback), URL, tags, star/lock icons, delete button. On hover: shows popover trigger.

#### `TabsSessionHeader` — Session Row

```tsx
interface TabsSessionHeaderProps {
  session: TabSession;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onRename: (name: string) => void;
  onUpdateEmoji: (emoji: string) => void;
  onToggleStar: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
  onRestoreAll: () => void;
}
```

Renders: collapse chevron, emoji, name (editable on double-click), item count badge, star/lock/restore/delete actions.

#### `TabsPopover` — Preview + Note Editor

```tsx
interface TabsPopoverProps {
  item: TabItem;
  rect: DOMRect;
  onClose: () => void;
  onUpdateNote: (note: string) => void;
  onUpdateTags: (tags: string[]) => void;
}
```

Floating popover anchored to item position. Shows: favicon, title, full URL, tags (editable), note textarea (editable, saved on blur/Escape). Closes on outside click or Escape.

#### `TabsToolbar` — Top Actions Bar

```tsx
interface TabsToolbarProps {
  activeView: 'list' | 'dashboard';
  onViewChange: (view: 'list' | 'dashboard') => void;
  allTags: string[];
  activeTagFilter: string | null;
  onTagFilterChange: (tag: string | null) => void;
  onExportJSON: () => void;
  onExportHTML: () => void;
  onImportClick: () => void;
  sessionCount: number;
  itemCount: number;
}
```

Renders: view toggle (list/dashboard), tag filter chips, export dropdown (JSON/HTML), import button, stats counters.

### Smart vs Dumb Split

| Component | Type | State |
|-----------|------|-------|
| `ConsequenceTabs` | **Smart** | Owns `TabsState`, dispatches all mutations |
| `TabsListView` | **Dumb** | Receives filtered data via props |
| `TabsDashboardView` | **Dumb** | Receives filtered data via props |
| `TabsCapture` | **Dumb** | Calls callbacks on user action |
| `TabsItemCard` | **Dumb** | Pure render + event forwarding |
| `TabsSessionHeader` | **Dumb** | Pure render + event forwarding |
| `TabsPopover` | **Semi-smart** | Local edit state for note/tags, saves on blur |
| `TabsToolbar` | **Dumb** | Pure render + event forwarding |

---

## 2. Data Flow

### Capture → State → Storage → Display

```
User pastes URLs → TabsCapture.onParseUrls(urls)
  → ConsequenceTabs.handleParseUrls(urls)
    → parseUrls(urls) → validates, deduplicates, creates TabItem[]
    → setState(mergeIntoSession(items))
      → useEffect → persistToStorage(state) → localStorage
      → React re-render → TabsListView/TabsDashboardView receive new state
```

### Key Event Flows

#### Paste URL
```
1. User pastes text in <textarea>
2. Clicks "Parse" or presses Ctrl+Enter
3. TabsCapture calls onParseUrls(rawText)
4. ConsequenceTabs.parseUrls() splits on newline/space/comma, validates http(s)://
5. Dedup check against existing items in active session
6. If duplicates found → show dedup toast with skip/add choice
7. Valid URLs → create TabItem[] with nanoid, favicon from Google service
8. Merge into active session (or create "Imported" session if none active)
9. setState → trigger persist + re-render
```

#### Import Bookmark HTML
```
1. User clicks Import → file picker opens (accept=".html,.htm")
2. File read as text → TabsCapture calls onImportBookmarks(html)
3. ConsequenceTabs.parseBookmarks(html) → DOMParser parses Netscape format
4. Extract <DL><DT><A> entries + <H3> folder headers
5. Each folder → TabSession; bookmarks within → TabItem[]
6. Preserve order from HTML
7. Merge into state (new sessions appended)
8. setState → persist + re-render
```

#### Tag Filter
```
1. User clicks tag chip in TabsToolbar
2. TabsToolbar calls onTagFilterChange("react")
3. ConsequenceTabs sets activeTagFilter state
4. TabsListView re-renders with filtered items
5. (No persistence needed — ephemeral UI state)
```

#### Export JSON
```
1. User clicks Export → JSON in TabsToolbar dropdown
2. TabsToolbar calls onExportJSON()
3. ConsequenceTabs serializes full TabsState to JSON
4. Creates Blob → downloadFile() helper → triggers browser download
```

### Re-render Strategy

- **Debounced localStorage writes**: `useEffect` with 300ms debounce to avoid write storms during rapid mutations
- **Memoized filtering**: `useMemo` for search/tag filtering in `TabsListView` and `TabsDashboardView`
- **Stable callbacks**: `useCallback` for all mutation handlers passed as props to prevent unnecessary child re-renders
- **No virtualization for v0.1**: Performance target is 500 items in < 200ms. If exceeded, add `react-window` in v0.2 (no new dep needed — it's lightweight)

---

## 3. File Structure

### New Files

```
src/components/
  tabs/
    ConsequenceTabs.tsx       — Smart container (state + orchestration)
    TabsCapture.tsx            — URL paste textarea + bookmark import
    TabsListView.tsx           — Collapsible session list
    TabsDashboardView.tsx      — Card grid view
    TabsItemCard.tsx           — Individual tab item card
    TabsSessionHeader.tsx      — Session header with actions
    TabsPopover.tsx            — Hover/click preview popover
    TabsToolbar.tsx            — View toggle, tags, export/import controls
  tabsUtils.ts                 — Pure functions: parseUrls, parseBookmarks, exportJSON, exportHTML, faviconUrl
```

**Total new files: 10** (~estimated 800-1000 lines total across all files)

### Existing Files to Modify

| File | Change |
|------|--------|
| `src/types.ts` | No change — `TabItem`, `TabSession`, `TabsState` already exist (lines 259-286) |
| `src/components/ToolsView.tsx` | Add `{ id: 'tabs', label: 'Consequences Tabs', icon: Bookmark, desc: 'Capturar y organizar URLs' }` to `TOOLS` array + add `import ConsequenceTabs from './tabs/ConsequenceTabs'` + add conditional render `{activeTool === 'tabs' && <ConsequenceTabs accent={accent} onLogMessage={onLogMessage} />}` |
| `src/components/CommandPalette.tsx` | Add `{ id: 'tabs', label: 'CONSEQUENCES TABS', description: 'Capturar y organizar URLs guardadas', category: 'Navegación' }` to `allCommands` array |

### Naming Conventions

- **Files**: PascalCase for components (`ConsequenceTabs.tsx`), camelCase for utils (`tabsUtils.ts`)
- **Directories**: lowercase (`tabs/`)
- **Components**: Named exports (project convention: `export function TabsCapture()` not `export default`)
- **Exception**: `ConsequenceTabs` uses default export to match `ToolsView` pattern (`import SkillsLibrary from './SkillsLibrary'`)

---

## 4. Integration Points

### ToolsView Integration

The `TOOLS` array in `ToolsView.tsx` (line 77) defines available tools. Adding:

```tsx
// In TOOLS array:
{ id: 'tabs', label: 'Consequences Tabs', icon: Bookmark, desc: 'Capturar y organizar URLs' },

// In render (line 1534 area):
{activeTool === 'tabs' && <ConsequenceTabs accent={accent} onLogMessage={onLogMessage} />}

// Import at top:
import ConsequenceTabs from './tabs/ConsequenceTabs';
```

The `Bookmark` icon is already imported from `lucide-react` (line 37: `Bookmark` — need to verify; if not, add to import list).

### CommandPalette Integration

Add entry to `allCommands` in `CommandPalette.tsx` (line 11):

```tsx
{ id: 'tabs', label: 'CONSEQUENCES TABS', description: 'Capturar y organizar URLs guardadas', category: 'Navegación' },
```

This enables ⌘K navigation to the tabs tool. Note: session-level ⌘K navigation (jump to specific session) is deferred to v0.2 since it requires dynamic command injection.

### Existing Type Integration

`TabItem`, `TabSession`, and `TabsState` are already defined in `src/types.ts` (lines 259-286). The design reuses them exactly as-is:

- `TabItem.id` → `nanoid(8)` (consistent with `Prompt.id` pattern)
- `TabItem.favicon` → computed via `faviconUrl(url)` utility
- `TabSession.items` → array of `TabItem[]`
- `TabsState.sessions` → array of `TabSession[]`
- `TabsState.bin` → soft-delete target (restore capability)
- `TabsState.activeView` → persisted view preference

### Gemini AI Integration (v2 — Design Only)

When AI grouping is implemented in v2, the integration point is a new `handleAiGroup` method in `ConsequenceTabs`:

```tsx
// v2 — not implemented in v0.1
const handleAiGroup = async (sessionId: string, mode: 'domain' | 'semantic') => {
  const session = state.sessions.find(s => s.id === sessionId);
  if (!session) return;
  
  const urls = session.items.map(item => ({ url: item.url, title: item.title || '' }));
  
  // Uses @google/genai (already in package.json)
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  
  const prompt = mode === 'domain'
    ? `Group these URLs by domain. Return JSON: { "groups": [{ "name": "domain.com", "urls": ["url1", "url2"] }] }`
    : `Group these URLs by semantic topic. Return JSON: { "groups": [{ "name": "Topic Name", "urls": ["url1", "url2"] }] }`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `${prompt}\n\n${JSON.stringify(urls)}`,
  });
  
  // Parse response → preview → user confirms → create sessions from groups
};
```

---

## 5. Key Design Decisions

### D1: Flat tools/ directory (NOT nested deeper)
**Status**: DECIDED

**Choice**: `src/components/tabs/` as a single subdirectory under `components/`.

**Alternatives considered**:
- All files in `src/components/` (flat) — rejected because 10 new files would clutter the already-22-file flat structure
- `src/components/tools/tabs/` (nested under tools/) — rejected because no other tools use subdirectories and it would create inconsistent precedent

**Rationale**: `tabs/` is a self-contained module with 8+ files. One level of nesting keeps the component directory manageable without over-engineering. Matches the pattern of `dashboard/` (which exists as a directory with `.gitkeep`).

---

### D2: Smart container + dumb children (NOT Context/Store)
**Status**: DECIDED

**Choice**: `ConsequenceTabs` owns all state; children are props-only presentational components.

**Alternatives considered**:
- React Context for tabs state — rejected because it would be the only Context in the project; adds complexity without benefiting the flat component tree
- Zustand/external store — rejected because it would be the only external store; the module is self-contained and doesn't need cross-component state sharing
- Split state across children — rejected because it fragments the data model and makes persistence harder (would need coordination)

**Rationale**: Matches the existing `PromptLibrary` pattern (lines 895-1468 in ToolsView.tsx). Simple, testable, and sufficient for the module's scope. The prop drilling depth is max 2 levels (ConsequenceTabs → TabsListView → TabsItemCard).

---

### D3: Debounced localStorage persistence
**Status**: DECIDED

**Choice**: `useEffect` with 300ms debounce to write `TabsState` to `localStorage`.

**Alternatives considered**:
- Write on every `setState` call — rejected because rapid operations (importing 50 bookmarks) would cause 50+ synchronous localStorage writes
- Write only on unmount — rejected because data loss risk on crash/tab close
- `beforeunload` event only — rejected because it doesn't cover SPA navigation or component unmount

**Rationale**: 300ms debounce matches the PromptLibrary pattern (line 913: `useEffect(() => { savePrompts(prompts); }, [prompts])`) but adds debounce safety for batch operations. The `persistToStorage` helper wraps `localStorage.setItem` with try/catch for quota exceeded (spec TAB-PERSISTENCE #3).

---

### D4: v0.1 excludes drag-drop reordering
**Status**: DECIDED

**Choice**: v0.1 MVP implements list view with manual ordering via up/down buttons (not drag-drop). Full drag-drop reordering deferred to v0.2.

**Alternatives considered**:
- Implement HTML5 Drag and Drop API in v0.1 — rejected because it adds significant complexity (~200 lines) and the spec explicitly defers to v0.2
- Use `@dnd-kit` or `react-beautiful-dnd` — rejected because it adds a new npm dependency (constraint: no new deps)
- No reordering at all in v0.1 — rejected because users need basic ordering; up/down buttons are trivial

**Rationale**: The spec (TAB-ORGANIZATION #1) says "manual reordering via drag interaction" but constraints (v0.2 deferral) make this acceptable. Up/down arrow buttons on each item provide basic reordering without DnD complexity.

---

### D5: Popover as absolute-positioned div (NOT portal)
**Status**: NEEDS_REVIEW

**Choice**: `TabsPopover` renders as an `absolute` positioned div within the scrollable list container, not as a React Portal to `document.body`.

**Alternatives considered**:
- React Portal — more robust for overflow/clipping issues, but adds complexity and requires manual click-outside handling
- Tooltip library — overkill for this use case; no existing tooltip dependency

**Rationale**: The list view is the primary context for popovers. Absolute positioning within the scrollable container is simpler and matches the project's existing modal/popup patterns (PromptModal uses fixed positioning). However, if popover content gets clipped by `overflow: hidden` on parent containers, switching to a Portal may be necessary during implementation.

**Risk**: If the list container has `overflow: hidden` (it does — line 1533 in ToolsView.tsx: `flex-1 overflow-hidden`), the popover will be clipped. **Mitigation**: Either (a) use a Portal for the popover, or (b) temporarily change overflow to `overflow-visible` when popover is open, or (c) render the popover outside the overflow container via absolute positioning on a sibling. Recommendation: **use Portal** for robustness.

---

## 6. Implementation Phases

### Batch 1: Core Container + Capture + List View + Persistence
**Complexity**: Medium-High | **Estimated Lines**: ~500

**Components**:
- `tabsUtils.ts` — parseUrls, parseBookmarks, faviconUrl, exportJSON, exportHTML, downloadFile
- `ConsequenceTabs.tsx` — container with state, persistence, all mutation handlers
- `TabsCapture.tsx` — URL paste textarea + bookmark import
- `TabsToolbar.tsx` — view toggle, export/import buttons, stats
- `TabsItemCard.tsx` — individual tab item rendering
- `TabsSessionHeader.tsx` — session header with collapse/star/lock/delete
- `TabsListView.tsx` — full list view with search + tag filtering

**Modifications**:
- `ToolsView.tsx` — add tool definition + import + render
- `CommandPalette.tsx` — add entry

**Spec Coverage**: TAB-CAPTURE, TAB-LIST-VIEW, TAB-PERSISTENCE, TAB-ORGANIZATION (partial — tags, no drag-drop)

**Verification**: User can paste URLs, see them in a list, search/filter, star/lock items, import bookmark HTML, export as JSON/HTML. State persists across page reloads.

---

### Batch 2: Dashboard View + Popover + Polish
**Complexity**: Medium | **Estimated Lines**: ~300

**Components**:
- `TabsDashboardView.tsx` — card grid layout
- `TabsPopover.tsx` — hover preview + note editing

**Enhancements**:
- View persistence (`activeView` in TabsState)
- Tag management UI (add/remove tags per item)
- Session rename + emoji assignment
- "Restore All" per session (`window.open` for each URL)
- Dedup detection on paste/import with user prompt
- Toast notifications for all operations

**Spec Coverage**: TAB-DASHBOARD-VIEW, TAB-POPOVER, remaining TAB-ORGANIZATION features

**Verification**: Dashboard view renders cards, popover shows on hover/click, notes editable, session management complete.

---

### Batch 3: AI Grouping + Command Palette + Final Polish (v2 Prep)
**Complexity**: Low (stubs only for v0.1) | **Estimated Lines**: ~50

**Items**:
- AI grouping placeholder UI (button that shows "Coming in v2" toast)
- Dynamic CommandPalette session injection (if time permits; otherwise v0.2)
- Performance validation: 500 items render < 200ms
- Accessibility audit: keyboard navigation for all interactive elements
- Edge case handling: empty states, quota exceeded warning, corrupt localStorage recovery

**Spec Coverage**: Remaining edge cases, TAB-AI-GROUPING (stub only)

**Verification**: All spec scenarios pass. Module is production-ready for v0.1 scope.

---

## 7. Utility Functions (tabsUtils.ts)

```ts
// URL Parsing
function parseUrls(raw: string): string[]
  // Splits on newline, space, comma. Validates http(s):// scheme.

function isValidUrl(url: string): boolean
  // Returns true if url matches /^https?:\/\// 

function deduplicateUrls(urls: string[]): { unique: string[]; duplicates: string[] }
  // Separates unique from duplicate URLs

// Favicon
function faviconUrl(url: string): string
  // Returns `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`

function extractDomain(url: string): string
  // Returns hostname from URL string

// Bookmark HTML Parsing
function parseBookmarks(html: string): TabSession[]
  // Uses DOMParser to parse Netscape bookmark format
  // Returns TabSession[] with items preserving folder hierarchy

function exportToBookmarksHtml(sessions: TabSession[]): string
  // Generates Netscape bookmark HTML from sessions

// JSON Export/Import  
function exportToJson(state: TabsState): string
  // Serializes TabsState to formatted JSON string

function importFromJson(json: string): TabsState | null
  // Validates and parses JSON into TabsState (returns null on invalid)

// File Download
function downloadFile(content: string, filename: string, mimeType: string): void
  // Creates Blob → object URL → triggers download via anchor click

// Session Helpers
function createSession(name?: string): TabSession
  // Creates a new TabSession with nanoid, default name, current timestamp

function createTabItem(url: string, title?: string): TabItem
  // Creates a new TabItem with nanoid, favicon, empty tags, order = 0
```

---

## 8. Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Popover clipping due to `overflow-hidden` parent | Medium | Use React Portal for TabsPopover; render to document.body |
| localStorage quota exceeded on large imports | Low | try/catch in persistToStorage; show non-blocking warning toast; keep in-memory state intact |
| Bookmark HTML parsing edge cases (varied Netscape formats) | Medium | Handle common variations (Chrome, Firefox, Edge exports); log warnings for unparseable entries; graceful degradation |
| ToolsView.tsx already 1544 lines — adding tabs increases it further | Low | New components live in `tabs/` subdirectory; only 3 lines added to ToolsView.tsx (import + tool def + render) |
| Google favicon service CORS/reliability | Low | Favicon is decorative only; `alt` text fallback shows domain initial if favicon fails to load |
| No virtualization for large lists | Low | Acceptable for v0.1 (500 item target). Monitor render performance; add `react-window` in v0.2 if needed |

---

## 9. Design Tokens (Reuse Existing)

All styling uses existing Tailwind tokens from `index.css`:
- **Surfaces**: `bg-void`, `bg-carbon`, `bg-graphite`
- **Text**: `text-bone`, `text-ash`, `text-slate`
- **Accent**: `text-signal-cyan`, `bg-signal-cyan/10`, `border-signal-cyan/30`
- **Semantic**: `text-signal-lime` (success), `text-signal-magenta` (error), `text-signal-amber` (warning/star)
- **Borders**: `border-graphite/20`, `border-graphite/40`
- **Radius**: `rounded-xl`, `rounded-2xl` (consistent with existing tools)
- **Typography**: `font-mono` for technical text, `font-display` for headings, sizes `text-[9px]` to `text-xs`

No new CSS classes or design tokens needed.
