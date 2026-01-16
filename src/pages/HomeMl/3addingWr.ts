import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../base/BasePage'

export class wareHouse extends BasePage {
  private readonly btnAddWr: Locator

  constructor(page: Page) {
    super(page)

    this.btnAddWr = page.getByRole('link', { name: 'New WR' })
  }

  async navigate(): Promise<void> {
    await this.navigateTo('/jc_new_wh.php', 'olvamiami')
    await this.waitForLoaded()
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.btnAddWr).toBeVisible()
  }

  async clickBtnAddWr(): Promise<void> {
    await this.btnAddWr.click()
  }
}
