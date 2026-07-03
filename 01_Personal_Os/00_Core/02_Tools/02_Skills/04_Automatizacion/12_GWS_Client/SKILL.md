---
name: gws-cli
description: >
  Google Workspace CLI for terminal-based email, calendar, drive, and sheets management.
  Use when: (1) Managing Gmail emails (list, send, mark read/unread, filter by sender/date), (2) Creating/updating Calendar events with Meet links, (3) Uploading files to Google Drive, (4) Reading/writing Google Sheets as CSV, (5) Automating daily summaries, (6) Onboarding employee scripts.
  Triggers: "gmail", "calendar", "drive", "sheets", "google workspace", "automation", "terminal gmail", "email desde terminal", "automatizar google".
  Triggers on: gws CLI, Gmail power-user, Calendar events with Meet, Drive uploads, Sheets CSV, Google Workspace automation
license: Apache-2.0
metadata:
  author: googleworkspace/cli
  version: "1.0"
sota_upgraded: true
---

# GWS CLI: Google Workspace a velocidad de terminal

> "Deja de hacer click. Empieza a escribir."
> Una CLI oficial para manejar Gmail, Calendar, Drive, Docs y Sheets sin salir de tu shell.

---

## Esencia Original

**Metaskill**: Operate Google Workspace entirely from the terminal — Gmail (list, send, mark, filter), Calendar (create events with Meet links), Drive (upload, list), and Sheets (read/write as CSV) via the official `gws` CLI from googleworkspace/cli.

**Propósito original**: Eliminate browser-dependency for daily Workspace operations. Enable scriptable, versionable, CI/CD-compatible automation of email, calendar, file, and spreadsheet workflows without opening a single browser tab.

---

## Por qué esto importa

Cada semana pierdes horas navegando pestañas del navegador: abrir Gmail, filtrar, marcar, cambiar a Calendar, copiar el link, ir a Drive, subir algo, pasar a Sheets, pegar. `gws-cli` colapsa todo ese flujo en comandos scripteables, versionables y automatizables.

- **Oficial**: mantenido por Google (`googleworkspace/cli`)
- **Unificado**: un solo binario para todo Workspace
- **Scripteable**: se combina con `jq`, `xargs`, `awk`, cron, GitHub Actions
- **Seguro**: OAuth2 con tokens locales, sin passwords

Repo oficial: https://github.com/googleworkspace/cli

---

## 1. Setup y autenticación

### Instalación

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
-> Esperando autorización...
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

## 2. Gmail: operaciones power-user

### 2.1 Listar emails no leídos de un remitente

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

### 2.2 Marcar emails como leídos

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

### 2.3 Enviar un email

```bash
gws gmail send \
  --to "destinatario@ejemplo.com" \
  --subject "Resumen diario" \
  --body "Hola, te paso el resumen de hoy."
```

### 2.4 Ver contenido de un email

```bash
gws gmail messages get <MESSAGE_ID> --format json | jq '.body'
```

---

## 3. Calendar: crear eventos con Meet

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

## 4. Drive: subir archivos

### 4.1 Subir carpeta completa

```bash
gws drive upload ./campaña_abril_2026 \
  --parent "Marketing/Campañas 2026" \
  --recursive \
  --mime-auto \
  --progress
```

### 4.2 Listar archivos en Drive

```bash
gws drive list --folder "Marketing/Campañas 2026" --format json
```

---

## 5. Sheets: leer y escribir

### 5.1 Leer como CSV

```bash
gws sheets read \
  --id 1BxyZ...sheet_id \
  --range "Ventas!A1:E" \
  --format csv > ventas.csv
```

### 5.2 Escribir una fila nueva

```bash
gws sheets append \
  --id 1BxyZ...sheet_id \
  --range "Ventas!A:E" \
  --values "2026-04-17,Agustin,AILink,23000,pagado"
```

### 5.3 Sobrescribir desde CSV

```bash
gws sheets write \
  --id 1BxyZ...sheet_id \
  --range "Dashboard!A1" \
  --from-csv ./reporte_diario.csv
```

---

## 6. Script: Resumen diario

Un solo script que cada mañana:
1. Lista los eventos de hoy en Calendar
2. Cuenta los emails no leídos por remitente
3. Registra en una Sheet

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
echo "Total no leídos: $PENDIENTES"
echo "$TOP_SENDERS"

echo ""
echo "== Registrando TODO en Sheet =="
gws sheets append \
  --id "$SHEET_ID" \
  --range "TODOs!A:C" \
  --values "$HOY,Resumen,${PENDIENTES} emails pendientes + agenda cargada"

