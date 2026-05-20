# .claude — Claude Code Configuration & Memory

> **Versión:** v4.1
> **Última actualización:** 2026-05-20

---

## 🎯 DESCRIPCIÓN

Configuración local de Claude Code y sistema de memoria persistente. Contiene reglas, hooks, skills y memoria del sistema.

---

## 📁 ESTRUCTURA

```
.claude/
├── memory/                  # Memoria persistente (Engram)
│   └── audit-2026-05-20.md  # Context de auditoría
├── settings.json            # Config de Claude Code
└── CLAUDE.md               # Constitución para IAs
```

---

## 🎯 FUNCIÓN

- **Configuración:** Parámetros para Claude Code en este proyecto
- **Memory:** Contexto persistente entre sesiones (`.claude/memory/`)
- **Rules:** Heredadas de `01_Personal_Os/01_Core/01_Rules/`

---

## 📋 DOCUMENTACIÓN RELACIONADA

| Recurso | Descripción |
|---|---|
| `CLAUDE.md` (raíz) | Config principal del proyecto |
| `00_Winter_is_Coming/AGENTS.md` | Asignación del GGA |
| `01_Personal_Os/01_Core/01_Rules/` | Fuente de verdad de reglas |

---

*Think Different PersonalOS v4.1*