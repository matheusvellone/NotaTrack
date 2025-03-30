import { publicProcedure } from '../trpc'
import db from '~/database/index'
import ModelNotFoundError from '~/Errors/trpc/ModelNotFoundError'
import productSchema from '~/schemas/product'

export const list = publicProcedure
  .query(() => {
    return db.query.productTable.findMany()
  })

export const show = publicProcedure
  .input(productSchema.id)
  .query(async ({ input }) => {
    const product = await db.query.productTable.findFirst({
      where: (fields, { eq }) => {
        return eq(fields.id, input)
      },
      with: {
        invoiceProducts: {
          with: {
            invoice: true,
          },
        },
      },
    })

    if (!product) {
      throw new ModelNotFoundError('Product')
    }

    return product
  })
