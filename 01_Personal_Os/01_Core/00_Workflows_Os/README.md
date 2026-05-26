# 🔄 PersonalOS Workflows v4.8 Consequences — Think Different

Directorio centralizado de los flujos de trabajo operativos de PersonalOS. Los flujos están organizados temáticamente para maximizar la eficiencia y la capitalización de conocimiento.

**Ruta:** `01_Personal_Os/01_Core/00_Workflows_Os/`
**Total:** 30 workflows en 7 categorías

---

## 🧭 Categorías

### 00_Learning_Always — Continuous Learning
*Módulo de aprendizaje continuo.*
- `00_Learning_Always.md` — Workflow de aprendizaje permanente

### 01_Personal_Os — Ritmos Core
*Rituales operativos indispensables para el funcionamiento diario del sistema.*
1. `01_Morning_Standup.md` — Planificación y foco matutino
2. `02_Backlog_Processing.md` — Triaje de tareas pendientes
3. `03_Content_Generation.md` — Generación acelerada de valor
4. `04_Weekly_Review.md` — Alineación estratégica semanal
5. `05_Ritual_Cierre_Protocol.md` — Protocolo de cierre de sesión
6. `06_Validar_Reglas.md` — Validación de reglas del sistema
7. `07_System_Health_Audit.md` — Auditoría de salud del sistema
8. `08_Context_Recovery.md` — Recuperación de contexto
9. `09_AI_Task_Template.md` — Template de tareas AI
10. `10_Classify_Task.md` — Clasificador de tareas
11. `11_AGENTS.md` — Reglas de agentes

### 02_Marvel — The Avengers
*Identidades temáticas para la orquestación y ejecución experta.*
- `01_Iron_Man_Gen.md` — **Genesis y Boot del sistema**
- `02_Spider_Brainstorm.md` — Brainstorming ágil
- `03_Professor_X_Plan.md` — Planificación estratégica
- `04_Vision_Review.md` — Revisión de visión
- `05_Thor_Work.md` — Ejecución imparable
- `06_Hulk_Compound.md` — Capitalización agresiva de soluciones
- `07_AntMan_Lfg_Lite.md` — LFG liviano
- `08_Doc_Strange_Lfg.md` — LFG completo

### 03_Gentleman — UX & Docs
*Flujos de diseño premium y redacción técnica de alta calidad.*
- `10_Frontend_Premium.md` — Diseño frontend premium
- `20_Redaccion_de_Docs.md` — Documentación técnica

### 04_Hillary — Life OS
*Gestión integral del inbox y captura rápida de información.*
- `15_Captura_Rapida.md` — Captura rápida de ideas
- `25_Hillary_Life_OS.md` — Sistema de vida personal

### 05_Compound_Engineering — Técnica & Deep Work
*Metodologías avanzadas de ingeniería y sesiones de alto rendimiento.*
- `16_Deep_Work_Session.md` — Sesiones de trabajo profundo
- `17_Ship_It.md` — Workflow de entrega
- `18_Anthropic_Harness.md` — Harness Anthropic
- `19_Multi_Agent_Roles.md` — Roles multi-agente

### 06_Youtube_Full_Video — Video Production Pipeline
*Pipeline completo de producción de video para YouTube.*
- `__Youtube_Full_Video.md` / `99_Youtube_Full_Video.md` — Workflow de producción (véase nota)

> **Nota:** `06_Youtube_Full_Video/` tiene dos archivos (`__Youtube_Full_Video.md` y `99_Youtube_Full_Video.md`) que son idénticos en contenido. Pendiente de consolidación.

---

## 📋 Cómo usar los workflows

Cada archivo contiene su propio frontmatter YAML con `name`, `description` y `argument-hint` para invocación directa.

```bash
# Ejecutar un workflow específico vía HUB
python 01_Personal_Os/04_Operations/03_Scripts_Os/08_Workflow_Hub.py run <workflow-name>

# O simplemente leer el archivo .md y seguir sus pasos
```

---

> [!TIP]
> El workflow **Iron Man Genesis** (`02_Marvel/01_Iron_Man_Gen.md`) debe ejecutarse al inicio de CADA sesión para cargar el contexto completo del sistema.

---

*Actualizado: 2026-05-26 | v4.8 Consequences*
