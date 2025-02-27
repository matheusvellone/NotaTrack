import { InvoiceAccessKey } from '~/helpers/types'
import { NFCeQueryResult } from '../types'
import { CheerioAPI } from 'cheerio'

export type UFData = {
  url: string
  codeInputSelector: string
  confirmSelector: string
  parseInvoice: ($: CheerioAPI) => NFCeQueryResult | Promise<NFCeQueryResult>
}

export type GetUFData = (invoiceAccessKey: InvoiceAccessKey) => UFData
