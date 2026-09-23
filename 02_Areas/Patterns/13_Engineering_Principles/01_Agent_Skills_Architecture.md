---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\05_Frameworks\13_Engineering_Principles\01_Agent_Skills_Architecture.md'
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\05_Frameworks\13_Engineering_Principles\01_Agent_Skills_Architecture.md"
sync_date: "2026-08-01T00:55:48.982871"
sync_updated: true---

# 🧠 Arquitectura de Skills para Agentes — Guía Completa

**Fuente:** Agent Skills talk (YouTube)
**Tipo:** LEARNING ALWAYS (207)
**Fecha:** 2026-07-25

---

## 📌 ¿Qué es un Agent Skill?

Un skill es un archivo `SKILL.md` (o folder con múltiples archivos) con:

- **Descripción** — metadata que el agente ve siempre para decidir si activarlo
- **Instrucciones** — el contenido que se inyecta cuando se activa
- **Progressive disclosure:** solo la descripción se carga al inicio; el contenido completo se carga solo cuando el skill es relevante

## 📂 Componentes de un Skill

Un skill NO es solo un `SKILL.md`. Puede tener:

| Componente | Descripción | Ejemplo |
|------------|-------------|---------|
| **References** | Documentación / recursos deep-dive | Documentación de Effect library |
| **Assets** | Blueprints, plantillas, logos | Plan template en create-plan skill |
| **Scripts** | Código ejecutable | TypeScript script para generar imágenes vía Fal.ai |

### ¿Por qué no solo un script? (La pregunta clave)

> "Why burn those tokens and add that random nature to it when it could be just a script?"

**Respuesta: porque algunas cosas deberían ser ambas.**

| Layer | Responsabilidad | Quemar tokens? |
|-------|----------------|----------------|
| **Script** | Parte determinista: enviar request, manejar response, extraer/save datos | NO — código puro |
| **Skill.md** | Parte contextual: traducir intención vaga → instrucción precisa, decidir *qué* hacer | SÍ — ahí está el valor |

```
Usuario: "Necesito una imagen de una bicicleta bajo la lluvia"
  → Skill.md: Analiza la intención, la enriquece con reglas de prompt engineering
  → Script:   Ejecuta el prompt contra la API, guarda el resultado
           (sin necesidad de interpretación — pura ejecución)
```

Si es pura ejecución determinista → **script**.  
Si requiere juicio/contexto + ejecución → **skill + script**.  
Si es puro juicio sin código → **solo skill**.

## 🎯 Dos Propósitos Fundamentales

### 1. Knowledge Gap — Cerrar brechas de conocimiento

El modelo tiene conocimiento de training data + contexto + codebase + web research.
Pero puedes añadir **tu propio conocimiento** via skills:

- Librerías poco conocidas (Effect, etc.)
- APIs internas de tu empresa
- Convenciones de tu proyecto

**Creación:** Pide a AI que investigue web/docs y convierta ese conocimiento en skill. Luego afínala tú mismo.

### 2. Execution Gap — Codificar cómo quieres que se ejecute

El modelo SABE cómo hacer ciertas tareas, pero tú sabes CÓMO QUIERES que se hagan:

- Create plan skill: research → delegar a sub-agents → template structure → review step
- Code review skill: scoring de findings, evitar complejidad innecesaria
- El skill debe preguntarte si no está seguro

> **Regla de oro:** Si te encuentras pidiendo lo mismo una y otra vez, o quejándote del mismo error una y otra vez, **ponlo en un skill**.

## 🌍 Regla de Global Skills: Cuantas menos, mejor

> "I try to keep my global skills as lean as possible. In general, I try to have **as few skills as possible**, and I definitely put everything into a project that can be in a project."

**Por qué:**
- Las global skills cargan su metadata (nombre + descripción) en **cada sesión**, en cada proyecto
- Más skills en la lista global = más opciones para el modelo = peor precisión en activación
- No solo son tokens — es ruido en la decisión de qué skill activar

**Directriz:**
- Skill universal (create-plan, generate-image) → **global**
- Skill de dominio específico (Effect library, API interna) → **local/project**
- Si dudas → **local**. Es más fácil promover a global que limpiar skills globales que nadie usa

## 🗂️ Cuatro Tipos de Skills (y se solapan)

> Los tipos NO son mutuamente excluyentes. Un skill puede ser workflow + companion + executable al mismo tiempo.

