# RE: Claude Code para marketing (Setup completo)

```
VIDEO ID:   vINrPqUxnho
TITLE:      Claude Code para marketing (Setup completo)
AUTHOR:     Lorena Bordonaba - Inteligencia Artificial
LANGUAGE:   Spanish
TYPE:       Tutorial / Setup Guide
DATE:       2026-06-25
RATING:     ★★★★★
URL:        https://youtu.be/vINrPqUxnho
TOPIC:      Claude Code setup for marketing workflows
```

---

## 🧠 Core Thesis

Setup completo de Claude Code explicado en 7 piezas clave desde una perspectiva de marketing profesional. El valor diferencial del video es que NO trata Claude Code como una herramienta de desarrollo, sino como un **asistente agéntico operativo** para marketers que trabajan con contenido en múltiples plataformas. La terminal no requiere saber programar; se opera por comandos en lenguaje natural.

---

## ⚡ Key Concepts

### 1. Tres formas de usar Claude Code
| Forma | Uso |
|-------|-----|
| **Web** | Para probar, sin instalar nada. Limitado. |
| **Desktop App** | Popular, pero con limitaciones de edición visual de archivos. |
| **IDE + Terminal** | **Máximo poder.** Puede leer/escribir archivos locales, integrarse con el sistema de archivos real, usar MCPs y tools. |

### 2. Instalación (desde IDE, no desde App)
- Extension **Claude Dev** en VS Code (o Cursor, Windsurf)
- `claude` en terminal
- `claude config set` para configuración
- `claude mcp add` para conectar servicios externos
- Directorio de trabajo como proyecto; Claude Code solo accede a donde se le permite

### 3. Estructura de Proyecto
- Carpeta raíz del proyecto (ej: carpeta "Contenido Marketing")
- Subcarpetas: una por red social (LinkedIn, Instagram, YouTube, Blog)
- Subcarpetas por tipo de contenido (posts, scripts, thumbnails)
- `CLAUDE.md` en la raíz

### 4. CLAUDE.md — El archivo más importante
- Memoria de proyecto: le dice a Claude Code quién es, qué stack usa, cómo trabajar
- Máximo **200-500 líneas** (si es más, se come todo el contexto)
- Debe contener:
  - Descripción del proyecto
  - Reglas de trabajo (qué hacer/sí, qué no hacer/no)
  - Stack técnico
  - Comandos útiles
  - Preferencias del equipo
- **Se debe mantener actualizado** — igual que el código base
- Si se vuelve obsoleto, Claude Code empieza a alucinar o trabajar mal
- Formato libre (Markdown), no YAML estricto

### 5. Connectors: MCPs + Tools

| | **MCP** | **Tools** |
|---|---|---|
| Qué es | Protocolo estándar para conectar servicios externos | Herramientas custom sin dependencias externas |
| Ejemplos | Notion, Higgsfield, Gmail, Google Calendar, WhatsApp | Screenshots, transcripción de audio, conexión a APIs propias |
| Límite | **Máximo 3 por proyecto** (consume tokens) | Puedes tener todas las que necesites |
| Alcance | Se conectan a APIs de terceros | Operaciones locales y scripts propios |

**Regla clave:** No satures de MCPs. Cada uno carga definiciones de herramientas en cada llamada. 3 MCPs es el sweet spot para proyectos de marketing.

### 6. Agents — Especialización

Los agents NO son lo mismo que prompts. Un agent tiene:
- **Contexto** — sabe quién es y qué hace
- **Tools** — acceso a MCPs y herramientas
- **Memoria** — opcional, puede recordar entre sesiones
- **Objetivo** — no solo instrucciones, sino propósito

Se configuran en `~/.claude/agents/` (personales) o `.claude/agents/` (del proyecto). Se pueden crear para roles específicos: Research Agent, Content Agent, Publishing Agent.

**Diferencia clave con prompts:** Un prompt da instrucciones; un agent tiene tools, contexto, y puede operar autónomamente.

### 7. Skills — Manual de Instrucciones Reutilizable

Un skill es un "manual de instrucciones" para que Claude Code ejecute una tarea compleja. Tres formas de crearlos:

1. **Grabar un workflow** — haces la tarea con Claude Code, luego exportas el skill
2. **Skill Creator** — herramienta incorporada que guía la creación
3. **Terceros** — skills de la comunidad instalables

Formato:
```
name: "mi-skill"
description: "Lo que hace"
triggers:
  - "palabra clave"
steps:
  - agent: "research-agent"
    task: "investigar sobre X"
  - tool: "mcp-notion"
    task: "guardar en base de datos"
```

### 8. Operación Diaria

- `/plan` — **siempre planificar antes de ejecutar** (ahorra tokens, evita errores)
- `dangerously skip permissions` — solo cuando ya confías en la tarea y está bien testeada
- `/loop` — tareas en ciclo (ej: "cada viernes a las 10AM genera el reporte semanal")
- Mantener CLAUDE.md vivo — si el proyecto cambia, actualizarlo

---

## 🔬 Análisis Crítico

### Fortalezas
- **Estructura pedagógica clara**: 7 piezas que van de lo básico a lo avanzado, cada una construye sobre la anterior
- **Enfoque marketing-first**: No asume conocimientos técnicos, todo explicado en lenguaje de negocio
- **Énfasis en CLAUDE.md**: Correcto — es el archivo más infravalorado y el que más impacto tiene en la calidad del output
- **MCP vs Tools**: Buena distinción, especialmente el límite de 3 MCPs por proyecto
- **Agents ≠ Prompts**: Diferencia fundamental que muchos setups omiten

### Limitaciones
- No profundiza en cómo estructurar skills complejos con múltiples agents
- La parte de operación diaria es superficial — `/loop` merece más desarrollo
- No cubre integración con CI/CD ni versionado de skills
- No menciona testing de skills/agents antes de ponerlos en producción

### Oportunidades para el OS
- Nuestros flujos de Zero Consequences marketing pueden modelarse como **skills que orquestan agents**
- Los Higgsfield skills ya existentes pueden envolverse como tools dentro de un Content Agent
- La estructura del OS puede beneficiarse de tener CLAUDE.md por proyecto con las reglas de negocio claras
- Podemos crear un "Marketing Agent" que orqueste: Research → Content → Publishing → Brand

---

## 🔗 Related

- Lorena Bordonaba — Canal YouTube Inteligencia Artificial
- Claude Code Documentation — Anthropic
- Zero Consequences — Marketing Automation (OS)
- Higgsfield Skills — OS Skills/Video_Media

---

## 🧩 Personal Connection

Este video valida y expande decisiones que ya tomamos en el OS:
- La distinción MCP vs Tools confirma nuestra estructura de skills separados por responsabilidad
- El concepto de agents con contexto + tools + memoria es exactamente lo que necesitamos para los flujos de marketing automation
- El límite de 3 MCPs nos obliga a ser selectivos — priorizar los que más valor aportan
- Los skills como "manual de instrucciones" orquestando agents es EL patrón que falta en nuestros flujos actuales

**Takeaway inmediato:** Nuestro próximo paso debería ser crear un `Marketing Agent` que sea el orchestrator de todos los flujos de Zero Consequences, con skills específicos para cada tipo de contenido.

---

## 📋 Plan SOTA Asociado

> Este análisis generó el plan estratégico `2026-06-25-001-strat-learning-always-sota-plan.md` en `01_Memory/04_Docs/plans/` para transformar Learning Always de documentación pasiva a mejora activa del OS.
