#!/usr/bin/env python3
"""
track_leads.py - Lead Tracking CLI for PersonalOS v5.0
=======================================================
CLI tool for managing sales leads through a defined pipeline.

Pipeline: nuevo -> contacto -> propuesta -> negociacion -> cerrado / perdido

Usage:
    python track_leads.py add "Client Name" --source LinkedIn --value 5000
    python track_leads.py update-status 1 contacto
    python track_leads.py list
    python track_leads.py list --all
    python track_leads.py reminders
    python track_leads.py archive
    python track_leads.py generate-proposal 1

Persistence: 01_Personal_Os/03_Learning/04_Telemetry/leads.json
Archive:     01_Personal_Os/03_Learning/04_Telemetry/leads_archive.json

Version: 1.0.0
"""

import argparse
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path


# =============================================================================
# PATH RESOLUTION
# =============================================================================

def _find_project_root():
    """Detect project root by searching upward for 00_Winter_is_Coming."""
    current = Path(__file__).resolve().parent
    for candidate in [current, *current.parents]:
        if (candidate / "00_Winter_is_Coming").exists():
            return candidate
    return None


def _get_data_dir():
    """Return the Telemetry directory for lead persistence."""
    root = _find_project_root()
    if not root:
        print("[ERROR] Could not detect project root.", file=sys.stderr)
        sys.exit(1)
    return root / "01_Personal_Os" / "03_Learning" / "04_Telemetry"


DATA_DIR = _get_data_dir()
LEADS_FILE = DATA_DIR / "leads.json"
ARCHIVE_FILE = DATA_DIR / "leads_archive.json"
PROPOSAL_TEMPLATE = (
    Path(__file__).resolve().parent.parent.parent.parent
    / "02_Knowledge" / "03_Templates" / "propuesta_cliente.md"
)


# =============================================================================
# CONSTANTS
# =============================================================================

VALID_STATUSES = ["nuevo", "contacto", "propuesta", "negociacion", "cerrado", "perdido"]

VALID_SOURCES = ["LinkedIn", "Email", "Voz", "Referido", "Web"]

# Allowed transitions: source -> list of valid targets
VALID_TRANSITIONS = {
    "nuevo":      ["contacto"],
    "contacto":   ["propuesta", "perdido"],
    "propuesta":  ["negociacion", "perdido"],
    "negociacion": ["cerrado", "perdido"],
    "cerrado":    [],  # terminal
    "perdido":    [],  # terminal
}

ARCHIVE_THRESHOLD_DAYS = 90
REMINDER_THRESHOLD_DAYS = 3


# =============================================================================
# DATA I/O
# =============================================================================

