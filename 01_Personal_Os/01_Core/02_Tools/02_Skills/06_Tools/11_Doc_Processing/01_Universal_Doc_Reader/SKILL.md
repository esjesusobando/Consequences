---
description: 01_Universal_Doc_Reader
globs: **/*
alwaysApply: true
sota_upgraded: true
---

# 🦾 Skill 11_01: Universal Doc Reader Elite

## Esencia Original
> **Propósito:** Extraer información estructurada de archivos individuales en múltiples formatos (PDF, DOCX, XLSX, imágenes)
> **Flujo:** Detectar formato → Parsear contenido → Extraer datos → Generar Markdown estructurado


> **Sistema:** PersonalOS
> **Categoría:** 11_Doc_Processing
> **Skill:** 01/03
> **Versión:** 2.0
> **Última actualización:** 2026-03-23

## Overview

Extrae información estructurada y premium de archivos individuales en múltiples formatos. Producce salida **Markdown estructurado** optimizada para RAG, LLM y archivado de conocimiento.

## 🚀 Formatos Soportados

| Categoría                                       | Extensiones                                                                   | Parser                                           |
|------------------------------------------------|------------------------------------------------------------------------------|-------------------------------------------------|
| **Documentos**                                  | `.pdf`, `.docx`, `.doc`                                                       | PyPDF2, python-docx                              |
| **Tablas**                                      | `.xlsx`, `.xls`, `.csv`                                                       | pandas                                           |
| **Presentaciones**                              | `.pptx`                                                                       | python-pptx                                      |
| **Diseño**                                      | `.psd`, `.psb`                                                                | psd-tools                                        |
| **Imágenes**                                    | `.tiff`, `.tif`, `.jpg`, `.png`, `.webp`, `.gif`                              | Pillow                                           |
| **Texto**                                       | `.md`, `.txt`                                                                 | nativo                                           |

## 🛠️ Motor de Ejecución

```bash
# Uso básico
python 01_Personal_Os/04_Operations/03_Scripts_Os/83_Universal_Parser.py <archivo>

# Con output a archivo
python 01_Personal_Os/04_Operations/03_Scripts_Os/83_Universal_Parser.py <archivo> -o resultado.md

# Ejemplos
python 01_Personal_Os/04_Operations/03_Scripts_Os/83_Universal_Parser.py ./docs/informe.pdf
python 01_Personal_Os/04_Operations/03_Scripts_Os/83_Universal_Parser.py ./datos/ventas.xlsx
python 01_Personal_Os/04_Operations/03_Scripts_Os/83_Universal_Parser.py "./presentación cliente.pptx"
```

## 🛡️ Estándar de Salida

La salida se genera en **Markdown Premium**:

- **PDF:** Metadata + texto por página
- **DOCX:** Párrafos + tablas formateadas
- **Excel:** Datos tabulares con dimensiones
- **PPTX:** Estructura de slides con separadores
- **PSD:** Metadatos + lista de capas
- **Imágenes:** Dimensiones + metadata técnica

## 📦 Dependencias

```bash
pip install PyPDF2 python-docx pandas python-pptx psd-tools Pillow
```

## 🤝 Integración con el Sistema

### Skills relacionadas:
- **Skill 84:** Batch Doc Processor (procesamiento masivo)
- **Skill 85:** Resumen Extractor (extracción de CVs)

### Flujo de Datos
```
Archivo Input → 83_Universal_Parser.py → Markdown Premium
                                        ↓
                          03_Knowledge/01_Research_Knowledge/
```

## ✅ Checklist de Calidad

- [x] UTF-8 encoding
- [x] Manejo de errores por formato
- [x] Fallbacks para dependencias opcionales
- [x] Output estructurado por tipo de archivo
- [x] Integración con config_paths.py

---
_Skill alineada con PersonalOS: "Visibilidad total, formato impeccable."_


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
