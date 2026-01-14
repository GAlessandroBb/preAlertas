import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../base/BasePage'

export class LoginPage extends BasePage {
  private readonly loginUrl = ''

  private readonly emailInput: Locator
  private readonly passwordInput: Locator
  private readonly ingresarButton: Locator

  constructor(page: Page) {
    super(page)

    this.emailInput = page.locator('#email')
    this.passwordInput = page.locator('#password')
    this.ingresarButton = page.locator('#btnIngresar')
  }

  // Espera que habra la pagina y este cargada
  async navigate(): Promise<void> {
    await this.navigateTo(this.loginUrl)
    await this.waitForLoaded()
  }

  //Espera que los campos sean visibles
  async waitForLoaded(): Promise<void> {
    await expect(this.emailInput).toBeVisible()
    await expect(this.passwordInput).toBeVisible()
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email)
    await this.page.keyboard.press('Tab')

    await this.passwordInput.fill(password)
    await this.page.keyboard.press('Tab')

    await expect(this.ingresarButton).toBeEnabled()
    await this.ingresarButton.click()
  }
}
