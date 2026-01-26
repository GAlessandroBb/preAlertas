import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../../base/BasePage'

export class Consolidate extends BasePage {
  private readonly consolidate = '/consolidate'

  private readonly destinatarioList: Locator
  private readonly optionEntrega: Locator
  private readonly optionReembalaje: Locator
  private readonly optionSeguro: Locator
  private readonly btnSolicitarEnvio: Locator
  private readonly verifyText: Locator
  private readonly idSh: Locator

  constructor(page: Page) {
    super(page)

    this.destinatarioList = page.getByLabel('Selecciona un destinatario');
    this.optionEntrega = page.locator('#dest_entrega');
    this.optionReembalaje = page.locator('#reempaque')
    this.optionSeguro = page.locator('#requiereSeguro')


    this.btnSolicitarEnvio = page.getByRole('button', { name: 'Solicitar Envio' })

    this.verifyText = page.locator('div.alert.alert-success.mt-3')
    this.idSh = page.locator('h1.font-weight-bold')
  }

  async navigate(): Promise<void> {
    await this.navigateTo(this.consolidate, 'default')
    await this.page.waitForLoadState('domcontentloaded')
  }

  async selectOptions(): Promise<void> {
    await this.destinatarioList.selectOption({ value: '45' })
    await this.optionEntrega.selectOption({ value: '1' })
    await this.optionReembalaje.selectOption({ index: 1 })
    await this.optionSeguro.selectOption({ index: 2 })
  }

  async enviarSolicitud(): Promise<void> {
    await this.btnSolicitarEnvio.click()
  }

  async verificarMensajeExitoso(): Promise<string> {
    await expect(this.verifyText).toBeVisible()

    const idShText = await this.idSh.textContent()

    return idShText as string
  }
}
