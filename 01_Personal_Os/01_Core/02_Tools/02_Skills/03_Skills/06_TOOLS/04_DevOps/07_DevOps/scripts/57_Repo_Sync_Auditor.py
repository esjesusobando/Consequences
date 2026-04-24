import sys
from pathlib import Path

# === PROTOCOLO DE RUTA DINÁMICA (v6.1) ===
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "01_Core").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "08_Scripts_Os"))
from config_paths import *


def sync_repo(repo_path):
    """Realiza fetch y pull si hay cambios en el repo."""
    print(f"Auditorando: {repo_path}")
    try:
        # Fetch remoto
        subprocess.run(["git", "fetch"], cwd=repo_path, check=True, capture_output=True)
        # Verificar si hay cambios
        status = subprocess.run(
            ["git", "rev-list", "HEAD..origin/main", "--count"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            check=True,
        )

        count = int(status.stdout.strip())
        if count > 0:
            print(f"  -> Cambios detectados ({count} commits). Actualizando...")
            subprocess.run(["git", "pull"], cwd=repo_path, check=True)
            return True
        else:
            print("  -> Ecosistema al día.")
            return False
    except Exception as e:
        print(f"  -> [ERR] Fallo al sincronizar {repo_path}: {e}")
        return False


def main():
    # Usar constante dinámica de config_paths
    base_dir = UNICORN_DIR / "10_Repos_Gentleman"
    if not base_dir.exists():
        print(f"Directorio de respaldo no encontrado: {base_dir}")
        sys.exit(0)

    for repo in os.listdir(base_dir):
        repo_path = os.path.join(base_dir, repo)
        if os.path.isdir(os.path.join(repo_path, ".git")):
            sync_repo(repo_path)


if __name__ == "__main__":
    main()
