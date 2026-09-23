---
source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\05_Frameworks\08_Anthropic\Claude\01_Modelos_Guia.md"
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\Frameworks\08_Anthropic\Claude\01_Modelos_Guia.md"
sync_date: "2026-08-01T00:55:48.541008"
sync_updated: true
---

# Guía de Modelos Claude

> **Tesoro de guerra**: Elegir el modelo correcto = 5-10x menos tokens por tarea.

---

## Jerarquía de Modelos

```
Haiku → Sonnet → Opus → Fable
  🟢       🟡       🔴       🟣
```

| Modelo | Rol | Ideal para | Costo |
|--------|-----|-----------|-------|
| **Haiku** | Junior | Tareas simples, mucho back-and-forth, entrevistas, drafts, clasificación | 🟢 Mínimo |
| **Sonnet** | Daily Driver | Análisis de segunda capa, tareas cotidianas, código general, contenido | 🟡 Medio |
| **Opus** | Senior Architect | Data analysis, workflows complejos, multi-capa, decisiones arquitectónicas | 🔴 Alto |
| **Fable** | Top Tier | Tareas ultracomplejas, investigación profunda, razonamiento multi-paso | 🟣 Máximo |

## Regla de Oro del Gasto

> **No pongas a tu senior (Opus/Fable) a responder emails.**

Así como no pondrías a tu mejor ingeniero a formatear spreadsheets toda la semana, no uses Opus para tareas que Haiku o Sonnet pueden hacer.

## Research Mode ⚠️

**NO es un modelo** — es una feature toggle dentro del modelo.

**Qué hace**: Escarba la web, recopila recursos, construye un reporte estructurado.

**Costo**: Quema tokens MÁS RÁPIDO que casi cualquier otra cosa.

**Regla**: Usar SOLO con instrucciones hiper-específicas de qué cubrir y qué ignorar.

---

## Estrategia de Uso

| Tarea | Modelo Recomendado |
|-------|--------------------|
| Resumir emails | Haiku |
| Escribir un post de LinkedIn | Sonnet |
| Code review | Sonnet |
| Debug complejo | Opus |
| Arquitectura de software | Opus |
| Investigación profunda | Fable |
| Research Mode | Opus/Fable + instrucciones específicas |
| Entrevista de memory setup | Haiku |
| Draft de propuesta | Sonnet |
| Análisis de datos | Opus |


> 🔗 Zona: [[03_Reference/01_Knowledge/Referencias/Frameworks/08_Anthropic/Claude/README]]
