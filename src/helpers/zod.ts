import { z, ZodType } from 'zod'
import { CNPJ, CPF, ID, InvoiceAccessKey } from './types'
import { cpf, cnpj } from 'cpf-cnpj-validator'
import { ModelName } from '~/database/schema'

export const buildModelIdSchema = <Model extends ModelName>() => {
  return z.number().min(1) as unknown as ZodType<ID<Model>>
}

export const nfeAccessKeySchema = z.custom<InvoiceAccessKey>((value) => {
  if (typeof value !== 'string') {
    return false
  }

  return value.match(/\d{44}/)
})

export const cpfRule = z.custom<CPF>((value) => {
  if (typeof value !== 'string') {
    return false
  }

  return cpf.isValid(value, true)
}, 'CPF inválido')

export const cnpjRule = z.custom<CNPJ>((value) => {
  if (typeof value !== 'string') {
    return false
  }

  return cnpj.isValid(value, true)
}, 'CNPJ inválido')

export const documentNumberRule = z.custom<CPF | CNPJ>((value) => {
  if (typeof value !== 'string') {
    return false
  }

  if (value.length === 11) {
    return cpf.isValid(value, true)
  }

  if (value.length === 14) {
    return cnpj.isValid(value, true)
  }

  return false
}, (input) => {
  let message = 'Documento inválido'

  if (typeof input === 'string') {
    if (input.length === 11) {
      message = 'CPF inválido'
    }

    if (input.length === 14) {
      message = 'CNPJ inválido'
    }
  } else {
    message = 'O documento deve ser uma string'
  }

  return {
    message,
  }
})
