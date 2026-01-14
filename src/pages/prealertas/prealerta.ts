import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class PreAlerta extends BasePage {
private readonly prealertasUrl = '/prealertas';

readonly btnCrear: Locator;
readonly successAlert: Locator;

constructor(page: Page) {
super(page);

this.btnCrear = page.getByRole('link', { name: /crear/i });
this.successAlert = page.getByRole('alert');
}

async navigate(): Promise<void> {
await this.navigateTo(this.prealertasUrl);
await this.waitForLoaded();
}

async waitForLoaded(): Promise<void> {
await expect(this.btnCrear).toBeVisible();
await expect(this.btnCrear).toBeEnabled();
}

async clickCrear(): Promise<void> {
await this.btnCrear.click();
}

async expectPrealertaCreada(): Promise<void> {
await expect(this.successAlert).toHaveText(
    /prealerta creada satisfactoriamente/i
);
}
}
