"""
🧠 RECURSIVE SELF-IMPROVEMENT ENGINE
====================================
Motor principal de automejora para PersonalOS v6.1

Arquitectura: Detector → Analyzer → Executor → Learner

Usage:
    python recursive_improvement_engine.py --scan        # Scan rápido
    python recursive_improvement_engine.py --full       # Ciclo completo
    python recursive_improvement_engine.py --learn        # Solo aprender
"""

import sys
import io
import json
import argparse
from pathlib import Path
from datetime import datetime

# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# Paths — v2.0 Consequences (post-consolidación)
# Estructura: ROOT/01_Personal_Os/04_Operations/01_Auto_Improvement/01_Engine/
# _ENGINE_DIR.parent              = 01_Auto_Improvement/
# _ENGINE_DIR.parent.parent       = 04_Operations/
# _ENGINE_DIR.parent.parent.parent = 01_Personal_Os/
# _ENGINE_DIR.parent.parent.parent.parent = ROOT/
_ENGINE_DIR = Path(__file__).parent
_SCRIPTS_OS = _ENGINE_DIR.parent.parent / "03_Scripts_Os"  # 04_Operations/03_Scripts_Os
sys.path.insert(0, str(_ENGINE_DIR))   # para detector, analyzer, executor, learner
sys.path.insert(0, str(_SCRIPTS_OS))   # para config_paths

try:
    from config_paths import PROJECT_ROOT, SCRIPTS_OS_DIR
except ImportError:
    PROJECT_ROOT = _ENGINE_DIR.parent.parent.parent.parent  # ROOT
    SCRIPTS_OS_DIR = _SCRIPTS_OS

# Import modules
from detector import Detector
from analyzer import Analyzer
from executor import Executor
from learner import Learner


