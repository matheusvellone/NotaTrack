import { UF } from '~/helpers/uf'

export type ImportInvoiceLoginInformation = Partial<Record<UF, {
  username: string
  password: string
}>>
export const IMPORT_INVOICE_LOGIN_INFORMATION = 'IMPORT_INVOICE_LOGIN_INFORMATION'
