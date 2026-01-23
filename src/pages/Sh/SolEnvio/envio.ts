import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../../base/BasePage'

export class SolicitudEnvio extends BasePage {
    private readonly SolicitudEnvio = '/wrs'

    private readonly solicitaList: Locator
    private readonly optionSolicitarEnvio: Locator
    private readonly btnSolicitar: Locator
    
    constructor(page: Page) {
        super(page)

        this.solicitaList = page.getByRole('link', { name: ' Solicita tu Envio' })
        this.optionSolicitarEnvio = page.getByRole('link', { name: ' Solicitud de envío' })
        this.btnSolicitar = page.locator('.btnSolicitarEnvio1')
    }

    async goToSolicitaList(): Promise<void> {
        await this.solicitaList.click()
        await this.waitForLoaded()
    }
    async waitForLoaded(): Promise<void> {
        await expect(this.optionSolicitarEnvio).toBeVisible()
    }
    async clickOptionSolicitarEnvio(): Promise<void> {
        await this.optionSolicitarEnvio.click()
    }
    // async navigate(): Promise<void> {
    //     await this.navigateTo(this.SolicitudEnvio)
    //     await this.page.waitForLoadState('domcontentloaded')
    // }

    async chooseWrByTracking(trackingObjetivo: string): Promise<void> {
        const rows = this.page.locator('tbody tr')
        const count = await rows.count()

        for (let i = 0; i < count; i++) {
            const row = rows.nth(i)

            const rowtracking = await row
                .locator('td')
                .nth(4) // columna del tracking
                .innerText()

            if (rowtracking.trim() === trackingObjetivo) {
                await row.locator('input.pqtesMarcado').check()
                return
            }
        }

        throw new Error(`No se encontró ningún WR con tracking: ${trackingObjetivo}`)
    }


    async enviarSolicitud(): Promise<void> {
        await this.btnSolicitar.click()
    }
}