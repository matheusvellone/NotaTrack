import { buildModelIdSchema } from '~/helpers/zod'

const invoiceSchema = {
  id: buildModelIdSchema<'Invoice'>(),
}

export default invoiceSchema
