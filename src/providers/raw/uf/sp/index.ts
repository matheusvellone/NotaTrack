import { GetUFData } from '../../types'

import fazenda from './fazenda'
import satsp from './satsp'

const getSpUfData: GetUFData = (invoiceAccessKey) => {
  if (invoiceAccessKey.slice(20, 22) === '59') {
    return satsp
  }

  return fazenda
}

export default getSpUfData
