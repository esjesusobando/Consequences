import { Page, Locator, expect } from '@playwright/test';

export class HonoresGradoPage {
  readonly page: Page;
  readonly path: string;

  // Badge
  readonly badge: Locator;

  // Headline
  readonly title: Locator;
  readonly titleAccent: Locator;

  // Details
  readonly dateRow: Locator;
  readonly timeRow: Locator;
  readonly locationRow: Locator;
  readonly phoneRow: Locator;

  // Action Buttons
  readonly confirmButton: Locator;
  readonly mapsButton: Locator;
  readonly gateCodeButton: Locator;
  readonly guideButton: Locator;

  // Panels
  readonly gatePanel: Locator;
  readonly gateCodeDisplay: Locator;
  readonly guidePanel: Locator;

  // Footer
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = 'Honores_Grado_Noel.html';

    // Badge
    this.badge = page.getByText('Honores de Grado');

    // Headline
    this.title = page.locator('h1');
    this.titleAccent = page.locator('h1 span');

    // Details - exact text to differentiate from footer
    this.dateRow = page.getByText('09 de Mayo, 2026', { exact: true });
    this.timeRow = page.getByText('7:30 PM', { exact: true });
    this.locationRow = page.locator('.details').getByText('Summerfield Community', { exact: true });
    this.phoneRow = page.getByText('+1 786 622 3908', { exact: true });

    // Action Buttons
    this.confirmButton = page.getByRole('link', { name: 'Confirmar Asistencia' });
    this.mapsButton = page.getByRole('link', { name: 'Ver Dirección en Maps' });
    this.gateCodeButton = page.getByRole('button', { name: 'Gate Code' });
    this.guideButton = page.getByRole('button', { name: 'Guía de Estilo' });

    // Panels
    this.gatePanel = page.locator('#gatePanel');
    this.gateCodeDisplay = page.locator('.gate-code');
    this.guidePanel = page.locator('#guidePanel');

    // Footer
    this.footer = page.getByText('Summerfield Community Associates');
  }

  async goto(): Promise<void> {
    await this.page.goto(`file:///${this.path}`, { waitUntil: 'networkidle' });
  }
}

export interface TestData {
  whatsappUrl: string;
  mapsUrl: string;
  expectedGateCode: string;
  expectedTitle: string;
}

export const testData: TestData = {
  whatsappUrl: 'https://wa.me/17866223908',
  mapsUrl: 'https://www.google.com/maps/search/6542+SE+Twin+Oaks+Circle+Stuart+FL+34997',
  expectedGateCode: '#2424',
  expectedTitle: 'NOEL TITULO',
};