# 🌕 Capital Token — Plan Estratégico

> **Visión:** Construir un sistema de IA organizacional agnóstico al LLM, donde el verdadero motor sea el taste, juicio y documentación de la forma de trabajar de la organización.
>
> **Fecha:** 2026-06-25
> **Estado:** 📋 PLAN — Para revisión y priorización

---

## 🎯 El Problema

### Los 2 Tipos de Capital

| Capital | Qué es | Ejemplo |
|---------|--------|---------|
| 🧠 **Capital Humano** | Tu gente. Criterio, contactos, olfato. | El equipo que sabe cómo funciona el negocio |
| 🌕 **Capital Token** | Tu IA propia. Entrenada con TUS datos, procesos y forma de hacer las cosas. | NO ChatGPT genérico — tu sistema |

### El Riesgo de Rentar Modelos

- Si contratás una agencia de marketing, **ellos aprenden** de tu negocio. Vos no.
- Si usás solo ChatGPT genérico, cada problema que resolvés **se queda del lado de quien hizo el modelo**.
- El día que se van, te quedás donde empezaste.
- **Los LLMs no van a estar subsidiados** — podrían cobrar 300% más en el futuro.

### La Oportunidad

> "La verdadera oportunidad no está en elegir el mejor modelo, sino en construir un bucle de aprendizaje por encima de los modelos donde el capital humano y el capital de tokens se potencien mutuamente."

---

## 💡 Ideas y Opciones

### Opción A: Extender el Personal OS Actual (Recomendado)

**Qué:** Evolucionar Think_Different para que sea el LLM Wiki + Knowledge Base compartido de toda la organización.

**Cómo:**
1. **Contexto Organizacional Compartido**: Crear un workspace en Codex/OpenCode donde admin, finanzas, RH compartan un solo contexto
2. **Knowledge Base Unificada**: Usar `01_Personal_Os/02_Knowledge/` como base compartida, accesible desde Slack, Notion, WhatsApp
3. **LLM-Agnostic Layer**: Documentar taste, juicio, procesos en formato portable (markdown + YAML) que funcione con cualquier LLM
4. **Sistema Recursivo**: Conectar con `01_Auto_Improvement/` para que cada interacción mejore el conocimiento colectivo

**Pros:**
- Ya tenemos la infraestructura (392 skills, 63 agents, 30 HUBs)
- Engram ya provee memoria persistente
- El formato markdown+YAML es LLM-agnóstico
- Bajo costo incremental

**Contras:**
- Requiere disciplina de documentación
- Necesita onboarding del equipo

### Opción B: Crear un LLM Wiki Independiente

**Qué:** Sistema separado tipo wiki donde se documentan procesos, decisiones, playbooks.

**Cómo:**
1. Notion/Obsidian como base
2. MCP server para conectar con LLMs
3. API para Slack/WhatsApp

**Pros:**
- Separación clara entre OS personal y organizacional
- Fácil de compartir

**Contras:**
- Duplicación de esfuerzo
- Otro sistema que mantener
- Pierde la integración con skills/agents existentes

### Opción C: Híbrido — Personal OS + Shared Layer

**Qué:** Mantener Think_Different como core, agregar una capa compartida encima.

**Cómo:**
1. **Shared Context Layer**: Carpeta `01_Personal_Os/02_Knowledge/05_Shared_Org/` con contexto organizacional
2. **MCP Bridge**: Server que expone el shared context a Slack/Notion/WhatsApp
3. **Agent Templates**: Templates de agentes por rol (Admin, Finanzas, RH) que heredan del shared context
4. **Feedback Loop**: Cada equipo contribuye al shared context desde su herramienta nativa

**Pros:**
- Mejor de ambos mundos
- No duplica infraestructura
- Cada equipo usa su herramienta preferida
- El conocimiento se acumula en un solo lugar

**Contras:**
- Complejidad de integración
- Requiere definir qué es compartido vs personal

---

## 📋 Plan de Implementación (Opción C — Híbrido)

