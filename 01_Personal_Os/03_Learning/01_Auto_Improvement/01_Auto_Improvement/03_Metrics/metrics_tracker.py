# -*- coding: utf-8 -*-
"""
📊 METRICS TRACKER - Seguimiento de Métricas de Automejora
===========================================================
Trackea progreso, tendencias y genera dashboards de métricas.

Usage:
    from metrics_tracker import MetricsTracker
    tracker = MetricsTracker()
    tracker.record_metrics(cycle_data)
    trends = tracker.calculate_trends()
    dashboard = tracker.generate_dashboard()
"""

import sys
import io

# Fix para Windows: asegurar UTF-8 en stdout
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

import json
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional


class MetricsTracker:
    """Motor de seguimiento de métricas de automejora"""

    def __init__(self, metrics_dir: Optional[Path] = None):
        if metrics_dir is None:
            metrics_dir = Path(__file__).parent

        self.metrics_dir = metrics_dir
        self.metrics_file = metrics_dir / "improvement_log.json"
        self.history = self._load_history()

        # Health score thresholds
        self.HEALTH_THRESHOLDS = {
            "excellent": 85,
            "good": 70,
            "fair": 50,
            "poor": 0,
        }

    def _load_history(self) -> Dict[str, Any]:
        """Cargar historial de métricas"""
        if self.metrics_file.exists():
            try:
                with open(self.metrics_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError):
                return {"cycles": [], "baseline": {}}
        return {"cycles": [], "baseline": {}}

    def _save_history(self):
        """Guardar historial"""
        self.metrics_dir.mkdir(parents=True, exist_ok=True)
        with open(self.metrics_file, "w", encoding="utf-8") as f:
            json.dump(self.history, f, indent=2, ensure_ascii=False)

    def record_metrics(self, cycle_data: Dict[str, Any]) -> Dict[str, Any]:
        """Registrar métricas de un ciclo"""
        # Extract metrics
        issues_detected = cycle_data.get("issues_detected", 0)
        issues_analyzed = cycle_data.get("issues_analyzed", 0)
        fixes_applied = cycle_data.get("fixes_applied", 0)

        # Calculate rates
        analysis_rate = (
            (issues_analyzed / issues_detected * 100) if issues_detected > 0 else 0
        )
        fix_rate = (fixes_applied / issues_analyzed * 100) if issues_analyzed > 0 else 0

        # Health score calculation
        health_score = self._calculate_health_score(
            issues_detected, issues_analyzed, fixes_applied
        )

        metrics = {
            "timestamp": datetime.now().isoformat(),
            "issues_detected": issues_detected,
            "issues_analyzed": issues_analyzed,
            "fixes_applied": fixes_applied,
            "analysis_rate": round(analysis_rate, 2),
            "fix_rate": round(fix_rate, 2),
            "health_score": health_score,
            "mode": cycle_data.get("mode", "unknown"),
        }

        # Add to history
        self.history.setdefault("cycles", []).append(metrics)

        # Update baseline if first run
        if not self.history.get("baseline"):
            self.history["baseline"] = {
                "first_cycle": metrics,
                "health_score": health_score,
                "issues_detected": issues_detected,
            }

        self._save_history()

        return metrics

    def _calculate_health_score(self, detected: int, analyzed: int, fixed: int) -> int:
        """Calcular health score (0-100)"""
        if detected == 0:
            return 100

        # Factors:
        # - Analysis coverage (40%): how many detected issues were analyzed
        # - Fix rate (40%): how many analyzed issues were fixed
        # - Issue density (20%): fewer issues = better

        analysis_score = (analyzed / detected * 100) if detected > 0 else 0
        fix_score = (fixed / analyzed * 100) if analyzed > 0 else 0

        # Normalize issue density (assume 1000 is baseline)
        issue_density = min(detected / 1000, 1.0) * 100
        density_score = 100 - issue_density

        # Weighted average
        health = analysis_score * 0.4 + fix_score * 0.4 + density_score * 0.2

        return min(int(health), 100)

    def calculate_trends(self, days: int = 30) -> Dict[str, Any]:
        """Calcular tendencias históricas"""
        if not self.history.get("cycles"):
            return {"trend": "no_data", "message": "No hay datos suficientes"}

        cutoff = datetime.now() - timedelta(days=days)
        recent_cycles = [
            c
            for c in self.history["cycles"]
            if datetime.fromisoformat(c["timestamp"]) > cutoff
        ]

        if len(recent_cycles) < 2:
            return {"trend": "insufficient_data", "cycles": len(recent_cycles)}

        # Calculate trends
        health_scores = [c["health_score"] for c in recent_cycles]
        issues = [c["issues_detected"] for c in recent_cycles]
        fixes = [c["fixes_applied"] for c in recent_cycles]

        # Simple trend: compare first half vs second half
        mid = len(health_scores) // 2
        first_half_avg = sum(health_scores[:mid]) / mid if mid > 0 else 0
        second_half_avg = sum(health_scores[mid:]) / (len(health_scores) - mid)

        trend_direction = (
            "improving" if second_half_avg > first_half_avg else "declining"
        )

        return {
            "trend": trend_direction,
            "period_days": days,
            "cycles_analyzed": len(recent_cycles),
            "avg_health_score": round(sum(health_scores) / len(health_scores), 2),
            "avg_issues_detected": round(sum(issues) / len(issues), 2),
            "avg_fixes_applied": round(sum(fixes) / len(fixes), 2),
            "total_issues_fixed": sum(fixes),
            "improvement_rate": round(second_half_avg - first_half_avg, 2),
        }

    def generate_dashboard(self) -> Dict[str, Any]:
        """Generar dashboard de métricas"""
        trends = self.calculate_trends()

        # Get current health
        current_health = 0
        if self.history.get("cycles"):
            current_health = self.history["cycles"][-1].get("health_score", 0)

        # Determine status
        status = "excellent"
        if current_health < self.HEALTH_THRESHOLDS["excellent"]:
            status = "good"
        if current_health < self.HEALTH_THRESHOLDS["good"]:
            status = "fair"
        if current_health < self.HEALTH_THRESHOLDS["fair"]:
            status = "poor"

        # Recommendations
        recommendations = []
        if trends.get("trend") == "declining":
            recommendations.append("Action needed: System health is declining")
        if current_health < 70:
            recommendations.append("Warning: Health score below 70%")
        if trends.get("avg_fixes_applied", 0) == 0:
            recommendations.append("Info: No fixes applied in recent cycles")

        return {
            "generated_at": datetime.now().isoformat(),
            "current_health_score": current_health,
            "status": status,
            "total_cycles": len(self.history.get("cycles", [])),
            "trends": trends,
            "recommendations": recommendations,
            "health_thresholds": self.HEALTH_THRESHOLDS,
        }

    def get_summary(self) -> str:
        """Generar resumen en texto"""
        dashboard = self.generate_dashboard()

        summary = f"""
╔══════════════════════════════════════════════════════════════════╗
║              📊 METRICS DASHBOARD - Auto Improvement            ║
╠══════════════════════════════════════════════════════════════════╣
║  Health Score: {dashboard["current_health_score"]}/100 ({dashboard["status"].upper()})
║  Total Cycles: {dashboard["total_cycles"]}
╠══════════════════════════════════════════════════════════════════╣
║  Trend: {dashboard["trends"].get("trend", "N/A").upper()}
║  Avg Issues: {dashboard["trends"].get("avg_issues_detected", 0):.0f}
║  Avg Fixes: {dashboard["trends"].get("avg_fixes_applied", 0):.0f}
╚══════════════════════════════════════════════════════════════════╝
"""
        if dashboard["recommendations"]:
            summary += "\n📋 Recommendations:\n"
            for rec in dashboard["recommendations"]:
                summary += f"  • {rec}\n"

        return summary


# CLI
if __name__ == "__main__":
    import sys

    tracker = MetricsTracker()

    if len(sys.argv) > 1:
        if sys.argv[1] == "--dashboard":
            print(tracker.get_summary())
        elif sys.argv[1] == "--trends":
            import json

            print(json.dumps(tracker.calculate_trends(), indent=2))
        elif sys.argv[1] == "--record":
            # Record a test cycle
            test_data = {
                "issues_detected": 100,
                "issues_analyzed": 80,
                "fixes_applied": 50,
                "mode": "test",
            }
            result = tracker.record_metrics(test_data)
            print(f"Recorded: Health Score = {result['health_score']}")
        else:
            print("Usage: metrics_tracker.py [--dashboard|--trends|--record]")
    else:
        print(tracker.get_summary())
