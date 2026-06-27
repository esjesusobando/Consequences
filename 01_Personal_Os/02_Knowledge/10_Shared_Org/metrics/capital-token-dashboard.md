# 🌕 Capital Token Dashboard

> Dashboard de estado del Capital Token organizacional.
> *Actualizado: 2026-06-27*

---

## Resumen

| Métrica | Valor | Target | Estado |
|---------|-------|--------|--------|
| Playbooks documentados | 1 | 20+ | 🟡 En progreso |
| Decisiones registradas | 0 | 10+ | 🔴 No iniciado |
| Procesos documentados | 0 | 5+ | 🔴 No iniciado |
| Agentes template | 3 | 3+ | ✅ Completo |
| Shared Context files | 1 | 5+ | 🔴 No iniciado |
| MCP Bridge | v0.1 | v1.0 | 🟡 En progreso |

---

## Playbooks
| # | Nombre | Estado | Última revisión |
|---|--------|--------|----------------|
| 1 | Onboarding Nuevo Cliente | ✅ Completo | 2026-06-27 |

## Templates de Agentes
| Rol | Archivo | Estado |
|-----|---------|--------|
| Admin Agent | `agents/01-admin-agent.md` | ✅ Template listo |
| Finance Agent | `agents/02-finance-agent.md` | ✅ Template listo |
| HR Agent | `agents/03-hr-agent.md` | ✅ Template listo |

## Infraestructura
| Componente | Estado | Notas |
|------------|--------|-------|
| Shared Org estructura | ✅ | 6 categorías |
| Templates documentación | ✅ | Playbook, ADR, SOP |
| MCP Bridge | 🟡 v0.1 | Consultas interactivas + servidor JSON |
| Slack Bot | ❌ | Pendiente (Fase 2) |
| Notion Integration | ❌ | Pendiente (Fase 2) |
| WhatsApp Integration | ❌ | Pendiente (Fase 3) |

---

## Quick Wins Status (del Plan Original)

| # | Quick Win | Estado | Notas |
|---|-----------|--------|-------|
| 1 | Crear `05_Shared_Org/` en Knowledge | ✅ | Creado como `10_Shared_Org/` (05 ocupado) |
| 2 | Documentar 1 playbook como ejemplo | ✅ | Onboarding Nuevo Cliente |
| 3 | Configurar Codex workspace compartido | ❌ | Requiere acceso al equipo — pendiente |
| 4 | Crear template de agente para un rol | ✅ | 3 templates (Admin, Finance, HR) |

---

## Próximos Pasos

### Esta Semana
- [ ] Completar context/organizacion.md con datos reales
- [ ] Documentar 2do playbook (proceso más repetitivo detectado)
- [ ] Probar MCP Bridge en modo interactivo

### Fase 2 (Semanas 3-4)
- [ ] Configurar MCP Bridge como servidor persistente
- [ ] Bot de Slack para consultar shared context
- [ ] Integración Notion bidireccional
- [ ] Contexto de equipo compartido en Codex

### Fase 3 (Semanas 5-6)
- [ ] Feedback loop automático
- [ ] Auto-improvement conectado
- [ ] Dashboard visual (HTML)
- [ ] WhatsApp integration
