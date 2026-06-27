# Capital Token Dashboard

> Dashboard de estado del Capital Token organizacional.
> *Actualizado: 2026-06-27*

---

## Resumen

| Metrica | Valor | Target | Estado |
|---------|-------|--------|--------|
| Playbooks documentados | 2 | 20+ | En progreso |
| Decisiones registradas (ADRs) | 2 | 10+ | En progreso |
| Procesos documentados (SOPs) | 2 | 5+ | En progreso |
| Agentes template | 3 | 3+ | Completo |
| Agentes configurados | 1 | 3+ | En progreso |
| Shared Context files | 1 | 5+ | En progreso |
| MCP Bridge | v0.1 | v1.0 | En progreso |

---

## Playbooks

| # | Nombre | Estado | Ultima revision |
|---|--------|--------|----------------|
| 1 | Onboarding Nuevo Cliente | Completo | 2026-06-27 |
| 2 | Produccion de Contenido | Completo | 2026-06-27 |

## Decisiones (ADRs)

| # | Titulo | Estado | Fecha |
|---|--------|--------|-------|
| 001 | Capital Token — Arquitectura Hibrida | Aceptado | 2026-06-27 |
| 002 | Estructura del Conocimiento — 6 Categorias | Aceptado | 2026-06-27 |

## Procesos (SOPs)

| # | Nombre | Frecuencia | Owner | Estado |
|---|--------|------------|-------|--------|
| 1 | Proyecto Kickoff — Configuracion Inicial | Ad-hoc | Estratega Principal | Completo |
| 2 | Reporte Semanal a Cliente | Semanal | Analista Agent | Completo |

## Templates de Agentes

| Rol | Archivo | Estado |
|-----|---------|--------|
| Admin Agent | `agents/01-admin-agent.md` | Template listo |
| Finance Agent | `agents/02-finance-agent.md` | Template listo |
| HR Agent | `agents/03-hr-agent.md` | Template listo |

## Configuraciones de Agentes

| Rol | Archivo | Estado |
|-----|---------|--------|
| Admin Agent | `agents/admin-config.yaml` | Configurado |
| Finance Agent | — | Pendiente |
| HR Agent | — | Pendiente |

## Infraestructura

| Componente | Estado | Notas |
|------------|--------|-------|
| Shared Org estructura | Listo | 6 categorias con contenido real |
| Templates documentacion | Listo | Playbook, ADR, SOP |
| MCP Bridge | v0.1 | Testeado (--index, --query, --sync, interactivo) |
| Slack Bot | Pendiente | Fase 2 |
| Notion Integration | Pendiente | Fase 2 |
| WhatsApp Integration | Pendiente | Fase 3 |

---

## Quick Wins Status

| # | Quick Win | Estado | Notas |
|---|-----------|--------|-------|
| 1 | Crear `10_Shared_Org/` en Knowledge | Listo | Creado como `10_Shared_Org/` |
| 2 | Documentar 1 playbook como ejemplo | Listo | Onboarding Nuevo Cliente |
| 3 | Configurar Codex workspace compartido | Pendiente | Requiere acceso al equipo |
| 4 | Crear template de agente para un rol | Listo | 3 templates (Admin, Finance, HR) |
| 5 | Completar contexto organizacional | Listo | context/organizacion.md completado |
| 6 | Documentar procesos operativos | Listo | 2 SOPs (kickoff, reporte semanal) |
| 7 | Documentar decision de estructura | Listo | ADR-002: 6 categorias de conocimiento |
| 8 | Probar MCP Bridge en todos los modos | Listo | --index, --query, --sync, interactivo |
| 9 | Configurar Admin Agent real | Listo | admin-config.yaml creado |

---

## Proximos Pasos

### Esta Semana / Proxima
- [ ] Documentar 3er playbook (identificar proceso mas repetitivo)
- [ ] Configurar Finance Agent template -> config real
- [ ] Configurar HR Agent template -> config real
- [ ] Agregar mas secciones a context/ (equipos, herramientas, proyectos)

### Fase 2 (Semanas 3-4)
- [ ] Configurar MCP Bridge como servidor persistente
- [ ] Bot de Slack para consultar shared context
- [ ] Integracion Notion bidireccional
- [ ] Contexto de equipo compartido

### Fase 3 (Semanas 5-6)
- [ ] Feedback loop automatico
- [ ] Auto-improvement conectado
- [ ] Dashboard visual (HTML)
- [ ] WhatsApp integration
