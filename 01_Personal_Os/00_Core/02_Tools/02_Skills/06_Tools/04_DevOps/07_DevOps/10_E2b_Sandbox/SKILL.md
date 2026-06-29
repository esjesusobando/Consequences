---
name: e2b-sandbox
description: QUÉ HACE: Orquesta ejecución de código y despliegue de apps web en la nube (E2B Sandbox). CUÁNDO SE EJECUTA: Al probar servidores web, construir prototipos visitables o ejecutar tareas fuera de la máquina local. Triggers on: devops, deployment, infrastructure.
sota_upgraded: true
---

# E2B Sandbox Orchestrator

## Esencia Original
> **Propósito:** Ejecutar código AI de forma segura en sandbox E2B — testing, prototyping, deployment
> **Flujo:** Iniciar sandbox → Ejecutar código → Obtener URL pública → Cleanup recursos


Esta skill permite ejecutar código, construir aplicaciones web y probar despliegues en un entorno de sandbox seguro y efímero utilizando E2B.

## Capacidades

- **Init**: Inicializa una nueva sesión de sandbox.
- **Plan**: Genera un plan estructurado para la construcción de la app.
- **Build**: Ejecuta la construcción del proyecto dentro del sandbox.
- **Host**: Despliega la aplicación y devuelve una URL pública.
- **Test**: Ejecuta pruebas de integración contra la app desplegada.
- **Cleanup**: Cierra la sesión y libera recursos.

## Cuándo usarlo

- Cuando necesites probar código que requiere un puerto abierto (ej. servidores web).
- Para construir prototipos funcionales rápidos que el usuario pueda visitar.
- Para ejecución de scripts pesados fuera de la máquina local.

## Instrucciones

### Paso 1: Inicialización

Genera un ID único para el proyecto y ejecuta el inicio:

```bash
python 02_Core/skills/e2b_script.py init <project-id>
```

### Paso 2: Planificación y Construcción

Describe lo que quieres construir:

```bash
python 02_Core/skills/e2b_script.py plan <project-id> --user-prompt "<descripcion>"
python 02_Core/skills/e2b_script.py build <project-id>
```

### Paso 3: Despliegue y URL

```bash
python 02_Core/skills/e2b_script.py host <project-id>
```

El script devolverá una URL tipo `https://sbx-xyz.e2b.dev`. **Entrégasela al usuario.**

### Paso 4: Finalización

Recuerda siempre limpiar el sandbox para ahorrar recursos:

```bash
python 02_Core/skills/e2b_script.py cleanup <project-id>
```

## Requisitos

- API Key de E2B configurada en las variables de entorno.
- Acceso a internet para comunicación con el sandbox.


## ⚠️ Gotchas

- **[ERROR]**: Error común
  - **Solución**: Cómo evitar

## 💾 State Persistence
Guardar en:
- `05_Scripts/` — Estado activo


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
