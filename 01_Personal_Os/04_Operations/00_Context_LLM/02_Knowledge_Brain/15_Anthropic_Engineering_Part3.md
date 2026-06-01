# Anthropic Engineering — Posts 14-20

> **Fecha:** 2026-05-28
> **Parte 3 de 3 archivos**

---

## 14. Writing Effective Tools for Agents — With Agents

**Fecha:** Sep 11, 2025
**Autor:** Anthropic Engineering
**URL:** https://www.anthropic.com/engineering/writing-tools-for-agents

### Resumen

Los agentes son tan efectivos como las herramientas que les damos. Anthropic comparte técnicas para escribir tools de alta calidad y evaluaciones, y cómo usar Claude para optimizar sus propias tools.

### Principios Clave para Tool Design

1. **Token Efficiency:** Cada tool call consume tokens. Diseñar tools que devuelvan solo la información necesaria, sin ruido.
2. **Namespacing:** Agrupar tools por dominio para definir boundaries claros de funcionalidad.
3. **Context Meaningful:** Las tools deben devolver contexto útil al agente, no solo datos crudos.
4. **Descripciones precisas:** El prompt engineering de las descripciones de tools impacta directamente en cuándo y cómo las usa el agente.
5. **Elegir qué NO implementar:** A veces la mejor tool es la que no creas.

### El Workflow Recomendado

1. **Prototype rápido** — levantar tools localmente y testear con Claude
2. **Evaluación comprehensiva** — generar tasks de evaluación basados en casos reales
3. **Optimización con agentes** — usar Claude Code para analizar resultados y mejorar las tools iterativamente

### Por Qué Importa

Las tools representan un nuevo paradigma de software: contratos entre sistemas determinísticos y agentes no-determinísticos. A diferencia de APIs tradicionales, las tools deben manejar la impredecibilidad — los agentes pueden alucinar, malinterpretar propósitos, o llamar tools incorrectamente.

---

## 15. Desktop Extensions: One-Click MCP Server Installation for Claude Desktop

**Fecha:** Jun 26, 2025
**Autor:** Anthropic Engineering
**URL:** https://www.anthropic.com/engineering/desktop-extensions

### Resumen

Desktop Extensions (.mcpb files) resuelven el problema de instalación de MCP servers. En lugar de configurar JSON manualmente, instalar dependencias, y lidiar con paths — un solo click.

### Arquitectura

Una Desktop Extension es un zip que contiene:
- **manifest.json** — metadata, configuración, runtime requirements
- **Server implementation** — el MCP server empaquetado con todas sus dependencias
- **Icono opcional**

### Tipos Soportados

| Tipo                | Runtime                                 | Caso de Uso              |
|--------------------|----------------------------------------|-------------------------|
| Node.js             | Built-in (Claude Desktop shipea Node.js)| La mayoría de MCP servers|
| Python              | Requiere Python instalado               | Data science, ML         |
| Binarios/Executables| Native                                  | Performance crítica      |

### Features de Seguridad

- API keys almacenadas en OS keychain
- Actualizaciones automáticas
- Auditoría de extensiones instaladas

### Nota

Originalmente usaban extensión `.dxt`, migraron a `.mcpb` como naming convention estándar.

---

## 16. How We Built Our Multi-Agent Research System

**Fecha:** Jun 13, 2025
**Autor:** Anthropic Engineering
**URL:** https://www.anthropic.com/engineering/multi-agent-research-system

### Resumen

El sistema de Research de Claude usa múltiples agentes para explorar topics complejos. Arquitectura orchestrator-worker donde un lead agent coordina y delega a subagentes especializados.

### Arquitectura: Orchestrator-Worker

1. **Lead Agent** — recibe la query, la descompone en subtasks, crea subagentes
2. **Subagentes** — cada uno con sus propias tools, contexto, y prompts targeted
3. **Integración** — el lead consolida resultados en una respuesta coherente

### Findings Clave

