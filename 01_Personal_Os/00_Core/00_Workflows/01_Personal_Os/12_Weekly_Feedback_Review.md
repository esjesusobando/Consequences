---
name: weekly-feedback-review
description: Revisión semanal de señales externas — capturar, normalizar, revisar y generar action items.
---

# Weekly Feedback Review Workflow

Sesión semanal de 15-20 minutos para revisar las señales externas de tus plataformas (LinkedIn, Twitter/X, YouTube, Blog, Newsletter) y generar action items concretos.

## Cuando Ejecutar

- Viernes por la tarde (analizar con la semana fresca)
- Domingo por la noche (preparar la siguiente semana)
- Cada lunes por la mañana (arrancar la semana con datos)

## Flujo Paso a Paso

### Paso 1: Capturar Señales Externas

```bash
cd 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os
python capture_external_signals.py --sources all
```

**Con mock (sin credenciales):**
```bash
python capture_external_signals.py --dry-run --mock
```

**Resultado:** Se generan `signals.json` en `03_Learning/04_Telemetry/`

---

### Paso 2: Normalizar Señales

```bash
python signal_normalizer.py
```

**Resultado:** Se generan `signals_normalized.json` con valores en escala 0-100 y tendencias.

**Opciones:**
- `--input signals.json` — archivo de entrada custom
- `--output signals_normalized.json` — archivo de salida custom
- `--days 7` — ventana de comparación para tendencias

---

### Paso 3: Ver Dashboard

```bash
python show_feedback_dashboard.py
```

**Resultado:** Tabla ASCII con:
- Fuente | Métrica | Valor | Tendencia (📈/📉/➡️) | Acción
- Top 5 señales (las más altas)
- Bottom 5 señales (las más bajas)
- Resumen de tendencias

---

### Paso 4: Revisar Top 5 + Bottom 5

En el dashboard, identifica:

**Top 5 — ¿Qué está funcionando?**
- ¿Qué canales tienen mejor rendimiento?
- ¿Qué métricas están subiendo?
- ¿Puedes replicar este éxito en otros canales?

**Bottom 5 — ¿Qué necesita atención?**
- ¿Qué métricas están cayendo?
- ¿Es un problema temporal o una tendencia?
- ¿Qué acción concreta puedes tomar esta semana?

---

### Paso 5: Generar 3 Action Items

Basado en el análisis, crea 3 action items concretos:

| # | Action Item | Fuente/Métrica | Responsable | Fecha |
|---|-------------|----------------|-------------|-------|
| 1 | [Acción específica] | [LinkedIn/engagement_rate] | [Yo] | [Fecha] |
| 2 | [Acción específica] | [Twitter/followers] | [Yo] | [Fecha] |
| 3 | [Acción específica] | [YouTube/subscribers] | [Yo] | [Fecha] |

**Reglas para buenos action items:**
- ✅ Específicos y medibles
- ✅ Con fecha de entrega
- ✅ Asociados a una métrica concreta
- ❌ No vagos como "mejorar contenido"
- ❌ Sin fecha o responsable

---

### Paso 6: Registrar en Ajustes del OS

Documenta el resultado en `ajustes_en_OS.md` con:

```markdown
## Feedback Review — [Fecha]

### Señales Capturadas
- Total: [N] señales de [N] fuentes
- Top: [métrica] → [valor]
- Bottom: [métrica] → [valor]

### Action Items Generados
1. [Action item] — Responsable: [Nombre] — Fecha: [DD/MM]
2. [Action item] — Responsable: [Nombre] — Fecha: [DD/MM]
3. [Action item] — Responsable: [Nombre] — Fecha: [DD/MM]

### Notas
- [Cualquier observación relevante]
```

---

## Configuración Inicial

Antes de usar con datos reales:

1. Copia `.env.example` a `.env` y llena tus credenciales
2. Edita `external_signals.yaml` en `02_Knowledge/04_Config/` para habilitar fuentes
3. Ejecuta con `--mock` primero para verificar que todo funciona

## Troubleshooting

| Problema | Solución |
|----------|----------|
| "No signals captured yet" | Ejecutar `capture_external_signals.py` primero |
| "No internet" | El sistema usa cache local (1h TTL) |
| Rate limit 429 | Esperar y reintentar (backoff automático con tenacity) |
| Token expired 401 | Renovar credenciales en `.env` |
| "unknown source" | Verificar nombre en `--sources` (linkedin,twitter,youtube,blog,newsletter) |
