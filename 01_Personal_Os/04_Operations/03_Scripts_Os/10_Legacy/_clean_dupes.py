#!/usr/bin/env python3
"""
_clean_dupes.py — Elimina bloques de imports duplicados (sys/pathlib) 
de todos los scripts que tienen tanto el protocolo v6.1 COMO imports sueltos.

Regla: Si el script tiene el PROTOCOLO v6.1 (la línea '# === PROTOCOLO DE RUTA DINÁMICA (v6.1) ==='),
       entonces elimina todos los 'import sys' e 'from pathlib import Path' 
       que estén FUERA del bloque del protocolo.
"""

import re
import os
import sys
from pathlib import Path

# Marcas del protocolo v6.1
PROTOCOL_MARKER = "# === PROTOCOLO DE RUTA DINÁMICA (v6.1) ==="

# Scripts a procesar (los 27 detectados)
SCRIPTS_DIR = Path(__file__).parent

TARGET_SCRIPTS = [
    "01_Auditor_Hub.py",
    "02_Git_Hub.py",
    "03_AIPM_Hub.py",
    "04_Ritual_Hub.py",
    "05_Validator_Hub.py",
    "06_Tool_Hub.py",
    "01_Ritual/08_Ritual_Cierre.py",
    "01_Ritual/09_Backlog_Triage.py",
    "01_Ritual/11_Sync_Notes.py",
    "01_Ritual/12_Update_Links.py",
    "01_Ritual/13_Validate_Stack.py",
    "01_Ritual/16_Clean_System.py",
    "01_Ritual/17_Ritual_Dominical.py",
    "03_Validator/33_Parallel_Audit_Pro.py",
    "03_Validator/34_Skill_Auditor.py",
    "03_Validator/40_Validate_Rules.py",
    "05_AIPM/27_Probabilistic_Risk_Audit.py",
    "05_AIPM/29_Guardrails_Service.py",
    "10_Legacy/44_Auto_Compound_Intelligence.py",
    "10_Legacy/80_Edge_Case_Validator.py",
    "10_Legacy/81_RTM_Generator.py",
    "10_Legacy/82_Health_Monitor.py",
    "11_Anthropic_Harness/00_Safety_Wrapper.py",
    "11_Anthropic_Harness/01_Context_Manager.py",
    "11_Anthropic_Harness/02_Evaluator_Runner.py",
    "11_Anthropic_Harness/03_Sprint_Contract.py",
    "12_Audits/audit_skills_routes.py",
]

def clean_script(path: Path) -> tuple[bool, str]:
    """
    Limpia un script eliminando imports duplicados fuera del bloque del protocolo.
    
    Retorna: (modificado, mensaje)
    """
    if not path.exists():
        return False, f"[NO ENCONTRADO] {path}"
    
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    if PROTOCOL_MARKER not in content:
        return False, f"[SIN PROTOCOLO] {path.name}"
    
    lines = content.split('\n')
    
    # Encontrar el índice del bloque del protocolo
    protocol_start = None
    for i, line in enumerate(lines):
        if PROTOCOL_MARKER in line:
            protocol_start = i
            break
    
    if protocol_start is None:
        return False, f"[PROTOCOLO NO EN LINEAS] {path.name}"
    
    # El bloque del protocolo son las líneas desde protocol_start hasta la primera
    # línea que NO es parte del protocolo (línea vacía o import no relacionado)
    # Típicamente: shebang, [posible docstring inicial], protocolo (5-8 líneas), luego resto
    
    # Determinar el fin del bloque del protocolo
    # El bloque incluye hasta 'from config_paths import *' 
    protocol_end = protocol_start
    for i in range(protocol_start, min(protocol_start + 15, len(lines))):
        line = lines[i].strip()
        if any(keyword in line for keyword in [
            'import sys', 'from pathlib', '_current', '_root', 'sys.path.insert', 
            'from config_paths', '# ===', 'if _root'
        ]):
            protocol_end = i
    
    # Ahora eliminar 'import sys' y 'from pathlib import Path' 
    # que estén ANTES del bloque del protocolo (líneas 0..protocol_start-1)
    # y DESPUÉS del bloque del protocolo (líneas protocol_end+1..end)
    
    new_lines = []
    removed = 0
    
    for i, line in enumerate(lines):
        is_in_protocol = protocol_start <= i <= protocol_end
        
        stripped = line.strip()
        is_redundant_import = (
            stripped == 'import sys' or 
            stripped == 'from pathlib import Path'
        )
        
        if is_redundant_import and not is_in_protocol:
            removed += 1
            # No añadir esta línea
            continue
        
        new_lines.append(line)
    
    if removed == 0:
        return False, f"[OK - SIN CAMBIOS] {path.name}"
    
    # Limpiar líneas vacías excesivas (máximo 2 consecutivas)
    cleaned_lines = []
    empty_count = 0
    for line in new_lines:
        if line.strip() == '':
            empty_count += 1
            if empty_count <= 2:
                cleaned_lines.append(line)
        else:
            empty_count = 0
            cleaned_lines.append(line)
    
    new_content = '\n'.join(cleaned_lines)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True, f"[LIMPIADO] ({removed} imports eliminados): {path.name}"


def main():
    import io, sys
    if sys.platform == "win32":
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    print("=" * 60)
    print("[LIMPIEZA] IMPORTS DUPLICADOS -- PersonalOS v6.1")
    print("=" * 60)
    
    modified = 0
    skipped = 0
    errors = 0
    
    for script_rel in TARGET_SCRIPTS:
        path = SCRIPTS_DIR / script_rel
        try:
            changed, msg = clean_script(path)
            print(f"  {msg}")
            if changed:
                modified += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"  [ERROR] en {script_rel}: {e}")
            errors += 1
    
    print()
    print("=" * 60)
    print(f"[RESUMEN] {modified} modificados | {skipped} sin cambios | {errors} errores")
    print("=" * 60)


if __name__ == "__main__":
    main()
