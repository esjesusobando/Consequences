#!/usr/bin/env python3
"""
Executor — Auto-Improvement Engine
Aplica fixes automáticos a issues detectados
"""

import os
import re
import shutil
from pathlib import Path
from typing import List, Dict, Tuple
from datetime import datetime

class Executor:
    def __init__(self, root_path: str, dry_run: bool = True):
        self.root = Path(root_path)
        self.dry_run = dry_run
        self.fixes_applied: List[Dict] = []
        self.fixes_failed: List[Dict] = []

    def execute(self, prioritized_issues: List[dict]) -> Tuple[int, int]:
        """Ejecuta fixes para issues priorizados"""
        print(f"{'[SEARCH] DRY RUN' if self.dry_run else '[EXEC] EXECUTING'}: Aplicando fixes...")

        success_count = 0
        fail_count = 0

        for issue in prioritized_issues:
            if not issue.get("auto_fixable", False):
                continue

            try:
                result = self._apply_fix(issue)
                if result:
                    success_count += 1
                else:
                    fail_count += 1
            except Exception as e:
                fail_count += 1
                self.fixes_failed.append({
                    "issue": issue,
                    "error": str(e)
                })

        return success_count, fail_count

    def _apply_fix(self, issue: dict) -> bool:
        """Aplica fix a un issue individual"""
        path = issue.get("path", "")
        category = issue.get("category", "")
        severity = issue.get("severity", "")

        if "version" in path.lower() and "version mismatch" in issue.get("description", "").lower():
            return self._fix_version_mismatch(issue)

        if "naming" in issue.get("description", "").lower():
            return self._fix_naming_convention(issue)

        if category == "structure" and severity in ["HIGH", "CRITICAL"]:
            return self._create_missing_dir(issue)

        return False

    def _fix_version_mismatch(self, issue: dict) -> bool:
        """Corrige mismatch de versiones en docs"""
        # Esta es una corrección peligrosa - marcar para revisión manual
        return False

    def _fix_naming_convention(self, issue: dict) -> bool:
        """Corrige convenciones de nombres"""
        # Verificar si necesita renombrar
        return False

    def _create_missing_dir(self, issue: dict) -> bool:
        """Crea directorio faltante"""
        path = issue.get("path", "")
        if not path:
            return False

        target = self.root / path
        if target.exists():
            return False

        if self.dry_run:
            print(f"  [DIR] [DRY] Crear: {target}")
            return True

        try:
            target.mkdir(parents=True, exist_ok=True)
            self.fixes_applied.append({
                "action": "create_dir",
                "path": str(target),
                "timestamp": datetime.now().isoformat()
            })
            print(f"  [OK] Creado: {target}")
            return True
        except Exception as e:
            print(f"  [FAIL] Error creando {target}: {e}")
            return False

    def report(self) -> str:
        """Genera reporte de fixes"""
        lines = [
            "# [EXEC] Reporte de Ejecución",
            f"**Fecha:** {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            f"**Modo:** {'DRY RUN' if self.dry_run else 'LIVE'}",
            "",
            f"**Fixes aplicados:** {len(self.fixes_applied)}",
            f"**Fixes fallidos:** {len(self.fixes_failed)}",
            ""
        ]

        if self.fixes_applied:
            lines.append("## Fixes Exitosos")
            for fix in self.fixes_applied:
                lines.append(f"- [OK] {fix['action']}: {fix['path']}")
            lines.append("")

        if self.fixes_failed:
            lines.append("## Fixes Fallidos")
            for fail in self.fixes_failed:
                lines.append(f"- [FAIL] {fail['issue'].get('path')}: {fail['error']}")
            lines.append("")

        return "\n".join(lines)


def main():
    import sys

    dry_run = "--dry-run" in sys.argv or "-n" in sys.argv
    root = "."

    executor = Executor(root, dry_run=dry_run)

    # Demo issues
    demo_issues = [
        {
            "severity": "HIGH",
            "category": "structure",
            "path": "04_Operations/01_Auto_Improvement/",
            "description": "Directorio faltante",
            "auto_fixable": True
        }
    ]

    success, failed = executor.execute(demo_issues)
    print(executor.report())

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    exit(main())
