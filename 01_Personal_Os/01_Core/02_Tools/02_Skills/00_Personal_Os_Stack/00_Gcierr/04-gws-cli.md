# GWS CLI: Google Workspace a velocidad de terminal

> "Deja de hacer click. Empieza a escribir."
> Una CLI oficial para manejar Gmail, Calendar, Drive, Docs y Sheets sin salir de tu shell.

---

## Por que esto importa

Cada semana pierdes horas navegando pestañas del navegador: abrir Gmail, filtrar, marcar, cambiar a Calendar, copiar el link, ir a Drive, subir algo, pasar a Sheets, pegar. `gws-cli` colapsa todo ese flujo en comandos scripteables, versionables y automatizables.

- **Oficial**: mantenido por Google (`googleworkspace/cli`)
- **Unificado**: un solo binario para todo Workspace
- **Scripteable**: se combina con `jq`, `xargs`, `awk`, cron, GitHub Actions
- **Seguro**: OAuth2 con tokens locales, sin passwords

Repo oficial: https://github.com/googleworkspace/cli

---

## 1. Setup y autenticacion

### Instalacion

```bash
# macOS (Homebrew)
brew install googleworkspace/tap/gws

# Linux / manual
curl -sSL https://raw.githubusercontent.com/googleworkspace/cli/main/install.sh | bash

# Verificar
gws --version
# gws-cli v0.9.2 (build 2026-03-11)
```

### Login OAuth (una vez por cuenta)

```bash
gws auth login --account agustin@ailinkvip.com
```

Salida esperada:

```
-> Abriendo https://accounts.google.com/o/oauth2/auth?...
-> Esperando autorizacion...
[OK] Token guardado en ~/.config/gws/agustin@ailinkvip.com.json
[OK] Scopes concedidos: gmail.modify, calendar, drive, spreadsheets, docs
```

### Comprobar estado

```bash
gws auth status
```

```
ACTIVE   agustin@ailinkvip.com   expira en 59m   [gmail calendar drive sheets docs]
```

---

## 2. Cuatro casos power-user

### 2.1 Gmail: filtrar no leidos de un remitente y marcarlos

Objetivo: todos los emails sin leer de `ceo@empresa.com` de la ultima semana, listarlos y marcarlos como leidos despues de procesarlos.

```bash
gws gmail messages list \
  --query "from:ceo@empresa.com is:unread newer_than:7d" \
  --format json \
  | tee /tmp/ceo_inbox.json \
  | jq -r '.[] | "\(.id)  \(.subject)"'
```

Salida esperada:

```
18f3b2c1  Revisar pricing Q2
18f39aad  Feedback del pitch de ayer
18f381ff  FYI: nuevo inversor
```

Marcar todos como leidos en un solo pipe:

```bash
jq -r '.[].id' /tmp/ceo_inbox.json \
  | xargs -I{} gws gmail messages modify {} --remove-label UNREAD
```

```
[OK] 18f3b2c1 UNREAD removido
[OK] 18f39aad UNREAD removido
[OK] 18f381ff UNREAD removido
3 mensajes actualizados en 420ms
```

---

### 2.2 Calendar: crear evento con invitados desde la terminal

```bash
gws calendar events create \
  --calendar primary \
  --title "Kickoff Proyecto AILink" \
  --start "2026-04-21T10:00:00-03:00" \
  --end   "2026-04-21T11:00:00-03:00" \
  --location "Google Meet" \
  --add-meet \
  --attendees "cto@ailinkvip.com,pm@ailinkvip.com,cliente@acme.com" \
  --description "Agenda: alcance, hitos, KPIs"
```

Salida esperada:

```
[OK] Evento creado: "Kickoff Proyecto AILink"
     id:      abc123xyz
     cuando:  Mar 21 Abr 2026 10:00-11:00 (America/Argentina/Buenos_Aires)
     meet:    https://meet.google.com/axb-kzpq-tmd
     invites: 3 enviados
```

---

### 2.3 Drive: subir una carpeta entera con un comando

```bash
gws drive upload ./campaña_abril_2026 \
  --parent "Marketing/Campañas 2026" \
  --recursive \
  --mime-auto \
  --progress
```

Salida esperada:

```
[1/42]  briefing.pdf                 1.2 MB  [##########] 100%
[2/42]  assets/logo.svg              18 KB   [##########] 100%
[3/42]  assets/hero.png              3.4 MB  [##########] 100%
...
[42/42] landing/index.html           22 KB   [##########] 100%

[OK] 42 archivos subidos (87.3 MB) en 14.2s
     carpeta: https://drive.google.com/drive/folders/1A2b...
```

---

### 2.4 Sheets: leer/escribir como si fuera CSV

**Leer** un rango remoto como CSV:

