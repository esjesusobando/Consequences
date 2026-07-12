# Think_Different — New Machine Setup Guide

**PersonalOS Installer v2.0** | Last updated: 2026-05-22

## Prerequisites

Before running the installer, ensure the following are installed on your system:

| Tool   | Version                   | Installation                      |
|-------|--------------------------|----------------------------------|
| Python | 3.10+                     | [python.org](https://python.org)  |
| Git    | any recent                | [git-scm.com](https://git-scm.com)|
| Node.js| recommended               | [nodejs.org](https://nodejs.org)  |
| uv     | optional (faster installs)| `pip install uv`                  |

---

## Step 1: Clone the Repository

```bash
git clone <repository-url> Think_Different
cd Think_Different
```

Replace `<repository-url>` with your actual repository URL.

---

## Step 2: Install Dependencies

### Python Dependencies

From the project root, install Python dependencies using either `uv` (recommended) or `pip`:

```bash
# Using uv (faster)
uv pip install -r 01_Personal_Os/05_Scripts/01_Installer/requirements.txt

# Using pip (fallback)
pip install -r 01_Personal_Os/05_Scripts/01_Installer/requirements.txt
```

**requirements.txt includes:**
- `mcp>=1.26.0`
- `pyyaml>=6.0.3`
- `anthropic>=0.84.0`
- `python-dotenv>=1.0.0`
- `requests>=2.31.0`
- `python-dateutil>=2.8.2`
- `jsonschema>=4.20.0`
- `pytest>=8.0.0` (testing)
- `winsound>=0.1` (Windows notifications)

### Node.js Dependencies

Some MCPs use Node.js/npx. No global install needed — the installer runs npx commands directly.

---

## Step 3: Configure Hooks (GGA Pre-Commit Install)

The installer registers hooks automatically but you can verify or install manually.

### Automatic (via installer)

When you run `python installer.py`, hooks are registered automatically in `.claude/settings.local.json`.

### Manual Hook Registration

Hooks are stored in `.claude/settings.local.json` under the `hooks` key:

```json
{
  "hooks": {
    "Stop": [".agent/04_Extensions/01_Hooks/03_Lifecycle/stop.py"]
  }
}
```

**To manually configure:**

1. Open or create `.claude/settings.local.json` in the project root
2. Add the hooks configuration above
3. The `Stop` hook triggers `.agent/04_Extensions/01_Hooks/03_Lifecycle/stop.py` on agent lifecycle stop events

---

## Step 4: Configure MCPs (.mcp.json Setup)

The installer configures MCP servers automatically via `.mcp.template.json`. This template contains placeholders that are replaced with your paths during installation.

### MCP Template Location

`01_Personal_Os/05_Scripts/01_Installer/.mcp.template.json`

### Placeholders Replaced During Installation

| Placeholder          | Config Key            | Description               |
|---------------------|----------------------|--------------------------|
| `{{USER_DOWNLOADS}}` | `paths.downloads`     | Downloads folder          |
| `{{USER_OBSIDIAN}}`  | `paths.obsidian_vault`| Obsidian vault path       |
| `{{USER_EXCALIDRAW}}`| `paths.excalidraw`    | Excalidraw diagrams folder|

### API Keys

The template expects these API keys (configured interactively or in `config.json`):

| Service  | Key Name          | Format                   |
|---------|------------------|-------------------------|
| Context7 | `CONTEXT7_API_KEY`| Starts with `ctx7sk-`    |
| Exa      | `EXA_API_KEY`     | 10+ characters           |
| GitHub   | `github_pat_*`    | Starts with `github_pat_`|
| Notion   | `NOTION_TOKEN`    | Starts with `ntn_`       |

### MCP Servers Configured

The template includes 25+ MCP servers including:
- **@magicuidesign/mcp** — UI design assistance
- **aim-memory-bank** — Knowledge graph memory
- **context7** — Contextual documentation
- **filesystem** — File operations with Downloads access
- **mcp-obsidian** / **obsidian-api** — Obsidian integration
- **excalidraw-yctimlin** — Excalidraw diagrams
- **exa** — Web search
- **github** — GitHub API
- **notion** — Notion integration
- **Playwright** — Browser automation
- **supabase** — Supabase database
- **Linear** — Linear project management
- **jira-extended** — Jira integration
- **brave-search** — Brave web search
- **postgres** / **sqlite** — Database servers
- **slack** — Slack messaging
- **sentry** — Error tracking
- **docker** — Docker integration
- **and more...**

### Manual MCP Configuration

If you need to configure manually:

1. Copy `.mcp.template.json` to `.claude/mcp.json` (project root) or `.mcp.json` (legacy location)
2. Replace placeholders with actual paths
3. Add your API keys

---

## Step 5: Run the Installer

```bash
cd Think_Different
python 01_Personal_Os/05_Scripts/01_Installer/installer.py
```

### What the Installer Does

1. **Verifies project structure** — Checks for required directories
2. **Installs dependencies** — Python packages via uv or pip
3. **Loads/creates config** — Prompts for paths and API keys on first run
4. **Configures MCPs** — Replaces placeholders and merges with existing `.mcp.json`
5. **Registers machine ID** — Creates `05_System/04_Env/.machine_id`
6. **Configures aliases** — Adds `gr`, `gra`, `gr-agents` to your shell config
7. **Registers hooks** — Adds lifecycle hooks to settings
8. **Validates installation** — Runs validation checks

### Installation Modes

- **New machine**: Interactive setup, prompts for paths and API keys
- **Migrate**: Detects existing `.machine_id` and offers to reuse `config.json`

### Post-Install: System Guardian

After installation, the installer runs System Guardian validation. On Windows, it will beep if issues are detected.

---

## Step 6: Verify Installation

### Run Validation Scripts

```bash
# Validate the full stack
python 01_Personal_Os/04_Operations/13_Validate_Stack.py
```

### Manual Verification Checks

| Check       | Command/Path                                                                     |
|------------|---------------------------------------------------------------------------------|
| Structure   | Verify directories exist: `00_Core/`, `01_Brain/`, `04_Operations/`, `05_System/`|
| .mcp.json   | Check placeholders are replaced                                                  |
| .machine_id | File exists at `05_System/04_Env/.machine_id`                                    |
| Settings    | `.claude/settings.local.json` contains hooks configuration                       |
| Dependencies| Run `pip list` or `uv pip list` to verify packages                               |

### Test Commands

```bash
# Test Git is working
git --version

# Test Python is working
python --version

# Test Node/npx (for MCPs)
npx --version
```

---

## Aliases Reference

After installation, these aliases are available:

| Alias      | Command                       |
|-----------|------------------------------|
| `gr`       | System Guardian (dry-run mode)|
| `gra`      | System Guardian (with fixes)  |
| `gr-agents`| System Guardian (agents mode) |

Aliases are added to your shell config:
- Bash: `~/.bashrc`
- Zsh: `~/.zshrc` or `~/.zshrc.local`
- Fish: `~/.config/fish/config.fish`
- PowerShell: `~/Documents/PowerShell/Microsoft.PowerShell_profile.ps1`

**To activate immediately:**

```bash
source ~/.bashrc   # or your respective shell config
```

---

## Common Issues and Troubleshooting

### "Python not found"
**Solution:** Install Python 3.10+ from [python.org](https://python.org). Ensure Python is in your PATH.

### "Git not found"
**Solution:** Install Git from [git-scm.com](https://git-scm.com).

### "uv not found" (installer uses pip instead)
**Solution:** This is fine — installer falls back to pip automatically. To use uv: `pip install uv`

### "npx command not found" (some MCPs fail)
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org).

### ".mcp.json has unreplaced placeholders"
**Solution:** Re-run the installer or manually replace `{{USER_DOWNLOADS}}`, `{{USER_OBSIDIAN}}`, `{{USER_EXCALIDRAW}}` with your actual paths.

### "API key format seems wrong"
**Solution:** The installer validates formats but allows overrides. Supported formats:
- Context7: `ctx7sk-*`
- GitHub PAT: `github_pat_*`
- Notion: `ntn_*`

### "Hooks not triggering"
**Solution:** Verify `.claude/settings.local.json` exists and contains the hooks key with correct paths.

### "System Guardian beep on Windows"
**Solution:** This is expected. System Guardian beeps when issues are detected. Check the report.

### "Module not found: detect_machine"
**Solution:** Run the installer from the project root directory, not from the Installer folder directly.

### "Permission denied" on shell config
**Solution:** Run your editor as Administrator, or manually add the alias content to your shell config file.

---

## File Structure Reference

```
Think_Different/
├── .claude/
│   ├── settings.local.json    # Hooks and local settings
│   └── mcp.json              # MCP configuration (generated)
├── 01_Personal_Os/
│   └── 04_Operations/
│       └── 04_Installer/
│           ├── installer.py           # Main installer
│           ├── requirements.txt       # Python dependencies
│           ├── .mcp.template.json    # MCP template
│           ├── config.json           # Your configuration
│           ├── config.template.json  # Config template
│           └── scripts/
│               ├── configure_paths.py  # MCP + hooks config
│               ├── detect_machine.py   # Machine detection
│               ├── setup_aliases.py    # Alias setup
│               ├── setup_dependencies.py # Dep installation
│               └── validate.py          # Validation
├── 05_System/
│   └── 04_Env/
│       └── .machine_id       # Machine identifier
└── .mcp.json                 # Legacy MCP config location
```

---

## Getting Help

- **Installer issues:** Run `python installer.py --dry-run` for debug info
- **MCP issues:** Check `.claude/mcp.json` or project root `.mcp.json` for configuration errors
- **Validation failures:** Run `python scripts/validate.py` directly

---

*Generated from installer.py v2.0 analysis — PersonalOS*
