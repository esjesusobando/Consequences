# 📁 Context Canonical — Laia Learning

Templates de los 3 archivos canónicos de Laia Learning que forman el scaffold de contexto de cada proyecto.

| Archivo                    | Propósito                                                    |
|---------------------------|--------------------------------------------------------------|
| `project-context.md`       | Contrato de reglas — límites operativos y anti-alucinación   |
| `project-operating-data.md`| Matriz de dependencias — estado dinámico del entorno         |
| `project-brief.md`         | Núcleo del SOW — fases, equipo, objetivos, riesgos           |

## Uso

```bash
# Al iniciar un proyecto nuevo
mkdir -p /ruta/del/proyecto/Context/Canonical
cp -r 01_Context_Canonical/* /ruta/del/proyecto/Context/Canonical/
# Poblar cada archivo con los datos reales del proyecto
```

## Regla de Oro

- **project-context.md** se define UNA VEZ al inicio y rara vez cambia
- **project-operating-data.md** puede actualizarse cuando cambian variables del entorno
- **project-brief.md** es el SOW canónico — si cambia el alcance, se actualiza
