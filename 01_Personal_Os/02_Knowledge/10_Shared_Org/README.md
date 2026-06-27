# 🌕 Shared Org — Capital Token Layer

> *Parte del Capital Token: conocimiento organizacional LLM-agnóstico.*
> *Creado: 2026-06-27 | v1.0*

---

## ¿Qué es esto?

La capa compartida del **Capital Token (Opción C — Híbrido)**. 
Acá vive el conocimiento organizacional que trasciende al individuo:

- **Playbooks**: procesos repetitivos documentados paso a paso
- **Decisiones**: ADRs y fundamentos de por qué se hacen las cosas como se hacen
- **Procesos**: SOPs para operaciones del día a día
- **Agentes**: Templates de agentes por rol (Admin, Finanzas, RH, etc.)
- **Métricas**: Tracking del Capital Token (cobertura, uso, gaps)
- **Contexto**: Archivos de contexto compartido para workspaces de equipo

---

## Estructura

```
10_Shared_Org/
├── README.md                 # Este archivo
├── capital-token-bridge.py   # MCP Bridge — consulta el shared org desde CLI/IA
├── playbooks/                # Procesos repetitivos documentados
├── decisions/                # ADRs — Architectural Decision Records
├── processes/                # SOPs — Standard Operating Procedures
├── agents/                   # Templates de agentes por rol + configs reales
├── metrics/                  # Tracking del Capital Token
└── context/                  # Contexto compartido para equipos
```

---

## 🟢 Relacion con Auto-Improvement

> `Capital Token` + `Auto-Improvement` = Conocimiento que se acumula + Infraestructura saludable

| Sistema                | Rol           | Que hace                                  | Donde vive                           |
| ---------------------- | ------------- | ----------------------------------------- | ------------------------------------ |
| 🌕 **Capital Token**    | Biblioteca    | Documenta procesos, decisiones, playbooks | `02_Knowledge/10_Shared_Org/`        |
| 🔄 **Auto-Improvement** | Mantenimiento | Barre, ordena, arregla codigo roto        | `04_Operations/01_Auto_Improvement/` |

**Capital Token sin Auto-Improvement:** los procesos se documentan pero la infraestructura se degrada.
**Auto-Improvement sin Capital Token:** el codigo se mantiene limpio pero el conocimiento se pierde.
**Juntos:** el sistema no solo funciona — MEJORA con cada uso.

> ✅ Auto-Improvement activo desde 28 MAY 2026 — corre cada 8h via Windows Task Scheduler

---

## Principios

1. **LLM-Agnostic**: Todo en markdown + YAML. Funciona con Claude, GPT, Gemini o cualquier modelo futuro.
2. **Where Work Happens**: El conocimiento debe estar disponible donde se trabaja (Slack, Notion, WhatsApp).
3. **Compound Learning**: Cada proyecto se apoya en el anterior. El sistema sabe más con el tiempo.
4. **Human + Token**: Capital humano y capital token se potencian mutuamente.
5. **Taste > Tools**: El verdadero motor es el taste y el juicio — no el modelo.

---

## Cómo Contribuir

1. Elegí un template de la carpeta correspondiente
2. Completalo con el conocimiento específico
3. Asegurate de que sea LLM-agnóstico (solo markdown + YAML)
4. Commit con mensaje `docs(shared-org): descripción`

---

## Métricas de Salud

| Métrica                | Target | Actual |
| ---------------------- | ------ | ------ |
| Playbooks documentados | 20+    | 2      |
| Decisiones registradas | 10+    | 2      |
| Procesos documentados  | 5+     | 2      |
| Agentes template       | 3+     | 3      |
| Agentes configurados   | 3+     | 1      |
| Shared Context files   | 5+     | 1      |
| Bridge funcional       | v1.0   | v0.1   |

---

## CLI: Capital Token Bridge

El `capital-token-bridge.py` permite consultar el Shared Org desde la terminal o desde un agente. Funciona en 4 modos:

### 1. Indice
```bash
python capital-token-bridge.py --index
```
Muestra un JSON con todos los archivos del Shared Org organizados por categoria (playbooks, decisions, processes, agents, context, metrics).

### 2. Busqueda
```bash
python capital-token-bridge.py --query "texto a buscar"
```
Busca en todos los archivos del Shared Org y devuelve resultados con preview del contexto. Busca case-insensitive en el contenido completo de los archivos.

### 3. Sincronizacion con Engram
```bash
python capital-token-bridge.py --sync
```
Sincroniza el indice del Shared Org con Engram Memory. (Modo stub actual — la integracion real requiere conexion MCP con Engram.)

### 4. Modo Interactivo
```bash
python capital-token-bridge.py
```
Sin argumentos, arranca una consola interactiva con estos comandos:

| Comando          | Descripcion                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| `/index`         | Mostrar indice del Shared Org                                               |
| `/query <texto>` | Buscar en shared context                                                    |
| `/get <path>`    | Leer archivo completo (ej: `/get playbooks/01-onboarding-nuevo-cliente.md`) |
| `/help`          | Mostrar ayuda                                                               |
| `/exit`          | Salir                                                                       |

### Integracion con Agentes

Los agentes pueden usar el bridge en modo JSON-RPC via `--serve` para consultar el Shared Org:
```json
{"action": "index"}
{"action": "query", "query": "onboarding"}
{"action": "get", "path": "playbooks/01-onboarding-nuevo-cliente.md"}
```

### Requisitos

- Python 3.x (sin dependencias externas — solo usa la stdlib)
- Ejecutar desde el directorio `10_Shared_Org/` o desde cualquier subdirectorio del proyecto

---

## 🔄 Sistemas Hermanos

Este sistema se complementa con el **Auto-Improvement** (`01_Personal_Os/04_Operations/01_Auto_Improvement/`):

```
🌕 Capital Token  (captura el valor ORGANIZACIONAL)
         │
         ▼  Playbooks, ADRs, procesos, agent templates
         │
🔄 Auto-Improvement (mantiene la INFRAESTRUCTURA saludable)
         │
         ▼  Código limpio, estructura ordenada, naming consistente
```

| Sistema            | Rol                                    | Scope                                      | Frecuencia         |
| ------------------ | -------------------------------------- | ------------------------------------------ | ------------------ |
| 🌕 Capital Token    | Captura de conocimiento organizacional | Procesos, ADRs, playbooks, agent templates | Manual (on-demand) |
| 🔄 Auto-Improvement | Mantenimiento técnico recursivo        | Código, estructura, naming, docs           | Automático cada 8h |

**Capital Token** documenta lo que sabes hacer. **Auto-Improvement** mantiene el sistema funcionando para que puedas hacerlo. Ambos se necesitan: sin Capital Token el conocimiento se pierde, sin Auto-Improvement el código se degrada.

---

*Actualizado: 2026-06-27 — Fase 1 Foundation + Cross-ref Auto-Improvement*