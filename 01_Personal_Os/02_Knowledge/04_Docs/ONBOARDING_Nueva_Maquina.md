# ONBOARDING — Nueva Máquina
## Think Different PersonalOS v3.1 — Consequences

*Última actualización: 2026-04-28*

---

## 📋 Índice

1. [Prerequisites](#-prerequisites)
2. [Instalación del Sistema](#-instalación-del-sistema)
3. [Configuración Post-Instalación](#-configuración-post-instalación)
4. [Verificación](#-verificación)
5. [Troubleshooting](#-troubleshooting)

---

## 🔴 Prerequisites

### Software Requerido

| Software                   | Versión Mínima                 | Propósito                                      | Instalador                                        |
|---------------------------|-------------------------------|-----------------------------------------------|--------------------------------------------------|
| **Python**                 | 3.10+                          | Motor del OS y scripts                         | [python.org](https://python.org)                  |
| **Git**                    | 2.30+                          | Control de versiones                           | [git-scm.com](https://git-scm.com)                |
| **Node.js**                | 18+                            | MCPs y herramientas de frontend                | [nodejs.org](https://nodejs.org)                  |

### Recomendado

| Software                       | Propósito                                                        |
|-------------------------------|-----------------------------------------------------------------|
| **uv**                         | Gestor de paquetes Python rápido (fallback a pip)                |
| **Claude Code**                | Agente principal del OS                                          |
| **OpenCode**                   | Agente secundario                                                |

### Verificar Instalación

```bash
# Verificar Python
python --version
# Esperado: Python 3.10+ (ej: Python 3.12.3)

# Verificar Git
git --version
# Esperado: git version 2.40+

# Verificar Node
node --version
# Esperado: v18+ o v20+
```

---

## 📦 Instalación del Sistema

### Paso 1 — Clonar el Repositorio

```bash
# Crear directorio de trabajo
mkdir -p "C:\Users\TU_USUARIO\Documents\Think_Different"
cd "C:\Users\TU_USUARIO\Documents\Think_Different"

# Clonar repositorio
git clone https://github.com/TU_USER/Think_Different.git .

# O si ya tienes el repo en un medio externo:
# Copiar toda la carpeta Think_Different a la nueva máquina
```

### Paso 2 — Ejecutar el Instalador

```bash
# Navegar al directorio del installer
cd "C:\Users\TU_USUARIO\Documents\Think_Different\01_Personal_Os\04_Operations\04_Installer"

# Ejecutar instalador (modo interactivo)
python installer.py
```

El instalador automáticamente:

- ✅ Detecta si es la **misma máquina** (modo migrate) o **nueva** (modo new)
- ✅ Verifica estructura del proyecto
- ✅ Instala dependencias Python (colorama, packaging)
- ✅ Carga/configura `.mcp.json` con tus API keys
- ✅ Registra machine ID
- ✅ Configura aliases del System Guardian
- ✅ Registra hooks (Stop hook para Session Handover)
- ✅ Ejecuta System Guardian como validación final

### Paso 3 — Seguir las Instrucciones del Instalador

El instalador es **interactivo**. Te pedirá:

```
=== CONFIGURACIÓN INTERACTIVA ===

--- RUTAS DEL SISTEMA ---
Ruta de Downloads: [C:\Users\TU_USUARIO\Downloads]
Ruta del Vault de Obsidian: [C:\Users\TU_USUARIO\Obsidian Vault]
Ruta de Diagramas Excalidraw: [C:\Users\TU_USUARIO\Documents\Diagramas Excalidraw]

--- API KEYS (opcional) ---
Context7 API Key: [tu-key]
Exa API Key: [tu-key]
GitHub PAT: [tu-key]
...
```

#### Keys Requeridas vs Opcionales

| API Key                       | Requerida                     | Notas                                       |
|------------------------------|------------------------------|--------------------------------------------|
| **GitHub PAT**                | ⚠️ Recomendada                | Para git operations                         |
| **Context7**                  | ⚠️ Recomendada                | Investigación de código                     |
| **Exa**                       | ⚠️ Recomendada                | Búsqueda web                                |
| Fireflies                     | 🔄 Opcional                    | Transcripciones de reuniones                |
| Notion                        | 🔄 Opcional                    | Notas conectadas                            |
| Supabase                      | 🔄 Opcional                    | Base de datos                               |
| Linear                        | 🔄 Opcional                    | Gestión de tareas                           |
| Others                        | 🔄 Opcional                    | Otros MCPs                                  |

### Paso 4 — Configurar AI Assistants

#### Claude Code (Primary)

1. Instalar Claude Code desde [claude.ai/code](https://claude.ai/code)
2. Autenticarse con cuenta Anthropic
3. Abrir el directorio del proyecto:
   ```bash
   cd "C:\Users\TU_USUARIO\Documents\Think_Different"
   claude
   ```
4. El sistema cargará automáticamente:
   - `AGENTS.md` como configuración principal
   - `CLAUDE.md` para configuración adicional
   - Hooks configurados

#### OpenCode (Secondary)

1. Configurar en `~/.config/opencode/opencode.json`
2. Copiar `.mcp.json` a la raíz del proyecto o a `~/.config/opencode/`

---

## ⚙️ Configuración Post-Instalación

### Aliases del System Guardian

El instalador intenta configurar estos aliases automáticamente:

| Alias                      | Comando                                  | Propósito                                    |
|---------------------------|-----------------------------------------|---------------------------------------------|
| `gr`                       | System Guardian dry-run                  | Validar estructura                           |
| `gra`                      | System Guardian con fixes                | Validar y auto-arreglar                      |
| `gr-agents`                | System Guardian agents                   | Solo validación con 3 agentes                |

#### Configuración Manual (si el installer falló)

**Windows (PowerShell) — Agregar a $PROFILE:**

```powershell
# Ubicación del profile
notepad $PROFILE

# Agregar estas líneas
function gr { python "C:\Users\TU_USUARIO\Documents\Think_Different\01_Personal_Os\04_Operations\03_Scripts_Os\10_Legacy\79_System_Guardian.py" }
function gra { python "C:\Users\TU_USUARIO\Documents\Think_Different\01_Personal_Os\04_Operations\03_Scripts_Os\10_Legacy\79_System_Guardian.py" --apply }
```

**Windows (Git Bash / MSYS2):**

```bash
# Agregar a ~/.bashrc o ~/.profile
alias gr='python "C:/Users/TU_USUARIO/Documents/Think_Different/01_Personal_Os/04_Operations/03_Scripts_Os/10_Legacy/79_System_Guardian.py"'
alias gra='python "C:/Users/TU_USUARIO/Documents/Think_Different/01_Personal_Os/04_Operations/03_Scripts_Os/10_Legacy/79_System_Guardian.py" --apply'
```

### Hooks Configurados

El installer registra automáticamente el hook de **Session Handover** en `.claude/settings.local.json`:

```json
{
  "hooks": {
    "Stop": [
      ".agent/04_Extensions/hooks/03_Lifecycle/stop.py"
    ]
  }
}
```

Este hook ejecuta System Guardian al cerrar una sesión.

### Rutas en .mcp.json

El installer reemplaza placeholders en `.mcp.json`:

| Placeholder                          | Se Reemplaza Con                            |
|-------------------------------------|--------------------------------------------|
| `{{USER_DOWNLOADS}}`                 | Tu carpeta de Downloads                     |
| `{{USER_OBSIDIAN}}`                  | Ruta del vault de Obsidian                  |
| `{{USER_EXCALIDRAW}}`                | Ruta de diagramas Excalidraw                |

---

## ✅ Verificación

### Verificar que Todo Funciona

```bash
# 1. Verificar estructura (debe estar vacio si todo esta bien)
gr

# 2. Verificar Python y dependencias
cd "C:\Users\TU_USUARIO\Documents\Think_Different\01_Personal_Os\04_Operations\04_Installer"
python scripts/setup_dependencies.py

# 3. Verificar MCPs activos
# En Claude Code:
/mcp list

# 4. Probar Genesis Workflow
# Leer .agent/03_Workflows/02_Marvel/01_Iron_Man_Gen.md y seguir pasos
```

### Checklist de Verificación

| Componente                    | Verificación                                        | Esperado                         |
|------------------------------|----------------------------------------------------|---------------------------------|
| **Python**                    | `python --version`                                  | Python 3.10+                     |
| **Git**                       | `git --version`                                     | git version 2.30+                |
| **Node**                      | `node --version`                                    | v18+                             |
| **Estructura**                | `gr` (System Guardian)                              | 0 issues                         |
| **Hooks**                     | `.claude/settings.local.json` existe                | JSON válido                      |
| **.mcp.json**                 | Existe en `.claude/` o raíz                         | Configurado                      |
| **Aliases**                   | `gr` en terminal                                    | Funciona                         |

---

## 🔧 Troubleshooting

### Error: "Python no encontrado"

```bash
# Verificar que Python está en PATH
where python

# Si no está, reinstallar Python marcando "Add to PATH"
```

### Error: "uv no encontrado" (fallback a pip)

Normal, el installer usa pip como fallback automáticamente.

```bash
# Instalar uv manualmente (opcional, acelera instalaciones)
pip install uv
```

### Error: "Hook no registrado"

```bash
# Registrar manualmente
cd "C:\Users\TU_USUARIO\Documents\Think_Different"
mkdir -p .claude
```

Luego crear `.claude/settings.local.json` con el contenido de hooks mostrado arriba.

### Error: "Structure check FAIL"

```bash
# Ejecutar con auto-fix
gra

# O verificar manualmente que las 4 carpetas raíz existen:
# - 00_Winter_is_Coming/
# - 01_Personal_Os/
# - 02_Playground/
# - 03_Resultado/
```

### Error: ".mcp.json no configurado"

```bash
# El installer crea el archivo pero no sobreescribe configs existentes
# Verificar que el template existe:
cd "C:\Users\TU_USUARIO\Documents\Think_Different\01_Personal_Os\04_Operations\04_Installer"
ls -la .mcp.template.json

# Si no existe, copiar .mcp.json existente y crear template manualmente
```

### MCPs No Funcionan

```bash
# Verificar que las API keys están en .mcp.json
# Buscar patrones como "CONTEXT7_API_KEY": "tu-key-aqui"

# Si están vacías, editar .mcp.json manualmente y agregar las keys
```

### Sistema Lento o Con Problemas

```bash
# 1. Ejecutar System Guardian completo
gra

# 2. Verificar que no hay archivos duplicados o huérfanos
# 3. Verificar que todos los paths en config.json son válidos
```

---

## 📚 Recursos Adicionales

| Recurso                            | Ubicación                                                  | Propósito                               |
|-----------------------------------|-----------------------------------------------------------|----------------------------------------|
| **README.md**                      | Raíz del proyecto                                          | Overview del sistema                    |
| **AGENTS.md**                      | 00_Winter_is_Coming/                                       | Configuración de agentes                |
| **CLAUDE.md**                      | Raíz del proyecto                                          | Reglas del sistema                      |
| **OS_DIRECTORY.md**                | Raíz del proyecto                                          | JARVIS discovery                        |
| **HUBs**                           | 01_Personal_Os/04_Operations/03_Scripts_Os/                | Automatizaciones                        |
| **Skills**                         | 01_Personal_Os/01_Core/02_Tools/02_Skills/                 | 299+ skills (12 áreas)                  |

---

## 🎯 Quick Start Post-Instalación

Una vez todo configurado, para empezar a trabajar:

```bash
# 1. Abrir Claude Code en el directorio del proyecto
cd "C:\Users\TU_USUARIO\Documents\Think_Different"
claude

# 2. Ejecutar Genesis Workflow (carga contexto completo)
# Leer: .agent/03_Workflows/02_Marvel/01_Iron_Man_Gen.md

# 3. Verificar estado del sistema
gr

# 4. ¡Listo para trabajar!
```

---

## 📞 Soporte

Si algo falla:

1. **Revisar este documento** — Sección Troubleshooting
2. **Ejecutar `gr`** — System Guardian indica problemas específicos
3. **Consultar AGENTS.md** — Configuración de agentes
4. **Revisar Process Notes** — `01_Personal_Os/04_Operations/00_Context_LLM/01_Process_Notes/`

---

*Think Different PersonalOS v3.1 — Consequences*
*Documento generado: 2026-04-28*