### a) Domain Knowledge
Conocimiento específico de un dominio/proyecto. Se activa cuando el agente trabaja en ese contexto.

**Ejemplo:** Effect library skill — documenta APIs, patrones, mejores prácticas de la librería para que el agente no tenga que consultar docs cada vez.

### b) Workflow
Flujos repetibles con estructura clara. Codifican PASOS + FORMATO.

**Ejemplo:** Create plan skill — research → sub-agents → template → review. Garantiza que cada plan tenga la misma estructura y calidad.

### c) Companion
Explican al agente cómo usar herramientas específicas.

**Ejemplo:** "Use Py subagents skill" — explica cómo usar el CLI de Py para controlar subagentes. Incluye script + documentación de uso.

### d) Executable
Skills con scripts que el agente EJECUTA. Mezcla workflow + código.

**Ejemplo:** Generate image skill (script Fal.ai + prompt engineering), VPS setup hardening skill (scripts + config templates + workflow de decisiones).

## 🌍 Global vs. Local (Project)

| | Global | Local (Project) |
|---|---|---|
| **Cuándo** | Aplica a TODOS los proyectos | Aplica a UN proyecto específico |
| **Ejemplo** | create-plan, generate-image | Effect library skill |
| **Costo** | Metadata cargada en CADA sesión | Solo cuando trabajas en ese proyecto |
| **Recomendación** | **Mínimas posibles** | Todo lo demás aquí |

> ⚠️ Las global skills cargan su metadata (nombre + descripción) en TODAS las sesiones. Más skills globales = peor performance del modelo.

## 📄 AGENTS.md vs Skills — La Filosofía

> "Skills are like tools, like extra patterns or pieces of knowledge that matter **often but not always**. If something does matter **always**, it goes into agents.md."

| | AGENTS.md | Skills |
|---|---|---|
| **Cuándo carga** | Siempre, toda la sesión | Solo metadata al inicio; contenido al activarse |
| **Qué poner** | Reglas que aplican SIEMPRE | Patrones/conocimiento que aplica *often but not always* |
| **Ejemplo** | "Keep responses short", "No legacy code" | Create plan workflow, Effect library patterns |
| **Tamaño** | **Super lean** (~100 líneas) | Lo que necesite |
| **Activación** | Siempre activa | Necesita match con description para activarse |

**Regla práctica:**
- Si necesitas que pase **SIEMPRE** sin excepción → AGENTS.md
- Si necesitas que pase **a menudo pero no siempre** → Skill (la description bien escrita lo activará cuando toque)
- Si no estás seguro → Skill. Es más fácil mover algo de un skill a AGENTS.md que al revés

**AGENTS.md debe ser super lean.** Solo instrucciones generales de comportamiento. No lo conviertas en un skill repository disfrazado.

## 🔄 Evolución Continua

Las skills NO son estáticas. Tres vectores de cambio:

1. **Modelos cambian** — modelos nuevos pueden ser más/menos verbosos, más/menos agresivos. Un skill optimizado para Claude 3.5 Sonnet puede dar peores resultados en Claude 4.0 Opus
2. **Harnesses / tools cambian** — las herramientas disponibles evolucionan. Si el harness obtiene una tool nativa para algo que tu skill hacía con scripts, el skill necesita actualizarse o eliminarse
3. **Tú cambias** — tu forma de trabajar evoluciona. Un workflow que amabas hace 6 meses puede ser irrelevante hoy

**Regla de los 6 meses:** Una skill instalada hace medio año no es necesariamente útil hoy. Programa una revisión periódica. Si no la usaste en 3 meses, considérala candidata a eliminación.

**No tengas miedo de tirar skills.** Un skill que ya no funciona o que ya no necesitas es basura en tu lista de skills globales. Elimínalo.

### Meta-Skills Clave

#### 🏗️ Create Skill Skill
Skill que codifica **best practices y patrones** que quieres que AI use al *crear nuevas skills*. No es solo "recomendado" — es parte del sistema si quieres escalar la creación de skills.

**Uso:** Le pides a AI que cree un skill sobre X → AI activa `create-skill` skill → ese skill dicta formato, estilo (bullet points vs prosa), secciones obligatorias, etc.

**Flujo:** Web research → gather knowledge → convert to skill → tú afinas manualmente.

