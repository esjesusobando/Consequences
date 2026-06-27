# Trade-offs Guide

## Cómo Presentar Alternativas

### Formato
Para cada opción:
1. **Descripción breve** (1-2 oraciones)
2. **Pros** (2-3 bullets)
3. **Cons** (2-3 bullets)
4. **Complejidad estimada** (baja/media/alta)

### Ejemplo

#### Opción A: Solución Simple
- **Descripción**: Usar un solo componente con props
- **Pros**: Fácil de entender, rápido de implementar
- **Cons**: Menos reutilizable, hardcodeado para este caso
- **Complejidad**: Baja

#### Opción B: Solución Flexible
- **Descripción**: Usar composición de componentes
- **Pros**: Reutilizable, escalable
- **Cons**: Más código inicial, learning curve
- **Complejidad**: Media

### Recomendación
Siempre recomendar una opción y explicar POR QUÉ.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
