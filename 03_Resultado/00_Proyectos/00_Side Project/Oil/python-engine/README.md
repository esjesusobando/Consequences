# 🛢️ Drilling Engine — Python

**PersonalOS · Oil & Gas Side Project**

Motor de ingeniería de perforación con cálculos avanzados, simulación estocástica y reportes PDF.

## Instalación

```bash
pip install -r requirements.txt
```

## Uso Rápido

```python
from drilling.types import WellData, MudData, FormationData, PumpData
from drilling.orchestrator import run_drilling_calculations

well = WellData()      # Valores por defecto
mud = MudData()
formation = FormationData()
pump = PumpData()

results = run_drilling_calculations(well, mud, formation, pump)
print(results.volumetrics)
```

## Estructura

| Módulo           | Descripción                               | Referencia  |
|-----------------|------------------------------------------|------------|
| `volumetrics.py` | Capacidades, volúmenes anulares           | API RP 13B  |
| `rheology.py`    | Bingham, Power Law, Herschel-Bulkley      | API RP 13B-1|
| `pressures.py`   | Pore, fracture, mud window, Monte Carlo   | WCI / IADC  |
| `hydraulics.py`  | Velocidades, ECD, HHP, nozzle optimization| API RP 13D  |
| `pump.py`        | Output, flow rate, HHP                    | IADC Manual |
| `circulation.py` | Lag time, bottoms up                      | IADC Manual |
| `directional.py` | Mínima curvatura, survey 3D               | SPE         |
| `cementing.py`   | Slurry yield, displacement                | API RP 10B  |
| `well_control.py`| Kill sheet, Driller/W&W                   | IWCF / IADC |

## Tests

```bash
python -m pytest tests/ -v
```

## Ejemplo

```bash
python examples/basic_well_analysis.py
```

Genera `output/well_report.pdf` con resultados completos y gráficos.
