# OilBrain - Base de Conocimiento de Ingeniería
**Última actualización:** 2026-02-20 | **Auditoría Elite v2.0.0**

---

## Estándares de Reología (API RP 13B-1 / API RP 13D)

### Modelos Soportados

1. **Bingham Plastic**:
   - PV (cP) = θ600 - θ300
   - YP (lb/100ft²) = θ300 - PV
   - μ_app @ 511 s⁻¹ = PV + YP × (300/511) ← **CORREGIDO** Bourgoyne §4
   - AV (cP equiv.) = θ600 / 2 ← API RP 13B-1 definición estándar

2. **Power Law**:
   - n = 3.322 × log10(θ600 / θ300)
   - K (lb/100ft²·s^n) = θ300 / (511^n)
   - μ_eff (cP) = K × γ^(n-1) × **478.8** ← **CORREGIDO** API RP 13D §5
     - Factor 478.8 = conversión lbf·s/100ft² → cP
     - γ en unidades Fann-dial equiv. (1.6×v_ftmin/D_in para tubería)

3. **Herschel-Bulkley (Yield Power Law)**:
   - τ0 = 2 × θ3 - θ6
   - n_hb = 3.32 × log10((θ600 - τ0) / (θ300 - τ0))
   - K_hb = (θ300 - τ0) / (511^n_hb)
   - μ_eff (cP) = (τ0 × 478.8) / γ + K × γ^(n-1) × **478.8** ← **CORREGIDO** API RP 13D §6

---

## Cálculos de Hidráulica (API RP 13D / IADC)

- **Velocidad Anular (AV)**:
  - AV (ft/min) = (24.51 × Q) / (D_hole² - D_pipe²)
- **Velocidad en Tubería (PV)**:
  - PV (ft/min) = (24.51 × Q) / D_ID²
- **Número de Reynolds (Re)**:
  - Re = (928 × MW × v_fts × D_in) / μ_eff ← factor 928 verificado
- **ECD (Equivalent Circulating Density)**:
  - ECD = MW + (ΔP_ann / (0.052 × TVD))
- **Bit Pressure Drop (ΔPb)**:
  - ΔPb = (MW × Q²) / (10858 × Cd² × TFA²) — Cd=0.95
- **HSI (Horsepower per Square Inch)**:
  - HSI = (ΔPb × Q) / (1714 × Area_Bit)
- **Impact Force (IF)** — Bourgoyne et al.:
  - IF = (MW × Q × v_nozzle) / 1930
- **velocityRatio** (nuevo):
  - ratio = AV / PipeV ← **CORREGIDO** (antes hardcodeado a 1.0)

---

## Reglas de Oro de PersonalOS (Pilar 1)

- **Armor Layer**: Toda entrada debe ser sanitizada (utils/sanitize.ts).
- **Pure Green**: Mantener tipos coherentes en `store/drilling-types.ts`.
- **Dieter Rams Aesthetics**: UI limpia, stroke widths de 1.5/1.75 en iconos.

---

## Registro de Correcciones (Auditoría Elite)

| Fecha     | Módulo         | Corrección                             | Referencia    |
|----------|---------------|---------------------------------------|--------------|
| 2026-02-20| `rheology.ts`  | mu_eff: `5.11/511` → `300/511`         | Bourgoyne §4  |
| 2026-02-20| `hydraulics.ts`| Power Law μ_eff: `100/511^n` → `×478.8`| API RP 13D §5 |
| 2026-02-20| `hydraulics.ts`| HB μ_eff: mismo factor corregido       | API RP 13D §6 |
| 2026-02-20| `hydraulics.ts`| velocityRatio: `1.0` → `AV/PipeV`      | Lógica básica |
| 2026-02-20| `rheology.ts`  | Removida variable `ratio` sin usar     | TS6133 cleanup|
