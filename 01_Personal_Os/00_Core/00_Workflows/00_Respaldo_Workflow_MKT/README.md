# 00_Respaldo_Workflow_MKT

Respaldo de workflows de marketing. Contiene copias de seguridad de
workflows y procesos de marketing para restauración rápida.

## Proposito

Esta carpeta funciona como respaldo centralizado de:
- Workflows de marketing operacional
- Plantillas de procesos de marketing
- Automatizaciones de marketing (n8n, scripts)
- Documentacion de estrategias de marketing

## Estructura

Los respaldos se organizan por tipo y fecha:

```
00_Respaldo_Workflow_MKT/
├── README.md              # Este archivo
├── 01_Workflows_MKT/      # Workflows de marketing operacional
├── 02_Plantillas/         # Plantillas reutilizables
├── 03_Scripts_MKT/        # Scripts de automatizacion
└── 04_Documentacion/      # Docs de estrategia y procesos
```

## Restauracion

Para restaurar un workflow:
1. Copiar el archivo deseado a `00_Core/00_Workflows/`
2. Renombrar con la numeracion correspondiente
3. Documentar en `01_Memory/Notas_de_Proceso.md`
