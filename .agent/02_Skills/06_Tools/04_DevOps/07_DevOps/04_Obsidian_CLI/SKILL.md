---
name: obsidian-cli
description: Interactuar con bóvedas de Obsidian mediante la Obsidian CLI para leer, crear, buscar y gestionar notas, daily notes, tareas, propiedades, etiquetas y backlinks desde la terminal. Usar esta skill siempre que el usuario pida operar sobre su vault de Obsidian - leer una nota, añadir contenido, capturar algo en la daily note, buscar texto en el vault, listar o actualizar tareas, modificar propiedades del frontmatter, consultar backlinks, etiquetas o aliases - incluso si no menciona explícitamente "CLI" o "Obsidian CLI". También aplica cuando el usuario diga "agrega esto a mi vault", "anota en Obsidian", "qué tengo sobre X en mis notas", o similares.
---

# Obsidian CLI

Usar el comando `obsidian` para interactuar con una instancia de Obsidian en ejecución desde la terminal. Requiere Obsidian ≥ 1.12.7 abierto y la opción **Command line interface** activada.

Cuando exista duda sobre qué comando usar, ejecutar `obsidian --help` para consultar documentación. Mantener siempre al día. Documentación completa: https://help.obsidian.md/Plugins/Command+line+interface

## Sintaxis

**Parámetros** llevan valor con `=`. Entrecomillar valores con espacios.

```bash
obsidian create name="Mi nota" content="Hola mundo"
```

## Comandos Disponibles

### 1. create — Crear nota nueva

```bash
obsidian create name="Nombre de la nota" vault="Mi Vault" folder="Carpeta/Subcarpeta" content="Contenido de la nota"
```

**Parámetros:**

| Parámetro  | Requerido  | Descripción                                                         |
|-----------|-----------|--------------------------------------------------------------------|
| `name`     | Sí         | Nombre del archivo (sin extensión .md)                              |
| `vault`    | No         | Nombre del vault. Si se omite, usa el vault por defecto             |
| `folder`   | No         | Carpeta destino (crea submdirectorios si no existen)                |
| `content`  | No         | Contenido markdown de la nota                                       |
| `format`   | No         | Formato de fecha: `YYYY-MM-DD` (defecto), `DD-MM-YYYY`, `MM-DD-YYYY`|

**Ejemplos:**

```bash
# Nota simple en la raíz del vault
obsidian create name="Mi primera nota"

# Nota en subcarpeta con contenido
obsidian create name="Proyectos/Alpha" vault="Trabajo" content="# Alpha\n\nProyecto prioritario"

# Nota con fecha en nombre
obsidian create name="Daily/2026-05-22" format="YYYY-MM-DD"
```

### 2. list — Listar notas

```bash
obsidian list vault="Mi Vault" folder="Carpeta" format="sort"
```

**Parámetros:**

| Parámetro  | Requerido  | Descripción                                                     |
|-----------|-----------|----------------------------------------------------------------|
| `vault`    | No         | Filtrar por vault                                               |
| `folder`   | No         | Filtrar por carpeta ("" = raíz)                                 |
| `format`   | No         | `sort` para ordenar por fecha, `tree` para estructura jerárquica|

**Ejemplos:**

```bash
# Todas las notas del vault
obsidian list

# Notas en carpeta específica
obsidian list folder="Proyectos"

# Estructura de carpetas
obsidian list folder="" format="tree"
```

### 3. search — Buscar en notas

```bash
obsidian search query="texto a buscar" vault="Mi Vault" exact=true
```

**Parámetros:**

| Parámetro  | Requerido  | Descripción                                              |
|-----------|-----------|---------------------------------------------------------|
| `query`    | Sí         | Texto a buscar                                           |
| `vault`    | No         | Vault donde buscar                                       |
| `exact`    | No         | `true` para búsqueda exacta, `false` para fuzzy (defecto)|

**Ejemplos:**

```bash
# Búsqueda simple
obsidian search query="proyecto alpha"

# Búsqueda exacta
obsidian search query="TODO" exact=true
```

### 4. grep — Buscar en contenido

```bash
obsidian grep query="patrón" vault="Mi Vault" path="Carpeta"
```

**Parámetros:**

| Parámetro  | Requerido  | Descripción                    |
|-----------|-----------|-------------------------------|
| `query`    | Sí         | Patrón regex a buscar          |
| `vault`    | No         | Vault donde buscar             |
| `path`     | No         | Carpeta específica donde buscar|

**Ejemplos:**

```bash
# Buscar patrón en todo el vault
obsidian grep query="function\s+\w+"

# Buscar en subcarpeta
obsidian grep query="TODO" path="Proyectos/Alpha"
```

### 5. task list — Listar tareas

```bash
obsidian task list vault="Mi Vault" status=any folder="Carpeta"
```

**Parámetros:**

| Parámetro  | Requerido  | Descripción                                                         |
|-----------|-----------|--------------------------------------------------------------------|
| `vault`    | No         | Vault donde buscar                                                  |
| `status`   | No         | `any` (todas), `done` (completadas), `not` (no completadas, defecto)|
| `folder`   | No         | Carpeta específica                                                  |

**Ejemplos:**

```bash
# Todas las tareas
obsidian task list

# Solo pendientes
obsidian task list status=not

# Tareas en carpeta
obsidian task list folder="Proyectos"
```

### 6. open — Abrir nota en Obsidian

```bash
obsidian open name="Nombre de nota" vault="Mi Vault" focus=true
```

**Parámetros:**

| Parámetro  | Requerido  | Descripción                                   |
|-----------|-----------|----------------------------------------------|
| `name`     | Sí         | Nombre de la nota                             |
| `vault`    | No         | Vault de la nota                              |
| `focus`    | No         | `true` para enfocar ventana, `false` (defecto)|

**Ejemplos:**

```bash
# Abrir nota
obsidian open name="2026-05-22"

# Abrir y enfocar
obsidian open name="Proyectos/Alpha" focus=true
```

---

## Notas de Uso

1. **Vault por defecto**: Si no se especifica `vault`, usa el vault configurado como predeterminado en Obsidian.
2. **Rutas**: Las rutas de carpeta pueden usar `/` como separador en todos los sistemas.
3. **Carpetas automáticas**: Si la carpeta no existe, la crea automáticamente.
4. **Extensión .md**: No incluir la extensión en el `name`; Obsidian la añade automáticamente.
5. **Obsidian debe estar abierto**: La CLI requiere que Obsidian esté en ejecución con la opción Command line interface habilitada en Settings > Options > Command line interface.
