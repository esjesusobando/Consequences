"""
Voice Profile Engine
PersonalOS v4.8 — SOTA Feature
Standalone module — no relative imports.
"""
import sys
import json
import re
from pathlib import Path
from datetime import datetime
from collections import Counter

SOTA_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(SOTA_ROOT))

try:
    from config import is_feature_enabled
except ImportError:
    def is_feature_enabled(name): return False


class VoiceProfileEngine:
    """Extracts and maintains user writing style fingerprint."""

    def __init__(self, feature_name: str = '02_voice_profile'):
        self.feature_name = feature_name
        self.enabled = is_feature_enabled(feature_name)
        self.profile_file = Path(__file__).parent / "me" / "VOICE_PROFILE.md"
        self.profile_file.parent.mkdir(exist_ok=True)
        self.samples_dir = Path(__file__).parent / "samples"
        self.samples_dir.mkdir(exist_ok=True)

    def analyze_text(self, text: str) -> dict:
        if not text or len(text) < 50:
            return None
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        words = text.split()
        word_lengths = [len(w) for w in words]
        punctuation = Counter()
        for char in text:
            if char in '.,;:!?)"\'-':
                punctuation[char] += 1
        hedging = ['maybe', 'perhaps', 'might', 'could', 'probably', 'possibly', 'likely', 'seems', 'appears', 'rather', 'somewhat', 'fairly']
        hedging_count = sum(1 for w in words if w.lower() in hedging)
        question_count = text.count('?')
        exclamation_count = text.count('!')
        first_person = sum(1 for w in words if w.lower() in ['i', 'me', 'my', 'mine', 'myself', 'we', 'us', 'our'])
        return {
            'sample_length': len(text),
            'sentence_count': len(sentences),
            'avg_sentence_length': len(words) / max(len(sentences), 1),
            'avg_word_length': sum(word_lengths) / max(len(word_lengths), 1),
            'punctuation': dict(punctuation),
            'hedging_ratio': hedging_count / max(len(words), 1),
            'question_ratio': question_count / max(len(sentences), 1),
            'exclamation_ratio': exclamation_count / max(len(sentences), 1),
            'first_person_ratio': first_person / max(len(words), 1)
        }

    def merge_samples(self, samples: list) -> dict:
        if not samples:
            return {}
        merged = {
            'avg_sentence_length': sum(s['avg_sentence_length'] for s in samples) / len(samples),
            'avg_word_length': sum(s['avg_word_length'] for s in samples) / len(samples),
            'hedging_ratio': sum(s['hedging_ratio'] for s in samples) / len(samples),
            'question_ratio': sum(s['question_ratio'] for s in samples) / len(samples),
            'exclamation_ratio': sum(s['exclamation_ratio'] for s in samples) / len(samples),
            'first_person_ratio': sum(s['first_person_ratio'] for s in samples) / len(samples),
            'samples_analyzed': len(samples)
        }
        all_punct = Counter()
        for s in samples:
            for k, v in s.get('punctuation', {}).items():
                all_punct[k] += v
        merged['top_punctuation'] = dict(all_punct.most_common(5))
        return merged

    def generate_profile_md(self, profile: dict) -> str:
        return f"""# Voice Profile
Generated: {datetime.now().isoformat()}

## Writing Style Fingerprint

### Sentence Structure
- Average sentence length: {profile.get('avg_sentence_length', 0):.1f} words
- Average word length: {profile.get('avg_word_length', 0):.1f} characters

### Tone & Hedges
- Hedging ratio: {profile.get('hedging_ratio', 0):.2%}
- Question frequency: {profile.get('question_ratio', 0):.2%}
- Exclamation frequency: {profile.get('exclamation_ratio', 0):.2%}

### Personal Voice
- First-person usage: {profile.get('first_person_ratio', 0):.2%}

### Punctuation Habits
{json.dumps(profile.get('top_punctuation', {}), indent=2)}

## Usage
When drafting content for the user, apply these patterns to match their voice.
Generated from {profile.get('samples_analyzed', 0)} samples.
"""

    def add_sample(self, text: str, label: str = "manual") -> dict:
        sample_file = self.samples_dir / f"sample_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{label}.txt"
        with open(sample_file, 'w', encoding='utf-8') as f:
            f.write(text)
        return {'status': 'success', 'sample_file': str(sample_file)}

    def build_profile(self) -> dict:
        samples = []
        for sample_file in self.samples_dir.glob("*.txt"):
            try:
                with open(sample_file, 'r', encoding='utf-8') as f:
                    text = f.read()
                analysis = self.analyze_text(text)
                if analysis:
                    samples.append(analysis)
            except:
                pass
        if not samples:
            return {'status': 'no_samples'}
        profile = self.merge_samples(samples)
        profile_md = self.generate_profile_md(profile)
        with open(self.profile_file, 'w', encoding='utf-8') as f:
            f.write(profile_md)
        return {'status': 'success', 'profile_file': str(self.profile_file), 'samples_analyzed': len(samples), 'profile': profile}

    def execute(self, **kwargs):
        if not self.enabled:
            return {'status': 'disabled', 'feature': self.feature_name}
        return self.run(**kwargs)

    def run(self, **kwargs) -> dict:
        action = kwargs.get('action', 'status')
        if action == 'add_sample':
            return self.add_sample(text=kwargs.get('text', ''), label=kwargs.get('label', 'manual'))
        elif action == 'build':
            return self.build_profile()
        elif action == 'status':
            samples = list(self.samples_dir.glob("*.txt"))
            profile_exists = self.profile_file.exists()
            return {'samples_count': len(samples), 'profile_exists': profile_exists}
        else:
            return {'status': 'error', 'error': f'Unknown action: {action}'}


if __name__ == '__main__':
    engine = VoiceProfileEngine()
    print(json.dumps(engine.execute(), indent=2, default=str))