---
name: ritual-cierre
description: "Ritual de cierre de sesión para terminar el día de trabajo. Ejecuta el script 08_Ritual_Cierre.py. Triggers: ritual cierre, cerrar sesión, finish work, end day, terminar día, goodbye, nos vemos."
version: 1.0.0
sota_upgraded: true
---

# 🌙 Ritual de Cierre - Fin de Sesión

## Propósito

Cerrar la sesión de trabajo de manera segura, persistiendo el progreso y sincronizando con la nube.

## Cuándo Usar Esta Skill

- "ritual cierre"
- "cerrar sesión"
- "finish work"
- "end day"
- "terminar día"
- "nos vemos"

## Flujo del Ritual

### Paso 1: Validar Sistema

1. Verificar salud del sistema (`50_System_Health_Monitor.py`)
2. Validar stack tecnológico (`13_Validate_Stack.py`)
3. Limpiar archivos temporales (`16_Clean_System.py`)

### Paso 2: Sincronizar

1. Actualizar enlaces (`12_Update_Links.py`)
2. Sincronizar notas (`11_Sync_Notes.py`)
3. Generar reporte de progreso (`19_Generate_Progress.py`)

### Paso 3: Persistir

1. Ejecutar script de cierre:
   ```bash
   python 01_Personal_Os/04_Operations/03_Scripts_Os/Ritual_Fixed/08_Ritual_Cierre.py
   ```
2. Git commit y push automático

### Paso 4: Cerrar

- Recordar aprendizajes nuevos
- Documentar en Rules Registry si aplica

## Reglas

| Regla                                                | Descripción                                        |
|-----------------------------------------------------|---------------------------------------------------|
| Siempre hacer commit                                 | Nunca dejar sin push                               |
| Documentar aprendizajes                              | Guardar en Engram                                  |
| Voice notification                                   | Speaking al completar                              |

## Errores Comunes

1. ❌ No ejecutar ritual de cierre
2. ❌ Olvidar documentar aprendizajes
3. ❌ Dejar sin commit cambios importantes
4. ❌ No hacer push a nube

## Integración

- Usa: `system-guardian` para validación
- Usa: `sync-notes` para notas
- Guarda en: Engram con `mem_save`

---

*Skill Version: 1.0.0*
*Script: 08_Ritual_Cierre.py*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
