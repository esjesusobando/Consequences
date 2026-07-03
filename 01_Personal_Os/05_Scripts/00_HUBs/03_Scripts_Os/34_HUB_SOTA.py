#!/usr/bin/env python3
"""
34_HUB_SOTA.py — SOTA Features Orchestrator (v5.0 wrapper)
PersonalOS v5.0 — Discoverable HUB wrapper for canonical HUB_SOTA

Delega a la implementación canónica en:
    03_Learning/01_Auto_Improvement/06_SOTA_Features/HUB_SOTA.py

Usage:
    python 34_HUB_SOTA.py --status           # Show all feature states
    python 34_HUB_SOTA.py --run <feature>    # Run specific feature
    python 34_HUB_SOTA.py --run all          # Run all enabled features
    python 34_HUB_SOTA.py --toggle <feature> # Toggle feature on/off
"""
import sys
from pathlib import Path

# Resolve canonical SOTA features path
# 34_HUB_SOTA.py → 03_Scripts_Os → 00_HUBs → 05_Scripts → 01_Personal_Os → Think_Different/
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
SOTA_FEATURES_DIR = PROJECT_ROOT / "01_Personal_Os" / "03_Learning" / "01_Auto_Improvement" / "06_SOTA_Features"

if SOTA_FEATURES_DIR.exists():
    sys.path.insert(0, str(SOTA_FEATURES_DIR))
    # Import canonical orchestrator and delegate
    import HUB_SOTA as _sota  # noqa: E402
    # Re-export public API
    show_status = _sota.show_status
    run_feature = _sota.run_feature
    run_all = _sota.run_all
    toggle_feature = _sota.toggle_feature
    main = _sota.main
else:
    print(f"[34_HUB_SOTA] ERROR: Canonical SOTA features dir not found at {SOTA_FEATURES_DIR}")
    print("Expected: 01_Personal_Os/03_Learning/01_Auto_Improvement/06_SOTA_Features/")
    print("Run the canonical version directly from that directory.")
    sys.exit(1)

if __name__ == '__main__':
    main()
