import { test, expect } from '@playwright/test';
import { HonoresGradoPage, testData } from './pages/honores-grado-page';

test.describe('Honores de Grado - Noel Título', () => {
  let page: HonoresGradoPage;

  test.beforeEach(async ({ page: browserPage }) => {
    page = new HonoresGradoPage(browserPage);
    await page.goto();
  });

  // ========== STRUCTURAL TESTS ==========

  test('Page loads correctly', async () => {
    await expect(page.title).toBeVisible();
    await expect(page.title).toContainText('NOEL');
  });

  test('Badge displays correctly', async () => {
    await expect(page.badge).toBeVisible();
    await expect(page.badge).toContainText('Honores de Grado');
  });

  test('Title accent color is red', async () => {
    const accent = page.titleAccent;
    await expect(accent).toHaveCSS('color', 'rgb(230, 57, 70)'); // #E63946
  });

  // ========== CONTENT TESTS ==========

  test('All details are displayed', async () => {
    await expect(page.dateRow).toBeVisible();
    await expect(page.timeRow).toBeVisible();
    await expect(page.locationRow).toBeVisible();
    await expect(page.phoneRow).toBeVisible();
  });

  test('Date is correct', async () => {
    await expect(page.dateRow).toContainText('09 de Mayo, 2026');
  });

  test('Time is correct', async () => {
    await expect(page.timeRow).toContainText('7:30 PM');
  });

  test('Location is Summerfield Community', async () => {
    await expect(page.locationRow).toContainText('Summerfield Community');
  });

  test('Phone number is correct', async () => {
    await expect(page.phoneRow).toContainText('+1 786 622 3908');
  });

  // ========== BUTTON TESTS ==========

  test('All 4 buttons are present and visible', async () => {
    await expect(page.confirmButton).toBeVisible();
    await expect(page.mapsButton).toBeVisible();
    await expect(page.gateCodeButton).toBeVisible();
    await expect(page.guideButton).toBeVisible();
  });

  test('Confirmar Asistencia links to WhatsApp', async ({ page: browserPage }) => {
    const href = await page.confirmButton.getAttribute('href');
    expect(href).toContain('wa.me/17866223908');
  });

  test('Ver Dirección en Maps links to Google Maps', async ({ page: browserPage }) => {
    const href = await page.mapsButton.getAttribute('href');
    expect(href).toContain('google.com/maps/search');
    expect(href).toContain('6542+SE+Twin+Oaks+Circle');
  });

  // ========== GATE CODE TOGGLE TESTS ==========

  test('Gate Code panel is hidden by default', async () => {
    await expect(page.gatePanel).not.toHaveClass(/active/);
    await expect(page.gatePanel).toHaveCSS('opacity', '0');
  });

  test('Gate Code button reveals panel on click', async () => {
    await page.gateCodeButton.click();
    await expect(page.gatePanel).toHaveClass(/active/);
    await expect(page.gateCodeDisplay).toBeVisible();
  });

  test('Gate Code displays #2424 when revealed', async () => {
    await page.gateCodeButton.click();
    await expect(page.gateCodeDisplay).toContainText('#2424');
  });

  test('Gate Code button toggles panel off', async () => {
    // First click - turn on
    await page.gateCodeButton.click();
    await expect(page.gatePanel).toHaveClass(/active/);

    // Second click - turn off
    await page.gateCodeButton.click();
    await expect(page.gatePanel).not.toHaveClass(/active/);
  });

  // ========== GUIDE PANEL TOGGLE TESTS ==========

  test('Guide panel is hidden by default', async () => {
    await expect(page.guidePanel).not.toHaveClass(/active/);
  });

  test('Guide button reveals panel on click', async () => {
    await page.guideButton.click();
    await expect(page.guidePanel).toHaveClass(/active/);
  });

  test('Guide panel contains identity sections', async () => {
    await page.guideButton.click();
    await expect(page.guidePanel.getByText('Identidad Visual')).toBeVisible();
    await expect(page.guidePanel.getByText('Tipografía')).toBeVisible();
    await expect(page.guidePanel.getByText('Paleta de Colores')).toBeVisible();
  });

  test('Guide button toggles panel off', async () => {
    // First click - turn on
    await page.guideButton.click();
    await expect(page.guidePanel).toHaveClass(/active/);

    // Second click - turn off
    await page.guideButton.click();
    await expect(page.guidePanel).not.toHaveClass(/active/);
  });

  // ========== STATE INDEPENDENCE TESTS ==========

  test('Gate Code and Guide panels operate independently', async () => {
    // Open gate code
    await page.gateCodeButton.click();
    await expect(page.gatePanel).toHaveClass(/active/);

    // Open guide - gate should stay open
    await page.guideButton.click();
    await expect(page.gatePanel).toHaveClass(/active/); // Still open
    await expect(page.guidePanel).toHaveClass(/active/); // Now open too

    // Close gate - guide should stay open
    await page.gateCodeButton.click();
    await expect(page.gatePanel).not.toHaveClass(/active/);
    await expect(page.guidePanel).toHaveClass(/active/); // Still open
  });

  // ========== ACCESSIBILITY TESTS ==========

  test('All buttons have focus states', async () => {
    const buttons = [page.gateCodeButton, page.guideButton];
    for (const button of buttons) {
      await button.focus();
      await expect(button).toBeVisible();
    }
  });

  test('Links have valid href attributes', async () => {
    const confirmHref = await page.confirmButton.getAttribute('href');
    const mapsHref = await page.mapsButton.getAttribute('href');

    expect(confirmHref).toBeTruthy();
    expect(mapsHref).toBeTruthy();
    expect(confirmHref?.startsWith('https://')).toBe(true);
    expect(mapsHref?.startsWith('https://')).toBe(true);
  });

  // ========== VISUAL REGRESSION TESTS ==========

  test('Footer displays correctly', async () => {
    await expect(page.footer).toContainText('Summerfield Community Associates');
  });
});