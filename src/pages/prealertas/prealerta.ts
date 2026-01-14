import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../base/BasePage'

export class PreAlerta extends BasePage {
  private readonly prealertasUrl = '/prealertas'

  private readonly btnCrear: Locator
  private readonly successAlert: Locator
  private readonly preAlertaOption: Locator

  constructor(page: Page) {
    super(page)

    this.btnCrear = page.getByRole('link', { name: /crear/i })
    this.successAlert = page.getByRole('alert')
    this.preAlertaOption = this.page.locator('a:has-text("Prealerta tu compra")')
  }

  async goToPreAlertaOption(): Promise<void> {
    await this.preAlertaOption.click()
  }

  async navigate(): Promise<void> {
    await this.navigateTo(this.prealertasUrl)
    await this.waitForLoaded()
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.btnCrear).toBeVisible()
    await expect(this.btnCrear).toBeEnabled()
  }

  async clickCrear(): Promise<void> {
    await this.btnCrear.click()
  }

  async expectPrealertaCreada(): Promise<void> {
    await expect(this.successAlert).toHaveText(/prealerta creada satisfactoriamente/i)
  }
}
