"""
🎯 MANUAL TRIGGER - Trigger Manual para Auto-Improvement
========================================================
Ejecuta el motor de automejora manualmente.

Usage:
    python manual_trigger.py --scan        # Scan rápido
    python manual_trigger.py --full        # Ciclo completo
    python manual_trigger.py --apply       # Aplicar fixes
"""

import sys
from pathlib import Path

# Add engine to path
sys.path.insert(0, str(Path(__file__).parent.parent / "01_Engine"))

from recursive_improvement_engine import RecursiveImprovementEngine


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Manual Auto-Improvement Trigger")
    parser.add_argument("--scan", action="store_true", help="Quick scan")
    parser.add_argument("--full", action="store_true", help="Full cycle")
    parser.add_argument("--learn", action="store_true", help="Learn only")
    parser.add_argument(
        "--apply", action="store_true", help="Apply fixes (not dry-run)"
    )

    args = parser.parse_args()

    # Determine mode
    if args.apply:
        dry_run = False
        print("🎯 Modo: APLICAR FIXES")
    else:
        dry_run = True
        print("🎯 Modo: DRY RUN (sin aplicar)")

    # Initialize engine
    engine = RecursiveImprovementEngine(dry_run=dry_run)

    # Run
    if args.scan:
        report = engine.run_quick_scan()
    elif args.full:
        report = engine.run_full_cycle()
    elif args.learn:
        report = engine.run_learn_only()
    else:
        print("Uso: python manual_trigger.py --scan | --full | --learn")
        print("      python manual_trigger.py --apply --full")
        return

    print("\n✅ Trigger manual completado")


if __name__ == "__main__":
    main()
