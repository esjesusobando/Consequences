# Plan de Deploy — OIM Website → Hostinger
**Fecha:** 2026-04-24
**Proyecto:** `03_Resultado/OIM_Website_Backup`
**Stack:** Next.js 16 + TypeScript + Tailwind

---

## Diagnóstico del Proyecto

| Item                | Valor                                   |
|---------------------|-----------------------------------------|
| Framework           | Next.js 16.2.2                          |
| Lenguaje            | TypeScript                              |
| Build               | `npm run build` (standard SSR)          |
| Output mode         | SSR (sin `output: 'export'`)            |
| Assets estáticos    | `public/` (imágenes, íconos, OG)        |
| Security headers    | Configurados en `next.config.ts`        |

> **Importante:** Este proyecto es SSR (Server-Side Rendering). Necesita Node.js en el servidor.
> Hostinger Shared Hosting (Apache/PHP) NO puede correr Next.js directamente.
> Se requiere **Hostinger VPS** o **Node.js Hosting**.

---

## Opciones de Deploy

### OPCIÓN A — Hostinger VPS (Recomendada)
**Costo:** ~$5-10 USD/mes | **Control:** Total | **Performance:** Alta

### OPCIÓN B — Hostinger Node.js Hosting
**Costo:** Incluido en planes Business+ | **Control:** Medio | **Ideal para:** Apps Node.js simples

### OPCIÓN C — Export Estático + Shared Hosting
**Costo:** Plan básico Hostinger | **Limitación:** Pierde SSR, headers de seguridad, API routes

---

## Plan de Ejecución — OPCIÓN A: VPS (Recomendada)

### PRE-REQUISITOS
- [ ] VPS Hostinger activo (Ubuntu 22.04 recomendado)
- [ ] Dominio apuntando al VPS (`oim.com.co` o el dominio del proyecto)
- [ ] Acceso SSH al VPS

---

### FASE 1 — Preparar el Build Local

```bash
# En el directorio del proyecto
cd "03_Resultado/OIM_Website_Backup"

# Instalar dependencias limpias
npm ci

# Build de producción
npm run build

# Verificar que el build fue exitoso
ls -la .next/
```

**Resultado esperado:** Carpeta `.next/` con el build compilado.

---

### FASE 2 — Configurar el VPS

```bash
# Conectar al VPS por SSH
ssh root@IP_DEL_VPS

# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verificar
node --version  # debe ser 20.x
npm --version

# Instalar PM2 (process manager)
npm install -g pm2

# Instalar Nginx (reverse proxy)
apt install -y nginx

# Instalar Certbot para SSL
apt install -y certbot python3-certbot-nginx
```

---

### FASE 3 — Subir el Proyecto

```bash
# OPCIÓN: rsync (recomendado)
rsync -avz \
  --exclude 'node_modules' \
  --exclude '.git' \
  "03_Resultado/OIM_Website_Backup/" \
  root@IP_DEL_VPS:/var/www/oim-website/

# En el VPS: instalar dependencias y arrancar
cd /var/www/oim-website
npm ci --production
```

---

### FASE 4 — Configurar PM2

```bash
# En el VPS
cd /var/www/oim-website

# Arrancar con PM2
pm2 start npm --name "oim-website" -- start

# Configurar para arrancar al reiniciar
pm2 startup
pm2 save

# Verificar que corre
pm2 status
pm2 logs oim-website
```

El sitio corre en `http://localhost:3000` internamente.

---

### FASE 5 — Configurar Nginx (Reverse Proxy)

```bash
# Crear config de Nginx
nano /etc/nginx/sites-available/oim-website
```

**Contenido del archivo Nginx:**

```nginx
server {
    listen 80;
    server_name TU_DOMINIO.com www.TU_DOMINIO.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache para assets estáticos
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

```bash
# Activar el sitio
ln -s /etc/nginx/sites-available/oim-website /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

### FASE 6 — SSL con Certbot

```bash
# Generar certificado SSL gratuito
certbot --nginx -d TU_DOMINIO.com -d www.TU_DOMINIO.com

# Verificar renovación automática
certbot renew --dry-run
```

---

### FASE 7 — Verificación Final

```bash
# Verificar que el sitio responde
curl -I https://TU_DOMINIO.com

# Verificar PM2
pm2 status

# Verificar logs (sin errores)
pm2 logs oim-website --lines 50
```

**Checklist de verificación:**
- [ ] Sitio carga en HTTPS
- [ ] Sin errores en consola del browser
- [ ] Imágenes cargan correctamente
- [ ] Formularios funcionan (si los hay)
- [ ] Mobile responsive OK
- [ ] PageSpeed > 85

---

## Plan de Ejecución — OPCIÓN B: Node.js Hosting Hostinger

### Pasos simplificados

1. Activar plan Business o Cloud en Hostinger
2. En hPanel → "Node.js" → Crear app
3. Subir archivos sin `node_modules` via File Manager o Git
4. Hostinger instala dependencias automáticamente
5. Configurar `APP_URL` y variables de entorno en hPanel
6. El entry point es `npm start` (puerto 3000)

**Limitación:** No tenés control total sobre headers de seguridad personalizados — los del `next.config.ts` pueden no aplicar correctamente.

---

## Plan de Ejecución — OPCIÓN C: Export Estático

Si preferís hosting compartido barato, hay que modificar el proyecto:

```typescript
// next.config.ts — agregar:
const nextConfig: NextConfig = {
  output: 'export',  // ← AGREGAR ESTO
  // ... resto igual
};
```

Luego:
```bash
npm run build
# Genera carpeta /out/ con HTML estático
# Subir /out/ al hosting compartido via FTP/File Manager
```

**Pros:** Funciona en cualquier hosting, súper barato.
**Cons:** Pierde SSR, API routes no funcionan, algunos headers de seguridad no se pueden aplicar.

---

## Variables de Entorno (si las hay)

Crear archivo `.env.production` en el VPS:

```bash
# En el VPS
nano /var/www/oim-website/.env.production
```

Verificar si el proyecto usa variables de entorno:
```bash
grep -r "process.env" src/ --include="*.ts" --include="*.tsx" | grep -v "NODE_ENV"
```

---

## Flujo de Updates Futuros

```bash
# En local: hacer cambios y build
npm run build

# Subir solo lo necesario (sin node_modules)
rsync -avz --exclude 'node_modules' --exclude '.git' \
  "03_Resultado/OIM_Website_Backup/" \
  root@IP_DEL_VPS:/var/www/oim-website/

# En VPS: reiniciar app
pm2 restart oim-website
```

---

## Decisión Requerida

Para ejecutar este plan, necesito saber:

1. **¿Qué tipo de hosting tenés en Hostinger?**
   - [ ] Shared Hosting (plan Web o Business)
   - [ ] VPS
   - [ ] Cloud Hosting

2. **¿Cuál es el dominio del sitio?**

3. **¿Tenés acceso SSH al servidor?**

Con estas respuestas arrancamos la ejecución.

---

_Plan generado 2026-04-24 | PersonalOS v2.0 Consequences_
