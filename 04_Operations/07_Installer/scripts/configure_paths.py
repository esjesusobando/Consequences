"""
configure_paths.py - Configura las rutas en .mcp.json y hooks
"""

import os
import json
import shutil
import time


# Placeholders que se reemplazan en .mcp.json
PLACEHOLDERS = {
    "{{USER_DOWNLOADS}}": "paths.downloads",
    "{{USER_OBSIDIAN}}": "paths.obsidian_vault",
    "{{USER_EXCALIDRAW}}": "paths.excalidraw",
}

# Rutas en .mcp.json que usan placeholders
MCP_PATH_FIELDS = {
    "filesystem": "args",
    "mcp-obsidian": "args",
    "obsidian-api": "args",
    "excalidraw-yctimlin": "env",
}


# Hooks a registrar
HOOKS_TO_REGISTER = {"Stop": [".agent/04_Extensions/hooks/03_Lifecycle/stop.py"]}


def get_project_root():
    """Obtiene la raíz del proyecto"""
    return os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def register_hooks():
    """Registra los hooks en settings.local.json"""

    project_root = get_project_root()
    settings_path = os.path.join(project_root, ".claude", "settings.local.json")

    # Crear directorio si no existe
    os.makedirs(os.path.dirname(settings_path), exist_ok=True)

    # Cargar settings existente o crear nuevo
    settings = {}
    if os.path.exists(settings_path):
        try:
            with open(settings_path, "r", encoding="utf-8") as f:
                settings = json.load(f)
        except json.JSONDecodeError:
            settings = {}

    # Asegurar que existe la sección hooks
    if "hooks" not in settings:
        settings["hooks"] = {}

    # Agregar hooks
    hooks_added = []
    for hook_type, scripts in HOOKS_TO_REGISTER.items():
        if hook_type not in settings["hooks"]:
            settings["hooks"][hook_type] = []

        for script in scripts:
            script_path = os.path.join(project_root, script)
            if (
                os.path.exists(script_path)
                and script not in settings["hooks"][hook_type]
            ):
                settings["hooks"][hook_type].append(script)
                hooks_added.append(f"{hook_type}: {script}")

    # Guardar settings
    if hooks_added:
        try:
            with open(settings_path, "w", encoding="utf-8") as f:
                json.dump(settings, f, indent=2)
            print("  ✓ Hooks registrados en .claude/settings.local.json")
            for hook in hooks_added:
                print(f"    + {hook}")
            return True
        except Exception as e:
            print(f"  ⚠ Error guardando hooks: {e}")
            return False
    else:
        print("  = Hooks ya registrados")
        return True


def load_config(config_path):
    """Carga el archivo de configuración"""
    with open(config_path, "r") as f:
        return json.load(f)


def validate_paths(config):
    """Valida que las rutas existan"""
    paths = config.get("paths", {})
    valid = True

    for key, path in paths.items():
        if not path:
            print(f"⚠ Ruta {key} vacía")
            continue

        # Escapear para Windows
        path_expanded = os.path.expandvars(path)

        if os.path.exists(path_expanded):
            print(f"✓ {key}: {path_expanded}")
        else:
            print(f"❌ {key} NO existe: {path_expanded}")
            valid = False

    return valid


def replace_mcp_paths(mcp_content, config, retry_count=3):
    """
    Reemplaza los placeholders en .mcp.json

    Returns:
        str: Contenido del archivo modificado
    """
    paths = config.get("paths", {})

    for placeholder, config_key in PLACEHOLDERS.items():
        keys = config_key.split(".")
        value = config
        for k in keys:
            value = value.get(k, "")

        if value:
            # Reemplazar en el contenido
            mcp_content = mcp_content.replace(placeholder, value)
            print(f"✓ Reemplazado {placeholder} → {value}")

    return mcp_content


def merge_mcp_json(new_content, existing_path, retry_count=3):
    """
    Merge inteligente de .mcp.json
    No sobreescribe configs existentes del usuario
    """
    if not os.path.exists(existing_path):
        return new_content

    print(f"📄 Merge con .mcp.json existente...")

    try:
        with open(existing_path, "r") as f:
            existing = json.load(f)
    except json.JSONDecodeError:
        print("⚠ .mcp.json existente corrupto. Usando nuevo.")
        return new_content

    try:
        new_data = json.loads(new_content)
    except json.JSONDecodeError:
        print("❌ Nuevo .mcp.json inválido")
        return existing

    # Merge: agregar solo servidores nuevos
    existing_servers = existing.get("mcpServers", {})
    new_servers = new_data.get("mcpServers", {})

    for name, config in new_servers.items():
        if name not in existing_servers:
            existing_servers[name] = config
            print(f"  + Añadido: {name}")
        else:
            print(f"  = Mantenido: {name}")

    return json.dumps({"mcpServers": existing_servers}, indent=2)


