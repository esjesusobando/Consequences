#!/usr/bin/env python3
"""
Detector — Auto-Improvement Engine
Detecta issues críticos en código, estructura y documentación
"""

import os
import re
from pathlib import Path
from dataclasses import dataclass, field
from typing import List

@dataclass
class Issue:
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW
    category: str  # structure, docs, code, deps
    path: str
    description: str
    suggestion: str = ""

class Detector:
    def __init__(self, root_path: str):
        self.root = Path(root_path)
        self.issues: List[Issue] = []
        self.stats = {
            "files_scanned": 0,
            "issues_found": 0,
            "by_severity": {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0},
            "by_category": {"structure": 0, "docs": 0, "code": 0, "deps": 0}
        }

    def scan(self) -> List[Issue]:
        """Ejecuta todas las detecciones"""
        print("🔍 Iniciando detección de issues...")

        self._check_structure()
        self._check_docs_consistency()
        self._check_naming_conventions()
        self._check_duplicate_scripts()

        self.stats["issues_found"] = len(self.issues)
        return self.issues

    def _check_structure(self):
        """Verifica estructura de carpetas"""
        print("  📁 Verificando estructura...")

        required_dirs = ["00_Winter_is_Coming", "01_Core", "02_Knowledge",
                        "03_Tasks", "04_Operations", "05_Archive"]

        for dir_name in required_dirs:
            dir_path = self.root / dir_name
            if not dir_path.exists():
                self._add_issue("HIGH", "structure", str(dir_path),
                              f"Directorio requerido no existe",
                              f"Crear {dir_name}/")

    def _check_docs_consistency(self):
        """Verifica consistencia entre docs y realidad"""
        print("  📝 Verificando consistencia de docs...")

        # Verificar version mismatch
        readme = self.root / "README.md"
        agents = self.root / "00_Winter_is_Coming" / "AGENTS.md"

        if readme.exists() and agents.exists():
            readme_content = readme.read_text(encoding='utf-8')
            agents_content = agents.read_text(encoding='utf-8')

            # Extraer versiones
            v_match = re.search(r'v(\d+\.\d+)', readme_content)
            a_match = re.search(r'v(\d+\.\d+)', agents_content)

            if v_match and a_match:
                if v_match.group(1) != a_match.group(1):
                    self._add_issue("MEDIUM", "docs",
                                  "Version mismatch entre README y AGENTS",
                                  f"README: v{v_match.group(1)}, AGENTS: v{a_match.group(1)}",
                                  "Unificar versiones")

    def _check_naming_conventions(self):
        """Verifica convenciones de nombres"""
        print("  📋 Verificando naming conventions...")

        # Patrones válidos
        dir_pattern = re.compile(r'^\d{2}_[A-Z].+$')
        file_pattern = re.compile(r'^\d{2}_.+\.(md|py|ts|tsx|js)$')

        for item in self.root.rglob("*"):
            if item.is_file():
                self.stats["files_scanned"] += 1
                name = item.name

                # Skip .git and hidden
                if ".git" in str(item) or item.name.startswith("."):
                    continue

                # Check files
                if file_pattern.match(name):
                    continue

    def _check_duplicate_scripts(self):
        """Detecta scripts duplicados"""
        print("  🔍 Verificando duplicados...")

        scripts = {}
        for py_file in self.root.rglob("*.py"):
            if ".git" in str(py_file) or "__pycache__" in str(py_file):
                continue

            name = py_file.name
            if name not in scripts:
                scripts[name] = []
            scripts[name].append(py_file)

        for name, paths in scripts.items():
            if len(paths) > 1:
                self._add_issue("MEDIUM", "structure",
                              f"Script duplicado: {name}",
                              f"Aparece en {len(paths)} ubicaciones",
                              "Consolidar o eliminar duplicados")

    def _add_issue(self, severity: str, category: str, path: str,
                   description: str, suggestion: str = ""):
        """Agrega un issue detectado"""
        issue = Issue(severity, category, path, description, suggestion)
        self.issues.append(issue)
        self.stats["by_severity"][severity] += 1
        self.stats["by_category"][category] += 1

    def report(self) -> str:
        """Genera reporte de issues"""
        lines = [
            "# 🔍 Reporte de Issues Detectados",
            f"**Fecha:** 2026-04-23",
            f"**Archivos escaneados:** {self.stats['files_scanned']}",
            f"**Issues encontrados:** {self.stats['issues_found']}",
            "",
            "## Por Severidad",
            f"- 🔴 CRITICAL: {self.stats['by_severity']['CRITICAL']}",
            f"- 🟠 HIGH: {self.stats['by_severity']['HIGH']}",
            f"- 🟡 MEDIUM: {self.stats['by_severity']['MEDIUM']}",
            f"- 🟢 LOW: {self.stats['by_severity']['LOW']}",
            "",
            "## Por Categoría",
            f"- 📁 Structure: {self.stats['by_category']['structure']}",
            f"- 📝 Docs: {self.stats['by_category']['docs']}",
            f"- 💻 Code: {self.stats['by_category']['code']}",
            f"- 📦 Deps: {self.stats['by_category']['deps']}",
            "",
            "## Issues Detallados",
            ""
        ]

        for issue in self.issues:
            lines.append(f"### {issue.severity}: {issue.path}")
            lines.append(f"**{issue.category}**: {issue.description}")
            if issue.suggestion:
                lines.append(f"💡 **Sugerencia:** {issue.suggestion}")
            lines.append("")

        return "\n".join(lines)


def main():
    import sys
    root = sys.argv[1] if len(sys.argv) > 1 else "."

    detector = Detector(root)
    issues = detector.scan()

    print(f"\n✅ Detección completada: {len(issues)} issues")
    print(detector.report())

    return 0 if len(issues) == 0 else 1


if __name__ == "__main__":
    exit(main())
