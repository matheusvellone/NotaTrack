import { DateTime } from 'luxon'
import { ProcessInvoice } from '../../../types'
import { ProcessInvoiceOutputProduct } from '~/invoiceProvider/types'
import { ProductUnit } from '@prisma/client'
import { openPage, solveCaptcha } from '~/helpers/puppeteer'
import * as cheerio from 'cheerio'
import { Promise } from 'bluebird'

const parseUnit = (unit: string | undefined) => {
  if (unit?.includes('KG')) {
    return ProductUnit.KG
  }

  if (unit?.includes('UN')) {
    return ProductUnit.UN
  }

  if (unit?.includes('GFA')) {
    return ProductUnit.UN
  }

  if (unit?.includes('PCT')) {
    return ProductUnit.UN
  }

  if (unit?.includes('BLD')) {
    return ProductUnit.UN
  }

  throw new Error(`Unknown unit: ${unit}`)
}

// 35250293209765066053590013031990134078741533
const satsp: ProcessInvoice = async (invoiceAccessKey) => {
  const { browser, page } = await openPage('https://satsp.fazenda.sp.gov.br/COMSAT/Public/ConsultaPublica/ConsultaPublicaCfe.aspx')

  try {
    await page.click('#conteudo_txtChaveAcesso')
    await Promise.delay(100)
    await page.locator('#conteudo_txtChaveAcesso').fill(invoiceAccessKey)

    await solveCaptcha(page)

    await page.locator('#conteudo_btnConsultar').click()
    await page.waitForNavigation({ waitUntil: 'networkidle0' })

    const pageContent = await page.content()
    const $ = cheerio.load(pageContent)

    const accessKey = $('#conteudo_lblIdCfe').text().replaceAll(/\s+/g, '')
    const storeName = $('#conteudo_lblNomeFantasiaEmitente').text().trim() || $('#conteudo_lblNomeEmitente').text().trim()
    const storeCNPJ = $('#conteudo_lblCnpjEmitente').text().replaceAll(/\D/g, '')
    const emissionDateText = $('#conteudo_lblDataEmissao').text().trim()
    const emissionDate = DateTime.fromFormat(emissionDateText, 'dd/MM/yyyy - HH:mm:ss').toJSDate()

    const products: Record<string, ProcessInvoiceOutputProduct> = {}

    $('#tableItens tbody tr').each((index, el) => {
      if (index % 2 === 1) {
        return
      }

      const productRaw = $(el)

      const totalTax = Math.abs(Number(productRaw.find('td:nth-child(7)').text().replace('(', '').replace(')', '').replace(',', '.'))) * 100
      const totalDiscount = Math.abs(Number(productRaw.next().find('td').last().text().replaceAll(/\s/g, '').replace(',', '.')) * 100)

      const storeCode = productRaw.find('td:nth-child(2)').text().trim()
      const name = productRaw.find('td:nth-child(3)').text().trim()
      const unit = parseUnit(productRaw.find('td:nth-child(5)').text().trim())
      const unitPrice = Math.round(Number(productRaw.find('td:nth-child(6)').text().trim().replace(',', '.').replace('X', '')) * 100)
      const price = Math.round(Number(productRaw.find('td:nth-child(8)').text().trim().replace(',', '.')) * 100)
      const quantity = Number(productRaw.find('td:nth-child(4)').text().trim().replace(',', '.'))
      const tax = Math.round(totalTax / quantity)
      const discount = Math.round(totalDiscount / quantity)

      if (products[storeCode]) {
        products[storeCode].quantity += quantity
        products[storeCode].tax = Math.round((products[storeCode].tax || 0 + tax) / 2)
        products[storeCode].discount = Math.round((products[storeCode].discount || 0 + discount) / 2)
        products[storeCode].unitPrice = Math.round((products[storeCode].unitPrice + unitPrice) / 2)
        products[storeCode].price = Math.round((products[storeCode].price + price) / 2)
      } else {
        products[storeCode] = {
          storeCode,
          ean: null,
          name,
          unit,
          quantity,
          unitPrice,
          price,
          tax,
          discount,
        }
      }
    })

    return {
      accessKey,
      storeName,
      storeCNPJ,
      emissionDate,
      products: Object.values(products),
    }
  } finally {
    await browser.close()
  }
}

export default satsp
