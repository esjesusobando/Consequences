#!/usr/bin/env python3
import os
import re

# Configuración de reemplazos (solo para el implementador)
replacements = {
    r"03_React_Test_Implementer": "03_React_Test_Implementer"
}

# Directorios a omitir
exclude_dirs = {".git", ".gemini", "node_modules", "05_Archive", "06_Playground"}

def refactor_repo(root_path):
    count = 0
    file_count = 0
    for root, dirs, files in os.walk(root_path):
        # Excluir directorios
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if file.endswith(('.md', '.py', '.js', '.ts', '.json', '.txt', '.rule')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    for pattern, replacement in replacements.items():
                        new_content = re.sub(pattern, replacement, new_content)
                    
                    if new_content != content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        file_count += 1
                        count += len(re.findall(replacements[list(replacements.keys())[0]], new_content))
                        print(f"Refactorizado: {file_path}")
                except Exception as e:
                    print(f"Error procesando {file_path}: {e}")
    
    print(f"\nRefactorización completa.")
    print(f"Archivos modificados: {file_count}")
    print(f"Reemplazos totales: {count}")

if __name__ == "__main__":
    import sys
    repo_root = sys.argv[1] if len(sys.argv) > 1 else "."
    refactor_repo(repo_root)
