# Guia de Inicio Rapido — Think Different PersonalOS

**Tiempo de lectura:** 5 minutos
**Version:** Sprint 4 — UX & Onboarding

---

## Bienvenido a PersonalOS

PersonalOS es tu sistema operativo personal para productividad con IA.
No es una app mas — es un **framework** que coordina agentes, herramientas,
workflows y memoria para que vos trabajes mas y pierdas menos tiempo.

Este guia te lleva de cero a productivo en 5 pasos.

---

## Paso 1: Entende la Estructura

```
Think_Different/
├── 00_Winter_is_Coming/     ← Matrix core (Backlog, reglas)
├── 01_Personal_Os/
│   ├── 00_Core/             ← Workflows, reglas, tools
│   ├── 01_Memory/           ← Contexto LLM, memoria persistente
│   ├── 02_Knowledge/        ← Research, docs, recursos
│   ├── 03_Learning/         ← Telemetria, auto-mejora
│   ├── 04_Tasks/            ← Tareas y templates
│   ├── 05_Scripts/          ← HUBs y scripts (aqui manda todo)
│   └── 06_Projects/         ← Proyectos activos
├── 02_Playground/           ← Experimentos
└── 03_Resultado/            ← Output final
```

**Regla de oro:** Todo vive en `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/`.
Ese directorio es tu centro de comando.

---

## Paso 2: Los 3 Comandos que Necesitas

### 1. `ritual_matutino` — Tu ritual de la manana

```bash
python 04_Ritual_Hub.py standup
```

Ejecuta el Morning Standup: revisa backlog, prioridades del dia,
y contexto pendiente. Es lo primero que deberias correr cada manana.

**Alternativa simplificada (si recien empiezas):**

```bash
python 04_Ritual_Hub.py --simple
```

Muestra solo los 3 comandos esenciales y la tarea prioritaria del dia.

### 2. `skill_discovery` — Encontra lo que necesitas

```bash
python skill_discovery.py "quiero crear contenido para linkedin"
```

Escribi lo que queres hacer en lenguaje natural. El sistema te recomienda
el skill, workflow o agente correcto con un score de confianza.

**Modo interactivo:**

```bash
python skill_discovery.py --interactive
```

### 3. `content_pipeline` — Genera contenido de punta a punta

```bash
python content_pipeline.py run --topic "AI trends" --platform linkedin,twitter,blog
```

Pipeline completo: Draft → Review → Publish → Analytics → Compound.
Un solo comando para todo el ciclo de vida del contenido.

---

## Paso 3: Como Encontrar lo que Necesitas

No sabes que herramienta usar? Tenes tres opciones:

### Opcion A: Preguntale al sistema

```bash
python no_se_por_donde_empezar.py --question "quiero hacer un post de linkedin"
```

El sistema analiza tu pregunta y te dice que skill usar, que agente
contratar, o que workflow ejecutar.

### Opcion B: Modo interactivo

```bash
python no_se_por_donde_empezar.py --interactive
```

Conversa con el sistema para encontrar exactamente lo que necesitas.

### Opcion C: Consulta el indice

```bash
cat 05_Scripts/00_HUBs/03_Scripts_Os/HUB_CATALOG.md
```

Catalogo completo de todos los HUBs disponibles.

---

## Paso 4: Los HUBs Principales

Un **HUB** es un orquestador que agrupa multiples scripts relacionados.

| HUB | Que hace | Comando |
|-----|----------|---------|
| **Ritual Hub** | Rituales diarios, standup, cierre | `python 04_Ritual_Hub.py` |
| **Auditor Hub** | Auditorias del sistema | `python 01_Auditor_Hub.py` |
| **Git Hub** | Gestion de git y commits | `python 02_Git_Hub.py` |
| **Validator Hub** | Validacion de skills y rules | `python 05_Validator_Hub.py` |
| **Tool Hub** | Herramientas auxiliares | `python 06_Tool_Hub.py` |
| **Content Pipeline** | Generacion de contenido | `python content_pipeline.py` |
| **Skill Discovery** | Busqueda de skills | `python skill_discovery.py` |
| **System Health** | Salud del sistema | `python 28_System_Health_Monitor.py` |

**Tip:** Si no sabes que HUB usar, ejecuta `no_se_por_donde_empezar.py`.

---

## Paso 5: Donde Pedir Ayuda

### Documentacion del sistema

- `00_Core/00_Comandos_Workflows.md` — Lista completa de comandos
- `00_Core/01_Inventario_Core.md` — Inventario de todo el sistema
- `05_Scripts/00_HUBs/03_Scripts_Os/SCRIPTS_INDEX.md` — Indice de scripts
- `05_Scripts/00_HUBs/03_Scripts_Os/HUB_CATALOG.md` — Catalogo de HUBs
- `01_Personal_Os/00_Core/00_Workflows/01_Personal_Os/` — Workflow docs

### Chequeo de salud del sistema

```bash
python 28_System_Health_Monitor.py
```

Verifica que todo este conectado y funcionando.

### Validacion de paths

```bash
python config_paths.py --validate
```

Confirma que todas las rutas del sistema existen.

### Onboarding checklist

```bash
python onboarding_checklist.py --start
```

Wizard paso a paso para verificar que todo este configurado.

---

## Comandos Rapidos de Referencia

```bash
# Iniciar el dia
python 04_Ritual_Hub.py --simple

# Buscar un skill
python skill_discovery.py "lo que queres hacer"

# Generar contenido
python content_pipeline.py run --topic "tema" --platform linkedin

# Ver estado del sistema
python 28_System_Health_Monitor.py

# Ver rutas configuradas
python config_paths.py

# Validar todo
python config_paths.py --validate

# Onboarding
python onboarding_checklist.py --start
python onboarding_checklist.py --status
```

---

## Tips Importantes

1. **Empeza con `--simple`** — Si recien llegas, usa `04_Ritual_Hub.py --simple`
   para ver solo lo esencial sin abrumarte.

2. **Usa `skill_discovery.py`** — No intentes memorizar todos los skills.
   Escribi lo que necesitas y deja que el sistema te encuentre la respuesta.

3. **El `.cache/` es tu amigo** — Los resultados se cachean para que no
   tenés que recalcular todo cada vez.

4. **Lee `AGENTS.md`** — El archivo `AGENTS.md` en la raiz tiene reglas
   importantes para trabajar con agentes de IA.

5. **No edites `config_paths.py`** — Si necesitas una ruta nueva,
   consultame primero. Las rutas estan centralizadas por una razon.

---

## Siguiente Paso

Despues de leer esto, corre:

```bash
python onboarding_checklist.py --start
```

Te guia por cada paso de verificacion para asegurar que tu entorno
este listo para usar.

---

*Generado por Think Different PersonalOS v5.0 — Sprint 4: UX & Onboarding*
