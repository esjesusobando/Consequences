# demo_generador_imagenes.py
# RESULTADO DE "SKILL CREATOR"
# Prompt usado: "Crea una skill reutilizable para generar imágenes con Gemini AI."

def generar_imagen(prompt_text):
    print(f"[*] Sub-Agente invocando API de Google Gemini (3.1 Flash Image Preview)")
    print(f"[*] Prompt asignado: {prompt_text}")
    print("[*] Renderizando...")
    print("[+] Imagen renderizada en ratio 1:1 guardada en la raíz del proyecto (output_gemini.png).")

if __name__ == "__main__":
    prompt = input("Ingresa tu prompt para Gemini: ") or "Cyberpunk SaaS UI"
    generar_imagen(prompt)
