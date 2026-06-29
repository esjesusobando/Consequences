---
title: "Onboarding de Nuevo Cliente — Marketing Agency"
version: 1.0
owner: "Estratega de Marketing"
last_reviewed: "2026-06-27"
tags: [onboarding, cliente, marketing-agency]
dependencies:
  - "Brand Identity Guide"
  - "BRIEF_TEMPLATE.md"
inputs:
  - name: "brief_inicial"
    type: "document"
    description: "Brief completo del cliente con objetivos, audiencia, tono"
  - name: "brand_assets"
    type: "folder"
    description: "Logo, colores, tipografía, ejemplos de contenido"
outputs:
  - name: "plan_de_contenido"
    type: "document"
    description: "Plan de contenido para primeros 30 días"
  - name: "agent_config"
    type: "yaml"
    description: "Configuración de agentes para el cliente"
  - name: "quality_gates"
    type: "checklist"
    description: "Criterios de calidad específicos del cliente"
---

# Playbook: Onboarding de Nuevo Cliente — Marketing Agency

## Objetivo
Incorporar un nuevo cliente a la Marketing Agency en menos de 2 horas hábiles, dejando todo configurado para que los agentes (Estratega → Creador → Analista) produzcan contenido desde el día 1.

## Cuándo Usarlo
- Cuando se firma un nuevo cliente
- Cuando un cliente existente cambia de rubro/audiencia significativamente
- Cuando se configura una nueva marca/vertical

## Actores
- **Estratega**: recibe el brief, define voice y plan
- **Creador**: produce contenido basado en el plan
- **Analista**: define quality gates y métricas
- **Orquestador**: configura los agentes en el workspace

## Prerrequisitos
- [ ] Brief del cliente completado (objetivos, KPIs, audiencia)
- [ ] Brand assets recibidos (logo, colores, ejemplos)
- [ ] Acceso a herramientas (LinkedIn, Gmail, analytics)
- [ ] Workspace en Codex/OpenCode creado

---

## Paso a Paso

### 1. Brief Intake (Estratega — 30 min)
Recibir y validar el brief del cliente.

**Input:** Brief del cliente
**Output:** Brief validado + preguntas de clarificación

```yaml
cliente:
  nombre: "{{nombre}}"
  industria: "{{industria}}"
  objetivos:
    - "{{objetivo 1}}"
    - "{{objetivo 2}}"
  audiencia:
    perfil: "{{descripción}}"
    plataformas: ["LinkedIn", "Twitter", "Newsletter"]
  tono: "{{professional | warm | playful | authoritative}}"
  kpis:
    - "{{kpi 1}}"
    - "{{kpi 2}}"
```

**Check:**
- [ ] Brief tiene objetivos medibles?
- [ ] Audiencia definida?
- [ ] Brand voice clara?
- [ ] KPIs asignados?

### 2. Brand Voice Setup (Estratega — 20 min)
Configurar el brand voice y tone of voice del cliente.

**Input:** Brand assets + brief
**Output:** `CLAUDE.{cliente}.md` (template de contexto)

1. Crear `02_Playground/CLAUDE.{cliente}.md` desde el template
2. Documentar:
   - Tone of voice (Rioplatense voseo por default)
   - Messaging pillars (3-5)
   - Do's and Don'ts
3. Definir quality gates específicos

### 3. Agent Configuration (Orquestador — 20 min)
Configurar los agentes para este cliente.

**Input:** Brief validado + brand voice
**Output:** Configuración de agentes + workspace

1. Crear folder del cliente en `01_Personal_Os/05_Projects/{cliente}/`
2. Configurar Engram project context
3. Template de agente Estratega con brief precargado
4. Template de agente Creador con brand voice
5. Template de agente Analista con KPIs y quality gates

### 4. Contenido Semana 1 (Creador — 2h)
Producción inicial de contenido.

**Input:** Agent config + plan de contenido
**Output:** 3-5 piezas de contenido listas para revisión

1. 1 post LinkedIn (lanzamiento / presentación)
2. 1 thread Twitter (thought leadership)
3. 1 newsletter (bienvenida)
4. 1 artículo blog (deep dive / caso de estudio)

### 5. Quality Review (Analista — 30 min)
Revisar contenido contra quality gates.

**Input:** Contenido producido
**Output:** Feedback + contenido aprobado/rechazado

**Checklist:**
- [ ] Hook exists: primeras 2 líneas enganchan?
- [ ] CTA presente: el lector sabe qué hacer?
- [ ] Brand voice check: coincide con el tono definido?
- [ ] Brief alignment: cumple objetivos y KPIs?
- [ ] Sin errores: ortografía, datos, links rotos?

### 6. Publicación y Tracking (Analista — 15 min)
Programar o publicar contenido + configurar tracking.

**Output:** Contenido publicado + tracking activo

1. Publicar en plataforma correspondiente
2. Registrar UTM parameters en hoja de tracking
3. Configurar alerts para engagement inicial

---

## Calidad Gates

- [ ] Brief completo con objetivos medibles (SMART)
- [ ] Brand voice documentada con ejemplos concretos
- [ ] Contenido pasa revisión de Analista antes de publicar
- [ ] Tracking configurado antes de la primera publicación
- [ ] Feedback loop: semana 1 review con cliente

## Errores Comunes

| Error | Síntoma | Solución |
|-------|---------|----------|
| Brief vago | Contenido no resuena | Hacer Brief Intake de nuevo con preguntas específicas |
| Brand voice inconsistente | Contenido suena a otro cliente | Revisar CLAUDE.{cliente}.md, agregar ejemplos |
| Sin tracking | No se puede medir ROI | Configurar UTM + analytics antes de publicar |
| Quality gates saltados | Contenido con errores | No publicar sin aprobación de Analista |

## Métricas

| Métrica | Target | Cómo medir |
|---------|--------|-----------|
| Tiempo de onboarding | < 2h hábiles | Desde brief recibido hasta contenido listo |
| Contenido aprobado al 1er review | 80%+ | Analista tracker |
| Tiempo brief → publicación | < 1 semana | Calendario editorial |
| Satisfacción del cliente | 4.5/5+ | Encuesta post-onboarding |

---

## Histórico

| Versión | Fecha | Cambio | Autor |
|---------|-------|--------|-------|
| 1.0 | 2026-06-27 | Creación inicial | Capital Token |
