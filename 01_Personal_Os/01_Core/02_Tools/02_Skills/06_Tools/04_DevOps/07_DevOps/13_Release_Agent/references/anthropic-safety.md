# Anthropic Safety Standards — Release Agent Reference

## Responsible Scaling Policy (RSP) v3.0

Anthropic publica actualizaciones de su RSP cada 3-6 meses. La lógica central es simple:
**las salvaguardas deben ser proporcionales al nivel de riesgo del modelo o cambio.**

### Niveles ASL aplicados a releases

| Nivel     | Riesgo                                 | Qué implica para un release                                     |
|----------|---------------------------------------|----------------------------------------------------------------|
| **ASL-2** | Baseline (todos los modelos actuales)  | Clasificadores de input/output activados, monitoreo estándar    |
| **ASL-3** | Alto riesgo (CBRN, autonomía extendida)| Revisión externa obligatoria, aprobación formal antes del deploy|
| **ASL-4+**| No implementado aún                    | Requiere industria completa, no unilateral                      |

### Principio de proporcionalidad

> "Las salvaguardas más estrictas se concentran en los modelos o cambios de mayor riesgo, sin bloquear el progreso en los de menor riesgo."

En la práctica para releases de software con IA integrada:

1. **Código generado por IA en rutas críticas** → tratarlo como ASL-3: revisión humana obligatoria
2. **Código generado por IA en utilidades** → ASL-2 es suficiente: tests automáticos + revisión superficial
3. **Código escrito por humanos en rutas críticas** → ASL-2 con tests exhaustivos

### Criterio de código opaco

Si la IA generó código y no entiendes qué hace exactamente, ese código pertenece a la categoría **"Importante"** del test matrix. No puede ir a producción sin que un humano lo entienda.

Esto aplica especialmente a:
- Lógica de autenticación/autorización
- Manipulación de datos sensibles
- Llamadas a APIs externas de pago o identidad

---

## Agent Skills — Arquitectura Anthropic

Las Skills siguen el principio de **progressive disclosure**:
- El SKILL.md se carga completo en contexto (~pocos tokens)
- Los archivos de referencia solo se cargan cuando la tarea los necesita
- Los scripts se ejecutan sin cargar su contenido en contexto

Esto evita saturar la ventana de contexto del modelo.

### Estructura obligatoria

```
skill-name/
├── SKILL.md          # Requerido. Frontmatter YAML + cuerpo markdown
├── references/       # Cargados bajo demanda
└── scripts/          # Ejecutados, no leídos
```

### Campos frontmatter requeridos

| Campo          | Longitud máx| Descripción                      |
|---------------|------------|---------------------------------|
| `name`         | 64 chars    | minúsculas, guiones, sin espacios|
| `description`  | 1024 chars  | qué hace + cuándo usarlo         |
| `allowed-tools`| —           | herramientas sin confirmación    |

---

## Fuentes

- Anthropic RSP v3.0 (febrero 2026): https://www.anthropic.com/responsible-scaling-policy
- Agent Skills Open Standard: https://agentskills.io
- Anthropic Engineering Blog: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
