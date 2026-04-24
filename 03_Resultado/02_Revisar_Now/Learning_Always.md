# 🧠 LearningAlways Methodology

> Sistema de conocimiento compounding para OS personal — v1.0

---

## ¿Qué es?

Workflow que transforma **cualquier URL** en conocimiento estructurado, integración al OS, y contenido ready-to-use. Cada input genera 8 deliverable customizados para 7 perfiles de agente distintos.

---

## Input → Output

```
INPUT:  Cualquier URL (video, artículo, tutorial, doc)
OUTPUT: 8 deliverable por cada URL
```

---

## 🎯 Los 8 Deliverables

| #            | Deliverable                          | Descripción                                        |
|--------------|--------------------------------------|----------------------------------------------------|
| 1            | **Resumen 500 palabras**             | ES + EN, accesible para Junior                     |
| 2            | **Prompts Usados**                   | Extraídos del contenido + 7 perfiles ES/EN         |
| 3            | **Demos Junior**                     | Tutoriales paso a paso con código                  |
| 4            | **Herramientas**                     | Herramientas usadas en cada demo                   |
| 5            | **Insights Learning Always**         | Para ~/Knowledge y ~/Context                       |
| 6            | **Posts Redes**                      | Facebook, Instagram, X, LinkedIn                   |
| 7            | **Mega Prompt**                      | Customizado para GEMs/GPTs                         |
| 8            | **Ingeniería Inversa**               | Análisis de cómo fue construido                    |

---

## 📂 Estructura de Carpetas

```
07_Projects/00_Context/
├── 00_Learning_Always/
│   ├── 01_LA_[Descripcion]/
│   │   ├── 00_Raw_Content/
│   │   │   └── 01_Video_Info.md
│   │   ├── 01_Resumen_500_Palabras/
│   │   │   └── 01_Resumen_500_Palabras.md
│   │   ├── 02_Prompts_Usados/
│   │   │   ├── ES.md
│   │   │   └── EN.md
│   │   ├── 03_Demos_Junior/
│   │   │   ├── 01_Midjourney_Basico.md
│   │   │   ├── 02_Midjourney_Avanzado.md
│   │   │   └── 03_Midjourney_Marketing.md
│   │   ├── 04_Herramientas/
│   │   │   └── 04_Herramientas.md
│   │   ├── 05_Insights_Segundo_Cerebro/
│   │   │   └── 05_Insights_Segundo_Cerebro.md
│   │   ├── 06_Post_Redes/
│   │   │   ├── Facebook.md
│   │   │   ├── Instagram.md
│   │   │   ├── X_Twitter.md
│   │   │   └── LinkedIn.md
│   │   ├── 07_Mega_Prompt/
│   │   │   └── 07_Mega_Prompt_Gems_GPTs.md
│   │   ├── 08_Ingenieria_Inversa/
│   │   │   └── 08_Ingenieria_Inversa.md
│   │   └── 09_OS_Mejoras/
│   │       └── 09_OS_Mejoras.md
│   └── 00_Index_Learnings.md
```

---

## 👥 Perfiles de Agente (02-07 + Marketing)

| #            | Perfil                  | Ubicación en Skills                             |
|--------------|-------------------------|-------------------------------------------------|
| 01           | Project Manager         | `01_Core/03_Skills/02_Project_Manager/`         |
| 02           | Product Manager         | `01_Core/03_Skills/03_Product_Manager/`         |
| 03           | Product Design          | `01_Core/03_Skills/04_Product_Design/`          |
| 04           | Vibe Coding             | `01_Core/03_Skills/05_Vibe_Coding/`             |
| 05           | Testing                 | `01_Core/03_Skills/06_Testing/`                 |
| 06           | DevOps                  | `01_Core/03_Skills/07_DevOps/`                  |
| 07           | Marketing               | `01_Core/03_Skills/09_Marketing/`               |

---

## 🔄 Integración al OS (Automejora)

```
INPUT URL
    ↓
[1] Fetch/extraer contenido
    ↓
[2] Identificar herramientas mencionadas
    ↓
[3] Verificar si herramienta existe en contexto
    ↓
[4] SI NO → Investigar → Agregar al OS
    ↓
[5] SI YA → Actualizar con nuevo conocimiento
    ↓
[6] Documentar en estructura
    ↓
[7] Guardar en Learning Always + Engram
    ↓
OUTPUT: OS mejorado + docs actualizados + conocimiento conectable
```

### Beneficio Compounding

```
URL_1 → Conocimiento_1 + Mejora_OS
URL_2 → Conocimiento_2 + Mejora_OS + Conexión_URL_1
URL_3 → Conocimiento_3 + Mejora_OS + Conexión_URL_1-2
...
URL_N → Conocimiento_N + OS_Mejor + Red_Conocimiento
```

---

## 🚀 Uso

```bash
/Learning [URL]
```

---

## 🌟 Por qué es SOTA?

