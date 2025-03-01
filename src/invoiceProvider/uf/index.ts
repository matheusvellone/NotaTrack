import { UF } from '~/helpers/uf'
import sp from './sp'
import { ImportInvoice, ProcessInvoice } from '../types'

type UFData = Partial<Record<UF, {
  processInvoice?: ProcessInvoice
  importInvoices?: ImportInvoice
}>>

const uf: UFData = {
  sp,
}

export default uf
