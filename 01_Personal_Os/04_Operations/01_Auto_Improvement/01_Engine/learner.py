#!/usr/bin/env python3
"""
Learner — Auto-Improvement Engine
Aprende de fixes aplicados para mejorar futuras detecciones
"""

import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any

class Learner:
    def __init__(self, storage_path: str = None):
        if storage_path is None:
            storage_path = Path(__file__).parent.parent / "learnings.json"
        self.storage = Path(storage_path)
        self.learnings = self._load()

    def _load(self) -> Dict:
        """Carga aprendizajes guardados"""
        if self.storage.exists():
            try:
                return json.loads(self.storage.read_text(encoding='utf-8'))
            except:
                return {"patterns": [], "fixes_history": []}
        return {"patterns": [], "fixes_history": []}

    def _save(self):
        """Guarda aprendizajes"""
        self.storage.write_text(
            json.dumps(self.learnings, indent=2, ensure_ascii=False),
            encoding='utf-8'
        )

    def record_fix(self, issue: Dict, success: bool, method: str = "auto"):
        """Registra un fix aplicado"""
        record = {
            "timestamp": datetime.now().isoformat(),
            "issue": issue,
            "success": success,
            "method": method,
            "issue_hash": self._hash_issue(issue)
        }

        self.learnings["fixes_history"].append(record)

        if success:
            self._extract_pattern(issue, method)

        self._save()

    def _hash_issue(self, issue: Dict) -> str:
        """Genera hash para identificar issue similar"""
        key_parts = [
            issue.get("severity", ""),
            issue.get("category", ""),
            issue.get("description", "")[:50]
        ]
        return "|".join(key_parts).lower()

    def _extract_pattern(self, issue: Dict, method: str):
        """Extrae patrón de un fix exitoso"""
        pattern = {
            "severity": issue.get("severity"),
            "category": issue.get("category"),
            "description_keywords": self._extract_keywords(issue.get("description", "")),
            "method": method,
            "success_rate": 1.0,
            "times_applied": 1
        }

        # Buscar si ya existe patrón similar
        existing = self._find_similar_pattern(pattern)
        if existing:
            existing["times_applied"] += 1
        else:
            self.learnings["patterns"].append(pattern)

    def _extract_keywords(self, text: str) -> List[str]:
        """Extrae keywords de texto"""
        # Simplificado - en producción usar NLP
        words = text.lower().replace(",", " ").split()
        return list(set(words))[:5]

    def _find_similar_pattern(self, pattern: Dict) -> Dict:
        """Encuentra patrón similar"""
        for existing in self.learnings["patterns"]:
            if (existing.get("severity") == pattern.get("severity") and
                existing.get("category") == pattern.get("category")):
                return existing
        return None

    def get_best_fix_method(self, issue: Dict) -> str:
        """Sugiere mejor método de fix basado en historial"""
        issue_hash = self._hash_issue(issue)

        for record in reversed(self.learnings["fixes_history"]):
            if record["issue_hash"] == issue_hash and record["success"]:
                return record["method"]

        # Buscar por severidad
        for pattern in self.learnings["patterns"]:
            if (pattern.get("severity") == issue.get("severity") and
                pattern.get("success_rate", 0) > 0.7):
                return pattern.get("method", "auto")

        return "auto"

    def suggest_next_fixes(self, issues: List[Dict]) -> List[Dict]:
        """Sugiere qué fixes aplicar basándose en aprendizajes"""
        suggestions = []

        for issue in issues:
            method = self.get_best_fix_method(issue)
            suggestions.append({
                "issue": issue,
                "suggested_method": method,
                "confidence": self._calculate_confidence(issue)
            })

        # Ordenar por confianza
        return sorted(suggestions, key=lambda x: -x["confidence"])

    def _calculate_confidence(self, issue: Dict) -> float:
        """Calcula confianza para aplicar fix"""
        issue_hash = self._hash_issue(issue)

        for record in self.learnings["fixes_history"]:
            if record["issue_hash"] == issue_hash:
                return 0.9 if record["success"] else 0.3

        return 0.5  # Default

    def learn_from_cycle(self, cycle_data: Dict) -> List[Dict]:
        """Procesa los resultados de un ciclo completo y devuelve lista de aprendizajes."""
        learnings = []

        for fix in cycle_data.get("fixed", []):
            issue = fix if isinstance(fix, dict) else {}
            self.record_fix(issue, success=True, method="auto")
            learnings.append({"type": "fix_recorded", "issue": issue})

        stats = self.get_stats()
        learnings.append({"type": "cycle_stats", "stats": stats})
        return learnings

    def load_and_analyze_history(self) -> List[Dict]:
        """Carga historial y retorna análisis de patrones."""
        return [
            {"pattern": p, "type": "pattern"} for p in self.learnings.get("patterns", [])
        ] + [
            {"record": r, "type": "fix_history"} for r in self.learnings.get("fixes_history", [])[-10:]
        ]

    def evolve_rules(self, learnings: List[Dict]) -> List[str]:
        """Genera sugerencias de evolución basadas en patrones aprendidos."""
        suggestions = []
        patterns = self.learnings.get("patterns", [])
        for pattern in patterns:
            if pattern.get("times_applied", 0) > 2:
                suggestions.append(
                    f"Patrón frecuente [{pattern.get('severity')}/{pattern.get('category')}]"
                    f" → considerar regla automática ({pattern.get('times_applied')} ocurrencias)"
                )
        return suggestions

    def get_stats(self) -> Dict:
        """Obtiene estadísticas de aprendizaje"""
        total_fixes = len(self.learnings["fixes_history"])
        successful_fixes = sum(1 for f in self.learnings["fixes_history"] if f["success"])
        patterns_count = len(self.learnings["patterns"])

        return {
            "total_fixes": total_fixes,
            "successful_fixes": successful_fixes,
            "success_rate": successful_fixes / total_fixes if total_fixes > 0 else 0,
            "patterns_learned": patterns_count
        }

    def report(self) -> str:
        """Genera reporte de aprendizaje"""
        stats = self.get_stats()

        lines = [
            "# 🧠 Reporte de Aprendizaje",
            f"**Fecha:** {datetime.now().strftime('%Y-%m-%d')}",
            "",
            "## Estadísticas",
            f"- **Total fixes registrados:** {stats['total_fixes']}",
            f"- **Fixes exitosos:** {stats['successful_fixes']}",
            f"- **Tasa de éxito:** {stats['success_rate']*100:.1f}%",
            f"- **Patrones aprendidos:** {stats['patterns_learned']}",
            ""
        ]

        if self.learnings["patterns"]:
            lines.append("## Patrones Aprendidos")
            for i, pattern in enumerate(self.learnings["patterns"][-5:], 1):
                lines.append(f"### {i}. {pattern.get('severity')} - {pattern.get('category')}")
                lines.append(f"- **Keywords:** {', '.join(pattern.get('keywords', [])[:3])}")
                lines.append(f"- **Método:** {pattern.get('method')}")
                lines.append(f"- **Éxitos:** {pattern.get('times_applied')}")
                lines.append(f"- **Tasa:** {pattern.get('success_rate', 0)*100:.1f}%")
                lines.append("")

        return "\n".join(lines)


def main():
    learner = Learner()
    print(learner.report())

    # Demo record
    learner.record_fix({
        "severity": "HIGH",
        "category": "structure",
        "description": "Directorio faltante en estructura"
    }, success=True, method="auto")

    print("\n✅ Nuevo aprendizaje registrado")
    return 0


if __name__ == "__main__":
    exit(main())
