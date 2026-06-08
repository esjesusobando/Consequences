#!/usr/bin/env python3
"""
Executor — Auto-Improvement Engine v2.0
Aplica fixes automáticos a issues detectados por detector.py
Soporta: structure, docs, code, deps
"""

import os
import re
import shutil
from pathlib import Path
from typing import List, Dict, Tuple, Optional
from datetime import datetime


class Executor:
    def __init__(self, root_path: str, dry_run: bool = True):
        self.root = Path(root_path)
        self.dry_run = dry_run
        self.fixes_applied: List[Dict] = []
        self.fixes_failed: List[Dict] = []

    def execute(self, prioritized_issues: List[dict]) -> Tuple[int, int]:
        """Ejecuta fixes para issues priorizados"""
        mode = "DRY RUN" if self.dry_run else "LIVE"
        print(f"[EXEC] [{mode}] Aplicando {sum(1 for i in prioritized_issues if i.get('auto_fixable', False))} fixes...")

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
        """Enruta un issue al fix correspondiente según categoría"""
        path = issue.get("path", "")
        category = issue.get("category", "")
        severity = issue.get("severity", "")
        description = issue.get("description", "").lower()

        # --- STRUCTURE: crear directorios faltantes ---
        if category == "structure":
            if "directorio requerido" in description or "directorio faltante" in description:
                return self._create_missing_dir(issue)
            if "script duplicado" in description:
                return self._fix_duplicate_scripts(issue)

        # --- DOCS: version mismatches, docstrings obsoletos ---
        if category == "docs":
            if "version mismatch" in description:
                return self._fix_version_mismatch(issue)
            if "docstring" in description or "documentacion" in description:
                return self._fix_docstring(issue)

        # --- CODE: naming conventions ---
        if category == "code":
            if "naming" in description:
                return self._fix_naming_convention(issue)

        # --- DEPS: dependency checks ---
        if category == "deps":
            return self._fix_dependency(issue)

        return False

    # ============================================================
    # FIX: Directorios faltantes
    # ============================================================
    def _create_missing_dir(self, issue: dict) -> bool:
        """Crea directorio faltante"""
        path = issue.get("path", "")
        if not path:
            return False

        target = Path(path)  # absolute or relative
        if not target.is_absolute():
            target = self.root / target

        if target.exists():
            print(f"  [DIR] [SKIP] Ya existe: {target}")
            return False

        if self.dry_run:
            print(f"  [DIR] [DRY] Crear: {target}")
            return True

        try:
            target.mkdir(parents=True, exist_ok=True)
            self.fixes_applied.append({
                "action": "create_dir",
                "path": str(target),
                "issue": issue.get("description", ""),
                "timestamp": datetime.now().isoformat()
            })
            print(f"  [DIR] [OK] Creado: {target}")
            return True
        except Exception as e:
            print(f"  [DIR] [FAIL] Error creando {target}: {e}")
            return False

    # ============================================================
    # FIX: Unificar versiones entre README.md y AGENTS.md
    # ============================================================
    def _fix_version_mismatch(self, issue: dict) -> bool:
        """Unifica la versión entre README.md y AGENTS.md"""
        root = self.root

        readme = root / "README.md"
        agents = root / "00_Winter_is_Coming" / "AGENTS.md"

        if not readme.exists() or not agents.exists():
            print(f"  [VERSION] [SKIP] No se encuentran README o AGENTS.md")
            return False

        readme_content = readme.read_text(encoding='utf-8')
        agents_content = agents.read_text(encoding='utf-8')

        v_readme = re.search(r'v(\d+\.\d+)', readme_content)
        v_agents = re.search(r'v(\d+\.\d+)', agents_content)

        if not v_readme and not v_agents:
            return False

        # Tomar la versión más alta como canónica (parseo seguro como tupla de ints)
        def parse_version(m):
            return tuple(map(int, m.group(1).split('.')))

        versions = []
        if v_readme:
            versions.append(("readme", parse_version(v_readme)))
        if v_agents:
            versions.append(("agents", parse_version(v_agents)))

        canonical_source, canonical_version_tuple = max(versions, key=lambda x: x[1])
        canonical_str = f"v{'.'.join(map(str, canonical_version_tuple))}"

        if self.dry_run:
            print(f"  [VERSION] [DRY] Unificar a {canonical_str} (desde {canonical_source})")
            return True

        updates = 0
        for fpath, content, match in [
            (readme, readme_content, v_readme),
            (agents, agents_content, v_agents)
        ]:
            if match and match.group(0) != canonical_str:
                new_content = content.replace(match.group(0), canonical_str)
                fpath.write_text(new_content, encoding='utf-8')
                updates += 1
                print(f"  [VERSION] [OK] Actualizado: {fpath.name} → {canonical_str}")

        if updates > 0:
            self.fixes_applied.append({
                "action": "fix_version_mismatch",
                "canonical_version": canonical_str,
                "files_updated": updates,
                "timestamp": datetime.now().isoformat()
            })

        return updates > 0

    # ============================================================
    # FIX: Docstrings obsoletos
    # ============================================================
    def _fix_docstring(self, issue: dict) -> bool:
        """Actualiza docstrings que mencionan fechas/versiones viejas"""
        path = issue.get("path", "")
        if not path:
            return False

        target = Path(path)
        if not target.is_absolute():
            target = self.root / target

        if not target.exists():
            return False

        content = target.read_text(encoding='utf-8')

        # Detectar fechas viejas en docstrings (ej: 2024 o 2025 desactualizado)
        # Ejemplo: "Fecha: 2024-03-XX" -> "Fecha: 2026-05-28"
        changes = []
        new_content = content

        # Actualizar fecha en encabezados de docstring si es muy vieja
        for match in re.finditer(r'(\*\*Fecha:\*\*\s*)(\d{4}-\d{2}-\d{2})', content):
            old_date = match.group(2)
            year = int(old_date[:4])
            if year < 2025:
                new_date = "2026-05-28"
                new_content = new_content.replace(old_date, new_date)
                changes.append(("fecha_docstring", old_date, new_date))

        # Actualizar versiones de PROYECTO en docstring como "v1.x" -> "v4.x"
        # Solo coincide con patrones tipo "v1.0" que aparecen como version principal
        # en headers o metadata del proyecto (NO en URLs, referencias externas, etc.)
        for match in re.finditer(r'(?:^|\s)(v[0-2]\.\d+)(?:\s|$)', content, re.MULTILINE):
            old_ver = match.group(1)
            new_ver = f"v4.{old_ver.split('.')[1]}"
            new_content = new_content.replace(old_ver, new_ver, 1)  # uno a la vez
            changes.append(("version_docstring", old_ver, new_ver))

        if not changes:
            return False

        if self.dry_run:
            for kind, old, new in changes:
                print(f"  [DOCS] [DRY] {kind}: {old} → {new} en {target.name}")
            return True

        try:
            target.write_text(new_content, encoding='utf-8')
            self.fixes_applied.append({
                "action": "fix_docstring",
                "path": str(target),
                "changes": len(changes),
                "timestamp": datetime.now().isoformat()
            })
            print(f"  [DOCS] [OK] {len(changes)} cambios en {target.name}")
            return True
        except Exception as e:
            print(f"  [DOCS] [FAIL] Error en {target}: {e}")
            return False

    # ============================================================
    # FIX: Convenciones de naming
    # ============================================================
    def _get_next_number(self, directory: Path) -> int:
        """Escanea directorio y devuelve el siguiente número NN disponible"""
        max_num = 0
        if not directory.exists():
            return 1
        for f in directory.iterdir():
            if f.is_file():
                m = re.match(r'(\d+)_', f.name)
                if m:
                    num = int(m.group(1))
                    if num > max_num:
                        max_num = num
        return max_num + 1

    def _fix_naming_convention(self, issue: dict) -> bool:
        """Corrige naming de archivos para seguir el estándar NN_Descripcion.ext"""
        path = issue.get("path", "")
        if not path:
            return False

        target = Path(path)
        if not target.is_absolute():
            target = self.root / target

        if not target.exists():
            return False

        parent = target.parent
        name = target.name

        # Patrones inválidos: sin prefijo numérico, minúsculas, espacios
        if re.match(r'^\d+_', name):
            return False  # ya tiene formato correcto (soporta 1+ dígitos)

        # Convertir: "mi_archivo.md" -> "NN_Mi_Archivo.md" (NN dinámico)
        # Extraer palabras y capitalizar
        stem = target.stem
        ext = target.suffix

        # Limpiar: reemplazar _ y - por espacio, capitalizar palabras
        words = re.split(r'[_\-\s]+', stem)
        capitalized = [w.capitalize() if w else "" for w in words if w]
        if not capitalized:
            return False

        old_name = name
        next_num = self._get_next_number(parent)
        new_name = f"{next_num:02d}_{'_'.join(capitalized)}{ext}"

        if old_name == new_name:
            return False

        new_path = parent / new_name

        if new_path.exists():
            print(f"  [NAMING] [SKIP] Ya existe: {new_name}")
            return False

        if self.dry_run:
            print(f"  [NAMING] [DRY] Renombrar: {old_name} → {new_name}")
            return True

        try:
            target.rename(new_path)
            self.fixes_applied.append({
                "action": "rename_file",
                "from": str(target),
                "to": str(new_path),
                "timestamp": datetime.now().isoformat()
            })
            print(f"  [NAMING] [OK] {old_name} → {new_name}")
            return True
        except Exception as e:
            print(f"  [NAMING] [FAIL] Error renombrando {old_name}: {e}")
            return False

    # ============================================================
    # FIX: Consolidar scripts duplicados
    # ============================================================
    def _fix_duplicate_scripts(self, issue: dict) -> bool:
        """Consolida scripts duplicados (mantiene el más reciente, archiva el resto)"""
        path = issue.get("path", "")
        description = issue.get("description", "")

        # Parsear nombre del script del description
        # "Script duplicado: detector.py" -> detector.py
        name_match = re.search(r"Script duplicado:\s*(\S+)", description)
        if not name_match:
            return False

        script_name = name_match.group(1)

        # Buscar todas las ocurrencias del script
        script_paths = list(self.root.rglob(script_name))

        if len(script_paths) <= 1:
            return False

        # Ordenar por fecha de modificación (más reciente primero)
        script_paths.sort(key=lambda p: p.stat().st_mtime, reverse=True)

        keep = script_paths[0]
        duplicates = script_paths[1:]

        if self.dry_run:
            print(f"  [DUP] [DRY] Consolidar: {script_name}")
            print(f"  [DUP] [DRY]   Mantener: {keep}")
            for dup in duplicates:
                print(f"  [DUP] [DRY]   Archivar: {dup}")
            return True

        archive_root = self.root / "05_Archive" / "00_Duplicates_Auto"
        archived = 0

        for dup in duplicates:
            try:
                # Crear estructura relativa en archive
                rel_path = dup.relative_to(self.root)
                archive_path = archive_root / rel_path
                archive_path.parent.mkdir(parents=True, exist_ok=True)

                # Copiar y luego eliminar original
                shutil.copy2(str(dup), str(archive_path))
                dup.unlink()
                archived += 1
                print(f"  [DUP] [OK] Archivado: {dup}")
            except Exception as e:
                print(f"  [DUP] [FAIL] Error archivando {dup}: {e}")

        if archived > 0:
            self.fixes_applied.append({
                "action": "consolidate_duplicates",
                "script": script_name,
                "kept": str(keep),
                "archived": archived,
                "timestamp": datetime.now().isoformat()
            })

        return archived > 0

    # ============================================================
    # FIX: Dependencias (archivos package.json/requirements no estándar)
    # ============================================================
    def _fix_dependency(self, issue: dict) -> bool:
        """Corrige issues de dependencias (formato, versión)"""
        path = issue.get("path", "")

        target = Path(path)
        if not target.is_absolute():
            target = self.root / target

        if not target.exists():
            return False

        if target.name == "requirements.txt":
            return self._fix_requirements_txt(target)

        if target.name in ("package.json", "package-lock.json"):
            return self._fix_package_json(target)

        return False

    def _fix_requirements_txt(self, target: Path) -> bool:
        """Estandariza formato de requirements.txt"""
        content = target.read_text(encoding='utf-8')

        # Asegurar que cada línea tiene formato package==version
        changes = []
        lines = content.splitlines()
        new_lines = []

        for line in lines:
            stripped = line.strip()
            if not stripped or stripped.startswith('#'):
                new_lines.append(line)
                continue

            # Si tiene >= o ~= o >, cambiar a == (fijar versión)
            # NOTA: NO tocar != (constraint de exclusión) ni líneas con múltiples constraints
            if re.search(r'[><~]=', stripped) and '!=' not in stripped:
                fixed = re.sub(r'([><~]=)', '==', stripped)
                # Solo mantener el primer == si hay múltiples
                parts = fixed.split('==')
                if len(parts) > 2:
                    fixed = f"{parts[0]}=={parts[1]}"
                new_lines.append(fixed)
                changes.append((stripped, fixed))
            else:
                new_lines.append(line)

        if not changes:
            return False

        new_content = "\n".join(new_lines)

        if self.dry_run:
            for old, new in changes:
                print(f"  [DEPS] [DRY] requirements: {old} → {new}")
            return True

        try:
            target.write_text(new_content, encoding='utf-8')
            self.fixes_applied.append({
                "action": "fix_requirements",
                "path": str(target),
                "changes": len(changes),
                "timestamp": datetime.now().isoformat()
            })
            print(f"  [DEPS] [OK] {len(changes)} cambios en requirements.txt")
            return True
        except Exception as e:
            print(f"  [DEPS] [FAIL] Error en requirements.txt: {e}")
            return False

    def _fix_package_json(self, target: Path) -> bool:
        """Actualmente no implementado — package.json es muy sensible"""
        return False

    # ============================================================
    # REPORTE
    # ============================================================
    def report(self) -> str:
        """Genera reporte de fixes"""
        lines = [
            "# [EXEC] Reporte de Ejecucion",
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
                action = fix.get("action", "?")
                ts = fix.get("timestamp", "")
                if action == "create_dir":
                    lines.append(f"- [OK] +{fix['path']}")
                elif action == "fix_version_mismatch":
                    lines.append(f"- [OK] Version unificada: {fix.get('canonical_version')} ({fix.get('files_updated')} archivos)")
                elif action == "fix_docstring":
                    lines.append(f"- [OK] Docstring actualizado: {fix.get('path')} ({fix.get('changes')} cambios)")
                elif action == "rename_file":
                    lines.append(f"- [OK] Renombrado: {fix.get('from')} → {fix.get('to')}")
                elif action == "consolidate_duplicates":
                    lines.append(f"- [OK] Consolidado: {fix.get('script')} ({fix.get('archived')} duplicados archivados)")
                elif action == "fix_requirements":
                    lines.append(f"- [OK] Requirements estandarizado: {fix.get('changes')} cambios")
                else:
                    lines.append(f"- [OK] {fix.get('action')}: {fix.get('path', '?')}")
            lines.append("")

        if self.fixes_failed:
            lines.append("## Fixes Fallidos")
            for fail in self.fixes_failed:
                lines.append(f"- [FAIL] {fail['issue'].get('path', '?')}: {fail['error']}")
            lines.append("")

        return "\n".join(lines)


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Executor — Auto-Improvement Engine v2.0",
        epilog="Ejemplos:\n  %(prog)s                     # dry-run en directorio actual\n  %(prog)s --apply .            # LIVE en directorio actual\n  %(prog)s --apply /ruta        # LIVE en ruta específica"
    )
    parser.add_argument(
        "root", nargs="?", default=".",
        help="Ruta raíz del proyecto (default: directorio actual)"
    )
    parser.add_argument(
        "-n", "--dry-run", action="store_true", default=True,
        help="Modo dry-run: muestra qué haría sin ejecutar (default)"
    )
    parser.add_argument(
        "-a", "--apply", action="store_true",
        help="MODO LIVE: aplica los fixes realmente"
    )

    args = parser.parse_args()
    # dry-run flag actúa como override: si se pasa explícitamente, fuerza dry-run
    # si no, --apply determina el modo; si no hay flags, default dry-run
    dry_run = args.dry_run if args.dry_run and not args.apply else not args.apply

    executor = Executor(args.root, dry_run=dry_run)

    # Demo issues representativos de lo que detecta detector.py
    demo_issues = [
        {
            "severity": "HIGH",
            "category": "structure",
            "path": "04_Operations/01_Auto_Improvement/XX_New_Module",
            "description": "Directorio faltante",
            "auto_fixable": True
        },
        {
            "severity": "MEDIUM",
            "category": "docs",
            "path": "00_Winter_is_Coming/AGENTS.md",
            "description": "Version mismatch entre README y AGENTS",
            "auto_fixable": True
        },
        {
            "severity": "LOW",
            "category": "code",
            "path": "04_Operations/00_Context_LLM/02_Knowledge_Brain/99_Mi_Nota.md",
            "description": "Naming convention: falta prefijo numerico",
            "auto_fixable": True
        },
    ]

    success, failed = executor.execute(demo_issues)
    print(executor.report())

    mode = "LIVE" if args.apply else "DRY RUN"
    print(f"\n[EXEC] [{mode}] Completado: {success} OK, {failed} FAILED")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    exit(main())
