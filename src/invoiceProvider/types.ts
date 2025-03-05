import { ProductUnit } from '@prisma/client'
import { InvoiceAccessKey } from '~/helpers/types'

export type ProcessInvoiceOutputProduct = {
  storeCode: string
  ean: string | null
  name: string
  unit: ProductUnit
  quantity: number
  price: number
  unitPrice: number
  tax: number | null
  discount: number | null
}

export type ProcessInvoiceOutput = {
  accessKey: string
  storeCNPJ: string
  storeName: string
  emissionDate: Date
  products: ProcessInvoiceOutputProduct[]
}

export type ProcessInvoice = (accessKey: InvoiceAccessKey) => ProcessInvoiceOutput | Promise<ProcessInvoiceOutput>

export type ImportInvoiceInput = {
  username: string
  password: string
}

export type ImportInvoice = (input: ImportInvoiceInput) => Promise<string[]>
