import { Product } from '~/entities'
import { buildModelIdSchema } from '~/helpers/zod'

const productSchema = {
  id: buildModelIdSchema<Product>(),
}

export default productSchema
