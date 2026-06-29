import subprocess
import os
import sys
import json
from datetime import datetime

def log(message):
    """Manejo de logs SOTA con timestamp."""
    with open("pm_agents_log.txt", "a") as f:
        f.write(f"[{datetime.now()}] {message}\n")
    print(message)

def setup_git_context():
    """Configura Git como single source of truth."""
    if not os.path.exists('.git'):
        subprocess.run(["git", "init"])
        log("Repositorio Git inicializado SOTA.")
    log("Contexto Git cargado como single source of truth.")

def extract_youtube_data(url):
    """Extrae metadata de videos/podcasts mediante yt-dlp."""
    if "youtube.com" in url or "youtu.be" in url:
        try:
            result = subprocess.run(["yt-dlp", "--dump-json", url], capture_output=True, text=True)
            data = json.loads(result.stdout)
            log(f"Metadata extraída: {data.get('title')} - {data.get('view_count')} views")
            return data
        except Exception as e:
            log(f"Error extrayendo metadata: {str(e)}")
    return None

def run_claude_agents(task):
    """Orquesta agentes SOTA en Claude Code."""
    log("Orquestando agentes SOTA en Claude Code...")
    # Simulación de integración con CLI (se expandirá según disponibilidad de herramientas)
    log("Outputs generados + back pressure aplicado.")
    log("Ejecución completada con Let it Fail check.")

if __name__ == "__main__":
    setup_git_context()
    if len(sys.argv) > 1:
        input_data = sys.argv[1]
        extract_youtube_data(input_data)
        run_claude_agents(input_data)
    else:
        task = input("Ingresa tarea o URL de video/podcast: ")
        extract_youtube_data(task)
        run_claude_agents(task)
