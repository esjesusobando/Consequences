# Playwright Plugin: Claude Code al Volante de un Browser Real

> "Deja de escribir selectores a mano. Describe el flujo en lenguaje natural y Playwright lo ejecuta en Chromium, Firefox o WebKit mientras Claude observa, piensa y corrige."

El **Playwright Plugin** convierte a Claude Code en un **QA engineer autonomo** capaz de abrir un browser de verdad, hacer click, scrollear, llenar formularios, tomar screenshots y ejecutar tests E2E completos. No es scraping estatico ni simulaciones: es un Chromium real bailando al ritmo de tus instrucciones.

---

## 1. Instalacion (30 segundos)

```bash
# Dentro de Claude Code
/plugin

# Buscar "Playwright" en el marketplace interno
# Seleccionar e instalar
# Reiniciar la sesion
```

Al reiniciar, Claude tendra acceso a comandos como:

- `playwright.navigate(url)`
- `playwright.click(selector)`
- `playwright.fill(selector, value)`
- `playwright.screenshot(path)`
- `playwright.waitForSelector(selector)`
- `playwright.evaluate(jsCode)`

No necesitas `npm install playwright` manualmente. El plugin encapsula runtime + browsers + helpers.

---

## 2. Como funciona (diagrama del flujo)

```
+-----------+       +-------------------+       +---------------+       +-----------+
|  USUARIO  |       |      CLAUDE       |       |   PLAYWRIGHT  |       |  BROWSER  |
|           |       |      CODE         |       |    PLUGIN     |       | (Chromium)|
+-----------+       +-------------------+       +---------------+       +-----------+
|                        |                            |                         |
| "logueate en la app    |                            |                         |
| y verifica el          |                            |                         |
| dashboard"             |                            |                         |
| ---------------------> |                            |                         |
|                        | traduce a comandos         |                         |
|                        | async/await                |                         |
|                        | -------------------------> |                         |
|                        |                            | page.goto()             |
|                        |                            | ----------------------> |
|                        |                            |                         |
|                        |                            | HTML + JS + DOM         |
|                        |                            | <---------------------- |
|                        |                            | page.fill(#user)        |
|                        |                            | page.click(submit)      |
|                        |                            | ----------------------> |
|                        |                            | screenshot.png          |
|                        |                            | <---------------------- |
|                        | analiza, decide siguiente  |                         |
|                        | paso, reintenta si falla   |                         |
|                        | <------------------------- |                         |
| "Login OK, tome        |                            |                         |
| screenshot,            |                            |                         |
| dashboard tiene        |                            |                         |
| 3 widgets"             |                            |                         |
| <--------------------- |                            |                         |
```

La magia: Claude **itera**. Si un selector falla, analiza el DOM, prueba otro. Si aparece un modal inesperado, lo cierra. Es un loop de percepcion-accion.

---

## 3. Cuatro casos de uso con codigo

### Caso 3.1: Test E2E de login flow

Basado en `playwright-plugin/test_demo.js`, pero real y completo:

```javascript
// test_login_e2e.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 150 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Iniciando auditoria E2E del login flow...');

    // 1. Navegar
    await page.goto('https://app.miempresa.com/login', { waitUntil: 'networkidle' });

    // 2. Esperar que el form este montado (SPA)
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });

    // 3. Credenciales
    await page.fill('input[name="email"]', 'agustin@ailinkvip.com');
    await page.fill('input[name="password"]', process.env.DEMO_PASSWORD);

    // 4. Submit y esperar navegacion
    await Promise.all([
      page.waitForURL('**/dashboard'),
      page.click('button[type="submit"]')
    ]);

    // 5. Verificar que el dashboard cargo
    await page.waitForSelector('[data-testid="dashboard-root"]');
    const userBadge = await page.textContent('[data-testid="user-badge"]');

    if (!userBadge.includes('agustin')) {
      throw new Error('Badge de usuario incorrecto');
    }

    await page.screenshot({ path: 'dashboard_ok.png', fullPage: true });
    console.log('Login E2E OK, sesion iniciada, dashboard verificado.');
  } catch (err) {
    await page.screenshot({ path: 'error_state.png', fullPage: true });
    console.error('Test fallido:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
```

**Prompt para Claude:**

```
Corre el login E2E contra staging. Si falla, toma screenshot del estado,
examina el DOM y dime por que. Si el selector cambio, proponme el nuevo.
```

### Caso 3.2: Scraping dinamico de SPA (donde BeautifulSoup muere)

BS4 solo ve el HTML inicial. Los sitios React/Vue/Svelte renderizan via JS despues del `DOMContentLoaded`. Playwright espera a que el JS corra.

