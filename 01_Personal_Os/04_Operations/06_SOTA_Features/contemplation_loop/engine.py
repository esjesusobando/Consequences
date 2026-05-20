"""
Contemplation Loop Engine (Dreaming)
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


class ContemplationLoopEngine:
    """The 'Dreaming' system — between-session improvement loop."""

    def __init__(self, feature_name: str = '01_contemplation_loop'):
        self.feature_name = feature_name
        self.enabled = is_feature_enabled(feature_name)
        self.log_file = Path(__file__).parent / "contemplation_log.json"
        self.patterns_dir = Path(__file__).parent / "patterns"
        self.patterns_dir.mkdir(exist_ok=True)
        self._ensure_log()

    def _ensure_log(self):
        if not self.log_file.exists():
            with open(self.log_file, 'w') as f:
                json.dump({'runs': [], 'patterns': []}, f)

    def _load_log(self) -> dict:
        with open(self.log_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _save_log(self, log: dict):
        with open(self.log_file, 'w', encoding='utf-8') as f:
            json.dump(log, f, indent=2, default=str)

    def analyze_memories(self) -> dict:
        patterns_found = []
        memory_dir = SOTA_ROOT.parent.parent.parent / "00_Context_LLM" / "00_Context_Memory"
        if memory_dir.exists():
            memory_files = list(memory_dir.glob("**/*.md"))
            recent_threshold = datetime.now() - timedelta(days=7)
            recent_memories = []
            for mf in memory_files[:100]:
                try:
                    mtime = datetime.fromtimestamp(mf.stat().st_mtime)
                    if mtime > recent_threshold:
                        recent_memories.append({'file': mf.name, 'modified': mtime.isoformat()})
                except:
                    pass
            patterns_found.append({
                'type': 'memory_volume',
                'count': len(recent_memories),
                'description': f'{len(recent_memories)} memories modified in last 7 days'
            })
        return {'patterns': patterns_found, 'total_analyzed': len(patterns_found)}

    def extract_patterns(self, analysis: dict) -> list:
        patterns = analysis.get('patterns', [])
        extracted = []
        for p in patterns:
            if p.get('type') == 'memory_volume' and p.get('count', 0) > 50:
                extracted.append({
                    'pattern': 'high_memory_activity',
                    'recommendation': 'Consider memory consolidation',
                    'priority': 'medium'
                })
        return extracted

    def cleanup_stale(self) -> dict:
        cleaned = 0
        memory_dir = SOTA_ROOT.parent.parent.parent / "00_Context_LLM" / "00_Context_Memory"
        if memory_dir.exists():
            for mf in memory_dir.glob("**/*.md"):
                try:
                    age_days = (datetime.now() - datetime.fromtimestamp(mf.stat().st_mtime)).days
                    if age_days > 90 and mf.stat().st_size < 50:
                        cleaned += 1
                except:
                    pass
        return {'cleaned_entries': cleaned}

    def execute(self, **kwargs):
        if not self.enabled:
            return {'status': 'disabled', 'feature': self.feature_name}
        return self.run(**kwargs)

    def run(self, **kwargs) -> dict:
        run_timestamp = datetime.now().isoformat()
        analysis = self.analyze_memories()
        patterns = self.extract_patterns(analysis)
        cleanup = self.cleanup_stale()
        log = self._load_log()
        log['runs'].append({
            'timestamp': run_timestamp,
            'analysis': analysis,
            'patterns_extracted': patterns,
            'cleanup': cleanup
        })
        log['runs'] = log['runs'][-30:]
        self._save_log(log)
        if patterns:
            patterns_file = self.patterns_dir / f"patterns_{run_timestamp[:10]}.json"
            with open(patterns_file, 'w', encoding='utf-8') as f:
                json.dump({'timestamp': run_timestamp, 'patterns': patterns}, f, indent=2)
        return {'status': 'success', 'timestamp': run_timestamp, 'patterns_found': len(patterns), 'cleanup': cleanup}


if __name__ == '__main__':
    engine = ContemplationLoopEngine()
    print(json.dumps(engine.execute(), indent=2, default=str))