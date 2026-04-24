"""
detect_machine.py - Detecta si es la misma máquina o necesita configuración
"""

import os
import json
import hashlib
import platform
import uuid


def get_machine_id():
    """Genera un ID único basado en el hardware"""
    # Combinar múltiples identifiers para mayor precisión
    identifiers = [
        platform.node(),  # Hostname
        platform.machine(),  # Arquitectura
        platform.processor(),  # Procesador
    ]

    # Agregar MAC address si está disponible
    try:
        mac = ":".join(
            ["{:02x}".format((uuid.getnode() >> i) & 0xFF) for i in range(0, 48, 8)]
        )
        identifiers.append(mac)
    except:
        pass

    # Generar hash único
    combined = "|".join(identifiers)
    return hashlib.sha256(combined.encode()).hexdigest()[:16]


def detect_same_machine():
    """
    Detecta si es la misma máquina donde se configuró PersonalOS

    Returns:
        tuple: (is_same_machine: bool, message: str)
    """
    installer_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(installer_dir)
    env_dir = os.path.join(project_root, "05_System", "04_Env")
    machine_id_file = os.path.join(env_dir, ".machine_id")

    # Verificar que existe el directorio de entorno
    if not os.path.exists(env_dir):
        print(f"📁 Creando directorio de entorno: {env_dir}")
        os.makedirs(env_dir, exist_ok=True)

    # Si no existe .machine_id, es primera vez
    if not os.path.exists(machine_id_file):
        return False, "Primera vez: No se encontró configuración previa"

    # Verificar que no esté vacío
    with open(machine_id_file, "r") as f:
        saved_id = f.read().strip()

    if not saved_id:
        return False, "Archivo .machine_id vacío. Regenerando..."

    # Comparar con el ID actual
    current_id = get_machine_id()

    if current_id == saved_id:
        return True, "✓ Máquina reconocida"

    return False, f"Machine ID no coincide: {saved_id[:8]}... vs {current_id[:8]}..."


def save_machine_id():
    """Guarda el ID de la máquina actual"""
    installer_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(installer_dir)
    env_dir = os.path.join(project_root, "05_System", "04_Env")
    machine_id_file = os.path.join(env_dir, ".machine_id")

    os.makedirs(env_dir, exist_ok=True)

    current_id = get_machine_id()

    with open(machine_id_file, "w") as f:
        f.write(current_id)

    return current_id


if __name__ == "__main__":
    is_same, message = detect_same_machine()
    print(f"Detección: {message}")
    print(f"¿Misma máquina? {is_same}")
