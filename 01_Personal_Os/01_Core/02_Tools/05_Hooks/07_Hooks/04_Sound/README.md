# 🔊 Sound Notifications - PersonalOS

Módulo de notificaciones de sonido para el sistema PersonalOS.

---

## 📂 Archivos

| Archivo                               | Descripción                                           |
|---------------------------------------|-------------------------------------------------------|
| `notification.py`                     | Script principal de notificaciones                    |
| `task-complete-sound.ps1`             | Script PowerShell para tareas completadas             |
| `task-complete.bat`                   | Batch para ejecución rápida                           |

---

## 🚀 Uso

### Python (Recomendado)

```bash
# Tarea completada (doble beep)
python notification.py --task-complete

# Éxito
python notification.py --success

# Error
python notification.py --error

# Notificación personalizada
python notification.py --notify "Hola mundo"

# Beep simple
python notification.py --beep
```

### PowerShell

```powershell
# Por defecto (Asterisk)
.\task-complete-sound.ps1

# Personalizado
.\task-complete-sound.ps1 -Sound Exclamation -Duration 300
```

### Windows Batch

```batch
task-complete.bat
```

---

## 🎵 Integración con Claude Code

Agregar a tu `CLAUDE.md` o 01_Personal_Os/11_AGENTS.md:

```markdown
## 🔔 Notificaciones de Sonido

Al completar cada tarea significativa:
- Ejecutar: `python 01_Core/07_Hooks/04_Sound/notification.py --task-complete`
```

---

## 🔧 Configuración de Windows

Los sonidos usan el sistema de sonidos de Windows. Asegúrate de que:
1. El volumen no esté muteado
2. Los efectos de sonido estén habilitados

---

## ✅ Verificación

```bash
python notification.py --task-complete
# Output: 🔔 [Task Complete] Reproduciendo sonido...
#         ✅ Sonido reproducido
```

---

*PersonalOS v6.1*
