# 🦾 Skill 31: Universal Doc Reader Elite

## Overview
Esta Skill permite al sistema PersonalOS leer y extraer información estructurada de una amplia gama de formatos de oficina, diseño y multimedia. Está diseñada para ser "Armor Layered" (robusta) y producir salidas "Premium" (limpias y estéticas).

## 🚀 Formatos Soportados
- **Documentos:** PDF, DOCX, DOC
- **Tablas:** XLSX, XLS, CSV
- **Presentaciones:** PPTX
- **Diseño:** PSD, PSB (Adobe Photoshop)
- **Imagen:** TIFF, TIF, JPG, PNG

## 🛠️ Motor de Ejecución
`python 06_ENGINE/25_Universal_Parser.py <file_path>`

## 🛡️ Estándar de Salida
La salida se genera en **Markdown estructurado**, preservando:
- Jerarquía de diapositivas en PPTX.
- Estructura de capas en PSD.
- Tablas legibles (Markdown Tables) en Excel/CSV.
- Metadatos técnicos en imágenes.

## 🤝 Sincronización
Esta Skill es la base para la **[Skill 32: Batch Doc Processor Elite](file:///c:/Users/sebas/Downloads/01%20Revisar/07%20Now/personal-os-main/personal-os-main/01_AGENT_TEAM/02_skills/03_Utilities/32_Batch_Doc_Processor/SKILL.md)**, la cual permite la extracción masiva de directorios completos utilizando este mismo motor.

---
_Alineado con el Motor PersonalOS: "Visibilidad total, formato impecable."_
