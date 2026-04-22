# 🚀 Demos Junior — Recall 2.0

> Tutoriales paso a paso para empezar desde cero

---

## Demo 01: Guardar Tu Primer Contenido

### Paso 1: instalación
1. Ve a https://www.recall.it
2. Crea cuenta gratuita
3. Instala la browser extension (Chrome/Firefox)

### Paso 2: Primer save
1. Abrí un video de YouTube que te interese
2. Click en el ícono de Recall en tu browser
3. Listo — Recall lo resumes, organiza, y guarda

### Paso 3: Ver tu card
1. Entrá a recall.it/dashboard
2. Tu card aparece con resumen automático
3. Tags agregados por IA

**Tiempo total: 3 minutos**

---

## Demo 02: Chatear con Tu Conocimiento

### Paso 1: Abrir AI Chat
1. Desde el dashboard, click en "Chat"
2. Seleccioná "Chat with Knowledge"

### Paso 2: Hacer preguntas
```
"¿Qué dijo este video sobre AI?"
"Encontrá todo lo que guardé sobre [tema]"
"Compará esto con mis notas de la semana pasada"
```

### Paso 3: Experimentar dual mode
- Cambiá a "Chat with Knowledge + Internet"
- Ahora puede usar ambos recursos

**Tiempo total: 2 minutos**

---

## Demo 03: Crear Tu Primer Quiz

### Paso 1: Generar quiz
1. Abrí cualquier card
2. Click en "Generate Quiz"
3. Seleccioná tipos de preguntas

### Paso 2: Tipos disponibles
| Tipo | Ejemplo |
|------|--------|
| Multiple Choice | ¿Cuál es la función principal? |
| True/False | recall guarda solo PDFs |
| Fill in Blank | Recall fue fundado en ___ |
| Short Answer | ¿Por qué importan los graphs? |
| Matching | conecta concepto con definición |
| Ordering | Pasos del workflow |
| Flashcard | Definición de MCP |

### Paso 3: Tomar el quiz
1. Click "Start Quiz"
2. Responde las preguntas
3. Revisá respuestas y explicaciones

**Tiempo total: 5 minutos**

---

## Demo 04: Explorar Graph View

### Paso 1: Abrir graph
1. Desde sidebar, click "Graph View"
2. Ve节点 y conexiones

### Paso 2: Filtrar
- Por tags
- Por fecha
- Por tipo de contenido

### Paso 3: Crear conexiones manuales
1. Click en dos nodos
2. "Create Connection"
3. Escribí por qué se conectan
4. Ahora el graph muestra el path

**Tiempo total: 3 minutos**

---

## Demo 05: Usar MCP con Claude/ChatGPT

### Requisito previo
- Tener Claude Code u otro tool con MCP

### Configuración
1. Ve a Settings → API & MCP
2. Copiá la clave API
3. Agregá a tu tool:

```json
{
  "mcp_servers": {
    "recall": {
      "command": "npx",
      "args": ["-y", "@recall/mcp-server"],
      "env": {
        "RECALL_API_KEY": "tu-api-key"
      }
    }
  }
}
```

### Usar
Ahora podés decir: "Busca en mi Recall..." y el AI busca tu knowledge base

**Tiempo total: 10 minutos**

---

## 🎯 Checklist para Junior

- [ ] Account creada
- [ ] Extension instalada
- [ ] Primer contenido guardado
- [ ] Primer chat con knowledge
- [ ] Primer quiz generado
- [ ] Graph explorado
- [ ] MCP configurado (opcional)

---

*Demo basado en: Learning Always Methodology — Recall 2.0*