```javascript
// scrape_spa.js
const { chromium } = require('playwright');

async function scrapePreciosSPA(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });

  // El grid de productos se renderiza despues de un fetch()
  await page.waitForSelector('.product-card', { timeout: 15000 });

  // Scroll infinito: cargar todos los productos
  let previousHeight = 0;
  while (true) {
    const currentHeight = await page.evaluate(() => document.body.scrollHeight);
    if (currentHeight === previousHeight) break;
    previousHeight = currentHeight;
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
  }

  // Extraer datos desde el DOM ya hidratado
  const productos = await page.$$eval('.product-card', cards =>
    cards.map(c => ({
      nombre: c.querySelector('.title')?.innerText?.trim(),
      precio: c.querySelector('.price')?.innerText?.trim(),
      stock: c.querySelector('.stock')?.innerText?.trim(),
      url: c.querySelector('a')?.href
    }))
  );

  await browser.close();
  return productos;
}

scrapePreciosSPA('https://ecommerce-react-demo.vercel.app').then(console.log);
```

**Ventaja clave:** Playwright ejecuta el JS del sitio, intercepta XHR, espera a que el DOM este estable. Claude puede decidir cuando "ya cargo todo".

### Caso 3.3: Screenshot regression testing

Detectar cambios visuales pixel-perfect entre deploys:

```javascript
// visual_regression.js
const { chromium } = require('playwright');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;
const fs = require('fs');

async function auditarVisual(url, rutaBaseline) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(url, { waitUntil: 'networkidle' });

  // Ocultar elementos volatiles (timestamps, ads, animaciones)
  await page.addStyleTag({ content: `
    .timestamp, .ads, [data-volatile] { visibility: hidden !important; }
    *, *::before, *::after { animation: none !important; transition: none !important; }
  `});

  const actual = await page.screenshot({ fullPage: true });
  fs.writeFileSync('actual.png', actual);

  const baselineImg = PNG.sync.read(fs.readFileSync(rutaBaseline));
  const actualImg = PNG.sync.read(actual);
  const { width, height } = baselineImg;
  const diff = new PNG({ width, height });

  const pixelesDistintos = pixelmatch(
    baselineImg.data, actualImg.data, diff.data,
    width, height, { threshold: 0.1 }
  );

  fs.writeFileSync('diff.png', PNG.sync.write(diff));
  await browser.close();

  const porcentaje = (pixelesDistintos / (width * height)) * 100;
  return { pixelesDistintos, porcentaje, falla: porcentaje > 0.5 };
}

auditarVisual('https://staging.miempresa.com', './baseline_home.png').then(r => {
  if (r.falla) {
    console.error(`Regresion visual detectada: ${r.porcentaje.toFixed(2)}% distinto`);
    process.exit(1);
  }
  console.log('Sin regresion visual.');
});
```

**Prompt para Claude:**

```
Corre visual regression contra las 12 paginas principales. Si alguna falla,
abre el diff.png, interpreta que cambio (color, layout, texto) y clasifica
si es intencional o un bug.
```

### Caso 3.4: Automatizacion masiva (llenar form en 50 URLs)

Tarea tipica: un listado de leads/URLs donde hay que hacer la misma accion repetitiva.

```javascript
// mass_form_fill.js
const { chromium } = require('playwright');
const fs = require('fs');

const urls = JSON.parse(fs.readFileSync('urls.json'));
const payload = {
  nombre: 'Agustin Medina',
  email: 'agustin@ailinkvip.com',
  mensaje: 'Hola, me interesa su servicio premium.'
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const resultados = [];

  for (const [i, url] of urls.entries()) {
    const page = await context.newPage();
    try {
      console.log(`[${i + 1}/${urls.length}] ${url}`);
      await page.goto(url, { timeout: 20000 });
      await page.waitForSelector('form', { timeout: 8000 });

      await page.fill('input[name="name"], input[name="nombre"]', payload.nombre);
      await page.fill('input[type="email"]', payload.email);
      await page.fill('textarea', payload.mensaje);

      await page.click('button[type="submit"], input[type="submit"]');
      await page.waitForSelector('.success, .thank-you, .confirmation', { timeout: 10000 });

      resultados.push({ url, status: 'ok' });
    } catch (err) {
      resultados.push({ url, status: 'fail', error: err.message });
      await page.screenshot({ path: `fail_${i}.png` });
    } finally {
      await page.close();
    }
  }

  await browser.close();
  fs.writeFileSync('resultados.json', JSON.stringify(resultados, null, 2));
  const ok = resultados.filter(r => r.status === 'ok').length;
  console.log(`Completado: ${ok}/${urls.length} formularios enviados.`);
})();
```

