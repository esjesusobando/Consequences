---
name: release-agent
description: Agente de releases que combina las mejores prácticas de Anthropic (Agent Skills, safety-first, progressive disclosure) y Google (CI/CD, GitOps, canary deployments). Úsalo cuando necesites planificar, revisar o ejecutar un proceso de release de software con IA integrada. Triggers: "hacer un release", "pipeline CI/CD", "checklist de despliegue", "release seguro", "CI/CD con IA", "Pull Request review", "deploy a producción".
allowed-tools: bash, file_create, str_replace, view, web_search
---

# Release Agent — Mejores Prácticas Anthropic + Google

Combina el modelo de seguridad iterativa de Anthropic con la infraestructura CI/CD de Google para producir releases confiables, trazables y seguros.

## Quick Start

```bash
# 1. Ejecutar análisis pre-release
python scripts/pre_release_check.py --env staging

# 2. Validar tests críticos
python scripts/test_matrix.py --level critical

# 3. Generar checklist de release
python scripts/release_checklist.py --target production
```

---

## Arquitectura del Agente

```
release-agent/
├── SKILL.md                    # Este archivo
├── references/
│   ├── anthropic-safety.md     # Niveles ASL y deployment standards
│   ├── google-cicd.md          # Patrones GCP: Cloud Build, Cloud Deploy
│   └── test-matrix.md          # Qué testear, qué delegar
├── scripts/
│   ├── pre_release_check.py    # Validaciones previas al release
│   ├── test_matrix.py          # Clasificación de tests (crítico/importante/delegable)
│   └── release_checklist.py    # Generador de checklist contextual
└── templates/
    └── pr_template.md          # Plantilla de Pull Request
```

---

## Instrucciones

### Fase 1 — Pre-Release (lo crítico primero)

Antes de cualquier merge a `main`, el agente valida en este orden:

**Crítico** (bloquea el release si falla):
- Autenticación y autorización — ¿quién puede acceder a qué?
- Lógica de negocio principal — cálculos, reglas, validaciones
- Puntos de integración — APIs externas, base de datos

**Importante** (debe revisarse manualmente):
- Edge cases que ya causaron incidentes en producción
- Código generado por IA que no entiendes completamente

**Delegable a la IA** (puede automatizarse):
- Tests de happy path de funciones simples
- Tests de utilidades y helpers

> Ver `references/test-matrix.md` para la matriz completa.

---

### Fase 2 — CI (Integración Continua)

Cada push dispara automáticamente:

```yaml
# cloudbuild.yaml — patrón Google
steps:
  - name: 'python:3.11'
    entrypoint: pip
    args: ['install', '-r', 'requirements.txt']

  - name: 'python:3.11'
    entrypoint: python
    args: ['-m', 'pytest', 'tests/critical/', '-v']

  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/$REPO_NAME:$COMMIT_SHA', '.']

  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/$REPO_NAME:$COMMIT_SHA']
```

Regla Google: **construir una sola vez, promover la misma imagen** a través de los entornos. No reconstruir en cada etapa.

---

### Fase 3 — Pull Request

Un PR es la petición formal de "quiero meter este código". Antes de que entre a `main`, ocurre automáticamente:

1. El CI lanza todos los checks (lint, tests, build)
2. Otros devs revisan el código antes de aprobar

Si algo falla, el merge queda bloqueado. `main` nunca recibe código roto.

Usa la plantilla en `templates/pr_template.md`.

---

### Fase 4 — CD (Despliegue Continuo)

Patrón Google para releases seguros:

| Estrategia | Cuándo usarla |
|---|---|
| **Canary** | Cambios de alto riesgo — primero al 5% del tráfico |
| **Blue/Green** | Cambios que requieren rollback instantáneo |
| **Rolling** | Updates rutinarios de bajo riesgo |

```bash
# Despliegue canary con Cloud Deploy
gcloud deploy releases create release-$(date +%Y%m%d-%H%M) \
  --delivery-pipeline=my-pipeline \
  --region=us-central1 \
  --images=app=gcr.io/$PROJECT_ID/app:$COMMIT_SHA
```

---

### Fase 5 — Seguridad (Principio Anthropic ASL)

El agente aplica salvaguardas proporcionales al nivel de riesgo del cambio:

- **ASL-2** (baseline): clasificadores de input/output, monitoreo estándar
- **ASL-3** (alto riesgo): revisión manual obligatoria + aprobación externa antes de merge

Para código generado por IA:
- Si la IA generó el código, debes entenderlo antes de que pase a producción
- Si no lo entiendes completamente, pertenece a la categoría "Importante" — requiere revisión humana

> Ver `references/anthropic-safety.md` para criterios completos.

---

## Flujo Completo

```
Developer push
     │
     ▼
[CI lanza automáticamente]
  lint → tests críticos → build → scan de vulnerabilidades
     │
     ├── FALLA → bloquea el PR, notifica al dev
     │
     ▼
[Pull Request abierto]
  Revisión humana + checks automáticos
     │
     ├── FALLA → bloqueado
     │
     ▼
[Merge a main aprobado]
     │
     ▼
[CD — Despliegue progresivo]
  staging → canary (5%) → producción completa
     │
     ▼
[Monitoreo post-release]
  métricas, logs, alertas automáticas
```

---

## Ejemplos

**Ejemplo 1 — Revisar un PR con IA:**
```
Input: "Revisa este PR que modifica la lógica de pagos"
Output: Agente clasifica como CRÍTICO → activa revisión de lógica de negocio principal → solicita tests adicionales en puntos de integración con la API de pagos
```

**Ejemplo 2 — Generar checklist de release:**
```
Input: "Quiero hacer release de la versión 2.3.0 a producción"
Output: python scripts/release_checklist.py --version 2.3.0 --target production
```

**Ejemplo 3 — Despliegue canary:**
```
Input: "Despliega la nueva feature de búsqueda con estrategia segura"
Output: Activa canary al 5% → monitorea error rate 15 min → escala a 100% si es estable
```

---

## Guidelines

- Nunca hacer merge directo a `main` sin CI verde
- Nunca desplegar código que la IA generó sin revisión humana
- Siempre construir una sola imagen y promoverla — no reconstruir
- Los tests críticos son no negociables; los delegables son opcionales
- Un release aburrido es un release exitoso

---

## Referencias

- [Anthropic Agent Skills — Open Standard](https://agentskills.io)
- [Google GKE CI/CD Best Practices](https://cloud.google.com/kubernetes-engine/docs/concepts/best-practices-continuous-integration-delivery-kubernetes)
- [Software Engineering at Google — CD](https://abseil.io/resources/swe-book/html/ch24.html)
- [Anthropic Responsible Scaling Policy v3.0](https://www.anthropic.com/responsible-scaling-policy)
- Ver `references/` para documentación extendida
