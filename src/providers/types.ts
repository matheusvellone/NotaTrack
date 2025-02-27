import { ProductUnit } from '@prisma/client'
import { DateTime } from 'luxon'
import { InvoiceAccessKey } from '~/helpers/types'

export type NFCeProduct = {
  storeCode: string
  ean: string | null
  name: string
  unit: ProductUnit
  quantity: number
  price: number
  tax: number | null
  discount: number | null
}

export type NFCeQueryResult = {
  accessKey: string
  storeCNPJ: string
  storeName: string
  emissionDate: DateTime
  products: NFCeProduct[]
}

export type Query = (accessKey: InvoiceAccessKey) => NFCeQueryResult | Promise<NFCeQueryResult>
