#!/usr/bin/env python3
"""
recursive_improvement_engine.py — Auto-Improvement Engine
Orquesta el ciclo completo: Detect → Analyze → Execute → Learn
"""

import sys
from pathlib import Path

# Add engine to path
sys.path.insert(0, str(Path(__file__).parent))

from detector import Detector
from analyzer import Analyzer
from executor import Executor
from learner import Learner

class RecursiveImprovementEngine:
    """
    Motor de mejora recursiva que ejecuta el ciclo:
    1. Detector → encuentra issues
    2. Analyzer → prioriza por impacto/esfuerzo
    3. Executor → aplica fixes auto-fixables
    4. Learner → aprende para próximas iteraciones
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

    def run(self) -> dict:
        """Ejecuta el ciclo completo de mejora"""
        results = {
            "iterations": 0,
            "issues_detected": 0,
            "fixes_applied": 0,
            "fixes_failed": 0,
            "learnings": 0
        }

        print("🚀 Iniciando Auto-Improvement Engine")
        print(f"   Modo: {'DRY RUN' if self.dry_run else 'LIVE'}")
        print("=" * 50)

        while self.iteration < self.max_iterations:
            self.iteration += 1
            print(f"\n🔄 Iteración {self.iteration}/{self.max_iterations}")

            # 1. Detect
            print("\n📍 FASE 1: Detección")
            issues = self.detector.scan()
            results["issues_detected"] += len(issues)

            if not issues:
                print("✅ No se detectaron nuevos issues")
                break

            print(f"   Encontrados {len(issues)} issues")

            # 2. Analyze
            print("\n📍 FASE 2: Análisis")
            analyzed = self.analyzer.analyze([i.__dict__ for i in issues])
            prioritized = self.analyzer.prioritize(analyzed)
            print(f"   {len(priorized)} issues priorizados")

            # 3. Execute
            print("\n📍 FASE 3: Ejecución")
            success, failed = self.executor.execute(
                [a.original_issue for a in prioritized]
            )
            results["fixes_applied"] += success
            results["fixes_failed"] += failed

            print(f"   Aplicados: {success}, Fallidos: {failed}")

            # 4. Learn
            print("\n📍 FASE 4: Aprendizaje")
            for issue in issues:
                self.learner.record_fix(
                    issue.__dict__,
                    success=True,  # Simplificado
                    method="auto"
                )
            results["learnings"] = len(issues)

            print(f"   {len(issues)} aprendizajes registrados")

            # Check if we made progress
            if success == 0 and failed == 0:
                print("\n⚠️ No se aplicaron fixes - verificando siguiente fuente...")

        print("\n" + "=" * 50)
        print("📊 RESUMEN FINAL")
        print(f"   Iteraciones: {results['iterations']}")
        print(f"   Issues detectados: {results['issues_detected']}")
        print(f"   Fixes aplicados: {results['fixes_applied']}")
        print(f"   Fixes fallidos: {results['fixes_failed']}")
        print(f"   Aprendizajes: {results['learnings']}")

        return results

    def report_all(self) -> str:
        """Genera reporte completo"""
        parts = [
            self.detector.report(),
            self.analyzer.generate_report([]),  # Simplified
            self.executor.report(),
            self.learner.report()
        ]
        return "\n\n".join(parts)


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Auto-Improvement Engine")
    parser.add_argument("path", nargs="?", default=".", help="Root path to scan")
    parser.add_argument("--live", action="store_true", help="Apply fixes (not dry-run)")
    parser.add_argument("--iterations", type=int, default=5, help="Max iterations")

    args = parser.parse_args()

    engine = RecursiveImprovementEngine(
        root_path=args.path,
        dry_run=not args.live
    )
    engine.max_iterations = args.iterations

    results = engine.run()

    if args.live:
        print("\n" + engine.learner.report())

    return 0 if results["fixes_failed"] == 0 else 1


if __name__ == "__main__":
    exit(main())
