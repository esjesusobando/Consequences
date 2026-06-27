#!/usr/bin/env python3
"""
recursive_improvement_engine.py — Auto-Improvement Engine (SOTA)
Orquesta el ciclo completo: Detect → Analyze → Execute → Learn
Ubicacion final: 01_Engine/ (junto a detector, analyzer, executor, learner)
"""

import sys
import json
from pathlib import Path
from datetime import datetime

# Los imports funcionan porque estamos en el mismo directorio que detector.py etc.
from detector import Detector
from analyzer import Analyzer
from executor import Executor
from learner import Learner


class RecursiveImprovementEngine:
    """
    Motor de mejora recursiva que ejecuta el ciclo:
    1. Detector -> encuentra issues
    2. Analyzer -> prioriza por impacto/esfuerzo
    3. Executor -> aplica fixes auto-fixables
    4. Learner -> aprende para proximas iteraciones
    """

    def __init__(self, root_path: str = ".", dry_run: bool = True):
        self.root = root_path
        self.dry_run = dry_run
        self.iteration = 0
        self.max_iterations = 5

        # Componentes
        self.detector = Detector(root_path)
        self.analyzer = Analyzer()
        self.executor = Executor(root_path, dry_run=dry_run)
        self.learner = Learner()

    # ------------------------------------------------------------------
    # Metodos publicos
    # ------------------------------------------------------------------

    def run(self) -> dict:
        """Ejecuta el ciclo completo de mejora (todas las fases)"""
        results = {
            "iterations": 0,
            "issues_detected": 0,
            "fixes_applied": 0,
            "fixes_failed": 0,
            "learnings": 0,
        }

        print("=" * 60)
        print("  AUTO-IMPROVEMENT ENGINE v2.0 (SOTA)")
        print(f"  Modo: {'DRY RUN' if self.dry_run else 'LIVE'}")
        print(f"  Root: {self.root}")
        print("=" * 60)

        while self.iteration < self.max_iterations:
            self.iteration += 1
            print(f"\n--- Iteracion {self.iteration}/{self.max_iterations} ---")

            # 1. Detect
            print("[FASE 1] Detectando issues...")
            issues = self.detector.scan()
            results["issues_detected"] += len(issues)

            if not issues:
                print("  No se detectaron nuevos issues.")
                break

            print(f"  Encontrados {len(issues)} issues")

            # 2. Analyze
            print("[FASE 2] Analizando y priorizando...")
            analyzed = self.analyzer.analyze([i.__dict__ for i in issues])
            prioritized = self.analyzer.prioritize(analyzed)
            print(f"  {len(prioritized)} issues priorizados")

            # 3. Execute
            print("[FASE 3] Ejecutando fixes...")
            # Enriquecer cada issue con auto_fixable desde AnalyzedIssue
            enriched_issues = []
            for a in prioritized:
                issue = dict(a.original_issue)
                issue["auto_fixable"] = a.auto_fixable
                enriched_issues.append(issue)
            success, failed = self.executor.execute(enriched_issues)
            results["fixes_applied"] += success
            results["fixes_failed"] += failed
            print(f"  Aplicados: {success} | Fallidos: {failed}")

            # 4. Learn
            print("[FASE 4] Aprendiendo...")
            for issue in issues:
                self.learner.record_fix(
                    issue.__dict__,
                    success=True,
                    method="auto"
                )
            results["learnings"] += len(issues)
            print(f"  {len(issues)} aprendizajes registrados")

            # Si no se aplico nada, salir
            if success == 0 and failed == 0 and len(issues) > 0:
                print("  Sin avance -- se detienen las iteraciones.")
                break

        # Resumen final
        results["iterations"] = self.iteration
        print("\n" + "=" * 60)
        print("  RESUMEN FINAL")
        print("=" * 60)
        print(f"  Iteraciones:      {results['iterations']}")
        print(f"  Issues detectados: {results['issues_detected']}")
        print(f"  Fixes aplicados:   {results['fixes_applied']}")
        print(f"  Fixes fallidos:    {results['fixes_failed']}")
        print(f"  Aprendizajes:      {results['learnings']}")
        print("=" * 60)

        return results

    def scan_only(self) -> dict:
        """Solo fase 1: detecta issues sin modificar nada."""
        print("[MODO] Scan solamente (sin modificaciones)")
        issues = self.detector.scan()
        issues_data = [i.__dict__ for i in issues]
        return {
            "issues_detected": len(issues_data),
            "issues": issues_data,
        }

    def full_cycle(self) -> dict:
        """Ciclo completo: detect -> analyze -> execute -> learn (alias de run)."""
        return self.run()

    # Alias para compatibilidad con 11_Auto_Learn_Hub.py y manual_trigger.py
    def run_quick_scan(self) -> dict:
        """Alias: scan_only (compatibilidad con 11_Auto_Learn_Hub)."""
        return self.scan_only()

    def run_full_cycle(self) -> dict:
        """Alias: full_cycle (compatibilidad con 11_Auto_Learn_Hub)."""
        return self.full_cycle()

    def run_learn_only(self) -> dict:
        """Alias: learn_only (compatibilidad con 11_Auto_Learn_Hub)."""
        return self.learn_only()

    def learn_only(self) -> dict:
        """Solo fase 4: procesa aprendizajes de ejecuciones anteriores."""
        print("[MODO] Learn solamente")
        stats = self.learner.get_stats()
        suggestions = self.learner.evolve_rules([])
        return {
            "stats": stats,
            "suggestions": suggestions,
        }

    def generate_report(self) -> str:
        """Genera reporte completo de estado del sistema."""
        parts = [
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

    def export_results(self, results: dict, output_path: str = None) -> str:
        """Exporta resultados a JSON."""
        if output_path is None:
            output_path = str(Path(self.root) / "04_Operations" / "01_Auto_Improvement" / "03_Metrics" / "last_run.json")
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        data = {
            "timestamp": datetime.now().isoformat(),
            "results": results,
        }
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"  Resultados exportados a: {path}")
        return str(path)


def main():
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
        print("=" * 60)
        print("  SMOKE TEST MODE")
        print("=" * 60)
        # Usar issues de prueba del executor (auto_fixable=True)
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
        print()
        print(test_executor.report())
        mode = "LIVE" if args.live else "DRY RUN"
        print(f"\n[SMOKE] [{mode}] {success} OK, {failed} FAILED")
        if not args.live:
            print("[SMOKE] Para aplicar fixes reales, ejecuta con --live")
        # Limpiar directorio de prueba si se creó
        smoke_dir = Path(args.path) / "04_Operations" / "01_Auto_Improvement" / "00_Smoke_Test_Dir"
        if smoke_dir.exists() and args.live:
            smoke_dir.rmdir()
            print(f"[SMOKE] Limpiado directorio de prueba: {smoke_dir}")
        return 0 if failed == 0 else 1

    if args.scan:
        result = engine.scan_only()
    elif args.learn:
        result = engine.learn_only()
    elif args.report:
        print(engine.generate_report())
        return 0
    else:
        result = engine.full_cycle()

    if args.export and not args.report:
        engine.export_results(result)

    return 0


if __name__ == "__main__":
    exit(main())
