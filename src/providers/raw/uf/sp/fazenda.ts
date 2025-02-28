import { UFData } from '../../types'
import { NFCeProduct } from '~/providers/types'
import { DateTime } from 'luxon'
import { ProductUnit } from '@prisma/client'

const parseUnit = (unit: string | undefined) => {
  if (unit === 'KG') {
    return ProductUnit.KG
  }

  if (unit === 'UN') {
    return ProductUnit.UN
  }

  throw new Error(`Unknown unit: ${unit}`)
}

// 35250151272474000204651140000786871621468568
const fazenda: UFData = {
  url: 'https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaPublica.aspx',
  codeInputSelector: '#Conteudo_txtChaveAcesso',
  confirmSelector: '#Conteudo_btnConsultaResumida',
  parseInvoice: ($) => {
    const accessKey = $('.chave').text().replaceAll(/\s+/g, '')
    const storeName = $('#u20').text().trim()
    const storeCNPJ = $('.text:contains("CNPJ:")').text().replace(/CNPJ:\s*/, '').replaceAll(/\D/g, '').trim()
    const emissionDateText = $('strong:contains("Emissão:")').parent().text().match(/Emissão:\s*(.*?)\s+-\s+Via Consumidor/)?.[1]

    if (!emissionDateText) {
      throw new Error('Emission date not found')
    }

    const emissionDate = DateTime.fromFormat(emissionDateText, 'dd/MM/yyyy HH:mm:ss')

    const products: NFCeProduct[] = []

    $('#tabResult tr').each((_, el) => {
      const productRaw = $(el)

      const product: NFCeProduct = {
        storeCode: productRaw.find('.RCod').text().match(/Código:\s*(\d+)/)?.[1] || '',
        ean: null,
        name: productRaw.find('.txtTit').first().text().trim(),
        unit: parseUnit(productRaw.find('.RUN').text().match(/UN:\s*(.*)/)?.[1]?.trim()),
        quantity: Number(productRaw.find('.Rqtd').text().match(/Qtde.:\s*(.*)/)?.[1]?.replace(',', '.')),
        price: Number(productRaw.find('.RvlUnit').text().match(/Vl. Unit.:\s*(.*)/)?.[1]?.replace(',', '.')) * 100,
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
  },
}

export default fazenda
