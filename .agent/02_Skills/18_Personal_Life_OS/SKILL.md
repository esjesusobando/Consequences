# 🎛️ Skill 18: Personal Life OS (Hillary Integration)

> **Core Instructions for AI Agents**

---

## 📖 Overview

Esta skill permite a cualquier agente (especialmente a @13_hillary) gestionar el sistema de productividad personal basado en los 5 módulos del Life OS.

## 📂 Structure

```
18_Personal_Life_OS/
├── 01_Quick_Capture/    # Lógica de captura rápida
├── 02_Plan_My_Day/      # Planeador basado en energía
├── 03_Daily_Notes/      # Log de observación activa
├── 04_Recording_Mode/    # Transcripción y anonimización
└── 05_Returns_Tracker/   # Detector de patrones y auto-skills
```

## 🛠️ Operational Instructions

### 01. Quick Capture
- **Input**: Cualquier pensamiento o tarea.
- **Action**: Crear un archivo `.md` en `03_Tasks/02_Hillary_Inbox/` con el formato:
  ```markdown
  ---
  created: YYYY-MM-DD HH:MM
  tags: [tag1, tag2]
  status: inbox
  ---
  # [Título corto]
  [Contenido original]
  ```

### 02. Plan My Day
- **Action**: Leer `03_Tasks/02_Hillary_Inbox/` y el backlog. Generar un bloque de rutina en `03_Tasks/Daily_Routine.md` usando la plantilla `03_Tasks/00_Templates/06_Routine_Master.md`.
- **Lógica de Energía**:
  - 🌅 Mañana: Alta energía (Focus Deep Work) -> Tareas P0/Exploración.
  - 🌞 Tarde: Media energía (Meetings/Admin) -> Tareas P1/E-mail.
  - 🌙 Noche: Baja energía (Review/Relax) -> Triage/Higiene.

### 03. Daily Notes
- **Action**: Registrar eventos significativos durante la ejecución en `03_Tasks/Daily_Activity_Log.md`.

## 📜 Rules

1.  **No Duplicates**: Verificar que la tarea no exista en `03_Tasks`.
2.  **Tag First**: Siempre usar brackets `[]` para identificar categorías.
3.  **Proactive Triage**: Hillary debe procesar el inbox al inicio de cada sesión de "Life OS".

---
*v6.1 | Source of Truth: 01_Core/03_Skills/18_Personal_Life_OS/README.md*
