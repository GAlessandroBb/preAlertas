import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../../base/BasePage'

export class SolicitudEnvio extends BasePage {
    private readonly SolicitudEnvio = '/wrs'

    private readonly solicitaList: Locator
    private readonly optionSolicitarEnvio: Locator
    private readonly btnSolicitar: Locator
    private readonly tblWrTable: Locator
    private readonly tbodyWrTable: Locator
    private readonly trFirstRow: Locator
    private readonly tdFirstCell: Locator
    private readonly checkboxFirstRow: Locator
    private readonly modalFob: Locator
    private readonly aceptarFob: Locator

    constructor(page: Page) {
        super(page)

        this.solicitaList = page.getByRole('link', { name: ' Solicita tu Envio' })
        this.optionSolicitarEnvio = page.getByRole('link', { name: ' Solicitud de envío' })
        this.btnSolicitar = page.getByRole('button', { name: 'Solicitar Envio' })
        this.tblWrTable = page.locator('#wrTable')
        this.modalFob = page.locator('.swal2-actions')
        this.aceptarFob = page.getByRole('button', { name: 'Acepto' })

        this.tbodyWrTable = this.tblWrTable.locator('tbody')
        this.trFirstRow = this.tbodyWrTable.locator('tr').first()
        this.tdFirstCell = this.trFirstRow.locator('td').first()
        this.checkboxFirstRow = this.tdFirstCell.locator('input[type="checkbox"]')
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

    async chooseWrByTracking(trackingObjetivo: string): Promise<void> {
        const searchInput = this.page.locator('#wrTable_filter input[type="search"]')
        await searchInput.fill(trackingObjetivo)

        await this.page.waitForTimeout(500)

        const clicked: boolean = await this.seleccionarCheckboxPorTexto(trackingObjetivo)

        if (!clicked) {
        throw new Error('Checkbox no encontrado después de filtrar por tracking')
        }
    }


    async seleccionarCheckboxPorTexto(tracking: string): Promise<boolean> {
        const fila = this.tbodyWrTable.locator('tr').filter({
        hasText: new RegExp(`\\b${tracking.trim()}\\b`, 'i')
        })

        try {
        await fila.waitFor({ state: 'visible', timeout: 5000 })
        const selectorCheck = fila.locator('td').first().locator('label')

        if ((await selectorCheck.count()) > 0) {
            await selectorCheck.click()
        } else {
            await fila.locator('input[type="checkbox"]').click({ force: true })
        }

        return true
        } catch (_e) {
        console.log(`DEBUG: No se encontró la fila con tracking: ${tracking}`)
        return false
        }
    }

    async checkModalIfFob(): Promise <void>{
        try {
        if (await this.modalFob.isVisible({ timeout: 1000 })) {
            await this.aceptarFob.click()
        }
        } catch{}
    }

    async enviarSolicitud(): Promise<void> {
        await this.btnSolicitar.click()
    }
}
