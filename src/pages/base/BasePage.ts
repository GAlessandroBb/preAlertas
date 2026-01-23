import { expect, Locator, Page } from '@playwright/test'
import { environment } from '../../config/environment'

type WaitOptions = Parameters<Locator['waitFor']>[0]
type BaseRoot = 'default' | 'olvamiami' | 'olvabox'

export abstract class BasePage {
  protected readonly page: Page
  protected readonly roots: Record<BaseRoot, string>

  constructor(page: Page) {
    this.page = page
    this.roots = {
      default: environment.baseUrl,
      olvamiami: environment.olvaMiami,
      olvabox: environment.olvaBox
    }
  }

  /**
   * Navega a una ruta relativa o URL absoluta
   */
  public async navigateTo(url: string, base: BaseRoot = 'default'): Promise<void> {
    const root = this.roots[base]
    const fullUrl = url.startsWith('http') ? url : `${root}${url}`

    await this.page.goto(fullUrl, {
      waitUntil: 'domcontentloaded',
      timeout: environment.test.timeout
    })
  }

  /**
   * Espera genérica para apps SPA
   */
  public async waitForPageReady(options?: { useNetworkIdle?: boolean }): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded')

    if (options?.useNetworkIdle) {
      await this.page.waitForLoadState('networkidle', {
        timeout: environment.test.timeout
      })
    }
  }

  /**
   * Espera un elemento (selector o locator)
   */
  public async waitForElement(locator: string | Locator, options?: WaitOptions): Promise<Locator> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator

    await element.waitFor({
      state: options?.state || 'visible',
      timeout: options?.timeout || environment.test.timeout
    })

    return element
  }

  /**
   * Helpers de acciones
   */
  public async clickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator)
    await locator.click()
  }

  public async fillInput(locator: Locator, value: string): Promise<void> {
    await this.waitForElement(locator)
    await locator.fill(value)
  }

  public async typeInput(locator: Locator, value: string): Promise<void> {
    await this.waitForElement(locator)
    await locator.type(value)
  }

  public async clearInput(locator: Locator): Promise<void> {
    await this.waitForElement(locator)
    await locator.fill('')
  }

  /**
   * Assertions
   */
  public async assertElementVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible()
  }

  public async assertElementHidden(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeHidden()
  }

  public async assertElementEnabled(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeEnabled()
  }

  public async assertElementDisabled(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeDisabled()
  }

  public async assertElementContainsText(locator: Locator, expectedText: string, message?: string): Promise<void> {
    await expect(locator, message).toContainText(expectedText)
  }

  public async assertElementHasText(locator: Locator, expectedText: string, message?: string): Promise<void> {
    await expect(locator, message).toHaveText(expectedText)
  }

  public async assertElementHasValue(locator: Locator, expectedValue: string, message?: string): Promise<void> {
    await expect(locator, message).toHaveValue(expectedValue)
  }

  /**
   * URL helpers
   */
  public async waitForUrlToContain(text: string, timeout?: number): Promise<void> {
    await this.page.waitForURL((url) => url.toString().includes(text), { timeout: timeout || environment.test.timeout })
  }

  public async assertUrlContains(text: string, message?: string): Promise<void> {
    await expect(this.page, message).toHaveURL(new RegExp(text))
  }

  /**
   * Text helpers
   */
  public async getElementText(locator: Locator): Promise<string> {
    const txt = await locator.textContent()
    return txt?.trim() || ''
  }

  public async isElementVisible(locator: Locator, timeout = 2000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout })
      return true
    } catch {
      return false
    }
  }

  /**
   * Blur / validaciones
   */
  public async blur(locator: Locator): Promise<void> {
    await this.waitForElement(locator)
    await locator.press('Tab')
  }

  /**
   * Espera corta controlada
   */
  public async shortWait(ms = 300): Promise<void> {
    await this.page.waitForTimeout(ms)
  }
}
