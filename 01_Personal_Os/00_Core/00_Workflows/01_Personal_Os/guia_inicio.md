# Guia de Inicio — PersonalOS

**Para:** Nuevos usuarios del sistema
**Objetivo:** Estar productivo en 10 minutos

---

## Primeras 3 Cosas que Debes Hacer

### 1. Validar tu entorno

```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/config_paths.py --validate
```

Esto verifica que todas las rutas del sistema existen. Si algo falla,
revisalo antes de seguir.

### 2. Correr el onboarding

```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/onboarding_checklist.py --start
```

Wizard paso a paso que valida tu configuracion, git, Engram, y los
scripts principales.

### 3. Ejecutar tu primer ritual

```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/04_Ritual_Hub.py --simple
```

Ves solo lo esencial: los 3 comandos mas importantes y la tarea
prioritaria del dia. Sin abrumarte.

---

## Tareas Comunes

| Quiero... | Comando |
|-----------|---------|
| Empezar el dia | `python 04_Ritual_Hub.py --simple` |
| Crear contenido | `python content_pipeline.py run --topic "tema" --platform linkedin` |
| Buscar un skill | `python skill_discovery.py "lo que necesito"` |
| No se que hacer | `python no_se_por_donde_empezar.py --interactive` |
| Ver salud del sistema | `python 28_System_Health_Monitor.py` |
| Hacer commit | `python 02_Git_Hub.py` |
| Planificar algo | Carga skill `ce-plan` o `ce-brainstorm` |

---

## Donde Encontrar Ayuda

- **Guia completa:** `quick_start_guide.md` (en la raiz del proyecto)
- **Indice de scripts:** `05_Scripts/00_HUBs/03_Scripts_Os/SCRIPTS_INDEX.md`
- **Catalogo de HUBs:** `05_Scripts/00_HUBs/03_Scripts_Os/HUB_CATALOG.md`
- **Workflows:** `00_Core/00_Workflows/01_Personal_Os/`
- **Inventario:** `00_Core/01_Inventario_Core.md`
- **Comandos:** `00_Core/00_Comandos_Workflows.md`

---

## Los 3 Comandos Esenciales

Si solo podes recordar 3 comandos, estos son:

```bash
# 1. Mi ritual diario
python 04_Ritual_Hub.py --simple

# 2. Buscar lo que necesito
python skill_discovery.py "quiero hacer X"

# 3. Generar contenido
python content_pipeline.py run --topic "tema" --platform linkedin
```

---

## El Loop AI Native (Modelo Theo Taba)

El OS no solo ejecuta — **aprende y mejora solo**. Cada ciclo sigue este flujo:

```
CAPTURE → CURATE → EXECUTE → EVAL → SHIP → SIGNAL → LEARN → REPEAT
```

1. **CAPTURE** — Señales del mundo (redes, email, GitHub, RSS)
2. **CURATE** — Filtra: ¿qué es importante? ¿qué es ruido?
3. **EXECUTE** — Ejecuta tareas con agentes y skills (chains)
4. **EVAL** — Evalúa calidad del output (score 0-100)
5. **SHIP** — Publica contenido, prototipos, propuestas
6. **SIGNAL** — Mide resultados (engagement, conversiones, feedback)
7. **LEARN** — Si algo falla 3+ veces, extrae el patrón
8. **REPEAT** — La próxima ejecución es mejor

---

## Si No Sabes Qué Hacer

```bash
# Pregunta en lenguaje natural — el OS recomienda el skill/script correcto
python no_se_por_donde_empezar.py --question "quiero crear un post para LinkedIn"
# → Recomienda: content_pipeline.py (90% confidence)

# TUI interactiva — wizard que te guía paso a paso
python no_se_por_donde_empezar.py --interactive
```

**Los 3 comandos más importantes:**
```bash
# 1. Tu ritual diario — 30 segundos para empezar bien
python 04_Ritual_Hub.py --simple

# 2. Ejecutar una cadena de skills — automatiza flujos complejos
python skill_chain.py run content_chain --topic "mi tema"

# 3. Certificar que todo funciona — health check completo
python certify_10_10.py --verbose
```

**Referencia rápida a scripts principales:**

| Qué necesitas | Script |
|---------------|--------|
| Crear contenido | `content_pipeline.py run --topic "X" --platform linkedin` |
| Crear prototipo | `prototype_studio.py run --idea "X" --brand spotify` |
| Ejecutar cadena | `skill_chain.py run <chain> --param value` |
| Evaluar calidad | `output_eval.py evaluate --input file.md --type content` |
| Ver tendencias | `signal_aggregator.py --once --verbose` |
| Clasificar señales | `curation_filter.py --inbox-dir capture_inbox/` |
| Backup Engram | `engram_snapshot.py` |
| Verificar sistema | `certify_10_10.py --verbose` |
| No sé qué hacer | `no_se_por_donde_empezar.py --question "X"` |

---

*Generado por Think Different PersonalOS v5.0 — Sprint 4*
