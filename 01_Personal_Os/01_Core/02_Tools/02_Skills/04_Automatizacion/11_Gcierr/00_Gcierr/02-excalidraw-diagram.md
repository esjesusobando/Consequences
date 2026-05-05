# Demo 02 — Excalidraw Diagram Skill

## Filosofia: ARGUMENTAR, no MOSTRAR

> Un diagrama no es texto con formato. Es un argumento visual.
> La forma DEBE expresar el significado. Si borras todo el texto y la
> estructura ya no comunica nada, el diagrama fallo.

Esta skill genera archivos `.excalidraw` (JSON) que convencen al ojo antes
que a la mente. No dibuja cajas encadenadas. Construye pruebas visuales.

---

## 1. La comparativa brutal: generico vs argumentativo

### Diagrama GENERICO (lo que hace todo el mundo)

```
+---------+      +---------+      +---------+      +---------+
|  User   | ---> |   API   | ---> |   DB    | ---> |  Cache  |
+---------+      +---------+      +---------+      +---------+
```

Problemas:
- Todas las cajas son iguales (no hay jerarquia visual)
- La forma no dice nada (podrian ser legos apilados)
- Sin evidencia tecnica (donde esta el codigo real?)
- Un solo nivel de zoom (no hay detalle ni contexto)
- Si borras el texto: queda un tren de cajas identicas

### Diagrama ARGUMENTATIVO (lo que genera esta skill)

```
                          FLUJO CERO (macro)
    (( origen ))  ~~~~>  [[ sistema ]]  ~~~~>  (( destino ))
         |                    |                     |
         +-- zoom --+         +-- zoom --+          +-- zoom --+
                    v                    v                     v
    +=====================================================================+
| FRONTEND (zona agrupada con fondo tenue) |
|                                          |
| .----.                                   |
|                                          | Form | ---, |
| `----'   \                               |
| >--- abanico ---> [validator]            |
| .----.   /                               |
|                                          | Btn  | ---' |
| `----'                                   |
    +=====================================================================+
                                 |
                                 v  (convergencia / embudo)
                            \         /
                             \       /
                              \     /
                               \   /
                                \ /
                                 V
    +=====================================================================+
| BACKEND                                                         |
|                                                                 |
| +-----------------------+    +--------------------------------+ |
|                                                                 | POST /api/v1/orders  |      | [DARK BOX - evidencia JSON] |  |
|                                                                 |                      | ---> | {                           |  |
|                                                                 | Handler: createOrder |      | "id": "ord_8F2x",           |  |
| +-----------------------+                                       | "status": "pending", |      |
|                                                                 | "total": 42.00       |      |
|                                                                 | }                    |      |
| +--------------------------------+                              |
    +=====================================================================+
                                 |
                                 v
                          (( postgres ))
                           /  |  |  \
                          /   |  |   \        <- arbol (1 -> muchos)
                        idx  log wal  replica
```

Que cambia:
- Tres niveles de zoom simultaneos (macro, zona, detalle)
- Patrones geometricos unicos con significado (abanico para dispersion,
  embudo para convergencia, arbol para jerarquia)
- Cajas oscuras con JSON real dentro (reemplazan a la terminal)
- Si borras el texto: aun se ve que algo converge, algo se ramifica,
  algo contiene algo. La estructura ENSEÑA.

---

## 2. Tres ejemplos de uso

### Ejemplo A — Arquitectura de microservicios con evidencia JSON

Prompt al modelo con la skill:

> "Diagrama la arquitectura de nuestra API de pagos: auth-service,
> payments-service, webhook-service y una cola en medio. Incluye un
> evento real de Stripe como evidencia."

Salida visual esperada (ASCII):

```
   +-------------------------- ZONA PUBLICA --------------------------+
   |                                                                 |
   |    (( cliente ))                                                |
   |        |                                                        |
   |        | HTTPS                                                  |
   |        v                                                        |
   |   [ API Gateway / nginx ]                                       |
   +----------|------------------------------------------------------+
              |
              v
   +========= ZONA PRIVADA (VPC) =====================================+
|                                                    |
| [auth-svc]     [payments-svc]        [webhook-svc] |
|                                                    |                                   | ^                         |
|                                                    | v                                 |                           |
|                                                    | (( Redis Stream ))-----------+    |
|                                                    |                                   |                           |
|                                                    | v                                 |
|                                                    | +--- DARK EVIDENCE BOX ---------+ |
|                                                    |                                   | event: "charge.succeeded" |  |
|                                                    |                                   | {                         |  |
|                                                    |                                   | "id": "evt_1Nq...",       |  |
|                                                    |                                   | "amount": 2000,           |  |
|                                                    |                                   | "currency": "usd",        |  |
|                                                    |                                   | "livemode": true          |  |
|                                                    |                                   | }                         |  |
|                                                    | +-------------------------------+ |
| v                                                  |
| (( postgres ))                                     |
   +=================================================================+
```

