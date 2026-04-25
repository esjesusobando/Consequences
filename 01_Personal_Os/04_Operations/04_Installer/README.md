# 04_Installer — PersonalOS v2.0

**Estado:** v2.0 Consequences | **Última actualización:** 2026-04-25

## Descripción

Módulo de instalación del PersonalOS. Instala el sistema operativo en una nueva máquina.

## Contenido

| # | Archivo | Descripción |
|---|--------|-----------|
| 1 | README.md | Este archivo |
| 2 | __pycache__ | Cache de Python |
| 3 | config.json | Configuración actual |
| 4 | config.template.json | Template de configuración |
| 5 | installer.py | Script principal de instalación |
| 6 | requirements.txt | Dependencias Python |
| 7 | scripts | Scripts auxiliares de instalación |
| 8 | .mcp.template.json | Template MCP (añadido 2026-04-24) |

## Estructura v2.0

```
04_Installer/
├── README.md
├── config.json
├── config.template.json
├── installer.py
├── requirements.txt
├── .mcp.template.json
└── scripts/
```

## Uso

```bash
# Instalación básica
python installer.py

# Con config custom
python installer.py --config custom.json

# Dry run
python installer.py --dry-run
```

## Dependencias

- Python 3.10+
- colorama
- packaging

---

*Actualizado: 2026-04-25 10:25*
*Scripts en esta carpeta: 8*