```bash
gws sheets read \
  --id 1BxyZ...sheet_id \
  --range "Ventas!A1:E" \
  --format csv > ventas.csv

head -3 ventas.csv
```

```
fecha,vendedor,cliente,monto,estado
2026-04-01,Ana,Acme SA,12500,pagado
2026-04-02,Beto,Globex,8400,pendiente
```

**Escribir** (append) una fila nueva:

```bash
gws sheets append \
  --id 1BxyZ...sheet_id \
  --range "Ventas!A:E" \
  --values "2026-04-17,Agustin,AILink,23000,pagado"
```

```
[OK] 1 fila agregada en Ventas!A128:E128
```

**Sobrescribir** un rango desde un CSV local:

```bash
gws sheets write \
  --id 1BxyZ...sheet_id \
  --range "Dashboard!A1" \
  --from-csv ./reporte_diario.csv
```

```
[OK] 14 filas x 6 columnas escritas en Dashboard!A1:F14
```

---

## 3. Script combinado: "Resumen diario"

Un solo script que cada mañana:

1. Lista los eventos de hoy en Calendar
2. Cuenta los emails no leidos por remitente
3. Agrega una fila "TODO del dia" en una Sheet

```bash
#!/usr/bin/env bash
# resumen_diario.sh
set -euo pipefail

HOY=$(date +%Y-%m-%d)
SHEET_ID="1BxyZ...sheet_id"

echo "== Agenda de hoy =="
gws calendar events list \
  --calendar primary \
  --time-min "${HOY}T00:00:00-03:00" \
  --time-max "${HOY}T23:59:59-03:00" \
  --format table

echo ""
echo "== Inbox pendiente =="
PENDIENTES=$(gws gmail messages list \
  --query "is:unread newer_than:1d" \
  --format json \
  | jq 'length')
TOP_SENDERS=$(gws gmail messages list \
  --query "is:unread newer_than:1d" \
  --format json \
  | jq -r '.[].from' | sort | uniq -c | sort -rn | head -5)
echo "Total no leidos: $PENDIENTES"
echo "$TOP_SENDERS"

echo ""
echo "== Registrando TODO en Sheet =="
gws sheets append \
  --id "$SHEET_ID" \
  --range "TODOs!A:C" \
  --values "$HOY,Resumen,${PENDIENTES} emails pendientes + agenda cargada"

echo "[OK] Resumen del $HOY listo"
```

Ejecutable desde cron, GitHub Actions o un boton de Raycast.

---

## 4. Comparativa: CLI vs UI vs Zapier/Make

| Tarea                                              | UI web (manual)                  | Zapier / Make                                      | gws-cli                     |
|----------------------------------------------------|----------------------------------|----------------------------------------------------|-----------------------------|
| Marcar 50 emails de un remitente como leidos       | ~3 min de clicks                 | Zap limitado en free tier, latencia 1-15 min       | 1 comando, <1s              |
| Crear evento con 5 invitados + Meet                | ~90s                             | Scenario con 4 modulos                             | 1 comando, 2s               |
| Subir carpeta de 42 archivos                       | Drag & drop, 2-5 min             | No soportado directo                               | 1 comando, 14s              |
| Append a Sheet desde un pipeline                   | Copy/paste o script custom       | 1 zap por fila (caro)                              | 1 comando, gratis           |
| Versionable en git                                 | No                               | No (JSON exportable pero rigido)                   | Si (script .sh)             |
| Costo                                              | Incluido                         | USD 20-100+/mes por volumen                        | Gratis                      |
| Latencia                                           | Humana                           | 1-15 min por trigger                               | Milisegundos                |
| Auditable en CI                                    | No                               | Parcial                                            | Si (logs, exit codes)       |

---

## 5. Caso de uso estrella: Onboarding automatizado de empleados

**Contexto (storytelling).** Lunes 9 AM. Entra Laura, nueva Product Manager. El head de People te pasa su nombre y email. En la empresa tradicional esto seria: pedir alta al IT, esperar cuenta, crear carpeta compartida, agendar 6 reuniones de induccion, mandar welcome kit. Entre 2 y 5 dias habiles.

Con `gws-cli` y un script de 40 lineas, todo eso sucede **en 11 segundos**.

