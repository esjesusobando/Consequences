---
title: "Reverse Engineering: Marketing AI Agents System (Lorena Bordonaba)"
source: YouTube video
date: 2026-05-29
type: reverse-engineering
tags: [marketing, ai-agents, claude-code, workflow, patterns, architecture]
status: active
---

# Reverse Engineering: Sistema de Marketing con Agentes de IA

## Principios Subyacentes

### Principio 1: Context-Driven Generation
> La calidad del output del agente es directamente proporcional a la calidad del contexto que recibe.

El principio más importante que Lorena demuestra: **no importa cuán bueno sea el modelo si el contexto es pobre**. Su sistema se basa en alimentar a los agentes con documentación detallada de:
- Estrategia de negocio (objetivos, KPIs, buyer persona)
- Identidad de marca (colores, tipografía, tono de voz)
- Plantillas (formatos, estructuras, ejemplos)

**Corolario para el OS**: Nuestro `04_Contexto/` y `05_Marca/` son exactamente eso. La pregunta es: ¿están lo suficientemente completos como para que un agente de marketing produzca contenido de calidad sin intervención humana?

### Principio 2: Separation of Concerns (Agent Level)
> Cada agente tiene UN trabajo y lo hace bien. No hay agentes "todólogo".

Lorena no crea un agente que hace todo. Crea:
- **Estratega**: Solo piensa, planifica, decide. Nunca escribe contenido.
- **Creador**: Solo produce. Nunca analiza métricas.
- **Analista**: Solo mide y recomienda. Nunca crea.

Esto es **Single Responsibility Principle aplicado a agentes de IA**. Cada agente tiene:
- Un propósito claro
- Contexto relevante para su función (no todo el contexto del proyecto)
- Un output específico y medible

### Principio 3: Chain of Agents > Monolithic Agent
> Un flujo de múltiples agentes especializados supera a un solo agente con múltiples capacidades.

El poder real no está en ningún agente individual — está en **cómo se encadenan**. El flujo típico:
```
Estratega → brief → Creador → draft → Revisor → final → Analista → métricas → Estratega (feedback loop)
```

Cada agente recibe el output del anterior como input, y el resultado final es superior porque cada paso es revisado por un experto diferente.

### Principio 4: Infrastructure as Context
> La estructura de carpetas y archivos ES la programación del sistema.

Lorena no escribe código. Escribe archivos .md en carpetas organizadas. La estructura del proyecto es el "código fuente" del sistema de marketing. Esto es increíblemente potente porque:
- Cualquier persona puede entenderlo y modificarlo
- No hay dependencia de un desarrollador
- Los agentes de IA entienden .md de forma nativa
- La estructura misma documenta el sistema

### Principio 5: MCPs as System Boundaries
> Los MCPs son los puntos de integración que conectan el mundo de los agentes con el mundo real.

Los MCPs (Model Context Protocol) permiten que los agentes:
- Lean datos de herramientas externas (analytics, redes sociales)
- Escriban/accionen en herramientas externas (publicar, enviar email)
- Reciban triggers del mundo real (nuevo lead, mención en redes)

Sin MCPs, los agentes son solo "generadores de texto". Con MCPs, son "equipo de marketing operativo".

---

## ¿Qué hace efectivo este sistema en particular?

### 1. Progresión natural de complejidad
Lorena no empieza con flujos complejos. La progresión es:
1. Instalar Claude Code
2. Crear estructura de carpetas
3. Agregar contexto
4. Crear un agente
5. Crear más agentes
6. Conectar MCPs
7. Automatizar flujos

Cada paso construye sobre el anterior. No hay saltos.

### 2. Contexto como diferenciador
El momento clave del video es cuando muestra que sin contexto, los agentes dan respuestas genéricas. Con contexto, respuestas personalizadas. Esto es lo que **realmente** diferencia su sistema de cualquier otro.

