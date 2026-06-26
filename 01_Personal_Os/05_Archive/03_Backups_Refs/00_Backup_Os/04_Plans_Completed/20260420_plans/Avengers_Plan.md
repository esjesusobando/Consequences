# Plan de Implementación: Auditoría Magna y Evolución SOTA

Este plan detalla el proceso de auditoría profunda, diagnóstico de ingeniería inversa y transformación del sistema hacia el estado del arte (SOTA 2026), aplicando los principios de **Every Compound Engineering**.

## Objetivo
Certificar la integridad del sistema, eliminar redundancias estructurales (especialmente en `10_Legacy`) y evolucionar la arquitectura hacia una encapsulación total de habilidades.

## Diagnóstico Inicial (Ingeniería Inversa)

Tras el análisis de los HUBs y scripts actuales, se identifican los siguientes patrones:
- **Lógica Vengadores**: Los comandos `Review`, `Work` y `Compound` están vinculados a scripts como `Vision_Review`, `Thor_Work` y `Hulk_Compound`. Aunque potentes, sus nombres son ambiguos para un sistema SOTA profesional.
- **Deuda de Fragmentación**: La separación entre `01_Core/03_Skills` y `03_Scripts_Os` genera fricción en el mantenimiento.
- **Residuos de Legacy**: `10_Legacy` contiene scripts que colisionan en nombre con la versión activa, lo que puede inducir a error al asistente si no lee el contexto completo.

## Cambios Propuestos

---

### [Componente] Auditoría y Seguridad ECE

#### [MODIFY] [config_paths.py](file:///c:/Users/sebas/Downloads/01%20Revisar/09%20Versiones/00%20Respaldo%20PC%20Sebas/01%20Github/personal-os/Think_Different/03_Scripts_Os/config_paths.py)
- Refactorizar para usar **exclusivamente** `pathlib` (Estándar Kieran).
- Eliminar cualquier referencia hardcodeada sobreviviente.

#### [NEW] [SOTA_Security_Report.md](file:///C:/Users/sebas/.gemini/antigravity/brain/95ce8943-78d2-4ab0-967f-3d1b257c176e/security_report.md)
- Reporte detallado de vulnerabilidades (específicamente en el manejo de inputs y llamadas externas).

---

### [Componente] Reestructuración "Skills as Packages"

Se realizará la migración física de los scripts activos desde `03_Scripts_Os` hacia sus carpetas locales en `01_Personal_Os/01_Core/02_Tools/02_Skills/`.

#### [MODIFY] [01_Personal_Os/01_Core/02_Tools/02_Skills/...]
- Cada carpeta de Skill activa recibirá un directorio `scripts/`.
- [NEW] `01_Personal_Os/01_Core/02_Tools/02_Skills/08_Personal_Os/scripts/08_Ritual_Cierre.py`
- [NEW] `01_Personal_Os/01_Core/02_Tools/02_Skills/01_Agent_Teams_Lite/scripts/02_Professor_X_Plan.py`

#### [DELETE] [03_Scripts_Os/...]
- Se eliminarán las subcarpetas `01_Ritual`, `02_Tool`, `04_Workflow`, etc., una vez migrados los scripts.

---

### [Componente] Consolidación de Legacy

#### [ARCHIVE] [10_Legacy/...]
- Mover todos los archivos de `10_Legacy` a una carpeta oculta `.legacy_archive` para limpiar el `ENGINE_DIR` y evitar colisiones de nombres durante la búsqueda semántica.

---

## Plan de Ejecución (Comandos Solicitados)

1. **Review**: Ejecutaré una revisión de código sobre los 5 scripts más críticos del sistema usando la lógica de `kieran-python-reviewer`.
2. **Work**: Procesaré los "Fails" o deudas técnicas encontrados en el paso anterior.
3. **Compound**: Documentaré las lecciones aprendidas y el nuevo mapa de rutas en `SCRIPTS_INDEX.md`.

## Preguntas Abiertas

> [!IMPORTANT]
> 1. **Nombres de Comandos**: ¿Deseas mantener los nombres de los Avengers (Thor/Hulk/Vision) o prefieres renombrarlos a términos técnicos SOTA (Work/Compound/Review)? (Recomiendo alias para mantener ambos).
> 2. **Archivado Profundo**: ¿Muevo definitivamente los 91 scripts de `10_Legacy` a la carpeta oculta? (Esto liberará mucho contexto innecesario para la AI).

## Plan de Verificación

- **SOTA Integrity**: El script `15_SOTA_Integrity_Check.py` debe dar `10/10` (añadiendo nuevas dimensiones de auditoría).
- **Consistencia de Rutas**: Ejecutar un script de cada Skill migrada para verificar el `sys.path`.