Escala a 500 URLs con `context.newPage()` en paralelo + `p-limit` para controlar concurrencia.

---

## 4. Snippets esenciales de Playwright

```javascript
// Setup
const { chromium, firefox, webkit } = require('playwright');
const browser = await chromium.launch({ headless: false, slowMo: 100 });
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await context.newPage();

// Navegacion
await page.goto('https://ejemplo.com', { waitUntil: 'networkidle' });
await page.goBack();
await page.reload();

// Esperas inteligentes
await page.waitForSelector('#app-ready');
await page.waitForLoadState('networkidle');
await page.waitForResponse(r => r.url().includes('/api/user') && r.status() === 200);
await page.waitForFunction(() => window.__APP_READY__ === true);

// Interaccion
await page.click('button.cta', { delay: 50 });
await page.dblclick('.item');
await page.fill('#email', 'user@example.com');
await page.type('#search', 'playwright', { delay: 80 });
await page.press('input[name=q]', 'Enter');
await page.selectOption('select#country', 'AR');
await page.check('#tos');
await page.hover('.menu-trigger');

// Drag & drop, upload
await page.dragAndDrop('#source', '#target');
await page.setInputFiles('input[type=file]', '/ruta/al/archivo.pdf');

// Evaluate JS en el contexto del browser
const titulo = await page.evaluate(() => document.title);
const items = await page.$$eval('.row', rows => rows.map(r => r.innerText));

// Screenshots y PDFs
await page.screenshot({ path: 'full.png', fullPage: true });
await page.locator('.hero').screenshot({ path: 'hero.png' });
await page.pdf({ path: 'page.pdf', format: 'A4' });

// Interceptar red
await page.route('**/api/**', route => {
  console.log('API call:', route.request().url());
  route.continue();
});

// Tracing para debug
await context.tracing.start({ screenshots: true, snapshots: true });
// ... acciones ...
await context.tracing.stop({ path: 'trace.zip' });
// Luego: npx playwright show-trace trace.zip
```

---

## 5. Comparativa: Playwright vs Puppeteer vs Cypress

| Criterio                                    | Playwright                                     | Puppeteer                                         | Cypress                                       |
|---------------------------------------------|------------------------------------------------|---------------------------------------------------|-----------------------------------------------|
| Motor                                       | Chromium + Firefox + WebKit                    | Solo Chromium/Chrome                              | Solo Chromium/Electron                        |
| Lenguajes                                   | JS, TS, Python, Java, C#                       | JS, TS                                            | JS, TS                                        |
| Auto-wait                                   | Si, nativo y robusto                           | Manual, hay que escribir `waitFor*`               | Si, pero con timeouts fijos                   |
| Multi-tab / multi-context                   | Nativo (contextos aislados)                    | Limitado                                          | No soporta                                    |
| iFrames cross-origin                        | Si                                             | Parcial                                           | No (limitacion de arquitectura)               |
| Ejecucion paralela                          | Nativa (workers)                               | Manual                                            | Requiere Dashboard pago                       |
| Intercepcion de red                         | Completa (request/response/mock)               | Basica                                            | Solo XHR/fetch                                |
| Mantenido por                               | Microsoft                                      | Google (mantenimiento tibio)                      | Cypress.io                                    |
| Curva de aprendizaje                        | Media                                          | Baja                                              | Baja (DSL propio)                             |
| Headless + Headed                           | Ambos, mismo API                               | Ambos                                             | Headless limitado                             |
| Traces / Time travel debugger               | `trace.zip` visual                             | No                                                | Si, excelente                                 |
| Costo                                       | Open source                                    | Open source                                       | Freemium (dashboard pago)                     |
| Velocidad relativa                          | Muy rapido                                     | Rapido                                            | Lento (arquitectura)                          |

**Veredicto para usar con Claude Code:**

- **Playwright** gana por soporte multi-browser, API unificada, traces para debugging asistido por IA, y porque Claude puede analizar el `trace.zip` paso a paso.
- **Puppeteer** solo si ya tenes legacy.
- **Cypress** bueno para devs, pero su sandbox dificulta que Claude intercepte el contexto.

---

## 6. Caso estrella: debuggear un bug visual que solo pasa en produccion

Escenario real: **"El boton CTA se ve cortado en produccion pero en staging esta perfecto. El equipo tiene 3 dias sin poder reproducirlo."**

### Iteracion 1: reproducir

