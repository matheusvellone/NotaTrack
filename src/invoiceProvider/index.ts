import { ImportInvoiceInput } from './types'
import { UF } from '~/helpers/uf'
import uf from './uf'

export { default as processInvoice } from './process'

export const importInvoicesFromUF = (input: ImportInvoiceInput, ufName: UF) => {
  const selectedUf = uf[ufName]

  if (!selectedUf) {
    throw new Error('Unsupported UF')
  }

  const { importInvoices } = selectedUf

  if (!importInvoices) {
    throw new Error('Importing invoices is not supported for this UF')
  }

  return importInvoices(input)
}
