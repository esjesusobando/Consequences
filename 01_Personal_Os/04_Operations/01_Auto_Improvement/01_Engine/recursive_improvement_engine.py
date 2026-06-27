#!/usr/bin/env python3
"""
recursive_improvement_engine.py — Auto-Improvement Engine (SOTA Update)
Orquesta el ciclo completo: Detect → Analyze → Execute → Learn
Ubicacion final: 01_Engine/ (junto a detector, analyzer, executor, learner)

Mejoras SOTA: Type hints estrictos, logging estructurado.
"""

import sys
import json
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional

# Los imports funcionan porque estamos en el mismo directorio que detector.py etc.
from detector import Detector
from analyzer import Analyzer
from executor import Executor
from learner import Learner

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] AutoEngine: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("AutoEngine")

class RecursiveImprovementEngine:
    """
    Motor de mejora recursiva que ejecuta el ciclo:
    1. Detector -> encuentra issues
    2. Analyzer -> prioriza por impacto/esfuerzo
    3. Executor -> aplica fixes auto-fixables
    4. Learner -> aprende para proximas iteraciones
    """

    def __init__(self, root_path: str = ".", dry_run: bool = True):
        self.root: str = root_path
        self.dry_run: bool = dry_run
        self.iteration: int = 0
        self.max_iterations: int = 5

        # Componentes
        self.detector = Detector(root_path)
        self.analyzer = Analyzer()
        self.executor = Executor(root_path, dry_run=dry_run)
        self.learner = Learner()

    # ------------------------------------------------------------------
    # Metodos publicos
    # ------------------------------------------------------------------

    def run(self) -> Dict[str, Any]:
        """Ejecuta el ciclo completo de mejora (todas las fases)"""
        results: Dict[str, Any] = {
            "iterations": 0,
            "issues_detected": 0,
            "fixes_applied": 0,
            "fixes_failed": 0,
            "learnings": 0,
        }

        logger.info("=" * 60)
        logger.info("  AUTO-IMPROVEMENT ENGINE v2.0 (SOTA)")
        logger.info(f"  Modo: {'DRY RUN' if self.dry_run else 'LIVE'}")
        logger.info(f"  Root: {self.root}")
        logger.info("=" * 60)

        while self.iteration < self.max_iterations:
            self.iteration += 1
            logger.info(f"\n--- Iteracion {self.iteration}/{self.max_iterations} ---")

            # 1. Detect
            logger.info("[FASE 1] Detectando issues...")
            issues = self.detector.scan()
            results["issues_detected"] += len(issues)

            if not issues:
                logger.info("  No se detectaron nuevos issues.")
                break

            logger.info(f"  Encontrados {len(issues)} issues")

            # 2. Analyze
            logger.info("[FASE 2] Analizando y priorizando...")
            analyzed = self.analyzer.analyze([i.__dict__ for i in issues])
            prioritized = self.analyzer.prioritize(analyzed)
            logger.info(f"  {len(prioritized)} issues priorizados")

            # 3. Execute
            logger.info("[FASE 3] Ejecutando fixes...")
            enriched_issues: List[Dict[str, Any]] = []
            for a in prioritized:
                issue = dict(a.original_issue)
                issue["auto_fixable"] = a.auto_fixable
                enriched_issues.append(issue)
            success, failed = self.executor.execute(enriched_issues)
            results["fixes_applied"] += success
            results["fixes_failed"] += failed
            logger.info(f"  Aplicados: {success} | Fallidos: {failed}")

            # 4. Learn
            logger.info("[FASE 4] Aprendiendo...")
            for issue in issues:
                self.learner.record_fix(
                    issue.__dict__,
                    success=True,
                    method="auto"
                )
            results["learnings"] += len(issues)
            logger.info(f"  {len(issues)} aprendizajes registrados")

            if success == 0 and failed == 0 and len(issues) > 0:
                logger.info("  Sin avance -- se detienen las iteraciones.")
                break

        results["iterations"] = self.iteration
        logger.info("\n" + "=" * 60)
        logger.info("  RESUMEN FINAL")
        logger.info("=" * 60)
        logger.info(f"  Iteraciones:      {results['iterations']}")
        logger.info(f"  Issues detectados: {results['issues_detected']}")
        logger.info(f"  Fixes aplicados:   {results['fixes_applied']}")
        logger.info(f"  Fixes fallidos:    {results['fixes_failed']}")
        logger.info(f"  Aprendizajes:      {results['learnings']}")
        logger.info("=" * 60)

        return results

    def scan_only(self) -> Dict[str, Any]:
        logger.info("[MODO] Scan solamente (sin modificaciones)")
        issues = self.detector.scan()
        issues_data = [i.__dict__ for i in issues]
        return {
            "issues_detected": len(issues_data),
            "issues": issues_data,
        }

    def full_cycle(self) -> Dict[str, Any]:
        return self.run()

    def run_quick_scan(self) -> Dict[str, Any]:
        return self.scan_only()

    def run_full_cycle(self) -> Dict[str, Any]:
        return self.full_cycle()

    def run_learn_only(self) -> Dict[str, Any]:
        return self.learn_only()

    def learn_only(self) -> Dict[str, Any]:
        logger.info("[MODO] Learn solamente")
        stats = self.learner.get_stats()
        suggestions = self.learner.evolve_rules([])
        return {
            "stats": stats,
            "suggestions": suggestions,
        }

    def generate_report(self) -> str:
        parts: List[str] = [
            f"# Auto-Improvement Report",
            f"**Fecha:** {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            f"**Root:** {self.root}",
            f"**Dry Run:** {self.dry_run}",
            "",
            "## Detector",
            self.detector.report(),
            "",
            "## Learner",
            self.learner.report(),
        ]
        return "\n".join(parts)

    def export_results(self, results: Dict[str, Any], output_path: Optional[str] = None) -> str:
        if output_path is None:
            output_path = str(Path(self.root) / "04_Operations" / "01_Auto_Improvement" / "03_Metrics" / "last_run.json")
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        data = {
            "timestamp": datetime.now().isoformat(),
            "results": results,
        }
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
        logger.info(f"Resultados exportados a: {path}")
        return str(path)


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(description="Auto-Improvement Engine (SOTA)")
    parser.add_argument("path", nargs="?", default=".", help="Root path to scan")
    parser.add_argument("--live", action="store_true", help="Aplicar fixes (no dry-run)")
    parser.add_argument("--iterations", type=int, default=5, help="Max iteraciones")
    parser.add_argument("--scan", action="store_true", help="Solo escanear")
    parser.add_argument("--learn", action="store_true", help="Solo aprendizaje")
    parser.add_argument("--report", action="store_true", help="Generar reporte")
    parser.add_argument("--export", action="store_true", help="Exportar resultados a JSON")
    parser.add_argument("--smoke", action="store_true",
                        help="Smoke test: ejecuta un mini-ciclo con issues de prueba para verificar que el pipeline funciona")

    args = parser.parse_args()

    engine = RecursiveImprovementEngine(
        root_path=args.path,
        dry_run=not args.live
    )
    engine.max_iterations = args.iterations

    if args.smoke:
        logger.info("=" * 60)
        logger.info("  SMOKE TEST MODE")
        logger.info("=" * 60)
        from executor import Executor
        test_executor = Executor(args.path, dry_run=not args.live)
        test_issues = [
            {
                "severity": "HIGH",
                "category": "structure",
                "path": str(Path(args.path) / "04_Operations" / "01_Auto_Improvement" / "00_Smoke_Test_Dir"),
                "description": "Directorio faltante en estructura",
                "auto_fixable": True
            },
            {
                "severity": "MEDIUM",
                "category": "structure",
                "path": "Script duplicado: __init__.py",
                "description": "Aparece en 2 ubicaciones",
                "auto_fixable": True
            },
        ]
        success, failed = test_executor.execute(test_issues)
        logger.info("")
        logger.info(test_executor.report())
        mode = "LIVE" if args.live else "DRY RUN"
        logger.info(f"\n[SMOKE] [{mode}] {success} OK, {failed} FAILED")
        if not args.live:
            logger.info("[SMOKE] Para aplicar fixes reales, ejecuta con --live")
        smoke_dir = Path(args.path) / "04_Operations" / "01_Auto_Improvement" / "00_Smoke_Test_Dir"
        if smoke_dir.exists() and args.live:
            smoke_dir.rmdir()
            logger.info(f"[SMOKE] Limpiado directorio de prueba: {smoke_dir}")
        return 0 if failed == 0 else 1

    if args.scan:
        result = engine.scan_only()
    elif args.learn:
        result = engine.learn_only()
    elif args.report:
        logger.info(engine.generate_report())
        return 0
    else:
        result = engine.full_cycle()

    if args.export and not args.report:
        engine.export_results(result)

    return 0


if __name__ == "__main__":
    sys.exit(main())
