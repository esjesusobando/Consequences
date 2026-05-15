---
name: anthropic-harness
description: "Framework de evaluación y calidad para agentes IA. Triggers: eval, evaluación, quality metrics, pass@k, evaluator pattern, context management, sprint contract."
version: 1.0.0
---

# Anthropic Harness — Skill Index

## Esencia Original

> **Metaskill**: Habilidad para diseñar e implementar sistemas de evaluación de agentes IA que miden calidad, contexto y seguridad de outputs automáticamente.

Esta skill es el **marco de calidad** del PersonalOS. Permite evaluar agentes, definir métricas y mantener estándares de producción.

## Descripción
Framework de evaluación y calidad para agentes de IA: patrones de evaluación, gestión de contexto, contratos de sprint, seguridad en modo auto y métricas de calidad.

## Sub-Skills

| #                               | Skill                                               | Descripción                                                        |
|---------------------------------|-----------------------------------------------------|--------------------------------------------------------------------|
| 01                              | `01_Evaluator_Pattern`                              | Patrón de evaluador para outputs de IA                             |
| 02                              | `02_Context_Management`                             | Gestión avanzada de contexto                                       |
| 03                              | `03_Sprint_Contract`                                | Contrato de sprint para agentes                                    |
| 04                              | `04_Auto_Mode_Security`                             | Seguridad en modo automático                                       |
| 05                              | `05_Pass_At_Metrics`                                | Métricas pass@k para evaluación                                    |
| 06                              | `06_Eval_Awareness`                                 | Conciencia de evaluación en agentes                                |
| 07                              | `07_Feature_List_JSON`                              | Lista de features en formato JSON                                  |
| 08                              | `08_Graders_Framework`                              | Framework de graders para evaluación                               |

## Uso
Activar cuando se necesita evaluar calidad de outputs o configurar harness de evaluación de agentes.

---

## ⚠️ Gotchas

### ERROR 1: Métricas sin baseline de comparación
- **Por qué**: Sin benchmark inicial, no hay forma de saber si el modelo mejora o empeora
- **Solución**: Always establecer baseline con dataset representativo antes de iterar

### ERROR 2: Evaluar con prompts incluidos en el test
- **Por qué**: El modelo puede memorizar respuestas en lugar de aprender el patrón
- **Solución**: Usar dataset separado para eval, distinto del training set

### ERROR 3: pass@k sin sample size suficiente
- **Por qué**: Con pocas samples, el error muestral hace que k=1 sea muy volátil
- **Solución**: Usar k=5 o k=10 con al menos 100 problemas para resultados estadísticamente significativos

---

*Skill Version: 2.0*
*Framework: Anthropic Skill Creator v2.0 + PersonalOS SOTA v5.1*
*Last Updated: 2026-04-20*
