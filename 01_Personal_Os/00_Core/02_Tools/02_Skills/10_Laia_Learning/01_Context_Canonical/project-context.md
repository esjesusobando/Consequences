# Contrato de Contexto: [Nombre del Proyecto]

> ⚠️ Este archivo define los LÍMITES OPERATIVOS del proyecto. Capa comportamientos del LLM para evitar derivas.

## Reglas Globales de Conversación

- **Patrones Reusables:** Aislar metodologías genéricas y moverlas a `~/wiki/iABrain/patterns/`.
- **Foco de Aterrizaje:** Todo dato específico de ejecución se inyecta en `../Canonical/project-operating-data.md`.
- **Exclusiones Explícitas (Anti-Alucinación):** [Ej. NO generar wireframes. Ir directo a UI por pantalla].

## Reglas de Ingeniería

- **Stack Técnico:** [Lenguajes, frameworks, herramientas prohibidas/obligadas]
- **Arquitectura:** [Decisiones arquitectónicas ya tomadas]
- **Testing:** [Coverage mínimo, frameworks obligatorios]

## Reglas de Comunicación

- **Canal Principal:** [Slack #canal / Discord / Email]
- **Frecuencia de Reports:** [Diario / Semanal / Hit deadlines]
- **Idioma:** [Español / Inglés / Bilingüe]

---

*Generado por iABrain — 2026-05-28*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
