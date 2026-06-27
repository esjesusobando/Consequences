"""
Feedback Loop Engine
PersonalOS v4.9 — SOTA Feature
Standalone module — no relative imports.
"""
import sys
import json
from pathlib import Path
from datetime import datetime

SOTA_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(SOTA_ROOT))

try:
    from config import is_feature_enabled
except ImportError:
    def is_feature_enabled(name): return False


class FeedbackLoopEngine:
    """User corrections become persistent behavioral rules."""

    def __init__(self, feature_name: str = '04_feedback_loop'):
        self.feature_name = feature_name
        self.enabled = is_feature_enabled(feature_name)
        self.rules_dir = Path(__file__).parent / "feedback_rules"
        self.rules_dir.mkdir(exist_ok=True)
        self.rules_index = self.rules_dir / "rules_index.json"
        self._ensure_index()

    def _ensure_index(self):
        if not self.rules_index.exists():
            with open(self.rules_index, 'w') as f:
                json.dump({'rules': [], 'corrections_count': 0}, f)

    def _load_index(self) -> dict:
        with open(self.rules_index, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _save_index(self, index: dict):
        with open(self.rules_index, 'w', encoding='utf-8') as f:
            json.dump(index, f, indent=2, default=str)

    def add_feedback(self, correction: str, rule: str, rationale: str = "",
                     scope: str = "global", tags: list = None) -> dict:
        if not self.enabled:
            return {'status': 'disabled'}
        timestamp = datetime.now().isoformat()
        rule_id = f"rule_{timestamp.replace(':', '-').replace('.', '-')}"
        rule_entry = {
            'id': rule_id,
            'correction': correction,
            'rule': rule,
            'rationale': rationale,
            'scope': scope,
            'tags': tags or [],
            'created': timestamp,
            'times_applied': 0,
            'last_applied': None,
            'confidence': 'high' if rationale else 'medium'
        }
        rule_file = self.rules_dir / f"{rule_id}.json"
        with open(rule_file, 'w', encoding='utf-8') as f:
            json.dump(rule_entry, f, indent=2, ensure_ascii=False)
        index = self._load_index()
        index['rules'].append({'id': rule_id, 'scope': scope, 'tags': tags or [], 'created': timestamp})
        index['corrections_count'] += 1
        self._save_index(index)
        return {'status': 'success', 'rule_id': rule_id}

    def get_applicable_rules(self, scope: str = "global", tags: list = None) -> list:
        index = self._load_index()
        applicable = []
        for rule_ref in index.get('rules', []):
            if rule_ref['scope'] not in [scope, 'global']:
                continue
            if tags:
                if not any(t in rule_ref.get('tags', []) for t in tags):
                    continue
            rule_file = self.rules_dir / f"{rule_ref['id']}.json"
            if rule_file.exists():
                with open(rule_file, 'r', encoding='utf-8') as f:
                    applicable.append(json.load(f))
        return applicable

    def increment_applied(self, rule_id: str):
        rule_file = self.rules_dir / f"{rule_id}.json"
        if rule_file.exists():
            with open(rule_file, 'r', encoding='utf-8') as f:
                rule = json.load(f)
            rule['times_applied'] += 1
            rule['last_applied'] = datetime.now().isoformat()
            with open(rule_file, 'w', encoding='utf-8') as f:
                json.dump(rule, f, indent=2)

    def execute(self, **kwargs):
        if not self.enabled:
            return {'status': 'disabled', 'feature': self.feature_name}
        return self.run(**kwargs)

    def run(self, **kwargs) -> dict:
        action = kwargs.get('action', 'list')
        if action == 'add':
            return self.add_feedback(
                correction=kwargs.get('correction', ''),
                rule=kwargs.get('rule', ''),
                rationale=kwargs.get('rationale', ''),
                scope=kwargs.get('scope', 'global'),
                tags=kwargs.get('tags', [])
            )
        elif action == 'get':
            return self.get_applicable_rules(scope=kwargs.get('scope', 'global'), tags=kwargs.get('tags', []))
        elif action == 'list':
            index = self._load_index()
            return {'rules_count': len(index.get('rules', []))}
        else:
            return {'status': 'error', 'error': f'Unknown action: {action}'}


if __name__ == '__main__':
    engine = FeedbackLoopEngine()
    result = engine.execute(action='add',
                          correction="Don't use markdown headers mid-sentence",
                          rule="Use inline code for technical terms",
                          rationale="Headers break reading flow",
                          scope="writing")
    print(json.dumps(result, indent=2, default=str))