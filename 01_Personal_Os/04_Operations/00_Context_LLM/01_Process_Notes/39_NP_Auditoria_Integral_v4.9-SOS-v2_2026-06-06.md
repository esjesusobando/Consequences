# 📋 NP-39: Auditoría Integral v4.9-SOS-v2 — Corrección y Complementación

> **Fecha:** 2026-06-06
> **Contexto:** Auditoría post-SOS para corregir discrepancias en conteos de documentación, verificar paths, y actualizar estado real del sistema.
> **Estado:** ✅ EN PROGRESO

---

## 🔍 Hallazgos Principales

### ✅ Correcto (Sin Cambios)
| Componente | Valor | Estado |
|------------|-------|--------|
| Skills activas | 392 SKILL.md en 15 áreas | ✅ VERIFICADO |
| gentle-ai | v1.36.6 | ✅ ACTUAL |
| Every CE | v3.11.1 | ✅ ACTUAL |
| Paths .gga | 05_Validator/ (correcto) | ✅ VERIFICADO |
| Estructura 00-03 | Canónica intacta | ✅ VERIFICADO |

### ⚠️ Discrepancias Detectadas y Corregidas

| Documento | Antes | Después | Corrección |
|-----------|-------|---------|------------|
| **OS_DIRECTORY.md** | HUBs: 30, Scripts: 163 | HUBs: 35, Scripts: 258 | ✅ CORREGIDO |
| **CLAUDE.md** | HUBs: 30, Scripts: 163 | HUBs: 35, Scripts: 258 | ✅ CORREGIDO |
| **Structure_v4.9.md** | "20 HUBs + 256 scripts" | "35 HUBs + 258 scripts" | ✅ CORREGIDO |

---

## 📊 Estado Real del Sistema (Verificado contra Disco)

### Scripts en 03_Scripts_Os/

| Categoría | Cantidad | Detalle |
|-----------|----------|---------|
| **HUBs principales (raíz)** | 35 | 31 .py numerados + config_paths.py + HUB_SOTA.py + refactor_revert_id.py + 23_Preview_Generator.js |
| **Scripts en subdirectorios** | 223 | 13_Legacy/: ~85, 05_Validator/: 8, 12_Auditors_Os/: varios, etc. |
| **Total Python scripts** | 258 | Verificado con `os.walk()` |
| **Directorios numerados** | 45 | 00_Context_LLM, 01_Ritual, ..., 13_Legacy |

### Skills por Área (392 total — VERIFICADO)

| Área | Path | Skills |
|------|------|--------|
| 00_Agent_Teams_Lite | 00_Agent_Teams_Lite/ | 14 |
| 00_Compound_Engineering | 00_Compound_Engineering/ | 63 |
| 00_Personal_Os | 00_Personal_Os/ | 24 |
| 00_Skill_Auditor | 00_Skill_Auditor/ | 1 |
| 00_System_Core | 00_System_Core/ | 1 |
| 00_Workflows | 00_Workflows/ | 43 |
| 01_Creacion_Contenidos | 01_Creacion_Contenidos/ | 49 |
| 02_Diseno_Ui_Ux | 02_Diseno_Ui_Ux/ | 34 |
| 03_Video_Media | 03_Video_Media/ | 7 |
| 04_Automatizacion | 04_Automatizacion/ | 27 |
| 05_Claude_Ads | 05_Claude_Ads/ | 21 |
| 06_Tools | 06_Tools/ | 83 |
| 07_Invictus_Web | 07_Invictus_Web/ | 18 |
| 08_JAO | 08_JAO/ | 6 |
| 10_Laia_Learning | 10_Laia_Learning/ | 1 |

---

## 🔧 Cambios Aplicados

### 1. Conteos Corregidos en Documentación

#### OS_DIRECTORY.md
```diff
- | HUBs | **30** (todos con interfaz) — **163 scripts** totales (133 en subdirectorios) |
+ | HUBs | **35** (root) — **258 scripts** totales (223 en subdirectorios) |
```

#### CLAUDE.md
```diff
- | HUBs (30 — scripts: 163) | ✅ PASS |
+ | HUBs (35 — scripts: 258) | ✅ PASS |
```

#### Structure_v4.9.md
```diff
- | HUBs | 20 (00-20) + HUB_SOTA | ✅ |
- | Scripts | 163 totales (30 HUBs raíz + 133 subdirectorios) | ✅ |
+ | HUBs | 35 (root scripts) + HUB_SOTA + config_paths + 23 más | ✅ |
+ | Scripts | 258 totales (35 root + 223 subdirectorios) | ✅ |
```

