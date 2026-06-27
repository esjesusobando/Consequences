#!/usr/bin/env python3
"""
35_SOTA_Skill_Modernizer.py
Recorre los SKILLS y les añade capacidades SOTA de Prompting (CoT, System Constraints).
Mejoras SOTA: Type hints estrictos, logging estructurado, manejo de excepciones defensivo.
"""
import os
import re
import logging
from pathlib import Path
from datetime import datetime
from typing import List, Tuple

# Configuración de Logging SOTA
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("SkillModernizer")

# Rutas
REPO_ROOT: Path = Path(__file__).resolve().parent.parent.parent.parent
SKILLS_DIR: Path = REPO_ROOT / "01_Personal_Os" / "01_Core" / "02_Tools" / "02_Skills"

SOTA_APPENDIX: str = """

---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on {date}*
"""

def process_skill(path: Path) -> bool:
    """Procesa un skill para inyectar reglas SOTA si no están presentes."""
    try:
        content: str = path.read_text(encoding="utf-8")
    except Exception as e:
        logger.error(f"Error leyendo {path.name}: {e}")
        return False

    if "SOTA Upgrade: Chain of Thought & System Constraints" in content:
        return False # Ya actualizado

    # Añadir metadata en YAML
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            frontmatter: str = parts[1]
            if "sota_upgraded: true" not in frontmatter:
                new_frontmatter = frontmatter.rstrip() + "\nsota_upgraded: true\n"
                content = f"---{new_frontmatter}---{parts[2]}"
    
    # Añadir apendice
    content += SOTA_APPENDIX.format(date=datetime.now().strftime("%Y-%m-%d"))

    try:
        path.write_text(content, encoding="utf-8")
        return True
    except Exception as e:
        logger.error(f"Error escribiendo {path.name}: {e}")
        return False

def main() -> None:
    logger.info("Iniciando SOTA Upgrade de Skills...")
    upgraded: int = 0
    skipped: int = 0
    
    if not SKILLS_DIR.exists():
        logger.error(f"El directorio de skills no existe: {SKILLS_DIR}")
        return

    for root, _, files in os.walk(SKILLS_DIR):
        for f in files:
            if f.endswith(".md") and f not in ("README.md", "INDEX_AREA_FUNCTIONAL.md", "MAPA_MIGRACION.md", "TOP_20_SKILLS.md"):
                path: Path = Path(root) / f
                if process_skill(path):
                    upgraded += 1
                else:
                    skipped += 1
                    
    logger.info(f"SOTA Upgrade completado. Skills actualizados: {upgraded}. Skipped (ya actualizados o error): {skipped}.")

if __name__ == "__main__":
    main()
