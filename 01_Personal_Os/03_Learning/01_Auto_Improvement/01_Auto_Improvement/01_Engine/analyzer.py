#!/usr/bin/env python3
"""
Analyzer — Auto-Improvement Engine
Analiza y clasifica issues por severidad e impacto
"""

from dataclasses import dataclass
from typing import List, Dict
from datetime import datetime

@dataclass
class AnalyzedIssue:
    original_issue: dict
    severity_score: int  # 1-10
    impact_area: str  # productivity, reliability, maintainability
    effort_to_fix: str  # LOW, MEDIUM, HIGH
    auto_fixable: bool
    dependencies: List[str]

class Analyzer:
    def __init__(self):
        self.analysis_cache: Dict[str, AnalyzedIssue] = {}

    def analyze(self, issues: List[dict]) -> List[AnalyzedIssue]:
        """Analiza una lista de issues"""
        analyzed = []

        for issue in issues:
            analyzed_issue = self._analyze_single(issue)
            analyzed.append(analyzed_issue)
            self.analysis_cache[issue.get("path", "")] = analyzed_issue

        return analyzed

    def _analyze_single(self, issue: dict) -> AnalyzedIssue:
        """Analiza un issue individual"""

        # Calcular severity score
        severity = issue.get("severity", "LOW")
        severity_scores = {
            "CRITICAL": 10,
            "HIGH": 7,
            "MEDIUM": 5,
            "LOW": 2
        }
        severity_score = severity_scores.get(severity, 1)

        # Determinar impact area
        category = issue.get("category", "")
        impact_mapping = {
            "structure": "maintainability",
            "docs": "productivity",
            "code": "reliability",
            "deps": "reliability"
        }
        impact_area = impact_mapping.get(category, "maintainability")

        # Estimar esfuerzo
        effort_mapping = {
            "CRITICAL": "HIGH",
            "HIGH": "MEDIUM",
            "MEDIUM": "MEDIUM",
            "LOW": "LOW"
        }
        effort_to_fix = effort_mapping.get(severity, "LOW")

        # Es auto-fixable? Verifica si executor.py tiene un handler para este issue
        # Esto debe coincidir con las rutas en executor._apply_fix()
        # Usar el mismo combined path+description que executor.py porque detector.py
        # pone keywords (como "Script duplicado:") en el path, no en description
        category = issue.get("category", "")
        path = issue.get("path", "").lower()
        description = issue.get("description", "").lower()
        combined = path + " " + description
        auto_fixable = any([
            # structure → create_dir or duplicate_scripts
            category == "structure" and (
                "directorio" in combined or
                "duplicado" in combined
            ),
            # docs → version_mismatch or docstring
            category == "docs" and (
                "version" in description or
                "docstring" in description or
                "documentacion" in description or
                "readme" in description
            ),
            # code → naming convention
            category == "code" and "naming" in description,
            # deps → any deps fix available
            category == "deps",
        ])

        # ── Safety guards ────────────────────────────────────────────
        # No auto-fixear __init__.py duplicados: es normal que aparezca
        # en cada directorio de un paquete Python
        if auto_fixable and category == "structure" and "__init__.py" in combined:
            auto_fixable = False

        # Dependencies
        dependencies = self._find_dependencies(issue)

        return AnalyzedIssue(
            original_issue=issue,
            severity_score=severity_score,
            impact_area=impact_area,
            effort_to_fix=effort_to_fix,
            auto_fixable=auto_fixable,
            dependencies=dependencies
        )

    def _find_dependencies(self, issue: dict) -> List[str]:
        """Encuentra dependencias para resolver el issue"""
        # Lógica simplificada
        return []

    def prioritize(self, analyzed: List[AnalyzedIssue]) -> List[AnalyzedIssue]:
        """Prioriza issues: alto impacto + bajo esfuerzo = primero"""
        return sorted(analyzed, key=lambda x: (
            -x.severity_score,
            x.effort_to_fix == "LOW",
            x.effort_to_fix == "MEDIUM"
        ))

    def generate_report(self, analyzed: List[AnalyzedIssue]) -> str:
        """Genera reporte de análisis"""
        lines = [
            "# [STATS] Análisis de Issues",
            f"**Fecha:** {datetime.now().strftime('%Y-%m-%d')}",
            f"**Total issues analizados:** {len(analyzed)}",
            "",
            "## Priorización (Impacto vs Esfuerzo)",
            ""
        ]

        prioritized = self.prioritize(analyzed)

        for i, item in enumerate(prioritized, 1):
            issue = item.original_issue
            lines.append(f"### {i}. {issue.get('severity')}: {issue.get('path')}")
            lines.append(f"- **Descripción:** {issue.get('description')}")
            lines.append(f"- **Score:** {item.severity_score}/10")
            lines.append(f"- **Área de impacto:** {item.impact_area}")
            lines.append(f"- **Esfuerzo:** {item.effort_to_fix}")
            lines.append(f"- **Auto-fixable:** {'[OK]' if item.auto_fixable else '[FAIL]'}")
            lines.append("")

        # Summary stats
        auto_fixable_count = sum(1 for i in analyzed if i.auto_fixable)
        lines.extend([
            "## Resumen",
            f"- **Auto-fixables:** {auto_fixable_count}/{len(analyzed)}",
            f"- **Requieren intervención:** {len(analyzed) - auto_fixable_count}/{len(analyzed)}"
        ])

        return "\n".join(lines)


def main():
    # Demo
    analyzer = Analyzer()
    demo_issues = [
        {"severity": "HIGH", "category": "structure", "path": "01_Personal_Os/00_Core/02_Tools/02_Skills/",
         "description": "Carpeta duplicada"},
        {"severity": "MEDIUM", "category": "docs", "path": "README.md",
         "description": "Versión desactualizada"}
    ]

    analyzed = analyzer.analyze(demo_issues)
    print(analyzer.generate_report(analyzed))
    return 0


if __name__ == "__main__":
    exit(main())
