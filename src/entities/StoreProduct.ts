import type { StoreProduct as StoreProductPrisma } from '@prisma/client'
import { Store } from './Store'
import { Product } from './Product'

export type StoreProduct = StoreProductPrisma & {
  storeId: Store['id']
  productId: Product['id']
}
