# Backlog — Think Different PersonalOS v4.0 Consequences

*Última actualización: 2026-05-11*

---

## P0 — CRÍTICO

| Estado              | Ítem                     | Prioridad   | Notas   |
|:-------------------|:------------------------|:-----------:|:-------:|
| ✅ Ninguno          | Sin ítems críticos activos | —          | —       |

---

## P1 — ALTA PRIORIDAD

| # | Estado   | Ítem                          | Detalle                                                                              | Próximo Paso                                              |
|:-:|:--------:|:------------------------------|:--------------------------------------------------------------------------------------|:----------------------------------------------------------|
| 1 | 🔲        | **TubeMaster MCP**            | Configurar Google OAuth + YouTube Data API v3 para MCP de YouTube                   | Esperando: Client ID + Secret de Google Cloud Console     |
| 2 | 🔲        | **OIM Website**               | Verificación visual en browser (servidor parado)                                    | —                                                         |
| 3 | 🔲        | **Seedance 2.0 MCP**          | Agregar MCP de Seedance 2.0 — link no proporcionado                              | Esperando: URL del MCP                                   |
| 4 | 🔲        | **subagent-statusline**        | Debuggear status line de sub-agentes en OpenCode — no se visualiza                  | Investigar config tui.json                               |
| 5 | 🔲        | **/doctor issues**             | Resolver 9 settings issues encontrados en auditoría                                  | Run /doctor y aplicar fixes                              |

---

## P2 — MEDIA PRIORIDAD

| # | Estado   | Ítem                            | Detalle                                                                    | Fuente                           |
|:-:|:--------:|:--------------------------------|:----------------------------------------------------------------------------|:--------------------------------|
| 1 | 🔲        | **System Cleanup**              | Limpiar `~/.cache/` (~1.9GB: codex 766MB + opencode 416MB + qmd 385MB)    | Total cache: ~1.9GB             |
| 2 | 🔲        | **Memory Loop System**          | Implementar daily summaries + long-term memory compression                    | Moritz OS                       |
| 3 | 🔲        | **Google Workspace MCP**        | Integrar GWS (Google Drive, Sheets, Docs)                                   | Video YouTube                   |
| 4 | 🔲        | **Content System Automation**   | idea → weekly planning → script generation → video upload                   | Moritz OS                       |
| 5 | 🔲        | **Docs Path Validation**        | Validar/actualizar docs con rutas viejas (v1.x, 01_Core/03_Skills, 03_Tasks) | Comparar con paths actuales v4.0 |

---

## P3 — BACKLOG FRÍO

| # | Estado   | Ítem                          | Detalle                                                    |
|:-:|:--------:|:------------------------------|:-----------------------------------------------------------|
| 1 | 🔲        | Automatización Reports        | Generar `04_Operations/10_Reports/` con `01_Auditor_Hub.py` |
| 2 | 🔲        | Workflows Marvel              | Revisar y ejecutar: 01_Iron_Man_Gen, 04_Vision_Review, 05_Thor_Work, 06_Hulk_Compound |
| 3 | 🔲        | Ritual de Cierre              | Revisar: `05_Ritual_Cierre_Protocol.md` + `04_Ritual_Hub.py` |
| 4 | 🔲        | Avengers Plan                 | Definir si ejecutar, actualizar o archivar                 |

---

## Metadata

| Campo                | Valor                   |
|:--------------------|:------------------------|
| Versión OS          | v3.2 Consequences      |
| Última actualización | 2026-05-11             |
| Engram CLI          | v1.15.10               |
| Compound Engineering | v3.8.0                 |
| Engram Projects     | 34 (consolidados)       |

---

## Changelog

| Fecha       | Cambio                                      |
|:------------|:-------------------------------------------|
| 2026-05-11 | Agregado TubeMaster MCP a P1                |
| 2026-04-28 | Versión inicial v3.2                         |