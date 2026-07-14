# Consequences Tabs — Plan

> Módulo de organización de pestañas/URLs para **Zero Consequences**.
> Combina lo mejor de **One Tab** (vista lista, ahorro de RAM) y **Tab Extend** (vista dashboard kanban),
> más mejoras, viviendo dentro del tab `tools` de la app.

## 1. Objetivo

Dar al usuario un lugar único para **capturar, organizar, visualizar y reordenar URLs** desde
Zero Consequences, con dos vistas (lista + dashboard) y todas las funcionalidades de referencia,
más mejoras de calidad (E2E-first, IA auto-agrupado, dedup, stale detection, ⌘K, export multi-formato).

## 2. Dónde vive (integración)

- El app ya tiene un tab `tools` renderizado en `src/App.tsx:1030` → `<ToolsView />`.
- El módulo se agrega **dentro de `ToolsView.tsx`** como una nueva sección `ConsequencesTabs`
  (un sub-tab interno o bloque, siguiendo el patrón de las otras vistas del app).
- **No** requiere nueva infra: reusa React 19, Tailwind, Firebase (ya deps), `CommandPalette.tsx`
  (ya existe, para ⌘K), y el sistema de `accent` de diseño.

## 3. Stack reutilizado

| Capa | Existente en Zero Consequences | Uso en Tabs |
| --- | --- | --- |
| UI | React 19 + Tailwind + `accent` prop | componentes sin estilo nuevo |
| Estado | React state / hooks | store local del módulo |
| Persistencia MVP | `localStorage` | cero backend para v0.1 |
| Persistencia v0.3 | Firebase (ya dep) | Firestore para sync cross-device |
| IA | `@google/genai` (ya dep) | auto-agrupado por tema (v2) |
| Paleta | `CommandPalette.tsx` | ⌘K para saltar a sesión/grupo |

## 4. Mecanismo de captura (decisión tomada)

**Pegado de URLs + importar/exportar archivo HTML de marcadores** (formato Netscape estándar,
compatible Chrome/Firefox/Edge). Sin extensión, sin bookmarklet — 100% web, cross-browser.

- **Pegar**: textarea que parsea URLs separadas por salto de línea / espacio / coma.
- **Importar**: parsea el HTML de marcadores (estructura `<DL><DT><A>` + carpetas `<H3>`) y
  preserva la jerarquía de carpetas nativas como "grupos".
- **Exportar**: genera el mismo HTML de marcadores (abre/importa en cualquier navegador).
- _Nota_: una web app no puede "colapsar todas las pestañas abiertas" como la extensión One Tab;
  el usuario trae las URLs (pegado o importación). Esto es una limitación aceptada y documentada.

## 5. Modelo de datos (MVP local-first)

```ts
// se agrega a src/types.ts
type TabItem = {
  id: string;            // nanoid
  url: string;
  title?: string;
  favicon?: string;      // derivado de url (google favicon service)
  note?: string;
  reminder?: string;     // ISO date
  tags: string[];
  order: number;
  locked?: boolean;       // no se borra en limpieza
  starred?: boolean;
};

type TabSession = {       // = un "grupo" / "workspace"
  id: string;
  name: string;
  emoji?: string;
  createdAt: number;
  items: TabItem[];
  isWorkspace?: boolean;  // dashboard vs lista simple
};

type TabsState = {
  sessions: TabSession[];
  bin: TabSession[];      // papelera
  activeView: 'list' | 'dashboard';
};
```

- v0.1: persistir `TabsState` en `localStorage` (clave `consequences-tabs`).
- v0.3: espejar a Firestore (`users/{uid}/tabSessions`) para sync.

## 6. Vista Lista (estilo One Tab)

- Sesiones como listas colapsables; cada ítem = enlace + título + favicon.
- **Restaurar**: abre las URLs de la sesión en nuevas pestañas (`window.open`).
- **Carpetas/grupos**: sesiones agrupadas; renombrar, reordenar (drag).
- **Lock/Star**: fijar sesión/ítem para no perderlo.
- **Buscar**: filtro por título/url/tag (input en header).
- **Export/Import HTML** de marcadores (core).
- **Excluir fijadas**: N/A en web (se omite o se mapea a `locked`).

