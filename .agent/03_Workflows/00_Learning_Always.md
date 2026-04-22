---
name: learning
description: Workflow para transformar cualquier URL en conocimiento estructurado, integración al OS, y contenido ready-to-use. Genera 8 deliverable + automejora del OS.
argument-hint: "[URL del contenido - video, artículo, doc]"
---

# 26_Learning_Always — Knowledge Compounding Workflow

> **Versión:** 1.0 | **Fecha:** 2026-04-18 | **Owner:** Think_Different OS

## Propósito

Transformar cualquier contenido (URLs de YouTube, artículos, docs) en:
1. **Conocimiento estructurado** (8 deliverable)
2. **Contexto para el OS** (automejora con cada URL)
3. **Contenido para redes sociales** (listo para publicar)
4. **Prompts reutilizables** (para GEMs/GPTs)
5. **Ingeniería inversa** del contenido original

### Por qué es SOTA

- **Input agnostic**: Cualquier URL → mismo pipeline
- **Output compounding**: 8x ROI por cada input
- **Multi-perspectiva**: Mismo contenido × 7 perfiles de agente
- **Automejora integrada**: Cada URL mejora el OS
- **Megaprompt reutilizable**: Portable a cualquier LLM
- **Second brain real**: Información estructurada reusable

---

## Trigger

```
/Learning [URL]
/LA [URL]
```

## Input

- **URL**: Link al contenido (YouTube, artículo, blog, doc)
- **Transcripción**: (OPCIONAL) Si el usuario la provee manualmente

---

## PHASE 1: FETCH & RESEARCH

### Step 1.1: Detectar tipo de URL

```
- YouTube video    → Go to Step 1.2
- Articulo/Blog   → Go to Step 1.3
- Otro tipo       → Usar webfetch o Firecrawl
```

### Step 1.2: Si YouTube → Exa Web Search

```bash
# Buscar info del video en la web
-usar Exa MCP o websearch para encontrar:
  - Título del video
  - Descripción
  - Timestamp de capítulos
  - Herramientas mencionadas
  - Puntos principales

# SI NO encuentra resultados...
→ Warning al usuario: "No encontré info de este video. 
   ¿Tenés la transcripción? Si la tenés, pasámela y continuamos."

# SI encuentra → Continuar a Step 2
```

### Step 1.3: Si Articulo/Blog

```bash
# Usar webfetch o Firecrawl
- Extraer contenido completo
- Extraer metadata (autor, fecha, tema)
- Identificar secciones clave
```

---

## PHASE 2: PROCESS CONTENT

### Step 2.1: Extraer información clave

Para cada contenido, extraer:
- **Título principal** y subtítulo
- **Autor/Fuente** y fecha de publicación
- **Tema principal** y subtemas clave
- **Puntos principales** (5-7 lista)
- **Code examples** o demos encontradas
- **Herramientas** mencionadas
- **Conclusiones** o insights clave

### Step 2.2: Identificar herramientas del OS

```bash
# Para cada herramienta mencionada en el contenido:
1. Buscar en ../01_Core/03_Skills/
2. SI NO existe en contexto:
   - Investigar (websearch, codesearch)
   - Agregar al OS (crear skill o documentation)
   - Update inventory
3. SI YA existe:
   - Actualizar con nuevo conocimiento
   - Agregar a insights para Second Brain
```

### Step 2.3: Extraer prompts del contenido

```bash
# Buscar prompts que el autor/productor usa en el contenido:
- Prompts de sistemas
- Prompts de usuario
- Comandos o instrucciones clave

# Documentar:
- Versión original (ES o EN según corresponda)
- Adaptar a los 7 perfiles de agente
```

---

## PHASE 3: GENERATE OUTPUTS (8 Deliverables)

### Deliverable 1: Resumen 500 palabras

```markdown
## ES (Español)
- Accessible para Junior Developer
- Incluir contexto del tema
- Explicar conceptos complejos de forma simple
- Destacar puntos más importantes
- Incluir ejemplo práctica si es posible

## EN (English)
- Mismo contenido en inglés
- Mantener accesibilidad para juniors
```

### Deliverable 2: Prompts extraídos + 7 perfiles

```markdown
## Prompts ES

### Versión Original
[Prompts extracted del contenido]

### Para 7 Perfiles (ES):
01. Project Manager: [adaptación PM]
02. Product Manager: [adaptación PM]
03. Product Design: [adaptación Design]
04. Vibe Coding: [adaptación Vibe]
05. Testing: [adaptación QA]
06. DevOps: [adaptación DevOps]
07. Marketing: [adaptación Marketing]

## Prompts EN (same structure)
```

### Deliverable 3: Demos Junior

```markdown
## Tutoriales paso a paso

Para cada demo/code found:

### Demo X: [Nombre]
1. Qué es y para qué sirve (explicación simple)
2. Requisitos previos (qué necesita saber antes)
3. Paso a paso con código ejecutable
4. Errores comunes y cómo evitarlos
5. Ejercicio extra para practicar

## Código
[Include working code examples]
```

### Deliverable 4: Herramientas usadas

```markdown
## Herramientas identificadas

| # | Herramienta | Propósito | Versión |
|---|-------------|----------|--------|
| 1 | [Tool 1]   | [Use]    | [v]    |
| 2 | [Tool 2]   | [Use]    | [v]    |
... | ...        | ...      | ...

## Para el OS
[¿Agregar al contexto? SÍ/NO]
[Si es nuevo: investigación + agregar]
```

### Deliverable 5: Insights Second Brain

```markdown
## Insights para ~/Knowledge

- [Insight 1]
- [Insight 2]
...

## Insights para ~/Context

- [Insight para 07_Projects/00_Context/]
...

## Conexiones con conocimiento previo

- [Conexión 1]
- [Conexión 2]
```

