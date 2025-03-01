// Helper functions for strings

import { DocumentNumber } from './types'
import { cnpjRule, cpfRule } from './zod'

export const randomId = () => Math.random().toString(36).slice(2)

export const pluralize = (count: number, singular: string, plural = `${singular}s`) => {
  return count === 1 ? singular : plural
}

export const formatDocumentNumber = (document: DocumentNumber) => {
  const {
    success: isCPF,
    data: cpf,
  } = cpfRule.safeParse(document)
  if (isCPF) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3‑$4')
  }

  const {
    success: isCNPJ,
    data: cnpj,
  } = cnpjRule.safeParse(document)
  if (isCNPJ) {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4‑$5')
  }

  throw new Error(`Invalid document number: ${document}`)
}
