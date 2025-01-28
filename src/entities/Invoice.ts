import type { Invoice as InvoicePrisma } from '@prisma/client'
import type { ID, InvoiceAccessKey } from '~/helpers/types'

export type Invoice = InvoicePrisma & {
  id: ID<Invoice>
  accessKey: InvoiceAccessKey
}
