#!/usr/bin/env python3
"""Fix '08_Scripts_Os' -> '04_Operations/03_Scripts_Os' in active Python files."""
import os
import re

ROOT = r'C:\Users\sebas\Desktop\Think_Different'

EXCLUDE_DIRS = {
    '.backup', '10_Legacy', '.git', '__pycache__', 
    'node_modules', '.venv', 'venv', 'env',
    '02_Playground', '05_Archive'
}

def should_include(path):
    """Check if path should be modified (not in excluded dirs)."""
    parts = path.replace('\\', '/').split('/')
    for ex in EXCLUDE_DIRS:
        if ex in parts:
            return False
    return True

def is_python_script(path):
    """Check if file is a .py file."""
    return path.endswith('.py')

def fix_file(filepath):
    """Fix 08_Scripts_Os references in a file."""
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    original = content
    
    # Pattern: replace legacy 08_Scripts_Os with the current canonical path
    # Uses regex with word boundaries to avoid corrupting variable names or docs
    content = re.sub(
        r'\b08_Scripts_Os\b',
        '04_Operations/03_Scripts_Os',
        content
    )
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Walk and fix
count_fixed = 0
count_skipped = 0
count_nochange = 0

for dirpath, dirnames, filenames in os.walk(ROOT):
    # Skip excluded dirs
    dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
    
    rel = os.path.relpath(dirpath, ROOT)
    if not should_include(dirpath):
        continue
    
    for fn in filenames:
        if not is_python_script(fn):
            continue
        fp = os.path.join(dirpath, fn)
        try:
            if fix_file(fp):
                short = os.path.relpath(fp, ROOT)
                print(f'  FIXED: {short}')
                count_fixed += 1
            else:
                count_nochange += 1
        except Exception as e:
            print(f'  ERROR: {fp}: {e}')
            count_skipped += 1

print(f'\nSummary: {count_fixed} files fixed, {count_nochange} unchanged, {count_skipped} errors')
