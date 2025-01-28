import type { Store as StorePrisma } from '@prisma/client'
import type { CNPJ, ID } from '~/helpers/types'

export type Store = StorePrisma & {
  id: ID<Store>
  cnpj: CNPJ
}
