import { DateTime } from 'luxon'
import { UFData } from '../../types'
import { NFCeProduct } from '~/providers/types'
import { ProductUnit } from '@prisma/client'

const parseUnit = (unit: string | undefined) => {
  if (unit?.includes('KG')) {
    return ProductUnit.KG
  }

  if (unit?.includes('UND')) {
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
const satsp: UFData = {
  url: 'https://satsp.fazenda.sp.gov.br/COMSAT/Public/ConsultaPublica/ConsultaPublicaCfe.aspx',
  codeInputSelector: '#conteudo_txtChaveAcesso',
  confirmSelector: '#conteudo_btnConsultar',
  parseInvoice: ($) => {
    const accessKey = $('#conteudo_lblIdCfe').text().replaceAll(/\s+/g, '')
    const storeName = $('#conteudo_lblNomeFantasiaEmitente').text().trim()
    const storeCNPJ = $('#conteudo_lblCnpjEmitente').text().replaceAll(/\D/g, '')
    const emissionDateText = $('#conteudo_lblDataEmissao').text().trim()
    const emissionDate = DateTime.fromFormat(emissionDateText, 'dd/MM/yyyy - HH:mm:ss')

    const products: Record<string, NFCeProduct> = {}

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
      const price = Number(productRaw.find('td:nth-child(6)').text().trim().replace(',', '.').replace('X', '')) * 100
      const quantity = Number(productRaw.find('td:nth-child(4)').text().trim().replace(',', '.'))
      const tax = totalTax / quantity
      const discount = totalDiscount / quantity

      if (products[storeCode]) {
        products[storeCode].quantity += quantity
        products[storeCode].tax = Math.round((products[storeCode].tax || 0 + tax) / 2)
        products[storeCode].discount = Math.round((products[storeCode].discount || 0 + discount) / 2)
        products[storeCode].price = Math.round((products[storeCode].price + price) / 2)
      } else {
        products[storeCode] = {
          storeCode,
          ean: null,
          name,
          unit,
          quantity,
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
  },
}

export default satsp
