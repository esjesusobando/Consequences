"""
Memory Versioning Engine
PersonalOS v4.1 — SOTA Feature
Wraps Engram saves with immutable versioning + audit trail.
Inspired by Claude Memory Stores (memver_...) + MemMachine versioning.

Standalone module — does not require base_engine.
"""
import sys
from pathlib import Path
from datetime import datetime
from typing import Optional
import json
import hashlib

# Add SOTA root to path for config access
SOTA_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(SOTA_ROOT))

try:
    from config import is_feature_enabled, get_feature_config
except ImportError:
    # Fallback: define minimal versions
    def is_feature_enabled(name):
        return False
    def get_feature_config(name):
        return {}


class MemoryVersioningEngine:
    """Creates immutable versions of memory saves with rollback capability."""

    def __init__(self, feature_name: str = '03_memory_versioning'):
        self.feature_name = feature_name
        self.enabled = is_feature_enabled(feature_name)

        # Paths
        self.versions_dir = Path(__file__).parent / "versions"
        self.versions_dir.mkdir(exist_ok=True)
        self.manifest_file = self.versions_dir / "manifest.json"
        self._ensure_manifest()

    def _ensure_manifest(self):
        if not self.manifest_file.exists():
            with open(self.manifest_file, 'w') as f:
                json.dump({'versions': [], 'latest': None}, f)

    def _load_manifest(self) -> dict:
        with open(self.manifest_file, 'r') as f:
            return json.load(f)

    def _save_manifest(self, manifest: dict):
        with open(self.manifest_file, 'w') as f:
            json.dump(manifest, f, indent=2)

    def _compute_hash(self, content: str) -> str:
        return hashlib.sha256(content.encode('utf-8')).hexdigest()[:16]

    def version_save(self, topic_key: str, content: str, project: str = "Think_Different") -> dict:
        """Save with versioning. Creates immutable version with audit trail."""
        if not self.enabled:
            return {'status': 'disabled'}

        timestamp = datetime.now().isoformat()
        version_id = f"ver_{timestamp.replace(':', '-').replace('.', '-')}"
        content_hash = self._compute_hash(content)

        version_entry = {
            'id': version_id,
            'topic_key': topic_key,
            'project': project,
            'timestamp': timestamp,
            'content_hash': content_hash,
            'content_length': len(content),
            'status': 'saved'
        }

        # Save versioned content
        version_file = self.versions_dir / f"{version_id}.json"
        with open(version_file, 'w', encoding='utf-8') as f:
            json.dump({
                'metadata': version_entry,
                'content': content
            }, f, indent=2, ensure_ascii=False)

        # Update manifest
        manifest = self._load_manifest()
        manifest['versions'].append(version_entry)
        manifest['latest'] = version_id
        self._save_manifest(manifest)

        return {
            'status': 'success',
            'version_id': version_id,
            'content_hash': content_hash
        }

    def version_get(self, version_id: str) -> Optional[dict]:
        """Retrieve a specific version by ID."""
        version_file = self.versions_dir / f"{version_id}.json"
        if not version_file.exists():
            return None
        with open(version_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def version_list(self, topic_key: Optional[str] = None, limit: int = 50) -> list:
        """List versions, optionally filtered by topic_key."""
        manifest = self._load_manifest()
        versions = manifest.get('versions', [])
        if topic_key:
            versions = [v for v in versions if v.get('topic_key') == topic_key]
        return sorted(versions, key=lambda x: x['timestamp'], reverse=True)[:limit]

    def version_rollback(self, version_id: str) -> dict:
        """Rollback to a previous version. Returns content."""
        version_data = self.version_get(version_id)
        if not version_data:
            return {'status': 'error', 'error': 'Version not found'}
        return {
            'status': 'success',
            'content': version_data.get('content'),
            'version_id': version_id,
            'timestamp': version_data['metadata']['timestamp']
        }

    def execute(self, **kwargs):
        """Main execute wrapper."""
        if not self.enabled:
            return {'status': 'disabled', 'feature': self.feature_name}
        return self.run(**kwargs)

    def run(self, **kwargs):
        """Execute version operation. Supports: save, list, get, rollback."""
        action = kwargs.get('action', 'list')
        if action == 'save':
            return self.version_save(
                topic_key=kwargs.get('topic_key', 'unknown'),
                content=kwargs.get('content', ''),
                project=kwargs.get('project', 'Think_Different')
            )
        elif action == 'get':
            return self.version_get(kwargs.get('version_id'))
        elif action == 'list':
            return self.version_list(
                topic_key=kwargs.get('topic_key'),
                limit=kwargs.get('limit', 50)
            )
        elif action == 'rollback':
            return self.version_rollback(kwargs.get('version_id'))
        else:
            return {'status': 'error', 'error': f'Unknown action: {action}'}


# CLI interface
if __name__ == '__main__':
    engine = MemoryVersioningEngine()
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == 'list':
            for v in engine.run(action='list') or []:
                print(f"{v['id']} | {v['topic_key']} | {v['timestamp']}")
        elif cmd == 'status':
            manifest = engine._load_manifest()
            print(f"Total versions: {len(manifest['versions'])}")
            print(f"Latest: {manifest['latest']}")
    else:
        manifest = engine._load_manifest()
        print(f"Memory Versioning: {len(manifest['versions'])} versions stored")
        print(f"Enabled: {engine.enabled}")