---

## 📋 Cuadro Comparativo ANTES vs DESPUÉS

| Componente | ANTES (Doc incorrecta) | DESPUÉS (Real verificado) | Δ |
|------------|------------------------|---------------------------|---|
| **HUBs (scripts raíz)** | 30 | 35 | +5 |
| **Scripts totales** | 163 | 258 | +95 |
| **Scripts en subdirectorios** | 133 | 223 | +90 |
| **Skills** | 392 ✅ | 392 ✅ | 0 |
| **Áreas funcionales** | 15 ✅ | 15 ✅ | 0 |
| **Agents** | 62 ✅ | 62 ✅ | 0 |
| **Workflows** | 28 ✅ | 28 ✅ | 0 |

---

## 🎯 OpenCode Go — Tabla de Modelos (Suscripción $5/$10)

> **Fuente:** https://opencode.ai/docs/go/ — Actualizado 2026-06-06

### Modelos por TIER (Mejor → Menor)

| Rank | Modelo | Input $/M | Output $/M | Cached Read | 5h requests | Weekly requests | Monthly requests |
|------|--------|-----------|------------|-------------|-------------|------------------|------------------|
| 🥇 1 | **MiMo-V2.5** | $0.14 | $0.28 | $0.0028 | 30,100 | 75,200 | 150,400 |
| 🥇 2 | **DeepSeek V4 Flash** | $0.14 | $0.28 | $0.0028 | 31,650 | 79,050 | 158,150 |
| 🥈 3 | **MiniMax M2.5** | $0.30 | $1.20 | $0.06 | 6,300 | 15,900 | 31,800 |
| 🥈 4 | **MiniMax M2.7** | $0.30 | $1.20 | $0.06 | 3,400 | 8,500 | 17,000 |
| 🥉 5 | **Kimi K2.5** | $0.60 | $3.00 | $0.10 | 1,850 | 4,630 | 9,250 |
| 6 | **Qwen3.6 Plus (≤256K)** | $0.50 | $3.00 | $0.05 | 3,300 | 8,200 | 16,300 |
| 7 | **Qwen3.7 Plus (≤256K)** | $0.40 | $1.60 | $0.04 | 4,300 | 10,800 | 21,600 |
| 8 | **MiniMax M3** | $0.60 | $2.40 | $0.12 | 1,400 | 3,500 | 7,000 |
| 9 | **Kimi K2.6** | $0.95 | $4.00 | $0.16 | 1,150 | 2,880 | 5,750 |
| 10 | **GLM-5** | $1.00 | $3.20 | $0.20 | 1,150 | 2,880 | 5,750 |
| 11 | **DeepSeek V4 Pro** | $1.74 | $3.48 | $0.0145 | 3,450 | 8,550 | 17,150 |
| 12 | **MiMo-V2.5-Pro** | $1.74 | $3.48 | $0.0145 | 3,250 | 8,150 | 16,300 |
| 13 | **GLM-5.1** | $1.40 | $4.40 | $0.26 | 880 | 2,150 | 4,300 |
| 14 | **Qwen3.7 Max** | $2.50 | $7.50 | $0.50 | 950 | 2,390 | 4,770 |
| 15 | **Qwen3.6 Plus (>256K)** | $2.00 | $6.00 | $0.20 | — | — | — |
| 16 | **Qwen3.7 Plus (>256K)** | $1.20 | $4.80 | $0.12 | — | — | — |

### Recomendación por Uso

| Caso de Uso | Modelo Recomendado | Reason |
|-------------|-------------------|--------|
| **Alto volumen, bajo costo** | MiMo-V2.5 o DeepSeek V4 Flash | 30K+ requests/5h |
| **Balance costo/rendimiento** | MiniMax M2.5 o M2.7 | 3K-6K requests, $0.30/M input |
| **Coding de alta calidad** | Kimi K2.6 | $0.95 input, buena calidad |
| **Máximo poder** | Qwen3.7 Max | $2.50 input, mejor para tareas complejas |

---

## 📁 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `OS_DIRECTORY.md` | Conteos: 30→35 HUBs, 163→258 scripts |
| `CLAUDE.md` | Conteos actualizados |
| `Structure_v4.9.md` | Conteos actualizados |

---

## 🔮 Próximos Pasos

- [ ] Commit de cambios con mensaje descriptivo
- [ ] Push a origin/main
- [ ] Crear tag `Go-Opencode-Susc`
- [ ] Verificar que Graphify esté actualizado

---

**Nota:** Los cambios NO eliminan información, solo corrigen conteos que estaban desactualizados. La estructura y paths permanecen intactos.