- **Parallelización:** 3-5 subagentes en paralelo (no serial). Subagentes usan 3+ tools en paralelo. Corta el research time hasta 4x.
- **Token usage explica 80% de la varianza** en performance (BrowseComp). Los otros factores: número de tool calls y modelo.
- **Multi-agent gasta ~4x más tokens** que single-agent. Hay que ser consciente del costo.
- **Breadth-first research** — en lugar de procesamiento secuencial, múltiples threads simultáneos.

### Failure Modes Early

- Agentes spawnaban 50 subagentes para queries simples
- Buscaban infinitamente fuentes que no existen
- Se distraían con updates excesivos entre agentes

### Solución: Prompt Engineering

Cada subagente necesita: objetivo claro, formato de output, guía de tools/sources a usar, y task boundaries explícitos. El lead agent también necesita reglas de effort scaling (3-10 tool calls para fact-finding, 10-15+ para research complejo).

---

## 17. Claude Code: Best Practices for Agentic Coding

**Fecha:** Apr 18, 2025
**Autor:** Anthropic Engineering
**URL:** https://www.anthropic.com/engineering/claude-code-best-practices

### Resumen

Claude Code es una herramienta CLI para agentic coding. Este post cubre tips y patrones que han probado ser efectivos en diversos codebases, lenguajes y entornos.

### Principios Fundamentales

1. **CLAUDE.md files** — se vuelven parte del prompt de Claude. Deben ser refinados, no extensos. Usar "IMPORTANT" y "MUST" para énfasis.
2. **Dar a Claude forma de verificar su trabajo** — incluir tests, screenshots, o expected outputs. Es lo de mayor impacto que puedes hacer.
3. **Explorar primero, luego planificar, luego codificar** — separar exploración de ejecución. Usar plan mode.

### El Workflow Recomendado (4 fases)

1. **Explore** — entender el codebase, los patrones existentes
2. **Plan** — diseñar el approach antes de escribir código
3. **Code** — implementar contra el plan
4. **Verify** — tests, screenshots, validaciones

### Context Management

El context window es el recurso más importante. Claude performance se degrada a medida que el contexto se llena. Trackear uso continuamente y reducir tokens agresivamente.

### Hidden Features

El comando "think" tiene niveles escalables de thinking budget:
- "think" < "think hard" < "think harder" < "ultrathink" < "megathink"
Cada nivel asigna progresivamente más tokens para razonamiento interno.

---

## 18. The "Think" Tool: Enabling Claude to Stop and Think

**Fecha:** Mar 20, 2025
**Autor:** Anthropic Engineering
**URL:** https://www.anthropic.com/engineering/claude-think-tool

### Resumen

Un tool "think" que no hace nada — es un no-op — pero permite a Claude hacer stop y razonar estructuradamente durante tareas complejas de tool use.

### Cómo Funciona

```json
{
  "name": "think",
  "description": "Use the tool to think about something. It will not obtain new information or change the database, but just append the thought to the log.",
  "input_schema": {
    "type": "object",
    "properties": {
      "thought": {
        "type": "string",
        "description": "A thought to think about."
      }
    },
    "required": ["thought"]
  }
}
```

### Think Tool vs Extended Thinking

| Característica  | Extended Thinking                 | Think Tool                                                 |
|----------------|----------------------------------|-----------------------------------------------------------|
| Cuándo opera    | Antes de generar respuesta        | Durante la generación de respuesta                         |
| Para qué        | Planificar, iterar antes de actuar| Hacer stop y evaluar si tiene toda la info                 |
| Mejor para      | Coding, math, single tool calls   | Tool calls secuenciales, policy-heavy, decisiones con costo|
| Analogía        | Planificar un viaje               | Revisar el mapa durante el viaje                           |

### Resultados

Benchmarks mostraron mejoras dramáticas combinando ambas técnicas. Tau-Bench mejoró 34% vs baseline sin ninguna de las dos.

### Recomendación

