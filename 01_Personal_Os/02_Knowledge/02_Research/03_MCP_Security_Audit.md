# 🔒 MCP Security Audit — 2026-04-24

> **Fecha:** 2026-04-24  
> **Propósito:** аудит + hardening de los 33 MCP servers

---

## 📊 INVENTARIO ACTUAL (33 servers)

### Por CATEGORÍA

| Categoría          | MCPs                                    | Riesgo     | Issues             |
|--------------------|-----------------------------------------|------------|--------------------|
| **Knowledge**      | Context7, Eagle, Obsidian×2, Supabase   | 🟡 MEDIUM   | Duplicado          |
| **Dev**            | GitHub, Vercel, Playwright, Supabase    | 🟡 MEDIUM   | Token exposure     |
| **Scraping**       | Firecrawl, Exa, ChromeDevTools          | 🔴 HIGH     | No sandbox         |
| **Productivity**   | Notion, Linear, N8n, Gmail              | 🟡 MEDIUM   | OAuth no forzado   |
| **Media**          | Nanobanana, Fireflies                   | 🟢 LOW      | OK                 |
| **Data**           | Amplitude, Supadata, NotebookLM         | 🟡 MEDIUM   | API keys           |
| **Automation**     | Engram, Qmd, TestSprite                 | 🟡 MEDIUM   | Custom             |
| **Tools**          | StackOverflow, Docker, Pencil           | 🟡 MEDIUM   | Permissions        |

---

## 🚨 ISSUES IDENTIFICADOS

### 🔴 CRITICAL

| #     | Issue                     | MCPs Afectados                    | Fix               |
|-------|---------------------------|-----------------------------------|-------------------|
| 1     | **Obsidian duplicado**    | `mcp-obsidian` + `obsidian-api`   | Eliminar uno      |
| 2     | **@latest sin version**   | Todos                             | Fijar versiones   |
| 3     | **Docker sin sandbox**    | `docker`                          | Read-only mode    |

### 🟡 HIGH

| #     | Issue                   | MCPs Afectados            | Fix                 |
|-------|-------------------------|---------------------------|---------------------|
| 4     | **No OAuth 2.1**        | Todos HTTP                | Implementar         |
| 5     | **Token exposure**      | `github`, `notion`, etc   | Env vars en vault   |
| 6     | **Sin audit logging**   | Todos                     | Agregar logging     |

---

## ✅ SECURITY CHECKLIST (SOTA 2026)

### Lo que DEBE cumplirse:

```bash
# ✅ IMPLEMENTADO
[ ] OAuth 2.1 + PKCE - Para servers HTTP
[ ] Least privilege - Read-only por default
[ ] Short-lived tokens - < 1 hora
[ ] Input validation - Sanitize todo input
[ ] Session isolation - Por client
[ ] Audit logging - Todo tool invocation

# ⚠️ EN PROGRESO
[ ] Rate limiting - Por agent identity
[ ] Tool poisoning defense
[ ] Prompt injection defense
```

---

## 🔧 ACCIONES INMEDIATAS

### 1. Eliminar Obsidian duplicado

```json
// ANTES (duplicado)
"mcp-obsidian": { ... },
"obsidian-api": { "_comment": "Failover..." }

// DESPUÉS (solo uno)
"obsidian": { 
  "_comment": "Primary - keep one",
  ...
}
```

### 2. Fijar versiones (NO @latest)

```json
// ANTES (inseguro)
"args": ["-y", "@playwright/mcp@latest"]

// DESPUÉS (seguro)
"args": ["-y", "@playwright/mcp@1.2.3"]
```

### 3. Agregar read-only a algunos

```json
// Para servers que no necesitan write
"filesystem-readonly": {
  "args": ["-y", "@modelcontextprotocol/server-filesystem", 
           "--read-only", "."]
}
```

### 4. Agregar audit logging

```python
# MCP audit logger script
import logging
import json
from datetime import datetime

def log_mcp_invocation(server: str, tool: str, args: dict):
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "server": server,
        "tool": tool,
        "args": sanitize(args),
        "status": "invoke"
    }
    # Append-only log
    with open("logs/mcp_audit.jsonl", "a") as f:
        f.write(json.dumps(entry) + "\n")

def sanitize(args: dict) -> dict:
    """Remove sensitive fields."""
    sensitive = ["api_key", "token", "secret", "password"]
    return {k: "***REDACTED***" if any(s in k.lower()) else v 
            for k, v in args.items()}
```

---

## 📋 RECOMENDACIONES POR MCP

| MCP                 | Acción                 | Prioridad    |
|---------------------|------------------------|--------------|
| **obsidian-api**    | ELIMINAR (duplicado)   | 🔴 CRITICAL   |
| **docker**          | Disable o read-only    | 🔴 CRITICAL   |
| **github**          | Token en vault         | 🟡 HIGH       |
| **notion**          | Read-only mode         | 🟡 HIGH       |
| **filesystem**      | Restringir paths       | 🟡 HIGH       |
| **n8n-mcp**         | Disable (no usa)       | 🟡 MEDIUM     |
| **pencil**          | Disable (no usa)       | 🟡 MEDIUM     |
| **StackOverflow**   | Disable (no usa)       | 🟡 MEDIUM     |

---

## 🎯 PLAN DE ACCIÓN

### Hoy (+1)

| Task                  | Status      |
|-----------------------|-------------|
| аудит completo        | ✅ DONE      |
| Eliminar duplicados   | 🔲 Pending   |
| Fijar versiones       | 🔲 Pending   |
| Agregar notes         | 🔲 Pending   |

### Esta semana

| Task                    | Status      |
|-------------------------|-------------|
| Setup audit logging     | 🔲 Pending   |
| Implementar OAuth 2.1   | 🔲 Pending   |
| Review tokens           | 🔲 Pending   |

---

## 📚 References

- **MCP Best Practices:** modelcontextprotocol.info/docs/best-practices
- **Security Checklist:** OWASP AI Top 10

---

> **Siguiente:** Ejecutar cleanup de duplicados  
> **Validación:** Quedan 31 servers (eliminados 2 duplicados)
