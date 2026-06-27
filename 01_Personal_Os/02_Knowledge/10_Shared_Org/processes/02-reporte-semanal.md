---
title: "Reporte Semanal a Cliente"
version: 1.0
owner: "Analista Agent"
frequency: "weekly"
last_reviewed: "2026-06-27"
tags: [reporte, semanal, cliente, metricas]
---

# SOP: Reporte Semanal a Cliente

## Propósito
Generar y entregar un reporte semanal de progreso a cada cliente activo, manteniendo visibilidad y confianza sin requerir reuniones sincrónicas.

## Alcance
Lo ejecuta el Analista Agent todos los viernes (o el último día hábil de la semana) para cada cliente con actividad en la semana. Aplica solo a clientes con contrato activo y métricas definidas.

## Diagrama de Flujo

```
[Inicio] → [1. Recolectar datos] → [Completos?]
                                            ↓
                                      [Sí] → [2. Armar reporte] → [3. Revisión interna]
                                            ↓
                                      [No] → [1b. Identificar gaps] → [1]
                                            
[3] → [4. Enviar a cliente] → [5. Archivar] → [Fin]
```

## Procedimiento

### 1. Recolectar Datos de la Semana
**Quién:** Analista Agent
**Qué:** Reunir métricas y logros de la semana para cada cliente:
1. Contenido publicado (cantidad, plataforma, tipo)
2. Engagement (likes, comments, shares, CTR)
3. KPIs del cliente vs actual (ver brief del cliente)
4. Hitos alcanzados / entregables completados
5. Issues o bloqueos detectados

**Herramienta:** Analytics de cada plataforma + tracker interno
**Tiempo estimado:** 20 min por cliente

**Check:**
- [ ] Datos de todas las plataformas del cliente recolectados
- [ ] Comparativa vs semana anterior calculada
- [ ] Issues documentados con severity

### 2. Armar Reporte Semanal
**Quién:** Analista Agent
**Qué:** Armar el documento de reporte usando el template estándar:

```markdown
# Reporte Semanal — {Cliente}
> Semana del {lunes} al {viernes}

## Resumen
{KPI principal y tendencia}

## Métricas Clave
| Métrica | Esta Semana | Semana Anterior | Variación |
|---------|-------------|-----------------|-----------|
| {métrica} | {valor} | {valor} | {Δ} |

## Entregables de la Semana
- {entregable 1}
- {entregable 2}

## Próxima Semana
- {acción 1}
- {acción 2}

## Issues / Bloqueos
- {issue}
```

**Tiempo estimado:** 15 min por cliente

### 3. Revisión Interna
**Quién:** Estratega Principal
**Qué:** Revisar el reporte antes de enviar:
1. Validar que las métricas sean correctas
2. Asegurar que el tono sea profesional y constructivo
3. Agregar comentarios o contexto si hace falta
4. Aprobar o solicitar cambios

**Tiempo estimado:** 10 min por cliente

### 4. Enviar a Cliente
**Quién:** Analista Agent (o Estratega si el cliente requiere toque personal)
**Qué:** Entregar el reporte por el canal acordado con el cliente (email, Slack, Notion):
1. Preparar resumen ejecutivo de 2-3 líneas para el cuerpo del mensaje
2. Adjuntar o linkear el reporte completo
3. Destacar wins de la semana y próximos pasos
4. Preguntar si hay algo que ajustar para la siguiente semana

**Tiempo estimado:** 5 min por cliente

### 5. Archivar Reporte
**Quién:** Analista Agent
**Qué:** Guardar el reporte en el historial del cliente para trazabilidad:
1. Copiar a `01_Personal_Os/05_Projects/{cliente}/reportes/`
2. Actualizar tracker de métricas
3. Si hay issues graves, crear tarea de seguimiento

**Tiempo estimado:** 5 min

## Excepciones

| Situación | Acción |
|-----------|--------|
| Cliente sin actividad en la semana | Enviar reporte mínimo: "Sin actividad, próxima reunión el {fecha}" |
| Datos de plataforma no disponibles | Marcar métrica como "pendiente", reportar causa |
| Cliente pidió no recibir reporte semanal | Respetar preferencia, solo archivar internamente |
| Semana con feriados | Ajustar expectativas, reporte más liviano |

## Checklist de Ejecución

- [ ] Métricas de todas las plataformas recolectadas
- [ ] Reporte armado siguiendo el template
- [ ] Revisión interna completada y aprobada
- [ ] Reporte enviado al cliente por canal acordado
- [ ] Reporte archivado en `05_Projects/{cliente}/reportes/`
- [ ] Issues graves convertidos en tareas de seguimiento
- [ ] Dashboard de métricas actualizado
