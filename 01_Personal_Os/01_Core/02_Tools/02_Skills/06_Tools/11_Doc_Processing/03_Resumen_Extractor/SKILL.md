---
description: 03_Resumen_Extractor
globs: **/*
alwaysApply: true
sota_upgraded: true
---

# 🦾 Skill 11_03: Resumen Extractor

## Esencia Original
> **Propósito:** Extraer contenido de documentos para crear resúmenes estructurados y bases de conocimiento
> **Flujo:** Escanear recursivamente → Extraer contenido → Generar resúmenes → Consolidar reporte


> **Sistema:** PersonalOS
> **Categoría:** 11_Doc_Processing
> **Skill:** 03/03
> **Versión:** 2.0
> **Última actualización:** 2026-03-23

## Overview

Extrae contenido de documentos específicos para crear resúmenes estructurados. Procesa directorios completos recursivamente y genera un reporte consolidado de conocimiento.

**Caso de uso:** Extracción de CVs, certificados, diplomas para crear bases de conocimiento.

## 🚀 Capacidades

- **Escaneo Recursivo:** Navega por subcarpetas automáticamente
- **Consolidación:** Genera un único reporte con todos los documentos
- **Soporte:** PDF, DOCX, XLSX, CSV, PPTX

## 🛠️ Uso

```bash
# Uso básico
python 01_Personal_Os/04_Operations/03_Scripts_Os/85_Resumen_Extractor.py

# Directorio específico
python 01_Personal_Os/04_Operations/03_Scripts_Os/85_Resumen_Extractor.py --source ./documentos

# Output específico
python 01_Personal_Os/04_Operations/03_Scripts_Os/85_Resumen_Extractor.py -s ./docs -o mi_resumen.md
```

## 🤝 Integración con el Sistema

### Skills relacionadas:
- **Skill 83:** Universal Doc Reader (motor base)
- **Skill 84:** Batch Doc Processor (procesamiento masivo general)

### Flujo:
```
Documentos → 85_Resumen_Extractor.py → 83_Universal_Parser.py
                                           ↓
                                 Resumen_MD + Metadata.json
                                           ↓
                           03_Knowledge/
```

## 📦 Dependencias

```bash
# Requiere Skill 83
pip install PyPDF2 python-docx pandas python-pptx
```

## ✅ Checklist de Calidad

- [x] UTF-8 encoding
- [x] Timeout por archivo (120s)
- [x] Manejo de errores robusto
- [x] Log de progreso
- [x] Integración con config_paths.py

---
_Alineado con PersonalOS: "Del caos al conocimiento estructurado."_


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
