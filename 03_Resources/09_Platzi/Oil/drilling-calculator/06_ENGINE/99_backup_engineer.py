import os
import shutil
from datetime import datetime
import subprocess

# Branding PersonalOS · Engineering PhD Standard
VERSION = "Elite.2.0"

def perform_backup(task_name):
    """Realiza un backup de los archivos críticos antes de una tarea."""
    backup_dir = os.path.join(os.getcwd(), "backups", datetime.now().strftime("%Y%m%d_%H%M%S"))
    os.makedirs(backup_dir, exist_ok=True)

    # Archivos críticos del motor
    files_to_backup = [
        "src/store/drilling-store.ts",
        "src/engine/orchestrator.ts",
        "src/engine/rheology.ts",
        "src/engine/hydraulics.ts"
    ]

    for f in files_to_backup:
        if os.path.exists(f):
            dest = os.path.join(backup_dir, os.path.basename(f))
            shutil.copy2(f, dest)
            print(f"✅ Backup creado: {f}")

def perform_commit(task_name):
    """Realiza un git commit de la tarea completada."""
    try:
        subprocess.run(["git", "add", "."], check=True)
        message = f"task: {task_name} (Standard SLB/Halliburton)"
        subprocess.run(["git", "commit", "-m", message], check=True)
        print(f"🚀 Commit realizado: {message}")
    except Exception as e:
        print(f"⚠️ Error en commit: {e}")

if __name__ == "__main__":
    print(f"--- PersonalOS Engineering Backup Utility v{VERSION} ---")
    # Este script es orquestado por Antigravity para el ciclo de vida del código