def backup_mcp_json(mcp_path):
    """Hace backup de .mcp.json antes de modificar"""
    if not os.path.exists(mcp_path):
        return  # No hay archivo existente para backup

    backup_path = f"{mcp_path}.backup.{int(time.time())}"
    shutil.copy2(mcp_path, backup_path)
    print(f"✓ Backup creado: {backup_path}")


def configure_mcp(config, project_root, retry_count=3):
    """Configura .mcp.json con las rutas"""
    # Buscar en .claude/ (nueva ubicación) o raíz (legacy)
    mcp_path = os.path.join(project_root, ".claude", "mcp.json")
    if not os.path.exists(mcp_path):
        mcp_path = os.path.join(project_root, ".mcp.json")  # Legacy fallback

    template_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", ".mcp.template.json"
    )

    # Si no existe template, crear desde actual
    if not os.path.exists(template_path):
        if os.path.exists(mcp_path):
            print("📄 Creando template desde .mcp.json actual...")
            # Reemplazar rutas por placeholders
            with open(mcp_path, "r", encoding="utf-8") as f:
                content = f.read()

            # Reemplazar rutas por placeholders
            for placeholder, config_key in PLACEHOLDERS.items():
                keys = config_key.split(".")
                value = config.get("paths", {})
                for k in keys:
                    value = value.get(k, "")

                if value:
                    content = content.replace(value, placeholder)

            with open(template_path, "w") as f:
                f.write(content)
            print(f"✓ Template creado: {template_path}")

    # Cargar template
    if os.path.exists(template_path):
        with open(template_path, "r") as f:
            mcp_content = f.read()
    else:
        print("❌ No se encontró template de .mcp.json")
        return False

    # Reemplazar placeholders con rutas reales
    mcp_content = replace_mcp_paths(mcp_content, config)

    # Insertar API keys
    api_keys = config.get("api_keys", {})
    for key_name, api_key in api_keys.items():
        if api_key:
            # Reemplazar en el contenido
            # Buscar el patrón específico para cada API
            if key_name == "context7" and "CONTEXT7_API_KEY" in mcp_content:
                mcp_content = mcp_content.replace(
                    '"CONTEXT7_API_KEY": ""', f'"CONTEXT7_API_KEY": "{api_key}"'
                )
            elif key_name == "exa" and "EXA_API_KEY" in mcp_content:
                mcp_content = mcp_content.replace(
                    '"EXA_API_KEY": ""', f'"EXA_API_KEY": "{api_key}"'
                )
            # ... agregar más según necesidad
            print(f"✓ API key insertada: {key_name}")

    # Merge con existente
    mcp_content = merge_mcp_json(mcp_content, mcp_path)

    # Asegurar que existe .claude/
    mcp_dir = os.path.dirname(mcp_path)
    os.makedirs(mcp_dir, exist_ok=True)

    # Backup antes de escribir
    backup_mcp_json(mcp_path)

    # Escribir resultado
    with open(mcp_path, "w", encoding="utf-8") as f:
        f.write(mcp_content)

    print(f"✓ .mcp.json configurado: {mcp_path}")
    return True


def validate_api_key_format(key_name, api_key):
    """Valida formato básico de API key"""
    if not api_key:
        return True  # Vacío es válido (opcional)

    # Validaciones básicas por servicio
    validations = {
        "context7": lambda k: k.startswith("ctx7sk-"),
        "exa": lambda k: len(k) > 10,
        "fireflies": lambda k: len(k) > 10,
        "github": lambda k: k.startswith("github_pat_"),
        "notion": lambda k: k.startswith("ntn_"),
    }

    validator = validations.get(key_name)
    if validator and not validator(api_key):
        print(f"⚠ API key {key_name} podría ser inválida")
        return False

    return True


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        config_path = sys.argv[1]
    else:
        config_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "..", "config.json"
        )

    print("=== Configurando Rutas ===")

    config = load_config(config_path)

    print("\n--- Validando rutas ---")
    if not validate_paths(config):
        print("❌ Algunas rutas no existen")

    print("\n--- Configurando MCPs ---")
    project_root = os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    )
    configure_mcp(config, project_root)

    print("=== Configuración completada ===")
