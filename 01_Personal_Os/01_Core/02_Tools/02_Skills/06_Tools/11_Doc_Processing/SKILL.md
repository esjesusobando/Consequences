---
name: doc-processing
description: "Procesamiento y transformación de documentos. Triggers: doc processing, batch process, document extraction, convertir formato, procesar PDFs, resumir documentos."
version: 1.0.0
sota_upgraded: true
---

# Doc Processing — Skill Index

## Esencia Original

> **Metaskill**: Habilidad para procesar, transformar y extraer información de documentos en cualquier formato, habilitando automatización de workflows documentales.

Esta skill es el **motor de procesamiento documental** del PersonalOS. Permite convertir, resumir y extraer contenido de documentos automáticamente.

## Descripción

Procesamiento y transformación de documentos: lectura universal de formatos, procesamiento batch y extracción de resúmenes.

## Sub-Skills

| #                              | Skill                                                | Descripción                                                          |
|-------------------------------|-----------------------------------------------------|---------------------------------------------------------------------|
| 01                             | `01_Universal_Doc_Reader`                            | Lectura de cualquier formato de documento                            |
| 02                             | `02_Batch_Doc_Processor`                             | Procesamiento masivo de documentos                                   |
| 03                             | `03_Resumen_Extractor`                               | Extracción automática de resúmenes                                   |

## Uso
Activar según el tipo de procesamiento documental requerido.

---

## ⚠️ Gotchas

### ERROR 1: Procesar archivos sin validar formato
- **Por qué**: Intentar leer un archivo binario como texto causa errores de parseo y corrompe la salida
- **Solución**: Always verificar magic bytes o extensión antes de procesar. Usar bibliotecas específicas por formato (PyPDF2 para PDFs, python-docx para Word, etc.)

### ERROR 2: Batch processing sin límite de memoria
- **Por qué**: Procesar miles de documentos en memoria agota RAM ycrash del proceso
- **Solución**: Implementar chunking o procesamiento streaming. Limitar batch size a 100 archivos y usar generators

### ERROR 3: Extraer resúmenes sin preservar estructura
- **Por qué**: Resúmenes planos pierden contexto y jerarquía del documento original
- **Solución**: Mantener estructura en resúmenes: usar headers, bullet points y referencias a secciones originales

---

*Skill Version: 2.0*
*Framework: Anthropic Skill Creator v2.0 + PersonalOS SOTA v5.1*
*Last Updated: 2026-04-20*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
