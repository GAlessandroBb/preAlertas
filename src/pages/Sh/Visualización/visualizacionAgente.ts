//login ML, bienvenida,
import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../../base/BasePage'

export class olvaBoxHomeVisualizacion extends BasePage {
  private readonly shipment: Locator
  private readonly shipmentUrl = '/jc2_SS_Shipment.php'
  //login ml, bienvenida ml.
  constructor(page: Page) {
    super(page)
    this.shipment = page.getByRole('link', { name: 'Shipment' })
  }

  async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded')
  }

  async shipmentClick(): Promise<void> {
    await this.shipment.click()
  }

  async navigate(): Promise<void> {
    await this.navigateTo(this.shipmentUrl)
    await this.page.waitForLoadState('domcontentloaded')
  }

  // async validateSh(): Promise<void> {

  // }
}
