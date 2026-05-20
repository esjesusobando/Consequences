"""
Ambient Intelligence Engine
PersonalOS v4.1 — SOTA Feature
Standalone module — no relative imports.
"""
import sys
import json
from pathlib import Path
from datetime import datetime, timedelta

SOTA_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(SOTA_ROOT))

try:
    from config import is_feature_enabled
except ImportError:
    def is_feature_enabled(name): return False


class AmbientIntelligenceEngine:
    """Continuous context capture via Screenpipe."""

    def __init__(self, feature_name: str = '05_ambient_intelligence'):
        self.feature_name = feature_name
        self.enabled = is_feature_enabled(feature_name)
        self.activity_log = Path(__file__).parent / "activity_log.json"
        self.context_cache = Path(__file__).parent / "context_cache.json"
        self._ensure_logs()

    def _ensure_logs(self):
        if not self.activity_log.exists():
            with open(self.activity_log, 'w') as f:
                json.dump({'activities': []}, f)
        if not self.context_cache.exists():
            with open(self.context_cache, 'w') as f:
                json.dump({'contexts': {}}, f)

    def _load_activity_log(self) -> dict:
        with open(self.activity_log, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _save_activity_log(self, log: dict):
        with open(self.activity_log, 'w', encoding='utf-8') as f:
            json.dump(log, f, indent=2, default=str)

    def _load_context_cache(self) -> dict:
        with open(self.context_cache, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _save_context_cache(self, cache: dict):
        with open(self.context_cache, 'w', encoding='utf-8') as f:
            json.dump(cache, f, indent=2, default=str)

    def capture_activity(self, activity_type: str, content: str, metadata: dict = None) -> dict:
        if not self.enabled:
            return {'status': 'disabled'}
        timestamp = datetime.now().isoformat()
        activity_id = f"act_{timestamp.replace(':', '-').replace('.', '-')}"
        activity = {
            'id': activity_id,
            'type': activity_type,
            'content': content,
            'metadata': metadata or {},
            'timestamp': timestamp,
            'processed': False
        }
        log = self._load_activity_log()
        log['activities'].append(activity)
        log['activities'] = log['activities'][-1000:]
        self._save_activity_log(log)
        return {'status': 'success', 'activity_id': activity_id}

    def get_recent_context(self, hours: int = 2) -> list:
        log = self._load_activity_log()
        cutoff = datetime.now() - timedelta(hours=hours)
        recent = []
        for act in reversed(log.get('activities', [])):
            act_time = datetime.fromisoformat(act['timestamp'])
            if act_time > cutoff:
                recent.append(act)
            else:
                break
        return recent

    def build_context_summary(self, hours: int = 2) -> str:
        activities = self.get_recent_context(hours)
        if not activities:
            return "No recent activities recorded."
        summary_parts = []
        for act in activities[-5:]:
            act_time = datetime.fromisoformat(act['timestamp']).strftime('%H:%M')
            summary_parts.append(f"At {act_time}: {act['type']} - {act['content'][:100]}")
        return "Recent work context:\n" + "\n".join(summary_parts)

    def process_and_cache(self) -> dict:
        log = self._load_activity_log()
        cache = self._load_context_cache()
        hourly_groups = {}
        for act in log.get('activities', [])[-100:]:
            hour_key = act['timestamp'][:13]
            if hour_key not in hourly_groups:
                hourly_groups[hour_key] = []
            hourly_groups[hour_key].append(act['type'])
        for hour, types in hourly_groups.items():
            cache['contexts'][hour] = {'types': list(set(types)), 'count': len(types)}
        cutoff = (datetime.now() - timedelta(hours=48)).isoformat()[:13]
        cache['contexts'] = {k: v for k, v in cache['contexts'].items() if k >= cutoff}
        self._save_context_cache(cache)
        return {'status': 'success', 'hours_processed': len(hourly_groups)}

    def execute(self, **kwargs):
        if not self.enabled:
            return {'status': 'disabled', 'feature': self.feature_name}
        return self.run(**kwargs)

    def run(self, **kwargs) -> dict:
        action = kwargs.get('action', 'status')
        if action == 'capture':
            return self.capture_activity(
                activity_type=kwargs.get('activity_type', 'screen'),
                content=kwargs.get('content', ''),
                metadata=kwargs.get('metadata', {})
            )
        elif action == 'context':
            return {'summary': self.build_context_summary(kwargs.get('hours', 2)),
                    'recent': self.get_recent_context(kwargs.get('hours', 2))}
        elif action == 'process':
            return self.process_and_cache()
        elif action == 'status':
            log = self._load_activity_log()
            return {'total_activities': len(log.get('activities', []))}
        else:
            return {'status': 'error', 'error': f'Unknown action: {action}'}


if __name__ == '__main__':
    engine = AmbientIntelligenceEngine()
    result = engine.execute(action='capture', activity_type='screen',
                          content='Working on SOTA module', metadata={'window': 'Claude Code'})
    print(json.dumps(result, indent=2, default=str))