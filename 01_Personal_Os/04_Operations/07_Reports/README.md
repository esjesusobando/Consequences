# Think_Different Reports Automation

Centralized reporting hub for Think_Different operations.

## Directory Structure

```
07_Reports/
├── README.md                    # This file
├── 00_Templates/                # Report templates and configurations
└── 01_Generated/                # Auto-generated reports (gitignored)
```

## Available Report Types

| Report                 | HUB                  | Trigger                                 | Frequency            |
|-----------------------|---------------------|----------------------------------------|---------------------|
| **Telemetry Dashboard**| `18_Telemetry_Hub.py`| `python 18_Telemetry_Hub.py --dashboard`| Weekly / On-demand   |
| **Health Report**      | `17_Watchdog_Hub.py` | `python 17_Watchdog_Hub.py`             | Weekly / Post-session|
| **MCP Drift Report**   | `15_MCP_Sync_Hub.py` | `python 15_MCP_Sync_Hub.py --report`    | Weekly / Post-session|
| **Audit Reports**      | `01_Auditor_Hub.py`  | `python 01_Auditor_Hub.py <command>`    | Weekly               |

---

## Report Details

### 1. Telemetry Dashboard (`18_Telemetry_Hub.py`)

**What it generates:**
- ASCII dashboard showing last 100 HUB events
- Success/failure rate percentage
- Average execution duration
- Top 5 most-used HUBs
- Last 5 error entries with details

**How to trigger:**
```bash
cd 01_Personal_Os/04_Operations/03_Scripts_Os
python 18_Telemetry_Hub.py --dashboard    # Full dashboard (100 events)
python 18_Telemetry_Hub.py                # Quick dashboard (20 events)
python 18_Telemetry_Hub.py --stats        # Summary statistics only
```

**Scheduling:** Run weekly or on-demand after sessions. The telemetry data is stored in `00_Context_LLM/12_Telemetry/events.jsonl`.

---

### 2. Health Report (`17_Watchdog_Hub.py`)

**What it generates:**
- Manifest integrity check (7 manifest files)
- MCP sync status (Claude vs OpenCode)
- Legacy drift count (v1.x references)
- Skills without frontmatter count
- Overall system health status

**How to trigger:**
```bash
cd 01_Personal_Os/04_Operations/03_Scripts_Os
python 17_Watchdog_Hub.py                 # Runs all checks + saves report
python 17_Watchdog_Hub.py --schedule      # Shows cron scheduling tip
```

**Scheduling:** Run weekly or after any significant change (new HUB, MCP update, skill addition). Reports are saved to `03_Resultado/04_Reportes/watchdog_report_<timestamp>.txt`.

---

### 3. MCP Drift Report (`15_MCP_Sync_Hub.py`)

**What it generates:**
- Count of MCPs in Claude Code vs OpenCode
- MCPs present in both
- MCPs only in Claude (drift from Claude to OpenCode)
- MCPs only in OpenCode (drift from OpenCode to Claude)
- Updates `02_MCP_Registry.yaml`

**How to trigger:**
```bash
cd 01_Personal_Os/04_Operations/03_Scripts_Os
python 15_MCP_Sync_Hub.py --report        # Generate drift report
python 15_MCP_Sync_Hub.py --apply         # Auto-sync bidirectionally
python 15_MCP_Sync_Hub.py --validate      # Validation tip
```

**Scheduling:** Run weekly or after adding/removing MCP servers. Registry is updated at `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/02_MCP_Registry.yaml`.

---

### 4. Audit Reports (`01_Auditor_Hub.py`)

**What it generates:**

| Subcommand  | Script                       | Report                                 |
|------------|-----------------------------|---------------------------------------|
| `estructura`| Structure audit              | Dimension validation + script numbering|
| `links`     | `29_Repo_Sync_Auditor.py`    | Repository link sync status            |
| `skills`    | `27_Skill_Auditor.py`        | Skills validation                      |
| `health`    | `28_System_Health_Monitor.py`| System health metrics                  |
| `profundo`  | `26_Parallel_Audit_Pro.py`   | Deep parallel audit                    |

**How to trigger:**
```bash
cd 01_Personal_Os/04_Operations/03_Scripts_Os
python 01_Auditor_Hub.py estructura    # Structure audit
python 01_Auditor_Hub.py links         # Link audit
python 01_Auditor_Hub.py skills        # Skills audit
python 01_Auditor_Hub.py health        # Health check
python 01_Auditor_Hub.py profundo      # Deep audit
```

**Scheduling:** Run weekly for comprehensive system validation. Reports are saved to `03_Resultado/04_Reportes/audit_<type>_<timestamp>.txt`.

---

## Scheduling Recommendations

### Weekly (Recommended)
Run all HUBs weekly to maintain system health visibility:

```bash
# Add to crontab: Sunday 9am
0 9 * * 0 cd /path/to/01_Personal_Os/04_Operations/03_Scripts_Os && \
  python 18_Telemetry_Hub.py --dashboard >> ../../07_Reports/01_Generated/telemetry_weekly.txt && \
  python 17_Watchdog_Hub.py >> ../../07_Reports/01_Generated/health_weekly.txt && \
  python 15_MCP_Sync_Hub.py --report >> ../../07_Reports/01_Generated/mcp_drift_weekly.txt && \
  python 01_Auditor_Hub.py estructura >> ../../07_Reports/01_Generated/audit_estructura_weekly.txt
```

### Post-Session (After Major Changes)
Run after adding HUBs, MCPs, or skills:

```bash
python 17_Watchdog_Hub.py              # Quick health check
python 15_MCP_Sync_Hub.py --report     # Verify MCP sync
```

### On-Demand
Run specific reports as needed:

```bash
python 18_Telemetry_Hub.py --stats     # Quick stats
python 01_Auditor_Hub.py profundo      # Full audit when troubleshooting
```

---

## Report Configuration

### Telemetry Events
To log HUB events for telemetry:

```bash
python 18_Telemetry_Hub.py --log <hub_name> <duration_ms> <true|false> [exit_code]
```

Example:
```bash
python 18_Telemetry_Hub.py --log Auditor_Hub 1500 true 0
```

---

## Notes

- All generated reports in `01_Generated/` are gitignored
- Reports in `03_Resultado/04_Reportes/` follow timestamp naming: `<report>_<YYYYMMDD_HHMMSS>.txt`
- Watchdog can be scheduled hourly: `0 * * * * python 17_Watchdog_Hub.py`
