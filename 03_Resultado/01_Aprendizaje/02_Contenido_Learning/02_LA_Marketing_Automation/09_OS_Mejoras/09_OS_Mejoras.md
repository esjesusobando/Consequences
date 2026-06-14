# OS Mejoras — Marketing Automation

## Skills a Complementar

### 1. `01_Creacion_Contenidos/15_Audio_Pipeline/SKILL.md`
**Qué agregar:**
- Revisor agent con JSON approval gate (aprobado_global)
- Brand Design como archivo separado (referencia)
- MCP tool attachment pattern para agentes
- Pipeline steps documentados en la skill

### 2. `01_Creacion_Contenidos/14_Marketing_Tech/SKILL.md`
**Qué agregar:**
- Referencia al patrón de MCP como tool para agentes
- Documentar Metricool MCP como opción de scheduling
- Review gate pattern para contenido público

### 3. Higgsfield skills (`.agents/skills/higgsfield-*`)
**Qué agregar:**
- Contexto de brand_design.md como input para generación consistente
- Patrón carrusel-designer como referencia de uso

## Nuevos Patrones para el OS

### Review Gate Pattern
```
contenido → Agente Revisor → JSON {aprobado: bool} 
  → true: continuar pipeline
  → false: detener y reportar
```
Aplicar a cualquier pipeline que genere output público.

### Brand Voice + Brand Design como Source of Truth
- brand_voice.md → agentes de texto
- brand_design.md → agentes visuales
- Separación de concerns para cargar solo contexto necesario

### MCP como Tool de Agente
- No todos los agentes necesitan todos los MCPs
- Cada agente tiene solo los MCPs que necesita para su función
- Configurar en `.mcp.json` + referencia en el agente `.md`

## Archivos Nuevos Creados
- `02_Playground/07_Zero_Consequences/03_Marketing_Preview/Sistema de Marketing/Archivos referencia/` — sistema completo de referencia
- Skills, agentes, scripts y plantillas del sistema original
