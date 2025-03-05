import { Store } from '~/entities'
import { buildModelIdSchema } from '~/helpers/zod'

const storeSchema = {
  id: buildModelIdSchema<Store>(),
}

export default storeSchema