#### 🔄 Improve Skill Skill
Skill que permite a los agentes **mejorar skills automáticamente** basado en reglas que tú defines, activado por:

- **Correcciones frecuentes** — si corriges al agente repetidamente sobre algo que *ya estaba en un skill*, el improve-skill skill lo detecta y propone actualizar ese skill
- **Cambio de contexto** — modelo nuevo, harness nuevo, o tú cambiaste tu workflow

**No es mágico:** Define reglas claras de cuándo y cómo mejorar. Sin reglas, el agente no sabe qué es "mejora" vs "ruido".

## 🛠️ Creación de Skills

1. Usa AI para la creación inicial (web research + conversión a skill)
2. **Afina manualmente** — no dejes el skill genérico que AI produce
3. **Lean & focused** — bullet points, no prosa larga
4. **Sin complejidad innecesaria** — el modelo tiende a inflar skills
5. **Crea skills TUS skills** — los de otros son buen starting point, pero refínalos

> "A good skill really is just about having a good description so that it's getting activated in the right moments and a lean, actionable body."

## 📦 Referencia: maxedapps/agent-skills

**Repo:** https://github.com/maxedapps/agent-skills
**Autor:** Max (speaker del Agent Skills talk)
**12 skills total**

### Patrones extraídos que suman a nuestro ecosistema

#### 1. Admission Gate (decomplex skill)

Cada finding de complejidad debe pasar 7 criterios antes de reportarse:

1. Concrete burden (conceptual, maintenance, u operational)
2. Insufficient justification for current need
3. Realistic, reachable practical cost
4. Smallest concrete simpler alternative identified
5. Required behavior preserved
6. Proportionate value after simplification + regression cost
7. Explicit exception/boundary check

**Nunca encontrar en:** helper count, duplication alone, novelty, hypothetical scale, style alone.

**Aplicable a:** Nuestro sistema de review y Eval Harness SOTA — un "admission gate" antes de reportar hallazgos.

#### 2. Assignment Contract (use-subagents skill)

Cada subagente recibe un contrato estructurado:
- **Role + objective** — un solo job, outcome concreto
- **Mode** — reader o writer
- **Context** — cwd/workspace exacto + baseline, files, facts, open questions
- **Scope** — owned areas, requirements, non-goals, join output
- **Permissions** — least privilege; no secrets/prod/destructive; no edits to parent plans
- **VCS** — children nunca crean worktrees/branches/commits
- **Validation** — required checks
- **Stop** — completion condition + timeout; **no recursive delegation**
- **Handoff** — files read/changed · decisions · checks+results · risks · blockers

**Aplicable a:** Estructurar mejor nuestras delegaciones a sub-agentes.

#### 3. Scores & Caps (code-review skill)

| Severidad | Confianza |
|-----------|-----------|
| S4 — critical | C3 — confirmed |
| S3 — high | C2 — supported |
| S2 — medium | C1 — tentative (no es finding aún) |
| S1 — low | |
| S0 — optional | |

**Caps:** Todos los S4; ≤5 otros S3/S2 materiales; no S1/S0 por defecto. Overflow → un caveat "not review-ready".

**Aplicable a:** Nuestro sistema de revisión con lenses.

#### 4. Plan-Backed Review Matrix

Cuando hay un plan como autoridad: matriz completa + 4 veredictos:
- **Baseline** — el código actual vs expectativas
- **Compliance** — cumple con el plan?
- **Quality beyond baseline** — calidad extra justificada?
- **Tests/validation** — cubre lo necesario?

**Aplicable a:** SDD verify phase.

#### 5. Create-Skill Quality Workflow

1. Define observable use cases (2-3) + near misses (2-3)
2. Inspect ecosystem (skills cercanos, scripts, tools, schemas)
3. Draft frontmatter FIRST (description < 1024 chars)
4. Build post-activation contract
5. Compression pass (remove redundant explanation, vague guidance, unrelated content)
6. Evaluate routing: 3-5 should-trigger prompts + 2-3 strong near misses
7. Run one representative task
8. Validate with metadata + link checks

---

**Regla asociada:** `00_Core/01_Rules/16_Meta_Skill_Improvement.mdc`
**Knowledge path:** `02_Knowledge/10_Engineering_Principles/01_Agent_Skills_Architecture.md`
**Repo de referencia:** https://github.com/maxedapps/agent-skills
