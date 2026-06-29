# Spec: Settings Drawer Improvements

## Intent

The SettingsDrawer (hamburger customization panel at `SettingsDrawer.tsx`, 828 lines) needs structural refactoring and UX fixes: collapsible Lightroom-style sections, a duplicate theme-mode bug, poor contrast in light themes, a focus mode for distraction-free countdown, dashboard as default tab on refresh, and a new Playground Agent Configuration section for MCP/Skills/Commands/Hooks/Harness management.

## ADDED Requirements

### Requirement: Collapsible Sections

Each SettingsDrawer section MUST be collapsible/expandable via header click. The Background Image section MUST appear FIRST. Section collapse state SHOULD persist across drawer open/close.

#### Scenario: Toggle section on header click
- GIVEN the SettingsDrawer is open
- WHEN the user clicks a section header
- THEN the section content collapses if expanded, or expands if collapsed
- AND a chevron/arrow icon flips to indicate state

#### Scenario: Image section is first
- GIVEN the SettingsDrawer is open
- THEN the Background Image section is the first section at the top

#### Scenario: Persisted collapse state
- GIVEN a section was collapsed
- WHEN the drawer is closed and reopened
- THEN the section remains collapsed

### Requirement: Focus Mode

The system MUST include a Focus Mode toggle in the SettingsDrawer that hides all chrome (TopNavBar, SideNavBar, footer) and displays the dashboard/countdown view full-screen.

#### Scenario: Focus mode activates
- GIVEN any view is showing
- WHEN the user toggles Focus Mode in SettingsDrawer
- THEN all chrome elements are hidden
- AND the dashboard/countdown fills the full viewport

#### Scenario: Focus mode deactivates
- GIVEN focus mode is active
- WHEN the user toggles Focus Mode again
- THEN all chrome elements reappear
- AND the previous view is restored

### Requirement: Dashboard as Default Tab

On fresh page load, the app MUST default to the `dashboard` tab (countdown view).

#### Scenario: Fresh load shows dashboard
- GIVEN the app loads with no stored tab preference
- THEN `activeTab` initializes to `'dashboard'`
- AND the countdown/dashboard renders as the main view

## MODIFIED Requirements

### Requirement: Theme Mode Selection (Bug Fix)

The theme selector MUST offer exactly 4 distinct modes: `dark`, `light_neocraft`, `craft`, `cyber`. Each MUST behave independently. (Previously: when `themeMode` was undefined, the 'dark' button appeared selected for both `undefined` and `'dark'` values, effectively hiding one mode.)

#### Scenario: Four distinct buttons
- GIVEN the SettingsDrawer is open
- THEN the theme selector shows 4 buttons with distinct visual labels
- AND each maps to a unique `ThemeMode` value
- AND no two buttons map to the same value

#### Scenario: Default config includes themeMode
- GIVEN the app loads with no stored config
- THEN `presentationConfig.themeMode` defaults to `'dark'`
- AND the default matches the selector's visual state

### Requirement: Light Mode Contrast

Craft and light_neocraft theme CSS variables MUST use sufficient contrast. Body text (`--color-bone`) MUST have ≥4.5:1 ratio against `--color-void`. Secondary UI text (`--color-slate`, `--color-ash`) SHOULD have ≥3:1.

#### Scenario: Craft mode meets WCAG AA
- GIVEN the `craft` theme is active
- THEN `--color-bone` (#1F2937) against `--color-void` (#F4F5F8) passes ≥4.5:1
- AND `--color-ash` is darkened to pass ≥3:1 against `--color-void`
- AND `--color-slate` is darkened to pass ≥3:1 against `--color-void`

#### Scenario: Light NeoCraft meets WCAG AA
- GIVEN the `light_neocraft` theme is active
- THEN all text colors pass ≥4.5:1 for body and ≥3:1 for UI elements against their backgrounds

### Requirement: Playground Agent Configuration Section

The SettingsDrawer MUST include a new "Playground" collapsible section that provides a unified control panel for agent tooling infrastructure, inspired by Higgsfield's MCP + CLI + Skills dashboard. This section enables users to connect, configure, and monitor agent capabilities without leaving the OS interface.

#### Sub-requirement: MCP Server Management
- The section MUST display a list of configured MCP server connections
- Each entry shows: name, URL/endpoint, connection status (active/inactive/error)
- Users MUST be able to add a new MCP server via URL (name + endpoint URL)
- Users MUST be able to remove existing MCP server entries
- Status indicators use colored dots: green=connected, yellow=connecting, red=error, gray=disconnected

#### Sub-requirement: Skills Browser
- The section MUST display a list of installed/available skills
- Each skill shows: name, description, trigger keywords, enabled/disabled toggle
- Skills are sourced from the opencode skills registry at `~/.config/opencode/skills/`
- Users MUST be able to enable/disable individual skills via toggle

#### Sub-requirement: Command Palette
- The section MUST display a list of registered CLI commands/shortcuts
- Each command shows: name, description, keybinding (if any)
- Commands are sourced from the project's `.agents/commands/` directory
- Visual style: monospace font, terminal aesthetic, grouped by category

#### Sub-requirement: Hooks Manager
- The section MUST display active automation hooks (pre-commit, post-build, etc.)
- Each hook shows: name, trigger event, target script/path, enabled toggle
- Users MUST be able to enable/disable individual hooks
- Hooks are sourced from `.agents/hooks/` and `~/.config/opencode/hooks/`

#### Sub-requirement: Harness Active List
- The section MUST display currently active test harnesses/test runners
- Each harness shows: name, status (running/idle/error), last run time
- A "Run All" button triggers all enabled harnesses sequentially
- Visual: status badge with animated indicator when running

#### Scenario: Add MCP server
- GIVEN the Playground section is expanded
- WHEN the user clicks "Add MCP Server"
- THEN an inline form appears with fields for Name and URL
- AND on submit, the new server is added to the list with "connecting" status
- AND the connection is tested automatically

#### Scenario: Toggle skill enabled/disabled
- GIVEN a skill entry is shown
- WHEN the user clicks the skill's toggle switch
- THEN the skill is marked enabled/disabled in localStorage
- AND the skill registry is updated accordingly
