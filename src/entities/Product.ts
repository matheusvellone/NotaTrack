import type { Product as ProductPrisma } from '@prisma/client'
import type { ID } from '~/helpers/types'

export type Product = ProductPrisma & {
  id: ID<Product>
}
