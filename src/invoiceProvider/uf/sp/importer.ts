import { openPage, solveCaptcha } from '~/helpers/puppeteer'
import * as cheerio from 'cheerio'
import { ImportInvoice } from '~/invoiceProvider/types'
import { isDevelopment } from '~/helpers/env'
import { DateTime } from 'luxon'
import { InvoiceAccessKey } from '~/helpers/types'
import { invoiceAccessKeySchema } from '~/helpers/zod'

const importInvoices: ImportInvoice = async (input) => {
  const page = await openPage('https://www.nfp.fazenda.sp.gov.br/Inicio.aspx')

  try {
    const isLoggingIn = page.url().includes('login.aspx')
    if (isLoggingIn) {
      // TODO: if username is a valid CNPJ, change to CNPJ login
      await page.locator('#UserName').fill(input.username)
      await page.locator('#Password').fill(input.password)

      // Login page
      await solveCaptcha(page, '.g-recaptcha')
      await page.locator('#btnLogin').click()
      await page.waitForNavigation({ waitUntil: 'networkidle0' })
    }

    // Date range select page
    await solveCaptcha(page, '.g-recaptcha')
    await page.locator('#btnConsultarNFSemestre').click()
    await page.waitForNavigation({ waitUntil: 'networkidle0' })

    const firstLink = await page.$('#gdvConsulta tbody tr:nth-child(2) a')

    if (!firstLink) {
      throw new Error('Could not find first link')
    }

    const firstLinkOnClick = await firstLink.evaluate((el) => el.getAttribute('onclick'))

    if (!firstLinkOnClick) {
      // Click to trigger confirmation modal
      await Promise.all([
        page.click('#gdvConsulta tbody tr:nth-child(2) a'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
      ])

      // Wait for code input
      await page.waitForNavigation({ timeout: 0, waitUntil: 'networkidle0' })

      const error = await page.$('#lblErroA2F')
      if (error) {
        const errorText = await error.evaluate(el => el.textContent) || 'Erro ao confirmar código'
        throw new Error(errorText)
      }

      // Wait for page load after closing modal
      await Promise.all([
        page.click('.ui-dialog > .ui-dialog-buttonpane > .ui-dialog-buttonset > button'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
      ])
    }

    const invoices: InvoiceAccessKey[] = []

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

        invoices.push(invoiceAccessKeySchema.parse(accessKey))
      })

      const nextPageButton = await page.$('#lkBtnProxima')

      if (nextPageButton) {
        await nextPageButton.click()
        await page.waitForNavigation()
      }

      processPage = !!nextPageButton
    }

    return invoices
  } catch (error) {
    if (isDevelopment) {
      const screenshotFilename = `error-${DateTime.now().toFormat('yyyy-MM-dd_HH-mm-ss')}-import-sp`
      await page.screenshot({
        fullPage: true,
        path: `screenshots/${screenshotFilename}.png`,
      })
    }

    throw error
  } finally {
    await page.close()
  }
}

export default importInvoices
