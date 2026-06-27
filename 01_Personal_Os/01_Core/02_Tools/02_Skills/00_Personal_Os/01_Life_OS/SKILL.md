---
name: personal-life-os
description: "Sistema de productividad personal Life OS. Triggers: life os, Hillary, productivity, daily planning, quick capture, plan my day, daily notes."
version: 1.0.0
sota_upgraded: true
---

# 🎛️ Skill 18: Personal Life OS (Hillary Integration)

## Esencia Original

> **Metaskill**: Sistema de gestión de vida personal que integra capture, planificación, notas y tracking de patrones usando IA.

Esta skill es el **centro de productividad personal** del PersonalOS. Organiza la vida diaria, captura ideas y optimiza el flujo de trabajo personal.

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
- **Action**: Crear un archivo `.md` en `03_Task/02_Hillary_Inbox/` con el formato:
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
- **Action**: Leer `03_Task/02_Hillary_Inbox/` y el backlog. Generar un bloque de rutina en `03_Task/Daily_Routine.md` usando la plantilla `03_Task/00_Templates/06_Routine_Master.md`.
- **Lógica de Energía**:
  - 🌅 Mañana: Alta energía (Focus Deep Work) -> Tareas P0/Exploración.
  - 🌞 Tarde: Media energía (Meetings/Admin) -> Tareas P1/E-mail.
  - 🌙 Noche: Baja energía (Review/Relax) -> Triage/Higiene.

### 03. Daily Notes
- **Action**: Registrar eventos significativos durante la ejecución en `03_Task/Daily_Activity_Log.md`.

## 📜 Rules

1.  **No Duplicates**: Verificar que la tarea no exista en `03_Task`.
2.  **Tag First**: Siempre usar brackets `[]` para identificar categorías.
3.  **Proactive Triage**: Hillary debe procesar el inbox al inicio de cada sesión de "Life OS".

---

## ⚠️ Gotchas

### ERROR 1: Capturar sin categorizar
- **Por qué**: Ideas sin tags se pierden en el inbox
- **Solución**: Always agregar tags al momento de capture

### ERROR 2: Planear sin considerar energía
- **Por qué**: Tareas P0 en momento de baja energía = productividad baja
- **Solución**: Matchear tareas con nivel de energía del momento

### ERROR 3: No revisar el inbox diariamente
- **Por qué**: Acumulación de tareas sin procesar genera ansiedad
- **Solución**: Process inbox mínimo 2x al día (mañana y noche)

---

*Skill Version: 2.0*
*Framework: Anthropic Skill Creator v2.0 + PersonalOS SOTA v5.1*
*Last Updated: 2026-04-20*

---

*v6.1 | Source of Truth: 01_Personal_Os/01_Core/02_Tools/02_Skills/00_Personal_Os/01_Life_OS/18_Personal_Life_OS/README.md*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
