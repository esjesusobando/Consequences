#!/usr/bin/env python3
"""
release_checklist.py — Release Agent
Genera un checklist contextual de release según el entorno y la estrategia.
Combina la matriz de tests (Anthropic/BIG school) con el flujo CI/CD (Google).

Uso:
    python scripts/release_checklist.py --version 2.3.0 --target production
    python scripts/release_checklist.py --target staging --strategy canary
    python scripts/release_checklist.py --target production --strict
"""

import argparse
import subprocess
import sys
import io
from datetime import datetime
from pathlib import Path

# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
CYAN = "\033[96m"
RESET = "\033[0m"
BOLD = "\033[1m"


def get_git_info() -> dict:
    """Obtiene información del commit actual."""
    info = {}
    try:
        info["commit"] = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            capture_output=True, text=True
        ).stdout.strip()
        info["branch"] = subprocess.run(
            ["git", "branch", "--show-current"],
            capture_output=True, text=True
        ).stdout.strip()
        info["author"] = subprocess.run(
            ["git", "log", "-1", "--format=%an"],
            capture_output=True, text=True
        ).stdout.strip()
        info["message"] = subprocess.run(
            ["git", "log", "-1", "--format=%s"],
            capture_output=True, text=True
        ).stdout.strip()
    except Exception:
        info = {"commit": "N/A", "branch": "N/A", "author": "N/A", "message": "N/A"}
    return info


def generate_checklist(version: str, target: str, strategy: str, strict: bool) -> str:
    git = get_git_info()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")

    lines = [
        f"# Release Checklist",
        f"",
        f"**Versión:** {version}",
        f"**Entorno:** {target}",
        f"**Estrategia:** {strategy}",
        f"**Fecha:** {timestamp}",
        f"**Commit:** {git['commit']} en `{git['branch']}`",
        f"**Autor:** {git['author']}",
        f"**Cambio:** {git['message']}",
        f"",
        f"---",
        f"",
        f"## 🔴 Pre-Release — Lo Crítico",
        f"",
        f"- [ ] Tests de autenticación y autorización pasaron (`tests/critical/` o `tests/auth/`)",
        f"- [ ] Tests de lógica de negocio principal pasaron",
        f"- [ ] Tests de integración con APIs externas pasaron",
        f"- [ ] No hay código de debug en el código fuente",
        f"- [ ] Variables de entorno documentadas en `.env.example`",
        f"- [ ] Working tree limpio (`git status`)",
        f"",
    ]

    if target == "production":
        lines += [
            f"## 🟡 Pre-Release — Lo Importante",
            f"",
            f"- [ ] Edge cases conocidos revisados manualmente",
            f"- [ ] Código generado por IA revisado y entendido por un humano",
            f"- [ ] No hay archivos marcados como `AI-GENERATED: PENDING`",
            f"",
        ]

    lines += [
        f"## CI — Pipeline Verde",
        f"",
        f"- [ ] Lint/format sin errores",
        f"- [ ] Suite de tests completa: `python -m pytest tests/ -v`",
        f"- [ ] Build Docker exitoso: `docker build -t app:{version} .`",
        f"- [ ] Imagen escaneada sin CVEs críticos",
        f"- [ ] Imagen publicada en registry con tag `:{version}` y `:commit-{git['commit']}`",
        f"",
        f"## Pull Request",
        f"",
        f"- [ ] PR aprobado por al menos 1 revisor",
        f"- [ ] Todos los checks del CI en verde",
        f"- [ ] Sin conversaciones pendientes en la revisión",
        f"- [ ] Merge a `main` realizado",
        f"",
    ]

    # Sección de deploy según estrategia
    if strategy == "canary":
        lines += [
            f"## CD — Despliegue Canary",
            f"",
            f"- [ ] Deploy al 5% del tráfico en {target}",
            f"- [ ] Monitoreo activo durante 15 minutos:",
            f"  - [ ] Error rate < 1%",
            f"  - [ ] Latencia P99 dentro del baseline",
            f"  - [ ] Sin alertas de memoria/CPU",
            f"- [ ] Escalar al 25% — mismo monitoreo",
            f"- [ ] Escalar al 100%",
            f"",
        ]
    elif strategy == "blue-green":
        lines += [
            f"## CD — Despliegue Blue/Green",
            f"",
            f"- [ ] Entorno 'green' desplegado con la nueva versión",
            f"- [ ] Smoke tests en 'green' pasaron",
            f"- [ ] Tráfico redirigido de 'blue' a 'green'",
            f"- [ ] Entorno 'blue' disponible para rollback durante 30 min",
            f"- [ ] Monitoreo activo durante 15 minutos post-switch",
            f"",
        ]
    else:  # rolling
        lines += [
            f"## CD — Despliegue Rolling",
            f"",
            f"- [ ] Deploy iniciado a {target}",
            f"- [ ] Sin errores durante el rolling update",
            f"- [ ] Todas las instancias corriendo la nueva versión",
            f"",
        ]

    lines += [
        f"## Post-Release",
        f"",
        f"- [ ] Monitoreo activo 30 minutos post-deploy completo",
        f"- [ ] Sin picos en error rate o latencia",
        f"- [ ] Tag de release creado: `git tag v{version}`",
        f"- [ ] CHANGELOG o release notes actualizado",
        f"",
    ]

    if strict or target == "production":
        lines += [
            f"## Rollback (mantener disponible 1 hora)",
            f"",
            f"- Imagen anterior: `app:{version.rsplit('.', 1)[0] if '.' in version else 'previous'}`",
            f"- Comando: `gcloud deploy rollbacks create --delivery-pipeline=my-pipeline --region=us-central1`",
            f"- Contacto de guardia: [rellenar]",
            f"",
        ]

    lines += [
        f"---",
        f"*Generado por Release Agent — {timestamp}*",
        f"*Principios: Anthropic Agent Skills + Google CI/CD Best Practices*",
    ]

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="Release Checklist Generator — Release Agent"
    )
    parser.add_argument("--version", default="0.0.0", help="Versión del release (ej: 2.3.0)")
    parser.add_argument(
        "--target",
        choices=["staging", "production"],
        default="staging",
        help="Entorno de destino"
    )
    parser.add_argument(
        "--strategy",
        choices=["canary", "blue-green", "rolling"],
        default="rolling",
        help="Estrategia de despliegue"
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Incluye secciones adicionales de seguridad"
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Guardar en archivo (ej: RELEASE_CHECKLIST.md)"
    )
    args = parser.parse_args()

    checklist = generate_checklist(
        version=args.version,
        target=args.target,
        strategy=args.strategy,
        strict=args.strict
    )

    if args.output:
        Path(args.output).write_text(checklist, encoding="utf-8")
        print(f"{GREEN}✓ Checklist guardado en {args.output}{RESET}")
    else:
        print(checklist)


if __name__ == "__main__":
    main()