Elementos clave que la skill inyecta:
- Grupos envolventes (`groupIds`) para ZONA PUBLICA y ZONA PRIVADA
- Rectangulo con `backgroundColor: "#1e1e1e"` y `strokeColor: "#ffffff"`
  para el JSON (caja oscura tipo terminal)
- Flechas con `roughness: 0` (profesional, no brainstorm)
- Elipse grande para `postgres` (nodo terminal, foco claro)

### Ejemplo B — Flujo de datos con patron CONVERGENCIA (embudo)

Caso: ingesta de logs desde multiples fuentes hacia un warehouse.

```
  [mobile-ios]   [mobile-android]   [web-spa]   [cron-jobs]   [ext-api]
        \              |               |             |           /
         \             |               |             |          /
          \            |               |             |         /
           \           v               v             v        /
            \        [ kafka: raw-events-topic ]            /
             \____________________|______________________/

                            (embudo)
                                 |
                                 v
                         [ schema-validator ]
                                 |
                                 v
                         [ enrichment-lambda ]
                                 |
                                 v
                        +--------|--------+
                        | DARK BOX        |
                        | sample row:     |
                        | { "ts": ...,    |
                        |   "ua": ...,    |
                        |   "country":    |
                        |     "AR" }      |
                        +--------|--------+
                                 |
                                 v
                          (( BigQuery ))
                               |||
                        _______|_______         <- abanico de salida
                       /       |       \
                      v        v        v
                  [Looker]  [Metabase] [Notebook]
```

El patron argumenta: 5 fuentes -> 1 cuello -> 3 consumidores. La forma
misma es la narrativa (embudo invertido).

### Ejemplo C — Arbol de decision tecnica

Caso: "que base de datos uso?"

```
                          (( NECESITO PERSISTIR DATOS ))
                                     |
                          ___________|___________
                         /                       \
                       SI                         NO
                       /                           \
                 schema fijo?                  [ Redis ]
                 /         \
               SI           NO
               /             \
           relacional?     [ MongoDB ]
           /       \
          SI       NO
          /          \
   reads >> writes?   [ DynamoDB ]
     /        \
    SI         NO
    /           \
[Postgres +    [Postgres]
 replicas]      
  |
  +---- DARK EVIDENCE BOX ----+
  | docker-compose.yml         |
  | services:                  |
  |   db:                      |
  |     image: postgres:16     |
  |   replica:                 |
  |     image: postgres:16     |
  |     command: -c            |
  |       hot_standby=on       |
  +----------------------------+
```

El arbol no es decoracion. Es el argumento: cada nodo es una pregunta
binaria, cada hoja es una decision justificable, y la hoja elegida trae
su evidencia operativa (el compose real).

---

## 3. Snippet del JSON real que genera la skill

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    {
      "id": "zone-backend",
      "type": "rectangle",
      "x": 100, "y": 400,
      "width": 720, "height": 340,
      "strokeColor": "#1971c2",
      "backgroundColor": "#e7f5ff",
      "fillStyle": "solid",
      "strokeWidth": 2,
      "roughness": 0,
      "opacity": 100,
      "groupIds": ["backend-zone"]
    },
    {
      "id": "evidence-json",
      "type": "rectangle",
      "x": 480, "y": 520,
      "width": 300, "height": 160,
      "strokeColor": "#ffffff",
      "backgroundColor": "#1e1e1e",
      "fillStyle": "solid",
      "strokeWidth": 1,
      "roughness": 0
    },
    {
      "id": "evidence-text",
      "type": "text",
      "x": 496, "y": 536,
      "text": "POST /orders\n{\n  \"id\": \"ord_8F2x\",\n  \"status\": \"pending\"\n}",
      "fontSize": 14,
      "fontFamily": 3,
      "strokeColor": "#51cf66",
      "containerId": "evidence-json"
    },
    {
      "id": "arrow-converge-1",
      "type": "arrow",
      "x": 200, "y": 380,
      "points": [[0, 0], [240, 40]],
      "strokeColor": "#495057",
      "strokeWidth": 1,
      "roughness": 0,
      "endArrowhead": "triangle"
    }
  ],
  "appState": { "viewBackgroundColor": "#ffffff" },
  "files": {}
}
```

Notar:
- `roughness: 0` todo (profesional, no brainstorm)
- caja oscura `#1e1e1e` con texto verde monoespacio (estetica terminal)
- `groupIds` agrupa logicamente sin necesidad de dibujarlo con lineas
- flecha de convergencia con coordenadas relativas via `points`

---

## 4. Las 4 pruebas que un diagrama DEBE pasar

| #                 | Prueba                     | Pregunta                                                                                   | Falla tipica                                            |
|-------------------|----------------------------|--------------------------------------------------------------------------------------------|---------------------------------------------------------|
| 1                 | Isomorfa                   | Si borro TODO el texto, se sigue entendiendo la estructura mental?                         | Fila de cajas identicas                                 |
| 2                 | Ensenanza                  | Alguien puede APRENDER algo concreto leyendo las partes, o solo hay rotulos?               | Cajas con la palabra "API" y nada adentro               |
| 3                 | Patron unico               | Hay una unica geometria dominante (abanico O embudo O arbol O nubes)?                      | Mezcla desordenada de formas                            |
| 4                 | Multi-zoom                 | Hay al menos 3 niveles (macro flujo / zonas / detalle con evidencia)?                      | Todo al mismo nivel de abstraccion                      |

