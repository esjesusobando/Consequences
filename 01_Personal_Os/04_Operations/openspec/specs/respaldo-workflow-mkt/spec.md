# Respaldo Workflow MKT — Especificación

## Propósito

Directorio de respaldo para workflows de marketing. Alberga versiones anteriores, experimentos descartados y plantillas legacy de flujos de marketing que ya no están activos pero se conservan como referencia.

## Requirements

### R1: Creación del directorio

El sistema DEBE crear `01_Personal_Os/00_Core/00_Workflows/00_Respaldo_Workflow_MKT/` en la raíz del Personal OS.

#### Scenario: Happy path — directorio creado correctamente

- GIVEN el directorio raíz `01_Personal_Os/00_Core/00_Workflows/`
- WHEN se ejecuta la creación de `00_Respaldo_Workflow_MKT/`
- THEN el directorio existe y es accesible
- AND no interfiere con otros workflows existentes

#### Scenario: Edge case — directorio ya existe

- GIVEN el directorio `00_Respaldo_Workflow_MKT/` ya fue creado previamente
- WHEN se intenta crear de nuevo
- THEN el sistema NO debe sobrescribir ni eliminar contenido existente

### R2: README documentando el propósito

El directorio DEBE contener un archivo `README.md`.

#### Scenario: Contenido mínimo del README

- GIVEN el directorio `00_Respaldo_Workflow_MKT/` existe
- WHEN se lee `README.md`
- THEN debe indicar que es un directorio de respaldo para workflows de marketing
- AND debe explicar que no contiene skills activas
- AND debe listar las subcarpetas de respaldo si existen

### R3: Aislamiento del sistema activo

El directorio NO DEBE contener skills, scripts o configuraciones operativas activas.

#### Scenario: Validación post-creación

- GIVEN el directorio de respaldo
- WHEN se inspecciona su contenido
- THEN solo debe contener respaldos, versiones legacy o plantillas
- AND ningún archivo dentro del directorio debe estar referenciado por `config_paths.py`, hooks, reglas o manifiestos activos
