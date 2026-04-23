# 🧠 Context Memory Master Catalog

Directorio de memoria persistente para la continuidad de agentes. Las sesiones históricas han sido compactadas para maximizar la ventana de contexto del LLM.

---

## 📚 Volúmenes Maestros (Compactación v6.1)

| #     | Documento                                                                        | Propósito                                   | Estado     |
|-------|----------------------------------------------------------------------------------|---------------------------------------------|------------|
| 01    | [System Architecture Foundations](./01_CTX_System_Architecture_Foundations.md)   | Fundamentos, SSOT, Reglas de Oro.           | ✅ SOTA     |
| 02    | [Agent Ecosystem and SOP](./02_CTX_Agent_Ecosystem_and_SOP.md)                   | Escuadrón de 13 agentes, roles y AIPM.      | ✅ SOTA     |
| 03    | [Operations and Project History](./03_CTX_Operations_and_Project_History.md)     | Hitos OIM, Hillary, Logs de Sesión 01-19.   | ✅ SOTA     |

---

## 📂 Archivo Histórico
Los archivos originales (01-19) se encuentran en la carpeta `_archive/` para consulta forense si fuera necesario.

---

## 📋 Sesión Actual (2026-04-21)

| #   | Documento                                                                 | Estado     |
|-----|---------------------------------------------------------------------------|------------|
| 04  | [Auditoría de Rutas y Corrección](./04_CTX_Auditoria_Rutas_2026-04-21.md) | ✅ COMPLETO |

---

*Actualizado: 2026-04-21 | Think Different PersonalOS v1.1*

---

## 🔄 Diferencia entre directorios

| Directorio                 | Contenido                                       | Para quién            |
|----------------------------|-------------------------------------------------|-----------------------|
| `01_Context_Memory/`       | Reportes técnicos, métricas, validaciones       | **AGENTE (AI)**       |
| `03_Process_Notes/`        | Notas de proceso, decisiones, sesiones          | **USUARIO**           |

---

## 📁 Contenido

### 📋 Template de Sesión

| #         | Documento             | Descripción                                                          |
|-----------|-----------------------|----------------------------------------------------------------------|
| 01        | Sesion_Template       | Plantilla para reportes de sesión (métricas, tokens, contexto)       |

### 📊 Context Memory (Sesiones)

| #         | Documento            | Fecha         | Descripción                         |
|-----------|----------------------|---------------|-------------------------------------|
| 02        | Context_Memory       | 16 Mar        | Reporte de contexto de sesión       |
| 03        | Context_Memory       | 16 Mar        | Reporte de contexto de sesión       |
| 04        | Context_Memory       | 16 Mar        | Reporte de contexto de sesión       |

### 🏗️ Sistema SOTA

| #         | Documento                    | Fecha         | Descripción                       |
|-----------|------------------------------|---------------|-----------------------------------|
| 05        | Sistema_SOTA_Skills_v2       | 20 Mar        | Arquitectura de skills v2.0       |

### 🔍 Validaciones AIPM Elite

| #         | Documento                                       | Fecha         | Descripción                     |
|-----------|-------------------------------------------------|---------------|---------------------------------|
| 06        | AIPM_Elite_Validation_Metricas_Trazas           | 20 Mar        | Métricas y trazas               |
| 07        | AIPM_Elite_Validation_Context_Robbery           | 21 Mar        | Auditoría context robbery       |
| 08        | AIPM_Elite_Validation_Auditoria_Riesgos         | 21 Mar        | Auditoría de riesgos            |
| 09        | AIPM_Elite_Validation_Analisis_Forense          | 21 Mar        | Análisis forense                |
| 10        | AIPM_Elite_Validation_Control_Presupuesto       | 21 Mar        | Control de presupuesto          |
| 11        | AIPM_Elite_Validation_Validacion_Final          | 23 Mar        | Validación final                |

### 📦 JSONs de Validación

| #         | Archivo                                     | Fecha         |
|-----------|---------------------------------------------|---------------|
| 01        | CTX_Elite_Validation_2026-03-20             | 20 Mar        |
| 02        | CTX_Elite_Validation_2026-03-21_12-56       | 21 Mar        |
| 03        | CTX_Elite_Validation_2026-03-21_13-42       | 21 Mar        |
| 04        | CTX_Elite_Validation_2026-03-21_14-08       | 21 Mar        |
| 05        | CTX_Elite_Validation_2026-03-21_15-28       | 21 Mar        |
| 06        | CTX_Elite_Validation_2026-03-23_11-16       | 23 Mar        |

---

## 📌 Uso

### Crear nuevo reporte de sesión
1. Copiar `01_Sesion_Template.md`
2. Renombrar a `XX_Context_Memory_YYYY-MM-DD.md`
3. Completar YAML frontmatter
4. Documentar: objetivos, métricas, aprendizajes

### Guardar validación del sistema
Ejecutar script de validación → guardar como `XX_AIPM_Elite_Validation_*.md`

**Nota:** Para notas personales de trabajo y decisiones, usar `03_Process_Notes/`.
