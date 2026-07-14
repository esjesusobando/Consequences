---
change: consequences-tabs
status: proposal
created: 2026-07-13
author: sebas
artifact_store: both
---

# Consequences Tabs — Change Proposal

## Intent
Give Zero Consequences users a unique place to **capture, organize, visualize, and reorder URLs** with two views (List + Dashboard), combining One Tab's list simplicity with Tab Extend's kanban power.

## Scope

### In (v0.1 MVP)
- URL capture via paste (textarea parsing URLs by newline/space/comma)
- Bookmark HTML import/export (Netscape format, preserves folder hierarchy)
- List view (collapsible sessions, links with favicons)
- Search (filter by title/url/tag)
- Lock/Star items
- localStorage persistence
- ⌘K palette integration for session navigation
- Dedup detection on paste/import

### Out (v0.2+)
- Dashboard/Kanban view (v0.2)
- Notes/reminders (v0.2)
- Firebase sync (v0.3)
- AI auto-grouping (v2)
- Stale detection (v2)

## Technical Approach
- **New file**: `src/components/ConsequenceTabs.tsx` — main module component
- **Types**: Add `TabItem`, `TabSession`, `TabsState` to `src/types.ts`
- **Store**: localStorage with key `consequences-tabs`
- **Mount**: Add as new tool definition in ToolsView.tsx TOOLS array
- **Commands**: Register in CommandPalette.tsx allCommands for ⌘K navigation

## Data Model
```ts
type TabItem = {
  id: string;            // nanoid
  url: string;
  title?: string;
  favicon?: string;      // derived from url (google favicon service)
  note?: string;
  reminder?: string;     // ISO date
  tags: string[];
  order: number;
  locked?: boolean;
  starred?: boolean;
};

type TabSession = {
  id: string;
  name: string;
  emoji?: string;
  createdAt: number;
  items: TabItem[];
  isWorkspace?: boolean;
};

type TabsState = {
  sessions: TabSession[];
  bin: TabSession[];
  activeView: 'list' | 'dashboard';
};
```

## Integration Points
- **ToolsView.tsx**: Add tool definition, render ConsequenceTabs component
- **CommandPalette.tsx**: Register sessions for ⌘K navigation
- **types.ts**: Add new type definitions
- **No server changes**: v0.1 is purely client-side

## Testing Strategy
- Unit: vitest for URL parsing, dedup logic, bookmark import/export
- E2E: playwright for paste → save → search → export flows
- No new test infrastructure needed

## Risks
- **localStorage limits**: ~5MB, acceptable for v0.1
- **Favicon CORS**: use Google favicon service (no backend needed)
- **Drag-drop**: evaluate HTML5 DnD or existing lib in v0.2
- **Bookmark parsing**: Netscape format varies, handle edge cases

## Dependencies
**No new dependencies needed** — all required packages already in package.json:
- nanoid (IDs)
- lucide-react (icons)
- motion/react (animations)
- @google/genai (future AI grouping)
- firebase (future sync)

## Estimated Size
- ~400-600 lines for v0.1 MVP (within 800-line review budget)
- Single PR (exception OK per preflight)

## Next Steps
1. Create specs (sdd-spec) — detailed requirements
2. Create design (sdd-design) — technical architecture
3. Create tasks (sdd-tasks) — implementation checklist
4. Implement (sdd-apply) — write code
5. Verify (sdd-verify) — validate against specs
6. Archive (sdd-archive) — persist final state