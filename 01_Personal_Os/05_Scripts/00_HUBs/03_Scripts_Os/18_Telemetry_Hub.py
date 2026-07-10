import logging
import typing

logging.basicConfig(level=logging.INFO)
#!/usr/bin/env python3
"""
18_Telemetry_Hub.py — Telemetry Dashboard
FASE 7.1 del Plan Consequences 3.0

Recolecta y muestra telemetria de HUBs.
"""

import json
import os
import sys
from collections import Counter
from datetime import datetime, timedelta
from pathlib import Path

# ─────────────────────────────────────────────────────────────
# RUTAS — usando config_paths como fuente de verdad
# ─────────────────────────────────────────────────────────────
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "00_Winter_is_Coming").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os"))
from config_paths import ROOT_DIR, TELEMETRY_DIR as CONFIG_TELEMETRY_DIR

REPO_ROOT: Path = ROOT_DIR
TELEMETRY_DIR = CONFIG_TELEMETRY_DIR
EVENTS_FILE = TELEMETRY_DIR / "events.jsonl"


def log_event(hub: str, duration_ms: int, success: bool, exit_code: int = 0, error: str = None):
    """Registra un evento."""
    TELEMETRY_DIR.mkdir(parents=True, exist_ok=True)
    
    event = {
        "timestamp": datetime.now().isoformat(),
        "hub": hub,
        "duration_ms": duration_ms,
        "success": success,
        "exit_code": exit_code,
        "error": error,
    }
    
    with open(EVENTS_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")


def load_events(limit: int = 100) -> list:
    """Carga ultimos eventos."""
    if not EVENTS_FILE.exists():
        return []
    
    events = []
    with open(EVENTS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                try:
                    events.append(json.loads(line))
                except:
                    pass
    
    return events[-limit:] if limit else events


def generate_dashboard(events: list) -> str:
    """Genera dashboard ASCII."""
    if not events:
        return "|  No hay eventos registrados aun. |"
    
    # Stats
    total = len(events)
    success = sum(1 for e in events if e.get("success"))
    failed = total - success
    
    hub_counts = Counter(e.get("hub") for e in events)
    top_hubs = hub_counts.most_common(5)
    
    durations = [e.get("duration_ms", 0) for e in events if e.get("duration_ms")]
    avg_duration = sum(durations) / len(durations) if durations else 0
    
    lines = [
        "+==============================================================+",
        "|       TELEMETRY HUB -- DASHBOARD                |",
        f"|  Ultimos eventos: {total:>3}                        |",
        f"|  Exitos:         {success:>3} ({100*success/total:.0f}%)             |",
        f"|  Fallidos:       {failed:>3} ({100*failed/total:.0f}%)             |",
        f"|  Duracion avg:  {avg_duration:>5.0f}ms                     |",
        "+==============================================================+",
        "|  TOP HUBs (mas usados):                  |",
    ]
    
    for hub, count in top_hubs:
        lines.append(f"|    {hub:<20} {count:>3} veces              |")
    
    # Ultimos errores
    errors = [e for e in events if not e.get("success")]
    if errors:
        lines.extend([
            "+==============================================================+",
            "|  ULTIMOS ERRORES:                          |",
        ])
        for e in errors[-5:]:
            hub = e.get("hub", "unknown")
            err = e.get("error", "unknown error")
            lines.append(f"|    {hub:<20} >> {err:<25} |")
    
    lines.append("+==============================================================+")
    return "\n".join(lines)


def main():
    print(">> Telemetry Hub -- FASE 7.1\n")
    
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        
        if cmd == "--log":
            # log_event(hub, duration_ms, success)
            hub = sys.argv[2] if len(sys.argv) > 2 else "unknown"
            duration = int(sys.argv[3]) if len(sys.argv) > 3 else 0
            success = sys.argv[4].lower() == "true" if len(sys.argv) > 4 else True
            exit_code = int(sys.argv[5]) if len(sys.argv) > 5 else 0
            log_event(hub, duration, success, exit_code)
            print(f"[OK] Evento registrado: {hub}")
        
        elif cmd == "--dashboard":
            events = load_events(limit=100)
            print(generate_dashboard(events))
        
        elif cmd == "--stats":
            events = load_events(limit=None)
            total = len(events)
            success = sum(1 for e in events if e.get("success"))
            print(f"Total eventos: {total}")
            print(f"Exitos: {success} ({100*success/total:.1f}%)" if total else "Sin datos")
    
    else:
        # Default: dashboard
        events = load_events(limit=20)
        print(generate_dashboard(events))
        print("\n>> Ejecuta --dashboard para ver mas, --stats para resumen.")


if __name__ == "__main__":
    main()