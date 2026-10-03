# Engram Sync — Captura Automática de Learnings

> **Propósito:** Sincronizar aprendizajes entre Consequences y Engram.
> **Regla:** Cada learning importante se guarda en Engram y se refleja en `03  -  Resources/01_AI_Research_OS/`.
> **Principio de filtrado:** Solo se sincroniza información que suma, es vital e importante. Ruido y contenido de baja relevancia no cruzan la frontera del segundo cerebro.

## Flujo de Sincronización

```
Consequences (03_Resources/01_AI_Research_OS/) ──→ Engram (mem_save) ──→ Engram (persistent memory)
Engram (mem_search) ────────────────────────────────────────────────→ Consequences (03_Resources/01_AI_Research_OS/)
```

## Tipos de Captura

| Tipo | Engram Type | Destino en Consequences |
|------|-------------|-------------------------|
| Pattern | `pattern` | `03  -  Resources/01_AI_Research_OS/Patterns/` |
| Convention | `pattern` | `03  -  Resources/01_AI_Research_OS/Conventions/` |
| Learning | `learning` | `03  -  Resources/01_AI_Research_OS/Aprendizajes/` |
| Decision | `decision` | `03  -  Resources/01_AI_Research_OS/Referencias/` |
| Post-mortem | `bugfix` | `03  -  Resources/01_AI_Research_OS/Post_Mortems/` |

## Comandos de Sincronización

### Guardar desde Consequences a Engram

```bash
# Guardar un learning vital
mem_save title="[learning]" type="learning" content="[content]"

# Guardar un pattern descubierto
mem_save title="[pattern]" type="pattern" content="[content]"

# Buscar learnings en Engram
mem_search query="[query]"
```

### Filtrado: Qué sincronizar

Solo se sincroniza al segundo cerebro (Engram) cuando:
- Es un **learning** que cambia cómo se trabaja
- Es un **pattern** que se repite y merece documentación
- Es una **decisión** arquitectónica con impacto duradero
- Es un **post-mortem** con lecciones accionables

NO se sincroniza:
- Notas de trabajo temporales
- Contenido de baja relevancia o ruido
- Información efímera sin valor duradero

## Template de Learning (para Engram)

```yaml
title: "[Qué se aprendió]"
type: learning  # pattern | decision | bugfix | learning
content: |
  **What**: [Qué se hizo]
  **Why**: [Por qué se hizo]
  **Where**: [Dónde se aplicó]
  **Learned**: [Qué se aprendió]
```

## Convenciones

### Patterns
- Nombre: `[Área]_[Patrón]_[Versión].md`
- Ejemplo: `AgentSkills_Architecture_v1.md`
- Contenido: Problema → Solución → Cuándo usarlo

### Conventions
- Nombre: `[Área]_[Convención].md`
- Ejemplo: `Naming_Standard.md`
- Contenido: Regla → Ejemplo → Excepciones

---
*Consequences — Punto de sincronización Engram ↔ Knowledge*
