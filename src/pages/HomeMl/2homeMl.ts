import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../base/BasePage'

export class Dashboard extends BasePage {
private readonly homeMl = 'jc_home.php'

private readonly menuWr: Locator
private readonly addWr: Locator

constructor(page: Page) {
super(page)

this.menuWr = page.getByRole('link', { name: /Warehouse/i });
this.addWr = page.getByRole('link', { name: 'Add WR' });
}

async navigate(): Promise<void> {
await this.navigateTo('jc_home.php', 'olvamiami')
await this.waitForLoaded()
}

async waitForLoaded(): Promise<void> {
await expect(this.menuWr).toBeVisible()
}

async clickAddWr(): Promise<void> {
await this.addWr.click();
}
}