//login ML, bienvenida,
import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../base/BasePage'

export class olvaBoxHomeShVerification extends BasePage {
  private readonly shVerification: Locator
  private readonly homeUrl = '/jc_home.php'
  private readonly bievenidaUrl = '/bienvenida.php'
  private readonly btnPc: Locator
  private readonly customerService: Locator

  //login ml, bienvenida ml.
  constructor(page: Page) {
    super(page)
    this.shVerification = page.locator('li a', { hasText: 'SH Verification' })
    this.btnPc = page.getByRole('link', { name: 'Versión PC' })
    this.customerService = page.getByRole('link', { name: ' Customer Service ' })
  }

  async navigate(): Promise<void> {
    await this.navigateTo(this.bievenidaUrl, 'olvabox')
    await this.waitForLoaded()
  }

  async clickVersionPcOlvaBox(): Promise<void> {
    await this.btnPc.click()
  }

  async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded')
  }

  async abrirCustomerService(): Promise<void> {
    await this.customerService.click()
  }
  async clickShVerification(): Promise<void> {
    await this.shVerification.click()
  }

  async tiempo(): Promise<void> {
    await this.page.waitForTimeout(5000)
  }
}