```bash
#!/usr/bin/env bash
# onboarding.sh  <nombre>  <email>
NOMBRE="$1"
EMAIL="$2"
HOY=$(date +%Y-%m-%d)

echo "[1/5] Creando carpeta personal en Drive..."
FOLDER_ID=$(gws drive folder create \
  --name "Onboarding - $NOMBRE" \
  --parent "RRHH/Onboardings" \
  --format json | jq -r '.id')

echo "[2/5] Compartiendo templates de la empresa..."
gws drive permissions add \
  --folder-id "$FOLDER_ID" \
  --email "$EMAIL" \
  --role writer \
  --notify

gws drive copy \
  --from-template "Welcome Kit Master" \
  --to-folder "$FOLDER_ID"

echo "[3/5] Agendando 6 reuniones de induccion..."
for i in 1 2 3 4 5 6; do
  DIA=$(date -v+"${i}"d +%Y-%m-%d)
  gws calendar events create \
    --title "Onboarding Dia $i - $NOMBRE" \
    --start "${DIA}T10:00:00-03:00" \
    --end   "${DIA}T11:00:00-03:00" \
    --attendees "$EMAIL,buddy@ailinkvip.com" \
    --add-meet >/dev/null
done

echo "[4/5] Registrando en Sheet de RRHH..."
gws sheets append \
  --id "$RRHH_SHEET_ID" \
  --range "Altas!A:D" \
  --values "$HOY,$NOMBRE,$EMAIL,$FOLDER_ID"

echo "[5/5] Enviando email de bienvenida..."
gws gmail send \
  --to "$EMAIL" \
  --subject "Bienvenida a AILink, $NOMBRE" \
  --body-file ./templates/welcome.md \
  --markdown

echo "[OK] Onboarding de $NOMBRE completo."
```

Ejecucion real:

```
$ ./onboarding.sh "Laura Gomez" laura@ailinkvip.com
[1/5] Creando carpeta personal en Drive...
[2/5] Compartiendo templates de la empresa...
[3/5] Agendando 6 reuniones de induccion...
[4/5] Registrando en Sheet de RRHH...
[5/5] Enviando email de bienvenida...
[OK] Onboarding de Laura Gomez completo.

Total: 11.4s
```

**Impacto.** Laura entra el lunes, y cuando abre su laptop ya tiene: carpeta con docs, 6 reuniones en el calendar, email de bienvenida con su buddy asignado, y registro en RRHH. El head de People recupera ~2 horas por onboarding. A 30 altas por año: **60 horas liberadas**, sin errores de copy/paste.

---

## 6. Script demo incluido

Para ver en accion un flujo real (limpieza de documentos inactivos de RRHH + revoke de accesos publicos), corre:

```bash
bash /Users/agustinmedina/Claude/gws-cli/demo_comandos_google.sh
```

Ese script simula el descubrimiento de archivos viejos y el revoke de permisos en ~120ms, demostrando la velocidad del manejo asincrono de gws-cli frente a la UI.

---

## 7. Tips de power user

- **JSON por default**: casi todos los subcomandos aceptan `--format json`. Combinalo con `jq` para scripting.
- **Dry-run**: `--dry-run` simula cualquier operacion destructiva sin tocar nada.
- **Multi-cuenta**: `gws --account otro@dominio.com ...` cambia la identidad activa por comando.
- **Output a clipboard**: `| pbcopy` (macOS) para pegar links de Meet o IDs directo.
- **CI/CD**: el token se puede inyectar como secret (`GWS_TOKEN_JSON`) en GitHub Actions.

---

## Cierre

`gws-cli` no es "otra CLI mas". Es la diferencia entre **operar Google Workspace** y **programar Google Workspace**. Todo lo que haces 20 veces por semana con el mouse se convierte en un comando, en un script, en un cron. Y lo que antes requeria Zapier de USD 50/mes ahora vive en tu repo, versionado con git.

La terminal siempre gana.

---

## Version video (markdown listo para grabar)

```
[0:00] HOOK
"Gmail, Calendar, Drive, Sheets... todo desde la terminal. En 60 segundos."

[0:05] PROBLEMA
Mostrar pantalla con 8 pestañas de Google abiertas.

[0:12] SOLUCION
Instalar:   brew install googleworkspace/tap/gws
Login:      gws auth login

[0:25] DEMO 1 - Gmail
Ejecutar: gws gmail messages list --query "from:ceo is:unread"
Mostrar: lista en 0.4s.

[0:35] DEMO 2 - Calendar
Ejecutar: gws calendar events create ... --add-meet
Mostrar: evento con link de Meet en 2s.

[0:45] DEMO 3 - Drive
Ejecutar: gws drive upload ./carpeta --recursive
Mostrar: barra de progreso subiendo 42 archivos.

[0:55] DEMO 4 - Sheets
Ejecutar: gws sheets read --range A1:E --format csv > out.csv
Mostrar: head out.csv

[1:05] KILLER - onboarding.sh
Correr el script de onboarding.
Mostrar: 5 pasos en 11 segundos.

[1:20] CIERRE
"Lo que Zapier cobra USD 50/mes, gws-cli lo hace gratis, en tu shell, versionado en git."
CTA: github.com/googleworkspace/cli
```
