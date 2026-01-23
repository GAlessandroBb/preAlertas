import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../../base/BasePage'

export class check extends BasePage {

    constructor(page: Page) {
    super(page)

    }

    async navigate(): Promise<void> {
    await this.navigateTo('/jc2_addWH1_2019fin.php?id=246', 'olvamiami')
    await this.waitForLoaded()
    }

    async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded')
    }
}