### Fase 1: Foundation (Semanas 1-2)
- [ ] Definir estructura de `05_Shared_Org/` (playbooks, decisiones, procesos)
- [ ] Crear templates de documentación organizacional (markdown + YAML)
- [ ] Documentar los primeros 5 playbooks clave del negocio
- [ ] Configurar workspace compartido en Codex para admin/finanzas/RH

### Fase 2: Integration (Semanas 3-4)
- [ ] MCP server para exponer shared context
- [ ] Bot de Slack que consulta el shared context
- [ ] Integración con Notion para lectura/escritura bidireccional
- [ ] Templates de agentes por rol (Admin Agent, Finance Agent, HR Agent)

### Fase 3: Automation (Semanas 5-6)
- [ ] Feedback loop automático: cada interacción enriquece el contexto
- [ ] Auto-improvement conectado al shared context
- [ ] Dashboard de métricas: qué conocimiento se usa más, gaps detectados
- [ ] WhatsApp integration para consultas rápidas

### Fase 4: Scale (Semanas 7-8)
- [ ] Multi-cliente: cada cliente tiene su propio shared context
- [ ] Reporting automático: estado del capital token por área
- [ ] A/B testing de playbooks: cuál funciona mejor
- [ ] Case studies: documentar resultados

---

## 🔑 Principios de Diseño

1. **LLM-Agnostic**: Todo el conocimiento en markdown + YAML. Funciona con Claude, GPT, Gemini, o cualquier modelo futuro.
2. **Where Work Happens**: El conocimiento debe estar disponible donde sucede el trabajo (Slack, Notion, WhatsApp).
3. **Compound Learning**: Cada proyecto se apoya en el anterior. El sistema sabe más con el tiempo.
4. **Human + Token**: El capital humano y el capital token se potencian mutuamente, no se reemplazan.
5. **Taste > Tools**: El verdadero motor es el taste, juicio y documentación — no el modelo de IA.

---

## 📊 Métricas de Éxito

| Métrica | Target | Cómo medir |
|---------|--------|-----------|
| Playbooks documentados | 20+ en 3 meses | Count en `05_Shared_Org/` |
| Consultas al shared context | 50+/semana | Logs del MCP server |
| Tiempo de onboarding | -50% | Survey nuevo empleado |
| Conocimiento reutilizado | 70%+ de proyectos | % de refs a playbooks existentes |
| LLM cost optimization | -30% | Menos tokens gracias a contexto pre-cargado |

---

## ⚡ Quick Wins (Hacer Esta Semana)

1. **Crear `10_Shared_Org/`** en Knowledge con estructura inicial ✅ *(2026-06-27)*
2. **Documentar 1 playbook** como ejemplo ✅ *(Onboarding Nuevo Cliente — 2026-06-27)*
3. **Configurar Codex workspace** compartido para el equipo admin ❌ *(Pendiente — requiere acceso al equipo)*
4. **Crear template de agente** para un rol específico ✅ *(Admin, Finance, HR — 2026-06-27)*

---

## 📊 Estado de Implementación (2026-06-27)

### Fase 1: Foundation — ⏳ En Progreso (33%)
- ✅ `10_Shared_Org/` creado con estructura completa
- ✅ Templates de documentación (playbook, ADR, SOP)
- ✅ Playbook 1: Onboarding Nuevo Cliente
- ✅ Templates de agentes: Admin, Finance, HR
- ❌ Codex workspace compartido — pendiente
- ✅ MCP Bridge v0.1 — script base funcional
- ✅ Dashboard de métricas del Capital Token
- ❌ Contexto organizacional — pendiente de completar

### Fase 2: Integration — ❌ No Iniciada
### Fase 3: Automation — ❌ No Iniciada
### Fase 4: Scale — ❌ No Iniciada

---

*Capital Token Plan — Think Different PersonalOS v5.0 SOTA — 2026-06-27*
*Implementación iniciada: Quick Wins + Fase 1 Foundation*