Usar Extended Thinking para escenarios simples. Think Tool para cadenas largas de tool calls, análisis de tool outputs, y entornos con muchas reglas.

---

## 19. Raising the Bar on SWE-bench Verified with Claude 3.5 Sonnet

**Fecha:** Jan 6, 2025
**Autor:** Anthropic Engineering
**URL:** https://www.anthropic.com/engineering/swe-bench-sonnet

### Resumen

Claude 3.5 Sonnet logró 49% en SWE-bench Verified, superando el anterior SOTA de 45%. El post explica el scaffold del agente y cómo optimizar performance.

### ¿Qué es SWE-bench Verified?

- Subset de 500 problemas de SWE-bench revisados por humanos
- Tareas reales de GitHub issues de repos Python populares
- Mide el agente completo, no el modelo aislado

### Filosofía del Scaffold

Dar el máximo control posible al modelo manteniendo el scaffolding mínimo:

1. **Prompt** — guía al modelo
2. **Bash Tool** — ejecutar comandos
3. **Edit Tool** — ver y editar archivos

El agente decide cuándo está terminado (o hasta 200k context length).

### Lecciones

- Scaffolding mínimo funciona mejor que sistemas complejos
- El modelo necesita libertad para navegar el codebase
- Benchmarks importan pero hay que entender sus limitaciones

---

## 20. Building Effective Agents

**Fecha:** Dec 19, 2024
**Autor:** Anthropic Engineering
**URL:** https://www.anthropic.com/engineering/building-effective-agents

### Resumen

El post más referenced de Anthropic. Después de trabajar con docenas de equipos, la conclusión consistente: las implementaciones más exitosas usan patrones simples y componibles, no frameworks complejos.

### La Distinción Fundamental

- **Workflows:** LLMs y tools orquestados a través de código predefinido
- **Agents:** Modelos dirigen dinámicamente sus propios procesos y tool use

### Patrones que Funcionan

1. **Prompt augmentation** — la mayoría de los problemas se resuelven con prompts bien diseñados + retrieval
2. **Agent loops simples** — observe → decide → act → check → repeat
3. **Tool use bien diseñado** — ACI (Agent-Computer Interface) importa tanto como UI para humanos

### Tres Principios Core

1. **Simplicidad primero** — empezar con la solución más simple, añadir complejidad solo cuando sea necesario
2. **Transparencia** — mostrar explícitamente los planning steps del agente
3. **ACI craft** — documentación exhaustiva de tools, testing cuidadoso

### Counter-intuitive

Los frameworks pueden ayudar a empezar rápido, pero en producción hay que reducir las capas de abstracción. Los equipos más exitosos construyen con componentes básicos.

---

## FEEDBACK: ¿Qué Nos Falta Implementar?

### DEL ANÁLISIS DE LOS ARTÍCULOS (Partes 1-3 Completas)

| #  | Concepto del Artículo                     | Status en Nuestro OS | Acción                                   |
|---|------------------------------------------|---------------------|-----------------------------------------|
| 1  | **Tool Design con agents** (Post 14)      | ⏳ NO implementado    | Usar Claude para optimizar tools internas|
| 2  | **Desktop Extensions packaging** (Post 15)| ⏳ NO implementado    | Empaquetar MCP servers como .mcpb        |
| 3  | **Multi-agent Research** (Post 16)        | ⏳ NO implementado    | Arquitectura orchestrator-worker         |
| 4  | **CLAUDE.md optimization** (Post 17)      | ✅ Ya existe          | Revisar y refinar                        |
| 5  | **Think Tool** (Post 18)                  | ⏳ NO implementado    | Añadir think tool a config               |
| 6  | **SWE-bench style eval** (Post 19)        | ⏳ NO implementado    | Evaluación tipo SWE-bench para detector  |
| 7  | **Simple composable patterns** (Post 20)  | ✅ Parcial            | Simplificar workflows existentes         |

---

*Fin de la serie Anthropic Engineering (Posts 1-20 completos)*
