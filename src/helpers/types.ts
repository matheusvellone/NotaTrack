import { ModelName } from "~/database/schema"

declare const _brand: unique symbol

export type CPF = string & { [_brand]: 'cpf' }
export type CNPJ = string & { [_brand]: 'cnpj' }

export type DocumentNumber = CPF | CNPJ

export type ID<Model extends ModelName> = number & { [_brand]: Model }

export type InvoiceAccessKey = string & { [_brand]: 'InvoiceAccessKey' }

export const assertNever = (value: never) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`Unexpected value ${value}`)
}
