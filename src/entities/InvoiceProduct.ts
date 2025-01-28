import type { InvoiceProduct as InvoiceProductPrisma } from '@prisma/client'
import { ID } from '~/helpers/types'
import { Invoice } from './Invoice'
import { Product } from './Product'

export type InvoiceProduct = InvoiceProductPrisma & {
  id: ID<InvoiceProduct>
  invoiceId: Invoice['id']
  productId: Product['id']
}
