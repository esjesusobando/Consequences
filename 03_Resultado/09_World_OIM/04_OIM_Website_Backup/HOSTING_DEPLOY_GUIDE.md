# OIM Website — Hostinger Deployment Guide

> Static export listo para subir a Hostinger. Sin servidor Node.js, sin complicaciones.

---

## Lo que tenemos

| Elemento                     | Detalle                                              |
|------------------------------|------------------------------------------------------|
| **Build output**             | `out/` — HTML, CSS, JS, videos, imágenes             |
| **Tipo**                     | Static site (HTML + JS client-side)                  |
| **Stack deploy**             | Solo subiendo archivos a `public_html/`              |
| **Email**                    | EmailJS (client-side, configurable)                  |
| **Dominio**                  | Apuntar a Hostinger                                  |
| **SSL**                      | Gratis con Let's Encrypt en hPanel                   |

---

## PASO 1 — Crear cuenta en Hostinger (si no tenés)

1. Ir a [hostinger.com](https://www.hostinger.com)
2. Elegir plan **Premium** ($2.99/mes) o superior
3. Crear cuenta
4. Comprar dominio o usar uno existente

---

## PASO 2 — Configurar el dominio

### Si compraste el dominio en Hostinger:
El dominio ya está conectado automáticamente. Ve a **hPanel → Dominios** y verificá que esté activo.

### Si ya tenés el dominio en otro registrar:

1. En Hostinger hPanel → **Dominios → DNS / Nameservers**
2. Apuntar al servidor de Hostinger:
   ```
   Nameserver 1: ns1.hostinger.com
   Nameserver 2: ns2.hostinger.com
   ```
   O agregar los **A Record** y **CNAME** que te da Hostinger.

3. Esperar propagación DNS (hasta 24-48hs, usualmente minutos)

---

## PASO 3 — Subir archivos a public_html

### Opción A — File Manager (recomendado)

1. En hPanel → **Archivos → File Manager**
2. Entrar a `public_html/`
3. **Subir todo el contenido de `out/`** (NO la carpeta `out/`, sino su contenido)
   - `index.html`
   - `404.html`
   - `_next/`
   - `videos/`
   - `sitemap.xml`
   - `robots.txt`
   - todas las imágenes y SVGs

### Opción B — FTP

1. En hPanel → **Archivos → FTP Access**
2. Crear credentials FTP
3. Conectar con FileZilla o similar
4. Navegar a `public_html/` y subir el contenido de `out/`

### Estructura final en Hostinger:

```
public_html/
├── index.html          ← página principal
├── 404.html            ← página de error
├── _next/              ← JS bundles y assets
├── videos/             ← videos del sitio
├── sitemap.xml         ← SEO
├── robots.txt          ← SEO
├── og-image.jpg
├── favicon-drill.png
├── apple-touch-icon.png
└── (todas las imágenes)
```

---

## PASO 4 — Activar SSL (HTTPS)

1. En hPanel → **Dominios → SSL**
2. Activar **Let's Encrypt** (gratis)
3. Forzar HTTPS desde **Configuración → Force HTTPS**
4. Esperar~ 15 minutos

---

## PASO 5 — Configurar EmailJS (formulario de contacto)

EmailJS permite enviar emails directamente desde el browser sin servidor.

### Setup en emailjs.com:

1. Crear cuenta gratuita en [emailjs.com](https://emailjs.com)
2. Ir a **Email Services** → agregar servicio (Gmail, Outlook, etc.)
3. Copiar:
   - **Public Key** (también llamado Service ID)
   - **Template ID**
   - **Service ID**

### Actualizar en el código:

En `src/components/ContactForm.tsx`:

```typescript
// Reemplazar estos placeholders con los valores reales de EmailJS:
const SERVICE_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';      // ← tu clave pública
const SERVICE_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';     // ← tu template ID
const SERVICE_SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID';       // ← tu service ID
```

### Configurar el template en EmailJS:

El template debe tener estas variables:
- `{{name}}`
- `{{company}}`
- `{{phone}}`
- `{{service}}`
- `{{message}}`
- `{{reply_to}}`

Recibido: `oiminstallllc@gmail.com`

### Alternativa — Webflare Email Forms (gratis):

Sin cuenta, podés usar [Webflare Forms](https://www.cloudflare.com/products/cloudflare-stream/) o configurar un **forwarding email** en Hostinger.

---

## PASO 6 — Probar el sitio

1. Ir a `https://tudominio.com`
2. Verificar:
   - ✅ Homepage carga con video
   - ✅ Navegación funciona (smooth scroll)
   - ✅ Cambio de idioma EN/ES
   - ✅ Formulario de contacto muestra éxito
   - ✅ Footer con info de contacto
   - ✅ SSL activo (candado verde)
   - ✅ `sitemap.xml` accesible: `tudominio.com/sitemap.xml`
   - ✅ `robots.txt` accesible: `tudominio.com/robots.txt`

---

## Cosas pendientes antes de production

### 1. EmailJS (urgente — el formulario no envía)

Registrate en emailjs.com y actualizá los IDs. Sin esto, el formulario solo dice "success" pero no llega ningún email.

### 2. Dominio

¿Ya tenés el dominio? ¿Lo comprás en Hostinger o lo traés de otro lado?

### 3. Imágenes faltantes (3)

Según la documentación, faltan:
- 1 foto para About section
- 1 foto para Gallery section
- 1 foto para Service Area section

Estas se referencias como `about.jpg`, `gallery.jpg`, `service-area.jpg` en las secciones. Agregalas en `public/` y actualizá las referencias en los componentes.

### 4. Google Maps

Verificá que el embed de Google Maps en `ContactForm.tsx` muestra la ubicación correcta de OIM en Atlanta.

### 5. SEO — Google Search Console

Después de deployar, registrar en:
- [Google Search Console](https://search.google.com/search-console)
- Agregar `sitemap.xml`: `tu-dominio.com/sitemap.xml`

---

## Troubleshooting

| Problema                         | Solución                                                                                   |
|----------------------------------|--------------------------------------------------------------------------------------------|
| Página en blanco                 | Verificar que `index.html` está en `public_html/` (no en subcarpeta)                       |
| Videos no cargan                 | Verificar que `videos/` está al mismo nivel que `_next/`                                   |
| Formulario no envía              | Configurar EmailJS (Paso 5)                                                                |
| SSL warning                      | Forzar HTTPS en hPanel → SSL → Force HTTPS                                                 |
| Imágenes rotas                   | Verificar que `public/` se subió completo                                                  |
| 404 en otras páginas             | Con `output: 'export'`, solo existe `/`. Usar `vercel.json` si se necesita más             |

---

## Estructura de archivos del proyecto

```
OIM_Website_Backup/
├── out/                    ← ⭐ ESTE ES EL QUE SUBÍS a public_html/
│   ├── index.html
│   ├── 404.html
│   ├── _next/
│   ├── videos/
│   ├── sitemap.xml
│   ├── robots.txt
│   └── (imágenes)
├── src/
│   ├── app/
│   │   ├── actions.ts      ← validación + EmailJS
│   │   └── ...
│   └── components/
│       └── ContactForm.tsx ← EmailJS integrado
├── public/                ← código fuente estático
│   ├── videos/
│   └── imágenes
├── next.config.ts
└── package.json
```

---

## Comandos útiles

```bash
# En tu máquina local, después de cualquier cambio:
npm install
npm run build    # genera nuevo out/

# Luego subís el contenido de out/ a Hostinger
```
