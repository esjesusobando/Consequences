# Ingeniería Inversa — Sistema de Marketing Automation

## Arquitectura Extraída

```
.claude/
├── agents/
│   ├── redactor.md           → Sonnet: Escribe contenido (lee brand_voice.md)
│   ├── revisor.md            → Haiku: Evalúa calidad (devuelve JSON approval)
│   ├── publicador.md         → Haiku + Metricool MCP: Programa posts
│   └── carrusel-designer.md  → Sonnet + Higgsfield MCP: Diseña carruseles
└── skills/
    ├── publica-esto/SKILL.md    → Pipeline audio→publicado (orquestador)
    └── carrusels/SKILL.md       → Pipeline newsletter→carrusel (orquestador)
```

## Componentes Clave

### Agente Redactor
- Modelo: Sonnet (razonamiento fuerte para escritura creativa)
- Contexto: brand_voice.md (entrada) + transcripción
- Output: 3 LinkedIn posts, 1 newsletter, 1 Twitter thread
- Formato: Archivos markdown en `output/`

### Agente Revisor
- Modelo: Haiku (rápido, barato para evaluación)
- Input: brand_voice.md + contenido generado
- Output: JSON estructurado
  ```json
  {
    "aprobado_global": true/false,
    "piezas": {
      "linkedin_post_1": {"aprobado": true, "notas": "..."},
      "newsletter": {"aprobado": false, "notas": "Falta gancho inicial"}
    }
  }
  ```

### Agente Publicador
- Modelo: Haiku
- Tool: Metricool MCP (para programar posts)
- Condición: Solo ejecuta si revisor aprueba
- Output: URLs de posts programados

### Agente Carrusel-Designer
- Modelo: Sonnet
- Tool: Higgsfield MCP
- Contexto: brand_design.md
- Output: Slides de carrusel + imágenes generadas

## MCPs como Tool Attachments
Los MCPs se configuran en `.mcp.json` y los agentes los referencian. No todos los agentes tienen todos los MCPs — cada agente tiene solo los que necesita.

## Estructura de Output
```
output/
├── linkedin/
│   ├── post-1.md
│   ├── post-2.md
│   └── post-3.md
├── twitter/
│   └── thread.md
├── newsletter/
│   └── newsletter-2026-06-01.md
└── carrusel/
    └── carrusel-estructura-2026-06-01.md
```

## Pipeline Execution Flow
1. Skill `publica-esto` recibe ruta de audio
2. Paso 1: Ejecuta `transcribe.py` (bash)
3. Paso 2: Invoca agente `redactor` con transcripción
4. Paso 3: Invoca agente `revisor` con contenido generado
5. Paso 4: Si aprobado → invoca agente `publicador`
6. Paso 5: Muestra resumen de todo lo programado
