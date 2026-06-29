"""
⚙️ RULES ENGINE - Base de Reglas de Automejora
================================================
Define qué checks ejecutar y cómo reaccionar.
"""

import json
from pathlib import Path
from typing import Dict, Any, List


class RulesEngine:
    """Motor de reglas para automejora"""

    def __init__(self, rules_dir: Path):
        self.rules_file = rules_dir / "auto_fix_rules.json"
        self.rules = self._load_rules()

    def _load_rules(self) -> Dict[str, Any]:
        """Cargar reglas"""
        if self.rules_file.exists():
            with open(self.rules_file, "r") as f:
                return json.load(f)
        return {"rules": [], "last_updated": ""}

    def get_rules_for_check(self, check_type: str) -> List[Dict]:
        """Obtener reglas para un tipo de check"""
        return [r for r in self.rules.get("rules", []) if r.get("name") == check_type]

    def evaluate_issue(self, issue: Dict) -> Dict:
        """Evaluar si un issue tiene una regla activa"""
        rule = next(
            (
                r
                for r in self.rules.get("rules", [])
                if r.get("name") == issue.get("type")
            ),
            None,
        )
        return rule or {}

    def add_rule(self, rule: Dict):
        """Añadir nueva regla (aprendida)"""
        self.rules["rules"].append(rule)
        self._save_rules()

    def _save_rules(self):
        """Guardar reglas"""
        with open(self.rules_file, "w") as f:
            json.dump(self.rules, f, indent=2)
