# Pull Request

## ¿Qué hace este cambio?

<!-- Una línea. Ej: "Corrige el cálculo de descuentos cuando el código es UNLIMITED" -->

## Tipo de cambio

- [ ] Bug fix (no rompe nada existente)
- [ ] Nueva feature
- [ ] Refactor (sin cambio de comportamiento)
- [ ] Cambio en infraestructura o CI/CD
- [ ] Otro: ___________

---

## Test Matrix — Lo Crítico

<!-- Marca los que aplican a ESTE cambio -->

- [ ] ¿Toca autenticación o autorización? → Tests en `tests/critical/auth/`
- [ ] ¿Toca lógica de negocio principal? → Tests en `tests/critical/business/`
- [ ] ¿Toca APIs externas o base de datos? → Tests en `tests/critical/integration/`

**Si alguna casilla anterior está marcada, los tests correspondientes son obligatorios para aprobar este PR.**

---

## Código generado por IA

- [ ] Este PR **NO** contiene código generado por IA
- [ ] Este PR contiene código generado por IA y **lo he revisado y entendido línea a línea**
- [ ] Este PR contiene código generado por IA en rutas críticas — revisión doble requerida

<!-- Si marcaste la última opción, añade al menos otro revisor -->

---

## Evidencia de tests

```
# Pega aquí el output de pytest
$ python -m pytest tests/ -v

```

---

## Checklist de reviewer

- [ ] Entiendo qué hace este código
- [ ] Los tests cubren los casos de fallo más probables
- [ ] El código que toca rutas críticas fue revisado con atención
- [ ] Sin secrets hardcodeados
- [ ] Sin código de debug (`print()`, `debugger`, `pdb`)

---

## Referencias

<!-- Issues relacionados, documentación, contexto adicional -->
