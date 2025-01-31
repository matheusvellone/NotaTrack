import { ProductUnit } from '@prisma/client'
import { InvoiceAccessKey } from '~/helpers/types'

type Product = {
  code: string
  name: string
  unit: ProductUnit
  quantity: number
  value: number
  taxValue: number
  unitComercialValue: number
}

export type NFCeQueryResult = {
  accessKey: InvoiceAccessKey
  storeCNPJ: string
  storeName: string
  emittedAt: Date
  products: Product[]
}

export type Query = (accessKey: InvoiceAccessKey) => NFCeQueryResult | Promise<NFCeQueryResult>
