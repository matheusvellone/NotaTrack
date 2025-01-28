import { prisma } from '~/database'
import { publicProcedure } from '../trpc'
import { Product } from '~/entities'
import { buildModelIdSchema } from '~/helpers/zod'

const idRule = buildModelIdSchema<Product>()

export const list = publicProcedure
  .query(() => {
    return prisma.product.findMany()
  })

export const show = publicProcedure
  .input(idRule)
  .query(({ input }) => {
    return prisma.product.findFirstOrThrow({
      where: {
        id: input,
      }
    })
  })