class RecursiveImprovementEngine:
    """
    Motor de automejora recursiva.

    Ciclo: DETECT → ANALYZE → EXECUTE → LEARN → EVOLVE
    """

    def __init__(self, dry_run=True):
        self.dry_run = dry_run
        self.project_root = PROJECT_ROOT
        self.auto_improve_dir = Path(__file__).parent

        # Components
        self.detector = Detector(self.project_root)
        self.analyzer = Analyzer()
        self.executor = Executor(self.project_root, dry_run)
        self.learner = Learner(self.auto_improve_dir)

        # Results
        self.issues_detected = []
        self.issues_analyzed = []
        self.fixes_applied = []
        self.learnings = []

        print(f"🧠 Recursive Improvement Engine initialized")
        print(f"   Project: {self.project_root.name}")
        print(f"   Mode: {'DRY RUN' if dry_run else 'APPLY'}")

    def _issues_to_dicts(self, issues):
        """Convierte Issue dataclasses a dicts para el Analyzer."""
        result = []
        for iss in issues:
            if hasattr(iss, "__dict__"):
                result.append(iss.__dict__)
            elif isinstance(iss, dict):
                result.append(iss)
        return result

    def run_quick_scan(self):
        """Scan rápido - detección de issues críticos"""
        print("\n" + "=" * 60)
        print("🔍 QUICK SCAN - Detección de issues críticos")
        print("=" * 60)

        # Phase 1: Detect — scan() y filtrar críticos/altos
        all_issues = self.detector.scan()
        self.issues_detected = [
            i for i in all_issues
            if getattr(i, "severity", i.get("severity", "LOW") if isinstance(i, dict) else "LOW")
            in ("CRITICAL", "HIGH")
        ]

        print(f"\n✅ Detectados {len(self.issues_detected)} issues críticos")

        # Phase 2: Quick analyze — batch call con top 5
        top5 = self.issues_detected[:5]
        if top5:
            self.issues_analyzed = self.analyzer.analyze(self._issues_to_dicts(top5))

        # Phase 3: Auto-fix si es posible
        if not self.dry_run:
            for analysis in self.issues_analyzed:
                auto_fix = getattr(analysis, "auto_fixable", False) if hasattr(analysis, "auto_fixable") else analysis.get("auto_fixable", False)
                if auto_fix:
                    issue_dict = analysis.__dict__ if hasattr(analysis, "__dict__") else analysis
                    result = self.executor.apply_fix(issue_dict)
                    self.fixes_applied.append(result)

        # Phase 4: Learn
        self.learnings = self.learner.learn_from_cycle(
            {
                "issues": self._issues_to_dicts(self.issues_detected),
                "analyzed": self.issues_analyzed,
                "fixed": self.fixes_applied,
            }
        )

        return self._generate_report()

    def run_full_cycle(self):
        """Ciclo completo de automejora"""
        print("\n" + "=" * 60)
        print("🔄 FULL CYCLE - Ciclo completo de automejora")
        print("=" * 60)

        # Phase 1: Detect
        print("\n📡 Phase 1: DETECT")
        self.issues_detected = self.detector.scan()
        print(f"   → {len(self.issues_detected)} issues detectados")

        # Phase 2: Analyze — batch call
        print("\n📊 Phase 2: ANALYZE")
        if self.issues_detected:
            self.issues_analyzed = self.analyzer.analyze(self._issues_to_dicts(self.issues_detected))
        print(f"   → {len(self.issues_analyzed)} issues analizados")

        # Phase 3: Execute
        print("\n⚡ Phase 3: EXECUTE")
        for analysis in self.issues_analyzed:
            should_fix = getattr(analysis, "auto_fixable", False) if hasattr(analysis, "auto_fixable") else analysis.get("should_fix", False)
            if should_fix and not self.dry_run:
                issue_dict = analysis.__dict__ if hasattr(analysis, "__dict__") else analysis
                result = self.executor.apply_fix(issue_dict)
                self.fixes_applied.append(result)
        print(f"   → {len(self.fixes_applied)} fixes aplicados")

        # Phase 4: Learn
        print("\n🧠 Phase 4: LEARN")
        self.learnings = self.learner.learn_from_cycle(
            {
                "issues": self.issues_detected,
                "analyzed": self.issues_analyzed,
                "fixed": self.fixes_applied,
            }
        )
        print(f"   → {len(self.learnings)} aprendizajes registrados")

        # Phase 5: Evolve
        print("\n🌱 Phase 5: EVOLVE")
        suggestions = self.learner.evolve_rules(self.learnings)
        print(f"   → {len(suggestions)} sugerencias de evolución")

        return self._generate_report()

    def run_learn_only(self):
        """Solo aprender de ciclos anteriores"""
        print("\n" + "=" * 60)
        print("🧠 LEARN ONLY - Aprender de ciclos anteriores")
        print("=" * 60)

        self.learnings = self.learner.load_and_analyze_history()
        suggestions = self.learner.evolve_rules(self.learnings)

        return {"learnings": self.learnings, "suggestions": suggestions}

    def _to_serializable(self, obj):
        """Convierte dataclasses e Issue objects a dicts JSON-serializable."""
        if isinstance(obj, list):
            return [self._to_serializable(i) for i in obj]
        if hasattr(obj, "__dict__"):
            return {k: self._to_serializable(v) for k, v in obj.__dict__.items()}
        return obj

    def _generate_report(self):
        """Generar reporte del ciclo"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "mode": "dry_run" if self.dry_run else "apply",
            "issues_detected": len(self.issues_detected),
            "issues_analyzed": len(self.issues_analyzed),
            "fixes_applied": len(self.fixes_applied),
            "learnings": self._to_serializable(self.learnings),
            "details": {
                "issues": self._to_serializable(self.issues_detected),
                "analyzed": self._to_serializable(self.issues_analyzed),
                "fixed": self._to_serializable(self.fixes_applied),
                "learnings": self._to_serializable(self.learnings),
            },
        }

        # Save to metrics
        self._save_metrics(report)

        return report

    def _save_metrics(self, report):
        """Guardar métricas del ciclo"""
        metrics_file = self.auto_improve_dir / "03_Metrics" / "improvement_log.json"
        metrics_file.parent.mkdir(parents=True, exist_ok=True)

        # Load existing
        if metrics_file.exists():
            with open(metrics_file, encoding="utf-8") as f:
                try:
                    metrics = json.load(f)
                except json.JSONDecodeError:
                    metrics = {"cycles": []}
        else:
            metrics = {"cycles": []}

        # Add new cycle
        metrics["cycles"].append(report)

        # Save
        with open(metrics_file, "w", encoding="utf-8") as f:
            json.dump(metrics, f, indent=2)

        print(f"\n[METRICS] Metricas guardadas en {metrics_file.name}")


def main():
    parser = argparse.ArgumentParser(description="Recursive Self-Improvement Engine")
    parser.add_argument(
        "--scan", action="store_true", help="Quick scan (critical issues only)"
    )
    parser.add_argument("--full", action="store_true", help="Full improvement cycle")
    parser.add_argument("--learn", action="store_true", help="Learn from history only")
    parser.add_argument(
        "--apply", action="store_true", help="Apply fixes (default is dry-run)"
    )

    args = parser.parse_args()

    # Default to quick scan
    if not (args.scan or args.full or args.learn):
        args.scan = True

    # Initialize engine
    dry_run = not args.apply
    engine = RecursiveImprovementEngine(dry_run=dry_run)

    # Run requested mode
    if args.scan:
        report = engine.run_quick_scan()
    elif args.full:
        report = engine.run_full_cycle()
    elif args.learn:
        report = engine.run_learn_only()

    # Print summary
    print("\n" + "=" * 60)
    print("📋 RESUMEN DEL CICLO")
    print("=" * 60)
    print(f"Issues detectados: {report.get('issues_detected', 0)}")
    print(f"Issues analizados: {report.get('issues_analyzed', 0)}")
    print(f"Fixes aplicados:   {report.get('fixes_applied', 0)}")
    print(f"Aprendizajes:      {len(report.get('learnings', []))}")
    print("=" * 60)


if __name__ == "__main__":
    main()
