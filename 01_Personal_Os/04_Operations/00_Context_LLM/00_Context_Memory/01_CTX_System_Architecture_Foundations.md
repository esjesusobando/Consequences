# 🧠 01_CTX_System_Architecture_Foundations

**Estatus**: DOCUMENTO MAESTRO (Compactación v6.1)  
**Fuente de Verdad (SSOT)**: `03_Tasks/`  
**Root**: `01_Core/`

---

## 🏗️ Arquitectura del Sistema
PersonalOS v6.1 se rige por una estructura jerárquica modular diseñada para la máxima eficiencia de contexto en LLM (AI-Prime):

1.  **01_Core**: El cerebro del sistema. Contiene Workflows, Agentes (#01-13) y Skills (#01-18+).
2.  **03_Tasks**: Dimensión dinámica. Es la **única fuente de verdad** para tareas, proyectos activos y rutinas.
3.  **04_Operations**: Dimensión de memoria y procesos (Context Memory, Process Notes).
4.  **08_Scripts_Os**: Automatizaciones y herramientas de auditoría.

## ⚖️ Reglas de Oro (Protocolo AI-Prime)
- **Plan-First**: Nunca ejecutar código complejo sin un plan aprobado. 
- **Idioma**: Comunicación externa siempre en Español. Código en Inglés.
- **Higiene**: Numeración estricta en carpetas (00-XX) para prevenir degradación de contexto.
- **SSOT**: Prohibido duplicar información de tareas fuera de `03_Tasks`.

## 📂 Mapeo de Skills Relevantes
- **Skill 01 (Agent Teams Lite)**: Orquestador SDD.
- **Skill 06 (Testing)**: Garantía de calidad (GGA - Guardian Angel).
- **Skill 18 (Life OS)**: Gestión proactiva de vida y bienestar.

---
*Compactado de archivos CTX 01, 02, 03, 04, 05 | Sincronizado 2026-04-14*
