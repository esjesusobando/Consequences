---
name: "jao-skills"
description: "Suite JAO — Entrevistador de Procesos, Humanizador, Optimizador de Prompts, Presentaciones Visuales, Superpowers, Verificador de Datos"
category: "compound"
sota_upgraded: true
---

# 08_JAO — Suite de Skills

Skills del ecosistema JAO para comunicación, productividad y calidad.

## Skills Incluidas

| # | Skill | Descripción | Trigger |
|---|-------|-------------|---------|
| 01 | Entrevistador de Procesos | Entrevista al usuario para definir procesos antes de construir | "quiero crear X", "automatizar Y" |
| 02 | Humanizador | Reescribe textos AI para que suenen humanos | "humaniza esto", "haz que no suene a IA" |
| 03 | Optimizador de Prompts | Transforma ideas desordenadas en prompts claros | "mejora este prompt", "optimiza esto" |
| 04 | Presentaciones Visuales | Crea presentaciones HTML modernas | "haz una presentación", "crea slides" |
| 05 | Superpowers | Modo riguroso para proyectos complejos | "crea una app", "construye esto" |
| 06 | Verificador de Datos | Fact-check de textos y afirmaciones | "verifica esto", "comprueba si es verdad" |

## Uso

Cada skill se activa por su trigger específico. Ver SKILL.md individual en cada subcarpeta.

---

*Suite JAO — Think Different PersonalOS v4.9.1*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
