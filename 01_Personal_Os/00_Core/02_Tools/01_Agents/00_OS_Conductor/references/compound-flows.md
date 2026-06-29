# 🔄 Compound Flows — Referencia Detallada

> **Propósito:** Documentación extensa de cada flujo compuesto para cargar bajo demanda (progressive disclosure).
> **Cargar cuando:** El Conductor necesita ejecutar un flujo predefinido y requiere el detalle de cada paso.

---

## 🚀 FLUJO: Lanzamiento de Producto/Campaña

**Propósito:** Pipeline completo desde concepto hasta campaña activa.

### Pasos

| Paso  | Skill                   | Acción                     | Output esperado  |
|------|------------------------|---------------------------|-----------------|
| 1     | `Brand_Voice`           | Definir tono y voz de marca| brand-voice.md   |
| 2     | `Marketing_Strategy`    | Estrategia de campaña      | strategy.md      |
| 3     | `Dumbledor_Design`      | Diseño visual y assets     | design-assets/   |
| 4     | `Premium_Image_Studio`  | Imágenes y banners         | images/          |
| 5     | `Carousel_Master`       | Carruseles para LinkedIn/IG| carousels/       |
| 6     | `SEO_SOTA`              | Keywords y optimización SEO| seo-strategy.md  |
| 7     | `Video_Visuals_Producer`| Video promocional          | video.mp4        |
| 8     | `Claude_Ads`            | Setup campaña pagada       | ads-campaign/    |
| 9     | `Skill_Auditor`         | QA final                   | audit-report.md  |

### Sprint Contract Default
```
✅ Brand voice definido y aprobado
✅ Diseño visual coherente con marca
✅ Assets gráficos listos para redes
✅ Video promocional producido
✅ Campaña de ads configurada
✅ Auditoría de calidad pasada
```

### Duración estimada: 2-4 horas

---

## 📝 FLUJO: Contenido Integral

**Propósito:** De idea a contenido publicado en múltiples canales.

### Pasos

| Paso  | Skill                  | Acción                            | Output esperado  |
|------|-----------------------|----------------------------------|-----------------|
| 1     | `Content_Ideation`     | Generar ideas basadas en tema     | ideas.md         |
| 2     | `Content_Transformer`  | Transformar idea raw a multi-canal| drafts/          |
| 3     | `YouTube_Script_Writer`| Guión optimizado                  | script.md        |
| 4     | `Premium_Image_Studio` | Miniaturas y sociales             | thumbnails/      |
| 5     | `Dumbledor_Design`     | Presentación o slide deck         | slides/          |

### Sprint Contract Default
```
✅ Ideas generadas y seleccionadas
✅ Drafts para cada canal
✅ Guión YouTube listo
✅ Miniaturas diseñadas
✅ Presentación finalizada
```

### Duración estimada: 1-3 horas

---

## 🔧 FLUJO: Automatización

**Propósito:** Pipeline de extracción → transformación → deploy.

### Pasos

| Paso  | Skill                  | Acción                 | Output esperado     |
|------|-----------------------|-----------------------|--------------------|
| 1     | `Firecrawl`            | Scraping de fuentes    | data/raw/           |
| 2     | `N8N_Workflows`        | Diseño del workflow    | workflow-design.md  |
| 3     | `N8N_JS` / `N8N_Python`| Código de nodos        | code-nodes/         |
| 4     | `N8N_Validation`       | Validación del workflow| validation-report.md|
| 5     | `DevOps`               | Deploy a producción    | deployment-log.md   |

### Sprint Contract Default
```
✅ Datos extraídos correctamente
✅ Workflow diseñado y aprobado
✅ Código de nodos funcionando
✅ Validación pasada sin errores
✅ Workflow desplegado
```

### Duración estimada: 2-5 horas

---

## 🏗️ FLUJO: Desarrollo SDD Completo

**Propósito:** Ciclo completo de desarrollo con SDD.

### Pasos

| Paso  | Skill                | Acción                              | Output esperado    |
|------|---------------------|------------------------------------|-------------------|
| 1     | `SDD Init`           | Inicializar contexto SDD            | sdd-context/       |
| 2     | `SDD Explore/Propose`| Investigar y proponer cambio        | proposal.md        |
| 3     | `SDD Spec`           | Especificación detallada            | spec.md            |
| 4     | `SDD Design`         | Diseño técnico                      | design.md          |
| 5     | `SDD Tasks`          | Descomposición en tareas            | tasks.md           |
| 6     | `SDD Apply`          | Implementación                      | code/              |
| 7     | `SDD Verify`         | Verificación contra spec            | verification.md    |
| 8     | `SDD Archive`        | Archivar documentación              | archive/           |
| 9     | `Agent Teams`        | Coordinación multi-agente (opcional)| coordination-log.md|

### Sprint Contract Default
```
✅ Propuesta de cambio definida y aprobada
✅ Spec escrita y revisada
✅ Diseño técnico validado
✅ Tareas desglosadas
✅ Código implementado
✅ Tests pasando
✅ Documentación archivada
```

### Duración estimada: 4-12 horas (depende de complejidad)

---

## 📄 FLUJO: Document Pipeline (PDF → Extracción → Documento)

**Propósito:** Pipeline de procesamiento de documentos usando Anthropic Skills Library. Desde un PDF raw hasta documentos editables y presentaciones.

### Pasos

| Paso  | Skill             | Acción                                         | Output esperado              |
|------|------------------|-----------------------------------------------|-----------------------------|
| 1     | `pdf`             | Leer/extraer texto y tablas del PDF            | extracted-text.md, tables.csv|
| 2     | `xlsx`            | Transformar datos extraídos a planilla         | data.xlsx                    |
| 3     | `docx`            | Generar documento Word con contenido formateado| report.docx                  |
| 4     | `pptx`            | Crear presentación a partir del documento      | deck.pptx                    |
| 5     | `canvas-design`   | Diseñar tipografía y visuales si aplica        | fonts/                       |
| 6     | `brand-guidelines`| Verificar consistencia de marca en outputs     | brand-check.md               |
| 7     | `skill-creator`   | QA final y validación de formato               | qa-report.md                 |

### Sprint Contract Default
```
✅ PDF procesado: texto y tablas extraídos
✅ Datos organizados en XLSX
✅ Documento Word generado con formato profesional
✅ Presentación PPTX con diseño coherente
✅ Consistencia de marca verificada
✅ QA de formato pasado
```

### Duración estimada: 1-3 horas

---

## 🛠️ Cómo Agregar un Nuevo Flujo Compuesto

1. Definir el trigger pattern (qué dice el usuario)
2. Identificar las áreas involucradas (máx 4)
3. Ordenar por dependencia lógica (qué necesita ejecutarse primero)
4. Escribir el Sprint Contract default
5. Agregar entrada en SKILL.md → Flujos Compuestos
6. Agregar detalle completo en este archivo

---

*OS Conductor v2.0 — Anthropic 2.0 Harness — 2026-05-28*
