# 📊 ENGRAM — Memoria Persistente del Sistema

> **Última actualización:** 2026-04-28
> **Proyecto:** PersonalOS Consequences v3.1

---

## 📍 Ubicación de Datos

| Tipo                  | Ruta                                     |
|-----------------------|------------------------------------------|
| **Binario**           | `C:/Users/sebas/go/bin/engram`           |
| **Base de datos**     | `C:/Users/sebas/.engram/engram.db`       |
| **Shared memory**     | `C:/Users/sebas/.engram/engram.db-shm`   |
| **Write-Ahead Log**   | `C:/Users/sebas/.engram/engram.db-wal`   |

---

## 🗄️ Estructura de la Base de Datos

Engram usa SQLite para persistencia. La base contiene:

- **Observations:** Memorias individuales guardadas con `mem_save`
- **Sessions:** Resúmenes de sesiones guardadas con `mem_session_summary`
- **Projects:** Proyectos separados (ej: `Think_Different_AI`)
- **Types:** Categorías (bugfix, decision, architecture, discovery, pattern, config, preference)

---

## 🔧 Comandos de Engram

```bash
# Buscar memorias
engram search "query"

# Guardar memoria
engram save "Título" "Contenido"

# Ver contexto de sesiones previas
engram context

# Ver estadísticas
engram stats

# Listar proyectos
engram projects list

# Exportar a JSON
engram export backup.json

# Servidor HTTP (para dashboards)
engram serve 7437
```

---

## 🔌 Integración MCP

```json
{
  "mcp": {
    "engram": {
      "type": "stdio",
      "command": "engram",
      "args": ["mcp", "--tools=agent"]
    }
  }
}
```

---

## 💾 Tamaño de la Base

| Archivo           | Propósito              | Tamaño típico        |
|-------------------|------------------------|----------------------|
| `engram.db`       | Datos principales      | Varía según память   |
| `engram.db-shm`   | Shared memory SQLite   | Pequeño              |
| `engram.db-wal`   | Write-Ahead Log        | Temporal             |

---

## 🔄 Backup

Para hacer backup de la memoria:

```bash
# Copiar la base de datos
cp ~/.engram/engram.db ~/Backups/engram-db-$(date +%Y%m%d).db

# O exportar a JSON
engram export ~/Backups/engram-export-$(date +%Y%m%d).json
```

---

## ⚠️ Notas

- La base SQLite puede crecer con el tiempo — considerar cleanup periódico
- `engram.db-wal` es temporal y se reconstruye al cerrar
- El proyecto activo se detecta automáticamente por el remote de git

---

*PersonalOS Consequences v3.1 — 2026-04-28*
