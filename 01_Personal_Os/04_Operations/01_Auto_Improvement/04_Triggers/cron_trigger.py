"""
CRON TRIGGER - Trigger Automatico para Auto-Improvement Engine (SOTA)
======================================================================
Ejecuta el motor de automejora cada N horas.
Disenado para Windows Task Scheduler o ejecucion en background.

Usage:
    python cron_trigger.py                  # Una ejecucion (para Task Scheduler)
    python cron_trigger.py --loop           # Loop infinito cada 8h
    python cron_trigger.py --interval 4     # Loop cada 4h
    python cron_trigger.py --once --apply   # Una ejecucion LIVE
"""

import sys
import time
import logging
import json
from pathlib import Path
from datetime import datetime

# Configurar logging
LOG_DIR = Path(__file__).resolve().parent.parent / "03_Metrics"
LOG_DIR.mkdir(parents=True, exist_ok=True)
LOG_FILE = LOG_DIR / "execution.log"

logging.basicConfig(
    filename=str(LOG_FILE),
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# Agregar engine al path
ENGINE_DIR = Path(__file__).resolve().parent.parent / "01_Engine"
sys.path.insert(0, str(ENGINE_DIR))

from recursive_improvement_engine import RecursiveImprovementEngine


def run_cycle(root_path: str = ".", dry_run: bool = True) -> dict:
    """Ejecuta un ciclo completo del engine y retorna resultados."""
    engine = RecursiveImprovementEngine(root_path=root_path, dry_run=dry_run)
    engine.max_iterations = 3  # Menos iteraciones en automatico

    print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M')}] Iniciando ciclo...")
    logging.info(f"Starting cycle (dry_run={dry_run}, root={root_path})")

    try:
        results = engine.run()

        # Exportar resultados
        output = {
            "timestamp": datetime.now().isoformat(),
            "dry_run": dry_run,
            "root": root_path,
            "results": results,
        }

        report_path = LOG_DIR / "last_run.json"
        report_path.write_text(
            json.dumps(output, indent=2, ensure_ascii=False),
            encoding="utf-8"
        )

        status = "SUCCESS" if results["fixes_failed"] == 0 else "ISSUES"
        logging.info(f"Cycle complete: {status} — "
                     f"detected={results['issues_detected']}, "
                     f"applied={results['fixes_applied']}, "
                     f"failed={results['fixes_failed']}")
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M')}] Ciclo completado: {status}")

        return results

    except Exception as e:
        logging.error(f"Cycle failed: {e}")
        print(f"[ERROR] Ciclo fallido: {e}")
        return {"error": str(e)}


def run_loop(interval_hours: int = 8, root_path: str = "."):
    """Loop infinito ejecutando cada `interval_hours` horas."""
    interval_seconds = interval_hours * 3600
    cycle_count = 0

    print(f"\n{'=' * 60}")
    print(f"  AUTO-IMPROVEMENT CRON DAEMON")
    print(f"  Intervalo: cada {interval_hours}h ({interval_seconds}s)")
    print(f"  Root: {root_path}")
    print(f"  Log: {LOG_FILE}")
    print(f"{'=' * 60}\n")

    logging.info(f"Cron daemon started: interval={interval_hours}h, root={root_path}")

    while True:
        cycle_count += 1
        print(f"\n--- Ciclo #{cycle_count} ---")

        # Primer ciclo: dry-run (seguridad)
        # Ciclos siguientes: live si el anterior fue exitoso
        dry_run = (cycle_count == 1)

        run_cycle(root_path=root_path, dry_run=dry_run)

        next_run = datetime.now().timestamp() + interval_seconds
        next_time = datetime.fromtimestamp(next_run).strftime('%Y-%m-%d %H:%M')
        print(f"\n  Proximo ciclo: {next_time}")
        print(f"  (esperando {interval_hours}h...)\n")

        logging.info(f"Sleeping for {interval_hours}h until {next_time}")
        time.sleep(interval_seconds)


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Cron Trigger para Auto-Improvement Engine"
    )
    parser.add_argument("--loop", action="store_true",
                        help="Loop infinito (para daemon)")
    parser.add_argument("--interval", type=int, default=8,
                        help="Intervalo en horas (default: 8)")
    parser.add_argument("--once", action="store_true",
                        help="Una sola ejecucion (para Task Scheduler)")
    parser.add_argument("--apply", action="store_true",
                        help="Aplicar fixes (LIVE)")
    parser.add_argument("--path", nargs="?", default=".",
                        help="Ruta raiz (default: proyecto actual)")

    args = parser.parse_args()

    if args.loop:
        run_loop(interval_hours=args.interval, root_path=args.path)
    else:
        # Una sola ejecucion
        run_cycle(root_path=args.path, dry_run=not args.apply)


if __name__ == "__main__":
    main()
