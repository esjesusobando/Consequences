"""
MANUAL TRIGGER - Trigger Manual para Auto-Improvement Engine (SOTA)
====================================================================
Ejecuta el motor de automejora manualmente con distintos modos.

Usage:
    python manual_trigger.py --scan        # Solo escanear (dry-run)
    python manual_trigger.py --full        # Ciclo completo (dry-run)
    python manual_trigger.py --learn       # Solo aprendizaje
    python manual_trigger.py --apply       # Aplicar fixes (LIVE)
    python manual_trigger.py --full --apply  # Ciclo completo con fixes reales
    python manual_trigger.py --report      # Generar reporte de estado
"""

import sys
from pathlib import Path

# Agregar 01_Engine al path
ENGINE_DIR = Path(__file__).resolve().parent.parent / "01_Engine"
sys.path.insert(0, str(ENGINE_DIR))

from recursive_improvement_engine import RecursiveImprovementEngine


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Manual Auto-Improvement Trigger (SOTA)"
    )
    parser.add_argument("--scan", action="store_true", help="Solo escanear (dry-run)")
    parser.add_argument("--full", action="store_true", help="Ciclo completo")
    parser.add_argument("--learn", action="store_true", help="Solo aprendizaje")
    parser.add_argument("--apply", action="store_true",
                        help="Aplicar fixes (sin --apply es dry-run)")
    parser.add_argument("--report", action="store_true", help="Generar reporte de estado")
    parser.add_argument("--export", action="store_true",
                        help="Exportar resultados a JSON")
    parser.add_argument("--smoke", action="store_true",
                        help="Smoke test: mini-ciclo con issues de prueba")
    parser.add_argument("--path", nargs="?", default=".",
                        help="Ruta raiz a escanear (default: proyecto actual)")
    parser.add_argument("--iterations", type=int, default=5,
                        help="Max iteraciones (default: 5)")

    args = parser.parse_args()

    # Determinar dry-run vs live
    dry_run = not args.apply

    # Inicializar engine
    engine = RecursiveImprovementEngine(
        root_path=args.path,
        dry_run=dry_run
    )
    engine.max_iterations = args.iterations

    # Delegate --smoke to the engine's main
    if args.smoke:
        print("=" * 60)
        print("  MODO: SMOKE TEST")
        print("=" * 60)
        # Re-import with --smoke flag
        import subprocess
        engine_path = Path(__file__).resolve().parent.parent / "01_Engine" / "recursive_improvement_engine.py"
        cmd = [sys.executable, str(engine_path), "--smoke"]
        if not dry_run:
            cmd.append("--live")
        if args.path:
            cmd.append(args.path)
        result = subprocess.run(cmd)
        return result.returncode

    # Ejecutar segun modo
    if args.report:
        print(engine.generate_report())
        return 0

    if args.scan:
        print("=" * 60)
        print("  MODO: SCAN ONLY (sin modificaciones)")
        print("=" * 60)
        result = engine.scan_only()
    elif args.learn:
        print("=" * 60)
        print("  MODO: LEARN ONLY")
        print("=" * 60)
        result = engine.learn_only()
    elif args.full:
        print("=" * 60)
        print(f"  MODO: FULL CYCLE ({'LIVE' if not dry_run else 'DRY RUN'})")
        print("=" * 60)
        result = engine.full_cycle()
    else:
        # Default: full cycle dry-run
        print("=" * 60)
        print("  MODO: FULL CYCLE (DRY RUN)")
        print("  Usa --full --apply para LIVE")
        print("=" * 60)
        result = engine.full_cycle()

    print("\n  Trigger manual completado.")
    if args.export:
        path = engine.export_results(result)
        print(f"  Resultados en: {path}")

    return 0


if __name__ == "__main__":
    exit(main())
