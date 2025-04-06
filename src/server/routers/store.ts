import { publicProcedure } from '../trpc'
import db from '~/database/index'
import ModelNotFoundError from '~/Errors/trpc/ModelNotFoundError'
import storeSchema from '~/schemas/store'

export const list = publicProcedure
  .query(() => {
    return db.query.storeTable.findMany()
  })

export const show = publicProcedure
  .input(storeSchema.id)
  .query(async ({ input }) => {
    const store = await db.query.storeTable.findFirst({
      where: (fields, { eq }) => {
        return eq(fields.id, input)
      },
    })

    if (!store) {
      throw new ModelNotFoundError('Store')
    }

    return store
  })
