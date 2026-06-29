import logging
import typing

logging.basicConfig(level=logging.INFO)
#!/usr/bin/env python3
import os
import re
from pathlib import Path

# Configuración
PROJECT_ROOT = Path("C:/Users/sebas/Desktop/Think_Different").resolve()
LEGACY_ROOT_SUBSTR = "C:/Users/sebas/Desktop/Think_Different"

REPLACEMENTS = [
    # Forward slashes
    (LEGACY_ROOT_SUBSTR.replace("\\", "/"), str(PROJECT_ROOT).replace("\\", "/")),
    # Backslashes (escaped for regex/json)
    (LEGACY_ROOT_SUBSTR.replace("/", "\\\\"), str(PROJECT_ROOT).replace("/", "\\\\")),
    # Normal backslashes
    (LEGACY_ROOT_SUBSTR.replace("/", "\\"), str(PROJECT_ROOT).replace("/", "\\")),
]

EXTENSIONS = {'.json', '.jsonc', '.py', '.sh', '.md', '.mdc', '.env', '.local', '.js', '.ts'}
EXCLUDE_DIRS = {'.git', 'node_modules', '__pycache__', '.aim'}

def migrate_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return False

    original_content = content
    for old, new in REPLACEMENTS:
        # Use lambda for replacement to avoid escape sequence issues in 'new' string
        content = re.sub(re.escape(old), lambda m: new, content, flags=re.IGNORECASE)

    if content != original_content:
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Migrated: {file_path}")
            return True
        except Exception as e:
            print(f"Error writing {file_path}: {e}")
    return False

def main():
    print(f"Starting mass migration to {PROJECT_ROOT}...")
    count = 0
    # Search in project root
    for root, dirs, files in os.walk(PROJECT_ROOT):
        # Filter directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            if any(file.endswith(ext) for ext in EXTENSIONS):
                file_path = os.path.join(root, file)
                if migrate_file(file_path):
                    count += 1
    
    # Also check the global opencode config
    global_opencode = Path("c:/Users/sebas/.config/opencode/opencode.json")
    if global_opencode.exists():
        if migrate_file(global_opencode):
            count += 1
            
    print(f"Finished. Total files modified: {count}")

if __name__ == "__main__":
    main()
