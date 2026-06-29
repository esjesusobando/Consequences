# Template de Referencia

## Propósito

Este archivo sirve como guía para crear referencias efectivas en las skills.

## Estructura de una Buena Referencia

1. **Título claro** - Qué cubre esta referencia
2. **Contexto** - Cuándo usarla
3. **Contenido técnico** - Información detallada
4. **Ejemplos** - Casos de uso prácticos
5. **Recursos adicionales** - Links a documentación externa

## Cuándo Usar References

| Tipo de Info                                      | Dónde                                                 |
|--------------------------------------------------|------------------------------------------------------|
| API detallada                                     | references/API.md                                     |
| Esquemas de datos                                 | references/SCHEMAS.md                                 |
| Guías paso a paso                                 | references/GUIDES.md                                  |
| Patrones de diseño                                | references/PATTERNS.md                                |

## Ejemplo de Template

```markdown
# Nombre del Tema

## Resumen
Breve descripción del tema.

## Contexto de Uso
Cuándo consultar esta referencia.

## Contenido Técnico
Información detallada...

## Ejemplos
```ejemplo
código de ejemplo
```

## Véase También
- [Referencia relacionada](./otra-referencia.md)
- [Documentación externa](https://ejemplo.com)
```

---

**Nota:** Las referencias deben ser concisas pero completas. Evitar redundancia con SKILL.md.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
