# Investigación Técnica: Motor Surge & Swab (Burkhardt Model)

## 🔘 Objetivo

Implementar un cálculo de presiones dinámicas por movimiento de tubería basado en el modelo semi-empírico de Burkhardt, optimizado para fluidos Bingham Plastic.

## 🧠 Fórmulas y Constantes

### 1. Constante de Adhesión (Clinging Constant, K)

Define cuánta parte del lodo se mueve con la tubería.

- **Valor por defecto (IADC):** $K = 0.45$
- **Cálculo Geométrico:** $K = \frac{R}{1+R}$, donde $R = D_p / D_h$

### 2. Velocidad Efectiva de Anular ($V_e$)

Se utiliza para calcular la pérdida de presión por fricción como si el lodo fluyera a esta velocidad.
$V_e = V_p \times \left( K + \frac{D_p^2}{D_h^2 - D_p^2} \right)$
_Donde:_

- $V_p$: Velocidad de la tubería (ft/min).
- $D_p$: Diámetro exterior de la tubería (in).
- $D_h$: Diámetro del hueco/casing (in).

### 3. Cálculo de Pérdida de Presión ($\Delta P$)

Usamos el modelo Bingham Plastic para el anular:

1.  **Velocidad Crítica ($V_c$):** Determina si el flujo es laminar o turbulento.
2.  **Gradiente de Fricción ($P_f$):**
    - Si Laminar ($V_e < V_c$): $P_f = \frac{PV \times V_e}{1000 \times (D_h - D_p)^2} + \frac{YP}{200 \times (D_h - D_p)}$
    - Si Turbulento ($V_e \ge V_c$): $P_f = \frac{MW^{0.8} \times V_e^{1.8} \times PV^{0.2}}{77000 \times (D_h - D_p)^{1.2}}$

### 4. Presión Total y ECD Dinámico

- $P_{surge} = P_f \times Depth$
- $ECD_{surge} = MW + \frac{P_{surge}}{0.052 \times Depth}$

## 🧪 Escenario de Validación (Benchmark)

- **Profundidad:** 10,000 ft
- **Lodo (MW):** 12.0 ppg
- **PV / YP:** 25 / 15
- **Geometría:** 8.5" hueco / 5.0" tubería
- **Velocidad de tubería ($V_p$):** 90 ft/min (1.5 ft/s)

**Resultados Esperados (Aproximados):**

- $R = 5.0 / 8.5 = 0.588$
- $K = 0.45$ (IADC Std)
- $V_e = 90 \times (0.45 + \frac{25}{72.25 - 25}) = 90 \times (0.45 + 0.529) = 88.11$ ft/min.
- $P_f \approx$ [Cálculo a realizar en script de validación]
