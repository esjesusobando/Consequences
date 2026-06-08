#!/usr/bin/env python3
"""Fix 08_Scripts_Os -> 04_Operations/03_Scripts_Os in non-Python active files."""
import os

ROOT = r'C:\Users\sebas\Desktop\Think_Different'

EXCLUDE_PATTERNS = [
    '.Backup\\', '05_Backups\\', '.backup\\',
    '.git\\', '__pycache__', 'node_modules',
    '02_Playground\\', '05_Archive\\',
    '.next\\',  # build cache
]

# Files to definitely update (active configs, docs, etc.)
# Plus all .bak files in Backups should NOT be touched

def should_fix(path):
    """Check if this file should be modified."""
    for ex in EXCLUDE_PATTERNS:
        if ex in path:
            return False
    return True

count = 0
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in {'.backup', '10_Legacy', '.git', '__pycache__', 'node_modules', '.venv', 'venv', 'env', '02_Playground', '05_Archive', '.next'}]
    
    for fn in filenames:
        if fn.endswith('.py'):
            continue
        fp = os.path.join(dirpath, fn)
        
        if not should_fix(fp):
            continue
        
        try:
            with open(fp, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
        except:
            continue
        
        if '08_Scripts_Os' not in content:
            continue
        
        original = content
        content = content.replace('08_Scripts_Os', '04_Operations/03_Scripts_Os')
        
        if content != original:
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(content)
            short = os.path.relpath(fp, ROOT)
            print(f'  {short}')
            count += 1

print(f'\nFixed {count} non-Python files')
