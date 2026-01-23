import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../../base/BasePage'

export class comprobantePendiente extends BasePage {
    private readonly comprobante = '/withoutDocumentation'
    private readonly dashboard = '/dashboard'

    private readonly solicitaList: Locator
    private readonly optionComprobante: Locator
    private readonly btnAgregarFactura: Locator
    private readonly agregarFactura: Locator
    private readonly fob: Locator
    private readonly guardar: Locator
    private readonly verifyText: Locator

    constructor(page: Page) {
        super(page)

        this.solicitaList = page.getByRole('link', { name: ' Solicita tu Envio' })
        this.optionComprobante = page.getByRole('link', { name: ' Comprobante pendiente' })
        this.btnAgregarFactura = page.getByTitle('Adjuntar Factura').first()
        this.agregarFactura = page.getByRole('button', { name: 'Favor adjuntar la factura' })
        this.fob = page.locator('#valor_fov')
        this.guardar = page.getByRole('button', { name: 'Guardar' })
        this.verifyText = page.getByText('Factura Adjuntada satisfactoriamente.')
    }

    async goToSolicitaList(): Promise<void> {
        await this.solicitaList.click()
        await this.waitForLoaded()
    }

    async waitForLoaded(): Promise<void> {
        await expect(this.optionComprobante).toBeVisible()
        await this.optionComprobante.click()
    }

    async navigateDashboard(): Promise<void> {
        await this.navigateTo(this.dashboard)
    }
    async navigate(): Promise<void> {
        await this.navigateTo(this.comprobante)
        await this.page.waitForLoadState('domcontentloaded')
    }

    async agregarFac(): Promise<void> {
        await this.btnAgregarFactura.click()
        await expect(this.agregarFactura).toBeVisible()
        await this.agregarFactura.click()
        await this.agregarFactura.setInputFiles('../../../testData/comprobantes/comprobante.pdf')
        await this.fob.click()
        await this.fob.fill('150')
        await this.guardar.click()
    }

    async verificacion(): Promise<void> {
        await this.verifyText.isVisible()
    }

    

}