echo "[OK] Resumen del $HOY listo"
```

---

## 7. Tips power-user

- **JSON por default**: casi todos los subcomandos aceptan `--format json`. Combínalo con `jq` para scripting.
- **Dry-run**: `--dry-run` simula cualquier operación destructiva sin tocar nada.
- **Multi-cuenta**: `gws --account otro@dominio.com ...` cambia la identidad activa por comando.
- **CI/CD**: el token se puede inyectar como secret (`GWS_TOKEN_JSON`) en GitHub Actions.
- **Help**: `gws gmail --help`, `gws calendar --help`, etc.

---

## Comandos rápidos de referencia

```bash
# === AUTENTICACIÓN ===
gws auth login --account tu@email.com    # Login OAuth
gws auth status                          # Ver estado de tokens

# === GMAIL ===
gws gmail messages list --query "is:unread newer_than:7d"  # Listar emails
gws gmail messages get <ID>            # Ver email completo
gws gmail send --to "a@b.com" --subject "Asunto" --body "Texto"  # Enviar
gws gmail messages modify <ID> --remove-label UNREAD  # Marcar leído
gws gmail messages modify <ID> --add-label STARRED  # Agregar estrella

# === CALENDAR ===
gws calendar events list --time-min HOY --time-max HOY  # Eventos de hoy
gws calendar events create --title "Reunión" --start "ISO_DATE" --end "ISO_DATE" --add-meet  # Crear evento con Meet

# === DRIVE ===
gws drive list --folder "Nombre"       # Listar archivos
gws drive upload ./carpeta --parent "Drive/Folder" --recursive  # Subir

# === SHEETS ===
gws sheets read --id <ID> --range "Hoja!A1:E" --format csv  # Leer
gws sheets append --id <ID> --range "Hoja!A:E" --values "val1,val2"  # Agregar fila

# === AYUDA ===
gws --help
gws gmail --help
```

---

## ⚠️ Gotchas

### 1. Token OAuth Expira ~60 Minutos — Re-autenticación Requerida

**Por qué**: El token OAuth de `gws auth login` tiene una vida corta (~1 hora). Después de ese tiempo, los comandos fallan con error de autenticación. No hay refresh automático en todos los entornos.

**Solución**: Monitorea con `gws auth status` que muestra el tiempo restante. Para scripting, renueva antes de ejecutar: `gws auth login --account tu@email.com --force` o configura un cron que renueve el token periódicamente. En CI/CD, inyecta el token como secret `GWS_TOKEN_JSON`.

### 2. `--format json` vs `--format table`: Output Distinto para Scripting

**Por qué**: `--format json` produce un array de objetos que puedes pipear a `jq`. `--format table` produce texto formateado para humanos. Usar table output en scripts causa parsing errors.

**Solución**: Siempre usa `--format json` cuando el output vaya a ser procesado por scripts (xargs, jq, awk). Reserva `--format table` solo para inspección manual. Combinación típica: `gws ... --format json | jq -r '.[].id' | xargs ...`.

### 3. Multi-Cuenta: El Token por Defecto NO es el que Esperas

**Por qué**: Si tienes múltiples cuentas autenticadas, `gws` usa la última cuenta que hizo login por defecto, no necesariamente la que quieres usar. Enviar un email desde la cuenta equivocada puede tener consecuencias.

**Solución**: Usa `gws --account email@dominio.com <comando>` para especificar la cuenta explícitamente en cada comando. O configura la cuenta por defecto con `gws config set account email@dominio.com`. Verifica siempre con `gws auth status` antes de operaciones destructivas.

## 💾 State Persistence

| Qué                          | Dónde                              | Notas                                         |
|-----------------------------|-----------------------------------|----------------------------------------------|
| Token OAuth (~1 hora de vida)| `~/.config/gws/{email}.json`       | Archivo JSON con token, refresh token y scopes|
| Config global                | `~/.config/gws/config.json`        | Cuenta default, preferencias                  |
| Cache de API calls           | Efímero (en memoria de proceso)    | Sin persistencia entre comandos               |
| Logs de operaciones          | n8n execution log o terminal stdout| No hay log persistente por defecto            |

No hay base de datos local. Todo el estado persistente son los tokens OAuth. Los datos de Gmail, Calendar, Drive y Sheets viven en los servidores de Google.

---

## Recursos

- **Repo oficial**: https://github.com/googleworkspace/cli
- **Documentación**: https://github.com/googleworkspace/cli#readme


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
