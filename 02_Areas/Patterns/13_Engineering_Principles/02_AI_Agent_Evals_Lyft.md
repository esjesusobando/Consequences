---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\05_Frameworks\13_Engineering_Principles\02_AI_Agent_Evals_Lyft.md'
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\05_Frameworks\13_Engineering_Principles\02_AI_Agent_Evals_Lyft.md"
sync_date: "2026-08-01T00:55:48.984582"
sync_updated: true---

# 🎯 Evaluación de AI Agents — Framework Lyft

**Fuente:** Lyft Evals talk (Nick + Ash, AI Engineer World Fair)
**Tipo:** LEARNING ALWAYS (207)
**Fecha:** 2026-07-25

---

## 📊 Pipeline End-to-End

```
Development → Offline Evaluation → Launch Gate → Production → Online Evaluation → Error Analysis → Feedback Loop
```

**Principio fundamental:** NO uses usuarios reales como datos de test. Ten un proceso de evaluación offline riguroso ANTES de lanzar a producción.

---

## 🔬 Offline Evaluation System

Inspirado en **TauBench** (Sierra AI) — diseñado para customer support AI agents pero aplicable a cualquier sistema agentico user-facing.

### Componentes:

1. **Synthetic Dataset** — representativo del tráfico de producción
2. **User LLM** — juega el rol del usuario en conversaciones multi-turn simuladas
3. **Grader (LM as a Judge)** — evalúa calidad de la interacción
4. **Deterministic Evaluators** — code assertions (ej: verificar tool calls, concesiones)
5. **Launch Gate** — criterio mínimo para pasar a producción

### Cómo NO hacer synthetic data

❌ Simplemente pedirle a un LLM que genere 50 test queries

✅ Enfoque correcto:
- Tomar **muestras reales** de producción
- **Mutate** criterios para cubrir golden paths + edge cases

### El problema del User LLM "too nice"

Los frontier LLMs están entrenados para ser asistentes útiles, NO usuarios frustrados.

**Primer intento:** LM user demasiado paciente/explicativo → 90% pass rate (too good to be true)
**Realidad:** Usuarios son impacientes, frustrados, no explican sus issues con calma

**Solución:** Fine-tune un LLM con **verbatim real de usuarios** → evaluación más difícil pero más realista. El score baja pero ahora tienes espacio para mejorar.

### User Personas

Definir personas específicas para el User LLM:

- **Bypasser** — quiere escalar a humano, no da chance al AI
- **Refund seeker** — busca reembolso,可能 hostil
- **AI skeptic** — no confía en el AI agent
- **Loyal customer** — ha usado el servicio por años, frustration contextual

Referencia: Microsoft User LLM paper — mismo approach (fine-tune, evaluation score baja, pero más realista).

---

## 🧑‍⚖️ LM as a Judge — Cómo Construirlo Bien

### Error #1: Métricas demasiado genéricas

❌ Pre-built metrics (DeepEval, etc.): tool usage appropriateness, response helpfulness, conversation naturalness, completeness...
→ Dan scores pero NO son **actionables**. ¿Qué haces con "response helpfulness: 0.5"?

✅ Enfoque correcto:
- **Task success/failure** como métrica principal
- **Binary outcome** — más fácil de calibrar y consistente
- Colaborar con **domain experts** para definir métricas accionables ligadas al negocio

**Ejemplo — Education Rubric:**
- FAIL: AI agent intenta educar demasiadas veces cuando debió escalar
- FAIL: Escala muy pronto sin dar oportunidad de educar
- PASS: Comportamiento esperado

### Error #2: No validar al Judge

Trata el LM judge como un **clasificador**:

1. Label ~100 ejemplos con pass/fail (ground truth humano)
2. Split:
   - **Training** (few-shot para el prompt del judge)
   - **Dev** — iterar el prompt del judge
   - **Test** — validar sin overfitting
3. Calcular **precision y recall** contra ground truth humano

### Criteria Drift

El criterio de evaluación NO se define de una vez. Evoluciona con los datos:

```
Define criteria → Test judge → See examples → Refine criteria → Re-test judge
```

**Co-develop** el evaluador con el modelo. No los desarrolles por separado.

---

## 📐 Rigor Estadístico

Los **punto estimates** sin intervalos de confianza son engañosos:

- 84% vs 88% con 50 muestras → **no es significativo**
- Ganancia de 4 puntos porcentuales necesita MUCHAS más muestras
- **Grandes ganancias + paired designs** necesitan menos samples
- Reservar rigor para momentos que **gatean decisiones** (shipping, reporting a leadership)

> "Every score needs an interval."

---

## 🔄 Error Analysis Loop (Continuo)

No es un audit one-off. Es un loop continuo:

```
Raw Traces → Pinpoint Failure Modes → Keep metrics that change a decision → Form fresh premise → Repeat
```

**Frecuencia:** Semanal o quincenal.

Solo conserva métricas que **cambian una decisión**. Todo lo demás es ruido.

---

## 🏗️ Eval Harness

### Problema
Si los evals están en scripts dispersos en notebooks y repos diferentes → no son repeatables, no escalan.

### Solución: Eval Harness config-driven

**Primitives:**
- **Task** — qué está evaluando el agente
- **Datasets** — datos de prueba
- **Personas** — user personas para simulación
- **LM Adapter** — qué modelo/how se conecta
- **Evaluator** — qué judge usar

**Format:** YAML config — fácilmente editable por engineers, data scientists, analysts

**Donde se ejecuta:**
1. **Local dev** — feedback inmediato al cambiar prompts
2. **Pre-commit hook** — evitar degradación antes de push
3. **CI/CD** — regression test suite + acceptance tests

---

## 📡 Tracing

**Base de TODO.** Sin tracing no hay evaluación.

**Herramientas:** Langfuse, LangSmith, etc.

**Cada trace captura:**
- Full graph execution (qué nodos corrieron)
- Qué LLM saw (prompts, context)
- Qué tools fueron llamadas
- Token usage y latency

**Annotation Queues:**
Interfaz para que domain experts etiqueten fácilmente (no tienen que leer JSONs raw).
→ Forman datasets para ground truth → validan judges.

---

## 🔁 Closing the Loop — Tres Ejes de Mejora

| Eje | Qué | Ejemplo |
|-----|-----|---------|
| **Model Learning** | Post-training / fine-tuning del modelo base | Fine-tune reward model para RL |
| **Context Learning** | Mejorar qué información ve el agente | Docs, memories, knowledge base |
| **Harness Learning** | Mejorar el harness | System prompt, tool schemas, routing, retries |

---

## ❌ Anti-Patterns de Eval (Checklist)

- ❌ Scores que no gatean nada
- ❌ LM judge demasiado genérico (no actionable)
- ❌ Sin detección de regresiones en producción
- ❌ No mirar los datos (el error más común)
- ❌ Sin ground truth labels para validar judges
- ❌ Criteria definido una vez, nunca evoluciona
- ❌ Sin intervalos de confianza en los reportes

---

**Regla asociada:** `00_Core/01_Rules/16_Meta_Skill_Improvement.mdc`
**Knowledge path:** `02_Knowledge/10_Engineering_Principles/02_AI_Agent_Evals_Lyft.md`
