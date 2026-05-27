#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
test_skill_lifecycle.py — E2E Test del ciclo de vida completo de una Skill
PersonalOS SOTA Skills v2.0
Uso: python test_skill_lifecycle.py [--verbose]
"""
import sys
from pathlib import Path

# === PROTOCOLO DE RUTA v2.0 Consequences ===
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()
SCRIPTS_OS = SCRIPT_DIR.parent  # 03_Scripts_Os
OPERATIONS = SCRIPTS_OS.parent  # 04_Operations
PERSONAL_OS = OPERATIONS.parent  # 01_Personal_Os
ROOT = PERSONAL_OS.parent  # Project root

sys.path.insert(0, str(SCRIPTS_OS))
from config_paths import *

# Fix Windows console encoding
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import shutil, tempfile, subprocess

VALIDATOR    = Path(__file__).parent / "skill_validator.py"
SECURITY_SCAN = Path(__file__).parent / "skill_security_scan.py"
SKILL_TEMPLATE = SKILLS_DIR / "SKILL_TEMPLATE"
VERBOSE = "--verbose" in sys.argv or "-v" in sys.argv

def run(script, args):
    r = subprocess.run([sys.executable, str(script)] + args, capture_output=True, text=True, cwd=str(ROOT_DIR))
    return r.returncode, r.stdout

def log(m):
    if VERBOSE: print(f"   {m}")

VALID_SKILL_MD = """---
name: test-e2e-skill
description: >
  Skill E2E de testing del sistema PersonalOS SOTA v2.0.
  Triggers on: test skill, lifecycle test, skill e2e.
category: Code Quality
version: "1.0"
---
# Test E2E Skill
## Esencia Original
> **Propósito**: Validar el ciclo de vida completo de una skill SOTA.
## Cuando Usar Esta Skill
- Durante el E2E lifecycle test
- **NO usar en producción**
## Instrucciones
1. Ejecutar validator. 2. Verificar score >= 70%.
## ⚠️ Gotchas
- **No producción**: Solo para testing del sistema de validación.
- **Python 3.8+**: Requiere dataclasses — no compatible con versiones anteriores.
- **Rutas absolutas**: Usar --path con ruta absoluta para evitar errores de contexto.
"""

def run_tests():
    results = []
    with tempfile.TemporaryDirectory(prefix="pos_e2e_") as tmp:
        T = Path(tmp)

        # T1: Template existe
        ok = SKILL_TEMPLATE.exists() and all(
            (SKILL_TEMPLATE / f).exists()
            for f in ["SKILL.md","examples/good_example.md","examples/bad_example.md"]
        )
        results.append(("Template estructura", ok, "OK" if ok else f"Falta estructura en {SKILL_TEMPLATE}"))

        # T2: Crear skill y validar
        dest = T / "test-e2e-skill"
        shutil.copytree(SKILL_TEMPLATE, dest)
        (dest / "SKILL.md").write_text(VALID_SKILL_MD, encoding="utf-8")
        code, out = run(VALIDATOR, ["--path", str(dest)])
        log(f"Validator code={code}")
        results.append(("Fill & Validate", code == 0, f"score aceptado" if code==0 else out[:150]))

        # T3: Inyectar defecto CRITICAL y detectar
        sd = dest / "scripts"; sd.mkdir(exist_ok=True)
        (sd / "bad.py").write_text("import os\nos.system('rm -rf /tmp/x')\n", encoding="utf-8")
        code, out = run(SECURITY_SCAN, ["--path", str(dest)])
        log(f"Security scan (defecto) code={code}")
        results.append(("Inject & Detect", code == 1, "rm-rf detectado ✓" if code==1 else f"No detectó. code={code}"))

        # T4: Corregir y limpiar
        (sd / "bad.py").write_text("import subprocess\nsubprocess.run(['ls','/tmp'],capture_output=True)\n", encoding="utf-8")
        code, out = run(SECURITY_SCAN, ["--path", str(dest)])
        log(f"Security scan (fix) code={code}")
        results.append(("Fix & Clean", code == 0, "CLEAN post-fix ✓" if code==0 else f"Sigue fallando. code={code}"))

        # T5: Edge case — SKILL.md vacío
        empty = T / "empty-skill"; empty.mkdir()
        (empty / "SKILL.md").write_text("", encoding="utf-8")
        code, _ = run(VALIDATOR, ["--path", str(empty)])
        ok = code != 0
        results.append(("Edge: empty SKILL.md", ok, f"Fallo graceful (code={code}) ✓" if ok else "Debería fallar"))

        # T6: Edge case — path con caracteres especiales
        uni = T / "skill-ñ-ü"; uni.mkdir()
        (uni / "SKILL.md").write_text(
            "---\nname: t\ndescription: >\n  X. Triggers on: y.\ncategory: Code Quality\n---\n"
            "## Esencia Original\nX.\n## ⚠️ Gotchas\n- **A**: X. Solución: Y.\n- **B**: X. Solución: Y.\n- **C**: X. Solución: Y.\n",
            encoding="utf-8")
        try:
            run(VALIDATOR, ["--path", str(uni)])
            results.append(("Edge: unicode path", True, "Sin crash ✓"))
        except Exception as e:
            results.append(("Edge: unicode path", False, str(e)))

    return results

def main():
    print("\n🧪 PersonalOS E2E Skill Lifecycle Test v2.0")
    print("=" * 55)
    for s in [VALIDATOR, SECURITY_SCAN]:
        if not s.exists():
            print(f"❌ Script faltante: {s}"); sys.exit(2)

    results = run_tests()
    passed  = [r for r in results if r[1]]
    failed  = [r for r in results if not r[1]]

    for name, ok, msg in results:
        print(f"  {'✅' if ok else '❌'} {name}: {msg}")

    print(f"\n{'='*55}")
    print(f"📊 {len(passed)}/{len(results)} pasados")
    if failed:
        print("❌ Fallidos:"); [print(f"   • {n}: {m}") for n,_,m in failed]
        sys.exit(1)
    else:
        print("✅ Todos los E2E pasaron — SOTA v2.0 operativo")
        sys.exit(0)

if __name__ == "__main__":
    main()
