import { ProcessInvoiceOutputProduct, ProcessInvoice } from '../../../types'
import { ProductUnit } from '@prisma/client'
import { openPage, solveCaptcha } from '~/helpers/puppeteer'
import * as cheerio from 'cheerio'
import { DateTime } from 'luxon'
import { isDevelopment } from '~/helpers/env'

const parseUnit = (unit: string | undefined) => {
  if (unit === 'KG') {
    return ProductUnit.KG
  }

  if (unit === 'UN') {
    return ProductUnit.UN
  }

  if (unit === 'BD') {
    return ProductUnit.UN
  }

  throw new Error(`Unknown unit: ${unit}`)
}

// 35250151272474000204651140000786871621468568
const fazenda: ProcessInvoice = async (invoiceAccessKey) => {
  const page = await openPage('https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaPublica.aspx')

  try {
    const invoiceQueryButton = await page.$('#btnNovaConsulta')

    if (invoiceQueryButton) {
      await invoiceQueryButton.click()
      await page.waitForNavigation({ waitUntil: 'networkidle0' })
    }

    await page.locator('#Conteudo_txtChaveAcesso').fill(invoiceAccessKey)

    await solveCaptcha(page, '.g-recaptcha')

    await page.locator('#Conteudo_btnConsultaResumida').click()
    await page.waitForNavigation({ waitUntil: 'networkidle0' })

    const pageContent = await page.content()
    const $ = cheerio.load(pageContent)

    const accessKey = $('.chave').text().replaceAll(/\s+/g, '')
    const storeName = $('#u20').text().trim()
    const storeCNPJ = $('.text:contains("CNPJ:")').text().replace(/CNPJ:\s*/, '').replaceAll(/\D/g, '').trim()
    const emissionDateText = $('strong:contains("Emissão:")').parent().text().match(/Emissão:\s*(.*?)\s+-\s+Via Consumidor/)?.[1]

    if (!emissionDateText) {
      throw new Error('Emission date not found')
    }

    const emissionDate = DateTime.fromFormat(emissionDateText, 'dd/MM/yyyy HH:mm:ss').toJSDate()

    const products: ProcessInvoiceOutputProduct[] = []

    $('#tabResult tr').each((_, el) => {
      const productRaw = $(el)

      const product: ProcessInvoiceOutputProduct = {
        storeCode: productRaw.find('.RCod').text().match(/Código:\s*(\d+)/)?.[1] || '',
        ean: null,
        name: productRaw.find('.txtTit').first().text().trim(),
        unit: parseUnit(productRaw.find('.RUN').text().match(/UN:\s*(.*)/)?.[1]?.trim()),
        quantity: Number(productRaw.find('.Rqtd').text().match(/Qtde.:\s*(.*)/)?.[1]?.replace(',', '.')),
        unitPrice: Math.round(Number(productRaw.find('.RvlUnit').text().match(/Vl. Unit.:\s*(.*)/)?.[1]?.replace(',', '.')) * 100),
        price: Math.round(Number(productRaw.find('td:last').text().match(/Vl. Total\s*(.*)/)?.[1]?.replace(',', '.')) * 100),
        tax: null,
        discount: null,
      }

      products.push(product)
    })

    return {
      accessKey,
      storeCNPJ,
      storeName,
      emissionDate,
      products,
    }
  } catch (error) {
    if (isDevelopment) {
      const screenshotFilename = `error-${DateTime.now().toFormat('yyyy-MM-dd_HH-mm-ss')}-${invoiceAccessKey}`
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

export default fazenda
