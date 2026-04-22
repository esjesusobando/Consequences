---
name: ritual-cierre
description: "Ritual de cierre de sesión para terminar el día de trabajo. Ejecuta el script 08_Ritual_Cierre.py. Triggers: ritual cierre, cerrar sesión, finish work, end day, terminar día, goodbye, nos vemos."
version: 1.0.0
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
   python 08_Scripts_Os/Ritual_Fixed/08_Ritual_Cierre.py
   ```
2. Git commit y push automático

### Paso 4: Cerrar

- Recordar aprendizajes nuevos
- Documentar en Rules Registry si aplica

## Reglas

| Regla                   | Descripción           |
|-------------------------|-----------------------|
| Siempre hacer commit    | Nunca dejar sin push  |
| Documentar aprendizajes | Guardar en Engram     |
| Voice notification      | Speaking al completar |

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