```
Usuario: Abri prod y staging en paralelo, tomame screenshot del hero en ambos.
         Viewport 1440x900.

Claude: [ejecuta Playwright]
        - page.goto(prod) -> screenshot_prod.png
        - page.goto(staging) -> screenshot_staging.png
        - diff pixelmatch -> 2.3% distinto
        - Confirmo: el CTA en prod aparece recortado a la derecha.
```

### Iteracion 2: hipotesis

```
Claude: Posibles causas:
        1. CSS diferente desplegado (cache de CDN)
        2. Feature flag activo solo en prod
        3. Font custom que no cargo (FOUT)
        4. A/B test activo

        Voy a comparar el HTML de ambos.
```

### Iteracion 3: investigacion

```javascript
// Claude ejecuta:
const cssProd = await prodPage.evaluate(() => {
  const btn = document.querySelector('.cta');
  return window.getComputedStyle(btn).cssText;
});
const cssStaging = await stagingPage.evaluate(() => {
  const btn = document.querySelector('.cta');
  return window.getComputedStyle(btn).cssText;
});
console.log({ cssProd, cssStaging });

// Claude tambien revisa:
const fontsProd = await prodPage.evaluate(() => document.fonts.ready.then(() =>
  [...document.fonts].map(f => ({ family: f.family, status: f.status }))
));
```

### Iteracion 4: root cause

```
Claude: Encontre la diferencia.
        - En prod: font-family: "InterCustom" cargo con status "unloaded"
        - En staging: cargo OK
        - El font-display es "block" y el CTA usa width:max-content
        - Cuando el font falla, el fallback Arial es mas ancho -> overflow

        El archivo InterCustom.woff2 en prod devuelve 403 desde la CDN.
        Causa: el deploy de prod no copio el font al bucket.
```

### Iteracion 5: fix + regression test

```
Claude: Creo un test automatizado para que esto no vuelva a pasar:

  test('CTA no desborda cuando el font custom falla', async ({ page }) => {
    // Simular fallo del font
    await page.route('**/*.woff2', route => route.abort());
    await page.goto(URL);
    const overflow = await page.evaluate(() => {
      const btn = document.querySelector('.cta');
      return btn.scrollWidth > btn.clientWidth;
    });
    expect(overflow).toBe(false);
  });
```

**Lo que hizo la diferencia:** Claude no solo ejecuto Playwright una vez. **Itero**: reproducir, hipotetizar, investigar, validar, fixear, prevenir. Cada paso alimentado por lo que vio en el browser. Tres dias de humanos vs 15 minutos con el plugin.

---

## 7. Tips de produccion

1. **Siempre `waitForSelector` antes de `click`**: los SPAs montan el DOM de forma asincrona.
2. **`slowMo` solo en debug**: en CI removelo, ralentiza todo.
3. **Contextos aislados para tests paralelos**: `browser.newContext()` es mas barato que `browser.launch()`.
4. **Traces en cada fallo de CI**: `tracing.start()` + `tracing.stop({ path })` + subirlo como artifact.
5. **Mock de APIs lentas**: `page.route()` para devolver fixtures y acelerar tests.
6. **Env vars para credenciales**: jamas hardcodear passwords en el script.
7. **Storage state**: guarda cookies/localStorage con `context.storageState()` para saltear el login en tests subsiguientes.

---

## Markdown para video (guion corto)

> **[ESCENA 1 - 0:00]** Pantalla de Claude Code. Escribir `/plugin`. Buscar "Playwright". Instalar.
>
> **[ESCENA 2 - 0:15]** Prompt: *"Loguea en app.demo.com con estas credenciales, toma screenshot del dashboard y verifica que hay 3 widgets"*.
>
> **[ESCENA 3 - 0:25]** Mostrar el browser real abriendose, tipeando el email letra por letra (`slowMo: 150`). Click en submit. Navegacion a dashboard. Screenshot.
>
> **[ESCENA 4 - 0:45]** Claude reporta: *"Login OK, 3 widgets detectados, screenshot guardado en dashboard_ok.png"*.
>
> **[ESCENA 5 - 1:00]** Bonus: el CTA se ve cortado. Claude abre prod y staging en paralelo. Detecta el diff. Identifica el font 403 en CDN. Propone fix + test de regresion.
>
> **[ESCENA 6 - 1:45]** Cierre: *"De 3 dias de debug a 15 minutos. Playwright + Claude = tu QA engineer que nunca duerme."*

---

**Listo. Conecta el plugin, abri un navegador, describi lo que queres y deja que Claude maneje. Tu equipo de QA acaba de escalar sin contratar a nadie.**
