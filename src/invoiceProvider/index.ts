import { ImportInvoiceInput } from './types'
import { UF } from '~/helpers/uf'
import uf from './uf'
import ApplicationError from '~/Errors/trpc/ApplicationError'

export { default as processInvoice } from './process'

export const importInvoicesFromUF = (input: ImportInvoiceInput, ufName: UF) => {
  const selectedUf = uf[ufName]

  if (!selectedUf) {
    throw new ApplicationError('unsupported.uf')
  }

  const { importInvoices } = selectedUf

  if (!importInvoices) {
    throw new ApplicationError('unsupported.uf.import')
  }

  return importInvoices(input)
}