Si un diagrama falla cualquiera, la skill lo re-disena antes de guardar.

Ademas: renderizado obligatorio con Playwright para auditar colisiones de
texto/cajas, luego reescritura de coordenadas. El ciclo termina cuando la
imagen PNG pasa revision humana, no cuando el JSON esta sintacticamente
valido.

---

## 5. Caso estrella — Onboarding tecnico que reemplazo 20 paginas

**Contexto**: equipo de 12 devs, nuevo joiner cada mes, documento interno
"arquitectura-v3.md" de 20 paginas que nadie lee. Tiempo promedio de
ramp-up: 3 semanas.

**Intervencion**: un solo archivo `onboarding.excalidraw` con 4 niveles
de zoom:

1. **Flujo Cero** arriba-izquierda (5 cajas): request -> gateway ->
   service -> db -> response. Se aprende en 10 segundos.
2. **Zonas agrupadas** (medio): Frontend, BFF, Core Services, Data.
   Cada zona con color propio y borde envolvente.
3. **Evidencia por servicio** (zoom maximo): cada microservicio tiene
   adjunta una caja oscura con:
   - endpoint real (`POST /v2/orders`)
   - payload JSON de ejemplo
   - snippet del handler (5 lineas)
   - nombre del dueno (@fulano)
4. **Nubes** al margen para "cosas inestables" (caches, colas
   efimeras, feature flags) — la forma irregular comunica "esto no es
   fuente de verdad".

**Resultado medido**:

- Ramp-up bajo de 3 semanas a 4 dias.
- Preguntas en #ask-eng bajaron 62%.
- El diagrama se abre en Excalidraw y se edita colaborativamente en
  retros — la documentacion VIVE.
- Onboarding pasa de "lee esto" a "abre el canvas y navega con zoom".

La clave no fue reducir informacion. Fue ESTRUCTURARLA geometricamente
de manera que el ojo encontrara las relaciones sin tener que inferirlas
de parrafos.

---

## 6. Como invocar la skill

Prompt minimo efectivo:

> "Usa excalidraw-diagram para modelar X. Aplica multi-zoom, usa patron
> [abanico / embudo / arbol / nubes] como geometria dominante, e incluye
> al menos 2 cajas oscuras con evidencia JSON o de codigo real. Guardalo
> en /ruta/salida.excalidraw y renderiza PNG para auditoria."

La skill siempre:
1. Mapea la necesidad antes del JSON.
2. Elige UN patron dominante.
3. Secciona el output si es grande (no vomita 2000 lineas en una pasada).
4. Renderiza con `render_excalidraw.py` y revisa colisiones.
5. Itera coordenadas hasta que el PNG este limpio.

---

## 7. Markdown para video (guion corto, 60 segundos)

**[0:00–0:05]** Pantalla dividida. Izquierda: diagrama generico de 4
cajas grises con flechas. Derecha: vacio.
Voz en off: "Todos hacen esto. Cajas, flechas, cajas. No explica nada."

**[0:05–0:15]** La derecha empieza a construirse: primero el flujo cero
(3 elipses grandes), luego se dibujan zonas envolventes con color, luego
aparecen cajas oscuras con JSON verde monoespacio.
Voz: "Un diagrama bueno argumenta. Tiene forma que significa algo,
evidencia real adentro, y tres niveles de zoom."

**[0:15–0:30]** Zoom-in sobre una caja oscura mostrando
`{ "id": "ord_8F2x", "status": "pending" }`. Luego zoom-out para ver el
patron de embudo completo: 5 fuentes -> cuello -> 3 salidas.
Voz: "La geometria es el mensaje. Embudo dice 'convergencia'. Arbol
dice 'decision'. Abanico dice 'dispersion'."

**[0:30–0:45]** Corte al caso real: 20 paginas de markdown se encogen y
se convierten en un canvas Excalidraw. Timer: "3 semanas -> 4 dias".
Voz: "Un equipo reemplazo 20 paginas de docs con un diagrama. Ramp-up
bajo 85%."

**[0:45–0:60]** Comando en terminal:
`render_excalidraw.py onboarding.excalidraw` y aparece el PNG.
Voz: "La skill renderiza, audita colisiones, re-acomoda y entrega.
Argumenta visualmente. No muestra, convence."

Texto final en pantalla: **"Forma expresa significado."**

---

## Cierre

La diferencia entre un diagrama util y uno decorativo no es el estilo.
Es si la estructura geometrica carga el argumento por si sola. Esta
skill existe para garantizar que todo `.excalidraw` que produzca pase
las 4 pruebas antes de salvarse.