### Deliverable 6: Posts Redes Sociales

```markdown
## Facebook (150-200 palabras)
[Post con emoji, call to action]

## Instagram
Caption: [125-150 palabras]
Hashtags: #[relevant] #[hashtags]

## X/Twitter (Thread 3-5 tweets)
Tweet 1: [280 chars]
Tweet 2: [280 chars]
...

## LinkedIn (150-200 palabras)
[Post profesional, insights de negocio]
```

### Deliverable 7: Mega Prompt customizado

```markdown
# MEGA PROMPT — [TEMA]

## Para usar en GEMs/GPTs

[Prompt maestro customizado con:
- Contexto del tema
- Prompts adaptados
- Código examples
- Herramientas específicas
- Instructions específicas del tema
]

## Cómo usar
1. Copiar el prompt
2. Pegar en el LLM de tu elección
3. El LLM podrá replicar el análisis
```

### Deliverable 8: Ingeniería Inversa

```markdown
## Análisis: Cómo fue construido

### Tecnologías usadas
- [Tech 1]: [Purpose]
- [Tech 2]: [Purpose]

### Patrones de diseño
- [Pattern 1]
- [Pattern 2]

### Estructura del contenido
- [Estructura 1]
- [Estructura 2]

### Qué podemos aprender
- [Learning 1]
- [Learning 2]

### Cómo replicar enfoques similares
- [Enfoque 1]
- [Enfoque 2]
```

---

## PHASE 4: INTEGRATE TO OS

### Step 4.1: Verificar herramientas en contexto

```bash
# Para cada herramienta identificada:
1. Buscar en ../01_Core/03_Skills/
2. SI NEW → Investigar → Agregar al OS
3. SI EXISTS → Update con nuevo conocimiento
```

### Step 4.2: Save to Engram

```bash
# Guardar conocimiento nuevo:
- Crear observation en Engram
- Agregar topic_key relevante
- Crear conexiones con conocimiento previo
```

---

## PHASE 5: SAVE & INDEX

### Step 5.1: Estructurar archivos

```
02_Knowledge/00_Second_Brain/
├── XX_LA_[Descripcion_Corta]/
│   ├── 00_Raw_Content.md
│   ├── 01_Resumen_500_Palabras.md
│   ├── 02_Prompts_Usados/
│   │   ├── ES.md
│   │   └── EN.md
│   ├── 03_Demos_Junior/
│   ├── 04_Herramientas.md
│   ├── 05_Insights_Segundo_Cerebro.md
│   ├── 06_Post_Redes/
│   │   ├── Facebook.md
│   │   ├── Instagram.md
│   │   ├── X_Twitter.md
│   │   └── LinkedIn.md
│   ├── 07_Mega_Prompt_Gems_GPTs.md
│   └── 08_Ingenieria_Inversa.md
├── 00_Index_Learnings.md
└── README.md
```

### Step 5.2: Index en 00_Index_Learnings.md

```markdown
## [XX] [Título] — [Fecha]

| Campo | Valor |
|-------|-------|
| URL   | [URL] |
| Tipo | [Video/Artículo/Doc] |
| Tema | [Tema principal] |
| Herramientas | [Lista] |
| Fecha processed | [YYYY-MM-DD] |
```

### Step 5.3: Notificar créditos

```bash
# SI se usa API (Exa, etc):
- Verificar créditos restantes
- SI < 10% → NOTIFICAR al usuario:
  "⚠️warning: Créditos de [API] al [X]%. 
   Considera reducir uso o recargar."
- NUNCA exceder el límite
```

---

## Credit Management

| API | Estado | Acción al 10% |
|-----|--------|--------------|
| Exa | [CHECK] | Notificar usuario |
| Firecrawl | [CHECK] | Notificar usuario |

---

## Error Handling

| Error | Solución |
|-------|---------|
| No info found | Request transcript al usuario |
| API error | Usar web search manual |
| Invalid URL | Request valid URL |
| Rate limit | Wait + retry o notify user |
| Timeout | Continuar con lo que hay + documentar |

---

## Ejemplo de Uso

```
USER: /Learning https://www.youtube.com/watch?v=b6hfk8k-UVk

AI: 
🔍 [1] Buscando info con Exa...
✅ [2] Encontré: Recall 2.0 - One Living Space for Your Knowledge
🛠️ [3] Herramientas: Recall app, AI chat, Knowledge Graph
📝 [4] Generando 8 deliverable...
🧠 [5] Integrando al OS...
   - Nueva herramienta: Recall (agregar al context)
   - Update knowledge base
✅ [6] Guardado en 02_Knowledge/00_Second_Brain/02_LA_Recall_20/

📊 Output: 
- ✅ Resumen 500 palabras (ES + EN)
- ✅ Prompts + 7 perfiles
- ✅ Demos Junior
- ✅ Herramientas (1 nueva para OS)
- ✅ Insights Second Brain
- ✅ Posts 4 redes
- ✅ Mega Prompt customizado
- ✅ Ingeniería Inversa
```

---

## Perfiles de Agente (para prompts)

| # | Perfil | Carpeta SKILL |
|---|-------|---------------|
| 01 | Project Manager | `02_Project_Manager` |
| 02 | Product Manager | `03_Product_Manager` |
| 03 | Product Design | `04_Product_Design` |
| 04 | Vibe Coding | `05_Vibe_Coding` |
| 05 | Testing | `06_Testing` |
| 06 | DevOps | `07_DevOps` |
| 07 | Marketing | `09_Marketing` |

---

## Changelog

- **v1.0** (2026-04-18): Versión inicial con 8 deliverables + automejora OS

// turbo-all