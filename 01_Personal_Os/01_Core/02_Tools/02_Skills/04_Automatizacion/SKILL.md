---
name: automatizacion
description: >
  Área de AUTOMATIZACIÓN — N8N, Firecrawl, GWS Client.
  Skills para workflow automation, web scraping, y integración de servicios.
  Triggers on: n8n, firecrawl, gws client, workflow automation, web scraping, google workspace, integración, automatización
---

# ⚙️ AUTOMATIZACIÓN — N8N, Firecrawl, GWS Client

## Esencia Original

Automatización no es reemplazar trabajo humano — es eliminar el trabajo que un humano no debería estar haciendo. N8N es el pegamento, Firecrawl el recolector, GWS Client el brazo ejecutor. La decisión fundamental aquí no es qué herramienta usar, sino qué NO automatizar. Automatizar un proceso mal entendido es multiplicar el error a escala. Por eso cada workflow debe tener un punto de validación humana — el agente orquesta, el humano decide.

**Área Funcional:** 04_Automatizacion
**Versión:** 1.0 | **Última actualización:** 2026-05-19

---

## Sub-áreas y Contenido

| Sub-área                       | Descripción                     |
|-------------------------------|--------------------------------|
| `01_N8N_JS/`                   | Scripts N8N en JavaScript       |
| `02_N8N_Python/`               | Scripts N8N en Python           |
| `03_N8N_Expressions/`          | Expresiones N8N                 |
| `04_N8N_MCP/`                  | MCP nodes para N8N              |
| `05_N8N_Nodes/`                | Nodos personalizados            |
| `06_N8N_Validation/`           | Validación en workflows         |
| `07_N8N_Workflows/`            | Workflows completos             |
| `08_AI_News_Weekly/`           | AI News Weekly                  |
| `08_N8N_Invictus/`             | N8N para Invictus               |
| `09_Firecrawl/`                | Web scraping con Firecrawl      |
| `10_GWS_Client/`               | Google Workspace Client         |
| `11_Gcierr/`                   | Gcierr tool                     |
| `11_Gws_Client/`               | GWS Client alternativo          |
| `12_N8N/`                      | N8N adicional                   |
| `13_Content_From_Url/`         | Contenido desde URL             |
| `14_Compound_Knowledge/`       | Compound Knowledge              |
| `15_Os_Self_Improvement/`      | OS Self Improvement             |
| `16_Reverse_Engineering/`      | Reverse Engineering             |
| `17_Learning_Url_To_Knowledge/`| Learning URL to Knowledge       |

## Integración

- **Firecrawl MCP**: Web scraping de URLs
- **N8N MCP**: Workflow automation
- **Google Workspace MCP**: Gmail, Drive, Calendar

## Estándares N8N

### Naming Workflow
```
[N0]_[nombre]_[fecha].json
01_MiWorkflow_2026-05-19.json
```

### Estructura
```json
{
  "name": "Workflow Name",
  "nodes": [...],
  "connections": {...},
  "settings": {...}
}
```

## Web Scraping

```bash
# Usar Firecrawl MCP
"Extraé el contenido de [URL]"
```

## ⚠️ Gotchas

### Workflow N8N sin test
> El workflow se despliega sin validación y rompe en producción.

- **Por qué**: N8N no tiene un sandbox de pruebas integrado. Los workflows se prueban en el entorno donde se ejecutan, y un error en un nodo puede cascada a toda la cadena sin que el agente lo sepa hasta que es demasiado tarde.
- **Solución**: Antes de activar un workflow, ejecutarlo en modo manual con datos de prueba. Verificar cada nodo individualmente. Usar nodos de error handler en cada workflow para capturar fallos.

### Firecrawl sin rate limiting
> El scraper lanza cientos de requests simultáneos y el target bloquea la IP.

- **Por qué**: Firecrawl por defecto paraleliza el scraping. Sin rate limiting explícito, sitios con protección anti-bot detectan el patrón y bloquean — o peor, sirven datos envenenados.
- **Solución**: Configurar `maxConcurrency: 3` y `delay: 1000ms` en las opciones de Firecrawl. Para targets sensibles, usar rotación de user-agent y respetar robots.txt.

### GWS Client sin refresh token
> El token de Google expira y el workflow falla sin aviso.

- **Por qué**: Google Workspace tokens de acceso expiran cada 60 minutos. Si el workflow corre después de ese tiempo sin un refresh token configurado, todas las operaciones GWS fallan con 401.
- **Solución**: Configurar refresh token en el MCP de Google Workspace. Implementar verificación de token antes de ejecutar operaciones GWS. Si expiró, refrescar automáticamente antes de continuar.

## 💾 State Persistence

| Componente                   | Persistencia | Mecanismo                                                       |
|-----------------------------|-------------|----------------------------------------------------------------|
| Workflows N8N                | ✅ Permanente | Archivos `.json` exportados en `07_N8N_Workflows/`              |
| Tokens GWS                   | ⚠️ Por sesión| Refresh token persiste, access token se refresca automáticamente|
| Resultados de scraping       | ❌ No persiste| Firecrawl retorna datos en vivo — capturar output explícitamente|
| Expresiones N8N reutilizables| ✅ Archivo    | Fragmentos `.json` en `03_N8N_Expressions/`                     |

---

*Área Automatización v1.0 — 2026-05-19*
