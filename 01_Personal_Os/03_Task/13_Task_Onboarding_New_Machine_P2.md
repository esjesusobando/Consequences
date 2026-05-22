# Task: Onboarding Nueva Máquina — Documentación Setup

**Prioridad:** P2  
**Fecha creación:** 2026-05-22  
**Proyecto:** Think_Different  
**Origen:** Plan_Seguir_2026-05-22.md — Fase E

---

## 📍 Contexto

### Onboarding Docs Encontradas

| Archivo | Ubicación | Tipo |
|---------|-----------|------|
| `build-your-personal-os.md` | `01_Personal_Os/05_Archive/01_Repos_Reference/02_Repos_Gentleman/18_Personal_Os_Main/personal-os-main/examples/tutorials/` | Tutorial |
| `BACKLOG_example.md` | Mismo folder | Ejemplo |
| `example_knowledge.md` | Mismo folder | Ejemplo |

### Onboarding Related (Skills)

```
.claude/04_Skills/05_Gentleman/27_Marketing_Strategy/onboarding-cro/SKILL.md
.claude/02_High_Value/27_Marketing_Strategy/onboarding-cro/SILL.md
```

### Concepto

Una guía de setup paso a paso para:
1. Clonar el repo
2. Instalar dependencias
3. Configurar hooks (GGA)
4. Configurar MCPs
5. Verificar que todo funciona

---

## 🎯 Definición de Terminado

1. **Doc de setup existe** — en `01_Personal_Os/04_Operations/04_Installer/` o similar
2. **Pasos verificados** — alguien siguió la doc en máquina nueva
3. **Cubre dependencias** — Node, Python, Git, bash
4. **Cubre hooks** — GGA pre-commit install
5. **Cubre MCPs** — configuración `.mcp.json`

---

## ➡️ Siguiente Acción

**Buscar doc existente:**

```bash
ls 01_Personal_Os/04_Operations/04_Installer/

# Buscar archivos de setup
find . -maxdepth 4 -name "*setup*" -o -name "*onboard*" -o -name "*install*"
```

**Si no existe:** Crear `01_Personal_Os/04_Operations/04_Installer/01_Setup_Guide.md`

---

## 📋 Metadata

- **Ubicación tarea:** `01_Personal_Os/03_Task/13_Task_Onboarding_New_Machine_P2.md`
- **Keywords:** `onboarding`, `setup`, `install`, `new machine`
- **Bloqueado por:** —