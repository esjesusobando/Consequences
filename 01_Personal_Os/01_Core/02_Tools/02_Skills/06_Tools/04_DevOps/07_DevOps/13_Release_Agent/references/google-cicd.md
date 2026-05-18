# Google CI/CD — Release Agent Reference

## Principios Fundamentales (Software Engineering at Google)

Dos reglas que definen el enfoque de Google:

1. **Shift left**: detectar problemas lo antes posible. Un bug en CI cuesta 10x menos que un bug en producción.
2. **Faster is safer**: lotes de cambios pequeños y frecuentes reducen el riesgo de cada release individual.

---

## Herramientas GCP para CI/CD

| Herramienta | Rol |
|---|---|
| **Cloud Build** | CI — compila, testea, construye imágenes Docker |
| **Artifact Registry** | Almacena imágenes de contenedor |
| **Cloud Deploy** | CD — despliegues progresivos a GKE/Cloud Run |
| **Cloud Run / GKE** | Targets de despliegue |
| **Cloud Monitoring** | Observabilidad post-release |

---

## Regla de Oro: Construir Una Sola Vez

```
❌ MALO: rebuild en cada entorno
  dev → build_1 → staging → build_2 → production → build_3

✅ BUENO: una imagen, múltiples entornos
  dev → BUILD → image:commit_sha → staging → production
```

Reconstruir en cada etapa introduce diferencias sutiles. La imagen que pasó los tests en staging debe ser exactamente la misma que llega a producción.

---

## Estrategias de Despliegue

### Canary
```yaml
# Cloud Deploy — canary al 5%
canaryDeployment:
  percentages: [5, 25, 50, 100]
  verify: true
```
Ideal para: cambios de alto impacto, nuevas features en rutas críticas.
Rollback: automático si el error rate supera el umbral.

### Blue/Green
Dos entornos idénticos. El tráfico se mueve de golpe de blue a green.
Ideal para: cambios que requieren rollback instantáneo completo.

### Rolling Update
Reemplaza instancias progresivamente.
Ideal para: updates rutinarios, sin ventana de cero disponibilidad.

---

## GitOps — Infraestructura como Código

Todo el estado del sistema debe vivir en un repositorio Git:
- Configuración de infraestructura (Terraform / Config Connector)
- Definiciones de pipeline (cloudbuild.yaml)
- Manifests de Kubernetes

Ventajas:
- Cualquier cambio pasa por PR → revisión → merge
- El estado del sistema es siempre auditable
- Rollback = revertir un commit

---

## Seguridad en el Pipeline

```
Static IaC checks    →  tfsec, checkov
Secret scanning      →  gitleaks
Image scanning       →  Container Analysis API (bloquea CVEs críticos)
IAM least privilege  →  service account con permisos mínimos
Binary Authorization →  solo imágenes firmadas llegan a producción
```

### Binary Authorization (GKE Enterprise)
Requiere que las imágenes tengan attestations antes de desplegarse. Útil cuando el equipo quiere garantizar que ninguna imagen no auditada llegue a producción.

---

## Checklist de Pipeline (Google GKE)

```
CI:
- [ ] Linting y formato
- [ ] Tests unitarios (suite crítica)
- [ ] Build de imagen Docker
- [ ] Escaneo de vulnerabilidades
- [ ] Push a Artifact Registry con tag :commit_sha

CD:
- [ ] Deploy a staging con misma imagen
- [ ] Smoke tests en staging
- [ ] Aprobación manual (para producción)
- [ ] Deploy canary / blue-green / rolling según estrategia
- [ ] Monitoreo activo 15-30 min post-deploy
- [ ] Rollback automático si error rate > umbral
```

---

## Monitoreo Post-Release

Métricas clave a monitorear los primeros 30 minutos:

| Métrica | Umbral de alerta |
|---|---|
| Error rate HTTP 5xx | > 1% |
| Latencia P99 | > 2x baseline |
| CPU / Memoria | > 80% |
| Tasa de éxito de jobs | < 95% |

---

## Fuentes

- Google GKE CI/CD Best Practices: https://cloud.google.com/kubernetes-engine/docs/concepts/best-practices-continuous-integration-delivery-kubernetes
- Software Engineering at Google (SWE Book): https://abseil.io/resources/swe-book/html/ch24.html
- Google Cloud Blog — DevOps and CI/CD: https://cloud.google.com/blog/topics/developers-practitioners/devops-and-cicd-google-cloud-explained