## 7. Vista Dashboard (estilo Tab Extend)

- **Kanban**: columnas = workspaces/sesiones; tarjetas = TabItems.
- **Drag & drop** para reordenar ítems y mover entre sesiones.
- **Notas / recordatorios** por ítem (popover al hacer hover/clic).
- **Popover** (Ctrl+U style) para previsualizar/edicion rápida.
- **Miniaturas**: usar favicon o servicio de thumbnails (v0.2; para MVP, favicon).
- **Emojis** por sesión/workspace.
- **Papelera** (bin) con restauración.

## 8. Mejoras sobre los originales

1. **E2E-first**: local-first = tus datos no salen del dispositivo hasta que tú habilitas sync.
2. **Auto-backup**: snapshot periódico a JSON descargable.
3. **Preservar grupos nativos**: la importación de marcadores mantiene carpetas como sesiones.
4. **IA auto-agrupado** (`@google/genai`): agrupa URLs sueltas por tema con un prompt.
5. **Dedup**: detecta URLs repetidas al pegar/importar.
6. **Stale detection**: opcional, marca ítems caídos (HEAD 404) — solo con backend (v2).
7. **Tags** por ítem + filtro por tag.
8. **Command palette ⌘K** (reusa `CommandPalette.tsx`): salta a sesión/grupo/ítem.
9. **Multi-browser**: el HTML de marcadores cubre Chrome/Firefox/Edge.
10. **Suspender**: archivar sesión para liberar "RAM mental" sin borrar.
11. **Export Obsidian**: genera markdown de la sesión (v2).
12. **Analytics**: conteo de sesiones/ítems, tabs "ahorradas" (v2).

## 9. Roadmap por fases

| Fase | Alcance | Backend |
| --- | --- | --- |
| **v0.1 MVP** | Vista lista + captura (pegado + import/export HTML) + buscar + lock/star + localStorage | ninguno |
| **v0.2** | Vista dashboard kanban + workspaces + notas/recordatorios + popover + favicons | ninguno |
| **v0.3** | Sync Firebase + share link + bin + carpetas + exclude-locked | `/api/tabs/*` en `server.ts` |
| **v1** | Auto-backup + suspender + grupos nativos + ⌘K palette | local + Firebase |
| **v2** | IA auto-agrupado + dedup + tags + export Obsidian + analytics + stale detection | `/api/tabs/*` |

## 10. Decisiones técnicas

- **Local-first**: v0.1 no toca `server.ts` ni Firebase → entrega rápida y sin riesgo.
- **nanoid** (ya dep) para IDs.
- **Favicon**: `https://www.google.com/s2/favicons?domain=...` (sin backend).
- **Drag & drop**: librería existente en el repo o HTML5 DnD nativo (evaluar en v0.2).
- **Tipos** en `src/types.ts`; componente `ConsequencesTabs.tsx` nuevo; se monta en `ToolsView.tsx`.
- **Tests**: si el repo tiene harness (ver `sdd-init`), aplicar Strict TDD en v0.1.

## 11. Riesgos / abiertos

- **Engram caído**: este plan se guarda como archivo; migrar a SDD/OpenSpec al restaurar memoria.
- **Miniaturas reales** requieren backend o proxy (CORS); v0.2 usa favicon.
- **Stale detection / share link** requieren backend → v0.3/v2.
- **Sync Firebase** necesita auth ya configurada en el app (verificar en v0.3).
- **Drag & drop** en kanban: confirmar lib disponible o usar nativo.

---
_Preflight SDD (sesión): Interactive | Ambos (Engram+OpenSpec) | Pregúntame PRs | 400-line budget._
_Por memoria caída, artefacto entregado como archivo; no como observación Engram._