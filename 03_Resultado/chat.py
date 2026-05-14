import requests
import json

# Datos proporcionados
api_key = "sk-cp-V_qGs0y5PwxDimHzxkaf62oEYq40x7otToq_e-_kNV7n1bgP21SMYRvS17E3ZEgxdJvVGwUl1lohZQD7mRbWw9TOGjwYcBU9iCw4W-vgM7Klq_KHGDAX4fQ"
group_id = "2046785719191482540"

url = f"https://api.minimax.chat/v1/text/chatcompletion_v2?GroupId={group_id}"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

payload = {
    "model": "abab6.5-chat",
    "messages": [
        {"role": "user", "content": "Hola, responde con una sola palabra para confirmar conexión."}
    ]
}

try:
    response = requests.post(url, headers=headers, json=payload)
    result = response.json()
    
    # Si la respuesta es exitosa y tiene el formato esperado
    if response.status_code == 200 and 'choices' in result:
        print("\n✅ Conexión Exitosa")
        print("Respuesta:", result['choices'][0]['message']['content'])
    else:
        # Si hay un error, mostramos el JSON completo para saber qué dice MiniMax
        print("\n❌ Error en la Respuesta del Servidor:")
        print(json.dumps(result, indent=2))
        
except Exception as e:
    print(f"\n��� Error de ejecución: {e}")