### 3. Sin abstracciones innecesarias
No hay frameworks, no hay código, no hay configuración compleja. Solo carpetas, archivos .md, y la estructura nativa de Claude Code. Esto hace que el sistema sea:
- Fácil de entender
- Fácil de modificar
- Fácil de escalar

---

## Patrones Aplicables al Personal OS

### Patrón 1: Marketing Agent Definitions
Crear agentes especializados de marketing en `01_Personal_Os/01_Core/02_Tools/01_Agents/`:

```
01_Agents/
├── marketing-estratega/     ← Define estrategia, briefing, planificación
├── marketing-creador/       ← Produce contenido (posts, scripts, newsletters)
└── marketing-analista/      ← Mide resultados, extrae insights
```

Cada agente tendría:
- SKILL.md con instrucciones específicas de su rol
- Referencia al contexto de marca y estrategia
- Output esperado y formato

### Patrón 2: Marketing Workflows
Crear workflows que encadenen agentes:

```
00_Workflows/
├── youtube-video-workflow.md    ← Idea → brief → guión → thumbnail → SEO
├── linkedin-post-workflow.md    ← Tema → copy → revisión → programación
└── newsletter-workflow.md       ← Curación → redacción → revisión → envío
```

### Patrón 3: MCP Marketing Connections
Configurar MCPs para herramientas de marketing:

```
03_MCPs/
├── make/mcp-config.json         ← Automatización de flujos
├── analytics/mcp-config.json    ← Consultar métricas
└── social/mcp-config.json       ← Publicar en redes
```

### Patrón 4: Content Templates System
Estructurar plantillas de contenido:

```
06_Plantillas/
├── youtube/
│   ├── script.md
│   └── thumbnail-brief.md
├── linkedin/
│   ├── post.md
│   └── article.md
└── newsletter/
    └── template.md
```

---

## Conexión con el Framework $10K Websites

El approach de Lorena se conecta directamente con nuestra metodología de diseño premium:

| Concepto Marketing IA                 | Concepto $10K Websites        |
|--------------------------------------|------------------------------|
| Contexto de marca → output consistente| Design system → UI consistente|
| Agentes especializados                | Componentes especializados    |
| Flujos encadenados                    | User flows / journeys         |
| MCPs como integraciones               | APIs como integraciones       |
| .md como configuración                | Config como código            |

Ambos sistemas comparten la filosofía de que **la calidad del input determina la calidad del output**. En diseño: mejor contexto de marca → mejor UI. En marketing: mejor contexto de negocio → mejor contenido.

---

## Anti-patrones Identificados

| Anti-patrón                   | Por qué falla                                             | Alternativa                                                  |
|------------------------------|----------------------------------------------------------|-------------------------------------------------------------|
| Un solo agente para todo      | El modelo se confunde entre roles y pierde especialización| Separar en estratega/creador/analista                        |
| Sin contexto de marca         | Output genérico que no diferencia tu marca                | Invertir tiempo en documentar contexto antes de crear agentes|
| Flujo manual agente por agente| Pérdida de tiempo, errores de copiado                     | Automatizar el encadenamiento con comandos .md               |
| MCPs sin probar               | La automatización falla silenciosamente                   | Probar cada MCP individualmente antes de integrarlo en flujos|
| Archivos sin estructura       | Los agentes no encuentran lo que necesitan                | Mantener la estructura de carpetas estricta                  |

---

## Resumen de Acciones para el OS

1. ✅ **Contexto** — Ya existe, verificar que esté completo para uso de agentes
2. ✅ **Marca** — Ya existe, verificar que tenga toda la info que un agente necesita
3. ✅ **Plantillas** — Ya existen, pero solo para documentos del OS, no para contenido de marketing
4. ❌ **Agentes de marketing** — No existen. Crear estratega, creador, analista
5. ❌ **Workflows de marketing** — No existen. Crear flujos YouTube, LinkedIn, newsletter
6. ❌ **MCPs de marketing** — No existen. Evaluar qué conexiones externas necesita el sistema

---
*Reverse Engineering v1.0 — PersonalOS v4.9 Consequences*
