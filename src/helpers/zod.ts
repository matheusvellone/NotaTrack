import { z, ZodType } from 'zod'
import { CNPJ, CPF, ID, InvoiceAccessKey } from './types'
import { cpf, cnpj } from 'cpf-cnpj-validator'
import { ModelName } from '~/database/schema'

export const buildModelIdSchema = <Model extends ModelName>() => {
  return z.number().min(1) as unknown as ZodType<ID<Model>>
}

export const invoiceAccessKeySchema = z.custom<InvoiceAccessKey>((value) => {
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
