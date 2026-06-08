# 🧠 20_CTX Hillary Life OS Operational Flows

**Contexto**: Flujos de Trabajo PersonalOS  
**Origen**: Skill 18 (Personal Life OS)

## 🔄 Flujo 1: Quick Capture (Entrada)
Todo pensamiento, tarea o insight se procesa mediante la sintaxis `[tag]`. 
- **Destino**: `03_Tasks/02_Hillary_Inbox/`.
- **Estructura**: Nombre de archivo cronológico `YYYY-MM-DD-HHmm-{slug}.md`.

## 🔄 Flujo 2: Plan My Day (Planificación)
Hillary realiza un triage del inbox cada mañana o sesión.
- **Lógica**: Divide las tareas en 3 fases de energía (🌅 Mañana, 🌞 Tarde, 🌙 Noche).
- **Interacción**: Genera la **Daily_Routine.md** en la raíz de `03_Tasks`.
- **Plantilla**: Usa `06_Routine_Master.md` como estándar de diseño.

## 🔄 Flujo 3: Daily Notes & Logs (Seguimiento)
Implementación pasiva del "Yapper's API".
- **Logging**: Registra actividades significativas en `03_Tasks/Daily_Activity_Log.md`.
- **Métricas**: Analiza picos de productividad y context switching para optimizar rutinas futuras.

## 🔄 Flujo 4: Transcripción (Voice-to-Task)
Las notas de voz se transcriben mediante Whisper, se anonimizan (PII protection) y se depositan en el Inbox para posterior triage por Hillary.

---
*Contexto Operativo | Guía de Acción para Agentes*
