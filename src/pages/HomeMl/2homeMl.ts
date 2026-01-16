import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../base/BasePage'

export class Dashboard extends BasePage {
private readonly addWrOption: Locator

constructor(page: Page) {
    super(page)
    this.addWrOption = page.locator('ul.submenu li a:text("Add WR")') 
}

// async navigate(): Promise<void> {
// await this.navigateTo('/jc_home.php', 'olvamiami')
// await this.waitForLoaded()
// }

async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded')
}
async abrirMenuWarehouse(): Promise<void> {
    await this.page.getByRole('link', { name: ' Warehouse ' }).click();
}
async clickAddWr(): Promise<void> {
    await this.addWrOption.click();
}
}