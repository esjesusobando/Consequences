import os
import shutil

# --- PERSONALOS BRANDING ---
# AI-PRIME ENGINE: LOGIC RESTORER v1.0
# "Indestructible por diseño, superior por estética."
# ---------------------------

BACKUP_DIR = "08_ARCHIVE/backups/logic_gold"
ENGINE_DIR = "src/engine"

def restore_logic():
    print("🛡️ Iniciando Restauración de Lógica Maestra...")
    if not os.path.exists(BACKUP_DIR):
        print("❌ Error: No se encontró el punto de restauración 'logic_gold'.")
        return

    for filename in os.listdir(BACKUP_DIR):
        src = os.path.join(BACKUP_DIR, filename)
        dst = os.path.join(ENGINE_DIR, filename)
        if os.path.isfile(src):
            shutil.copy2(src, dst)
            print(f"✅ Restaurado: {filename}")

if __name__ == "__main__":
    restore_logic()
