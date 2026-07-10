import logging
import typing

logging.basicConfig(level=logging.INFO)
#!/usr/bin/env python3
"""
14_Health_Metrics_Hub.py — PersonalOS v4.9 Consequences

Registra métricas históricas de salud del OS y genera reportes ASCII.
Lee resultados de los Health Tests y los persiste en CSV.

Usage:
    python 14_Health_Metrics_Hub.py --record       # Corre tests + graba
    python 14_Health_Metrics_Hub.py --report       # Reporte ASCII últimos 30 días
    python 14_Health_Metrics_Hub.py --record --report
"""

import csv
import io
import subprocess
import sys
from datetime import datetime
from pathlib import Path

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# Path resolution via config_paths (v5.0 dynamic protocol)
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "00_Winter_is_Coming").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os"))
from config_paths import ROOT_DIR, MEMORY_CTX_DIR
REPO_ROOT: Path = ROOT_DIR

REPORTS_DIR = MEMORY_CTX_DIR / "11_Reports"
METRICS_CSV = REPORTS_DIR / "health_history.csv"


def run_test(script_path):
    """Ejecuta un test y devuelve (passed, total, exit_code)."""
    try:
        result = subprocess.run(
            [sys.executable, str(script_path)],
            capture_output=True, text=True, timeout=120,
            cwd=str(REPO_ROOT), encoding="utf-8", errors="replace"
        )
        out = (result.stdout or "") + (result.stderr or "")
        # Buscar patrón "X/Y tests pasaron"
        for line in out.splitlines():
            if "tests pasaron" in line:
                # Ejemplo: "  RESULTADO FINAL: 15/15 tests pasaron (100%)"
                import re
                m = re.search(r"(\d+)/(\d+)", line)
                if m:
                    return int(m.group(1)), int(m.group(2)), result.returncode
        return 0, 0, result.returncode
    except Exception as e:
        print(f"⚠️  Error corriendo {script_path}: {e}")
        return 0, 0, -1


def record():
    """Corre los 2 health tests y graba métricas en CSV."""
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().isoformat(timespec="seconds")

    structural = REPO_ROOT / "02_Playground" / "00_OS_Health_Test.py"
    runtime = REPO_ROOT / "02_Playground" / "01_OS_Runtime_Test.py"

    print(f"📊 Recording health metrics — {timestamp}")
    s_pass, s_total, s_exit = run_test(structural) if structural.exists() else (0, 0, -1)
    r_pass, r_total, r_exit = run_test(runtime) if runtime.exists() else (0, 0, -1)

    print(f"   Structural: {s_pass}/{s_total}")
    print(f"   Runtime:    {r_pass}/{r_total}")

    # Escribir/agregar a CSV
    new_file = not METRICS_CSV.exists()
    with open(METRICS_CSV, "a", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        if new_file:
            w.writerow(["timestamp", "structural_pass", "structural_total",
                       "runtime_pass", "runtime_total", "overall_health_pct"])
        total = s_total + r_total
        passed = s_pass + r_pass
        pct = round(passed / total * 100, 1) if total else 0
        w.writerow([timestamp, s_pass, s_total, r_pass, r_total, pct])

    print(f"✅ Grabado en {METRICS_CSV.name}")
    return 0


def report():
    """Genera reporte ASCII de los últimos 30 registros."""
    if not METRICS_CSV.exists():
        print(f"⚠️  No existe {METRICS_CSV} — correr con --record primero")
        return 1

    with open(METRICS_CSV, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    if not rows:
        print("⚠️  CSV vacío")
        return 1

    rows = rows[-30:]  # Últimos 30
    lines = []
    lines.append("\n" + "=" * 70 + "\n")
    lines.append("  HEALTH METRICS — Últimos 30 registros\n")
    lines.append("=" * 70 + "\n")
    lines.append(f"\n  {'Fecha':<20} {'Struct':>8} {'Runtime':>8} {'Health %':>9}  Bar\n")
    lines.append("  " + "-" * 65 + "\n")

    for row in rows:
        dt = row["timestamp"][:16].replace("T", " ")
        s = f"{row['structural_pass']}/{row['structural_total']}"
        r = f"{row['runtime_pass']}/{row['runtime_total']}"
        pct = float(row["overall_health_pct"])
        bar_len = int(pct / 5)
        bar = "█" * bar_len + "░" * (20 - bar_len)
        lines.append(f"  {dt:<20} {s:>8} {r:>8} {pct:>7.1f}%  {bar}\n")

    pcts = [float(r["overall_health_pct"]) for r in rows]
    avg = sum(pcts) / len(pcts)
    lines.append(f"\n  Promedio: {avg:.1f}% | Min: {min(pcts):.1f}% | Max: {max(pcts):.1f}%\n")
    lines.append("=" * 70 + "\n")

    output = "".join(lines)
    print(output, end="")

    # Guardar en 03_Resultado/04_Reportes/
    try:
        reports_dir = REPO_ROOT / "03_Resultado" / "04_Reportes"
        reports_dir.mkdir(parents=True, exist_ok=True)
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_path = reports_dir / f"health_metrics_{ts}.txt"
        report_path.write_text(output, encoding="utf-8")
        print(f"📄 Reporte: 03_Resultado/04_Reportes/health_metrics_{ts}.txt")
    except Exception:
        pass

    return 0


def main():
    if "--record" not in sys.argv and "--report" not in sys.argv:
        print(__doc__)
        return 1

    if "--record" in sys.argv:
        record()
    if "--report" in sys.argv:
        return report()
    return 0


if __name__ == "__main__":
    sys.exit(main())
