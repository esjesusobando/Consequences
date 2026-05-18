# Test Matrix — Qué Testear Cuando Programas con IA

Basado en la clasificación de BIG school + principios Anthropic de código opaco.

---

## Las Tres Categorías

### 🔴 Lo Crítico — Nunca delegues estos tests

Bloquean el release si fallan. Sin excepción.

| Área                            | Ejemplos concretos                                                              |
|--------------------------------|--------------------------------------------------------------------------------|
| **Autenticación y autorización**| ¿Quién puede ver qué datos? ¿Quién puede ejecutar qué acción?                   |
| **Lógica de negocio principal** | Cálculos de precios, reglas de descuento, validaciones de formularios críticos  |
| **Puntos de integración**       | APIs externas (pagos, identidad), escrituras a base de datos, eventos de sistema|

**Cómo testear:**
```python
# Ejemplo — test de autorización
def test_user_cannot_access_other_user_data():
    user_a = create_user()
    user_b = create_user()
    response = client.get(f"/api/data/{user_b.id}", auth=user_a.token)
    assert response.status_code == 403

# Ejemplo — lógica de negocio
def test_discount_never_exceeds_100_percent():
    price = calculate_final_price(base=100, discount_code="EXTREME")
    assert price >= 0
```

---

### 🟡 Lo Importante — Revisión humana obligatoria

No bloquean automáticamente, pero requieren que un humano los entienda antes del merge.

| Caso                                       | Por qué importa                                                                       |
|-------------------------------------------|--------------------------------------------------------------------------------------|
| **Edge cases que ya rompieron producción** | El sistema ya te dijo dónde duele. Escucha.                                           |
| **Código generado por IA que no entiendes**| Si no lo entiendes, no puedes garantizar que funciona correctamente en todos los casos|

**Señal de alerta:** Si al revisar código generado por IA piensas "no sé exactamente qué hace esto", ese código es "Importante". No "Delegable".

---

### 🟢 Lo que Puedes Delegar — Automatiza sin culpa

La IA puede generar y mantener estos tests con supervisión mínima.

| Tipo                               | Ejemplos                                       |
|-----------------------------------|-----------------------------------------------|
| **Happy path de funciones simples**| `format_date()`, `calculate_age()`, `slugify()`|
| **Tests de utilidades y helpers**  | parsers, formateadores, conversores de unidades|

```python
# Ejemplo — test delegable a IA
def test_format_currency():
    assert format_currency(1234.5, "USD") == "$1,234.50"
    assert format_currency(0, "EUR") == "€0.00"
```

---

## Aplicación con Código Generado por IA

Cuando la IA escribe código, aplica esta decisión:

```
¿El código toca autenticación, autorización o lógica de negocio crítica?
    SÍ → Categoría CRÍTICA: tests manuales + revisión de cada línea
    NO → continúa...

¿Entiendes exactamente qué hace ese código?
    NO → Categoría IMPORTANTE: revisión humana antes del merge
    SÍ → continúa...

¿Es una función simple y aislada?
    SÍ → Categoría DELEGABLE: tests automáticos suficientes
```

---

## Métricas de Cobertura Recomendadas

| Categoría | Cobertura mínima     | Herramienta         |
|----------|---------------------|--------------------|
| Crítico   | 100% de ramas        | pytest-cov, Istanbul|
| Importante| 80%                  | pytest-cov          |
| Delegable | 60% o generado por IA| Copilot, Claude     |

---

## Fuentes

- BIG school — "Qué testear cuando programas con IA" (imagen de referencia)
- Anthropic RSP v3.0 — principio de código opaco
- Google SWE Book — testing philosophy
