#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Notifier - Sistema de notificaciones y sonidos
Ejecuta sonidos al completar tareas importantes.

Usa: .agent/04_Extensions/hooks/04_Sound/task-complete-sound.ps1
"""

import sys
from pathlib import Path

# === PROTOCOLO DE RUTA DINÁMICA (v6.1) ===
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "01_Core").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "08_Scripts_Os"))
from config_paths import *

import subprocess
from datetime import datetime

# Path al script de sonido (usando constants)
SOUND_SCRIPT = SOUND_DIR / "task-complete-sound.ps1"


def play_success_sound():
    """Reproduce sonido de éxito."""
    if SOUND_SCRIPT.exists():
        try:
            subprocess.run(
                [
                    "powershell.exe",
                    "-ExecutionPolicy",
                    "Bypass",
                    "-File",
                    str(SOUND_SCRIPT),
                ],
                capture_output=True,
                timeout=5,
            )
        except:
            pass


def notify_start(task_name: str):
    """Notifica inicio de tarea."""
    print(f"\n[START] {task_name}")
    print("-" * 40)


def notify_complete(task_name: str):
    """Notifica completitud de tarea y reproduce sonido."""
    print(f"\n[COMPLETE] {task_name}")
    play_success_sound()


def notify_progress(current: int, total: int, task_name: str = ""):
    """Notifica progreso."""
    percentage = (current / total) * 100
    bar_length = 30
    filled = int(bar_length * current / total)
    bar = "=" * filled + "-" * (bar_length - filled)

    task_info = f" {task_name}" if task_name else ""
    print(
        f"\r[PROGRESS] {current}/{total} [{bar}] {percentage:.0f}%{task_info}",
        end="",
        flush=True,
    )

    if current == total:
        print()  # New line when complete


def run_tasks_with_notifications(tasks: list):
    """Ejecuta una lista de tareas con notificaciones."""
    total = len(tasks)

    for idx, task in enumerate(tasks, 1):
        task_name = task if isinstance(task, str) else task.get("name", f"Task {idx}")

        # Notify start
        notify_start(task_name)

        # Execute task (callable or string)
        if callable(task):
            task()
        else:
            print(f"  Ejecutando: {task}")

        # Notify progress
        notify_progress(idx, total, task_name)

    # Final sound
    notify_complete(f"All {total} tasks completed!")


# === MAIN ===
if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Modo: "start", "complete", "progress"
        mode = sys.argv[1]
        task_name = sys.argv[2] if len(sys.argv) > 2 else "Task"

        if mode == "start":
            notify_start(task_name)
        elif mode == "complete":
            notify_complete(task_name)
        elif mode == "progress":
            current = int(sys.argv[2])
            total = int(sys.argv[3])
            notify_progress(current, total)
        else:
            print(f"Modo desconocido: {mode}")
    else:
        print("[INFO] Notifier - Usa: notifier.py [start|complete|progress] [args]")
        print("  notifier.py start 'Tarea 1'")
        print("  notifier.py complete 'Tarea 1'")
        print("  notifier.py progress 3 5")
