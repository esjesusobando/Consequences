---
name: "system-guardian"
description: "System Guardian - Validación automática de estructura, nombres, links y más"
sota_upgraded: true
---

# System Guardian

El System Guardian valida automáticamente la integridad del proyecto.

## Comandos

```bash
gr              # Dry-run - solo mostrar issues
gr --apply      # Aplicar fixes automáticos
gr --agents     # Ejecutar 3 agents de validación
```

## Qué Valida

### 1. Estructura de Carpetas
- Verifica que existan carpetas 00-08
- Nombres con formato: XX_Nombre/

### 2. Convenciones de Nombres
- Archivos: XX_Nombre.ext
- Sin espacios, sin caracteres especiales

### 3. Links Rotos
- Busca referencias a archivos que no existen
- Markdown links rotos

### 4. Archivos Huérfanos
- Archivos sin referencias en README

## Integración

El System Guardian se ejecuta:
- Al iniciar sesión (opcional)
- Antes de commit (via GGA)
- Manual cuando se requiera

## Personalización

Para agregar más validaciones, editar:
`01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/01_Auditor_Hub.py`


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
