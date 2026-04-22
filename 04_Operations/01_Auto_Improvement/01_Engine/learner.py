"""
🧠 LEARNER - Módulo de Aprendizaje Recursivo
=============================================
Aprende de cada ciclo de mejora:
- Registra patrones exitosos
- Actualiza reglas de detección
- Evoluciona el sistema
- Sugiere mejoras arquitectónicas
"""

import json
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List


class Learner:
    """Motor de aprendizaje recursivo"""

    def __init__(self, auto_improve_dir: Path):
        self.auto_improve_dir = auto_improve_dir
        self.knowledge_dir = auto_improve_dir / "05_Knowledge"
        self.rules_dir = auto_improve_dir / "02_Rules"
        self.metrics_dir = auto_improve_dir / "03_Metrics"

        # Ensure directories exist
        self.knowledge_dir.mkdir(parents=True, exist_ok=True)
        self.rules_dir.mkdir(parents=True, exist_ok=True)
        self.metrics_dir.mkdir(parents=True, exist_ok=True)

        # Load existing knowledge
        self.knowledge = self._load_knowledge()
        self.rules = self._load_rules()

    def _load_knowledge(self) -> Dict[str, Any]:
        """Cargar base de conocimiento"""
        kb_file = self.knowledge_dir / "knowledge_base.json"

        if kb_file.exists():
            with open(kb_file, "r") as f:
                return json.load(f)

        # Default structure
        return {
            "version": "1.0.0",
            "patterns": [],
            "evolution_log": [],
            "performance_baseline": {},
            "learned_improvements": [],
        }

    def _load_rules(self) -> Dict[str, Any]:
        """Cargar reglas"""
        rules_file = self.rules_dir / "auto_fix_rules.json"

        if rules_file.exists():
            with open(rules_file, "r") as f:
                return json.load(f)

        # Default rules
        return {
            "version": "1.0.0",
            "rules": [],
            "last_updated": datetime.now().isoformat(),
        }

    def learn_from_cycle(self, cycle_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Aprender de un ciclo de mejora"""
        learnings = []

        issues = cycle_data.get("issues", [])
        analyzed = cycle_data.get("analyzed", [])
        fixed = cycle_data.get("fixed", [])

        # Analyze what worked
        for fix in fixed:
            if fix.get("success"):
                # Extract pattern from successful fix
                pattern = self._extract_pattern(fix)
                if pattern:
                    learnings.append(pattern)

                    # Add to knowledge base
                    self._add_pattern(pattern)

        # Check for new patterns
        self._detect_new_patterns(issues, learnings)

        # Update rules if needed
        self._update_rules(learnings)

        # Log evolution
        self._log_evolution(cycle_data, learnings)

        # Save knowledge
        self._save_knowledge()

        return learnings

    def _extract_pattern(self, fix: Dict) -> Optional[Dict]:
        """Extraer patrón de un fix exitoso"""
        analysis = fix.get("analysis", {})

        pattern = {
            "id": f"P{len(self.knowledge['patterns']) + 1:03d}",
            "type": analysis.get("type"),
            "root_cause": analysis.get("root_cause"),
            "solution": analysis.get("suggested_solution")
            or analysis.get("fix_action"),
            "auto_fixable": analysis.get("auto_fixable", False),
            "occurrences": 1,
            "first_seen": datetime.now().isoformat(),
            "last_seen": datetime.now().isoformat(),
            "success_rate": 1.0,
        }

        return pattern

    def _add_pattern(self, pattern: Dict):
        """Agregar patrón a la base de conocimiento"""
        # Check if pattern already exists
        existing = None
        for p in self.knowledge["patterns"]:
            if p.get("type") == pattern.get("type") and p.get(
                "root_cause"
            ) == pattern.get("root_cause"):
                existing = p
                break

        if existing:
            # Update existing pattern
            existing["occurrences"] += 1
            existing["last_seen"] = datetime.now().isoformat()
            existing["success_rate"] = (existing.get("success_rate", 1.0) + 1.0) / 2
        else:
            # Add new pattern
            self.knowledge["patterns"].append(pattern)

    def _detect_new_patterns(self, issues: List, learnings: List) -> List[Dict]:
        """Detectar nuevos patrones"""
        new_patterns = []

        # Group issues by type
        issue_types = {}
        for issue in issues:
            issue_type = issue.get("type", "unknown")
            if issue_type not in issue_types:
                issue_types[issue_type] = []
            issue_types[issue_type].append(issue)

        # Check for repeated patterns (3+ occurrences)
        for issue_type, type_issues in issue_types.items():
            if len(type_issues) >= 3:
                # This is a pattern - check if we already have a rule
                has_rule = any(
                    r.get("name") == issue_type for r in self.rules.get("rules", [])
                )

                if not has_rule:
                    new_pattern = {
                        "pattern": issue_type,
                        "occurrences": len(type_issues),
                        "suggestion": f"Crear regla automática para {issue_type}",
                        "auto_fixable": all(
                            i.get("auto_fixable", False) for i in type_issues
                        ),
                    }
                    new_patterns.append(new_pattern)

        return new_patterns

    def _update_rules(self, learnings: List):
        """Actualizar reglas basadas en aprendizajes"""
        for learning in learnings:
            # Check if rule already exists
            rule_exists = any(
                r.get("name") == learning.get("type")
                for r in self.rules.get("rules", [])
            )

            if not rule_exists and learning.get("auto_fixable"):
                # Add new rule
                new_rule = {
                    "id": f"R{len(self.rules.get('rules', [])) + 1:03d}",
                    "name": learning.get("type"),
                    "pattern": learning.get("root_cause"),
                    "action": learning.get("solution"),
                    "tier": 1 if learning.get("auto_fixable") else 2,
                    "auto_fix": learning.get("auto_fixable", False),
                    "created": datetime.now().isoformat(),
                }
                self.rules["rules"].append(new_rule)

        # Save rules
        self._save_rules()

    def _log_evolution(self, cycle_data: Dict, learnings: List):
        """Registrar evolución del sistema"""
        evolution = {
            "timestamp": datetime.now().isoformat(),
            "issues_processed": len(cycle_data.get("issues", [])),
            "fixes_applied": len(cycle_data.get("fixed", [])),
            "patterns_learned": len(learnings),
            "new_patterns": self._detect_new_patterns(
                cycle_data.get("issues", []), learnings
            ),
        }

        self.knowledge["evolution_log"].append(evolution)

    def _save_knowledge(self):
        """Guardar base de conocimiento"""
        kb_file = self.knowledge_dir / "knowledge_base.json"

        with open(kb_file, "w") as f:
            json.dump(self.knowledge, f, indent=2)

        print(f"   💾 Base de conocimiento actualizada")

    def _save_rules(self):
        """Guardar reglas"""
        rules_file = self.rules_dir / "auto_fix_rules.json"
        self.rules["last_updated"] = datetime.now().isoformat()

        with open(rules_file, "w") as f:
            json.dump(self.rules, f, indent=2)

        print(f"   📝 Reglas actualizadas")

    def evolve_rules(self, learnings: List[Dict]) -> List[Dict]:
        """Sugerir evolución de reglas basada en aprendizajes"""
        suggestions = []

        # Analyze learnings
        for learning in learnings:
            if learning.get("success_rate", 0) > 0.8:
                suggestions.append(
                    {
                        "type": "promote",
                        "pattern": learning.get("type"),
                        "suggestion": f"Promover {learning.get('type')} a auto-fix",
                    }
                )
            elif learning.get("success_rate", 0) < 0.5:
                suggestions.append(
                    {
                        "type": "demote",
                        "pattern": learning.get("type"),
                        "suggestion": f"Revisar {learning.get('type')} - tasa de éxito baja",
                    }
                )

        # Check for rules that could be created
        patterns_without_rules = [
            p
            for p in self.knowledge.get("patterns", [])
            if p.get("occurrences", 0) >= 3
            and not any(
                r.get("name") == p.get("type") for r in self.rules.get("rules", [])
            )
        ]

        for pattern in patterns_without_rules:
            suggestions.append(
                {
                    "type": "create_rule",
                    "pattern": pattern.get("type"),
                    "suggestion": f"Crear regla para {pattern.get('type')} ({pattern.get('occurrences')} ocurrencias)",
                }
            )

        return suggestions

    def load_and_analyze_history(self) -> List[Dict]:
        """Cargar y analizar historial de ciclos"""
        metrics_file = self.metrics_dir / "improvement_log.json"

        if not metrics_file.exists():
            return []

        with open(metrics_file, "r") as f:
            data = json.load(f)

        cycles = data.get("cycles", [])

        # Analyze patterns across cycles
        all_learnings = []
        for cycle in cycles:
            all_learnings.extend(cycle.get("learnings", []))

        return all_learnings

    def get_knowledge_summary(self) -> Dict:
        """Obtener resumen de la base de conocimiento"""
        return {
            "patterns_count": len(self.knowledge.get("patterns", [])),
            "evolution_events": len(self.knowledge.get("evolution_log", [])),
            "rules_count": len(self.rules.get("rules", [])),
            "top_patterns": sorted(
                self.knowledge.get("patterns", []),
                key=lambda x: x.get("occurrences", 0),
                reverse=True,
            )[:5],
        }
