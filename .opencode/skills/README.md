# .opencode/skills — Skills Locales del Proyecto

> **Versión:** 1.0
> **Fecha:** 2026-04-23
> **Estado:** ✅ Activo

---

## 📁 Propósito

Este directorio contiene **skills locales** específicas del proyecto Think Different que no están disponibles globalmente en `~/.config/opencode/skills/`.

---

## 🧠 Skills Disponibles

| Skill | Descripción | Estado |
|-------|-------------|--------|
| **ui-ux-pro-max** | UI/UX design intelligence con searchable database | ✅ Activo |

---

## 🔗 Skills Globales vs Locales

| Tipo | Ubicación | Uso |
|------|-----------|-----|
| **Skills del Sistema** | `01_Core/03_Skills/` | Fuente de verdad - 165+ skills organizadas |
| **Skills Globales** | `~/.config/opencode/skills/` | Skills instaladas globalmente |
| **Skills Locales** | `.opencode/skills/` | Skills específicas del proyecto |

---

## 📋 Integración con el Sistema

Las skills del sistema en `01_Core/03_Skills/` están organizadas en 9 Áreas Funcionales y son accesibles vía:

- Commands SDD: `/sdd:init`, `/sdd:spec`, etc.
- Commands CE: `/ce:ideate`, `/ce:plan`, etc.
- Skills globales instaladas en `~/.config/opencode/skills/gentleman/`

---

## 🔧 Agregar una Skill Local

Para agregar una skill local:

1. Crear carpeta con nombre: `skill-name/SKILL.md`
2. Definir triggers y funcionalidad
3. La skill estará disponible en el proyecto

---

_Creado: 2026-04-23 (Auditoría Integral)_