def _load_leads():
    """Load leads from JSON file. Returns empty dict if missing."""
    if not LEADS_FILE.exists():
        return {}
    with open(LEADS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_leads(data):
    """Persist leads to JSON file."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(LEADS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def _load_archive():
    """Load archived leads."""
    if not ARCHIVE_FILE.exists():
        return []
    with open(ARCHIVE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_archive(data):
    """Persist archived leads."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(ARCHIVE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def _next_id(leads):
    """Compute next sequential lead ID."""
    if not leads:
        return 1
    return max(int(k) for k in leads.keys()) + 1


# =============================================================================
# TRANSITION VALIDATION
# =============================================================================

def _validate_transition(current_status, new_status):
    """Check if a status transition is allowed. Returns error string or None."""
    if current_status not in VALID_STATUSES:
        return f"Unknown current status: '{current_status}'"
    if new_status not in VALID_STATUSES:
        return f"Unknown target status: '{new_status}'"
    allowed = VALID_TRANSITIONS.get(current_status, [])
    if new_status not in allowed:
        return (
            f"Invalid transition: '{current_status}' -> '{new_status}'. "
            f"Allowed: {allowed if allowed else '(terminal state)'}"
        )
    return None


# =============================================================================
# SUBCOMMANDS
# =============================================================================

def cmd_add(args):
    """Add a new lead."""
    leads = _load_leads()
    now = datetime.now().isoformat()
    lead_id = _next_id(leads)

    lead = {
        "id": lead_id,
        "name": args.name,
        "source": args.source,
        "status": "nuevo",
        "estimated_value": args.value,
        "created_at": now,
        "updated_at": now,
        "notes": args.notes or "",
    }

    leads[str(lead_id)] = lead
    _save_leads(leads)
    print(f"[OK] Lead #{lead_id} created: '{args.name}' (source={args.source}, value=${args.value})")


def cmd_update_status(args):
    """Update a lead's pipeline status."""
    leads = _load_leads()
    key = str(args.id)

    if key not in leads:
        print(f"[ERROR] Lead #{args.id} not found.", file=sys.stderr)
        sys.exit(1)

    lead = leads[key]
    error = _validate_transition(lead["status"], args.new_status)
    if error:
        print(f"[ERROR] {error}", file=sys.stderr)
        sys.exit(1)

    old_status = lead["status"]
    lead["status"] = args.new_status
    lead["updated_at"] = datetime.now().isoformat()
    if args.note:
        lead["notes"] = args.note

    _save_leads(leads)
    print(f"[OK] Lead #{args.id}: '{old_status}' -> '{args.new_status}'")


def cmd_list(args):
    """List leads, active only by default."""
    leads = _load_leads()
    terminal = {"cerrado", "perdido"}

    filtered = []
    for key in sorted(leads.keys(), key=lambda k: int(k)):
        lead = leads[key]
        if not args.all and lead["status"] in terminal:
            continue
        filtered.append(lead)

    if not filtered:
        label = "leads" if args.all else "active leads"
        print(f"No {label} found.")
        return

    print(f"{'ID':>4}  {'Name':<25} {'Status':<14} {'Source':<12} {'Value':>8}  {'Updated'}")
    print("-" * 80)
    for lead in filtered:
        print(
            f"{lead['id']:>4}  {lead['name']:<25} {lead['status']:<14} "
            f"{lead['source']:<12} ${lead['estimated_value']:>7,}  {lead['updated_at'][:10]}"
        )

    active = [l for l in filtered if l["status"] not in terminal]
    print(f"\nTotal: {len(filtered)} leads ({len(active)} active)")


def cmd_reminders(args):
    """List leads with no update in more than 3 days."""
    leads = _load_leads()
    terminal = {"cerrado", "perdido"}
    threshold = datetime.now() - timedelta(days=REMINDER_THRESHOLD_DAYS)

    stale = []
    for key in sorted(leads.keys(), key=lambda k: int(k)):
        lead = leads[key]
        if lead["status"] in terminal:
            continue
        updated = datetime.fromisoformat(lead["updated_at"])
        if updated < threshold:
            days_since = (datetime.now() - updated).days
            stale.append((lead, days_since))

    if not stale:
        print("No leads need attention. All active leads updated within 3 days.")
        return

    print(f"{'ID':>4}  {'Name':<25} {'Status':<14} {'Days Since Update':>18}")
    print("-" * 65)
    for lead, days in stale:
        print(f"{lead['id']:>4}  {lead['name']:<25} {lead['status']:<14} {days:>14} days")

    print(f"\n{len(stale)} lead(s) need follow-up.")


def cmd_archive(args):
    """Move terminal leads older than 90 days to archive."""
    leads = _load_leads()
    terminal = {"cerrado", "perdido"}
    threshold = datetime.now() - timedelta(days=ARCHIVE_THRESHOLD_DAYS)

    to_archive = []
    keep = {}

    for key in leads:
        lead = leads[key]
        if lead["status"] in terminal:
            updated = datetime.fromisoformat(lead["updated_at"])
            if updated < threshold:
                to_archive.append(lead)
                continue
        keep[key] = lead

    if not to_archive:
        print("No leads eligible for archiving (terminal leads older than 90 days).")
        return

    # Append to archive
    archive = _load_archive()
    archive.extend(to_archive)
    _save_archive(archive)
    _save_leads(keep)

    print(f"[OK] Archived {len(to_archive)} lead(s) older than {ARCHIVE_THRESHOLD_DAYS} days.")
    for lead in to_archive:
        print(f"  - #{lead['id']} '{lead['name']}' ({lead['status']}, updated {lead['updated_at'][:10]})")


def cmd_generate_proposal(args):
    """Generate a proposal document for a lead."""
    leads = _load_leads()
    key = str(args.id)

    if key not in leads:
        print(f"[ERROR] Lead #{args.id} not found.", file=sys.stderr)
        sys.exit(1)

    lead = leads[key]

    if not PROPOSAL_TEMPLATE.exists():
        print(f"[ERROR] Proposal template not found at {PROPOSAL_TEMPLATE}", file=sys.stderr)
        sys.exit(1)

    with open(PROPOSAL_TEMPLATE, "r", encoding="utf-8") as f:
        template = f.read()

    # Fill placeholders with lead data
    now = datetime.now()
    filled = template.replace("{{CLIENTE}}", lead["name"])
    filled = filled.replace("{{ALCANCE}}", "[Definir alcance del proyecto]")
    filled = filled.replace("{{PLAZO}}", "[Definir plazo de entrega]")
    filled = filled.replace("{{DELIVERABLES}}", "[Definir deliverables]")

    # Output filename
    safe_name = lead["name"].replace(" ", "_").lower()
    output_file = DATA_DIR / f"propuesta_{safe_name}_{now.strftime('%Y%m%d')}.md"

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(filled)

    print(f"[OK] Proposal generated for lead #{args.id} '{lead['name']}'")
    print(f"     Output: {output_file}")


# =============================================================================
# CLI
# =============================================================================

def build_parser():
    parser = argparse.ArgumentParser(
        prog="track_leads",
        description="Lead Tracking CLI for PersonalOS v5.0",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # add
    p_add = sub.add_parser("add", help="Add a new lead")
    p_add.add_argument("name", help="Client or lead name")
    p_add.add_argument("--source", required=True, choices=VALID_SOURCES, help="Lead source")
    p_add.add_argument("--value", type=int, default=0, help="Estimated value in USD")
    p_add.add_argument("--notes", default="", help="Optional notes")

    # update-status
    p_upd = sub.add_parser("update-status", help="Update lead pipeline status")
    p_upd.add_argument("id", type=int, help="Lead ID")
    p_upd.add_argument("new_status", choices=VALID_STATUSES, help="New status")
    p_upd.add_argument("--note", default=None, help="Optional note to append")

    # list
    p_list = sub.add_parser("list", help="List leads (active by default)")
    p_list.add_argument("--all", action="store_true", help="Include closed/lost leads")

    # reminders
    sub.add_parser("reminders", help="Show leads needing follow-up (>3 days)")

    # archive
    sub.add_parser("archive", help="Archive terminal leads older than 90 days")

    # generate-proposal
    p_prop = sub.add_parser("generate-proposal", help="Generate proposal document for a lead")
    p_prop.add_argument("id", type=int, help="Lead ID")

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()

    commands = {
        "add": cmd_add,
        "update-status": cmd_update_status,
        "list": cmd_list,
        "reminders": cmd_reminders,
        "archive": cmd_archive,
        "generate-proposal": cmd_generate_proposal,
    }

    commands[args.command](args)


if __name__ == "__main__":
    main()
