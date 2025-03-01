import { ProcessInvoice } from '../../../types'

import fazenda from './fazenda'
import satsp from './satsp'

const processInvoice: ProcessInvoice = (invoiceAccessKey) => {
  if (invoiceAccessKey.slice(20, 22) === '59') {
    return satsp(invoiceAccessKey)
  }

  return fazenda(invoiceAccessKey)
}

export default processInvoice
