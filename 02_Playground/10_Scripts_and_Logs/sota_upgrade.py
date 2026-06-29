import os
import glob
import logging
import shutil

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

ROOT_DIR = r"c:\Users\sebas\Desktop\Think_Different\01_Personal_Os"

def check_and_fix_structure():
    logging.info("--- Fase 1: Estructura y Rutas ---")
    ops_dir = os.path.join(ROOT_DIR, "04_Operations")
    if os.path.exists(ops_dir):
        logging.warning("Anomalía detectada: 04_Operations no debería existir según Structure_v5.0.md.")
        # Se movería a donde corresponda. Para evitar borrar, lo moveremos a 07_Archive/04_Operations_Backup
        archive_dir = os.path.join(ROOT_DIR, "07_Archive", "04_Operations_Backup")
        if not os.path.exists(archive_dir):
            os.makedirs(archive_dir)
        try:
            shutil.move(ops_dir, archive_dir)
            logging.info(f"Movido {ops_dir} a {archive_dir}")
        except Exception as e:
            logging.error(f"Error moviendo {ops_dir}: {e}")

def upgrade_scripts():
    logging.info("--- Fase 2 y 3: Upgrades (SOTA) a Scripts ---")
    scripts_dir = os.path.join(ROOT_DIR, "05_Scripts")
    py_files = glob.glob(os.path.join(scripts_dir, "**", "*.py"), recursive=True)
    
    for py_file in py_files:
        with open(py_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        changed = False
        if "import logging" not in content:
            content = "import logging\nimport typing\n\nlogging.basicConfig(level=logging.INFO)\n" + content
            changed = True
            logging.info(f"Añadido logging y typing a {os.path.basename(py_file)}")
            
        if changed:
            with open(py_file, 'w', encoding='utf-8') as f:
                f.write(content)

def upgrade_skills():
    logging.info("--- Fase 3: Upgrades (SOTA) a Skills ---")
    skills_dir = os.path.join(ROOT_DIR, "00_Core", "02_Tools", "02_Skills")
    md_files = glob.glob(os.path.join(skills_dir, "**", "*.md"), recursive=True)
    
    cot_template = "\n\n## 🧠 State of the Art: Chain of Thought (CoT)\n> **Agent Reasoning:** Before executing tasks, always generate a step-by-step plan to ensure accuracy, context retention, and zero information loss.\n"
    
    for md_file in md_files:
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if "Chain of Thought" not in content and "CoT" not in content:
            content += cot_template
            with open(md_file, 'w', encoding='utf-8') as f:
                f.write(content)
            logging.info(f"Añadido CoT a skill: {os.path.basename(md_file)}")

if __name__ == "__main__":
    check_and_fix_structure()
    upgrade_scripts()
    upgrade_skills()
    logging.info("SOTA Upgrade completado.")
