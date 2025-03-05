import { InvoiceAccessKey } from '~/helpers/types'
import { UF } from '~/helpers/uf'
import uf from './uf'
import { z } from 'zod'
import { cnpjRule, nfeAccessKeySchema } from '~/helpers/zod'
import { ProductUnit } from '@prisma/client'
import logger from '~/helpers/logger'

type UFMapping = Partial<Record<string, UF>>

const ufMapping: UFMapping = {
  // 11: 'ro',
  // 12: 'ac',
  // 13: 'am',
  // 14: 'rr',
  // 15: 'pa',
  // 16: 'ap',
  // 17: 'to',
  // 21: 'ma',
  // 22: 'pi',
  // 23: 'ce',
  // 24: 'rn',
  // 25: 'pb',
  // 26: 'pe',
  // 27: 'al',
  // 28: 'se',
  // 29: 'ba',
  // 31: 'mg',
  // 32: 'es',
  // 33: 'rj',
  35: 'sp',
  // 41: 'pr',
  // 42: 'sc',
  // 43: 'rs',
  // 50: 'ms',
  // 51: 'mt',
  // 52: 'go',
  // 53: 'df',
}

const resolveInvoiceAccessKeyUF = (invoiceAccessKey: InvoiceAccessKey) => {
  // const innerCode = invoiceAccessKey.slice(20, 22)
  // if (nfCode === '55'){
  //   return 'BR'
  // }

  const ufCode = invoiceAccessKey.slice(0, 2)
  const ufData = ufMapping[ufCode]

  if (!ufData) {
    throw new Error('Invalid UF code')
  }

  return ufData
}

const schema = z.object({
  accessKey: nfeAccessKeySchema,
  storeCNPJ: cnpjRule,
  storeName: z.string().min(1),
  emissionDate: z.date(),
  products: z.array(z.object({
    storeCode: z.string().min(1),
    ean: z.string().nullable(),
    name: z.string().min(1),
    unit: z.nativeEnum(ProductUnit),
    quantity: z.number().positive(),
    price: z.number().int().positive(),
    unitPrice: z.number().int().positive(),
    tax: z.number().int().nullable(),
    discount: z.number().int().nullable(),
  })).min(1),
})

const processInvoice = async (chaveAcessoNFCe: InvoiceAccessKey) => {
  const ufName = resolveInvoiceAccessKeyUF(chaveAcessoNFCe)

  const ufData = uf[ufName]

  if (!ufData) {
    throw new Error(`Unsupported UF: ${ufName}`)
  }

  const { processInvoice } = ufData

  if (!processInvoice) {
    throw new Error(`ProcessInvoice not implemented for UF: ${ufName}`)
  }

  const content = await processInvoice(chaveAcessoNFCe)

  const { error, data } = schema.safeParse(content)

  if (error) {
    logger.error({
      content,
      error: error.issues,
    }, 'Invoice processed')

    throw new Error('Invalid invoice content')
  }

  return data
}

export default processInvoice
