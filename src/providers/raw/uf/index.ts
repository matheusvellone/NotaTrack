import { InvoiceAccessKey } from '~/helpers/types'
import { GetUFData, UFData } from '../types'
import sp from './sp'

type UFMapping = Record<string, UFData | GetUFData>

const ufMapping: UFMapping = {
  // 11: ro,
  // 12: ac,
  // 13: am,
  // 14: rr,
  // 15: pa,
  // 16: ap,
  // 17: to,
  // 21: ma,
  // 22: pi,
  // 23: ce,
  // 24: rn,
  // 25: pb,
  // 26: pe,
  // 27: al,
  // 28: se,
  // 29: ba,
  // 31: mg,
  // 32: es,
  // 33: rj,
  35: sp,
  // 41: pr,
  // 42: sc,
  // 43: rs,
  // 50: ms,
  // 51: mt,
  // 52: go,
  // 53: df,
}

const getUfData = (invoiceAccessKey: InvoiceAccessKey) => {
  // const innerCode = invoiceAccessKey.slice(20, 22)
  // if (nfCode === '55'){
  //   return 'BR'
  // }

  const ufCode = invoiceAccessKey.slice(0, 2)
  const ufData = ufMapping[ufCode]

  if (!ufData) {
    throw new Error('Invalid UF code')
  }

  if (typeof ufData === 'function') {
    return ufData(invoiceAccessKey)
  }

  return ufData
}

export default getUfData
