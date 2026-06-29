> ⚠️ DOCUMENTO HISTÓRICO — 2026-05-24
> Este documento es un registro histórico del sistema. Los conteos y métricas pueden estar desactualizados.
> Para el estado actual del sistema, ver Structure_v5.0.md o README.md.

---

# 📋 Nota de Proceso — 2026-05-24

> **Fecha:** 2026-05-24
> **Sesión:** Auditoría SOTA + estabilización no destructiva
> **Estado:** ✅ Documentada con fixes aplicados y pendientes controlados
> **Commit base:** b2922cdc7

---

## 🎯 Objetivo

Revisar el proyecto completo para identificar errores, actualizar rutas, estructuras, dependencias, referencias, skills y scripts al estado actual, sin eliminar información salvo bugs confirmados. La regla operativa de la sesión fue: **complementar, mejorar y preservar**.

También se respetó una restricción crítica: **no modificar contenido/copy/comentarios visibles de la web**. Las pruebas o mejoras técnicas no deben reescribir textos como `Nuestros Servicios` o `Soluciones integrales` sin aprobación explícita de producto.

---

## ✅ Acciones aplicadas

### 1. Validación de planes de raíz

Se validaron los dos planes solicitados en raíz y se documentó su estado en el reporte de validación. El cierre quedó commitado previamente en:

- `735e60f67 chore: add plan validation report and refresh skill registry`

### 2. Registro y referencias del sistema

Se refrescó el registro de skills y se verificó que `.atl/skill-registry.md` no tenga rutas faltantes en sus 158 entradas detectadas.

### 3. Etiquetas/versiones del orquestador

Se actualizaron referencias puntuales de versión obsoleta sin reescribir masivamente documentación histórica. Commit aplicado:

- `6d54a895b docs: update orchestrator version labels`

### 4. Dependencias vivas

Se endurecieron dependencias de proyectos activos sin forzar cambios breaking:

- `05_OBAND`: Next `16.2.2` → `16.2.6`
- `05_OBAND`: React/ReactDOM `19.2.4` → `19.2.6`
- `05_OBAND`: `eslint-config-next` `16.2.2` → `16.2.6`
- `09_Valeria`: `@playwright/test` `1.59.1` → `1.60.0`

Commit aplicado:

- `b2922cdc7 chore: harden live project dependencies`

### 5. Build estable en Windows profundo

En `05_OBAND`, Next 16 con Turbopack falla en esta ruta profunda de Windows por longitud/rutas internas. Se dejó el build estable con Webpack:

```json
"build": "next build --webpack"
```

Y se añadió `outputFileTracingRoot` en `next.config.ts` para acotar el tracing al proyecto.

### 6. GGA pre-commit

Se diagnosticó por qué GGA se abría siempre: `.git/hooks/pre-commit` ejecutaba `gga run` incondicionalmente. Se ajustó el hook local para mantener el secret scanner activo y ejecutar GGA solo con:

```bash
GGA_PRECOMMIT=1 git commit ...
```

Backup local creado:

- `.git/hooks/pre-commit.backup-20260524-095302`

> Nota: `.git/hooks` no está versionado por Git, por eso este fix es local y no genera commit.

---

## 🔎 Diagnóstico técnico actual

| Área                      | Estado                     | Evidencia                                                | Decisión                        |
|--------------------------|---------------------------|---------------------------------------------------------|--------------------------------|
| Git                       | Limpio antes de documentar | `git status --short` sin cambios                         | OK                              |
| Skills registry           | Estable                    | 158 rutas detectadas, 0 faltantes                        | OK                              |
| Scripts críticos          | Parse OK                   | `config_paths.py`, validators, auditors y monitor parsean| OK                              |
| Dependencias live         | Sin high audit             | `npm audit --audit-level=high` OK en proyectos revisados | OK                              |
| `05_OBAND` build          | Estable                    | `npm run build` pasa con Webpack                         | OK                              |
| `05_OBAND` tests          | Pendiente funcional        | fallan por expectativas de copy distintas al render      | No tocar copy web sin aprobación|
| Vulnerabilidades moderadas| Controladas                | requieren `npm audit fix --force` con cambios breaking   | No forzar                       |
| Rutas legacy              | Mayormente histórico/backup| referencias en backups, ejemplos y legacy                | No eliminar                     |
| Skills sin `license:`     | Riesgo bajo/medio          | muchos son imports, backups o vendor-like                | Normalizar selectivo, no masivo |

---

## 📊 Antes vs Después

| Dimensión            | Antes                                           | Después                                                      |
|---------------------|------------------------------------------------|-------------------------------------------------------------|
| Planes raíz          | Estado no validado en esta sesión               | Validados y documentados                                     |
| Registro de skills   | Necesitaba refresh/confirmación                 | `.atl/skill-registry.md` actualizado y sin rutas faltantes   |
| Dependencias live    | Next/React/Playwright con drift y hallazgos high| Parches aplicados; audit high OK                             |
| Build `05_OBAND`     | Turbopack frágil en ruta Windows profunda       | Build estable con `next build --webpack`                     |
| Hook GGA             | Abría/ejecutaba GGA en cada commit              | GGA opt-in con `GGA_PRECOMMIT=1`; secret scanner sigue activo|
| Contenido web        | Riesgo de cambios accidentales por tests/copy   | Cambios de texto revertidos; no se tocó copy visible         |
| Legacy/reference docs| Mezcla de histórico y activo                    | Histórico preservado; no se eliminó info                     |
| Pendientes           | Implícitos                                      | Pendientes documentados y delimitados                        |

---

## ⚠️ Pendientes deliberados

1. **Tests de `05_OBAND`:** fallan por expectativas de texto/copy. No se corrigieron porque hacerlo implicaría tocar contenido web o contratos de contenido. Requiere decisión de producto.
2. **Moderate npm audit:** no se aplicó `--force` porque puede introducir cambios breaking.
3. **Normalización masiva de skills:** no se hizo porque muchos `SKILL.md` sin `license:` pertenecen a backups/imports/vendor-like. Se recomienda normalización selectiva.
4. **Rutas legacy:** se preservaron cuando pertenecen a historial, backups o ejemplos. Solo deberían migrarse si afectan ejecución viva.

---

## 🧠 Aprendizajes clave

1. En este repo, una auditoría sana separa **activo** de **histórico**; no todo path antiguo es bug.
2. En Windows con rutas profundas, Next 16 + Turbopack puede fallar aunque el código esté bien; Webpack es el camino estable actual para `05_OBAND`.
3. Los tests de copy deben tratarse como contrato de producto: si el usuario pide no tocar contenido web, no se arreglan cambiando textos.
4. GGA debe ser opt-in en pre-commit local para no interrumpir commits normales, manteniendo el scanner de secretos siempre activo.
