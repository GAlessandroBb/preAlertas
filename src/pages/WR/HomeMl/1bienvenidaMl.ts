import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../../base/BasePage'

export class Bienvenida extends BasePage {
  private readonly btnPc: Locator

  constructor(page: Page) {
    super(page)

    this.btnPc = page.getByRole('link', { name: 'Versión PC' })
  }

  async navigate(): Promise<void> {
    await this.navigateTo('/bienvenida.php', 'olvamiami')
    await this.waitForLoaded()
  }

  async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded')
  }

  async clickVersionPc(): Promise<void> {
    await this.btnPc.click()
  }
}
