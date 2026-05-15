# 📁 13_Auditors_Os — Auditors Utilities

> **Versión**: v4.0 Consequences

Utilities para auditors del PersonalOS v4.0 Consequences:

> **⚠️ NOTE:** These utilities are used by Auditor_Hub.py for systematic project auditing.
- Beautify tables y documentos
- Context usage bar para OpenCode
- SOTA Integrity Check
- Carousel Engine para contenido estratégico

---

## 📦 Scripts (5 en `scripts/`)

| #                 | Script                                     | Propósito                                            |
|-------------------|--------------------------------------------|------------------------------------------------------|
| 12                | `12_Context_Usage_Bar.py`                  | Barra de uso de contexto para OpenCode               |
| 13                | `13_Beautify_Tables.py`                    | Embellecedor de tablas markdown                      |
| 14                | `14_Beauty_Doc.py`                         | Embellecedor de documentos markdown                  |
| 15                | `15_SOTA_Integrity_Check.py`               | Validación de integridad SOTA                        |
| 16                | `16_Carousel_Engine.py`                    | Motor de carruseles estratégicos                     |

---

## 📍 Ubicación en v4.0 Consequences

```
01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/
```

---

## 🔧 Uso

```bash
# Context Usage Bar (demo mode)
python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/12_Context_Usage_Bar.py --demo

# Beautify Tables
python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/13_Beautify_Tables.py

# Beautify Docs
python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/14_Beauty_Doc.py

# SOTA Integrity Check
python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/15_SOTA_Integrity_Check.py

# Carousel Engine
python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/16_Carousel_Engine.py --niche "Productividad" --goal "Education" --name "Draft"
```

---

## 📊 SOTA Integrity Check (15)

El script `15_SOTA_Integrity_Check.py` valida:

| Check                        | Descripción                                     |
|------------------------------|-------------------------------------------------|
| submodules                   | Git submodules verificados                      |
| skills                       | 9+ áreas funcionales con SKILL.md               |
| mcps                         | 25+ MCPs configurados                           |
| agents                       | Agentes en .agent/ y core/                      |
| hooks                        | Hooks instalados                                |
| hubs                         | 10+ HUBs activos                                |
| rules                        | 8+ reglas consolidadas                          |
| methodologies                | Metodologías integradas                         |
| core_structure               | Estructura v2.0 completa                        |

**Uso:**
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/15_SOTA_Integrity_Check.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/15_SOTA_Integrity_Check.py --verbose
```

---

**Última actualización**: 2026-04-25
**Estado**: ✅ ACTUALIZADO — v4.0 Consequences
