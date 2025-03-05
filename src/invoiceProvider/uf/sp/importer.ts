import { openPage, solveCaptcha } from '~/helpers/puppeteer'
import * as cheerio from 'cheerio'
import { ImportInvoice } from '~/invoiceProvider/types'

const importInvoices: ImportInvoice = async (input) => {
  const { browser, page } = await openPage('https://www.nfp.fazenda.sp.gov.br/login.aspx?ReturnUrl=%2fInicio.aspx')

  try {
    // TODO: if username is a valid CNPJ, change to CNPJ login
    await page.locator('#UserName').fill(input.username)
    await page.locator('#Password').fill(input.password)

    // Login page
    await solveCaptcha(page)
    await page.locator('#btnLogin').click()
    await page.waitForNavigation({ waitUntil: 'networkidle0' })

    // Date range select page
    await solveCaptcha(page)
    await page.locator('#btnConsultarNFSemestre').click()
    await page.waitForNavigation({ waitUntil: 'networkidle0' })

    const firstLink = await page.$('#gdvConsulta tbody tr:nth-child(2) a')

    if (!firstLink) {
      throw new Error('Could not find first link')
    }

    const firstLinkOnClick = await firstLink.evaluate((el) => el.getAttribute('onclick'))

    if (!firstLinkOnClick) {
      await page.click('#gdvConsulta tbody tr:nth-child(2) a')
      // Confirmation modal open
      await page.waitForNavigation()
      // Confirmation code input
      await page.waitForNavigation({ timeout: 0 })
      // Modal closed
      await page.waitForNavigation({ timeout: 0 })
    }

    const invoices: string[] = []

    let processPage = true
    while (processPage) {
      const pageContent = await page.content()
      const $ = cheerio.load(pageContent)

      $('#gdvConsulta tbody tr:not(:first):not(:last)').each((_, element) => {
        const onclick = $(element).find('a').attr('onclick') || ''

        const urlBase64 = onclick.match(/window.atob\('(.*?)'\)/)?.[1]

        if (!urlBase64) {
          throw new Error("'window.atob' value not found")
        }

        const url = atob(urlBase64)
        const accessKey = url.match(/(\d{44})/)?.[1]

        if (!accessKey) {
          throw new Error('Access key not found')
        }

        invoices.push(accessKey)
      })

      const nextPageButton = await page.$('#lkBtnProxima')

      if (nextPageButton) {
        await nextPageButton.click()
        await page.waitForNavigation()
      }

      processPage = !!nextPageButton
    }

    return invoices
  } finally {
    await browser.close()
  }
}

export default importInvoices
