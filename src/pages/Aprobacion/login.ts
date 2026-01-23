import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../base/BasePage'

export class LoginOlvaBoxPage extends BasePage {
  private readonly loginMlUrl = '/index.php'
  readonly page: Page
  private readonly usuarioInput: Locator
  private readonly passwordInput: Locator
  private readonly ingresarButton: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.usuarioInput = page.locator('#USUARIO2')
    this.passwordInput = page.locator('#PASS2')
    this.ingresarButton = page.getByRole('button', { name: 'Login' })
  }

  // Espera que habra la pagina y este cargada
  async navigate(): Promise<void> {
    await this.navigateTo('/index.php', 'olvabox')
    await this.waitForLoaded()
  }

  //Espera que los campos sean visibles
  async waitForLoaded(): Promise<void> {
    await this.page.waitForSelector('#USUARIO2', { state: 'visible' })
    await this.page.waitForSelector('#PASS2', { state: 'visible' })
  }

  async login(usuario: string, password: string): Promise<void> {
    await this.usuarioInput.fill(usuario)
    await this.page.keyboard.press('Tab')

    await this.passwordInput.fill(password)
    await this.page.keyboard.press('Tab')

    await expect(this.ingresarButton).toBeEnabled()
    await this.ingresarButton.click()
  }
}
