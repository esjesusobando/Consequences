# 📓 01_NP_Refactoring_and_Evolution_Logs

**Estatus**: DOCUMENTO MAESTRO (Compactación v6.1)  
**Contexto**: Crónica técnica de la evolución del OS

---

## 📈 La Gran Migración v6.1
El sistema evolucionó de una estructura dispersa a una **Arquitectura de Núcleo (Core Archetype)**. 

### Decisiones Técnicas Clave:
- **Consolidación en 01_Core**: Movimiento de Workflows, Agentes y Skills para evitar búsquedas recursivas profundas.
- **Eliminación de Duplicate Tasks**: Establecer `03_Tasks` como el buffer único para evitar alucinaciones de contexto.
- **Estabilización de Sub-módulos (SOTA)**: Purga total del índice de Git para eliminar marcadores huérfanos (.git archivados) y restauración de la fuente de verdad .gitmodules.
- **Motor Engine Installer**: Implementación de scripts de auditoría para asegurar que el OS se autodocumente (README Auto-Gen).

## 🛡️ Auditoría de Edge Cases
A través de 7 sesiones de "Edge Case Audit", se resolvieron:
- Paths relativos rotos en entornos restringidos.
- Inestabilidad en la conexión de MCPs.
- Conflictos de numeración global (resolución de colisión Hillary/AIPM Judge).

---
*Compactado de archivos NP 01 al 10 y Crónicas de Refactorización | Sincronizado 2026-04-14*
