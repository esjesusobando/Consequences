# 🧠 Learning: Claude Code para marketing (Setup completo)

> **Video:** Lorena Bordonaba — Claude Code para marketing (Setup completo)
> **URL:** https://youtu.be/vINrPqUxnho
> **Fecha:** 2026-06-25
> **ID:** vINrPqUxnho

---

## 📝 Resumen Ejecutivo

Setup completo de Claude Code estructurado en 7 piezas: Instalación → Estructura de proyecto → CLAUDE.md → Connectors (MCPs + Tools) → Agents → Skills → Operación diaria. El enfoque es 100% marketing: trata Claude Code como un asistente agéntico operativo para marketers, no como herramienta de desarrollo.

---

## 💡 Insights Clave

### 1. Tres formas de usar Claude Code
| Forma | Cuándo usarla |
|-------|--------------|
| **Web** | Probar conceptos, sin instalar. Limitado. |
| **Desktop App** | Popular, pero edición de archivos limitada. |
| **IDE + Terminal** | **La correcta.** Acceso total al sistema de archivos, MCPs, tools, skills. |

👉 **Conclusión para el OS:** La instalación desde IDE (VS Code/Cursor/Windsurf) es la que da máximo poder. La extensión Claude Dev en VS Code + `claude` en terminal es el setup definitivo.

### 2. Estructura de proyecto
- Una carpeta = un proyecto
- Subcarpetas por red social (LinkedIn, Instagram, YouTube, Blog)
- Subcarpetas por tipo de contenido (posts, scripts, thumbnails)
- `CLAUDE.md` en la raíz

👉 **Conclusión:** Nuestros flujos de Zero Consequences ya tienen estructura de proyecto. Podemos organizar los proyectos de marketing con esta misma estructura: un proyecto por cliente o por vertical de contenido.

### 3. CLAUDE.md — La memoria del proyecto
- **Formato libre (Markdown)**, no YAML estricto
- **Máximo 200-500 líneas** — más que eso consume todo el contexto
- **Contenido mínimo:** descripción, reglas, stack, comandos, preferencias
- **Se actualiza constantemente** — igual que el código
- Si está obsoleto, Claude Code alucina

👉 **Conclusión:** Este archivo es el más infravalorado y el de mayor impacto. Debemos tener un CLAUDE.md por cada proyecto de marketing del OS, con las reglas de negocio claras. Y revisarlo periódicamente.

### 4. Connectors: MCPs (externos) + Tools (locales)

**MCPs** (Model Context Protocol):
- Conectan con servicios externos: Notion, Gmail, Google Calendar, Higgsfield, WhatsApp
- **Máximo 3 por proyecto** — cada uno carga definiciones en cada llamada, consume tokens
- Se configuran con `claude mcp add`

**Tools** (herramientas custom):
- Operaciones locales sin dependencias externas
- Screenshots, transcripción de audio, conexión a APIs propias
- Sin límite práctico

👉 **Conclusión:** Esta distinción valida nuestra estructura actual. Nuestros Higgsfield skills son Tools, no MCPs. Debemos elegir los 3 MCPs estratégicos para marketing (Notion, Gmail, y uno más). No saturar.

### 5. Agents — Especialización con propósito
- **No son prompts.** Un prompt da instrucciones; un agent tiene contexto + tools + memoria + objetivo autónomo.
- Se configuran en `~/.claude/agents/` (personales) o `.claude/agents/` (del proyecto)
- Ejemplos: Research Agent, Content Agent, Publishing Agent
- Pueden tener memoria persistente entre sesiones

👉 **Conclusión:** El OS necesita crear agents especializados para marketing. Un "Marketing Agent" que orqueste los flujos de Zero Consequences, con tools y skills específicos. La diferencia agent ≠ prompt es clave.

### 6. Skills — Manual de instrucciones reutilizable
- Un skill es un workflow completo que orquesta agents + tools
- **Tres formas de crearlos:**
  1. **Grabar workflow** — haces la tarea con Claude Code, exportas como skill
  2. **Skill Creator** — herramienta guiada incorporada
  3. **Instalar de terceros** — comunidad
- Formato YAML: nombre, descripción, triggers, steps (agent + task)
- Los steps pueden llamar agents específicos o ejecutar tools

👉 **Conclusión:** Este es EL patrón que faltaba en nuestros flujos. Skills que orquestan agents. Nuestros flujos actuales de Zero Consequences deberían refactorizarse como skills YAML con steps que llaman agents especializados.

### 7. Operación Diaria
- `/plan` **antes de ejecutar** — ahorra tokens, evita errores, planifica el approach
- `dangerously skip permissions` — solo para tareas confiables y bien testeadas
- `/loop` — tareas recurrentes en ciclo automatizado
- Mantener CLAUDE.md vivo

👉 **Conclusión:** Incorporar `/plan` como paso obligatorio antes de cualquier ejecución compleja en el OS. Las tareas repetitivas de marketing (reportes semanales, revisión de métricas) son candidatas perfectas para `/loop`.

---

## 🔧 Herramientas Mencionadas

| Herramienta | Propósito | Prioridad |
|------------|-----------|-----------|
| VS Code / Cursor / Windsurf | IDE base para Claude Code | Alta |
| Claude Dev extension | Extensión VS Code para Claude Code | Alta |
| CLAUDE.md | Contexto y reglas del proyecto | **Crítica** |
| MCPs (max 3) | Conectar servicios externos | Alta |
| Tools | Herramientas custom locales | Media |
| Agents | Especialización con contexto + tools | Alta |
| Skills | Workflows reutilizables orquestando agents | **Crítica** |

---

## 🧩 Conexión con el OS

### Lo que ya tenemos bien
- Estructura de proyecto organizada (Zero Consequences con subsistemas)
- Tools para Higgsfield (imagen/video) ya separadas por responsabilidad
- Skills organizados por categoría en `01_Core/02_Tools/02_Skills/`

### Lo que podemos mejorar
1. **Crear agents de marketing** — Research, Content, Publishing, Brand agents con contexto y tools específicos
2. **Refactorizar flujos como skills YAML** — Los workflows de Zero Consequences deben ser skills que orquestan agents
3. **Elegir los 3 MCPs correctos** — Notion, Gmail, y un tercero (¿Google Calendar? ¿WhatsApp?)
4. **CLAUDE.md por proyecto** — Cada proyecto de marketing necesita su propio archivo de contexto
5. **Incorporar `/plan` como paso obligatorio** — Antes de cualquier ejecución, planificar

### Aprendizaje directo
El video confirma que la dirección del OS es correcta pero falta el salto de "tools sueltas" a "agents orquestados por skills". **Ese es el próximo movimiento estratégico.**

---

## 📋 Próximos Pasos

- [ ] Crear `Marketing Agent` que orqueste los flujos de Zero Consequences
- [ ] Refactorizar flujos actuales como skills YAML con steps de agents
- [ ] Definir los 3 MCPs estratégicos para marketing
- [ ] Crear CLAUDE.md para cada proyecto de marketing del OS
- [ ] Documentar el patrón de "skills que orquestan agents" como estándar del OS

---

## 📋 Plan SOTA Asociado

> Este aprendizaje generó el plan estratégico `2026-06-25-001-strat-learning-always-sota-plan.md` en `04_Operations/00_Context_LLM/04_Docs/plans/` para transformar Learning Always de documentación pasiva a mejora activa del OS. Ver plan para unidades de implementación concretas.