| Factor                              | Descripción                                   |
|-------------------------------------|-----------------------------------------------|
| **Input agnostic**                  | Cualquier URL → mismo pipeline                |
| **Output compounding**              | 8 deliverable por input = 8x ROI              |
| **Multi-perspectiva**               | Mismo contenido × 7 perfiles                  |
| **Ingeniería inversa real**         | No solo "qué" sino "cómo" y "por qué"         |
| **Megaprompt reutilizable**         | Portable a cualquier LLM                      |
| **Automejora integrada**            | Cada URL mejora el OS                         |
| **Learning real**                   | Información estructurada reusable             |

---

## 📌 URLs Procesadas

| #            | URL                                | Tema                                    | Estado          |
|--------------|------------------------------------|-----------------------------------------|-----------------|
| 01           | youtube.com/...5v0Jj6s3DdA         | Creative Heroes — IA Generativa         | ✅               |
| 02           | youtube.com/...b6hfk8k-UVk         | Recall 2.0 — Knowledge + AI             | ⏳               |
| 03           | youtube.com/...N9RhW5pexrs         | Claude Computer Use                     | ⏳               |
| 04           | Transcripción INBOUND '25          | AI Fundamentals + How to Win            | ✅               |
| 05           | youtube.com/...slCl7LrStTM         | [Pendiente]                             | ⏳               |
| 06           | youtube.com/...8FDjwGAJBts         | [Pendiente]                             | ⏳               |

---

## 🔗 Conexiones

Los insights de cada análisis van a **06_Unicorn/** según la disciplina:

| Disciplina              | Ubicación                                            |
|-------------------------|------------------------------------------------------|
| Project Manager         | `02_Knowledge/06_Unicorn/01_Pm/`                     |
| Product Manager         | `02_Knowledge/06_Unicorn/02_Pdm/`                    |
| Product Design          | `02_Knowledge/06_Unicorn/03_Product_Design/`         |
| Engineering             | `02_Knowledge/06_Unicorn/06_Engineering/`            |

---

## ⚙️ Workflows del Sistema

| #            | Workflow                       | Función                             | Trigger                       |
|--------------|--------------------------------|-------------------------------------|-------------------------------|
| 01           | Iron_Man_Gen                   | Inicio de sesión                    | `/genesis`                    |
| 02           | Spider_Brainstorm              | Exploración colaborativa            | `/brainstorm`                 |
| 03           | Professor_X_Plan               | Planificación                       | `/plan`                       |
| 04           | Vision_Review                  | Code review exhaustivo              | `/review`                     |
| 05           | Thor_Work                      | Ejecución de planes                 | `/work`                       |
| 06           | Hulk_Compound                  | Documentación de soluciones         | `/compound`                   |
| 07           | AntMan_Lfg_Lite                | Ciclo lite (12 pasos)               | `/lfg-lite`                   |
| 08           | Doc_Strange_Lfg                | Ciclo completo (18 pasos)           | `/lfg-pro`                    |
| 09           | Validar_Reglas                 | Validación de rules                 | `/validar`                    |
| 10           | Frontend_Premium               | UI/UX Design                        | `/frontend`                   |
| 11           | AI_Task_Template               | Plantilla de tareas                 | `/task-template`              |
| 12           | Ritual_Cierre_Protocol         | Cierre de sesión                    | `/cierre`                     |
| 13           | Context_Recovery               | Recuperar contexto                  | `/recover`                    |
| 14           | System_Health_Audit            | Auditoría del sistema               | `/audit`                      |
| 15           | Captura_Rapida                 | Captura ideas                       | `/captura`                    |
| 16           | Deep_Work_Session              | Trabajo profundo                    | `/deep-work`                  |
| 17           | Ship_It                        | Publicación                         | `/ship`                       |
| 18           | Anthropic_Harness              | Harness agents                      | [internal]                    |
| 19           | Multi_Agent_Roles              | Pipeline multi-agent                | [internal]                    |
| 20           | Redaccion_de_Docs              | Memos estratégicos                  | `/memo`                       |
| 21           | Backlog_Processing             | Procesar backlog                    | `/backlog`                    |
| 22           | Content_Generation             | Generación contenido                | `/content-generation`         |
| 23           | Morning_Standup                | Inicio de día                       | `/standup`                    |
| 24           | Weekly_Review                  | Revisión semanal                    | `/weekly`                     |
| 25           | Hillary_Life_OS                | Productividad life OS               | `/hillary`                    |
| 26           | **Learning_Always**            | Knowledge compounding               | `/learning`                   |

---

## 📋 Changelog

| Versión          | Fecha              | Cambios                                                     |
|------------------|--------------------|-------------------------------------------------------------|
| v1.0             | 2026-04-18         | Metodología inicial con 8 deliverable + workflow 26         |
| v1.1             | 2026-04-20         | INBOUND '25 + Transcripción (10 deliverable)                |

---

⌤ **Learning Always:** Aprende + documenta + repte → **OS mejorado**

*Generated by Think Different PersonalOS v6.1 | Pure Green State*
