import { customType, integer } from 'drizzle-orm/pg-core'
import { CNPJ, ID, InvoiceAccessKey } from '~/helpers/types'
import { ModelName } from './schema'

export const cnpj = customType<{ data: CNPJ }>({
  dataType() {
    return 'varchar(14)'
  },
})

export const nfeAccessKey = customType<{ data: InvoiceAccessKey }>({
  dataType() {
    return 'varchar(44)'
  },
})

export const id = <T extends ModelName>() => integer()
  .$type<ID<T>>()
  .primaryKey()
  .generatedAlwaysAsIdentity()
